const User = require('../models/user');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');
const crypto = require('crypto');
const { validationResult } = require('express-validator/check');
require('dotenv').config();
const API_KEY = process.env.API_KEY;
const transporter = nodemailer.createTransport(sendgridTransport({
  auth: {
    api_key: API_KEY
  }
}));


// * * * * * * * * * * GET LOGIN * * * * * * * * * * 
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

// * * * * * * * * * * POST LOGIN * * * * * * * * * * 
exports.postLogin = (req, res, next) => {
  //gather info from request
  const email = req.body.email;
  const password = req.body.password;

  const errors = validationResult(req);

  if(!errors.isEmpty()){
      console.log`${errors.array()}`;
      return res.status(422).render('auth/login', {
        path: '/login',
        pageTitle: 'Log In',
        isAuthenticated: false,
        errorMessage: errors.array()[0].msg,
        oldInput: {email: email},
        validationErrors: errors.array()
      })
    }
  //does the user exist? Compare by email
  User.findOne({email: email})
      .then(user => {
          //if email address is not in the system, send user back to login page with error message.
          if(!user){
              return res.status(422).render('auth/signup', {
                  path: '/login',
                  pageTitle: 'Log In',
                  isAuthenticated: false,
                  errorMessage: "Email does not exist. Please sign up!",
                  oldInput: {email: email},
                  validationErrors: []
                })
          }

          //The email exists. Compare the hashed password in mongodb with the hashed password passed through the req.
          bcrypt.compare(password, user.password)
              .then(theyMatch => {
                  //if they match, then set the session info
                  if(theyMatch){
                      req.session.user = user;
                      req.session.isLoggedIn = true;
                      console.log(`${req.session.user.name} is logged in.`);
                      //save the session, log any errors, and send Home
                      return req.session.save((err) => {
                          console.log(`postLogin req.session.save error: ${err}`);
                          res.redirect('/');
                      });
                  }
                  //If they don't match, then send back to login page with error message.
                  res.status(422).render('auth/login', {
                      path: '/login',
                      pageTitle: 'Log In',
                      isAuthenticated: false,
                      errorMessage: "Invalid email or password",
                      oldInput: {email: email},
                      validationErrors: []
                    });
              })
              //catch any errors, log them, and redirect to login page.
              .catch(err => {
                  console.log(`Error auth-controller 95: ${err}`);
                  res.redirect('/login');
              })

      })
      .catch(err => {
          const error = new Error(err);
          error.httpStatusCode = 500;
          console.log('admin-controller 20');
          return next(error);
        });
  }

// * * * * * * * * * * GET SIGNUP * * * * * * * * * * 
exports.getSignup = (req, res, next) => {
  //set message
  let message = req.flash('message');
  if(message.length > 0){
      message = message[0];
  } else {
      message = null;
  }
  //send to signup page with page info
  res.render('auth/signup', {
      path: '/signup',
      pageTitle: 'Sign Up',
      isAuthenticated: false,
      errorMessage: message,
      oldInput: {email: ""},
      validationErrors: []
  });
};

