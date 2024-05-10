import productCategory from "../models/productCategory.js";
import expressAsyncHandler from "express-async-handler";

const productCategoryController = {
    createCategory: expressAsyncHandler(async (req, res) => {
        const response = await productCategory.create(req.body)
        return res.json({
            success: response ? true : false,
            createCategory: response ? response : " Cannot create Category"
        })
    }),
    getOneCategory: expressAsyncHandler(async (req, res) => {
        const { pcid } = req.params
        const response = await productCategory.findById(pcid);
        return res.json({
            success: response ? true : false,
            getOneCategory: response ? response : " Cannot get one category"
        })
    }),
    getCategories: expressAsyncHandler(async (req, res) => {
        const response = await productCategory.find();
        return res.json(
            {
                success: response ? true : false,
                prodCategory: response ? response : "Cannot  get Categories"
            }
        )
    }),
    updateCategories: expressAsyncHandler(async (req, res) => {
        const { pcid } = req.params
        const response = await productCategory.findByIdAndUpdate(pcid, req.body, { new: true })
        return res.json(
            {
                success: response ? true : false,
                updateProcCategory: response ? response : "Cannot  update Categories"
            }
        )
    }),
    deleteCategories: expressAsyncHandler(async (req, res) => {
        const { pcid } = req.params
        const response = await productCategory.findByIdAndDelete(pcid)
        return res.json(
            {
                success: response ? true : false,
                deleteProcCategory: response ? response : "Cannot  delete Categories"
            }
        )
    })
}
export default productCategoryController;