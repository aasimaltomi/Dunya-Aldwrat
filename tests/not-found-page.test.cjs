const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.join(__dirname, '..');
const read = file => fs.readFileSync(path.join(ROOT, file), 'utf8');

test('custom 404 page exists and preserves the Dunya Al-Dawrat identity', () => {
  const html = read('404.html');
  assert.match(html, /<meta name="robots" content="noindex,follow">/);
  assert.match(html, /href="favicon\.svg\?v=20260917"/);
  assert.match(html, /class="brand-logo"[^>]*data-asset="brandLogo"/);
  assert.match(html, /<main[^>]*class="not-found-page"/);
  assert.match(html, /<strong class="not-found-code">404<\/strong>/);
});

test('404 page provides localized recovery actions', () => {
  const html = read('404.html');
  assert.match(html, /id="langSwitcher"/);
  assert.match(html, /id="themeToggle"/);
  assert.match(html, /data-i18n="notFoundTitle"/);
  assert.match(html, /data-i18n="notFoundMessage"/);
  assert.match(html, /href="index\.html"[^>]*data-i18n="notFoundHome"/);
  assert.match(html, /href="explore\.html"[^>]*data-i18n="notFoundExplore"/);

  const data = JSON.parse(read('data.json'));
  assert.deepEqual(data.siteText.notFound.notFoundTitle, {
    ar: 'الصفحة غير موجودة',
    en: 'Page not found',
    tr: 'Sayfa bulunamadı'
  });
  assert.deepEqual(data.siteText.notFound.notFoundHome, {
    ar: 'العودة للرئيسية',
    en: 'Back to home',
    tr: 'Ana sayfaya dön'
  });
  assert.deepEqual(data.siteText.notFound.notFoundExplore, {
    ar: 'استكشف المنصات',
    en: 'Explore platforms',
    tr: 'Platformları keşfet'
  });
});

test('404 runtime restores saved language and theme using the shared site data', () => {
  const script = read('js/404.js');
  assert.match(script, /DataLoader\.loadSiteData\(\)/);
  assert.match(script, /initContent\(data\)/);
  assert.match(script, /setLang\(/);
  assert.match(script, /SiteRuntime\.applyContentBindings\(document,content\)/);
  assert.match(script, /dunya-theme-v2/);
});

test('404 page has dedicated responsive styling', () => {
  const html = read('404.html');
  const css = read('css/404.css');
  assert.match(html, /href="css\/404\.css"/);
  assert.match(css, /\.not-found-page\{/);
  assert.match(css, /@media\s*\(max-width:/);
});
