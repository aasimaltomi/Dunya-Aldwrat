const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.join(__dirname, '..');
const pages = ['index.html', 'explore.html', 'platform.html'];

test('browser pages use a dedicated SVG favicon', () => {
  for (const page of pages) {
    const html = fs.readFileSync(path.join(ROOT, page), 'utf8');
    assert.match(
      html,
      /<link id="appFavicon" rel="icon" type="image\/svg\+xml" href="favicon\.svg\?v=20260917">/,
      `${page} should point directly to the dedicated favicon`,
    );
    assert.doesNotMatch(
      html,
      /id="appFavicon"[^>]*data-asset="favicon"/,
      `${page} should not let runtime content overwrite the browser-tab favicon`,
    );
  }
});

test('favicon artwork exists as a compact scalable icon', () => {
  const faviconPath = path.join(ROOT, 'favicon.svg');
  assert.equal(fs.existsSync(faviconPath), true, 'favicon.svg should exist');
  const svg = fs.readFileSync(faviconPath, 'utf8');
  assert.match(svg, /viewBox="0 0 512 512"/);
  assert.match(svg, /<svg[\s>]/);
  assert.match(svg, /#0b1538/i);
  assert.match(svg, /#6d5dfc/i);
  assert.match(svg, /#49dff7/i);
});
