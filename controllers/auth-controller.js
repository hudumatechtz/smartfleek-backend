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
exports.postRegister = async (req, res, next) => {
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
  try {
    const shop = await Shop.findOne({ email: email });
    if (shop) {
      const error = new Error("Shop already exist, use a different email");
      error.statusCode = 401;
      throw error;
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    const newShop = new Shop({
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
    });
    const savedShop = await newShop.save();
    if (!savedShop) {
      const error = new Error("ERROR OCCURED | COULD NOT BE REGISTERED");
      error.statusCode = 500;
      throw error;
    }
    res.status(200).json({ message: "SHOP REGISTERED" });
  } catch (error) {
    next(error);
  }
};

// CUSTOMER
exports.postCustomerRegister = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const username = req.body.username;
  const mobile = req.body.mobile;
  Customer.findOne({ email: email })
    .then((customer) => {
      if (customer) {
        return res.json({
          message: "CUSTOMER ALREADY EXIST USE A DIFFERENT EMAIL",
          success: false,
        });
      } else {
        bcrypt
          .hash(password, 12)
          .then((hashedPassword) => {
            const customer = new Customer({
              email: email,
              username: username,
              password: hashedPassword,
              mobile: mobile,
              cart: { items: [] },
            });
            return customer.save();
          })
          .then((result) => {
            if (!result) {
              const error = new Error(
                "ERROR OCCURED | COULD NOT BE REGISTERED"
              );
              error.statusCode = 500;
              throw error;
            }
            res
              .status(200)
              .json({ message: "CUSTOMER REGISTERED", success: true });
          })
          .catch((err) => {
            next(err);
            // res
            //   .status(500)
            //   .json({ message: "ERROR OCCURED | COULD NOT BE REGISTERED" });
          });
      }
    })
    .catch((err) => next(err));
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
                return res.status(200).json({
                  message: "Either email or password is incorrect",
                  isLoggedIn: false,
                });
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
                success: true,
                token: token,
                email: shopUser.email,
                shopId: shopUser._id.toString(),
                isLoggedIn: true,
                expiresIn: 3600,
                username: shopUser.username,
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
            .json({
              message: "Either email or password is incorrect",
              isLoggedIn: false,
            });
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
          success: true,
          token: token,
          email: user.email,
          customerId: user._id.toString(),
          isLoggedIn: true,
          expiresIn: 3600,
          username: user.username,
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