// * * * * * * * * * * POST SIGNUP * * * * * * * * * * 
exports.postSignup = (req, res, next) => {
  console.log('postSignup 1');
  //gather info from form
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;
  const securityQuestion1 = req.body.securityQuestion1;
  const securityQuestion2 = req.body.securityQuestion2;
  const securityQuestion3 = req.body.securityQuestion3;
  const securityAnswer1 = req.body.securityAnswer1;
  const securityAnswer2 = req.body.securityAnswer2;
  const securityAnswer3 = req.body.securityAnswer3;
  const errors = validationResult(req);
console.log("postSignup 2");
  if(!errors.isEmpty()){
    console.log`Errors line auth controller 147: ${errors.array()}`;
    return res.status(422).render('auth/signup', {
      path: '/signup',
      pageTitle: 'Signup',
      isAuthenticated: false,
      errorMessage: errors.array()[0].msg,
      oldInput: { name: name, email: email, securityQuestion1: securityQuestion1, securityQuestion2: securityQuestion2, securityQuestion3: securityQuestion3, securityAnswer1: securityAnswer1, securityAnswer2: securityAnswer2, securityAnswer3: securityAnswer3 },
      validationErrors: errors.array()
    });
  }
  console.log('postSignup 3');
  let hashedAnswer1, hashedAnswer2, hashedAnswer3;
  //If email doesn't exist, hash the password 12 times for good measure.

  bcrypt.hash(securityAnswer1, 12)
      .then(hashedAnswer => {
          hashedAnswer1 = hashedAnswer;
          console.log('postSignup 4');
          bcrypt.hash(securityAnswer2, 12)
          .then(hashedAnswer => {
              hashedAnswer2 = hashedAnswer;
              bcrypt.hash(securityAnswer3, 12)
              .then(hashedAnswer => {
                  hashedAnswer3 = hashedAnswer;
                  console.log('postSignup 5');
                  bcrypt.hash(password, 12)
                  //then create a new user with the hashed password
                  .then(hashedPassword => {
                    console.log('postSignup 6');
                      const user = new User({
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
                      });
                      //save the new user
                      return user.save();
                  })
                  .then(result => {
                    console.log('postSignup 7');
                      res.render('auth/login', {
                          path: '/login',
                          pageTitle: 'Log In',
                          isAuthenticated: false,
                          errorMessage: "Thanks for signing up! ",
                          oldInput: {email: email},
                          validationErrors: []
                      });
                      console.log("Thanks for Signing Up!")
                      
                  })
                  .catch(err => {
                    console.log('postSignup 8');
                      const error = new Error(err);
                      error.httpStatusCode = 500;
                      console.log(`auth-controller 197: ${err}`);
                      return next(error);
                  });  
                  
              })
              .catch( err => {
                console.log('postSignup 9');
                  const error = new Error(err);
                      error.httpStatusCode = 500;
                      console.log(`auth-controller 205: ${err}`);
                      return next(error);
              })
          })
          .catch( err => {
            console.log('postSignup 10');
              const error = new Error(err);
                  error.httpStatusCode = 500;
                  console.log(`auth-controller 224: ${err}`);
                  return next(error);
          })
      })
      .catch( err => {
        console.log('postSignup 11');
          const error = new Error(err);
              error.httpStatusCode = 500;
              console.log(`auth-controller 231: ${err}`);
              return next(error);
      })
};
// * * * * * * * * * * POST LOGOUT * * * * * * * * * * 
exports.postLogout = (req, res, next) => {
  //destroy the session, log any errors, and redirect Home
  console.log(`${req.session.user.name} is logged out.`);
  req.session.destroy( err => {
      console.log(`Error  postLogout: ${err}`);
      res.redirect('/');
  })
  
}
// * * * * * * * * * * GET RESET * * * * * * * * * *
exports.getReset = (req, res, next) => {
  let message = req.flash('message');
  if(message.length > 0){
      message = message[0];
  } else {
      message = null;
  }
  res.render('auth/reset', {
      path: '/reset',
      pageTitle: 'Reset Password',
      isAuthenticated: false,
      errorMessage: message
  })
}
// * * * * * * * * * * POST RESET * * * * * * * * * *
exports.postReset= (req, res, next) => {
  const errors = validationResult(req);
  const email = req.body.email
  
      User.findOne({email: email})
      .then(user => {
        console.log(`postReset user => email: ${email}`);
          if(!user){
              req.flash('message', "Sorry, no account found.");
              return res.redirect('/reset');
          }
          const securityQuestions=[user.securityQuestion1, user.securityQuestion2, user.securityQuestion3];

          res.render('auth/security-questions', {
              path: '/security-questions',
              pageTitle: 'Security Questions',
              isAuthenticated: false,
              errorMessage: "",
              securityQuestions: securityQuestions,
              oldInput: {securityAnswer1: "", securityAnswer2: "", securityAnswer3: ""},
              validationErrors: errors.array(),
              email: req.body.email
          })
      })
      .catch(err => {
          const error = new Error(err);
          error.httpStatusCode = 500;
          console.log('auth-controller 313');
          return next(error);
          });
}

