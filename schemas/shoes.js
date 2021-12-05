const { ObjectId } = require('bson');
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
  shoePrice: {
    type: String,
    // required: true,
  },
  thumbnail: {
    type: String,
  },
  buying_cost: {
    type: Number,
    // required: true,
  },
  buyingDate: {
    type: Date,
    // required: true,
  },
  selling_cost: {
    type: Number,
  },
  selling_date: {
    type: Date,
  },
  styleID: {
    type: String,
  },
  retailPrice: {
    type: String,
  },
  resellPrice: {
    type: String,
  },
  createAt: {
    type: Date,
    default: Date.now,
  },
});

const Shoes = mongoose.model('Shoes', shoesSchema);

module.exports = { Shoes };
