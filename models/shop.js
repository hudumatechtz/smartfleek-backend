const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const shopSchema = new Schema({});

module.exports = mongoose.model('Shop', shopSchema);