"use strict";

var Recipe = require('../models/recipe');

var _require = require('express-validator'),
    validationResult = _require.validationResult;

exports.getAddRecipe = function (req, res, next) {
  res.render('admin/edit-recipe', {
    pageTitle: 'Add Recipe',
    path: '/admin/add-recipe',
    editing: false,
    isAuthenticated: req.session.isLoggedIn,
    hasError: false,
    errorMessage: null //or isAuthenticated: req.session.user;

  });
};