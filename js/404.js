(function(){
  const THEME_KEY='dunya-theme-v2';

  function updateTitle(){
    const name=content?content.setting('siteName'):'Dunya Al-Dawrat';
    const title=getText('notFoundTitle')||'Page not found';
    document.title=`${title} | ${name}`;
  }

  function applyPageContent(){
    SiteRuntime.applyContentBindings(document,content);
    updateTitle();
    const lang=document.getElementById('langSwitcher');
    if(lang)lang.value=currentLang;
  }

  function setTheme(theme){
    const next=theme==='dark'?'dark':'light';
    document.documentElement.dataset.theme=next;
    try{localStorage.setItem(THEME_KEY,next)}catch(_){}
    const button=document.getElementById('themeToggle');
    if(button&&content)button.textContent=content.icon(next==='dark'?'themeLight':'themeDark');
  }

  function initTheme(){
    let saved='';
    try{saved=localStorage.getItem(THEME_KEY)||''}catch(_){}
    const preferred=window.matchMedia&&window.matchMedia('(prefers-color-scheme:dark)').matches?'dark':'light';
    setTheme(saved||preferred);
  }

  function bindEvents(){
    const lang=document.getElementById('langSwitcher');
    if(lang)lang.addEventListener('change',event=>{
      setLang(event.target.value);
      applyPageContent();
    });
    const theme=document.getElementById('themeToggle');
    if(theme)theme.addEventListener('click',()=>{
      setTheme(document.documentElement.dataset.theme==='dark'?'light':'dark');
    });
  }

  async function init(){
    try{
      const params=new URLSearchParams(location.search);
      const data=await DataLoader.loadSiteData();
      initContent(data);
      setLang(params.get('lang')||content.rawSetting('defaultLanguage')||'ar');
      SiteRuntime.applyContentBindings(document,content);
      initTheme();
      applyPageContent();
      bindEvents();
    }catch(error){
      console.error(error);
      initTheme();
    }
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});
  else init();
})();
