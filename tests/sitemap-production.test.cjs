const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');

const sitemap=fs.readFileSync('sitemap.xml','utf8');
const PROD='https://devmyskilla.vercel.app/';
const TODAY='2026-09-19';

test('sitemap contains exactly 54 unique production URLs',()=>{
  const urls=[...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m=>m[1]);
  assert.equal(urls.length,54);
  assert.equal(new Set(urls).size,54);
  for(const url of urls){
    assert.ok(url.startsWith(PROD),`non-production sitemap URL: ${url}`);
    assert.doesNotMatch(url,/^\/https?:\/\//,`malformed absolute URL: ${url}`);
    assert.doesNotMatch(url,/\s/,`whitespace in sitemap URL: ${url}`);
  }
});

test('every sitemap URL has an accurate lastmod entry for the current release',()=>{
  const blocks=[...sitemap.matchAll(/<url>\s*<loc>([^<]+)<\/loc>\s*<lastmod>([^<]+)<\/lastmod>\s*<\/url>/g)];
  assert.equal(blocks.length,54);
  for(const [,url,lastmod] of blocks){
    assert.equal(lastmod,TODAY,`unexpected lastmod for ${url}`);
  }
});

test('sitemap is rooted at the canonical Vercel origin and robots points to it',()=>{
  assert.doesNotMatch(sitemap,/<loc>\/https?:\/\//);
  const robots=fs.readFileSync('robots.txt','utf8');
  assert.match(robots,/^Sitemap:\s+https:\/\/devmyskilla\.vercel\.app\/sitemap\.xml\s*$/m);
});
