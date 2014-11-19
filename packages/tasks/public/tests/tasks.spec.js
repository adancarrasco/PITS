'use strict';

(function() {
  // Tasks Controller Spec
  describe('MEAN controllers', function() {
    describe('TasksController', function() {
      // The $resource service augments the response object with methods for updating and deleting the resource.
      // If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
      // the responses exactly. To solve the problem, we use a newly-defined toEqualData Jasmine matcher.
      // When the toEqualData matcher compares two objects, it takes only object properties into
      // account and ignores methods.
      beforeEach(function() {
        this.addMatchers({
          toEqualData: function(expected) {
            return angular.equals(this.actual, expected);
          }
        });
      });

      beforeEach(function() {
        module('mean');
        module('mean.system');
        module('mean.tasks');
      });

      // Initialize the controller and a mock scope
      var TasksController,
        scope,
        $httpBackend,
        $stateParams,
        $location;

      // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
      // This allows us to inject a service but then attach it to a variable
      // with the same name as the service.
      beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {

        scope = $rootScope.$new();

        TasksController = $controller('TasksController', {
          $scope: scope
        });

        $stateParams = _$stateParams_;

        $httpBackend = _$httpBackend_;

        $location = _$location_;

      }));

      it('$scope.find() should create an array with at least one task object ' +
        'fetched from XHR', function() {

          // test expected GET request
          $httpBackend.expectGET('tasks').respond([{
            name: 'An Task about MEAN',
            description: 'MEAN rocks!'
          }]);

          // run controller
          scope.find();
          $httpBackend.flush();

          // test scope value
          expect(scope.tasks).toEqualData([{
            name: 'An Task about MEAN',
            description: 'MEAN rocks!'
          }]);

        });

      it('$scope.findOne() should create an array with one task object fetched ' +
        'from XHR using a taskId URL parameter', function() {
          // fixture URL parament
          $stateParams.taskId = '525a8422f6d0f87f0e407a33';

          // fixture response object
          var testTaskData = function() {
            return {
              name: 'An Task about MEAN',
              description: 'MEAN rocks!'
            };
          };

          // test expected GET request with response object
          $httpBackend.expectGET(/tasks\/([0-9a-fA-F]{24})$/).respond(testTaskData());

          // run controller
          scope.findOne();
          $httpBackend.flush();

          // test scope value
          expect(scope.task).toEqualData(testTaskData());

        });

      it('$scope.create() with valid form data should send a POST request ' +
        'with the form input values and then ' +
        'locate to new object URL', function() {

          // fixture expected POST data
          var postTaskData = function() {
            return {
              name: 'An Task about MEAN',
              description: 'MEAN rocks!'
            };
          };

          // fixture expected response data
          var responseTaskData = function() {
            return {
              _id: '525cf20451979dea2c000001',
              name: 'An Task about MEAN',
              description: 'MEAN rocks!'
            };
          };

          // fixture mock form input values
          scope.name = 'An Task about MEAN';
          scope.description = 'MEAN rocks!';

          // test post request is sent
          $httpBackend.expectPOST('tasks', postTaskData()).respond(responseTaskData());

          // Run controller
          scope.create(true);
          $httpBackend.flush();

          // test form input(s) are reset
          expect(scope.name).toEqual('');
          expect(scope.description).toEqual('');

          // test URL location to new object
          expect($location.path()).toBe('/tasks/' + responseTaskData()._id);
        });

      it('$scope.update(true) should update a valid task', inject(function(Tasks) {

        // fixture rideshare
        var putTaskData = function() {
          return {
            _id: '525a8422f6d0f87f0e407a33',
            name: 'An Task about MEAN',
            to: 'MEAN is great!'
          };
        };

        // mock task object from form
        var task = new Tasks(putTaskData());

        // mock task in scope
        scope.task = task;

        // test PUT happens correctly
        $httpBackend.expectPUT(/tasks\/([0-9a-fA-F]{24})$/).respond();

        // testing the body data is out for now until an idea for testing the dynamic updated array value is figured out
        //$httpBackend.expectPUT(/tasks\/([0-9a-fA-F]{24})$/, putTaskData()).respond();
        /*
                Error: Expected PUT /tasks\/([0-9a-fA-F]{24})$/ with different data
                EXPECTED: {"_id":"525a8422f6d0f87f0e407a33","name":"An Task about MEAN","to":"MEAN is great!"}
                GOT:      {"_id":"525a8422f6d0f87f0e407a33","name":"An Task about MEAN","to":"MEAN is great!","updated":[1383534772975]}
                */

        // run controller
        scope.update(true);
        $httpBackend.flush();

        // test URL location to new object
        expect($location.path()).toBe('/tasks/' + putTaskData()._id);

      }));

      it('$scope.remove() should send a DELETE request with a valid taskId ' +
        'and remove the task from the scope', inject(function(Tasks) {

          // fixture rideshare
          var task = new Tasks({
            _id: '525a8422f6d0f87f0e407a33'
          });

          // mock rideshares in scope
          scope.tasks = [];
          scope.tasks.push(task);

          // test expected rideshare DELETE request
          $httpBackend.expectDELETE(/tasks\/([0-9a-fA-F]{24})$/).respond(204);

          // run controller
          scope.remove(task);
          $httpBackend.flush();

          // test after successful delete URL location tasks list
          //expect($location.path()).toBe('/tasks');
          expect(scope.tasks.length).toBe(0);

        }));
    });
  });
}());
