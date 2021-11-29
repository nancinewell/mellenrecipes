const Recipe = require('../models/recipe');
const User = require('../models/user');
const { validationResult } = require('express-validator');
const mongoose = require('mongoose');
const { findById } = require('../models/recipe');
let allCategories = [];
// * * * * * * * * * * * * * * GET RECIPES * * * * * * * * * * * * * *
exports.getRecipes = (req, res, next) => {
  //get all recipes from db
  Recipe.find({userId: req.user._id})
    .then(recipes => {
      //render the page using those recipes
      res.render('admin/myrecipes', {
        recipes: recipes,
        pageTitle: 'My Recipes',
        path: '/admin/myrecipes',
        user: req.user
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      console.log('getRecipes Recipe.find Catch ${err}');
      return next(error);
    });
};

// * * * * * * * * * * * * * * GET ADD RECIPE * * * * * * * * * * * * * *
exports.getAddRecipe = async (req, res, next) => {
  await getCategories();
    res.render('admin/edit-recipe', {
      pageTitle: 'Add Recipe',
      path: '/admin/add-recipe',
      editing: false,
      isAuthenticated: req.session.isLoggedIn,
      categories: allCategories,
      hasError: false,
      errorMessage: null,
      validationErrors: []
      //or isAuthenticated: req.session.user;
    });
  };

  async function getCategories(){
    await Recipe.find().distinct("category")
      .then(categories => {
        allCategories = categories;
        allCategories.sort();
      })
  }

// * * * * * * * * * * * * * * POST ADD RECIPE * * * * * * * * * * * * * *
  exports.postAddRecipe = (req, res, next) => {
    //gather new Recipe info from req
    const name = req.body.name;
    let image = req.file;
    const ingredients = req.body.ingredients;
    const directions = req.body.directions;
    const description = req.body.description;
    let category = req.body.category;
    const newCategory = req.body.newCategory;

    if(category == "newCategory"){
      category = newCategory;
    }

    if(!req.file){
      image = "";
    }
    
    //handle validation errors
    const errors = validationResult(req);
    
    if(!errors.isEmpty()){
        console.log`${errors.array()}`;
        return res.status(422).render('admin/edit-recipe', {
          pageTitle: 'Add Recipe',
          path: '/admin/add-recipe',
          editing: false,
          hasError: true,
          user: req.user,
          isAuthenticated: false,
          errorMessage: errors.array()[0].msg,
          recipe: {name: name, ingredients: ingredients, description: description},
          validationErrors: errors.array()
        })
      }
    //create new recipe in db
    const recipe = new Recipe({
      name: name, 
      ingredients: ingredients, 
      directions: directions,
      description: description, 
      imageUrl: image.filename,
      category: category,
      userId: req.user
    });
    //Save new recipe.   .save() is native to mongoose. 
    recipe.save()
      .then(result => {
        //log success and redirect to admin recipes
        console.log('Created Recipe');

        res.redirect('/admin/myrecipes');
      })
      .catch(err => {
        console.log(`postAddRecipe err: ${err}`);
        return res.status(422).render('admin/edit-recipe', {
          pageTitle: 'Add Recipe',
          path: '/admin/add-recipe',
          editing: false,
          user: req.user,
          isAuthenticated: false,
          errorMessage: [],
          hasError: false,
          recipe: {name: name, ingredients: ingredients, directions: directions, description: description},
          validationErrors: errors.array()
        })
      });
    }


    exports.postAddAnother = (req, res, next) => {
//gather new Recipe info from req
const name = req.body.name;
let image = req.file;
const ingredients = req.body.ingredients;
const directions = req.body.directions;
const description = req.body.description
const category = req.body.category;
const newCategory = req.body.newCategory;
if(!req.file){
  image = "";
}

if(category == "newCategory"){
  category = newCategory;
}

//handle validation errors
const errors = validationResult(req);

if(!errors.isEmpty()){
    console.log`${errors.array()}`;
    return res.status(422).render('admin/edit-recipe', {
      pageTitle: 'Add Recipe',
      path: '/admin/add-recipe',
      editing: false,
      hasError: true,
      user: req.user,
      isAuthenticated: false,
      errorMessage: errors.array()[0].msg,
      recipe: {name: name, ingredients: ingredients, description: description},
      validationErrors: errors.array()
    })
  }
//create new recipe in db
const recipe = new Recipe({
  name: name, 
  ingredients: ingredients, 
  directions: directions,
  description: description,
  category: category, 
  imageUrl: image.filename,
  userId: req.user
});
//Save new recipe.   .save() is native to mongoose. 
recipe.save()
  .then(result => {
    //log success and redirect to admin recipes
    console.log('Created Recipe');

    res.redirect('/admin/add-recipe');
  })
  .catch(err => {
    console.log(`postAddRecipe err: ${err}`);
    return res.status(422).render('admin/edit-recipe', {
      pageTitle: 'Add Recipe',
      path: '/admin/add-recipe',
      editing: false,
      user: req.user,
      isAuthenticated: false,
      errorMessage: [],
      hasError: false,
      recipe: {name: name, ingredients: ingredients, directions: directions, description: description},
      validationErrors: errors.array()
    })
  });
    }

// * * * * * * * * * * * * * * GET EDIT RECIPE * * * * * * * * * * * * * *
  exports.getEditRecipe = async (req, res, next) => {
  //get categories
    await getCategories();
    
    //Is the user in edit mode? Only allow access if in edit mode.
    const editMode = req.query.edit;
    
    //if not in edit mode, redirect Home
    if(!editMode){
      return res.redirect('/');
    }

    

    //gather recipe id from params and locate recipe 
    const recipeId = req.params.recipeId;
    Recipe.findById(recipeId)
      .then(recipe => {
        //if no recipe, redirect Home
        if (!recipe) {
          return res.redirect('/');
        }
        //if recipe found, send to edit recipe with recipe info
        res.render('admin/edit-recipe', {
          pageTitle: 'Edit recipe',
          path: '/admin/edit-recipe',
          editing: editMode,
          recipe: recipe,
          hasError: false,
          user: req.user,
          categories: allCategories,
          errorMessage: "",
          validationErrors: []
        });
      })
      .catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        console.log('admin-controller 131');
        return next(error);
      });
};

