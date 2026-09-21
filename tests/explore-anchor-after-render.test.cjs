const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');

const source=fs.readFileSync(path.join(__dirname,'..','js','app.js'),'utf8');

test('Explore deep links re-anchor after dynamic content renders',()=>{
  assert.match(source,/function focusInitialExploreResults\(params\)/);
  assert.match(source,/hash===['"]#explore['"]/);
  assert.match(source,/requestAnimationFrame\(\(\)=>requestAnimationFrame\(focus\)\)/);
  assert.match(source,/setTimeout\(focus,120\)/);
  assert.match(source,/focusInitialExploreResults\(params\)/);
});
