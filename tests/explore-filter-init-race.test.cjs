const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');

const ROOT=path.resolve(__dirname,'..');

function makeControl(options=[]){
  return{
    value:'',
    options:options.map(value=>({value})),
    events:[],
    dispatchEvent(event){this.events.push(event.type);return true},
    addEventListener(){}
  };
}

test('homepage discovery filters still apply when Explore controls hydrate after DOMContentLoaded',()=>{
  const source=fs.readFileSync(path.join(ROOT,'js','explore-nav.js'),'utf8');
  const filterCategory=makeControl([]);
  const searchInput=makeControl();
  const heroSearchInput=makeControl();
  const elements={filterCategory,searchInput,heroSearchInput};
  const observers=[];
  const document={
    querySelectorAll(){return[]},
    getElementById(id){return elements[id]||null},
    addEventListener(type,handler){if(type==='DOMContentLoaded')handler()}
  };
  class FakeEvent{constructor(type,options={}){this.type=type;this.bubbles=Boolean(options.bubbles)}}
  class FakeMutationObserver{
    constructor(callback){this.callback=callback;this.disconnected=false;observers.push(this)}
    observe(target,options){this.target=target;this.options=options}
    disconnect(){this.disconnected=true}
  }

  vm.runInNewContext(source,{
    document,
    location:{search:'?category=programming_data&q=data&lang=ar'},
    URLSearchParams,
    Event:FakeEvent,
    MutationObserver:FakeMutationObserver,
    setTimeout(fn){fn()},
    encodeURIComponent,
    currentLang:'ar'
  });

  assert.equal(observers.length,1);
  assert.equal(filterCategory.value,'');

  filterCategory.options=[{value:''},{value:'programming_data'},{value:'business_marketing'},{value:'education'},{value:'languages'}];
  observers[0].callback();

  assert.equal(filterCategory.value,'programming_data');
  assert.equal(searchInput.value,'data');
  assert.equal(heroSearchInput.value,'data');
  assert.deepEqual(filterCategory.events,['change']);
  assert.deepEqual(searchInput.events,['input']);
  assert.equal(observers[0].disconnected,true);
});
