import { Router } from "express";
import userControllers from "../controllers/user.js";
import middlewareControllers from "../middleware/middleware.js";
import authControllers from "../controllers/auth.js";
import validator from "../utils/validation.js"
import uploader from "../config/cloudinary.config.js";
import cartControllers from "../controllers/Cart.js";
const router = Router();
/* use lib validation set validate of register and login with 2 func validate[login,Register] and run 
    must add handleValidationError
*/
router.post("/register", validator.validateRegisterUser(), validator.handleValidationErrors, authControllers.registerUser);
router.post("/login", validator.validateLogin(), validator.handleValidationErrors, authControllers.loginUser);
router.get("/", middlewareControllers.verifyToken, userControllers.getallUser);
router.get("/current", middlewareControllers.verifyToken, userControllers.CurrentUser);
router.post("/logout", middlewareControllers.verifyToken,authControllers.logout);
router.post("/forgotPassword", validator.validateForgotPassword(), validator.handleValidationErrors, authControllers.forgotPassword);
router.put("/resetpassword", authControllers.resetPassword)
router.put("/address", middlewareControllers.verifyTokenAdminAuth, userControllers.updateAddress);
router.delete("/address", middlewareControllers.verifyTokenAdminAuth, userControllers.deleteAddress);
router.put("/update", middlewareControllers.verifyToken, uploader.single('Avatar'), userControllers.updateUser);
router.put('/addCoupon', middlewareControllers.verifyTokenAdminAuth, userControllers.addCoupon);
router.put("/Cart", middlewareControllers.verifyToken,cartControllers.addCart);
router.patch('/Cart',middlewareControllers.verifyToken,cartControllers.deleteAllCart);
router.delete("/Cart/:pid/:size", middlewareControllers.verifyToken,cartControllers.deleteCart);
router.put("/update/:id", middlewareControllers.verifyTokenAdminAuth, uploader.single('Avatar') ,userControllers.updateUserByAdmin)
router.put("/favorites/:pid", middlewareControllers.verifyToken, userControllers.Favorites);
router.delete("/:id", middlewareControllers.verifyTokenAdminAuth, userControllers.deleteUserById);
export default router;
//note: verifyTokenAdminAuth   define  req.user.id == req.params.id
