"use strict";

var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var addendumSchema = new Schema({
  addendum: {
    type: String,
    required: true
  },
  recipeId: {
    type: Schema.Types.ObjectId,
    ref: 'Recipe',
    required: true
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});
module.exports = mongoose.model('Addendum', addendumSchema);