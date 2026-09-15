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

test('explore hides verification controls and verification status from cards and comparisons', () => {
  const explore = read('explore.html');
  const app = read('js/app.js');

  assert.doesNotMatch(explore, /data-i18n="filterVerification"/);
  assert.doesNotMatch(explore, /data-i18n="sortVerified"/);
  assert.doesNotMatch(app, /verificationBadge/);
  assert.doesNotMatch(app, /getText\('verification'\)/);
  assert.doesNotMatch(app, /getText\('lastVerified'\)/);
});

test('platform profile keeps verification data internal but does not render verification status', () => {
  const detail = read('js/platform-detail.js');

  assert.match(detail, /lastVerified:platform\.lastVerified/);
  assert.doesNotMatch(detail, /verificationBadge/);
  assert.doesNotMatch(detail, /fact\(getText\('verification'\)/);
  assert.doesNotMatch(detail, /fact\(getText\('lastVerified'\)/);
});

test('homepage uses the approved copy in Arabic, English, and Turkish', () => {
  const landing = read('js/landing.js');

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
  ]) assert.match(landing, new RegExp(text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
});
