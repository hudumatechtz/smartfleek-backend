const bcrypt = require("bcryptjs");
const Shop = require("../models/shop");
const Customer = require("../models/customer");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const crypto = require("crypto");

//HELPER METHODS
const companyMail = process.env.EMAIL;
const accessor = process.env.PASSWORD;
const URL = process.env.URL;
const transporter = nodemailer.createTransport({
  host: 'in-v3.mailjet.com',
      port: 587,
      secure: true,
  auth: {
    user: companyMail.trim(),
    pass: accessor.trim(),
  },
  tls: {
    rejectUnauthorized: false
  },
  ignoreTLS: true
});
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
  const email = req.body.email.toLowerCase();
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
      const error = new Error("Shop exist, use a other email");
      error.statusCode = 401;
      throw error;
    }
    const customer = await Customer.findOne({ email: email });
    if (customer) {
      const error = new Error("email used as customer, use other email");
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
    crypto.randomBytes(256, async (err, buffer) => {
      try {
        if (err) {
          throw (new Error(
            "SOMETHIG WENT WRONG WITH VERIFICATION"
          ).statusCode = 500);
        }
        const token = buffer.toString("hex");
        newShop.verificationToken = token;
        newShop.verificationTokenExpiration = Date.now() + 3600000;
        const transportedMail = await transporter.sendMail({
          from: companyMail,
          to: email,
          subject: "SMARTFLEEK SHOP ACCOUNT VERIFICATION",
          html: `
            <h3>You rigistered for smartfleek shop services, if NOT then ignore this email!</h3>
            <p>CLICK THIS <a href="${URL}/account/activation/${token}" style="color:#b80f0a"> LINK </a>
            TO VERIFY YOUR ACCOUNT
            </p>
          `,
        });
        // console.log(transportedMail);
        // THIS DOES NOT WORK
        if (!transportedMail) {
          const error = new Error("ERROR OCCURED | EMAIL NOT SENT | TRY AGAIN");
          error.statusCode = 500;
          throw error;
        }
        const savedShop = await newShop.save();
        if (!savedShop) {
          const error = new Error("ERROR OCCURED | COULD NOT BE REGISTERED");
          error.statusCode = 500;
          throw error;
        }
        res.status(201).json({
          message:
            "AN ACTIVATION LINK WAS SENT TO YOUR EMAIL, CHECK YOUR MAIL BOX",
        });
      } catch (error) {
        return next(error);
      }
    });
  } catch (error) {
    next(error);
  }
};
exports.getVerification = async (req, res, next) => {
  const { token } = req.params;
  try {
    const foundShop = await Shop.findOne({
      verificationToken: token,
      verificationTokenExpiration: { $gt: Date.now() },
    });
    if (!foundShop) {
      return res.send(
        "<h2 style='color: red'>ACTIVATION LINK EXPIRED Or NOT FOUND</h2>"
      );
    }
    const verifiedShop = foundShop;
    verifiedShop.verification = true;
    verifiedShop.verificationToken = undefined;
    verifiedShop.verificationTokenExpiration = undefined;
    const verifiedSavedShop = await verifiedShop.save();
    if (!verifiedSavedShop) {
      return res.send("<h2 style='color: red'>SHOP NOT ACTIVATED</h2>");
    }
    return res.send(
      `<h1 style="color: lightblue">SHOP ACTIVATED SUCCESSFULLY</h1>
        <h2>YOU CAN PRESS THE LOGIN BUTTON TO USE YOUR ACCOUNT</h2>
        or the <a href="https://smartfleek.web.app/login">Link to login</a>
      `
    );
  } catch (error) {
    next(error);
  }
};

// CUSTOMER
exports.postCustomerRegister = async (req, res, next) => {
  const email = req.body.email.toLowerCase();
  const password = req.body.password;
  const username = req.body.username;
  const mobile = req.body.mobile;
  Customer.findOne({ email: email })
    .then(async (customer) => {
      if (customer) {
        return res.json({
          message: "CUSTOMER EXIST, USE other EMAIL",
          success: false,
        });
      }
      const shopUser = await Shop.findOne({ email: email });
      if (shopUser) {
        return res.json({
          message: "EMAIL USED for other services, USE other EMAIL",
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
  const email = req.body.email.toLowerCase();
  const password = req.body.password;
  Customer.findOne({ email: email })
    .then((user) => {
      if (!user) {
        Shop.findOne({ email: email, verification: true })
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
          return res.status(200).json({
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
