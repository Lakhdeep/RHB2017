'use strict';

var mongoose = require('mongoose'),
  _ = require('lodash'),
  roomModel = require('./../models/room.model'),
  _this = this;

exports.list = function () {
  console.log("-----------list");
  return roomModel.find().exec();
};

// exports.scopeFind = function (params) {
//   return roomModel.find(params).exec();
// };

exports.findById = function (_id) {
  return roomModel.findById(_id).exec();
};

// exports.create = function (record) {
//   return roomModel.create(record);
// };
//
// exports.update = function (record) {
//   var promise = new mongoose.Promise;
//   _this.findById(record._id)
//     .then(function (recordToUpdate) {
//         delete record._id;
//         var updated = _.merge(recordToUpdate, record);
//         updated.save(function (err) {
//           if (err) {
//             promise.reject(err);
//           } else {
//             promise.complete(updated);
//           }
//         });
//       },
//       function (err) {
//         promise.reject(err);
//       });
//   return promise;
// };
//
// exports.filter = function (options) {
//   var promise = new mongoose.Promise;
//   roomModel.find().order(options).page(options, function (err, result) {
//     if (err) {
//       promise.reject(err);
//     }
//     promise.complete(result);
//   });
//   return promise;
// };
//
// exports.updateSubmitted = function (record) {
//   console.log('-------------------record', record);
//   return roomModel.update({'_id': record._id},{$set: {submitted: record.submitted}}).exec();
// };
