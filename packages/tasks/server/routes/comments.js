'use strict';

var comments = require('../controllers/comments');

// Task authorization helpers
var hasAuthorization = function(req, res, next) {
  if (!req.user.isAdmin && req.comments.user.id !== req.user.id) {
    return res.send(401, 'User is not authorized');
  }
  next();
};

module.exports = function(Comments, app, auth) {

  app.route('/comments')
    .get(comments.all)
    .post(auth.requiresLogin, comments.create);
  app.route('/comments/:commentId')
    .get(comments.show)
    .put(auth.requiresLogin, hasAuthorization, comments.update)
    .delete(auth.requiresLogin, hasAuthorization, comments.destroy);
  // Finish with setting up the commentsId param
  app.param('commentId', comments.comment);
};