"use strict";

function _templateObject3() {
  var data = _taggedTemplateLiteral(["auth-controller 268: ", ""]);

  _templateObject3 = function _templateObject3() {
    return data;
  };

  return data;
}

function _templateObject2() {
  var data = _taggedTemplateLiteral(["Errors line auth controller 147: ", ""]);

  _templateObject2 = function _templateObject2() {
    return data;
  };

  return data;
}

function _templateObject() {
  var data = _taggedTemplateLiteral(["", ""]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var User = require('../models/user');

var bcrypt = require('bcryptjs');

var nodemailer = require('nodemailer');

var sendgridTransport = require('nodemailer-sendgrid-transport');

var crypto = require('crypto');

var _require = require('express-validator/check'),
    validationResult = _require.validationResult;

require('dotenv').config();

var API_KEY = process.env.API_KEY;
var transporter = nodemailer.createTransport(sendgridTransport({
  auth: {
    api_key: API_KEY
  }
})); // * * * * * * * * * * GET LOGIN * * * * * * * * * * 

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
}; // * * * * * * * * * * POST LOGIN * * * * * * * * * * 


exports.postLogin = function (req, res, next) {
  //gather info from request
  var email = req.body.email;
  var password = req.body.password;
  var errors = validationResult(req);

  if (!errors.isEmpty()) {
    console.log(_templateObject(), errors.array());
    return res.status(422).render('auth/login', {
      path: '/login',
      pageTitle: 'Log In',
      isAuthenticated: false,
      errorMessage: errors.array()[0].msg,
      oldInput: {
        email: email
      },
      validationErrors: errors.array()
    });
  } //does the user exist? Compare by email


  User.findOne({
    email: email
  }).then(function (user) {
    //if email address is not in the system, send user back to login page with error message.
    if (!user) {
      return res.status(422).render('auth/signup', {
        path: '/login',
        pageTitle: 'Log In',
        isAuthenticated: false,
        errorMessage: "Email does not exist. Please sign up!",
        oldInput: {
          email: email
        },
        validationErrors: []
      });
    } //The email exists. Compare the hashed password in mongodb with the hashed password passed through the req.


    bcrypt.compare(password, user.password).then(function (theyMatch) {
      //if they match, then set the session info
      if (theyMatch) {
        req.session.user = user;
        req.session.isLoggedIn = true;
        console.log("".concat(req.session.user.name, " is logged in.")); //save the session, log any errors, and send Home

        return req.session.save(function (err) {
          console.log("postLogin req.session.save error: ".concat(err));
          res.redirect('/');
        });
      } //If they don't match, then send back to login page with error message.


      res.status(422).render('auth/login', {
        path: '/login',
        pageTitle: 'Log In',
        isAuthenticated: false,
        errorMessage: "Invalid email or password",
        oldInput: {
          email: email
        },
        validationErrors: []
      });
    }) //catch any errors, log them, and redirect to login page.
    ["catch"](function (err) {
      console.log("Error auth-controller 95: ".concat(err));
      res.redirect('/login');
    });
  })["catch"](function (err) {
    var error = new Error(err);
    error.httpStatusCode = 500;
    console.log('admin-controller 20');
    return next(error);
  });
}; // * * * * * * * * * * GET SIGNUP * * * * * * * * * * 


exports.getSignup = function (req, res, next) {
  //set message
  var message = req.flash('message');

  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  } //send to signup page with page info


  res.render('auth/signup', {
    path: '/signup',
    pageTitle: 'Sign Up',
    isAuthenticated: false,
    errorMessage: message,
    oldInput: {
      email: ""
    },
    validationErrors: []
  });
}; // * * * * * * * * * * POST SIGNUP * * * * * * * * * * 


