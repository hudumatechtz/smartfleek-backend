const express = require("express");
const router = express.Router();

const shopController = require("../controllers/shop-controller");
const isAuth = require('../middlewares/is-auth');

router.post("/add-product", isAuth, shopController.addProduct);

module.exports = router;
