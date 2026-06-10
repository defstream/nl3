import { describe, expect, it } from 'vitest';
import nl3, { Nl3ParseError } from '../src/index.js';

const client = nl3({
  grammar: ['users message users', 'users follow users'],
  vocabulary: { msg: 'message', messag: 'message', follow: 'follow' },
});

describe('tryParse', () => {
  it('returns a triple for a valid phrase', () => {
    const result = client.tryParse('user bob messaged user jill');
    expect(result).not.toBeNull();
    expect(result!.subject.value).toBe('bob');
    expect(result!.predicate.value).toBe('message');
    expect(result!.object.value).toBe('jill');
  });

  it('returns null for an invalid phrase', () => {
    expect(client.tryParse('dog jim hates cat sue')).toBeNull();
  });

  it('returns null for an empty string', () => {
    expect(client.tryParse('')).toBeNull();
  });

  it('returns null for a whitespace-only string', () => {
    expect(client.tryParse('   ')).toBeNull();
  });

  it('parse still throws Nl3ParseError for invalid phrases', () => {
    expect(() => client.parse('dog jim hates cat sue')).toThrow(Nl3ParseError);
  });

  it('the client object is frozen', () => {
    expect(Object.isFrozen(client)).toBe(true);
  });
});
