const bcrypt = require("bcryptjs");
const Shop = require("../models/shop");

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
        mobileNumber: mobileNumber,
        shopName: shopName,
        shopCategory: shopCategory,
        shopRegion: shopRegion,
        shopLocation: shopLocation,
        username: username,
        password: hashedPassword,
      });
      return shop.save();
    })
    .then((result) => {})
    .catch((err) => {
      next(err);
    });
};
