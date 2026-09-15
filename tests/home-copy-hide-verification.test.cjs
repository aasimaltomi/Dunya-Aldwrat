const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.join(__dirname, '..');
const read = file => fs.readFileSync(path.join(ROOT, file), 'utf8');

test('public helpers remove the trust copy from home and explore', () => {
  const homeCopy = read('js/home-copy-overrides.js');
  const verification = read('js/verification-ui-cleanup.js');

  assert.match(homeCopy, /\.hero-trust/);
  assert.match(homeCopy, /remove\(\)/);
  assert.match(verification, /\.trust-line/);
  assert.match(verification, /remove\(\)/);
});

test('explore hides verification controls while retaining the internal filter hook', () => {
  const verification = read('js/verification-ui-cleanup.js');
  const app = read('js/app.js');

  assert.match(app, /filterVerification:\$\('filterVerification'\)/);
  assert.match(verification, /#filterVerification/);
  assert.match(verification, /closest\('\.filter-group'\)/);
  assert.match(verification, /group\.hidden=true/);
  assert.match(verification, /option\[value="recently_verified"\]/);
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

test('design runtime loads presentation helpers only on relevant pages', () => {
  const runtime = read('js/design-runtime.js');

  assert.match(runtime, /js\/home-copy-overrides\.js/);
  assert.match(runtime, /js\/verification-ui-cleanup\.js/);
  assert.match(runtime, /home-light-shell/);
  assert.match(runtime, /explore\.html/);
  assert.match(runtime, /platform\.html/);
});
