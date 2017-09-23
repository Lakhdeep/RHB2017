'use strict';

var _ = require('lodash'),
  when = require('when'),
  userDAO = require('../dao/user.dao'),
  config = require('../config/environment'),
  assignmentDAO = require('../dao/assignment.dao.js'),
  _this = this;

/**
 * Finds list of all engine status
 *
 * @returns {*}
 */
exports.list = function () {
  return when(userDAO.list());
};

exports.listTrainee = function () {
  var defer = when.defer();

  userDAO.listTrainee()
    .then(function (traineeList) {
      var counter = 0;
      traineeList.forEach(function (record) {
        var completedMTCriteria = {
          filters: {
            mandatory: {
              exact: {
                trainee: record._id,
                status: config.assignmentStatus[2],
                'task.category': 'MT'
              }
            }
          },
        }, completedATCriteria = {
          filters: {
            mandatory: {
              exact: {
                trainee: record._id,
                status: config.assignmentStatus[2],
                'task.category': 'AT'
              }
            }
          },
        };
        assignmentDAO.filter(completedMTCriteria)
          .then(function (resultsMT) {
            record._doc.completedMT = resultsMT.total;
            return assignmentDAO.filter(completedATCriteria)
          })
          .then(function (resultsAT) {
            record._doc.completedAT = resultsAT.total;
            counter++;
            if (counter >= traineeList.length) {
              defer.resolve(traineeList);
            }
          })
          .catch(function (err) {
            defer.reject(err)
          });
      });// end of forEach
    })//end of userDAO
    .catch(function (err) {
      defer.reject(err);
    });
  return defer.promise;
};

/**
 * Finds list of all engine status
 *
 * @returns {*}
 */
exports.findById = function (id) {
  return when(userDAO.findById(id));
};

/**
 * Creates a single user
 *
 * @param record
 */
exports.create = function (record) {
  return when(userDAO.create(record));
};

exports.createTrainee = function (record) {
  return when(userDAO.createTrainee(record));
};

exports.createAssessor = function (record) {
  return when(userDAO.createAssessor(record));
};

exports.update = function (record) {
  if (!record) {
    return when.reject('Cannot update empty user');
  }
  return when(userDAO.update(record));
};

exports.findByUsername = function (username) {
  return when(userDAO.findByUsernameWithoutPassword(username));
};

exports.findForAuth = function (username) {
  return when(userDAO.findByUsernameWithPassword(username));
};

exports.filter = function (criteria, sort, pageSize, page) {
  var options = {
    filters: {
      mandatory: {
        exact: criteria
      }
    },
    sort : sort
  };

  if(pageSize >= 0){
    options.count = pageSize;
    options.start = page * pageSize;
  }else{
    options.count = 100;
    options.start = 0;
  }
  return when(userDAO.filter(options));
};

exports.bulkUpdateUserStatusesService = function (ids, status) {
  return when(userDAO.bulkUpdateUserStatusesDao(ids, status));
};
