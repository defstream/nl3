/*jslint node: true */
/*global module, require*/
'use strict';

var first = require('../first');

/**
 * Given the parts of speech, this returns an objects value.
 * @param  {Object} parts   The parts of speech.
 * @return {String}         The objects value.
 */
module.exports = function objectValue(parts) {
  return first(
    parts.objects.after.map(first).concat(
      parts.objects.before.map(first)
    )
  );
};
