const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  name: {
      type: String,
      required: true,
      unique: true,
  },
  image: [String],
  desc:String,
  title:String,
  user:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  price: {type:String, required: true},
  point: {type:String, required: true}
});


const Service = mongoose.model('Service', serviceSchema);

module.exports = Service;
