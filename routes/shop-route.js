const express = require("express");
const router = express.Router();

const shopController = require("../controllers/shop-controller");
const isAuth = require('../middlewares/is-auth');

router.post("/add-product", isAuth, shopController.addProduct);

router.patch("/category/add-category", shopController.addCategory);

router.get("/categories", shopController.getCategories);

router.get("/catalog/:category", shopController.getCatalogies);

router.get("/shop-products", isAuth, shopController.getShopProducts);
module.exports = router;
