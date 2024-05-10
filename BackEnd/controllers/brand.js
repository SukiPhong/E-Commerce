import brand from "../models/brand.js";
import expressAsyncHandler from "express-async-handler";
const brandController = {
    createBrand: expressAsyncHandler(async (req, res) => {
        const response = await brand.create(req.body)
        return res.json({
            success: response ? true : false,
            createBrand: response ? response : "Cannot Create Brand"
        })
    }),
    getBrand: expressAsyncHandler(async (req, res) => {
        const { bid } = req.params
        const response = await brand.findById(bid)
        return res.status(200).json({
            success: response ? true : false,
            getBrand: response ? response : 'Cannot get brand'
        })
    }),
    getBrands: expressAsyncHandler(async (req, res) => {
        const response = await brand.find()
        return res.json({
            success: response ? true : false,
            Brands: response ? response : "Cannot  get Brand"
        })
    }),
    updateBrand: expressAsyncHandler(async (req, res) => {
        const { bid } = req.params
        const response = await brand.findByIdAndUpdate(bid, req.body, { new: true })
        return res.json({
            success: response ? true : false,
            updateBrand: response ? response : "Cannot Update Brand"
        })
    }),
    deleteBrand: expressAsyncHandler(async (req, res) => {
        const { bid } = req.params
        const response = await brand.findByIdAndDelete(bid)
        return res.json({
            success: response ? true : false,
            deleteBrand: response ? response : "Cannot Delete Brand"
        })
    })
}
export default brandController;