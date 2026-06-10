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

/** A custom part-of-speech tagger interface. */
export interface Tagger {
  tag(text: string): TaggedToken[];
}

/**
 * How to resolve a phrase where the subject type is ambiguous (multiple grammar
 * rules share the same predicate with different subject types).
 *
 * - `'first-match'` (default) — use the first matching rule in grammar order.
 * - `'error'` — throw an `Nl3ParseError` with `.candidates` listing the options.
 */
export type AmbiguityPolicy = 'first-match' | 'error';

export interface Nl3Options {
  grammar?: Grammar;
  vocabulary?: Vocabulary;
  tagger?: Tagger;
  ambiguity?: AmbiguityPolicy;
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

  /** The value passed to parse(). Not necessarily a string — that may be the problem. */
  readonly input: unknown;

  /** The (invalid) triple extracted from the text, when extraction got that far. */
  readonly candidate?: Triple;

  /** The predicate value that was ambiguous during type inference. */
  readonly predicate?: string;

  /** The candidate types for the ambiguous predicate. */
  readonly candidates?: string[];

  constructor(
    message: string,
    details: {
      input?: unknown;
      candidate?: Triple;
      predicate?: string;
      candidates?: string[];
    } = {},
  ) {
    super(message);
    this.input = details.input;
    if (details.candidate) {
      this.candidate = details.candidate;
    }
    if (details.predicate) {
      this.predicate = details.predicate;
    }
    if (details.candidates) {
      this.candidates = details.candidates;
    }
  }
}
