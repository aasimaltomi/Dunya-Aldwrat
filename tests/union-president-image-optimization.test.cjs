const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.join(__dirname, '..');
const webpPath = path.join(ROOT, 'assets', 'union-president.webp');
const index = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
const guard = fs.readFileSync(path.join(ROOT, 'js', 'union-president-message.js'), 'utf8');

test('union president portrait is a real optimized WebP asset', () => {
  assert.equal(fs.existsSync(webpPath), true, 'optimized WebP portrait is missing');
  const bytes = fs.readFileSync(webpPath);
  assert.equal(bytes.subarray(0, 4).toString('ascii'), 'RIFF', 'WebP must start with RIFF');
  assert.equal(bytes.subarray(8, 12).toString('ascii'), 'WEBP', 'file extension must match actual WebP encoding');
  assert.ok(bytes.length > 0, 'portrait must not be empty');
  assert.ok(bytes.length < 900 * 1024, `portrait should stay below 900 KiB, got ${bytes.length} bytes`);
});

test('homepage and portrait guard reference only the optimized WebP portrait', () => {
  assert.match(index, /src="assets\/union-president\.webp"/);
  assert.doesNotMatch(index, /union-president\.png/);
  assert.match(guard, /const PORTRAIT_SRC='assets\/union-president\.webp'/);
  assert.doesNotMatch(guard, /union-president\.png/);
});
