const Customer = require("../models/customer");
const Product = require("../models/product");
const Category = require("../models/category");

exports.addCategory = async (req, res, next) => {
  // const { category } = req.body;
  try {
    const newCategories = [
      "general",
      "mens",
      "women",
      "children",
      "media",
      "clothes",
      "electronics",
      "household",
      "artsandcrafts",
      "furniture",
      "smartphone",
      "hairandbeauty",
      "interior",
      "exterior",
      "pestcontrol",
      "travelandtourism",
      "television",
      "laptop",
      "footwear",
      "handbags",
      "transportation",
      "durables",
      "perishables",
      "vegetables",
      "food",
    ];
    const categories = await new Category({
      categories: newCategories,
      catalogs: [],
    });
    const savedCategories = await categories.save();
    if (savedCategories === null) {
      return res.json({ message: "CATEGORIES NOT SAVED TO THE DATABASE" });
    }
    res.status(200).json({ message: "CATEGORIES WERE SAVED TO THE DATABASE" });
  } catch (error) {
    next(error);
  }
};
exports.getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find({});
    console.log(categories);
    if (categories == null) {
      return res
        .status(200)
        .json({ message: "CATEGORIES COULD NOT BE FETCHED" });
    }
    res
      .status(201)
      .json({ message: "CATEGORIES FETCHED", categories: categories });
  } catch (error) {
    next(error);
  }
};
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
  Product.findOne({ _id: id.toString() })
    .then((product) => {
      if (!product) {
        const error = new Error("PRODUCT FAILED TO FETCH");
        error.statusCode = 503;
        throw error;
      }
      res.status(201).json({ product: product, message: "PRODUCT OBTAINED" });
    })
    .catch((err) => next(err));
};

exports.addToCart = (req, res, next) => {
  const productId = req.body.productId;
  const quantity = req.body.quantity;
  console.log(req.customer);
  Product.findById(productId.toString())
    .then((result) => {
      if (!result) {
        return res.status(200).json({ message: "PRODUCT COULD NOT BE FOUND" });
      }
      // console.log(result);
      req.customer
        .addToCart(result, quantity)
        .then((result) =>
          res.status(200).json({ message: "PRODUCT ADDED TO CART" })
        )
        .catch((err) => {
          throw err;
        });
    })
    .catch((err) => next(err));
};
exports.removeProductFromCart = async (req, res, next) => {
  const { productId } = req.params;
  console.log(productId);
  try {
    const result = await req.customer.removeCart(productId);
    console.log(result);
    res.status(200).json({ message: "PRODUCT WAS DELETED", result: result });
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
    const products = await Product.find({ product: { $regex: regex } });
    // if(!products){
    //   throw new Error('PRODUCT')
    // }
    if (products.length <= 0) {
      return res.status(200).json({
        message: "PRODUCTS ARE NOT AVAILABLE IN THE MARKET CURRENTLY",
      });
    }

    res
      .status(201)
      .json({ message: "PRODUCTS EXIST IN THE MARKET", products: products });
  } catch (error) {
    next(error);
  }
};
exports.getProductsByCategory = async (req, res, next) => {
  const category = req.params.category;
  try {
    const products = await Product.find({ category: category });
    if (products.length <= 0) {
      return res
        .status(200)
        .json({ message: "PRODUCTS CATEGORY COULD NOT BE FETCHED" });
    }
    res
      .status(201)
      .json({ message: "PRODUCTS CATEGORY FETCHED", products: products });
  } catch (error) {
    next(error);
  }
};
