"use strict";

function _templateObject2() {
  var data = _taggedTemplateLiteral(["", ""]);

  _templateObject2 = function _templateObject2() {
    return data;
  };

  return data;
}

function _readOnlyError(name) { throw new Error("\"" + name + "\" is read-only"); }

function _templateObject() {
  var data = _taggedTemplateLiteral(["", ""]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var Recipe = require('../models/recipe');

var User = require('../models/user');

var Addendum = require('../models/addendum');

var _require = require('express-validator'),
    validationResult = _require.validationResult;

var mongoose = require('mongoose');

var _require2 = require('../models/recipe'),
    findById = _require2.findById;

var allCategories = []; // * * * * * * * * * * * * * * GET RECIPES * * * * * * * * * * * * * *

exports.getRecipes = function (req, res, next) {
  //get all recipes from db
  Recipe.find({
    userId: req.user._id
  }).then(function (recipes) {
    //render the page using those recipes
    res.render('admin/myrecipes', {
      recipes: recipes,
      pageTitle: 'My Recipes',
      path: '/admin/myrecipes',
      user: req.user
    });
  })["catch"](function (err) {
    var error = new Error(err);
    error.httpStatusCode = 500;
    console.log('getRecipes Recipe.find Catch ${err}');
    return next(error);
  });
}; // * * * * * * * * * * * * * * GET ADD RECIPE * * * * * * * * * * * * * *


exports.getAddRecipe = function _callee(req, res, next) {
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return regeneratorRuntime.awrap(getCategories());

        case 2:
          res.render('admin/edit-recipe', {
            pageTitle: 'Add Recipe',
            path: '/admin/add-recipe',
            editing: false,
            isAuthenticated: req.session.isLoggedIn,
            categories: allCategories,
            hasError: false,
            errorMessage: null,
            validationErrors: [] //or isAuthenticated: req.session.user;

          });

        case 3:
        case "end":
          return _context.stop();
      }
    }
  });
};

function getCategories() {
  return regeneratorRuntime.async(function getCategories$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.next = 2;
          return regeneratorRuntime.awrap(Recipe.find().distinct("category").then(function (categories) {
            allCategories = categories;
            allCategories.sort();
          }));

        case 2:
        case "end":
          return _context2.stop();
      }
    }
  });
} // * * * * * * * * * * * * * * POST ADD RECIPE * * * * * * * * * * * * * *


exports.postAddRecipe = function (req, res, next) {
  //gather new Recipe info from req
  var name = req.body.name;
  var image = req.file;
  var ingredients = req.body.ingredients;
  var directions = req.body.directions;
  var description = req.body.description;
  var category = req.body.category;
  var newCategory = req.body.newCategory;

  if (category == "newCategory") {
    category = newCategory;
  }

  if (!req.file) {
    image = "";
  } //handle validation errors


  var errors = validationResult(req);

  if (!errors.isEmpty()) {
    console.log(_templateObject(), errors.array());
    return res.status(422).render('admin/edit-recipe', {
      pageTitle: 'Add Recipe',
      path: '/admin/add-recipe',
      editing: false,
      hasError: true,
      user: req.user,
      isAuthenticated: false,
      errorMessage: errors.array()[0].msg,
      recipe: {
        name: name,
        ingredients: ingredients,
        description: description
      },
      validationErrors: errors.array()
    });
  } //create new recipe in db


  var recipe = new Recipe({
    name: name,
    ingredients: ingredients,
    directions: directions,
    description: description,
    imageUrl: image.filename,
    category: category,
    userId: req.user
  }); //Save new recipe.   .save() is native to mongoose. 

  recipe.save().then(function (result) {
    //log success and redirect to admin recipes
    console.log('Created Recipe');
    res.redirect('/admin/myrecipes');
  })["catch"](function (err) {
    console.log("postAddRecipe err: ".concat(err));
    return res.status(422).render('admin/edit-recipe', {
      pageTitle: 'Add Recipe',
      path: '/admin/add-recipe',
      editing: false,
      user: req.user,
      isAuthenticated: false,
      errorMessage: [],
      hasError: false,
      recipe: {
        name: name,
        ingredients: ingredients,
        directions: directions,
        description: description
      },
      validationErrors: errors.array()
    });
  });
};

