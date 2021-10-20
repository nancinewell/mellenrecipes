const Recipe = require('../models/recipe');
const { validationResult } = require('express-validator');

exports.getAddRecipe = (req, res, next) => {
    res.render('admin/edit-recipe', {
      pageTitle: 'Add Recipe',
      path: '/admin/add-recipe',
      editing: false,
      isAuthenticated: req.session.isLoggedIn,
      hasError: false,
      errorMessage: null
      //or isAuthenticated: req.session.user;
    });
  };