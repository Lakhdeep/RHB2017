/**
 * Created by leon on 17/2/17.
 */
'use strict';

angular.module('engineStatusApp')
  .service('traineeListService', function($http) {
    return {
      getTraineeList : function () {
        return $http({
          method: 'GET',
          url: '/api/user/trainee',
          params:{}
        })
      },
      evaluate: function (assessment) {
        return $http({
          method: 'POST',
          url: '/api/assessment',
          data:assessment
        })
      },
      getTraineeDetails : function (id) {
        return $http({
          method: 'GET',
          url: '/api/assignment/filter?traineeId='+id
          //params:{traineeId:id}
        })
      }
    }
  });
