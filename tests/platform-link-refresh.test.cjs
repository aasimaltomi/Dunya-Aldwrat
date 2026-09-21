const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const data = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data.json'), 'utf8'));
const byId = new Map(data.platforms.map(platform => [platform.id, platform]));

const expected = {
  'plat-2': 'https://agora.unicef.org/local/catalogue/index.php',
  'plat-3': 'https://skillsbuild.org/learning-catalog/university-catalog',
  'plat-4': 'https://www.theforage.com/simulations',
  'plat-9': 'https://event.unitar.org/full-catalog',
  'plat-10': 'https://e.huawei.com/en/talent/learning/',
  'plat-11': 'https://www.aucegypt.edu/academics/free-english-courses',
  'plat-23': 'https://learn.github.com/skills',
  'plat-30': 'https://satr.tuwaiq.edu.sa',
  'plat-33': 'https://rwaq.org/courses/',
  'plat-34': 'https://www.datacamp.com/courses-all',
  'plat-36': 'https://www.btkakademi.gov.tr/portal/catalog',
  'plat-37': 'https://matlabacademy.mathworks.com/'
};

test('launch-critical platform links use their current canonical destinations', () => {
  for (const [id, url] of Object.entries(expected)) {
    const platform = byId.get(id);
    assert.ok(platform, `missing platform ${id}`);
    assert.equal(platform.officialUrl, url, `${id} officialUrl`);
    assert.equal(platform.catalogUrl, url, `${id} catalogUrl`);
  }
});
