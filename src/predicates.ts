import { mapPredicate } from './text.js';
import type { TaggedToken, Vocabulary } from './types.js';

export interface FoundPredicate {
  index: number;
  value: string;
}

/**
 * Finds the first predicate in the tagged tokens in a single pass.
 *
 * Verb-tagged tokens are preferred so that object-first phrases like
 * 'message 32 created user bob' resolve 'created' rather than the noun
 * 'message' (whose stem is also a vocabulary key).
 *
 * Previous implementation did two full linear scans (verb-only, then any).
 * This version tracks the first verb match and the first non-verb match
 * simultaneously, returning the verb match if one exists and the non-verb
 * match otherwise — all in one pass.
 */
export function firstPredicate(
  parts: TaggedToken[],
  vocabulary: Vocabulary,
): FoundPredicate | undefined {
  let firstAny: FoundPredicate | undefined;
  for (let i = 0; i < parts.length; i++) {
    const part = parts[i];
    if (!part) continue;
    const value = mapPredicate(part[0], vocabulary);
    if (!value) continue;
    if (part[1].startsWith('V')) {
      // Verb match: this is the preferred result, return immediately.
      return { index: i, value };
    }
    // Non-verb match: remember the first one but keep scanning for a verb.
    firstAny ??= { index: i, value };
  }
  return firstAny;
}

/** Finds the last predicate in the tagged tokens, scanning from the end. */
export function lastPredicate(
  parts: TaggedToken[],
  vocabulary: Vocabulary,
): FoundPredicate | undefined {
  for (let i = parts.length - 1; i > -1; i -= 1) {
    const part = parts[i];
    if (!part) continue;
    const value = mapPredicate(part[0], vocabulary);
    if (value) return { index: i, value };
  }
  return undefined;
}
