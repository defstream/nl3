/*jslint node: true */
/*global module, require*/
'use strict';

var predicateType = require('./type');
var predicateValue = require('./value');

/**
 * Given the parts of speech, this returns an predicates type & value.
 * @param  {Object} parts   The parts of speech.
 * @return {Object}         The parsed predicate.
 */
module.exports = function predicate(parts, predicates) {
  return {
    type: predicateType(parts),
    value: predicateValue(parts, predicates)
  };
};
