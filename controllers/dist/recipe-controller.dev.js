"use strict";

function _templateObject() {
  var data = _taggedTemplateLiteral(["Search Results: ", ""]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var Recipe = require('../models/recipe');

var Addendum = require('../models/addendum');

var mongoose = require('mongoose');

exports.getRecipes = function (req, res, next) {
  Recipe.find().sort('category').then(function (recipes) {
    console.log(recipes);
    res.render('recipes', {
      recipes: recipes,
      pageTitle: 'All recipes',
      path: '/recipes',
      isAuthenticated: req.session.isLoggedIn
    });
  })["catch"](function (err) {
    console.log(err);
  });
}; // exports.getIndex = (req, res, next) => {
//   Recipe.find()
//     .then(recipes => {
//       res.render('recipes/index', {
//         prods: recipes,
//         pageTitle: 'Recipes',
//         path: '/'
//       });
//     })
//     .catch(err => {
//       console.log(err);
//     });
// };
// * * * * * * * * * * * * * * INDEX * * * * * * * * * * * * * *


exports.getIndex = function (req, res, next) {
  //get all products from db and render in index
  if (!req.user) {
    Recipe.find().sort('category').then(function (recipes) {
      res.render('recipes/index', {
        recipes: recipes,
        pageTitle: 'Mellen Family Recipes',
        path: '/'
      });
    })["catch"](function (err) {
      var error = new Error(err);
      error.httpStatusCode = 500;
      console.log("getIndex err !user ".concat(err));
      return next(error);
    });
  } else {
    Recipe.find().sort('category').then(function (recipes) {
      res.render('recipes/index-user', {
        recipes: recipes,
        pageTitle: 'Mellen Family Recipes',
        path: '/',
        user: req.user
      });
    })["catch"](function (err) {
      var error = new Error(err);
      error.httpStatusCode = 500;
      console.log("getIndex err user ".concat(err));
      return next(error);
    });
  }
}; // * * * * * * * * * * * * * * GET RECIPE * * * * * * * * * * * * * *


exports.getRecipe = function _callee(req, res, next) {
  var recipeId, addendums;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          recipeId = req.params.recipeId.toString();
          console.log("getRecipe - pre-actions");
          _context.next = 4;
          return regeneratorRuntime.awrap(Addendum.find({
            recipeId: recipeId
          }).populate("userId"));

        case 4:
          addendums = _context.sent;
          console.log("getRecipe - addendums retrieved");
          console.log(addendums);
          Recipe.findById(recipeId).sort('category').then(function (recipe) {
            recipe.ingredients.replace(/\n/g, '<br/>');
            res.render('recipes/details', {
              recipe: recipe,
              addendums: addendums,
              pageTitle: 'Mellen Family Recipes',
              path: '/'
            });
          });

        case 8:
        case "end":
          return _context.stop();
      }
    }
  });
}; // * * * * * * * * * * * * * * SEARCH * * * * * * * * * * * * * *


exports.getSearch = function (req, res, next) {
  res.render('recipes/search', {
    pageTitle: 'Search',
    path: '/search'
  });
};

exports.postSearch = function (req, res, next) {
  var search = req.body.search;
  console.log("search term: ".concat(search));
  Recipe.find({
    $or: [{
      "name": {
        $regex: '.*' + search + '.*',
        $options: 'i'
      }
    }, {
      "ingredients": {
        $regex: '.*' + search + '.*',
        $options: 'i'
      }
    }, {
      "directions": {
        $regex: '.*' + search + '.*',
        $options: 'i'
      }
    }, {
      "category": {
        $regex: '.*' + search + '.*',
        $options: 'i'
      }
    }, {
      "description": {
        $regex: '.*' + search + '.*',
        $options: 'i'
      }
    }]
  }).sort('category').then(function (recipes) {
    console.log(_templateObject(), recipes);

    if (!req.user) {
      res.render('recipes/index', {
        recipes: recipes,
        pageTitle: 'Search Results',
        path: '/'
      });
    } else {
      res.render('recipes/index-user', {
        recipes: recipes,
        pageTitle: 'Search Results',
        path: '/',
        user: req.user
      });
    }
  })["catch"](function (err) {
    var error = new Error(err);
    error.httpStatusCode = 500;
    console.log("postSearch catch: ".concat(err));
    return next(error);
  });
};