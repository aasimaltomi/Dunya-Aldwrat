const test=require('node:test');
const assert=require('node:assert/strict');
const data=require('../data.json');
const publicPlatforms=data.platforms.filter(p=>/^plat-(?:[1-9]|[1-3][0-9]|40)$/.test(p.id));
const byId=id=>publicPlatforms.find(p=>p.id===id);
const field=(platform,id)=>platform.fields.find(f=>f.id===id);

test('all public approved categories have absolute HTTPS URLs',()=>{
  const fields=publicPlatforms.flatMap(p=>p.fields||[]);
  assert.equal(fields.length,363,'approved public category total');
  for(const item of fields)assert.match(item.officialUrl||'',/^https:\/\//);
});

test('NVIDIA categories point to self-paced course filters rather than learning paths or workshops',()=>{
  for(const item of byId('plat-13').fields){
    assert.match(item.officialUrl,/nvidia\.com\/en-us\/training\/self-paced-courses\//);
    assert.doesNotMatch(item.officialUrl,/learning-path|instructor-led/i);
  }
});

test('Sololearn categories use the closest verified official destination',()=>{
  const exact={
    'programming-foundations':'https://www.sololearn.com/en/learn/courses/coding-foundations',
    'data-analytics':'https://www.sololearn.com/en/learn/courses/data-programming',
    'web-app-development':'https://www.sololearn.com/en/learn/courses/web-development',
    'advanced-programming-frameworks':'https://www.sololearn.com/en/learn/courses/python-developer',
    'ai-generative-technologies':'https://ai.sololearn.com/en/learn'
  };
  for(const [id,url] of Object.entries(exact))assert.equal(field(byId('plat-17'),id).officialUrl,url);
});

test('Agora topic cards use current UNICEF topic destinations instead of brittle keyword-search URLs',()=>{
  const expected={
    'focus-areas':'https://agora.unicef.org/local/search/index.php?expanded=coursetopic_is-3&facets=coursetopic_is-3',
    'strategies':'https://agora.unicef.org/local/search/index.php?expanded=coursetopic_is-4&facets=coursetopic_is-4',
    'leading-managing':'https://agora.unicef.org/local/search/index.php?expanded=coursetopic_is-8&facets=coursetopic_is-27',
    'operational-support':'https://agora.unicef.org/local/search/index.php?expanded=coursetopic_is-6&facets=coursetopic_is-6',
    'communication-languages':'https://agora.unicef.org/mod/page/view.php?id=36648&lang=en',
    'career-support':'https://agora.unicef.org/local/search/index.php?expanded=coursetopic_is-8&facets=coursetopic_is-25'
  };
  for(const [id,url] of Object.entries(expected))assert.equal(field(byId('plat-2'),id).officialUrl,url);
  for(const item of byId('plat-2').fields)assert.doesNotMatch(item.officialUrl,/local\/catalogue\/index\.php\?query=/);
});

test('Edraak uses exact official category filters where verified',()=>{
  const exact={'career-readiness':'career-readiness',technology:'technology','personal-development':'personal-development','business-entrepreneurship':'business-and-entrepreneurship',languages:'languages'};
  for(const [id,slug] of Object.entries(exact))assert.equal(field(byId('plat-31'),id).officialUrl,`https://www.edraak.org/explore/?category=${slug}`);
});
