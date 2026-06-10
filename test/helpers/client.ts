import nl3 from '../../src/index.js';

/** The messenger grammar/vocabulary used across the corpus tests. */
export function createClient() {
  return nl3({
    grammar: [
      'users follow users',
      'users mention content',
      'users create messages',
      'users send messages',
      'users receive messages',
      'users message users',
    ],
    vocabulary: {
      follow: 'follow', // user bob followed user jill
      stalk: 'follow', // user bob stalked user tom
      watch: 'follow', // user bob watches user bill
      creat: 'create', // user bob created message 12
      made: 'create', // user bob made message 34
      wrote: 'create', // user bob wrote message 55
      send: 'send', // user bob sends message 12
      sent: 'send', // user bob sent message 34
      mail: 'send', // user bob mailed message 55
      retriev: 'receive', // user jill retrieved message 12
      receiv: 'receive', // user tom received message 34
      reciev: 'receive', // user tom recieved message 34
      got: 'receive', // user bill got message 55
      messag: 'message', // user bob messaged user jill
      msg: 'message', // user bob msgd user tom
      contact: 'message', // user bob contacted user bill
    },
  });
}
