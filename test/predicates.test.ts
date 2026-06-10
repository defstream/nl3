import { describe, expect, it } from 'vitest';
import { firstPredicate, lastPredicate } from '../src/predicates.js';
import type { TaggedToken } from '../src/types.js';

const vocabulary = {
  messag: 'message',
  msg: 'message',
  creat: 'create',
  follow: 'follow',
};

describe('firstPredicate', () => {
  it('finds the first vocabulary match', () => {
    const parts: TaggedToken[] = [
      ['user', 'NN'],
      ['bob', 'NN'],
      ['messaged', 'VBD'],
      ['user', 'NN'],
      ['jill', 'NNP'],
    ];
    expect(firstPredicate(parts, vocabulary)).toEqual({
      index: 2,
      value: 'message',
    });
  });

  it('falls back to non-verb tokens (e.g. msg tagged NN)', () => {
    const parts: TaggedToken[] = [
      ['user', 'NN'],
      ['bob', 'NN'],
      ['msg', 'NN'],
      ['user', 'NN'],
      ['jill', 'NNP'],
    ];
    expect(firstPredicate(parts, vocabulary)).toEqual({
      index: 2,
      value: 'message',
    });
  });

  it('prefers a verb-tagged match over an earlier noun match (OSP order)', () => {
    // 'message 32 created user bob' — the noun "message" stems to a
    // vocabulary key, but the actual predicate is the verb "created".
    const parts: TaggedToken[] = [
      ['message', 'NN'],
      ['32', 'CD'],
      ['created', 'VBN'],
      ['user', 'NN'],
      ['bob', 'NN'],
    ];
    expect(firstPredicate(parts, vocabulary)).toEqual({
      index: 2,
      value: 'create',
    });
  });

  it('returns undefined when nothing matches', () => {
    const parts: TaggedToken[] = [
      ['monkey', 'NN'],
      ['jumped', 'VBD'],
    ];
    expect(firstPredicate(parts, vocabulary)).toBeUndefined();
  });
});

describe('lastPredicate', () => {
  it('finds the last vocabulary match scanning from the end', () => {
    // Legacy code had `i < -1` here, so it never found anything.
    const parts: TaggedToken[] = [
      ['message', 'NN'],
      ['32', 'CD'],
      ['created', 'VBN'],
      ['user', 'NN'],
      ['bob', 'NN'],
    ];
    expect(lastPredicate(parts, vocabulary)).toEqual({
      index: 2,
      value: 'create',
    });
  });

  it('returns undefined when nothing matches', () => {
    expect(lastPredicate([['monkey', 'NN']], vocabulary)).toBeUndefined();
  });
});
