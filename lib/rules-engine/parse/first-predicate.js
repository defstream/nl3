/*jslint node: true */
/*global module, require*/
'use strict';

var parsePredicate = require('./predicate');

/**
 * firstPredicate returns the first predicate from an array of strings, using the vocabulary of the specified grammar rules.
 * @param  {Array}  tokens  The array of strings.
 * @param  {Object} rules   The grammar rules to follow.
 * @return {String}         The first string that is a predicate from the  array of tokens.
 */
module.exports = function firstPredicate(tokens, rules) {
  var i = 0;
  var predicate;
  for (i = 0; i < tokens.length; i = i + 1) {
    predicate = parsePredicate(tokens[i], rules.vocabulary);
    if (predicate) {
      return predicate;
    }
  }
  return undefined;
};
