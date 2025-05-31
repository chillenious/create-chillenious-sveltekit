import js from '@eslint/js';
import ts from 'typescript-eslint';
import svelte from 'eslint-plugin-svelte';
import svelteParser from 'svelte-eslint-parser';
import globals from 'globals';

/** @type {import('eslint').Linter.Config[]} */
export default [
  // Global ignores
  {
    ignores: [
      '.svelte-kit/**',
      'build/**',
      'dist/**',
      'node_modules/**',
      '*.d.ts',
      'vite.config.ts.timestamp-*',
      'package-lock.json',
      'bun.lockb',
    ],
  },

  // Config files first - basic JS rules only
  {
    files: ['*.config.{js,ts}', '*.config.*.{js,ts}', 'eslint.config.js', 'prettier.config.js', 'svelte.config.js', 'vite.config.ts'],
    ...js.configs.recommended,
    languageOptions: {
      globals: {
        ...globals.node,
      },
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    rules: {
      'no-console': 'off',
      'prefer-const': 'error',
      'no-var': 'error',
    },
  },

  // Base config for non-config files
  js.configs.recommended,

  // TypeScript config for source files
  ...ts.configs.recommended,

  // Svelte config
  ...svelte.configs['flat/recommended'],

  // Source files settings
  {
    files: ['src/**/*.{js,ts,svelte}'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2022,
      },
      parser: ts.parser,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
        extraFileExtensions: ['.svelte'],
        allowDefaultProject: true,
      },
    },
    rules: {
      // TypeScript specific rules - relaxed for development ease
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-argument': 'off',
      '@typescript-eslint/no-unsafe-return': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/require-await': 'off',
      '@typescript-eslint/prefer-nullish-coalescing': 'off',
      '@typescript-eslint/prefer-optional-chain': 'off',
      '@typescript-eslint/consistent-type-definitions': 'off',
      '@typescript-eslint/no-empty-object-type': 'off',
      '@typescript-eslint/array-type': 'off',

      // General rules
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'prefer-const': 'error',
      'no-var': 'error',
    },
  },

  // Svelte-specific config
  {
    files: ['src/**/*.svelte'],
    languageOptions: {
      parser: svelteParser,
      parserOptions: {
        parser: ts.parser,
        extraFileExtensions: ['.svelte'],
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
        allowDefaultProject: true,
      },
      globals: {
        ...globals.browser,
      },
    },
    rules: {
      // Svelte-specific rules
      'svelte/no-at-debug-tags': 'warn',
      'svelte/no-target-blank': 'error',
      'svelte/valid-compile': 'error',
      'svelte/no-reactive-functions': 'error',
      'svelte/no-reactive-literals': 'error',

      // Allow component props to be unused (common in Svelte)
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/no-empty-object-type': 'off',
    },
  },
]; 