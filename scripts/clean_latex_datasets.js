const fs = require('fs');
const path = require('path');

function cleanLatexString(str) {
  if (typeof str !== 'string') return str;
  let s = str;

  // 1. Ordinals like $26^{\text{th}}$, $1^{\text{st}}$, $2^{\text{nd}}$, $3^{\text{rd}}$
  s = s.replace(/\$(\d+)\s*\^\s*\{\s*\\text\{\s*(st|nd|rd|th)\s*\}\s*\}\$/gi, '$1$2');
  s = s.replace(/\$(\d+)\s*\^\s*(st|nd|rd|th)\$/gi, '$1$2');

  // 2. Degrees like $23.5^\circ$, $90^\circ$, 90^\circ
  s = s.replace(/\$(\d+(?:\.\d+)?)\s*\^\s*\\circ\$/g, '$1°');
  s = s.replace(/\\theta\s*=\s*90\s*\^\s*\\circ/g, 'θ = 90°');
  s = s.replace(/\\theta\s*=\s*0\s*\^\s*\\circ/g, 'θ = 0°');
  s = s.replace(/\\sin\(90\s*\^\s*\\circ\)\s*=\s*1/g, 'sin(90°) = 1');
  s = s.replace(/\\sin\(0\s*\^\s*\\circ\)\s*=\s*0/g, 'sin(0°) = 0');

  // 3. Common physics/chemistry inline formulas
  s = s.replace(/\$F_c\s*=\s*2mv\\Omega\s*\\sin\\theta\$/g, 'Fc = 2mvΩ sin θ');
  s = s.replace(/\$F_c\s*\\propto\s*v\$/g, 'Fc ∝ v');
  s = s.replace(/\$\\sin\\theta\$/g, 'sin θ');
  s = s.replace(/\$\\theta\$/g, 'θ');

  // Chemical formulas
  s = s.replace(/\$2\\text\{H\}_2\s*\+\s*\\text\{O\}_2\s*\\rightarrow\s*2\\text\{H\}_2\\text\{O\}\$/g, '2H₂ + O₂ → 2H₂O');
  s = s.replace(/\$\\text\{H\}_2\\text\{O\}_2\$/g, 'H₂O₂');
  s = s.replace(/\$\\text\{H\}_2\\text\{O\}\$/g, 'H₂O');
  s = s.replace(/\$\\text\{H\}_3\\text\{O\}\^\+\$/g, 'H₃O⁺');
  s = s.replace(/\$CO\(NH_2\)_2\$/g, 'CO(NH₂)₂');
  s = s.replace(/\$NH_3\$/g, 'NH₃');
  s = s.replace(/\$H_2\$/g, 'H₂');

  // 4. Generic fallback for any remaining $\text{...}$ or $...^\circ$
  s = s.replace(/\$\\text\{([^}]+)\}\$/g, '$1');
  s = s.replace(/\\text\{([^}]+)\}/g, '$1');

  return s;
}

function walkAndClean(obj) {
  let changes = 0;
  if (typeof obj === 'string') {
    const cleaned = cleanLatexString(obj);
    return { val: cleaned, changes: cleaned !== obj ? 1 : 0 };
  }
  if (Array.isArray(obj)) {
    const out = [];
    for (const item of obj) {
      const res = walkAndClean(item);
      out.push(res.val);
      changes += res.changes;
    }
    return { val: out, changes };
  }
  if (obj && typeof obj === 'object') {
    const out = {};
    for (const k of Object.keys(obj)) {
      const res = walkAndClean(obj[k]);
      out[k] = res.val;
      changes += res.changes;
    }
    return { val: out, changes };
  }
  return { val: obj, changes: 0 };
}

const files = [
  'prelims_pyqs.json',
  'current_affairs_pyqs.json',
  'upsc_other_exams_pyqs.json',
  'ai_mock_questions_2026.json'
];

for (const f of files) {
  const fullPath = path.join(__dirname, '..', 'static', 'data', f);
  if (!fs.existsSync(fullPath)) continue;
  const data = JSON.parse(fs.readFileSync(fullPath, 'utf8'));
  const res = walkAndClean(data);
  if (res.changes > 0) {
    fs.writeFileSync(fullPath, JSON.stringify(res.val, null, 2), 'utf8');
    console.log(`✅ Cleaned ${res.changes} field(s) in ${f}`);
  } else {
    console.log(`✓ No LaTeX artifacts found in ${f}`);
  }
}
