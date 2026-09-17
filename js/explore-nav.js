(function(){
  const labels={ar:'الرئيسية',en:'Home',tr:'Ana Sayfa'};
  let filterObserver=null;

  function loadExpandedDiscovery(){
    if(typeof document==='undefined')return;
    if(!document.querySelector('link[data-explore-discovery]')){
      const link=document.createElement('link');
      link.rel='stylesheet';
      link.href='css/explore-discovery.css';
      link.dataset.exploreDiscovery='style';
      document.head.appendChild(link);
    }
    if(!document.querySelector('script[data-explore-discovery]')){
      const script=document.createElement('script');
      script.src='js/explore-discovery.js';
      script.async=false;
      script.dataset.exploreDiscovery='runtime';
      document.head.appendChild(script);
    }
  }

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

  function patchCompareModal(){
    const runtime=typeof window!=='undefined'?window:globalThis;
    if(typeof runtime.buildCompareTable!=='function')return;
    const originalBuildCompareTable=runtime.buildCompareTable;

    runtime.buildCompareTable=function(){
      const selected=typeof getCompare==='function'?[...getCompare()]:[];
      if(selected.length<2){
        const table=document.getElementById('compareTable');
        if(!table)return;
        const limit=typeof maxCompare==='function'?maxCompare():3;
        table.innerHTML=`<div class="no-results compare-empty-state"><strong>${esc(getText('compareBar'))}</strong><small>${selected.length}/${limit} · ${esc(getText('maxCompare'))}</small><button class="btn btn-primary" id="compareBrowse" type="button">${esc(getText('browsePlatforms'))}</button></div>`;
        const browse=document.getElementById('compareBrowse');
        if(browse)browse.onclick=()=>{
          closeModal('compareModal');
          document.querySelector('#explore').scrollIntoView({behavior:'smooth'});
        };
        return;
      }
      return originalBuildCompareTable();
    };
  }

  loadExpandedDiscovery();
  patchCompareModal();
  document.addEventListener('DOMContentLoaded',()=>{syncHome();applyFiltersWhenReady();const lang=document.getElementById('langSwitcher');if(lang)lang.addEventListener('change',()=>setTimeout(syncHome,0))});
})();
