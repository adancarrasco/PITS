'use strict';
/*jslint plusplus: true */
angular.module('mean.mean-admin').config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {
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

        
        $stateProvider
            .state('users', {
                url: '/admin/users',
                templateUrl: 'mean-admin/views/users.html'
            }).state('themes', {
                url: '/admin/themes',
                templateUrl: 'mean-admin/views/themes.html'
            }).state('settings', {
                url: '/admin/settings',
                templateUrl: 'mean-admin/views/settings.html'
            }).state('modules', {
                url: '/admin/modules',
                templateUrl: 'mean-admin/views/modules.html'
            });
    }
]).config(['ngClipProvider',
    function(ngClipProvider) {
        ngClipProvider.setPath('../mean-admin/assets/lib/zeroclipboard/ZeroClipboard.swf');
    }
]);