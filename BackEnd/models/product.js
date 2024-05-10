import mongoose from "mongoose";
//import sizeProductSchema from "./sizeProduct.js";
var productSchema = new mongoose.Schema({
    productName: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
    },

    price: {
        type: Number,
        required: true
    },
    brand: {
        type: mongoose.Types.ObjectId,
        ref: 'brand',
    },
    category: {
        type: mongoose.Types.ObjectId,
        ref: 'productCategory',
    },
    
    quantity: [
        {
        size: {
            type: Number,
            
        },
        numberOfSize: {
            type: Number,
         
        }

    }
],
    images: {
        type: Array
    },
    ratings: [
        {
            star: { type: Number },
            postedBy: { type: mongoose.Types.ObjectId, ref: 'User' },
            comment: { type: String },
            dateCMT:{type: Date,default: Date.now()},
            feedback_Image: { type: Array}
        }
    ],
    totalRatings: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

//Export the model
const Product = mongoose.model('Product', productSchema);
export default Product;
