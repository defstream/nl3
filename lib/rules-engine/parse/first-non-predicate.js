/*jslint node: true */
/*global module, require*/
'use strict';

var parsePredicate = require('./predicate');

/**
 * firstNonPredicate returns the first non predicate in array of strings, the extended vocabulary from the grammar rules are also applied.
 * @param  {Array}  tokens An array of strings from a query.
 * @param  {Object} rules  The grammar rules..
 * @return {String}        The first found predicate, or undefined.
 */
module.exports = function firstNonPredicate(tokens, rules) {
  var i = 0;
  var predicate;
  for (i = 0; i < tokens.length; i = i + 1) {
    predicate = parsePredicate(tokens[i], rules.vocabulary);
    if (!predicate) {
      return tokens[i];
    }
  }
};
