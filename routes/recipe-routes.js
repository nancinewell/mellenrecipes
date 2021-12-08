const path = require('path');

const express = require('express');

const recipeController = require('../controllers/recipe-controller');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

router.get('/', recipeController.getIndex);

router.get('/recipes', recipeController.getRecipes);

router.get('/recipes/search', recipeController.getSearch);

router.post('/recipes/search', recipeController.postSearch);

router.get('/recipes/:recipeId', recipeController.getRecipe);

module.exports = router;