const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
      type: String,
      required: true,
      unique: true,
  },
  image: [String],
  desc:String,
  title:String,
  price: {type:String, required: true},
  point: {type:String, required: true}
});


const Product = mongoose.model('Product', productSchema);

module.exports = Product;
