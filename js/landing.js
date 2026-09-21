(function(root,factory){
  const directory=typeof module==='object'&&module.exports?require('./platform-directory.js'):root.PlatformDirectory;
  const api=factory(directory);
  if(typeof module==='object'&&module.exports)module.exports=api;
  if(root)root.Landing=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(PlatformDirectory){
  if(!PlatformDirectory)throw new Error('PlatformDirectory is required');
  let inlineEditor=null;

  const DISCOVERY_SECTION_COPY={
    ar:{eyebrow:'استكشف حسب المجال',title:'اختر مجالك وابدأ التعلّم',subtitle:'استكشف أفضل المنصات والدورات حسب المجال الذي يهمك.'},
    en:{eyebrow:'Browse by field',title:'Choose your field and start learning',subtitle:'Explore the best platforms and courses for the field that interests you.'},
    tr:{eyebrow:'Alana göre keşfet',title:'Alanını seç ve öğrenmeye başla',subtitle:'İlgilendiğin alana göre en uygun platformları ve kursları keşfet.'}
  };

  const HOME_STATS_LABELS={
    ar:{active:'منصة نشطة',courses:'دورة متاحة',freeCourses:'دورة مجانية',freeCertificates:'منصة بشهادات مجانية',languages:'لغة متاحة'},
    en:{active:'active platforms',courses:'available courses',freeCourses:'free courses',freeCertificates:'platforms with free certificates',languages:'languages available'},
    tr:{active:'aktif platform',courses:'mevcut kurs',freeCourses:'ücretsiz kurs',freeCertificates:'ücretsiz sertifika sunan platform',languages:'mevcut dil'}
  };

  const DISCOVERY_AREA_DEFINITIONS=[
    {
      id:'programming_ai',icon:'⌘',
      label:{ar:'البرمجة والذكاء الاصطناعي',en:'Programming & Artificial Intelligence',tr:'Programlama ve Yapay Zeka'},
      examples:{ar:'Python • Web • AI',en:'Python • Web • AI',tr:'Python • Web • Yapay Zeka'},
      filter:{category:'programming_data'}
    },
    {
      id:'data_analytics',icon:'▥',
      label:{ar:'البيانات والتحليلات',en:'Data & Analytics',tr:'Veri ve Analitik'},
      examples:{ar:'Data • SQL • BI',en:'Data • SQL • BI',tr:'Veri • SQL • BI'},
      filter:{category:'programming_data',query:'data'}
    },
    {
      id:'business_entrepreneurship',icon:'↗',
      label:{ar:'الأعمال وريادة الأعمال',en:'Business & Entrepreneurship',tr:'İşletme ve Girişimcilik'},
      examples:{ar:'تسويق • إدارة • ريادة',en:'Marketing • Management • Startups',tr:'Pazarlama • Yönetim • Girişim'},
      filter:{category:'business_marketing'}
    },
    {
      id:'design_creative',icon:'✦',
      label:{ar:'التصميم والإبداع',en:'Design & Creativity',tr:'Tasarım ve Yaratıcılık'},
      examples:{ar:'UI/UX • جرافيك • محتوى',en:'UI/UX • Graphics • Content',tr:'UI/UX • Grafik • İçerik'},
      filter:{query:'design'}
    },
    {
      id:'education_academic',icon:'◇',
      label:{ar:'التعليم والمهارات الأكاديمية',en:'Education & Academic Skills',tr:'Eğitim ve Akademik Beceriler'},
      examples:{ar:'علوم • أكاديمي • شهادات',en:'Science • Academic • Certificates',tr:'Bilim • Akademik • Sertifikalar'},
      filter:{category:'education'}
    },
    {
      id:'languages_communication',icon:'▦',
      label:{ar:'اللغات والتواصل',en:'Languages & Communication',tr:'Diller ve İletişim'},
      examples:{ar:'إنجليزية • تركية • تواصل',en:'English • Turkish • Communication',tr:'İngilizce • Türkçe • İletişim'},
      filter:{category:'languages'}
    }
  ];

  function localized(value,lang='ar'){
    if(value&&typeof value==='object')return value[lang]||value.en||value.ar||value.tr||'';
    return value===null||value===undefined?'':String(value);
  }

  function formatStatCount(value){return new Intl.NumberFormat('en-US').format(Number(value)||0)}
  function homeStats(platforms=[],lang='ar'){
    const list=Array.isArray(platforms)?platforms:[],stats=buildStats(list),labels=HOME_STATS_LABELS[lang]||HOME_STATS_LABELS.ar;
    return[
      {id:'active',value:String(stats.platforms),label:labels.active},
      {id:'courses',value:`${formatStatCount(stats.courses)}+`,label:labels.courses},
      {id:'freeCourses',value:`${formatStatCount(stats.freeCourses)}+`,label:labels.freeCourses},
      {id:'freeCertificates',value:String(list.filter(p=>p&&p.freeCertificate===true).length),label:labels.freeCertificates},
      {id:'languages',value:`${stats.languages}+`,label:labels.languages}
    ];
  }

  function discoveryCountLabel(count,lang='ar'){
    const value=Number(count)||0;
    if(lang==='en')return `${value} platform${value===1?'':'s'}`;
    if(lang==='tr')return `${value} platform`;
    return `${value} منصة`;
  }

  function discoveryAreas(platforms=[],lang='ar'){
    const list=Array.isArray(platforms)?platforms:[];
    return DISCOVERY_AREA_DEFINITIONS.map(definition=>{
      const visible=PlatformDirectory.getVisiblePlatforms(list,{...definition.filter,sort:'recommended'});
      const count=visible.length;
      return{
        id:definition.id,
        icon:definition.icon,
        label:localized(definition.label,lang),
        examples:localized(definition.examples,lang),
        count,
        countLabel:discoveryCountLabel(count,lang),
        filter:{...definition.filter}
      };
    });
  }

  function discoverySectionCopy(lang='ar'){
    const copy=DISCOVERY_SECTION_COPY[lang]||DISCOVERY_SECTION_COPY.ar;
    return{...copy};
  }

  function discoveryAreaExploreUrl(path,lang,area={}){
    const filter=area&&area.filter||{};
    const params=[];
    if(filter.category)params.push(`category=${encodeURIComponent(filter.category)}`);
    if(filter.query)params.push(`q=${encodeURIComponent(filter.query)}`);
    params.push(`lang=${encodeURIComponent(lang||'ar')}`);
    const cleanPath=String(path||'explore.html').replace(/#.*$/,'');
    const separator=cleanPath.includes('?')?'&':'?';
    return `${cleanPath}${separator}${params.join('&')}#explore`;
  }

  function ensureDiscoveryStyles(doc){
    if(!doc||!doc.head||doc.getElementById('homeDiscoveryCategoriesStyles'))return;
    const link=doc.createElement('link');
    link.id='homeDiscoveryCategoriesStyles';
    link.rel='stylesheet';
    link.href='css/home-discovery-categories.css';
    doc.head.appendChild(link);
  }

  function buildStats(platforms){return PlatformDirectory.getStats(Array.isArray(platforms)?platforms:[])}
  function withLang(path,lang){const separator=String(path).includes('?')?'&':'?';return `${path}${separator}lang=${encodeURIComponent(lang||'ar')}`}
  function buildExploreUrl(path,lang,params={}){
    const clean=String(path||'explore.html').replace(/#.*$/,'');
    const parts=clean.split('?');
    const pathname=parts.shift()||'explore.html';
    const search=new URLSearchParams(parts.join('?'));
    Object.entries(params).forEach(([key,value])=>{
      const normalized=String(value??'').trim();
      if(normalized)search.set(key,normalized);
      else search.delete(key);
    });
    search.set('lang',lang||'ar');
    const query=search.toString();
    return `${pathname}${query?`?${query}`:''}#explore`;
  }
  function categoryExploreUrl(path,lang,categoryId){return buildExploreUrl(path,lang,{category:categoryId})}
  function platformFinderUrl(path,lang){return buildExploreUrl(path,lang,{finder:'1'})}
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

  function renderStats(platforms=[]){
    const targets={
      active:['landingStatActive','landingStatActiveLabel'],
      courses:['landingStatCourses','landingStatCoursesLabel'],
      freeCourses:['landingStatFreeCourses','landingStatFreeCoursesLabel'],
      freeCertificates:['landingStatFreeCertificates','landingStatFreeCertificatesLabel'],
      languages:['landingStatLang','landingStatLangLabel']
    };
    homeStats(platforms,currentLang).forEach(row=>{
      const [valueId,labelId]=targets[row.id]||[];
      const valueEl=valueId&&document.getElementById(valueId);
      const labelEl=labelId&&document.getElementById(labelId);
      if(valueEl)valueEl.textContent=row.value;
      if(labelEl)labelEl.textContent=row.label;
    });
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
    return PlatformDirectory.getCategoryGroups(platforms).map(group=>({group,row:categoryMap.get(group.categoryId)||{}}));
  }

  function renderDiscoverySectionCopy(){
    const section=document.getElementById('categoriesSection');
    if(!section)return;
    const copy=discoverySectionCopy(currentLang);
    const eyebrow=section.querySelector('.landing-kicker');
    const title=section.querySelector('h2');
    const subtitle=section.querySelector('p');
    if(eyebrow)eyebrow.textContent=copy.eyebrow;
    if(title)title.textContent=copy.title;
    if(subtitle)subtitle.textContent=copy.subtitle;
  }

  function renderCategories(data,platforms){
    if(!content)return;
    const grid=document.getElementById('landingCategoryGrid');
    const chips=document.getElementById('heroCategoryChips');
    const path=content.link('explore')||'explore.html';
    const groups=categoryGroups(data,platforms);
    const areas=discoveryAreas(platforms,currentLang);

    renderDiscoverySectionCopy();

    if(grid){
      grid.innerHTML='';
      areas.forEach(area=>{
        const link=document.createElement('a');
        link.className='category-card discovery-area-card';
        link.href=discoveryAreaExploreUrl(path,currentLang,area);
        link.setAttribute('aria-label',`${area.label} — ${area.countLabel}`);

        const icon=document.createElement('span');
        icon.className='discovery-area-icon';
        icon.setAttribute('aria-hidden','true');
        icon.textContent=area.icon;

        const copy=document.createElement('div');
        copy.className='discovery-area-copy';
        const label=document.createElement('strong');label.textContent=area.label;
        const examples=document.createElement('small');examples.className='discovery-area-examples';examples.textContent=area.examples;
        const count=document.createElement('small');count.className='discovery-area-count';count.textContent=area.countLabel;
        copy.append(label,examples,count);
        link.append(icon,copy);
        grid.appendChild(link);
      });
    }

    if(chips){
      chips.innerHTML=groups.map(({group,row})=>`<a class="hero-category-chip" href="${esc(categoryExploreUrl(path,currentLang,group.categoryId))}">${row.icon?`<span class="chip-icon">${esc(row.icon)}</span>`:''}<span data-edit-kind="category" data-edit-id="${esc(group.categoryId)}" data-edit-field="label">${esc(content.categoryLabel(group.categoryId))}</span></a>`).join('');
    }
    const finder=document.getElementById('heroPlatformFinder');
    if(finder)finder.href=platformFinderUrl(path,currentLang);
  }

  function platformLogo(platform){
    const own=platform&&platform.logo&&platform.logo.src?content.safeUrl(platform.logo.src,{allowRelative:true}):'';
    if(own)return own;
    const fallback=content.asset('platformFallbackLogo');
    return fallback&&fallback.src?fallback.src:'';
  }

  function detailUrl(platform){return SeoRoutes.platformUrl(platform,currentLang)}

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
    renderStats(platforms);
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
    initContent(data);setLang(resolveInitialLanguage(params.get('lang'),content.rawSetting('defaultLanguage')||'en'),{persist:false});SiteRuntime.applyDocument(document,content,'home');initTheme();syncExploreLinks();
    let platforms=data.platforms.map(PlatformCore.normalizeStaticPlatform);
    renderHome(data,platforms);bindHeroSearch();

    const lang=document.getElementById('langSwitcher');if(lang)lang.value=currentLang;
    if(lang)lang.onchange=e=>{
      setLang(e.target.value);SiteRuntime.applyDocument(document,content,'home');lang.value=currentLang;syncExploreLinks();renderHome(data,platforms);
      const url=new URL(location.href);url.searchParams.set('lang',currentLang);history.replaceState(null,'',url);
      if(inlineEditor)inlineEditor.refreshTargets();
    };

    const theme=document.getElementById('themeToggle');if(theme)theme.onclick=()=>setTheme(document.documentElement.dataset.theme==='dark'?'light':'dark');
    if(globalThis.DunyaInlineEditorRequested){
      await (globalThis.DunyaInlineEditorReady||Promise.resolve(false));
      if(typeof InlineEditor!=='undefined'){
        inlineEditor=InlineEditor.create({document,location,data,content,onDataChange(next){data=next;platforms=applyLandingData(data);setTimeout(()=>inlineEditor&&inlineEditor.refreshTargets(),0)}});
        await inlineEditor.init();
      }
    }
    if('serviceWorker'in navigator)window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>{}));
  }

  if(typeof document!=='undefined'){
    ensureDiscoveryStyles(document);
    document.addEventListener('DOMContentLoaded',()=>initBrowser().catch(err=>{console.error(err);renderStats()}));
  }
  return{buildStats,homeStats,withLang,buildExploreUrl,categoryExploreUrl,platformFinderUrl,discoveryAreas,discoverySectionCopy,discoveryAreaExploreUrl};
});