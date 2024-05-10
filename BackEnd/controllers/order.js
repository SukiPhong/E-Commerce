import Order from "../models/order.js";
import User from "../models/user.js";
import Coupon from "../models/coupon.js";
import asyncHandler from "express-async-handler";
const orderController = {
    createOrder: asyncHandler(async (req, res) => {
        const { id } = req.user;
        const { coupon, address, Note } = req.body;
        if (!address)
            throw new Error("Vui lòng cung cấp địa chỉ.");
        const userCart = await User.findById(id).select('Cart').
            populate({ path: 'Cart.product', select: 'price productName' });
        console.log(userCart);
        if (!userCart)
            throw new Error("Không tìm thấy giỏ hàng của người dùng.");
        const products = userCart?.Cart?.map(el => ({
            product: el.product._id,
            count: el.count,
            size: el.size,
        }));
        let totalPrice = userCart?.Cart?.
            reduce((sum, el) => el.product.price * el.count + sum, 0);
        if (coupon) {
            const selectCoupon = await Coupon.findById(coupon);
            if (selectCoupon) {
                totalPrice = Math.round
                    (totalPrice * (1 - +selectCoupon?.discount / 100) / 1000) * 1000 || totalPrice;
            } else {
                throw new Error("Mã giảm giá không hợp lệ.");
            }
        }
        const Data = { products, totalPrice, OrderBy: id, address, Note, coupon };
        const response = await Order.create(Data);
        const populatedResponse = await Order.findById(response._id)
            .populate('products.product', 'price productName').exec();
        return res.json({
            status: true,
            response: populatedResponse,
        });
    }
    ),

    getOrder: asyncHandler(async (req, res) => {
        const { oid } = req.params
        const { id } = req.user
        const response = await Order.findOne({ oid, OrderBy: id });
        return res.json({
            success: response ? true : false,
            response: response ? response : "Error"
        })
    }),
    getByUser: asyncHandler(async (req, res) => {
        const { id } = req.user;
        const response = await Order.find({ OrderBy: id })
        return res.json({
            superuser: response ? true : false,
            response: response ? response : "Error"
        })
    }),
    getByAdmin: asyncHandler(async (req, res) => {
        const response = await Order.find()
        return res.json({
            superuser: response ? true : false,
            response: response ? response : "Error"
        })
    }),
    updateStatus: asyncHandler(async (req, res) => {
        const { oid } = req.params;
        const { status } = req.body;
        const response = await Order.findByIdAndUpdate
            (oid, { status }, { new: true })
        return res.json({
            success: response ? true : false,
            response: response ? response : "false"
        })
    }),
    createOrderCopy: asyncHandler(async (req, res) => {
        const { id } = req.user;
        const { products, coupon, status, Note, address } = req.body;
        if (!products) throw new Error("No products");
        let totalPrice = 0;
        // console.log(Array.isArray(products));  check xem nó có phải là mảng ko
        products.forEach(el => {
            totalPrice += (el.price * +el.count);
        });
        const Data = { products, totalPrice, OrderBy: id, }
        if (address) {
            await User.findByIdAndUpdate(id, { $push: { address } }, { Cart: [] });
            Data.address = address;
        }
        if (coupon) {
            const selectCoupon = await Coupon.findById(coupon)
            totalPrice = Math.round(totalPrice * (1 - +selectCoupon?.discount / 100) * 1000) / 1000 // sao cái này ra 0
            console.log(totalPrice);
            Data.totalPrice = totalPrice,
                Data.coupon = coupon
        }
        if (status) Data.status = status;
        if (Note) Data.Note = Note;
        const response = await Order.create(Data)
        return res.json({
            success: response ? true : false,
            response: response ? response : "false"
        })
    }),
}

export default orderController;