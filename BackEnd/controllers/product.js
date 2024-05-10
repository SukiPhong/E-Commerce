import { response } from "express"
import Product from "../models/product.js"
import asyncHandler from "express-async-handler"
const productController = {
    createProduct: asyncHandler(async (req, res) => {
        const img = req?.files?.img?.map(el => el.path)
        if (img) { req.body.images = img }
        if (Object.keys(req.body).length === 0) throw new Error('Missing inputs')
        const newProduct = await Product.create(req.body)
        return res.status(200).json({
            success: newProduct ? true : false,
            createdProduct: newProduct ? newProduct : 'Cannot create new product'
        })

    }),

    getProduct: asyncHandler(async (req, res) => {
        const { pid } = req.params;
        const product = await Product.findById(pid)
            .populate("brand", "-createdAt -updatedAt")
            .populate('category', '-createdAt -updatedAt')
            .populate('ratings.postedBy', 'username -_id')
            .exec();
        return res.status(200).json({
            success: product ? true : false,
            productData: product ? product : 'Cannot get product'
        });

    }),

    // Filtering, sorting & pagination
    getProducts: asyncHandler(async (req, res) => {

        const queryObj = { ...req.query }
        const excludedFields = ['page', 'sort', 'limit', 'fields']
        excludedFields.forEach(el => delete queryObj[el])
        //format
        let queryString = JSON.stringify(queryObj)
        queryString = queryString.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`)
        let query = JSON.parse(queryString)

        //filtering
        if (queryObj?.title) query.title = { $regex: queryObj.title, $options: 'i' }
        let queryCommand = Product.find(query);

        //sort
        if (req.query.sort) {
            const sortBy = req.query.sort.split(',').join(' ')
            queryCommand = queryCommand.sort(sortBy)
        }

        //Fields
        if (req.query.fields) {
            const fields = req.query.fields.split(',').join(' ')

        }
        //paging
        const page = +req.query.page || 1
        const limit = +req.query.limit || process.env.LIMIT_PRODUCTS
        const skip = (page - 1) * limit
        queryCommand.skip(skip).limit(limit)
        //Exec 
        try {
            const response = await queryCommand.exec();
            const counts = await Product.find(query).countDocuments();
            return res.status(200).json({
                success: response ? true : false,
                productDatas: response ? response : 'Cannot get products',
                counts
            });
        } catch (error) {
            throw new Error(error.message);
        }
    }),
    
    updateProduct: asyncHandler(async (req, res) => {
        const { pid } = req.params
        const img = req?.files?.img?.map(el => el.path);
        if (img) { req.body.images = img }
        const updatedProduct = await Product.findByIdAndUpdate(pid, req.body, { new: true })
        return res.status(200).json({
            success: updatedProduct ? true : false,
            updatedProduct: updatedProduct ? updatedProduct : 'Cannot update product'
        })
    }),

    deleteProduct: asyncHandler(async (req, res) => {
        const { pid } = req.params
        const deletedProduct = await Product.findByIdAndDelete(pid)
        return res.status(200).json({
            success: deletedProduct ? true : false,
            deletedProduct: deletedProduct ? deletedProduct : 'Cannot delete product'
        })
    }),

    uploadImgProduct: asyncHandler(async (req, res) => {
        const { pid } = req.params
        if (!req.files) throw new Error(`missing inputs`);
        const response = await Product.findByIdAndUpdate(pid,
            { $push: { images: { $each: req.files.map(el => el.path) } } }, { new: true })// Can simple   const img = req?.files?.map(el => el.path)  if(img ){req.body.images =img}
        return res.status(200).json({           // req.body.images=req?.files?.map(el => el.path)
            status: response ? true : false,
            updateImgProduct: response ? response : "cannot upload img product "
        })
    }),
    deleteAllProducts: asyncHandler(async (req, res) => {

        const deletedProducts = await Product.deleteMany({});
        return res.status(200).json({
            success: deletedProducts.deletedCount > 0,
            message: deletedProducts.deletedCount > 0
                ? 'All products deleted' : 'No products to delete',
        });
    }),

    Rating: asyncHandler(async (req, res) => {
        const { id } = req.user;
        const img = req?.files.img?.map(el => el.path)
        if (img) { req.body.feedback_Image = img; }
        const { star, comment, pid, feedback_Image } = req.body;
        console.log(feedback_Image);
        if (!star || !pid) throw new Error("Missing input");

        const rating = await Product.findById(pid);
        const CurrentRating = rating?.ratings?.find(el => el.postedBy.toString() === id);
        console.log(CurrentRating);
        if (CurrentRating) {
            await Product.updateOne({
                ratings: { $elemMatch: CurrentRating }
            }, {
                $set: {
                    "ratings.$.star": star,
                    "ratings.$.comment": comment,
                    "ratings.$.feedback_Image": feedback_Image
                }
            },
                { new: true })
        }
        else {
            await Product.findByIdAndUpdate(pid,
                { $push: { ratings: { postedBy: id, star: star, comment: comment, feedback_Image: feedback_Image } } },
                { new: true })
        }
        const response = await Product.findById(pid).populate({
            path: 'ratings.postedBy',
            select: 'username',
        }).exec();
        const RatingCount = response.ratings.length
        const SumRating = response.ratings.reduce((sum, ele) =>
            sum + +ele.star, 0)
        response.totalRatings = Math.round(SumRating * 10 / RatingCount) / 10

        await response.save();
        return res.status(200).json({
            status: true,
            msg: { ratings: response.ratings, totalRatings: response.totalRatings }
        })
    })
}


export default productController
