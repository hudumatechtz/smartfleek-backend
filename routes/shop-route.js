const express = require("express");
const router = express.Router();

const shopController = require("../controllers/shop-controller");

router.get("/add-product", shopController.addProduct);

module.exports = router;
