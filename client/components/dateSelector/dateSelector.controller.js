/**
 * Created by leon on 1/2/17.
 */
'use strict';

var app = angular.module('engineStatusApp');

app.controller('DateSelectorCtrl', function($scope, ToDateObjectService) {
  ToDateObjectService.convertAll($scope.parentObject);
  $scope.datePickers = {};
  $scope.openDatePicker = function(dp) {
    $scope.datePickers[dp] = true;
  };

  $scope.dateOptions = {
    formatYear: 'yy',
    maxDate: new Date(2050, 5, 22),
    minDate: new Date(2000,1,1),
    startingDay: 1
  };

});
