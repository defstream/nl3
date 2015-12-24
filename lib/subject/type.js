/*jslint node: true */
/*global module, require*/
'use strict';

var singularize = require('../text/singularize');

/**
 * Given a classification object and a ruleset, return the type of subject.
 * @param  {Object} classification  The classification object
 * @return {String} object
 */
module.exports = function subjectType(classification, rules) {
  //@info return the singular form of the first noun in the phrase
  return singularize(
    rules.firstNonPredicate(classification.nouns, rules)
  );
};
