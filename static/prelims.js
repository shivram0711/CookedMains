/**
 * CookedMains — Prelims Radar Engine (prelims.js)
 * 100% Client-Side • Zero Database Load • Offline-First LocalStorage
 * Features:
 *   - 14-Year PYQ Practice & Timed Exam Modes
 *   - Risk vs. Attempt "Sweet Spot" Expected Value (EV) Optimizer
 *   - Accidental Click Protection (Option Staging & Re-confirmation)
 *   - 10-Second Statement Slicer (Interactive Statement Elimination)
 *   - Topper's Trap Detector (Heuristic Insight & Deceptive Triggers)
 *   - Option-by-Option Distractor Deep Dive (Facts on all 4 options)
 *   - Self-Clearing Personal Mistakes Notebook
 *   - "Why I Got It Wrong" 4-Pill Behavioral Diagnostics
 *   - Sub-Topic "Mark-Bleed" Heatmap
 *   - 10-Minute "Micro-Correction" Generator (1-Click Print/PDF Flash-Sheet)
 *   - Viral "Cutoff Sweet Spot" Social Share Card
 *   - Bidirectional Light / Dark Theme Support
 *   - Mobile-First Sticky Navigation Dock
 */

(function () {
  'use strict';

  // State Management
  const STATE = {
    pyqs: [],
    filteredPyqs: [],
    activeSubject: 'all',
    activeYear: 'all', // 'all' | '2026' | '2025' ...
    searchQuery: '',
    language: localStorage.getItem('cm_prelims_lang') || 'en', // 'en' | 'hi'
    activeView: 'all', // 'all' | 'mistakes' | 'guesses'
    activeMode: 'practice', // 'practice' | 'exam'
    answers: {}, // { [qId]: { selectedIndex, isCorrect, confidence, reason, justCleared, timestamp } }
    stagedSelections: {}, // { [qId]: optionIndex } for confirmation protection
    slicedStatements: {}, // { [qId]: { [stmtNum]: true/false } }
    mistakes: new Set(),
    flukes: new Set(),
    diagnostics: {
      concept: 0,
      silly: 0,
      elimination: 0,
      memory: 0
    },
    target: {
      id: null,
      title: '',
      subject: 'All Subjects',
      targetQuestions: 30,
      solvedIds: [],
      solvedCount: 0,
      correctCount: 0,
      startDate: null,
      deadlineDate: null,
      durationDays: 7,
      dailyGoal: 5,
      status: 'none', // 'none' | 'active' | 'completed'
      strategyDirective: '',
      highYieldFocus: '',
      diagnosticProfile: null
    }
  };

  // LocalStorage Keys
  const STORAGE_KEYS = {
    ANSWERS: 'cookedmains_prelims_answers_v1',
    MISTAKES: 'cookedmains_prelims_mistakes_v1',
    FLUKES: 'cookedmains_prelims_flukes_v1',
    DIAGNOSTICS: 'cookedmains_prelims_diagnostics_v1',
    TARGET: 'cookedmains_prelims_target_v1'
  };

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

  // Theme Management (Light / Dark Mode)
  function initTheme() {
    const saved = localStorage.getItem('mainsmentor_theme') || 'dark';
    if (saved === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    const btn = document.getElementById('toggleThemeBtn');
    if (btn) {
      btn.addEventListener('click', () => {
        const isDark = document.documentElement.classList.toggle('dark');
        localStorage.setItem('mainsmentor_theme', isDark ? 'dark' : 'light');
      });
    }
  }

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

      const savedTarget = localStorage.getItem(STORAGE_KEYS.TARGET);
      if (savedTarget) {
        try {
          const parsed = JSON.parse(savedTarget);
          STATE.target = Object.assign(STATE.target, parsed);
        } catch (e) {}
      }
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
      localStorage.setItem(STORAGE_KEYS.TARGET, JSON.stringify(STATE.target));
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

  // Filter PYQs based on subject, year, view, and topic search query
  function applyFilters() {
    let list = STATE.pyqs;

    // Filter by Subject
    if (STATE.activeSubject !== 'all') {
      list = list.filter(q => q.subject.toLowerCase() === STATE.activeSubject.toLowerCase());
    }

    // Filter by Year
    if (STATE.activeYear !== 'all') {
      const yr = parseInt(STATE.activeYear, 10);
      list = list.filter(q => q.year === yr);
    }

    // Filter by View
    if (STATE.activeView === 'mistakes') {
      list = list.filter(q => STATE.mistakes.has(q.id));
    } else if (STATE.activeView === 'guesses') {
      list = list.filter(q => STATE.flukes.has(q.id));
    }

    // Filter by Topic Search Query
    if (STATE.searchQuery && STATE.searchQuery.trim().length > 0) {
      const qLower = STATE.searchQuery.trim().toLowerCase();
      list = list.filter(q => {
        const textMatch = q.question_text && q.question_text.toLowerCase().includes(qLower);
        const topicMatch = q.sub_topic && q.sub_topic.toLowerCase().includes(qLower);
        const subjMatch = q.subject && q.subject.toLowerCase().includes(qLower);
        const expMatch = q.explanation && q.explanation.toLowerCase().includes(qLower);
        const bookMatch = q.standard_book_ref && q.standard_book_ref.toLowerCase().includes(qLower);
        const trapMatch = q.elimination_trap && q.elimination_trap.toLowerCase().includes(qLower);
        const optMatch = q.options && q.options.some(opt => opt.toLowerCase().includes(qLower));
        return textMatch || topicMatch || subjMatch || expMatch || bookMatch || trapMatch || optMatch;
      });

      // Update Search Count Badge
      const countBadge = document.getElementById('topicSearchCountBadge');
      const clearBtn = document.getElementById('clearTopicSearchBtn');
      if (countBadge) {
        countBadge.classList.remove('hidden');
        countBadge.textContent = `${list.length} Question${list.length === 1 ? '' : 's'}`;
      }
      if (clearBtn) clearBtn.classList.remove('hidden');
    } else {
      const countBadge = document.getElementById('topicSearchCountBadge');
      const clearBtn = document.getElementById('clearTopicSearchBtn');
      if (countBadge) countBadge.classList.add('hidden');
      if (clearBtn) clearBtn.classList.add('hidden');
    }

    STATE.filteredPyqs = list;
    renderQuestions();
    updateMetricsDashboard();
  }

  // Parse numbered statements from question text
  function parseStatements(text) {
    if (!text) return [];
    const lines = text.split('\n');
    const statements = [];
    const stmtRegex = /^(\d+)\.\s+(.*)/;

    lines.forEach(line => {
      const match = line.trim().match(stmtRegex);
      if (match) {
        statements.push({
          num: parseInt(match[1], 10),
          text: match[2].trim()
        });
      }
    });

    return statements;
  }

  // Generate intelligent distractor breakdown for all options
  function getDistractorAnalysis(q) {
    const letters = ['A', 'B', 'C', 'D'];
    return q.options.map((opt, idx) => {
      const isCorrect = idx === q.correct_index;
      let label = isCorrect ? 'Official UPSC Key' : 'Incorrect Distractor';
      let details = '';

      if (isCorrect) {
        details = `✓ ${q.explanation.split('\n')[0] || 'Accurate statement directly validated by official key.'}`;
      } else {
        const lines = q.explanation.split('\n');
        const optMention = lines.find(ln => 
          ln.toLowerCase().includes(`statement ${idx + 1}`) || 
          ln.toLowerCase().includes(opt.slice(0, 25).toLowerCase()) ||
          ln.toLowerCase().includes('incorrect')
        );
        if (optMention) {
          details = optMention.replace(/^[•\-\*]\s*/, '');
        } else {
          details = `Designed as an elimination distractor. UPSC intentionally introduces factual inversions, absolute modifiers, or chronological swaps to test conceptual boundary clarity.`;
        }
      }

      return {
        letter: letters[idx],
        optionText: opt,
        isCorrect,
        label,
        details
      };
    });
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
            <button onclick="document.getElementById('viewFilterSelect').value='all'; document.getElementById('viewFilterSelect').dispatchEvent(new Event('change'));" class="mt-2 px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400 transition-all cursor-pointer">
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
      const stagedIdx = STATE.stagedSelections[q.id];

      // Badges
      const diffColor = q.difficulty === 'Easy' ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' :
                        q.difficulty === 'Hard' ? 'text-rose-400 bg-rose-500/10 border-rose-500/20' :
                        'text-amber-400 bg-amber-500/10 border-amber-500/20';

      const optLetters = ['A', 'B', 'C', 'D'];

      // Statements for 10-Second Statement Slicer
      const statements = parseStatements(q.question_text);
      const hasStatements = statements.length >= 2;
      const qSliced = STATE.slicedStatements[q.id] || {};

      // Distractor facts
      const distractorAnalysis = getDistractorAnalysis(q);

      return `
        <article class="p-5 sm:p-6 rounded-2xl bg-slate-900/80 border ${isAnswered ? (isCorrect ? 'border-emerald-500/40' : 'border-rose-500/40') : (stagedIdx !== undefined ? 'border-amber-400/50' : 'border-slate-800')} transition-all shadow-md flex flex-col gap-4 min-w-0" id="card-${escapeHtml(q.id)}">
          
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

          <!-- 10-Second Statement Slicer (If question has numbered statements) -->
          ${hasStatements && !isAnswered ? `
            <div class="slicer-container p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 flex flex-col gap-2">
              <div class="flex items-center justify-between">
                <span class="text-[11px] font-bold text-amber-400 flex items-center gap-1.5 font-mono">
                  <span>✂️</span> 10-Second Statement Slicer
                </span>
                <span class="text-[10px] text-slate-500">Click [Slice Out] to cross out false statements</span>
              </div>
              <div class="flex flex-col gap-1.5">
                ${statements.map(s => {
                  const isSliced = !!qSliced[s.num];
                  return `
                    <div class="statement-slice-item p-2 rounded-lg bg-slate-950 border border-slate-800/80 flex items-center justify-between gap-2 text-xs">
                      <div class="flex items-start gap-2 flex-1 min-w-0 ${isSliced ? 'line-through text-rose-400 opacity-60' : 'text-slate-200'}">
                        <span class="font-bold text-amber-400 font-mono">${s.num}.</span>
                        <span class="break-words leading-relaxed">${escapeHtml(s.text)}</span>
                      </div>
                      <button type="button" class="slice-stmt-btn shrink-0 px-2 py-0.5 rounded text-[10px] font-bold transition-all cursor-pointer ${isSliced ? 'bg-rose-500 text-white' : 'bg-slate-800 hover:bg-slate-700 text-slate-300'}" data-qid="${escapeHtml(q.id)}" data-snum="${s.num}">
                        ${isSliced ? 'Sliced ✕' : 'Slice Out ✂️'}
                      </button>
                    </div>
                  `;
                }).join('')}
              </div>
            </div>
          ` : ''}

          <!-- Risk / Confidence Selector (Before Answering) -->
          ${!isAnswered ? `
            <div class="flex flex-wrap items-center gap-2 pt-1">
              <span class="text-xs text-slate-400 font-medium shrink-0">Your Confidence:</span>
              <div class="conf-picker-box flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs" id="conf-picker-${escapeHtml(q.id)}">
                <button type="button" class="conf-btn px-2.5 py-1 rounded-lg text-xs font-bold transition-all bg-emerald-500/20 text-emerald-300 border border-emerald-500/30" data-qid="${escapeHtml(q.id)}" data-conf="sure" data-active="true">
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
              
              // Check if any sliced statement is in this option text
              let isOptionAutoSliced = false;
              if (hasStatements) {
                Object.keys(qSliced).forEach(sNum => {
                  if (qSliced[sNum] && (opt.includes(sNum) || opt.toLowerCase().includes(`statement ${sNum}`))) {
                    isOptionAutoSliced = true;
                  }
                });
              }

              if (!isAnswered) {
                if (stagedIdx === oIdx) {
                  optClass += "bg-amber-500/15 border-amber-400 text-amber-200 ring-2 ring-amber-400/40 font-bold shadow-md";
                } else if (isOptionAutoSliced) {
                  optClass += "bg-slate-950/40 border-dashed border-rose-500/40 text-slate-400 line-through opacity-40";
                } else {
                  optClass += "bg-slate-950/70 border-slate-800 text-slate-200 hover:border-amber-500 hover:bg-slate-900 cursor-pointer";
                }
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
                  <span class="opt-letter-badge w-6 h-6 rounded-lg bg-slate-800 flex items-center justify-center text-xs font-bold shrink-0 text-slate-300">
                    ${optLetters[oIdx]}
                  </span>
                  <span class="flex-1 min-w-0 pt-0.5 break-words">${escapeHtml(opt)}</span>
                  ${stagedIdx === oIdx && !isAnswered ? '<span class="text-amber-400 font-bold text-xs shrink-0 font-mono">● Selected</span>' : ''}
                  ${isAnswered && oIdx === q.correct_index ? '<span class="text-emerald-400 font-bold shrink-0">✓ Correct Key</span>' : ''}
                  ${isAnswered && userAns.selectedIndex === oIdx && !isCorrect ? '<span class="text-rose-400 font-bold shrink-0">✗ Your Choice</span>' : ''}
                </button>
              `;
            }).join("")}
          </div>

          <!-- Accidental Click Confirmation Bar (When an option is staged) -->
          ${!isAnswered && stagedIdx !== undefined ? `
            <div class="staged-confirm-bar flex items-center justify-between p-3 rounded-xl bg-amber-500/15 border border-amber-500/40 text-xs animate-fade-in shadow-md">
              <div class="flex items-center gap-2">
                <span class="w-5 h-5 rounded-md bg-amber-500 text-slate-950 font-black flex items-center justify-center text-[10px]">✓</span>
                <span class="text-amber-200 font-medium">Selected: <strong>Option ${optLetters[stagedIdx]}</strong></span>
              </div>
              <div class="flex items-center gap-2">
                <button type="button" class="clear-staged-btn px-2.5 py-1.5 rounded-lg text-slate-300 hover:text-white bg-slate-900 border border-slate-700 text-xs font-semibold cursor-pointer" data-qid="${escapeHtml(q.id)}">
                  Cancel
                </button>
                <button type="button" class="confirm-ans-btn px-4 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md flex items-center gap-1.5 cursor-pointer active:scale-95" data-qid="${escapeHtml(q.id)}">
                  <span>✓ Confirm &amp; Submit</span>
                </button>
              </div>
            </div>
          ` : ''}

          <!-- Answer Revealed Section (Practice Mode) -->
          ${isAnswered ? `
            <div class="mt-2 p-4 rounded-xl ${isCorrect ? 'bg-emerald-950/20 border border-emerald-500/30' : 'bg-rose-950/20 border border-rose-500/30'} flex flex-col gap-3">
              
              <!-- Result Verdict Header -->
              <div class="flex items-center justify-between flex-wrap gap-2">
                <span class="text-xs font-bold uppercase tracking-wider ${isCorrect ? 'text-emerald-400' : 'text-rose-400'} flex items-center gap-1.5">
                  <span>${isCorrect ? '✓ Correct Answer (+2.00M)' : '✗ Incorrect Answer (-0.66M)'}</span>
                </span>
                <div class="flex items-center gap-2">
                  <span class="text-[10px] font-mono text-slate-400">
                    ${escapeHtml(q.upsc_official_key)}
                  </span>
                  <button type="button" class="reattempt-btn text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 hover:text-white border border-slate-700 cursor-pointer font-semibold" data-qid="${escapeHtml(q.id)}">
                    ↺ Re-attempt
                  </button>
                </div>
              </div>

              ${isClearedNotice ? `
                <div class="p-2 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center gap-2">
                  <span>🎉</span>
                  <span>Successfully cleared from your Mistakes Notebook!</span>
                </div>
              ` : ''}

              <!-- Topper's Trap Detector Box -->
              <div class="topper-trap-card p-3 rounded-xl bg-amber-500/10 border border-amber-500/25 flex flex-col gap-1 text-xs">
                <div class="flex items-center justify-between">
                  <span class="trap-title text-[10px] font-bold uppercase tracking-wider text-amber-400 font-mono flex items-center gap-1.5">
                    <span>🎯</span> Topper's Trap Detector
                  </span>
                  <span class="trap-tag text-[10px] text-amber-300 font-semibold px-1.5 py-0.2 rounded bg-amber-400/20">How to Spot in 5s</span>
                </div>
                <p class="trap-text text-xs text-slate-200 leading-relaxed font-medium">
                  ${escapeHtml(q.elimination_trap || 'Carefully verify absolute terms and categorical claims.')}
                </p>
              </div>

              <!-- Behavioral Diagnostic Tagger (If Answer was Wrong) -->
              ${!isCorrect ? `
                <div class="diag-tag-card p-3 rounded-lg bg-slate-950 border border-slate-800 flex flex-col gap-2">
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

              <!-- Core Explanation -->
              <div class="text-xs text-slate-300 leading-relaxed whitespace-pre-line border-t border-slate-800/80 pt-2.5">
                <strong class="text-white">Detailed Explanation:</strong><br>
                ${escapeHtml(q.explanation)}
              </div>

              <!-- Option-by-Option Distractor Deep Dive -->
              <div class="border-t border-slate-800/80 pt-3 mt-1 flex flex-col gap-2">
                <div class="flex items-center justify-between">
                  <span class="distractor-title text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5 font-mono">
                    <span>🔍</span> Distractor Deep Dive (Facts on Other Options)
                  </span>
                  <span class="text-[10px] text-slate-400">Context &amp; Traps</span>
                </div>
                <div class="grid grid-cols-1 gap-2 pt-1">
                  ${distractorAnalysis.map(d => `
                    <div class="distractor-item p-2.5 rounded-lg ${d.isCorrect ? 'bg-emerald-950/30 border border-emerald-500/30' : 'bg-slate-950/70 border border-slate-800/80'} text-xs">
                      <div class="flex items-center justify-between mb-1">
                        <span class="distractor-opt-title font-bold ${d.isCorrect ? 'text-emerald-400' : 'text-slate-200'} font-mono">
                          Option ${d.letter}: ${escapeHtml(d.optionText)}
                        </span>
                        <span class="distractor-badge text-[10px] font-semibold px-1.5 py-0.2 rounded ${d.isCorrect ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-800 text-slate-400'}">
                          ${d.label}
                        </span>
                      </div>
                      <p class="distractor-text text-[11px] text-slate-400 leading-relaxed">${escapeHtml(d.details)}</p>
                    </div>
                  `).join('')}
                </div>
              </div>

              <!-- Standard Reference -->
              <div class="standard-book-box p-2.5 rounded-lg bg-slate-950/80 border border-slate-800 text-xs">
                <span class="text-[10px] font-bold text-amber-400 uppercase tracking-wider block mb-0.5">📖 Standard Book Citation</span>
                <span class="text-slate-300">${escapeHtml(q.standard_book_ref)}</span>
              </div>

              <!-- Prelims-to-Mains Continuum Box -->
              ${q.mains_linkage ? `
                <div class="prelims-mains-card mt-1 p-3 rounded-lg bg-slate-950 border border-amber-500/25 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
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
                  <a href="/?prefill_q=${encodeURIComponent(q.mains_linkage.question)}&paper=${encodeURIComponent(q.mains_linkage.paper)}" class="shrink-0 text-xs font-bold px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 transition-all shadow-xs flex items-center gap-1 cursor-pointer">
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
          b.removeAttribute('data-active');
        });

        const activeStyles = conf === 'sure' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold' :
                             conf === '5050' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold' :
                             'bg-purple-500/20 text-purple-300 border border-purple-500/30 font-bold';
        e.currentTarget.className = `conf-btn px-2.5 py-1 rounded-lg text-xs transition-all ${activeStyles}`;
        e.currentTarget.setAttribute('data-active', 'true');
      });
    });

    // Option Click Handlers (Stages the option - prevents accidental submit)
    document.querySelectorAll('.opt-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const qId = e.currentTarget.getAttribute('data-qid');
        const oIdx = parseInt(e.currentTarget.getAttribute('data-oidx'), 10);
        if (STATE.answers[qId]) return; // Already locked
        STATE.stagedSelections[qId] = oIdx;
        renderQuestions();
      });
    });

    // Confirm Answer Button
    document.querySelectorAll('.confirm-ans-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const qId = e.currentTarget.getAttribute('data-qid');
        const stagedIdx = STATE.stagedSelections[qId];
        if (stagedIdx === undefined) return;
        delete STATE.stagedSelections[qId];
        handleAnswerSubmit(qId, stagedIdx);
      });
    });

    // Clear Staged Selection Button
    document.querySelectorAll('.clear-staged-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const qId = e.currentTarget.getAttribute('data-qid');
        delete STATE.stagedSelections[qId];
        renderQuestions();
      });
    });

    // Reattempt Button (Practice Mode)
    document.querySelectorAll('.reattempt-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const qId = e.currentTarget.getAttribute('data-qid');
        delete STATE.answers[qId];
        delete STATE.stagedSelections[qId];
        persistState();
        renderQuestions();
        updateMetricsDashboard();
      });
    });

    // Statement Slicer Buttons
    document.querySelectorAll('.slice-stmt-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const qId = e.currentTarget.getAttribute('data-qid');
        const sNum = parseInt(e.currentTarget.getAttribute('data-snum'), 10);
        if (!STATE.slicedStatements[qId]) STATE.slicedStatements[qId] = {};
        STATE.slicedStatements[qId][sNum] = !STATE.slicedStatements[qId][sNum];
        renderQuestions();
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

    let confidence = 'sure';
    const picker = document.getElementById(`conf-picker-${qId}`);
    if (picker) {
      const activeBtn = picker.querySelector('.conf-btn[data-active="true"]');
      if (activeBtn) confidence = activeBtn.getAttribute('data-conf') || 'sure';
    }

    const isCorrect = selectedIdx === q.correct_index;
    let justCleared = false;

    if (!isCorrect) {
      STATE.mistakes.add(qId);
    } else {
      if (STATE.mistakes.has(qId)) {
        STATE.mistakes.delete(qId);
        justCleared = true;
      }
    }

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

    // Update Target Sprint Progress
    if (STATE.target && (STATE.target.status === 'active' || STATE.target.status === 'in_progress')) {
      const matchSubject = !STATE.target.subject || 
                           STATE.target.subject === 'All Subjects' || 
                           STATE.target.subject.toLowerCase() === 'all' ||
                           (q.subject && q.subject.toLowerCase().includes(STATE.target.subject.toLowerCase())) ||
                           (STATE.target.subject.toLowerCase().includes(q.subject ? q.subject.toLowerCase() : ''));
      
      if (matchSubject) {
        if (!Array.isArray(STATE.target.solvedIds)) STATE.target.solvedIds = [];
        if (!STATE.target.solvedIds.includes(qId)) {
          STATE.target.solvedIds.push(qId);
          STATE.target.solvedCount = STATE.target.solvedIds.length;
          if (isCorrect) {
            STATE.target.correctCount = (STATE.target.correctCount || 0) + 1;
          }
          if (STATE.target.solvedCount >= STATE.target.targetQuestions) {
            STATE.target.status = 'completed';
            showToast(STATE.language === 'hi' 
              ? '🎉 बधाई! आपने अपना प्रारंभिक परीक्षा लक्ष्य पूरा कर लिया है!' 
              : '🎉 Congratulations! You achieved your Prelims Sprint Target!');
          }
        }
      }
    }

    persistState();
    renderQuestions();
    updateMetricsDashboard();
    updateTargetUI();
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

  // Update Metrics Dashboard & Heatmap
  function updateMetricsDashboard() {
    let totalAns = 0;
    let correctCount = 0;
    let incorrectCount = 0;

    let f50Total = 0;
    let f50Correct = 0;
    let guessTotal = 0;
    let guessCorrect = 0;

    Object.values(STATE.answers).forEach(ans => {
      totalAns++;
      if (ans.isCorrect) correctCount++;
      else incorrectCount++;

      if (ans.confidence === '5050') {
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
    const bannerMistakeCount = document.getElementById('bannerMistakeCount');

    if (grossEl) grossEl.textContent = `+${grossScore.toFixed(1)}`;
    if (negEl) negEl.textContent = `-${negPenalty.toFixed(1)}`;
    if (netEl) netEl.textContent = netScore >= 0 ? `+${netScore.toFixed(1)}` : `${netScore.toFixed(1)}`;
    if (navMistakesCount) navMistakesCount.textContent = STATE.mistakes.size;
    if (bannerMistakeCount) bannerMistakeCount.textContent = `${STATE.mistakes.size} Gaps Logged`;

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
      updateSubTopicHeatmap();
      return;
    }

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

    updateSubTopicHeatmap();
  }

  // Compute & Render Sub-Topic Mark-Bleed Heatmap
  function updateSubTopicHeatmap() {
    const listEl = document.getElementById('subTopicHeatmapList');
    const tagEl = document.getElementById('heatmapStatusTag');
    const adviceBox = document.getElementById('subTopicAdviceBox');
    const adviceText = document.getElementById('subTopicAdviceText');
    if (!listEl) return;

    const topicStats = {};
    Object.entries(STATE.answers).forEach(([qId, ans]) => {
      const q = STATE.pyqs.find(item => item.id === qId);
      if (!q || !q.sub_topic) return;
      const topic = q.sub_topic;
      if (!topicStats[topic]) {
        topicStats[topic] = {
          topic,
          subject: q.subject,
          total: 0,
          correct: 0,
          incorrect: 0
        };
      }
      topicStats[topic].total++;
      if (ans.isCorrect) {
        topicStats[topic].correct++;
      } else {
        topicStats[topic].incorrect++;
      }
    });

    const topicsArray = Object.values(topicStats);
    if (tagEl) {
      tagEl.textContent = `${topicsArray.length} Themes Logged`;
    }

    if (topicsArray.length === 0) {
      listEl.innerHTML = `
        <div class="p-3 text-center text-xs text-slate-500 bg-slate-950/60 rounded-xl border border-slate-800/60">
          Solve questions below to generate your micro-theme accuracy heatmap.
        </div>
      `;
      if (adviceBox) adviceBox.classList.add('hidden');
      return;
    }

    topicsArray.sort((a, b) => {
      const accA = a.correct / a.total;
      const accB = b.correct / b.total;
      if (accA !== accB) return accA - accB;
      return b.total - a.total;
    });

    let worstTopic = null;

    const html = topicsArray.map(t => {
      const acc = Math.round((t.correct / t.total) * 100);
      const netMarks = (t.correct * 2.0) - (t.incorrect * 0.66);

      let colorClass = 'text-emerald-400 bg-emerald-500/15 border-emerald-500/30';
      let barColor = 'bg-emerald-500';
      let statusLabel = 'Strong';

      if (acc < 50) {
        colorClass = 'text-rose-400 bg-rose-500/15 border-rose-500/30';
        barColor = 'bg-rose-500';
        statusLabel = 'Bleeding Marks';
        if (!worstTopic || t.total >= 2) worstTopic = t;
      } else if (acc < 75) {
        colorClass = 'text-amber-400 bg-amber-500/15 border-amber-500/30';
        barColor = 'bg-amber-500';
        statusLabel = 'Vulnerable';
      }

      return `
        <div class="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80 flex flex-col gap-1.5 text-xs">
          <div class="flex items-center justify-between">
            <span class="font-semibold text-slate-200 truncate pr-2" title="${escapeHtml(t.topic)}">
              ${escapeHtml(t.topic)}
            </span>
            <span class="px-1.5 py-0.5 rounded text-[10px] font-bold font-mono border ${colorClass} shrink-0">
              ${acc}% (${netMarks >= 0 ? '+' : ''}${netMarks.toFixed(1)}M)
            </span>
          </div>

          <div class="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
            <div class="h-full rounded-full ${barColor}" style="width: ${acc}%"></div>
          </div>

          <div class="flex items-center justify-between text-[10px] text-slate-400">
            <span>${escapeHtml(t.subject)}</span>
            <span>${t.correct}/${t.total} Solved • ${statusLabel}</span>
          </div>
        </div>
      `;
    }).join('');

    listEl.innerHTML = html;

    if (adviceBox && adviceText) {
      if (worstTopic && worstTopic.total >= 1 && (worstTopic.correct / worstTopic.total) < 0.6) {
        adviceBox.classList.remove('hidden');
        adviceText.innerHTML = `<strong>Priority Fix:</strong> You are bleeding marks in <strong>${escapeHtml(worstTopic.topic)}</strong> (${Math.round((worstTopic.correct / worstTopic.total) * 100)}% accuracy). Stop over-revising strong themes; prioritize this gap!`;
      } else {
        adviceBox.classList.add('hidden');
      }
    }
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

  // Generate & Print Mistakes Flash-Sheet (10-Minute Micro-Correction Generator)
  function generateAndPrintFlashSheet() {
    const wrongQuestions = STATE.pyqs.filter(q => STATE.mistakes.has(q.id));
    if (wrongQuestions.length === 0) {
      alert('Your Mistakes Notebook is currently empty! Answer questions on Prelims Radar to log your error patterns.');
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
      const userAns = STATE.answers[q.id];
      const userChoice = userAns ? userAns.selectedIndex : -1;
      const userLetter = userChoice >= 0 ? ['A', 'B', 'C', 'D'][userChoice] : 'Skipped';

      return `
        <div class="flash-card border border-slate-300 rounded-lg p-3.5 mb-3 bg-white text-slate-900 break-inside-avoid">
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

  // ========================================================
  // COGNITIVE TARGET ENGINE & SYLLABUS 80/20 DATA & METHODS
  // ========================================================

  let TEMP_AI_TARGET = null;

  // Authoritative 80/20 Syllabus Mastery Data Bank
  const SYLLABUS_80_20 = {
    polity: {
      titleEn: 'Polity & Governance',
      titleHi: 'राजव्यवस्था एवं शासन',
      weightageEn: '~14–16 Questions (28–32 Marks) • High Scoring Discipline',
      weightageHi: '~14–16 प्रश्न (28–32 अंक) • उच्चतम स्कोरिंग विषय',
      coreEn: [
        'Fundamental Rights (Articles 14, 19, 21, 25–28, 32 Writs: Habeas Corpus vs Quo Warranto vs Mandamus)',
        'Directive Principles & Fundamental Duties (Art 39(b)(c) vs Art 14/19; Swaran Singh Committee)',
        'Constitutional & Statutory Bodies (ECI Art 324 removal/tenure, CAG Art 148, Finance Commission Art 280, UPSC)',
        'Parliament Mechanics (Money Bill Art 110, Joint Sitting Art 108, Speaker under 10th Schedule, PAC vs Estimates Committee)',
        'Judiciary Architecture (Judicial Review, Advisory Jurisdiction Art 143, Curative Petitions, Collegium Conventions)'
      ],
      coreHi: [
        'मूल अधिकार (अनुच्छेद 14, 19, 21, 25–28, 32 रिट: बंदी प्रत्यक्षीकरण, अधिकार-पृच्छा, परमादेश)',
        'नीति निर्देशक तत्व एवं मूल कर्तव्य (अनुच्छेद 39(ख)(ग) बनाम 14/19, स्वर्ण सिंह समिति)',
        'संवैधानिक एवं सांविधिक निकाय (चुनाव आयोग अनु. 324 हटाना/वेतन, सीएजी अनु. 148, वित्त आयोग अनु. 280)',
        'संसदीय कार्यप्रणाली (धन विधेयक अनु. 110, संयुक्त बैठक अनु. 108, 10वीं अनुसूची में अध्यक्ष की शक्ति, लोक लेखा समिति)',
        'न्यायपालिका संरचना (न्यायिक समीक्षा, अनु. 143 परामर्शदात्री अधिकार, उपचारात्मक याचिका, कॉलेजियम परंपरा)'
      ],
      skipEn: [
        'Obscure colonial regulations & charter acts prior to Regulating Act 1773',
        'State Legislative Assembly minor procedural sub-rules & local municipal bylaws',
        'Minute numerical quotas and subordinate court registry grade tables',
        'Memorizing entire lists of all minor tribunals created by states'
      ],
      skipHi: [
        '1773 से पहले के पुराने औपनिवेशिक चार्टर और गौण विनियम',
        'राज्य विधानसभाओं के सूक्ष्म आंतरिक प्रक्रिया नियम और स्थानीय उप-नियम',
        'अधीनस्थ न्यायालयों के आंतरिक प्रशासनिक पदों के बारीक आंकड़े',
        'राज्यों द्वारा गठित सभी छोटे ट्रिब्यूनल की लंबी सूची रटना'
      ],
      sourcesEn: [
        'M. Laxmikanth (Priority Chapters: 7 to 11, 17 to 23, 30, 42 to 55)',
        'Class 11 NCERT: Indian Constitution at Work (Crucial for constitutional morality & separation of powers)',
        'PRS Legislative Research briefs for recent constitutional amendment acts'
      ],
      sourcesHi: [
        'एम. लक्ष्मीकांत (प्राथमिकता अध्याय: 7 से 11, 17 से 23, 30, 42 से 55)',
        'कक्षा 11 एनसीईआरटी: भारत का संविधान: सिद्धांत और व्यवहार (संवैधानिक नैतिकता एवं शक्ति पृथक्करण)',
        'पीआरएस लेजिस्लेटिव रिसर्च: नवीनतम संवैधानिक संशोधन अधिनियमों के मुख्य बिंदु'
      ],
      trapEn: 'UPSC Trap Alert: Statements stating "The Constitution explicitly defines..." when the term is governed purely by statute or convention (e.g. Office of Profit, Basic Structure, Shadow Cabinet, or removal grounds of CEC vs ECs).',
      trapHi: 'यूपीएससी जाल चेतावनी: ऐसे विकल्प जो दावा करते हैं कि "संविधान स्पष्ट रूप से परिभाषित करता है..." जबकि वह विषय केवल परंपरा या कानून द्वारा शासित होता है (उदा. लाभ का पद, मूल ढांचा, चुनाव आयुक्तों को हटाना)।'
    },

    economy: {
      titleEn: 'Economy & Banking',
      titleHi: 'भारतीय अर्थव्यवस्था एवं बैंकिंग',
      weightageEn: '~15–18 Questions (30–36 Marks) • Concept-Driven Engine',
      weightageHi: '~15–18 प्रश्न (30–36 अंक) • पूर्णतः अवधारणा आधारित',
      coreEn: [
        'RBI Balance Sheet & Monetary Tools (Repo, Reverse Repo, MSF, SDF, OMO, Sterilization, CBDC liability nature)',
        'Inflation Metrics & National Accounts (CPI vs WPI weights, Core vs Headline, GDP Deflator, Base Year mechanics)',
        'External Sector & Forex (BOP, Current Account vs Capital Account, NEER vs REER, FDI vs FPI regulations)',
        'Banking Frameworks (IBC 2016, Prompt Corrective Action, Priority Sector Lending norms, NBFC regulation)',
        'Fiscal Architecture (Fiscal Deficit, Primary Deficit, FRBM Act escape clause, Revenue vs Capital Expenditure)'
      ],
      coreHi: [
        'आरबीआई तुलन-पत्र एवं मौद्रिक उपकरण (रेपो, रिवर्स रेपो, एमएसएफ, एसडीएफ, ओएमओ, सीबीडीसी की देनदारी प्रकृति)',
        'मुद्रास्फीति एवं राष्ट्रीय आय (सीपीआई बनाम डब्ल्यूपीआई भार, कोर बनाम हेडलाइन, जीडीपी डिफ्लेटर)',
        'विदेशी क्षेत्र एवं भुगतान संतुलन (चालू खाता बनाम पूंजी खाता, नीर बनाम रीर, एफडीआई बनाम एफपीआई)',
        'बैंकिंग ढांचा (आईबीसी 2016, पीसीए फ्रेमवर्क, प्राथमिकता प्राप्त क्षेत्र ऋण-पीएसएल, एनबीएफसी विनियमन)',
        'राजकोषीय व्यवस्था (राजकोषीय घाटा, प्राथमिक घाटा, एफआरबीएम एस्केप क्लॉज, राजस्व बनाम पूंजीगत व्यय)'
      ],
      skipEn: [
        'Daily stock market swings and quarterly corporate earnings releases',
        'Minute budgetary sub-allocations under 5% for minor departmental programs',
        'Complex econometric models and theoretical IS-LM / Phillips curves',
        'Commercial brokerages short-term quarterly GDP projections'
      ],
      skipHi: [
        'शेयर बाजार के दैनिक उतार-चढ़ाव और कॉर्पोरेट त्रैमासिक वित्तीय नतीजे',
        'विभिन्न मंत्रालयों की गौण योजनाओं में 5% से कम का सूक्ष्म बजटीय आवंटन',
        'जटिल अर्थमितीय समीकरण और सैद्धांतिक वक्र (जैसे आईएस-एलएम वक्र)',
        'निजी रेटिंग एजेंसियों के अल्पकालिक त्रैमासिक जीडीपी अनुमान'
      ],
      sourcesEn: [
        'Vivek Singh / Mrunal Patel Handouts / Nitin Singhania Macroeconomics',
        'Latest Economic Survey (Chapters on State of the Economy, Prices, External Sector)',
        'Union Budget Highlights (Tax slabs, fiscal deficit roadmap, capital expenditure thrust)'
      ],
      sourcesHi: [
        'विवेक सिंह / मृणाल पटेल हैंडआउट्स / नितिन सिंघानिया भारतीय अर्थव्यवस्था',
        'नवीनतम आर्थिक सर्वेक्षण (अर्थव्यवस्था की स्थिति, मूल्य, विदेशी क्षेत्र अध्याय)',
        'केंद्रीय बजट के प्रमुख बिंदु (राजकोषीय घाटा, पूंजीगत व्यय लक्ष्य)'
      ],
      trapEn: 'UPSC Trap Alert: Inverting causal arrows (e.g. asserting that rising bond yields cause bond prices to increase, whereas they are strictly inversely related; or claiming FPI is long-term debt while FDI is speculative).',
      trapHi: 'यूपीएससी जाल चेतावनी: कार्य-कारण संबंध को उलट देना (उदा. यह कहना कि बॉन्ड यील्ड बढ़ने से बॉन्ड की कीमतें बढ़ती हैं, जबकि वे परस्पर विपरीत अनुपात में होती हैं; या एफडीआई को सट्टा पूंजी बताना)।'
    },

    environment: {
      titleEn: 'Environment & Ecology',
      titleHi: 'पर्यावरण एवं पारिस्थितिकी',
      weightageEn: '~16–20 Questions (32–40 Marks) • Static + Applied Dynamic',
      weightageHi: '~16–20 प्रश्न (32–40 अंक) • सर्वाधिक प्रश्न योगदान',
      coreEn: [
        'Protected Area Dynamics (National Parks & Reserves with rivers passing through them, flagship species)',
        'Environmental Legislations (Wildlife Protection Act 1972 Schedules 2022 amendment, EPA 1986, Biodiversity Act 2002, FRA 2006)',
        'Global Conventions & Carbon Markets (UNFCCC COP decisions, Paris Agreement Art 6, Montreal Kigali Amendment, CBD Kunming)',
        'Pollution & Bioremediation (Bioaccumulation vs Biomagnification, PM2.5 vs PM10, Microplastics, Bioremediation agents)'
      ],
      coreHi: [
        'संरक्षित क्षेत्र नेटवर्क (राष्ट्रीय उद्यान जिनसे नदियाँ गुजरती हैं, प्रमुख प्रजातियाँ जैसे एक सींग वाला गैंडा, लायन-टेल्ड मकाक)',
        'पर्यावरणीय कानून (वन्यजीव संरक्षण अधिनियम 1972 अनुसूचियाँ 2022 संशोधन, पर्यावरण संरक्षण अधिनियम 1986, जैव विविधता कानून 2002)',
        'वैश्विक अभिसमय एवं कार्बन क्रेडिट (यूएनएफसीसीसी कॉप निर्णय, पेरिस समझौता अनुच्छेद 6, मॉन्ट्रियल किगाली संशोधन)',
        'प्रदूषण एवं जैव-उपचार (बायोएक्यूमुलेशन बनाम बायोमैग्निफिकेशन, पीएम2.5, माइक्रोप्लास्टिक, जैव-उपचार सूक्ष्मजीव)'
      ],
      skipEn: [
        'Obscure district-level local bird sanctuaries with zero news occurrence',
        'Chemical IUPAC molecular formulas of obscure synthetic pollutants',
        'Memorizing all 1,000+ global IUCN Red List species (focus strictly on Indian Critically Endangered flagships)'
      ],
      skipHi: [
        'स्थानीय जिला स्तरीय छोटे पक्षी अभयारण्य जो कभी चर्चा में नहीं रहे',
        'रासायनिक प्रदूषकों के आणविक सूत्र और रासायनिक अभिक्रियाएँ',
        'दुनिया की सभी 1000+ आईयूसीएन प्रजातियों को रटना (केवल भारत की गंभीर रूप से संकटग्रस्त प्रजातियों पर ध्यान दें)'
      ],
      sourcesEn: [
        'PMFIAS Environment or Shankar IAS (Core Chapters 1-9, 15-20)',
        'Ministry of Environment, Forest and Climate Change (MoEFCC) Annual Summary'
      ],
      sourcesHi: [
        'पीएमएफआईएएस पर्यावरण या शंकर आईएएस (मुख्य अध्याय 1-9, 15-20)',
        'पर्यावरण, वन और जलवायु परिवर्तन मंत्रालय (MoEFCC) की वार्षिक रिपोर्ट का सार'
      ],
      trapEn: 'UPSC Trap Alert: Extreme absolute qualifiers like "It is found in the wild ONLY in India" or confusing Endangered with Critically Endangered categories.',
      trapHi: 'यूपीएससी जाल चेतावनी: "यह प्राकृतिक रूप से केवल भारत में पाया जाता है" जैसे चरम निरपेक्ष शब्द, या संकटग्रस्त (Endangered) को गंभीर संकटग्रस्त (CR) बता देना।'
    },

    history: {
      titleEn: 'History & Art & Culture',
      titleHi: 'इतिहास एवं कला-संस्कृति',
      weightageEn: '~14–16 Questions (28–32 Marks) • High-Yield Themes',
      weightageHi: '~14–16 प्रश्न (28–32 अंक) • उच्च प्राथमिकता विषय',
      coreEn: [
        'Ancient Core: Indus Valley civilization, Buddhism & Jainism philosophies & councils, Bodhisattvas (Maitreya, Avalokiteshvara)',
        'Medieval Administration & Terminology: Iqta, Mansabdari, Jagirdari, Vijayanagara Empire (foreign travelers, temple styles)',
        'Bhakti & Sufi Movements: Philosophies of Kabir, Guru Nanak, Ramanuja, Shankaradeva, Chaitanya Mahaprabhu',
        'Modern Nationalist Movement (1919–1947): Non-Cooperation, Civil Disobedience, Quit India, Cabinet Mission, Cripps proposals',
        'Social-Religious Reformers (Jyotirao Phule, Raja Ram Mohan Roy, Ishwar Chandra Vidyasagar, Periyar)'
      ],
      coreHi: [
        'प्राचीन भारत: सिंधु घाटी सभ्यता, बौद्ध एवं जैन दर्शन, बौद्ध संगीति, बोधिसत्व (मैत्रेय, अवलोकितेश्वर)',
        'मध्यकालीन शब्दावली एवं प्रशासन: इक्ता, मनसबदारी, जागीरदारी, विजयनगर साम्राज्य (विदेशी यात्री, मंदिर स्थापत्य)',
        'भक्ति एवं सूफी आंदोलन: कबीर, गुरु नानक, रामानुजाचार्य, शंकरदेव, चैतन्य महाप्रभु के दार्शनिक विचार',
        'आधुनिक स्वतंत्रता आंदोलन (1919–1947): असहयोग, सविनय अवज्ञा, भारत छोड़ो, कैबिनेट मिशन, क्रिप्स प्रस्ताव',
        'सामाजिक-धार्मिक सुधार आंदोलन (ज्योतिराव फुले, राजा राम मोहन राय, ईश्वर चंद्र विद्यासागर, पेरियार)'
      ],
      skipEn: [
        'Obscure dynastic wars and succession battles of minor feudal principalities',
        'Memorizing routine administrative dispatches of minor British viceroys',
        'Detailed prehistoric tool typologies beyond basic Paleolithic/Mesolithic/Neolithic markers'
      ],
      skipHi: [
        'छोटे सामंती रियासतों के आंतरिक युद्ध और वंशानुगत लड़ाइयाँ',
        'ब्रिटिश वायसरायों के सामान्य प्रशासनिक पत्राचार और तारीखें',
        'प्रागैतिहासिक काल के औजारों के अत्यंत विस्तृत वर्गीकरण'
      ],
      sourcesEn: [
        'Spectrum Modern India by Rajiv Ahir (Chapters on 1919–1947, Reformers, Press & Education)',
        'Class 11 Fine Arts NCERT: An Introduction to Indian Art (Vital for architecture & sculptures)',
        'RS Sharma (Ancient India) & Satish Chandra (Medieval India)'
      ],
      sourcesHi: [
        'स्पेक्ट्रम: आधुनिक भारत का इतिहास (राजीव अहीर)',
        'कक्षा 11 ललित कला एनसीईआरटी: भारतीय कला का परिचय (मंदिर एवं मूर्तिकला के लिए अनिवार्य)',
        'आर. एस. शर्मा (प्राचीन भारत) एवं सतीश चंद्र (मध्यकालीन भारत)'
      ],
      trapEn: 'UPSC Trap Alert: Chronological misattribution (e.g. attributing a Gupta structural temple innovation to the Mauryan or Harappan era, or misattributing classical authors).',
      trapHi: 'यूपीएससी जाल चेतावनी: कालक्रम का हेरफेर (उदा. गुप्तकालीन मंदिर कला को मौर्यकालीन बताना, या प्राचीन ग्रंथों के रचयिताओं को आपस में बदल देना)।'
    },

    geography: {
      titleEn: 'Geography & World Mapping',
      titleHi: 'भूगोल एवं विश्व मानचित्र',
      weightageEn: '~12–14 Questions (24–28 Marks) • Map-Centric Scoring',
      weightageHi: '~12–14 प्रश्न (24–28 अंक) • मानचित्र आधारित',
      coreEn: [
        'Physical Fundamentals: Plate tectonics, earthquake P vs S waves, shadow zones, landforms (fluvial, glacial, arid)',
        'Climatology & Indian Monsoon: Pressure belts, Jet streams, ITCZ movement, Somali Jet, El Niño / La Niña / IOD mechanism',
        'Indian River Systems: Indus, Ganga, Brahmaputra, Godavari, Krishna, Cauvery (origins, left vs right bank tributaries)',
        'Strategic World Mapping: Red Sea, Black Sea, Caspian Sea, Persian Gulf bordering nations, African Great Lakes, straits (Hormuz, Malacca, Bab-el-Mandeb)'
      ],
      coreHi: [
        'भौतिक भूगोल: प्लेट विवर्तनिकी, भूकंप तरंगें (पी एवं एस तरंगें), छाया क्षेत्र, भू-आकृतियाँ (नदी, हिमनद, पवन निर्मित)',
        'जलवायु विज्ञान एवं भारतीय मानसून: वायुदाब पेटियाँ, जेट स्ट्रीम, आईटीसीजेड, सोमाली जेट, अल नीनो/ला नीना/आईओडी',
        'भारतीय नदी तंत्र: सिंधु, गंगा, ब्रह्मपुत्र, गोदावरी, कृष्णा, कावेरी (उद्गम, बाएँ व दाएँ तट की सहायक नदियाँ)',
        'वैश्विक सामरिक मानचित्र: लाल सागर, काला सागर, कैस्पियन सागर, फारस की खाड़ी के सीमावर्ती देश, जलडमरूमध्य (मलक्का, होर्मुज)'
      ],
      skipEn: [
        'District-level minor agricultural statistics and micro-crop yield tables',
        'Minor stream rivulets without geographical or ecological significance',
        'Minute percentage compositions of non-major commercial minerals'
      ],
      skipHi: [
        'जिला स्तरीय छोटी कृषि सांख्यिकी और फसल उत्पादन के गौण आंकड़े',
        'सूक्ष्म मौसमी नाले और अप्रमुख जलधाराएँ',
        'गौण खनिजों के सूक्ष्म प्रतिशत वितरण'
      ],
      sourcesEn: [
        'Class 11 NCERT: Fundamentals of Physical Geography & India: Physical Environment',
        'Orient BlackSwan or Oxford Student Atlas (Daily 10-minute map visualization)'
      ],
      sourcesHi: [
        'कक्षा 11 एनसीईआरटी: भौतिक भूगोल के मूल सिद्धांत एवं भारत: भौतिक पर्यावरण',
        'ओरिएंट ब्लैकस्वॉन या ऑक्सफोर्ड एटलस (प्रतिदिन 10 मिनट मानचित्र अध्ययन)'
      ],
      trapEn: 'UPSC Trap Alert: North-to-South or West-to-East ordering distortions for seas, mountain passes, and confusion between left-bank and right-bank tributaries.',
      trapHi: 'यूपीएससी जाल चेतावनी: उत्तर-से-दक्षिण या पश्चिम-से-पूर्व क्रम में हेरफेर (उदा. दर्रे, सागर, या नदियों के बाएँ व दाएँ तट की सहायक नदियों में अदला-बदली)।'
    },

    science: {
      titleEn: 'Science & Emerging Tech',
      titleHi: 'विज्ञान एवं उभरती प्रौद्योगिकी',
      weightageEn: '~10–13 Questions (20–26 Marks) • Broad Application Focus',
      weightageHi: '~10–13 प्रश्न (20–26 अंक) • व्यावहारिक अनुप्रयोग',
      coreEn: [
        'Biotechnology & Gene Editing: CRISPR-Cas9, Recombinant DNA, Stem cell therapies, mRNA vaccine mechanism, Mitochondrial replacement therapy',
        'Space Technology: ISRO vehicles (PSLV vs GSLV vs LVM3), Orbits (LEO, GEO, Sun-Synchronous), James Webb Telescope, Gravitational waves',
        'Emerging Technologies: Artificial Intelligence, Quantum Computing, Blockchain, LiDAR vs Radar vs Sonar, NFC vs RFID',
        'Public Health & Pathogens: Zoonotic viruses, Antimicrobial Resistance (AMR), Vector-borne transmission dynamics'
      ],
      coreHi: [
        'जैव प्रौद्योगिकी एवं जीन एडिटिंग: सीआरआईएसपीआर-कैस9, पुनः संयोजक डीएनए, स्टेम सेल, एमआरएनए वैक्सीन, माइटोकॉन्ड्रियल डोनेशन',
        'अंतरिक्ष प्रौद्योगिकी: इसरो प्रक्षेपण यान (पीएसएलवी, जीएसएलवी, एलवीएम3), कक्षाएं (लियो, जियो), जेम्स वेब, गुरुत्वाकर्षण तरंगें',
        'उभरती तकनीकें: आर्टिफिशियल इंटेलिजेंस, क्वांटम कम्प्यूटिंग, ब्लॉकचेन, लिडार (LiDAR) बनाम रडार, एनएफसी बनाम आरएफआईडी',
        'सार्वजनिक स्वास्थ्य एवं रोग: जूनोटिक वायरस, रोगाणुरोधी प्रतिरोध (AMR), वेक्टर जनित बीमारियां'
      ],
      skipEn: [
        'Complex theoretical physics derivations and academic quantum mechanics formulas',
        'Commercial device hardware benchmark ratings of consumer electronics',
        'Memorizing synthetic organic IUPAC naming rules'
      ],
      skipHi: [
        'सैद्धांतिक भौतिकी के जटिल सूत्र और गणितीय व्युत्पत्ति',
        'वाणिज्यिक इलेक्ट्रॉनिक गैजेट्स के हार्डवेयर विनिर्देश',
        'रासायनिक यौगिकों के आईयूपीएसी नामकरण के जटिल नियम'
      ],
      sourcesEn: [
        'The Hindu / The Indian Express Science & Technology Sunday edition',
        'Down to Earth annual and monthly technology highlights'
      ],
      sourcesHi: [
        'द हिंदू / इंडियन एक्सप्रेस का रविवार का विज्ञान-प्रौद्योगिकी पृष्ठ',
        'डाउन टू अर्थ विज्ञान एवं तकनीक विशेष लेख'
      ],
      trapEn: 'UPSC Trap Alert: Statements declaring an emerging technology "CANNOT" be applied in a certain sector (e.g. agriculture, defense, finance). UPSC tech questions are almost always broad and permissive!',
      trapHi: 'यूपीएससी जाल चेतावनी: ऐसे विकल्प जो दावा करते हैं कि किसी तकनीक का उपयोग अमुक क्षेत्र में "नहीं किया जा सकता"। यूपीएससी के विज्ञान के प्रश्न लगभग हमेशा सकारात्मक एवं समावेशी होते हैं।'
    }
  };

  // Render Syllabus 80/20 Content into Modal
  function renderReadVsSkipContent(subjectKey = 'polity') {
    const area = document.getElementById('rvsContentArea');
    if (!area) return;

    const data = SYLLABUS_80_20[subjectKey] || SYLLABUS_80_20.polity;
    const isHi = STATE.language === 'hi';

    const title = isHi ? data.titleHi : data.titleEn;
    const weightage = isHi ? data.weightageHi : data.weightageEn;
    const coreList = isHi ? data.coreHi : data.coreEn;
    const skipList = isHi ? data.skipHi : data.skipEn;
    const sourcesList = isHi ? data.sourcesHi : data.sourcesEn;
    const trapText = isHi ? data.trapHi : data.trapEn;

    // Highlight active tab
    document.querySelectorAll('.rvs-sub-tab').forEach(b => {
      if (b.getAttribute('data-sub') === subjectKey) {
        b.className = 'rvs-sub-tab px-3 py-1.5 rounded-lg bg-indigo-500 text-slate-950 font-black shrink-0 cursor-pointer shadow-md';
      } else {
        b.className = 'rvs-sub-tab px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-400 hover:text-white shrink-0 cursor-pointer';
      }
    });

    area.innerHTML = `
      <div class="flex items-center justify-between p-3 rounded-xl bg-indigo-950/30 border border-indigo-500/30">
        <div>
          <h3 class="text-sm sm:text-base font-extrabold text-white">${escapeHtml(title)}</h3>
          <p class="text-[11px] font-mono text-indigo-300 font-semibold mt-0.5">${escapeHtml(weightage)}</p>
        </div>
        <button type="button" class="rvs-quick-solve-btn px-3 py-1.5 rounded-lg bg-indigo-500 hover:bg-indigo-400 text-slate-950 text-xs font-bold flex items-center gap-1 transition-all cursor-pointer" data-sub="${escapeHtml(subjectKey)}">
          <span>🎯</span>
          <span>${isHi ? 'इस विषय के PYQs हल करें' : 'Practice Subject PYQs'}</span>
        </button>
      </div>

      <!-- Grid: High Yield Core vs What to SKIP -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        
        <!-- High Yield (Must Read) -->
        <div class="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/40 flex flex-col gap-2.5">
          <div class="flex items-center gap-1.5 text-xs font-black text-emerald-400 uppercase tracking-wider">
            <span>🟢</span>
            <span>${isHi ? 'उच्च-प्राथमिकता वाले मुख्य विषय (80% ROI)' : 'High-Yield Core (Must Read — 80% ROI)'}</span>
          </div>
          <ul class="flex flex-col gap-2 text-[11px] text-slate-200">
            ${coreList.map(item => `
              <li class="flex items-start gap-2">
                <span class="text-emerald-400 font-bold shrink-0 mt-0.5">✓</span>
                <span class="leading-normal">${escapeHtml(item)}</span>
              </li>
            `).join('')}
          </ul>
        </div>

        <!-- Low Yield (What to SKIP) -->
        <div class="p-4 rounded-xl bg-rose-950/20 border border-rose-500/40 flex flex-col gap-2.5">
          <div class="flex items-center gap-1.5 text-xs font-black text-rose-400 uppercase tracking-wider">
            <span>🔴</span>
            <span>${isHi ? 'कम-प्राथमिकता वाले भ्रामक विषय (समय न गंवाएं)' : 'Low-Yield Traps (What to SKIP — Save Weeks)'}</span>
          </div>
          <ul class="flex flex-col gap-2 text-[11px] text-slate-300">
            ${skipList.map(item => `
              <li class="flex items-start gap-2">
                <span class="text-rose-400 font-bold shrink-0 mt-0.5">✗</span>
                <span class="leading-normal">${escapeHtml(item)}</span>
              </li>
            `).join('')}
          </ul>
        </div>

      </div>

      <!-- Authoritative Sources & Reading Priority -->
      <div class="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex flex-col gap-2">
        <div class="flex items-center gap-1.5 text-xs font-bold text-amber-400">
          <span>📚</span>
          <span>${isHi ? 'मानक अनुशंसित पुस्तकें एवं अध्याय प्राथमिकता' : 'Standard Authoritative Sources & Chapter Priority'}</span>
        </div>
        <ul class="flex flex-col gap-1.5 text-[11px] text-slate-300">
          ${sourcesList.map(item => `
            <li class="flex items-start gap-2">
              <span class="text-amber-400 shrink-0">•</span>
              <span class="leading-normal">${escapeHtml(item)}</span>
            </li>
          `).join('')}
        </ul>
      </div>

      <!-- Psychological Trap Avoidance Rule -->
      <div class="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-2 text-xs text-amber-200/95 leading-relaxed">
        <span class="text-amber-400 shrink-0 mt-0.5 text-sm">🧠</span>
        <span>${escapeHtml(trapText)}</span>
      </div>
    `;

    // Hook up the quick solve button inside
    const solveBtn = area.querySelector('.rvs-quick-solve-btn');
    if (solveBtn) {
      solveBtn.addEventListener('click', () => {
        closeReadVsSkipModal();
        const map = {
          polity: 'Polity & Governance',
          economy: 'Economy',
          environment: 'Environment & Ecology',
          history: 'History & Culture',
          geography: 'Geography',
          science: 'Science & Technology'
        };
        const targetSub = map[subjectKey] || 'all';
        STATE.activeSubject = targetSub;
        syncSubjectTabsUI();
        const slug = REVERSE_SLUGS[targetSub] || '';
        try {
          window.history.pushState(null, '', slug ? `/prelims/${slug}` : '/prelims');
        } catch (e) {}
        applyFilters();
        const container = document.getElementById('questionsContainer');
        if (container) container.scrollIntoView({ behavior: 'smooth' });
        showToast(isHi ? `${targetSub} के प्रश्न लोड किए गए!` : `Filtered to ${targetSub} PYQs!`);
      });
    }
  }

  // Cognitive Target Engine & Micro-Study Planner UI Updater
  function updateTargetUI() {
    const isHi = STATE.language === 'hi';
    const statusBadge = document.getElementById('targetStatusBadge');
    const subjectText = document.getElementById('targetSubjectText');
    const ratioText = document.getElementById('targetProgressRatio');
    const progressBar = document.getElementById('targetProgressBar');
    const daysRemainingText = document.getElementById('targetDaysRemainingText');
    const paceText = document.getElementById('targetPaceText');
    const navBadge = document.getElementById('navTargetBadge');
    const backlogAlert = document.getElementById('targetBacklogAlert');
    const backlogTitle = document.getElementById('targetBacklogTitle');
    const backlogDesc = document.getElementById('targetBacklogDesc');

    // If no target or status is none
    if (!STATE.target || STATE.target.status === 'none' || !STATE.target.status) {
      if (statusBadge) {
        statusBadge.textContent = isHi ? 'कोई लक्ष्य नहीं' : 'No Target Set';
        statusBadge.className = 'text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-800 text-slate-400 border border-slate-700 font-bold';
      }
      if (subjectText) subjectText.textContent = isHi ? 'सभी विषय' : 'All Subjects';
      if (ratioText) ratioText.textContent = '0 / 30 Qs';
      if (progressBar) progressBar.style.width = '0%';
      if (daysRemainingText) daysRemainingText.textContent = isHi ? '7 दिनों की समय सीमा' : '7 Days Window';
      if (paceText) paceText.textContent = isHi ? 'गति: 5 प्रश्न/दिन' : 'Pace: 5 Qs / day';
      if (navBadge) {
        navBadge.textContent = isHi ? 'सेट करें' : 'Set';
        navBadge.className = 'px-1.5 py-0.2 rounded-full bg-slate-700 text-slate-300 text-[10px] font-black';
      }
      if (backlogAlert) backlogAlert.classList.add('hidden');
      return;
    }

    // Target is active or completed
    const solved = STATE.target.solvedCount || 0;
    const total = STATE.target.targetQuestions || 30;
    const pct = Math.min(100, Math.round((solved / total) * 100));
    const isCompleted = STATE.target.status === 'completed' || solved >= total;

    if (statusBadge) {
      if (isCompleted) {
        statusBadge.textContent = isHi ? '✓ लक्ष्य पूर्ण' : '✓ Completed';
        statusBadge.className = 'text-[10px] font-mono px-2 py-0.5 rounded-md bg-emerald-500 text-slate-950 font-black';
      } else {
        statusBadge.textContent = isHi ? 'सक्रिय लक्ष्य' : 'Active Sprint';
        statusBadge.className = 'text-[10px] font-mono px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold';
      }
    }

    if (subjectText) {
      subjectText.textContent = STATE.target.subject || (isHi ? 'सभी विषय' : 'All Subjects');
    }
    if (ratioText) {
      ratioText.textContent = `${solved} / ${total} Qs (${pct}%)`;
    }
    if (progressBar) {
      progressBar.style.width = `${pct}%`;
      if (isCompleted) {
        progressBar.className = 'h-full bg-emerald-400 rounded-full transition-all duration-500';
      } else {
        progressBar.className = 'h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500';
      }
    }

    // Days remaining & Backlog calculation
    let daysLeft = STATE.target.durationDays || 7;
    let backlog = 0;
    if (STATE.target.startDate) {
      const msPerDay = 1000 * 60 * 60 * 24;
      const startMs = new Date(STATE.target.startDate).getTime();
      const elapsedDays = Math.max(1, Math.floor((Date.now() - startMs) / msPerDay) + 1);
      const totalDays = STATE.target.durationDays || 7;
      daysLeft = Math.max(0, totalDays - elapsedDays + 1);

      const dailyGoal = STATE.target.dailyGoal || Math.ceil(total / totalDays);
      const expected = Math.min(total, elapsedDays * dailyGoal);
      backlog = Math.max(0, expected - solved);
    }

    if (daysRemainingText) {
      daysRemainingText.textContent = isHi ? `${daysLeft} दिन शेष` : `${daysLeft} Days Left`;
    }
    if (paceText) {
      const paceVal = STATE.target.dailyGoal || 5;
      paceText.textContent = isHi ? `गति: ${paceVal} प्रश्न/दिन` : `Pace: ${paceVal} Qs/day`;
    }

    if (navBadge) {
      navBadge.textContent = isCompleted ? '100%' : `${pct}%`;
      navBadge.className = isCompleted 
        ? 'px-1.5 py-0.2 rounded-full bg-emerald-400 text-slate-950 text-[10px] font-black'
        : 'px-1.5 py-0.2 rounded-full bg-emerald-500 text-slate-950 text-[10px] font-black';
    }

    // Backlog Alert
    if (backlogAlert) {
      if (backlog > 0 && !isCompleted) {
        backlogAlert.classList.remove('hidden');
        if (backlogTitle) {
          backlogTitle.textContent = isHi 
            ? `⚠️ बैकलॉग रडार: ${backlog} प्रश्न पीछे चल रहे हैं!`
            : `⚠️ Left-Out Backlog Radar: ${backlog} Qs Behind Schedule!`;
        }
        if (backlogDesc) {
          backlogDesc.textContent = isHi
            ? `यूपीएससी पाठ्यक्रम में बैकलॉग बढ़ने से अंतिम समय का दबाव बढ़ता है। अपने ${STATE.target.subject} के लक्ष्य को पूरा करने के लिए तुरंत 10-मिनट का अभ्यास करें।`
            : `Syllabus drift happens quietly. Catch up on your ${STATE.target.subject} backlog now before your revision window shrinks.`;
        }
      } else {
        backlogAlert.classList.add('hidden');
      }
    }

    // Modal Active Tab Details
    const activeSprintBadge = document.getElementById('activeSprintBadge');
    const activeSprintDaysLeft = document.getElementById('activeSprintDaysLeft');
    const activeSprintTitle = document.getElementById('activeSprintSubjectTitle');
    const activeSprintRatio = document.getElementById('activeSprintCountRatio');
    const activeSprintBar = document.getElementById('activeSprintProgressBar');
    const activeSprintAcc = document.getElementById('activeSprintAccuracy');
    const activeSprintBacklog = document.getElementById('activeSprintBacklogStatus');

    if (activeSprintTitle) {
      activeSprintTitle.textContent = STATE.target.title || `${STATE.target.subject} Sprint`;
    }
    if (activeSprintDaysLeft) {
      activeSprintDaysLeft.textContent = isHi ? `${daysLeft} दिन शेष` : `${daysLeft} Days Left`;
    }
    if (activeSprintRatio) {
      activeSprintRatio.textContent = `${solved} / ${total} (${pct}%)`;
    }
    if (activeSprintBar) {
      activeSprintBar.style.width = `${pct}%`;
    }
    if (activeSprintAcc) {
      const correct = STATE.target.correctCount || 0;
      const acc = solved > 0 ? Math.round((correct / solved) * 100) : 0;
      activeSprintAcc.textContent = `${acc}%`;
    }
    if (activeSprintBacklog) {
      if (isCompleted) {
        activeSprintBacklog.textContent = isHi ? 'लक्ष्य पूर्ण ✓' : 'Completed ✓';
        activeSprintBacklog.className = 'text-sm font-extrabold text-emerald-400';
      } else if (backlog > 0) {
        activeSprintBacklog.textContent = isHi ? `${backlog} प्रश्न पीछे ⚠️` : `${backlog} Qs Behind ⚠️`;
        activeSprintBacklog.className = 'text-sm font-extrabold text-rose-400';
      } else {
        activeSprintBacklog.textContent = isHi ? 'सही गति पर ✓' : 'On Track ✓';
        activeSprintBacklog.className = 'text-sm font-extrabold text-emerald-400';
      }
    }
  }

  // Switch Goal Planner Modal Tabs
  function switchGoalTab(tab) {
    const tabAiBtn = document.getElementById('goalTabAiBtn');
    const tabCustomBtn = document.getElementById('goalTabCustomBtn');
    const tabActiveBtn = document.getElementById('goalTabActiveBtn');
    const aiContent = document.getElementById('goalTabAiContent');
    const customContent = document.getElementById('goalTabCustomContent');
    const activeContent = document.getElementById('goalTabActiveContent');

    const allBtns = [tabAiBtn, tabCustomBtn, tabActiveBtn];
    const allContents = [aiContent, customContent, activeContent];

    allBtns.forEach(b => {
      if (b) b.className = 'goal-modal-tab-btn flex-1 py-2 px-3 rounded-lg text-center transition-all text-slate-400 hover:text-white cursor-pointer';
    });
    allContents.forEach(c => {
      if (c) c.classList.add('hidden');
    });

    if (tab === 'ai') {
      if (tabAiBtn) tabAiBtn.className = 'goal-modal-tab-btn flex-1 py-2 px-3 rounded-lg text-center transition-all bg-emerald-500 text-slate-950 font-black cursor-pointer';
      if (aiContent) aiContent.classList.remove('hidden');
    } else if (tab === 'custom') {
      if (tabCustomBtn) tabCustomBtn.className = 'goal-modal-tab-btn flex-1 py-2 px-3 rounded-lg text-center transition-all bg-emerald-500 text-slate-950 font-black cursor-pointer';
      if (customContent) customContent.classList.remove('hidden');
    } else if (tab === 'active') {
      if (tabActiveBtn) tabActiveBtn.className = 'goal-modal-tab-btn flex-1 py-2 px-3 rounded-lg text-center transition-all bg-emerald-500 text-slate-950 font-black cursor-pointer';
      if (activeContent) activeContent.classList.remove('hidden');
    }
  }

  // Open & Close Goal Modal
  function openGoalModal(defaultTab = 'ai') {
    const modal = document.getElementById('goalPlannerModal');
    if (!modal) return;
    modal.classList.remove('hidden');
    // If active sprint exists and is active, switch to active tab, else default
    if (STATE.target && STATE.target.status === 'active' && defaultTab === 'ai') {
      switchGoalTab('active');
    } else {
      switchGoalTab(defaultTab);
    }
    updateTargetUI();
  }

  function closeGoalModal() {
    const modal = document.getElementById('goalPlannerModal');
    if (modal) modal.classList.add('hidden');
  }

  // Open & Close Read vs Skip Modal
  function openReadVsSkipModal(defaultSub = 'polity') {
    const modal = document.getElementById('readVsSkipModal');
    if (!modal) return;
    modal.classList.remove('hidden');
    renderReadVsSkipContent(defaultSub);
  }

  function closeReadVsSkipModal() {
    const modal = document.getElementById('readVsSkipModal');
    if (modal) modal.classList.add('hidden');
  }

  // AI Diagnostic Target Generator
  function generateAiDiagnosticTarget() {
    const stageBtn = document.querySelector('#diagQ1Group .selected-diag-opt');
    const hoursBtn = document.querySelector('#diagQ2Group .selected-diag-opt');
    const leakBtn = document.querySelector('#diagQ3Group .selected-diag-opt');
    const subjectEl = document.getElementById('diagSubjectSelect');

    const stage = stageBtn ? stageBtn.getAttribute('data-val') : 'Intermediate';
    const hours = hoursBtn ? hoursBtn.getAttribute('data-val') : '3-4';
    const leak = leakBtn ? leakBtn.getAttribute('data-val') : '50_50_trap';
    const subject = subjectEl ? subjectEl.value : 'Polity & Governance';

    let totalQs = 35;
    let daily = 5;
    let days = 7;

    if (hours === '1-2') {
      totalQs = 25;
      daily = 4;
      days = 7;
    } else if (hours === '3-4') {
      totalQs = 45;
      daily = 7;
      days = 7;
    } else if (hours === '5+') {
      totalQs = 70;
      daily = 10;
      days = 7;
    }

    let directive = '';
    let focus = '';

    if (stage === 'Beginner') {
      directive = `Focus strictly on building core conceptual intuition. Solve ${daily} questions daily, review 100% of standard book citations, and do not rush for speed.`;
    } else if (stage === 'Intermediate') {
      directive = `Target disciplined 50:50 elimination. Check your Expected Value (EV) on every educated guess to avoid leaking negative marks (-0.66).`;
    } else {
      directive = `Master rapid 10-Second Statement Slicing. Eliminate extreme trap qualifiers and dissect incorrect distractors to guarantee a 105+ score buffer.`;
    }

    if (leak === '50_50_trap') {
      focus = `Train yourself to demand proof of factual inaccuracy before eliminating. Study the "Topper's Trap Detector" on every question.`;
    } else if (leak === 'silly_reading') {
      focus = `Always use the interactive Statement Slicer to cross out statements visually. Highlight directives like "NOT correct" before viewing options.`;
    } else if (leak === 'static_memory') {
      focus = `Refer to our 80/20 Read vs Skip cheat-sheet daily. Reinforce Constitutional Articles, Acts, and key statutory bodies.`;
    } else {
      focus = `Use our Cutoff Sweet Spot simulator to realize that attempting fewer than 75 questions carries severe mathematical risk. Build confidence by solving authentic PYQs.`;
    }

    TEMP_AI_TARGET = {
      title: `${subject} Cognitive Mastery Sprint`,
      subject: subject,
      targetQuestions: totalQs,
      durationDays: days,
      dailyGoal: daily,
      directive: directive,
      highYieldFocus: focus,
      stage: stage,
      hours: hours,
      leak: leak
    };

    // Render result card
    const card = document.getElementById('aiTargetResultCard');
    const titleEl = document.getElementById('aiPlanTitle');
    const dirEl = document.getElementById('aiPlanDirective');
    const focusEl = document.getElementById('aiPlanFocus');
    const paceEl = document.getElementById('aiPlanPacingText');

    if (titleEl) titleEl.textContent = TEMP_AI_TARGET.title;
    if (dirEl) dirEl.textContent = directive;
    if (focusEl) focusEl.textContent = focus;
    if (paceEl) paceEl.textContent = `Target: ${totalQs} Questions • Pace: ${daily} Qs / day • 7 Days Window`;

    if (card) card.classList.remove('hidden');
  }

  // Accept and Activate AI Target
  function acceptAiTarget() {
    if (!TEMP_AI_TARGET) return;

    STATE.target = {
      id: 'target_' + Date.now(),
      title: TEMP_AI_TARGET.title,
      subject: TEMP_AI_TARGET.subject,
      targetQuestions: TEMP_AI_TARGET.targetQuestions,
      solvedIds: [],
      solvedCount: 0,
      correctCount: 0,
      startDate: new Date().toISOString(),
      deadlineDate: new Date(Date.now() + TEMP_AI_TARGET.durationDays * 24 * 60 * 60 * 1000).toISOString(),
      durationDays: TEMP_AI_TARGET.durationDays,
      dailyGoal: TEMP_AI_TARGET.dailyGoal,
      status: 'active',
      strategyDirective: TEMP_AI_TARGET.directive,
      highYieldFocus: TEMP_AI_TARGET.highYieldFocus,
      diagnosticProfile: {
        stage: TEMP_AI_TARGET.stage,
        hours: TEMP_AI_TARGET.hours,
        leak: TEMP_AI_TARGET.leak
      }
    };

    persistState();
    updateTargetUI();
    closeGoalModal();
    showToast(STATE.language === 'hi' ? '🎯 नया लक्ष्य सक्रिय कर दिया गया है!' : '🎯 Cognitive Target Activated!');
  }

  // Save Custom Target
  function saveCustomTarget() {
    const subEl = document.getElementById('customSubjectSelect');
    const countEl = document.getElementById('customCountSelect');
    const daysEl = document.getElementById('customDaysSelect');

    const subject = subEl ? subEl.value : 'All Subjects';
    const count = countEl ? parseInt(countEl.value, 10) : 30;
    const days = daysEl ? parseInt(daysEl.value, 10) : 7;
    const daily = Math.ceil(count / days);

    STATE.target = {
      id: 'target_' + Date.now(),
      title: `${subject} Custom Target`,
      subject: subject,
      targetQuestions: count,
      solvedIds: [],
      solvedCount: 0,
      correctCount: 0,
      startDate: new Date().toISOString(),
      deadlineDate: new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString(),
      durationDays: days,
      dailyGoal: daily,
      status: 'active',
      strategyDirective: 'Self-directed daily study sprint.',
      highYieldFocus: 'Solve authentic UPSC PYQs consistently.',
      diagnosticProfile: null
    };

    persistState();
    updateTargetUI();
    closeGoalModal();
    showToast(STATE.language === 'hi' ? '🎯 नया लक्ष्य सक्रिय कर दिया गया है!' : '🎯 Custom Target Saved & Activated!');
  }

  // Activate 10-Min Catch-Up Drill
  function activateCatchUpDrill() {
    if (!STATE.target || STATE.target.status === 'none') {
      openGoalModal('ai');
      return;
    }

    closeGoalModal();
    const sub = STATE.target.subject;
    if (sub && sub !== 'All Subjects') {
      STATE.activeSubject = sub;
      syncSubjectTabsUI();
      const slug = REVERSE_SLUGS[sub] || '';
      try {
        window.history.pushState(null, '', slug ? `/prelims/${slug}` : '/prelims');
      } catch (e) {}
    } else {
      STATE.activeSubject = 'all';
      syncSubjectTabsUI();
    }

    applyFilters();
    const container = document.getElementById('questionsContainer');
    if (container) container.scrollIntoView({ behavior: 'smooth' });

    showToast(STATE.language === 'hi'
      ? `⚡ 10-मिनट कैच-अप ड्रिल: ${STATE.target.subject} के प्रश्न लोड किए गए!`
      : `⚡ 10-Min Catch-Up Drill: Filtered to ${STATE.target.subject} PYQs!`);
  }

  // Setup Target Engine and Modals Listeners
  function initTargetEngine() {
    // Header Triggers
    const openGoalsBtn = document.getElementById('openGoalsModalBtn');
    if (openGoalsBtn) openGoalsBtn.addEventListener('click', () => openGoalModal());

    const openReadVsSkipBtn = document.getElementById('openReadVsSkipBtn');
    if (openReadVsSkipBtn) openReadVsSkipBtn.addEventListener('click', () => openReadVsSkipModal());

    // Sidebar Triggers
    const sidebarSetBtn = document.getElementById('sidebarSetTargetBtn');
    if (sidebarSetBtn) sidebarSetBtn.addEventListener('click', () => openGoalModal());

    const sidebarReadBtn = document.getElementById('sidebarReadVsSkipBtn');
    if (sidebarReadBtn) sidebarReadBtn.addEventListener('click', () => openReadVsSkipModal());

    const sidebarCatchUp = document.getElementById('targetCatchUpBtn');
    if (sidebarCatchUp) sidebarCatchUp.addEventListener('click', activateCatchUpDrill);

    // Mobile Dock Triggers
    const mobTargetsBtn = document.getElementById('mobNavTargetsBtn');
    if (mobTargetsBtn) mobTargetsBtn.addEventListener('click', () => openGoalModal());

    const mobReadBtn = document.getElementById('mobNavReadSkipBtn');
    if (mobReadBtn) mobReadBtn.addEventListener('click', () => openReadVsSkipModal());

    // Close Buttons
    const closeGoalBtn = document.getElementById('closeGoalModalBtn');
    if (closeGoalBtn) closeGoalBtn.addEventListener('click', closeGoalModal);

    const closeReadBtn = document.getElementById('closeReadVsSkipBtn');
    if (closeReadBtn) closeReadBtn.addEventListener('click', closeReadVsSkipModal);

    // Backdrop Click Closures
    const goalModal = document.getElementById('goalPlannerModal');
    if (goalModal) {
      goalModal.addEventListener('click', (e) => {
        if (e.target === goalModal) closeGoalModal();
      });
    }

    const rvsModal = document.getElementById('readVsSkipModal');
    if (rvsModal) {
      rvsModal.addEventListener('click', (e) => {
        if (e.target === rvsModal) closeReadVsSkipModal();
      });
    }

    // Modal Tabs
    const tabAiBtn = document.getElementById('goalTabAiBtn');
    if (tabAiBtn) tabAiBtn.addEventListener('click', () => switchGoalTab('ai'));

    const tabCustomBtn = document.getElementById('goalTabCustomBtn');
    if (tabCustomBtn) tabCustomBtn.addEventListener('click', () => switchGoalTab('custom'));

    const tabActiveBtn = document.getElementById('goalTabActiveBtn');
    if (tabActiveBtn) tabActiveBtn.addEventListener('click', () => switchGoalTab('active'));

    // Diagnostic Option Groups (Single Select per Group)
    ['diagQ1Group', 'diagQ2Group', 'diagQ3Group'].forEach(groupId => {
      const group = document.getElementById(groupId);
      if (group) {
        group.querySelectorAll('.diag-opt-btn').forEach(btn => {
          btn.addEventListener('click', (e) => {
            group.querySelectorAll('.diag-opt-btn').forEach(b => {
              b.classList.remove('selected-diag-opt');
            });
            e.currentTarget.classList.add('selected-diag-opt');
          });
        });
      }
    });

    // Generate AI Target Button
    const genAiBtn = document.getElementById('generateAiTargetBtn');
    if (genAiBtn) genAiBtn.addEventListener('click', generateAiDiagnosticTarget);

    // Accept AI Target Button
    const acceptAiBtn = document.getElementById('acceptAiTargetBtn');
    if (acceptAiBtn) acceptAiBtn.addEventListener('click', acceptAiTarget);

    // Save Custom Target Button
    const saveCustomBtn = document.getElementById('saveCustomTargetBtn');
    if (saveCustomBtn) saveCustomBtn.addEventListener('click', saveCustomTarget);

    // Custom Target Pace Live Calculator
    const countSelect = document.getElementById('customCountSelect');
    const daysSelect = document.getElementById('customDaysSelect');
    const paceCalcEl = document.getElementById('customDailyPaceCalc');
    const updateCustomPace = () => {
      if (countSelect && daysSelect && paceCalcEl) {
        const c = parseInt(countSelect.value, 10);
        const d = parseInt(daysSelect.value, 10);
        paceCalcEl.textContent = `~${Math.ceil(c / d)} Questions / day`;
      }
    };
    if (countSelect) countSelect.addEventListener('change', updateCustomPace);
    if (daysSelect) daysSelect.addEventListener('change', updateCustomPace);

    // Active Sprint Tab Buttons
    const jumpBtn = document.getElementById('activeSprintJumpBtn');
    if (jumpBtn) jumpBtn.addEventListener('click', activateCatchUpDrill);

    const resetBtn = document.getElementById('resetTargetBtn');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        const isHi = STATE.language === 'hi';
        if (confirm(isHi ? 'क्या आप सक्रिय लक्ष्य को हटाना चाहते हैं?' : 'Are you sure you want to clear your active sprint?')) {
          STATE.target = {
            id: null,
            title: '',
            subject: 'All Subjects',
            targetQuestions: 30,
            solvedIds: [],
            solvedCount: 0,
            correctCount: 0,
            startDate: null,
            deadlineDate: null,
            durationDays: 7,
            dailyGoal: 5,
            status: 'none'
          };
          persistState();
          updateTargetUI();
          switchGoalTab('ai');
          showToast(isHi ? 'सक्रिय लक्ष्य रीसेट कर दिया गया है' : 'Target has been reset');
        }
      });
    }

    // Read vs Skip Subject Tabs
    document.querySelectorAll('.rvs-sub-tab').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const subKey = e.currentTarget.getAttribute('data-sub') || 'polity';
        renderReadVsSkipContent(subKey);
      });
    });

    // Initial UI update
    updateTargetUI();
  }

  // Bilingual UI Translations Dictionary
  const I18N = {
    en: {
      langLabel: 'English',
      searchPlaceholder: 'Search any topic, act, judgment, or theme (e.g. Preamble, Monetary Policy, Wetlands, Western Ghats, Harappan, Inflation, CBDC)...',
      allSubjects: 'All Subjects',
      polity: 'Polity',
      economy: 'Economy',
      environment: 'Environment',
      history: 'History',
      geography: 'Geography',
      sciTech: 'Sci-Tech',
      allYears: 'All Years (2013-2026)',
      practiceMode: '📖 Practice',
      examMode: '⏱️ Exam (Timed)',
      viewAll: 'View: All PYQs',
      viewMistakes: 'View: My Mistakes Only',
      viewGuesses: 'View: My Flukes & Guesses',
      microCorrectionTitle: '10-Minute "Micro-Correction" Generator',
      exportFlashSheet: '🖨️ Export Revision Flash-Sheet',
      clearMistakesBtn: 'Clear All Logged Mistakes'
    },
    hi: {
      langLabel: 'हिंदी',
      searchPlaceholder: 'विषय, अधिनियम, निर्णय या अवधारणा खोजें (उदा. प्रस्तावना, मौद्रिक नीति, आर्द्रभूमि, पश्चिमी घाट, हड़प्पा, मुद्रास्फीति)...',
      allSubjects: 'सभी विषय',
      polity: 'राजव्यवस्था',
      economy: 'अर्थव्यवस्था',
      environment: 'पर्यावरण',
      history: 'इतिहास',
      geography: 'भूगोल',
      sciTech: 'विज्ञान-प्रौद्योगिकी',
      allYears: 'सभी वर्ष (2013-2026)',
      practiceMode: '📖 अभ्यास मोड',
      examMode: '⏱️ परीक्षा (समयबद्ध)',
      viewAll: 'देखें: सभी प्रश्न',
      viewMistakes: 'देखें: मेरी गलतियाँ',
      viewGuesses: 'देखें: मेरे तुक्के व अनुमान',
      microCorrectionTitle: '10-मिनट "माइक्रो-करेक्शन" जनरेटर',
      exportFlashSheet: '🖨️ रिवीजन फ्लैश-शीट डाउनलोड करें',
      clearMistakesBtn: 'सभी दर्ज गलतियाँ मिटाएँ'
    }
  };

  function syncLanguageUI() {
    const lang = STATE.language || 'en';
    const dict = I18N[lang] || I18N.en;

    const langLabel = document.getElementById('langLabel');
    if (langLabel) langLabel.textContent = dict.langLabel;

    const searchInput = document.getElementById('topicSearchInput');
    if (searchInput) searchInput.placeholder = dict.searchPlaceholder;

    // Update Subject tab text
    document.querySelectorAll('.subject-tab').forEach(b => {
      const sub = b.getAttribute('data-subject');
      if (sub === 'all') b.textContent = dict.allSubjects;
      else if (sub === 'Polity & Governance') b.textContent = dict.polity;
      else if (sub === 'Economy') b.textContent = dict.economy;
      else if (sub === 'Environment & Ecology') b.textContent = dict.environment;
      else if (sub === 'History & Culture') b.textContent = dict.history;
      else if (sub === 'Geography') b.textContent = dict.geography;
      else if (sub === 'Science & Technology') b.textContent = dict.sciTech;
    });

    // Update Mode buttons
    const pracBtn = document.getElementById('modePracticeBtn');
    const examBtn = document.getElementById('modeExamBtn');
    if (pracBtn) pracBtn.textContent = dict.practiceMode;
    if (examBtn) examBtn.textContent = dict.examMode;

    // Update view filter options
    const viewSelect = document.getElementById('viewFilterSelect');
    if (viewSelect && viewSelect.options.length >= 3) {
      viewSelect.options[0].textContent = dict.viewAll;
      viewSelect.options[1].textContent = dict.viewMistakes;
      viewSelect.options[2].textContent = dict.viewGuesses;
    }

    // Micro correction banner
    const bannerTitle = document.querySelector('#microCorrectionBanner span.font-mono');
    if (bannerTitle) bannerTitle.textContent = dict.microCorrectionTitle;
    const bannerBtn = document.getElementById('bannerExportFlashSheetBtn');
    if (bannerBtn) bannerBtn.innerHTML = `<span>${dict.exportFlashSheet}</span><span>→</span>`;

    // Target Engine & Read vs Skip Header & Sidebar Labels
    const isHi = lang === 'hi';
    const headerTargetLabel = document.getElementById('headerTargetLabel');
    if (headerTargetLabel) headerTargetLabel.textContent = isHi ? 'लक्ष्य' : 'Targets';
    const headerReadVsSkipLabel = document.getElementById('headerReadVsSkipLabel');
    if (headerReadVsSkipLabel) headerReadVsSkipLabel.textContent = isHi ? 'क्या पढ़ें / क्या छोड़ें' : 'Read vs Skip';
    const sidebarSetBtnText = document.getElementById('sidebarSetTargetBtnText');
    if (sidebarSetBtnText) sidebarSetBtnText.textContent = isHi ? 'लक्ष्य तय करें' : 'Set Target';
    const sidebarReadBtnText = document.getElementById('sidebarReadVsSkipBtnText');
    if (sidebarReadBtnText) sidebarReadBtnText.textContent = isHi ? 'क्या पढ़ें / छोड़ें' : 'Read vs Skip';

    // Mobile nav dock labels
    const mobNavPyqs = document.getElementById('mobNavPyqs');
    if (mobNavPyqs) mobNavPyqs.textContent = isHi ? '100+ प्रश्न' : '100+ PYQs';
    const mobNavTargets = document.getElementById('mobNavTargets');
    if (mobNavTargets) mobNavTargets.textContent = isHi ? 'लक्ष्य' : 'Targets';
    const mobNavReadSkip = document.getElementById('mobNavReadSkip');
    if (mobNavReadSkip) mobNavReadSkip.textContent = isHi ? 'पढ़ें/छोड़ें' : 'Read/Skip';
    const mobNavHeatmap = document.getElementById('mobNavHeatmap');
    if (mobNavHeatmap) mobNavHeatmap.textContent = isHi ? 'हीटमैप' : 'Heatmap';
    const mobNavMistakes = document.getElementById('mobNavMistakes');
    if (mobNavMistakes) mobNavMistakes.textContent = isHi ? 'गलतियाँ' : 'Mistakes';

    // Modals Header Labels
    const goalModalTitle = document.getElementById('goalModalTitle');
    const goalModalSub = document.getElementById('goalModalSubtitle');
    if (goalModalTitle) goalModalTitle.textContent = isHi ? 'संज्ञानात्मक लक्ष्य इंजन एवं माइक्रो-स्टडी प्लानर' : 'Cognitive Target Engine';
    if (goalModalSub) goalModalSub.textContent = isHi 
      ? 'यूपीएससी पाठ्यक्रम की विशालता से विचलित होने से बचाने के लिए वैज्ञानिक रूप से कैलिब्रेटेड अध्ययन लक्ष्य।'
      : 'Psychologically calibrated study targets designed to prevent syllabus drift and negative mark leaks.';

    const rvsTitle = document.getElementById('readVsSkipTitle');
    const rvsSub = document.getElementById('readVsSkipSubtitle');
    if (rvsTitle) rvsTitle.textContent = isHi ? 'क्या पढ़ें और क्या छोड़ें (80/20 नियम)' : 'What to Read vs What to SKIP (80/20 Rule)';
    if (rvsSub) rvsSub.textContent = isHi
      ? '70% गैर-ज़रूरी अध्ययन तनाव को समाप्त करें। केवल उन्हीं विषयों पर ध्यान केंद्रित करें जहाँ से 80% प्रश्न आते हैं।'
      : 'Eliminate 70% of low-yield preparation anxiety. Focus strictly on topics where UPSC actually sets 80% of prelims questions.';

    updateTargetUI();
  }

  // Setup UI Listeners (Tabs, Filter, Clear, Share, Export, Mobile Dock)
  function setupUIListeners() {
    // Topic Search Input
    const searchInput = document.getElementById('topicSearchInput');
    const clearSearchBtn = document.getElementById('clearTopicSearchBtn');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        STATE.searchQuery = e.target.value;
        applyFilters();
      });
    }
    if (clearSearchBtn) {
      clearSearchBtn.addEventListener('click', () => {
        STATE.searchQuery = '';
        if (searchInput) searchInput.value = '';
        applyFilters();
      });
    }

    // Year Matrix Tabs
    document.querySelectorAll('.year-tab').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const yr = e.currentTarget.getAttribute('data-year') || 'all';
        STATE.activeYear = yr;
        
        document.querySelectorAll('.year-tab').forEach(b => {
          b.className = 'year-tab px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-900 text-slate-300 border border-slate-800 hover:text-white shrink-0 cursor-pointer';
        });
        e.currentTarget.className = 'year-tab px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-500 text-slate-950 shrink-0 cursor-pointer';

        applyFilters();
      });
    });

    // Bilingual Language Toggle (English / हिंदी)
    const langBtn = document.getElementById('toggleLangBtn');
    if (langBtn) {
      langBtn.addEventListener('click', () => {
        STATE.language = STATE.language === 'en' ? 'hi' : 'en';
        localStorage.setItem('cm_prelims_lang', STATE.language);
        syncLanguageUI();
        renderQuestions();
        showToast(STATE.language === 'hi' ? 'भाषा बदलकर हिंदी कर दी गई है' : 'Language set to English');
      });
    }

    // Subject Tab Buttons
    document.querySelectorAll('.subject-tab').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const sub = e.currentTarget.getAttribute('data-subject') || 'all';
        STATE.activeSubject = sub;
        syncSubjectTabsUI();
        updateSEOMeta();

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
        const container = document.getElementById('questionsContainer');
        if (container) container.scrollIntoView({ behavior: 'smooth' });
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

    // Banner Export Flash-Sheet Button
    const bannerExportBtn = document.getElementById('bannerExportFlashSheetBtn');
    if (bannerExportBtn) {
      bannerExportBtn.addEventListener('click', generateAndPrintFlashSheet);
    }

    // Share Cutoff Sweet Spot Button
    const shareBtn = document.getElementById('shareSweetSpotBtn');
    if (shareBtn) {
      shareBtn.addEventListener('click', shareSweetSpot);
    }

    // Mobile Bottom Navigation Dock Buttons
    document.querySelectorAll('.mobile-nav-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const targetId = e.currentTarget.getAttribute('data-target');
        const view = e.currentTarget.getAttribute('data-view');

        document.querySelectorAll('.mobile-nav-btn').forEach(b => {
          b.className = 'mobile-nav-btn flex flex-col items-center gap-0.5 text-slate-400 hover:text-white cursor-pointer';
        });
        e.currentTarget.className = 'mobile-nav-btn flex flex-col items-center gap-0.5 text-amber-400 cursor-pointer font-bold';

        if (view === 'mistakes') {
          STATE.activeView = 'mistakes';
          if (viewSelect) viewSelect.value = 'mistakes';
          applyFilters();
          const container = document.getElementById('questionsContainer');
          if (container) container.scrollIntoView({ behavior: 'smooth' });
        } else if (targetId) {
          const el = document.getElementById(targetId);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
          }
        }
      });
    });

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
    initTheme();
    loadPersistedState();
    syncLanguageUI();
    setupUIListeners();
    initTargetEngine();
    initRouting();
    initQuestions();
    updateTargetUI();
  });

})();
