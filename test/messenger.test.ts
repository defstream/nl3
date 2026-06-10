import { describe } from 'vitest';
import { createClient } from './helpers/client.js';
import { expectQueries } from './helpers/expect-triple.js';

const client = createClient();

function parseAll(phrases: string[]) {
  return Object.fromEntries(
    phrases.map((phrase) => [phrase, client.parse(phrase)]),
  );
}

describe('users following users', () => {
  expectQueries(
    parseAll([
      'users that follow user 42',
      'users who follow user 42',
      'users following user 42',
      'users followed user 42',
      'users which follow user 42',
      'users stalking user 42',
      'users who stalk user 42',
      'users which stalk user 42',
      'users watching user 42',
      'users who watch user 42',
      'users followed by user 42',
    ]),
    {
      subject: { type: 'user', value: undefined },
      predicate: { type: undefined, value: 'follow' },
      object: { type: 'user', value: '42' },
    },
  );
});

describe('users create messages', () => {
  expectQueries(
    parseAll([
      'user bob creates message 42',
      'user bob created message 42',
      'user bob wrote message 42',
      'user bob made message 42',
    ]),
    {
      subject: { type: 'user', value: 'bob' },
      predicate: { type: undefined, value: 'create' },
      object: { type: 'message', value: '42' },
    },
  );
});

describe('users send messages', () => {
  expectQueries(
    parseAll([
      'user bob sent message 42',
      'user bob sends message 42',
      'user bob mailed message 42',
      'user bob sended message 42',
    ]),
    {
      subject: { type: 'user', value: 'bob' },
      predicate: { type: undefined, value: 'send' },
      object: { type: 'message', value: '42' },
    },
  );
});

describe('users receive messages', () => {
  expectQueries(
    parseAll([
      'user bob got message 42',
      'user bob received message 42',
      'user bob retrieved message 42',
      'user bob recieved message 42',
    ]),
    {
      subject: { type: 'user', value: 'bob' },
      predicate: { type: undefined, value: 'receive' },
      object: { type: 'message', value: '42' },
    },
  );
});

describe('users message users', () => {
  expectQueries(
    parseAll([
      'user bob msg user jill',
      'user bob msgs user jill',
      'user bob messaged user jill',
      'user bob contacted user jill',
      'user bob contacts user jill',
    ]),
    {
      subject: { type: 'user', value: 'bob' },
      predicate: { type: undefined, value: 'message' },
      object: { type: 'user', value: 'jill' },
    },
  );
});
