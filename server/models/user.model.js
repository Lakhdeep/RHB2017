'use strict';

var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  ObjectId = Schema.ObjectId,
  extend = require('mongoose-schema-extend'),
  crypto = require('crypto'),
  config = require('../config/environment');

var UserSchema = new Schema({
  name : {type: String, default: ""},
  displayName: {type: String, default: ""},
  username: {type: String, lowercase: true, required: true, unique: true},
  hashedPassword: {type: String, required: true},
  role: { type: String, enum: config.userRoles },
  salt: {type: String},
  employeeId: String,
  licenseNo: String,
  tel: String
}, {
  timestamps: true,
  collection: 'users',
  discriminatorKey: '_type'
});

/**
 * Virtuals
 */
UserSchema
  .virtual('password')
  .set(function (password) {
    this._password = password;
    this.salt = this.makeSalt();
    this.hashedPassword = this.encryptPassword(password);
  })
  .get(function () {
    return this._password;
  });

// TraineeSchema
//   .virtual('isQualified')
//   .get(function() {
//     //TO DO HERE
//     return true; //return true if this.completedTasks.length > this.program.minRequirement
//   });

/**
 * Methods
 */
UserSchema.methods = {
  /**
   * Authenticate - check if the passwords are the same
   *
   * @param {String} plainText
   * @return {Boolean}
   * @api public
   */
  authenticate: function (plainText) {
    return this.encryptPassword(plainText) === this.hashedPassword;
  },

  /**
   * Make salt
   *
   * @return {String}
   * @api public
   */
  makeSalt: function () {
    return crypto.randomBytes(16).toString('base64');
  },

  /**
   * Encrypt password
   *
   * @param {String} password
   * @return {String}
   * @api public
   */
  encryptPassword: function (password) {

    if (!password || !this.salt) return '';
    var salt = new Buffer(this.salt, 'base64');
    var encryption = crypto.pbkdf2Sync(password, salt, 10000, 64).toString('base64');
    return encryption;
  }
};

var AssessorSchema = UserSchema.extend({
  program: [{type: ObjectId, ref: 'Program'}]
});

var TraineeSchema = UserSchema.extend({
  company: String,
  department: String,
  enrolledPrg: {type: ObjectId, ref: 'Program'},
  assessment: {type: ObjectId, ref: 'Assessment'},
  status: {type: String, enum: config.assignmentStatus,  default: config.assignmentStatus[0]}
  // toDoTasks: [{type: ObjectId, ref: 'Task'}],
  // pendingTasks: [{type: ObjectId, ref: 'Task'}],
  // completedTasks: [{type: ObjectId, ref: 'Task'}]
});

module.exports = {
  user: mongoose.model('User', UserSchema),
  assessor: mongoose.model('Assessor', AssessorSchema),
  trainee: mongoose.model('Trainee', TraineeSchema)
};

