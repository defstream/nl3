# Changelog

## Unreleased

### Features

- `Nl3ParseError` now exposes `input` (the value passed to `parse()`) and
  `candidate` (the rejected triple, when extraction got that far).

### Performance

- The part-of-speech lexicon (~130ms) now loads lazily on first `parse()`;
  importing nl3 dropped from ~140ms to ~10ms. The package is also marked
  `sideEffects: false` for bundler tree-shaking.
- A bounded stem cache speeds up parsing 12–32% and invalid-phrase rejection
  ~89% (measured with the new `make bench` suite).

### Tooling

- Tests are now type-checked (`npm run typecheck` covers `src`, `test` and
  `bench`); ESLint runs type-aware rules; coverage thresholds are enforced
  (95% lines / 100% functions / 90% branches).
- Property-based tests with fast-check.
- CI hardening: actions pinned to commit SHAs, concurrency cancellation,
  CodeQL scanning, Dependabot updates, and release-please automation with
  npm provenance publishing.

## [0.1.0](https://github.com/defstream/nl3/compare/0.0.2...v0.1.0) (2026-06-11)


### Features

* add core types and text utilities (pluralize@8, stemmer@2) ([d6405ad](https://github.com/defstream/nl3/commit/d6405adf182bf40fa39568486f07cbc8d3054d3f))
* add examples, pluggable tagger, ambiguity policy, and inference tests ([b916442](https://github.com/defstream/nl3/commit/b916442bc9c6e5e72c33cf0f1a719fd6fde9f583))
* classify text with wink-pos-tagger, replacing pos and speakeasy-nlp ([b68b974](https://github.com/defstream/nl3/commit/b68b974e67d338377e721182d2d9eecf59b9200c))
* compile grammar strings into ruleset lookup tables ([cea826c](https://github.com/defstream/nl3/commit/cea826cf37c98d6c0057e61bbb5d6213feefdb9e))
* expose input and candidate triple on Nl3ParseError ([ad258e5](https://github.com/defstream/nl3/commit/ad258e5e6c13f71c835f9618b8352cba2caefe3c))
* extract triples from classified parts, honoring index-0 predicates ([e4cce2e](https://github.com/defstream/nl3/commit/e4cce2eafdd829fe9c93ba26b4efc03baa301873))
* flip validation, parse entry point and public client API ([16d888c](https://github.com/defstream/nl3/commit/16d888c55f848526b5b7297ef7cabfb5ffb5846a))
* performance, standards, and DX improvements ([6c3de22](https://github.com/defstream/nl3/commit/6c3de224ffb03fe39542ab26c4f19c768513e28a))
* verb-preferring firstPredicate and fixed lastPredicate scan ([cefbdab](https://github.com/defstream/nl3/commit/cefbdab2639095fdb988bf8a68b0e9673868c63d))


### Performance Improvements

* add benchmark suite and bounded stem cache ([a80d974](https://github.com/defstream/nl3/commit/a80d974fc84facf1f51a4cbc70a17960c58ea650))
* load wink-pos-tagger lazily on first parse ([351d562](https://github.com/defstream/nl3/commit/351d5628d9bea83951ef20159d33d7d734a1435f))
* third-pass hot-path optimizations and bench expansion ([0c89142](https://github.com/defstream/nl3/commit/0c891429b44d7cc7dafc186bb1ba6a19e4794225))

## 1.0.0 (2026-06-09)

### Breaking changes

- **ESM-only.** nl3 is now published as an ES module (`"type": "module"`).
  CommonJS consumers must use dynamic `import()`.
- **Node.js >= 20 required** (was `>= 0.10`).
- **Callbacks removed.** `parse(text, callback)` is now synchronous-only:
  `parse(text)` returns the triple or throws.
- **Typed errors.** Parse failures throw `Nl3ParseError` (an `Error` subclass)
  instead of plain `Error`.

### Features

- Full TypeScript rewrite with bundled type declarations
  (`Triple`, `Nl3Options`, `Grammar`, `Vocabulary`, `Nl3Client`).
- **Object-first phrases now parse.** `'message 32 created user bob'` flips into
  `{ user bob, create, message 32 }`. Previously these threw, due to a dead loop
  in the last-predicate scan and a predicate search with no part-of-speech
  awareness.
- Grammar rules with the same subject and predicate now merge their objects
  instead of silently dropping later rules.

### Dependencies

- `pos` and `speakeasy-nlp` replaced by `wink-pos-tagger`
  (speakeasy-nlp's output was computed and never read).
- `neo-async` removed (test-only usage).
- `pluralize` 1.x → 8.x, `stemmer` 0.x → 2.x.
- Tooling: Mocha/Chai/Istanbul/JSLint/Plato/Snyk/JSDoc replaced by
  Vitest, ESLint + typescript-eslint, Prettier and GitHub Actions CI.
- Makefile with developer targets (`make help` lists them; `make check`
  mirrors CI).
