"use strict";

function _templateObject() {
  var data = _taggedTemplateLiteral(["get500 ", ""]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

exports.get404 = function (req, res, next, err) {
  console.log("get404: ".concat(err));
  res.render('404', {
    pageTitle: 'Page Not Found',
    path: '/404',
    isAuthenticated: req.session.isLoggedIn
  });
};

exports.get500 = function (error, req, res, next) {
  console.log(_templateObject(), error);
  var user = null;

  if (req.session.isLoggedIn) {
    user = req.user.name;
  }

  res.render('500', {
    pageTitle: 'Error',
    path: '/500',
    isAuthenticated: req.session.isLoggedIn,
    user: user
  });
};