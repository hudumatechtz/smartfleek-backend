const Product = require("../models/product");

exports.getProducts = (req, res, next) => {
  Product.find()
    .limit(20)
    .then((products) => {
      if (!products) {
        const error = new Error("PRODUCT FETCH FAILED, TRY LATER");
        error.statusCode = 500;
        throw error;
      }
    //   console.log(products);
      res.status(201).json({ producs: products });
    })
    .catch((err) => next(err));
};

exports.addToCart = (req, res, next) => {};

exports.removeProductFromCart = (req, res, next) => {};
