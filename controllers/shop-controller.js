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
  // console.log(req.file);
  if (
    !productName ||
    !retailPrice ||
    !quantity ||
    !image ||
    !category ||
    !catalog ||
    !description
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
    const products = await Product.find({ "shop.email": email });
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
exports.getEditProduct = async (req, res, next) => {
  const { productId } = req.params;
  try {
    const product = await Product.findOne({
      _id: productId,
      "shop.email": req.shopEmail,
    }).sort({ _id: -1 });
    if (!product) {
      throw new Error("Product could not be fetched");
    }
    res.status(201).json(product);
  } catch (error) {
    next(error);
  }
};

exports.postProductEdit = async (req, res, next) => {
  const productId = req.body.productId;
  const updatedProductName = req.body.product;
  const updatedRetailPrice = req.body.retailPrice;
  const image = req.file;
  const updatedCategory = req.body.category;
  const updatedCatalog = req.body.catalog;
  const updateQuantity = req.body.quantity;
  const imageUrl = req.body.imageUrl;
  // const updatedWholesalePrice = req.body.wholeSalePrice;
  const updatedDescription = req.body.description;
  try {
    if (
      !updatedProductName ||
      !updateQuantity ||
      !updatedCatalog ||
      !updatedDescription ||
      !updatedCategory ||
      !updatedRetailPrice ||
      !imageUrl
    ) {
      const error = new Error("Product edit form has errors, correct them");
      error.statusCode = 422;
      throw error;
    }
    const product = await Product.findOne({
      _id: productId,
      "shop.email": req.shopEmail,
    }).sort({ _id: -1 });
    if (!product) {
      throw new Error(`Product could not be found`);
    }
    let paths = [];
    if(image != null){
      paths.push(image.path);
    }else{
      paths.push(imageUrl);
    }
    product.product = updatedProductName;
    product.retailPrice = updatedRetailPrice;
    product.quantity = updateQuantity;
    product.catalog = updatedCatalog;
    product.category = updatedCategory;
    // product.wholeSalePrice = updatedWholesalePrice;
    product.description = updatedDescription;
    product.images = { imagePaths: paths };
    product.shop = { email: req.shopEmail, shopId: req.shopId };
    const updatedProduct = await product.save();
    if (!updatedProduct) {
      throw new Error(`Product Update Failed`).statusCode(500);
    }
    res.status(201).json({ message: "Product was updated", success: true });
  } catch (error) {
    next(error);
  }
};
exports.deleteProduct = (req, res, next) => {
  const { productId } = req.params;
  Product.findOne({ _id: productId })
    .sort({ __id: -1 })
    .then((product) => {
      if (!product) {
        throw new Error("Product is not availabe for deletion");
      }
      return product.deleteOne();
    })
    .then((result) => {
      if (result.deleteCount == 1)
        return res.status(200).json({ message: "PRODUCT NOT DELETED" });
      res.status(200).json({ message: "PRODUCT WAS DELETED SUCCESSFULY" });
    })
    .catch((err) => next(err));
};

exports.getNumberOfProducts = async (req, res, next) => {
  try {
    const count = await Product.countDocuments({
      "shop.email": req.shopEmail,
    });
    if (!(count > 0)) {
      const error = new Error("NO PRODUCTS UNDER YOUR SHOP");
      error.statusCode = 420;
      throw error;
    }
    res
      .status(201)
      .json({ message: "PRODUCTs exist under your shop", count: count });
  } catch (error) {
    next(error);
  }
};
exports.getNumberOfOrders =  async (req, res, next) => {
  try {
    const count = await Product.countDocuments({
      "shop.email": req.shopEmail,
    });
    if (!(count > 0)) {
      const error = new Error("NO PRODUCTS UNDER YOUR SHOP");
      error.statusCode = 420;
      throw error;
    }
    res
      .status(201)
      .json({ message: "ORDERS RECEIVED BY THIS SHOP", count: count });
  } catch (error) {
    next(error);
  }
};