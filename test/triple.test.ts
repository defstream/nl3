import { describe, expect, it } from 'vitest';
import { classify } from '../src/classify.js';
import { buildRuleset } from '../src/rules-engine.js';
import { buildTriple } from '../src/triple.js';

const rules = buildRuleset(
  ['users follow users', 'users create messages', 'users message users'],
  {
    follow: 'follow',
    creat: 'create',
    messag: 'message',
    msg: 'message',
  },
);

describe('buildTriple', () => {
  it('extracts SPO order: user bob messaged user jill', () => {
    const classification = classify('user bob messaged user jill');
    expect(buildTriple(classification, rules)).toEqual({
      subject: { type: 'user', value: 'bob' },
      predicate: { type: undefined, value: 'message' },
      object: { type: 'user', value: 'jill' },
    });
  });

  it('extracts open subjects: users who follow user 42', () => {
    const classification = classify('users who follow user 42');
    expect(buildTriple(classification, rules)).toEqual({
      subject: { type: 'user', value: undefined },
      predicate: { type: undefined, value: 'follow' },
      object: { type: 'user', value: '42' },
    });
  });

  it('extracts OSP order before flipping: message 32 created user bob', () => {
    const classification = classify('message 32 created user bob');
    expect(buildTriple(classification, rules)).toEqual({
      subject: { type: 'message', value: '32' },
      predicate: { type: undefined, value: 'create' },
      object: { type: 'user', value: 'bob' },
    });
  });

  it('produces an empty triple when no predicate is found', () => {
    const classification = classify('dog jim hates cat sue');
    expect(buildTriple(classification, rules)).toEqual({
      subject: { type: undefined, value: undefined },
      predicate: { type: undefined, value: undefined },
      object: { type: undefined, value: undefined },
    });
  });
});
