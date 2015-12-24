/*jslint node: true */
/*global module, require*/
'use strict';

var natural = require('natural');
var inflector = new natural.NounInflector();

/**
 * Given text, returns the singularized form. ie: cats => cat.
 * @param  {String} text [description]
 * @return {String}      [description]
 */
module.exports = function singularize(text) {
  //@info if text exists, return the singularized form, otherwise return the input.
  return (text && inflector.singularize(text)) || text;
};
