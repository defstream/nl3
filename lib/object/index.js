/*jslint node: true */
/*global module, require*/
'use strict';

var objectType = require('./type');
var objectValue = require('./value');

/**
 * Returns a function that sets the index of the first predicate given a ruleset and a variable to hold the index value.
 * @access private
 * @param  {Object} rules           The grammar rules.
 * @param  {Object} predicate.index The index of the first predicate.
 * @return {Function}
 */
function findFirstPredicate(rules, predicate) {
  return function isPredicate(token, i) {
    if (rules.firstPredicate([token], rules)) {
      predicate.index = i;
      return true;
    }
  };
}

/**
 * Given a classification, this function identifies the index of the first predicate within the classifications tokens.
 * @access private
 * @param  {Object} classification The classification object.
 * @param  {Object} rules          The grammar rules.
 * @return {Number}                The index of the predicate or undefined.
 */
function indexOfFirstPredicate(classification, rules) {
  var predicate = {
    index: 0
  };
  //@info iterate through the tokens until we've found the first predicate.
  classification.tokens.some(
    findFirstPredicate(rules, predicate)
  );

  return predicate.index;
}

/**
 * Given a classification and grammar rules, this function returns an objects type & id.
 * @param  {Object} classification The classification object.
 * @param  {Object} rules          The grammar rules.
 * @return {Object}                The parsed objects type & id.
 */
module.exports = function object(classification, rules) {
  //@info: This method evaluates various options for parsing the object in descending order of level of accuracy.
  var predicateIndex = indexOfFirstPredicate(classification, rules);
  var objects = classification.tokens.slice(predicateIndex + 1); //@info testing if object is after the predicate
  objects.pop(); // clear the trailing .

  return {
    type: objectType(objects),
    value: objectValue(objects)
  };
};
