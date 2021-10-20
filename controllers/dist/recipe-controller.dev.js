"use strict";

var Recipe = require('../models/recipe');

exports.getRecipes = function (req, res, next) {
  Recipe.find().then(function (recipes) {
    console.log(recipes);
    res.render('recipe-list', {
      prods: recipes,
      pageTitle: 'All recipes',
      path: '/recipes',
      isAuthenticated: req.session.isLoggedIn
    });
  })["catch"](function (err) {
    console.log(err);
  });
};

exports.getIndex = function (req, res, next) {
  Recipe.find().then(function (recipes) {
    res.render('recipes/index', {
      prods: recipes,
      pageTitle: 'Recipes',
      path: '/'
    });
  })["catch"](function (err) {
    console.log(err);
  });
};