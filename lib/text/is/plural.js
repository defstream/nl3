/*jslint node: true */
/*global module, require*/
'use strict';

var singularize = require('../singularize');

/**
 * Returns true if the text is pluralized.
 * @param  {String} text
 * @return {Boolean}
 */
module.exports = function isPlural(text) {
  var textEndsWithS = text[text.length - 1].toLowerCase() === 's';
  var textMatchesSingularForm = text.toLowerCase() !== singularize(text).toLowerCase();

  if (textMatchesSingularForm || textEndsWithS) {
    return true;
  }

  return false;
};
