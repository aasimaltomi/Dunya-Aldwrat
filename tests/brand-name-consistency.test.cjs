const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const data = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data.json'), 'utf8'));
const byId = new Map(data.platforms.map(platform => [platform.id, platform]));

test('site English brand name is consistent with the public identity', () => {
  assert.equal(data.settings.siteName.en, 'Dunya Al-Dawrat');
});

test('selected platform names use their official brand casing', () => {
  const expected = {
    'plat-3': 'IBM SkillsBuild',
    'plat-7': 'edX',
    'plat-8': 'Codecademy',
    'plat-13': 'NVIDIA',
    'plat-17': 'Sololearn',
    'plat-19': 'W3Schools',
    'plat-27': 'Simplilearn'
  };
  for (const [id, name] of Object.entries(expected)) {
    const platform = byId.get(id);
    assert.ok(platform, `missing platform ${id}`);
    assert.deepEqual(platform.name, { ar: name, en: name, tr: name }, `${id} name`);
  }
});
