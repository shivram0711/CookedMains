/**
 * CookedMains Prelims Dashboard & 1-at-a-time Question Player
 * SuperKalam-Style Sidebar, Dashboard Overview & Zero-Scroll Focus Mode
 */
(function () {
  'use strict';

  const STORAGE_KEYS = {
    ANSWERS: 'cookedmains_prelims_answers_v1',
    MISTAKES: 'cookedmains_prelims_mistakes_v1',
    FLAGGED: 'cookedmains_prelims_flagged_v1',
    ACTIVITY: 'cookedmains_prelims_activity_v1',
    TARGET: 'cookedmains_prelims_target_v1'
  };

  const STATE = {
    pyqs: [],
    activeSubject: 'all',
    activeYear: 'all',
    searchQuery: '',
    viewMode: 'dashboard', // 'dashboard' | 'player'
    playerIndex: 0,
    playerQuestions: [],
    stagedSelection: null,
    slicedStatements: {}, // { [qId]: { [stmtNum]: true/false } }
    answers: {}, // { [qId]: { selectedIndex, isCorrect, timestamp, reason } }
    mistakes: new Set(),
    flagged: new Set(),
    activity: {
      mcqCount: 0,
      correctCount: 0,
      mainsCount: 0
    },
    language: localStorage.getItem('cm_prelims_lang') || 'en',
    theme: localStorage.getItem('mainsmentor_theme') || 'dark',
    userName: localStorage.getItem('cm_aspirant_name') || 'Aspirant'
  };

  // Load Persisted LocalStorage Data
  function loadPersistedState() {
    try {
      const savedAnswers = localStorage.getItem(STORAGE_KEYS.ANSWERS);
      if (savedAnswers) STATE.answers = JSON.parse(savedAnswers);

      const savedMistakes = localStorage.getItem(STORAGE_KEYS.MISTAKES);
      if (savedMistakes) STATE.mistakes = new Set(JSON.parse(savedMistakes));

      const savedFlagged = localStorage.getItem(STORAGE_KEYS.FLAGGED);
      if (savedFlagged) STATE.flagged = new Set(JSON.parse(savedFlagged));

      const savedActivity = localStorage.getItem(STORAGE_KEYS.ACTIVITY);
      if (savedActivity) STATE.activity = JSON.parse(savedActivity);
    } catch (e) {
      console.warn('Error loading persisted state:', e);
    }
  }

  function persistState() {
    try {
      localStorage.setItem(STORAGE_KEYS.ANSWERS, JSON.stringify(STATE.answers));
      localStorage.setItem(STORAGE_KEYS.MISTAKES, JSON.stringify(Array.from(STATE.mistakes)));
      localStorage.setItem(STORAGE_KEYS.FLAGGED, JSON.stringify(Array.from(STATE.flagged)));
      localStorage.setItem(STORAGE_KEYS.ACTIVITY, JSON.stringify(STATE.activity));
    } catch (e) {}
  }

  // Theme Handling
  function initTheme() {
    if (STATE.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }

  function toggleTheme() {
    STATE.theme = STATE.theme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('mainsmentor_theme', STATE.theme);
    initTheme();
  }

  // Toast Helper
  function showToast(msg) {
    const toast = document.getElementById('toastNotification');
    const msgEl = document.getElementById('toastMessage');
    if (!toast || !msgEl) return;
    msgEl.textContent = msg;
    toast.classList.remove('translate-y-20', 'opacity-0');
    toast.classList.add('translate-y-0', 'opacity-100');
    setTimeout(() => {
      toast.classList.add('translate-y-20', 'opacity-0');
      toast.classList.remove('translate-y-0', 'opacity-100');
    }, 2400);
  }

  // View Switcher (Dashboard vs Question Player Focus Mode)
  function switchViewMode(mode) {
    STATE.viewMode = mode;
    const dashView = document.getElementById('dashboardOverviewView');
    const playerView = document.getElementById('questionPlayerView');
    const breadcrumb = document.getElementById('breadcrumbCurrent');

    if (mode === 'player') {
      if (dashView) dashView.classList.add('hidden');
      if (playerView) playerView.classList.remove('hidden');
      if (breadcrumb) breadcrumb.textContent = 'Question Player Focus Mode';
      renderCurrentPlayerQuestion();
    } else {
      if (dashView) dashView.classList.remove('hidden');
      if (playerView) playerView.classList.add('hidden');
      if (breadcrumb) breadcrumb.textContent = 'Prelims Dashboard';
      updateDashboardActivity();
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Start a Practice Session
  window.startPracticeSession = function (subjectFilter = 'all', searchQuery = '') {
    let list = STATE.pyqs.slice();

    if (subjectFilter && subjectFilter !== 'all') {
      list = list.filter(q => q.subject && q.subject.toLowerCase().includes(subjectFilter.toLowerCase()));
    }

    if (searchQuery && searchQuery.trim()) {
      const qLower = searchQuery.toLowerCase().trim();
      list = list.filter(q => {
        const text = (q.question_text || '').toLowerCase();
        const sub = (q.subject || '').toLowerCase();
        const subTopic = (q.sub_topic || '').toLowerCase();
        const exp = (q.explanation || '').toLowerCase();
        return text.includes(qLower) || sub.includes(qLower) || subTopic.includes(qLower) || exp.includes(qLower);
      });
    }

    if (list.length === 0) {
      showToast('No questions found matching criteria.');
      return;
    }

    STATE.playerQuestions = list;
    STATE.playerIndex = 0;
    STATE.stagedSelection = null;
    switchViewMode('player');
  };

  // Render Current Single Question in Player
  function renderCurrentPlayerQuestion() {
    const questions = STATE.playerQuestions;
    if (!questions || questions.length === 0) return;

    const idx = STATE.playerIndex;
    const q = questions[idx];
    if (!q) return;

    // Badges & Counters
    const qNumLabel = document.getElementById('playerQNumberLabel');
    const counterText = document.getElementById('playerCounterText');
    const subjBadge = document.getElementById('playerSubjectBadge');
    const yearBadge = document.getElementById('playerYearBadge');
    const diffBadge = document.getElementById('playerDiffBadge');

    if (qNumLabel) qNumLabel.textContent = `QUESTION #${idx + 1} OF ${questions.length}`;
    if (counterText) counterText.textContent = `Q ${idx + 1} of ${questions.length}`;
    if (subjBadge) subjBadge.textContent = q.subject || 'GS Paper 1';
    if (yearBadge) yearBadge.textContent = q.year || '2023';
    if (diffBadge) diffBadge.textContent = q.difficulty || 'Moderate';

    // Question Statement Text
    const qTextEl = document.getElementById('playerQuestionText');
    if (qTextEl) qTextEl.textContent = q.question_text || '';

    // Statement Slicer (Numbered Statements)
    const stmtsContainer = document.getElementById('playerStatementsContainer');
    if (stmtsContainer) {
      const statements = parseStatements(q.question_text);
      if (statements.length > 0) {
        stmtsContainer.innerHTML = `
          <div class="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col gap-2">
            <span class="text-[10px] font-mono uppercase font-bold text-slate-400">10-Second Statement Slicer (Tap to strike out false assertions):</span>
            <div class="flex flex-col gap-1.5">
              ${statements.map(st => {
                const isSliced = STATE.slicedStatements[q.id] && STATE.slicedStatements[q.id][st.num];
                return `
                  <div class="slice-stmt-row flex items-start gap-2 p-2 rounded-xl text-xs text-slate-300 hover:bg-slate-900 cursor-pointer transition-all ${isSliced ? 'stmt-sliced' : ''}" data-qid="${q.id}" data-snum="${st.num}">
                    <span class="font-bold font-mono px-1.5 py-0.2 rounded bg-slate-800 text-amber-400 text-[10px] shrink-0">${st.num}</span>
                    <span class="leading-relaxed">${escapeHtml(st.text)}</span>
                    <span class="text-rose-400 text-xs ml-auto shrink-0">${isSliced ? '✕ Cut' : 'Slice'}</span>
                  </div>
                `;
              }).join('')}
            </div>
          </div>
        `;

        stmtsContainer.querySelectorAll('.slice-stmt-row').forEach(row => {
          row.addEventListener('click', (e) => {
            const qId = e.currentTarget.getAttribute('data-qid');
            const sNum = parseInt(e.currentTarget.getAttribute('data-snum'), 10);
            if (!STATE.slicedStatements[qId]) STATE.slicedStatements[qId] = {};
            STATE.slicedStatements[qId][sNum] = !STATE.slicedStatements[qId][sNum];
            renderCurrentPlayerQuestion();
          });
        });
      } else {
        stmtsContainer.innerHTML = '';
      }
    }

    // Options Container (A, B, C, D)
    const optsContainer = document.getElementById('playerOptionsContainer');
    const userAns = STATE.answers[q.id];
    const isAnswered = !!userAns;
    const confirmBox = document.getElementById('playerConfirmBox');
    const stagedIdx = STATE.stagedSelection;

    if (optsContainer) {
      const letters = ['A', 'B', 'C', 'D'];
      optsContainer.innerHTML = (q.options || []).map((opt, oIdx) => {
        let optStyle = 'light-inner-box bg-slate-950 border border-slate-800 hover:border-amber-500/50 text-slate-200';
        let statusBadge = '';

        if (isAnswered) {
          const isCorrectChoice = oIdx === q.correct_index;
          const isUserChoice = oIdx === userAns.selectedIndex;

          if (isCorrectChoice) {
            optStyle = 'bg-emerald-500/20 border-2 border-emerald-500 text-emerald-300 font-bold';
            statusBadge = '<span class="px-2 py-0.5 rounded bg-emerald-500 text-slate-950 text-[10px] font-black uppercase ml-auto">Official Key ✓</span>';
          } else if (isUserChoice && !userAns.isCorrect) {
            optStyle = 'bg-rose-500/20 border-2 border-rose-500 text-rose-300 font-bold';
            statusBadge = '<span class="px-2 py-0.5 rounded bg-rose-500 text-slate-950 text-[10px] font-black uppercase ml-auto">Your Pick ✗</span>';
          } else {
            optStyle = 'bg-slate-950/60 border border-slate-800 opacity-60 text-slate-400';
          }
        } else if (stagedIdx === oIdx) {
          optStyle = 'bg-amber-500/20 border-2 border-amber-500 text-amber-300 font-bold';
          statusBadge = '<span class="px-2 py-0.5 rounded bg-amber-500 text-slate-950 text-[10px] font-black uppercase ml-auto">Selected (Tap Confirm)</span>';
        }

        return `
          <button type="button" class="player-opt-btn p-3.5 rounded-2xl flex items-center gap-3 transition-all text-left text-xs sm:text-sm cursor-pointer ${optStyle}" data-oidx="${oIdx}">
            <span class="w-6 h-6 rounded-xl flex items-center justify-center font-bold text-xs bg-slate-800 text-white shrink-0">${letters[oIdx]}</span>
            <span class="leading-relaxed flex-1">${escapeHtml(opt)}</span>
            ${statusBadge}
          </button>
        `;
      }).join('');

      // Attach option click handlers
      if (!isAnswered) {
        optsContainer.querySelectorAll('.player-opt-btn').forEach(btn => {
          btn.addEventListener('click', (e) => {
            const oIdx = parseInt(e.currentTarget.getAttribute('data-oidx'), 10);
            STATE.stagedSelection = oIdx;
            if (confirmBox) confirmBox.classList.remove('hidden');
            renderCurrentPlayerQuestion();
          });
        });
      }
    }

    // Confirmation Box Visibility
    if (confirmBox) {
      if (stagedIdx !== null && !isAnswered) {
        confirmBox.classList.remove('hidden');
      } else {
        confirmBox.classList.add('hidden');
      }
    }

    // Explanation & Forensic Box
    const expBox = document.getElementById('playerExplanationBox');
    if (expBox) {
      if (isAnswered) {
        expBox.classList.remove('hidden');

        const resBanner = document.getElementById('playerResultBanner');
        const resText = document.getElementById('playerResultText');
        const marksDelta = document.getElementById('playerMarksDelta');
        const trapTextEl = document.getElementById('playerTrapText');
        const expTextEl = document.getElementById('playerExplanationText');

        if (userAns.isCorrect) {
          if (resBanner) resBanner.className = 'p-3.5 rounded-2xl flex items-center justify-between text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40';
          if (resText) resText.textContent = '✓ Correct Answer (+2.00 Marks)';
          if (marksDelta) marksDelta.textContent = '+2.00 Marks';
        } else {
          if (resBanner) resBanner.className = 'p-3.5 rounded-2xl flex items-center justify-between text-xs font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40';
          if (resText) resText.textContent = '✗ Incorrect Answer (-0.66 Penalty)';
          if (marksDelta) marksDelta.textContent = '-0.66 Marks';
        }

        if (trapTextEl) trapTextEl.textContent = q.elimination_trap || 'UPSC tests subtle word substitutions between statutory requirements and constitutional definitions.';
        if (expTextEl) expTextEl.textContent = q.explanation || 'Official UPSC key validated explanation.';

        // Citation if exists
        const citEl = document.getElementById('playerCitationText');
        if (citEl && q.standard_book_ref) citEl.textContent = `Standard Reference: ${q.standard_book_ref}`;
      } else {
        expBox.classList.add('hidden');
      }
    }

    // Bottom Navigation Buttons (Prev / Next / Flag)
    const prevBtn = document.getElementById('playerPrevBtn');
    const nextBtn = document.getElementById('playerNextBtn');
    const flagBtn = document.getElementById('playerFlagBtn');

    if (prevBtn) prevBtn.disabled = idx === 0;
    if (nextBtn) nextBtn.disabled = idx === questions.length - 1;

    if (flagBtn) {
      const isFlagged = STATE.flagged.has(q.id);
      flagBtn.textContent = isFlagged ? '🚩 Flagged' : '🏳️ Flag for Review';
      flagBtn.className = isFlagged 
        ? 'px-4 py-2.5 rounded-xl bg-amber-500 text-slate-950 text-xs font-bold hover:bg-amber-400 transition-all cursor-pointer shadow-md'
        : 'px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-amber-400 text-xs font-bold hover:bg-slate-800 transition-all cursor-pointer';
    }
  }

  // Submit Answer
  function submitStagedAnswer() {
    const q = STATE.playerQuestions[STATE.playerIndex];
    const stagedIdx = STATE.stagedSelection;
    if (!q || stagedIdx === null) return;

    const isCorrect = stagedIdx === q.correct_index;
    STATE.answers[q.id] = {
      selectedIndex: stagedIdx,
      isCorrect: isCorrect,
      timestamp: Date.now()
    };

    if (isCorrect) {
      STATE.mistakes.delete(q.id);
      STATE.activity.correctCount = (STATE.activity.correctCount || 0) + 1;
    } else {
      STATE.mistakes.add(q.id);
    }

    STATE.activity.mcqCount = (STATE.activity.mcqCount || 0) + 1;
    STATE.stagedSelection = null;

    persistState();
    renderCurrentPlayerQuestion();
    updateDashboardActivity();
    showToast(isCorrect ? '✓ Correct Answer!' : '✗ Negative marking logged (-0.66)');
  }

  // Update Activity Numbers in Dashboard
  function updateDashboardActivity() {
    const mcqEl = document.getElementById('actMcqCount');
    const accEl = document.getElementById('actAccuracy');
    const badge = document.getElementById('sidebarMistakesBadge');

    const total = STATE.activity.mcqCount || 0;
    const correct = STATE.activity.correctCount || 0;
    const acc = total > 0 ? Math.round((correct / total) * 100) + '%' : '-';

    if (mcqEl) mcqEl.textContent = total;
    if (accEl) accEl.textContent = acc;
    if (badge) badge.textContent = STATE.mistakes.size;
  }

  // Parse numbered statements helper
  function parseStatements(text) {
    if (!text) return [];
    const lines = text.split('\n');
    const stmts = [];
    const regex = /^(\d+)\.\s+(.*)/;
    lines.forEach(line => {
      const match = line.trim().match(regex);
      if (match) {
        stmts.push({ num: parseInt(match[1], 10), text: match[2].trim() });
      }
    });
    return stmts;
  }

  // Escape HTML
  function escapeHtml(str) {
    if (!str) return '';
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  // Question Palette Modal
  function openPalette() {
    const modal = document.getElementById('paletteModal');
    const grid = document.getElementById('paletteNumberGrid');
    if (!modal || !grid) return;

    const questions = STATE.playerQuestions;
    grid.innerHTML = questions.map((q, idx) => {
      const ans = STATE.answers[q.id];
      const isFlagged = STATE.flagged.has(q.id);
      const isCurrent = idx === STATE.playerIndex;

      let color = 'bg-slate-950 border border-slate-800 text-slate-300';
      if (ans) {
        color = ans.isCorrect ? 'bg-emerald-500 text-slate-950 font-black' : 'bg-rose-500 text-slate-950 font-black';
      } else if (isFlagged) {
        color = 'bg-amber-500 text-slate-950 font-black';
      }

      if (isCurrent) {
        color += ' ring-2 ring-white ring-offset-2 ring-offset-slate-950';
      }

      return `
        <button type="button" class="palette-q-btn p-2 rounded-xl text-xs font-mono font-bold flex items-center justify-center cursor-pointer transition-all ${color}" data-idx="${idx}">
          ${idx + 1}
        </button>
      `;
    }).join('');

    grid.querySelectorAll('.palette-q-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const idx = parseInt(e.currentTarget.getAttribute('data-idx'), 10);
        STATE.playerIndex = idx;
        STATE.stagedSelection = null;
        modal.classList.add('hidden');
        renderCurrentPlayerQuestion();
      });
    });

    modal.classList.remove('hidden');
  }

  function closePalette() {
    const modal = document.getElementById('paletteModal');
    if (modal) modal.classList.add('hidden');
  }

  // Fetch Questions
  async function initQuestions() {
    try {
      const res = await fetch('/static/data/prelims_pyqs.json');
      if (res.ok) {
        STATE.pyqs = await res.json();
      }
    } catch (e) {
      console.warn('Could not fetch prelims_pyqs.json:', e);
    }

    updateDashboardActivity();
  }

  // Setup UI Listeners
  function setupListeners() {
    // Mobile Sidebar Drawer
    const openSideBtn = document.getElementById('openMobileSidebarBtn');
    const closeSideBtn = document.getElementById('closeSidebarMobileBtn');
    const sideNav = document.getElementById('sidebarNav');
    const backdrop = document.getElementById('mobileSidebarBackdrop');

    const toggleSidebar = (open) => {
      if (!sideNav || !backdrop) return;
      if (open) {
        sideNav.classList.remove('-translate-x-full');
        backdrop.classList.remove('hidden');
      } else {
        sideNav.classList.add('-translate-x-full');
        backdrop.classList.add('hidden');
      }
    };

    if (openSideBtn) openSideBtn.addEventListener('click', () => toggleSidebar(true));
    if (closeSideBtn) closeSideBtn.addEventListener('click', () => toggleSidebar(false));
    if (backdrop) backdrop.addEventListener('click', () => toggleSidebar(false));

    // Nav Links
    document.getElementById('sideNavHome')?.addEventListener('click', () => {
      switchViewMode('dashboard');
      toggleSidebar(false);
    });
    document.getElementById('sideNavPractice')?.addEventListener('click', () => {
      window.startPracticeSession('all');
      toggleSidebar(false);
    });
    document.getElementById('sideNavMistakes')?.addEventListener('click', () => {
      const mistakeList = STATE.pyqs.filter(q => STATE.mistakes.has(q.id));
      if (mistakeList.length === 0) {
        showToast('No mistakes logged yet! Solve questions to track errors.');
        return;
      }
      STATE.playerQuestions = mistakeList;
      STATE.playerIndex = 0;
      switchViewMode('player');
      toggleSidebar(false);
    });

    // Theme & Lang
    document.getElementById('sidebarThemeToggle')?.addEventListener('click', toggleTheme);
    document.getElementById('sidebarLangToggle')?.addEventListener('click', () => {
      STATE.language = STATE.language === 'en' ? 'hi' : 'en';
      localStorage.setItem('cm_prelims_lang', STATE.language);
      showToast(STATE.language === 'hi' ? 'भाषा: हिंदी' : 'Language: English');
    });

    // Subject Grid Cards
    document.querySelectorAll('.subj-grid-card').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const sub = e.currentTarget.getAttribute('data-subject');
        window.startPracticeSession(sub);
      });
    });

    // Quick Chips
    document.querySelectorAll('.quick-chip-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const kw = e.currentTarget.getAttribute('data-kw');
        window.startPracticeSession('all', kw);
      });
    });

    // Search Doubt Input
    const doubtInput = document.getElementById('askDoubtInput');
    const searchBtn = document.getElementById('searchDoubtBtn');
    const runSearch = () => {
      const val = doubtInput ? doubtInput.value.trim() : '';
      if (val) window.startPracticeSession('all', val);
    };
    if (searchBtn) searchBtn.addEventListener('click', runSearch);
    if (doubtInput) {
      doubtInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') runSearch();
      });
    }

    // Player Controls
    document.getElementById('exitPlayerBtn')?.addEventListener('click', () => switchViewMode('dashboard'));
    document.getElementById('playerPrevBtn')?.addEventListener('click', () => {
      if (STATE.playerIndex > 0) {
        STATE.playerIndex--;
        STATE.stagedSelection = null;
        renderCurrentPlayerQuestion();
      }
    });
    document.getElementById('playerNextBtn')?.addEventListener('click', () => {
      if (STATE.playerIndex < STATE.playerQuestions.length - 1) {
        STATE.playerIndex++;
        STATE.stagedSelection = null;
        renderCurrentPlayerQuestion();
      }
    });
    document.getElementById('playerFlagBtn')?.addEventListener('click', () => {
      const q = STATE.playerQuestions[STATE.playerIndex];
      if (!q) return;
      if (STATE.flagged.has(q.id)) {
        STATE.flagged.delete(q.id);
        showToast('Flag removed');
      } else {
        STATE.flagged.add(q.id);
        showToast('Flagged for review');
      }
      persistState();
      renderCurrentPlayerQuestion();
    });

    // Staged Confirmation Buttons
    document.getElementById('playerClearStagedBtn')?.addEventListener('click', () => {
      STATE.stagedSelection = null;
      renderCurrentPlayerQuestion();
    });
    document.getElementById('playerSubmitStagedBtn')?.addEventListener('click', submitStagedAnswer);

    // Palette Modal
    document.getElementById('openPaletteBtn')?.addEventListener('click', openPalette);
    document.getElementById('closePaletteBtn')?.addEventListener('click', closePalette);
    document.getElementById('paletteModal')?.addEventListener('click', (e) => {
      if (e.target.id === 'paletteModal') closePalette();
    });
  }

  // Initialize
  document.addEventListener('DOMContentLoaded', () => {
    loadPersistedState();
    initTheme();
    setupListeners();
    initQuestions();
  });

})();
