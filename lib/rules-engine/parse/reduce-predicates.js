/*jslint node: true */
/*global module, require*/
'use strict';

/**
 * reducePredicates reduces the predicates from an array into the grammar rules.
 * If a predicate is found to be a member of the grammar rules, it is added as a predicate.
 * @param  {Object} rules     The grammar rules.
 * @param  {String} predicate The predicate to attempt to parse.
 * @return {Object} rules     The grammar rules.
 */
module.exports = function reducePredicates(rules, predicate) {
  if (rules.predicates.indexOf(predicate) === -1) {
    rules.predicates.push(predicate);
  }
  return rules;
};
