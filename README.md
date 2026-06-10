## nl3 - Natural Language Triples

<p align="center">
  <a href="http://npmjs.com/package/nl3"><img src="https://img.shields.io/npm/v/nl3.svg" alt="npm version"></a>
  <a href="https://github.com/defstream/nl3/actions/workflows/ci.yml"><img src="https://github.com/defstream/nl3/actions/workflows/ci.yml/badge.svg" alt="build status"></a>
  <a href="https://codecov.io/github/defstream/nl3"><img src="https://img.shields.io/codecov/c/github/defstream/nl3.svg" alt="coverage"></a>
  <a href="http://npm-stat.com/charts.html?package=nl3"><img src="https://img.shields.io/npm/dm/nl3.svg" alt="downloads"></a>
</p>

**nl3** is a natural language triple library, used for parsing triples from plain
English. nl3 is best at generating triples from simple short phrases that contain a
Subject, Predicate and Object — in either order.

<p align="center">
  <img src="https://raw.github.com/defstream/nl3/master/logo.png">
</p>

#### What is a triple?

A triple is a data structure that represents a Subject, Predicate and Object (S P O).

**More information**

- https://en.wikipedia.org/wiki/Triplestore
- https://en.wikipedia.org/wiki/Resource_Description_Framework

## Installation

```shell
npm install nl3
```

Requires Node.js >= 20. nl3 is an ES module and ships TypeScript types.

## Usage

```ts
import nl3 from 'nl3';

const client = nl3({
  /**
   * Valid triples in plain English: 'Subject Predicate Object'.
   * All values are singularized.
   */
  grammar: ['users message users'],
  /**
   * Extend your vocabulary by mapping word stems to existing predicates.
   */
  vocabulary: {
    msg: 'message', // user bob msgs user tom
    messag: 'message', // user bob messaged user jill
    contact: 'message', // user bob contacted user bill
  },
});

client.parse('user jack msgs user jill');
// {
//   subject:   { type: 'user', value: 'jack' },
//   predicate: { value: 'message' },
//   object:    { type: 'user', value: 'jill' }
// }
```

All of these parse to the same triple:

```ts
client.parse('user jack msg user jill');
client.parse('user jack msgs user jill');
client.parse('user jack messaged user jill');
client.parse('user jack contacted user jill');
client.parse('user jack contacts user jill');
```

Object-first phrases are flipped into valid orientation automatically:

```ts
client.parse('message 32 created user bob');
// {
//   subject:   { type: 'user', value: 'bob' },
//   predicate: { value: 'create' },
//   object:    { type: 'message', value: '32' }
// }
```

## API

### `nl3(options)`

Creates an nl3 client.

- `options.grammar` — `string[]` of valid relations in `'subject predicate object'`
  form. Words are singularized, so `'users message users'` defines
  `user message user`.
- `options.vocabulary` — `Record<string, string>` mapping word stems to predicates
  defined in the grammar.

Returns an `Nl3Client`.

### `client.parse(text)`

Parses a plain-English phrase into a `Triple`:

```ts
interface Triple {
  subject: { type?: string; value?: string };
  predicate: { type?: string; value?: string };
  object: { type?: string; value?: string };
}
```

Throws `Nl3ParseError` when the input is not a non-empty string or when the phrase
cannot form a valid triple under the configured grammar. The error carries the
offending `input` and, when extraction got that far, the invalid `candidate` triple:

```ts
import nl3, { Nl3ParseError } from 'nl3';

try {
  client.parse('dog jim hates cat sue');
} catch (error) {
  if (error instanceof Nl3ParseError) {
    error.input; // 'dog jim hates cat sue'
    error.candidate; // the rejected triple, if one was extracted
  }
}
```

## Performance

Importing nl3 is cheap (~10 ms); the part-of-speech lexicon (~130 ms) loads
lazily on the first `parse()` call. Parsing itself runs at roughly 60–90k
phrases/sec on modern hardware — see `make bench`.

## Development

A Makefile wraps the npm scripts — run `make help` to list all targets:

```shell
make install   # install dependencies (npm ci)
make test      # run the test suite
make coverage  # tests + coverage report (thresholds enforced)
make lint      # eslint (type-aware)
make typecheck # type-check all sources including tests
make build     # compile TypeScript to dist/
make bench     # run the benchmark suite
make check     # everything CI runs: lint, format, typecheck, build, tests+coverage
```

Prefer npm directly? The same tasks exist as scripts:

```shell
npm install
npm test              # run the test suite
npm run test:coverage # tests + coverage report
npm run lint          # eslint
npm run build         # compile TypeScript to dist/
```

## The Backlog

- Support for misspelled subjects & objects (nearest neighbor)

## Maintainers

Hector Gray (Twitter: [@defstream](https://twitter.com/defstream))

## Contribute

Pull requests welcome. Please make sure all tests pass:

```shell
make check
```

Please submit [GitHub issues](https://github.com/defstream/nl3/issues) for any
feature enhancements, bugs or documentation problems.

## License

MIT
