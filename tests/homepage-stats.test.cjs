const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const Landing = require('../js/landing.js');
const data = require('../data.json');

test('homepage stats expose five metrics in all site languages', () => {
  const active=String(data.platforms.length);
  const courseRows=data.platforms.filter(p=>p.officialCountType==='courses'&&typeof p.officialCount==='number'&&Number.isFinite(p.officialCount));
  const courses=new Intl.NumberFormat('en-US').format(courseRows.reduce((sum,p)=>sum+p.officialCount,0))+'+';
  const freeCourses=new Intl.NumberFormat('en-US').format(courseRows.filter(p=>p.pricingModel==='free').reduce((sum,p)=>sum+p.officialCount,0))+'+';
  const freeCertificates=String(data.platforms.filter(p=>p.freeCertificate===true).length);
  const languages=new Set(data.platforms.flatMap(p=>p.languageIds||[])).size+'+';

  assert.deepEqual(Landing.homeStats(data.platforms,'ar'), [
    { id: 'active', value: active, label: 'منصة نشطة' },
    { id: 'courses', value: courses, label: 'دورة متاحة' },
    { id: 'freeCourses', value: freeCourses, label: 'دورة مجانية' },
    { id: 'freeCertificates', value: freeCertificates, label: 'منصة بشهادات مجانية' },
    { id: 'languages', value: languages, label: 'لغة متاحة' },
  ]);

  assert.deepEqual(Landing.homeStats(data.platforms,'en'), [
    { id: 'active', value: active, label: 'active platforms' },
    { id: 'courses', value: courses, label: 'available courses' },
    { id: 'freeCourses', value: freeCourses, label: 'free courses' },
    { id: 'freeCertificates', value: freeCertificates, label: 'platforms with free certificates' },
    { id: 'languages', value: languages, label: 'languages available' },
  ]);

  assert.deepEqual(Landing.homeStats(data.platforms,'tr'), [
    { id: 'active', value: active, label: 'aktif platform' },
    { id: 'courses', value: courses, label: 'mevcut kurs' },
    { id: 'freeCourses', value: freeCourses, label: 'ücretsiz kurs' },
    { id: 'freeCertificates', value: freeCertificates, label: 'ücretsiz sertifika sunan platform' },
    { id: 'languages', value: languages, label: 'mevcut dil' },
  ]);
});

test('homepage stats strip renders exactly five metric slots', () => {
  const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
  const section = html.match(/<section class="landing-stats"[\s\S]*?<\/section>/)?.[0] || '';

  assert.match(section, /id="landingStatActive"/);
  assert.match(section, /id="landingStatCourses"/);
  assert.match(section, /id="landingStatFreeCourses"/);
  assert.match(section, /id="landingStatFreeCertificates"/);
  assert.match(section, /id="landingStatLang"/);
  assert.equal((section.match(/<strong id="landingStat/g) || []).length, 5);
});
