const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.join(__dirname, '..');
const read = file => fs.readFileSync(path.join(ROOT, file), 'utf8');
const sw = read('sw.js');

function coreEntries() {
  const match = sw.match(/const CORE = \[([\s\S]*?)\];/);
  assert.ok(match, 'CORE cache list is missing');
  return [...match[1].matchAll(/['"]([^'"]+)['"]/g)].map(row => row[1]);
}

function localShellDependencies(page) {
  const html = read(page);
  const deps = [];
  for (const match of html.matchAll(/<script[^>]+src="([^"]+)"/g)) {
    if (!/^https?:|^\/\//.test(match[1])) deps.push('./' + match[1].replace(/^\.\//, ''));
  }
  for (const match of html.matchAll(/<link[^>]+rel="stylesheet"[^>]+href="([^"]+)"/g)) {
    if (!/^https?:|^\/\//.test(match[1])) deps.push('./' + match[1].replace(/^\.\//, ''));
  }
  return deps;
}

test('offline core cache covers every local CSS/JS dependency of primary app pages', () => {
  const core = new Set(coreEntries());
  const pages = ['index.html', 'explore.html', 'platform.html', 'course.html'];
  const missing = [...new Set(pages.flatMap(localShellDependencies))].filter(asset => !core.has(asset));
  assert.deepEqual(missing, [], `missing primary offline dependencies: ${missing.join(', ')}`);
});

test('offline core includes navigation fallback and key first-party visual assets', () => {
  const core = new Set(coreEntries());
  for (const asset of [
    './offline.html',
    './data.json',
    './manifest.webmanifest',
    './assets/dunya-logo-hero-v3.webp',
    './assets/union-president.webp'
  ]) {
    assert.ok(core.has(asset), `missing core asset ${asset}`);
  }
});

test('404 page remains runtime-cached rather than forced into the offline shell', () => {
  const core = new Set(coreEntries());
  assert.equal(core.has('./404.html'), false);
  assert.equal(core.has('./css/404.css'), false);
  assert.equal(core.has('./js/404.js'), false);
});
