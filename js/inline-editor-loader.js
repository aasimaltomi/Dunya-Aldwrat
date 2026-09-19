(function(root){
  const searchParams=new URLSearchParams(String(root.location&&root.location.search||''));
  const requested=searchParams.get('edit')==='1';
  root.DunyaInlineEditorRequested=requested;
  if(!requested||typeof document==='undefined'){
    root.DunyaInlineEditorReady=Promise.resolve(false);
    return;
  }
  const style=document.createElement('link');
  style.rel='stylesheet';
  style.href='css/inline-editor.css';
  document.head.appendChild(style);
  const assets=[
    'js/edit-descriptors.js',
    'js/inline-editor-config.js',
    'js/inline-editor-api.js',
    'js/inline-editor.js'
  ];
  const loadScript=src=>new Promise((resolve,reject)=>{
    const script=document.createElement('script');
    script.src=src;
    script.onload=()=>resolve(true);
    script.onerror=()=>reject(new Error('Failed to load '+src));
    document.head.appendChild(script);
  });
  root.DunyaInlineEditorReady=assets.reduce(
    (promise,src)=>promise.then(()=>loadScript(src)),
    Promise.resolve()
  ).then(()=>true).catch(error=>{
    if(typeof console!=='undefined'&&console.error)console.error('[InlineEditorLoader]',error);
    return false;
  });
})(typeof globalThis!=='undefined'?globalThis:this);
