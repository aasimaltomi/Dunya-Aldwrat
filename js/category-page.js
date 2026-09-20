(function(){
  const COPY={
    ar:{home:'الرئيسية',platforms:'المنصات',section:'منصات مناسبة لهذا المجال',breadcrumb:'مسار الصفحة'},
    en:{home:'Home',platforms:'Platforms',section:'Suitable platforms for this field',breadcrumb:'Breadcrumb'},
    tr:{home:'Ana Sayfa',platforms:'Platformlar',section:'Bu alan için uygun platformlar',breadcrumb:'Sayfa yolu'}
  };

  function esc(value=''){return String(value).replace(/[&<>'"]/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]))}
  function descriptionFor(label,lang){
    if(lang==='en')return `Explore ${label} platforms and courses, compare content and certificate options, and continue to the official learning sources that fit your goal.`;
    if(lang==='tr')return `${label} alanındaki platformları ve kursları keşfedin; içerik ve sertifika seçeneklerini karşılaştırarak hedefinize uygun resmî öğrenme kaynaklarına ulaşın.`;
    return `استكشف منصات ودورات ${label} وقارن الخيارات المتاحة حسب المحتوى والشهادات للوصول إلى مصادر التعلم الرسمية المناسبة لهدفك.`;
  }
  function updateMeta(selector,value){
    const el=document.querySelector(selector);
    if(el&&value)el.setAttribute('content',value);
  }
  function ensureLanguageSwitcher(){
    const nav=document.querySelector('.nav-inner');
    if(!nav||document.getElementById('langSwitcher'))return;
    const select=document.createElement('select');
    select.id='langSwitcher';
    select.className='lang-select';
    select.setAttribute('aria-label','Language');
    nav.appendChild(select);
  }
  function populateLanguageSwitcher(){
    const select=document.getElementById('langSwitcher');
    if(!select)return;
    const names=content.rawSetting('localeNames')||{};
    const fallbacks={ar:'العربية',en:'English',tr:'Türkçe'};
    select.innerHTML=['ar','en','tr'].map(code=>`<option value="${code}">${esc(names[code]||fallbacks[code])}</option>`).join('');
    select.value=currentLang;
  }
  function renderPage(data){
    const id=document.body&&document.body.dataset?document.body.dataset.categoryId:'';
    const area=ExploreDiscovery.areaById(id);
    if(!area)return;
    const lang=currentLang;
    const copy=COPY[lang]||COPY.ar;
    const label=content.localize(area.label,lang);
    const examples=content.localize(area.examples,lang);
    const description=descriptionFor(label,lang);
    const platforms=ExploreDiscovery.filterPlatforms(data.platforms,area);
    const brand=document.querySelector('.brand strong');
    if(brand)brand.textContent=content.setting('siteName',lang)||'Dunya Al-Dawrat';
    const navLinks=document.querySelectorAll('.main-nav a');
    if(navLinks[0])navLinks[0].textContent=copy.home;
    if(navLinks[1])navLinks[1].textContent=copy.platforms;
    const breadcrumbs=document.querySelector('.seo-breadcrumbs');
    if(breadcrumbs){
      breadcrumbs.setAttribute('aria-label',copy.breadcrumb);
      const links=breadcrumbs.querySelectorAll('a');
      if(links[0])links[0].textContent=copy.home;
      if(links[1])links[1].textContent=copy.platforms;
      const last=breadcrumbs.querySelector('span:last-child');
      if(last)last.textContent=label;
    }
    const hero=document.querySelector('.seo-category-hero');
    if(hero){
      const icon=hero.querySelector(':scope > span:first-child');if(icon)icon.textContent=area.icon;
      const h1=hero.querySelector('h1');if(h1)h1.textContent=label;
      const p=hero.querySelector('p');if(p)p.textContent=description;
      const example=hero.querySelector('.seo-category-example');if(example)example.textContent=examples;
    }
    const heading=document.querySelector('.seo-category-section h2');
    if(heading)heading.textContent=`${copy.section} (${platforms.length})`;
    const grid=document.querySelector('.seo-category-grid');
    if(grid){
      grid.innerHTML=platforms.map(platform=>`<a class="seo-platform-link" href="${esc(SeoRoutes.platformUrl(platform,lang))}"><strong>${esc(content.platformName(platform,lang))}</strong><small>${esc(content.platformDescription(platform,lang))}</small></a>`).join('');
    }
    const footerName=document.querySelector('.site-footer strong');
    if(footerName)footerName.textContent=content.setting('siteName',lang)||'Dunya Al-Dawrat';
    const footerText=document.querySelector('.site-footer p');
    if(footerText)footerText.textContent=getText('tagline')||description;
    document.querySelectorAll('a[href="index.html"],a[href="explore.html"]').forEach(link=>{
      const target=new URL(link.getAttribute('href'),location.href);
      target.searchParams.set('lang',lang);
      link.href=target.href;
    });
    document.title=`${label} | ${content.setting('siteName',lang)||'Dunya Al-Dawrat'}`;
    updateMeta('meta[name="description"]',description);
    updateMeta('meta[property="og:description"]',description);
    updateMeta('meta[name="twitter:description"]',description);
    populateLanguageSwitcher();
  }

  async function init(){
    try{
      const params=new URLSearchParams(location.search);
      const data=await DataLoader.loadSiteData();
      initContent(data);
      setLang(resolveInitialLanguage(params.get('lang'),content.rawSetting('defaultLanguage')||'ar'),{persist:false});
      ensureLanguageSwitcher();
      renderPage(data);
      const select=document.getElementById('langSwitcher');
      if(select)select.onchange=event=>{
        setLang(event.target.value);
        const url=new URL(location.href);
        url.searchParams.set('lang',currentLang);
        history.replaceState(null,'',url);
        renderPage(data);
      };
    }catch(error){console.error(error)}
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});
  else init();
})();