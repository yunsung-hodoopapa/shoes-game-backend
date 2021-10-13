const mongoose = require('mongoose');

const { Schema } = mongoose;

const closetSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model('Closet', closetSchema);
