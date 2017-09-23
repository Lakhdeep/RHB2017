'use strict';

angular.module('engineStatusApp')
  .controller('LoginCtrl', function ($scope, Auth, $state, toastr) {
    $scope.user = {};

    $scope.login = function (form) {
      $scope.submitted = true;

      if (form.$valid) {
        Auth.login({
          email: $scope.user.email,
          password: $scope.user.password
        })
          .then(function (user) {
            // Logged in, keep the user in scope
            //$scope.user = user;
            //if it is a trainee, redirect to Trainee Home Page, if it is a assessor, redirect it to Assessor Home
            //if it is a assessor, go to Assessor Home Page
            if (user._type == 'Assessor') {
              $state.go('assessor.assessorHome');
            } else {
              $state.go('trainee.traineeHome');
            }
          })
          .catch(function (err) {
            $scope.submitted = false;
            toastr.error(err.status.message, 'Failed!')
          });
      } else {
        $scope.errorEnabled = true;
      }
    };
  });
