/*jslint node: true */
/*global module, require*/
'use strict';

var object = require('./object');
var subject = require('./subject');
var predicate = require('./predicate');

var parseParts = require('./rules-engine/parse/parts');

/**
 * Given a classification and a ruleset - returns a triple.
 * @param  {Array}  grammar     A list of possible triples.
 * @param  {Object} vocabulary  Extend the known vocabulary by mapping a word stem to a predicate.
 * @return {Object}             The parsed triple.
 */
module.exports = function triple(classification, rules) {
  var parts = parseParts(classification, rules);
  return {
    subject: subject(parts),
    predicate: predicate(parts, rules.vocabulary),
    object: object(parts)
  };
};
