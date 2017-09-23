/**
 * Created by leon on 1/2/17.
 */
'use strict';

angular.module('engineStatusApp')
.directive("dateSelector", function(){
  return {
    restrict: "EA",
    scope: {
      parentObject: '=',
      pickerName: '@',
      isReadonly: '='
    },
    templateUrl: 'components/dateSelector/dateSelector.html',
    controller: 'DateSelectorCtrl'
  };
});
