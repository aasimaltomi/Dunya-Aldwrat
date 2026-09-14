const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.join(__dirname, '..');
const read = file => fs.readFileSync(path.join(ROOT, file), 'utf8');

test('explore cards expose the polished metadata chips and primary details action', () => {
  const app = read('js/app.js');

  assert.match(app, /class=\"fact-chip-row\"/);
  assert.match(app, /class=\"fact-chip/);
  assert.match(app, /class=\"btn-inline card-primary-action\"/);
  assert.match(app, /class=\"card-secondary-actions\"/);
});

test('explore stylesheet contains the approved SaaS card and filter treatment', () => {
  const css = read('css/style.css');

  assert.match(css, /\.explore-section\{[^}]*background:/s);
  assert.match(css, /\.controls-panel\{[^}]*box-shadow:/s);
  assert.match(css, /\.fact-chip-row/);
  assert.match(css, /\.fact-chip/);
  assert.match(css, /\.card-primary-action/);
  assert.match(css, /\.card-secondary-actions/);
  assert.match(css, /@media\(max-width:640px\)/);
});
