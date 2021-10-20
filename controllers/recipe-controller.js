const Recipe = require('../models/recipe');

exports.getRecipes = (req, res, next) => {
    Recipe.find()
      .then(recipes => {
        console.log(recipes);
        res.render('recipe-list', {
          prods: recipes,
          pageTitle: 'All recipes',
          path: '/recipes',
          isAuthenticated: req.session.isLoggedIn
        });
      })
      .catch(err => {
        console.log(err);
      });
  };

  exports.getIndex = (req, res, next) => {
    Recipe.find()
      .then(recipes => {
        res.render('recipes/index', {
          prods: recipes,
          pageTitle: 'Recipes',
          path: '/'
        });
      })
      .catch(err => {
        console.log(err);
      });
  };