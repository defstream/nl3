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
module.exports = function includeSubjects(rules, subject, predicate, object) {
  if (!rules.subjects[subject]) {
    rules.subjects[subject] = {
      predicates: {}
    };
  }

  var predicates = rules.subjects[subject].predicates[predicate];

  if (!predicates) {
    predicates = rules.subjects[subject].predicates[predicate] = {
      objects: [object]
    };
  }

  return rules;
};
