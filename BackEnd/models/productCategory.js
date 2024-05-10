import mongoose from "mongoose";
const productCategorySchema = mongoose.Schema ({
    categoryName: {
        type:String,
        require:true,
        unique:true,
        index:true,
    },
} ,
{
    timestamps: true
});
const productCategory = mongoose.model('productCategory',productCategorySchema)
export default  productCategory