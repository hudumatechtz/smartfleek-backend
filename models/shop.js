const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const shopModel = new Schema({
  // PERSONAL DETAILS
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  mobileNumber: {
    type: Number,
    required: true,
  },
  // BUSSINESS DETAILS
  shopName: {
    type: String,
    required: true,
  },
  shopCategory: {
    type: String,
    required: true,
  },
  shopRegion: {
    type: String,
    required: true,
  },
  shopLocation: {
    type: String,
    required: true,
  },

  //   LOGIN DETAILS
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
}, {timestamps: true});

module.exports = mongoose.model("Shop", shopModel);
