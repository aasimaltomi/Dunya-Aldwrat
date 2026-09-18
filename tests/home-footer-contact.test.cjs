const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.join(__dirname, '..');
const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
const data = JSON.parse(fs.readFileSync(path.join(ROOT, 'data.json'), 'utf8'));
const css = fs.readFileSync(path.join(ROOT, 'css', 'style.css'), 'utf8');

test('homepage footer exposes a localized contact-us label', () => {
  assert.deepEqual(data.siteText.footer.contactUs, {
    ar: 'اتصل بنا',
    en: 'Contact Us',
    tr: 'Bize Ulaşın'
  });
  const footer = html.match(/<footer class="site-footer">[\s\S]*?<\/footer>/)?.[0] || '';
  assert.match(footer, /class="footer-contact"/);
  assert.match(footer, /data-i18n="contactUs"/);
});

test('contact-us label is styled as a distinct footer item', () => {
  assert.match(css, /\.footer-contact\{/);
});
