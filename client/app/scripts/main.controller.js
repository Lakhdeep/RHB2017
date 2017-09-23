'use strict';

angular.module('engineStatusApp')
  .controller('MainCtrl', function ($scope, Auth, currentUser, $state) {
    $scope.logout = function () {
      Auth.logout();
      $state.go('login');
    };
    $scope.currentUser = currentUser.data.data;
    console.log('printing current user : ' + $scope.currentUser.toString());


   // $scope.getCurrentUser = function(){
   //   console.log('getting current user');
   //   UserService.getMe()
   //     .success(function (results) {
   //       $scope.currentUser = results.data;
   //       console.log('----currentUser: ' + results.data);
   //     }).error(function (err) {
   //     console.log(err);
   //   });
   // };

  });
