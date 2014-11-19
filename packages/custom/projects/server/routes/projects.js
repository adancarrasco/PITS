'use strict';

var projects = require('../controllers/projects');

// Project authorization helpers
var hasAuthorization = function(req, res, next) {
  if (!req.user.isAdmin) {
    return res.send(401, 'User is not authorized');
  }
  next();
};

// The Package is past automatically as first parameter
module.exports = function(Projects, app, auth, database) {

  /*app.get('/projects/example/anyone', function(req, res, next) {
    res.send('Anyone can access this');
  });

  app.get('/projects/example/auth', auth.requiresLogin, function(req, res, next) {
    res.send('Only authenticated users can access this');
  });

  app.get('/projects/example/admin', auth.requiresAdmin, function(req, res, next) {
    res.send('Only users with Admin role can access this');
  });

  app.get('/projects/example/render', function(req, res, next) {
    Projects.render('index', {
      package: 'projects'
    }, function(err, html) {
      //Rendering a view from the Package server/views
      res.send(html);
    });
  });*/

  app.route('/projects')
    .get(projects.all)
    .post(auth.requiresLogin, projects.create);
  app.route('/projects/:projectId')
    .get(projects.show)
    .put(auth.requiresLogin, hasAuthorization, projects.update)
    .delete(auth.requiresLogin, hasAuthorization, projects.destroy);
  

  // Finish with setting up the projectId param
  app.param('projectId', projects.project);
};
