import { describe, expect, it } from 'vitest';
import { flipTriple, processTriple } from '../src/flip.js';
import { buildRuleset } from '../src/rules-engine.js';
import {
  Nl3ParseError,
  type Classification,
  type Triple,
} from '../src/types.js';

const rules = buildRuleset(
  [
    'users follow users',
    'users mention content',
    'users create messages',
    'users send messages',
    'users receive messages',
    'users message users',
  ],
  {
    follow: 'follow',
    stalk: 'follow',
    watch: 'follow',
    creat: 'create',
    made: 'create',
    wrote: 'create',
    send: 'send',
    sent: 'send',
    mail: 'send',
    retriev: 'receive',
    receiv: 'receive',
    reciev: 'receive',
    got: 'receive',
    messag: 'message',
    msg: 'message',
    contact: 'message',
  },
);

const classification: Classification = {
  text: 'message 32 created user bob',
  parts: [
    ['message', 'NN'],
    ['32', 'CD'],
    ['created', 'VBN'],
    ['user', 'NN'],
    ['bob', 'NN'],
  ],
};

describe('flipTriple', () => {
  it('swaps subject and object, keeping references', () => {
    const triple: Triple = {
      subject: { type: 'user', value: 'Bob' },
      predicate: { value: 'message' },
      object: { type: 'user', value: 'Bob' },
    };
    const flipped = flipTriple(triple, classification, rules);
    expect(flipped.object).toBe(triple.subject);
    expect(flipped.subject).toBe(triple.object);
  });

  it('takes the flipped predicate from the last predicate in the phrase', () => {
    const triple: Triple = {
      subject: { type: 'message', value: '32' },
      predicate: { value: 'create' },
      object: { type: 'user', value: 'bob' },
    };
    expect(flipTriple(triple, classification, rules).predicate).toEqual({
      type: undefined,
      value: 'create',
    });
  });
});

describe('processTriple', () => {
  it('returns valid triples unchanged', () => {
    const triple: Triple = {
      subject: { type: 'user', value: 'bob' },
      predicate: { type: undefined, value: 'message' },
      object: { type: 'user', value: 'jill' },
    };
    expect(processTriple(triple, classification, rules)).toBe(triple);
  });

  it('flips reversed triples into valid orientation', () => {
    const triple: Triple = {
      subject: { type: 'message', value: '32' },
      predicate: { type: undefined, value: 'create' },
      object: { type: 'user', value: 'bob' },
    };
    expect(processTriple(triple, classification, rules)).toEqual({
      subject: { type: 'user', value: 'bob' },
      predicate: { type: undefined, value: 'create' },
      object: { type: 'message', value: '32' },
    });
  });

  it('throws Nl3ParseError for triples invalid in both orientations', () => {
    const triple: Triple = {
      subject: { type: 'dog', value: 'jim' },
      predicate: { type: undefined, value: 'hate' },
      object: { type: 'cat', value: 'sue' },
    };
    expect(() => processTriple(triple, classification, rules)).toThrow(
      Nl3ParseError,
    );
  });
});
