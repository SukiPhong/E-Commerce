import { Router } from "express";
import productController from "../controllers/product.js";
import middlewareControllers from "../middleware/middleware.js";
import uploader from "../config/cloudinary.config.js";
const router = Router();
var uploadP =uploader.fields(  [{ name:'img',maxCount:10}]);
var uploadI = uploader.fields([{ name:'img',maxCount:3}]);
router.post('/', middlewareControllers.verifyTokenAdminAuth,uploadP, productController.createProduct)
router.get('/', productController.getProducts)
router.post('/rating', middlewareControllers.verifyToken,uploadI,productController.Rating)
router.put('/uploadImg/:pid', middlewareControllers.verifyTokenAdminAuth, uploader.array('img', 10), productController.uploadImgProduct)
router.get('/:pid', productController.getProduct)
router.put('/:pid', middlewareControllers.verifyTokenAdminAuth,
uploader.fields([{name:'img',maxCount:10}]), productController.updateProduct)
router.delete('/:pid', middlewareControllers.verifyTokenAdminAuth, productController.deleteProduct)

export default router