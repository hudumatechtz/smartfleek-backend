const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const multer = require("multer");
const cookieParser = require("cookie-parser");
const path = require("path");
// const session = require("express-session");
// const mongoDbStore = require("connect-mongodb-session")(session);

const app = express();
require("dotenv").config();
// mongoose.set('bufferCommands', false);

// MODELS
// const Customer = require("./models/customer");
// const Shop = require("./models/shop");

// ROUTES IMPORTS
const authRoute = require("./routes/auth-route");
const shopRoute = require("./routes/shop-route");
const productRoute = require("./routes/product-route");

// OBJECT
const PORT = process.env.PORT;
const MONGODB_URI = process.env.MONGODB_URI;
const mongooseOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg"
  ) {
    return cb(null, true);
  }
  cb(null, false);
};

const diskStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "assets/images");
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString() + "-" + file.originalname);
  },
});
const images = [];
// const store = new mongoDbStore(
//   {
//     uri: MONGODB_URI,
//     collection: "session",
//   },
//   (err) => {}
// );

// MIDDLEWARES
// app.use(express.urlencoded({extended: false}))
app.use(bodyParser.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(
  "/assets/images",
  express.static(path.join(__dirname + "assets/images"))
);
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, X-Requested-With, Authorization"
  );
  // res.setHeader('Access-Control-Allow-Credentials', true)
  next();
});
app.use(
  multer({ storage: diskStorage, fileFilter: fileFilter }).single("image")
  // multer({ storage: diskStorage, fileFilter: fileFilter }).array("images", 6)
);
// app.use(
//   session({
//     secret: "callback wizard",
//     resave: false,
//     saveUninitialized: false,
//     store: store,
//   })
// );
// app.use((req, res, next) => {
//   if (!req.session.customer && !req.session.shop) {
//     return next();
//   }
//   Customer.findById(req.session.customer._id)
//     .then((customer) => {
//       if (!customer) {
//         Shop.findById(req.session.shop._id).then((shop) => {
//           if (!shop) next();
//           req.shop = shop;
//           next();
//         });
//       }
//       req.customer = customer;
//       next();
//     })
//     .catch((err) => {next(err);});
// });

//ROUTES USAGE
app.use("/account", authRoute);
app.use("/shop/", shopRoute);
app.use(productRoute);

app.use("/", (req, res, next) => {
  res.send("Welcome to Smarfleek Backend");
});
app.use((err, req, res, next) => {
  const status = err.statusCode || 500;
  const message = err._message ? err._message : err.message;
  if (err != null) {
    res.status(status).json({ message: message });
  }
  // DISPLAY ERROR MESSAGE DURING DEVELOPMENT
  console.log(err);
  next();
});

mongoose
  .connect(MONGODB_URI, mongooseOptions)
  .then((result) => {
    app.listen(PORT, (err) => {
      if (err) {
        console.log(err);
        return;
      }
      console.log("Server running on PORT: " + PORT);
    });
  })
  .catch((err) => {
    console.log("Error occured to DB");
    console.log(err);
    app.listen(PORT, null, (err) => {
      if (err) {
        console.log(err);
        return;
      }
      console.log("Server running without DB");
    });
  });
