/*jslint node: true */
/*global module, require*/
'use strict';

var predicateType = require('./type');
var predicateValue = require('./value');

/**
 * Given a classification and a set of grammar rules, this function returns a predicate.
 * @param  {Object} classification  The classification object.
 * @param  {Object} rules           The grammar rules for this triple.
 * @return {Object}                 The parsed predicate.
 */
module.exports = function predicate(classification, rules) {
  return {
    type: predicateType(classification),
    value: predicateValue(classification, rules)
  };
};
