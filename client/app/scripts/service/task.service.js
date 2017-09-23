/**
 * Created by leon on 17/2/17.
 */
'use strict';

angular.module('engineStatusApp')
  .service('taskService', function($http) {
    return {
      getTaskList : function () {
        return $http({
          method: 'GET',
          url: '/api/task',
          params:{}
        })
      },
      getUnassignedTasks : function (ids) {
        if(!ids) {
          return;
        }
        console.log('---------task.service: sending data to backend:' + ids);
        return $http({
          method: 'POST',
          url: '/api/assignment/unassignedtasks',
          //params:{traineeId:id}
          data: {
            userIds: ids
          }
        })
      },
      assignTasks : function (traineeIds, taskIds) {
        return $http({
          method: 'POST',
          url: '/api/assignment/bulkassign',
          data:{
            userIds: traineeIds,
            taskIds: taskIds
          }
        })
      },
    }
  });
