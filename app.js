
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const flash = require('connect-flash');
// const errorController = require('./controllers/error');
const User = require('./models/user');
const multer = require('multer');
const cors = require('cors');
require('dotenv').config();
const SESSION_SECRET = process.env.SESSION_SECRET;
const MONGODB_URI = process.env.MONGODB_URL;
const PORT = process.env.PORT;

const corsOptions = {
    origin: "https://<your_app_name>.herokuapp.com/",
    optionsSuccessStatus: 200
};

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
      cb(null, 'public/images');
      console.log('Multer Storage - destination set');
}, filename: (req, file, cb) => {
      cb(null, Date.now().toString() + file.originalname);
      console.log(`Multer fileStorage - filename set`);
}})

const fileFilter = (req, file, cb) => {
  if(file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg'){
    cb(null, true);
    console.log`Multer fileFilter- file accepted: ${file}`;
  } else {
    cb(null, false);
    console.log("Multer fileFilter- file not accepted ${file}");
  }
}
                        

const app = express();
const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: 'sessions'
  //you can set when it will expire and it will be automatically cleaned up by mongodb
});
const csrfProtection = csrf();



app.set('view engine', 'ejs');
app.set('views', 'views');
app.use(multer({storage: fileStorage, fileFilter: fileFilter}).single('image'));

const adminRoutes = require('./routes/admin-routes');
const recipeRoutes = require('./routes/recipe-routes');
const authRoutes = require('./routes/auth-routes');
app.use(express.static(path.join(__dirname, 'public')));
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use(bodyParser.urlencoded({ extended: false }));


app.use(session({secret: 'triedandtruefamilyrecipes', resave: false, saveUninitialized: false, store: store}));

app.use(cors(corsOptions));
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

// app.use(errorController.get500);
// app.use(errorController.get404);

app.use((error, req, res, next) => {
  console.log`get500 ${error}`;
    let user = null;
    if(req.session && req.session.isLoggedIn){
      user = req.user.name;
    }
    res.render('500', { 
      pageTitle: 'Error', 
      path: '/500',
      isAuthenticated: false,
      user: user
    });
  //or render with status code or anything else.
})


app.use((req, res, next) => {
  res.render('404', { 
      pageTitle: 'Page Not Found', 
      path: '/404',
      isAuthenticated: false});
})

const config = {
    autoIndex: false,
    useUnifiedTopology: true,
    useNewUrlParser: true
    //,family: 4
};


mongoose
  .connect(
    MONGODB_URI, config)
  .then(result => {
    app.listen(PORT);
    console.log(`Listening on port ${PORT}`);
  })
  .catch(err => {
    console.log(err);
  });