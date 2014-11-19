'use strict';
/*jslint plusplus: true */
//Setting up route
angular.module('mean.tasks').config(['$stateProvider',
  function($stateProvider) {
    // Check if the user is connected
    var checkLoggedin = function($q, $timeout, $http, $location) {
      // Initialize a new promise
      var deferred = $q.defer();

      // Make an AJAX call to check if the user is logged in
      $http.get('/loggedin').success(function(user) {
        // Authenticated
        if (user !== '0') {
            $timeout(deferred.resolve);
        }

        // Not Authenticated
        else {
          $timeout(deferred.reject);
          $location.url('/login');
        }
      });

      return deferred.promise;
    };

    var checkAdmin = function($q, $timeout, $http, $location) {
      // Initialize a new promise
      var deferred = $q.defer();
      var isAdmin = false;
      // Make an AJAX call to check if the user is logged in
      $http.get('/loggedin').success(function(user) {
        // Authenticated
        if (user !== '0') {
          for(var uRol = 0; uRol < user.roles.length; uRol++){ 
            //Admin
            if(user.roles[uRol] === 'admin'){
              isAdmin = true;
            }
          }
          if(isAdmin){
            $timeout(deferred.resolve);
          }
          else{
            $timeout(deferred.reject);
            $location.url('/');  
          }
          
        }

        // Not Authenticated
        else {
          $timeout(deferred.reject);
          $location.url('/login');
        }
      });

      return deferred.promise;
    };

    // states for my app
    $stateProvider
      .state('all tasks', {
        url: '/tasks',
        templateUrl: 'tasks/views/list.html',
        resolve: {
          loggedin: checkLoggedin
        }
      })
      .state('create task', {
        url: '/tasks/create',
        templateUrl: 'tasks/views/create.html',
        resolve: {
          loggedin: checkAdmin
        }
      })
      /*.state('edit task', {
        url: '/tasks/:taskId/edit',
        templateUrl: 'tasks/views/edit.html',
        resolve: {
          loggedin: checkLoggedin
        }
      })*/
      .state('task by id', {
        url: '/projects/:projectId/tasks/:taskId',
        templateUrl: 'tasks/views/view.html',
        resolve: {
          loggedin: checkLoggedin
        }
      });
  }
]);
