const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const css = fs.readFileSync(path.join(__dirname, '..', 'css', 'platform-card-theme.css'), 'utf8');

test('homepage dark mode uses dark Explore-like surfaces with readable category cards', () => {
  assert.match(css, /html\[data-theme="dark"\] \.home-light-shell\{[^}]*background:#0b0d16/);
  assert.match(css, /html\[data-theme="dark"\] \.landing-main\{[^}]*color:#f6f7fb/);
  assert.match(css, /html\[data-theme="dark"\] \.home-header\{[^}]*background:rgba\(11,13,22,/);
  assert.match(css, /html\[data-theme="dark"\] \.landing-section\.alt\{[^}]*background:/);
  assert.match(css, /html\[data-theme="dark"\] \.home-category-grid \.category-card\{[^}]*background:#121521[^}]*border-color:#262b3d[^}]*color:#f6f7fb/);
  assert.match(css, /html\[data-theme="dark"\] \.home-category-grid \.category-card small\{[^}]*color:#a2a7b9/);
  assert.match(css, /html\[data-theme="dark"\] \.home-category-grid \.category-card>span\{[^}]*background:#24203f[^}]*color:#8b7cff/);
});
