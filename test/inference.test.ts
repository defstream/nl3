import { describe, test, expect } from 'vitest';
import nl3, {
  Nl3ParseError,
  type Tagger,
  type TaggedToken,
} from '../src/index.js';

function messenger(ambiguity?: 'first-match' | 'error') {
  return nl3({
    grammar: ['users message users'],
    vocabulary: {
      msg: 'message',
      messag: 'message',
      contact: 'message',
    },
    ambiguity,
  });
}

describe('Type Inference', () => {
  test('infers both types from a unique predicate', () => {
    const client = messenger();
    const t = client.parse('jack contacts jill');
    expect(t.subject.type).toBe('user');
    expect(t.subject.value).toBe('jack');
    expect(t.predicate.value).toBe('message');
    expect(t.object.type).toBe('user');
    expect(t.object.value).toBe('jill');
  });

  test('infers a single missing type', () => {
    const client = messenger();
    // Subject type spelled out, object type inferred.
    const t = client.parse('user jack contacts jill');
    expect(t.subject.type).toBe('user');
    expect(t.object.type).toBe('user');
    expect(t.object.value).toBe('jill');
  });

  test('unique inference works under both policies', () => {
    for (const policy of ['first-match', 'error'] as const) {
      const client = nl3({
        grammar: ['users message users'],
        vocabulary: { contact: 'message' },
        ambiguity: policy,
      });
      const t = client.parse('jack contacts jill');
      expect(t.subject.type).toBe('user');
      expect(t.object.type).toBe('user');
    }
  });

  // A grammar where the predicate 'message' maps to two subject types.
  function ambiguousClient(policy?: 'first-match' | 'error') {
    return nl3({
      grammar: ['users message users', 'admins message users'],
      vocabulary: { contact: 'message' },
      ambiguity: policy,
    });
  }

  test('ambiguity first-match picks declaration order', () => {
    const client = ambiguousClient('first-match');
    const t = client.parse('jack contacts jill');
    // "users message users" is declared first, so the subject is a user.
    expect(t.subject.type).toBe('user');
    expect(t.object.type).toBe('user');
  });

  test('ambiguity error reports candidates', () => {
    const client = ambiguousClient('error');
    try {
      client.parse('jack contacts jill');
      throw new Error('expected to throw Nl3ParseError');
    } catch (e) {
      expect(e).toBeInstanceOf(Nl3ParseError);
      const parseError = e as Nl3ParseError;
      expect(parseError.predicate).toBe('message');
      expect(parseError.candidates).toEqual(['user', 'admin']);
    }
  });

  test('first-match is the default policy', () => {
    const client = ambiguousClient(); // no ambiguity option -> defaults to first-match
    const t = client.parse('jack contacts jill');
    expect(t.subject.type).toBe('user');
  });

  test('inference only fills missing types, never overrides', () => {
    // 'create' requires its object to be a 'message'. Here the object type is
    // stated explicitly as 'user', which violates the grammar. Inference fills
    // only *missing* types, so it can't rescue this — it stays invalid.
    const client = nl3({
      grammar: ['users message users', 'users create messages'],
      vocabulary: { contact: 'message', creat: 'create' },
    });
    expect(() => client.parse('user bob creates user jill')).toThrow(
      Nl3ParseError,
    );
  });
});

describe('Custom Tagger', () => {
  class ExtendedTagger implements Tagger {
    tag(text: string): TaggedToken[] {
      return text.split(/\s+/).map((token) => {
        const tag = (() => {
          switch (token.toLowerCase()) {
            case 'betwixt':
              return 'IN'; // our extra preposition
            case 'by':
            case 'from':
            case 'on':
            case 'to':
            case 'with':
            case 'of':
              return 'IN';
            case 'who':
            case 'which':
            case 'that':
              return 'WDT';
            default:
              if (/^\d+$/.test(token)) {
                return 'CD';
              }
              return 'NN';
          }
        })();
        return [token, tag];
      });
    }
  }

  test('uses custom tagger to tag text', () => {
    const client = nl3({
      grammar: ['users follow users'],
      vocabulary: { follow: 'follow' },
      tagger: new ExtendedTagger(),
    });

    // "betwixt" is treated as a preposition and skipped, so this still parses.
    const t = client.parse('users follow betwixt user 42');
    expect(t.subject.type).toBe('user');
    expect(t.subject.value).toBe(undefined);
    expect(t.predicate.value).toBe('follow');
    expect(t.object.type).toBe('user');
    expect(t.object.value).toBe('42');
  });
});
