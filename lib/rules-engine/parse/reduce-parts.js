/*jslint node: true */
/*global module, require*/
'use strict';

var firstPredicate = require('./last-predicate');
var singularize = require('../../text/singularize');
/**
 * Given an array of strings, identifies valid objects or subjects in the order they occur.
 * @param  {Array}  data      An array of tokenized strings.
 * @param  {Object} rules     The known triple rules.
 * @return {String}           The mapped predicate.
 */
module.exports = function reduceParts(data, rules) {
  var parts = {
    objects: [],
    subjects: [],
    before: [],
    after: []
  };
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
  }, parts) || parts;
};
