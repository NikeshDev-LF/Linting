import { readdirSync } from 'fs';
// import { join } from 'path';

// camelCase pattern: starts with lowercase, followed by letters/numbers (e.g., abcDef.md)
const camelCaseRegex = /^[a-z][a-zA-Z0-9]*\.md$/;

const mdFiles = readdirSync('.').filter(f => f.endsWith('.md'));
const invalidFiles = mdFiles.filter(f => !camelCaseRegex.test(f));

if (invalidFiles.length > 0) {
  console.error(
    '❌ Markdown files must use camelCase naming (e.g., abcDef.md):'
  );
  invalidFiles.forEach(f => console.error(`  - ${f}`));
  process.exit(1);
}

console.log('✅ All markdown files use camelCase naming');
