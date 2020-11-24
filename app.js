const express = require("express");
const mongoose = require("mongoose");

const app = express();
require("dotenv").config();

const PORT = process.env.PORT;
const MONGODB_URI = process.env.MONGODB_URI;

app.use("/", (req, res, next) => {
  res.send("Welcome to Smarfleek Backend");
});

const mongooseOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};
mongoose
  .connect(MONGODB_URI, mongooseOptions)
  .then((result) => {
    console.log("Connected to DB");
    app.listen(PORT, () => {
      console.log("Server running on PORT: " + PORT);
    });
  })
  .catch((err) => console.log(err));
