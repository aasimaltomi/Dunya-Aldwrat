const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.join(__dirname, '..');
const landingJs = fs.readFileSync(path.join(ROOT, 'js', 'landing.js'), 'utf8');
const landingCss = fs.readFileSync(path.join(ROOT, 'css', 'landing.css'), 'utf8');

test('featured cards expose real platform metadata and a clear CTA', () => {
  assert.match(landingJs, /featured-course-badges/);
  assert.match(landingJs, /featured-course-stats/);
  assert.match(landingJs, /featured-course-cta/);
  assert.match(landingJs, /pricingModel/);
  assert.match(landingJs, /certificateAvailable/);
  assert.match(landingJs, /languageIds/);
});

test('featured card styling supports richer cards and responsive presentation', () => {
  assert.match(landingCss, /\.featured-course-badges/);
  assert.match(landingCss, /\.featured-course-stats/);
  assert.match(landingCss, /\.featured-course-cta/);
  assert.match(landingCss, /\.featured-course-card:hover/);
});

test('featured cards do not hardcode fake course titles', () => {
  assert.doesNotMatch(landingJs, /Python for Beginners|UI\/UX Design|Digital Marketing|Data Science/);
});
