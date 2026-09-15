const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.join(__dirname, '..');
const read = file => fs.readFileSync(path.join(ROOT, file), 'utf8');

test('home and explore no longer render the verification trust line', () => {
  const home = read('index.html');
  const explore = read('explore.html');

  assert.doesNotMatch(home, /data-i18n="trustCopy"/);
  assert.doesNotMatch(explore, /data-i18n="trustCopy"/);
});

test('explore removes user-visible verification controls while retaining the internal filter hook', () => {
  const explore = read('explore.html');

  assert.doesNotMatch(explore, /data-i18n="filterVerification"/);
  assert.doesNotMatch(explore, /data-i18n="sortVerified"/);
  assert.match(explore, /<select id="filterVerification" hidden aria-hidden="true" tabindex="-1"><\/select>/);
});

test('verification cleanup removes badges and verification facts from rendered UI only', () => {
  const cleanup = read('js/verification-ui-cleanup.js');
  const detail = read('js/platform-detail.js');

  assert.match(detail, /lastVerified:platform\.lastVerified/);
  assert.match(cleanup, /\.verification-badge/);
  assert.match(cleanup, /getText\('verification'\)/);
  assert.match(cleanup, /getText\('lastVerified'\)/);
  assert.match(cleanup, /\.profile-fact/);
  assert.match(cleanup, /\.compare-table tr/);
});

test('homepage uses the approved copy in Arabic, English, and Turkish', () => {
  const copy = read('js/home-copy-overrides.js');

  for (const text of [
    'ابحث. قارن. واختر منصة التعلّم الأنسب لك.',
    'Find. Compare. Choose the learning platform that fits you.',
    'Ara. Karşılaştır. Sana en uygun öğrenme platformunu seç.',
    'اكتشف منصات التعلّم في مكان واحد، وقارن بينها حسب المجال واللغة والسعر والشهادات، ثم انتقل مباشرة إلى المصدر الرسمي.',
    'Discover learning platforms in one place, compare them by field, language, pricing, and certificates, then continue directly to the official source.',
    'Öğrenme platformlarını tek yerde keşfet; alan, dil, fiyat ve sertifikalara göre karşılaştır ve doğrudan resmi kaynağa ulaş.',
    'ابحث عن منصة، مجال، مهارة أو موضوع...',
    'Search for a platform, field, skill, or topic...',
    'Platform, alan, beceri veya konu ara...',
    'استكشف منصات التعلّم',
    'Explore learning platforms',
    'Öğrenme platformlarını keşfet',
    'ماذا تريد أن تتعلّم؟',
    'What do you want to learn?',
    'Ne öğrenmek istiyorsun?',
    'منصات تستحق الاستكشاف',
    'Platforms worth exploring',
    'Keşfetmeye değer platformlar',
    'قارن منصات التعلّم واكتشف ما يناسبك',
    'Compare learning platforms and find your match',
    'Öğrenme platformlarını karşılaştır, sana uygun olanı bul'
  ]) assert.match(copy, new RegExp(text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
});

test('the presentation helpers are loaded on the pages that need them', () => {
  const home = read('index.html');
  const explore = read('explore.html');
  const platform = read('platform.html');

  assert.match(home, /js\/home-copy-overrides\.js/);
  assert.match(explore, /js\/verification-ui-cleanup\.js/);
  assert.match(platform, /js\/verification-ui-cleanup\.js/);
});
