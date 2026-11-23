const fs = require('fs');

const prelimsJsPath = 'C:/Users/HP/.gemini/antigravity/scratch/upsc-mains-evaluator/static/prelims.js';
let js = fs.readFileSync(prelimsJsPath, 'utf8');
const isCrlf = js.includes('\r\n');
js = js.replace(/\r\n/g, '\n');

const searchPattern = `    // 1. Update Segmented Nav Tabs Styling
    document.querySelectorAll('.mock-tab-btn').forEach(function (btn) {
      if (btn.getAttribute('data-format') === format) {
        btn.className = 'mock-tab-btn py-2 px-2 sm:px-3 rounded-xl transition flex items-center justify-center gap-1.5 bg-amber-500 text-slate-950 font-extrabold shadow-md cursor-pointer';
      } else {
        btn.className = 'mock-tab-btn py-2 px-2 sm:px-3 rounded-xl transition flex items-center justify-center gap-1.5 text-slate-400 hover:text-white font-bold cursor-pointer';
      }
    });`;

const replacement = `    // 1. Update Segmented Nav Tabs Styling
    document.querySelectorAll('.mock-tab-btn').forEach(function (btn) {
      if (btn.getAttribute('data-format') === format) {
        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');
      } else {
        btn.classList.remove('active');
        btn.setAttribute('aria-selected', 'false');
      }
    });`;

if (js.includes(searchPattern)) {
  js = js.replace(searchPattern, replacement);
  if (isCrlf) js = js.replace(/\n/g, '\r\n');
  fs.writeFileSync(prelimsJsPath, js, 'utf8');
  console.log('Successfully replaced in prelims.js!');
} else {
  console.error('Could not find search pattern in normalized js!');
}
