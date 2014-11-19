/*global $:false */
'use strict';

angular.module('mean.tasks', ['ngTable', 'ui.bootstrap.modal'])
.controller('TasksController', ['$scope', '$stateParams', '$location', 'Global', 'Tasks', '$filter', 'ngTableParams', '$modal', 'MeanUser', '$rootScope', 
  function($scope, $stateParams, $location, Global, Tasks, $filter, NgTableParams, modal, MeanUser, $rootScope) {
    $scope.global = Global;
    $scope.status = ['Open', 'In progress', 'Pending QA', 'Verified'];
    $scope.types = ['Story', 'Bug', 'Test Case'];

    $scope.dummyTask = {
      type: $scope.types[0],
      name: 'asd',
      time: 12,
      completed_by: '05/11/2014',
      status: $scope.status[0],
      brd_url: 'http://asd.com',
      description: 'asd'
    };

    $scope.loadDummyData = function(){
      $scope.selectedType = $scope.dummyTask.type;
      $scope.name = $scope.dummyTask.name;
      $scope.time = $scope.dummyTask.time;
      $scope.selectedStatus = $scope.dummyTask.status;
      $scope.completed_by = new Date();
      $scope.brd_url = $scope.dummyTask.brd_url;
      $scope.description = $scope.dummyTask.description;
    };

    $scope.go = function ( path ) {
      $location.path( '/projects/' + $stateParams.projectId + '/tasks/'+ path );
    };

    $scope.hasAuthorization = function(task) {
      if (!task) return false;
      return ($scope.global.isAdmin);
    };

    $rootScope.$on('createTask', function(event, data){
      $scope.tableParams.data.push(data);
      //console.log(data);
    });

    $scope.remove = function(task) {
      if (task) {
        task.$remove();

        for (var i in $scope.tasks) {
          if ($scope.tasks[i] === task) {
            $scope.tasks.splice(i, 1);
          }
        }
        for (var c in $scope.tableParams.data) {
          if ($scope.tableParams.data[c] === task) {
            $scope.tableParams.data.splice(c, 1);
          }
        }
      } else {
        $scope.task.$remove(function(response) {
          $location.path('tasks');
        });
      }
    };

    

    $scope.find = function() {
      $scope.filterBy = 'all';
      Tasks.query(function(tasks) {
        $scope.tasks = tasks;
        /* jshint ignore:start */
        /* jshint ignore:end */
        var data = $scope.tasks;

        $scope.tableParams = new NgTableParams({
          page: 1,            // show first page
          count: 10,          // count per page
          sorting: {
            completed_by: 'asc' // initial sorting
          },
          filter:{
            project: $stateParams.projectId
          }
        }, {
            total: function($defer, params){
              /* jshint ignore:start */
              params.sorting() ?
                $filter('filter')(data, params.filter()).length : data.length;
              /* jshint ignore:end */
              }, // length of $scope.tasks
            getData: function($defer, params) {
                // use build-in angular filter
                var orderedData = params.sorting() ?
                                  //$filter('orderBy')(data, params.orderBy()) :
                                  $filter('filter')(data, params.filter()) :
                                  data;

                $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
            }
        });
        
      });
    };

    $scope.findOne = function() {
      Tasks.get({
        taskId: $stateParams.taskId
      }, function(task) {
        $scope.task = task;
      });
    };

    $scope.open = function(){
      var modalInstance = modal.open({
        templateUrl:'myModalContent.html',
        controller: 'CreateTaskController',
        size: 'lg'
      });
      
      setTimeout(
        function(){
          $rootScope.$broadcast('showModal', modalInstance);
        }, 500);
    };
  }
])
.controller('CreateTaskController', ['$scope', '$stateParams', '$location', 'Global', 'Tasks', '$filter', 'ngTableParams', 'MeanUser', '$rootScope',
  function($scope, $stateParams, $location, Global, Tasks, $filter, NgTableParams, MeanUser, $rootScope) {

      $scope.global = Global;
      $scope.status = ['Open', 'In progress', 'Pending QA', 'Verified'];
      $scope.types = ['Story', 'Bug', 'Test Case'];

      $scope.dummyTask = {
        type: $scope.types[0],
        name: 'asd',
        time: 12,
        completed_by: '05/11/2014',
        status: $scope.status[0],
        brd_url: 'http://asd.com',
        description: 'asd'
      };

      $scope.loadDummyData = function(){
        $scope.selectedType = $scope.dummyTask.type;
        $scope.name = $scope.dummyTask.name;
        $scope.time = $scope.dummyTask.time;
        $scope.selectedStatus = $scope.dummyTask.status;
        $scope.completed_by = new Date();
        $scope.brd_url = $scope.dummyTask.brd_url;
        $scope.description = $scope.dummyTask.description;
        
      };

      $scope.go = function ( path ) {
        $location.path( '/projects/' + $stateParams.projectId + '/tasks/'+ path );
      };

      $scope.hasAuthorization = function(task) {
        if (!task) return false;
        return ($scope.global.isAdmin);
      };

      $scope.create = function(isValid) {
        if (isValid) {
          var task = new Tasks({
            name: this.name,
            description: this.description,
            assigned_to: this.taskForm.assigned_to.$modelValue,
            report_to: this.taskForm.report_to.$modelValue,
            completed_by: this.completed_by,
            brd_url: this.brd_url,
            status: this.selectedStatus,
            time: this.time,
            type: this.selectedType,
            project: $stateParams.projectId
          });
          task.$save(function(response) {
            //try to hide here the modal
            MeanUser.get({
            userId : response.report_to//'5428b912eb4e7d2825c9b652'
            }, function(user){
              response.report_to = user;
                MeanUser.get({
                  userId : response.assigned_to//'5428b912eb4e7d2825c9b652'
                }, function(user){
                  response.assigned_to = user;
                  $rootScope.$broadcast('createTask', response);
                  $rootScope.$modalInstance.close();
                });
            });
            //$scope.$modalInstance.close(); //here should go
            //$location.path('tasks/' + response._id);
          });

          this.name = '';
          this.description = '';
        } else {
          $scope.submitted = true;
        }
      };

      // $rootScope $on
      var myListener = $rootScope.$on('showModal', function(event, data){
            console.log(data);
            $rootScope.$modalInstance = data;
          });

      // $scope $destroy
      $scope.$on('$destroy', myListener);

      $scope.update = function(isValid) {
      if (isValid) {
        var task = $scope.task;
        if (!task.updated) {
          task.updated = [];
        }
        task.updated.push(new Date().getTime());

        task.$update(function() {
          $location.path('tasks/' + task._id);
        });
      } else {
        $scope.submitted = true;
      }
    };

      
    }
])
.controller('CommentsController', ['$scope', '$stateParams', '$location', 'Global', 'Comments', 'Tasks', 'MeanUser', 'Users', 
  function($scope, $stateParams, $location, Global, Comments, Tasks, MeanUser, Users) {
    $scope.global = Global;
    
    /*$scope.go = function ( path ) {
      $location.path( '/comments/'+ path );
    };*/

    $scope.hasAuthorization = function(comment) {
      if (!comment || !comment.assigned_to || !comment.report_to) return false;
      return ($scope.global.isAdmin) || (comment.assigned_to._id === $scope.global.user._id || comment.report_to._id === $scope.global.user._id);
    };

    $scope.createOrUpdate = function(isValid){
      if (isValid) {
        if($scope.updating !== true)
        {
          $scope.create();
        }
        else
        {
          $scope.update();
        }
      } 
      else 
      {
        $scope.submitted = true;
      }
    };

    $scope.create = function() {
      var comment = new Comments({
        user: $scope.global.user,
        message: this.message,
        task: $scope.task
      });
      comment.$save(function(response) {
        $scope.comments.push(response);
        //add the new comment to the DOM after the location path or instead of.
        //$location.path('tasks/' + $stateParams.taskId);
      });

      this.message = '';      
    };

    $scope.update = function(){
      $scope.comment.message = this.message;
      var comment = $scope.comment;
      if (!comment.updated) {
        comment.updated = [];
      }
      comment.updated.push(new Date().getTime());

      comment.$update({commentId: comment._id},function() {
        $scope.find();
      });
      $scope.updating = false;
      this.message = '';
    };

    //$scope.commentsTest = [];
    $scope.find = function(){
      $scope.updating = false;
      Users.query(function(users) {
          $scope.users = users;
        });
      Comments.query({
        task_related: $stateParams.taskId
      }, function(comments) {
        var log = [];
        $scope.comments = comments;
        angular.forEach(comments, function(value, key) {
          var rand = Math.random();
          if(rand>=0.3&& rand<=0.6){
            $scope.randomPP= '/system/assets/img/profile-pic.png';
          }
          else if(rand>0.6){
            $scope.randomPP= '/system/assets/img/profile-pic2.png';
          }
          else{
            $scope.randomPP= '/system/assets/img/profile-pic3.png';
          }
        MeanUser.get({
          userId : value.commented_by//'5428b912eb4e7d2825c9b652'
          }, function(user){
            $scope.comments[key].commented_by_name = user.name;
            $scope.comments[key].profile_pic = user.profile_pic;
          });
          //console.log("key: " + key +", value: "+value);
        }, log);
      });
    };

    $scope.edit = function(comment, $event){
      if($($event.target).parent().find('.commented_by').text() === $scope.global.user._id)
      {
        $scope.updating = true;
        $($event.target).parent().parent().find('.editing-comment').show();
        $(this).find('editing-comment').show();
        $scope.comment = comment;
        $scope.message = comment.message;
      }
    };

    $scope.restoreComment = function(){
      $scope.removeComment = false;
      clearTimeout($scope.removeComment);
      $('#restore-comment').fadeOut(500);
      $scope.find();
    };

    $scope.remove = function(comment, $event) {
      if($($event.target).parent().find('.commented_by').text() === $scope.global.user._id)
      {
        if (comment) {
          for (var i in $scope.comments) {
            if ($scope.comments[i] === comment) {
              $scope.comments.splice(i, 1);
              $scope.removeComment = true;
              $('#restore-comment').fadeIn(500);
            }
          }
          $scope.deleteComment = setTimeout(function(){
            if($scope.removeComment === true)
            {
              comment.$remove({ commentId: comment._id});
            }
            $('#restore-comment').fadeOut(500);
          }, 5000);
        } else {
          $scope.comment.$remove(function(response) {
            $scope.find();
          });
        }
      }
    };

    $scope.findTask = function() {
      Tasks.get({
        taskId: $stateParams.taskId
      }, function(task) {
        $scope.task = task;
      });
    };
  }
]);
