import { describe, expect, it } from 'vitest';
import { buildRuleset } from '../src/rules-engine.js';

describe('buildRuleset', () => {
  it('parses singularized grammar into subjects, predicates and objects', () => {
    const rules = buildRuleset(['users follow users', 'users create messages'], {
      creat: 'create',
    });

    expect(rules.subjects['user']?.predicates['follow']?.objects).toEqual([
      'user',
    ]);
    expect(rules.subjects['user']?.predicates['create']?.objects).toEqual([
      'message',
    ]);
    expect(rules.objects['user']?.predicates['follow']?.subjects).toEqual([
      'user',
    ]);
    expect(rules.objects['message']?.predicates['create']?.subjects).toEqual([
      'user',
    ]);
    expect(rules.predicates).toEqual(['follow', 'create']);
    expect(rules.vocabulary).toEqual({ creat: 'create' });
  });

  it('merges multiple objects for the same subject+predicate', () => {
    const rules = buildRuleset(
      ['users create messages', 'users create posts'],
      {},
    );
    expect(rules.subjects['user']?.predicates['create']?.objects).toEqual([
      'message',
      'post',
    ]);
  });

  it('handles empty grammar', () => {
    const rules = buildRuleset([], {});
    expect(rules.subjects).toEqual({});
    expect(rules.predicates).toEqual([]);
    expect(rules.objects).toEqual({});
  });
});
