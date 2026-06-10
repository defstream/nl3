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
}

/** Compiles 'subject predicate object' grammar strings into a Ruleset. */
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
  };

  for (const rule of grammar) {
    const [rawSubject = '', rawPredicate = '', rawObject = ''] =
      rule.split(' ');
    const subject = singularize(rawSubject);
    const predicate = singularize(rawPredicate);
    const object = singularize(rawObject);

    ruleset.entries.push({ subject, predicate, object });

    const subjectRule = (ruleset.subjects[subject] ??= { predicates: {} });
    const subjectObjects = (subjectRule.predicates[predicate] ??= {
      objects: [],
    }).objects;
    if (!subjectObjects.includes(object)) {
      subjectObjects.push(object);
    }

    if (!ruleset.predicates.includes(predicate)) {
      ruleset.predicates.push(predicate);
    }

    const objectRule = (ruleset.objects[object] ??= { predicates: {} });
    const objectSubjects = (objectRule.predicates[predicate] ??= {
      subjects: [],
    }).subjects;
    if (!objectSubjects.includes(subject)) {
      objectSubjects.push(subject);
    }
  }

  return ruleset;
}
