import { describe, expect, it } from 'vitest';
import { mapPredicate, singularize } from '../src/text.js';

describe('singularize', () => {
  it('singularizes plural nouns', () => {
    expect(singularize('users')).toBe('user');
    expect(singularize('messages')).toBe('message');
  });

  it('passes through non-plural and empty input', () => {
    expect(singularize('user')).toBe('user');
    expect(singularize('42')).toBe('42');
    expect(singularize('')).toBe('');
  });
});

describe('mapPredicate', () => {
  const vocabulary = { messag: 'message', creat: 'create', sent: 'send' };

  it('maps inflected words to predicates via their stem', () => {
    expect(mapPredicate('messaged', vocabulary)).toBe('message');
    expect(mapPredicate('msgs', { msg: 'message' })).toBe('message');
    expect(mapPredicate('created', vocabulary)).toBe('create');
    expect(mapPredicate('sent', vocabulary)).toBe('send');
  });

  it('returns undefined for words not in the vocabulary', () => {
    expect(mapPredicate('jumped', vocabulary)).toBeUndefined();
    expect(mapPredicate('user', vocabulary)).toBeUndefined();
  });
});
