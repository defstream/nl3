/*jslint node: true */
/*global module, require*/
'use strict';

var natural = require('natural');
var singularize = require('../../text/singularize');

/**
 * Given text and a array mapping of predicates, returns the mapped predicate.
 * @param  {String} text          The text to map to a predicate.
 * @param  {Object} predicateMap  An object whose keys are word stems and values are predicates that have been defined within the grammar.
 * @return {String}               The mapped predicate.
 */
module.exports = function mapPredicate(text, predicates) {
  var predicate = natural.PorterStemmer.stem(
    singularize(text)
  );
  return predicates && predicates[predicate] || undefined;
};
