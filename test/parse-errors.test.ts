import { describe, expect, it } from 'vitest';
import { Nl3ParseError } from '../src/index.js';
import { createClient } from './helpers/client.js';

const client = createClient();

describe('invalid parse parameters', () => {
  const invalidInputs: [string, unknown][] = [
    ['no parameters', undefined],
    ['null', null],
    ['blank " "', ' '],
    ['blank "       "', '       '],
    ['non-string 42', 42],
    ['non-string {}', {}],
  ];

  for (const [label, input] of invalidInputs) {
    it(`throws Nl3ParseError - ${label}`, () => {
      expect(() => client.parse(input as string)).toThrow(Nl3ParseError);
    });
  }

  it('throws Nl3ParseError for grammar outside the rules', () => {
    expect(() => client.parse('dog jim hates cat sue')).toThrow(Nl3ParseError);
    expect(() => client.parse('monkey a jumped on bed b')).toThrow(
      Nl3ParseError,
    );
  });

  it('parses a valid triple without throwing', () => {
    expect(() => client.parse('user Aaron messaged user Micah')).not.toThrow();
  });
});
