const Product = require("../models/product");

exports.addProduct = (req, res, next) => {
  // FRONT END VALIDATION FOR THESE PRODUCTS TO AVOID ERRORS
  const productName = req.body.product;
  const retailPrice = req.body.retailPrice;
  const quantity = req.body.quantity;
  const description = req.body.description;
  const images = req.body.images; //HOLD IMAGE ARRY --to be handled by multer middleware
  const wholeSalePrice = req.body.wholeSalePrice;
  const wholeSaleQuantity = req.body.wholeSaleQuantity;
  const unit = req.body.unit;
  const saleable = req.body.saleable;
  const stockable = req.body.stockable;
  const createdBy = req.body.createdBy; //PASS THE SHOP OBJECT
  const category = req.body.category;
  const catalog = req.body.catalog;

  const product = new Product({
    product: productName,
    retailPrice: retailPrice,
    quantity: quantity,
    description: description,
    images: [], //IMAGE ARRAY
    wholeSalePrice: wholeSalePrice,
    wholeSaleQuantity: wholeSaleQuantity,
    unit: unit,
    saleable: saleable,
    stockable: stockable,
    createdBy: {}, //SHOP OBJECT
    category: category,
    catalog: catalog,
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
