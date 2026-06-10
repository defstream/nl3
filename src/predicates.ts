import { mapPredicate } from './text.js';
import type { TaggedToken, Vocabulary } from './types.js';

export interface FoundPredicate {
  index: number;
  value: string;
}

/**
 * Finds the first predicate in the tagged tokens.
 *
 * Verb-tagged tokens are preferred so that object-first phrases like
 * 'message 32 created user bob' resolve 'created' rather than the noun
 * 'message' (whose stem is also a vocabulary key). When no verb matches —
 * e.g. 'msg' is tagged NN — fall back to scanning every token in order,
 * which preserves the legacy behavior.
 */
export function firstPredicate(
  parts: TaggedToken[],
  vocabulary: Vocabulary,
): FoundPredicate | undefined {
  return (
    scan(parts, vocabulary, (tag) => tag.startsWith('V')) ??
    scan(parts, vocabulary)
  );
}

/** Finds the last predicate in the tagged tokens, scanning from the end. */
export function lastPredicate(
  parts: TaggedToken[],
  vocabulary: Vocabulary,
): FoundPredicate | undefined {
  for (let i = parts.length - 1; i > -1; i -= 1) {
    const found = matchAt(parts, i, vocabulary);
    if (found) {
      return found;
    }
  }
  return undefined;
}

function scan(
  parts: TaggedToken[],
  vocabulary: Vocabulary,
  tagFilter?: (tag: string) => boolean,
): FoundPredicate | undefined {
  for (let i = 0; i < parts.length; i += 1) {
    const part = parts[i];
    if (!part || (tagFilter && !tagFilter(part[1]))) {
      continue;
    }
    const found = matchAt(parts, i, vocabulary);
    if (found) {
      return found;
    }
  }
  return undefined;
}

function matchAt(
  parts: TaggedToken[],
  index: number,
  vocabulary: Vocabulary,
): FoundPredicate | undefined {
  const part = parts[index];
  if (!part) {
    return undefined;
  }
  const value = mapPredicate(part[0], vocabulary);
  return value ? { index, value } : undefined;
}
