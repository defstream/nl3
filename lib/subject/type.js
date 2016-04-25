/*jslint node: true */
/*global module, require*/
'use strict';

var singularize = require('../text/singularize');

/**
 * Given the parts of speech, this returns an subjects type.
 * @param  {Object} parts   The parts of speech.
 * @return {String}         The subject type
 */
module.exports = function subjectType(parts) {
  return parts.subjects.subjects[0] || parts.subjects.objects[0];
};
