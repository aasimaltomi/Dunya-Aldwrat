const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.join(__dirname, '..');
const read = file => fs.readFileSync(path.join(ROOT, file), 'utf8');

test('homepage hero removes the redundant eyebrow and side clutter from the rendered UI', () => {
  const html = read('index.html');
  const css = read('css/platform-card-theme.css');
  const js = read('js/landing.js');

  assert.match(html, /class="hero-device-card"/);
  assert.match(html, /class="hero-brand-logo"/);
  assert.match(css, /\.hero-kicker,\s*\.hero-learning-card,\s*\.hero-book-stack,\s*\.hero-platform-cloud \.landing-core\{display:none!important\}/);
  assert.match(js, /function removeHeroClutter\(\)/);
  assert.match(js, /querySelectorAll\('\.hero-kicker,\.hero-learning-card,\.hero-book-stack,\.hero-platform-cloud \.landing-core'\)/);
  assert.match(js, /removeHeroClutter\(\);\s*const params=/);
});

test('homepage hero raises the main copy toward the top of the section', () => {
  const css = read('css/platform-card-theme.css');

  assert.match(css, /\.home-light-shell \.landing-hero\{[^}]*align-items:start[^}]*padding-top:3rem/);
  assert.match(css, /\.home-light-shell \.landing-copy\{[^}]*min-height:0[^}]*justify-content:flex-start/);
});

test('hero search keeps the CTA left and the search icon right', () => {
  const css = read('css/platform-card-theme.css');

  assert.match(css, /\.hero-search-button\{order:1\}/);
  assert.match(css, /\.hero-search input\{order:2\}/);
  assert.match(css, /\.hero-search-icon\{order:3\}/);
  assert.match(css, /\[dir="rtl"\] \.hero-search input\{direction:rtl;text-align:right\}/);
});

test('hero platform cloud is intentionally limited to four labels', () => {
  const js = read('js/landing.js');
  assert.match(js, /filter\(Boolean\)\.slice\(0,4\)/);
  assert.match(js, /orbit\.appendChild\(chip\)/);
});
