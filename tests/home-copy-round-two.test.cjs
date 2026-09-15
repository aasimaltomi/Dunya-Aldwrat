const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const source = fs.readFileSync(path.join(__dirname, '..', 'js', 'home-copy-overrides.js'), 'utf8');

test('approved homepage explanatory copy is present in Arabic, English, and Turkish', () => {
  const required = [
    'دليلك لاكتشاف ومقارنة منصات التعلّم في مكان واحد',
    'نحن لا نبيع الدورات ولا نصدر شهادات؛ مهمتنا أن نساعدك على الوصول إلى المنصة المناسبة.',
    'لماذا أنشأنا دنيا الدورات؟',
    'لأن اختيار منصة التعلّم المناسبة لا يجب أن يكون معقدًا',
    'كيف تعمل دنيا الدورات؟',
    'من هدفك إلى المنصة المناسبة بخطوات بسيطة',
    'خيارات كثيرة، ونقطة البداية غير واضحة',
    'ما الذي يمكنك تعلّمه مجانًا؟',
    'هل توفر المنصة اللغة والشهادة التي تحتاجها؟',
    'لا حاجة لفتح عشرات المواقع للمقارنة',
    'Your guide to discovering and comparing learning platforms in one place',
    'Choosing the right learning platform should not be complicated',
    'How does Dunya Al-Dawrat work?',
    'Öğrenme platformlarını tek yerde keşfetme ve karşılaştırma rehberiniz',
    'Doğru öğrenme platformunu seçmek karmaşık olmamalı',
    'Dunya Al-Dawrat nasıl çalışır?'
  ];

  for (const text of required) assert.ok(source.includes(text), `missing approved copy: ${text}`);
});
