import {Router  } from "express";
import productCategoryController from "../controllers/productCategory.js"
import  middlewareControllers from "../middleware/middleware.js";

const router = Router();
router.post("/",middlewareControllers.verifyTokenAdminAuth,productCategoryController.createCategory);
router.get("/",productCategoryController.getCategories);
router.get("/:pcid",productCategoryController.getOneCategory);
router.put("/:pcid",middlewareControllers.verifyTokenAdminAuth,productCategoryController.updateCategories);
router.delete("/:pcid",middlewareControllers.verifyTokenAdminAuth,productCategoryController.deleteCategories);
export default router