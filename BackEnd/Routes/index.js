import ProductRouter from "../Routes/product.js";
import UserRouter from "../Routes/user.js";
import productCategoryRouter from "../Routes/productCategory.js";
import brandRouter from "../Routes/brand.js";
import couponRouter from "../Routes/coupon.js";
import orderRouter from "../Routes/order.js";
import {notFound,errHandler} from "../middleware/errorHandler.js";
const initRouters = (app) =>{
    app.use("/product",ProductRouter);
    app.use("/user", UserRouter);
    app.use("/Category", productCategoryRouter);
    app.use("/brand", brandRouter);
    app.use("/coupon", couponRouter);
    app.use("/order", orderRouter);
    app.use(notFound);
    app.use(errHandler)
}
export default initRouters