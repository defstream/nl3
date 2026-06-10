import { createRequire } from 'node:module';
import type winkPosTagger from 'wink-pos-tagger';
import type { Classification, TaggedToken } from './types.js';

type WinkTagger = ReturnType<typeof winkPosTagger>;

// wink-pos-tagger parses its lexicon at require time (~140ms), so the module
// is loaded lazily on first parse rather than at import. The type-only import
// above is erased at compile time and costs nothing.
let tagger: WinkTagger | undefined;

function loadTagger(): WinkTagger {
  const require = createRequire(import.meta.url);
  const factory = require('wink-pos-tagger') as typeof winkPosTagger;
  return factory();
}

/**
 * Tokenizes and part-of-speech tags text into [word, tag] tuples.
 * Punctuation tokens are excluded; the rules engine only consumes words/numbers.
 */
export function classify(text: string): Classification {
  tagger ??= loadTagger();
  const trimmed = text.trim();
  const parts: TaggedToken[] = tagger
    .tagSentence(trimmed)
    .filter((token) => token.tag !== 'punctuation')
    .map((token) => [token.value, token.pos]);
  return { parts, text: trimmed };
}
