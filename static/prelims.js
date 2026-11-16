/**
 * CookedMains — Prelims Radar Engine (prelims.js)
 * 100% Client-Side • Zero Database Load • Offline-First LocalStorage
 * Features:
 *   - 14-Year PYQ Practice & Exam Modes
 *   - Risk vs. Attempt "Sweet Spot" Expected Value (EV) Optimizer
 *   - Self-Clearing Personal Mistakes Notebook
 *   - "Why I Got It Wrong" Behavioral Diagnostics
 *   - Prelims-to-Mains Continuum (Direct 1-Click Bridge)
 */

(function () {
  'use strict';

  // State Management
  const STATE = {
    pyqs: [],
    filteredPyqs: [],
    activeSubject: 'all',
    activeView: 'all', // 'all' | 'mistakes' | 'guesses'
    activeMode: 'practice', // 'practice' | 'exam'
    answers: {}, // { [qId]: { selectedIndex, isCorrect, confidence, reason } }
    mistakes: new Set(),
    flukes: new Set(),
    diagnostics: {
      concept: 0,
      silly: 0,
      elimination: 0,
      memory: 0
    }
  };

  // LocalStorage Keys
  const STORAGE_KEYS = {
    ANSWERS: 'cookedmains_prelims_answers_v1',
    MISTAKES: 'cookedmains_prelims_mistakes_v1',
    FLUKES: 'cookedmains_prelims_flukes_v1',
    DIAGNOSTICS: 'cookedmains_prelims_diagnostics_v1'
  };

  // Load Persisted LocalStorage Data
  function loadPersistedState() {
    try {
      const savedAnswers = localStorage.getItem(STORAGE_KEYS.ANSWERS);
      if (savedAnswers) STATE.answers = JSON.parse(savedAnswers);

      const savedMistakes = localStorage.getItem(STORAGE_KEYS.MISTAKES);
      if (savedMistakes) STATE.mistakes = new Set(JSON.parse(savedMistakes));

      const savedFlukes = localStorage.getItem(STORAGE_KEYS.FLUKES);
      if (savedFlukes) STATE.flukes = new Set(JSON.parse(savedFlukes));

      const savedDiag = localStorage.getItem(STORAGE_KEYS.DIAGNOSTICS);
      if (savedDiag) STATE.diagnostics = JSON.parse(savedDiag);
    } catch (e) {
      console.warn('Could not load stored Prelims state from localStorage:', e);
    }
  }

  // Save to LocalStorage
  function persistState() {
    try {
      localStorage.setItem(STORAGE_KEYS.ANSWERS, JSON.stringify(STATE.answers));
      localStorage.setItem(STORAGE_KEYS.MISTAKES, JSON.stringify(Array.from(STATE.mistakes)));
      localStorage.setItem(STORAGE_KEYS.FLUKES, JSON.stringify(Array.from(STATE.flukes)));
      localStorage.setItem(STORAGE_KEYS.DIAGNOSTICS, JSON.stringify(STATE.diagnostics));
    } catch (e) {
      console.warn('Could not save Prelims state to localStorage:', e);
    }
  }

  // Escape HTML helper
  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // Fetch Questions from static JSON
  async function initQuestions() {
    const container = document.getElementById('questionsContainer');
    try {
      const res = await fetch('/static/data/prelims_pyqs.json');
      if (!res.ok) throw new Error('Failed to fetch PYQ dataset');
      STATE.pyqs = await res.json();
      applyFilters();
    } catch (err) {
      console.error('Error loading PYQs:', err);
      if (container) {
        container.innerHTML = `
          <div class="p-8 text-center text-rose-400 bg-rose-950/20 rounded-2xl border border-rose-800/60">
            <p class="font-bold">Failed to load PYQ dataset.</p>
            <p class="text-xs text-slate-400 mt-1">Please refresh the page or try again in a few moments.</p>
          </div>
        `;
      }
    }
  }

  // Filter PYQs based on subject and view (all/mistakes/guesses)
  function applyFilters() {
    let list = STATE.pyqs;

    // Filter by Subject
    if (STATE.activeSubject !== 'all') {
      list = list.filter(q => q.subject.toLowerCase() === STATE.activeSubject.toLowerCase());
    }

    // Filter by View
    if (STATE.activeView === 'mistakes') {
      list = list.filter(q => STATE.mistakes.has(q.id));
    } else if (STATE.activeView === 'guesses') {
      list = list.filter(q => STATE.flukes.has(q.id));
    }

    STATE.filteredPyqs = list;
    renderQuestions();
    updateMetricsDashboard();
  }

  // Render Questions Feed
  function renderQuestions() {
    const container = document.getElementById('questionsContainer');
    const countEl = document.getElementById('questionCountText');
    const clearBtn = document.getElementById('clearMistakesBatchBtn');
    const exportBtn = document.getElementById('exportFlashSheetBtn');

    if (clearBtn) {
      clearBtn.classList.toggle('hidden', STATE.activeView !== 'mistakes' || STATE.mistakes.size === 0);
    }
    if (exportBtn) {
      exportBtn.classList.toggle('hidden', STATE.activeView !== 'mistakes' || STATE.mistakes.size === 0);
      exportBtn.classList.toggle('flex', STATE.activeView === 'mistakes' && STATE.mistakes.size > 0);
    }

    if (countEl) {
      const viewText = STATE.activeView === 'mistakes' ? 'Mistakes in Notebook' : STATE.activeView === 'guesses' ? 'Flagged Guesses' : 'Authentic UPSC PYQs';
      countEl.textContent = `Showing ${STATE.filteredPyqs.length} ${viewText}`;
    }

    if (!container) return;

    if (STATE.filteredPyqs.length === 0) {
      if (STATE.activeView === 'mistakes') {
        container.innerHTML = `
          <div class="p-12 text-center bg-slate-900/40 rounded-2xl border border-emerald-500/30 flex flex-col items-center gap-3">
            <span class="text-4xl">🎉</span>
            <h3 class="text-base font-bold text-white">Your Mistakes Notebook is 100% Empty!</h3>
            <p class="text-xs text-slate-400 max-w-md">
              You have cleared all your errors or haven't made any mistakes in this subject yet. Keep up the high precision!
            </p>
            <button onclick="document.getElementById('viewFilterSelect').value='all'; document.getElementById('viewFilterSelect').dispatchEvent(new Event('change'));" class="mt-2 px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400 transition-all">
              Solve All PYQs
            </button>
          </div>
        `;
      } else {
        container.innerHTML = `
          <div class="p-12 text-center bg-slate-900/40 rounded-2xl border border-slate-800">
            <p class="text-sm font-semibold text-slate-300">No questions found matching your filter.</p>
            <p class="text-xs text-slate-500 mt-1">Try selecting another subject tab above.</p>
          </div>
        `;
      }
      return;
    }

    container.innerHTML = STATE.filteredPyqs.map((q, idx) => {
      const userAns = STATE.answers[q.id];
      const isAnswered = !!userAns;
      const isCorrect = userAns ? userAns.isCorrect : false;
      const confidence = userAns ? userAns.confidence : 'sure';
      const isClearedNotice = userAns && userAns.justCleared;

      // Badges
      const diffColor = q.difficulty === 'Easy' ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' :
                        q.difficulty === 'Hard' ? 'text-rose-400 bg-rose-500/10 border-rose-500/20' :
                        'text-amber-400 bg-amber-500/10 border-amber-500/20';

      const optLetters = ['A', 'B', 'C', 'D'];

      return `
        <article class="p-6 rounded-2xl bg-slate-900/80 border ${isAnswered ? (isCorrect ? 'border-emerald-500/40' : 'border-rose-500/40') : 'border-slate-800'} transition-all shadow-md flex flex-col gap-4 min-w-0" id="card-${escapeHtml(q.id)}">
          
          <!-- Card Header Badges -->
          <div class="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
            <div class="flex items-center gap-2 flex-wrap">
              <span class="text-xs font-mono font-bold px-2 py-0.5 rounded-md bg-amber-500/15 text-amber-300 border border-amber-500/30">
                UPSC CSE ${q.year}
              </span>
              <span class="text-xs font-semibold px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700/60">
                ${escapeHtml(q.subject)}
              </span>
              <span class="text-xs text-slate-400 font-medium hidden sm:inline">
                • ${escapeHtml(q.sub_topic)}
              </span>
            </div>
            
            <div class="flex items-center gap-1.5 shrink-0">
              <span class="text-[10px] font-bold px-2 py-0.5 rounded-md border ${diffColor}">
                ${escapeHtml(q.difficulty)}
              </span>
              ${STATE.mistakes.has(q.id) ? `<span class="text-[10px] font-bold px-2 py-0.5 rounded-md bg-rose-500/20 text-rose-300 border border-rose-500/30">In Mistakes Notebook</span>` : ''}
              ${STATE.flukes.has(q.id) ? `<span class="text-[10px] font-bold px-2 py-0.5 rounded-md bg-purple-500/20 text-purple-300 border border-purple-500/30">🎲 Flagged Guess</span>` : ''}
            </div>
          </div>

          <!-- Question Text -->
          <div class="text-sm sm:text-base font-semibold text-slate-100 leading-relaxed whitespace-pre-line">
            ${escapeHtml(q.question_text)}
          </div>

          <!-- Risk / Confidence Selector (Before Answering) -->
          ${!isAnswered ? `
            <div class="flex items-center gap-2 pt-1">
              <span class="text-xs text-slate-400 font-medium shrink-0">Your Confidence:</span>
              <div class="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs" id="conf-picker-${escapeHtml(q.id)}">
                <button type="button" class="conf-btn px-2.5 py-1 rounded-lg text-xs font-bold transition-all bg-emerald-500/20 text-emerald-300 border border-emerald-500/30" data-qid="${escapeHtml(q.id)}" data-conf="sure">
                  🟢 Sure-shot
                </button>
                <button type="button" class="conf-btn px-2.5 py-1 rounded-lg text-xs font-medium text-slate-400 hover:text-white transition-all" data-qid="${escapeHtml(q.id)}" data-conf="5050">
                  🟡 50:50
                </button>
                <button type="button" class="conf-btn px-2.5 py-1 rounded-lg text-xs font-medium text-slate-400 hover:text-white transition-all" data-qid="${escapeHtml(q.id)}" data-conf="guess">
                  🎲 Wild Guess
                </button>
              </div>
            </div>
          ` : ''}

          <!-- Options Grid -->
          <div class="grid grid-cols-1 gap-2.5 pt-1">
            ${q.options.map((opt, oIdx) => {
              let optClass = "p-3 rounded-xl border text-xs sm:text-sm font-medium transition-all flex items-start gap-3 text-left ";
              
              if (!isAnswered) {
                optClass += "bg-slate-950/70 border-slate-800 text-slate-200 hover:border-amber-500 hover:bg-slate-900 cursor-pointer";
              } else {
                if (oIdx === q.correct_index) {
                  optClass += "bg-emerald-950/40 border-emerald-500 text-emerald-200 font-bold shadow-xs";
                } else if (userAns.selectedIndex === oIdx) {
                  optClass += "bg-rose-950/40 border-rose-500 text-rose-200 line-through opacity-90";
                } else {
                  optClass += "bg-slate-950/40 border-slate-800/60 text-slate-400 opacity-60";
                }
              }

              return `
                <button type="button" class="opt-btn ${optClass}" data-qid="${escapeHtml(q.id)}" data-oidx="${oIdx}" ${isAnswered ? 'disabled' : ''}>
                  <span class="w-6 h-6 rounded-lg bg-slate-800 flex items-center justify-center text-xs font-bold shrink-0 text-slate-300">
                    ${optLetters[oIdx]}
                  </span>
                  <span class="flex-1 min-w-0 pt-0.5">${escapeHtml(opt)}</span>
                  ${isAnswered && oIdx === q.correct_index ? '<span class="text-emerald-400 font-bold shrink-0">✓ Correct Key</span>' : ''}
                  ${isAnswered && userAns.selectedIndex === oIdx && !isCorrect ? '<span class="text-rose-400 font-bold shrink-0">✗ Your Choice</span>' : ''}
                </button>
              `;
            }).join("")}
          </div>

          <!-- Answer Revealed Section (Practice Mode) -->
          ${isAnswered ? `
            <div class="mt-2 p-4 rounded-xl ${isCorrect ? 'bg-emerald-950/20 border border-emerald-500/30' : 'bg-rose-950/20 border border-rose-500/30'} flex flex-col gap-3">
              
              <!-- Result Verdict Header -->
              <div class="flex items-center justify-between">
                <span class="text-xs font-bold uppercase tracking-wider ${isCorrect ? 'text-emerald-400' : 'text-rose-400'} flex items-center gap-1.5">
                  <span>${isCorrect ? '✓ Correct Answer (+2.00M)' : '✗ Incorrect Answer (-0.66M)'}</span>
                </span>
                <span class="text-[10px] font-mono text-slate-400">
                  ${escapeHtml(q.upsc_official_key)}
                </span>
              </div>

              ${isClearedNotice ? `
                <div class="p-2 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center gap-2">
                  <span>🎉</span>
                  <span>Successfully cleared from your Mistakes Notebook!</span>
                </div>
              ` : ''}

              <!-- Behavioral Diagnostic Tagger (If Answer was Wrong) -->
              ${!isCorrect ? `
                <div class="p-3 rounded-lg bg-slate-950 border border-slate-800 flex flex-col gap-2">
                  <div class="flex items-center justify-between">
                    <span class="text-xs font-bold text-rose-300">Why did you get this wrong?</span>
                    <span class="text-[10px] text-slate-500">Pick to track your error pattern</span>
                  </div>
                  <div class="flex flex-wrap gap-1.5">
                    <button class="diag-tag-btn text-[11px] px-2.5 py-1 rounded-md font-semibold border ${userAns.reason === 'concept' ? 'bg-rose-500 text-slate-950 border-rose-400 font-bold' : 'bg-slate-900 text-slate-300 border-slate-800 hover:text-white'}" data-qid="${escapeHtml(q.id)}" data-reason="concept">
                      🔴 Conceptual Blindspot
                    </button>
                    <button class="diag-tag-btn text-[11px] px-2.5 py-1 rounded-md font-semibold border ${userAns.reason === 'silly' ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold' : 'bg-slate-900 text-slate-300 border-slate-800 hover:text-white'}" data-qid="${escapeHtml(q.id)}" data-reason="silly">
                      🟡 Silly / Misread Trap
                    </button>
                    <button class="diag-tag-btn text-[11px] px-2.5 py-1 rounded-md font-semibold border ${userAns.reason === 'elimination' ? 'bg-blue-500 text-slate-950 border-blue-400 font-bold' : 'bg-slate-900 text-slate-300 border-slate-800 hover:text-white'}" data-qid="${escapeHtml(q.id)}" data-reason="elimination">
                      🔵 Over-Elimination Trap
                    </button>
                    <button class="diag-tag-btn text-[11px] px-2.5 py-1 rounded-md font-semibold border ${userAns.reason === 'memory' ? 'bg-purple-500 text-slate-950 border-purple-400 font-bold' : 'bg-slate-900 text-slate-300 border-slate-800 hover:text-white'}" data-qid="${escapeHtml(q.id)}" data-reason="memory">
                      🟣 Memory Lapse
                    </button>
                  </div>
                </div>
              ` : ''}

              <!-- Explanation -->
              <div class="text-xs text-slate-300 leading-relaxed whitespace-pre-line border-t border-slate-800/80 pt-2.5">
                <strong class="text-white">Explanation:</strong><br>
                ${escapeHtml(q.explanation)}
              </div>

              <!-- Standard Reference & Elimination Trap -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-xs">
                <div class="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800">
                  <span class="text-[10px] font-bold text-amber-400 uppercase tracking-wider block mb-0.5">📖 Standard Reference</span>
                  <span class="text-slate-300">${escapeHtml(q.standard_book_ref)}</span>
                </div>
                <div class="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800">
                  <span class="text-[10px] font-bold text-rose-400 uppercase tracking-wider block mb-0.5">⚠️ Elimination Trap</span>
                  <span class="text-slate-300">${escapeHtml(q.elimination_trap)}</span>
                </div>
              </div>

              <!-- Prelims-to-Mains Continuum Box -->
              ${q.mains_linkage ? `
                <div class="mt-1 p-3 rounded-lg bg-slate-950 border border-amber-500/25 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div class="flex-1 min-w-0">
                    <div class="flex items-center gap-1.5 mb-0.5">
                      <span class="text-[10px] font-black uppercase px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        ${escapeHtml(q.mains_linkage.paper)} Mains Continuum
                      </span>
                    </div>
                    <p class="text-xs text-slate-200 font-medium italic">
                      "${escapeHtml(q.mains_linkage.question)}"
                    </p>
                  </div>
                  <a href="/?prefill_q=${encodeURIComponent(q.mains_linkage.question)}&paper=${encodeURIComponent(q.mains_linkage.paper)}" class="shrink-0 text-xs font-bold px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 transition-all shadow-xs flex items-center gap-1">
                    <span>✍️ Evaluate in Mains</span>
                    <span>→</span>
                  </a>
                </div>
              ` : ''}

            </div>
          ` : ''}

        </article>
      `;
    }).join("");

    attachEventListeners();
  }

  // Attach Event Listeners
  function attachEventListeners() {
    // Confidence Picker Buttons
    document.querySelectorAll('.conf-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const qId = e.currentTarget.getAttribute('data-qid');
        const conf = e.currentTarget.getAttribute('data-conf');
        const picker = document.getElementById(`conf-picker-${qId}`);
        if (!picker) return;

        picker.querySelectorAll('.conf-btn').forEach(b => {
          b.className = 'conf-btn px-2.5 py-1 rounded-lg text-xs font-medium text-slate-400 hover:text-white transition-all';
        });

        const activeStyles = conf === 'sure' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold' :
                             conf === '5050' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold' :
                             'bg-purple-500/20 text-purple-300 border border-purple-500/30 font-bold';
        e.currentTarget.className = `conf-btn px-2.5 py-1 rounded-lg text-xs transition-all ${activeStyles}`;
        e.currentTarget.setAttribute('data-active', 'true');
      });
    });

    // Option Click Handlers
    document.querySelectorAll('.opt-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const qId = e.currentTarget.getAttribute('data-qid');
        const oIdx = parseInt(e.currentTarget.getAttribute('data-oidx'), 10);
        handleAnswerSubmit(qId, oIdx);
      });
    });

    // Diagnostic Tag Buttons
    document.querySelectorAll('.diag-tag-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const qId = e.currentTarget.getAttribute('data-qid');
        const reason = e.currentTarget.getAttribute('data-reason');
        handleDiagnosticTag(qId, reason);
      });
    });
  }

  // Answer Submit Handler
  function handleAnswerSubmit(qId, selectedIdx) {
    const q = STATE.pyqs.find(item => item.id === qId);
    if (!q) return;

    // Determine confidence
    let confidence = 'sure';
    const picker = document.getElementById(`conf-picker-${qId}`);
    if (picker) {
      const activeBtn = picker.querySelector('.conf-btn[data-active="true"]');
      if (activeBtn) confidence = activeBtn.getAttribute('data-conf') || 'sure';
    }

    const isCorrect = selectedIdx === q.correct_index;
    let justCleared = false;

    // Self-Clearing Mistakes Logic
    if (!isCorrect) {
      STATE.mistakes.add(qId);
    } else {
      if (STATE.mistakes.has(qId)) {
        STATE.mistakes.delete(qId);
        justCleared = true;
      }
    }

    // Fluke / Guess Tracker
    if (confidence === 'guess') {
      STATE.flukes.add(qId);
    } else {
      STATE.flukes.delete(qId);
    }

    STATE.answers[qId] = {
      selectedIndex: selectedIdx,
      isCorrect: isCorrect,
      confidence: confidence,
      reason: null,
      justCleared: justCleared,
      timestamp: Date.now()
    };

    persistState();
    renderQuestions();
    updateMetricsDashboard();
  }

  // Diagnostic Tag Handler
  function handleDiagnosticTag(qId, reason) {
    if (!STATE.answers[qId]) return;
    const oldReason = STATE.answers[qId].reason;
    if (oldReason && STATE.diagnostics[oldReason] > 0) {
      STATE.diagnostics[oldReason]--;
    }

    STATE.answers[qId].reason = reason;
    STATE.diagnostics[reason] = (STATE.diagnostics[reason] || 0) + 1;

    persistState();
    renderQuestions();
    updateMetricsDashboard();
  }

  // Real-Time Expected Value ($EV$) & Metrics Calculator
  function updateMetricsDashboard() {
    const totalAns = Object.keys(STATE.answers).length;
    let correctCount = 0;
    let incorrectCount = 0;

    let sureTotal = 0, sureCorrect = 0;
    let f50Total = 0, f50Correct = 0;
    let guessTotal = 0, guessCorrect = 0;

    Object.values(STATE.answers).forEach(ans => {
      if (ans.isCorrect) correctCount++;
      else incorrectCount++;

      if (ans.confidence === 'sure') {
        sureTotal++;
        if (ans.isCorrect) sureCorrect++;
      } else if (ans.confidence === '5050') {
        f50Total++;
        if (ans.isCorrect) f50Correct++;
      } else if (ans.confidence === 'guess') {
        guessTotal++;
        if (ans.isCorrect) guessCorrect++;
      }
    });

    const grossScore = correctCount * 2.0;
    const negPenalty = incorrectCount * 0.66;
    const netScore = Math.max(-50, grossScore - negPenalty);

    // Update DOM Metrics
    const grossEl = document.getElementById('statGrossScore');
    const negEl = document.getElementById('statNegPenalty');
    const netEl = document.getElementById('statNetScore');
    const adviceEl = document.getElementById('statTacticalAdvice');
    const verdictBadge = document.getElementById('evVerdictBadge');
    const navMistakesCount = document.getElementById('navMistakesCount');

    if (grossEl) grossEl.textContent = `+${grossScore.toFixed(1)}`;
    if (negEl) negEl.textContent = `-${negPenalty.toFixed(1)}`;
    if (netEl) netEl.textContent = netScore >= 0 ? `+${netScore.toFixed(1)}` : `${netScore.toFixed(1)}`;
    if (navMistakesCount) navMistakesCount.textContent = STATE.mistakes.size;

    // Diagnostics Sidebar Counts
    const cEl = document.getElementById('statDiagConcept');
    const sEl = document.getElementById('statDiagSilly');
    const eEl = document.getElementById('statDiagElim');
    const mEl = document.getElementById('statDiagMemory');
    if (cEl) cEl.textContent = STATE.diagnostics.concept || 0;
    if (sEl) sEl.textContent = STATE.diagnostics.silly || 0;
    if (eEl) eEl.textContent = STATE.diagnostics.elimination || 0;
    if (mEl) mEl.textContent = STATE.diagnostics.memory || 0;

    // Tactical Advice Calculation
    if (totalAns < 3) {
      if (adviceEl) {
        adviceEl.innerHTML = `
          <span class="text-amber-400 shrink-0 mt-0.5">💡</span>
          <span>Solve at least <strong>3 questions</strong> with confidence tags to calculate your Expected Value ($EV$).</span>
        `;
      }
      if (verdictBadge) {
        verdictBadge.textContent = 'Calibrating';
        verdictBadge.className = 'text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-500/15 text-amber-400 border border-amber-500/30';
      }
      return;
    }

    // Expected Value for 50:50 and Guesses
    const p50 = f50Total > 0 ? f50Correct / f50Total : 0.5;
    const ev50 = (p50 * 2.0) - ((1 - p50) * 0.66);

    const pGuess = guessTotal > 0 ? guessCorrect / guessTotal : 0.25;
    const evGuess = (pGuess * 2.0) - ((1 - pGuess) * 0.66);

    let adviceText = '';
    let badgeText = 'Positive EV';
    let badgeClass = 'text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-400 border border-emerald-500/30';

    if (f50Total >= 2 && ev50 > 0.4) {
      adviceText = `Your <strong>50:50 elimination is highly profitable</strong> (+${(ev50 * f50Total).toFixed(1)}M Net). Keep attempting Tier-2 questions. `;
    } else if (f50Total >= 2 && ev50 <= 0) {
      adviceText = `Your <strong>50:50 elimination is net-negative</strong> (${(ev50 * f50Total).toFixed(1)}M). You are over-eliminating the correct option. `;
    }

    if (guessTotal >= 2 && evGuess < 0) {
      adviceText += `<strong>Wild guesses are costing you ${Math.abs(evGuess * guessTotal).toFixed(1)} marks!</strong> Cut down on wild guesses in the real exam.`;
      badgeText = 'Negative Drag';
      badgeClass = 'text-[10px] font-bold px-2 py-0.5 rounded-md bg-rose-500/15 text-rose-400 border border-rose-500/30';
    } else if (guessTotal === 0 && totalAns >= 5) {
      adviceText += `Clean exam discipline: Zero wild guesses logged.`;
    }

    if (!adviceText) {
      adviceText = `Net score is <strong>${netScore.toFixed(1)} marks</strong> across ${totalAns} questions. Aim for &gt;85% accuracy on Sure-shot items.`;
    }

    if (adviceEl) {
      adviceEl.innerHTML = `
        <span class="text-amber-400 shrink-0 mt-0.5">📊</span>
        <span>${adviceText}</span>
      `;
    }
    if (verdictBadge) {
      verdictBadge.textContent = badgeText;
      verdictBadge.className = badgeClass;
    }
  }

  // Subject Slugs for Clean SEO URLs
  const SUBJECT_SLUGS = {
    'polity': 'Polity & Governance',
    'economy': 'Economy',
    'environment': 'Environment & Ecology',
    'history': 'History & Culture',
    'geography': 'Geography',
    'science-tech': 'Science & Technology',
    'science-and-tech': 'Science & Technology',
    'sci-tech': 'Science & Technology'
  };

  const REVERSE_SLUGS = {
    'Polity & Governance': 'polity',
    'Economy': 'economy',
    'Environment & Ecology': 'environment',
    'History & Culture': 'history',
    'Geography': 'geography',
    'Science & Technology': 'science-and-tech'
  };

  // Toast Helper
  function showToast(message) {
    const toast = document.getElementById('toastNotification');
    const msgEl = document.getElementById('toastMessage');
    if (!toast || !msgEl) return;
    msgEl.textContent = message;
    toast.classList.remove('translate-y-20', 'opacity-0', 'pointer-events-none');
    toast.classList.add('translate-y-0', 'opacity-100');
    setTimeout(() => {
      toast.classList.remove('translate-y-0', 'opacity-100');
      toast.classList.add('translate-y-20', 'opacity-0', 'pointer-events-none');
    }, 3200);
  }

  // Update SEO Meta Titles & Descriptions dynamically
  function updateSEOMeta() {
    if (STATE.activeSubject && STATE.activeSubject !== 'all') {
      document.title = `UPSC ${STATE.activeSubject} Prelims PYQs (2013-2026) with Solutions & Traps | CookedMains`;
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute('content', `Master official UPSC ${STATE.activeSubject} Prelims previous year questions (2013-2026). Features standard book citations, trap alerts, and instant error logging.`);
      }
    } else {
      document.title = `UPSC Prelims PYQs (2013-2026) with Explanations & Negative Marking Engine | CookedMains`;
    }
  }

  // Update Subject Tab Active Styles
  function syncSubjectTabsUI() {
    document.querySelectorAll('.subject-tab').forEach(b => {
      const bSub = b.getAttribute('data-subject') || 'all';
      if (bSub.toLowerCase() === STATE.activeSubject.toLowerCase()) {
        b.className = 'subject-tab px-3 py-1.5 rounded-lg font-bold bg-amber-500 text-slate-950 shrink-0';
      } else {
        b.className = 'subject-tab px-3 py-1.5 rounded-lg font-semibold bg-slate-900 text-slate-300 border border-slate-800 hover:text-white shrink-0';
      }
    });
  }

  // Deep Routing Detection
  function initRouting() {
    const path = window.location.pathname.toLowerCase();
    const parts = path.split('/').filter(Boolean);
    const searchParams = new URLSearchParams(window.location.search);
    const querySub = searchParams.get('subject');

    if (querySub && SUBJECT_SLUGS[querySub.toLowerCase()]) {
      STATE.activeSubject = SUBJECT_SLUGS[querySub.toLowerCase()];
    } else if (parts[0] === 'prelims' && parts[1] && SUBJECT_SLUGS[parts[1]]) {
      STATE.activeSubject = SUBJECT_SLUGS[parts[1]];
    }
    syncSubjectTabsUI();
    updateSEOMeta();
  }

  // Share Cutoff Sweet Spot
  function shareSweetSpot() {
    let gross = 0, penalty = 0;
    let tier50Count = 0, tier50Correct = 0;

    Object.entries(STATE.answers).forEach(([qId, ans]) => {
      const q = STATE.pyqs.find(item => item.id === qId);
      if (!q) return;
      const isCorrect = ans.optionIndex === q.correct_index;
      if (isCorrect) gross += 2.0;
      else penalty += 0.66;

      if (ans.tier === '50_50') {
        tier50Count++;
        if (isCorrect) tier50Correct++;
      }
    });

    const net = Math.max(0, gross - penalty);
    const attempted = Object.keys(STATE.answers).length;
    const acc50 = tier50Count > 0 ? Math.round((tier50Correct / tier50Count) * 100) : 0;
    const net50 = (tier50Correct * 2.0) - ((tier50Count - tier50Correct) * 0.66);

    const shareText = `🎯 My UPSC Prelims Cutoff Sweet Spot on CookedMains Radar:
• Net Score: ${net.toFixed(2)} Marks (Gross: +${gross.toFixed(1)}M, Penalty: -${penalty.toFixed(1)}M)
• Questions Attempted: ${attempted}
• 50:50 Guess Accuracy: ${acc50}% (${net50 >= 0 ? '+' : ''}${net50.toFixed(1)}M net impact)
• Live Verdict: Eliminate negative marking by calculating your risk ceiling!

Calculate your attempt sweet spot & eliminate PYQ mistakes 100% free at:
https://cookedmains.com/prelims`;

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(shareText).then(() => {
        showToast('Cutoff Sweet Spot copied to clipboard! Share on WhatsApp or Telegram.');
      }).catch(() => {
        prompt('Copy your Cutoff Sweet Spot summary:', shareText);
      });
    } else {
      prompt('Copy your Cutoff Sweet Spot summary:', shareText);
    }
  }

  // Generate & Print Mistakes Flash-Sheet
  function generateAndPrintFlashSheet() {
    const wrongQuestions = STATE.pyqs.filter(q => STATE.mistakes.has(q.id));
    if (wrongQuestions.length === 0) {
      alert('Your Mistakes Notebook is currently empty! Solve questions below to auto-log your errors.');
      return;
    }

    const printContainer = document.getElementById('printFlashSheetContainer');
    if (!printContainer) return;

    const dateStr = new Date().toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });

    const cardsHtml = wrongQuestions.map((q, idx) => {
      const diag = STATE.diagnostics[q.id] || 'Conceptual Blindspot';
      const userChoice = STATE.answers[q.id] ? STATE.answers[q.id].optionIndex : -1;
      const userLetter = userChoice >= 0 ? ['A', 'B', 'C', 'D'][userChoice] : 'Skipped';

      return `
        <div class="flash-card border border-slate-300 rounded-lg p-3 mb-3 bg-white text-slate-900 break-inside-avoid">
          <div class="flex items-center justify-between border-b border-slate-200 pb-1.5 mb-2 font-mono">
            <span class="font-bold text-slate-800">#${idx + 1}. [${escapeHtml(q.subject)}] • ${q.year} (${escapeHtml(q.sub_topic)})</span>
            <span class="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-300">
              Trap: ${escapeHtml(diag)}
            </span>
          </div>

          <div class="font-semibold text-slate-900 mb-2 leading-relaxed whitespace-pre-line text-xs">
            ${escapeHtml(q.question_text)}
          </div>

          <div class="grid grid-cols-2 gap-2 p-2 bg-slate-50 rounded border border-slate-200 mb-2 text-[11px]">
            <div>
              <span class="font-bold text-emerald-700">✓ Official Key:</span> Option ${escapeHtml(q.correct_option)}
            </div>
            <div>
              <span class="font-bold text-rose-700">✗ Your Attempt:</span> Option ${escapeHtml(userLetter)}
            </div>
          </div>

          <div class="text-[11px] text-slate-700 leading-normal mb-1.5">
            <strong class="text-slate-900">Why It's Correct:</strong>
            <p class="mt-0.5 whitespace-pre-line">${escapeHtml(q.explanation)}</p>
          </div>

          <div class="flex flex-col gap-1 mt-2 pt-1.5 border-t border-slate-200 text-[10px] text-slate-600">
            <div><strong>⚠️ Trap Alert:</strong> ${escapeHtml(q.elimination_trap || 'Verify key assertions')}</div>
            <div><strong>📖 Standard Citation:</strong> ${escapeHtml(q.standard_book_ref || 'NCERT / Laxmikanth')}</div>
          </div>
        </div>
      `;
    }).join('');

    printContainer.innerHTML = `
      <div class="max-w-4xl mx-auto font-sans p-4">
        <div class="border-b-2 border-slate-900 pb-3 mb-4 flex items-center justify-between">
          <div>
            <h1 class="text-xl font-black text-slate-950 uppercase tracking-tight">CookedMains Prelims Radar</h1>
            <h2 class="text-xs font-bold text-amber-700 uppercase tracking-wider mt-0.5">Personal Mistake Elimination Flash-Sheet (10-Minute Delta Prep)</h2>
          </div>
          <div class="text-right text-[11px] text-slate-600">
            <div>Date: <strong>${dateStr}</strong></div>
            <div>Target Gaps to Clear: <strong>${wrongQuestions.length} Questions</strong></div>
          </div>
        </div>

        <div class="mb-4 p-2.5 rounded bg-amber-50 border border-amber-200 text-[11px] text-amber-900">
          <strong>Mandatory Exam-Eve Rule:</strong> Review strictly the standard citations and trap alerts below. Do NOT re-read full textbooks; master only the <em>delta</em> distinction that caused each error.
        </div>

        <div class="space-y-3">
          ${cardsHtml}
        </div>

        <div class="mt-6 pt-3 border-t border-slate-300 text-center text-[10px] text-slate-500">
          Generated via CookedMains Prelims Radar • https://cookedmains.com/prelims • Active Recall Revision Ledger
        </div>
      </div>
    `;

    setTimeout(() => {
      window.print();
    }, 150);
  }

  // Setup UI Listeners (Tabs, Filter, Clear, Share, Export)
  function setupUIListeners() {
    // Subject Tab Buttons
    document.querySelectorAll('.subject-tab').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const sub = e.currentTarget.getAttribute('data-subject') || 'all';
        STATE.activeSubject = sub;
        syncSubjectTabsUI();
        updateSEOMeta();

        // Push URL without page reload
        const slug = REVERSE_SLUGS[sub] || '';
        try {
          window.history.pushState(null, '', slug ? `/prelims/${slug}` : '/prelims');
        } catch (err) {}

        applyFilters();
      });
    });

    // View Filter Select
    const viewSelect = document.getElementById('viewFilterSelect');
    if (viewSelect) {
      viewSelect.addEventListener('change', (e) => {
        STATE.activeView = e.target.value;
        applyFilters();
      });
    }

    // Top Mistakes Nav Button
    const mistakesNavBtn = document.getElementById('viewMistakesNavBtn');
    if (mistakesNavBtn) {
      mistakesNavBtn.addEventListener('click', () => {
        STATE.activeView = 'mistakes';
        if (viewSelect) viewSelect.value = 'mistakes';
        applyFilters();
      });
    }

    // Clear Mistakes Batch Button
    const clearBatchBtn = document.getElementById('clearMistakesBatchBtn');
    if (clearBatchBtn) {
      clearBatchBtn.addEventListener('click', () => {
        if (confirm('Clear all logged mistakes from your notebook?')) {
          STATE.mistakes.clear();
          persistState();
          applyFilters();
        }
      });
    }

    // Export Flash-Sheet Button
    const exportBtn = document.getElementById('exportFlashSheetBtn');
    if (exportBtn) {
      exportBtn.addEventListener('click', generateAndPrintFlashSheet);
    }

    // Share Cutoff Sweet Spot Button
    const shareBtn = document.getElementById('shareSweetSpotBtn');
    if (shareBtn) {
      shareBtn.addEventListener('click', shareSweetSpot);
    }

    // Mode Switcher Buttons
    const pracBtn = document.getElementById('modePracticeBtn');
    const examBtn = document.getElementById('modeExamBtn');
    if (pracBtn && examBtn) {
      pracBtn.addEventListener('click', () => {
        STATE.activeMode = 'practice';
        pracBtn.className = 'px-2.5 py-1 rounded-lg font-bold bg-slate-800 text-white shadow-xs';
        examBtn.className = 'px-2.5 py-1 rounded-lg font-medium text-slate-400 hover:text-white';
        renderQuestions();
      });
      examBtn.addEventListener('click', () => {
        STATE.activeMode = 'exam';
        examBtn.className = 'px-2.5 py-1 rounded-lg font-bold bg-slate-800 text-white shadow-xs';
        pracBtn.className = 'px-2.5 py-1 rounded-lg font-medium text-slate-400 hover:text-white';
        alert('Exam Mode activated: Timed simulation mode is active. Click options to record your answers.');
        renderQuestions();
      });
    }
  }

  // Initialize
  document.addEventListener('DOMContentLoaded', () => {
    loadPersistedState();
    setupUIListeners();
    initRouting();
    initQuestions();
  });

})();
