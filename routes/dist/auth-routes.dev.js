"use strict";

var express = require('express');

var _require = require('express-validator'),
    check = _require.check,
    body = _require.body;

var authController = require('../controllers/auth-controller');

var User = require('../models/user');

var router = express.Router();
router.get('/login', authController.getLogin);
router.get('/signup', authController.getSignup);
router.post('/login', [body('email').isEmail().withMessage('Please enter a valid email').trim()], authController.postLogin);
router.post('/signup', [body('email').isEmail().withMessage('Please enter a valid email').trim().custom(function (value) {
  return User.findOne({
    where: {
      email: value
    }
  }).then(function () {
    return Promise.reject('A user has already signed up with that email address.');
  });
})], authController.postSignup);
router.post('/logout', authController.postLogout);
router.get('/reset', authController.getReset);
router.get('/reset/:token', authController.getNewPassword);
router.post('/reset', [body('email').isEmail().withMessage('Please enter a valid email').trim()], authController.postReset);
router.post('/security-questions', authController.postSecurityQuestions);
router.post('/new-password', [body('confirmPassword').custom(function (value, _ref) {
  var req = _ref.req;

  if (value != req.body.password) {
    throw new Error('Passwords have to match!');
  }

  return true;
}), body('password', "Passwords must be at least 8 characters long.").isLength({
  min: 8
})], authController.postNewPassword);
module.exports = router;