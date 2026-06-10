import { parseText } from './parse.js';
import { buildRuleset, type Ruleset } from './rules-engine.js';
import type { AmbiguityPolicy, Nl3Options, Triple } from './types.js';

export interface Nl3Client {
  /** The compiled grammar rules this client parses against. */
  readonly rules: Ruleset;
  /**
   * Parses plain-English text into a triple.
   * @throws {Nl3ParseError} when the text cannot form a valid triple.
   */
  parse(text: string): Triple;
  /**
   * Like `parse()`, but returns `null` instead of throwing when the text
   * cannot form a valid triple. Input type errors (non-string, empty) also
   * return `null`.
   */
  tryParse(text: string): Triple | null;
}

/**
 * Creates an nl3 client.
 *
 * @example
 * const client = nl3({
 *   grammar: ['users message users'],
 *   vocabulary: { msg: 'message' },
 * });
 * client.parse('user jack msgs user jill');
 * client.tryParse('unrecognised phrase'); // null
 */
export default function nl3(options: Nl3Options = {}): Nl3Client {
  const rules = buildRuleset(options.grammar ?? [], options.vocabulary ?? {});
  const ambiguity: AmbiguityPolicy = options.ambiguity ?? 'first-match';
  const tagger = options.tagger;

  const client: Nl3Client = Object.freeze({
    rules,
    parse: (text: string) => parseText(text, rules, ambiguity, tagger),
    tryParse: (text: string): Triple | null => {
      try {
        return parseText(text, rules, ambiguity, tagger);
      } catch {
        return null;
      }
    },
  });

  return client;
}

export { Nl3ParseError } from './types.js';
export type {
  AmbiguityPolicy,
  Classification,
  Grammar,
  Nl3Options,
  TaggedToken,
  Tagger,
  Triple,
  TriplePart,
  Vocabulary,
} from './types.js';
export type { Ruleset } from './rules-engine.js';
