const test=require('node:test');
const assert=require('node:assert/strict');
const data=require('../data.json');

function collect(){
  const rows=[];
  for(const p of data.platforms||[]){
    if(p.officialUrl)rows.push({platform:p.id,name:p.name&&p.name.en||p.name&&p.name.ar||p.id,type:'official',field:'',url:p.officialUrl});
    if(p.catalogUrl)rows.push({platform:p.id,name:p.name&&p.name.en||p.name&&p.name.ar||p.id,type:'catalog',field:'',url:p.catalogUrl});
    for(const f of p.fields||[])if(f.officialUrl)rows.push({platform:p.id,name:p.name&&p.name.en||p.name&&p.name.ar||p.id,type:'field',field:f.id,url:f.officialUrl});
  }
  return [...new Map(rows.map(row=>[row.url,row])).values()];
}

async function probe(row){
  const controller=new AbortController();
  const timer=setTimeout(()=>controller.abort(),12000);
  try{
    const res=await fetch(row.url,{
      method:'GET',
      redirect:'follow',
      signal:controller.signal,
      headers:{
        'user-agent':'Mozilla/5.0 (compatible; Dunya-AlDawrat-Link-Audit/1.0)',
        'accept':'text/html,application/xhtml+xml,application/json;q=0.9,*/*;q=0.8'
      }
    });
    clearTimeout(timer);
    const status=res.status;
    const finalUrl=res.url||row.url;
    try{await res.body?.cancel()}catch(_){}
    return {...row,status,finalUrl,kind:(status===404||status===410)?'bad':(status===401||status===403||status===405||status===408||status===409||status===425||status===429||status>=500)?'blocked':'ok'};
  }catch(error){
    clearTimeout(timer);
    return {...row,status:0,finalUrl:'',kind:'blocked',error:String(error&&error.name||error)};
  }
}

test('live audit of every external platform and category URL',async()=>{
  const rows=collect();
  assert.ok(rows.length>=390,'expected roughly 400 unique external links');
  const results=[];
  const concurrency=16;
  let cursor=0;
  async function worker(){
    while(true){
      const i=cursor++;
      if(i>=rows.length)return;
      results[i]=await probe(rows[i]);
    }
  }
  await Promise.all(Array.from({length:concurrency},worker));
  const bad=results.filter(r=>r.kind==='bad');
  const blocked=results.filter(r=>r.kind==='blocked');
  const redirects=results.filter(r=>r.kind==='ok'&&r.finalUrl&&r.finalUrl!==r.url);
  console.log('LIVE_LINK_AUDIT_SUMMARY '+JSON.stringify({checked:results.length,ok:results.length-bad.length-blocked.length,bad:bad.length,blocked:blocked.length,redirected:redirects.length}));
  for(const r of bad)console.log('LIVE_LINK_BAD '+JSON.stringify(r));
  for(const r of blocked)console.log('LIVE_LINK_BLOCKED '+JSON.stringify(r));
  for(const r of redirects)console.log('LIVE_LINK_REDIRECT '+JSON.stringify(r));
  assert.equal(bad.length,0,'found live 404/410 links; see LIVE_LINK_BAD lines');
},{timeout:360000});
