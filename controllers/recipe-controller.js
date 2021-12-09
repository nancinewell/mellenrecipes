const Recipe = require('../models/recipe');
const Addendum = require('../models/addendum');
const mongoose = require('mongoose');

exports.getRecipes = (req, res, next) => {
    Recipe.find().sort('category')
      .then(recipes => {
        console.log(recipes);
        res.render('recipes', {
          recipes: recipes,
          pageTitle: 'All recipes',
          path: '/recipes',
          isAuthenticated: req.session.isLoggedIn
        });
      })
      .catch(err => {
        console.log(err);
      });
  };

  // exports.getIndex = (req, res, next) => {
  //   Recipe.find()
  //     .then(recipes => {
  //       res.render('recipes/index', {
  //         prods: recipes,
  //         pageTitle: 'Recipes',
  //         path: '/'
  //       });
  //     })
  //     .catch(err => {
  //       console.log(err);
  //     });
  // };


// * * * * * * * * * * * * * * INDEX * * * * * * * * * * * * * *
  exports.getIndex = (req, res, next) => {
    //get all products from db and render in index
    if(!req.user){
      Recipe.find().sort('category')
      .then(recipes => {
        res.render('recipes/index', {
          recipes: recipes,
          pageTitle: 'Mellen Family Recipes',
          path: '/'
        });
      })
      .catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        console.log(`getIndex err !user ${err}`);
        return next(error);
      });
    } else {
      Recipe.find().sort('category')
      .then(recipes => {
        res.render('recipes/index-user', {
          recipes: recipes,
          pageTitle: 'Mellen Family Recipes',
          path: '/',
          user: req.user
        });
      })
      .catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        console.log(`getIndex err user ${err}`);
        return next(error);
      }
      );
    }
  };

  // * * * * * * * * * * * * * * GET RECIPE * * * * * * * * * * * * * *
  exports.getRecipe = async (req, res, next) => {
    const recipeId = req.params.recipeId.toString();
    console.log(`getRecipe - pre-actions`);
    const addendums = await Addendum.find({recipeId: recipeId}).populate("userId");
    console.log(`getRecipe - addendums retrieved`);
    console.log(addendums);
    Recipe.findById(recipeId).sort('category')
      .then(recipe => {
        recipe.ingredients.replace(/\n/g, '<br/>');
        res.render('recipes/details', {
          recipe: recipe,
          addendums: addendums,
          pageTitle: 'Mellen Family Recipes',
          path: '/'
        })
      })
    }

// * * * * * * * * * * * * * * SEARCH * * * * * * * * * * * * * *

exports.getSearch = (req, res, next) => {
  res.render('recipes/search', {
    pageTitle: 'Search',
    path: '/search'
  })
}  


exports.postSearch = (req, res, next) => {
  const search = req.body.search;
  console.log(`search term: ${search}`);
  Recipe.find({
    $or: [
      { "name": { $regex: '.*'+search+'.*', $options: 'i' } },
      { "ingredients": { $regex: '.*'+search+'.*', $options: 'i' } },
      {"directions":{ $regex: '.*'+search+'.*', $options: 'i' } },
      {"category":{ $regex: '.*'+search+'.*', $options: 'i' } },
      {"description": { $regex: '.*'+search+'.*', $options: 'i' } }
    ]
  }).sort('category')
  .then(recipes => {
    console.log`Search Results: ${recipes}`;
    if(!req.user){
    res.render('recipes/index', {
      recipes: recipes,
      pageTitle: 'Search Results',
      path: '/'
    })
    } else {
      res.render('recipes/index-user', {
        recipes: recipes,
        pageTitle: 'Search Results',
        path: '/',
        user: req.user
      });
    }
  })
  .catch(err => {
    const error = new Error(err);
    error.httpStatusCode = 500;
    console.log(`postSearch catch: ${err}`);
    return next(error);
  });
}
