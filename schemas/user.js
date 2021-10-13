const mongoose = require('mongoose');

const { Schema } = mongoose;

const userSchema = new Schema({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
    unique: true,
  },
  provider: {
    type: String,
    required: true,
  },
  last_login_date: {
    type: Date,
    required: true,
  },
}, {
  timestamps: true,
});

module.exports = mongoose('User', userSchema);
