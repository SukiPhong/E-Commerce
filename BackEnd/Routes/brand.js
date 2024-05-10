import {Router  } from "express";
import brandController from "../controllers/brand.js"
import  middlewareControllers from "../middleware/middleware.js";

const router = Router();
router.post("/",middlewareControllers.verifyTokenAdminAuth,brandController.createBrand);
router.get("/",brandController.getBrands);
router.get("/:bid",brandController.getBrand);
router.put("/:bid",middlewareControllers.verifyTokenAdminAuth,brandController.updateBrand);
router.delete("/:bid",middlewareControllers.verifyTokenAdminAuth,brandController.deleteBrand);

export default router