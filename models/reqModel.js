const mongoose = require('mongoose');

const reqSchema = new mongoose.Schema({
  name: {
      type: String,
      //required: true,
      //unique: true,
  },
  service:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service',
  },
  user:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
});



const Req = mongoose.model('Request', reqSchema);

module.exports = Req;
