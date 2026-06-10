import nl3, { Nl3ParseError } from '../dist/index.js';

function build(ambiguity) {
  // `message` has two possible subject types: `user` and `admin`.
  return nl3({
    grammar: ['users message users', 'admins message users'],
    vocabulary: {
      contact: 'message',
      msg: 'message',
    },
    ambiguity,
  });
}

// The type is spelled out, so inference never runs — both policies agree.
const explicit = 'admin alice contacts user bob';
// The subject type is omitted, so it must be inferred — this is ambiguous.
const bare = 'alice contacts bob';

console.log('== ambiguity: "first-match" (default) ==');
const first = build('first-match');
report(first, explicit);
report(first, bare);

console.log('\n== ambiguity: "error" ==');
const strict = build('error');
report(strict, explicit);
report(strict, bare);

function report(client, phrase) {
  try {
    const t = client.parse(phrase);
    console.log(
      `  ok    ${phrase.padEnd(32)} => ${t.subject.type || '?'}(${
        t.subject.value || '-'
      }) -${t.predicate.value || '?'}-> ${t.object.type || '?'}(${
        t.object.value || '-'
      })`,
    );
  } catch (e) {
    if (e instanceof Nl3ParseError && e.candidates) {
      console.log(
        `  error ${phrase.padEnd(
          32,
        )} => ambiguous "${e.predicate}": pick one of [${e.candidates.join(
          ', ',
        )}]`,
      );
    } else {
      console.log(`  error ${phrase.padEnd(32)} => ${e.message}`);
    }
  }
}
