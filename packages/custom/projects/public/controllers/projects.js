'use strict';

angular.module('mean.projects', ['ngTable'])
.controller('ProjectsController', ['$scope', '$stateParams', '$location', 'Global', 'Projects', '$filter', 'ngTableParams', '$modal', 
  function($scope, $stateParams, $location, Global, Projects, $filter, NgTableParams, modal) {
    $scope.global = Global;

    $scope.go = function ( path ) {
      $location.path( '/projects/'+ path );
    };

    $scope.hasAuthorization = function(project) {
      if (!project) return false;
      return ($scope.global.isAdmin);
    };

    $scope.create = function(isValid) {
      if (isValid) {
        var project = new Projects({
          p_id: this.p_id,
          name: this.name,
          release: this.release,
          description: this.description,
          type: this.selectedType
        });
        project.$save(function(response) {
          $location.path('projects/' + response._id);
        });

        this.name = '';
        this.release = '';
        this.description = '';
      } else {
        $scope.submitted = true;
      }
    };

    $scope.remove = function(project) {
      if (project) {
        project.$remove();

        for (var i in $scope.projects) {
          if ($scope.projects[i] === project) {
            $scope.projects.splice(i, 1);
          }
        }
      } else {
        $scope.project.$remove(function(response) {
          $location.path('projects');
        });
      }
    };

    $scope.update = function(isValid) {
      if (isValid) {
        var project = $scope.project;
        if (!project.updated) {
          project.updated = [];
        }
        project.updated.push(new Date().getTime());

        project.$update(function() {
          $location.path('projects/' + project._id);
        });
      } else {
        $scope.submitted = true;
      }
    };

    $scope.find = function() {
      $scope.filterBy = 'all';
      Projects.query(function(projects) {
        $scope.projects = projects;
        /* jshint ignore:start */
        /* jshint ignore:end */
        var data = $scope.projects;
      
        $scope.tableParams = new NgTableParams({
          page: 1,            // show first page
          count: 10,          // count per page
          sorting: {
            completed_by: 'asc' // initial sorting
          }
        }, {
            total: data.length, // length of $scope.projects
            getData: function($defer, params) {
                // use build-in angular filter
                var orderedData = params.sorting() ?
                                  $filter('orderBy')(data, params.orderBy()) :
                                  data;

                $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
            }
        });
        
      });
    };

    $scope.findOne = function() {
      Projects.get({
        projectId: $stateParams.projectId
      }, function(project) {
        $scope.project = project;
      });
    };
    
    $scope.open = function(){
    	var modalInstance = modal;
    	modalInstance.open({
    		templateUrl:'myModalContent.html',
    		size: 'lg'
    	});
    };
    
    $scope.edit = function(elem){
      if($scope.hasAuthorization())
        { 
          elem = true;
        }
    };

    $scope.edit = function(elem){
      document.activeElement = document.querySelector('#'+elem);
    };
  }
]);
