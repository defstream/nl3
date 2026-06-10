import { bench, describe } from 'vitest';
import nl3 from '../src/index.js';
import { createClient } from '../test/helpers/client.js';

const client = createClient();

// A second client with a larger grammar to test buildRuleset and parse scaling.
const largeClient = nl3({
  grammar: [
    'users follow users',
    'users mention content',
    'users create messages',
    'users send messages',
    'users receive messages',
    'users message users',
    'admins ban users',
    'admins promote users',
    'admins delete messages',
    'admins restore messages',
    'moderators review content',
    'moderators approve content',
  ],
  vocabulary: {
    follow: 'follow',
    stalk: 'follow',
    messag: 'message',
    msg: 'message',
    creat: 'create',
    made: 'create',
    send: 'send',
    sent: 'send',
    retriev: 'receive',
    receiv: 'receive',
    ban: 'ban',
    promot: 'promote',
    delet: 'delete',
    restor: 'restore',
    review: 'review',
    approv: 'approve',
  },
});

describe('parse — warm (classify cache hit)', () => {
  bench('SPO: user bob messaged user jill', () => {
    client.parse('user bob messaged user jill');
  });

  bench('open subject: users who follow user 42', () => {
    client.parse('users who follow user 42');
  });

  bench('OSP flip: message 32 created user bob', () => {
    client.parse('message 32 created user bob');
  });

  bench('invalid phrase (throws)', () => {
    try {
      client.parse('dog jim hates cat sue');
    } catch {
      // expected — measuring the rejection path
    }
  });
});

describe('tryParse', () => {
  bench('valid phrase → Triple', () => {
    client.tryParse('user bob messaged user jill');
  });

  bench('invalid phrase → null', () => {
    client.tryParse('dog jim hates cat sue');
  });
});

describe('parse — cold (classify cache miss)', () => {
  // Generate a unique phrase on each invocation to bypass the classify cache.
  // Tokens "user", "message", "user" are still warm in singularize/stem caches,
  // so this isolates the POS-tagging cost.
  let counter = 0;
  bench('fresh phrase each iteration', () => {
    counter++;
    // e.g. "user x1 messaged user jill" — unique subject value forces a cache miss
    client.parse(`user x${counter} messaged user jill`);
  });
});

describe('large grammar (12 rules)', () => {
  bench('SPO: user bob messaged user jill', () => {
    largeClient.parse('user bob messaged user jill');
  });

  bench('OSP flip: message 32 created user bob', () => {
    largeClient.parse('message 32 created user bob');
  });
});
