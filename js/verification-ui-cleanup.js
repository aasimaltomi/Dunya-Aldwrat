(function(){
  function labels(){
    const values=[];
    if(typeof getText==='function'){
      values.push(getText('verification'),getText('lastVerified'));
    }
    return new Set(values.filter(Boolean).map(value=>String(value).trim()));
  }

  function removeVerificationUI(root=document){
    root.querySelectorAll('.verification-badge').forEach(node=>node.remove());
    const hiddenLabels=labels();
    if(!hiddenLabels.size)return;

    root.querySelectorAll('.profile-fact').forEach(node=>{
      const label=node.querySelector('span');
      if(label&&hiddenLabels.has(label.textContent.trim()))node.remove();
    });

    root.querySelectorAll('.compare-table tr').forEach(row=>{
      const label=row.querySelector('th');
      if(label&&hiddenLabels.has(label.textContent.trim()))row.remove();
    });
  }

  let scheduled=false;
  function schedule(){
    if(scheduled)return;
    scheduled=true;
    queueMicrotask(()=>{scheduled=false;removeVerificationUI()});
  }

  const observer=new MutationObserver(schedule);
  observer.observe(document.documentElement,{subtree:true,childList:true,attributes:true,attributeFilter:['lang']});
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',removeVerificationUI,{once:true});
  else removeVerificationUI();
})();
