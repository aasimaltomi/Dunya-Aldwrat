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

test('visible developer role is chair in Arabic English and Turkish', () => {
  const css = read('css/developer-story.css');
  assert.ok(css.includes('content:"رئيس اللجنة الأكاديمية"'));
  assert.ok(css.includes('content:"Academic Committee Chair"'));
  assert.ok(css.includes('content:"Akademik Komite Başkanı"'));
});

test('founder spotlight removes the academic-officer wording and shows localized engineer abbreviations', () => {
  const css = read('css/developer-story.css');
  assert.ok(css.includes('.developer-story-card [data-i18n="developerStoryPrefix"]{font-size:0}'));
  assert.ok(css.includes('content:"طوّرت اللجنة الأكاديمية في اتحاد شباب الأمة، ممثلة بـ "'));
  assert.ok(css.includes('content:"The Academic Committee of Ummah Youth Union, represented by "'));
  assert.ok(css.includes('content:"Ümmet Gençleri Birliği Akademik Komitesi, "'));
  assert.ok(css.includes('content:"م. "'));
  assert.ok(css.includes('content:"Eng. "'));
  assert.ok(css.includes('content:"Müh. "'));
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
