'use strict';

// var should = require('should');
 var consoleUser = require('../console-user.model.js');
//
// describe('Console User',function () {
//
//   it('should return user has same username', function (done) {
//       var username = "aaa@aaa.com";
//       consoleUser.find({ username: username }, function (err, u) {
//         if(err){
//           done(err);
//         }
//         should(u).have.property('username').eql(username);
//         done();
//       });
//   })
// });

var username = "aaa@aaa.com";

consoleUser.find({ username: username }, function (err, u) {
  if (err) throw err;

  console.log(u);
});
