/*jslint node: true */
/*global module, require*/
'use strict';

/**
 * returns the value of the predicate from a text classification
 * @param  {Object} classification The classification of the text
 * @param  {Object} rules          The known triple rules
 * @return {String}                The value of the first predicate
 */
module.exports = function predicateValue(classification, rules) {
  return rules.firstPredicate(classification.tokens, rules);
};
