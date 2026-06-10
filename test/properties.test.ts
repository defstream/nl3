import fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { Nl3ParseError } from '../src/index.js';
import { createClient } from './helpers/client.js';

const client = createClient();

// Names that are not grammar types, vocabulary stems, prepositions or
// wh-words — safe to use as subject/object values in generated phrases.
const names = [
  'alice',
  'bob',
  'carol',
  'dave',
  'erin',
  'frank',
  'grace',
  'heidi',
  'ivan',
  'judy',
  'mallory',
  'olivia',
  'peggy',
  'rupert',
  'sybil',
  'trent',
  'walter',
];

describe('parse properties', () => {
  it('throws nothing but Nl3ParseError for arbitrary strings', () => {
    fc.assert(
      fc.property(fc.string({ maxLength: 200 }), (text) => {
        try {
          const triple = client.parse(text);
          expect(triple).toHaveProperty('subject');
          expect(triple).toHaveProperty('predicate');
          expect(triple).toHaveProperty('object');
        } catch (error) {
          expect(error).toBeInstanceOf(Nl3ParseError);
        }
      }),
    );
  });

  it('parses generated SPO phrases: user <name> sent message <n>', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...names),
        fc.integer({ min: 0, max: 999999 }),
        (name, n) => {
          const triple = client.parse(`user ${name} sent message ${n}`);
          expect(triple).toEqual({
            subject: { type: 'user', value: name },
            predicate: { type: undefined, value: 'send' },
            object: { type: 'message', value: String(n) },
          });
        },
      ),
    );
  });

  it('flips generated OSP phrases: message <n> created user <name>', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...names),
        fc.integer({ min: 0, max: 999999 }),
        (name, n) => {
          const triple = client.parse(`message ${n} created user ${name}`);
          expect(triple).toEqual({
            subject: { type: 'user', value: name },
            predicate: { type: undefined, value: 'create' },
            object: { type: 'message', value: String(n) },
          });
        },
      ),
    );
  });
});
