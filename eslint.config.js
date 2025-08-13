const js = require('@eslint/js');
const prettier = require('eslint-config-prettier');
const markdown = require('eslint-plugin-markdown');

module.exports = [
  js.configs.recommended,
  prettier,

  // Base JS config
  {
    plugins: {},
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        require: 'readonly',
        module: 'readonly',
        process: 'readonly',
        browser: true,
        node: true,
      },
    },
    rules: {
      camelcase: ['error', { properties: 'always' }],
      'no-console': 'warn',
      'no-debugger': 'warn',
      'no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      'prefer-const': 'error',
      'no-var': 'error',
      'no-underscore-dangle': 'off',
      'id-match': 'off',
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
    rules: {
      'no-console': 'off',
    },
  },

  // ✅ Markdown files - lint content & enforce camelCase naming
  {
    plugins: { markdown },
    files: ['**/*.md'],
    processor: 'markdown/markdown',
    rules: {
      'id-match': [
        'error',
        '^(?!.*\\/)[a-z]+([A-Z][a-z0-9]+)*\\.md$',
        { properties: false, onlyDeclarations: false },
      ],
      'no-restricted-syntax': [
        'error',
        {
          selector: 'Program',
          message:
            'Markdown files must be in the project root and use camelCase naming (e.g., readMe.md).',
        },
      ],
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
