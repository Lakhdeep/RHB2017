'use strict';

var service = require('../../service/assessment.service'),
  _ = require('lodash'),
  httpStatus = require('http-status'),
  responseBuilder = require('../../components/responseBuilder/responseBuilder');

exports.list = function (req, res) {
  res.json(httpStatus.OK, responseBuilder.successResponse("yay!"));
  // service.list()
  //   .then(function(record){
  //     res.json(httpStatus.OK, responseBuilder.successResponse(record));
  //   })
  //   .otherwise(function(err){
  //     res.json(httpStatus.BAD_REQUEST, responseBuilder.errorResponse(err));
  //   });
};

exports.find = function(req, res){
  var id = req.params.id;

  service.findById(id)
    .then(function (record) {
      if (!record){
        res.json(httpStatus.NOT_FOUND, responseBuilder.errorResponse({}, 'Unable to find the record with id: ' + id));
      } else {
        res.json(httpStatus.OK, responseBuilder.successResponse(record));
      }
    })
    .otherwise(function(err) {
      res.json(httpStatus.BAD_REQUEST, responseBuilder.errorResponse(err));
    });
};

exports.create = function (req, res) {
  var record = req.body;
  record.evaluatedBy = req.user._id;
  record.evaluatedAt = Date.now();

  if (_.keys(record).length === 0 ) {
    res.json(httpStatus.FORBIDDEN, responseBuilder.errorResponse({}, 'Cannot create empty record' ));
  }

  service.create(record)
    .then(function(recordCreated){
      res.json(httpStatus.CREATED, responseBuilder.successResponse(recordCreated));
    })
    .otherwise(function(err) {
      res.json(httpStatus.BAD_REQUEST, responseBuilder.errorResponse(err));
    });
};

exports.update = function (req, res) {
  var id = req.params.id, record = req.body;
  if(!record._id) {
    record._id = id;
  }
  service.update(record)
    .then(function (updatedRecord) {
      if (!updatedRecord) {
        res.json(httpStatus.NOT_FOUND,responseBuilder.errorResponse({}, "recordNotFound"));
      }
      res.json(httpStatus.OK, responseBuilder.successResponse(updatedRecord));
    })
    .otherwise(function (err) {
      res.send(httpStatus.BAD_REQUEST, responseBuilder.errorResponse(err));
    });
};

/**
 * Assessor needs to assign task to a trainee
 *
 * @param req (params.id:  task id to assign), request.body.trainee contains the trainee id;
 * @param res ()
 * @returns {*}
 */
exports.assign = function (req, res) {
  var taskId = req.params.id, traineeId = req.body.trainee;

  service.assign(taskId, traineeId)
    .then(function (updatedRecord) {
      if (!updatedRecord) {
        res.json(httpStatus.NOT_FOUND,responseBuilder.errorResponse({}, "recordNotFound"));
      }
      res.json(httpStatus.OK, responseBuilder.successResponse(updatedRecord));
    })
    .otherwise(function (err) {
      res.send(httpStatus.BAD_REQUEST, responseBuilder.errorResponse(err));
    });
};


exports.submit = function (req, res) {
  var user = req.user;

  service.isSubmitted(user._id)
    .then(function (updatedRecord) {
      if (!updatedRecord) {
        res.json(httpStatus.NOT_FOUND, responseBuilder.errorResponse({}, "recordNotFound"));
      }
      res.json(httpStatus.OK, responseBuilder.successResponse(updatedRecord));
    })
    .otherwise(function (err) {
      res.send(httpStatus.BAD_REQUEST, responseBuilder.errorResponse(err));
    });
};

