/*jslint node: true */
/*global module, require,describe,it*/
'use strict';

var mocha = require('mocha');
var nl3 = new require('../client')();
var check = require('../../check.js');

describe('user messages user', function() {
  var queries = [
    nl3.parse('user bob msg user jill'),
    nl3.parse('user bob msgs user jill'),
    nl3.parse('user bob messaged user jill'),
    nl3.parse('user bob contacted user jill'),
    nl3.parse('user bob contacts user jill')
  ];
  check(queries).against({
    subject: {
      type: 'user',
      value: 'bob'
    },
    predicate: {
      value: 'message'
    },
    object: {
      type: 'user',
      value: 'jill'
    }
  });
});
