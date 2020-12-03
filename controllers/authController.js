const bcrypt = require("bcryptjs");
const Shop = require("../models/shop");
const Customer = require("../models/customer");

// SHOP
exports.postRegister = (req, res, next) => {
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const email = req.body.email;
  const mobileNumber = req.body.mobileNumber;
  const shopName = req.body.shopName;
  const shopCategory = req.body.shopCategory;
  const shopRegion = req.body.shopRegion;
  const shopLocation = req.body.shopLocation;
  const username = req.body.username;
  const password = req.body.password;

  bcrypt
    .hash(password, 12)
    .then((hashedPassword) => {
      const shop = new Shop({
        firstName: firstName,
        lastName: lastName,
        email: email,
        mobileNumber: +mobileNumber,
        shopName: shopName,
        shopCategory: shopCategory,
        shopRegion: shopRegion,
        shopLocation: shopLocation,
        username: username,
        password: hashedPassword,
        registerDate : Date.now()
      });
      return shop.save();
    })
    .then((result) => {
      res.json({ message: "SHOP REGISTERED" });
    })
    .catch((err) => {
      next(err);
    });
};

// CUSTOMER
exports.postCustomerRegister = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const username = req.body.username;
  bcrypt
    .hash(password, 12)
    .then((hashedPassword) => {
      const customer = new Customer({
        email: email,
        username: username,
        password: hashedPassword,
        cart: { items: [] },
      });
      return customer.save();
    })
    .then((result) => {
      res.json({ message: "CUSTOMER REGISTERED" });
    })
    .catch((err) => next(err));
};
