'use strict';
/*jslint plusplus: true */

angular.module('mean.projects').config(['$stateProvider',
  function($stateProvider) {
    /// Check if the user is connected
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

    $stateProvider.state('Projects', {
      url: '/projects/example',
      templateUrl: 'projects/views/index.html',
      resolve: {
          loggedin: checkLoggedin
        }
    })
    .state('Create new Project', {
      url: '/projects/create',
      templateUrl: 'projects/views/create.html',
      resolve: {
          loggedin: checkAdmin
        }
    })
    .state('Project by id', {
      url: '/projects/:projectId',
      templateUrl: 'projects/views/view.html',
      resolve: {
          loggedin: checkLoggedin
        }
    })
    .state('all projects', {
      url: '/projects',
      templateUrl: 'projects/views/list.html',
      resolve: {
          loggedin: checkLoggedin
        }
    });
  }
]);
