const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.join(__dirname, '..');
const read = file => fs.readFileSync(path.join(ROOT, file), 'utf8');

test('Explore does not render or depend on the verification filter', () => {
  const html = read('explore.html');
  const app = read('js/app.js');

  assert.doesNotMatch(html, /id="filterVerification"/);
  assert.doesNotMatch(html, /data-i18n="filterVerification"/);
  assert.doesNotMatch(app, /filterVerification:\$\('filterVerification'\)/);
  assert.doesNotMatch(app, /els\.filterVerification/);
});
