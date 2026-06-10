import nl3 from '../dist/index.js';

// A client knows one relation — "a user messages a user" — and a few
// words that all mean "message".
const client = nl3({
  grammar: ['users message users'],
  vocabulary: {
    msg: 'message', // user jack msgs user jill
    messag: 'message', // user jack messaged user jill
    contact: 'message', // user jack contacted user jill
  },
});

// These phrasings differ only in the verb; every one yields the same triple.
const phrasings = [
  'user jack msg user jill',
  'user jack msgs user jill',
  'user jack messaged user jill',
  'user jack contacted user jill',
  'user jack contacts user jill',
  'jack contacts jill',
];

for (const phrase of phrasings) {
  try {
    const triple = client.parse(phrase);
    console.log(
      `${phrase.padEnd(35)} => ${triple.subject.type || '?'}(${
        triple.subject.value || '?'
      }) -${triple.predicate.value || '?'}-> ${triple.object.type || '?'}(${
        triple.object.value || '?'
      })`,
    );
  } catch (e) {
    console.log(`${phrase.padEnd(35)} => error: ${e.message}`);
  }
}
