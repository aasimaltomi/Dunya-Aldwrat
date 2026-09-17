const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const app = fs.readFileSync(path.join(__dirname, '..', 'js', 'app.js'), 'utf8');

test('compare modal renders a guided empty state until at least two platforms are selected', () => {
  assert.match(app, /if\(rows\.length<2\)/);
  assert.match(app, /id=\\?"compareBrowse\\?"/);
  assert.match(app, /getText\('compareBar'\)/);
  assert.match(app, /getText\('maxCompare'\)/);
  assert.match(app, /getText\('browsePlatforms'\)/);
  assert.doesNotMatch(app, /if\(!rows\.length\)\{\$\('compareTable'\)\.innerHTML='';return\}/);
});

test('compare empty-state browse action closes the modal and returns to the platform list', () => {
  assert.match(app, /compareBrowse/);
  assert.match(app, /closeModal\('compareModal'\)/);
  assert.match(app, /querySelector\('#explore'\)\.scrollIntoView/);
});
