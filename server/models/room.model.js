'use strict';

var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  ObjectId = Schema.ObjectId,
  config = require('../config/environment');

var RoomSchema = new Schema({
  roomName: String,
  available: Boolean,
  slots:[{
    slot: String,
    available: Boolean,
    bookedBy: String
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Room', RoomSchema);
