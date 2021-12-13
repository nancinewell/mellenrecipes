const path = require('path');
const Recipe = require('../models/recipe')
const express = require('express');
const adminController = require('../controllers/admin-controller');//or whatever controller you'll be using
const { check, body } = require('express-validator');
const isAuth = require('../middleware/is-auth');
const router = express.Router();

router.get('/myrecipes', isAuth, adminController.getRecipes);

router.get('/add-recipe', isAuth, adminController.getAddRecipe);

router.post('/add-recipe', isAuth,
[
    check('category').custom((value, {req}) => {
        if(!value){
            throw new Error("Please select a category for this recipe.");
        }
        return true;
    }),
    check('name').custom((value, {req}) =>{
        if(!value){
            throw new Error("Please give this recipe a name.");
        }
    }),
    check('ingredients').custom((value, {req}) =>{
        if(!value){
            throw new Error("Please list the ingredients used in this recipe.");
        }
    }),
    check('directions').custom((value, {req}) =>{
        if(!value){
            throw new Error("Please give this recipe some directions to follow.");
        }})
],
 adminController.postAddRecipe);

router.post('/add-another', isAuth, adminController.postAddAnother);

router.post('/edit-recipe', isAuth, adminController.postEditRecipe);

router.get('/edit-recipe/:recipeId', isAuth, adminController.getEditRecipe);

router.get('/add-favorite/:recipeId/:destination', isAuth, adminController.getAddFavorite);

router.get('/remove-favorite/:recipeId/:destination', isAuth, adminController.getRemoveFavorite);

router.get('/faves', isAuth, adminController.getFavorites);

router.post('/delete-recipe', adminController.postDeleteRecipe);

router.post('/addendum', isAuth, adminController.postAddendum);

module.exports = router;