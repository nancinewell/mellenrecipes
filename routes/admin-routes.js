const path = require('path');
const Recipe = require('../models/recipe')
const express = require('express');
const adminController = require('../controllers/admin-controller');//or whatever controller you'll be using
const { check, body } = require('express-validator');
const isAuth = require('../middleware/is-auth');
const router = express.Router();

router.get('/add-recipe', isAuth, adminController.getAddRecipe);

module.exports = router;