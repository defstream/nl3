/*jslint node: true */
/*global module, require*/
'use strict';

var parseSubjects = require('./subjects');
var parsePredicates = require('./reduce-predicates');
var parseObjects = require('./objects');
var singularize = require('../../text/singularize');

/**
 * parses the grammar rules from a string array.
 * @param  {Object} ruleset The ruleset to apply the parsed grammar rules to.
 * @param  {Array}  data    An array of strings representing the grammar rules.
 * @return {Object}         The parsed grammar rules.
 */
module.exports = function rules(ruleset, data) {
  data = data.toString().split(' ');

  var subject = singularize(data[0]);
  var predicate = singularize(data[1]);
  var object = singularize(data[2]);

  ruleset = parseSubjects(ruleset, subject, predicate, object);
  ruleset = parsePredicates(ruleset, predicate);
  ruleset = parseObjects(ruleset, subject, predicate, object);

  return ruleset;
};
