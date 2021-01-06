const express = require("express");
const router = express.Router();

const productController = require("../controllers/product-controller");
const isAuth = require("../middlewares/is-auth-customer");


router.get("/products", productController.getProducts);

router.get("/product/:id", productController.getProduct);

router.post("/add-to-cart", isAuth, productController.addToCart);

module.exports = router;
