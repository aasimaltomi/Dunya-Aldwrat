(function(){
  const COPY={
    ar:{
      landingHeroTitle:'ابحث. قارن. واختر منصة التعلّم الأنسب لك.',
      landingHeroSubtitle:'اكتشف منصات التعلّم في مكان واحد، وقارن بينها حسب المجال واللغة والسعر والشهادات، ثم انتقل مباشرة إلى المصدر الرسمي.',
      heroSearchPlaceholder:'ابحث عن منصة، مجال، مهارة أو موضوع...',
      landingExploreCta:'استكشف منصات التعلّم',
      categoriesTitle:'ماذا تريد أن تتعلّم؟',
      featuredTitle:'منصات تستحق الاستكشاف',
      explorerTitle:'قارن منصات التعلّم واكتشف ما يناسبك'
    },
    en:{
      landingHeroTitle:'Find. Compare. Choose the learning platform that fits you.',
      landingHeroSubtitle:'Discover learning platforms in one place, compare them by field, language, pricing, and certificates, then continue directly to the official source.',
      heroSearchPlaceholder:'Search for a platform, field, skill, or topic...',
      landingExploreCta:'Explore learning platforms',
      categoriesTitle:'What do you want to learn?',
      featuredTitle:'Platforms worth exploring',
      explorerTitle:'Compare learning platforms and find your match'
    },
    tr:{
      landingHeroTitle:'Ara. Karşılaştır. Sana en uygun öğrenme platformunu seç.',
      landingHeroSubtitle:'Öğrenme platformlarını tek yerde keşfet; alan, dil, fiyat ve sertifikalara göre karşılaştır ve doğrudan resmi kaynağa ulaş.',
      heroSearchPlaceholder:'Platform, alan, beceri veya konu ara...',
      landingExploreCta:'Öğrenme platformlarını keşfet',
      categoriesTitle:'Ne öğrenmek istiyorsun?',
      featuredTitle:'Keşfetmeye değer platformlar',
      explorerTitle:'Öğrenme platformlarını karşılaştır, sana uygun olanı bul'
    }
  };

  function lang(){
    const value=(document.documentElement.lang||'ar').toLowerCase();
    return COPY[value]?value:'ar';
  }

  function setText(el,value){if(el&&el.textContent!==value)el.textContent=value}

  function apply(){
    const copy=COPY[lang()];
    Object.entries(copy).forEach(([key,value])=>{
      document.querySelectorAll(`[data-i18n="${key}"]`).forEach(el=>setText(el,value));
      document.querySelectorAll(`[data-i18n-placeholder="${key}"]`).forEach(el=>{if(el.placeholder!==value)el.placeholder=value});
    });
    document.querySelectorAll('.featured-course-cta').forEach(el=>{
      const value=copy.landingExploreCta;
      const first=el.firstChild;
      if(first&&first.nodeType===Node.TEXT_NODE){if(first.nodeValue!==value)first.nodeValue=value}
      else if(el.textContent.trim()!==value){el.insertBefore(document.createTextNode(value),el.firstChild||null)}
    });
  }

  let scheduled=false;
  function schedule(){
    if(scheduled)return;
    scheduled=true;
    queueMicrotask(()=>{scheduled=false;apply()});
  }

  const observer=new MutationObserver(schedule);
  observer.observe(document.documentElement,{subtree:true,childList:true,attributes:true,attributeFilter:['lang']});
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',apply,{once:true});
  else apply();
})();
