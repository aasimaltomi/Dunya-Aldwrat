const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { validateDesign } = require('../js/design-runtime.js');

const ROOT = path.join(__dirname, '..');
const PAGES = ['index.html', 'explore.html', 'platform.html'];

test('design.json is a valid editor-produced public design document', () => {
  const design = JSON.parse(fs.readFileSync(path.join(ROOT, 'design.json'), 'utf8'));
  assert.deepEqual(validateDesign(design), design);
});

test('shared design stylesheet maps only safe design variables with fallbacks', () => {
  const css = fs.readFileSync(path.join(ROOT, 'css', 'design-runtime.css'), 'utf8');

  for (const variable of [
    '--design-primary',
    '--design-secondary',
    '--design-background',
    '--design-surface',
    '--design-text',
    '--design-muted-text',
    '--design-border',
    '--design-base-font-size',
    '--design-heading-scale',
    '--design-body-weight',
    '--design-heading-weight',
    '--design-card-radius',
    '--design-button-radius',
    '--design-border-width',
    '--design-section-gap',
    '--design-card-gap',
    '--design-content-max-width',
  ]) {
    assert.match(css, new RegExp(variable.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  }

  assert.doesNotMatch(css, /url\s*\(|@import|expression\s*\(|javascript:/i);
  assert.match(css, /\[data-design-align="center"\]/);
  assert.match(css, /\[data-design-align="end"\]/);
});

test('all public page shells load the safe design stylesheet and runtime before site runtime', () => {
  for (const page of PAGES) {
    const html = fs.readFileSync(path.join(ROOT, page), 'utf8');
    const designCss = html.indexOf('css/design-runtime.css');
    const designJs = html.indexOf('js/design-runtime.js');
    const siteRuntime = html.indexOf('js/site-runtime.js');

    assert.ok(designCss >= 0, `${page} must load css/design-runtime.css`);
    assert.ok(designJs >= 0, `${page} must load js/design-runtime.js`);
    assert.ok(siteRuntime >= 0, `${page} must load js/site-runtime.js`);
    assert.ok(designJs < siteRuntime, `${page} must load design runtime before site runtime`);
  }
});
