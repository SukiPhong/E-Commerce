import Coupon from "../models/coupon.js";
import asyncHandler from "express-async-handler"
const CouponController = {
    createCoupon: asyncHandler(async (req, res) => {
        const time = 24 * 60 * 60 * 1000; // time = 1d
        const { name, discount,exclusive, expiry } = req.body;
       
        const response = await Coupon.create({
            ...req.body,
            expiry: Date.now() + +expiry * time
        })
        return res.status(200).json({
            success:response ?true:false,
            message: response? "Coupon created successfully" : "Coupon creation failed",
            data: response
        })
    }),
    getCoupon:asyncHandler(async(req,res) => {
        const coupon = await Coupon.find().select("-createdAt -updatedAt")
        return res.status(200).json({
            success:coupon?true:false,
            message: coupon? "Coupon found" : "Coupon not found",
            data: coupon
        })
    }),
    deleteCoupon:asyncHandler(async(req,res) => {
        const {cid}=req.params;
        const response = await Coupon.findByIdAndDelete(cid);
        return res.status(200).json({
            success:response?true:false,
            message: response? "Coupon deleted successfully" : "Coupon deletion failed",
            data: response
        })
    }),

}
export default CouponController
