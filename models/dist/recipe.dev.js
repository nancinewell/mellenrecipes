"use strict";

var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var recipeSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  ingredients: [{
    ingredient: {
      type: String,
      required: true
    },
    quantity: {
      type: String,
      required: true
    }
  }],
  description: {
    type: String,
    required: false
  },
  imageUrl: {
    type: String,
    required: false
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});
module.exports = mongoose.model('Recipe', recipeSchema);