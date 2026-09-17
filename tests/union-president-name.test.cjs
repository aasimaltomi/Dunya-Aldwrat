const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.join(__dirname, '..');
const read = file => fs.readFileSync(path.join(ROOT, file), 'utf8');

test('union president signature shows the president name above the role', () => {
  const copy = read('js/union-president-message.js');

  assert.ok(copy.includes("unionPresidentSignature:'م. بشار محمد الزريقي\\nرئيس اتحاد شباب الأمة'"));
  assert.ok(copy.includes("unionPresidentSignature:'Eng. Bashar Mohammed Al-Zuraiqi\\nPresident of Ummah Youth Union'"));
  assert.ok(copy.includes("unionPresidentSignature:'Müh. Bashar Mohammed Al-Zuraiqi\\nÜmmet Gençleri Birliği Başkanı'"));
  assert.ok(copy.includes("if(key==='unionPresidentSignature')"));
  assert.ok(copy.includes("el.style.whiteSpace='pre-line'"));
});
