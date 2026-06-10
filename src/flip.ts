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
 * Uses objectLookup (a nested Map) for zero-allocation O(1) access — no
 * template-literal key strings are built on the hot parse path.
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

  // Object type: two Map.get() calls — no string allocation.
  if (objectType === undefined && subjectType !== undefined) {
    const candidates =
      rules.objectLookup.get(subjectType)?.get(predicate)?.candidates ?? [];
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
    // predicate is never mutated — reuse the reference, no spread needed.
    predicate: triple.predicate,
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

/**
 * Returns true when the triple is valid under the grammar.
 * Uses objectLookup for two Map.get() + Set.has() — no string allocation.
 */
function abides(triple: Triple, rules: Ruleset): boolean {
  const { type: subjectType } = triple.subject;
  const { value: predicateValue } = triple.predicate;
  const { type: objectType } = triple.object;
  if (!subjectType || !predicateValue || objectType === undefined) {
    return false;
  }
  return (
    rules.objectLookup
      .get(subjectType)
      ?.get(predicateValue)
      ?.set.has(objectType) ?? false
  );
}
