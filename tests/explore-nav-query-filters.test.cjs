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

test('explore navigation applies category and search query from homepage discovery link',()=>{
  const source=fs.readFileSync(path.join(ROOT,'js','explore-nav.js'),'utf8');
  const filterCategory=makeControl(['','programming_data','business_marketing','education','languages']);
  const searchInput=makeControl();
  const heroSearchInput=makeControl();
  const elements={filterCategory,searchInput,heroSearchInput};
  const document={
    querySelectorAll(){return[]},
    getElementById(id){return elements[id]||null},
    addEventListener(type,handler){if(type==='DOMContentLoaded')handler()}
  };
  class FakeEvent{constructor(type,options={}){this.type=type;this.bubbles=Boolean(options.bubbles)}}

  vm.runInNewContext(source,{
    document,
    location:{search:'?category=programming_data&q=data&lang=ar'},
    URLSearchParams,
    Event:FakeEvent,
    setTimeout(fn){fn()},
    encodeURIComponent,
    currentLang:'ar'
  });

  assert.equal(filterCategory.value,'programming_data');
  assert.equal(searchInput.value,'data');
  assert.equal(heroSearchInput.value,'data');
  assert.deepEqual(filterCategory.events,['change']);
  assert.deepEqual(searchInput.events,['input']);
});
