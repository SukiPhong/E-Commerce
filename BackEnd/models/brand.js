import mongoose, { isValidObjectId } from "mongoose";
const brandSchema =  mongoose.Schema({
    brandName:{
        type:String,
        require:true,
        unique:true,
    },
},{
    timestamps:true
})
const brand = mongoose.model('brand',brandSchema)
export default brand