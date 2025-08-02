const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address'],
  },
  username: {
    type: String,
    unique: true,
    sparse: true, // Allows null/undefined values to be unique
  },
  password: {
    type: String,
    required: true,
  },
  dateOfBirth: {
    type: Date,
  },
  country: {
    type: String,
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other', 'prefer-not-to-say'],
  },
  profileComplete: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model('User', userSchema); 