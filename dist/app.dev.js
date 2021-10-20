"use strict";

var PORT = process.env.PORT || 4000;

var path = require('path');

var express = require('express');

var bodyParser = require('body-parser');

var mongoose = require('mongoose');

var session = require('express-session');

var MongoDBStore = require('connect-mongodb-session')(session);

var csrf = require('csurf');

var flash = require('connect-flash');

var errorController = require('./controllers/error');

var User = require('./models/user');

var MONGODB_URI = 'mongodb+srv://nodeuser:p1ngpong@cluster0.f2qqp.mongodb.net/mellenrecipes?retryWrites=true&w=majority';
var app = express();
var store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: 'sessions' //you can set when it will expire and it will be automatically cleaned up by mongodb

});
var csrfProtection = csrf();
app.set('view engine', 'ejs');
app.set('views', 'views');

var adminRoutes = require('./routes/admin-routes');

var recipeRoutes = require('./routes/recipe-routes');

var authRoutes = require('./routes/auth-routes');

app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(express["static"](path.join(__dirname, 'public')));
app.use(session({
  secret: 'triedandtruefamilyrecipes',
  resave: false,
  saveUninitialized: false,
  store: store
}));
app.use(csrfProtection);
app.use(flash());
app.use(function (req, res, next) {
  if (!req.session.user) {
    return next();
  }

  User.findById(req.session.user._id).then(function (user) {
    req.user = user;
    next();
  })["catch"](function (err) {
    return console.log(err);
  });
});
app.use(function (req, res, next) {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
});
app.use('/admin', adminRoutes);
app.use(recipeRoutes);
app.use(authRoutes);
app.use(errorController.get404);
var config = {
  autoIndex: false,
  useNewUrlParser: true,
  useUnifiedTopology: true
};
mongoose.connect(MONGODB_URI, config).then(function (result) {
  app.listen(PORT);
})["catch"](function (err) {
  console.log(err);
});