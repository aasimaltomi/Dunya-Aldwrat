const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');

const read=p=>fs.readFileSync(p,'utf8');
const PROD='https://devmyskilla.vercel.app';

test('Decap CMS points at the canonical Vercel production site',()=>{
  const yml=read('admin/config.yml');
  assert.match(yml,/site_url:\s*https:\/\/devmyskilla\.vercel\.app\s*$/m);
  assert.match(yml,/logo_url:\s*https:\/\/devmyskilla\.vercel\.app\/assets\/dunya-logo-192\.png\s*$/m);
  assert.doesNotMatch(yml,/https:\/\/aasimaltomi\.github\.io/);
});

test('inline editor browser config uses the canonical Vercel site origin',()=>{
  const cfg=read('js/inline-editor-config.js');
  const api=read('js/inline-editor-api.js');
  assert.match(cfg,/siteOrigin:'https:\/\/devmyskilla\.vercel\.app'/);
  assert.match(api,/config\.siteOrigin\|\|'https:\/\/devmyskilla\.vercel\.app'/);
  assert.doesNotMatch(cfg,/https:\/\/aasimaltomi\.github\.io/);
  assert.doesNotMatch(api,/https:\/\/devmyskilla\.github\.io/);
});

test('Cloudflare inline Worker only allows the canonical Vercel origin by default and config',()=>{
  const toml=read('inline-worker/wrangler.toml');
  const worker=read('inline-worker/src/worker.mjs');
  assert.match(toml,/ALLOWED_ORIGIN\s*=\s*"https:\/\/devmyskilla\.vercel\.app"/);
  assert.match(worker,/ALLOWED_ORIGIN\|\|'https:\/\/devmyskilla\.vercel\.app'/);
  assert.doesNotMatch(toml,/https:\/\/aasimaltomi\.github\.io/);
  assert.doesNotMatch(worker,/https:\/\/aasimaltomi\.github\.io/);
});

test('inline editor deployment documentation matches production site and repository',()=>{
  const doc=read('docs/inline-editor-setup.md');
  assert.ok(doc.includes(PROD+'/?edit=1'));
  assert.ok(doc.includes('ALLOWED_ORIGIN='+PROD));
  assert.ok(doc.includes('GITHUB_REPO=aasimaltomi/devmyskilla.github.io'));
  assert.doesNotMatch(doc,/https:\/\/devmyskilla\.github\.io/);
  assert.doesNotMatch(doc,/devmyskilla\/devmyskilla\.github\.io/);
});
