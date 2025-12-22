# 🚀 Linting Guide: Commit Hooks & GitHub Actions

This guide explains how linting works during commits, how to skip it, and how to set up automated linting checks using GitHub Actions.

## 📋 Table of Contents

1. [Linting During Commits](#linting-during-commits)
2. [Skipping Linting with --no-verify](#skipping-linting-with---no-verify)
3. [lint-staged: Staged Files Only](#lint-staged-staged-files-only)
4. [GitHub Actions: Post-Push Linting](#github-actions-post-push-linting)
5. [Best Practices](#best-practices)

---

## 🔒 Linting During Commits

### How It Works

When you commit code, **husky** automatically runs **lint-staged**, which executes linting rules on your staged files:

```bash
git add .
git commit -m "Update form validation"
# 🚨 Linting runs automatically here!
```

### Current Setup

Your project uses:

- **husky** - Git hooks manager
- **lint-staged** - Runs linters on staged files only
- **ESLint** - JavaScript linting with flat config (eslint.config.js)
- **@typescript-eslint** - Advanced naming conventions and rules
- **eslint-plugin-validate-filename** - Filename pattern validation
- **Prettier** - Code formatting
- **globals** - Environment-specific global variables

### Configuration

```json
// package.json
{
  "lint-staged": {
    "**/*.{js,md}": [
      "eslint --no-ignore --ext .js,.md --max-warnings=0",
      "prettier --write"
    ]
  }
}
```

**ESLint Configuration (eslint.config.js):**

```javascript
import js from '@eslint/js';
import prettier from 'eslint-config-prettier';
import globals from 'globals';
import validateFilename from 'eslint-plugin-validate-filename';
import ts from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';

export default [
  js.configs.recommended,
  prettier,

  // Base JS config with naming conventions
  {
    files: ['**/*.js'],
    plugins: {
      'validate-filename': validateFilename,
      '@typescript-eslint': ts,
    },
    languageOptions: {
      parser: tsParser,
      globals: { ...globals.node },
    },
    rules: {
      // Naming conventions
      '@typescript-eslint/naming-convention': [
        'error',
        { selector: 'class', format: ['PascalCase'] },
        { selector: 'function', format: ['camelCase'] },
        { selector: 'variable', format: ['camelCase'] },
      ],
      // Filename validation
      'validate-filename/naming-rules': [
        'error',
        {
          rules: [
            { case: 'camel', target: '**/cypress/**/*.js', excludes: ['e2e'] },
          ],
        },
      ],
    },
  },

  // Markdown filename validation
  {
    files: ['**/*.md'],
    plugins: { 'validate-filename': validateFilename },
    rules: {
      'validate-filename/naming-rules': [
        'error',
        { rules: [{ case: 'camel', target: '**/*.md' }] },
      ],
    },
  },
];
```

---

## ⏭️ Skipping Linting with --no-verify

### When to Skip

Use `--no-verify` (or `-n`) when you need to:

- **Emergency commits** - Critical bug fixes
- **WIP commits** - Work in progress
- **CI/CD bypass** - Automated deployments
- **Debugging** - Temporary commits

### How to Skip

```bash
# Skip pre-commit hooks
git commit -m "Emergency fix" --no-verify

# Short version
git commit -m "WIP: form validation" -n

# Skip specific hooks
git commit -m "Update docs" --no-verify
```

### ⚠️ Warning

**Never skip linting for production code!** This can lead to:

- Code quality issues
- Inconsistent formatting
- Potential bugs
- Team code style violations

---

## 🎯 lint-staged: Staged Files Only

### What It Does

**lint-staged** only checks files that are staged for commit, making it:

- **Fast** - No need to lint entire project
- **Efficient** - Only relevant files
- **Focused** - Current changes only

### How It Works

```bash
# Stage specific files
git add cypress/e2e/formSubmission.cy.js
git add cypress/support/utils/dataFactory.js

# Only these files get linted during commit
git commit -m "Add form submission tests"
```

### Configuration Breakdown

```json
{
  "lint-staged": {
    "**/*.{js,md}": [
      "eslint --no-ignore --ext .js,.md --max-warnings=0",
      "prettier --write"
    ]
  }
}
```

**Explanation:**

- `**/*.{js,md}` - Match all .js and .md files in any directory
- `eslint --no-ignore` - Don't skip files in .eslintignore
- `--ext .js,.md` - Check both JavaScript and Markdown files
- `--max-warnings=0` - Fail on any warnings
- `prettier --write` - Format files automatically

**Key Linting Rules:**

1. **Naming Conventions** (enforced by @typescript-eslint):
   - Classes: `PascalCase` (e.g., `UserProfile`, `FormValidator`)
   - Functions: `camelCase` (e.g., `getUserData`, `validateForm`)
   - Variables: `camelCase` (e.g., `userName`, `formData`)

2. **Filename Validation** (enforced by eslint-plugin-validate-filename):
   - Markdown files: `camelCase` (e.g., `lintingSdGuide.md`, not `linting_sd_guide.md`)
   - Cypress files: `camelCase` except in `e2e` folder (e.g., `loginHelper.js`)
   - Test files (.cy.js): Must be in `cypress/e2e/` folder only

3. **Code Quality**:
   - No unused variables (except prefixed with `_`)
   - Use `const` for non-reassigned variables
   - No `var` keyword (use `let` or `const`)
   - No `debugger` statements (warnings only)

---

## 🚀 GitHub Actions: Post-Push Linting

### Why Post-Push?

Even with `--no-verify`, you want to ensure:

- **Code quality** is maintained
- **Team standards** are enforced
- **CI/CD pipeline** catches issues
- **Pull requests** are properly validated

### GitHub Actions Workflow

Create `.github/workflows/lint.yml`:

```yaml
name: 🧹 Lint & Format Check

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  lint:
    runs-on: ubuntu-latest

    steps:
      - name: 📥 Checkout code
        uses: actions/checkout@v4

      - name: 📦 Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'

      - name: 🔧 Install dependencies
        run: npm ci

      - name: 🧹 Run ESLint
        run: npm run lint

      - name: 💅 Check Prettier formatting
        run: npm run format:check

      - name: ✅ Run all checks
        run: npm run check:all

      - name: 🧪 Run Cypress tests
        run: npm run test:chrome
        env:
          CI: true
```

### Workflow Triggers

- **Push** to main/develop branches
- **Pull Request** to main/develop branches
- **Manual** trigger (optional)

---

## 🎯 Same Linting Rules in GitHub Actions

### Consistency is Key

Your GitHub Actions use the **exact same** linting rules as local development:

```yaml
# .github/workflows/lint.yml
- name: 🧹 Run ESLint
  run: npm run lint # Uses your eslint.config.js

- name: 💅 Check Prettier formatting
  run: npm run format:check # Uses your .prettierrc

- name: ✅ Run all checks
  run: npm run check:all # Combines lint + format check
```

### Benefits

✅ **Same rules** everywhere  
✅ **Same configuration**  
✅ **Same output**  
✅ **No surprises**

---

## 🛠️ Best Practices

### 1. Local Development

```bash
# Always run before committing
npm run check:all

# Fix issues automatically
npm run lint:fix
npm run format
```

### 2. Commit Strategy

```bash
# Good: Lint passes
git add .
npm run check:all  # ✅ All good
git commit -m "Add form validation"

# Bad: Skip linting without reason
git commit -m "Quick fix" --no-verify  # ❌ Avoid this
```

### 3. Team Workflow

1. **Pull latest** changes
2. **Run linting** locally
3. **Fix issues** before committing
4. **Push** clean code
5. **GitHub Actions** validate automatically

### 4. Emergency Situations

```bash
# Only when absolutely necessary
git commit -m "🚨 CRITICAL: Fix production bug" --no-verify

# Create follow-up PR to fix linting issues
git checkout -b fix-linting-issues
npm run lint:fix
git add .
git commit -m "Fix linting issues from emergency commit"
```

---

## 📚 Useful Commands

### Linting Commands

```bash
# Check everything
npm run check:all

# Lint only
npm run lint

# Fix linting issues
npm run lint:fix

# Format only
npm run format

# Check formatting
npm run format:check

# Check markdown filenames
npm run lint:md-names
```

### Common Linting Fixes

```bash
# Fix naming convention issues
# Classes: Use PascalCase
class UserProfile {}  # ✅
class userProfile {}  # ❌ Fix to UserProfile

# Functions: Use camelCase
function getUserData() {}  # ✅
function GetUserData() {}  # ❌ Fix to getUserData

# Variables: Use camelCase
const userName = 'John';  # ✅
const user_name = 'John';  # ❌ Fix to userName

# Filenames: Use camelCase for .md and cypress files
lintingSdGuide.md  # ✅
linting_sd_guide.md  # ❌ Rename to lintingSdGuide.md
```

### Git Commands

```bash
# Normal commit (with linting)
git commit -m "Your message"

# Skip linting (emergency only)
git commit -m "Emergency" --no-verify

# Check what will be committed
git status
git diff --staged
```

---

## 🚨 Troubleshooting

### Common Issues

**Linting fails during commit:**

```bash
# Fix issues first
npm run lint:fix
npm run format

# Then commit
git add .
git commit -m "Fix linting issues"
```

**Naming convention errors:**

```javascript
// ❌ Error: Class name must be PascalCase
class userProfile {}

// ✅ Fix: Use PascalCase
class UserProfile {}

// ❌ Error: Function name must be camelCase
function GetUserData() {}

// ✅ Fix: Use camelCase
function getUserData() {}
```

**Filename validation errors:**

```bash
# ❌ Error: Markdown file must be camelCase
linting_sd_guide.md

# ✅ Fix: Rename to camelCase
lintingSdGuide.md

# ❌ Error: .cy.js file outside cypress/e2e folder
src/tests/login.cy.js

# ✅ Fix: Move to correct location
cypress/e2e/login.cy.js
```

**Pre-commit hook not working:**

```bash
# Reinstall husky
npm run prepare

# Check if hooks exist
ls -la .husky/
```

**GitHub Actions failing:**

- Check the Actions tab in GitHub
- Review error logs
- Fix issues locally first
- Push again

---

## 📖 Summary

| Scenario          | Local Action       | GitHub Action             |
| ----------------- | ------------------ | ------------------------- |
| **Normal commit** | ✅ Linting runs    | ✅ Linting validates      |
| **--no-verify**   | ❌ Linting skipped | ✅ Linting catches issues |
| **Emergency fix** | ❌ Linting skipped | ✅ Linting validates      |
| **WIP commit**    | ❌ Linting skipped | ✅ Linting validates      |

**Remember:** GitHub Actions are your safety net! Even if you skip local linting, the CI/CD pipeline will catch issues and maintain code quality standards.

---

_Happy coding! 🎉_
