const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.join(__dirname, '..');
const read = file => fs.readFileSync(path.join(ROOT, file), 'utf8');

test('platform cards invert their palette between light and dark themes on home and Explore', () => {
  const css = read('css/platform-card-theme.css');
  const home = read('index.html');
  const explore = read('explore.html');

  assert.match(home, /css\/platform-card-theme\.css/);
  assert.match(explore, /css\/platform-card-theme\.css/);

  assert.match(css, /--platform-card-body-bg:#141b36/);
  assert.match(css, /--platform-card-body-text:#f7f8ff/);
  assert.match(css, /html\[data-theme="dark"\][^{]*\{[^}]*--platform-card-body-bg:#f8f9ff/);
  assert.match(css, /html\[data-theme="dark"\][^{]*\{[^}]*--platform-card-body-text:#18203d/);

  assert.match(css, /\.featured-course-card\{[^}]*background:var\(--platform-card-body-bg\)/);
  assert.match(css, /\.featured-course-art\{[^}]*linear-gradient\(145deg,#17245b 0%,#263b86 58%,#5b5cf6 100%\)/);
  assert.match(css, /\.featured-course-body h3\{[^}]*color:var\(--platform-card-body-text\)/);

  assert.match(css, /\.platform-card\{[^}]*background:var\(--platform-card-body-bg\)/);
  assert.match(css, /\.platform-card-head\{[^}]*linear-gradient\(135deg,#22356f,#4f46e5\)/);
  assert.match(css, /\.platform-card-body\{[^}]*color:var\(--platform-card-body-text\)/);
});
