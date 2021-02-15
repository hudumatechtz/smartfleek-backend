const Product = require("../models/product");
const Category = require("../models/category");

exports.addProduct = (req, res, next) => {
  // FRONT END VALIDATION FOR THESE PRODUCTS TO AVOID ERRORS
  const productName = req.body.product;
  const retailPrice = req.body.retailPrice;
  const quantity = req.body.quantity;
  const description = req.body.description;
  // const images = req.body.images; //HOLD IMAGE ARRY --to be handled by multer middleware
  // const wholeSalePrice = req.body.wholeSalePrice;
  // const wholeSaleQuantity = req.body.wholeSaleQuantity;
  // const unit = req.body.unit;
  // const saleable = req.body.saleable;
  // const stockable = req.body.stockable;
  // console.log(req.shopEmail + "\n" + req.shopId);
  const image = req.file;
  const category = req.body.category;
  const catalog = req.body.catalog;
  console.log(req.file);
  if (
    !productName ||
    !retailPrice ||
    !quantity ||
    !image ||
    !category ||
    !catalog
  ) {
    const error = new Error("Product form has errors, correct them");
    error.statusCode = 422;
    throw error;
  }
  let paths = [];
  paths.push(image.path);
  const product = new Product({
    product: productName,
    retailPrice: retailPrice,
    quantity: quantity,
    description: description,
    // images: [], //IMAGE ARRAY
    images: { imagePaths: paths },
    category: category,
    catalog: catalog,
    shop: { email: req.shopEmail, shopId: req.shopId },
  });
  product
    .save()
    .then((result) => {
      if (!result) {
        const error = new Error("Product was not saved into the database");
        error.statusCode = 500;
        throw error;
      }
      res.status(200).json({ message: "Product saved successfully" });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getShopProducts = (req, res, next) => {
  const shop = req.shop;
  Product.find({ __id: shop.__id })
    .exec()
    .then((products) => {
      if (!products) {
        const error = new Error(
          "Currently there are no products for your shop OR\nfailed to get products"
        );
        error.statusCode = 500;
        throw error;
      }
      res.status(201).json({ message: "Products found", products: products });
    })
    .catch((err) => {
      next(err);
    });
};

exports.addCategory = async (req, res, next) => {
  // const { category } = req.body;
  try {
    const categories = await new Category({
      categories: categoriesFile,
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
exports.getCatalogies = async (req, res, next) => {
  const category = req.params.category;
  try {
    const categories = await Category.find();
    const catalog = categories[0].categories;
    res.json(catalog);
  } catch (error) {
    next(error);
  }
};
exports.getShopProducts = async (req, res, next) => {
  const email = req.shopEmail;
  try {
    const products = await Product.find({"shop.email": email });
    if (products === null) {
      const error = new Error("PRODUCT FETCH FAILED, TRY LATER");
      error.statusCode = 500;
      throw error;
    }
    res.status(201).json({ products: products });
  } catch (error) {
    next(error);
  }
};
