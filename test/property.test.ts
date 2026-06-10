import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import nl3, { Nl3ParseError } from '../src/index.js';
import { inferTypes } from '../src/flip.js';
import { buildRuleset } from '../src/rules-engine.js';

const grammar = [
  'users message users',
  'users follow users',
  'admins message users',
];
const vocabulary = { msg: 'message', messag: 'message', follow: 'follow' };
const rules = buildRuleset(grammar, vocabulary);

describe('property: inferTypes result always abides or throws', () => {
  it('inferred triple either satisfies the ruleset or does not change types', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('user', 'admin', 'message', undefined),
        fc.constantFrom('message', 'follow', 'unknown', undefined),
        fc.constantFrom('user', 'admin', 'message', undefined),
        fc.constantFrom('first-match' as const, 'error' as const),
        (subjectType, predicateValue, objectType, ambiguity) => {
          const triple = {
            subject: { type: subjectType, value: 'bob' },
            predicate: { value: predicateValue },
            object: { type: objectType, value: 'jill' },
          };

          try {
            const result = inferTypes(triple, rules, ambiguity);
            // Types can only become more specific, never change to an unknown value
            if (triple.subject.type !== undefined) {
              expect(result.subject.type).toBe(triple.subject.type);
            }
            if (triple.object.type !== undefined) {
              expect(result.object.type).toBe(triple.object.type);
            }
          } catch (e) {
            // Only Nl3ParseError is acceptable (ambiguity: 'error' case)
            expect(e).toBeInstanceOf(Nl3ParseError);
            expect(ambiguity).toBe('error');
          }
        },
      ),
    );
  });
});

describe('property: tryParse never throws', () => {
  const client = nl3({ grammar, vocabulary });

  it('returns Triple or null for any string input', () => {
    fc.assert(
      fc.property(fc.string(), (text) => {
        expect(() => client.tryParse(text)).not.toThrow();
        const result = client.tryParse(text);
        expect(result === null || typeof result === 'object').toBe(true);
      }),
    );
  });
});

describe('property: parse and tryParse are consistent', () => {
  const client = nl3({ grammar, vocabulary });

  it('tryParse returns null iff parse throws', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(
          'user bob messaged user jill',
          'user bob followed user jill',
          'admin alice messaged user bob',
          'dog jim hates cat sue',
          '',
          '   ',
          'user',
        ),
        (phrase) => {
          let parseResult: unknown = null;
          let parseThrew = false;
          try {
            parseResult = client.parse(phrase);
          } catch {
            parseThrew = true;
          }
          const tryResult = client.tryParse(phrase);
          if (parseThrew) {
            expect(tryResult).toBeNull();
          } else {
            expect(tryResult).toEqual(parseResult);
          }
        },
      ),
    );
  });
});
