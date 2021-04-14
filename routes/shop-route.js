const express = require("express");
const router = express.Router();

const shopController = require("../controllers/shop-controller");
const isAuth = require("../middlewares/is-auth");

router.post("/add-product", isAuth, shopController.addProduct);

router.patch("/category/add-category", shopController.addCategory);

router.get("/categories", shopController.getCategories);

router.get("/catalog/:category", shopController.getCatalogies);

router.get("/shop-products", isAuth, shopController.getShopProducts);

router.delete("/delete/:productId", isAuth, shopController.deleteProduct);

router.get("/edit-product/:productId", isAuth, shopController.getEditProduct);

router.post("/edit-product", isAuth, shopController.postProductEdit);

router.get("/number-of-products", isAuth, shopController.getNumberOfProducts);
module.exports = router;
