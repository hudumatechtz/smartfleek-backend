const express = require("express");
const router = express.Router();

const customerController = require('../controllers/customer-controller');
const isAuth = require("../middlewares/is-auth-customer");

router.get("/customer/cart", isAuth, customerController.getCart);

router.delete("/customer/cart/", isAuth, customerController.removeProductFromCart);

router.delete('/customer/clear-cart', isAuth, customerController.removeCart);

module.exports = router;
