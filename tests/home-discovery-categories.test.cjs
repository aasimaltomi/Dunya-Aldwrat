const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');

const root=path.join(__dirname,'..');
const Landing=require(path.join(root,'js','landing.js'));

function samplePlatforms(){
  return [
    {id:'p1',categoryId:'programming_data',name:{ar:'منصة برمجة',en:'Programming Hub',tr:'Programlama'},description:{ar:'برمجة وذكاء اصطناعي',en:'Programming and AI',tr:'Programlama ve yapay zeka'},languageIds:['English'],pricingModel:'free'},
    {id:'p2',categoryId:'programming_data',name:{ar:'منصة بيانات',en:'Data Academy',tr:'Veri Akademisi'},description:{ar:'تحليل البيانات',en:'Data analytics',tr:'Veri analitiği'},languageIds:['English'],pricingModel:'free'},
    {id:'p3',categoryId:'business_marketing',name:{ar:'ريادة',en:'Business School',tr:'İşletme'},description:{ar:'أعمال وريادة أعمال',en:'Business and entrepreneurship',tr:'İşletme ve girişimcilik'},languageIds:['English'],pricingModel:'free'},
    {id:'p4',categoryId:'education',name:{ar:'تصميم',en:'Design School',tr:'Tasarım'},description:{ar:'تصميم وإبداع',en:'Design and creativity',tr:'Tasarım ve yaratıcılık'},languageIds:['English'],pricingModel:'free'},
    {id:'p5',categoryId:'education',name:{ar:'جامعة',en:'University Learning',tr:'Üniversite'},description:{ar:'تعليم ومهارات أكاديمية',en:'Education and academic skills',tr:'Eğitim ve akademik beceriler'},languageIds:['English'],pricingModel:'free'},
    {id:'p6',categoryId:'languages',name:{ar:'لغات',en:'Language Learning',tr:'Dil'},description:{ar:'لغات وتواصل',en:'Languages and communication',tr:'Dil ve iletişim'},languageIds:['English'],pricingModel:'free'}
  ];
}

test('homepage exposes the six approved discovery areas with localized labels and examples',()=>{
  assert.equal(typeof Landing.discoveryAreas,'function');
  if(typeof Landing.discoveryAreas!=='function')return;
  const areas=Landing.discoveryAreas(samplePlatforms(),'ar');
  assert.deepEqual(areas.map(area=>area.id),[
    'programming_ai',
    'data_analytics',
    'business_entrepreneurship',
    'design_creative',
    'education_academic',
    'languages_communication'
  ]);
  assert.deepEqual(areas.map(area=>area.label),[
    'البرمجة والذكاء الاصطناعي',
    'البيانات والتحليلات',
    'الأعمال وريادة الأعمال',
    'التصميم والإبداع',
    'التعليم والمهارات الأكاديمية',
    'اللغات والتواصل'
  ]);
  assert.ok(areas.every(area=>area.examples&&area.countLabel));
});

test('discovery section copy uses the approved wording in all three site languages',()=>{
  assert.equal(typeof Landing.discoverySectionCopy,'function');
  if(typeof Landing.discoverySectionCopy!=='function')return;
  assert.deepEqual(Landing.discoverySectionCopy('ar'),{
    eyebrow:'استكشف حسب المجال',
    title:'اختر مجالك وابدأ التعلّم',
    subtitle:'استكشف أفضل المنصات والدورات حسب المجال الذي يهمك.'
  });
  assert.ok(Landing.discoverySectionCopy('en').title);
  assert.ok(Landing.discoverySectionCopy('tr').title);
});

test('each discovery card produces a direct pre-filtered explore link',()=>{
  assert.equal(typeof Landing.discoveryAreas,'function');
  assert.equal(typeof Landing.discoveryAreaExploreUrl,'function');
  if(typeof Landing.discoveryAreas!=='function'||typeof Landing.discoveryAreaExploreUrl!=='function')return;
  const areas=Landing.discoveryAreas(samplePlatforms(),'ar');
  const programming=areas.find(area=>area.id==='programming_ai');
  const data=areas.find(area=>area.id==='data_analytics');
  const design=areas.find(area=>area.id==='design_creative');
  assert.equal(Landing.discoveryAreaExploreUrl('explore.html','ar',programming),'explore.html?category=programming_data&lang=ar#explore');
  assert.equal(Landing.discoveryAreaExploreUrl('explore.html','ar',data),'explore.html?category=programming_data&q=data&lang=ar#explore');
  assert.equal(Landing.discoveryAreaExploreUrl('explore.html','ar',design),'explore.html?q=design&lang=ar#explore');
});

test('homepage discovery grid is a balanced three-by-two layout with richer card metadata',()=>{
  const css=fs.readFileSync(path.join(root,'css','landing.css'),'utf8');
  assert.match(css,/\.home-category-grid\s*\{[^}]*grid-template-columns\s*:\s*repeat\(3\s*,\s*(?:minmax\(0\s*,\s*)?1fr\)?\)/s);
  assert.match(css,/\.discovery-area-examples/);
  assert.match(css,/\.discovery-area-count/);
});
