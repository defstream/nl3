import nl3 from '../dist/index.js';

// A tagger that recognizes one extra preposition, then defers to the same
// rules nl3's default uses.
class ExtendedTagger {
  tag(text) {
    return text.split(/\s+/).map((token) => {
      const tag = (() => {
        switch (token.toLowerCase()) {
          case 'betwixt':
            return 'IN'; // our extra preposition
          case 'by':
          case 'from':
          case 'on':
          case 'to':
          case 'with':
          case 'of':
            return 'IN';
          case 'who':
          case 'which':
          case 'that':
            return 'WDT';
          default:
            if (/^\d+$/.test(token)) {
              return 'CD';
            }
            return 'NN';
        }
      })();
      return [token, tag];
    });
  }
}

const client = nl3({
  grammar: ['users follow users'],
  vocabulary: { follow: 'follow' },
  tagger: new ExtendedTagger(),
});

// "betwixt" is treated as a preposition and skipped, so this still parses.
const phrase = 'users follow betwixt user 42';
try {
  const t = client.parse(phrase);
  console.log(
    `"${phrase}" => ${t.subject.type || '?'}(${
      t.subject.value || '-'
    }) -${t.predicate.value || '?'}-> ${t.object.type || '?'}(${
      t.object.value || '-'
    })`,
  );
} catch (e) {
  console.log(`"${phrase}" => error: ${e.message}`);
}
