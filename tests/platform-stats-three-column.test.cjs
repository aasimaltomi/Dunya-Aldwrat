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

test('Explore stats strip contains exactly five public stats', () => {
  const strip = html.match(/<section class="stats-strip[\s\S]*?<\/section>/)?.[0] || '';
  assert.match(strip, /id="statPlatforms"/);
  assert.match(strip, /id="statCourses"/);
  assert.match(strip, /id="statFreeCourses"/);
  assert.match(strip, /id="statCert"/);
  assert.match(strip, /id="statLang"/);
  assert.equal((strip.match(/<strong id="stat/g) || []).length, 5);
});

test('Explore certificate stat counts free certificates locally without changing shared stats semantics', () => {
  assert.match(app, /freeCertificates=allPlatforms\.filter\(p=>p\.freeCertificate===true\)\.length/);
  assert.match(app, /\$\('statCert'\)\.textContent=freeCertificates/);
});

test('Explore stats copy includes course totals, free courses, certificates, and languages', () => {
  assert.deepEqual(data.siteText.common.platformCount,{ar:'منصة نشطة',en:'Active platforms',tr:'Aktif platform'});
  assert.deepEqual(data.siteText.common.courseCount,{ar:'دورة متاحة',en:'Available courses',tr:'Mevcut kurs'});
  assert.deepEqual(data.siteText.common.freeCourseCount,{ar:'دورة مجانية',en:'Free courses',tr:'Ücretsiz kurs'});
  assert.deepEqual(data.siteText.common.certCount,{ar:'منصة بشهادات مجانية',en:'Platforms with free certificates',tr:'Ücretsiz sertifikalı platform'});
  assert.deepEqual(data.siteText.accessibility.languageCount,{ar:'لغة متاحة',en:'Languages',tr:'Dil'});
});

test('Explore stats render course totals and languages with plus signs', () => {
  assert.match(app, /statCourses'\)\.textContent=`\$\{format\(s\.courses\)\}\+`/);
  assert.match(app, /statFreeCourses'\)\.textContent=`\$\{format\(s\.freeCourses\)\}\+`/);
  assert.match(app, /statLang'\)\.textContent=.*s\.languages/);
  assert.match(app, /textContent=`\+\$\{s\.languages\}`/);
});

test('Explore stats use a five-column premium strip and responsive mobile layout', () => {
  assert.match(css, /\/\* Five-column platform stats \*\//);
  assert.match(css, /\.stats-grid\{[^}]*grid-template-columns:repeat\(5,1fr\)/);
  assert.match(css, /\.stats-grid>div\{[^}]*min-height:90px/);
  assert.match(css, /\.stats-grid strong\{[^}]*font-size:30px/);
  assert.match(css, /@media\(max-width:680px\)\{[^}]*\.stats-grid\{[^}]*grid-template-columns:1fr/);
});
