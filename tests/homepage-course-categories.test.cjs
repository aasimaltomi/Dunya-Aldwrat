const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');

test('homepage no longer includes the discovery categories section', () => {
  const index = read('index.html');

  assert.doesNotMatch(index, /id="courseCategories"/, 'homepage should not include the discovery categories section');
  assert.doesNotMatch(index, /id="landingCategoryGrid"/, 'homepage should not include the discovery categories grid');
});
