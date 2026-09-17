const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.join(__dirname, '..');
const read = file => fs.readFileSync(path.join(ROOT, file), 'utf8');

test('union president signature shows the president name above the role', () => {
  const html = read('index.html');
  const copy = read('js/union-president-message.js');
  const css = read('css/developer-story.css');

  assert.ok(html.includes('data-i18n="unionPresidentName"'));
  assert.ok(html.includes('union-president-signature-text'));
  assert.ok(copy.includes("unionPresidentName:'م. بشار محمد الزريقي'"));
  assert.ok(copy.includes("unionPresidentSignature:'رئيس اتحاد شباب الأمة'"));
  assert.ok(css.includes('.union-president-signature-text{'));
});
