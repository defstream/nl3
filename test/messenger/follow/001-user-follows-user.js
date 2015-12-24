/*jslint node: true */
/*global module, require,describe,it*/
'use strict';

var mocha = require('mocha');
var expect = require('chai').expect;
var nl3 = require('../client')();
var check = require('../../check.js');

describe('users following users', function test() {
  var queries = [
    nl3.parse('users who follow user 42'),
    nl3.parse('users following user 42'),
    nl3.parse('users followed user 42'),
    nl3.parse('users which follow user 42'),
    nl3.parse('users stalking user 42'),
    nl3.parse('users who stalk user 42'),
    nl3.parse('users which stalk user 42'),
    nl3.parse('users watching user 42'),
    nl3.parse('users who watch user 42')
  ];

  check(queries).against({
    subject: {
      type: 'user',
      value: undefined
    },
    predicate: {
      value: 'follow'
    },
    object: {
      type: 'user',
      value: '42'
    }
  });
});
