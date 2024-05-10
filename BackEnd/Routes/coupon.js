import {Router  } from "express";
import CouponController from "../controllers/coupon.js"
import  middlewareControllers from "../middleware/middleware.js";

const router = Router();
router.post("/",middlewareControllers.verifyTokenAdminAuth,CouponController.createCoupon);
router.get("/",CouponController.getCoupon);
router.delete("/:cid",middlewareControllers.verifyTokenAdminAuth,CouponController.deleteCoupon);
export default router
