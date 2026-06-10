import nl3, { Nl3ParseError } from '../dist/index.js';

function messenger() {
  return nl3({
    grammar: [
      'users follow users',
      'users mention content',
      'users create messages',
      'users send messages',
      'users receive messages',
      'users message users',
    ],
    vocabulary: {
      // follow
      follow: 'follow',
      stalk: 'follow',
      watch: 'follow',
      // create
      creat: 'create',
      made: 'create',
      wrote: 'create',
      // send
      send: 'send',
      sent: 'send',
      mail: 'send',
      // receive
      retriev: 'receive',
      receiv: 'receive',
      reciev: 'receive',
      got: 'receive',
      // message
      messag: 'message',
      msg: 'message',
      contact: 'message',
    },
  });
}

const client = messenger();

console.log('== Valid phrasings ==');
const validPhrases = [
  'users who follow user 42',
  'users stalking user 42',
  'user bob created message 7',
  'user bob got message 7',
  'user bob contacted user jill',
];
for (const phrase of validPhrases) {
  printTriple(client, phrase);
}

console.log('\n== Errors ==');
const invalidPhrases = ['', 'dog jim hates cat sue'];
for (const phrase of invalidPhrases) {
  try {
    client.parse(phrase);
    console.log(`"${phrase}" => unexpectedly ok`);
  } catch (e) {
    if (e instanceof Nl3ParseError) {
      if (!phrase) {
        console.log(`"${phrase}" => EmptyInput`);
      } else {
        console.log(
          `"${phrase}" => InvalidTriple (subject type "${
            e.candidate?.subject?.type || '?'
          }")`,
        );
      }
    } else {
      console.log(`"${phrase}" => error: ${e.message}`);
    }
  }
}

function printTriple(client, phrase) {
  try {
    const t = client.parse(phrase);
    console.log(
      `${phrase.padEnd(30)} => ${t.subject.type || '?'}(${
        t.subject.value || '-'
      }) -${t.predicate.value || '?'}-> ${t.object.type || '?'}(${
        t.object.value || '-'
      })`,
    );
  } catch (e) {
    console.log(`${phrase.padEnd(30)} => error: ${e.message}`);
  }
}
