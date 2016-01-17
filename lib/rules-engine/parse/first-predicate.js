/*jslint node: true */
/*global module, require*/
'use strict';

var parsePredicate = require('./predicate');

/**
 * firstPredicate returns the first predicate from an array of strings, using the vocabulary of the specified grammar rules.
 * @param  {Object} classification The classification of the text
 * @param  {Object} rules          The known triple rules
 * @return {String}         The first string that is a predicate from the  array of tokens.
 */
module.exports = function firstPredicate(classification, rules) {
  var tokens = classification.parts.map(function(part) {
    return part[0]
  });
  var i = 0;
  var predicate;
  for (i = 0; i < tokens.length; i = i + 1) {
    predicate = parsePredicate(tokens[i], rules.vocabulary);
    if (predicate) {
      return {
        index: i,
        value: predicate
      };
    }
  }
  return undefined;
};
