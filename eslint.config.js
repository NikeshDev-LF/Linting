const js = require('@eslint/js');
const cypress = require('eslint-plugin-cypress');
const unicorn = require('eslint-plugin-unicorn');
const prettier = require('eslint-config-prettier');

module.exports = [
  js.configs.recommended,
  prettier,
  {
    plugins: {
      cypress,
      unicorn,
    },
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        browser: true,
        node: true,
        require: 'readonly',
        module: 'readonly',
        process: 'readonly',
      },
    },
    rules: {
      // General rules
      'no-console': 'warn',
      'no-debugger': 'error',
      'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      'prefer-const': 'error',
      'no-var': 'error',

      // Variable naming
      camelcase: ['error', { properties: 'never' }],
      'id-match': 'off',
      'no-underscore-dangle': 'off',

      // Default JS filename case (camelCase)
      'unicorn/filename-case': [
        'error',
        {
          cases: { camelCase: true },
          ignore: [
            '\\.config\\.[jt]s$', // config files
            'package\\.json',
            'package-lock\\.json',
            '^\\.', // hidden files
          ],
        },
      ],

      // Misc Unicorn rules
      'unicorn/no-empty-file': 'error',
      'unicorn/prefer-module': 'off',
    },
  },

  // ✅ Cypress .cy.js files inside /cypress/
  {
    files: ['cypress/**/*.cy.js'],
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
    rules: {
      'no-console': 'off',
      'unicorn/filename-case': ['error', { cases: { camelCase: true } }],
    },
  },

  // ❌ Disallow .cy.js files outside /cypress/
  {
    files: ['**/*.cy.js'],
    excludedFiles: ['cypress/**/*.cy.js'],
    rules: {
      'no-restricted-syntax': [
        'error',
        {
          selector: 'Program',
          message: '.cy.js files are only allowed inside the cypress/ folder.',
        },
      ],
    },
  },

  // ❌ Disallow any non-.cy.js file inside /cypress/
  {
    files: ['cypress/**/*.*'],
    excludedFiles: ['cypress/**/*.cy.js'],
    rules: {
      'no-restricted-syntax': [
        'error',
        {
          selector: 'Program',
          message: 'Only .cy.js files are allowed inside the cypress/ folder.',
        },
      ],
    },
  },

  // ✅ Markdown files in root — camelCase only
  {
    files: ['*.md'], // root-level only
    rules: {
      'unicorn/filename-case': ['error', { cases: { camelCase: true } }],
    },
  },

  // ❌ Disallow Markdown files outside root
  {
    files: ['**/*.md'],
    excludedFiles: ['*.md'],
    rules: {
      'no-restricted-syntax': [
        'error',
        {
          selector: 'Program',
          message: 'Markdown files are only allowed in the project root.',
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
    ],
  },
];
