/*jslint node: true */
/*global module,require,describe,it*/
'use strict';

var assert = require('assert');
var mocha = require('mocha');
var expect = require('chai').expect;

var flip = require('../../../lib/rules-engine/flip');
var check = require('../../check.js');

describe('Flip.it', function() {
  it('should exist', function() {
    assert(expect(flip).to.exist);
    assert(expect(flip.it).to.exist);
  });

  it('should flip different', function() {
    var triple = {
      subject: {
        type: 'user',
        value: 'Bob'
      },
      predicate: {
        value: 'message'
      },
      object: {
        type: 'user',
        value: 'Bob'
      }
    };

    var originalSubject = triple.subject;
    var originalObject = triple.object;
    var flippedTriple = flip.it(triple);

    expect(flippedTriple.object).to.equal(originalSubject);
    expect(flippedTriple.subject).to.equal(originalObject);
  });
});
