import { classify } from './classify.js';
import { processTriple } from './flip.js';
import type { Ruleset } from './rules-engine.js';
import { buildTriple } from './triple.js';
import { Nl3ParseError } from './types.js';
import type { AmbiguityPolicy, Tagger, Triple } from './types.js';

/**
 * Parses text into a validated triple.
 * @throws {Nl3ParseError} for non-string/empty input or unparseable phrases.
 */
export function parseText(
  text: unknown,
  rules: Ruleset,
  ambiguity: AmbiguityPolicy = 'first-match',
  tagger?: Tagger,
): Triple {
  if (typeof text !== 'string' || !text.trim()) {
    throw new Nl3ParseError(
      `The supplied text could not be parsed into a triple. value: ${String(text)}`,
      { input: text },
    );
  }
  const classification = classify(text, tagger);
  const triple = buildTriple(classification, rules);
  return processTriple(triple, classification, rules, ambiguity);
}
