import { bench, describe } from 'vitest';
import { createClient } from '../test/helpers/client.js';

const client = createClient();

describe('parse', () => {
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
