/*jslint node: true */
/*global module, require*/
'use strict';

/**
 * Given array of possible nouns, return the value of the first object or undefined.
 * @param  {String} nouns
 * @return {String} object
 */
module.exports = function objectValue(nouns) {
  return nouns[1]; //@info assuming the object is the second noun in the phrase
};
