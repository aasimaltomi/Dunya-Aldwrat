(function(){
  const COPY={
    ar:{
      unionPresidentTitle:'كلمة رئيس الاتحاد',
      unionPresidentMessage:'نؤمن في اتحاد شباب الأمة بأن تمكين الشباب يبدأ من تسهيل وصولهم إلى المعرفة والفرص التي تساعدهم على بناء مستقبلهم. ومن هذا المنطلق، جاء مشروع دنيا الدورات ليحوّل كثرة الخيارات إلى تجربة أكثر وضوحًا وتنظيمًا، ويمنح الطالب طريقًا أبسط لاكتشاف المنصات التعليمية المناسبة له. ونطمح أن يكون هذا المشروع خطوة عملية ضمن جهود الاتحاد في دعم الطلاب، وتشجيع التعلم المستمر، وتحويل الأفكار الشبابية إلى مبادرات تخدم المجتمع.',
      unionPresidentSignature:'م. بشار محمد الزريقي\nرئيس اتحاد شباب الأمة'
    },
    en:{
      unionPresidentTitle:'Message from the Union President',
      unionPresidentMessage:'At Ummah Youth Union, we believe that empowering young people begins with making knowledge and opportunities easier to access. From this vision, Dunya Al-Dawrat was created to transform the overwhelming number of options into a clearer and more organized experience, helping students discover the learning platforms that best fit their needs. We hope this project will be a practical step within the Union’s efforts to support students, encourage lifelong learning, and turn youth ideas into initiatives that serve the community.',
      unionPresidentSignature:'Eng. Bashar Mohammed Al-Zuraiqi\nPresident of Ummah Youth Union'
    },
    tr:{
      unionPresidentTitle:'Birlik Başkanının Mesajı',
      unionPresidentMessage:'Ümmet Gençleri Birliği olarak, gençleri güçlendirmenin bilgiye ve fırsatlara erişimi kolaylaştırmakla başladığına inanıyoruz. Bu anlayıştan hareketle, Dunya Al-Dawrat projesi çok sayıdaki seçeneği daha açık ve düzenli bir deneyime dönüştürmek, öğrencilerin kendilerine en uygun öğrenme platformlarını daha kolay keşfetmelerine yardımcı olmak amacıyla ortaya çıktı. Bu projenin, birliğimizin öğrencileri destekleme, sürekli öğrenmeyi teşvik etme ve gençlerin fikirlerini topluma hizmet eden girişimlere dönüştürme çabalarının pratik bir adımı olmasını umut ediyoruz.',
      unionPresidentSignature:'Müh. Bashar Mohammed Al-Zuraiqi\nÜmmet Gençleri Birliği Başkanı'
    }
  };

  const PORTRAIT_SRC='assets/union-president.webp';

  function lang(){
    const value=(document.documentElement.lang||'ar').toLowerCase();
    return COPY[value]?value:'ar';
  }

  function apply(){
    const copy=COPY[lang()];
    Object.entries(copy).forEach(([key,value])=>{
      document.querySelectorAll(`[data-i18n="${key}"]`).forEach(el=>{
        if(el.textContent!==value)el.textContent=value;
        if(key==='unionPresidentSignature'){
          el.style.whiteSpace='pre-line';
          el.style.lineHeight='1.7';
        }
      });
    });
    document.querySelectorAll('.union-president-photo').forEach(image=>{
      if(image.getAttribute('src')!==PORTRAIT_SRC)image.setAttribute('src',PORTRAIT_SRC);
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