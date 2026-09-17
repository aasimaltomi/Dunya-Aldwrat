const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const css = fs.readFileSync(path.join(__dirname, '..', 'css', 'style.css'), 'utf8');

test('readability pass enlarges only small and medium interface copy', () => {
  assert.match(css, /\/\* Readability typography pass \*\//);
  assert.match(css, /\.quick-filter-chips button[^}]*font-size:11px/);
  assert.match(css, /\.filter-group label[^}]*font-size:10\.5px/);
  assert.match(css, /\.platform-desc[^}]*font-size:12\.5px/);
  assert.match(css, /\.fact-grid span[^}]*font-size:10px/);
  assert.match(css, /\.fact-grid strong[^}]*font-size:11px/);
  assert.match(css, /\.btn-inline[^}]*font-size:11px/);
  assert.match(css, /\.path-goal-copy small[^}]*font-size:10px/);
  assert.match(css, /\.path-usage-steps span[^}]*font-size:10px/);
  assert.match(css, /\.path-stage-note[^}]*font-size:10px/);
});

test('readability pass does not override already-large headings', () => {
  const pass = css.split('/* Readability typography pass */')[1] || '';
  for (const selector of ['.hero-platform h1','.section-heading h2','.platform-card h3','.path-modal-hero h2']) {
    assert.equal(pass.includes(selector), false, `${selector} should not be enlarged by the readability pass`);
  }
});
