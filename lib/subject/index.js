/*jslint node: true */
/*global module, require*/
'use strict';

var subjectType = require('./type');
var subjectValue = require('./value');

/**
 * Given a classification and grammar rules, this function returns an subjects type & id.
 * @param  {Object} classification The classification object.
 * @param  {Object} rules          The grammar rules.
 * @return {Object}                The subjects type & id.
 */
module.exports = function subject(classification, rules) {
  return {
    type: subjectType(classification, rules),
    value: subjectValue(classification)
  };
};
