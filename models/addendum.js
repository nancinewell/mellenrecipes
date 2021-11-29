const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const addendumSchema = new Schema({
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
