const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');

const ids=[
  'artificial-intelligence','business-entrepreneurship','cloud-devops','cybersecurity-it',
  'data-analytics','design-creativity','digital-marketing','education-academics',
  'health-medicine','languages-communication','professional-leadership','programming-web'
];

test('all static category pages opt into automatic language runtime',()=>{
  for(const id of ids){
    const html=fs.readFileSync(`categories/${id}/index.html`,'utf8');
    assert.match(html,new RegExp(`<body data-category-id="${id}">`),id);
    assert.match(html,/js\/i18n\.js/,id);
    assert.match(html,/js\/category-page\.js/,id);
  }
});

test('category runtime uses browser-aware language resolver and preserves manual selection',()=>{
  const source=fs.readFileSync('js/category-page.js','utf8');
  assert.match(source,/resolveInitialLanguage\(params\.get\('lang'\)/);
  assert.match(source,/\{persist:false\}/);
  assert.match(source,/setLang\(event\.target\.value\)/);
  assert.match(source,/url\.searchParams\.set\('lang',currentLang\)/);
});

test('category runtime localizes category and platform content from shared data',()=>{
  const source=fs.readFileSync('js/category-page.js','utf8');
  assert.match(source,/ExploreDiscovery\.areaById/);
  assert.match(source,/ExploreDiscovery\.filterPlatforms/);
  assert.match(source,/content\.platformName/);
  assert.match(source,/content\.platformDescription/);
  assert.match(source,/SeoRoutes\.platformUrl/);
});
