const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.join(__dirname, '..');
const read = file => fs.readFileSync(path.join(ROOT, file), 'utf8');

test('platform profile keeps the existing real-data detail structure', () => {
  const detail = read('js/platform-detail.js');

  assert.match(detail, /class=\"profile-hero\"/);
  assert.match(detail, /class=\"profile-facts\"/);
  assert.match(detail, /class=\"profile-learning profile-fields-section\"/);
  assert.match(detail, /class=\"profile-learning profile-paths-section\"/);
  assert.match(detail, /class=\"profile-editorial\"/);
  assert.match(detail, /getText\('officialSite'\)/);
});

test('platform profile stylesheet contains the approved polished treatment', () => {
  const css = read('css/profile.css');

  assert.match(css, /\.profile-hero\{[^}]*radial-gradient/s);
  assert.match(css, /\.profile-facts\{[^}]*box-shadow:/s);
  assert.match(css, /\.profile-fact\{[^}]*border-radius:16px/s);
  assert.match(css, /\.profile-field-chip\{[^}]*border-radius:999px/s);
  assert.match(css, /\.profile-path-card\{[^}]*box-shadow:/s);
  assert.match(css, /\.profile-panel\{[^}]*box-shadow:/s);
  assert.match(css, /\.similar-card\{[^}]*box-shadow:/s);
  assert.match(css, /:root\[data-theme=\"dark\"\] \.profile-hero/);
  assert.match(css, /@media\(max-width:640px\)/);
});
