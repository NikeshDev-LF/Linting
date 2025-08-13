const js = require('@eslint/js');
const prettier = require('eslint-config-prettier');

module.exports = [
  js.configs.recommended,
  prettier,
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
      // Variable naming - enforce camelCase for variables and properties
      camelcase: ['error', { properties: 'always' }],

      // console.log & debugger -> warn only
      'no-console': 'warn',
      'no-debugger': 'warn',

      // Unused variables -> error (ignore ones starting with _)
      'no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],

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

  // ✅ Markdown files - must be root & camelCase
  {
    files: ['**/*.md'],
    rules: {
      'id-match': [
        'error',
        // Root-level camelCase.md only
        '^(?!.*\\/)[a-z]+([A-Z][a-z0-9]+)*\\.md$',
        {
          properties: false,
          onlyDeclarations: false,
        },
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
          message: '.cy.js files are only allowed inside the cypress/e2e folder.',
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
