const mongoose = require('mongoose');

const productsSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: String,
  price: Number
});

modules.exports = mongoose.model('Product',productsSchema);
