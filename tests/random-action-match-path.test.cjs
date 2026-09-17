const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.join(__dirname, '..');
const html = fs.readFileSync(path.join(ROOT, 'explore.html'), 'utf8');
const app = fs.readFileSync(path.join(ROOT, 'js', 'app.js'), 'utf8');
const css = fs.readFileSync(path.join(ROOT, 'css', 'style.css'), 'utf8');

test('Explore removes the install action from the quick-action group', () => {
  assert.doesNotMatch(html, /id="installBtn"/);
  assert.match(html, /id="randomBtn"[^>]*random-premium-trigger|random-premium-trigger[^>]*id="randomBtn"/);
});

test('random platform action uses the same premium button structure as the roadmap action', () => {
  const randomButton = html.match(/<button[^>]*id="randomBtn"[\s\S]*?<\/button>/)?.[0] || '';
  assert.match(randomButton, /class="path-premium-icon"/);
  assert.match(randomButton, /class="path-premium-copy"/);
  assert.match(randomButton, /class="path-premium-arrow"/);
  assert.match(randomButton, /data-i18n="randomPlatform"/);
});

test('PWA registration is safe when no install button exists', () => {
  assert.match(app, /const installBtn=\$\('installBtn'\);if\(!installBtn\)return/);
  assert.doesNotMatch(app, /\$\('installBtn'\)\.hidden=false/);
  assert.doesNotMatch(app, /\$\('installBtn'\)\.onclick=/);
});

test('random action matches roadmap dimensions while keeping a dark treatment', () => {
  assert.match(css, /\/\* Matched Explore primary actions \*\//);
  assert.match(css, /\.random-premium-trigger\{[^}]*min-width:220px/);
  assert.match(css, /\.random-premium-trigger\{[^}]*min-height:56px/);
  assert.match(css, /\.random-premium-trigger\{[^}]*grid-template-columns:38px minmax\(0,1fr\) auto/);
  assert.match(css, /\.random-premium-trigger\{[^}]*background:color-mix/);
  assert.match(css, /@media\(max-width:640px\)\{[^}]*\.random-premium-trigger\{[^}]*min-width:0/);
});
