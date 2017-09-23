/**
 * Created by L on 3/29/2017.
 */
'use strict';

angular.module('engineStatusApp')
  .service('AssessorService', function($http) {
    return {
      signOffTask : function (assignments) {
        return $http({
          method: 'PUT',
          url: baseUrl + '/assignment/signoff/',
          data: assignments
        })
      },
      reject : function (ids) {
        return $http({
          method: 'PUT',
          url: '/api/assignment/bulkreject/',
          data: {
            ids: ids
          }
        })
      },
      saveAnswer : function (task) {
        return $http({
          method: 'PUT',
          url: baseUrl + '/assignment/saveanswer/',
          data: task
        })
      },
      bulkSignOff : function (ids, rating) {
        return $http({
          method: 'PUT',
          url: baseUrl + '/assignment/bulksignoff/',
          data: {ids:ids, rating:rating}
        })
      },
      bulkUnassign : function (ids) {
        console.log("----------------unassign :" + ids.toString());
        return $http({
          method: 'PUT',
          url: baseUrl + '/assignment/bulkunassign',
          data: {ids: ids}
        })
      },
      getAssignmentList: function () {
        return $http({
          method: 'GET',
          url: apiUrl + '/assignment',
          params:{}
        })
      }
    };

  });
