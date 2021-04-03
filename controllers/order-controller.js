const Order = require("../models/order");

exports.postOrder = async (req, res, next) => {
  try {
    const customerProductsInfo = await req.customer.populate(
      "cart.items.productId"
    );

    const customerProductsExec = await customerProductsInfo.execPopulate();

    if (!customerProductsExec) {
      const error = new Error("NO CUSTOMER ORDER WAS PROCESSESD");
      error.statusCode = 404;
      throw error;
    }
    const products = customerProductsExec.cart.items.map((i) => {
      const amount = +i.quantity * i.productId.retailPrice;

      return {
        quantity: i.quantity,
        product: { ...i.productId._doc },
        amount: amount,
      };
    });
    const order = new Order({
      "customer.customerEmail": req.customerEmail,
      "customer.customerId": req.customerId,
      // Convert products array to objects
      products
      // SHOP DETAILS
    });
    const savedOrder = await order.save();
    if (!savedOrder) {
      const error = new Error("NO CUSTOMER ORDER WAS SAVED");
      error.statusCode = 500;
      throw error;
    }
    const clearedCart = await req.customer.clearCart();
    if (!clearedCart) {
      const error = new Error("CART ERROR HAPPENED");
      error.statusCode = 500;
      throw error;
    }
    res.status(200).json({ message: "ORDER WAS SUCCESSFULLY PROCESSED" });
  } catch (error) {
    next(error);
  }
};

exports.getLatestOrder = async (req, res, next) => {
  const shopEmail = req.shopEmail;
  try {
    const order = await Order.findOne({ "shop.shopEmail": shopEmail });
    if (!order) {
      throw (new Error(
        "LATEST ORDER COULD NOT BE RETRIVED OR NO LATEST ORDER"
      ).statusCode = 500);
    }
    res.status(201).json({ message: "LATEST ORDER RETRIEVED", order: order });
  } catch (error) {
    next(error);
  }
};
exports.getAllOrders = async (req, res, next) => {
  const shopEmail = req.shopEmail;
  try {
    const orders = await Order.find({ "shop.shopEmail": shopEmail });
    if (!orders) {
      throw (new Error(
        "ORDERS COULD NOT BE RETRIEVED OR NO ORDERS"
      ).statusCode = 500);
    }
    res
      .status(201)
      .json({ message: "ORDERS RETRIEVED SUCCESSFULLY", orders: orders });
  } catch (error) {
    next(error);
  }
};
exports.orderSingleProduct = async (req, res, next) => {
  const { productId, quantity } = req.body;
  const customerId = req.customerId;
  const customerEmail = req.customerEmail;
  try {
    const product = await Product.findOne({ _id: productId.toString() });
    if (!product) {
      return res
        .status(200)
        .json({ message: "PRODUCT ORDER COULD NOT BE PROCESSED" });
    }
    // console.log(product);
    const { email, shopId } = product.shop;
    const amount = product.retailPrice * +quantity;
    // const products = [];
    // console.log(product);
    // products.push(product);
    const order = await new Order({
      customer: { customerId: customerId, customerEmail: customerEmail },
      products: [{ product: product, quantity: quantity, amount: amount }],
      //   shop: { email: product.email, shopId: product.shopId },
    });
    const savedOrder = await order.save();
    if (!savedOrder) {
      return;
    }
    res
      .status(200)
      .json({ message: "ORDER WAS SUCCESSFULLY", order: savedOrder });
  } catch (error) {
    next(error);
  }
};
