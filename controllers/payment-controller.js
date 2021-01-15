const Order = require('../models/order');
exports.customerCheckout = async (req, res, next) => {
    const amount = req.body.amount;
    const customerEmail = req.customerEmail;
    try {
        const order = await Order.findOne({"customer.customerEmail": customerEmail});

    } catch (error) {
        next(error);
    }
}

exports.servicePayment = async (req, res, next) => {
    const fees = req.body.fees;
}