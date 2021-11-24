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

exports.getRecipes = function (req, res, next) {
  Recipe.find().then(function (recipes) {
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
    Recipe.find().then(function (recipes) {
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
    Recipe.find().then(function (recipes) {
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


exports.getRecipe = function (req, res, next) {
  var recipeId = req.params.recipeId;
  Recipe.findById(recipeId).then(function (recipe) {
    recipe.ingredients.replace(/\n/g, '<br/>');
    res.render('recipes/details', {
      recipe: recipe,
      pageTitle: 'Mellen Family Recipes',
      path: '/'
    });
  });
}; // * * * * * * * * * * * * * * SEARCH * * * * * * * * * * * * * *

/* * * * * *  * * * *  * * *  * *  * *

THIS IS WHERE I"M WORKING!!!

* * * * * *  * * *  * * * * *  ** * *  */


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
      "description": {
        $regex: '.*' + search + '.*',
        $options: 'i'
      }
    }]
  }).then(function (recipes) {
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