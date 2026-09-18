const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.join(__dirname, '..');
const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
const data = JSON.parse(fs.readFileSync(path.join(ROOT, 'data.json'), 'utf8'));
const css = fs.readFileSync(path.join(ROOT, 'css', 'landing.css'), 'utf8');

test('homepage ends with a localized contact section before the footer', () => {
  const section = html.match(/<section class="landing-contact"[\s\S]*?<\/section>/)?.[0] || '';
  assert.match(section, /id="contact"/);
  assert.match(section, /data-i18n="landingContactTitle"/);
  assert.match(section, /data-i18n="landingContactText"/);
  assert.match(section, /href="mailto:aasimaltomi123@gmail\.com"/);
  assert.match(section, />aasimaltomi123@gmail\.com</);
  assert.match(section, /data-i18n="landingContactCta"/);

  const footerIndex = html.indexOf('<footer class="site-footer">');
  const contactIndex = html.indexOf('id="contact"');
  assert.ok(contactIndex > -1 && contactIndex < footerIndex);
});

test('footer contact item jumps to the homepage contact section', () => {
  const footer = html.match(/<footer class="site-footer">[\s\S]*?<\/footer>/)?.[0] || '';
  assert.match(footer, /class="footer-contact"/);
  assert.match(footer, /href="#contact"/);
  assert.match(footer, /data-i18n="contactUs"/);
});

test('contact section copy exists in Arabic English and Turkish', () => {
  assert.deepEqual(data.siteText.home.landingContactTitle, {
    ar: 'اتصل بنا',
    en: 'Contact Us',
    tr: 'Bize Ulaşın'
  });
  assert.deepEqual(data.siteText.home.landingContactText, {
    ar: 'نسعد باستفساراتكم واقتراحاتكم وملاحظاتكم حول المنصات التعليمية وفرص التعاون.',
    en: 'We welcome your questions, suggestions, feedback about learning platforms, and collaboration opportunities.',
    tr: 'Eğitim platformlarıyla ilgili sorularınızı, önerilerinizi, geri bildirimlerinizi ve iş birliği fırsatlarını memnuniyetle karşılıyoruz.'
  });
  assert.deepEqual(data.siteText.home.landingContactCta, {
    ar: 'إرسال بريد إلكتروني',
    en: 'Send an Email',
    tr: 'E-posta Gönder'
  });
});

test('homepage contact section has dedicated responsive styling', () => {
  assert.match(css, /\.landing-contact\{/);
  assert.match(css, /\.contact-card\{/);
  assert.match(css, /\.contact-email\{/);
});
