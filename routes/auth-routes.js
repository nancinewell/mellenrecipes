const express = require('express');

const { check, body } = require('express-validator');

const authController = require('../controllers/auth-controller');

const User = require('../models/user');

const router = express.Router();

router.get('/login', authController.getLogin);

module.exports = router;