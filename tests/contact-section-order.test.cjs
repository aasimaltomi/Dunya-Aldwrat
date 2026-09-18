const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.join(__dirname, '..');
const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
const design = JSON.parse(fs.readFileSync(path.join(ROOT, 'design.json'), 'utf8'));

test('contact section remains the final homepage section before the footer', () => {
  const contactIndex = html.indexOf('id="contact"');
  const mainEndIndex = html.indexOf('</main>');
  const footerIndex = html.indexOf('<footer class="site-footer"');

  assert.ok(contactIndex > -1, 'contact section must exist');
  assert.ok(contactIndex < mainEndIndex, 'contact section must stay inside main');
  assert.ok(mainEndIndex < footerIndex, 'footer must follow main');
  assert.equal(design.layout.sectionOrder.at(-1), 'contact');
  assert.equal(design.layout.sectionOrder.filter(id => id === 'contact').length, 1);
});
