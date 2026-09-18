const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');

const ROOT=path.join(__dirname,'..');
const BASE='https://devmyskilla.vercel.app';
const data=JSON.parse(fs.readFileSync(path.join(ROOT,'data.json'),'utf8'));

test('stable SEO route map exists for all 40 platforms',()=>{
  const routes=require(path.join(ROOT,'js','seo-routes.js'));
  assert.equal(typeof routes.platformUrl,'function');
  assert.equal(Object.keys(routes.PLATFORM_SLUGS).length,40);
  const slugs=Object.values(routes.PLATFORM_SLUGS);
  assert.equal(new Set(slugs).size,40,'platform slugs must be unique');
  for(const platform of data.platforms){
    const slug=routes.PLATFORM_SLUGS[platform.id];
    assert.ok(slug,`missing slug for ${platform.id}`);
    assert.match(slug,/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
  }
});

test('every platform has a static crawlable page with unique canonical metadata',()=>{
  const routes=require(path.join(ROOT,'js','seo-routes.js'));
  for(const platform of data.platforms){
    const slug=routes.PLATFORM_SLUGS[platform.id];
    const file=path.join(ROOT,'platforms',slug,'index.html');
    assert.equal(fs.existsSync(file),true,`missing ${file}`);
    const html=fs.readFileSync(file,'utf8');
    const canonical=`${BASE}/platforms/${slug}/`;
    assert.ok(html.includes(`rel="canonical" href="${canonical}"`),`${platform.id} canonical`);
    assert.ok(html.includes(`property="og:url" content="${canonical}"`),`${platform.id} og:url`);
    assert.ok(html.includes(`data-platform-id="${platform.id}"`),`${platform.id} data id`);
    assert.match(html,/<h1[^>]*>[^<]+<\/h1>/,`${platform.id} static h1`);
    assert.doesNotMatch(html,/name="robots" content="noindex/i);
  }
});

test('legacy query detail page remains usable but is excluded from indexing',()=>{
  const html=fs.readFileSync(path.join(ROOT,'platform.html'),'utf8');
  assert.match(html,/name="robots" content="noindex,follow"/);
});

test('all twelve discovery categories have crawlable static pages',()=>{
  const discovery=require(path.join(ROOT,'js','explore-discovery.js'));
  assert.equal(discovery.areas.length,12);
  for(const area of discovery.areas){
    const file=path.join(ROOT,'categories',area.id,'index.html');
    assert.equal(fs.existsSync(file),true,`missing category ${area.id}`);
    const html=fs.readFileSync(file,'utf8');
    const canonical=`${BASE}/categories/${area.id}/`;
    assert.ok(html.includes(`rel="canonical" href="${canonical}"`));
    assert.ok(html.includes(`property="og:url" content="${canonical}"`));
    assert.match(html,/<h1[^>]*>[^<]+<\/h1>/);
    assert.match(html,/href="\.\.\/\.\.\/platforms\//,'category page must link to static platform pages');
  }
});

test('internal platform cards use stable static platform URLs',()=>{
  const routes=fs.readFileSync(path.join(ROOT,'js','seo-routes.js'),'utf8');
  const app=fs.readFileSync(path.join(ROOT,'js','app.js'),'utf8');
  const landing=fs.readFileSync(path.join(ROOT,'js','landing.js'),'utf8');
  const detail=fs.readFileSync(path.join(ROOT,'js','platform-detail.js'),'utf8');
  assert.match(routes,/function platformUrl\(/);
  assert.match(app,/SeoRoutes\.platformUrl\(/);
  assert.match(landing,/SeoRoutes\.platformUrl\(/);
  assert.match(detail,/SeoRoutes\.platformUrl\(/);
});

test('platform detail runtime accepts a static-page platform id and preserves its canonical path',()=>{
  const detail=fs.readFileSync(path.join(ROOT,'js','platform-detail.js'),'utf8');
  const runtime=fs.readFileSync(path.join(ROOT,'js','site-runtime.js'),'utf8');
  assert.match(detail,/document\.body\.dataset\.platformId/);
  assert.match(runtime,/\/platforms\//);
  assert.doesNotMatch(runtime,/url\.searchParams\.set\('id'/);
});

test('sitemap lists static platform and category pages instead of query-string platform URLs',()=>{
  const routes=require(path.join(ROOT,'js','seo-routes.js'));
  const discovery=require(path.join(ROOT,'js','explore-discovery.js'));
  const sitemap=fs.readFileSync(path.join(ROOT,'sitemap.xml'),'utf8');
  assert.doesNotMatch(sitemap,/platform\.html\?id=/);
  for(const slug of Object.values(routes.PLATFORM_SLUGS)){
    assert.ok(sitemap.includes(`<loc>${BASE}/platforms/${slug}/</loc>`),slug);
  }
  for(const area of discovery.areas){
    assert.ok(sitemap.includes(`<loc>${BASE}/categories/${area.id}/</loc>`),area.id);
  }
});
