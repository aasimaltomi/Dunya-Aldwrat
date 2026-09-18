const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const data = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data.json'), 'utf8'));
const explore = fs.readFileSync(path.join(__dirname, '..', 'explore.html'), 'utf8');

test('verification UI stays hidden while platform-level lastVerified data is unavailable', () => {
  assert.equal(data.platforms.some(platform => Boolean(platform.lastVerified)), false, 'platform-level verification dates unexpectedly exist');
  assert.match(explore, /<select id="filterVerification" hidden><\/select>/, 'verification filter must stay hidden without reliable platform dates');
  assert.doesNotMatch(explore, /<option value="recently_verified"/, 'recently verified sorting must not be offered without reliable platform dates');
});
