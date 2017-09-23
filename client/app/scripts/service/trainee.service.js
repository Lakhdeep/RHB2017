/**
 * Created by L on 3/29/2017.
 */
'use strict';

angular.module('engineStatusApp')
  .service('TraineeService', function($http) {
    return {
      signOffTask : function (task) {
        return $http({
          method: 'PUT',
          url: baseUrl + '/assignment/signoff/',
          data: task
        })
      },
      saveAnswer : function (task) {
        return $http({
          method: 'PUT',
          url: baseUrl + '/assignment/saveanswer/',
          data: task
        })
      },
      submitForEvaluation : function () {
        return $http({
          method: 'POST',
          url: baseUrl + '/assessment/submit/',
        })
      },
      bulkSignOff : function (ids) {
        return $http({
          method: 'PUT',
          url: baseUrl + '/assignment/bulksignoff/',
          data: {ids:ids}
        })
      },

      getAssignmentList: function () {
        return $http({
          method: 'GET',
          url: apiUrl + '/assignment/filter',
          params:{}
        })
      }
    };

  });
