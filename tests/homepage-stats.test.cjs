const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const Landing = require('../js/landing.js');

test('homepage stats expose the approved three metrics in all site languages', () => {
  assert.deepEqual(Landing.homeStats('ar'), [
    { id: 'active', value: '38', label: 'منصة نشطة' },
    { id: 'freeCertificates', value: '36', label: 'منصة بشهادات مجانية' },
    { id: 'languages', value: '4+', label: 'لغة متاحة' },
  ]);

  assert.deepEqual(Landing.homeStats('en'), [
    { id: 'active', value: '38', label: 'active platforms' },
    { id: 'freeCertificates', value: '36', label: 'platforms with free certificates' },
    { id: 'languages', value: '4+', label: 'languages available' },
  ]);

  assert.deepEqual(Landing.homeStats('tr'), [
    { id: 'active', value: '38', label: 'aktif platform' },
    { id: 'freeCertificates', value: '36', label: 'ücretsiz sertifika sunan platform' },
    { id: 'languages', value: '4+', label: 'mevcut dil' },
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
