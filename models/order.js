const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const orderModel = new Schema(
  {
    customer: {
      customerId: {
        type: Schema.Types.ObjectId,
        ref: "Customer",
        required: true,
      },
      customerEmail: { type: String, required: true },
      customerLocation: { type: String, required: false },
      customerNumber: { type: Number, required: true },
    },
    products: [
      {
        product: { type: Object, required: true },
        quantity: { type: Number, required: true },
        amount: { type: Number, required: true },
      },
    ],
    // shop: {
    //   email: {
    //     type: String,
    //     required: true,
    //   },
    //   shopId: {
    //     type: Schema.Types.ObjectId,
    //     required: true,
    //     ref: "Shop",
    //   },
    // },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderModel);
