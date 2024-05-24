const mongoose = require('mongoose');

const AdressSchema = new mongoose.Schema({
  fullAddress: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  pincode: { type: String, required: true },
  landmark: { type: String }
});

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  signupTime: { type: Number, default: Date.now },
  lastLogin: { type: Number, default: null },
  addresses: [AdressSchema]
});

// Create a User model
const User = mongoose.model('User', userSchema);

module.exports = User;