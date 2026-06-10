import { lastPredicate } from './predicates.js';
import type { Ruleset } from './rules-engine.js';
import { Nl3ParseError } from './types.js';
import type { Classification, Triple } from './types.js';

/**
 * Validates a triple against the grammar; returns it unchanged when valid,
 * flips subject/object when the reversed orientation is valid (object-first
 * phrases like 'message 32 created user bob'), and throws otherwise.
 */
export function processTriple(
  triple: Triple,
  classification: Classification,
  rules: Ruleset,
): Triple {
  if (abides(triple, rules)) {
    return triple;
  }
  const flipped = flipTriple(triple, classification, rules);
  if (abides(flipped, rules)) {
    return flipped;
  }
  throw new Nl3ParseError(
    `Invalid triple:\n${JSON.stringify(triple, null, ' ')}`,
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
      type: undefined,
      value: last?.value ?? triple.predicate.value,
    },
    object: triple.subject,
  };
}

function abides(triple: Triple, rules: Ruleset): boolean {
  const subject = triple.subject.type
    ? rules.subjects[triple.subject.type]
    : undefined;
  const predicate = triple.predicate.value
    ? subject?.predicates[triple.predicate.value]
    : undefined;
  return (
    triple.object.type !== undefined &&
    (predicate?.objects.includes(triple.object.type) ?? false)
  );
}
