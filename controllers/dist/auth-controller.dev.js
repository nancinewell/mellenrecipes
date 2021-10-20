"use strict";

var User = require('../models/user');

var bcrypt = require('bcryptjs');

var nodemailer = require('nodemailer');

var sendgridTransport = require('nodemailer-sendgrid-transport');

var crypto = require('crypto');

var _require = require('express-validator/check'),
    validationResult = _require.validationResult;

var transporter = nodemailer.createTransport(sendgridTransport({
  auth: {
    api_key: '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'
  }
}));

exports.getLogin = function (req, res, next) {
  var message = req.flash('error');

  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }

  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Log In',
    isAuthenticated: false,
    errorMessage: message,
    oldInput: {
      email: "",
      password: ""
    },
    validationErrors: []
  });
};