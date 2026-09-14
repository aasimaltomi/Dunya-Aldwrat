const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.join(__dirname, '..');

function read(file) {
  return fs.readFileSync(path.join(ROOT, file), 'utf8');
}

test('homepage exposes the approved light-theme hero structure', () => {
  const html = read('index.html');

  assert.match(html, /class="hero-kicker"/);
  assert.match(html, /class="hero-search"/);
  assert.match(html, /id="heroSearchInput"/);
  assert.match(html, /id="heroCategoryChips"/);
  assert.match(html, /class="hero-trust"/);
  assert.match(html, /class="hero-illustration"/);
});

test('homepage includes the approved discovery sections near the top', () => {
  const html = read('index.html');

  assert.match(html, /id="featuredCourses"/);
  assert.match(html, /id="topLearningPlatforms"/);
  assert.match(html, /id="learnerTestimonials"/);
});

test('landing stylesheet contains the approved light visual language', () => {
  const css = read('css/landing.css');

  assert.match(css, /--home-primary:\s*#4f46e5/i);
  assert.match(css, /--home-accent:\s*#6d5dfc/i);
  assert.match(css, /\.hero-search/);
  assert.match(css, /\.hero-category-chip/);
  assert.match(css, /\.featured-course-card/);
  assert.match(css, /\.learning-platform-card/);
  assert.match(css, /@media\(max-width:980px\)/);
});
