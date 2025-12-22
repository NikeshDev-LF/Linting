import js from '@eslint/js';
import prettier from 'eslint-config-prettier';
import globals from 'globals';
import validateFilename from 'eslint-plugin-validate-filename';
import ts from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';

export default [
  js.configs.recommended,
  prettier,

  // Base JS config
  {
    files: ['**/*.js'],
    plugins: {
      'validate-filename': validateFilename,
      '@typescript-eslint': ts,
    },
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parser: tsParser,
      globals: {
        ...globals.node,
      },
    },
    rules: {
      'no-console': 'off',
      'no-debugger': 'warn',
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      'prefer-const': 'error',
      'no-var': 'error',
      'no-underscore-dangle': 'off',
      '@typescript-eslint/naming-convention': [
        'error',
        // Classes: PascalCase
        {
          selector: 'class',
          format: ['PascalCase'],
          leadingUnderscore: 'forbid',
        },
        // Functions: camelCase
        {
          selector: 'function',
          format: ['camelCase'],
          leadingUnderscore: 'allow',
        },
        // Variables: camelCase or UPPER_CASE
        {
          selector: 'variable',
          format: ['camelCase'],
          leadingUnderscore: 'allow',
        },
      ],
      'validate-filename/naming-rules': [
        'error',
        {
          rules: [
            {
              case: 'camel',
              target: '**/cypress/**/*.js',
              // excludes: ['e2e'], // e2e folder can have any naming
            },
          ],
        },
      ],
    },
  },

  // ✅ Markdown files - filename validation only
  {
    files: ['**/*.md'],
    plugins: {
      'validate-filename': validateFilename,
    },
    processor: {
      preprocess() {
        return [''];
      },
      postprocess(messages) {
        return messages[0] || [];
      },
      supportsAutofix: false,
    },
    rules: {
      'validate-filename/naming-rules': [
        'error',
        {
          rules: [
            {
              case: 'camel',
              target: '**/*.md',
            },
          ],
        },
      ],
    },
  },

  // Cypress JS files
  {
    files: ['cypress/**/*.js'],
    languageOptions: {
      globals: {
        cy: 'readonly',
        Cypress: 'readonly',
        describe: 'readonly',
        it: 'readonly',
        before: 'readonly',
        beforeEach: 'readonly',
        after: 'readonly',
        afterEach: 'readonly',
        context: 'readonly',
        specify: 'readonly',
      },
    },
  },

  // ❌ .cy.js files outside /cypress/e2e folder
  {
    files: ['**/*.cy.js'],
    ignores: ['cypress/e2e/**/*.cy.js'],
    rules: {
      'no-restricted-syntax': [
        'error',
        {
          selector: 'Program',
          message:
            '.cy.js files are only allowed inside the cypress/e2e folder.',
        },
      ],
    },
  },

  // Ignore patterns
  {
    ignores: [
      'node_modules/',
      'cypress/videos/',
      'cypress/screenshots/',
      'cypress/downloads/',
      'cypress/fixtures/generated/',
      'dist/',
      'build/',
      '.env*',
      'package-lock.json',
      'yarn.lock',
      '.vscode/',
      '.idea/',
      '**/*.config.*',
      '**/*.config',
    ],
  },
];
