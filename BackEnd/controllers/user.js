import User from "../models/user.js"
import handlePassword from "../utils/hash_password.js"
import Coupon from "../models/coupon.js";
const userControllers = {
    getallUser: async (req, res) => {
        try {
            const user = await User.find();
            res.status(200).json({ user });
        } catch (error) {

            res.status(500).json("Cannot Find")
        }
    },
    deleteUserById: async (req, res) => {
        try {
            const user = await User.findByIdAndDelete(req.params.id);
            res.status(200).json({ message: "xoa thanh cong", user: user });
        } catch (error) {
            res.status(500).json("Cannot Find")
        }
    },
    updateUser: async (req, res) => {
        const { id } = req.user;
        const { email, username, password, phoneNumber, Address, Avatar, Date } = req.body;
        const data = { email, username, password, phoneNumber, Address, Avatar, Date }
        try {
            if (req.body.password) {
                req.body.password = await handlePassword.hashPassword(req.body.password);
            }
            if (req.file) {
                data.Avatar = req.file.path
            }
            const user = await User.findByIdAndUpdate(id, data, { new: true }).select("-password -refreshToken -admin ");
            res.status(200).json({ message: " thanh cong", user: user });
        } catch (error) {
            res.status(500).json("Cannot Find")
        }
    },
     updateUserByAdmin : async (req, res) => {
        const { id } = req.params;
            if (req.body.password) {
                req.body.password = await handlePassword.hashPassword(req.body.password);
            }
            if (req.file) {
                req.body.Avatar = req.file.path
            }
        const response = await User.findByIdAndUpdate(id, req.body, { new: true })
        return res.status(200).json({
            success: response ? true : false,
            updatedUser: response ? response : 'Some thing went wrong'
        })
    },
    CurrentUser: async (req, res) => {
        const { id } = req.user;
        const user = await User.findById(id).select("-password -refreshToken -admin");
        return res.status(200).json({
            success: user ? true : false,
            user: user ? user : 'Not found'
        });
    },
    Favorites: async (req, res) => {
        const { pid } = req.params;
        const { id } = req.user;
        const Check = await User.findById(id)
        const Exist = Check?.Favorites?.find((el) => el.toString() === pid)
        if (Exist) {
            const response = await User.findByIdAndUpdate(
                id,
                { $pull: { Favorites: pid } },
                { new: true }
            )
            return res.status(200).json({
                success: response ? false : true,
                msg: response ? " successfully" : "Failed"
            })
        }
        else {
            const response = await User.findByIdAndUpdate(
                id,
                { $push: { Favorites: pid } },
                { new: true }
            )
            return res.status(200).json({
                success: response ? true : false,
                msg: response ? " successfully" : "Failed"
            })
        }
    },
    updateImgUser: async (req, res) => {
        const { pid } = req.params
        if (!req.files) throw new Error(`missing inputs`);
        const response = await User.findByIdAndUpdate(pid,
            { $push: { images: { $each: req.files.map(el => el.path) } } }, { new: true })
        return res.status(200).json({
            status: response ? true : false,
            updateImgProduct: response ? response : "cannot upload img product "
        })
    },
    updateAddress: async (req, res) => {
        const { id } = req.user
        const location = req.body.address
        const user = await User.findById(id).select("-password -refreshToken -admin");
        // const address = await User.findByIdAndUpdate(id, { $push:{ Address:req.body.address}})
        console.log(user);
        const address = await User.findByIdAndUpdate(
            id,
            { $push: { Address: location } },
            { new: true });
        return res.status(200).json({
            statusbar: address ? true : false,
            Address: address ? address : "cannot update address"
        })
    },
    deleteAddress: async (req, res) => {
        const { id } = req.user;
        const index = req.body.index;
        const user = await User.findById(id);
        if (index < user.Address.length && index >= 0) {
            user.Address.splice(index, 1);
            await user.save();
        }
        return res.status(200).json({
            status: user ? true : false,
            Address: user.Address ? user.Address : "Cannot delete address",
        })
    },
    addCoupon: async (req, res) => {
        const { id } = req.user;
        const {cpid}=req.body;
        // const Coupon = await Coupon.findById(cpid);
        // const expiryCP= Coupon?.expires
         const user = await User.findById(id);
         const ExistsCP =user?.Coupon.find(el=>el.toString()===cpid);
        if(ExistsCP) {
            res.json({
                status: true,
                msg: "Coupon already exists"
            })
        }
        const response =await User.findByIdAndUpdate(
            id,
            { $push: { Coupon: cpid } },
            { new: true }
        )
        return res.status(200).json({
            success: response ? true : false,
            msg: response ? " successfully" : "Failed"
        })
    }
}
export default userControllers;

