const Customer = require("../models/customer");
const Product = require("../models/product");
const Category = require("../models/category");
const categoriesFile = require("../shared/categories");

exports.getProducts = (req, res, next) => {
  Product.find()
    .sort({ _id: -1 })
    .limit(20)
    .then((products) => {
      if (!products) {
        const error = new Error("PRODUCT FETCH FAILED, TRY LATER");
        error.statusCode = 500;
        throw error;
      }
      //   console.log(products);
      res.status(201).jsonp({ products: products });
      // res.status(201).json({ products: products });
    })
    .catch((err) => next(err));
};
exports.getProduct = (req, res, next) => {
  let id = req.params.id;
  // let hex = /[0-9A-Fa-f]{6}/g;
  // id = (hex.test(id))? ObjectId(id) : id;
  // console.log(id);
  // console.log(id);
  Product.findOne({ _id: id.toString() })
    .sort({ _id: -1 })
    .then((product) => {
      if (!product) {
        const error = new Error("PRODUCT FAILED TO FETCH");
        error.statusCode = 503;
        throw error;
      }
      res.status(201).jsonp({ product: product, message: "PRODUCT OBTAINED" });
      // res.status(201).json({ product: product, message: "PRODUCT OBTAINED" });
    })
    .catch((err) => next(err));
};

exports.addToCart = (req, res, next) => {
  const productId = req.body.productId;
  const quantity = req.body.quantity;
  Product.findById(productId.toString())
    .then((result) => {
      if (!result) {
        return res.status(200).json({ message: "PRODUCT COULD NOT BE FOUND" });
      }
      // console.log(result);
      req.customer
        .addToCart(result, quantity)
        .then((result) =>
          res.status(200).json({ message: "PRODUCT ADDED TO BAG" })
        )
        .catch((err) => {
          throw err;
        });
    })
    .catch((err) => next(err));
};
exports.removeProductFromCart = async (req, res, next) => {
  const { productId } = req.params;
  try {
    const result = await req.customer.removeCart(productId);
    // console.log(result);
    res
      .status(200)
      .json({ message: "PRODUCT WAS DELETED FROM BAG", result: result });
  } catch (error) {
    next(error);
  }
};

exports.searchProduct = async (req, res, next) => {
  const searchQuery = req.params.seach_query;
  try {
    const regex = new RegExp(searchQuery, "i");
    const noOfProducts = await Product.estimatedDocumentCount({
      product: { $regex: regex },
    });
    // console.log(noOfProducts);
    const products = await Product.find({ product: { $regex: regex } })
      .sort({ _id: -1 })
      .limit(25);
    // if(!products){
    //   throw new Error('PRODUCT')
    // }
    if (products.length <= 0) {
      return res.status(200).json({
        message: "PRODUCTS ARE NOT AVAILABLE CURRENTLY",
      });
    }

    res
      .status(201)
      .json({ message: "PRODUCT(S) IS/ARE AVAILABLE", products: products });
  } catch (error) {
    next(error);
  }
};
exports.getProductsByCategory = async (req, res, next) => {
  const category = req.params.category;
  try {
    const products = await Product.find({ catalog: category })
      .sort({ _id: -1 })
      .limit(30);
    if (products.length <= 0) {
      const categories = await Product.find({ category: category })
        .sort({ _id: -1 })
        .limit(35);
      if (categories.length <= 0) {
        const error = new Error("PRODUCTS CATEGORY COULD NOT BE FETCHED");
        error.statusCode = 204;
        throw error;
        // return
      }
      return res
        .status(200)
        .json({ message: "PRODUCTS CATEGORY FETCHED ", products: categories });
    }
    res
      .status(201)
      .json({ message: "PRODUCTS CATALOG FETCHED", products: products });
  } catch (error) {
    next(error);
  }
};
