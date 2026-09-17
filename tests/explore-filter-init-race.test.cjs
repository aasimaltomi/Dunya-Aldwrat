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

test('homepage discovery filters still apply when Explore controls hydrate after the old polling window',()=>{
  const source=fs.readFileSync(path.join(ROOT,'js','explore-nav.js'),'utf8');
  const filterCategory=makeControl([]);
  const searchInput=makeControl();
  const heroSearchInput=makeControl();
  const elements={filterCategory,searchInput,heroSearchInput};
  const timers=[];
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
    setTimeout(fn){timers.push(fn)},
    encodeURIComponent,
    currentLang:'ar'
  });

  while(timers.length)timers.shift()();

  filterCategory.options=[{value:''},{value:'programming_data'},{value:'business_marketing'},{value:'education'},{value:'languages'}];

  assert.equal(filterCategory.value,'programming_data');
  assert.equal(searchInput.value,'data');
  assert.equal(heroSearchInput.value,'data');
});
