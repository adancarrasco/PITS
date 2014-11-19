'use strict';
//Tasks service used for tasks REST endpoint
angular.module('mean.users').factory('MeanUser', ['$resource',
  function($resource) {
    return $resource('users/:userId', {
      userId: 'userId'
    });
  }
])
.factory('Users', ['$resource',
	function($resource) {
	return $resource('users/');
	}
]);
