'use strict';

//Tasks service used for tasks REST endpoint
angular.module('mean.tasks').factory('Tasks', ['$resource',
  function($resource) {
    return $resource('tasks/:taskId', {
      taskId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
]);
