"use strict";

var path = require('path');

var Recipe = require('../models/recipe');

var express = require('express');

var adminController = require('../controllers/admin-controller'); //or whatever controller you'll be using


var _require = require('express-validator'),
    check = _require.check,
    body = _require.body;

var isAuth = require('../middleware/is-auth');

var router = express.Router();
router.get('/myrecipes', isAuth, adminController.getRecipes);
router.get('/add-recipe', isAuth, adminController.getAddRecipe);
router.post('/add-recipe', isAuth, adminController.postAddRecipe);
router.post('/add-another', isAuth, adminController.postAddAnother);
router.post('/edit-recipe', isAuth, adminController.postEditRecipe);
router.get('/edit-recipe/:recipeId', isAuth, adminController.getEditRecipe);
router.get('/add-favorite/:recipeId/:destination', isAuth, adminController.getAddFavorite);
router.get('/remove-favorite/:recipeId/:destination', isAuth, adminController.getRemoveFavorite);
router.get('/faves', isAuth, adminController.getFavorites);
router.post('/delete-recipe', adminController.postDeleteRecipe);
router.post('/addendum', isAuth, adminController.postAddendum);
module.exports = router;