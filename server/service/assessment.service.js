'use strict';

var _ = require('lodash'),
  when = require('when'),
  assmtDAO = require('../dao/assessment.dao'),
  config = require('../config/environment'),
  userDAO = require('../dao/user.dao');

exports.list = function () {
  return when(assmtDAO.list());
};

exports.findById = function (id) {
  return when(assmtDAO.findById(id));
};

exports.create = function (newRecord) {
  var defer = when.defer();


  userDAO.findById(newRecord.trainee)
    .then(function (trainee) {
      //if trainee has already an assessment, the assessor cannot create a new one.
      // if (trainee.assessment) {
      //   defer.reject("This trainee has already been evaluated, please modify the existing assessment.")
      // } else {
        newRecord.program = trainee.enrolledPrg;

        assmtDAO.create(newRecord)
          .then(function (assmtCreated) {
            trainee.assessment = assmtCreated._id;
            //if the trainee passed, his status changed to 'Completed'
            // if he failed the assessment, he will remain in pending status
            if (newRecord.passed) {
              trainee.status = config.assignmentStatus[2];
            }
            trainee.save();
            defer.resolve(assmtCreated);
          }, function (err) {
            defer.reject(err);
          })
      // }

    }, function (err) {
      defer.reject(err);
    });
  return defer.promise;
};

exports.update = function (record) {
  return when(assmtDAO.update(record));
};

exports.isSubmitted = function (userId) {

  var defer = when.defer();

  userDAO.findById(userId)
    .then(function (trainee) {
      trainee.status = 'Pending';
      trainee.save();
      defer.resolve(trainee);
    }, function (err) {
      defer.reject(err);
    });

  return defer.promise;
};


exports.isSubmittedIds = function (userIds) {

  var defer = when.defer();

  userDAO.findById(userIds)
    .then(function (trainee) {
      trainee.status = 'Pending';
      trainee.save();
      defer.resolve(trainee);
    }, function (err) {
      defer.reject(err);
    });

  return defer.promise;
};
