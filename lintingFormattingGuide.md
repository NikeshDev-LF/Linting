# Code Quality Guide: Linting & Formatting Best Practices

**Knowledge Sharing Session**  
**Date:** December 2025  
**Topic:** ESLint & Prettier Configuration for JavaScript Projects

---

## Table of Contents

1. [Introduction](#introduction)
2. [What is Linting?](#what-is-linting)
3. [What is Formatting?](#what-is-formatting)
4. [Our Project Setup](#our-project-setup)
5. [Naming Conventions](#naming-conventions)
6. [Code Quality Rules](#code-quality-rules)
7. [Filename Validation](#filename-validation)
8. [Real Examples from Our Codebase](#real-examples-from-our-codebase)
9. [Common Mistakes & Fixes](#common-mistakes--fixes)
10. [Best Practices](#best-practices)
11. [Tools & Commands](#tools--commands)

---

## Introduction

### Why Code Quality Matters

Code quality tools help us:

- ✅ **Maintain consistency** across the team
- ✅ **Catch errors** before they reach production
- ✅ **Improve readability** for everyone
- ✅ **Save time** in code reviews
- ✅ **Enforce standards** automatically

### What We'll Cover

This guide explains our project's linting and formatting setup, including:

- ESLint configuration for JavaScript
- Prettier for code formatting
- TypeScript ESLint for advanced naming conventions
- Filename validation rules
- Practical examples from our Cypress test suite

---

## What is Linting?

### Definition

**Linting** is the process of analyzing code to find:

- Programming errors
- Bugs and potential issues
- Stylistic errors
- Suspicious code patterns
- Code quality violations

### How It Works

```
Your Code
    ↓
[ESLint Parser] ← Reads & understands your code
    ↓
[ESLint Rules] ← Checks against defined rules
    ↓
Errors/Warnings ← Reports issues
```

### Example: Before Linting

```javascript
// ❌ Multiple issues
var user_name = 'John';
function Get_User_Data() {
  var unusedVar = 10;
  console.log(user_name);
}
```

### Example: After Linting

```javascript
// ✅ Clean code
const userName = 'John';
function getUserData() {
  console.log(userName);
}
```

---

## What is Formatting?

### Definition

**Formatting** is the process of automatically styling code for:

- Consistent indentation
- Proper spacing
- Quote style (single vs double)
- Line breaks
- Code structure

### Prettier: Our Formatter

Prettier is an opinionated code formatter that:

- Formats code automatically
- Works with multiple languages
- Integrates with ESLint
- Runs on save in VS Code

### Example: Before Formatting

```javascript
function processForm(data) {
  const result = { name: data.firstName, age: data.userAge };
  return result;
}
```

### Example: After Formatting

```javascript
function processForm(data) {
  const result = { name: data.firstName, age: data.userAge };
  return result;
}
```

---

## Our Project Setup

### Technology Stack

Our project uses:

| Tool                  | Purpose              | Configuration File |
| --------------------- | -------------------- | ------------------ |
| **ESLint**            | Code linting         | `eslint.config.js` |
| **Prettier**          | Code formatting      | `.prettierrc`      |
| **TypeScript ESLint** | Naming conventions   | `eslint.config.js` |
| **validate-filename** | Filename rules       | `eslint.config.js` |
| **Husky**             | Git hooks            | `.husky/`          |
| **lint-staged**       | Staged files linting | `package.json`     |

### Project Structure

```
project/
├── cypress/
│   ├── e2e/
│   │   └── formSubmission.cy.js    # Test files
│   ├── pages/
│   │   └── practiceFormPage.js     # Page objects
│   ├── support/
│   │   └── utils/
│   │       └── dataFactory.js      # Utilities
│   └── fixtures/
├── eslint.config.js                 # ESLint configuration
├── .prettierrc                      # Prettier configuration
├── package.json                     # Scripts & dependencies
└── .husky/                          # Git hooks
```

### ESLint Configuration Overview

```javascript
// eslint.config.js
import js from '@eslint/js';
import prettier from 'eslint-config-prettier';
import globals from 'globals';
import validateFilename from 'eslint-plugin-validate-filename';
import ts from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';

export default [
  js.configs.recommended,
  prettier,

  // Base configuration for all JS files
  {
    files: ['**/*.js'],
    languageOptions: {
      parser: tsParser,
      globals: { ...globals.node },
    },
    rules: {
      // Custom rules here
    },
  },
];
```

---

## Naming Conventions

### Overview

Our project enforces strict naming conventions using TypeScript ESLint plugin.

### Class Names: PascalCase

**Rule:** Classes must start with uppercase letter, followed by camelCase.

#### ❌ Incorrect Examples

```javascript
// Wrong: snake_case
class form_validator {
  constructor() {}
}

// Wrong: camelCase
class formValidator {
  constructor() {}
}

// Wrong: kebab-case (syntax error anyway)
class form-validator {
  constructor() {}
}
```

#### ✅ Correct Examples

```javascript
// Correct: PascalCase
class FormValidator {
  constructor() {}
}

class UserProfileManager {
  constructor(name) {
    this.userName = name;
  }
}

class ApiService {
  async fetchData() {
    // ...
  }
}
```

### Function Names: camelCase

**Rule:** Functions must start with lowercase letter, followed by camelCase.

#### ❌ Incorrect Examples

```javascript
// Wrong: PascalCase
function GetUserData() {
  return userData;
}

// Wrong: snake_case
function get_user_data() {
  return userData;
}

// Wrong: kebab-case (syntax error)
function get-user-data() {
  return userData;
}
```

#### ✅ Correct Examples

```javascript
// Correct: camelCase
function getUserData() {
  return userData;
}

function validateFormInput(input) {
  return input.trim().length > 0;
}

async function fetchUserProfile(userId) {
  const response = await fetch(`/api/users/${userId}`);
  return response.json();
}

// Arrow functions also use camelCase
const calculateTotal = items => {
  return items.reduce((sum, item) => sum + item.price, 0);
};
```

### Variable Names: camelCase

**Rule:** Variables must use camelCase (or UPPER_CASE for constants).

#### ❌ Incorrect Examples

```javascript
// Wrong: snake_case
const user_name = "John";
let form_data = {};

// Wrong: PascalCase (reserved for classes)
const UserName = "John";
let FormData = {};

// Wrong: kebab-case (syntax error)
const user-name = "John";
```

#### ✅ Correct Examples

```javascript
// Correct: camelCase for regular variables
const userName = 'John';
let formData = {};
const emailAddress = 'user@example.com';

// Correct: UPPER_CASE for constants
const API_URL = 'https://api.example.com';
const MAX_RETRY_COUNT = 3;
const DEFAULT_TIMEOUT = 5000;

// Correct: Leading underscore allowed for unused
function processData(_unusedParam, actualData) {
  return actualData.map(item => item.value);
}
```

### Real Example from Our Codebase

#### Page Object Pattern (practiceFormPage.js)

```javascript
// ✅ Correct implementation
class PracticeFormPage {
  // Properties use camelCase
  firstNameInput = '#firstName';
  lastNameInput = '#lastName';

  // Methods use camelCase
  visitPage() {
    cy.visit('/automation-practice-form');
  }

  fillFirstName(firstName) {
    cy.get(this.firstNameInput).type(firstName);
  }

  submitForm() {
    cy.get('#submit').click();
  }
}

// Export using camelCase for the instance
export const practiceFormPage = new PracticeFormPage();
```

---

## Code Quality Rules

### No Unused Variables

**Rule:** Variables that are declared but never used should be removed.

#### ❌ Incorrect Example

```javascript
function processUserData(userData) {
  const userName = userData.name; // ✅ Used
  const userEmail = userData.email; // ❌ Declared but never used
  const userAge = userData.age; // ❌ Declared but never used

  return userName;
}
```

#### ✅ Correct Example

```javascript
function processUserData(userData) {
  const userName = userData.name; // ✅ Used
  return userName;
}

// OR: Use underscore prefix for intentionally unused
function handleEvent(_event, data) {
  // _event is intentionally unused but required by API
  return data.value;
}
```

### Prefer const Over let

**Rule:** Use `const` for variables that are never reassigned.

#### ❌ Incorrect Example

```javascript
function calculateTotal(items) {
  let itemCount = items.length; // ❌ Never reassigned, should be const
  let total = 0; // ✅ Gets reassigned, let is correct

  for (let item of items) {
    total += item.price;
  }

  return { itemCount, total };
}
```

#### ✅ Correct Example

```javascript
function calculateTotal(items) {
  const itemCount = items.length; // ✅ const - never changes
  let total = 0; // ✅ let - gets reassigned

  for (const item of items) {
    // ✅ const - loop variable
    total += item.price;
  }

  return { itemCount, total };
}
```

### No var Keyword

**Rule:** Always use `const` or `let`, never use `var`.

#### ❌ Incorrect Example

```javascript
function processData() {
  var data = []; // ❌ Old-style var
  var counter = 0; // ❌ Old-style var

  for (var i = 0; i < 10; i++) {
    // ❌ Old-style var
    data.push(i);
  }

  return data;
}
```

#### ✅ Correct Example

```javascript
function processData() {
  const data = []; // ✅ const
  let counter = 0; // ✅ let

  for (let i = 0; i < 10; i++) {
    // ✅ let
    data.push(i);
  }

  return data;
}
```

### No Debugger Statements

**Rule:** Remove `debugger` statements before committing code.

#### ❌ Incorrect Example

```javascript
function validateForm(formData) {
  debugger; // ❌ Left in by mistake

  if (!formData.name) {
    return false;
  }

  debugger; // ❌ Debugging statement

  return true;
}
```

#### ✅ Correct Example

```javascript
function validateForm(formData) {
  // ✅ Use console.log for development (allowed in our config)
  console.log('Validating form:', formData);

  if (!formData.name) {
    return false;
  }

  return true;
}
```

---

## Filename Validation

### Markdown Files: camelCase

**Rule:** All `.md` files must use camelCase naming.

#### ❌ Incorrect Examples

```
project/
├── user_guide.md              ❌ snake_case
├── API_DOCS.md                ❌ UPPER_CASE
├── read-me.md                 ❌ kebab-case
└── Test_File.md               ❌ Mixed case
```

#### ✅ Correct Examples

```
project/
├── userGuide.md               ✅ camelCase
├── apiDocs.md                 ✅ camelCase
├── readme.md                  ✅ camelCase
└── testFile.md                ✅ camelCase
```

### Cypress Files: camelCase (except e2e)

**Rule:** Cypress support/page files must use camelCase.

#### ❌ Incorrect Examples

```
cypress/
├── pages/
│   ├── Login_Page.js          ❌ snake_case with caps
│   └── form-validator.js      ❌ kebab-case
└── support/
    └── utils/
        └── data_factory.js    ❌ snake_case
```

#### ✅ Correct Examples

```
cypress/
├── pages/
│   ├── loginPage.js           ✅ camelCase
│   └── formValidator.js       ✅ camelCase
├── support/
│   └── utils/
│       └── dataFactory.js     ✅ camelCase
└── e2e/
    └── login_test.cy.js       ✅ Any naming allowed in e2e
```

### Test Files Location: cypress/e2e Only

**Rule:** Files with `.cy.js` extension must be in `cypress/e2e/` folder.

#### ❌ Incorrect Examples

```
project/
├── src/
│   └── tests/
│       └── login.cy.js        ❌ Wrong location
├── tests/
│   └── form.cy.js             ❌ Wrong location
└── login.cy.js                ❌ Wrong location
```

#### ✅ Correct Examples

```
project/
└── cypress/
    └── e2e/
        ├── login.cy.js         ✅ Correct location
        ├── formSubmission.cy.js ✅ Correct location
        └── auth/
            └── signup.cy.js    ✅ Correct location
```

---

## Real Examples from Our Codebase

### Example 1: Page Object Class

**File:** `cypress/pages/practiceFormPage.js`

```javascript
// ✅ Correct implementation with all rules applied

class PracticeFormPage {
  // Element selectors - camelCase
  firstNameInput = '#firstName';
  lastNameInput = '#lastName';
  emailInput = '#userEmail';
  genderMaleRadio = '#gender-radio-1';
  submitButton = '#submit';

  // Methods - camelCase
  visitPage() {
    cy.visit('/automation-practice-form');
  }

  fillFirstName(firstName) {
    cy.get(this.firstNameInput).clear().type(firstName);
  }

  fillLastName(lastName) {
    cy.get(this.lastNameInput).clear().type(lastName);
  }

  fillEmail(email) {
    cy.get(this.emailInput).clear().type(email);
  }

  selectGender(gender) {
    const genderMap = {
      male: this.genderMaleRadio,
      female: '#gender-radio-2',
      other: '#gender-radio-3',
    };

    cy.get(genderMap[gender.toLowerCase()]).check({ force: true });
  }

  submitForm() {
    cy.get(this.submitButton).click();
  }

  verifySubmission() {
    cy.get('#example-modal-sizes-title-lg')
      .should('be.visible')
      .and('contain', 'Thanks for submitting the form');
  }
}

// Export instance with camelCase
export const practiceFormPage = new PracticeFormPage();
```

**Key Points:**

- ✅ Class name is PascalCase: `PracticeFormPage`
- ✅ All methods are camelCase: `visitPage`, `fillFirstName`
- ✅ All properties are camelCase: `firstNameInput`, `emailInput`
- ✅ Exported instance is camelCase: `practiceFormPage`
- ✅ No unused variables
- ✅ Uses `const` for non-reassigned variables

### Example 2: Data Factory Utility

**File:** `cypress/support/utils/dataFactory.js`

```javascript
// ✅ Correct implementation

import { faker } from '@faker-js/faker';

// Constants - UPPER_CASE
const GENDER_OPTIONS = ['Male', 'Female', 'Other'];
const DEFAULT_DOMAIN = '@example.com';

class DataFactory {
  // Methods - camelCase
  generateUserData() {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${DEFAULT_DOMAIN}`;

    return {
      firstName,
      lastName,
      email,
      gender: this.getRandomGender(),
      mobile: this.generateMobileNumber(),
    };
  }

  getRandomGender() {
    const randomIndex = Math.floor(Math.random() * GENDER_OPTIONS.length);
    return GENDER_OPTIONS[randomIndex];
  }

  generateMobileNumber() {
    const prefix = '9';
    const remainingDigits = faker.string.numeric(9);
    return prefix + remainingDigits;
  }

  saveToFixture(data, filename) {
    const fixtureData = JSON.stringify(data, null, 2);
    cy.writeFile(`cypress/fixtures/generated/${filename}`, fixtureData);
  }
}

// Export instance with camelCase
export const dataFactory = new DataFactory();
```

**Key Points:**

- ✅ Class name is PascalCase: `DataFactory`
- ✅ Constants are UPPER_CASE: `GENDER_OPTIONS`, `DEFAULT_DOMAIN`
- ✅ Methods are camelCase: `generateUserData`, `getRandomGender`
- ✅ Variables are camelCase: `firstName`, `randomIndex`
- ✅ No unused variables
- ✅ Uses `const` throughout

### Example 3: Cypress Test File

**File:** `cypress/e2e/formSubmission.cy.js`

```javascript
// ✅ Correct implementation

import { practiceFormPage } from '../pages/practiceFormPage';
import { dataFactory } from '../support/utils/dataFactory';

describe('Practice Form Submission', () => {
  let testData;

  before(() => {
    // Generate test data
    testData = dataFactory.generateUserData();
    dataFactory.saveToFixture(testData, 'formData.json');
  });

  beforeEach(() => {
    practiceFormPage.visitPage();
  });

  it('should submit form with valid data', () => {
    // Fill form
    practiceFormPage.fillFirstName(testData.firstName);
    practiceFormPage.fillLastName(testData.lastName);
    practiceFormPage.fillEmail(testData.email);
    practiceFormPage.selectGender(testData.gender);

    // Submit
    practiceFormPage.submitForm();

    // Verify
    practiceFormPage.verifySubmission();
  });

  it('should validate required fields', () => {
    practiceFormPage.submitForm();

    // Verify validation messages
    cy.get('#firstName').should('have.css', 'border-color', 'rgb(220, 53, 69)');
  });
});
```

**Key Points:**

- ✅ Variables are camelCase: `testData`
- ✅ Functions are camelCase: imported from page objects
- ✅ File is in correct location: `cypress/e2e/`
- ✅ No unused variables
- ✅ Uses `const` for imports

---

## Common Mistakes & Fixes

### Mistake 1: Wrong Class Naming

#### ❌ Before

```javascript
class user_profile_manager {
  constructor(userName) {
    this.user_name = userName;
  }

  Get_Profile() {
    return this.user_name;
  }
}
```

**Errors:**

- Class name uses snake_case instead of PascalCase
- Property uses snake_case instead of camelCase
- Method uses PascalCase instead of camelCase

#### ✅ After

```javascript
class UserProfileManager {
  constructor(userName) {
    this.userName = userName;
  }

  getProfile() {
    return this.userName;
  }
}
```

### Mistake 2: Using var Instead of const/let

#### ❌ Before

```javascript
function processFormData(formData) {
  var userName = formData.name;
  var userEmail = formData.email;
  var result = {
    name: userName,
    email: userEmail,
  };

  return result;
}
```

**Errors:**

- Using `var` instead of `const` or `let`

#### ✅ After

```javascript
function processFormData(formData) {
  const userName = formData.name;
  const userEmail = formData.email;
  const result = {
    name: userName,
    email: userEmail,
  };

  return result;
}
```

### Mistake 3: Unused Variables

#### ❌ Before

```javascript
function validateEmail(email) {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isValid = emailPattern.test(email);
  const errorMessage = 'Invalid email format';
  const timestamp = Date.now();

  return isValid;
}
```

**Errors:**

- `errorMessage` is declared but never used
- `timestamp` is declared but never used

#### ✅ After

```javascript
function validateEmail(email) {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isValid = emailPattern.test(email);

  return isValid;
}
```

### Mistake 4: Wrong File Naming

#### ❌ Before

```
cypress/
├── pages/
│   └── practice_form_page.js
└── support/
    └── utils/
        └── data_Factory.js
```

**Errors:**

- Using snake_case in filenames

#### ✅ After

```
cypress/
├── pages/
│   └── practiceFormPage.js
└── support/
    └── utils/
        └── dataFactory.js
```

---

## Best Practices

### 1. Run Linting Before Committing

Always check your code before committing:

```bash
# Run all checks
npm run check:all

# Or individually
npm run lint
npm run format:check
```

### 2. Use Auto-Fix When Possible

Let tools fix issues automatically:

```bash
# Fix linting issues
npm run lint:fix

# Fix formatting
npm run format
```

### 3. Configure Your IDE

**VS Code Settings:**

```json
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "eslint.validate": ["javascript", "markdown"]
}
```

### 4. Understand Error Messages

When ESLint reports an error:

```
error: Class name `user_profile` must match pattern /^[A-Z][a-zA-Z0-9]*$/
```

This means:

- Your class name is wrong
- It should start with uppercase
- It should use PascalCase

### 5. Don't Skip Linting

Avoid using `--no-verify` unless absolutely necessary:

```bash
# ❌ Avoid this
git commit -m "Quick fix" --no-verify

# ✅ Do this instead
npm run lint:fix
git add .
git commit -m "Fix linting issues"
```

---

## Tools & Commands

### Package Scripts

Our `package.json` includes these commands:

```json
{
  "scripts": {
    "lint": "eslint .",
    "lint:fix": "eslint . --fix",
    "format": "prettier --write .",
    "format:check": "prettier --check .",
    "check:all": "npm run lint:md-names && npm run lint && npm run format:check",
    "lint:md-names": "node scripts/check-md-filenames.js"
  }
}
```

### Command Reference

| Command                | Purpose                  | When to Use          |
| ---------------------- | ------------------------ | -------------------- |
| `npm run lint`         | Check for linting errors | Before committing    |
| `npm run lint:fix`     | Auto-fix linting issues  | To fix simple errors |
| `npm run format`       | Format all files         | Before committing    |
| `npm run format:check` | Check formatting         | In CI/CD             |
| `npm run check:all`    | Run all checks           | Before push          |

### Git Hooks

Our project uses Husky to run checks automatically:

**Pre-commit Hook:**

```bash
# .husky/pre-commit
npx lint-staged
```

This runs on every commit and checks:

- ESLint rules
- Prettier formatting
- Filename validation

---

## Summary

### Key Takeaways

1. **Naming Conventions:**
   - Classes: `PascalCase`
   - Functions: `camelCase`
   - Variables: `camelCase` or `UPPER_CASE`
   - Files: `camelCase` (for .md and Cypress files)

2. **Code Quality:**
   - No unused variables
   - Use `const` when possible
   - Never use `var`
   - Remove `debugger` statements

3. **File Organization:**
   - Test files (`.cy.js`) only in `cypress/e2e/`
   - Page objects in `cypress/pages/`
   - Utilities in `cypress/support/utils/`

4. **Automation:**
   - Linting runs on every commit
   - GitHub Actions validate on push
   - Tools can auto-fix many issues

### Quick Reference

```javascript
// ✅ Good Code Example
class FormValidator {
  validateEmail(email) {
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return pattern.test(email);
  }
}

const validator = new FormValidator();
const isValid = validator.validateEmail('user@example.com');
```

### Questions?

For more information:

- Check `eslint.config.js` for configuration
- Run `npm run lint -- --help` for ESLint options
- Review `lintingSdGuide.md` for detailed guide

---

**End of Document**

_Thank you for attending this knowledge sharing session!_
