'use strict';

var should = require('should');
var Member = require('../member.model.js');

var member = new Member({
  provider: 'local',
  name: 'Fake Member',
  email: 'test@test.com',
  password: 'password'
});

describe('Member Model', function() {
  before(function(done) {
    // Clear members before testing
    Member.remove().exec().then(function() {
      done();
    });
  });

  afterEach(function(done) {
    Member.remove().exec().then(function() {
      done();
    });
  });

  it('should begin with no members', function(done) {
    Member.find({}, function(err, members) {
      Member.should.have.length(0);
      done();
    });
  });

  it('should fail when saving a duplicate member', function(done) {
    member.save(function() {
      var memberDup = new Member(member);
      memberDup.save(function(err) {
        should.exist(err);
        done();
      });
    });
  });

  it('should fail when saving without an email', function(done) {
    member.email = '';
    member.save(function(err) {
      should.exist(err);
      done();
    });
  });

  it("should authenticate member if password is valid", function() {
    member.authenticate('password').should.be.true;
  });

  it("should not authenticate member if password is invalid", function() {
    member.authenticate('blah').should.not.be.true;
  });
});
