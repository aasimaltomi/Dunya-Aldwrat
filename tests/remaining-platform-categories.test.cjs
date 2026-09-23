const test=require('node:test');
const assert=require('node:assert/strict');
const data=require('../data.json');
const byId=id=>data.platforms.find(p=>p.id===id);

const expected={
  'plat-11':4,
  'plat-22':8,
  'plat-23':6,
  'plat-30':8,
  'plat-33':19,
  'plat-37':8,
  'plat-39':8,
  'plat-40':14
};

test('remaining eight platforms expose reviewed trilingual categories with HTTPS destinations',()=>{
  for(const [id,count] of Object.entries(expected)){
    const fields=byId(id)?.fields||[];
    assert.equal(fields.length,count,`${id} category count`);
    for(const field of fields){
      assert.ok(field.id&&field.name?.ar&&field.name?.en&&field.name?.tr,`${id}/${field.id} trilingual`);
      assert.match(field.officialUrl||'',/^https:\/\//,`${id}/${field.id} HTTPS`);
    }
  }
});

test('Coursat categories use exact official category pages',()=>{
  const coursat=byId('plat-40');
  const expectedUrls={
    programming:'https://www.coursat.org/category/programming',
    design:'https://www.coursat.org/category/design',
    languages:'https://www.coursat.org/category/languages',
    networks:'https://www.coursat.org/category/networks',
    security:'https://www.coursat.org/category/security',
    database:'https://www.coursat.org/category/database',
    os:'https://www.coursat.org/category/os',
    webdev:'https://www.coursat.org/category/webdev',
    'management-economy':'https://www.coursat.org/category/management-economy',
    'computer-science':'https://www.coursat.org/category/computer-science',
    science:'https://www.coursat.org/category/science',
    math:'https://www.coursat.org/category/math',
    software:'https://www.coursat.org/category/software',
    'self-development':'https://www.coursat.org/category/self-development'
  };
  for(const [id,url] of Object.entries(expectedUrls)){
    assert.equal(coursat.fields.find(field=>field.id===id)?.officialUrl,url,id);
  }
});
