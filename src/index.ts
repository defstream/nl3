import { parseText } from './parse.js';
import { buildRuleset, type Ruleset } from './rules-engine.js';
import type { Nl3Options, Triple } from './types.js';

export interface Nl3Client {
  /** The compiled grammar rules this client parses against. */
  rules: Ruleset;
  /**
   * Parses plain-English text into a triple.
   * @throws {Nl3ParseError} when the text cannot form a valid triple.
   */
  parse(text: string): Triple;
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
 */
export default function nl3(options: Nl3Options = {}): Nl3Client {
  const rules = buildRuleset(options.grammar ?? [], options.vocabulary ?? {});
  return {
    rules,
    parse: (text) => parseText(text, rules, options.ambiguity, options.tagger),
  };
}

export { Nl3ParseError } from './types.js';
export type {
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
