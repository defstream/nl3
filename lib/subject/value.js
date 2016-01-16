/*jslint node: true */
/*global module, require*/
'use strict';

var first = require('../first');

/**
 * Given the parts of speech, this returns an subjects value.
 * @param  {Object} parts   The parts of speech.
 * @return {String}         The subjects value.
 */
module.exports = function subjectValue(parts) {
  return first(
    parts.subjects.after.map(first).concat(
      parts.subjects.before.map(first)
    )
  );
};
