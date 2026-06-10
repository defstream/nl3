import { describe } from 'vitest';
import { createClient } from './helpers/client.js';
import { expectQueries } from './helpers/expect-triple.js';

const client = createClient();

// These phrases previously threw — the legacy suite asserted that
// 'message 32 created user bob' fails. The verb-preferring predicate search
// plus the fixed lastPredicate scan now flip them into valid orientation.
describe('object-subject order phrases flip into valid triples', () => {
  expectQueries(
    {
      'message 32 created user bob': client.parse(
        'message 32 created user bob',
      ),
    },
    {
      subject: { type: 'user', value: 'bob' },
      predicate: { type: undefined, value: 'create' },
      object: { type: 'message', value: '32' },
    },
  );

  expectQueries(
    {
      'message 99 sent user alice': client.parse('message 99 sent user alice'),
    },
    {
      subject: { type: 'user', value: 'alice' },
      predicate: { type: undefined, value: 'send' },
      object: { type: 'message', value: '99' },
    },
  );

  expectQueries(
    {
      'message 7 got user dave': client.parse('message 7 got user dave'),
    },
    {
      subject: { type: 'user', value: 'dave' },
      predicate: { type: undefined, value: 'receive' },
      object: { type: 'message', value: '7' },
    },
  );
});
