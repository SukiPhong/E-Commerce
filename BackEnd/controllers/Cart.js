import Product from "../models/product.js"
import User from "../models/user.js";
import asyncHandler from "express-async-handler"
const addCart = asyncHandler(async (req, res) => {
    const { id } = req.user;
    const { pid, size, count = 1,price,img,name} = req.body;
   
    const product = await Product.findById(pid)
    const checkSize = product.quantity.map(el => el.size)
    //console.table(product.quantity.map(el => el.numberOfSize ))
    const checkQualityOfSize = product.quantity.find(el => el.size === parseInt(size));
    // check input size have exist in product
    if (!checkSize.includes(parseInt(size))) 
    {  return res.json({ msg: `chỉ có thể ở  ${checkSize}` }) }
    // if passed  CheckSize => CheckQualityOfSize(Size) and  count input != numberOfSize
    if (checkQualityOfSize &&count > checkQualityOfSize.numberOfSize)
     { return res.json({ msg: `Maximum quantity: ${checkQualityOfSize.numberOfSize}` }) }
    //passed check
    const user =  await User.findById(id).select('Cart');
    const alreadyProduct = user.Cart.find(el => el.product.toString() === pid && el.size == size);
    if (alreadyProduct) {
        const response = await User.updateOne(
            { Cart: { $elemMatch: alreadyProduct } },
             { $set: {
                 'Cart.$.count': count,
                  'Cart.$.price': price,
                  'Cart.$.img': img,
                  'Cart.$.name': name}},
            { new: true }
        )
        return res.json({
            status: response ? true : false,
            Cart: response ? response : "Cannot update Cart",
        })
    }
    else {
        const response = await User.findByIdAndUpdate(id,
            { $push: { Cart: { product: pid, size, count,price,img,name} } }
            , { new: true })
        return res.json({
            status: response ? true : false,
            Cart: response ? response : "Cannot add Cart",
        });

    }
})
const deleteCart =asyncHandler(async(req,res)=>{
    const {id} = req.user;
    const {pid,size}= req.params;
    const user =await User.findById(id).select('Cart');
     const alreadyProduct = user.Cart.find(el => el.product.toString() === pid && el.size == size);
     if(!alreadyProduct){
        return res.json({
            status: true,
            msg:"update Cart"
        })
     }
     const response = await User.findByIdAndUpdate(id,
        { $pull: { Cart: { product: pid,size } } }
        , { new: true }).select('Cart');
    return res.json({
        status: response ? true : false,
        DeleteCart: response ? response : "Cannot add Cart",
    });
})
const deleteAllCart =asyncHandler(async(req,res) => {
    const {id}=req.user;
    const response = await User.findByIdAndUpdate(id,
        {$set:{Cart:[]}},{new:true}).select('Cart');
        return res.json({
            status: response ? true : false,
            deleteAllCart: response ? response : "Cannot add Cart",
        });
})
export default {
    addCart,
    deleteCart,
    deleteAllCart
}
