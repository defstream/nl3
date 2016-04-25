/*jslint node: true */
/*global module, require*/
'use strict';

var stemmer = require('stemmer');
var singularize = require('../../text/singularize');

/**
 * Given text and a array mapping of predicates, returns the mapped predicate.
 * @param  {String} text          The text to map to a predicate.
 * @param  {Object} predicates  An object whose keys are word stems and values are predicates that have been defined within the grammar.
 * @return {String}               The mapped predicate.
 */
module.exports = function mapPredicate(text, predicates) {
  var predicate = stemmer(
    singularize(text)
  );
  return predicates && predicates[predicate] || undefined;
};
