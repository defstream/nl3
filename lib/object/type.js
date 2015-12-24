/*jslint node: true */
/*global module, require*/
'use strict';

var singularize = require('../text/singularize');

/**
 * Given array of possible nouns, return the type of object.
 * @param  {String} nouns
 * @return {String} object
 */
module.exports = function objectType(nouns) {
  return singularize(
    nouns[0]
  );
};
