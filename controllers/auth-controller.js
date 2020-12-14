const bcrypt = require("bcryptjs");
const Shop = require("../models/shop");
const Customer = require("../models/customer");
const jwt = require("jsonwebtoken");

//HELPER METHODS
const validatorHelper = (password, hashedPassword, callbak) => {
  bcrypt
    .compare(password, hashedPassword)
    .then((doMatch) => {
      if (doMatch) {
        return callbak(doMatch);
      }
      return callbak(doMatch);
    })
    .catch((error) => {
      // console.log(error);
      console.log(error);
      return callback(false);
    });
};

// SHOP
exports.postRegister = (req, res, next) => {
  console.log(req.body);
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
        registerDate: Date.now(),
      });
      return shop.save();
    })
    .then((result) => {
      if (!result) {
        const error = new Error("ERROR OCCURED | COULD NOT BE REGISTERED");
        error.statusCode = 500;
        throw error;
      }
      res.status(200).json({ message: "SHOP REGISTERED" });
    })
    .catch((err) => {
      next(err);
      // res
      //   .status(500)
      //   .json({ message: "ERROR OCCURED | COULD NOT BE REGISTERED" });
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
      if (!result) {
        const error = new Error("ERROR OCCURED | COULD NOT BE REGISTERED");
        error.statusCode = 500;
        throw error;
      }
      res.status(200).json({ message: "CUSTOMER REGISTERED" });
    })
    .catch((err) => {
      next(err);
      // res
      //   .status(500)
      //   .json({ message: "ERROR OCCURED | COULD NOT BE REGISTERED" });
    });
};

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  Customer.findOne({ email: email })
    .then((user) => {
      if (!user) {
        Shop.findOne({ email: email })
          .then((shopUser) => {
            if (!shopUser) {
              const error = new Error(
                "User with " + email + " do not exist, consider register"
              );
              error.statusCode = 401;
              throw error;
            }
            validatorHelper(password, shopUser.password, (doMatch) => {
              if (!doMatch) {
                return res
                  .status(200)
                  .json({ message: "Either email or password is incorrect" });
              }
              // req.session.shopIsLoggedIn = true;
              // req.session.shop = shopUser;
              // req.session.save((err) => {});
              const token = jwt.sign(
                {
                  email: email,
                  shopId: shopUser._id,
                },
                "secureShopLine",
                {
                  expiresIn: "1hr",
                }
              );
              res.status(201).json({
                message: "Shop user exist",
                success: true,
                token: token,
                email: shopUser.email,
                shopId: shopUser._id.toString(),
              });
            });
          })
          .catch((err) => next(err));
        return;
      }
      validatorHelper(password, user.password, (doMatch) => {
        if (!doMatch) {
          return res
            .status(200)
            .json({ message: "Either email or password is incorrect" });
        }
        // req.session.customerIsLoggedIn = true;
        // req.session.customer = user;
        // req.session.save((err) => {});
        const token = jwt.sign(
          {
            email: email,
            customerId: user._id,
          },
          "secureCustomerLine",
          { expiresIn: "1hr" }
        );
        res.status(201).json({
          message: "Customer exist",
          success: true,
          token: token,
          email: user.email,
          customerId: user._id.toString(),
        });
      });
    })
    .catch((err) => {
      next(err);
    });
};

exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    if (err) {
      return res
        .status(200)
        .json({ message: "LOGOUT NOT SUCCESSFUL", success: false });
    }
    res.status(200).json({ message: "LOGOUT SUCCESSFUL", success: true });
  });
};
