'use strict';

angular.module('engineStatusApp')
  .controller('assignTaskCtrl', function ($scope, taskService, traineeListService, $http, $state, toastr, $uibModal, traineeList) {
    $scope.taskList = [];
    $scope.noAssign = true;
    // $scope.traineeList = traineeList.data.data;
    $scope.traineeList = _.filter(traineeList.data.data, function(user){return user.status != 'Completed'});
    $scope.selected ={
      trainees: [],
      tasks:[]
    } ;
    $scope.assignInProgress = false;


    //get undone tasks given the trainee
    $scope.getTaskList = function (selectedTrainees) {
      if (selectedTrainees.length < 1) {
        $scope.taskList = [];
        $scope.noAssign = true;
        return;
      }
      var traineeIds = [], i = 0;
      for (i = 0; i < selectedTrainees.length; i++) {
        traineeIds.push(selectedTrainees[i]._id);
      }

      taskService.getUnassignedTasks(traineeIds)
        .success(function (results) {
          $scope.taskList = results.data;
          $scope.noAssign = false;

          //get the type and category for filtering
          var j;
          var setOfTaskTypes = new Set();
          var setOfCategories = new Set();
          for (j = 0; j < $scope.taskList.length; j++) {
            setOfTaskTypes.add($scope.taskList[j].taskCode);
            setOfCategories.add($scope.taskList[j].category);
          }
          $scope.taskCodes = Array.from(setOfTaskTypes);
          $scope.categories = Array.from(setOfCategories);
        }).error(function (err) {
        console.log(err);
      });
    };

    //assign multiple tasks to each trainee in the trainee list
    $scope.assign = function(selectedTrainees, taskList) {
      if (!$scope.assignInProgress) {
        $scope.assignInProgress = true;

        var traineeIds = [], taskIds = [], i;
        for (i = 0; i < selectedTrainees.length; i++) {
          console.log('--------------------trainees ', selectedTrainees[i]._id, selectedTrainees[i].status);
          traineeIds.push(selectedTrainees[i]._id);
        }

        for (i = 0; i < taskList.length; i++) {
          //console.log('--------------------tasks ', taskList[i]._id, taskList[i].status);
          if (taskList[i].isSelected) {
            console.log('--------------------tasks selected', taskList[i]._id, taskList[i].status);
            taskIds.push(taskList[i]._id);
          }
        }

        taskService.assignTasks(traineeIds, taskIds)
          .success(function (results) {
            $scope.taskList = [];
            toastr.success('Task Assigned!', 'Success!');
            $state.go('assessor.assessorHome');
            $scope.assignInProgress = false;
          }).error(function (err) {
          console.log(err);
        });
      }
    };




  });
