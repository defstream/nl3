import pluralize from 'pluralize';
import { stemmer } from 'stemmer';
import type { Vocabulary } from './types.js';

/** 'cats' -> 'cat'. Returns input unchanged when empty or already singular. */
export function singularize(text: string): string {
  return text ? pluralize.singular(text) : text;
}

// Stemming is pure, and firstPredicate's two-pass scan can stem the same
// token twice per parse. Bounded so adversarial input can't grow it forever.
const stemCache = new Map<string, string>();
const STEM_CACHE_LIMIT = 10_000;

/**
 * Maps a word to a grammar predicate by looking up its singularized stem
 * in the vocabulary, e.g. 'messaged' -> stem 'messag' -> 'message'.
 */
export function mapPredicate(
  word: string,
  vocabulary: Vocabulary,
): string | undefined {
  let stem = stemCache.get(word);
  if (stem === undefined) {
    stem = stemmer(singularize(word));
    if (stemCache.size >= STEM_CACHE_LIMIT) {
      stemCache.clear();
    }
    stemCache.set(word, stem);
  }
  return vocabulary[stem];
}
