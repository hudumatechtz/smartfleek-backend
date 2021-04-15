const jwt = require("jsonwebtoken");
// Existence and Validity
const Shop = require("../models/shop");

module.exports = async (req, res, next) => {
  const authHeader = req.get("Authorization");
  if (!authHeader) {
    const err = new Error("Not Authenticated, consider login");
    err.statusCode = 401;
    throw err;
  }
  const token = authHeader.split(" ")[1];
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, "secureShopLine");
  } catch (error) {
    error.statusCode = 500;
    error.message = "Session expired, consider login";
    return next(error);
  }

  if (!decodedToken) {
    const error = new Error("Not  Authenticated");
    error.statusCode = 401;
    throw error;
  }
  req.shopId = decodedToken.shopId;
  req.shopEmail = decodedToken.email;
  try {
    const result = await Shop.findById(req.shopId);
    if (result === null) {
      const error = new Error(
        "Not Authenticated OR session expired, consider login"
      );
      error.notSuccess = true;
      error.statusCode = 401;
      throw error;
    }
    req.shop = result;
  } catch (error) {
    return next(error);
  }
  next();
};
