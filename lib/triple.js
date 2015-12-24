/*jslint node: true */
/*global module, require*/
'use strict';

var object = require('./object');
var subject = require('./subject');
var predicate = require('./predicate');

/**
 * Given a classification and a ruleset - returns a triple.
 * @param  {Array}  grammar     A list of possible triples.
 * @param  {Object} vocabulary  Extend the known vocabulary by mapping a word stem to a predicate.
 * @return {Object}             The parsed triple.
 */
module.exports = function triple(classification, rules) {
  return {
    subject: subject(classification, rules),
    predicate: predicate(classification, rules),
    object: object(classification, rules)
  };
};
