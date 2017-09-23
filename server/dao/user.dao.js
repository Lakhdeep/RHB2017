'use strict';

var mongoose = require('mongoose'),
  _ = require('lodash'),
  user = require('./../models/user.model.js').user,
  trainee = require('./../models/user.model.js').trainee,
  assessor = require('./../models/user.model.js').assessor,
  _this = this;

var populateFields = [
  {
    path: 'enrolledPrg',
    model: 'Program'
  },
  {
    path: 'assessment',
    model: 'Assessment'
  }
];

exports.list = function () {
  return user.find().populate(populateFields).exec();
};

exports.listTrainee = function () {
  return trainee.find({_type:'Trainee'}).populate(populateFields).exec();
};

exports.find = function (params) {
  return user.find(params).populate(populateFields).exec();
};

exports.findById = function (_id) {
  return user.findById(_id, "-hashedPassword -salt").populate(populateFields).exec();
};

exports.create = function (record) {
  return user.create(record);
};

exports.createTrainee = function (record) {
  return trainee.create(record);
};

exports.createAssessor = function (record) {
  return assessor.create(record);
};

exports.update = function (record) {
  var promise = new mongoose.Promise;
  _this.findById(record._id)
    .then(function (recordToUpdate) {
        if (!recordToUpdate) {
          promise.reject('No user with _id = ' + record._id + ' found to update');
        }
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

exports.findByUsernameWithPassword = function (username) {
  return user.findOne({username: username}).exec();
};

exports.findByUsernameWithoutPassword = function (username) {
  return user.findOne({username: username}, "-hashedPassword -salt").exec();
};

exports.filter = function (options) {
  var promise = new mongoose.Promise;
  user.find().populate(populateFields).filter(options).order(options).page(options, function (err, result) {
    if (err) {
      promise.reject(err);
    }
    promise.complete(result);
  });
  return promise;
};

exports.bulkUpdateUserStatusesDao = function(userIds, status){
  console.log('----------------userIds',userIds);
  console.log('----------------status',status);
  var ids = userIds.map(function(el) { return mongoose.Types.ObjectId(el) });
  return trainee.update({'_id': {$in: ids}, status:'WIP'},{$set: {'status': status}},{ multi: true }).exec();
  // return user.find({'_id': {$in: userIds}}).exec();
};
