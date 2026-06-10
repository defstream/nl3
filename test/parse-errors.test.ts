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

describe('Nl3ParseError structure', () => {
  function catchError(input: unknown): Nl3ParseError {
    try {
      client.parse(input as string);
    } catch (error) {
      if (error instanceof Nl3ParseError) {
        return error;
      }
    }
    throw new Error('expected client.parse to throw Nl3ParseError');
  }

  it('carries the offending input for invalid arguments', () => {
    expect(catchError(42).input).toBe(42);
    expect(catchError(' ').input).toBe(' ');
    expect(catchError(undefined).input).toBeUndefined();
  });

  it('carries the input and candidate triple for unparseable phrases', () => {
    const error = catchError('dog jim hates cat sue');
    expect(error.input).toBe('dog jim hates cat sue');
    expect(error.candidate).toEqual({
      subject: { type: undefined, value: undefined },
      predicate: { type: undefined, value: undefined },
      object: { type: undefined, value: undefined },
    });
  });
});
