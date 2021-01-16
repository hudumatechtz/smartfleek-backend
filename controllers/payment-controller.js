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

exports.checkoutSingleProduct = async (req, res, next) => {
  const { productId, amount, quantity } = req.body;
  const customerId = req.customerId;
  const customerEmail = req.customerEmail;
  try {
    const product = await Product.findOne({ _id: productId.toString() });
    if (!product) {
      return res
        .status(200)
        .json({ message: "PRODUCT CHECKOUT COULD NOT BE PROCESSED" });
    }
    const { email, shopId } = product.shop;
    const products = [];
    console.log(product);
    products.push(product);
    const order = await new Order({
      customer: { customerId: customerId, customerEmail: customerEmail },
      products: products,
      //   shop: { email: product.email, shopId: product.shopId },
    });
    const savedOrder = await order.save();
    if(!savedOrder){
        return;
    }
    res
      .status(200)
      .json({ message: "CHECKOUT WAS SUCCESSFULLY", order: savedOrder });
  } catch (error) {
    next(error);
  }
};
