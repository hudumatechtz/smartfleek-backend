const Order = require("../models/order");
const Product = require("../models/product");
exports.customerCheckout = async (req, res, next) => {
  const { amount, customerEmail } = req.body;
  try {
    const order = await Order.findOne({
      "customer.customerEmail": customerEmail,
    });
  } catch (error) {
    next(error);
  }
};

exports.servicePayment = async (req, res, next) => {
  const { fees } = req.body;
};
