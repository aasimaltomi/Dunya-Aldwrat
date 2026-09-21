const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');

const ROOT=path.resolve(__dirname,'..');
const Landing=require(path.join(ROOT,'js','landing.js'));

test('homepage category tags always route to Explore results instead of error pages',()=>{
  assert.equal(
    Landing.categoryExploreUrl('explore.html#featured','ar','programming_data'),
    'explore.html?category=programming_data&lang=ar#explore'
  );
  assert.equal(
    Landing.categoryExploreUrl('explore.html?source=home#featured','tr','business_marketing'),
    'explore.html?source=home&category=business_marketing&lang=tr#explore'
  );

  const source=fs.readFileSync(path.join(ROOT,'js','landing.js'),'utf8');
  assert.match(source,/link\.href=discoveryAreaExploreUrl\(path,currentLang,area\)/);
  assert.doesNotMatch(source,/link\.href=SeoRoutes\.categoryUrl\(area\.id,currentLang\)/);
});

test('homepage exposes Find your best platform and opens the existing four-question finder',()=>{
  const html=fs.readFileSync(path.join(ROOT,'index.html'),'utf8');
  const app=fs.readFileSync(path.join(ROOT,'js','app.js'),'utf8');
  const data=JSON.parse(fs.readFileSync(path.join(ROOT,'data.json'),'utf8'));

  assert.match(html,/id="heroPlatformFinder"/);
  assert.match(html,/data-i18n="quizTitle"/);
  assert.equal(Landing.platformFinderUrl('explore.html','en'),'explore.html?finder=1&lang=en#explore');
  assert.match(app,/params\.get\('finder'\)===['"]1['"]/);
  assert.equal(data.quiz.questions.length,4);
  assert.deepEqual(data.quiz.questions.map(question=>question.id),['category','language','free','certificate']);
  assert.equal(data.siteText.quiz.quizTitle.ar,'اكتشف منصتك المناسبة');
  assert.equal(data.siteText.quiz.quizTitle.en,'Find your best platform');
  assert.equal(data.siteText.quiz.quizTitle.tr,'Size uygun platformu bulun');
});
