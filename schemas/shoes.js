const mongoose = require('mongoose');

const { Schema } = mongoose;

const shoesSchema = new Schema({
  shoeName: {
    type: String,
    required: true,
  },
  brandIds: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Brand',
    },
  ],
  shoeSize: {
    type: String,
    required: true,
  },
  color: {
    type: Number,
    // required: true,
  },
  thumbnail: {
    type: String,
  },
  buying_cost: {
    type: Number,
    // required: true,
  },
  buying_data: {
    type: Date,
    // required: true,
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
});

const Shoes = mongoose.model('Shoes', shoesSchema);

module.exports = { Shoes };
