/*jslint node: true */
/*global module, require*/
'use strict';

var triple = require('./triple');
var classify = require('./text/classify');

/**
 * parse - parses text into a triple.
 * @memberof nl3
 * @param  {String} text  The text to parse.
 * @return {Object}       The parsed triple.
 */
module.exports = function parse(text, callback) {
  if (typeof text !== 'string' || !text.trim()) {
    var err = new Error(
      'The supplied text could not be parsed into a triple. value: ' + text
    );
    if (callback) {
      return callback(err);
    }
    throw err;
  }
  var classification = classify(text);
  var trip = triple(
    classification,
    this.rules
  );
  return this.rules.process({
      triple: trip,
      classification: classification
    },
    callback
  );
};
