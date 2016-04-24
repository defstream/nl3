/*jslint node: true */
/*global module, require*/
'use strict';

var flip = require('./flip');

/**
 * Evaluates and returns triple, resolves any issues if necessary. An error is thrown if the triple is invalid.
 * @param  {Object}   triple   The triple to process
 * @param  {Function} callback The callback used to handle the result.
 */
module.exports = function rulesProcessor(rules) {
  return function processRules(options, callback) {
    var triple = options.triple;
    var classification = options.classification;
    var opts = {
      triple: triple,
      classification: classification,
      rules: rules
    };
    var shouldFlip = flip.able(opts); //@info returns null if invalid.
    if (shouldFlip === true) {
      triple = flip.it(opts);
      return (callback && callback(null, triple)) || triple;
    }
    if (shouldFlip === false) {
      return (callback && callback(null, triple)) || triple;
    }
    //@info if we've received null, then return error.
    var err = new Error('Invalid triple:\n' + JSON.stringify(triple, null,
      ' '));
    if (callback) {
      return callback(err, triple);
    }
    throw err;
  };
};
