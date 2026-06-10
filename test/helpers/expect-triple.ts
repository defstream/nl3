import { expect, it } from 'vitest';
import type { Triple, TriplePart } from '../../src/index.js';

/**
 * Removes keys whose value is `undefined` so that toMatchObject does not
 * require the received object to have those keys explicitly present.
 * (vitest's toMatchObject treats { key: undefined } as requiring the key to
 * exist; our Triple objects omit optional fields rather than setting them to
 * undefined.)
 */
function matchable(part: TriplePart): Partial<TriplePart> {
  return Object.fromEntries(
    Object.entries(part).filter(([, v]) => v !== undefined),
  );
}

/**
 * Asserts each parsed query matches the expected triple, one `it` per query
 * so failures name the phrase that broke.
 *
 * Uses toMatchObject so that a single expect() replaces six individual field
 * checks, producing a structured diff on failure.
 */
export function expectQueries(
  queries: Record<string, Triple>,
  expected: Triple,
): void {
  const expectedClean = {
    subject: matchable(expected.subject),
    predicate: matchable(expected.predicate),
    object: matchable(expected.object),
  };
  for (const [phrase, triple] of Object.entries(queries)) {
    it(`parses: ${phrase}`, () => {
      expect(triple).toMatchObject(expectedClean);
    });
  }
}
