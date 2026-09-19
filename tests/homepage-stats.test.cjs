const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const Landing = require('../js/landing.js');
const data = require('../data.json');

test('homepage stats expose the approved three metrics in all site languages', () => {
  const active=String(data.platforms.length);
  const certificates=String(data.platforms.filter(p=>p.certificateAvailable===true).length);
  const freeCertificates=String(data.platforms.filter(p=>p.freeCertificate===true).length);
  const certificateSummary=`${certificates} / ${freeCertificates}`;
  const languages=new Set(data.platforms.flatMap(p=>p.languageIds||[])).size+'+';

  assert.deepEqual(Landing.homeStats(data.platforms,'ar'), [
    { id: 'active', value: active, label: 'منصة نشطة' },
    { id: 'freeCertificates', value: certificateSummary, label: 'منصات بشهادات / مجانية' },
    { id: 'languages', value: languages, label: 'لغة متاحة' },
  ]);

  assert.deepEqual(Landing.homeStats(data.platforms,'en'), [
    { id: 'active', value: active, label: 'active platforms' },
    { id: 'freeCertificates', value: certificateSummary, label: 'platforms with certificates / free' },
    { id: 'languages', value: languages, label: 'languages available' },
  ]);

  assert.deepEqual(Landing.homeStats(data.platforms,'tr'), [
    { id: 'active', value: active, label: 'aktif platform' },
    { id: 'freeCertificates', value: certificateSummary, label: 'sertifika sunan platformlar / ücretsiz' },
    { id: 'languages', value: languages, label: 'mevcut dil' },
  ]);
});

test('homepage stats strip renders exactly three metric slots', () => {
  const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
  const section = html.match(/<section class="landing-stats"[\s\S]*?<\/section>/)?.[0] || '';

  assert.match(section, /id="landingStatActive"/);
  assert.match(section, /id="landingStatFreeCertificates"/);
  assert.match(section, /id="landingStatLang"/);
  assert.doesNotMatch(section, /id="landingStat(?:Platforms|Free|Cert)"/);
  assert.equal((section.match(/<strong id="landingStat/g) || []).length, 3);
});
