'use strict';

var mongoose = require('mongoose'),
  _ = require('lodash'),
  AssignmentModel = require('./../models/assignment.model.js'),
  _this = this;

var populateFields = [
  {
    path: 'trainee',
  },
  {
    path:'approvedBy'
  }
];

exports.list = function () {
  return AssignmentModel.find().populate(populateFields).exec();
};

exports.scopeFind = function (params) {
  return AssignmentModel.find(params).exec();
};

exports.findById = function (_id) {
  return AssignmentModel.findById(_id).exec();
};

exports.findTraineesByIds = function (ids) {
  // return AssignmentModel.find({'_id': {$in: records}}).exec();
  var assIds = ids.map(function(el) { return mongoose.Types.ObjectId(el) });
  return AssignmentModel.aggregate(
    {$match:{
      '_id': {$in: assIds}
    }},
    {$group:{
      _id: 'Trainees',
      traineeIds:{$addToSet:'$trainee'}
    }}
  ).exec();
};

exports.create = function (record) {
  return AssignmentModel.create(record);
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

exports.updateStatus = function (record) {

  console.log('-------------------record', record);
  return AssignmentModel.update({'_id': record._id},{$set: {status: record.status, rating: record.rating, answer: record.answer}}).exec();
};



exports.bulkUpdate = function (records, status, rating) {

  console.log('-------------------records', records);
  return AssignmentModel.update({'_id': {$in: records}},{$set: {status: status, rating: rating}}, { multi: true }).exec();
};

exports.bulkDelete = function (records) {
  return AssignmentModel.remove({'_id': {$in: records}}).exec();
};

exports.filter = function (options) {
  // var promise = new mongoose.Promise;
  return AssignmentModel.find().populate(populateFields).filter(options).order(options).page(options)

};

exports.saveAnswer = function (record) {
  return AssignmentModel.update({'_id': record._id},{$set: {answer: record.answer}}).exec();
};

exports.findByUserIdsDao = function (userIds) {
  var ids = userIds.map(function(el) { return mongoose.Types.ObjectId(el) })
  return AssignmentModel.aggregate(
    {$match:{
      'trainee': {$in:ids},
    }},
    {$group:{
      _id: 'assignedTasks',
      taskIds:{$addToSet:'$task._id'}
    }}
  ).exec();
};

exports.findNoOfCompletedMTTasksByUserIdsDao = function (userIds) {
  console.log('----------------userIds',userIds);
  var ids = userIds.map(function(el) { return mongoose.Types.ObjectId(el) });
  console.log('----------------ids',ids);
  return AssignmentModel.aggregate(
    {$match:{
      'trainee': {$in:ids},
      'task.category': 'MT',
      'status': 'Completed'
    }},
    {$lookup:{from: 'programs', localField: 'program', foreignField: '_id', as: 'program'}},
    {$group:{
      _id: '$trainee',
      count:{$sum:1},
      program:{$addToSet:'$program'}
    }},{$project:{
      _id: 1,
      count:1,
      program: {$arrayElemAt:[{$arrayElemAt:['$program',0]},0]}
    }}
  ).exec();
};

exports.bulkUpdateStatusDao = function (ids, status) {
  return AssignmentModel.update({'_id': {$in: ids}},{$set: {status: status}}, { multi: true }).exec();
};
