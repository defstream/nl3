import { createRequire } from 'node:module';
import type winkPosTagger from 'wink-pos-tagger';
import type { Classification, TaggedToken, Tagger } from './types.js';

type WinkTagger = ReturnType<typeof winkPosTagger>;

// wink-pos-tagger parses its lexicon at require time (~140ms), so the module
// is loaded lazily on first parse rather than at import. The type-only import
// above is erased at compile time and costs nothing.
let taggerLazy: WinkTagger | undefined;

function loadTagger(): WinkTagger {
  const require = createRequire(import.meta.url);
  const factory = require('wink-pos-tagger') as typeof winkPosTagger;
  return factory();
}

// POS tagging is the most expensive step and is deterministic for a given
// input string. Cache results when using the default tagger so that repeated
// parses of the same phrase are essentially free.
// Custom taggers are NOT cached here — their output may depend on external state.
const classifyCache = new Map<string, Classification>();
const CLASSIFY_CACHE_LIMIT = 1_000;

/**
 * Tokenizes and part-of-speech tags text into [word, tag] tuples.
 * Punctuation tokens are excluded; the rules engine only consumes words/numbers.
 */
export function classify(
  text: string,
  taggerOverride?: Tagger,
): Classification {
  const trimmed = text.trim();
  let parts: TaggedToken[];

  if (taggerOverride) {
    // Custom taggers bypass the cache — their behaviour is opaque.
    parts = taggerOverride.tag(trimmed);
    return { parts, text: trimmed };
  }

  const cached = classifyCache.get(trimmed);
  if (cached) {
    return cached;
  }

  taggerLazy ??= loadTagger();
  parts = taggerLazy
    .tagSentence(trimmed)
    .filter((token) => token.tag !== 'punctuation')
    .map((token) => [token.value, token.pos]);

  const result: Classification = { parts, text: trimmed };
  if (classifyCache.size >= CLASSIFY_CACHE_LIMIT) {
    classifyCache.delete(classifyCache.keys().next().value as string);
  }
  classifyCache.set(trimmed, result);
  return result;
}
