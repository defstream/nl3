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
  classification.text = text.trim();
  classification.value = parse(text);
  return classification;
};


function tag(text) {
  return tagger.tag(
    lexer.lex(text)
  );
}

function parse(text) {
  var parts = tag(text).reduce(function(result, tag) {
    if (tag[1] !== 'IN' && (tag[1][tag[1].length - 1] === 'N' || tag[1][0] === 'N') || tag[1] === 'CD') {
      if (!result.predicate.length) {
        result.subject = result.subject.concat(tag[0]);
      } else {
        result.object = result.object.concat(tag[0]);
      }
    }
    if (tag[1][0] === 'V') {
      if (!result.predicate.length) {
        result.predicate = result.predicate.concat(tag[0]);
      }
    }
    return result;
  }, {
    subject: [],
    predicate: [],
    object: []
  });
  return format(parts);
}


function format(parts) {

  if (parts.subject.length > 2 && !parts.object.length) {
    parts.object = parts.subject.splice(0, 1);
  }
  return {
    subject: {
      type: parts.subject[0],
      value: parts.subject[1]
    },
    predicate: {
      type: parts.predicate[1],
      value: parts.predicate[0]
    },
    object: {
      type: parts.object[0],
      value: parts.object[1]
    }
  };
}
