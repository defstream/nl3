/*jslint node: true */
/*global module, require,describe,it*/
'use strict';

var mocha = require('mocha');
var nl3 = require('../client')();
var check = require('../../check.js');

describe('user receives message', function() {
  var queries = [
    nl3.parse('user bob got message 42'),
    nl3.parse('user bob received message 42'),
    nl3.parse('user bob retrieved message 42'),
    nl3.parse('user bob recieved message 42')
  ];
  check(queries).against({
    subject: {
      type: 'user',
      value: 'bob'
    },
    predicate: {
      value: 'receive'
    },
    object: {
      type: 'message',
      value: '42'
    }
  });
});