exports.postAddAnother = function (req, res, next) {
  //gather new Recipe info from req
  var name = req.body.name;
  var image = req.file;
  var ingredients = req.body.ingredients;
  var directions = req.body.directions;
  var description = req.body.description;
  var category = req.body.category;
  var newCategory = req.body.newCategory;

  if (!req.file) {
    image = "";
  }

  if (category == "newCategory") {
    category = (_readOnlyError("category"), newCategory);
  } //handle validation errors


  var errors = validationResult(req);

  if (!errors.isEmpty()) {
    console.log(_templateObject2(), errors.array());
    return res.status(422).render('admin/edit-recipe', {
      pageTitle: 'Add Recipe',
      path: '/admin/add-recipe',
      editing: false,
      hasError: true,
      user: req.user,
      isAuthenticated: false,
      errorMessage: errors.array()[0].msg,
      recipe: {
        name: name,
        ingredients: ingredients,
        description: description
      },
      validationErrors: errors.array()
    });
  } //create new recipe in db


  var recipe = new Recipe({
    name: name,
    ingredients: ingredients,
    directions: directions,
    description: description,
    category: category,
    imageUrl: image.filename,
    userId: req.user
  }); //Save new recipe.   .save() is native to mongoose. 

  recipe.save().then(function (result) {
    //log success and redirect to admin recipes
    console.log('Created Recipe');
    res.redirect('/admin/add-recipe');
  })["catch"](function (err) {
    console.log("postAddRecipe err: ".concat(err));
    return res.status(422).render('admin/edit-recipe', {
      pageTitle: 'Add Recipe',
      path: '/admin/add-recipe',
      editing: false,
      user: req.user,
      isAuthenticated: false,
      errorMessage: [],
      hasError: false,
      recipe: {
        name: name,
        ingredients: ingredients,
        directions: directions,
        description: description
      },
      validationErrors: errors.array()
    });
  });
}; // * * * * * * * * * * * * * * GET EDIT RECIPE * * * * * * * * * * * * * *


exports.getEditRecipe = function _callee2(req, res, next) {
  var editMode, recipeId;
  return regeneratorRuntime.async(function _callee2$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.next = 2;
          return regeneratorRuntime.awrap(getCategories());

        case 2:
          //Is the user in edit mode? Only allow access if in edit mode.
          editMode = req.query.edit; //if not in edit mode, redirect Home

          if (editMode) {
            _context3.next = 5;
            break;
          }

          return _context3.abrupt("return", res.redirect('/'));

        case 5:
          //gather recipe id from params and locate recipe 
          recipeId = req.params.recipeId;
          Recipe.findById(recipeId).then(function (recipe) {
            //if no recipe, redirect Home
            if (!recipe) {
              return res.redirect('/');
            } //if recipe found, send to edit recipe with recipe info


            res.render('admin/edit-recipe', {
              pageTitle: 'Edit recipe',
              path: '/admin/edit-recipe',
              editing: editMode,
              recipe: recipe,
              hasError: false,
              user: req.user,
              categories: allCategories,
              errorMessage: "",
              validationErrors: []
            });
          })["catch"](function (err) {
            var error = new Error(err);
            error.httpStatusCode = 500;
            console.log('admin-controller 131');
            return next(error);
          });

        case 7:
        case "end":
          return _context3.stop();
      }
    }
  });
}; // * * * * * * * * * * * * * * POST EDIT RECIPE * * * * * * * * * * * * * *


exports.postEditRecipe = function (req, res, next) {
  //gather new Recipe info from req
  var updatedName = req.body.name;
  var image = req.file;
  var updatedIngredients = req.body.ingredients;
  var updatedDirections = req.body.directions;
  var updatedDescription = req.body.description;
  var updatedCategory = req.body.category;
  var recipeId = req.body.recipeId;
  var newCategory = req.body.newCategory;

  if (updatedCategory == "newCategory") {
    updatedCategory = newCategory;
  }

  if (!req.file) {
    image = "";
    console.log("postEditRecipe image=\"\"");
  }

  console.log("postEditRecipe- gathered new info.");
  Recipe.findById(recipeId).then(function (recipe) {
    console.log("postEditRecipe- found recipe"); //if user is not the owner of the recipe, then redirect to home.

    if (recipe.userId.toString() !== req.user._id.toString()) {
      console.log("postEditRecipe- invalid user");
      return res.redirect('/');
    } //update recipe info


    recipe.name = updatedName;
    recipe.ingredients = updatedIngredients;
    recipe.description = updatedDescription;
    recipe.directions = updatedDirections;
    recipe.category = updatedCategory;

    if (image) {
      recipe.imageUrl = image.filename;
    }

    return recipe.save().then(function (result) {
      console.log("Updated recipe!");
      res.redirect('/admin/myrecipes');
    })["catch"](function (err) {
      var error = new Error(err);
      error.httpStatusCode = 500;
      console.log("postEditRecipe-save catch: ".concat(err));
      return next(error);
    });
  });
}; // * * * * * * * * * * * * * * FAVORITES * * * * * * * * * * * * * *


