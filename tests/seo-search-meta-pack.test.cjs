const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');

const ROOT=path.join(__dirname,'..');
const read=p=>fs.readFileSync(path.join(ROOT,p),'utf8');
const KEYWORDS=['دورات مجانية','كورسات أونلاين','منصات تعليمية','تعلم البرمجة','الذكاء الاصطناعي','تحليل البيانات','الأمن السيبراني','free online courses','online learning platforms','ücretsiz kurslar','eğitim platformları'];

function assertSearchMeta(html,label){
  assert.match(html,/meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1"/,label+' robots');
  assert.match(html,/meta name="keywords" content="[^"]+"/,label+' keywords');
  assert.match(html,/meta property="og:site_name" content="دنيا الدورات \| Dunya Al-Dawrat \| Kurslar Dünyası"/,label+' og:site_name');
  assert.match(html,/meta name="twitter:title" content="[^"]+"/,label+' twitter:title');
  assert.match(html,/meta name="twitter:description" content="[^"]+"/,label+' twitter:description');
  assert.match(html,/meta name="twitter:image" content="https:\/\/devmyskilla\.vercel\.app\/assets\/dunya-logo-hero-v3\.webp"/,label+' twitter:image');
}

test('homepage ships a complete multilingual search metadata pack',()=>{
  const html=read('index.html');
  assertSearchMeta(html,'home');
  const keywordMeta=(html.match(/meta name="keywords" content="([^"]+)"/)||[])[1]||'';
  for(const keyword of KEYWORDS) assert.ok(keywordMeta.includes(keyword),`home keywords missing ${keyword}`);
  assert.match(html,/meta name="description" content="[^"]*دورات[^"]*البرمجة[^"]*الذكاء الاصطناعي[^"]*"/);
});

test('explore page ships indexable search and social metadata',()=>{
  assertSearchMeta(read('explore.html'),'explore');
});

test('all static platform pages have platform-specific keywords and full social metadata',()=>{
  const routes=require(path.join(ROOT,'js','seo-routes.js'));
  for(const [id,slug] of Object.entries(routes.PLATFORM_SLUGS)){
    const html=read(`platforms/${slug}/index.html`);
    assertSearchMeta(html,id);
    assert.match(html,/meta name="keywords" content="[^"]+"/);
  }
});

test('all static category pages have category-specific keywords and full social metadata',()=>{
  const discovery=require(path.join(ROOT,'js','explore-discovery.js'));
  for(const area of discovery.areas){
    const html=read(`categories/${area.id}/index.html`);
    assertSearchMeta(html,area.id);
    const keywords=(html.match(/meta name="keywords" content="([^"]+)"/)||[])[1]||'';
    assert.ok(keywords.includes(area.label.ar),`${area.id} Arabic keyword`);
    assert.ok(keywords.includes(area.label.en),`${area.id} English keyword`);
    assert.ok(keywords.includes(area.label.tr),`${area.id} Turkish keyword`);
  }
});

test('CMS runtime descriptions remain descriptive in Arabic English and Turkish',()=>{
  const data=JSON.parse(read('data.json'));
  for(const lang of ['ar','en','tr']){
    assert.ok(data.seo.home[lang].description.length>=80,`home ${lang} description too short`);
    assert.ok(data.seo.explore[lang].description.length>=70,`explore ${lang} description too short`);
  }
});

test('platform runtime SEO prefers the platform description over the generic template',()=>{
  const runtime=read('js/site-runtime.js');
  assert.match(runtime,/model&&model\.description/);
  assert.match(runtime,/ogDescription/);
});
