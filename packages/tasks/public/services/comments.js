'use strict';

//Comments service used for comments REST endpoint
angular.module('mean.tasks').factory('Comments', ['$resource',
  function($resource) {
    return $resource('comments/:commentId', {
      taskId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
]);
