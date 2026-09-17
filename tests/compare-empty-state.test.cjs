const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const nav = fs.readFileSync(path.join(__dirname, '..', 'js', 'explore-nav.js'), 'utf8');
const html = fs.readFileSync(path.join(__dirname, '..', 'explore.html'), 'utf8');

test('compare modal renders a guided state until at least two platforms are selected', () => {
  assert.match(nav, /originalBuildCompareTable/);
  assert.match(nav, /selected\.length<2/);
  assert.match(nav, /id="compareBrowse"/);
  assert.match(nav, /getText\('compareBar'\)/);
  assert.match(nav, /getText\('maxCompare'\)/);
  assert.match(nav, /getText\('browsePlatforms'\)/);
});

test('compare empty-state browse action closes the modal and returns to the platform list', () => {
  assert.match(nav, /compareBrowse/);
  assert.match(nav, /closeModal\('compareModal'\)/);
  assert.match(nav, /querySelector\('#explore'\)\.scrollIntoView/);
});

test('comparison guard loads after the main Explore application', () => {
  const appPos = html.indexOf('js/app.js');
  const navPos = html.indexOf('js/explore-nav.js');
  assert.ok(appPos >= 0 && navPos > appPos);
});
