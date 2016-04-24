/*jslint node: true */
/*global module, require*/
'use strict';

var subjectType = require('./type');
var subjectValue = require('./value');

/**
 * Given the parts of speech, this returns an subjects type & value.
 * @param  {Object} parts   The parts of speech.
 * @return {Object}         The parsed subjects type & value.
 */
module.exports = function subject(parts) {
  return {
    type: subjectType(parts),
    value: subjectValue(parts)
  };
};
