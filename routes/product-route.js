const express = require("express");
const router = express.Router();

const productController = require("../controllers/product-controller");
const isAuth = require("../middlewares/is-auth-customer");
const paymentController = require("../controllers/payment-controller");
const orderController = require("../controllers/order-controller");

router.get("/products", productController.getProducts);

router.get("/product/:id", productController.getProduct);

router.post("/add-to-cart", isAuth, productController.addToCart);

router.get("/search/:seach_query", productController.searchProduct);

router.get("/category/:category", productController.getProductsByCategory);

router.delete(
  "/delete-cart/:productId",
  isAuth,
  productController.removeProductFromCart
);

router.post("/order-single-product", isAuth, orderController.orderSingleProduct);

router.post("/order", isAuth, orderController.postOrder);

module.exports = router;
