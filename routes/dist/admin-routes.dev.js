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
router.get('/add-recipe', isAuth, adminController.getAddRecipe);
module.exports = router;