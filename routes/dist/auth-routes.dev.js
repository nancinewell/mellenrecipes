"use strict";

var express = require('express');

var _require = require('express-validator'),
    check = _require.check,
    body = _require.body;

var authController = require('../controllers/auth-controller');

var User = require('../models/user');

var router = express.Router();
router.get('/login', authController.getLogin);
module.exports = router;