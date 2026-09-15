const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const css = fs.readFileSync(path.join(__dirname, '..', 'css', 'style.css'), 'utf8');

test('platform cards invert their body palette between light and dark themes', () => {
  assert.match(css, /--platform-card-body-bg:#141b36/);
  assert.match(css, /--platform-card-body-text:#f7f8ff/);
  assert.match(css, /:root\[data-theme="dark"\][^{]*\{[^}]*--platform-card-body-bg:#f8f9ff/);
  assert.match(css, /:root\[data-theme="dark"\][^{]*\{[^}]*--platform-card-body-text:#18203d/);
  assert.match(css, /\.platform-card-head\{[^}]*linear-gradient\(135deg,#22356f,#4f46e5\)/);
  assert.match(css, /\.platform-card-body\{[^}]*background:var\(--platform-card-body-bg\)[^}]*color:var\(--platform-card-body-text\)/);
  assert.match(css, /\.platform-card \.fact-grid>div[^}]*background:var\(--platform-card-chip-bg\)/);
  assert.match(css, /\.platform-card \.btn-inline\{[^}]*color:var\(--platform-card-link\)/);
});