// * * * * * * * * * * * * * * POST EDIT RECIPE * * * * * * * * * * * * * *
exports.postEditRecipe = (req, res, next) => {
  //gather new Recipe info from req
  const updatedName = req.body.name;
  let image = req.file;
  const updatedIngredients = req.body.ingredients;
  const updatedDirections = req.body.directions;
  const updatedDescription = req.body.description;
  let updatedCategory = req.body.category;
  const recipeId = req.body.recipeId;
    const newCategory = req.body.newCategory;
    
    if(updatedCategory == "newCategory"){
      updatedCategory = newCategory;
    }
  
  if(!req.file){
    image = "";
    console.log(`postEditRecipe image=""`);
  }
  console.log("postEditRecipe- gathered new info.");
  Recipe.findById(recipeId)
    .then(recipe => {
      console.log("postEditRecipe- found recipe");
      //if user is not the owner of the recipe, then redirect to home.
      if(recipe.userId.toString() !== req.user._id.toString()){
        console.log("postEditRecipe- invalid user");
        return res.redirect('/');
      }
      //update recipe info
      recipe.name = updatedName;
      recipe.ingredients = updatedIngredients;
      recipe.description = updatedDescription;
      recipe.directions = updatedDirections;
      recipe.category = updatedCategory;
      if(image){
        recipe.imageUrl = image.filename;
      }
      return recipe.save()
        .then(result => {
          console.log("Updated recipe!");
          res.redirect('/admin/myrecipes');
        })
        .catch(err => {
          const error = new Error(err);
          error.httpStatusCode = 500;
          console.log(`postEditRecipe-save catch: ${err}`);
          return next(error);
        })
    })

}


// * * * * * * * * * * * * * * FAVORITES * * * * * * * * * * * * * *

exports.getAddFavorite = (req, res, next) => {
  const user = req.user;
  const id = req.params.recipeId;
  let destination = req.params.destination;

  if(destination == "index"){
    destination = "/";
  } else {
    destination = '/admin/' + destination;
  }
    user.favorites.push(id);
    
    user.save()
      .then(results => {
        console.log(`${user.name}.favorites ${user.favorites}`);
        res.redirect(destination);
      })
      .catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        console.log(`getAddFavorites user.save error: ${err}`);
        return next(error);
      })
}

exports.getRemoveFavorite = (req, res, next) => {
  const user = req.user;
  const id = req.params.recipeId;
  let destination = req.params.destination;

  if(destination == "index"){
    destination = "/";
  } else {
    destination = '/admin/' + destination;
  }
  console.log("In getRemoveFavorite");
  
  for (let i = 0; i < user.favorites.length; i++) {
    console.log(`in for loop ${i}; favorites[i]: ${user.favorites[i]}; id: ${id}`);
    if (user.favorites[i].toString() == id.toString()){
        user.favorites.splice(i, 1);
        console.log(`Removed [i]`);
      }
  }
    
  user.save()
    .then(results => {
      console.log(`${user.name}.favorites. ${user.favorites}`);
      res.redirect(destination);
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      console.log(`getRemoveFavorite user.save error: ${err}`);
      return next(error);
    })
}



exports.getFavorites = async (req, res, next) => {
  const user = req.user;

  User.findById(user)
    .populate("favorites")
    .then(result => {
      res.render('admin/faves', {
            recipes: result.favorites,
            pageTitle: 'My Favorite Recipes',
            path: '/admin/faves',
            user: req.user
          })
    })
}


exports.postDeleteRecipe = (req, res, next) => {
  const recipeId = req.body.recipeId;
    //locate the product and delete with native function
    Recipe.deleteOne({_id: recipeId, userId: req.user._id})
      .then(() => {
        //log success and redirect to admin recipes
        console.log('DESTROYED RECIPE');
        res.redirect('/admin/myrecipes');
      })
      .catch(err => {
        // res.redirect('/');
        const error = new Error(err);
        error.httpStatusCode = 500;
        console.log('postDeleteRecipe catch');
        return next(error);
        
      });
}




























// exports.getFavorites  = async (req, res, next) => {
//   //faveList = [];
//   const user = req.user;
//   const favorites = user.favorites.recipe;
  
//   console.log`user favorites: ${favorites}`;
  
//   for (favorite of favorites){
//     await findRecipe(favorite.recipeId);
//     console.log(`faveList in loop: ${faveList}`);
//   }

//   console.log`faveList: ${faveList}`;

//   //render the page using those recipes
//   res.render('admin/faves', {
//     recipes: faveList,
//     pageTitle: 'My Favorite Recipes',
//     path: '/admin/faves',
//     user: req.user
//   })
// }

// async function findRecipe(recipeId, user){
//   Recipe.findById(recipeId)
//     .then(recipe => {
//       faveList.push(recipe);
//       return;
//     })
//     .catch(err => {
//       console.log(`findRecipe catch ${err}`);
//     })
// }

// async function getFave(i){
//   Recipe.findById(mongoose.Types.ObjectId(i))
//     .then(recipe => {
//       faveList.push(recipe);
//       })
//     .catch(err => {
//       const error = new Error(err);
//       error.httpStatusCode = 500;
//       console.log(`getFaves Recipe.find catch ${err}`);
//       return;
//     })
// }