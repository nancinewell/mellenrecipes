const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  resetToken: String,
  resetTokenExpiration: Date,
  securityQuestion1: {
    type: String,
    required: true
  },
  securityQuestion2: {
    type: String,
    required: true
  },
  securityQuestion3: {
    type: String,
    required: true
  },
  securityAnswer1: {
    type: String,
    required: true
  },
  securityAnswer2: {
    type: String,
    required: true
  },
  securityAnswer3: {
    type: String,
    required: true
  },
  favorites: [{
          type: Schema.Types.ObjectId,
          ref: 'Recipe',
          required: true
        }]
});


module.exports = mongoose.model('User', userSchema);