const test = require('node:test');
const assert = require('node:assert/strict');
const Landing = require('../js/landing.js');

test('landing stats delegate to platform-level normalized data', () => {
  const stats = Landing.buildStats([
    {hasFreeContent:true,certificateAvailable:true,languageIds:['Arabic','English'],officialCountType:'courses',officialCount:120,pricingModel:'free'},
    {hasFreeContent:false,certificateAvailable:true,languageIds:['English'],officialCountType:'courses',officialCount:80,pricingModel:'mixed'}
  ]);
  assert.deepEqual(stats,{platforms:2,free:1,certificates:2,courses:200,freeCourses:120,languages:2});
});

test('withLang preserves selected language in cross-page navigation', () => {
  assert.equal(Landing.withLang('explore.html','tr'),'explore.html?lang=tr');
  assert.equal(Landing.withLang('explore.html','ar'),'explore.html?lang=ar');
});
