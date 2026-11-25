const fs = require('fs');
const path = require('path');

const prelimsJsPath = path.join(__dirname, '..', 'static', 'prelims.js');
const prelimsHtmlPath = path.join(__dirname, '..', 'static', 'prelims.html');

let js = fs.readFileSync(prelimsJsPath, 'utf8');

// 1. Update renderVaultCaPills
const targetPill = `        '<button type="button" class="vault-ca-month-pill ' + btnClass + '" data-month="' + m.id + '" onclick="window.setVaultCaMonth(\\'' + m.id + '\\')">' +
          m.label +
        '</button>'`;

const replacementPill = `        '<button type="button" class="vault-ca-month-pill ' + btnClass + '" data-month="' + m.id + '" onclick="window.setVaultCaMonth(\\'' + m.id + '\\')">' +
          m.label + ' (' + count + ')' +
        '</button>'`;

if (js.includes(targetPill)) {
  js = js.replace(targetPill, replacementPill);
  console.log('Successfully patched vault pill count');
} else {
  console.log('Target vault pill not matched directly, trying fallback');
  js = js.replace(/m\.label \+\r?\n\s+'<\/button>'/g, "m.label + ' (' + count + ')' +\n        '</button>'");
}

// 2. Update renderCurrentAffairsArena
const oldHeaderBadges = `    var caQuestions = STATE.ca_pyqs || [];
    var totalCaCount = caQuestions.length || 230;

    // Dynamically update header badges and labels
    var badge = document.getElementById('caArenaHeaderBadge');
    if (badge) badge.textContent = '10 Monthly Dossiers';
    var subtext = document.getElementById('caDossiersCountSubtext');
    if (subtext) subtext.textContent = '10 Comprehensive Dossiers';
    var allBtn = document.getElementById('caMonthPillAll');
    if (allBtn) allBtn.textContent = 'All Months';

    // Render 7 Monthly Dossier Hub Cards
    cardsGrid.innerHTML = MONTHLY_DOSSIERS_METADATA.map(function (meta) {
      return (
        '<div class="light-card p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col justify-between gap-4 transition-all hover:border-emerald-500/50 group">' +
          '<div class="flex flex-col gap-3">' +
            '<div class="flex items-center justify-between gap-2">' +
              '<div class="flex items-center gap-2.5">' +
                '<span class="text-2xl">' + meta.icon + '</span>' +
                '<div>' +
                  '<h3 class="text-sm font-black text-white group-hover:text-emerald-400 transition">' + escapeHtml(meta.month) + '</h3>' +
                  '<span class="text-[10px] text-slate-400 font-mono">' + escapeHtml(meta.leadTheme) + '</span>' +
                '</div>' +
              '</div>' +
            '</div>'`;

const newHeaderBadges = `    var caQuestions = STATE.ca_pyqs || [];
    var totalCaCount = caQuestions.length || 278;

    // Dynamically update header badges and labels
    var badge = document.getElementById('caArenaHeaderBadge');
    if (badge) badge.textContent = '10 Monthly Dossiers • ' + totalCaCount + ' Qs';
    var subtext = document.getElementById('caDossiersCountSubtext');
    if (subtext) subtext.textContent = '10 Comprehensive Dossiers (' + totalCaCount + ' Authentic Questions)';
    var allBtn = document.getElementById('caMonthPillAll');
    if (allBtn) allBtn.textContent = 'All Months (' + totalCaCount + ' Qs)';

    // Update individual pills with live question counts
    var pills = document.querySelectorAll('.ca-month-pill[data-month]');
    pills.forEach(function (btn) {
      var mId = btn.getAttribute('data-month');
      if (mId && mId !== 'all') {
        var count = caQuestions.filter(function (q) { return q.month === mId; }).length;
        var iconPrefix = btn.textContent.split('(')[0].trim();
        btn.textContent = iconPrefix + ' (' + count + ' Qs)';
      }
    });

    // Render 10 Monthly Dossier Hub Cards
    cardsGrid.innerHTML = MONTHLY_DOSSIERS_METADATA.map(function (meta) {
      var monthCount = caQuestions.filter(function (q) { return q.month === meta.month; }).length;
      return (
        '<div class="light-card p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col justify-between gap-4 transition-all hover:border-emerald-500/50 group">' +
          '<div class="flex flex-col gap-3">' +
            '<div class="flex items-center justify-between gap-2">' +
              '<div class="flex items-center gap-2.5">' +
                '<span class="text-2xl">' + meta.icon + '</span>' +
                '<div>' +
                  '<h3 class="text-sm font-black text-white group-hover:text-emerald-400 transition">' + escapeHtml(meta.month) + '</h3>' +
                  '<span class="text-[10px] text-slate-400 font-mono">' + escapeHtml(meta.leadTheme) + '</span>' +
                '</div>' +
              '</div>' +
              '<span class="px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[10px] font-mono font-bold shrink-0">' + monthCount + ' Qs</span>' +
            '</div>'`;

// Normalize CRLF to LF for matching
const jsNorm = js.replace(/\r\n/g, '\n');
const oldNorm = oldHeaderBadges.replace(/\r\n/g, '\n');

if (jsNorm.includes(oldNorm)) {
  js = jsNorm.replace(oldNorm, newHeaderBadges);
  console.log('Successfully patched renderCurrentAffairsArena');
} else {
  console.log('Warning: could not find exact oldHeaderBadges block');
}

const now = Date.now().toString();
js = js.replace(/prelims\.js\?v=\d+/g, 'prelims.js?v=' + now);
js = js.replace(/current_affairs_pyqs\.json\?v=\d+/g, 'current_affairs_pyqs.json?v=' + now);
fs.writeFileSync(prelimsJsPath, js, 'utf8');

let html = fs.readFileSync(prelimsHtmlPath, 'utf8');
html = html.replace('105 Questions</span>', '278 Questions</span>');
html = html.replace(/prelims\.js\?v=\d+/g, 'prelims.js?v=' + now);
html = html.replace(/current_affairs_pyqs\.json\?v=\d+/g, 'current_affairs_pyqs.json?v=' + now);
fs.writeFileSync(prelimsHtmlPath, html, 'utf8');

console.log('Done patching frontend files. Version token:', now);
