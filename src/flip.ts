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
  ambiguity: 'first-match' | 'error' = 'first-match',
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
      type: undefined,
      value: last?.value ?? triple.predicate.value,
    },
    object: triple.subject,
  };
}

/**
 * Fills in missing subject/object types by inferring them from the grammar
 * rules based on the matched predicate value.
 */
export function inferTypes(
  triple: Triple,
  rules: Ruleset,
  ambiguity: 'first-match' | 'error',
): Triple {
  const predicate = triple.predicate.value;
  if (!predicate) {
    return triple;
  }

  let subjectType = triple.subject.type;
  let objectType = triple.object.type;

  // Subject type: any subject whose grammar rules include this predicate.
  if (subjectType === undefined) {
    const candidates = orderedDedup(
      rules.entries
        .filter((e) => e.predicate === predicate)
        .map((e) => e.subject),
    );
    subjectType = pick(predicate, candidates, ambiguity);
  }

  // Object type: the objects allowed for the (now-known) subject + predicate.
  if (objectType === undefined && subjectType !== undefined) {
    const subject = subjectType;
    const candidates = orderedDedup(
      rules.entries
        .filter((e) => e.subject === subject && e.predicate === predicate)
        .map((e) => e.object),
    );
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

function orderedDedup(arr: string[]): string[] {
  const out: string[] = [];
  for (const item of arr) {
    if (!out.includes(item)) {
      out.push(item);
    }
  }
  return out;
}

function pick(
  predicate: string,
  candidates: string[],
  ambiguity: 'first-match' | 'error',
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
