const Customer = require("../models/customer");

exports.getCart = (req, res, next) => {
  const customerId = req.customer._id;
  Customer.findById(customerId)
    .then((customer) => {
      if (!customer) {
        const error = new Error("CONSIDER LOGIN");
        error.statusCode = 401;
        throw error;
      }
      customer
        .populate("cart.items.productId")
        .execPopulate()
        .then((customerData) => {
          const cart = customerData.cart.items;
          // cart.forEach((element) => {
          //   console.log(element.productId.product);
          // });
          res
            .status(201)
            .json({ message: "BAG PRODUCTS OBTAINED", cart: cart });
        });
    })
    .catch((err) => next(err));
};
exports.removeProductFromCart = (req, res, next) => {
  const productId = req.body.productId;
  req.customer
    .clearCart()
    .then((result) => {
      if (!result) {
        const error = new Error("BAG PRODUCT COULD NOT BE DELETED");
        error.statusCode = 500;
        throw error;
      }
      res.status(200).json({ message: "BAG PRODUCT WAS DELETED SUCCESSFULLY" });
    })
    .catch((error) => next(error));
};
exports.removeCart = (req, res, next) => {
  req.customer
    .clearCart()
    .then((result) => {
      if (!result) {
        const error = new Error("CART PRODUCTS COULD NOT BE DELETED");
        error.statusCode = 500;
        throw error;
      }
      res
        .status(200)
        .json({ message: "BAG PRODUCTS WERE CLEARED SUCCESSFULLY" });
    })
    .catch((error) => next(error));
};
exports.makeOrder = (req, res, next) => {};
