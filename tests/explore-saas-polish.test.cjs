const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.join(__dirname, '..');
const read = file => fs.readFileSync(path.join(ROOT, file), 'utf8');

test('explore keeps the existing real-data card flow while promoting details', () => {
  const app = read('js/app.js');

  assert.match(app, /function platformCard\(p,compact=false\)/);
  assert.match(app, /class=\"fact-grid\"/);
  assert.match(app, /getText\('details'\)/);
  assert.match(app, /data-action=\"compare\"/);
});

test('explore stylesheet contains the approved SaaS card and filter treatment', () => {
  const css = read('css/style.css');

  assert.match(css, /\.explore-section\{[^}]*radial-gradient/s);
  assert.match(css, /\.controls-panel\{[^}]*box-shadow:/s);
  assert.match(css, /\.fact-grid\{[^}]*display:flex/s);
  assert.match(css, /\.fact-grid>div\{[^}]*border-radius:999px/s);
  assert.match(css, /\.card-actions>\.btn-inline:nth-child\(2\)\{[^}]*linear-gradient/s);
  assert.match(css, /\.platform-card\{[^}]*box-shadow:/s);
  assert.match(css, /@media\(max-width:640px\)/);
});
