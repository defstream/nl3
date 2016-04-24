/*jslint node: true */
/*global module, require*/
'use strict';
var lastPredicate = require('../parse/last-predicate');
/**
 * Determines if the "source" triple is valid against the target "rules"
 * @access private
 * @param  {Object} source  The source triple to validate.
 * @param  {Object} target  The target rules to validate against.
 * @return {Boolean}        True if this triple abides by the rules, otherwise false.
 */
function itAbides(source, target) {
  var subject = target.subjects[source.subject.type];
  var predicate = subject && subject.predicates && subject.predicates[source.predicate
    .value];
  var object = predicate && predicate.objects;

  if (subject && predicate && object.indexOf(source.object.type) > -1) {
    return true;
  }
  return false;
}

/**
 * Flip - Triple Flip
 * @type {Object}
 */
module.exports = {
  /**
   * Returns true if the triple should be flipped, as determined by the rules. Otherwise false.
   * @param  {Object} triple The triple to analyze
   * @param  {Object} rules  The rules to use during analyzation
   * @return {Boolean} True if the triple should be flipped, otherwise false.
   */
  able: function flippable(options) {
    var triple = options.triple;
    var rules = options.rules;

    if (itAbides(triple, rules) === false) {
      return itAbides({
        subject: triple.object,
        predicate: triple.predicate,
        object: triple.subject
      }, rules) || itAbides({
        subject: triple.object,
        predicate: {
          type: undefined,
          value: lastPredicate(options.classification, rules),
        },
        object: triple.subject
      }, rules) || undefined; //@info returns null if this triple is not valid in either direction.
    }
    return false;
  },
  /**
   * it - flips the subject and object of a triple
   * @param  {Object} triple The triple to flip
   * @return {Object} The flipped triple
   */
  it: function flip(options) {
    var triple = options.triple;
    return {
      subject: triple.object,
      predicate: {
        type: undefined,
        value: lastPredicate(options.classification, options.rules),
      },
      object: triple.subject
    };
  }
};
