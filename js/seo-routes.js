(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  if(root)root.SeoRoutes=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  const PLATFORM_SLUGS=Object.freeze({
  "plat-1": "futurelearn",
  "plat-2": "agora",
  "plat-3": "ibm-skillsbuild",
  "plat-4": "forage",
  "plat-5": "microsoft",
  "plat-6": "itu-academy",
  "plat-7": "edx",
  "plat-8": "codecademy",
  "plat-9": "unitar",
  "plat-10": "huawei",
  "plat-11": "open-learn-auc",
  "plat-12": "hp-life",
  "plat-13": "nvidia",
  "plat-14": "cisco",
  "plat-15": "open-learn",
  "plat-16": "google-skillshop",
  "plat-17": "sololearn",
  "plat-18": "research-academy",
  "plat-19": "w3schools",
  "plat-20": "khan-academy",
  "plat-21": "couponami-formerly-discudemy",
  "plat-22": "kaggle",
  "plat-23": "github-learn",
  "plat-24": "google-skills",
  "plat-25": "free-code-camp",
  "plat-26": "coursera",
  "plat-27": "simplilearn",
  "plat-28": "alison",
  "plat-29": "saylor",
  "plat-30": "satr",
  "plat-31": "edraak",
  "plat-32": "maaref",
  "plat-33": "rwaq",
  "plat-34": "datacamp",
  "plat-35": "semrush",
  "plat-36": "btk-akademi",
  "plat-37": "matlab-academy",
  "plat-38": "hubspot-academy",
  "plat-39": "hackerrank",
  "plat-40": "korsat"
});
  function platformSlug(platformOrId){
    const id=typeof platformOrId==='string'?platformOrId:platformOrId&&platformOrId.id;
    return PLATFORM_SLUGS[id]||'';
  }
  function withLang(path,lang=''){
    const value=String(lang||'').trim();
    return value?path+'?lang='+encodeURIComponent(value):path;
  }
  function platformUrl(platformOrId,lang=''){
    const id=typeof platformOrId==='string'?platformOrId:platformOrId&&platformOrId.id;
    const slug=platformSlug(id);
    if(!slug)return withLang('platform.html?id='+encodeURIComponent(id||''),lang);
    return withLang('platforms/'+slug+'/',lang);
  }
  function categoryUrl(id,lang=''){
    const clean=String(id||'').trim();
    return withLang('categories/'+clean+'/',lang);
  }
  return{PLATFORM_SLUGS,platformSlug,platformUrl,categoryUrl};
});
