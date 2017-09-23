'use strict';

var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  ObjectId = Schema.ObjectId,
  config = require('../config/environment');

var AssessmentSchema = new Schema({
  //trainee : {type: ObjectId, ref: 'Trainee'}, // no need double reference
  program: {type: ObjectId, ref: 'Program'},
  answers: {
    first : {},
    second : {}
  },
  evaluatedAt: Date,
  evaluatedBy: {type: ObjectId, ref: 'Assessor'},
  passed: Boolean,
  submitted: Boolean
}, {
  timestamps: true
});

module.exports = mongoose.model('Assessment', AssessmentSchema);
