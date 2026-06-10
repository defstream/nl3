import pluralize from 'pluralize';
import { stemmer } from 'stemmer';
import type { Vocabulary } from './types.js';

/** 'cats' -> 'cat'. Returns input unchanged when empty or already singular. */
export function singularize(text: string): string {
  return text ? pluralize.singular(text) : text;
}

/**
 * Maps a word to a grammar predicate by looking up its singularized stem
 * in the vocabulary, e.g. 'messaged' -> stem 'messag' -> 'message'.
 */
export function mapPredicate(
  word: string,
  vocabulary: Vocabulary,
): string | undefined {
  return vocabulary[stemmer(singularize(word))];
}