// * * * * * * * * * * POST SECURITY QUESTIONS * * * * * * * * * *
exports.postSecurityQuestions = (req, res, next) => {
  const email = req.body.email;
  const securityAnswer1 = req.body.securityAnswer1;
  const securityAnswer2 = req.body.securityAnswer2;
  const securityAnswer3 = req.body.securityAnswer3;

  let thisUser;
  crypto.randomBytes(32, (err, buffer) => {
      if(err){
          return res.redirect('/reset');
      }
      const token = buffer.toString('hex');
      User.findOne({email: email})
      .then(user => {
          if(!user){
              req.flash('message', "Sorry, no account found.");
              return res.redirect('/reset');
          }
          thisUser = user;
          bcrypt.compare(securityAnswer1, thisUser.securityAnswer1)
              .then(theyMatch => {
                  //if they match, then check the next answer
                  if(theyMatch){
                      bcrypt.compare(securityAnswer2, thisUser.securityAnswer2)
                          .then(theyMatch => {
                              //if they match, then check the next answer
                              if(theyMatch){
                                  bcrypt.compare(securityAnswer3, thisUser.securityAnswer3)
                                      .then(theyMatch => {
                                          //if they match, then check the next answer
                                          if(theyMatch){
                                              thisUser.resetToken = token;
                                              thisUser.resetExpiration = Date.now() + 3600000;
                                              thisUser.save()
                                                  .then(result => {
                                                      return res.redirect(`/reset/${token}`);
                                                  })
                                          } else {
                                              //If they don't match, then send back to login page with error message.
                                              console.log("* * * * * * * auth-controller 324 * * * * * * * ");
                                              res.status(422).render('auth/login', {
                                                  path: '/login',
                                                  pageTitle: 'Log In',
                                                  isAuthenticated: false,
                                                  errorMessage: "Invalid answer(s) to security questions.",
                                                  oldInput: {email: email},
                                                  validationErrors: []
                                                  });
                                          }
                                          
                                      })
                              } else {
                                  //If they don't match, then send back to login page with error message.
                                  res.status(422).render('auth/login', {
                                      path: '/login',
                                      pageTitle: 'Log In',
                                      isAuthenticated: false,
                                      errorMessage: "Invalid answer(s) to security questions.",
                                      oldInput: {email: email},
                                      validationErrors: []
                                      });
                              }
                              
                          })
                  } else {
                      //If they don't match, then send back to login page with error message.
                      res.status(422).render('auth/login', {
                          path: '/login',
                          pageTitle: 'Log In',
                          isAuthenticated: false,
                          errorMessage: "Invalid answer(s) to security questions.",
                          oldInput: {email: email},
                          validationErrors: []
                          });
                  }
                  
              })
          })  
  })
}

// * * * * * * * * * * GET NEW PASSWORD * * * * * * * * * *
exports.getNewPassword = (req, res, next) => {
  const token = req.params.token;
  User.findOne({resetToken: token, resetExpiration: {$gt: Date.now()}})
      .then(user => {
          let message = req.flash('message');
              if(message.length > 0){
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
          })
      })
      .catch(err => {
          const error = new Error(err);
          error.httpStatusCode = 500;
          console.log('auth-controller 261');
          return next(error);
        }); 
}

// * * * * * * * * * * POST NEW PASSWORD * * * * * * * * * *

exports.postNewPassword = (req, res, next) => {
  const newPassword = req.body.password;
  const userId = req.body.userId;
  const token = req.body.passwordToken;
  const errors = validationResult(req);

  let resetUser;

  User.findOne({resetToken: token, resetExpiration: { $gt: Date.now()}, _id: userId}).then(user => {
      resetUser = user;

      if(!errors.isEmpty()){
          console.log`auth-controller 268: ${errors.array()}`;
          req.flash('message', errors.array()[0].msg);
          //res.redirect('/admin/edit-product/:prodId');
          return res.redirect(`/reset/${token}`);
      }
      
      bcrypt.hash(newPassword, 12)
      .then(hashedPassword => {
          resetUser.password = hashedPassword;
          resetUser.resetToken = null;
          resetUser.resetExpiration = undefined;
          return resetUser.save();
      })
      .then(result => {
          req.flash('message', "Password reset. Please log in.");
          res.redirect('/login');
      })
  })
  
  .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      console.log('auth-controller 302');
      return next(error);
    });

}