import mongoose from "mongoose"; // Erase if already required

// Declare the Schema of the Mongo model
const OrderSchema = new mongoose.Schema(
  {
    products: [
      {
        product: {
          type: mongoose.Types.ObjectId,
          ref: "Product",
        },
        size: Number,
        count: Number,
        price: Number,
        img: String,
        name: String,
      },
    ],
    totalPrice: {
      type: Number,
    },
    status: {
      type: String,
      default: "Processing",
      enum: ["Cancelled", "Processing", "Shipping", "Success"],
    },
    coupon: {
      type: mongoose.Types.ObjectId,
      ref: "Coupon",
    },
    address: {
      type: String,
    },
    Note: {
      type: String,
    },
    OrderBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

//Export the model
const Order = mongoose.model("Order", OrderSchema);
export default Order;
