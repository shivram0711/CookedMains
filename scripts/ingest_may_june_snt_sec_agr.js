const fs = require('fs');
const path = require('path');

const dataFilePath = path.join(__dirname, '..', 'static', 'data', 'current_affairs_pyqs.json');
const existingQuestions = JSON.parse(fs.readFileSync(dataFilePath, 'utf8'));

console.log('Existing questions in database:', existingQuestions.length);

const sntBatch = require('./generate_snt_20.js');
const secAgrBatch = require('./generate_sec_agr_20.js');

const newQuestions = [...sntBatch, ...secAgrBatch];
console.log('New questions to ingest:', newQuestions.length);

const existingIds = new Set(existingQuestions.map(q => q.id));

// Validate every single question
newQuestions.forEach((q, idx) => {
  if (!q.id || existingIds.has(q.id)) {
    throw new Error(`Duplicate or missing id at index ${idx}: ${q.id}`);
  }
  existingIds.add(q.id);

  if (!q.year || typeof q.year !== 'number') {
    throw new Error(`Invalid year at question ${q.id}`);
  }
  if (!q.month || typeof q.month !== 'string') {
    throw new Error(`Invalid month at question ${q.id}`);
  }
  if (!q.subject || !q.sub_topic) {
    throw new Error(`Missing subject/sub_topic at question ${q.id}`);
  }
  if (!q.question || typeof q.question !== 'string') {
    throw new Error(`Missing question at question ${q.id}`);
  }
  if (!Array.isArray(q.options) || q.options.length !== 4) {
    throw new Error(`Options array must have exactly 4 items at question ${q.id}`);
  }
  if (typeof q.correct_index !== 'number' || q.correct_index < 0 || q.correct_index > 3) {
    throw new Error(`Invalid correct_index at question ${q.id}: ${q.correct_index}`);
  }
  if (q.options[q.correct_index] !== q.answer) {
    throw new Error(`Answer mismatch at question ${q.id}: expected "${q.options[q.correct_index]}", got "${q.answer}"`);
  }
  const expectedOptionLetter = ['A', 'B', 'C', 'D'][q.correct_index];
  if (q.correct_option !== expectedOptionLetter) {
    throw new Error(`correct_option mismatch at question ${q.id}: expected ${expectedOptionLetter}, got ${q.correct_option}`);
  }
  if (!q.explanation || typeof q.explanation !== 'string' || q.explanation.length < 50) {
    throw new Error(`Insufficient explanation at question ${q.id}`);
  }
  if (!q.option_analysis || !q.option_analysis['Option A'] || !q.option_analysis['Option B'] || !q.option_analysis['Option C'] || !q.option_analysis['Option D']) {
    throw new Error(`Missing 4-option analysis at question ${q.id}`);
  }
  if (!q.static_root || !q.standard_book_ref || !q.elimination_trap) {
    throw new Error(`Missing static_root, standard_book_ref, or elimination_trap at question ${q.id}`);
  }
  if (!q.question_text) {
    q.question_text = q.question;
  }
});

console.log('✅ All 40 new questions passed strict UPSC GS-1 validation!');

const combinedQuestions = [...existingQuestions, ...newQuestions];

fs.writeFileSync(dataFilePath, JSON.stringify(combinedQuestions, null, 2), 'utf8');
console.log(' Successfully wrote combined database to:', dataFilePath);
console.log('New total questions count:', combinedQuestions.length);

const monthCounts = {};
combinedQuestions.forEach(q => {
  monthCounts[q.month] = (monthCounts[q.month] || 0) + 1;
});
console.log('\n📊 Updated Month-Wise Breakdown:');
console.table(monthCounts);
