const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const data = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data.json'), 'utf8'));
const byId = new Map(data.platforms.map(platform => [platform.id, platform]));

const expected = {
  'plat-1':  { pricingModel: 'mixed',    freeCertificate: true,  certificateAvailable: true,  hasFreeContent: true },
  'plat-7':  { pricingModel: 'mixed',    freeCertificate: false, certificateAvailable: true,  hasFreeContent: true },
  'plat-8':  { pricingModel: 'freemium', freeCertificate: false, certificateAvailable: true,  hasFreeContent: true },
  'plat-13': { pricingModel: 'mixed',    freeCertificate: true,  certificateAvailable: true,  hasFreeContent: true },
  'plat-17': { pricingModel: 'freemium', freeCertificate: true,  certificateAvailable: true,  hasFreeContent: true },
  'plat-19': { pricingModel: 'mixed',    freeCertificate: false, certificateAvailable: true,  hasFreeContent: true },
  'plat-24': { pricingModel: 'freemium', freeCertificate: false, certificateAvailable: true,  hasFreeContent: true },
  'plat-26': { pricingModel: 'mixed',    freeCertificate: false, certificateAvailable: true,  hasFreeContent: true },
  'plat-27': { pricingModel: 'mixed',    freeCertificate: true,  certificateAvailable: true,  hasFreeContent: true }
};

test('reviewed platform pricing and certificate metadata matches current product models', () => {
  for (const [id, values] of Object.entries(expected)) {
    const platform = byId.get(id);
    assert.ok(platform, `missing platform ${id}`);
    for (const [key, value] of Object.entries(values)) {
      assert.equal(platform[key], value, `${id} ${key}`);
    }
  }
});

test('Google learning platform uses the current Google Skills identity', () => {
  const platform = byId.get('plat-24');
  assert.deepEqual(platform.name, { ar: 'Google Skills', en: 'Google Skills', tr: 'Google Skills' });
  assert.deepEqual(platform.logo.alt, { ar: 'Google Skills', en: 'Google Skills', tr: 'Google Skills' });
  assert.match(platform.logo.src, /skills\.google/);
});

test('pricing descriptions do not retain the reviewed false all-free claims', () => {
  const nvidia = byId.get('plat-13');
  const coursera = byId.get('plat-26');
  const google = byId.get('plat-24');

  assert.doesNotMatch(nvidia.description.en, /all courses are free/i);
  assert.doesNotMatch(coursera.description.en, /content is completely free/i);
  assert.match(google.description.en, /Google Skills/);
});

test('Khan Academy remains fully free without course completion certificates', () => {
  const platform = byId.get('plat-20');
  assert.equal(platform.pricingModel, 'free');
  assert.equal(platform.hasFreeContent, true);
  assert.equal(platform.certificateAvailable, false);
  assert.equal(platform.freeCertificate, false);
});
