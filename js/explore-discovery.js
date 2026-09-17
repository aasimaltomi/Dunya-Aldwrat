(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  if(root)root.ExploreDiscovery=api;
  if(root&&root.document)api.install();
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  const areas=[
    {
      id:'programming-web',icon:'</>',
      label:{ar:'البرمجة وتطوير الويب',en:'Programming & Web Development',tr:'Programlama ve Web Geliştirme'},
      examples:{ar:'Python · JavaScript · Web',en:'Python · JavaScript · Web',tr:'Python · JavaScript · Web'},
      terms:['programming','web development','software development','computer science','coding','برمجة','تطوير الويب','علوم الحاسوب','programlama','web geliştirme','yazılım']
    },
    {
      id:'artificial-intelligence',icon:'AI',
      label:{ar:'الذكاء الاصطناعي',en:'Artificial Intelligence',tr:'Yapay Zeka'},
      examples:{ar:'AI · تعلم الآلة · GenAI',en:'AI · Machine Learning · GenAI',tr:'AI · Makine Öğrenmesi · GenAI'},
      terms:['artificial intelligence','machine learning','deep learning','generative ai','الذكاء الاصطناعي','تعلم الآلة','التعلم العميق','yapay zeka','makine öğrenmesi','derin öğrenme']
    },
    {
      id:'data-analytics',icon:'▥',
      label:{ar:'البيانات والتحليلات',en:'Data & Analytics',tr:'Veri ve Analitik'},
      examples:{ar:'Data Science · SQL · BI',en:'Data Science · SQL · BI',tr:'Veri Bilimi · SQL · BI'},
      terms:['data science','data analysis','analytics','business intelligence','sql','علوم البيانات','تحليل البيانات','تحليلات','veri bilimi','veri analizi','analitik']
    },
    {
      id:'cybersecurity-it',icon:'⌁',
      label:{ar:'الأمن السيبراني وتقنية المعلومات',en:'Cybersecurity & IT',tr:'Siber Güvenlik ve BT'},
      examples:{ar:'Cybersecurity · Networks · IT',en:'Cybersecurity · Networks · IT',tr:'Siber Güvenlik · Ağlar · BT'},
      terms:['cybersecurity','cyber security','information technology','network security','networking','الأمن السيبراني','امن سيبراني','تقنية المعلومات','الشبكات','siber güvenlik','bilgi teknolojileri','ağ güvenliği']
    },
    {
      id:'cloud-devops',icon:'☁',
      label:{ar:'الحوسبة السحابية وDevOps',en:'Cloud Computing & DevOps',tr:'Bulut Bilişim ve DevOps'},
      examples:{ar:'Cloud · AWS · Azure · DevOps',en:'Cloud · AWS · Azure · DevOps',tr:'Bulut · AWS · Azure · DevOps'},
      terms:['cloud computing','cloud','devops','aws','azure','google cloud','الحوسبة السحابية','السحابة','ديف اوبس','bulut bilişim','bulut','devops']
    },
    {
      id:'business-entrepreneurship',icon:'↗',
      label:{ar:'الأعمال وريادة الأعمال',en:'Business & Entrepreneurship',tr:'İşletme ve Girişimcilik'},
      examples:{ar:'إدارة · ريادة · تمويل',en:'Management · Startups · Finance',tr:'Yönetim · Girişim · Finans'},
      terms:['business','entrepreneurship','management','finance','startup','الأعمال','ريادة الأعمال','إدارة','تمويل','işletme','girişimcilik','yönetim','finans']
    },
    {
      id:'digital-marketing',icon:'◎',
      label:{ar:'التسويق الرقمي',en:'Digital Marketing',tr:'Dijital Pazarlama'},
      examples:{ar:'SEO · محتوى · Social Media',en:'SEO · Content · Social Media',tr:'SEO · İçerik · Sosyal Medya'},
      terms:['digital marketing','marketing','seo','social media','content marketing','التسويق الرقمي','التسويق','تحسين محركات البحث','وسائل التواصل','dijital pazarlama','pazarlama','sosyal medya']
    },
    {
      id:'design-creativity',icon:'✦',
      label:{ar:'التصميم والإبداع',en:'Design & Creativity',tr:'Tasarım ve Yaratıcılık'},
      examples:{ar:'UX/UI · جرافيك · تصوير',en:'UX/UI · Graphics · Photography',tr:'UX/UI · Grafik · Fotoğrafçılık'},
      terms:['design','graphic design','ux','ui','creative','photography','تصميم','جرافيك','إبداع','تصوير','tasarım','grafik','yaratıcı','fotoğraf']
    },
    {
      id:'education-academics',icon:'◇',
      label:{ar:'التعليم والمهارات الأكاديمية',en:'Education & Academic Skills',tr:'Eğitim ve Akademik Beceriler'},
      examples:{ar:'تعليم · بحث · مهارات الدراسة',en:'Teaching · Research · Study Skills',tr:'Öğretim · Araştırma · Çalışma Becerileri'},
      terms:['education','teaching','academic','research','study skills','تعليم','تدريس','أكاديمي','بحث','مهارات الدراسة','eğitim','öğretim','akademik','araştırma']
    },
    {
      id:'languages-communication',icon:'文',
      label:{ar:'اللغات والتواصل',en:'Languages & Communication',tr:'Diller ve İletişim'},
      examples:{ar:'English · كتابة · تواصل',en:'English · Writing · Communication',tr:'İngilizce · Yazma · İletişim'},
      terms:['language','english','communication','writing','اللغات','اللغة','الإنجليزية','كتابة','تواصل','dil','ingilizce','iletişim','yazma']
    },
    {
      id:'health-medicine',icon:'+',
      label:{ar:'الصحة والطب',en:'Health & Medicine',tr:'Sağlık ve Tıp'},
      examples:{ar:'طب · صحة · رعاية صحية',en:'Medicine · Health · Healthcare',tr:'Tıp · Sağlık · Sağlık Hizmetleri'},
      terms:['health','medicine','healthcare','medical','nursing','الصحة','الطب','الرعاية الصحية','تمريض','sağlık','tıp','sağlık hizmetleri','hemşirelik']
    },
    {
      id:'professional-leadership',icon:'★',
      label:{ar:'المهارات المهنية والقيادة',en:'Professional Skills & Leadership',tr:'Profesyonel Beceriler ve Liderlik'},
      examples:{ar:'قيادة · مهنة · إنتاجية',en:'Leadership · Career · Productivity',tr:'Liderlik · Kariyer · Verimlilik'},
      terms:['leadership','career','professional','personal development','productivity','project management','قيادة','مهني','تطوير ذاتي','إنتاجية','إدارة المشاريع','liderlik','kariyer','profesyonel','verimlilik','proje yönetimi']
    }
  ];

  function normalize(value=''){
    return String(value).toLowerCase().normalize('NFKD')
      .replace(/[\u064B-\u065F\u0670]/g,'')
      .replace(/[أإآ]/g,'ا').replace(/ى/g,'ي').replace(/ة/g,'ه')
      .replace(/[^\p{L}\p{N}+#.]+/gu,' ').trim();
  }

  function localizedText(value){
    if(!value||typeof value!=='object')return String(value||'');
    return ['ar','en','tr'].map(lang=>String(value[lang]||'')).join(' ');
  }

  function editorialText(editorial){
    const parts=[];
    const source=editorial&&typeof editorial==='object'?editorial:{};
    for(const key of ['bestFor','strengths','limitations']){
      const group=source[key]&&typeof source[key]==='object'?source[key]:{};
      for(const lang of ['ar','en','tr']){
        const list=Array.isArray(group[lang])?group[lang]:[];
        parts.push(...list);
      }
    }
    return parts.join(' ');
  }

  function platformHaystack(platform){
    const p=platform||{};
    const fields=Array.isArray(p.fields)?p.fields:[];
    return normalize([
      localizedText(p.name),
      localizedText(p.description),
      p.categoryId||'',
      p.platformType||'',
      editorialText(p.editorial),
      ...fields.map(field=>localizedText(field&&field.name))
    ].join(' '));
  }

  function areaById(id){return areas.find(area=>area.id===id)||null}

  function matchesArea(platform,areaOrId){
    const area=typeof areaOrId==='string'?areaById(areaOrId):areaOrId;
    if(!area)return false;
    const haystack=platformHaystack(platform);
    return area.terms.some(term=>{
      const normalized=normalize(term);
      return normalized&&haystack.includes(normalized);
    });
  }

  function filterPlatforms(platforms,areaOrId){
    const list=Array.isArray(platforms)?platforms:[];
    const area=typeof areaOrId==='string'?areaById(areaOrId):areaOrId;
    if(!area)return list.slice();
    return list.filter(platform=>matchesArea(platform,area));
  }

  function countPlatforms(platforms,areaOrId){return filterPlatforms(platforms,areaOrId).length}

  function install(){
    if(typeof document==='undefined'||install.installed)return;
    if(typeof renderCategories!=='function'||typeof visiblePlatforms!=='function'||typeof resetFilters!=='function'||typeof bindEvents!=='function')return;
    install.installed=true;

    let activeDiscoveryArea='';
    const originalVisiblePlatforms=visiblePlatforms;
    const originalResetFilters=resetFilters;
    const originalBindEvents=bindEvents;

    renderCategories=function(){
      if(!els||!els.categoryGrid)return;
      els.categoryGrid.innerHTML=areas.map(area=>{
        const count=countPlatforms(allPlatforms,area.id);
        const active=activeDiscoveryArea===area.id;
        const label=content.localize(area.label);
        const examples=content.localize(area.examples);
        return `<button class="category-card${active?' active':''}" type="button" data-discovery="${esc(area.id)}" aria-pressed="${active}"><span class="category-icon">${esc(area.icon)}</span><strong>${esc(label)}</strong><span class="category-examples">${esc(examples)}</span><small class="category-count">${count} ${esc(getText('platformsAvailable'))}</small></button>`;
      }).join('');
    };

    visiblePlatforms=function(){
      if(!activeDiscoveryArea)return originalVisiblePlatforms();
      const fav=getFavorites(),recent=getRecent(),recentMap=Object.fromEntries(recent.map(x=>[x.id,x.ts]));
      const source=filterPlatforms(allPlatforms,activeDiscoveryArea);
      let list=PlatformDirectory.getVisiblePlatforms(source,currentState());
      if(activeTab==='favorites')list=list.filter(p=>fav.has(p.id));
      if(activeTab==='recent')list=list.filter(p=>recentMap[p.id]);
      if(els.sort.value==='viewed'){
        const views=getViews();
        list.sort((a,b)=>(views[b.id]||0)-(views[a.id]||0)||nameFor(a).localeCompare(nameFor(b)));
      }
      if(els.sort.value==='recent')list.sort((a,b)=>(recentMap[b.id]||0)-(recentMap[a.id]||0));
      return list;
    };

    function bindDiscoveryEvents(){
      if(!els||!els.categoryGrid)return;
      els.categoryGrid.onclick=event=>{
        const button=event.target.closest('[data-discovery]');
        if(!button)return;
        activeDiscoveryArea=button.dataset.discovery||'';
        activeTab='all';
        if(els.filterCategory)els.filterCategory.value='';
        renderCategories();
        renderDirectory();
        const explore=document.querySelector('#explore');
        if(explore)explore.scrollIntoView({behavior:'smooth'});
      };
    }

    resetFilters=function(){
      activeDiscoveryArea='';
      const result=originalResetFilters();
      renderCategories();
      return result;
    };

    bindEvents=function(){
      originalBindEvents();
      bindDiscoveryEvents();
    };

    bindDiscoveryEvents();
    try{
      if(Array.isArray(allPlatforms)&&allPlatforms.length){
        renderCategories();
        renderDirectory();
      }
    }catch(_){}
  }

  return{areas,areaById,matchesArea,filterPlatforms,countPlatforms,install};
});
