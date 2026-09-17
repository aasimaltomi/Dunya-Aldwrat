const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.join(__dirname, '..');
const read = file => fs.readFileSync(path.join(ROOT, file), 'utf8');

test('homepage hero removes the redundant eyebrow and side clutter', () => {
  const html = read('index.html');

  assert.doesNotMatch(html, /class="hero-kicker"/);
  assert.doesNotMatch(html, /hero-learning-card/);
  assert.doesNotMatch(html, /hero-book-stack/);
  assert.doesNotMatch(html, /class="landing-core"/);
  assert.match(html, /class="hero-device-card"/);
  assert.match(html, /class="hero-brand-logo"/);
});

test('homepage hero raises the main copy toward the top of the section', () => {
  const css = read('css/landing.css');

  assert.match(css, /\.landing-hero\{[^}]*align-items:start[^}]*padding-top:3rem/);
  assert.match(css, /\.landing-copy\{[^}]*min-height:0[^}]*justify-content:flex-start/);
});

test('hero search keeps the CTA left and the search icon right', () => {
  const css = read('css/landing.css');

  assert.match(css, /\.hero-search-button\{[^}]*order:1/);
  assert.match(css, /\.hero-search input\{[^}]*order:2/);
  assert.match(css, /\.hero-search-icon\{[^}]*order:3/);
  assert.match(css, /\[dir="rtl"\] \.hero-search input\{[^}]*direction:rtl[^}]*text-align:right/);
});

test('hero platform cloud is intentionally limited to four labels', () => {
  const js = read('js/landing.js');
  assert.match(js, /filter\(Boolean\)\.slice\(0,4\)/);
});
