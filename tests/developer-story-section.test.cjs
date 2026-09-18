const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.join(__dirname, '..');
const read = file => fs.readFileSync(path.join(ROOT, file), 'utf8');

test('developer section keeps stable translated story and quote markup', () => {
  const html = read('index.html');
  assert.ok(html.includes('home-proof-section'));
  assert.ok(html.includes('developer-section-head'));
  assert.ok(html.includes('developer-story-stack'));
  assert.ok(html.includes('developer-story-card'));
  assert.ok(html.includes('developer-quote-card'));
  assert.ok(html.includes('developer-avatar-placeholder'));
  assert.ok(html.includes('data-i18n="developerStoryPrefix"'));
  assert.ok(html.includes('data-i18n="developerStorySuffix"'));
  assert.ok(html.includes('data-i18n="developerQuote"'));
  assert.ok(html.includes('data-i18n="developerRole"'));
  assert.ok(html.includes('data-setting="developerName"'));
  assert.ok(html.includes('css/developer-story.css'));
});

test('founder spotlight uses approved education visual and real portrait without changing stable markup', () => {
  const css = read('css/developer-story.css');
  assert.ok(css.includes('../assets/founder-education-visual.webp'));
  assert.ok(css.includes('../assets/aasim-mohammed-altomi.webp'));
  assert.ok(css.includes('.developer-story-card .developer-mark>span{display:none}'));
  assert.ok(css.includes('.developer-avatar-placeholder>span{display:none}'));
});

test('first card keeps the academic-officer wording while engineer abbreviations stay localized', () => {
  const copy = read('js/home-copy-overrides.js');
  const css = read('css/developer-story.css');
  assert.ok(copy.includes("developerStoryPrefix:'طوّرت اللجنة الأكاديمية في اتحاد شباب الأمة، ممثلة بالمسؤول الأكاديمي '"));
  assert.ok(copy.includes("developerStoryPrefix:'The Academic Committee of Ummah Youth Union, represented by Academic Officer '"));
  assert.ok(copy.includes("developerStoryPrefix:'Ümmet Gençleri Birliği Akademik Komitesi, Akademik Sorumlu '"));
  assert.ok(!css.includes('.developer-story-card [data-i18n="developerStoryPrefix"]{font-size:0}'));
  assert.ok(css.includes('content:"م. "'));
  assert.ok(css.includes('content:"Eng. "'));
  assert.ok(css.includes('content:"Müh. "'));
});

test('second quote card shows the engineer-prefixed name without a role subtitle', () => {
  const css = read('css/developer-story.css');
  assert.ok(css.includes('.developer-quote-author span{display:none}'));
  assert.ok(!css.includes('content:"رئيس اللجنة الأكاديمية"'));
  assert.ok(!css.includes('content:"Academic Committee Chair"'));
  assert.ok(!css.includes('content:"Akademik Komite Başkanı"'));
  assert.ok(css.includes('html[lang="ar"] .developer-quote-author strong[data-setting="developerName"]::before{content:"م. "}'));
  assert.ok(css.includes('html[lang="en"] .developer-quote-author strong[data-setting="developerName"]::before{content:"Eng. "}'));
  assert.ok(css.includes('html[lang="tr"] .developer-quote-author strong[data-setting="developerName"]::before{content:"Müh. "}'));
});

test('founder spotlight has a dark indigo stage, luminous story card, overlapping quote, responsive layout, and dark support', () => {
  const css = read('css/developer-story.css');
  assert.ok(css.includes('.home-proof-section{position:relative;overflow:hidden'));
  assert.ok(css.includes('background:linear-gradient(135deg,#071542'));
  assert.ok(css.includes('.home-proof-section::before'));
  assert.ok(css.includes('.developer-story-stack{position:relative'));
  assert.ok(css.includes('.developer-story-card{position:relative'));
  assert.ok(css.includes('background:linear-gradient(135deg,#ffffff,#eef2ff)'));
  assert.ok(css.includes('.developer-quote-card{position:relative'));
  assert.ok(css.includes('transform:translateY(-'));
  assert.ok(css.includes('html[data-theme="dark"]'));
  assert.ok(css.includes('@media(max-width:760px)'));
});

test('developer name uses a blue-violet gradient pill instead of the previous yellow marker', () => {
  const css = read('css/developer-story.css');
  assert.ok(css.includes('.developer-story-card p strong[data-setting="developerName"]'));
  assert.ok(css.includes('background:linear-gradient(135deg,#5b5cf6,#7c3aed)'));
  assert.ok(css.includes('border-radius:999px'));
  assert.ok(!css.includes('#fde047'));
});

test('union president message appears after the developer cards with a valid portrait and localized copy', () => {
  const html = read('index.html');
  const presidentCopy = read('js/union-president-message.js');
  const css = read('css/developer-story.css');

  const quoteCardIndex = html.indexOf('developer-quote-card');
  const presidentIndex = html.indexOf('union-president-message');
  assert.ok(presidentIndex > quoteCardIndex, 'president message must appear after developer cards');
  assert.ok(html.includes('union-president-photo'));
  assert.ok(presidentCopy.includes("const PORTRAIT_SRC='assets/union-president.png'"));
  assert.ok(html.includes('data-i18n="unionPresidentTitle"'));
  assert.ok(html.includes('data-i18n="unionPresidentMessage"'));
  assert.ok(html.includes('data-i18n="unionPresidentSignature"'));
  assert.ok(html.includes('js/union-president-message.js'));

  const portraitPath = path.join(ROOT, 'assets', 'union-president.png');
  assert.ok(fs.existsSync(portraitPath), 'president portrait asset must exist');
  const portrait = fs.readFileSync(portraitPath);
  assert.ok(portrait.length > 3000, 'president portrait must contain a real image payload');
  assert.equal(portrait.subarray(1, 4).toString('ascii'), 'PNG');
  assert.equal(portrait.subarray(12, 16).toString('ascii'), 'IHDR');

  assert.ok(presidentCopy.includes("unionPresidentTitle:'كلمة رئيس الاتحاد'"));
  assert.ok(presidentCopy.includes("unionPresidentSignature:'م. بشار محمد الزريقي\\nرئيس اتحاد شباب الأمة'"));
  assert.ok(presidentCopy.includes("unionPresidentTitle:'Message from the Union President'"));
  assert.ok(presidentCopy.includes("unionPresidentSignature:'Eng. Bashar Mohammed Al-Zuraiqi\\nPresident of Ummah Youth Union'"));
  assert.ok(presidentCopy.includes("unionPresidentTitle:'Birlik Başkanının Mesajı'"));
  assert.ok(presidentCopy.includes("unionPresidentSignature:'Müh. Bashar Mohammed Al-Zuraiqi\\nÜmmet Gençleri Birliği Başkanı'"));

  assert.ok(css.includes('.union-president-message{'));
  assert.ok(css.includes('.union-president-photo{'));
  assert.ok(css.includes('html[data-theme="dark"] .union-president-message'));
  assert.ok(css.includes('@media(max-width:760px)'));
});