exports.postSignup = function (req, res, next) {
  console.log('postSignup 1'); //gather info from form

  var name = req.body.name;
  var email = req.body.email;
  var password = req.body.password;
  var securityQuestion1 = req.body.securityQuestion1;
  var securityQuestion2 = req.body.securityQuestion2;
  var securityQuestion3 = req.body.securityQuestion3;
  var securityAnswer1 = req.body.securityAnswer1;
  var securityAnswer2 = req.body.securityAnswer2;
  var securityAnswer3 = req.body.securityAnswer3;
  var errors = validationResult(req);
  console.log("postSignup 2");

  if (!errors.isEmpty()) {
    console.log(_templateObject2(), errors.array());
    return res.status(422).render('auth/signup', {
      path: '/signup',
      pageTitle: 'Signup',
      isAuthenticated: false,
      errorMessage: errors.array()[0].msg,
      oldInput: {
        name: name,
        email: email,
        securityQuestion1: securityQuestion1,
        securityQuestion2: securityQuestion2,
        securityQuestion3: securityQuestion3,
        securityAnswer1: securityAnswer1,
        securityAnswer2: securityAnswer2,
        securityAnswer3: securityAnswer3
      },
      validationErrors: errors.array()
    });
  }

  console.log('postSignup 3');
  var hashedAnswer1, hashedAnswer2, hashedAnswer3; //If email doesn't exist, hash the password 12 times for good measure.

  bcrypt.hash(securityAnswer1, 12).then(function (hashedAnswer) {
    hashedAnswer1 = hashedAnswer;
    console.log('postSignup 4');
    bcrypt.hash(securityAnswer2, 12).then(function (hashedAnswer) {
      hashedAnswer2 = hashedAnswer;
      bcrypt.hash(securityAnswer3, 12).then(function (hashedAnswer) {
        hashedAnswer3 = hashedAnswer;
        console.log('postSignup 5');
        bcrypt.hash(password, 12) //then create a new user with the hashed password
        .then(function (hashedPassword) {
          console.log('postSignup 6');
          var user = new User({
            name: name,
            email: email,
            password: hashedPassword,
            favorites: [],
            securityQuestion1: securityQuestion1,
            securityQuestion2: securityQuestion2,
            securityQuestion3: securityQuestion3,
            securityAnswer1: hashedAnswer1,
            securityAnswer2: hashedAnswer2,
            securityAnswer3: hashedAnswer3
          }); //save the new user

          return user.save();
        }).then(function (result) {
          console.log('postSignup 7');
          res.render('auth/login', {
            path: '/login',
            pageTitle: 'Log In',
            isAuthenticated: false,
            errorMessage: "Thanks for signing up! ",
            oldInput: {
              email: email
            },
            validationErrors: []
          });
          console.log("Thanks for Signing Up!");
        })["catch"](function (err) {
          console.log('postSignup 8');
          var error = new Error(err);
          error.httpStatusCode = 500;
          console.log("auth-controller 197: ".concat(err));
          return next(error);
        });
      })["catch"](function (err) {
        console.log('postSignup 9');
        var error = new Error(err);
        error.httpStatusCode = 500;
        console.log("auth-controller 205: ".concat(err));
        return next(error);
      });
    })["catch"](function (err) {
      console.log('postSignup 10');
      var error = new Error(err);
      error.httpStatusCode = 500;
      console.log("auth-controller 224: ".concat(err));
      return next(error);
    });
  })["catch"](function (err) {
    console.log('postSignup 11');
    var error = new Error(err);
    error.httpStatusCode = 500;
    console.log("auth-controller 231: ".concat(err));
    return next(error);
  });
}; // * * * * * * * * * * POST LOGOUT * * * * * * * * * * 


exports.postLogout = function (req, res, next) {
  //destroy the session, log any errors, and redirect Home
  console.log("".concat(req.session.user.name, " is logged out."));
  req.session.destroy(function (err) {
    console.log("Error  postLogout: ".concat(err));
    res.redirect('/');
  });
}; // * * * * * * * * * * GET RESET * * * * * * * * * *


exports.getReset = function (req, res, next) {
  var message = req.flash('message');

  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }

  res.render('auth/reset', {
    path: '/reset',
    pageTitle: 'Reset Password',
    isAuthenticated: false,
    errorMessage: message
  });
}; // * * * * * * * * * * POST RESET * * * * * * * * * *


exports.postReset = function (req, res, next) {
  var errors = validationResult(req);
  var email = req.body.email;
  User.findOne({
    email: email
  }).then(function (user) {
    console.log("postReset user => email: ".concat(email));

    if (!user) {
      req.flash('message', "Sorry, no account found.");
      return res.redirect('/reset');
    }

    var securityQuestions = [user.securityQuestion1, user.securityQuestion2, user.securityQuestion3];
    res.render('auth/security-questions', {
      path: '/security-questions',
      pageTitle: 'Security Questions',
      isAuthenticated: false,
      errorMessage: "",
      securityQuestions: securityQuestions,
      oldInput: {
        securityAnswer1: "",
        securityAnswer2: "",
        securityAnswer3: ""
      },
      validationErrors: errors.array(),
      email: req.body.email
    });
  })["catch"](function (err) {
    var error = new Error(err);
    error.httpStatusCode = 500;
    console.log('auth-controller 313');
    return next(error);
  });
}; // * * * * * * * * * * POST SECURITY QUESTIONS * * * * * * * * * *


