/*jslint node: true */
/*global module, require*/

'use strict';

var parse = require('./lib/parse');
var rules = require('./lib/rules-engine');
/** @exports nl3 **/
var nl3 = {
  //@function
  /**
   * @name parse
   * @description Returns a triple based on language used.
   * @access public
   * @returns {Object}
   * @example nl3.parse('users who follow user 42') // returns...
   * // {
   * //   subject: {
   * //     type: 'user',
   * //     value: undefined
   * //   },
   * //   predicate: {
   * //     value: 'follow'
   * //   },
   * //   object: {
   * //     type: 'user',
   * //     value: '42'
   * //   }
   * // }
   */
  parse: parse
};

/**
 * @param  {Object} options             The options required for parsing triples
 * @param  {Object} options.grammar     A set of valid triple relations.
 * @param  {Object} options.vocabulary  Extend the known vocabulary by mapping a word stem to a predicate.
 * @return {Object}                     An instance of the nl3 client.
 */
module.exports = function create(options) {
  //@info triple rules engine
  var engine = rules({
    //@info defined triples
    grammar: options.grammar,
    //@info an additional set of words that map to our items with our original grammar
    vocabulary: options.vocabulary
  });
  //@info create & return the new instance
  var instance = Object.create(nl3, {
    rules: {
      enumerable: true,
      value: engine
    }
  });

  return instance;
};
