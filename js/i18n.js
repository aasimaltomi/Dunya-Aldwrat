const ContentAPIModule = typeof module === 'object' && module.exports ? require('./content-api.js') : null;
const SUPPORTED_LANGS = ['ar','en','tr'];
const LANGUAGE_STORAGE_KEY = 'dunya-lang';
const TECHNICAL_FALLBACK = { errorLoading:'Unable to load content', platformNotFound:'Content not found' };

function normalizeSupportedLanguage(value){
  const raw=String(value||'').trim().toLowerCase();
  if(!raw)return'';
  const base=raw.split(/[-_]/)[0];
  return SUPPORTED_LANGS.includes(base)?base:'';
}
function detectBrowserLanguage(languages){
  const values=Array.isArray(languages)?languages:[languages];
  for(const value of values){
    const lang=normalizeSupportedLanguage(value);
    if(lang)return lang;
  }
  return'';
}
function resolveLanguagePreference({urlLanguage='',savedLanguage='',browserLanguages=[],defaultLanguage='ar'}={}){
  return normalizeSupportedLanguage(urlLanguage)
    ||normalizeSupportedLanguage(savedLanguage)
    ||detectBrowserLanguage(browserLanguages)
    ||normalizeSupportedLanguage(defaultLanguage)
    ||'ar';
}
function readSavedLanguage(){
  try{
    const saved=typeof localStorage!=='undefined'?localStorage.getItem(LANGUAGE_STORAGE_KEY):null;
    return normalizeSupportedLanguage(saved);
  }catch(_){return''}
}
function browserLanguagePreferences(){
  if(typeof navigator==='undefined')return[];
  if(Array.isArray(navigator.languages)&&navigator.languages.length)return navigator.languages;
  return navigator.language?[navigator.language]:[];
}
function resolveInitialLanguage(urlLanguage='',defaultLanguage='ar'){
  return resolveLanguagePreference({
    urlLanguage,
    savedLanguage:readSavedLanguage(),
    browserLanguages:browserLanguagePreferences(),
    defaultLanguage
  });
}

let currentLang=resolveInitialLanguage('','ar');
let content=null;

function contentApiModule(){
  if(ContentAPIModule)return ContentAPIModule;
  if(typeof globalThis!=='undefined'&&globalThis.ContentAPI)return globalThis.ContentAPI;
  return null;
}
function initContent(data){
  const api=contentApiModule();
  if(!api||typeof api.create!=='function')throw new Error('ContentAPI is required');
  content=api.create(data,currentLang);
  return content;
}
function mergeSiteText(){
  // Compatibility shim during the migration; all real content comes from initContent(data).
  return content;
}
function getText(path){
  const value=content?content.text(path,currentLang):'';
  if(value)return value;
  return TECHNICAL_FALLBACK[path]||'';
}
function setLang(lang,{persist=true}={}){
  lang=normalizeSupportedLanguage(lang)||'ar';
  currentLang=lang;
  if(content)content.setLang(lang);
  try{if(persist&&typeof localStorage!=='undefined')localStorage.setItem(LANGUAGE_STORAGE_KEY,lang)}catch(_){}
  if(typeof document!=='undefined'){
    document.documentElement.lang=lang;
    document.documentElement.dir=lang==='ar'?'rtl':'ltr';
  }
  return currentLang;
}
function applyTranslations(){
  if(typeof document==='undefined')return;
  document.querySelectorAll('[data-i18n]').forEach(el=>{el.textContent=getText(el.dataset.i18n)});
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el=>{el.placeholder=getText(el.dataset.i18nPlaceholder)});
  document.querySelectorAll('[data-i18n-aria-label]').forEach(el=>{el.setAttribute('aria-label',getText(el.dataset.i18nAriaLabel))});
  document.querySelectorAll('[data-i18n-title]').forEach(el=>{el.setAttribute('title',getText(el.dataset.i18nTitle))});
}
function translateCat(id){return content?content.categoryLabel(id,currentLang):''}
function translateLang(id){return content?content.languageLabel(id,currentLang):''}
function translatePricing(model){return getText(model==='free'?'pricing_free_display':`pricing_${model||'unknown'}`)}
function translateVerification(state){if(!state||state==='unverified')return'';return getText(`verification_${state}`)}
function pf(platform,field){
  if(!content||!platform)return'';
  if(field==='name')return content.platformName(platform,currentLang);
  if(field==='description')return content.platformDescription(platform,currentLang);
  return'';
}

if(typeof module==='object'&&module.exports){
  module.exports={
    SUPPORTED_LANGS,
    normalizeSupportedLanguage,
    detectBrowserLanguage,
    resolveLanguagePreference,
    resolveInitialLanguage,
    initContent,mergeSiteText,getText,setLang,applyTranslations,translateCat,translateLang,translatePricing,translateVerification,pf,
    get currentLang(){return currentLang},
    get content(){return content}
  };
}
