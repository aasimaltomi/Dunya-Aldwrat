const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');

const html=fs.readFileSync(path.join(__dirname,'..','index.html'),'utf8');

test('homepage Platforms links land on the Explore results section, not Featured',()=>{
  const navExplore=[...html.matchAll(/<a[^>]+data-i18n="navExplore"[^>]*>/g)].map(match=>match[0]);
  assert.ok(navExplore.length>=2);
  for(const link of navExplore){
    assert.match(link,/href="explore\.html#explore"/);
    assert.doesNotMatch(link,/#featured/);
  }

  assert.match(html,/class="btn btn-primary header-cta"[^>]+href="explore\.html#explore"/);
  assert.match(html,/data-i18n="landingFinalCta"[^>]*href="explore\.html#explore"|href="explore\.html#explore"[^>]*data-i18n="landingFinalCta"/);
});

test('Featured remains the only homepage navigation item targeting Featured',()=>{
  const featured=[...html.matchAll(/<a[^>]+data-i18n="navFeatured"[^>]*>/g)].map(match=>match[0]);
  assert.equal(featured.length,1);
  assert.match(featured[0],/href="explore\.html#featured"/);
});
