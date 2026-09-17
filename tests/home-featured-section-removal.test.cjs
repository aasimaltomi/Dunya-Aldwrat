const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');

const indexHtml=fs.readFileSync(path.join(__dirname,'..','index.html'),'utf8');

test('homepage does not render the featured exploration platform section',()=>{
  assert.doesNotMatch(indexHtml,/id=["']featuredCourses["']/);
  assert.doesNotMatch(indexHtml,/id=["']homeFeaturedGrid["']/);
});
