const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require('body-parser');

const app = express();
require("dotenv").config();

const authRoute = require('./routes/auth-route');

const PORT = process.env.PORT;
const MONGODB_URI = process.env.MONGODB_URI;
const mongooseOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

// MIDDLEWARES
// app.use(express.urlencoded({extended: false}))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}));
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Requested-With');
  // res.setHeader('Access-Control-Allow-Credentials', true)
  next();
});

app.use('/account', authRoute);

app.use("/", (req, res, next) => {
  res.send("Welcome to Smarfleek Backend");
});
app.use((err, req, res, next) => {
  const status = err.statusCode || 500;
  const message = err.message;
  if(err != null){
    res.status(status).json({message: message});
  }
  // DISPLAY ERROR MESSAGE DURING DEVELOPMENT
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
