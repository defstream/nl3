# Changelog

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