exports.postSecurityQuestions = function (req, res, next) {
  var email = req.body.email;
  var securityAnswer1 = req.body.securityAnswer1;
  var securityAnswer2 = req.body.securityAnswer2;
  var securityAnswer3 = req.body.securityAnswer3;
  var thisUser;
  crypto.randomBytes(32, function (err, buffer) {
    if (err) {
      return res.redirect('/reset');
    }

    var token = buffer.toString('hex');
    User.findOne({
      email: email
    }).then(function (user) {
      if (!user) {
        req.flash('message', "Sorry, no account found.");
        return res.redirect('/reset');
      }

      thisUser = user;
      bcrypt.compare(securityAnswer1, thisUser.securityAnswer1).then(function (theyMatch) {
        //if they match, then check the next answer
        if (theyMatch) {
          bcrypt.compare(securityAnswer2, thisUser.securityAnswer2).then(function (theyMatch) {
            //if they match, then check the next answer
            if (theyMatch) {
              bcrypt.compare(securityAnswer3, thisUser.securityAnswer3).then(function (theyMatch) {
                //if they match, then check the next answer
                if (theyMatch) {
                  thisUser.resetToken = token;
                  thisUser.resetExpiration = Date.now() + 3600000;
                  thisUser.save().then(function (result) {
                    return res.redirect("/reset/".concat(token));
                  });
                } else {
                  //If they don't match, then send back to login page with error message.
                  console.log("* * * * * * * auth-controller 324 * * * * * * * ");
                  res.status(422).render('auth/login', {
                    path: '/login',
                    pageTitle: 'Log In',
                    isAuthenticated: false,
                    errorMessage: "Invalid answer(s) to security questions.",
                    oldInput: {
                      email: email
                    },
                    validationErrors: []
                  });
                }
              });
            } else {
              //If they don't match, then send back to login page with error message.
              res.status(422).render('auth/login', {
                path: '/login',
                pageTitle: 'Log In',
                isAuthenticated: false,
                errorMessage: "Invalid answer(s) to security questions.",
                oldInput: {
                  email: email
                },
                validationErrors: []
              });
            }
          });
        } else {
          //If they don't match, then send back to login page with error message.
          res.status(422).render('auth/login', {
            path: '/login',
            pageTitle: 'Log In',
            isAuthenticated: false,
            errorMessage: "Invalid answer(s) to security questions.",
            oldInput: {
              email: email
            },
            validationErrors: []
          });
        }
      });
    });
  });
}; // * * * * * * * * * * GET NEW PASSWORD * * * * * * * * * *


exports.getNewPassword = function (req, res, next) {
  var token = req.params.token;
  User.findOne({
    resetToken: token,
    resetExpiration: {
      $gt: Date.now()
    }
  }).then(function (user) {
    var message = req.flash('message');

    if (message.length > 0) {
      message = message[0];
    } else {
      message = null;
    }

    res.render('auth/new-password', {
      path: '/new-password',
      pageTitle: 'New Password',
      isAuthenticated: false,
      errorMessage: message,
      userId: user._id.toString(),
      passwordToken: token
    });
  })["catch"](function (err) {
    var error = new Error(err);
    error.httpStatusCode = 500;
    console.log('auth-controller 261');
    return next(error);
  });
}; // * * * * * * * * * * POST NEW PASSWORD * * * * * * * * * *


exports.postNewPassword = function (req, res, next) {
  var newPassword = req.body.password;
  var userId = req.body.userId;
  var token = req.body.passwordToken;
  var errors = validationResult(req);
  var resetUser;
  User.findOne({
    resetToken: token,
    resetExpiration: {
      $gt: Date.now()
    },
    _id: userId
  }).then(function (user) {
    resetUser = user;

    if (!errors.isEmpty()) {
      console.log(_templateObject3(), errors.array());
      req.flash('message', errors.array()[0].msg); //res.redirect('/admin/edit-product/:prodId');

      return res.redirect("/reset/".concat(token));
    }

    bcrypt.hash(newPassword, 12).then(function (hashedPassword) {
      resetUser.password = hashedPassword;
      resetUser.resetToken = null;
      resetUser.resetExpiration = undefined;
      return resetUser.save();
    }).then(function (result) {
      req.flash('message', "Password reset. Please log in.");
      res.redirect('/login');
    });
  })["catch"](function (err) {
    var error = new Error(err);
    error.httpStatusCode = 500;
    console.log('auth-controller 302');
    return next(error);
  });
};