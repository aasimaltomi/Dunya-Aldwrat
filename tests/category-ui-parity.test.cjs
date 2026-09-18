const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.join(__dirname, '..');
const app = fs.readFileSync(path.join(ROOT, 'js', 'app.js'), 'utf8');
const landing = fs.readFileSync(path.join(ROOT, 'js', 'landing.js'), 'utf8');

test('all category surfaces use the complete active category group list without arbitrary limits', () => {
  assert.match(app, /function exploreCategoryGroups\(\)\{return PlatformDirectory\.getCategoryGroups\(allPlatforms\)\}/);
  assert.doesNotMatch(app, /getCategoryGroups\(allPlatforms\)\.slice\(/);
  assert.doesNotMatch(landing, /getCategoryGroups\(platforms\)\.slice\(/);
  assert.doesNotMatch(landing, /groups\.slice\(/);
});

test('category dropdown uses the same ordered category groups as cards and search chips', () => {
  assert.match(app, /const categoryIds=exploreCategoryGroups\(\)\.map\(group=>group\.categoryId\)/);
  assert.match(app, /populateSelect\(els\.filterCategory,categoryIds,id=>categoryFilterLabel\(id\)\)/);
  assert.match(app, /function categoryFilterLabel\(id\)/);
  assert.match(app, /row&&row\.icon/);
  assert.match(app, /content\.categoryLabel\(id\)/);
});

test('homepage search chips expose every active platform category from the same group source', () => {
  assert.match(landing, /const groups=categoryGroups\(data,platforms\)/);
  assert.match(landing, /chips\.innerHTML=groups\.map\(/);
});
