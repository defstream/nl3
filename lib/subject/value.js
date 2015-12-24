/*jslint node: true */
/*global module, require*/
'use strict';

var itsPlural = require('../text/is/plural');

/**
 * Given a classification object returns the value of the Subject.
 * @param  {Object} classification The classification object.
 * @return {String}                The value of the subject.
 */
module.exports = function subjectValue(classification) {
  if (!itsPlural(
      classification.tokens[0]
    )) {
    return classification.tokens[1]; // @info return the second token
  }
  return; //@info no value is inferred if the subject type is plural.
};
