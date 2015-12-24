/*jslint node: true */
/*global module, require*/
'use strict';

var speakEasy = require('speakeasy-nlp');

/**
 * Classifys the text within a given query ( identifies, nouns, subjects, verbs etc...).
 * @param  {String} text The text to classify.
 * @return {Object}      The text classification.
 */
module.exports = function classify(text) {
  //@info classify the text within the text
  return speakEasy.classify(text);
};
