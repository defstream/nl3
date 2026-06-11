// JSON round-trip tests, mirroring tests/serde.rs in the Rust port
// (https://github.com/defstream/nl3-rs). Triples are plain data and must
// survive serialization unchanged.
import { describe, expect, it } from 'vitest';
import nl3, { type Triple } from '../src/index.js';

const client = nl3({
  grammar: ['users message users'],
  vocabulary: { contact: 'message' },
});

describe('serialization', () => {
  it('triple round-trips through JSON', () => {
    const triple = client.parse('user jack contacts user jill');

    const back = JSON.parse(JSON.stringify(triple)) as Triple;

    expect(back).toEqual(triple);
  });

  it('triple serializes to the expected shape', () => {
    const triple = client.parse('user jack contacts user jill');
    const value = JSON.parse(JSON.stringify(triple)) as Triple;

    expect(value.subject.type).toBe('user');
    expect(value.subject.value).toBe('jack');
    expect(value.predicate.value).toBe('message');
    expect(value.object.type).toBe('user');
    expect(value.object.value).toBe('jill');
  });
});
