const mongoose = require('mongoose');

const { Schema } = mongoose;

const shoesSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  brandIds: [{
    type: Schema.Types.ObjectId,
    ref: 'Brand',
  }],
  size: {
    type: String,
    required: true,
  },
  color: {
    type: Number,
    required: true,
  },
  thumbnail: {
    type: String,
  },
  buying_cost: {
    type: Number,
    required: true,
  },
  buying_data: {
    type: Date,
    required: true,
  },
  selling_cost: {
    type: Number,
  },
  selling_date: {
    type: Date,
  },
  createAt: {
    type: Date,
    default: Date.now,
  },
})

module.exports = mongoose.model('Shoes', shoesSchema);
