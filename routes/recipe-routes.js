const path = require('path');

const express = require('express');

const recipeController = require('../controllers/recipe-controller');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

router.get('/', recipeController.getIndex);

router.get('/recipes', recipeController.getRecipes);

// router.get('/products/:productId', shopController.getProduct);

// router.get('/cart', isAuth, shopController.getCart);

// router.post('/cart', isAuth, shopController.postCart);

// router.post('/cart-delete-item', isAuth, shopController.postCartDeleteProduct);

// router.post('/create-order', isAuth, shopController.postOrder);

// router.get('/orders', isAuth, shopController.getOrders);

module.exports = router;