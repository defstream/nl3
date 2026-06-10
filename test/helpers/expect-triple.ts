import { expect, it } from 'vitest';
import type { Triple } from '../../src/index.js';

/**
 * Asserts each parsed query matches the expected triple, one `it` per query
 * so failures name the phrase that broke.
 */
export function expectQueries(
  queries: Record<string, Triple>,
  expected: Triple,
): void {
  for (const [phrase, triple] of Object.entries(queries)) {
    it(`parses: ${phrase}`, () => {
      expect(triple.subject.type).toBe(expected.subject.type);
      expect(triple.subject.value).toBe(expected.subject.value);
      expect(triple.predicate.type).toBe(expected.predicate.type);
      expect(triple.predicate.value).toBe(expected.predicate.value);
      expect(triple.object.type).toBe(expected.object.type);
      expect(triple.object.value).toBe(expected.object.value);
    });
  }
}
