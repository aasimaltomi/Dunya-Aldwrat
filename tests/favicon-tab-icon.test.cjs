const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.join(__dirname, '..');
const runtime = require('../js/site-runtime.js');
const pages = ['index.html', 'explore.html', 'platform.html'];

function assetNode(tagName, asset, id = '') {
  return {
    tagName,
    id,
    dataset: { asset },
    attrs: {},
    setAttribute(name, value) {
      this.attrs[name] = value;
      this[name] = value;
    },
    removeAttribute(name) {
      delete this.attrs[name];
      delete this[name];
    },
  };
}

test('browser pages point directly to the dedicated SVG favicon', () => {
  for (const page of pages) {
    const html = fs.readFileSync(path.join(ROOT, page), 'utf8');
    assert.match(
      html,
      /<link id="appFavicon" rel="icon" type="image\/svg\+xml" href="favicon\.svg\?v=20260917">/,
      `${page} should point directly to the dedicated favicon`,
    );
    assert.doesNotMatch(
      html,
      /id="appFavicon"[^>]*data-asset="favicon"/,
      `${page} should not let CMS assets own the browser-tab favicon`,
    );
  }
});

test('runtime forces the browser tab to use the dedicated SVG favicon', () => {
  const favicon = assetNode('LINK', 'favicon', 'appFavicon');
  const brandLogo = assetNode('IMG', 'brandLogo');
  const doc = {
    querySelectorAll(selector) {
      return selector === '[data-asset]' ? [favicon, brandLogo] : [];
    },
  };
  const content = {
    asset(key) {
      if (key === 'favicon') return { src: 'assets/dunya-logo-192.png', alt: 'old favicon' };
      return { src: 'assets/dunya-logo-hero-v3.webp', alt: 'brand logo' };
    },
  };

  runtime.applyAssets(doc, content);

  assert.equal(favicon.href, 'favicon.svg?v=20260917');
  assert.equal(favicon.type, 'image/svg+xml');
  assert.equal(brandLogo.src, 'assets/dunya-logo-hero-v3.webp');
});

test('favicon artwork exists as a compact scalable icon', () => {
  const faviconPath = path.join(ROOT, 'favicon.svg');
  assert.equal(fs.existsSync(faviconPath), true, 'favicon.svg should exist');
  const svg = fs.readFileSync(faviconPath, 'utf8');
  assert.match(svg, /viewBox="0 0 512 512"/);
  assert.match(svg, /<svg[\s>]/);
  assert.match(svg, /#0b1538/i);
  assert.match(svg, /#6d5dfc/i);
  assert.match(svg, /#49dff7/i);
});
