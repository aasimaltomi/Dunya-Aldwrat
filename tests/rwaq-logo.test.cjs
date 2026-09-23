const test=require('node:test');
const assert=require('node:assert/strict');
const data=require('../data.json');

test('Rwaq uses a stable visible logo source for directory cards',()=>{
  const rwaq=data.platforms.find(p=>p.id==='plat-33');
  assert.ok(rwaq,'Rwaq platform exists');
  assert.equal(rwaq.logo?.src,'https://www.google.com/s2/favicons?domain=rwaq.org&sz=128');
});
