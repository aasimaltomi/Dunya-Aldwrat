const test=require('node:test');
const assert=require('node:assert/strict');
const data=require('../data.json');
const byId=id=>data.platforms.find(p=>p.id===id);
const expected={'plat-31':11,'plat-32':8,'plat-33':19,'plat-34':7,'plat-35':15,'plat-36':9,'plat-37':8,'plat-38':4,'plat-39':8,'plat-40':14};

test('authoritative category batch 31-40 has exact reviewed counts',()=>{
  for(const [id,count] of Object.entries(expected))assert.equal((byId(id).fields||[]).length,count,id);
  assert.equal(Object.values(expected).reduce((a,b)=>a+b,0),103);
});

test('all approved 31-40 categories are trilingual and use official HTTPS destinations',()=>{
  for(const id of Object.keys(expected))for(const field of byId(id).fields||[]){
    assert.ok(field.id&&field.name?.ar&&field.name?.en&&field.name?.tr);
    assert.match(field.officialUrl,/^https:\/\//);
    assert.doesNotMatch(field.officialUrl,/google\.com\/search/);
  }
});

test('Rwaq MATLAB Academy HackerRank and Coursat now expose reviewed categories',()=>{
  assert.equal(byId('plat-33').fields.length,19);
  assert.equal(byId('plat-37').fields.length,8);
  assert.equal(byId('plat-39').fields.length,8);
  assert.equal(byId('plat-40').fields.length,14);
});
