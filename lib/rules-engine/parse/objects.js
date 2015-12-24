/*jslint node: true */
/*global module, require*/
'use strict';

/**
 * Properly stores the subject, predicate and object, within the ruleset.
 * @param  {Object} rules     The ruleset.
 * @param  {String} subject   The subject to include into the rulset.
 * @param  {String} predicate The predicate to include into the rulset.
 * @param  {String} object    The object to include into the rulset.
 * @return {Object}           The updated ruleset.
 */
module.exports = function includeObjects(rules, subject, predicate, object) {
  if (!rules.objects[object]) {
    rules.objects[object] = {
      predicates: {}
    };
  }

  var predicates = rules.objects[object].predicates[predicate];

  if (!predicates) {
    predicates = rules.objects[object].predicates[predicate] = {
      subjects: [subject]
    };
  }

  return rules;
};
