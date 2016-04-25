/*jslint node: true */
/*global module, require,describe,it*/
'use strict';

var mocha = require('mocha');
var assert = require('assert');
var expect = require('chai').expect;

var nl3 = new require('../client')();
var check = require('../../check.js');

describe('invalid parse parameters', function() {
  it('should fail parsing - no parameters', function() {
    expect(function() {
      nl3.parse();
    }).to.throw(Error);
  });
  it('should fail parsing - undefined', function() {
    expect(function() {
      nl3.parse(undefined);
    }).to.throw(Error);
  });
  it('should fail parsing - " "', function() {
    expect(function() {
      nl3.parse(' ');
    }).to.throw(Error);
  });
  it('should fail parsing - "       "', function() {
    expect(function() {
      nl3.parse('       ');
    }).to.throw(Error);
  });
  it('should fail parsing non string - 42', function() {
    expect(function() {
      nl3.parse(42);
    }).to.throw(Error);
  });
  it('should fail parsing non string - {}', function() {
    expect(function() {
      nl3.parse({});
    }).to.throw(Error);
  });
  it('should fail parsing invalid triple - dogs hate cats', function() {
    expect(function() {
      nl3.parse('dog jim hates cat sue');
    }).to.throw(Error);
  });
});


describe('parse + callback', function() {
  it('should fail parsing - no parameters', function(done) {
    nl3.parse(null, function(err, result) {
      expect(err).to.be.instanceOf(Error);
      done();
    });
  });

  it('should fail parsing - invalid triple', function(done) {
    nl3.parse('monkey a jumped on bed b', function(err, result) {
      expect(err).to.be.instanceOf(Error);
      done();
    });
  });

  it('should pass parsing - valid triple', function(done) {
    nl3.parse('user Aaron messaged user Micah', function(err, result) {
      assert(expect(err).to.not.exist);
      done();
    });
  });

  it('should fail parsing - reversed triple', function(done) {
    nl3.parse('message 32 created user bob', function(err, result) {
      expect(err).to.be.instanceOf(Error);
      done();
    });
  });
});
