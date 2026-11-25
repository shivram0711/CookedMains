const fs = require('fs');

const b1 = require('./batch_ca_gov.js');
const b2 = require('./batch_ca_pol.js');
const b3 = require('./batch_ca_part3.js');
const b4 = require('./batch_ca_part4.js');

const allNew = [...b1, ...b2, ...b3, ...b4];
console.log('Total new questions formulated:', allNew.length);

const jsonPath = 'C:/Users/HP/.gemini/antigravity/scratch/upsc-mains-evaluator/static/data/current_affairs_pyqs.json';
const existing = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
console.log('Existing CA questions count:', existing.length);

const existingIds = new Set(existing.map(q => q.id));

allNew.forEach((q, idx) => {
  // Validate ID uniqueness
  if (existingIds.has(q.id)) {
    throw new Error(`ID collision detected: ${q.id} at index ${idx}`);
  }
  existingIds.add(q.id);

  // Validate fields
  if (!q.id || !q.year || !q.month || !q.subject || !q.question_text) {
    throw new Error(`Missing mandatory field in question ${q.id}`);
  }
  if (!q.options || q.options.length !== 4) {
    throw new Error(`Options array must have exactly 4 items in question ${q.id}`);
  }
  const letters = ['A', 'B', 'C', 'D'];
  if (letters[q.correct_index] !== q.correct_option) {
    throw new Error(`correct_index ${q.correct_index} does not match correct_option ${q.correct_option} in question ${q.id}`);
  }
  if (!q.explanation || !q.standard_book_ref || !q.elimination_trap || !q.static_root) {
    throw new Error(`Missing pedagogical metadata in question ${q.id}`);
  }
});

console.log('All 44 new questions passed validation 100%!');

// Merge
const merged = [...existing, ...allNew];
fs.writeFileSync(jsonPath, JSON.stringify(merged, null, 2), 'utf8');
console.log('Successfully wrote merged dataset! Total questions now:', merged.length);

// Update cache buster in prelims.html
const htmlPath = 'C:/Users/HP/.gemini/antigravity/scratch/upsc-mains-evaluator/static/prelims.html';
let html = fs.readFileSync(htmlPath, 'utf8');
const now = Date.now();

// Update prelims.js cache token
html = html.replace(/src="\/static\/prelims\.js\?v=\d+"/, `src="/static/prelims.js?v=${now}"`);
// Update current_affairs_pyqs.json cache token in prelims.js
const jsPath = 'C:/Users/HP/.gemini/antigravity/scratch/upsc-mains-evaluator/static/prelims.js';
let js = fs.readFileSync(jsPath, 'utf8');
js = js.replace(/current_affairs_pyqs\.json\?v=[^']+'/, `current_affairs_pyqs.json?v=${merged.length}qs_${now}'`);

fs.writeFileSync(htmlPath, html, 'utf8');
fs.writeFileSync(jsPath, js, 'utf8');
console.log('Updated cache tokens in prelims.html and prelims.js to', now);
