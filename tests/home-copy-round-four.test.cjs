const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.join(__dirname, '..');
const read = file => fs.readFileSync(path.join(ROOT, file), 'utf8');

test('homepage fourth copy round is present in all three languages', () => {
  const copy = read('js/home-copy-overrides.js');
  const expected = [
    'اختر المجال الذي تريد تعلّمه، واكتشف المنصات التي توفر محتوى فيه.',
    'مجموعة منصات مختارة لتسهيل الاستكشاف، دون ترتيب أو تفضيل بينها.',
    'استخدم البحث والفلاتر والمقارنة للوصول إلى المنصة الأنسب لاحتياجك.',
    'نظرة سريعة على دليل دنيا الدورات',
    'دليل عملي لاكتشاف ومقارنة منصات التعلّم',
    'اللجنة الأكاديمية في اتحاد شباب الأمة',
    'ممثلة بالمسؤول الأكاديمي عاصم محمد التومي',
    'Choose what you want to learn and discover platforms that offer content in that field.',
    'A selection of platforms to make discovery easier, without ranking or favoring them.',
    'Use search, filters, and comparison to find the platform that best fits your needs.',
    'A quick look at the Dunya Al-Dawrat directory',
    'A practical guide to discovering and comparing learning platforms',
    'Academic Committee of Ummah Youth Union',
    'represented by Academic Officer Aasim Mohammed Altomi',
    'Öğrenmek istediğiniz alanı seçin ve bu alanda içerik sunan platformları keşfedin.',
    'Keşfi kolaylaştırmak için seçilmiş platformlar; aralarında sıralama veya üstünlük yoktur.',
    'İhtiyacınıza en uygun platforma ulaşmak için arama, filtreler ve karşılaştırmayı kullanın.',
    'Dunya Al-Dawrat rehberine hızlı bir bakış',
    'Öğrenme platformlarını keşfetmek ve karşılaştırmak için pratik bir rehber',
    'Ümmet Gençleri Birliği Akademik Komitesi',
    'Akademik Sorumlu Aasim Mohammed Altomi temsilinde'
  ];
  expected.forEach(text => assert.ok(copy.includes(text), `missing copy: ${text}`));
});

test('homepage runtime overrides public project and developer settings', () => {
  const copy = read('js/home-copy-overrides.js');
  assert.ok(copy.includes("siteName:'Dunya Al-Dawrat'"));
  assert.ok(copy.includes("developerName:'عاصم محمد التومي'"));
  assert.ok(copy.includes("developerName:'Aasim Mohammed Altomi'"));
  assert.ok(copy.includes('data-setting'));
});
