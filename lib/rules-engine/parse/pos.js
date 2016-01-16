/*jslint node: true */
/*global module, require*/
'use strict';

var firstPredicate = require('./last-predicate');
var singularize = require('../../text/singularize');
/**
 * Given the rules, identifies valid objects or subjects and data that occurs .
 * @param  {Object} classification The classification of the text
 * @param  {Object} rules          The known triple rules
 * @return {String}               The mapped predicate.
 */
module.exports = function types(data, rules) {
  return data && data.reduce(function(result, part) {
    var normalizedPart = singularize(part[0]);
    var added = false;
    if (rules.objects[normalizedPart]) {
      result.objects.push(normalizedPart);
      added = true;
    }
    if (rules.subjects[normalizedPart]) {
      result.subjects.push(normalizedPart);
      added = true;
    }
    if (!added && part[1] !== 'IN' && part[1][0] !== 'W') {
      if (!result.subjects.length && !result.objects.length) {
        result.before.push(part);
      } else {
        result.after.push(part);
      }
    }
    return result;
  }, {
    objects: [],
    subjects: [],
    before: [],
    after: []
  }) || {
    objects: [],
    subjects: [],
    before: [],
    after: []
  };
};
