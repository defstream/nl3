/*jslint node: true */
/*global module, require,describe,it*/
'use strict';

var mocha = require('mocha');
var nl3 = new require('../client')();
var check = require('../../check.js');

describe('users create messages', function() {
  var queries = [
    nl3.parse('user bob creates message 42'),
    nl3.parse('user bob created message 42'),
    nl3.parse('user bob wrote message 42'),
    nl3.parse('user bob made message 42')
  ];
  check(queries).against({
    subject: {
      type: 'user',
      value: 'bob'
    },
    predicate: {
      value: 'create'
    },
    object: {
      type: 'message',
      value: '42'
    }
  });
});
