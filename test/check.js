/*jslint node: true */
/*global module, require,describe,it*/
'use strict';

var async = require('neo-async');
var mocha = require('mocha');
var expect = require('chai').expect;

function test(triple, expected) {
  it('should have subject.type equal to ' + expected.subject.type, function(
    done) {
    expect(triple.subject.type).to.equal(expected.subject.type);
    done();
  });
  it('should have subject.value equal to ' + expected.subject.value, function(
    done) {
    expect(triple.subject.value).to.equal(expected.subject.value);
    done();
  });

  it('should have predicate.value equal to ' + expected.predicate.value,
    function(done) {
      expect(triple.predicate.value).to.equal(expected.predicate.value);
      done();
    });

  it('should have predicate.type equal to ' + expected.predicate.type, function(
    done) {
    expect(triple.predicate.type).to.equal(expected.predicate.type);
    done();
  });
  it('should have object.type equal to ' + expected.object.type, function(done) {
    expect(triple.object.type).to.equal(expected.object.type);
    done();
  });
  it('should have object.value equal to ' + expected.object.value, function(
    done) {
    expect(triple.object.value).to.equal(expected.object.value);
    done();
  });
};

/**
 * exports check - validates a triple against another object.
 * @param  {Array} triples
 */
module.exports = function check(triples) {
  return {
    against: function(expected) {
      async.eachSeries(triples, function(triple, done) {
        test(triple, expected);
        done();
      });
    }
  };
};
