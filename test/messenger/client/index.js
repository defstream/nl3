/*jslint node: true */
/*global module, require,describe,it*/
'use strict';

var client = require('../../../index');

module.exports = function createClient() {
  return client({
    /**
     * The grammar rules for creating valid triples
     * @type {Array}
     */
    grammar: [
      'users follow users',
      'users mention content',
      'users create messages',
      'users send messages',
      'users receive messages',
      'users message users'
    ],
    /**
     * Allows you to extend the vocabulary of your predicates mapping phonetic roots to your existing grammar.
     * @type {Object}
     */
    vocabulary: {
      follow: 'follow', // user bob followed user jill
      stalk: 'follow', // user bob stalked user tom
      watch: 'follow', // user bob watches user bill
      creat: 'create', // user bob created message 12
      made: 'create', // user bob made mesage 34
      wrote: 'create', // user bob wrote mesage 55
      send: 'send', // user bob sends message 12
      sent: 'send', // user bob sent message 34
      mail: 'send', // user bob mailed message 55
      retriev: 'receive', // user jill recieved message 12
      receiv: 'receive', // user tom received message 34
      reciev: 'receive', // user tom recieved message 34
      got: 'receive', // user bill got message 55
      messag: 'message', // user bob messaged user jill
      msg: 'message', // user bob msgd user tom
      contact: 'message', // user bob msgd conctacted user bill
    }
  });
};
