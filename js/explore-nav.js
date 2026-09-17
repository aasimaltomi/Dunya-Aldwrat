(function(){
  const labels={ar:'الرئيسية',en:'Home',tr:'Ana Sayfa'};
  let filterObserver=null;

  function syncHome(){document.querySelectorAll('[data-home-link]').forEach(link=>{link.href=`index.html?lang=${encodeURIComponent(currentLang||'ar')}`;if(link.matches('[data-i18n="navHome"]'))link.textContent=labels[currentLang]||labels.ar})}

  function applyFiltersFromQuery(){
    const params=new URLSearchParams(location.search),category=params.get('category')||'',query=params.get('q')||'';
    if(!category&&!query)return true;

    const filterCategory=document.getElementById('filterCategory');
    const searchInput=document.getElementById('searchInput');
    const heroSearchInput=document.getElementById('heroSearchInput');

    if(query&&searchInput&&heroSearchInput){
      searchInput.value=query;
      heroSearchInput.value=query;
    }

    const categoryReady=!category||(filterCategory&&filterCategory.options&&[...filterCategory.options].some(option=>option.value===category));
    const queryReady=!query||(searchInput&&heroSearchInput);
    if(!categoryReady||!queryReady)return false;

    if(category){
      filterCategory.value=category;
      filterCategory.dispatchEvent(new Event('change',{bubbles:true}));
    }
    if(query)searchInput.dispatchEvent(new Event('input',{bubbles:true}));
    return true;
  }

  function applyFiltersWhenReady(){
    if(applyFiltersFromQuery())return;
    const filterCategory=document.getElementById('filterCategory');
    if(!filterCategory||typeof MutationObserver==='undefined')return;

    filterObserver=new MutationObserver(()=>{
      if(!applyFiltersFromQuery())return;
      filterObserver.disconnect();
      filterObserver=null;
    });
    filterObserver.observe(filterCategory,{childList:true,subtree:true});
  }

  document.addEventListener('DOMContentLoaded',()=>{syncHome();applyFiltersWhenReady();const lang=document.getElementById('langSwitcher');if(lang)lang.addEventListener('change',()=>setTimeout(syncHome,0))});
})();
