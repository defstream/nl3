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
      type: undefined,
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
 */
function reduceParts(tokens: TaggedToken[], rules: Ruleset): ReducedParts {
  const result: ReducedParts = {
    subjects: [],
    objects: [],
    before: [],
    after: [],
  };
  for (const part of tokens) {
    const normalized = singularize(part[0]);
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

function firstValue(parts: ReducedParts): string | undefined {
  return [...parts.after, ...parts.before].map(([word]) => word)[0];
}
