const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const PlatformDirectory = require('../js/platform-directory.js');

const ROOT = path.join(__dirname, '..');
const data = JSON.parse(fs.readFileSync(path.join(ROOT, 'data.json'), 'utf8'));
const css = fs.readFileSync(path.join(ROOT, 'css', 'style.css'), 'utf8');

test('certificate-only filter means free certificates, not merely certificate availability', () => {
  const sample = [
    {id:'free-cert',name:{ar:'أ',en:'A',tr:'A'},categoryId:'education',languageIds:['English'],pricingModel:'free',hasFreeContent:true,certificateAvailable:true,freeCertificate:true,featured:false,displayOrder:1},
    {id:'paid-cert',name:{ar:'ب',en:'B',tr:'B'},categoryId:'education',languageIds:['English'],pricingModel:'free',hasFreeContent:true,certificateAvailable:true,freeCertificate:false,featured:false,displayOrder:2},
    {id:'no-cert',name:{ar:'ج',en:'C',tr:'C'},categoryId:'education',languageIds:['English'],pricingModel:'free',hasFreeContent:true,certificateAvailable:false,freeCertificate:false,featured:false,displayOrder:3}
  ];
  assert.deepEqual(
    PlatformDirectory.getVisiblePlatforms(sample,{certificateOnly:true,sort:'recommended'}).map(p=>p.id),
    ['free-cert']
  );
});

test('free-certificate filter copy is localized in Arabic English and Turkish', () => {
  assert.deepEqual(data.siteText.explore.withCertificate,{
    ar:'يقدم شهادات مجانية',
    en:'Offers free certificates',
    tr:'Ücretsiz sertifika sunar'
  });
  assert.deepEqual(data.siteText.explore.chipCertificate,{
    ar:'شهادات مجانية',
    en:'Free certificates',
    tr:'Ücretsiz sertifikalar'
  });
  const quick=(data.quiz?.quickFilters||[]).find(row=>row.id==='certificate');
  assert.deepEqual(quick?.label,{
    ar:'شهادات مجانية',
    en:'Free certificates',
    tr:'Ücretsiz sertifikalar'
  });
});

test('Explore search is promoted as a larger primary control without enlarging filters', () => {
  assert.match(css, /\/\* Prominent Explore search \*\//);
  assert.match(css, /\.search-shell\{[^}]*height:78px/);
  assert.match(css, /\.search-shell\{[^}]*border-radius:22px/);
  assert.match(css, /\.search-shell input\{[^}]*font-size:18px/);
  assert.match(css, /\.search-shell \.search-icon\{[^}]*font-size:32px/);
  assert.match(css, /@media\(max-width:640px\)\{[^}]*\.search-shell\{[^}]*height:68px/);
  const pass=(css.split('/* Prominent Explore search */')[1]||'');
  assert.equal(pass.includes('.filter-group select'),false);
  assert.equal(pass.includes('.controls-panel'),false);
});
