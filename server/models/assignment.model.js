'use strict';

var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  TaskSchema = require('./task.model').schema,
  ObjectId = Schema.ObjectId,
  config = require('../config/environment');

var AssignmentSchema = new Schema({
  trainee: {type: ObjectId, ref: 'Trainee'},
  program: {type: ObjectId, ref: 'Program'},
  task: {},
  answer: String,
  status: { type: String, required: true, default: config.assignmentStatus[0], enum: config.assignmentStatus },
  rating : String,
  completedAt: Date,
  approvedAt: Date,
  approvedBy: {type: ObjectId, ref: 'Assessor'}
}, {
  timestamps: true
});

module.exports = mongoose.model('Assignment', AssignmentSchema);
