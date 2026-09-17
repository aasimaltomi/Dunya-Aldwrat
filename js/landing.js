(function(root,factory){
  const directory=typeof module==='object'&&module.exports?require('./platform-directory.js'):root.PlatformDirectory;
  const api=factory(directory);
  if(typeof module==='object'&&module.exports)module.exports=api;
  if(root)root.Landing=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(PlatformDirectory){
  if(!PlatformDirectory)throw new Error('PlatformDirectory is required');
  let inlineEditor=null;

  function buildStats(platforms){return PlatformDirectory.getStats(Array.isArray(platforms)?platforms:[])}
  function withLang(path,lang){const separator=String(path).includes('?')?'&':'?';return `${path}${separator}lang=${encodeURIComponent(lang||'ar')}`}
  function categoryExploreUrl(path,lang,categoryId){const separator=String(path).includes('?')?'&':'?';return `${path}${separator}category=${encodeURIComponent(categoryId||'')}&lang=${encodeURIComponent(lang||'ar')}#explore`}
  function esc(value=''){return String(value).replace(/[&<>'"]/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]))}

  function setTheme(theme){
    document.documentElement.dataset.theme=theme;
    try{localStorage.setItem('dunya-theme-v2',theme)}catch(_){}
    const button=document.getElementById('themeToggle');
    if(button)button.textContent=content?content.icon(theme==='dark'?'themeLight':'themeDark'):'';
  }

  function initTheme(){
    let saved=null;
    try{saved=localStorage.getItem('dunya-theme-v2')}catch(_){}
    const theme=saved||(window.matchMedia&&window.matchMedia('(prefers-color-scheme:dark)').matches?'dark':'light');
    setTheme(theme);
  }

  function syncExploreLinks(){
    const path=content&&content.link('explore')||'explore.html';
    document.querySelectorAll('[data-explore-link]').forEach(link=>{
      const original=link.getAttribute('href')||'';
      const hash=original.includes('#')?`#${original.split('#').slice(1).join('#')}`:'';
      link.href=`${withLang(path,currentLang)}${hash}`;
    });
  }

  function renderStats(stats){
    const map={landingStatPlatforms:stats.platforms,landingStatFree:stats.free,landingStatCert:stats.certificates,landingStatLang:stats.languages};
    Object.entries(map).forEach(([id,value])=>{const el=document.getElementById(id);if(el)el.textContent=value});
  }

  function removeHeroClutter(){
    document.querySelectorAll('.hero-kicker,.hero-learning-card,.hero-book-stack,.hero-platform-cloud .landing-core').forEach(node=>node.remove());
  }

  function renderPlatformCloud(platforms){
    const orbit=document.getElementById('homePlatformCloud');
    if(!orbit||!content)return;
    orbit.querySelectorAll('.orbit-chip').forEach(node=>node.remove());
    const byId=new Map((platforms||[]).map(p=>[p.id,p]));
    const ids=Array.isArray(content.rawSetting('homePlatformCloud'))?content.rawSetting('homePlatformCloud'):[];
    ids.map(id=>byId.get(id)).filter(Boolean).slice(0,4).forEach(p=>{
      const chip=document.createElement('span');
      chip.className='orbit-chip';
      chip.textContent=content.platformName(p);
      chip.dataset.editKind='platform';chip.dataset.editId=p.id;chip.dataset.editField='name';
      orbit.appendChild(chip);
    });
  }

  function categoryGroups(data,platforms){
    const categoryMap=new Map((data&&Array.isArray(data.categories)?data.categories:[]).map(row=>[row.id,row]));
    return PlatformDirectory.getCategoryGroups(platforms).slice(0,8).map(group=>({group,row:categoryMap.get(group.categoryId)||{}}));
  }

  function renderCategories(data,platforms){
    if(!content)return;
    const grid=document.getElementById('landingCategoryGrid');
    const chips=document.getElementById('heroCategoryChips');
    const path=content.link('explore')||'explore.html';
    const groups=categoryGroups(data,platforms);

    if(grid){
      grid.innerHTML='';
      groups.forEach(({group,row})=>{
        const link=document.createElement('a');
        link.className='category-card';link.href=categoryExploreUrl(path,currentLang,group.categoryId);
        const icon=document.createElement('span');icon.textContent=row.icon||'';
        const label=document.createElement('strong');label.textContent=content.categoryLabel(group.categoryId);label.dataset.editKind='category';label.dataset.editId=group.categoryId;label.dataset.editField='label';
        const count=document.createElement('small');count.textContent=String(group.count);
        link.append(icon,label,count);grid.appendChild(link);
      });
    }

    if(chips){
      chips.innerHTML=groups.slice(0,6).map(({group,row})=>`<a class="hero-category-chip" href="${esc(categoryExploreUrl(path,currentLang,group.categoryId))}">${row.icon?`<span class="chip-icon">${esc(row.icon)}</span>`:''}<span data-edit-kind="category" data-edit-id="${esc(group.categoryId)}" data-edit-field="label">${esc(content.categoryLabel(group.categoryId))}</span></a>`).join('');
    }
  }

  function platformLogo(platform){
    const own=platform&&platform.logo&&platform.logo.src?content.safeUrl(platform.logo.src,{allowRelative:true}):'';
    if(own)return own;
    const fallback=content.asset('platformFallbackLogo');
    return fallback&&fallback.src?fallback.src:'';
  }

  function detailUrl(platform){return `platform.html?id=${encodeURIComponent(platform.id)}&lang=${encodeURIComponent(currentLang)}`}

  function featuredCard(platform,index){
    const name=content.platformName(platform),description=content.platformDescription(platform),logo=platformLogo(platform);
    const category=content.categoryLabel(platform.categoryId)||'';
    const pricing=typeof translatePricing==='function'?translatePricing(platform.pricingModel):(platform.pricingModel||'');
    const certificate=platform.certificateAvailable&&typeof getText==='function'?getText('withCertificate'):'';
    const explore=typeof getText==='function'?getText('landingExploreCta'):'';
    const languages=Array.isArray(platform.languageIds)?platform.languageIds.map(id=>content.languageLabel(id)).filter(Boolean).slice(0,2):[];
    const officialCount=Number.isFinite(Number(platform.officialCount))?new Intl.NumberFormat(currentLang||'ar').format(Number(platform.officialCount)):'';
    const languageMeta=languages.length?`<span><span aria-hidden="true">◉</span>${esc(languages.join(' · '))}</span>`:'';
    const countMeta=officialCount?`<span><span aria-hidden="true">▦</span>${esc(officialCount)}</span>`:'';
    const certificateBadge=certificate?`<span class="featured-status-badge certificate">${esc(certificate)}</span>`:'';
    return `<a class="featured-course-card" href="${esc(detailUrl(platform))}" data-id="${esc(platform.id)}"><div class="featured-course-art"><div class="featured-course-badges"><span class="featured-status-badge pricing">${esc(pricing)}</span>${certificateBadge}</div>${logo?`<img src="${esc(logo)}" alt="${esc(name)}" loading="lazy">`:''}<span class="featured-course-category">${esc(category)}</span></div><div class="featured-course-body"><h3 data-edit-kind="platform" data-edit-id="${esc(platform.id)}" data-edit-field="name">${esc(name)}</h3><p data-edit-kind="platform" data-edit-id="${esc(platform.id)}" data-edit-field="description">${esc(description)}</p><div class="featured-course-stats">${languageMeta}${countMeta}</div><div class="featured-course-footer"><span class="featured-course-cta">${esc(explore)}<span aria-hidden="true">↗</span></span><span class="featured-course-rank" aria-hidden="true">0${index+1}</span></div></div></a>`;
  }

  function renderFeatured(platforms){
    const grid=document.getElementById('homeFeaturedGrid');
    if(!grid||!content)return;
    const ids=Array.isArray(content.rawSetting('featuredFallbackIds'))?content.rawSetting('featuredFallbackIds'):[];
    const featured=PlatformDirectory.getFeatured(platforms,ids).slice(0,4);
    grid.innerHTML=featured.map(featuredCard).join('');
  }

  function renderTopPlatforms(platforms){
    const grid=document.getElementById('homePlatformGrid');
    if(!grid||!content)return;
    const ids=Array.isArray(content.rawSetting('featuredFallbackIds'))?content.rawSetting('featuredFallbackIds'):[];
    let list=PlatformDirectory.getFeatured(platforms,ids).slice(0,6);
    if(list.length<6){
      const used=new Set(list.map(item=>item.id));
      list=list.concat(platforms.filter(item=>!used.has(item.id)).slice(0,6-list.length));
    }
    grid.innerHTML=list.map(platform=>{
      const name=content.platformName(platform),logo=platformLogo(platform),category=content.categoryLabel(platform.categoryId)||'';
      return `<a class="learning-platform-card" href="${esc(detailUrl(platform))}" data-id="${esc(platform.id)}">${logo?`<img src="${esc(logo)}" alt="${esc(name)}" loading="lazy">`:''}<div><strong data-edit-kind="platform" data-edit-id="${esc(platform.id)}" data-edit-field="name">${esc(name)}</strong><small>${esc(category)}</small></div></a>`;
    }).join('');
  }

  function renderHome(data,platforms){
    renderPlatformCloud(platforms);
    renderCategories(data,platforms);
    renderFeatured(platforms);
    renderTopPlatforms(platforms);
    renderStats(buildStats(platforms));
  }

  function bindHeroSearch(){
    const form=document.getElementById('heroSearchForm');
    const input=document.getElementById('heroSearchInput');
    if(!form||!input)return;
    form.onsubmit=event=>{
      event.preventDefault();
      const query=input.value.trim();
      const target=new URL(content&&content.link('explore')||'explore.html',location.href);
      target.searchParams.set('lang',currentLang||'ar');
      if(query)target.searchParams.set('q',query);
      target.hash='explore';
      location.href=target.href;
    };
  }

  function applyLandingData(data){
    initContent(data);setLang(currentLang);SiteRuntime.applyDocument(document,content,'home');syncExploreLinks();
    const platforms=data.platforms.map(PlatformCore.normalizeStaticPlatform);
    renderHome(data,platforms);
    const lang=document.getElementById('langSwitcher');if(lang)lang.value=currentLang;
    return platforms;
  }

  async function initBrowser(){
    removeHeroClutter();
    const params=new URLSearchParams(location.search);
    let data=await DataLoader.loadSiteData();
    initContent(data);setLang(params.get('lang')||content.rawSetting('defaultLanguage')||'ar');SiteRuntime.applyDocument(document,content,'home');initTheme();syncExploreLinks();
    let platforms=data.platforms.map(PlatformCore.normalizeStaticPlatform);
    renderHome(data,platforms);bindHeroSearch();

    const lang=document.getElementById('langSwitcher');if(lang)lang.value=currentLang;
    if(lang)lang.onchange=e=>{
      setLang(e.target.value);SiteRuntime.applyDocument(document,content,'home');lang.value=currentLang;syncExploreLinks();renderHome(data,platforms);
      const url=new URL(location.href);url.searchParams.set('lang',currentLang);history.replaceState(null,'',url);
      if(inlineEditor)inlineEditor.refreshTargets();
    };

    const theme=document.getElementById('themeToggle');if(theme)theme.onclick=()=>setTheme(document.documentElement.dataset.theme==='dark'?'light':'dark');
    inlineEditor=InlineEditor.create({document,location,data,content,onDataChange(next){data=next;platforms=applyLandingData(data);setTimeout(()=>inlineEditor&&inlineEditor.refreshTargets(),0)}});
    await inlineEditor.init();
    if('serviceWorker'in navigator)window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>{}));
  }

  if(typeof document!=='undefined')document.addEventListener('DOMContentLoaded',()=>initBrowser().catch(err=>{console.error(err);renderStats(buildStats([]))}));
  return{buildStats,withLang,categoryExploreUrl};
});
