'use strict';

const apiUrl = "/api";
const baseUrl = apiUrl;

angular.module('engineStatusApp', [
  'ngAnimate',
  'toastr',
	'ngCookies',
	'ngResource',
	'ngSanitize',
	'ui.router',
	'ui.bootstrap',
  'ui.bootstrap.showErrors',
  'ui.select',
  'ui.utils.masks',
  'ui.toggle',
  'angular-loading-bar',
  'smart-table',
  'xeditable',
  'oitozero.ngSweetAlert'
])
  //init $http module
  .run(function($http, $rootScope, editableOptions) {
    //global http put and post method header config
    $http.defaults.headers.post = {'Content-Type': ' application/json'};
    $http.defaults.headers.put = {'Content-Type': ' application/json'};
    $rootScope.myDateFormat = 'dd MMM yyyy';

    //xeditable theme config
    editableOptions.theme = 'bs3';
  })
	.config(function($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider) {
    $urlRouterProvider.otherwise('/login');
    $stateProvider
      .state('login', {
        url: '/login',
        templateUrl: 'app/views/login.html',
        controller: 'LoginCtrl'
      })
      .state('trainee',{
        url: '/trainee',
        templateUrl: 'app/views/traineeTemplate.html',
        controller: 'MainCtrl',
        authenticate: true,
        resolve: {
          currentUser: function (UserService) {
            return UserService.getMe();
          }
        }
      })
      .state('assessor',{
        url: '/assessor',
        templateUrl: 'app/views/assessorTemplate.html',
        controller: 'MainCtrl',
        authenticate: true,
        resolve: {
          currentUser: function (UserService) {
            return UserService.getMe();
          }
        }
      })
      .state('trainee.traineeHome', {
      url: '/trainee-dashboard',
      templateUrl: 'app/views/traineeHome.html',
      controller: 'traineeHomeCtrl',
      title: "Trainee Home",
        resolve: {
          assignmentList: function(TraineeService) {
            return TraineeService.getAssignmentList();
          }
        }
    })
      .state('assessor.assessorHome', {
        url: '/assessor-dashboard',
        templateUrl: 'app/views/assessorHome.html',
        controller: 'assessorHomeCtrl',
        title: "Assessor Home",
        resolve: {
          assignmentList: function(AssessorService) {
            return AssessorService.getAssignmentList();
          }
        }
      })
      .state('assessor.courseInfo', {
        url: '/course-info',
        templateUrl: 'app/views/courseInfo.html',
        title: "Course Info"
        //controller: 'LoginCtrl'
      })
      .state('trainee.courseInfo', {
        url: '/course-info',
        templateUrl: 'app/views/courseInfo.html',
        title: "Course Info"
        //controller: 'LoginCtrl'
      })
      .state('assessor.traineeInfo', {
        url: '/trainee',
        templateUrl: 'app/views/assessorTraineeList.html',
        title: "Trainee Info",
        controller: 'traineeListCtrl',
        resolve: {
          traineeList: function(traineeListService) {
            return traineeListService.getTraineeList();
          }
        }
      })
      .state('assessor.traineeDetails', {
        url: '/trainee/{traineeId}',
        templateUrl: 'app/views/traineeDetails.html',
        title: "Trainee Details",
        controller: 'traineeAssignmentCtrl',
        resolve: {
          traineeAssignmentList: function (traineeListService, $stateParams) {
            return traineeListService.getTraineeDetails($stateParams.traineeId);
          },
          currentTrainee: function (UserService, $stateParams) {
            return UserService.get($stateParams.traineeId);
          },
          traineeList: function (traineeListService) {
            return traineeListService.getTraineeList();
          }
        }
      })
      .state('assessor.taskAssignment', {
        url: '/assign-tasks',
        templateUrl: 'app/views/taskAssignment.html',
        title: "Assign Tasks",
        controller: 'assignTaskCtrl',
        resolve: {
          traineeList: function(traineeListService) {
            return traineeListService.getTraineeList();
          }
        }
      })
      .state('assessor.wip', {
      url: '/working-in-progress',
      templateUrl: 'app/views/wip.html',
    })
      .state('trainee.wip', {
        url: '/working-in-progress',
        templateUrl: 'app/views/wip.html',
      })

    $httpProvider.interceptors.push('authInterceptor');

	})

.factory('authInterceptor', function($rootScope, $q, $cookieStore, $location) {
	return {
		// Add authorization token to headers
		request: function(config) {
			config.headers = config.headers || {};
			if ($cookieStore.get('token')) {
				config.headers['x-access-token'] = $cookieStore.get('token');
			}
			return config;
		},

		// Intercept 401s and redirect you to login
		responseError: function(response) {
			if (response.status === 401) {
				$location.path('/login');
				// remove any stale tokens
				$cookieStore.remove('token');
				return $q.reject(response);
			} else {
				return $q.reject(response);
			}
		}
	};
})

.run(function($rootScope, $location, Auth) {
	// Redirect to login if route requires auth and you're not logged in
	$rootScope.$on('$routeChangeStart', function(event, next) {
		Auth.isLoggedInAsync(function(loggedIn) {
			if (next.authenticate && !loggedIn) {
				$location.path('/login');
			}
		});
	});
});
