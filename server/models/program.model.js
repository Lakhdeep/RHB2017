'use strict';

var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  ObjectId = Schema.ObjectId,
  config = require('../config/environment');

var ProgramSchema = new Schema({
  subject : String,
  tasks: [{type: ObjectId, ref: 'Task'}],
  trainees: [{type: ObjectId, ref: 'Trainee'}],
  assessor: {type: ObjectId, ref: 'Assessor'},
  minRequirement: {
    type: Number,
    validate: {
      validator: Number.isInteger,
      message: 'revisedTat: {VALUE} is not an integer value'
    }
  },
  courseRef: String,
  session: String,
  startAt: Date,
  endAt: Date,
  assQuestions: {type: [], default: config.assQuestions}
}, {
  timestamps: true
});

// module.exports.schema = ProgramSchema;
module.exports = mongoose.model('Program', ProgramSchema);
