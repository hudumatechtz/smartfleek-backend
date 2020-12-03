const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require('body-parser');

const app = express();
require("dotenv").config();

const authRoute = require('./routes/authRoute');

const PORT = process.env.PORT;
const MONGODB_URI = process.env.MONGODB_URI;
const mongooseOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

// MIDDLEWARES
// app.use(express.urlencoded({extended: false}))
app.use(bodyParser.urlencoded({extended: false}));

app.use('/account', authRoute);

app.use("/", (req, res, next) => {
  res.send("Welcome to Smarfleek Backend");
});
app.use((err, req, res, next) => {
  console.log(err);
  next();
});
mongoose
  .connect(MONGODB_URI, mongooseOptions)
  .then((result) => {
    console.log("Connected to DB");
    app.listen(PORT, () => {
      console.log("Server running on PORT: " + PORT);
    });
  })
  .catch((err) => console.log(err));
