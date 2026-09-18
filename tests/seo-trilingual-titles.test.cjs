const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');

const ROOT=path.join(__dirname,'..');
const BRAND='دنيا الدورات | Dunya Al-Dawrat | Kurslar Dünyası';

test('homepage exposes a trilingual page title',()=>{
  const html=fs.readFileSync(path.join(ROOT,'index.html'),'utf8');
  assert.ok(html.includes(`<title>${BRAND}</title>`));
  assert.ok(html.includes(`property="og:title" content="${BRAND}"`));
});

test('CMS SEO keeps the trilingual brand title across supported languages',()=>{
  const data=JSON.parse(fs.readFileSync(path.join(ROOT,'data.json'),'utf8'));
  for(const lang of ['ar','en','tr']){
    assert.equal(data.seo.home[lang].title,BRAND);
    assert.equal(data.seo.home[lang].ogTitle,BRAND);
    assert.match(data.seo.explore[lang].title,/Explore Learning Platforms/);
    assert.match(data.seo.explore[lang].title,/Öğrenme Platformlarını Keşfet/);
    assert.match(data.seo.platform[lang].title,/\{platform\}/);
    assert.match(data.seo.platform[lang].title,/Dunya Al-Dawrat/);
    assert.match(data.seo.platform[lang].title,/Kurslar Dünyası/);
  }
});

test('static platform pages use the platform name plus the trilingual brand',()=>{
  const routes=require(path.join(ROOT,'js','seo-routes.js'));
  for(const slug of Object.values(routes.PLATFORM_SLUGS)){
    const html=fs.readFileSync(path.join(ROOT,'platforms',slug,'index.html'),'utf8');
    assert.match(html,/<title>[^<]+ \| دنيا الدورات \| Dunya Al-Dawrat \| Kurslar Dünyası<\/title>/);
    assert.match(html,/property="og:title" content="[^"]+ \| دنيا الدورات \| Dunya Al-Dawrat \| Kurslar Dünyası"/);
  }
});

test('static category pages expose Arabic English and Turkish in the title',()=>{
  const discovery=require(path.join(ROOT,'js','explore-discovery.js'));
  for(const area of discovery.areas){
    const html=fs.readFileSync(path.join(ROOT,'categories',area.id,'index.html'),'utf8');
    const ar=area.label.ar;
    const en=area.label.en;
    const tr=area.label.tr;
    const title=`${ar} | ${en} | ${tr}`.replace(/&/g,'&amp;');
    assert.ok(html.includes(`<title>${title}</title>`),area.id);
    assert.ok(html.includes(`property="og:title" content="${title}"`),area.id);
  }
});
