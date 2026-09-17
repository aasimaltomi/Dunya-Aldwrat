const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const css = fs.readFileSync(path.join(__dirname, '..', 'css', 'style.css'), 'utf8');

test('Explore quick actions share one balanced visual frame', () => {
  assert.match(css, /\/\* Balanced Explore quick actions \*\//);
  assert.match(css, /\.quick-actions\{[^}]*align-items:stretch/);
  assert.match(css, /\.quick-actions>\.mini-btn\{[^}]*min-height:56px/);
  assert.match(css, /\.quick-actions>\.mini-btn\{[^}]*border-radius:16px/);
  assert.match(css, /\.quick-actions>\.mini-btn:not\(\.path-premium-trigger\)\{[^}]*display:inline-flex/);
  assert.match(css, /\.quick-actions>\.mini-btn:not\(\.path-premium-trigger\)\{[^}]*align-items:center/);
  assert.match(css, /\.quick-actions>\.mini-btn:not\(\.path-premium-trigger\)\{[^}]*justify-content:center/);
  assert.match(css, /\.path-premium-trigger\{[^}]*min-height:56px/);
});

test('Explore quick actions remain balanced on mobile', () => {
  assert.match(css, /@media\(max-width:640px\)\{[^}]*\.quick-actions>\.mini-btn\{[^}]*min-height:54px/);
});
