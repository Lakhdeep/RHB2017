'use strict';

angular.module('engineStatusApp')
  .controller('traineeListCtrl', function ($scope, Auth, $http, $state, toastr, traineeList, traineeListService, $uibModal ) {
    //$scope.traineeList = traineeList.data;
    $scope.traineeList = traineeList.data.data;
    //console.log(traineeList);

    $scope.getTraineeList = function() {
      traineeListService.getTraineeList()
        .then(function (res) {
          $scope.traineeList = res.data.data;
        }, function (err) {
          console.log(err);
        })
    };

    $scope.openAssessmentModal = function (trainee) {
      $scope.trainee = trainee;
      var modalInstance = $uibModal.open({
        animation: true,
        templateUrl: 'app/views/traineeListWidget/assessment.modal.html',
        controller:'assessmentCtrl',
        size: 'lg',
        scope: $scope
      });
    };

  })
  .controller('assessmentCtrl', function ($scope, Auth, $uibModalInstance, $state, traineeListService, toastr) {
    //Control the assigned tasks, pending review tasks and completed tasks
    if($scope.trainee.assessment) {
      $scope.answer = $scope.trainee.assessment.answers.first.answer;
    } else {
      $scope.answer = ["Pass","Pass","Pass","Pass","Pass","Pass"];
    }

    $scope.evaluate = function() {
      var currentAnswer  = $scope.answer, passed, first, second;
      if( currentAnswer.indexOf('Fail') > -1) {
        passed = false;
      } else {
        passed = true;
      }
      //if the assessment exist, it means this trainee has already been evaluated
      if($scope.trainee.assessment) {
        first = $scope.trainee.assessment.answers.first;
        second = {
          date : Date.now(),
          answer: currentAnswer
        }
      } else {
        first = {
          date : Date.now(),
          answer: currentAnswer
        };
        second = null;
      }
      var assessment = {
        trainee: $scope.trainee._id,
        program : $scope.trainee.enrolledPrg,
        answers : {
          first: first,
          second: second
        },
        passed : passed
      };

      traineeListService.evaluate(assessment)
        .success(function (data) {
          $scope.getTraineeList();
          $uibModalInstance.close('updated');
          toastr.success('Trainee Evaluated!', 'Success!');
          //redirect to new created detail page
          $state.go('assessor.traineeInfo');
        }).error(function (err) {
        console.log(err);
      });
    }
  })
  .controller('assessorHomeCtrl', function ($scope, Auth, $state, toastr, assignmentList, formOptionService, AssessorService, TraineeService, SweetAlert, $uibModal) {
    console.log("---------------assignmentList", assignmentList.data.data);
    $scope.assignmentListToDo = _.filter(assignmentList.data.data, {status: 'WIP'});
    $scope.assignmentListPending = _.filter(assignmentList.data.data, {status: 'Pending'});
    $scope.assignmentListCompleted = _.filter(assignmentList.data.data, {status: 'Completed'});
    console.log('--------------------assignmentListToDo', $scope.assignmentListToDo);
    console.log('--------------------assignmentListPending', $scope.assignmentListPending);
    console.log('--------------------assignmentListCompleted', $scope.assignmentListCompleted);
    $scope.checkbox = {
      selected : 0
    };

    var j;
    var setOfTaskTypes = new Set();
    var setOfCategories = new Set();
    for(j=0; j<assignmentList.data.data.length;j++){
      setOfTaskTypes.add(assignmentList.data.data[j].task.taskCode);
      setOfCategories.add(assignmentList.data.data[j].task.category);
    }

    $scope.taskCodes = Array.from(setOfTaskTypes);
    $scope.categories = Array.from(setOfCategories);

    $scope.openTaskModal = function (current) {
      $scope.current = current;
      if(current.task._type == 'Part1'){
        var modalInstance = $uibModal.open({
          animation: true,
          templateUrl: 'app/views/assessorHomeWidget/modals/completed.task1.modal.html',
          controller:'taskDetailsCtrl',
          size: 'lg',
          scope: $scope
        });
      }else{
        var modalInstance = $uibModal.open({
          animation: true,
          templateUrl: 'app/views/assessorHomeWidget/modals/completed.task2.modal.html',
          controller:'taskDetailsCtrl',
          size: 'lg',
          scope: $scope
        });
      }
    };

    $scope.openTask1Modal = function (assignmentList) {
      $scope.assignmentList = assignmentList;
        var modalInstance = $uibModal.open({
          animation: true,
          templateUrl: '/app/views/assessorHomeWidget/modals/pendingReview.task1Details.modal.html',
          controller:'taskDetailsCtrl',
          size: 'lg',
          scope: $scope
        });

    };

    $scope.openTask2Modal = function (current) {
      $scope.current = current;
      var modalInstance = $uibModal.open({
        animation: true,
        templateUrl: 'app/views/assessorHomeWidget/modals/pendingReview.task2Details.modal.html',
        controller:'taskDetailsCtrl',
        size: 'lg',
        scope: $scope
      });

    };

    $scope.getAssignmentList = function() {
      //console.log("-----------------getAssignmentList");
      AssessorService.getAssignmentList()
        .then(function (res) {
          $scope.assignmentListToDo = _.filter(res.data.data, {status: 'WIP'});
          $scope.assignmentListPending = _.filter(res.data.data, {status: 'Pending'});
          $scope.assignmentListCompleted = _.filter(res.data.data, {status: 'Completed'});
        }, function (err) {
          console.log(err);
        })
    };

    $scope.bulkUnassign = function (assignmentList) {
      SweetAlert.swal({
          title: "Remove selected tasks?", //Bold text
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
            //Do bulk remove
            console.log('--------------------bulkUnassign', assignmentList);
            var ids = [];
            var i = 0;
            for (i = 0; i < assignmentList.length; i++) {
              if (assignmentList[i].isSelected) {
                console.log('--------------------assignment selected', assignmentList[i]._id, assignmentList[i].status);
                ids.push(assignmentList[i]._id);
              }
            }
            AssessorService.bulkUnassign(ids)
              .success(function (data) {
                $scope.getAssignmentList();
                toastr.success('Assignment Removed!', 'Success!');
                $state.go('assessor.assessorHome');
              }).error(function (err) {
              console.log(err);
            });
          } else {//if the user cancels, there is no actions to be taken
            //SweetAlert.swal("Your file is safe!");
          }
        });
    };

    $scope.reject = function (assignmentList) {
      SweetAlert.swal({
          title: "Reject selected tasks?", //Bold text
          text: "Tasks will be reverted back the students' to do list!", //light text
          type: "warning", //type -- adds appropiriate icon
          showCancelButton: true, // displays cancel btton
          confirmButtonColor: "#DD6B55",
          confirmButtonText: "Yes",
          closeOnConfirm: true, //do not close popup after click on confirm, usefull when you want to display a subsequent popup
          closeOnCancel: true
        },
        function(isConfirm) { //Function that triggers on user action.
          if (isConfirm) {
            //reject the assignments
            var ids = [];
            var i = 0;
            if(assignmentList instanceof Array) {
              for (i = 0; i < assignmentList.length; i++) {
                if (assignmentList[i].isSelected) {
                  console.log('--------------------assignment selected', assignmentList[i]._id, assignmentList[i].status);
                  ids.push(assignmentList[i]._id);
                }
              }
            } else {
              ids.push(assignmentList._id);
            }
            AssessorService.reject(ids)
              .success(function (data) {
                $scope.getAssignmentList();
                toastr.success('Assignment Rejected!', 'Success!');
                $state.go('assessor.assessorHome');
              }).error(function (err) {
              console.log(err);
            });

         } else {
            //SweetAlert.swal("Your file is safe!");
          }
        });
    };
  })
  .controller('taskDetailsCtrl', function ($scope, $uibModalInstance, AssessorService, formOptionService, $http, $state, SweetAlert, toastr) {
    $scope.signOffParams = {
    };

    $scope.bulkSignOff = function (assignmentList, rating) {
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
            var ids=[];
            var i=0;
            for(i=0; i<assignmentList.length; i++){
              if(assignmentList[i].isSelected){
                ids.push(assignmentList[i]._id);
              }
            }
            AssessorService.bulkSignOff(ids, rating)
              .success(function (data) {
                $uibModalInstance.close('updated');
                $scope.getAssignmentList();
                var additionalString="";
                if(data.data){
                  if(data.data.nModified == 1){
                    additionalString = '1 new trainee to be evaluated.';
                  }else if(data.data.nModified > 1){
                    additionalString = data.data.nModified + ' new trainees to be evaluated.';
                  }
                }
                toastr.success(additionalString,'Task Updated!');
                //redirect to new created detail page
                $state.go('assessor.assessorHome');
              }).error(function (err) {
              console.log(err);
            });

          } else {
          }
        });
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
            //Do bulk sign off
            var task = current;
            AssessorService.signOffTask(task)
              .success(function (data) {
                $uibModalInstance.close('updated');
                $scope.getAssignmentList();
                var additionalString="";
                if(data.data){
                  if(data.data.nModified == 1){
                    additionalString = '1 new trainee to be evaluated.';
                  }else if(data.data.nModified > 1){
                    additionalString = data.data.nModified + ' new trainees to be evaluated.';
                  }
                }
                toastr.success(additionalString,'Task Updated!');
                //redirect to new created detail page
                $state.go('assessor.assessorHome');
              }).error(function (err) {
              console.log(err);
            });
          }
        });
    };

    $scope.reject = function (assignmentList) {
      SweetAlert.swal({
          title: "Reject selected tasks?", //Bold text
          text: "Tasks will be reverted back the students' to do list!", //light text
          type: "warning", //type -- adds appropiriate icon
          showCancelButton: true, // displays cancel btton
          confirmButtonColor: "#DD6B55",
          confirmButtonText: "Yes",
          closeOnConfirm: true, //do not close popup after click on confirm, usefull when you want to display a subsequent popup
          closeOnCancel: true
        },
        function(isConfirm) { //Function that triggers on user action.
          if (isConfirm) {
            //reject the assignments
            var ids = [];
            var i = 0;
            if(assignmentList instanceof Array) {
              for (i = 0; i < assignmentList.length; i++) {
                if (assignmentList[i].isSelected) {
                  console.log('--------------------assignment selected', assignmentList[i]._id, assignmentList[i].status);
                  ids.push(assignmentList[i]._id);
                }
              }
            } else {
              ids.push(assignmentList._id);
            }
            AssessorService.reject(ids)
              .success(function (data) {
                $uibModalInstance.close('updated');
                $scope.getAssignmentList();
                toastr.success('Assignment Rejected!', 'Success!');
                $state.go('assessor.assessorHome');
              }).error(function (err) {
              console.log(err);
            });

          } else {
            //SweetAlert.swal("Your file is safe!");
          }
        });
    };
  })
  .controller('traineeAssignmentCtrl', function ($scope, Auth, $http, $state, toastr, traineeList, traineeAssignmentList, currentTrainee, $uibModal ) {
    $scope.currentTrainee = currentTrainee.data.data;
    //remove the current trainnee from the trainee list for the dropdown option
    $scope.traineeList = traineeList.data.data.filter(function(item) {
      return item._id != $scope.currentTrainee._id;
    });

    $scope.assignmentList = traineeAssignmentList.data.data.results;

    var setOfTaskTypes = new Set();
    var setOfCategories = new Set();
    var setOfStatuses = new Set();

    for (var j = 0; j < $scope.assignmentList.length; j++) {
      setOfTaskTypes.add($scope.assignmentList[j].task.taskCode);
      setOfCategories.add($scope.assignmentList[j].task.category);
      setOfStatuses.add($scope.assignmentList[j].status);
    }

    $scope.taskCodes = Array.from(setOfTaskTypes);
    $scope.categories = Array.from(setOfCategories);
    $scope.statuses = Array.from(setOfStatuses);

    $scope.changeTrainee = function () {
      $state.go('assessor.traineeDetails', {traineeId: $scope.selectedTrainee});
    }

    $scope.showTaskDetails = function (current) {
      $scope.current = current;
      console.log("-----------------", current);
      if(current.task._type == 'Part1'){
        var modalInstance = $uibModal.open({
          animation: true,
          templateUrl: 'app/views/traineeDetailsWidget/task1Details.modal.html',
          controller:'taskDetailsCtrl',
          size: 'lg',
          scope: $scope
        });
      }else{
        var modalInstance = $uibModal.open({
          animation: true,
          templateUrl: 'app/views/traineeDetailsWidget/task2Details.modal.html',
          controller:'taskDetailsCtrl',
          size: 'lg',
          scope: $scope
        });
      }
    };
  });
