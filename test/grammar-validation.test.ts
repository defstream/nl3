import { describe, expect, it } from 'vitest';
import nl3 from '../src/index.js';

describe('grammar validation', () => {
  it('throws when a grammar rule has only one word', () => {
    expect(() => nl3({ grammar: ['users'] })).toThrow(
      /Invalid grammar rule "users"/,
    );
  });

  it('throws when a grammar rule has only two words', () => {
    expect(() => nl3({ grammar: ['users message'] })).toThrow(
      /Invalid grammar rule "users message"/,
    );
  });

  it('throws when a grammar rule has more than three words', () => {
    expect(() => nl3({ grammar: ['users message other users'] })).toThrow(
      /Invalid grammar rule "users message other users"/,
    );
  });

  it('throws when a grammar rule is an empty string', () => {
    expect(() => nl3({ grammar: [''] })).toThrow(/Invalid grammar rule ""/);
  });

  it('accepts a valid three-word rule', () => {
    expect(() => nl3({ grammar: ['users message users'] })).not.toThrow();
  });

  it('accepts an empty grammar array', () => {
    expect(() => nl3({ grammar: [] })).not.toThrow();
  });

  it('accepts multiple valid rules', () => {
    expect(() =>
      nl3({ grammar: ['users follow users', 'users create messages'] }),
    ).not.toThrow();
  });
});
