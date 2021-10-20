const PORT = process.env.PORT || 4000;
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const flash = require('connect-flash');
const errorController = require('./controllers/error');
const User = require('./models/user');

const MONGODB_URI = 'mongodb+srv://nodeuser:p1ngpong@cluster0.f2qqp.mongodb.net/mellenrecipes?retryWrites=true&w=majority';

const app = express();
const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: 'sessions'
  //you can set when it will expire and it will be automatically cleaned up by mongodb
});
const csrfProtection = csrf();


app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin-routes');
const recipeRoutes = require('./routes/recipe-routes');
const authRoutes = require('./routes/auth-routes');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({secret: 'triedandtruefamilyrecipes', resave: false, saveUninitialized: false, store: store}));

app.use(csrfProtection);
app.use(flash());

app.use((req, res, next) => {
  if(!req.session.user){
    return next();
  }
  User.findById(req.session.user._id)
      .then(user => {
        req.user = user;
        next();
      })
      .catch(err => console.log(err));
});


app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken= req.csrfToken();
  next();
});


app.use('/admin', adminRoutes);
app.use(recipeRoutes);
app.use(authRoutes);

app.use(errorController.get404);


const config = {
  autoIndex: false,
  useNewUrlParser: true,
  useUnifiedTopology: true
};

mongoose
  .connect(
    MONGODB_URI, config)
  .then(result => {
    app.listen(PORT);
  })
  .catch(err => {
    console.log(err);
  });