'use strict';

var tasks = require('../controllers/tasks');

// Task authorization helpers
var hasAuthorization = function(req, res, next) {
  if (!req.user.isAdmin && req.task.user.id !== req.user.id) {
    return res.send(401, 'User is not authorized');
  }
  next();
};

module.exports = function(Tasks, app, auth) {

  app.route('/tasks')
    .get(tasks.all)
    .post(auth.requiresLogin, tasks.create);
  app.route('/tasks/:taskId')
    .get(tasks.show)
    .put(auth.requiresLogin, hasAuthorization, tasks.update)
    .delete(auth.requiresLogin, hasAuthorization, tasks.destroy);

  /*app.route('/tasks/:taskId/comments')
    .get(tasks.allComments);

  app.route('/tasks/:taskId/comments/:commentId')
    .get(tasks.showComment)
    .put(auth.requiresLogin, hasAuthorization, tasks.updateComment)
    .delete(auth.requiresLogin, hasAuthorization, tasks.destroyComment);*/

  // Finish with setting up the taskId param
  app.param('taskId', tasks.task);


};
