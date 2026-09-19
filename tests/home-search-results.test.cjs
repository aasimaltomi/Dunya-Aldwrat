const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');

const landing=fs.readFileSync('js/landing.js','utf8');
const app=fs.readFileSync('js/app.js','utf8');

test('home search sends the query to Explore results',()=>{
  assert.match(landing,/target\.searchParams\.set\('q',query\)/);
  assert.match(landing,/target\.hash='explore'/);
});

test('Explore hydrates the q parameter into both search inputs before first results render',()=>{
  assert.match(app,/function applyInitialSearch\(params\)/);
  assert.match(app,/params\.get\('q'\)/);
  assert.match(app,/els\.search\.value=query/);
  assert.match(app,/els\.heroSearch\.value=query/);
  const init=app.match(/async function init\(\)\{[\s\S]*?\}\ndocument\.addEventListener/);
  assert.ok(init,'init function not found');
  const src=init[0];
  assert.ok(src.indexOf('applyInitialSearch(params)')<src.indexOf('rerender()'),'URL search must be applied before first render');
});

test('Explore explicitly scrolls to the results section when arriving with a search query',()=>{
  assert.match(app,/function focusInitialSearchResults\(query\)/);
  assert.match(app,/document\.querySelector\('#explore'\)/);
  assert.match(app,/scrollIntoView\(/);
  assert.match(app,/focusInitialSearchResults\(initialQuery\)/);
});
