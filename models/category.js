const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const categorySchema = new Schema({
    categories : {},
});

module.exports = mongoose.model('Category', categorySchema);