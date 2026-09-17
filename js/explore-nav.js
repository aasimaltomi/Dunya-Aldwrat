(function(){
  const labels={ar:'الرئيسية',en:'Home',tr:'Ana Sayfa'};
  function syncHome(){document.querySelectorAll('[data-home-link]').forEach(link=>{link.href=`index.html?lang=${encodeURIComponent(currentLang||'ar')}`;if(link.matches('[data-i18n="navHome"]'))link.textContent=labels[currentLang]||labels.ar})}
  function applyFiltersFromQuery(attempt=0){
    const params=new URLSearchParams(location.search),category=params.get('category')||'',query=params.get('q')||'';
    if(!category&&!query)return;
    const filterCategory=document.getElementById('filterCategory');
    const searchInput=document.getElementById('searchInput');
    const heroSearchInput=document.getElementById('heroSearchInput');
    const directoryReady=filterCategory&&filterCategory.options&&filterCategory.options.length>1;
    const categoryReady=!category||(directoryReady&&[...filterCategory.options].some(option=>option.value===category));
    const queryReady=!query||(directoryReady&&searchInput&&heroSearchInput);
    if(!categoryReady||!queryReady){if(attempt<40)setTimeout(()=>applyFiltersFromQuery(attempt+1),50);return}
    if(category){filterCategory.value=category;filterCategory.dispatchEvent(new Event('change',{bubbles:true}))}
    if(query){searchInput.value=query;heroSearchInput.value=query;searchInput.dispatchEvent(new Event('input',{bubbles:true}))}
  }
  document.addEventListener('DOMContentLoaded',()=>{syncHome();applyFiltersFromQuery();const lang=document.getElementById('langSwitcher');if(lang)lang.addEventListener('change',()=>setTimeout(syncHome,0))});
})();
