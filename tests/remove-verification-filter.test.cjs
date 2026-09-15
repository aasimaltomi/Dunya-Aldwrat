const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.join(__dirname, '..');
const read = file => fs.readFileSync(path.join(ROOT, file), 'utf8');

test('Explore does not render the verification filter control', () => {
  const html = read('explore.html');

  assert.doesNotMatch(html, /for="filterVerification"/);
  assert.doesNotMatch(html, /data-i18n="filterVerification"/);
  assert.match(html, /<select id="filterVerification" hidden><\/select>/);
});
