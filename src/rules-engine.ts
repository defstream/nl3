import { singularize } from './text.js';
import type { Grammar, Vocabulary } from './types.js';

export interface SubjectRule {
  predicates: Record<string, { objects: string[] }>;
}

export interface ObjectRule {
  predicates: Record<string, { subjects: string[] }>;
}

export interface GrammarRule {
  subject: string;
  predicate: string;
  object: string;
}

/** Grammar compiled into lookup tables, plus the user vocabulary. */
export interface Ruleset {
  subjects: Record<string, SubjectRule>;
  predicates: string[];
  objects: Record<string, ObjectRule>;
  vocabulary: Vocabulary;
  entries: GrammarRule[];
  /** Maps predicate → ordered-unique subject types (for fast inferTypes lookup). */
  subjectsByPredicate: Record<string, string[]>;
  /** Maps `subject\x00predicate` → ordered-unique object types (for fast inferTypes lookup). */
  objectsBySubjectPredicate: Record<string, string[]>;
}

/**
 * Compiles 'subject predicate object' grammar strings into a Ruleset.
 * @throws {Error} when a grammar string does not contain exactly three words.
 */
export function buildRuleset(
  grammar: Grammar,
  vocabulary: Vocabulary,
): Ruleset {
  const ruleset: Ruleset = {
    subjects: {},
    predicates: [],
    objects: {},
    vocabulary,
    entries: [],
    subjectsByPredicate: {},
    objectsBySubjectPredicate: {},
  };

  // Use Sets during construction to avoid O(n) includes checks; convert to
  // arrays at the end so the public Ruleset shape remains stable.
  const predicateSet = new Set<string>();
  const subjectObjectSets = new Map<string, Set<string>>();
  const objectSubjectSets = new Map<string, Set<string>>();
  const subjectsByPredicateSets = new Map<string, Set<string>>();
  const objectsBySubjectPredicateSets = new Map<string, Set<string>>();

  for (const rule of grammar) {
    const parts = rule.trim().split(/\s+/);
    if (parts.length !== 3 || parts.some((p) => !p)) {
      throw new Error(
        `Invalid grammar rule "${rule}": expected exactly three words (subject predicate object).`,
      );
    }
    const [rawSubject = '', rawPredicate = '', rawObject = ''] = parts;
    const subject = singularize(rawSubject);
    const predicate = singularize(rawPredicate);
    const object = singularize(rawObject);

    ruleset.entries.push({ subject, predicate, object });

    // subjects map
    const subjectRule = (ruleset.subjects[subject] ??= { predicates: {} });
    const subObjKey = `${subject}\x00${predicate}`;
    if (!subjectObjectSets.has(subObjKey)) {
      subjectObjectSets.set(subObjKey, new Set());
      subjectRule.predicates[predicate] = { objects: [] };
    }
    subjectObjectSets.get(subObjKey)!.add(object);

    // predicates list
    predicateSet.add(predicate);

    // objects map
    const objectRule = (ruleset.objects[object] ??= { predicates: {} });
    const objSubKey = `${object}\x00${predicate}`;
    if (!objectSubjectSets.has(objSubKey)) {
      objectSubjectSets.set(objSubKey, new Set());
      objectRule.predicates[predicate] = { subjects: [] };
    }
    objectSubjectSets.get(objSubKey)!.add(subject);

    // fast inference maps
    if (!subjectsByPredicateSets.has(predicate)) {
      subjectsByPredicateSets.set(predicate, new Set());
    }
    subjectsByPredicateSets.get(predicate)!.add(subject);

    const spKey = `${subject}\x00${predicate}`;
    if (!objectsBySubjectPredicateSets.has(spKey)) {
      objectsBySubjectPredicateSets.set(spKey, new Set());
    }
    objectsBySubjectPredicateSets.get(spKey)!.add(object);
  }

  // Materialise Sets → arrays
  ruleset.predicates = [...predicateSet];
  for (const [key, set] of subjectObjectSets) {
    const [subject = '', predicate = ''] = key.split('\x00');
    (ruleset.subjects[subject]!.predicates[predicate] ??= {
      objects: [],
    }).objects = [...set];
  }
  for (const [key, set] of objectSubjectSets) {
    const [object = '', predicate = ''] = key.split('\x00');
    (ruleset.objects[object]!.predicates[predicate] ??= {
      subjects: [],
    }).subjects = [...set];
  }
  for (const [predicate, set] of subjectsByPredicateSets) {
    ruleset.subjectsByPredicate[predicate] = [...set];
  }
  for (const [key, set] of objectsBySubjectPredicateSets) {
    ruleset.objectsBySubjectPredicate[key] = [...set];
  }

  return ruleset;
}
