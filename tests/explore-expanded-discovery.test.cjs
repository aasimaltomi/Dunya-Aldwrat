const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.join(__dirname, '..');
const discoveryPath = path.join(ROOT, 'js', 'explore-discovery.js');
const discoveryCssPath = path.join(ROOT, 'css', 'explore-discovery.css');

test('Explore ships a dedicated twelve-area discovery layer', () => {
  assert.ok(fs.existsSync(discoveryPath), 'expected js/explore-discovery.js to exist');

  const ExploreDiscovery = require(discoveryPath);
  const expectedIds = [
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
  ];

  assert.deepEqual(ExploreDiscovery.areas.map(area => area.id), expectedIds);
  for (const area of ExploreDiscovery.areas) {
    for (const lang of ['ar', 'en', 'tr']) {
      assert.equal(typeof area.label[lang], 'string');
      assert.ok(area.label[lang].trim().length > 0);
      assert.equal(typeof area.examples[lang], 'string');
      assert.ok(area.examples[lang].trim().length > 0);
    }
    assert.ok(Array.isArray(area.terms) && area.terms.length > 0);
  }
});

test('Explore discovery matching uses detailed platform fields and returns real counts', () => {
  assert.ok(fs.existsSync(discoveryPath), 'expected js/explore-discovery.js to exist');
  const ExploreDiscovery = require(discoveryPath);

  const platforms = [
    {
      id: 'ai-platform',
      name: { ar: 'منصة', en: 'Platform', tr: 'Platform' },
      description: { ar: '', en: '', tr: '' },
      editorial: {},
      fields: [{ name: { ar: 'الذكاء الاصطناعي', en: 'Artificial Intelligence', tr: 'Yapay Zeka' } }]
    },
    {
      id: 'health-platform',
      name: { ar: 'منصة', en: 'Platform', tr: 'Platform' },
      description: { ar: '', en: '', tr: '' },
      editorial: {},
      fields: [{ name: { ar: 'الصحة والطب', en: 'Health and Medicine', tr: 'Sağlık ve Tıp' } }]
    }
  ];

  assert.deepEqual(
    ExploreDiscovery.filterPlatforms(platforms, 'artificial-intelligence').map(platform => platform.id),
    ['ai-platform']
  );
  assert.equal(ExploreDiscovery.countPlatforms(platforms, 'health-medicine'), 1);
});

test('Explore renders the discovery layer as a broad responsive four-column overview', () => {
  const nav = fs.readFileSync(path.join(ROOT, 'js', 'explore-nav.js'), 'utf8');
  assert.ok(fs.existsSync(discoveryPath), 'expected js/explore-discovery.js to exist');
  assert.ok(fs.existsSync(discoveryCssPath), 'expected css/explore-discovery.css to exist');
  const discovery = fs.readFileSync(discoveryPath, 'utf8');
  const css = fs.readFileSync(discoveryCssPath, 'utf8');

  assert.match(nav, /js\/explore-discovery\.js/);
  assert.match(nav, /css\/explore-discovery\.css/);
  assert.match(discovery, /data-discovery=/);
  assert.match(discovery, /activeDiscoveryArea/);
  assert.match(discovery, /renderCategories/);
  assert.match(css, /\.category-grid\{display:grid;grid-template-columns:repeat\(4,1fr\)/);
  assert.match(css, /\.category-card \.category-examples/);
  assert.match(css, /@media\(max-width:900px\)[\s\S]*\.category-grid\{grid-template-columns:repeat\(2,1fr\)/);
  assert.match(css, /@media\(max-width:620px\)[\s\S]*\.category-grid\{grid-template-columns:1fr\}/);
});
