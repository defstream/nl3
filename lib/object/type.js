/*jslint node: true */
/*global module, require*/
'use strict';

var singularize = require('../text/singularize');

/**
 * Given the parts of speech, this returns an objects type.
 * @param  {Object} parts   The parts of speech.
 * @return {String}         The object type
 */
module.exports = function objectType(parts) {
  return parts.objects.objects[0] || parts.subjects.subjects[0];
};
