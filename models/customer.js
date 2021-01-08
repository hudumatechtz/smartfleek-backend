const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const customerModel = new Schema({
  email: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: false,
  },
  cart: {
    items: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
      },
    ],
  },
});
customerModel.methods.addToCart = function (product, quantity = 1) {
  const cartProductIndex = this.cart.items.findIndex(
    (cp) => cp.productId.toString() === product._id.toString()
  );
  const updatedProductsItems = [...this.cart.items];
  let newQuantity = quantity;
  if (cartProductIndex >= 0) {
    newQuantity = this.cart.items[cartProductIndex].quantity + newQuantity;
    updatedProductsItems[cartProductIndex].quantity = newQuantity;
    console.log(newQuantity);
  } else {
    updatedProductsItems.push({
      productId: product._id,
      quantity: newQuantity,
    });
  }
  const updatedCart = {
    items: updatedProductsItems,
  };
  this.cart = updatedCart;
  return this.save();
};
customerModel.methods.clearCart = function(){
  this.cart = {items : []};
  return this.save();
}
customerModel.methods.removeCart = function(productId){
  const updatedCartItems = this.cart.items.filter(item => {
    return item.productId.toString() != productId.toString();
  })
  this.cart.items = updatedCartItems;
  return this.save();
}
// customerSchema.methods.getCart = function(){
//   return this.cart;
// }
module.exports = mongoose.model("Customer", customerModel);
