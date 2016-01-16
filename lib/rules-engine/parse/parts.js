/*jslint node: true */
/*global module, require*/
'use strict';
var pos = require('./pos');
var firstPredicate = require('./first-predicate');
/**
 * Given classification and a rule set parse the parts of speach.
 * @param  {Object} classification The classification of the text
 * @param  {Object} rules          The known triple rules
 * @return {String}               The mapped predicate.
 */
module.exports = function parts(classification, rules) {
  var predicate = firstPredicate(classification, rules);
  var predicateIndex = predicate && predicate.index || undefined;
  var prepositionIndex = classification.parts.reduce(function(result, part) {
    if (part[1] === 'IN') {
      result.found = true
    }
    if (!result.found) {
      result.index = result.index + 1;
    }
    return result;
  }, {
    index: 0,
    found: false
  }).index;
  var index = predicate && predicate.index
  var beforePredicate = index && classification.parts.slice(0, index) || [];
  var afterPredicate = index && classification.parts.slice(index + 1) || [];

  return {
    objects: pos(afterPredicate, rules),
    subjects: pos(beforePredicate, rules),
    predicate: predicate && classification.parts[predicate.index] || undefined
  };
};
