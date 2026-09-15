const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.join(__dirname, '..');
const read = file => fs.readFileSync(path.join(ROOT, file), 'utf8');

test('developer section uses the approved founder spotlight structure', () => {
  const html = read('index.html');
  assert.ok(html.includes('developer-spotlight-shell'));
  assert.ok(html.includes('developer-impact-card'));
  assert.ok(html.includes('developer-impact-visual'));
  assert.ok(html.includes('developer-impact-copy'));
  assert.ok(html.includes('developer-founder-pill'));
  assert.ok(html.includes('developer-quote-card'));
  assert.ok(html.includes('developer-avatar-placeholder'));
  assert.ok(html.includes('data-i18n="developerStoryPrefix"'));
  assert.ok(html.includes('data-i18n="developerStorySuffix"'));
  assert.ok(html.includes('data-i18n="developerQuote"'));
  assert.ok(html.includes('data-i18n="developerRole"'));
  assert.ok(html.includes('data-setting="developerName"'));
  assert.ok(html.includes('css/developer-story.css'));
});

test('developer section copy is present in Arabic English and Turkish', () => {
  const copy = read('js/home-copy-overrides.js');
  const expected = [
    "landingDeveloperTitle:'اللجنة الأكاديمية في اتحاد شباب الأمة'",
    "developerStoryPrefix:'طوّرت اللجنة الأكاديمية في اتحاد شباب الأمة، ممثلة بالمسؤول الأكاديمي '",
    "developerStorySuffix:'، مشروع دنيا الدورات لخدمة الطلاب والشباب وتسهيل اكتشاف منصات التعلّم ومقارنتها والوصول إلى مصادرها الرسمية بصورة عملية وواضحة.'",
    "developerQuote:'أنشأتُ دنيا الدورات لأنني رأيت حجم التشتت الذي يواجهه الطالب بين عشرات المنصات. أردتُ أن أجمع له أهم المعلومات في مكان واحد، حتى يصل إلى فرصة التعلّم الأنسب له بقرار أوضح وخطوات أبسط.'",
    "developerRole:'المسؤول الأكاديمي'",
    "landingDeveloperTitle:'Academic Committee of Ummah Youth Union'",
    "developerStoryPrefix:'The Academic Committee of Ummah Youth Union, represented by Academic Officer '",
    "developerStorySuffix:', developed Dunya Al-Dawrat to serve students and young people by making it easier to discover and compare learning platforms and reach their official sources in a practical and clear way.'",
    "developerQuote:'I created Dunya Al-Dawrat after seeing how easily students can get lost among dozens of learning platforms. I wanted to bring the most important information into one place so they can reach the learning opportunity that fits them with a clearer decision and simpler steps.'",
    "developerRole:'Academic Officer'",
    "landingDeveloperTitle:'Ümmet Gençleri Birliği Akademik Komitesi'",
    "developerStoryPrefix:'Ümmet Gençleri Birliği Akademik Komitesi, Akademik Sorumlu '",
    "developerStorySuffix:' temsilinde, öğrencilerin ve gençlerin öğrenme platformlarını keşfetmesini, karşılaştırmasını ve resmi kaynaklarına pratik ve açık biçimde ulaşmasını kolaylaştırmak amacıyla Dunya Al-Dawrat’ı geliştirdi.'",
    "developerQuote:'Dunya Al-Dawrat’ı, öğrencilerin onlarca öğrenme platformu arasında ne kadar kolay kaybolabildiğini gördüğüm için oluşturdum. En önemli bilgileri tek yerde toplayarak öğrencilerin kendilerine uygun öğrenme fırsatına daha net bir kararla ve daha basit adımlarla ulaşmasını istedim.'",
    "developerRole:'Akademik Sorumlu'"
  ];
  expected.forEach(text => assert.ok(copy.includes(text), `missing copy: ${text}`));
});

test('founder spotlight has premium gradient, overlapping quote card, responsive layout, and dark support', () => {
  const css = read('css/developer-story.css');
  assert.ok(css.includes('.developer-spotlight-shell'));
  assert.ok(css.includes('.developer-impact-card'));
  assert.ok(css.includes('.developer-impact-visual'));
  assert.ok(css.includes('.developer-founder-pill'));
  assert.ok(css.includes('.developer-quote-card'));
  assert.ok(css.includes('linear-gradient(135deg'));
  assert.ok(css.includes('translateY('));
  assert.ok(css.includes('html[data-theme="dark"]'));
  assert.ok(css.includes('@media(max-width:760px)'));
});

test('developer name uses a blue-violet gradient pill instead of the previous yellow marker', () => {
  const css = read('css/developer-story.css');
  assert.ok(css.includes('.developer-founder-pill'));
  assert.ok(css.includes('linear-gradient(135deg,#5b5cf6,#7c3aed)'));
  assert.ok(!css.includes('#fde047'));
});
