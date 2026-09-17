const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.join(__dirname, '..');
const html = fs.readFileSync(path.join(ROOT, 'explore.html'), 'utf8');
const app = fs.readFileSync(path.join(ROOT, 'js', 'app.js'), 'utf8');
const css = fs.readFileSync(path.join(ROOT, 'css', 'style.css'), 'utf8');

test('Explore promotes the learning-path action as a premium CTA', () => {
  assert.match(html, /<button class="[^"]*path-premium-trigger[^"]*" id="pathBtn"/);
  assert.match(html, /class="modal-card modal-large path-modal-card"/);
  assert.match(html, /class="path-modal-hero"/);
});

test('learning path builder uses visual goal cards instead of a select', () => {
  assert.match(app, /path-goal-grid/);
  assert.match(app, /data-path-goal=/);
  assert.match(app, /path-goal-card/);
  assert.doesNotMatch(app, /<select id="pathGoal"/);
});

test('generated learning path renders a visual roadmap with platform cards', () => {
  assert.match(app, /path-roadmap/);
  assert.match(app, /path-step-card/);
  assert.match(app, /path-step-connector/);
  assert.match(app, /path-platform-card/);
  assert.match(app, /path-platform-action/);
});

test('premium path experience is responsive and dark-theme aware', () => {
  assert.match(css, /\.path-premium-trigger\{/);
  assert.match(css, /\.path-goal-grid\{/);
  assert.match(css, /\.path-roadmap\{/);
  assert.match(css, /\.path-step-card\{/);
  assert.match(css, /\.path-platform-card\{/);
  assert.match(css, /:root\[data-theme="dark"\][^\n]*\.path-modal-card/);
  assert.match(css, /@media\(max-width:680px\)[^\n]*\.path-goal-grid/);
});
