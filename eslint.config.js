import { defineConfig, globalIgnores } from 'eslint/config';
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default defineConfig(
  globalIgnores([
    'dist/',
    'coverage/',
    'node_modules/',
    // legacy CommonJS sources, removed at the end of the TypeScript migration
    'index.js',
    'lib/',
    'test/**/*.js',
  ]),
  eslint.configs.recommended,
  tseslint.configs.recommended,
);
