"use strict";

function showNewCategory() {
  var categorySelect = document.getElementById("category").value;
  var newCategoryInput = document.getElementById("new-category");

  if (categorySelect == "newCategory") {
    visibleClass(newCategoryInput);
  } else {
    hiddenClass(newCategoryInput);
  }
}

function hiddenClass(element) {
  if (element.classList.contains("visible")) {
    element.classList.remove("visible");
  }

  element.classList.add("hidden");
}

function visibleClass(element) {
  if (!element.classList.contains("visible")) {
    element.classList.add("visible");
    element.classList.remove("hidden");
  }
}

function checkNewCategory() {
  var newCategory = document.getElementById("new-category");
  var categories = document.getElementsByName("category");
  var errorMsg = document.getElementsByClassName("user-message")[0];
  errorMsg.innerHTML = ""; //check to see if it's already in the list

  var categoryLength = categories.length;

  for (var i = 0; i < categoryLength; i++) {
    // console.log(`categories[${i}]: ${categories[i].value.toString().toLowerCase().split(" ").join("")}; newCategory: ${newCategory.toString().toLowerCase().split(" ").join("")}`);
    // console.log(categories[i].value.toString().toLowerCase().split(" ").join(""));
    if (categories[i].value.toString().toLowerCase().split(" ").join("") == newCategory.value.toString().toLowerCase().split(" ").join("")) {
      errorMsg.innerHTML = "".concat(categories[i].value.toString(), " is already in the Category list.");
      document.getElementById("category").getElementsByTagName('option')[i].selected = 'selected';
      newCategory.innerHTML = "";
      hiddenClass(newCategory);
      return;
    }
  }
}

function showAddendum() {
  var addendumForm = document.getElementById("add-form");
  visibleClass(addendumForm);
}