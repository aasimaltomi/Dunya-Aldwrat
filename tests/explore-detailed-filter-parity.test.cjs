const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.join(__dirname, '..');
const discoveryPath = path.join(ROOT, 'js', 'explore-discovery.js');
const discovery = fs.readFileSync(discoveryPath, 'utf8');
const ExploreDiscovery = require(discoveryPath);

test('detailed discovery exposes the same twelve ids used by the visible category cards', () => {
  assert.equal(ExploreDiscovery.areas.length, 12);
  assert.deepEqual(ExploreDiscovery.areas.map(area => area.id), [
    'programming-web',
    'artificial-intelligence',
    'data-analytics',
    'cybersecurity-it',
    'cloud-devops',
    'business-entrepreneurship',
    'digital-marketing',
    'design-creativity',
    'education-academics',
    'languages-communication',
    'health-medicine',
    'professional-leadership'
  ]);
});

test('category dropdown is populated from the twelve detailed discovery areas', () => {
  assert.match(discovery, /hydrateFilterOptions=function\(\)/);
  assert.match(discovery, /populateSelect\(els\.filterCategory,areas\.map\(area=>area\.id\),id=>discoveryFilterLabel\(id\)\)/);
  assert.match(discovery, /function discoveryFilterLabel\(id\)/);
  assert.match(discovery, /area\.icon/);
  assert.match(discovery, /content\.localize\(area\.label\)/);
});

test('detailed dropdown values do not get misapplied as broad category ids', () => {
  assert.match(discovery, /currentState=function\(\)/);
  assert.match(discovery, /if\(areaById\(state\.category\)\)state\.category=''/);
});

test('dropdown, hero chips, and cards stay synchronized on the same discovery id', () => {
  assert.match(discovery, /renderQuickFilters=function\(\)/);
  assert.match(discovery, /data-discovery-filter=/);
  assert.match(discovery, /els\.filterCategory\.value=activeDiscoveryArea/);
  assert.match(discovery, /els\.filterCategory\.addEventListener\('change'/);
  assert.match(discovery, /activeDiscoveryArea=areaById\(next\)\?next:''/);
});

test('legacy broad category deep links remain supported without appearing in the dropdown', () => {
  assert.match(discovery, /option\.hidden=true/);
  assert.match(discovery, /PlatformDirectory\.getFilterOptions\(allPlatforms\)\.categories/);
});
