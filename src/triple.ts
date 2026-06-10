import { firstPredicate, type FoundPredicate } from './predicates.js';
import type { Ruleset } from './rules-engine.js';
import { singularize } from './text.js';
import type { Classification, TaggedToken, Triple } from './types.js';

interface ReducedParts {
  subjects: string[];
  objects: string[];
  before: TaggedToken[];
  after: TaggedToken[];
}

export interface TripleParts {
  subjects: ReducedParts;
  objects: ReducedParts;
  predicate: FoundPredicate | undefined;
}

/** Splits tagged tokens around the predicate and buckets them for extraction. */
export function extractParts(
  classification: Classification,
  rules: Ruleset,
): TripleParts {
  const predicate = firstPredicate(classification.parts, rules.vocabulary);
  const before = predicate
    ? classification.parts.slice(0, predicate.index)
    : [];
  const after = predicate
    ? classification.parts.slice(predicate.index + 1)
    : [];
  return {
    subjects: reduceParts(before, rules),
    objects: reduceParts(after, rules),
    predicate,
  };
}

/** Builds an (unvalidated) triple from classified text. */
export function buildTriple(
  classification: Classification,
  rules: Ruleset,
): Triple {
  const parts = extractParts(classification, rules);
  return {
    subject: {
      type: parts.subjects.subjects[0] ?? parts.subjects.objects[0],
      value: firstValue(parts.subjects),
    },
    predicate: {
      value: parts.predicate?.value,
    },
    object: {
      // The object's type falls back to the subject side's findings — open
      // phrases like 'users who follow user 42' rely on this cross-fallback.
      type: parts.objects.objects[0] ?? parts.subjects.subjects[0],
      value: firstValue(parts.objects),
    },
  };
}

/**
 * Buckets tokens by what they are: known subject/object types by name,
 * everything else (except prepositions and wh-words) as candidate values —
 * split into those seen before any type token and those seen after.
 *
 * Singularize is only called when the raw token doesn't already match a known
 * type, avoiding unnecessary work for numeric values and proper nouns.
 */
function reduceParts(tokens: TaggedToken[], rules: Ruleset): ReducedParts {
  const result: ReducedParts = {
    subjects: [],
    objects: [],
    before: [],
    after: [],
  };
  for (const part of tokens) {
    const raw = part[0];
    // Fast path: check raw token before paying the singularize cost.
    const normalized =
      rules.objects[raw] !== undefined || rules.subjects[raw] !== undefined
        ? raw
        : singularize(raw);
    let added = false;
    if (rules.objects[normalized]) {
      result.objects.push(normalized);
      added = true;
    }
    if (rules.subjects[normalized]) {
      result.subjects.push(normalized);
      added = true;
    }
    if (!added && part[1] !== 'IN' && !part[1].startsWith('W')) {
      if (!result.subjects.length && !result.objects.length) {
        result.before.push(part);
      } else {
        result.after.push(part);
      }
    }
  }
  return result;
}

/** Returns the first value word from a ReducedParts bucket. */
function firstValue(parts: ReducedParts): string | undefined {
  // after tokens are preferred (they follow the type keyword); fall back to
  // before tokens for bare phrases like 'jack contacts jill'.
  return (parts.after[0] ?? parts.before[0])?.[0];
}
