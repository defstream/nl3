/*jslint node: true */
/*global module, require*/
'use strict';

module.exports = function parsePredicates(rules, predicate) {
  if (rules.predicates.indexOf(predicate) === -1) {
    rules.predicates.push(predicate);
  }
  return rules;
};
