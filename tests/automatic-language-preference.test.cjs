const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const I18n=require('../js/i18n.js');

test('normalizes supported regional language tags',()=>{
  assert.equal(I18n.normalizeSupportedLanguage('ar-YE'),'ar');
  assert.equal(I18n.normalizeSupportedLanguage('en-US'),'en');
  assert.equal(I18n.normalizeSupportedLanguage('tr-TR'),'tr');
  assert.equal(I18n.normalizeSupportedLanguage('de-DE'),'');
});

test('language preference order is URL then saved choice then browser then site default',()=>{
  assert.equal(I18n.resolveLanguagePreference({
    urlLanguage:'tr-TR',
    savedLanguage:'ar',
    browserLanguages:['en-US'],
    defaultLanguage:'ar'
  }),'tr');

  assert.equal(I18n.resolveLanguagePreference({
    savedLanguage:'en',
    browserLanguages:['tr-TR'],
    defaultLanguage:'ar'
  }),'en');

  assert.equal(I18n.resolveLanguagePreference({
    browserLanguages:['de-DE','tr-TR','en-US'],
    defaultLanguage:'ar'
  }),'tr');

  assert.equal(I18n.resolveLanguagePreference({
    browserLanguages:['de-DE'],
    defaultLanguage:'en'
  }),'en');
});

test('main runtime pages use the shared automatic language resolver',()=>{
  for(const path of ['js/landing.js','js/app.js','js/platform-detail.js','js/404.js','js/detail.js']){
    const source=fs.readFileSync(path,'utf8');
    assert.match(source,/resolveInitialLanguage\(/,path);
  }
});

test('automatic initialization does not overwrite a user preference while manual changes still persist',()=>{
  const source=fs.readFileSync('js/i18n.js','utf8');
  assert.match(source,/function setLang\(lang,\{persist=true\}=\{\}\)/);
  for(const path of ['js/landing.js','js/app.js','js/platform-detail.js','js/404.js','js/detail.js']){
    const page=fs.readFileSync(path,'utf8');
    assert.match(page,/resolveInitialLanguage\([\s\S]*?\),\{persist:false\}/,path);
  }
});


test('English is the site fallback when no supported preference exists',()=>{
  assert.equal(I18n.resolveLanguagePreference({browserLanguages:['de-DE']}),'en');
});
