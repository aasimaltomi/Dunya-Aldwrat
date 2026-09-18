const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.join(__dirname, '..');
const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
const script = fs.readFileSync(path.join(ROOT, 'js', 'union-president-message.js'), 'utf8');
const portraitPath = path.join(ROOT, 'assets', 'union-president.png');

test('union president portrait asset exists and is non-empty', () => {
  assert.equal(fs.existsSync(portraitPath), true);
  assert.ok(fs.statSync(portraitPath).size > 0);
});

test('union president portrait is marked as a protected asset in homepage markup', () => {
  const image = html.match(/<img[^>]*union-president-photo[^>]*>/)?.[0] || '';
  assert.match(image, /src="assets\/union-president\.png"/);
  assert.match(image, /data-protected-asset="union-president"/);
});

test('portrait guard restores protected marker class and source even after rerenders', () => {
  assert.match(script, /const PORTRAIT_SELECTOR='\.union-president-message img,\[data-protected-asset="union-president"\],\.union-president-photo'/);
  assert.match(script, /image\.setAttribute\('data-protected-asset','union-president'\)/);
  assert.match(script, /image\.classList\.add\('union-president-photo'\)/);
  assert.match(script, /image\.setAttribute\('src',PORTRAIT_SRC\)/);
});

test('portrait guard observes source and class mutations in addition to language and child changes', () => {
  assert.match(script, /attributeFilter:\['lang','src','class','data-protected-asset'\]/);
  assert.match(script, /subtree:true/);
  assert.match(script, /childList:true/);
  assert.match(script, /attributes:true/);
});
