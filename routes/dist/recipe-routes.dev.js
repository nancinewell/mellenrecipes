"use strict";

var path = require('path');

var express = require('express');

var recipeController = require('../controllers/recipe-controller');

var isAuth = require('../middleware/is-auth');

var router = express.Router();
router.get('/', recipeController.getIndex);
router.get('/recipes', recipeController.getRecipes);
router.get('/recipes/search', recipeController.getSearch);
router.post('/recipes/search', recipeController.postSearch);
router.get('/recipes/:recipeId', recipeController.getRecipe);
module.exports = router;