const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');

const BASE = 'https://devmyskilla.vercel.app';
const LEGACY = 'https://aasimaltomi.github.io/devmyskilla.github.io';

function read(path){ return fs.readFileSync(path,'utf8'); }

test('public SEO metadata uses Vercel as the sole canonical origin', () => {
  const expected = {
    'index.html': `${BASE}/`,
    'explore.html': `${BASE}/explore.html`,
    'platform.html': `${BASE}/platform.html`
  };

  for (const [file, canonical] of Object.entries(expected)) {
    const html = read(file);
    assert.ok(html.includes(`rel="canonical" href="${canonical}"`), `${file} canonical`);
    assert.ok(html.includes(`property="og:url" content="${canonical}"`), `${file} og:url`);
    assert.match(html, new RegExp(`property="og:image" content="${BASE.replace(/[.*+?^$\{\}()|[\]\\]/g,'\\$&')}/assets/`));
    assert.doesNotMatch(html, /aasimaltomi\.github\.io\/devmyskilla\.github\.io/);
  }
});

test('robots and sitemap use Vercel origin and root-level admin path', () => {
  const robots = read('robots.txt');
  const sitemap = read('sitemap.xml');

  assert.ok(robots.includes('Disallow: /admin/'));
  assert.ok(robots.includes(`Sitemap: ${BASE}/sitemap.xml`));
  assert.doesNotMatch(robots, /devmyskilla\.github\.io\/admin/);
  assert.doesNotMatch(robots, /aasimaltomi\.github\.io/);

  assert.ok(sitemap.includes(`<loc>${BASE}/</loc>`));
  assert.ok(sitemap.includes(`<loc>${BASE}/explore.html</loc>`));
  for(let i=1;i<=40;i++) {
    assert.ok(sitemap.includes(`<loc>${BASE}/platform.html?id=plat-${i}</loc>`), `missing plat-${i}`);
  }
  assert.doesNotMatch(sitemap, /aasimaltomi\.github\.io/);
});

test('README live site agrees with the canonical Vercel origin', () => {
  const readme = read('README.md');
  assert.ok(readme.includes(`[Dunya Al-Dawrat](${BASE}/)`));
  assert.doesNotMatch(readme, /Live site:\s*\[[^\]]+\]\(https:\/\/aasimaltomi\.github\.io/);
});
