/*jslint node: true */
/*global module, require,describe,it*/
'use strict';

var mocha = require('mocha');
var nl3 = require('../client')();
var check = require('../../check.js');

describe('users sends messages', function() {
  var queries = [
    nl3.parse('user bob sent message 42'),
    nl3.parse('user bob sends message 42'),
    nl3.parse('user bob mailed message 42'),
    nl3.parse('user bob sended message 42')
  ];
  check(queries).against({
    subject: {
      type: 'user',
      value: 'bob'
    },
    predicate: {
      value: 'send'
    },
    object: {
      type: 'message',
      value: '42'
    }
  });
});
