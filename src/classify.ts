import winkPosTagger from 'wink-pos-tagger';
import type { Classification, TaggedToken } from './types.js';

const tagger = winkPosTagger();

/**
 * Tokenizes and part-of-speech tags text into [word, tag] tuples.
 * Punctuation tokens are excluded; the rules engine only consumes words/numbers.
 */
export function classify(text: string): Classification {
  const trimmed = text.trim();
  const parts: TaggedToken[] = tagger
    .tagSentence(trimmed)
    .filter((token) => token.tag !== 'punctuation')
    .map((token) => [token.value, token.pos]);
  return { parts, text: trimmed };
}
