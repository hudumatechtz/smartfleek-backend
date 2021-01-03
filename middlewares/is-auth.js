const jwt = require("jsonwebtoken");
// Existence and Validity

module.exports = (req, res, next) => {
  const authHeader = req.get("Authorization");
  if (!authHeader) {
    const err = new Error("Not Authenticated consider login");
    err.statusCode = 401;
    throw err;
  }
  const token = authHeader.split(" ")[1];
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, "shopSecureLine");
  } catch (error) {
    error.statusCode = 500;
    throw error;
  }

  if (!decodedToken) {
    const error = new Error("Not  Authenticated");
    error.statusCode = 401;
    throw error;
  }
  req.shopId = decodedToken.shopId;
  req.shopEmail = decodedToken.email;
  next();
};
