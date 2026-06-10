import { describe, expect, it } from 'vitest';
import { classify } from '../src/classify.js';

describe('classify', () => {
  it('produces [word, tag] parts with Penn Treebank tags', () => {
    const { parts, text } = classify('users who follow user 42');
    expect(text).toBe('users who follow user 42');
    expect(parts.map(([word]) => word)).toEqual([
      'users',
      'who',
      'follow',
      'user',
      '42',
    ]);
    expect(parts[0]?.[1]).toBe('NNS');
    expect(parts[1]?.[1]).toBe('WP');
    expect(parts[2]?.[1]?.startsWith('V')).toBe(true);
    expect(parts[4]?.[1]).toBe('CD');
  });

  it('trims surrounding whitespace into text', () => {
    expect(classify('  user bob sent message 42  ').text).toBe(
      'user bob sent message 42',
    );
  });

  it('excludes punctuation tokens from parts', () => {
    const { parts } = classify('user bob sent message 42.');
    expect(parts.map(([word]) => word)).toEqual([
      'user',
      'bob',
      'sent',
      'message',
      '42',
    ]);
  });
});
