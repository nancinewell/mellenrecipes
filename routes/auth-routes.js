const express = require('express');

const { check, body } = require('express-validator');

const authController = require('../controllers/auth-controller');

const User = require('../models/user');

const router = express.Router();

router.get('/login', authController.getLogin);

router.get('/signup', authController.getSignup);

router.post('/login',[
    body('email')
        .isEmail().withMessage('Please enter a valid email')
        .trim()
], authController.postLogin);

router.post('/signup',[
    body('email')
        .isEmail().withMessage('Please enter a valid email')
        .trim()
        // .custom(value => {
        //     return User.findOne({ where: {email: value} })
        //        .then(result => {
        //           if(result){
        //               console.log()
        //               return Promise.reject('A user has already signed up with that email address.')
        //           }
        //        })
        //     })
], authController.postSignup);

router.post('/logout', authController.postLogout);

router.get('/reset', authController.getReset);

router.get('/reset/:token', authController.getNewPassword);

router.post('/reset',[
    body('email')
        .isEmail().withMessage('Please enter a valid email')
        .trim()
],  authController.postReset);

router.post('/security-questions', authController.postSecurityQuestions);

router.post('/new-password',[
    body('confirmPassword').custom((value,{req}) => {
        if(value != req.body.password){
            throw new Error('Passwords have to match!')
        }
        return true;
    }),
    body('password', "Passwords must be at least 8 characters long.")
        .isLength({min: 8})
], authController.postNewPassword);


module.exports = router;