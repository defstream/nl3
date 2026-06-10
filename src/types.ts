/** One corner of a triple: an optional type (e.g. 'user') and value (e.g. 'bob'). */
export interface TriplePart {
  type?: string;
  value?: string;
}

/** A Subject–Predicate–Object triple parsed from plain English. */
export interface Triple {
  subject: TriplePart;
  predicate: TriplePart;
  object: TriplePart;
}

/** Valid triple relations in plain English, e.g. 'users message users'. */
export type Grammar = string[];

/** Maps a word stem (e.g. 'msg') to a predicate defined in the grammar (e.g. 'message'). */
export type Vocabulary = Record<string, string>;

export interface Nl3Options {
  grammar?: Grammar;
  vocabulary?: Vocabulary;
}

/** A token and its Penn Treebank part-of-speech tag, e.g. ['follow', 'VB']. */
export type TaggedToken = [word: string, tag: string];

export interface Classification {
  parts: TaggedToken[];
  text: string;
}

/** Thrown when text cannot be parsed into a valid triple. */
export class Nl3ParseError extends Error {
  override name = 'Nl3ParseError';
}
