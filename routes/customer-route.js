const express = require("express");
const router = express.Router();

const customerController = require('../controllers/customer-controller');
const isAuth = require("../middlewares/is-auth-customer");

router.get("/user/cart", isAuth, customerController.getCart);

router.delete("/user/cart/", isAuth, customerController.removeProductFromCart);

router.delete('/user/clear-cart', isAuth, customerController.removeCart);

module.exports = router;
