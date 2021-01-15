const Order = require("../models/order");

exports.postOrder = async (req, res, next) => {
  try {
    const customer = await req.customer;
    const customerProductsInfo = await customer
      .populate("cart.items.productid")
      .execPopulate();
    if (!customerProductsInfo) {
      const error = new Error("NO CUSTOMER ORDER WAS PROCESSESD");
      error.statusCode = 404;
      throw error;
    }
    const products = customerProductsInfo.cart.items.map((i) => {
      return { quantity: i.quantity, product: { ...i.productId._doc } };
    });
    const order = new Order({
        "customer.customerEmail" : req.email,
        products: products,
        // SHOP DETAILS
    });
    const savedOrder = await order.save();
    if(!savedOrder){
        const error = new Error("NO CUSTOMER ORDER WAS SAVED");
        error.statusCode = 500;
        throw error; 
    }
    const clearedCart = await req.customer.clearCart();
    if(!clearedCart){
        const error = new Error("CART ERROR HAPPENED");
        error.statusCode = 500;
        throw error;  
    }
    res.status(200).json({message: 'ORDER WAS SUCCESSFULLY PROCESSED'});
  } catch (error) {}
};

exports.getLatestOrder = async(req, res, next) => {
    const shopEmail = req.shopEmail;
    const shopOrder = await Order.findOne({"shop.shopEmail" : shopEmail});
}
exports.getAllOrders = async(req, res, next) => {}