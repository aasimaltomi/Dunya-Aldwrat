const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.join(__dirname, '..');
const data = JSON.parse(fs.readFileSync(path.join(ROOT, 'data.json'), 'utf8'));
const app = fs.readFileSync(path.join(ROOT, 'js', 'app.js'), 'utf8');
const css = fs.readFileSync(path.join(ROOT, 'css', 'style.css'), 'utf8');

const paths = data.quiz?.learningPaths || {};
const platformIds = new Set((data.platforms || []).map((platform) => platform.id));

test('learning-path catalog exposes exactly 20 specialized paths', () => {
  assert.equal(Object.keys(paths).length, 20);
  const expected = [
    'frontend','backend','fullstack','mobile','software-engineering',
    'data-analyst','data-scientist','ai-engineer','machine-learning','cybersecurity',
    'cloud','devops','ui-ux','digital-marketing','entrepreneurship',
    'business-analyst','project-management','english','academic-research','leadership-career'
  ];
  assert.deepEqual(Object.keys(paths), expected);
});

test('every learning path is localized in Arabic English and Turkish and has four valid stages', () => {
  for (const [id, entry] of Object.entries(paths)) {
    assert.ok(entry.label?.ar, `${id} missing Arabic label`);
    assert.ok(entry.label?.en, `${id} missing English label`);
    assert.ok(entry.label?.tr, `${id} missing Turkish label`);
    assert.ok(entry.description?.ar, `${id} missing Arabic description`);
    assert.ok(entry.description?.en, `${id} missing English description`);
    assert.ok(entry.description?.tr, `${id} missing Turkish description`);
    assert.equal(entry.stages?.length, 4, `${id} must have four stages`);
    entry.stages.forEach((stage, index) => {
      assert.ok(Array.isArray(stage) && stage.length >= 2, `${id} stage ${index + 1} needs at least two platforms`);
      stage.forEach((platformId) => assert.ok(platformIds.has(platformId), `${id} references unknown platform ${platformId}`));
    });
  }
});

test('roadmap usage guide and stage labels are localized in all supported languages', () => {
  const guide = data.quiz?.roadmapGuide;
  assert.ok(guide);
  assert.equal(guide.steps?.length, 4);
  for (const key of ['title','subtitle','platformNote']) {
    for (const lang of ['ar','en','tr']) assert.ok(guide[key]?.[lang], `${key} missing ${lang}`);
  }
  guide.steps.forEach((step, index) => {
    for (const lang of ['ar','en','tr']) assert.ok(step?.[lang], `guide step ${index + 1} missing ${lang}`);
  });
  assert.equal(data.quiz?.pathStageLabels?.length, 4);
  data.quiz.pathStageLabels.forEach((label, index) => {
    for (const lang of ['ar','en','tr']) assert.ok(label?.[lang], `stage label ${index + 1} missing ${lang}`);
  });
});

test('premium roadmap explains how to use the roadmap before the stages', () => {
  assert.match(app, /path-usage-guide/);
  assert.match(app, /roadmapGuide/);
  assert.match(app, /pathStageLabels/);
  assert.match(app, /platformNote/);
  assert.match(css, /\.path-usage-guide\{/);
  assert.match(css, /\.path-usage-steps\{/);
  assert.match(css, /\.path-stage-note\{/);
});