exports.getAddFavorite = function (req, res, next) {
  var user = req.user;
  var id = req.params.recipeId;
  var destination = req.params.destination;

  if (destination == "index") {
    destination = "/";
  } else {
    destination = '/admin/' + destination;
  }

  user.favorites.push(id);
  user.save().then(function (results) {
    console.log("".concat(user.name, ".favorites ").concat(user.favorites));
    res.redirect(destination);
  })["catch"](function (err) {
    var error = new Error(err);
    error.httpStatusCode = 500;
    console.log("getAddFavorites user.save error: ".concat(err));
    return next(error);
  });
};

exports.getRemoveFavorite = function (req, res, next) {
  var user = req.user;
  var id = req.params.recipeId;
  var destination = req.params.destination;

  if (destination == "index") {
    destination = "/";
  } else {
    destination = '/admin/' + destination;
  }

  console.log("In getRemoveFavorite");

  for (var i = 0; i < user.favorites.length; i++) {
    console.log("in for loop ".concat(i, "; favorites[i]: ").concat(user.favorites[i], "; id: ").concat(id));

    if (user.favorites[i].toString() == id.toString()) {
      user.favorites.splice(i, 1);
      console.log("Removed [i]");
    }
  }

  user.save().then(function (results) {
    console.log("".concat(user.name, ".favorites. ").concat(user.favorites));
    res.redirect(destination);
  })["catch"](function (err) {
    var error = new Error(err);
    error.httpStatusCode = 500;
    console.log("getRemoveFavorite user.save error: ".concat(err));
    return next(error);
  });
};

exports.getFavorites = function _callee3(req, res, next) {
  var user;
  return regeneratorRuntime.async(function _callee3$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          user = req.user;
          User.findById(user).populate("favorites").then(function (result) {
            res.render('admin/faves', {
              recipes: result.favorites,
              pageTitle: 'My Favorite Recipes',
              path: '/admin/faves',
              user: req.user
            });
          });

        case 2:
        case "end":
          return _context4.stop();
      }
    }
  });
};

exports.postDeleteRecipe = function (req, res, next) {
  var recipeId = req.body.recipeId; //locate the product and delete with native function

  Recipe.deleteOne({
    _id: recipeId,
    userId: req.user._id
  }).then(function () {
    //log success and redirect to admin recipes
    console.log('DESTROYED RECIPE');
    res.redirect('/admin/myrecipes');
  })["catch"](function (err) {
    // res.redirect('/');
    var error = new Error(err);
    error.httpStatusCode = 500;
    console.log('postDeleteRecipe catch');
    return next(error);
  });
};

exports.postAddendum = function (req, res, next) {
  var recipeId = req.body.recipeId;
  var userId = req.user;
  var add = req.body.addendum;
  var addendum = new Addendum({
    addendum: add,
    recipeId: recipeId,
    userId: userId
  }); //Save new addendum.   .save() is native to mongoose. 

  addendum.save().then(function (results) {
    console.log("".concat(userId.name, " submitted addendem for ").concat(recipeId));
    res.redirect("/recipes/".concat(recipeId));
  })["catch"](function (err) {
    // res.redirect('/');
    var error = new Error(err);
    error.httpStatusCode = 500;
    console.log('postAddendum catch');
    return next(error);
  });
}; // exports.getFavorites  = async (req, res, next) => {
//   //faveList = [];
//   const user = req.user;
//   const favorites = user.favorites.recipe;
//   console.log`user favorites: ${favorites}`;
//   for (favorite of favorites){
//     await findRecipe(favorite.recipeId);
//     console.log(`faveList in loop: ${faveList}`);
//   }
//   console.log`faveList: ${faveList}`;
//   //render the page using those recipes
//   res.render('admin/faves', {
//     recipes: faveList,
//     pageTitle: 'My Favorite Recipes',
//     path: '/admin/faves',
//     user: req.user
//   })
// }
// async function findRecipe(recipeId, user){
//   Recipe.findById(recipeId)
//     .then(recipe => {
//       faveList.push(recipe);
//       return;
//     })
//     .catch(err => {
//       console.log(`findRecipe catch ${err}`);
//     })
// }
// async function getFave(i){
//   Recipe.findById(mongoose.Types.ObjectId(i))
//     .then(recipe => {
//       faveList.push(recipe);
//       })
//     .catch(err => {
//       const error = new Error(err);
//       error.httpStatusCode = 500;
//       console.log(`getFaves Recipe.find catch ${err}`);
//       return;
//     })
// }