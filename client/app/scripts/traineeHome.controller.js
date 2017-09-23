'use strict';

angular.module('engineStatusApp')
  .controller('traineeHomeCtrl', function ($scope, Auth, $state, toastr, assignmentList, formOptionService, TraineeService, SweetAlert, $uibModal, currentUser) {
    $scope.evaluation = false;
    $scope.assignmentListToDo = _.filter(assignmentList.data.data.results, {status: 'WIP'});
    $scope.assignmentListPending = _.filter(assignmentList.data.data.results, {status: 'Pending'});
    $scope.assignmentListCompleted = _.filter(assignmentList.data.data.results, {status: 'Completed'});
    // console.log('--------------------assignmentListToDo', $scope.assignmentListToDo);
    // console.log('--------------------assignmentListPending', $scope.assignmentListPending);
    // console.log('--------------------assignmentListCompleted', $scope.assignmentListCompleted);
    // console.log('----------------$scope.user', $scope.token);
    $scope.checkbox = {
      selected : 0
    };

    var j;
    var setOfTaskTypes = new Set();
    var setOfCategories = new Set();
    var completedMT = 0, notSubmitted = false;
    for(j=0; j<assignmentList.data.data.results.length;j++){
      setOfTaskTypes.add(assignmentList.data.data.results[j].task.taskCode);
      setOfCategories.add(assignmentList.data.data.results[j].task.category);
      if(assignmentList.data.data.results[j].status=="Completed" || assignmentList.data.data.results[j].category=="MT"){
        completedMT++;
      }
    }

    var inProgress = false;
    if( assignmentList.data.data.results.length > 0) {
      var minRequirement = currentUser.data.data.enrolledPrg.minRequirement;
      console.log('----------------minRequirement', minRequirement);
      console.log('----------------completedMT', completedMT);
      if(completedMT>=minRequirement && (assignmentList.data.data.results[0].trainee.status == 'WIP') ){
        $scope.evaluation = true;

        if(!inProgress) {
          inProgress = true;

          TraineeService.submitForEvaluation()
            .success(function (data) {
              $scope.getAssignmentList();
              // toastr.success('Submitted for evaluation!', 'Success!');
              // $scope.evaluation = false;
              inProgress = false;
            }).error(function (err) {
            console.log(err);
          });
        }
      }
    }


    $scope.taskCodes = Array.from(setOfTaskTypes);
    $scope.categories = Array.from(setOfCategories);

    $scope.openTaskModal = function (current) {
      $scope.current = current;
      console.log("-----------------", current);
      if(current.task._type == 'Part1'){
        var modalInstance = $uibModal.open({
          animation: true,
          templateUrl: 'app/views/modals/task1Details.modal.html',
          controller:'traineeTaskDetailsCtrl',
          size: 'lg',
          scope: $scope
        });
      }else{
        var modalInstance = $uibModal.open({
          animation: true,
          templateUrl: 'app/views/modals/task2Details.modal.html',
          controller:'traineeTaskDetailsCtrl',
          size: 'lg',
          scope: $scope
        });
      }
    };

    $scope.getAssignmentList = function() {
      TraineeService.getAssignmentList()
        .then(function (res) {
          // $scope.assignmentList = res.data.data.results;
          $scope.assignmentListToDo = _.filter(res.data.data.results, {status: 'WIP'});
          $scope.assignmentListPending = _.filter(res.data.data.results, {status: 'Pending'});
          $scope.assignmentListCompleted = _.filter(res.data.data.results, {status: 'Completed'});
        }, function (err) {
          console.log(err);
        })
    };

    $scope.bulkSignOff = function (assignmentList) {

      SweetAlert.swal({
          title: "Sign off selected tasks?", //Bold text
          //text: "It will be reverted back the students' to do list!", //light text
          type: "warning", //type -- adds appropiriate icon
          showCancelButton: true, // displays cancel btton
          confirmButtonColor: "#DD6B55",
          confirmButtonText: "Yes",
          closeOnConfirm: true, //do not close popup after click on confirm, usefull when you want to display a subsequent popup
          closeOnCancel: true
        },
        function(isConfirm) { //Function that triggers on user action.
          if (isConfirm) {
            //bulk sign off
            var ids=[];
            var i=0;
            for(i=0; i<assignmentList.length; i++){
              if(assignmentList[i].isSelected){
                ids.push(assignmentList[i]._id);
              }
            }
            console.log('--------------------ids', ids);
            TraineeService.bulkSignOff(ids)
              .success(function (data) {
                $scope.getAssignmentList();
                toastr.success('Task Updated!', 'Success!');
                //redirect to new created detail page
                $state.go('trainee.traineeHome');
              }).error(function (err) {
              console.log(err);
            });
          }
        });
    }

    // var inProgress = false;
    // $scope.submitForEvaluation = function () {
    //   if(!inProgress) {
    //     inProgress = true;
    //
    //     TraineeService.submitForEvaluation()
    //       .success(function (data) {
    //         $scope.getAssignmentList();
    //         toastr.success('Submitted for evaluation!', 'Success!');
    //         $scope.evaluation = false;
    //         inProgress = false;
    //       }).error(function (err) {
    //       console.log(err);
    //     });
    //   }
    // }
  })

  .controller('traineeTaskDetailsCtrl', function ($scope, $uibModalInstance, TraineeService, formOptionService, $http, $state, SweetAlert, toastr) {
    $scope.signOffParams = {
    };

    $scope.signOffTask = function (current) {
      SweetAlert.swal({
          title: "Sign off current task?", //Bold text
          //text: "It will be reverted back the students' to do list!", //light text
          type: "warning", //type -- adds appropiriate icon
          showCancelButton: true, // displays cancel btton
          confirmButtonColor: "#DD6B55",
          confirmButtonText: "Yes",
          closeOnConfirm: true, //do not close popup after click on confirm, usefull when you want to display a subsequent popup
          closeOnCancel: true
        },
        function(isConfirm) { //Function that triggers on user action.
          if (isConfirm) {
            //bulk sign off
            console.log('--------------------current', current, $scope.signOffParams.answer);
            var task = current;
            TraineeService.signOffTask(task)
              .success(function (data) {
                $uibModalInstance.close('updated');
                // $scope.getCustomer($scope.customer._id);
                $scope.getAssignmentList();
                // $scope.assignmentList = {};
                console.log('--------------------assignmentList', $scope.assignmentList);
                toastr.success('Task Updated!', 'Success!');
                //redirect to new created detail page
                // $state.go('trainee.traineeHome');
              }).error(function (err) {
              console.log(err);
            });
          }
        });

    }

    $scope.saveAnswer = function (current) {
      console.log('--------------------current', current);
      var task = current;
      TraineeService.saveAnswer(task)
        .success(function (data) {
          // $uibModalInstance.close('updated');
          // $scope.getCustomer($scope.customer._id);
          $scope.getAssignmentList();
          // $scope.assignmentList = {};
          console.log('--------------------assignmentList', $scope.assignmentList);
          toastr.success('Task Saved!', 'Success!');
          //redirect to new created detail page
          // $state.go('trainee.traineeHome');
        }).error(function (err) {
        console.log(err);
      });

    }
  });
