const mongoose = require("mongoose");
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
      res.status(201).json({ products: products });
    })
    .catch((err) => next(err));
};
exports.getProduct = (req, res, next) => {
  let id = req.params.id;
  // let hex = /[0-9A-Fa-f]{6}/g;
  // id = (hex.test(id))? ObjectId(id) : id;
  // console.log(id);
  // console.log(id);
  Product.findOne({_id: id.toString()})
  .then(product => {
    if(!product){
      const error = new Error('PRODUCT FAILED TO FETCH');
      error.statusCode = 503;
      throw error;
    }
    res.status(201).json({product: product, message : 'PRODUCT OBTAINED'});

  }).catch(err => next(err));
}

exports.addToCart = (req, res, next) => {};

exports.removeProductFromCart = (req, res, next) => {};
