const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const PlatformDirectory = require('../js/platform-directory.js');

const ROOT = path.join(__dirname, '..');
const html = fs.readFileSync(path.join(ROOT, 'explore.html'), 'utf8');
const app = fs.readFileSync(path.join(ROOT, 'js', 'app.js'), 'utf8');
const css = fs.readFileSync(path.join(ROOT, 'css', 'style.css'), 'utf8');
const data = JSON.parse(fs.readFileSync(path.join(ROOT, 'data.json'), 'utf8'));

test('Explore stats strip contains exactly three public stats', () => {
  const strip = html.match(/<section class="stats-strip[\s\S]*?<\/section>/)?.[0] || '';
  assert.match(strip, /id="statPlatforms"/);
  assert.match(strip, /id="statCert"/);
  assert.match(strip, /id="statLang"/);
  assert.doesNotMatch(strip, /id="statFree"/);
  assert.equal((strip.match(/<strong id="stat/g) || []).length, 3);
});

test('Explore certificate stat shows total certificate platforms and the free subset', () => {
  assert.match(app, /freeCertificates=allPlatforms\.filter\(p=>p\.freeCertificate===true\)\.length/);
  assert.match(app, /\$\('statCert'\)\.textContent=`\$\{s\.certificates\} \/ \$\{freeCertificates\}`/);
});

test('Explore stats copy matches active platforms certificate summary and available languages', () => {
  assert.deepEqual(data.siteText.common.platformCount,{ar:'منصة نشطة',en:'Active platforms',tr:'Aktif platform'});
  assert.deepEqual(data.siteText.common.certCount,{ar:'منصات بشهادات / مجانية',en:'Platforms with certificates / free',tr:'Sertifika sunan platformlar / ücretsiz'});
  assert.deepEqual(data.siteText.accessibility.languageCount,{ar:'لغة متاحة',en:'Languages',tr:'Dil'});
});

test('Explore stats render languages with a plus sign', () => {
  assert.match(app, /statLang'\)\.textContent=.*s\.languages/);
  assert.match(app, /textContent=`\+\$\{s\.languages\}`/);
  assert.doesNotMatch(app, /\$\('statFree'\)/);
});

test('Explore stats use a three-column premium strip and responsive mobile layout', () => {
  assert.match(css, /\/\* Three-column platform stats \*\//);
  assert.match(css, /\.stats-grid\{[^}]*grid-template-columns:repeat\(3,1fr\)/);
  assert.match(css, /\.stats-grid>div\{[^}]*min-height:90px/);
  assert.match(css, /\.stats-grid strong\{[^}]*font-size:34px/);
  assert.match(css, /@media\(max-width:680px\)\{[^}]*\.stats-grid\{[^}]*grid-template-columns:1fr/);
});
