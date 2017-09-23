'use strict';

var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  ObjectId = Schema.ObjectId,
  extend = require('mongoose-schema-extend'),
  config = require('../config/environment');

var TaskSchema = new Schema({
    subject: String,
    category: String,
    ATA:  String,
    ATADescription: String,
    duration: Number,
    environment: String,
    taskCode:String,
    _type:String,
    seqNo: {
      type: Number,
      validate: {
        validator: Number.isInteger,
        message: 'revisedTat: {VALUE} is not an integer value'
      }
    }
  }, {
  collection: 'tasks',
  discriminatorKey: '_type',
  timestamps: true
  }
);

var Part1Schema = TaskSchema.extend({
  manualRef : String
});

var Part2Schema = TaskSchema.extend({
  cockpitEffect : String,
  cockpitMsg : String,
  CMCMsg : String
});

module.exports = {
  task: mongoose.model('Task', TaskSchema),
  part1: mongoose.model('Part1', Part1Schema),
  part2: mongoose.model('Part2', Part2Schema),
  schema: TaskSchema
};
