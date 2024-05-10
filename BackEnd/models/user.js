import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true,
        unique: true,
    },
    email: {
        type: String,
        trim: true,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        trim: true,
        require: true,
        unique: true,
        minlength: 6,
    },
    admin: {
        type: Boolean,
        default: false,
    },
    refresh_token: {
        type: String,
        require: false,
    },
    passwordResetToken: {
        type: String
    },
    passwordResetExpires: {
        type: Date
    },
    phoneNumber:{
        type: String,
    },
    Address: [{
        type:String,
    }],
    Coupon:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Coupon'
    }],
    Favorites:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product"
    }],
    Cart:[{
       product:{ type: mongoose.Schema.Types.ObjectId,
        ref: "Product" },
        size:Number,
        count:Number,
        price:Number,
        img:String,
        name:String,
    }],
    Avatar:{
        type: String,
    },
    Date:{
        type: Date,
    }
},
    { timestamps: true }
)
const User = mongoose.model("User", userSchema);

export default User;