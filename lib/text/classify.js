/*jslint node: true */
/*global module, require*/
'use strict';
var pos = require('pos');
var speakEasy = require('speakeasy-nlp');

var lexer = new pos.Lexer();
var tagger = new pos.Tagger();

/**
 * Classifys the text within a given query ( identifies, nouns, subjects, verbs etc...).
 * @param  {String} text The text to classify.
 * @return {Object}      The text classification.
 */
module.exports = function classify(text) {
  //@info classify the text within the text
  var classification = speakEasy.classify(text);
  classification.parts = tagger.tag(
    lexer.lex(text)
  );
  return classification;
};
