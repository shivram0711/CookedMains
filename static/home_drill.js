// CookedMains Home Daily Prelims Drill Widget
(function () {
  'use strict';

  const STORAGE_STREAK = 'cm_daily_drill_streak';
  const STORAGE_LAST_DATE = 'cm_daily_drill_last_date';
  const STORAGE_ANSWERED_TODAY = 'cm_daily_drill_ans_today';

  function getTodayString() {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }

  function getStreak() {
    try {
      const savedDate = localStorage.getItem(STORAGE_LAST_DATE);
      const savedStreak = parseInt(localStorage.getItem(STORAGE_STREAK) || '1', 10);
      const today = getTodayString();

      if (!savedDate) return 1;
      if (savedDate === today) return savedStreak;

      const prev = new Date(savedDate);
      const now = new Date(today);
      const diffDays = Math.round((now - prev) / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        return savedStreak;
      } else if (diffDays > 1) {
        return 1; // Reset streak if missed a day
      }
      return savedStreak;
    } catch (e) {
      return 1;
    }
  }

  function recordDrillAnswered() {
    try {
      const today = getTodayString();
      const savedDate = localStorage.getItem(STORAGE_LAST_DATE);
      let streak = parseInt(localStorage.getItem(STORAGE_STREAK) || '0', 10);

      if (savedDate !== today) {
        const prev = savedDate ? new Date(savedDate) : null;
        const now = new Date(today);
        const diffDays = prev ? Math.round((now - prev) / (1000 * 60 * 60 * 24)) : 999;

        if (diffDays === 1) streak += 1;
        else streak = 1;

        localStorage.setItem(STORAGE_STREAK, String(streak));
        localStorage.setItem(STORAGE_LAST_DATE, today);
      }
      localStorage.setItem(STORAGE_ANSWERED_TODAY, today);

      const badge = document.getElementById('drillStreakBadge');
      if (badge) badge.textContent = `🔥 ${streak}-Day Streak`;
    } catch (e) {
      console.warn('Could not record streak:', e);
    }
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  async function initDailyDrill() {
    const container = document.getElementById('homeDailyDrillContent');
    const badge = document.getElementById('drillStreakBadge');
    if (!container) return;

    if (badge) {
      badge.textContent = `🔥 ${getStreak()}-Day Streak`;
    }

    try {
      const res = await fetch('/static/data/prelims_pyqs.json');
      if (!res.ok) throw new Error('Failed to fetch questions');
      const pyqs = await res.json();
      if (!pyqs || pyqs.length === 0) return;

      // Deterministic Question of the Day based on calendar day
      const dayOfYear = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24);
      const qIndex = dayOfYear % pyqs.length;
      const q = pyqs[qIndex];

      renderDrillQuestion(container, q);
    } catch (err) {
      console.warn('Could not load Daily Drill question:', err);
      if (container) {
        container.innerHTML = `
          <div class="text-xs text-slate-400 py-3 flex items-center justify-between">
            <span>UPSC Prelims Radar: Over 100+ topic-wise PYQs available.</span>
            <a href="/prelims" class="text-amber-400 font-bold hover:underline">Explore Radar →</a>
          </div>
        `;
      }
    }
  }

  function renderDrillQuestion(container, q) {
    const letters = ['A', 'B', 'C', 'D'];
    const optionsHtml = q.options.map((opt, idx) => `
      <button class="drill-opt-btn w-full text-left p-3 rounded-xl bg-slate-50 hover:bg-slate-100 dark:bg-slate-950 dark:hover:bg-slate-850 border border-slate-200 dark:border-slate-800 text-xs text-slate-800 dark:text-slate-200 transition-all flex items-start gap-2.5 cursor-pointer shadow-xs" data-idx="${idx}">
        <span class="w-5 h-5 rounded-md bg-slate-200 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 flex items-center justify-center text-[10px] font-bold text-amber-700 dark:text-amber-400 shrink-0 font-mono">
          ${letters[idx]}
        </span>
        <span class="flex-1 leading-relaxed">${escapeHtml(opt)}</span>
      </button>
    `).join('');

    container.innerHTML = `
      <div class="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pb-1">
        <span class="font-mono font-bold text-amber-700 dark:text-amber-300">
          [${escapeHtml(q.subject)}] • ${q.year} (${escapeHtml(q.sub_topic)})
        </span>
        <span class="text-[10px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold border border-slate-200 dark:border-slate-700">
          Difficulty: ${escapeHtml(q.difficulty || 'Moderate')}
        </span>
      </div>

      <div class="text-xs sm:text-sm font-semibold text-slate-900 dark:text-slate-100 leading-relaxed whitespace-pre-line py-1">
        ${escapeHtml(q.question_text)}
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1" id="drillOptionsGrid">
        ${optionsHtml}
      </div>

      <!-- Result & Explanation Box (Revealed on click) -->
      <div id="drillResultBox" class="hidden mt-2 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex flex-col gap-2 text-xs">
        <div id="drillVerdictHeader" class="font-bold flex items-center gap-2"></div>
        <div class="text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line text-[11px]" id="drillExplanationText"></div>
        
        <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pt-2 border-t border-slate-200 dark:border-slate-800/80 text-[10px] text-slate-500 dark:text-slate-400">
          <div><strong>📖 Source:</strong> ${escapeHtml(q.standard_book_ref || 'NCERT / Laxmikanth')}</div>
          <div><strong>⚠️ Trap Alert:</strong> ${escapeHtml(q.elimination_trap || 'Carefully verify key assertions')}</div>
        </div>

        ${q.mains_linkage ? `
          <div class="mt-1 p-2 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-between gap-2 text-[11px]">
            <span class="text-amber-800 dark:text-amber-200"><strong>Mains Continuum:</strong> ${escapeHtml(q.mains_linkage.question)}</span>
            <button onclick="window.scrollToEvaluation()" class="shrink-0 px-2.5 py-1 rounded-md bg-amber-500 text-slate-950 font-bold text-[10px] hover:bg-amber-400 transition-all cursor-pointer">
              Upload Copy ↑
            </button>
          </div>
        ` : ''}
      </div>
    `;

    // Add Click Listeners to Options
    const optButtons = container.querySelectorAll('.drill-opt-btn');
    optButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const selectedIdx = parseInt(btn.getAttribute('data-idx'), 10);
        handleDrillSelection(container, q, selectedIdx, optButtons);
      });
    });
  }

  function handleDrillSelection(container, q, selectedIdx, buttons) {
    const isCorrect = selectedIdx === q.correct_index;
    recordDrillAnswered();

    buttons.forEach((btn, idx) => {
      btn.disabled = true;
      btn.classList.remove('hover:bg-slate-850', 'cursor-pointer');
      if (idx === q.correct_index) {
        btn.classList.add('bg-emerald-950/60', 'border-emerald-500/60', 'text-emerald-200');
        btn.querySelector('span:first-child').className = 'w-5 h-5 rounded-md bg-emerald-500 text-slate-950 flex items-center justify-center text-[10px] font-black shrink-0 font-mono';
        btn.querySelector('span:first-child').textContent = '✓';
      } else if (idx === selectedIdx && !isCorrect) {
        btn.classList.add('bg-rose-950/60', 'border-rose-500/60', 'text-rose-200');
        btn.querySelector('span:first-child').className = 'w-5 h-5 rounded-md bg-rose-500 text-white flex items-center justify-center text-[10px] font-black shrink-0 font-mono';
        btn.querySelector('span:first-child').textContent = '✗';
      } else {
        btn.classList.add('opacity-40');
      }
    });

    const resultBox = container.querySelector('#drillResultBox');
    const verdictHeader = container.querySelector('#drillVerdictHeader');
    const explanationText = container.querySelector('#drillExplanationText');

    if (resultBox && verdictHeader && explanationText) {
      resultBox.classList.remove('hidden');
      if (isCorrect) {
        verdictHeader.className = 'font-bold flex items-center gap-1.5 text-emerald-400';
        verdictHeader.innerHTML = `<span>🎉</span> Correct Answer (+2.0 Marks) • Official UPSC Key: Option ${q.correct_option}`;
      } else {
        verdictHeader.className = 'font-bold flex items-center gap-1.5 text-rose-400';
        verdictHeader.innerHTML = `<span>✗</span> Incorrect (-0.66 Penalty) • Official UPSC Key: Option ${q.correct_option}`;
      }
      explanationText.textContent = q.explanation;
    }
  }

  document.addEventListener('DOMContentLoaded', initDailyDrill);
})();
