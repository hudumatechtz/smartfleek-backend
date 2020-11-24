const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const productSchema = new Schema({});

module.exports = mongoose.model('Product', productSchema);