const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const source = fs.readFileSync(path.join(__dirname, '..', 'js', 'home-copy-overrides.js'), 'utf8');

const expected = [
  "problemManyText:'كل منصة تقدم مجالات وتجارب مختلفة، لذلك قد يكون من الصعب معرفة أين تبدأ.'",
  "problemPriceText:'تعرّف على ما إذا كانت المنصة توفر محتوى مجانيًا وما الذي قد يتطلب دفعًا.'",
  "problemCertText:'قارن اللغات وخيارات الشهادات المتاحة قبل أن تبدأ.'",
  "problemCompareText:'اجمع أهم المعلومات في مكان واحد بدل التنقل بين عشرات المواقع.'",
  "stepSearch:'ابحث'",
  "stepSearchText:'اكتب اسم منصة أو مجالًا أو مهارة تريد تعلمها.'",
  "stepFilter:'صفِّ النتائج'",
  "stepFilterText:'حدد المجال واللغة والسعر والشهادات التي تهمك.'",
  "stepCompare:'قارن الخيارات'",
  "stepCompareText:'قارن حتى ثلاث منصات جنبًا إلى جنب.'",
  "stepChoose:'راجع التفاصيل'",
  "stepChooseText:'افتح ملف المنصة وتعرّف على محتواها وأهم خصائصها.'",
  "stepOfficial:'ابدأ من المصدر الرسمي'",
  "stepOfficialText:'انتقل مباشرة إلى الموقع الرسمي للمنصة التي اخترتها.'",
  "landingFinalTitle:'جاهز لاختيار منصتك؟'",
  "landingFinalText:'ابدأ بالبحث والمقارنة، ثم انتقل مباشرة إلى المنصة التي تناسب هدفك.'",
  "landingFinalCta:'استكشف منصات التعلّم'",
  "problemManyText:'Each platform offers different subjects and experiences, so knowing where to start can be difficult.'",
  "stepFilter:'Filter results'",
  "stepCompareText:'Compare up to three platforms side by side.'",
  "landingFinalTitle:'Ready to choose your platform?'",
  "problemManyText:'Her platform farklı alanlar ve deneyimler sunar; bu yüzden nereden başlayacağınızı belirlemek zor olabilir.'",
  "stepFilter:'Sonuçları filtrele'",
  "stepCompareText:'En fazla üç platformu yan yana karşılaştırın.'",
  "landingFinalTitle:'Platformunuzu seçmeye hazır mısınız?'"
];

test('homepage copy includes the approved third-round problem, process, and CTA text', () => {
  for (const value of expected) assert.ok(source.includes(value), `Missing approved copy: ${value}`);
});
