'use strict';

var mongoose = require('mongoose'),
  _ = require('lodash'),
  assmtModel = require('./../models/assessment.model'),
  _this = this;

exports.list = function () {
  return assmtModel.find().exec();
};

exports.scopeFind = function (params) {
  return assmtModel.find(params).exec();
};

exports.findById = function (_id) {
  return assmtModel.findById(_id).exec();
};

exports.create = function (record) {
  return assmtModel.create(record);
};

exports.update = function (record) {
  var promise = new mongoose.Promise;
  _this.findById(record._id)
    .then(function (recordToUpdate) {
        delete record._id;
        var updated = _.merge(recordToUpdate, record);
        updated.save(function (err) {
          if (err) {
            promise.reject(err);
          } else {
            promise.complete(updated);
          }
        });
      },
      function (err) {
        promise.reject(err);
      });
  return promise;
};

exports.filter = function (options) {
  var promise = new mongoose.Promise;
  assmtModel.find().order(options).page(options, function (err, result) {
    if (err) {
      promise.reject(err);
    }
    promise.complete(result);
  });
  return promise;
};

exports.updateSubmitted = function (record) {
  console.log('-------------------record', record);
  return assmtModel.update({'_id': record._id},{$set: {submitted: record.submitted}}).exec();
};
