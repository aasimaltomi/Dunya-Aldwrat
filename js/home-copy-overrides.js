(function(){
  const COPY={
    ar:{
      landingHeroTitle:'ابحث. قارن. واختر منصة التعلّم الأنسب لك.',
      landingHeroSubtitle:'اكتشف منصات التعلّم في مكان واحد، وقارن بينها حسب المجال واللغة والسعر والشهادات، ثم انتقل مباشرة إلى المصدر الرسمي.',
      heroSearchPlaceholder:'ابحث عن منصة، مجال، مهارة أو موضوع...',
      landingExploreCta:'استكشف منصات التعلّم',
      categoriesTitle:'ماذا تريد أن تتعلّم؟',
      featuredTitle:'منصات تستحق الاستكشاف',
      explorerTitle:'قارن منصات التعلّم واكتشف ما يناسبك',
      landingWhatEyebrow:'ما هي دنيا الدورات؟',
      landingWhatTitle:'دليلك لاكتشاف ومقارنة منصات التعلّم في مكان واحد',
      landingWhatText:'دنيا الدورات تجمع لك معلومات منصات التعلّم في مكان واحد، لتبحث وتقارن بينها حسب المجال واللغة والسعر والشهادات، ثم تنتقل مباشرة إلى المصدر الرسمي للمنصة التي تناسبك.',
      landingNotMarketplace:'نحن لا نبيع الدورات ولا نصدر شهادات؛ مهمتنا أن نساعدك على الوصول إلى المنصة المناسبة.',
      landingWhyEyebrow:'لماذا أنشأنا دنيا الدورات؟',
      landingWhyTitle:'لأن اختيار منصة التعلّم المناسبة لا يجب أن يكون معقدًا',
      landingWhyText:'أنشأنا دنيا الدورات لتقليل التشتت بين عشرات المنصات، وتسهيل اكتشاف فرص التعلّم، ومساعدة الطالب على اتخاذ قرار أوضح بناءً على احتياجاته الفعلية.',
      landingHowEyebrow:'كيف تعمل دنيا الدورات؟',
      landingHowTitle:'من هدفك إلى المنصة المناسبة بخطوات بسيطة',
      problemMany:'خيارات كثيرة، ونقطة البداية غير واضحة',
      problemPrice:'ما الذي يمكنك تعلّمه مجانًا؟',
      problemCert:'هل توفر المنصة اللغة والشهادة التي تحتاجها؟',
      problemCompare:'لا حاجة لفتح عشرات المواقع للمقارنة'
    },
    en:{
      landingHeroTitle:'Find. Compare. Choose the learning platform that fits you.',
      landingHeroSubtitle:'Discover learning platforms in one place, compare them by field, language, pricing, and certificates, then continue directly to the official source.',
      heroSearchPlaceholder:'Search for a platform, field, skill, or topic...',
      landingExploreCta:'Explore learning platforms',
      categoriesTitle:'What do you want to learn?',
      featuredTitle:'Platforms worth exploring',
      explorerTitle:'Compare learning platforms and find your match',
      landingWhatEyebrow:'What is Dunya Al-Dawrat?',
      landingWhatTitle:'Your guide to discovering and comparing learning platforms in one place',
      landingWhatText:'Dunya Al-Dawrat brings learning-platform information into one place, so you can search and compare by field, language, pricing, and certificates, then go directly to the official source of the platform that suits you.',
      landingNotMarketplace:'We do not sell courses or issue certificates; our role is to help you reach the platform that fits you.',
      landingWhyEyebrow:'Why did we build Dunya Al-Dawrat?',
      landingWhyTitle:'Choosing the right learning platform should not be complicated',
      landingWhyText:'We built Dunya Al-Dawrat to reduce the confusion of navigating dozens of platforms, make learning opportunities easier to discover, and help students make clearer decisions based on their actual needs.',
      landingHowEyebrow:'How does Dunya Al-Dawrat work?',
      landingHowTitle:'From your goal to the right platform in a few simple steps',
      problemMany:'Too many choices, and no clear starting point',
      problemPrice:'What can you learn for free?',
      problemCert:'Does the platform offer the language and certificate you need?',
      problemCompare:'No need to open dozens of sites to compare'
    },
    tr:{
      landingHeroTitle:'Ara. Karşılaştır. Sana en uygun öğrenme platformunu seç.',
      landingHeroSubtitle:'Öğrenme platformlarını tek yerde keşfet; alan, dil, fiyat ve sertifikalara göre karşılaştır ve doğrudan resmi kaynağa ulaş.',
      heroSearchPlaceholder:'Platform, alan, beceri veya konu ara...',
      landingExploreCta:'Öğrenme platformlarını keşfet',
      categoriesTitle:'Ne öğrenmek istiyorsun?',
      featuredTitle:'Keşfetmeye değer platformlar',
      explorerTitle:'Öğrenme platformlarını karşılaştır, sana uygun olanı bul',
      landingWhatEyebrow:'Dunya Al-Dawrat nedir?',
      landingWhatTitle:'Öğrenme platformlarını tek yerde keşfetme ve karşılaştırma rehberiniz',
      landingWhatText:'Dunya Al-Dawrat, öğrenme platformlarına ait bilgileri tek yerde toplar; alan, dil, fiyat ve sertifikalara göre arama ve karşılaştırma yapmanıza, ardından size uygun platformun resmi kaynağına doğrudan gitmenize yardımcı olur.',
      landingNotMarketplace:'Kurs satmıyor veya sertifika vermiyoruz; görevimiz size uygun platforma ulaşmanıza yardımcı olmak.',
      landingWhyEyebrow:"Dunya Al-Dawrat'ı neden geliştirdik?",
      landingWhyTitle:'Doğru öğrenme platformunu seçmek karmaşık olmamalı',
      landingWhyText:"Dunya Al-Dawrat'ı onlarca platform arasındaki karmaşayı azaltmak, öğrenme fırsatlarını keşfetmeyi kolaylaştırmak ve öğrencilerin gerçek ihtiyaçlarına göre daha net kararlar almasına yardımcı olmak için geliştirdik.",
      landingHowEyebrow:'Dunya Al-Dawrat nasıl çalışır?',
      landingHowTitle:'Hedefinizden doğru platforma birkaç basit adımda',
      problemMany:'Çok fazla seçenek, başlangıç noktası belirsiz',
      problemPrice:'Neleri ücretsiz öğrenebilirsiniz?',
      problemCert:'Platform ihtiyacınız olan dili ve sertifikayı sunuyor mu?',
      problemCompare:'Karşılaştırmak için onlarca site açmanıza gerek yok'
    }
  };

  function lang(){
    const value=(document.documentElement.lang||'ar').toLowerCase();
    return COPY[value]?value:'ar';
  }

  function setText(el,value){if(el&&el.textContent!==value)el.textContent=value}

  function apply(){
    const trust=document.querySelector('.hero-trust');
    if(trust)trust.remove();

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
