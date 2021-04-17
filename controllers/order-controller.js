const { Promise } = require("mongoose");
const Order = require("../models/order");
const Product = require("../models/product");
const Shop = require("../models/shop");
const mongoose = require("mongoose");

exports.postOrder = async (req, res, next) => {
  try {
    const customerProductsInfo = await req.customer.populate(
      "cart.items.productId"
    );

    const customerProductsExec = await customerProductsInfo.execPopulate();

    if (!customerProductsExec) {
      const error = new Error("NO CUSTOMER ORDER WAS PROCESSED");
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
      "customer.customerNumber": req.customer.mobile,
      "customer.customerLocation": req.customer.location,
      // Convert products array to objects
      products,
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

// HAS ERRORS
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
  const email = req.shopEmail;
  try {
    const orders = await Order.find({ "products.product.shop.email": email })
      .sort({ _id: -1 })
      .limit(20);
    if (!orders) {
      throw (new Error(
        "ORDERS COULD NOT BE RETRIEVED OR NO ORDERS"
      ).statusCode = 500);
    }
    popOrdersByEmail(orders, email, (newOrders) => {
      res
        .status(201)
        .json({ message: "ORDERS RETRIEVED SUCCESSFULLY", orders: newOrders });
    });
  } catch (error) {
    next(error);
  }
};
exports.getOrdersCount = async (req, res, next) => {
  const email = req.shopEmail;
  try {
    const count = await Order.countDocuments({
      "products.product.shop.email": email,
    });
    if (!(count > 0)) {
      throw (new Error("NO ORDERS UNDER YOUR SHOP").statusCode = 500);
    }
    res
      .status(201)
      .json({ message: "YOUR GOT SOME ORDERS CHECK!!", count: count });
  } catch (error) {
    next(error);
  }
};
exports.orderSingleProduct = async (req, res, next) => {
  const { productId, quantity } = req.body;
  // console.log(req.body);
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
    const order = new Order({
      customer: {
        customerId: customerId,
        customerEmail: customerEmail,
        customerNumber: req.customer.mobile,
        customerLocation: req.customer.location,
      },
      products: [{ product: product, quantity: quantity, amount: amount }],
      //   shop: { email: product.email, shopId: product.shopId },
    });
    const savedOrder = await order.save();
    if (!savedOrder) {
      return;
    }
    const result = await req.customer.removeCart(productId);
    res
      .status(200)
      .json({ message: "ORDER WAS SUCCESSFULLY", order: savedOrder });
  } catch (error) {
    next(error);
  }
};
exports.getCustomerOrders = async (req, res, next) => {
  const email = req.customerEmail;
  try {
    orders = await Order.find(
      { "customer.customerEmail": email },
      `products _id`
    )
      .sort({ _id: -1 })
      .limit(8);
    // const data = await populateShopDetails(order);

    if (orders.length <= 0) {
      const err = new Error("ORDERS COULD NOT BE FETCHED");
      err.statusCode = 500;
      throw err;
    }
    res.status(201).json({ message: "ORDERS OBTAINED", orders: orders });
  } catch (error) {
    next(error);
  }
};
// *********NOT WORKING CODES*********
const sendMailToShops = async (emails = new Array()) => {};
const populateShopDetails = async (orders) => {
  const product = await await orders
    .populate("products.product")
    .execPopulate();
  return new Promise((resolve, reject) => {
    const shopData = { product };

    if (shopData) {
      resolve(shopData);
    } else {
      reject({});
    }
  });
};

const populateOrders = async (orders, callback) => {
  let shopMobileNumber;
  let shopName;
  let newOrders = [...orders];
  let newOrderObject = {};
  // const newOrdersPromise = new Promise(async (resolve, reject) => {
  orders.forEach(async (orderObject) => {
    newOrderObject.products = [];
    let copiedProduct = {};
    await orderObject.products.forEach(async (product) => {
      copiedProduct = { ...product };
      allPoductsPerOrder = [];
      const shopEmail = product.product.shop.email;
      const shopData = await Shop.findOne({ email: shopEmail }).sort({
        _id: -1,
      });
      // console.log(shopData.mobileNumber);
      // console.log(product);
      shopName = shopData.shopName;
      shopMobileNumber = shopData.mobileNumber;
      // console.log({ product, shopName, shopMobileNumber });
      const newModifiedProduct = { product, shopName, shopMobileNumber };
      // console.log(newModifiedProduct);
      copiedProduct.product = newModifiedProduct;
      allPoductsPerOrder.push(copiedProduct);
    });
    newOrderObject.products.push(allPoductsPerOrder);
  });
  newOrders.products = newOrderObject.products;
  console.log(newOrders[0].products[0]);
  if (newOrders <= 0) {
    return callback([]);
  }
  callback[newOrders];

  // if (newOrders.length <= 0) {
  //   reject([]);
  // } else {
  //   console.log("resolved");
  //   resolve(newOrders);
  // }
  // });
  // console.log(newOrdersPromise)
  // return Promise.all([newOrdersPromise]);
};
// *******END OF NOT WORKING CODES**********
const popOrdersByEmail = (orders, email, callback) => {
  const newOrders = [];
  orders.forEach((order) => {
    if (order.products.length == 1) {
      newOrders.push(order);
    }
    if (order.products.length > 1) {
      // console.log(order.customer);
      const obj = {
        customer: order.customer,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
        // ...order._id.toString(),
        _id: order._id,
        products: [],
      };
      const ok = order.products.filter((product) => {
        if (product.product.shop.email === email) {
          obj.products.push(product);
        }
        return `Ok!`;
      });
      newOrders.push({ ...obj });
    }
  });
  if (newOrders.length > 0) {
    callback(newOrders);
    return;
  }
  callback([]);
};
