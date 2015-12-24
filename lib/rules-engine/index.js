/*jslint node: true */
/*global module, require*/
'use strict';

var flip = require('./flip');
var processRules = require('./rules-processor');
var parse = {
  firstPredicate: require('./parse/first-predicate'),
  firstNonPredicate: require('./parse/first-non-predicate'),
  rules: require('./parse/rules')
};

/**
 * creates an instance of a triple rules engine.
 * @param  {Object} options             The options for this rules engine.
 * @param  {Object} options.grammar     A set of valid triple relations.
 * @param  {Object} options.vocabulary  Extend the known vocabulary by mapping a word stem to a predicate.
 * @return {Object)                     The rules engine.
 */
module.exports = function rulesEngine(options) {
  //@info extract the grammar
  var grammar = [].concat(options.grammar || []);

  //@info build the rules engine
  var rules = grammar.reduce(parse.rules, {
    subjects: {},
    predicates: [],
    objects: {}
  });

  //@property {Function} process - validates & transforms the triple if necessary.
  Object.defineProperty(rules, 'process', {
    value: processRules(rules)
  });

  //@property {Function} firstPredicate - returns the first predicate from an array of strings
  Object.defineProperty(rules, 'firstPredicate', {
    value: parse.firstPredicate
  });

  //@property {Function} firstNonPredicate - returns the first non predicate from an array of strings
  Object.defineProperty(rules, 'firstNonPredicate', {
    value: parse.firstNonPredicate
  });

  //@property {Object} vocabulary - contains properties that are stem words, which map to defined predicates.
  Object.defineProperty(rules, 'vocabulary', {
    enumerable: true,
    value: options.vocabulary || {}
  });

  //@info return the created engine.
  return rules;
};
