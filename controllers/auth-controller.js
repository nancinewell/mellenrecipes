const User = require('../models/user');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');
const crypto = require('crypto');
const { validationResult } = require('express-validator/check');

const transporter = nodemailer.createTransport(sendgridTransport({
  auth: {
    api_key: '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'
  }
}));

exports.getLogin = (req, res, next) => {
    let message = req.flash('error');
    if(message.length>0){
      message = message[0];
    }else {
      message = null;
    }
    res.render('auth/login', {
          path: '/login',
          pageTitle: 'Log In',
          isAuthenticated: false,
          errorMessage: message,
          oldInput: {email: "", password: ""},
          validationErrors: []
        })
      };