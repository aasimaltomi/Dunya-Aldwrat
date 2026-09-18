const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.join(__dirname, '..');
const app = fs.readFileSync(path.join(ROOT, 'js', 'app.js'), 'utf8');
const themeCss = fs.readFileSync(path.join(ROOT, 'css', 'platform-card-theme.css'), 'utf8');

function functionBody(source, name, nextName) {
  const start = source.indexOf(`function ${name}`);
  assert.notEqual(start, -1, `missing ${name}`);
  const end = nextName ? source.indexOf(`function ${nextName}`, start + 1) : source.length;
  assert.notEqual(end, -1, `missing ${nextName}`);
  return source.slice(start, end);
}

test('hero search categories and platform category section use one shared category group source', () => {
  assert.match(app, /function exploreCategoryGroups\(\)\{return PlatformDirectory\.getCategoryGroups\(allPlatforms\)\.slice\(0,8\)\}/);

  const categories = functionBody(app, 'renderCategories', 'renderPlatformCloud');
  const quick = functionBody(app, 'renderQuickFilters', 'updateCompareDock');

  assert.match(categories, /const groups=exploreCategoryGroups\(\)/);
  assert.match(quick, /const groups=exploreCategoryGroups\(\)/);
  assert.doesNotMatch(quick, /siteData\.quiz|quickFilters/);
  assert.match(quick, /data-search-category=/);
});

test('hero search category chips select the same category filter used by the platform directory', () => {
  assert.match(app, /closest\('\[data-search-category\]'\)/);
  assert.match(app, /els\.filterCategory\.value=b\.dataset\.searchCategory/);
  assert.match(app, /renderDirectory\(\)/);
});

test('random platform action stays visibly contrasted in light theme', () => {
  assert.match(themeCss, /html:not\(\[data-theme="dark"\]\) \.random-premium-trigger\{/);
  assert.match(themeCss, /html:not\(\[data-theme="dark"\]\) \.random-premium-trigger\{[^}]*background:linear-gradient\(/);
  assert.match(themeCss, /html:not\(\[data-theme="dark"\]\) \.random-premium-trigger[^}]*color:#fff/);
  assert.match(themeCss, /html:not\(\[data-theme="dark"\]\) \.random-premium-trigger \.path-premium-copy strong\{[^}]*color:#fff/);
});
