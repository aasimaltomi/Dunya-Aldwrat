const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const Landing = require('../js/landing.js');

const ROOT = path.join(__dirname, '..');
const data = JSON.parse(fs.readFileSync(path.join(ROOT, 'data.json'), 'utf8'));
const index = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
const platforms = data.platforms;

test('homepage stats are calculated from current platform data', () => {
  const courseRows=platforms.filter(p=>p.officialCountType==='courses'&&typeof p.officialCount==='number'&&Number.isFinite(p.officialCount));
  const format=n=>new Intl.NumberFormat('en-US').format(n)+'+';
  assert.deepEqual(Landing.homeStats(platforms,'ar'), [
    { id:'active', value:String(platforms.length), label:'منصة نشطة' },
    { id:'courses', value:format(courseRows.reduce((sum,p)=>sum+p.officialCount,0)), label:'دورة متاحة' },
    { id:'freeCourses', value:format(courseRows.filter(p=>p.pricingModel==='free').reduce((sum,p)=>sum+p.officialCount,0)), label:'دورة مجانية' },
    { id:'freeCertificates', value:String(platforms.filter(p=>p.freeCertificate===true).length), label:'منصة بشهادات مجانية' },
    { id:'languages', value:new Set(platforms.flatMap(p=>p.languageIds||[])).size + '+', label:'لغة متاحة' }
  ]);
});

test('homepage stats localize labels while preserving calculated values', () => {
  const ar=Landing.homeStats(platforms,'ar');
  const en=Landing.homeStats(platforms,'en');
  const tr=Landing.homeStats(platforms,'tr');
  assert.deepEqual(en.map(x=>x.value),ar.map(x=>x.value));
  assert.deepEqual(tr.map(x=>x.value),ar.map(x=>x.value));
  assert.deepEqual(en.map(x=>x.label),['active platforms','available courses','free courses','platforms with free certificates','languages available']);
  assert.deepEqual(tr.map(x=>x.label),['aktif platform','mevcut kurs','ücretsiz kurs','ücretsiz sertifika sunan platform','mevcut dil']);
});

test('homepage static fallback matches the current calculated stats', () => {
  const stats=Landing.homeStats(platforms,'ar');
  assert.match(index,new RegExp('id="landingStatActive">'+stats[0].value+'<'));
  assert.match(index,new RegExp('id="landingStatCourses">'+stats[1].value.replace('+','\\+')+'<'));
  assert.match(index,new RegExp('id="landingStatFreeCourses">'+stats[2].value.replace('+','\\+')+'<'));
  assert.match(index,new RegExp('id="landingStatFreeCertificates">'+stats[3].value+'<'));
  assert.match(index,new RegExp('id="landingStatLang">'+stats[4].value.replace('+','\\+')+'<'));
});

test('legacy homepage hardcoded values are removed from landing runtime', () => {
  const source=fs.readFileSync(path.join(ROOT,'js','landing.js'),'utf8');
  assert.doesNotMatch(source,/value:'38'/);
  assert.doesNotMatch(source,/value:'36'/);
});
