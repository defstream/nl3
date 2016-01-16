/*jslint node: true */
/*global module, require*/
'use strict';

var singularize = require('../text/singularize');

var predicate = require('../rules-engine/parse/predicate')
  /**
   * Given the parts of speech, this returns an predicates value.
   * @param  {Object} classification The classification of the text
   * @param  {Object} rules          The known triple rules
   * @return {String}                The value of the first predicate
   */
module.exports = function predicateValue(parts, predicates) {
  return parts && parts.predicate && parts.predicate[0] && predicate(
    parts.predicate[0], predicates
  );
};
