import { lastPredicate } from './predicates.js';
import type { Ruleset } from './rules-engine.js';
import { Nl3ParseError } from './types.js';
import type { AmbiguityPolicy, Classification, Triple } from './types.js';

/**
 * Validates a triple against the grammar; returns it unchanged when valid,
 * flips subject/object when the reversed orientation is valid (object-first
 * phrases like 'message 32 created user bob'), and throws otherwise.
 */
export function processTriple(
  triple: Triple,
  classification: Classification,
  rules: Ruleset,
  ambiguity: AmbiguityPolicy = 'first-match',
): Triple {
  const inferred = inferTypes(triple, rules, ambiguity);
  if (abides(inferred, rules)) {
    return inferred;
  }
  const flipped = flipTriple(inferred, classification, rules);
  if (abides(flipped, rules)) {
    return flipped;
  }
  throw new Nl3ParseError(
    `Invalid triple:\n${JSON.stringify(inferred, null, ' ')}`,
    { input: classification.text, candidate: inferred },
  );
}

/**
 * Swaps subject and object. The flipped predicate is re-resolved from the
 * last predicate word in the phrase (legacy code intended this but a dead
 * loop made it always undefined), falling back to the original predicate.
 */
export function flipTriple(
  triple: Triple,
  classification: Classification,
  rules: Ruleset,
): Triple {
  const last = lastPredicate(classification.parts, rules.vocabulary);
  return {
    subject: triple.object,
    predicate: {
      value: last?.value ?? triple.predicate.value,
    },
    object: triple.subject,
  };
}

/**
 * Fills in missing subject/object types by inferring them from the grammar
 * rules based on the matched predicate value.
 *
 * Uses the pre-computed lookup maps in the Ruleset for O(1) access instead
 * of linear scans over all entries.
 */
export function inferTypes(
  triple: Triple,
  rules: Ruleset,
  ambiguity: AmbiguityPolicy,
): Triple {
  const predicate = triple.predicate.value;
  if (!predicate) {
    return triple;
  }

  let subjectType = triple.subject.type;
  let objectType = triple.object.type;

  // Subject type: look up which subject types are valid for this predicate.
  if (subjectType === undefined) {
    const candidates = rules.subjectsByPredicate[predicate] ?? [];
    subjectType = pick(predicate, candidates, ambiguity);
  }

  // Object type: look up valid object types for (subject, predicate).
  if (objectType === undefined && subjectType !== undefined) {
    const key = `${subjectType}\x00${predicate}`;
    const candidates = rules.objectsBySubjectPredicate[key] ?? [];
    objectType = pick(predicate, candidates, ambiguity);
  }

  if (
    subjectType === triple.subject.type &&
    objectType === triple.object.type
  ) {
    return triple;
  }

  return {
    subject: { ...triple.subject, type: subjectType },
    predicate: { ...triple.predicate },
    object: { ...triple.object, type: objectType },
  };
}

function pick(
  predicate: string,
  candidates: string[],
  ambiguity: AmbiguityPolicy,
): string | undefined {
  if (candidates.length === 0) {
    return undefined;
  }
  if (candidates.length === 1) {
    return candidates[0];
  }
  if (ambiguity === 'first-match') {
    return candidates[0];
  }
  throw new Nl3ParseError(
    `Ambiguous type for predicate "${predicate}": candidates ${JSON.stringify(candidates)}`,
    { predicate, candidates },
  );
}

function abides(triple: Triple, rules: Ruleset): boolean {
  const { type: subjectType } = triple.subject;
  const { value: predicateValue } = triple.predicate;
  const { type: objectType } = triple.object;
  if (!subjectType || !predicateValue || objectType === undefined) {
    return false;
  }
  const key = `${subjectType}\x00${predicateValue}`;
  return rules.objectSetsBySubjectPredicate[key]?.has(objectType) ?? false;
}
