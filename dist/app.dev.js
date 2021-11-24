"use strict";

function _templateObject() {
  var data = _taggedTemplateLiteral(["Multer fileFilter- file accepted: ", ""]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

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

var multer = require('multer');

var cors = require('cors');

require('dotenv').config();

var SESSION_SECRET = process.env.SESSION_SECRET;
var MONGODB_URI = process.env.MONGODB_URL;
var PORT = process.env.PORT;
var corsOptions = {
  origin: "https://<your_app_name>.herokuapp.com/",
  optionsSuccessStatus: 200
};
var fileStorage = multer.diskStorage({
  destination: function destination(req, file, cb) {
    cb(null, 'public/images');
    console.log('Multer Storage - destination set');
  },
  filename: function filename(req, file, cb) {
    cb(null, Date.now().toString() + file.originalname);
    console.log("Multer fileStorage - filename set");
  }
});

var fileFilter = function fileFilter(req, file, cb) {
  if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
    cb(null, true);
    console.log(_templateObject(), file);
  } else {
    cb(null, false);
    console.log("Multer fileFilter- file not accepted ${file}");
  }
};

var app = express();
var store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: 'sessions' //you can set when it will expire and it will be automatically cleaned up by mongodb

});
var csrfProtection = csrf();
app.set('view engine', 'ejs');
app.set('views', 'views');
app.use(multer({
  storage: fileStorage,
  fileFilter: fileFilter
}).single('image'));

var adminRoutes = require('./routes/admin-routes');

var recipeRoutes = require('./routes/recipe-routes');

var authRoutes = require('./routes/auth-routes');

app.use(express["static"](path.join(__dirname, 'public')));
app.use('/images', express["static"](path.join(__dirname, 'images')));
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(session({
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: store
}));
app.use(cors(corsOptions));
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
app.use(errorController.get500);
app.use(errorController.get404);
var config = {
  autoIndex: false,
  useUnifiedTopology: true,
  useNewUrlParser: true //,family: 4

};
mongoose.connect(MONGODB_URI, config).then(function (result) {
  app.listen(PORT);
  console.log("Listening on port ".concat(PORT));
})["catch"](function (err) {
  console.log(err);
});