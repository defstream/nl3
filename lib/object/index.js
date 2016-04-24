/*jslint node: true */
/*global module, require*/
'use strict';

var objectType = require('./type');
var objectValue = require('./value');

/**
 * Given the parts of speech, this returns an objects type & value.
 * @param  {Object} parts   The parts of speech.
 * @return {Object}         The parsed objects type & value.
 */
module.exports = function object(parts) {
  return {
    type: objectType(parts),
    value: objectValue(parts)
  };
};
