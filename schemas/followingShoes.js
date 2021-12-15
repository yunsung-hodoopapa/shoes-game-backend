const { ObjectId } = require('bson');
const mongoose = require('mongoose');

const { Schema } = mongoose;

const followingshoesSchema = new Schema({
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
  styleID: {
    type: String,
  },
  retailPrice: {
    type: String,
  },
  resellPrice: {
    type: String,
  },
  lowestResellPrice: {
    type: Object,
  },
  createAt: {
    type: Date,
    default: Date.now,
  },
});

const FollowingShoes = mongoose.model('FollowingShoes', followingshoesSchema);

module.exports = { FollowingShoes };
