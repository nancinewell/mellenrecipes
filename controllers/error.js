exports.get404 = (req, res, next, err) => {
  console.log(`get404: ${err}`);
  res.status(404).render('404', { 
      pageTitle: 'Page Not Found', 
      path: '/404',
      isAuthenticated: req.session.isLoggedIn });
  };
  
  exports.get500 = (error, req, res, next) => {
    console.log`get500 ${error}`;
    let user = null;
    if(req.session.isLoggedIn){
      user = req.user.name;
    }
    res.status(500).render('500', { 
      pageTitle: 'Error', 
      path: '/500',
      isAuthenticated: req.session.isLoggedIn,
      user: user
    });
  };