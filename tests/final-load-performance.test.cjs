const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');

const read=p=>fs.readFileSync(p,'utf8');

for(const page of ['index.html','explore.html','platform.html']){
  test(`${page} keeps heavy editor assets off the normal visitor path`,()=>{
    const html=read(page);
    assert.match(html,/js\/inline-editor-loader\.js/);
    assert.doesNotMatch(html,/href="css\/inline-editor\.css"/);
    for(const asset of ['js/edit-descriptors.js','js/inline-editor-config.js','js/inline-editor-api.js','js/inline-editor.js']){
      assert.doesNotMatch(html,new RegExp(`src="${asset.replaceAll('.','\\.')}"`));
    }
  });
}

test('inline editor loader fetches editor assets only when edit=1 is requested',()=>{
  const src=read('js/inline-editor-loader.js');
  assert.match(src,/searchParams\.get\('edit'\)===?'1'/);
  assert.match(src,/css\/inline-editor\.css/);
  for(const asset of ['js/edit-descriptors.js','js/inline-editor-config.js','js/inline-editor-api.js','js/inline-editor.js']){
    assert.ok(src.includes(asset),`loader missing ${asset}`);
  }
  assert.match(src,/DunyaInlineEditorReady/);
});

test('public runtime waits for editor loader only in edit mode',()=>{
  for(const path of ['js/landing.js','js/app.js','js/platform-detail.js']){
    const src=read(path);
    assert.match(src,/DunyaInlineEditorRequested/,`${path} must check edit mode`);
    assert.match(src,/DunyaInlineEditorReady/,`${path} must await editor assets`);
  }
});

test('data and design JSON revalidate instead of bypassing browser cache',()=>{
  assert.match(read('js/data-loader.js'),/cache:\s*'no-cache'/);
  assert.doesNotMatch(read('js/data-loader.js'),/cache:\s*'no-store'/);
  assert.match(read('js/design-runtime.js'),/cache:\s*'no-cache'/);
  assert.doesNotMatch(read('js/design-runtime.js'),/cache:\s*'no-store'/);
});

test('critical public pages preload data.json for earlier hydration',()=>{
  for(const page of ['index.html','explore.html','platform.html']){
    const html=read(page);
    assert.match(html,/rel="preload"[^>]*href="data\.json"[^>]*as="fetch"/);
  }
});

test('service worker serves scripts and styles cache-first-in-practice while revalidating in background',()=>{
  const sw=read('sw.js');
  assert.match(sw,/dunya-al-dawrat-v17/);
  assert.match(sw,/async function staleWhileRevalidate/);
  assert.match(sw,/\['script',\s*'style'\]\.includes\(event\.request\.destination\)[\s\S]*?staleWhileRevalidate/);
  assert.match(sw,/isDataRequest \|\| isAdminConfigRequest[\s\S]*?networkFirst/);
  assert.ok(sw.includes("'./js/inline-editor-loader.js'"));
  for(const asset of [
    './css/inline-editor.css',
    './js/edit-descriptors.js',
    './js/inline-editor-config.js',
    './js/inline-editor-api.js',
    './js/inline-editor.js'
  ]) assert.ok(!sw.includes(`'${asset}'`),`heavy edit-only asset should not be precached: ${asset}`);
});
