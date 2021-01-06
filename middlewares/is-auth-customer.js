const jwt = require("jsonwebtoken");
const Customer = require('../models/customer');

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
    decodedToken = jwt.verify(token, "secureCustomerLine");
  } catch (error) { 
    error.notSuccess = true;   
    error.statusCode = 500;
    throw error;
  }

  if (!decodedToken) {
    console.log('jwt 2');
    const error = new Error("Not  Authenticated");
    error.notSuccess = true;  
    error.statusCode = 401;
    throw error;
    // return res.status(401).json({notSuccess: true});
  }
  req.customerId = decodedToken.customerId;
  req.customerEmail = decodedToken.email;

  Customer.findById(req.customerId)
  .then(
    result => {
      if(!result){
        const error = new Error('Not Authenticated');
        error.notSuccess = true;  
        error.statusCode = 401;
        throw error;
        // return res.status(401).json({notSuccess: false});
      }
      req.customer = result;
    }
  )
  next();
};
