/**
 * CookedMains Prelims Dashboard & 1-at-a-time Question Player
 * SuperKalam-Style Sidebar, Dashboard Overview & Zero-Scroll Focus Mode
 * Phase 4: Adaptive UPSC Prelims Mock Test Generator & Forensic Scorecard
 */
(function () {
  'use strict';

  const STORAGE_KEYS = {
    ANSWERS: 'cookedmains_prelims_answers_v1',
    MISTAKES: 'cookedmains_prelims_mistakes_v1',
    FLAGGED: 'cookedmains_prelims_flagged_v1',
    ACTIVITY: 'cookedmains_prelims_activity_v1',
    TARGET: 'cookedmains_prelims_target_v1',
    MOCKS: 'cookedmains_mock_history_v1'
  };

  const STATE = {
    pyqs: [],
    activeSubject: 'all',
    activeYear: 'all',
    matrixSearchQuery: '',
    matrixSelectedYear: 'all',
    matrixSelectedSubject: 'all',
    vaultMode: 'subject', // 'subject' | 'year'
    vaultSelectedSubject: 'all',
    vaultSelectedYear: 'all',
    vaultSelectedDifficulty: 'all',
    vaultSearchQuery: '',
    vaultExpandedQuestions: new Set(),
    searchQuery: '',
    viewMode: 'dashboard', // 'dashboard' | 'player' | 'report'
    playerIndex: 0,
    playerQuestions: [],
    stagedSelection: null,
    slicedStatements: {}, // { [qId]: { [stmtNum]: true/false } }
    answers: {}, // { [qId]: { selectedIndex, isCorrect, timestamp, reason } }
    mistakes: new Set(),
    flagged: new Set(),
    leakTags: {}, // { [qId]: 'concept' | 'silly' | 'elimination' | 'memory' }
    mistakesFilter: 'all',
    currentConfidence: 'sure', // 'sure' | 'fifty' | 'wild'
    activeStrategy: null, // { isActive, targetTotal, targetSure, targetFifty, targetWild, plannedNet, counts: { sure, fifty, wild } }
    activity: {
      mcqCount: 0,
      correctCount: 0,
      mainsCount: 0
    },
    // Phase 4: Mock Test Engine State
    isExamMode: false,
    isReviewMode: false,
    currentTest: null, // { id, title, format, durationSeconds, remainingSeconds, totalQuestions, startTime, mode }
    testAnswers: {}, // { [qId]: selectedOptionIndex }
    testResults: null, // computed scorecard object
    examTimerInterval: null,
    mockHistory: [],
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

      const savedMocks = localStorage.getItem(STORAGE_KEYS.MOCKS);
      if (savedMocks) STATE.mockHistory = JSON.parse(savedMocks);
      const savedTags = localStorage.getItem(STORAGE_KEYS.LEAK_TAGS);
      if (savedTags) STATE.leakTags = JSON.parse(savedTags);
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
      localStorage.setItem(STORAGE_KEYS.MOCKS, JSON.stringify(STATE.mockHistory));
      localStorage.setItem(STORAGE_KEYS.LEAK_TAGS, JSON.stringify(STATE.leakTags || {}));
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

  // View Switcher (Dashboard vs Question Player Focus Mode vs Forensic Scorecard)
  function updateSidebarActive(activeId) {
    document.querySelectorAll('.sidebar-nav-item').forEach(function(item) {
      if (item.id === activeId) {
        item.classList.add('active', 'bg-amber-500/15', 'text-amber-900', 'dark:text-amber-400', 'border-amber-500/30');
        item.classList.remove('text-slate-700', 'dark:text-slate-400', 'border-transparent');
      } else {
        item.classList.remove('active', 'bg-amber-500/15', 'text-amber-900', 'dark:text-amber-400', 'border-amber-500/30');
        item.classList.add('text-slate-700', 'dark:text-slate-400', 'border-transparent');
      }
    });
  }

  function switchViewMode(mode) {
    STATE.viewMode = mode;
    const dashView = document.getElementById('dashboardOverviewView');
    const playerView = document.getElementById('questionPlayerView');
    const reportView = document.getElementById('mockReportView');
    const vaultView = document.getElementById('prelimsPyqVaultView');
    const mistakesView = document.getElementById('mistakesNotebookView');
    const cutoffEvView = document.getElementById('cutoffEVSimulatorView');
    const breadcrumb = document.getElementById('breadcrumbCurrent');

    // Hide all views first
    [dashView, playerView, reportView, vaultView, mistakesView, cutoffEvView].forEach(function (v) {
      if (v) v.classList.add('hidden');
    });

    if (mode === 'player') {
      if (dashView) dashView.classList.add('hidden');
      if (reportView) reportView.classList.add('hidden');
      if (vaultView) vaultView.classList.add('hidden');
      if (playerView) playerView.classList.remove('hidden');
      updateSidebarActive('sideNavPractice');
      if (breadcrumb) {
        breadcrumb.textContent = STATE.isExamMode 
          ? (STATE.currentTest ? STATE.currentTest.title : 'Timed Exam Simulation')
          : 'Question Player Focus Mode';
      }
      renderCurrentPlayerQuestion();
    } else if (mode === 'report') {
      if (dashView) dashView.classList.add('hidden');
      if (playerView) playerView.classList.add('hidden');
      if (vaultView) vaultView.classList.add('hidden');
      if (reportView) reportView.classList.remove('hidden');
      if (breadcrumb) breadcrumb.textContent = 'Forensic Mock Scorecard';
    } else if (mode === 'vault') {
      if (vaultView) vaultView.classList.remove('hidden');
      updateSidebarActive('sideNavPyqVault');
      if (breadcrumb) breadcrumb.textContent = 'Prelims PYQ Brainstorming Vault';
      renderPyqVault();
    } else if (mode === 'mistakes') {
      if (mistakesView) mistakesView.classList.remove('hidden');
      updateSidebarActive('sideNavMistakes');
      if (breadcrumb) breadcrumb.textContent = 'Mistakes Notebook & 10-Min Micro-Corrections';
      renderMistakesModal();
    } else if (mode === 'cutoff_ev') {
      if (cutoffEvView) cutoffEvView.classList.remove('hidden');
      updateSidebarActive('sideNavEV');
      if (breadcrumb) breadcrumb.textContent = 'Cutoff Sweet Spot & EV Optimizer';
      recalculateEV('total');
    } else {
      if (playerView) playerView.classList.add('hidden');
      if (reportView) reportView.classList.add('hidden');
      if (vaultView) vaultView.classList.add('hidden');
      if (dashView) dashView.classList.remove('hidden');
      updateSidebarActive('sideNavHome');
      if (breadcrumb) breadcrumb.textContent = 'Prelims Dashboard';
      updateDashboardActivity();
      renderDashboardMockHistory();
      updateSubTopicHeatmap();
      renderMatrixFeed();
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Start a Practice Session
  window.startPracticeSession = function (subjectFilter, searchQuery) {
    var filter = subjectFilter || 'all';
    var search = searchQuery || '';
    STATE.isExamMode = false;
    STATE.isReviewMode = false;
    STATE.currentTest = null;
    stopExamTimer();

    var list = STATE.pyqs.slice();

    if (filter && filter !== 'all') {
      list = list.filter(function (q) {
        return q.subject && q.subject.toLowerCase().indexOf(filter.toLowerCase()) !== -1;
      });
    }

    if (search && search.trim()) {
      var qLower = search.toLowerCase().trim();
      list = list.filter(function (q) {
        var text = (q.question_text || '').toLowerCase();
        var sub = (q.subject || '').toLowerCase();
        var subTopic = (q.sub_topic || '').toLowerCase();
        var exp = (q.explanation || '').toLowerCase();
        return text.indexOf(qLower) !== -1 || sub.indexOf(qLower) !== -1 || subTopic.indexOf(qLower) !== -1 || exp.indexOf(qLower) !== -1;
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

  
  // ==========================================================
  // TOPIC SEARCH & 14-YEAR PYQ MATRIX ENGINE
  // ==========================================================
  function getFilteredMatrixQuestions() {
    let list = STATE.pyqs.slice();

    // Filter by year
    if (STATE.matrixSelectedYear && STATE.matrixSelectedYear !== 'all') {
      const yr = parseInt(STATE.matrixSelectedYear, 10);
      list = list.filter(function (q) { return q.year === yr; });
    }

    // Filter by subject
    if (STATE.matrixSelectedSubject && STATE.matrixSelectedSubject !== 'all') {
      const subLower = STATE.matrixSelectedSubject.toLowerCase();
      list = list.filter(function (q) {
        return q.subject && q.subject.toLowerCase().indexOf(subLower) !== -1;
      });
    }

    // Filter by search query
    if (STATE.matrixSearchQuery && STATE.matrixSearchQuery.trim()) {
      const qLower = STATE.matrixSearchQuery.toLowerCase().trim();
      list = list.filter(function (q) {
        const text = (q.question_text || '').toLowerCase();
        const sub = (q.subject || '').toLowerCase();
        const subTopic = (q.sub_topic || '').toLowerCase();
        const exp = (q.explanation || '').toLowerCase();
        return text.indexOf(qLower) !== -1 || sub.indexOf(qLower) !== -1 || subTopic.indexOf(qLower) !== -1 || exp.indexOf(qLower) !== -1;
      });
    }

    return list;
  }

  function renderMatrixFeed() {
    const container = document.getElementById('pyqSearchResultsContainer');
    const badge = document.getElementById('matrixMatchCountBadge');
    const statusText = document.getElementById('matrixFeedStatusText');
    const clearBtn = document.getElementById('clearTopicSearchBtn');

    if (!container) return;

    if (clearBtn) {
      if (STATE.matrixSearchQuery && STATE.matrixSearchQuery.trim()) {
        clearBtn.classList.remove('hidden');
      } else {
        clearBtn.classList.add('hidden');
      }
    }

    const matches = getFilteredMatrixQuestions();

    if (badge) badge.textContent = matches.length + ' Question' + (matches.length === 1 ? '' : 's') + ' Found';

    if (statusText) {
      let desc = [];
      if (STATE.matrixSelectedYear !== 'all') desc.push('Year ' + STATE.matrixSelectedYear);
      if (STATE.matrixSelectedSubject !== 'all') desc.push(STATE.matrixSelectedSubject);
      if (STATE.matrixSearchQuery) desc.push('"' + STATE.matrixSearchQuery + '"');
      statusText.textContent = desc.length > 0 ? ('Filtering: ' + desc.join(' · ')) : 'Showing all 1,280+ authentic questions';
    }

    if (matches.length === 0) {
      container.innerHTML = (
        '<div class="p-6 rounded-2xl bg-slate-950/60 border border-slate-800 text-center flex flex-col items-center gap-2">' +
          '<span class="text-2xl">🔍</span>' +
          '<span class="text-xs font-bold text-slate-300">No questions found matching your filter.</span>' +
          '<span class="text-[11px] text-slate-500">Try searching another topic (e.g. "Monetary Policy", "Preamble", "Article 21") or select "All Years".</span>' +
        '</div>'
      );
      return;
    }

    container.innerHTML = matches.map(function (q) {
      const userAns = STATE.answers[q.id];
      let statusBadge = '';
      if (userAns) {
        statusBadge = userAns.isCorrect 
          ? '<span class="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">Solved Correct ✓</span>'
          : '<span class="px-2 py-0.5 rounded bg-rose-500/20 text-rose-400 text-[10px] font-bold">Mistake Logged ✗</span>';
      }

      return (
        '<div class="matrix-q-item light-card p-4 rounded-2xl bg-white dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 hover:border-amber-500/60 transition-all flex flex-col gap-2.5 cursor-pointer group shadow-xs" data-qid="' + q.id + '">' +
          '<div class="flex items-center justify-between text-xs flex-wrap gap-2">' +
            '<div class="flex items-center gap-1.5 flex-wrap">' +
              '<span class="px-2.5 py-0.5 rounded-lg bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/30 text-[10px] font-mono font-bold">UPSC ' + (q.year || 'CSE') + '</span>' +
              '<span class="px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 text-[10px] font-semibold">' + (q.subject || 'GS-1') + '</span>' +
              (q.sub_topic ? ('<span class="px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 text-[10px]">' + escapeHtml(q.sub_topic) + '</span>') : '') +
              statusBadge +
            '</div>' +
            '<span class="text-amber-600 dark:text-amber-400 text-xs font-bold group-hover:translate-x-1 transition-transform flex items-center gap-1">' +
              '<span>Solve</span> <span>→</span>' +
            '</span>' +
          '</div>' +
          '<p class="text-xs text-slate-700 dark:text-slate-200 line-clamp-2 leading-relaxed">' + escapeHtml(q.question_text) + '</p>' +
        '</div>'
      );
    }).join('');

    // Attach click to launch single question
    container.querySelectorAll('.matrix-q-item').forEach(function (card) {
      card.addEventListener('click', function (e) {
        const qId = e.currentTarget.getAttribute('data-qid');
        const qIdx = matches.findIndex(function (q) { return q.id === qId; });
        STATE.playerQuestions = matches;
        STATE.playerIndex = (qIdx !== -1 ? qIdx : 0);
        STATE.isExamMode = false;
        STATE.isReviewMode = false;
        STATE.currentTest = null;
        switchViewMode('player');
      });
    });
  }

  // ==========================================================
  // PHASE 4: ADAPTIVE MOCK TEST GENERATOR ENGINE
  // ==========================================================

  window.openMockGenerator = function () {
    const modal = document.getElementById('mockGeneratorModal');
    if (modal) modal.classList.remove('hidden');
  };

  window.closeMockGenerator = function () {
    const modal = document.getElementById('mockGeneratorModal');
    if (modal) modal.classList.add('hidden');
  };

  window.launchQuickMock = function (type) {
    if (type === 'full') {
      generateAndStartMock('full', 'all', 'exam');
    } else if (type === 'sectional') {
      generateAndStartMock('sectional', 'all', 'exam');
    } else if (type === 'weakness') {
      generateAndStartMock('weakness', 'adaptive', 'exam');
    }
  };

  function generateAndStartMock(format, subjectFilter, mode) {
    format = format || 'full';
    subjectFilter = subjectFilter || 'all';
    mode = mode || 'exam';
    closeMockGenerator();

    if (!STATE.pyqs || STATE.pyqs.length === 0) {
      showToast('Questions are still loading, please wait...');
      return;
    }

    let targetCount = 100;
    let durationMins = 120;
    let title = 'Full-Length UPSC Prelims Simulation';

    if (format === 'sectional') {
      targetCount = 25;
      durationMins = 30;
      title = (subjectFilter !== 'all' && subjectFilter !== 'adaptive')
        ? ('Sectional Sprint: ' + subjectFilter)
        : 'Sectional High-Yield Sprint (25 Qs)';
    } else if (format === 'weakness') {
      targetCount = 15;
      durationMins = 20;
      title = 'Diagnostic Mark Leak Remedial Drill';
    }

    // Adaptive Sampling Strategy
    let sampleQuestions = [];

    if (format === 'weakness' || subjectFilter === 'adaptive') {
      // Prioritize mistakes notebook & missed questions
      const mistakeList = STATE.pyqs.filter(function (q) { return STATE.mistakes.has(q.id); });
      const pool = shuffleArray(mistakeList);
      sampleQuestions = pool.slice(0, targetCount);

      // Pad if needed
      if (sampleQuestions.length < targetCount) {
        const remainingNeeded = targetCount - sampleQuestions.length;
        const remainingPool = shuffleArray(STATE.pyqs.filter(function (q) {
          return !sampleQuestions.some(function (sq) { return sq.id === q.id; });
        }));
        sampleQuestions = sampleQuestions.concat(remainingPool.slice(0, remainingNeeded));
      }
    } else if (subjectFilter !== 'all') {
      // Filter by specified subject
      const subjectPool = shuffleArray(STATE.pyqs.filter(function (q) {
        return q.subject && q.subject.toLowerCase().indexOf(subjectFilter.toLowerCase()) !== -1;
      }));
      sampleQuestions = subjectPool.slice(0, targetCount);
      if (sampleQuestions.length < targetCount) {
        sampleQuestions = subjectPool;
      }
    } else {
      // Balanced UPSC distribution across all 6 disciplines
      const subjects = [
        'Polity & Governance',
        'Economy',
        'Environment & Ecology',
        'History & Culture',
        'Geography',
        'Science & Technology'
      ];

      const perSubject = Math.max(2, Math.floor(targetCount / subjects.length));
      subjects.forEach(function (sub) {
        const subPool = shuffleArray(STATE.pyqs.filter(function (q) {
          return q.subject && q.subject.toLowerCase().indexOf(sub.toLowerCase()) !== -1;
        }));
        sampleQuestions = sampleQuestions.concat(subPool.slice(0, perSubject));
      });

      if (sampleQuestions.length < targetCount) {
        const remainingNeeded = targetCount - sampleQuestions.length;
        const remainingPool = shuffleArray(STATE.pyqs.filter(function (q) {
          return !sampleQuestions.some(function (sq) { return sq.id === q.id; });
        }));
        sampleQuestions = sampleQuestions.concat(remainingPool.slice(0, remainingNeeded));
      }

      if (sampleQuestions.length === 0) {
        sampleQuestions = shuffleArray(STATE.pyqs.slice());
      }
    }

    // Final shuffle so subjects are interspersed like authentic UPSC GS-1
    sampleQuestions = shuffleArray(sampleQuestions);

    // Initialize Test Session State
    STATE.isExamMode = (mode === 'exam');
    STATE.isReviewMode = false;
    STATE.testAnswers = {};
    STATE.stagedSelection = null;
    STATE.playerQuestions = sampleQuestions;
    STATE.playerIndex = 0;

    STATE.currentTest = {
      id: 'mock_' + Date.now(),
      title: title,
      format: format,
      subjectFilter: subjectFilter,
      mode: mode,
      totalQuestions: sampleQuestions.length,
      durationSeconds: durationMins * 60,
      remainingSeconds: durationMins * 60,
      startTime: Date.now()
    };

    if (STATE.isExamMode) {
      startExamTimer();
    } else {
      stopExamTimer();
    }

    switchViewMode('player');
    showToast('🚀 ' + title + ' Started! Best of luck.');
  }

  // Shuffle Helper (Fisher-Yates)
  function shuffleArray(arr) {
    const copy = arr.slice();
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const tmp = copy[i];
      copy[i] = copy[j];
      copy[j] = tmp;
    }
    return copy;
  }

  // Exam Countdown Timer
  function startExamTimer() {
    stopExamTimer();
    updateTimerDisplay();

    STATE.examTimerInterval = setInterval(function () {
      if (!STATE.currentTest) {
        stopExamTimer();
        return;
      }

      STATE.currentTest.remainingSeconds--;
      updateTimerDisplay();

      if (STATE.currentTest.remainingSeconds <= 0) {
        stopExamTimer();
        showToast('⏱️ Time Up! Submitting your test...');
        window.submitExamSession();
      }
    }, 1000);
  }

  function stopExamTimer() {
    if (STATE.examTimerInterval) {
      clearInterval(STATE.examTimerInterval);
      STATE.examTimerInterval = null;
    }
  }

  function formatTime(totalSecs) {
    const s = Math.max(0, totalSecs);
    const hrs = Math.floor(s / 3600);
    const mins = Math.floor((s % 3600) / 60);
    const secs = s % 60;

    const pad = function (n) { return String(n).padStart(2, '0'); };
    if (hrs > 0) {
      return pad(hrs) + ':' + pad(mins) + ':' + pad(secs);
    }
    return pad(mins) + ':' + pad(secs);
  }

  function updateTimerDisplay() {
    const timerEl = document.getElementById('playerExamTimerText');
    if (!timerEl || !STATE.currentTest) return;

    const rem = STATE.currentTest.remainingSeconds;
    timerEl.textContent = formatTime(rem);

    if (rem <= 120) {
      timerEl.parentElement.className = 'flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/40 font-mono font-bold text-xs animate-pulse';
    } else if (rem <= 600) {
      timerEl.parentElement.className = 'flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40 font-mono font-bold text-xs';
    } else {
      timerEl.parentElement.className = 'flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/30 font-mono font-bold text-xs';
    }
  }

  // Pre-submission confirmation modal
  window.openSubmitConfirmModal = function () {
    const modal = document.getElementById('submitConfirmModal');
    if (!modal) return;

    const total = STATE.playerQuestions.length;
    const answered = Object.keys(STATE.testAnswers).length;
    const flagged = STATE.flagged.size;
    const unanswered = Math.max(0, total - answered);

    const ansEl = document.getElementById('confirmAnsweredCount');
    const flagEl = document.getElementById('confirmFlaggedCount');
    const unansEl = document.getElementById('confirmUnansweredCount');
    const timeEl = document.getElementById('confirmTimeRemaining');

    if (ansEl) ansEl.textContent = answered;
    if (flagEl) flagEl.textContent = flagged;
    if (unansEl) unansEl.textContent = unanswered;
    if (timeEl && STATE.currentTest) {
      timeEl.textContent = formatTime(STATE.currentTest.remainingSeconds);
    }

    modal.classList.remove('hidden');
  };

  window.closeSubmitConfirmModal = function () {
    const modal = document.getElementById('submitConfirmModal');
    if (modal) modal.classList.add('hidden');
  };

  // Submit and compute official UPSC score & forensic scorecard
  window.submitExamSession = function () {
    window.closeSubmitConfirmModal();
    stopExamTimer();

    const questions = STATE.playerQuestions;
    const test = STATE.currentTest || {};
    let correctCount = 0;
    let wrongCount = 0;
    const wrongQuestions = [];
    const subjectStats = {};

    questions.forEach(function (q) {
      const sub = q.subject || 'General';
      if (!subjectStats[sub]) {
        subjectStats[sub] = { total: 0, correct: 0, wrong: 0, attempted: 0 };
      }
      subjectStats[sub].total++;

      const selectedIdx = STATE.testAnswers[q.id];
      if (selectedIdx !== undefined) {
        subjectStats[sub].attempted++;
        if (selectedIdx === q.correct_index) {
          correctCount++;
          subjectStats[sub].correct++;
        } else {
          wrongCount++;
          subjectStats[sub].wrong++;
          wrongQuestions.push(q);
        }
      }
    });

    const attemptedCount = correctCount + wrongCount;
    const grossScore = correctCount * 2.0;
    const negativeBleed = Number((wrongCount * 0.66).toFixed(2));
    const netScore = Number((grossScore - negativeBleed).toFixed(2));
    const maxMarks = questions.length * 2.0;

    // Official UPSC 2024 Cutoff benchmark (88.0 marks for 100 Qs)
    const benchmarkCutoff = Number(((questions.length / 100) * 88.0).toFixed(1));
    const cutoffDelta = Number((netScore - benchmarkCutoff).toFixed(2));
    const isAboveCutoff = cutoffDelta >= 0;

    const accuracy = attemptedCount > 0 ? Math.round((correctCount / attemptedCount) * 100) : 0;
    const timeSpentSecs = test.durationSeconds ? (test.durationSeconds - (test.remainingSeconds || 0)) : 0;

    // Behavioral Leak Estimation
    const conceptLeaks = Math.ceil(wrongCount * 0.35);
    const sillyLeaks = Math.ceil(wrongCount * 0.30);
    const elimLeaks = Math.ceil(wrongCount * 0.25);
    const memoryLeaks = Math.max(0, wrongCount - (conceptLeaks + sillyLeaks + elimLeaks));

    const result = {
      id: test.id || ('mock_' + Date.now()),
      title: test.title || 'UPSC Prelims Mock Test',
      timestamp: Date.now(),
      totalQuestions: questions.length,
      attemptedCount: attemptedCount,
      correctCount: correctCount,
      wrongCount: wrongCount,
      grossScore: grossScore,
      negativeBleed: negativeBleed,
      netScore: netScore,
      maxMarks: maxMarks,
      benchmarkCutoff: benchmarkCutoff,
      cutoffDelta: cutoffDelta,
      isAboveCutoff: isAboveCutoff,
      accuracy: accuracy,
      timeSpentSecs: timeSpentSecs,
      subjectStats: subjectStats,
      wrongQuestions: wrongQuestions,
      leaks: {
        concept: conceptLeaks,
        silly: sillyLeaks,
        elimination: elimLeaks,
        memory: memoryLeaks
      }
    };

    STATE.testResults = result;

    // Save to Mock History in localStorage with complete metadata
    STATE.mockHistory.unshift({
      id: result.id,
      title: result.title,
      timestamp: result.timestamp,
      netScore: result.netScore,
      maxMarks: result.maxMarks,
      accuracy: result.accuracy,
      attemptedCount: result.attemptedCount,
      totalQuestions: result.totalQuestions,
      isAboveCutoff: result.isAboveCutoff,
      fullResult: result,
      testAnswers: Object.assign({}, STATE.testAnswers),
      questionIds: questions.map(function (q) { return q.id; })
    });

    if (STATE.mockHistory.length > 15) STATE.mockHistory.pop();
    persistState();

    // Render Forensic Scorecard
    renderForensicScorecard(result);
    switchViewMode('report');
  };

  // Render Post-Test Scorecard View
  function renderForensicScorecard(res) {
    const titleEl = document.getElementById('reportTestTitle');
    const netEl = document.getElementById('reportNetScore');
    const maxEl = document.getElementById('reportMaxMarks');
    const calloutEl = document.getElementById('reportCutoffCallout');
    const deltaEl = document.getElementById('reportCutoffDeltaText');
    const badgeEl = document.getElementById('reportCutoffBadge');

    const grossEl = document.getElementById('reportGrossScore');
    const correctEl = document.getElementById('reportCorrectCount');
    const bleedEl = document.getElementById('reportNegativeBleed');
    const wrongEl = document.getElementById('reportWrongCount');
    const accEl = document.getElementById('reportAccuracy');
    const attemptEl = document.getElementById('reportAttemptRate');
    const timeEl = document.getElementById('reportTimeSpent');
    const speedEl = document.getElementById('reportSpeedPerQ');

    if (titleEl) titleEl.textContent = res.title;
    if (netEl) netEl.textContent = (res.netScore > 0 ? '+' : '') + res.netScore.toFixed(2);
    if (maxEl) maxEl.textContent = '/ ' + res.maxMarks + ' Marks';

    if (calloutEl && deltaEl && badgeEl) {
      if (res.isAboveCutoff) {
        calloutEl.className = 'p-4 rounded-2xl flex items-center justify-between text-xs sm:text-sm font-bold bg-emerald-500/10 dark:bg-emerald-500/20 border border-emerald-500/40 text-emerald-800 dark:text-emerald-300';
        deltaEl.textContent = '🎉 You scored +' + res.cutoffDelta.toFixed(1) + ' marks ABOVE the cutoff target (' + res.benchmarkCutoff + '). Great job!';
        badgeEl.textContent = 'Passed Cutoff';
        badgeEl.className = 'hidden sm:inline-block px-2.5 py-1 rounded-full bg-emerald-500 text-slate-950 font-black text-xs uppercase';
      } else {
        calloutEl.className = 'p-4 rounded-2xl flex items-center justify-between text-xs sm:text-sm font-bold bg-rose-500/10 dark:bg-rose-500/20 border border-rose-500/40 text-rose-800 dark:text-rose-300';
        deltaEl.textContent = '⚠️ You scored ' + Math.abs(res.cutoffDelta).toFixed(1) + ' marks BELOW the cutoff target (' + res.benchmarkCutoff + '). Avoiding wild guesses will quickly boost your score.';
        badgeEl.textContent = 'Below Target';
        badgeEl.className = 'hidden sm:inline-block px-2.5 py-1 rounded-full bg-rose-500 text-white font-black text-xs uppercase';
      }
    }

    if (grossEl) grossEl.textContent = '+' + res.grossScore.toFixed(1);
    if (correctEl) correctEl.textContent = res.correctCount + ' Correct (+2.00 each)';
    if (bleedEl) bleedEl.textContent = '-' + res.negativeBleed.toFixed(2);
    if (wrongEl) wrongEl.textContent = res.wrongCount + ' Wrong (-0.66 penalty)';
    if (accEl) accEl.textContent = res.accuracy + '%';
    if (attemptEl) attemptEl.textContent = res.attemptedCount + ' / ' + res.totalQuestions + ' Attempted';

    const mins = Math.floor(res.timeSpentSecs / 60);
    const secs = res.timeSpentSecs % 60;
    if (timeEl) timeEl.textContent = mins + 'm ' + secs + 's';
    const speed = res.attemptedCount > 0 ? Math.round(res.timeSpentSecs / res.attemptedCount) : 0;
    if (speedEl) speedEl.textContent = '~' + speed + 's / question';

    // Behavioral Leaks Breakdown
    const totalWrong = Math.max(1, res.wrongCount);
    const conceptPct = Math.round((res.leaks.concept / totalWrong) * 100);
    const sillyPct = Math.round((res.leaks.silly / totalWrong) * 100);
    const elimPct = Math.round((res.leaks.elimination / totalWrong) * 100);
    const memoryPct = Math.max(0, 100 - (conceptPct + sillyPct + elimPct));

    const lConcept = document.getElementById('reportLeakConcept');
    const lSilly = document.getElementById('reportLeakSilly');
    const lElim = document.getElementById('reportLeakElim');
    const lMemory = document.getElementById('reportLeakMemory');

    if (lConcept) lConcept.textContent = res.leaks.concept + ' mistakes (' + conceptPct + '%)';
    if (lSilly) lSilly.textContent = res.leaks.silly + ' mistakes (' + sillyPct + '%)';
    if (lElim) lElim.textContent = res.leaks.elimination + ' mistakes (' + elimPct + '%)';
    if (lMemory) lMemory.textContent = res.leaks.memory + ' mistakes (' + memoryPct + '%)';

    const bConcept = document.getElementById('reportBarConcept');
    const bSilly = document.getElementById('reportBarSilly');
    const bElim = document.getElementById('reportBarElim');
    const bMemory = document.getElementById('reportBarMemory');

    if (bConcept) bConcept.style.width = conceptPct + '%';
    if (bSilly) bSilly.style.width = sillyPct + '%';
    if (bElim) bElim.style.width = elimPct + '%';
    if (bMemory) bMemory.style.width = memoryPct + '%';

    // Subject Breakdown
    const subjContainer = document.getElementById('reportSubjectBreakdownContainer');
    if (subjContainer && res.subjectStats) {
      subjContainer.innerHTML = Object.keys(res.subjectStats).map(function (subName) {
        const s = res.subjectStats[subName];
        const sGross = s.correct * 2.0;
        const sBleed = s.wrong * 0.66;
        const sNet = Number((sGross - sBleed).toFixed(2));
        const sAcc = s.attempted > 0 ? Math.round((s.correct / s.attempted) * 100) : 0;

        return (
          '<div class="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col gap-1.5">' +
            '<div class="flex items-center justify-between text-xs font-bold">' +
              '<span class="text-white">' + escapeHtml(subName) + '</span>' +
              '<span class="font-mono text-amber-400">' + (sNet > 0 ? '+' : '') + sNet + ' Marks</span>' +
            '</div>' +
            '<div class="flex items-center justify-between text-[11px] text-slate-400">' +
              '<span>' + s.correct + ' Correct · ' + s.wrong + ' Wrong · ' + (s.total - s.attempted) + ' Skipped</span>' +
              '<span class="font-bold ' + (sAcc >= 60 ? 'text-emerald-400' : 'text-rose-400') + '">' + sAcc + '% Accuracy</span>' +
            '</div>' +
            '<div class="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden mt-0.5">' +
              '<div class="h-full bg-amber-500 rounded-full" style="width: ' + sAcc + '%"></div>' +
            '</div>' +
          '</div>'
        );
      }).join('');
    }

    // Save All Mistakes Button Setup
    const saveBtn = document.getElementById('reportSaveMistakesBtn');
    const saveText = document.getElementById('reportSaveMistakesText');
    if (saveBtn && saveText) {
      saveText.textContent = 'Save ' + res.wrongCount + ' Wrong Answers to Mistakes Notebook';
      saveBtn.onclick = function () {
        res.wrongQuestions.forEach(function (q) { STATE.mistakes.add(q.id); });
        persistState();
        updateDashboardActivity();
        saveText.textContent = '✓ ' + res.wrongCount + ' Wrong Answers Saved!';
        saveBtn.className = 'mt-2 w-full py-2.5 rounded-xl bg-emerald-500/20 text-emerald-300 font-bold text-xs border border-emerald-500/40 cursor-default flex items-center justify-center gap-2';
        showToast('Saved ' + res.wrongCount + ' mistakes to your Notebook!');
      };
    }
  }

  // Dashboard Mock Tests History Widget
  function renderDashboardMockHistory() {
    const badge = document.getElementById('dashMockCountBadge');
    const container = document.getElementById('dashMockHistoryContainer');
    if (!container) return;

    const history = STATE.mockHistory || [];
    if (badge) badge.textContent = history.length + ' Test' + (history.length === 1 ? '' : 's');

    if (history.length === 0) {
      container.innerHTML = (
        '<div class="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 text-center text-xs text-slate-400">' +
          'No mock tests completed yet. Take a 25-Q Sectional Sprint to benchmark your net score!' +
        '</div>'
      );
      return;
    }

    container.innerHTML = history.slice(0, 4).map(function (h) {
      const dateStr = new Date(h.timestamp).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
      return (
        '<div class="mock-history-item p-3 rounded-xl bg-slate-50 hover:bg-amber-500/10 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 hover:border-amber-500/50 flex items-center justify-between text-xs cursor-pointer transition-all shadow-xs group" data-mockid="' + h.id + '">' +
          '<div class="flex flex-col">' +
            '<div class="flex items-center gap-1.5">' +
              '<span class="font-bold text-slate-800 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 truncate max-w-[140px]">' + escapeHtml(h.title) + '</span>' +
              '<span class="text-[9px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-800 dark:text-amber-300 font-bold">View Scorecard →</span>' +
            '</div>' +
            '<span class="text-[10px] text-slate-500 dark:text-slate-400 font-mono mt-0.5">' + dateStr + ' · ' + h.accuracy + '% acc · ' + (h.attemptedCount || 'All') + ' attempted</span>' +
          '</div>' +
          '<div class="flex flex-col items-end shrink-0 pl-2">' +
            '<span class="font-black font-mono text-sm ' + (h.isAboveCutoff ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400') + '">' + (h.netScore > 0 ? '+' : '') + h.netScore + '</span>' +
            '<span class="text-[9px] font-mono text-slate-400">/ ' + h.maxMarks + ' Marks</span>' +
          '</div>' +
        '</div>'
      );
    }).join('');

    container.querySelectorAll('.mock-history-item').forEach(function (item) {
      item.addEventListener('click', function (e) {
        const mockId = e.currentTarget.getAttribute('data-mockid');
        window.openMockHistoryResult(mockId);
      });
    });
  }

  window.returnFromReportToDashboard = function () {
    STATE.isExamMode = false;
    STATE.isReviewMode = false;
    STATE.currentTest = null;
    stopExamTimer();
    switchViewMode('dashboard');
  };

  // ==========================================================
  // QUESTION PLAYER RENDERING (ZERO-SCROLL 1-AT-A-TIME)
  // ==========================================================

  
  // Helper to check if an option is eliminated by sliced statements
  
  // Option-by-Option Distractor Deep Dive Analysis
  function getDistractorAnalysis(q) {
    if (!q || !q.options) return [];
    const letters = ['A', 'B', 'C', 'D'];
    const lines = (q.explanation || '').split('\n');

    return q.options.map(function (opt, idx) {
      const isCorrect = (idx === q.correct_index);
      const letter = letters[idx] || String.fromCharCode(65 + idx);
      let label = isCorrect ? 'Official UPSC Key' : 'Examiner Distractor';
      let details = '';

      if (isCorrect) {
        details = lines[0] ? lines[0].replace(/^[•\-\*]\s*/, '') : 'Accurate assertion directly validated by official UPSC key.';
      } else {
        // Find matching line in explanation
        const optMatch = lines.find(function (ln) {
          const lnLower = ln.toLowerCase();
          return lnLower.includes('statement ' + (idx + 1)) ||
                 lnLower.includes('option ' + letter.toLowerCase()) ||
                 lnLower.includes(opt.slice(0, 20).toLowerCase());
        });

        if (optMatch) {
          details = optMatch.replace(/^[•\-\*]\s*/, '');
        } else {
          details = 'Crafted as an elimination distractor. UPSC commonly swaps constitutional with statutory bodies, reverses historical chronology, or injects extreme modifiers ("only", "exclusively") to test conceptual boundary precision.';
        }
      }

      return {
        letter: letter,
        optionText: opt,
        isCorrect: isCorrect,
        label: label,
        details: details
      };
    });
  }

function getEliminatingStatementNum(optText, slicedMap) {
    if (!slicedMap) return null;
    const slicedNums = Object.keys(slicedMap).filter(function (k) { return slicedMap[k]; });
    if (slicedNums.length === 0) return null;

    for (let i = 0; i < slicedNums.length; i++) {
      const num = slicedNums[i];
      // Check if option text contains statement number (e.g. "1 and 2 only", "2 and 3", "2 only", "1, 2 and 3")
      const regex = new RegExp('(?:^|\\D)' + num + '(?:\\D|$)');
      if (regex.test(optText)) {
        return num;
      }
    }
    return null;
  }


  window.openMockHistoryResult = function (mockId) {
    const item = (STATE.mockHistory || []).find(function (h) { return h.id === mockId; });
    if (!item) return;

    if (item.fullResult) {
      STATE.testResults = item.fullResult;
    } else {
      const qTotal = item.totalQuestions || 25;
      const att = item.attemptedCount || qTotal;
      const acc = item.accuracy || 50;
      const cor = Math.round((acc / 100) * att);
      const wrg = att - cor;
      const gross = cor * 2.0;
      const bleed = Number((wrg * 0.66).toFixed(2));
      const net = item.netScore !== undefined ? item.netScore : Number((gross - bleed).toFixed(2));
      const maxM = item.maxMarks || (qTotal * 2.0);
      const cutoff = Number(((qTotal / 100) * 88.0).toFixed(1));

      STATE.testResults = {
        id: item.id,
        title: item.title,
        timestamp: item.timestamp,
        totalQuestions: qTotal,
        attemptedCount: att,
        correctCount: cor,
        wrongCount: wrg,
        grossScore: gross,
        negativeBleed: bleed,
        netScore: net,
        maxMarks: maxM,
        benchmarkCutoff: cutoff,
        cutoffDelta: Number((net - cutoff).toFixed(2)),
        isAboveCutoff: net >= cutoff,
        accuracy: acc,
        timeSpentSecs: 900,
        subjectStats: {},
        wrongQuestions: [],
        leaks: {
          concept: Math.ceil(wrg * 0.35),
          silly: Math.ceil(wrg * 0.30),
          elimination: Math.ceil(wrg * 0.20),
          memory: Math.max(0, wrg - (Math.ceil(wrg * 0.35) + Math.ceil(wrg * 0.30) + Math.ceil(wrg * 0.20)))
        }
      };
    }

    if (item.questionIds && item.questionIds.length > 0) {
      STATE.playerQuestions = item.questionIds.map(function (id) {
        return STATE.pyqs.find(function (q) { return q.id === id; });
      }).filter(Boolean);
    }
    if (!STATE.playerQuestions || STATE.playerQuestions.length === 0) {
      STATE.playerQuestions = STATE.pyqs.slice(0, item.totalQuestions || 25);
    }

    STATE.testAnswers = item.testAnswers || {};
    STATE.currentTest = { title: item.title };
    STATE.isExamMode = false;
    STATE.isReviewMode = true;
    STATE.playerIndex = 0;

    renderForensicScorecard(STATE.testResults);
    switchViewMode('report');
    showToast('📊 Loaded Forensic Scorecard for ' + item.title);
  };


  function renderBehavioralTagger(q) {
    const group = document.getElementById('playerDiagTagGroup');
    if (!group || !q) return;

    const currentTag = STATE.leakTags[q.id];
    const tagDefs = [
      { id: 'concept', label: '🔴 Conceptual', color: 'rose' },
      { id: 'silly', label: '🟡 Silly Trap', color: 'amber' },
      { id: 'elimination', label: '🔵 Over-Elim', color: 'blue' },
      { id: 'memory', label: '🟣 Memory', color: 'purple' }
    ];

    group.querySelectorAll('.player-tag-btn').forEach(function (btn) {
      const tag = btn.getAttribute('data-tag');
      const def = tagDefs.find(function (d) { return d.id === tag; });
      if (!def) return;

      if (currentTag === tag) {
        if (tag === 'concept') btn.className = 'player-tag-btn p-2.5 rounded-xl bg-rose-500 text-white font-black border-2 border-rose-300 shadow-md cursor-pointer';
        else if (tag === 'silly') btn.className = 'player-tag-btn p-2.5 rounded-xl bg-amber-500 text-slate-950 font-black border-2 border-amber-300 shadow-md cursor-pointer';
        else if (tag === 'elimination') btn.className = 'player-tag-btn p-2.5 rounded-xl bg-blue-500 text-white font-black border-2 border-blue-300 shadow-md cursor-pointer';
        else if (tag === 'memory') btn.className = 'player-tag-btn p-2.5 rounded-xl bg-purple-500 text-white font-black border-2 border-purple-300 shadow-md cursor-pointer';
        btn.textContent = def.label + ' ✓';
      } else {
        btn.className = 'player-tag-btn p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-semibold hover:border-slate-400 cursor-pointer';
        btn.textContent = def.label;
      }

      btn.onclick = function () {
        if (STATE.leakTags[q.id] === tag) {
          delete STATE.leakTags[q.id];
          showToast('Tag removed');
        } else {
          STATE.leakTags[q.id] = tag;
          STATE.mistakes.add(q.id);
          showToast('Tagged as ' + def.label + ' error');
        }
        persistState();
        renderBehavioralTagger(q);
        updateDashboardActivity();
        renderMistakesModal();
      };
    });
  }

  function updateStrategyHUD() {
    const hud = document.getElementById('playerStrategyHUD');
    const strat = STATE.activeStrategy;
    if (!hud) return;

    if (!strat || !strat.isActive) {
      hud.classList.add('hidden');
      return;
    }

    hud.classList.remove('hidden');

    const totalAtt = (strat.counts.sure || 0) + (strat.counts.fifty || 0) + (strat.counts.wild || 0);
    const attText = document.getElementById('playerStrategyAttemptsText');
    const sureBadge = document.getElementById('hudSureBadge');
    const fiftyBadge = document.getElementById('hudFiftyBadge');
    const wildBadge = document.getElementById('hudWildBadge');

    if (attText) attText.textContent = 'Attempts: ' + totalAtt + ' / ' + strat.targetTotal;
    if (sureBadge) sureBadge.textContent = '🟢 Sure: ' + (strat.counts.sure || 0) + ' / ' + strat.targetSure;
    if (fiftyBadge) fiftyBadge.textContent = '🟡 50:50: ' + (strat.counts.fifty || 0) + ' / ' + strat.targetFifty;
    
    if (wildBadge) {
      const wildCount = strat.counts.wild || 0;
      wildBadge.textContent = '🔴 Wild: ' + wildCount + ' / ' + strat.targetWild;
      if (wildCount > strat.targetWild) {
        wildBadge.className = 'px-2 py-0.5 rounded-lg bg-rose-500 text-white font-black border border-rose-400 animate-pulse';
      } else {
        wildBadge.className = 'px-2 py-0.5 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-400 font-bold border border-slate-300 dark:border-slate-700';
      }
    }
  }

  function setupConfidenceButtons(q) {
    const box = document.getElementById('playerConfidenceBox');
    const warn = document.getElementById('playerWildWarning');
    if (!box || !q) return;

    box.querySelectorAll('.conf-btn').forEach(function (btn) {
      const c = btn.getAttribute('data-conf');
      const isSelected = (STATE.currentConfidence === c);

      if (isSelected) {
        if (c === 'sure') btn.className = 'conf-btn px-2.5 py-1 rounded-lg text-[11px] font-black border cursor-pointer bg-emerald-500 text-white border-emerald-400 shadow-xs';
        else if (c === 'fifty') btn.className = 'conf-btn px-2.5 py-1 rounded-lg text-[11px] font-black border cursor-pointer bg-amber-500 text-slate-950 border-amber-400 shadow-xs';
        else btn.className = 'conf-btn px-2.5 py-1 rounded-lg text-[11px] font-black border cursor-pointer bg-rose-500 text-white border-rose-400 shadow-xs';
      } else {
        btn.className = 'conf-btn px-2.5 py-1 rounded-lg text-[11px] font-bold border cursor-pointer transition-all bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:border-slate-400';
      }

      btn.onclick = function () {
        STATE.currentConfidence = c;
        setupConfidenceButtons(q);

        if (warn) {
          if (c === 'wild') {
            warn.classList.remove('hidden');
          } else {
            warn.classList.add('hidden');
          }
        }
      };
    });
  }

  function renderCurrentPlayerQuestion() {
    const questions = STATE.playerQuestions;
    if (!questions || questions.length === 0) return;

    const idx = STATE.playerIndex;
    const q = questions[idx];
    if (!q) return;

    updateStrategyHUD();
    setupConfidenceButtons(q);

    // Badges & Counters
    const qNumLabel = document.getElementById('playerQNumberLabel');
    const counterText = document.getElementById('playerCounterText');
    const subjBadge = document.getElementById('playerSubjectBadge');
    const yearBadge = document.getElementById('playerYearBadge');
    const diffBadge = document.getElementById('playerDiffBadge');

    if (qNumLabel) qNumLabel.textContent = 'QUESTION #' + (idx + 1) + ' OF ' + questions.length;
    if (counterText) counterText.textContent = 'Q ' + (idx + 1) + ' of ' + questions.length;
    if (subjBadge) subjBadge.textContent = q.subject || 'GS Paper 1';
    if (yearBadge) yearBadge.textContent = q.year || '2023';
    if (diffBadge) diffBadge.textContent = q.difficulty || 'Moderate';

    // Exam Mode Controls Top Bar
    const examControls = document.getElementById('playerExamControlsGroup');
    if (examControls) {
      if (STATE.isExamMode && !STATE.isReviewMode) {
        examControls.classList.remove('hidden');
        updateTimerDisplay();
      } else {
        examControls.classList.add('hidden');
      }
    }

    // Question Statement Text
    const qTextEl = document.getElementById('playerQuestionText');
    if (qTextEl) qTextEl.textContent = q.question_text || '';

    // Statement Slicer (Numbered Statements)
    const stmtsContainer = document.getElementById('playerStatementsContainer');
    if (stmtsContainer) {
      const statements = parseStatements(q.question_text);
      if (statements.length > 0) {
        stmtsContainer.innerHTML = (
          '<div class="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col gap-2">' +
            '<span class="text-[10px] font-mono uppercase font-bold text-slate-400">10-Second Statement Slicer (Tap to strike out false assertions):</span>' +
            '<div class="flex flex-col gap-1.5">' +
              statements.map(function (st) {
                const isSliced = STATE.slicedStatements[q.id] && STATE.slicedStatements[q.id][st.num];
                return (
                  '<div class="slice-stmt-row flex items-start gap-2 p-2 rounded-xl text-xs text-slate-300 hover:bg-amber-500/10 dark:hover:bg-slate-800 cursor-pointer transition-all ' + (isSliced ? 'stmt-sliced' : '') + '" data-qid="' + q.id + '" data-snum="' + st.num + '">' +
                    '<span class="font-bold font-mono px-1.5 py-0.2 rounded bg-slate-800 text-amber-400 text-[10px] shrink-0">' + st.num + '</span>' +
                    '<span class="leading-relaxed">' + escapeHtml(st.text) + '</span>' +
                    '<span class="text-rose-400 text-xs ml-auto shrink-0">' + (isSliced ? '✕ Cut' : 'Slice') + '</span>' +
                  '</div>'
                );
              }).join('') +
            '</div>' +
          '</div>'
        );

        stmtsContainer.querySelectorAll('.slice-stmt-row').forEach(function (row) {
          row.addEventListener('click', function (e) {
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
    const confirmBox = document.getElementById('playerConfirmBox');
    const clearOptBtn = document.getElementById('playerClearOptionBtn');
    const letters = ['A', 'B', 'C', 'D'];

    // Distinguish between Exam Mode, Review Mode, and Practice Mode
    if (STATE.isExamMode && !STATE.isReviewMode) {
      // EXAM SIMULATION: Options recorded without revealing right/wrong
      const recordedIdx = STATE.testAnswers[q.id];
      const isRecorded = (recordedIdx !== undefined);
      const stagedIdx = STATE.stagedSelection;

      if (clearOptBtn) {
        if (isRecorded) {
          clearOptBtn.classList.remove('hidden');
          clearOptBtn.onclick = function () {
            delete STATE.testAnswers[q.id];
            renderCurrentPlayerQuestion();
            // toast removed
          };
        } else {
          clearOptBtn.classList.add('hidden');
        }
      }

      if (optsContainer) {
        optsContainer.innerHTML = (q.options || []).map(function (opt, oIdx) {
          let optStyle = 'light-inner-box bg-slate-950 border border-slate-800 hover:border-amber-500/50 text-slate-200';
          let statusBadge = '';

          const eliminatedByStmt = getEliminatingStatementNum(opt, STATE.slicedStatements[q.id]);

          if (eliminatedByStmt !== null) {
            optStyle = 'opacity-35 line-through border-dashed border-rose-400/50 bg-rose-500/5 dark:bg-rose-950/20 text-rose-700 dark:text-rose-400 pointer-events-none select-none';
            statusBadge = '<span class="px-2 py-0.5 rounded bg-rose-500/15 text-rose-600 dark:text-rose-400 text-[10px] font-bold uppercase ml-auto">Ruled out (Stmt #' + eliminatedByStmt + ') ✗</span>';
          } else if (isRecorded && recordedIdx === oIdx) {
            optStyle = 'bg-amber-500/20 border-2 border-amber-500 text-amber-300 font-bold shadow-md';
            statusBadge = '<span class="px-2 py-0.5 rounded bg-amber-500 text-slate-950 text-[10px] font-black uppercase ml-auto">Recorded Choice ✓</span>';
          } else if (stagedIdx === oIdx) {
            optStyle = 'bg-amber-500/20 border-2 border-amber-500 text-amber-300 font-bold';
            statusBadge = '<span class="px-2 py-0.5 rounded bg-amber-500 text-slate-950 text-[10px] font-black uppercase ml-auto">Tap Confirm to Lock</span>';
          }

          return (
            '<button type="button" class="player-opt-btn p-3.5 rounded-2xl flex items-center gap-3 transition-all text-left text-xs sm:text-sm cursor-pointer ' + optStyle + '" data-oidx="' + oIdx + '">' +
              '<span class="w-6 h-6 rounded-xl flex items-center justify-center font-bold text-xs bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-white shrink-0 font-mono">' + letters[oIdx] + '</span>' +
              '<span class="leading-relaxed flex-1">' + escapeHtml(opt) + '</span>' +
              statusBadge +
            '</button>'
          );
        }).join('');

        optsContainer.querySelectorAll('.player-opt-btn').forEach(function (btn) {
          btn.addEventListener('click', function (e) {
            const oIdx = parseInt(e.currentTarget.getAttribute('data-oidx'), 10);
            STATE.stagedSelection = oIdx;
            if (confirmBox) confirmBox.classList.remove('hidden');
            renderCurrentPlayerQuestion();
          });
        });
      }

      if (confirmBox) {
        if (stagedIdx !== null) {
          confirmBox.classList.remove('hidden');
        } else {
          confirmBox.classList.add('hidden');
        }
      }

      // Hide Explanation Box in Exam Mode
      const expBox = document.getElementById('playerExplanationBox');
      if (expBox) expBox.classList.add('hidden');
      const distractorBox = document.getElementById('playerDistractorDeepDiveBox');
      if (distractorBox) distractorBox.innerHTML = '';

    } else if (STATE.isReviewMode) {
      // POST-TEST REVIEW MODE: Show Candidate's Pick vs Official Key
      if (clearOptBtn) clearOptBtn.classList.add('hidden');
      if (confirmBox) confirmBox.classList.add('hidden');

      const userPick = STATE.testAnswers[q.id];
      const isAttempted = (userPick !== undefined);
      const isCorrect = isAttempted && (userPick === q.correct_index);

      if (optsContainer) {
        optsContainer.innerHTML = (q.options || []).map(function (opt, oIdx) {
          let optStyle = 'light-inner-box bg-slate-950 border border-slate-800 opacity-60 text-slate-400';
          let statusBadge = '';

          const isOfficialKey = (oIdx === q.correct_index);
          const isUserSelection = (oIdx === userPick);

          if (isOfficialKey) {
            optStyle = 'bg-emerald-500/20 border-2 border-emerald-500 text-emerald-300 font-bold';
            statusBadge = '<span class="px-2 py-0.5 rounded bg-emerald-500 text-slate-950 text-[10px] font-black uppercase ml-auto">Official Key ✓</span>';
          } else if (isUserSelection && !isCorrect) {
            optStyle = 'bg-rose-500/20 border-2 border-rose-500 text-rose-300 font-bold';
            statusBadge = '<span class="px-2 py-0.5 rounded bg-rose-500 text-slate-950 text-[10px] font-black uppercase ml-auto">Your Pick ✗ (-0.66)</span>';
          }

          return (
            '<div class="p-3.5 rounded-2xl flex items-center gap-3 transition-all text-left text-xs sm:text-sm ' + optStyle + '">' +
              '<span class="w-6 h-6 rounded-xl flex items-center justify-center font-bold text-xs bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-white shrink-0 font-mono">' + letters[oIdx] + '</span>' +
              '<span class="leading-relaxed flex-1">' + escapeHtml(opt) + '</span>' +
              statusBadge +
            '</div>'
          );
        }).join('');
      }

      // Show Full Explanation & Traps
      const expBox = document.getElementById('playerExplanationBox');
      if (expBox) {
        expBox.classList.remove('hidden');

        const resBanner = document.getElementById('playerResultBanner');
        const resText = document.getElementById('playerResultText');
        const marksDelta = document.getElementById('playerMarksDelta');
        const trapTextEl = document.getElementById('playerTrapText');
        const expTextEl = document.getElementById('playerExplanationText');

        if (!isAttempted) {
          if (resBanner) resBanner.className = 'p-3.5 rounded-2xl flex items-center justify-between text-xs font-bold bg-slate-800/80 text-slate-300 border border-slate-700';
          if (resText) resText.textContent = '⚪ Question Unattempted (0.00 Marks)';
          if (marksDelta) marksDelta.textContent = '0.00 Marks';
        } else if (isCorrect) {
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
        const citEl = document.getElementById('playerCitationText');
        if (citEl && q.standard_book_ref) citEl.textContent = 'Standard Reference: ' + q.standard_book_ref;
        renderPlayerDistractorDeepDive(q);
        renderBehavioralTagger(q);
      }

    } else {
      // REGULAR PRACTICE / TUTOR MODE (Immediate feedback)
      if (clearOptBtn) clearOptBtn.classList.add('hidden');
      const userAns = STATE.answers[q.id];
      const isAnswered = !!userAns;
      const stagedIdx = STATE.stagedSelection;

      if (optsContainer) {
        optsContainer.innerHTML = (q.options || []).map(function (opt, oIdx) {
          let optStyle = 'light-inner-box bg-slate-950 border border-slate-800 hover:border-amber-500/50 text-slate-200';
          let statusBadge = '';

          const eliminatedByStmt = (!isAnswered) ? getEliminatingStatementNum(opt, STATE.slicedStatements[q.id]) : null;

          if (eliminatedByStmt !== null) {
            optStyle = 'opacity-35 line-through border-dashed border-rose-400/50 bg-rose-500/5 dark:bg-rose-950/20 text-rose-700 dark:text-rose-400 pointer-events-none select-none';
            statusBadge = '<span class="px-2 py-0.5 rounded bg-rose-500/15 text-rose-600 dark:text-rose-400 text-[10px] font-bold uppercase ml-auto">Ruled out (Stmt #' + eliminatedByStmt + ') ✗</span>';
          } else if (isAnswered) {
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

          return (
            '<button type="button" class="player-opt-btn p-3.5 rounded-2xl flex items-center gap-3 transition-all text-left text-xs sm:text-sm cursor-pointer ' + optStyle + '" data-oidx="' + oIdx + '">' +
              '<span class="w-6 h-6 rounded-xl flex items-center justify-center font-bold text-xs bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-white shrink-0 font-mono">' + letters[oIdx] + '</span>' +
              '<span class="leading-relaxed flex-1">' + escapeHtml(opt) + '</span>' +
              statusBadge +
            '</button>'
          );
        }).join('');

        if (!isAnswered) {
          optsContainer.querySelectorAll('.player-opt-btn').forEach(function (btn) {
            btn.addEventListener('click', function (e) {
              const oIdx = parseInt(e.currentTarget.getAttribute('data-oidx'), 10);
              STATE.stagedSelection = oIdx;
              if (confirmBox) confirmBox.classList.remove('hidden');
              renderCurrentPlayerQuestion();
            });
          });
        }
      }

      if (confirmBox) {
        if (stagedIdx !== null && !isAnswered) {
          confirmBox.classList.remove('hidden');
        } else {
          confirmBox.classList.add('hidden');
        }
      }

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
          const citEl = document.getElementById('playerCitationText');
          if (citEl && q.standard_book_ref) citEl.textContent = 'Standard Reference: ' + q.standard_book_ref;
          renderPlayerDistractorDeepDive(q);
          renderBehavioralTagger(q);
        } else {
          expBox.classList.add('hidden');
          const distractorBox = document.getElementById('playerDistractorDeepDiveBox');
          if (distractorBox) distractorBox.innerHTML = '';
        }
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

  // Submit Answer / Lock Response
  function submitStagedAnswer() {
    const q = STATE.playerQuestions[STATE.playerIndex];
    const stagedIdx = STATE.stagedSelection;
    if (!q || stagedIdx === null) return;

    if (STATE.isExamMode && !STATE.isReviewMode) {
      // Record answer in Exam Session
      STATE.testAnswers[q.id] = stagedIdx;
      STATE.stagedSelection = null;
      renderCurrentPlayerQuestion();
      // toast removed to prevent blocking next button
      return;
    }

    // Regular Practice Mode
    const isCorrect = stagedIdx === q.correct_index;
    STATE.answers[q.id] = {
      selectedIndex: stagedIdx,
      isCorrect: isCorrect,
      confidence: STATE.currentConfidence || 'sure',
      timestamp: Date.now()
    };

    if (STATE.activeStrategy && STATE.activeStrategy.isActive) {
      const conf = STATE.currentConfidence || 'sure';
      if (!STATE.activeStrategy.counts) STATE.activeStrategy.counts = { sure: 0, fifty: 0, wild: 0 };
      STATE.activeStrategy.counts[conf] = (STATE.activeStrategy.counts[conf] || 0) + 1;
      updateStrategyHUD();
    }

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
    updateSubTopicHeatmap();
    // toast removed to prevent blocking next button
  }

  // Update Activity Numbers in Dashboard
  
  // Compute & Render Sub-Topic Mark-Bleed Heatmap
  function updateSubTopicHeatmap() {
    const listEl = document.getElementById('subTopicHeatmapList');
    const badgeEl = document.getElementById('heatmapThemesCountBadge');
    const adviceBox = document.getElementById('heatmapAdviceBox');
    const adviceText = document.getElementById('heatmapAdviceText');
    const drillBtn = document.getElementById('heatmapDrillGapBtn');
    if (!listEl) return;

    const topicStats = {};
    Object.keys(STATE.answers).forEach(function (qId) {
      const ans = STATE.answers[qId];
      const q = STATE.pyqs.find(function (item) { return item.id === qId; });
      if (!q || !q.sub_topic) return;

      const topic = q.sub_topic;
      if (!topicStats[topic]) {
        topicStats[topic] = {
          topic: topic,
          subject: q.subject || 'GS-1',
          total: 0,
          correct: 0,
          incorrect: 0
        };
      }
      topicStats[topic].total++;
      if (ans.isCorrect) topicStats[topic].correct++;
      else topicStats[topic].incorrect++;
    });

    const topics = Object.values(topicStats);
    if (badgeEl) badgeEl.textContent = topics.length + ' Theme' + (topics.length === 1 ? '' : 's') + ' Logged';

    if (topics.length === 0) {
      listEl.innerHTML = (
        '<div class="p-3 text-center text-xs text-slate-500 bg-slate-950/60 rounded-xl border border-slate-800/60">' +
          'Solve questions to generate your personalized micro-theme accuracy heatmap.' +
        '</div>'
      );
      if (adviceBox) adviceBox.classList.add('hidden');
      return;
    }

    // Sort by lowest accuracy first, then by highest attempts
    topics.sort(function (a, b) {
      const accA = a.correct / a.total;
      const accB = b.correct / b.total;
      if (accA !== accB) return accA - accB;
      return b.total - a.total;
    });

    let worstTopic = null;

    listEl.innerHTML = topics.map(function (t) {
      const acc = Math.round((t.correct / t.total) * 100);
      const netMarks = (t.correct * 2.0) - (t.incorrect * 0.66);

      let colorClass = 'text-emerald-700 dark:text-emerald-400 bg-emerald-500/15 border-emerald-500/30';
      let barColor = 'bg-emerald-500';
      let statusLabel = 'Strong';

      if (acc < 50) {
        colorClass = 'text-rose-700 dark:text-rose-400 bg-rose-500/15 border-rose-500/30';
        barColor = 'bg-rose-500';
        statusLabel = 'Bleeding Marks';
        if (!worstTopic || t.total >= 2) worstTopic = t;
      } else if (acc < 75) {
        colorClass = 'text-amber-700 dark:text-amber-400 bg-amber-500/15 border-amber-500/30';
        barColor = 'bg-amber-500';
        statusLabel = 'Vulnerable';
      }

      return (
        '<div class="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80 flex flex-col gap-1.5 text-xs">' +
          '<div class="flex items-center justify-between">' +
            '<span class="font-bold text-slate-800 dark:text-slate-200 truncate pr-2">' + escapeHtml(t.topic) + '</span>' +
            '<span class="px-1.5 py-0.5 rounded text-[10px] font-bold font-mono border ' + colorClass + ' shrink-0">' +
              acc + '% (' + (netMarks >= 0 ? '+' : '') + netMarks.toFixed(1) + 'M)' +
            '</span>' +
          '</div>' +
          '<div class="w-full h-1.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">' +
            '<div class="h-full rounded-full ' + barColor + '" style="width: ' + acc + '%"></div>' +
          '</div>' +
          '<div class="flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400">' +
            '<span>' + escapeHtml(t.subject) + '</span>' +
            '<span>' + t.correct + '/' + t.total + ' Solved • ' + statusLabel + '</span>' +
          '</div>' +
        '</div>'
      );
    }).join('');

    if (adviceBox && adviceText) {
      if (worstTopic && (worstTopic.correct / worstTopic.total) < 0.6) {
        adviceBox.classList.remove('hidden');
        adviceText.innerHTML = '<strong>⚠️ Priority Mark-Bleed Alert:</strong> You are losing marks in <strong>' + escapeHtml(worstTopic.topic) + '</strong> (' + Math.round((worstTopic.correct / worstTopic.total) * 100) + '% accuracy). Prioritize drilling this gap!';
        if (drillBtn) {
          drillBtn.onclick = function () {
            const gapQuestions = STATE.pyqs.filter(function (q) {
              return q.sub_topic && q.sub_topic.toLowerCase() === worstTopic.topic.toLowerCase();
            });
            if (gapQuestions.length > 0) {
              STATE.playerQuestions = gapQuestions;
              STATE.playerIndex = 0;
              STATE.isExamMode = false;
              STATE.isReviewMode = false;
              STATE.currentTest = null;
              switchViewMode('player');
            }
          };
        }
      } else {
        adviceBox.classList.add('hidden');
      }
    }
  }

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
    lines.forEach(function (line) {
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
    grid.innerHTML = questions.map(function (q, idx) {
      const isCurrent = idx === STATE.playerIndex;
      let color = 'bg-slate-950 border border-slate-800 text-slate-300';

      if (STATE.isExamMode && !STATE.isReviewMode) {
        const isRecorded = (STATE.testAnswers[q.id] !== undefined);
        const isFlagged = STATE.flagged.has(q.id);

        if (isRecorded && isFlagged) {
          color = 'bg-purple-500 text-white font-black'; // Answered & Marked
        } else if (isRecorded) {
          color = 'bg-emerald-500 text-slate-950 font-black'; // Answered
        } else if (isFlagged) {
          color = 'bg-amber-500 text-slate-950 font-black'; // Marked for Review
        }
      } else if (STATE.isReviewMode) {
        const isAttempted = (STATE.testAnswers[q.id] !== undefined);
        const isCorrect = isAttempted && (STATE.testAnswers[q.id] === q.correct_index);
        if (isAttempted) {
          color = isCorrect ? 'bg-emerald-500 text-slate-950 font-black' : 'bg-rose-500 text-slate-950 font-black';
        }
      } else {
        const ans = STATE.answers[q.id];
        const isFlagged = STATE.flagged.has(q.id);
        if (ans) {
          color = ans.isCorrect ? 'bg-emerald-500 text-slate-950 font-black' : 'bg-rose-500 text-slate-950 font-black';
        } else if (isFlagged) {
          color = 'bg-amber-500 text-slate-950 font-black';
        }
      }

      if (isCurrent) {
        color += ' ring-2 ring-white ring-offset-2 ring-offset-slate-950';
      }

      return (
        '<button type="button" class="palette-q-btn p-2 rounded-xl text-xs font-mono font-bold flex items-center justify-center cursor-pointer transition-all ' + color + '" data-idx="' + idx + '">' +
          (idx + 1) +
        '</button>'
      );
    }).join('');

    grid.querySelectorAll('.palette-q-btn').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
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
    renderDashboardMockHistory();
  }

  // Setup UI Listeners
  
  // ==========================================================
  // CUTOFF SWEET SPOT & EV SIMULATOR ENGINE
  // ==========================================================
  window.openEVSimulator = function () {
    const modal = document.getElementById('cutoffEVModal');
    if (modal) {
      modal.classList.remove('hidden');
      recalculateEV('total');
    }
  };

  window.closeEVSimulator = function () {
    const modal = document.getElementById('cutoffEVModal');
    if (modal) modal.classList.add('hidden');
  };

  function recalculateEV(source) {
    const totalSlider = document.getElementById('evTotalSlider');
    const sureSlider = document.getElementById('evSureSlider');
    const fiftySlider = document.getElementById('evFiftySlider');
    const wildSlider = document.getElementById('evWildSlider');

    if (!totalSlider || !sureSlider || !fiftySlider || !wildSlider) return;

    let total = parseInt(totalSlider.value, 10);
    let sure = parseInt(sureSlider.value, 10);
    let fifty = parseInt(fiftySlider.value, 10);
    let wild = parseInt(wildSlider.value, 10);

    if (source === 'total') {
      sure = Math.max(20, Math.min(60, Math.round(total * 0.54)));
      fifty = Math.max(5, Math.min(45, Math.round(total * 0.32)));
      wild = Math.max(0, total - sure - fifty);

      sureSlider.value = sure;
      fiftySlider.value = fifty;
      wildSlider.value = wild;
    } else {
      total = sure + fifty + wild;
      totalSlider.value = Math.max(65, Math.min(95, total));
    }

    const totalDisplay = document.getElementById('evTotalDisplay');
    const sureDisplay = document.getElementById('evSureDisplay');
    const fiftyDisplay = document.getElementById('evFiftyDisplay');
    const wildDisplay = document.getElementById('evWildDisplay');

    if (totalDisplay) totalDisplay.textContent = total + ' / 100';
    if (sureDisplay) sureDisplay.textContent = sure + ' questions';
    if (fiftyDisplay) fiftyDisplay.textContent = fifty + ' questions';
    if (wildDisplay) wildDisplay.textContent = wild + ' questions';

    // Mathematical Calculation
    const sureCorrect = sure * 0.90;
    const sureWrong = sure * 0.10;

    const fiftyCorrect = fifty * 0.50;
    const fiftyWrong = fifty * 0.50;

    const wildCorrect = wild * 0.25;
    const wildWrong = wild * 0.75;

    const totalCorrect = sureCorrect + fiftyCorrect + wildCorrect;
    const totalWrong = sureWrong + fiftyWrong + wildWrong;

    const gross = totalCorrect * 2.0;
    const penalty = totalWrong * (2.0 / 3.0);
    const net = gross - penalty;

    const CUTOFF = 88.0;
    const delta = net - CUTOFF;

    const netText = document.getElementById('evNetScoreText');
    const grossText = document.getElementById('evGrossScoreText');
    const penaltyText = document.getElementById('evPenaltyScoreText');
    const verdictPill = document.getElementById('evVerdictPill');
    const deltaNotice = document.getElementById('evCutoffDeltaNotice');
    const deltaText = document.getElementById('evCutoffDeltaText');
    const takeawayText = document.getElementById('evTacticalTakeaway');

    if (netText) netText.textContent = (net > 0 ? '+' : '') + net.toFixed(1);
    if (grossText) grossText.textContent = '+' + gross.toFixed(1);
    if (penaltyText) penaltyText.textContent = '-' + penalty.toFixed(1);

    if (net >= CUTOFF) {
      if (verdictPill) {
        verdictPill.className = 'text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30';
        verdictPill.textContent = 'Safe Zone';
      }
      if (deltaNotice) {
        deltaNotice.className = 'text-[11px] p-2.5 rounded-xl font-semibold flex items-center justify-between bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20';
      }
      if (deltaText) {
        deltaText.textContent = '🎉 Clearing standard 88.0 cutoff by +' + delta.toFixed(1) + ' marks!';
      }
    } else {
      if (verdictPill) {
        verdictPill.className = 'text-[10px] font-bold px-2 py-0.5 rounded-md bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30';
        verdictPill.textContent = 'Mark Leak Risk';
      }
      if (deltaNotice) {
        deltaNotice.className = 'text-[11px] p-2.5 rounded-xl font-semibold flex items-center justify-between bg-rose-500/10 text-rose-700 dark:text-rose-300 border border-rose-500/20';
      }
      if (deltaText) {
        deltaText.textContent = '⚠️ Trailing standard 88.0 cutoff by ' + delta.toFixed(1) + ' marks (Negative Bleed Trap!).';
      }
    }

    if (takeawayText) {
      if (wild >= 8) {
        const wildBleed = (wildWrong * (2.0 / 3.0)).toFixed(1);
        const potentialNet = (net + (wildWrong * (2.0 / 3.0)) - (wildCorrect * 2.0)).toFixed(1);
        takeawayText.textContent = '🚨 Negative Bleed: Your ' + wild + ' wild guesses lose -' + wildBleed + ' marks in pure penalties. Eliminating them jumps your Net Score to ' + potentialNet + ' marks!';
      } else if (total < 75) {
        takeawayText.textContent = '⚠️ Under-Attempt Ceiling: At ' + total + ' attempts, even high accuracy caps your score near the cutoff edge (' + net.toFixed(1) + 'M). Push to 80–85 attempts using disciplined 50:50 elimination.';
      } else if (net >= 95) {
        takeawayText.textContent = '💎 Ranker Safe Zone: Net ' + net.toFixed(1) + ' marks (+' + delta.toFixed(1) + ' safe buffer). Eliminating wild guesses ensures you clear the cutoff effortlessly.';
      } else {
        takeawayText.textContent = '🎯 Competitive Threshold: You are at ' + net.toFixed(1) + ' marks. Converting just 3 more 50:50 questions into correct keys with Topper Trap elimination gives you a safe 92+ buffer!';
      }
    }
  }


  // ==========================================================
  // OPTION-BY-OPTION DISTRACTOR DEEP DIVE (PLAYER)
  // ==========================================================
  function renderPlayerDistractorDeepDive(q) {
    const distractorBox = document.getElementById('playerDistractorDeepDiveBox');
    if (!distractorBox || !q) return;

    const distractors = getDistractorAnalysis(q);
    distractorBox.innerHTML = (
      '<div class="flex items-center gap-2 pt-2 border-t border-slate-800">' +
        '<span class="text-xs font-mono uppercase font-black text-amber-500 tracking-wider">🔬 Option-by-Option Distractor Deep Dive:</span>' +
      '</div>' +
      '<div class="grid grid-cols-1 gap-2">' +
        distractors.map(function (d) {
          const badgeClass = d.isCorrect
            ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
            : 'bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30';
          return (
            '<div class="p-3 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex flex-col gap-1 text-xs">' +
              '<div class="flex items-center justify-between gap-2">' +
                '<span class="font-bold text-slate-800 dark:text-white font-mono">Option ' + d.letter + '</span>' +
                '<span class="px-2 py-0.5 rounded text-[10px] font-bold ' + badgeClass + '">' + escapeHtml(d.label) + '</span>' +
              '</div>' +
              '<p class="text-slate-700 dark:text-slate-300 font-medium">' + escapeHtml(d.optionText) + '</p>' +
              '<p class="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-200 dark:border-slate-900 pt-1 mt-0.5">' +
                '<strong>Diagnosis:</strong> ' + escapeHtml(d.details) +
              '</p>' +
            '</div>'
          );
        }).join('') +
      '</div>'
    );
  }

  // ==========================================================
  // PRELIMS PYQ BRAINSTORMING & ANALYSIS VAULT (2011–2026)
  // ==========================================================

  function getFilteredVaultQuestions() {
    var list = STATE.pyqs || [];

    // Filter by mode
    if (STATE.vaultMode === 'subject') {
      if (STATE.vaultSelectedSubject && STATE.vaultSelectedSubject !== 'all') {
        list = list.filter(function (q) {
          return q.subject === STATE.vaultSelectedSubject;
        });
      }
    } else if (STATE.vaultMode === 'year') {
      if (STATE.vaultSelectedYear && STATE.vaultSelectedYear !== 'all') {
        list = list.filter(function (q) {
          return String(q.year) === String(STATE.vaultSelectedYear);
        });
      }
    }

    // Filter by Difficulty
    if (STATE.vaultSelectedDifficulty && STATE.vaultSelectedDifficulty !== 'all') {
      list = list.filter(function (q) {
        return (q.difficulty || '').toLowerCase() === STATE.vaultSelectedDifficulty.toLowerCase();
      });
    }

    // Filter by Search Query
    if (STATE.vaultSearchQuery) {
      var query = STATE.vaultSearchQuery.toLowerCase();
      list = list.filter(function (q) {
        return (q.question_text || '').toLowerCase().includes(query) ||
               (q.subject || '').toLowerCase().includes(query) ||
               (q.sub_topic || '').toLowerCase().includes(query) ||
               (q.standard_book_ref || '').toLowerCase().includes(query) ||
               (q.explanation || '').toLowerCase().includes(query);
      });
    }

    return list;
  }

  function renderPyqVault() {
    var subjectBtn = document.getElementById('vaultModeSubjectBtn');
    var yearBtn = document.getElementById('vaultModeYearBtn');
    var subjectFilterRow = document.getElementById('vaultSubjectFilterContainer');
    var yearFilterRow = document.getElementById('vaultYearFilterContainer');

    if (STATE.vaultMode === 'subject') {
      if (subjectBtn) subjectBtn.className = 'px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-black shadow-xs transition-all cursor-pointer flex items-center gap-1.5';
      if (yearBtn) yearBtn.className = 'px-4 py-2 rounded-xl text-slate-400 hover:text-white transition-all cursor-pointer flex items-center gap-1.5';
      if (subjectFilterRow) subjectFilterRow.classList.remove('hidden');
      if (yearFilterRow) yearFilterRow.classList.add('hidden');
    } else {
      if (subjectBtn) subjectBtn.className = 'px-4 py-2 rounded-xl text-slate-400 hover:text-white transition-all cursor-pointer flex items-center gap-1.5';
      if (yearBtn) yearBtn.className = 'px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-black shadow-xs transition-all cursor-pointer flex items-center gap-1.5';
      if (subjectFilterRow) subjectFilterRow.classList.add('hidden');
      if (yearFilterRow) yearFilterRow.classList.remove('hidden');
    }

    renderVaultSubjectPills();
    renderVaultYearPills();

    var filtered = getFilteredVaultQuestions();

    var badge = document.getElementById('vaultTotalCountBadge');
    if (badge) badge.textContent = filtered.length + ' Question' + (filtered.length === 1 ? '' : 's') + ' Available';

    renderVaultAnalytics(filtered);
    renderVaultQuestions(filtered);
  }

  function renderVaultSubjectPills() {
    var container = document.getElementById('vaultSubjectPillsGroup');
    if (!container) return;

    var subjects = [
      { id: 'all', label: 'All Subjects' },
      { id: 'Polity & Governance', label: 'Polity & Governance' },
      { id: 'Economy', label: 'Economy' },
      { id: 'Environment & Ecology', label: 'Environment & Ecology' },
      { id: 'History & Culture', label: 'History & Culture' },
      { id: 'Geography', label: 'Geography' },
      { id: 'Science & Technology', label: 'Sci-Tech' }
    ];

    container.innerHTML = subjects.map(function (s) {
      var count = (s.id === 'all')
        ? STATE.pyqs.length
        : STATE.pyqs.filter(function (q) { return q.subject === s.id; }).length;

      var isActive = (STATE.vaultSelectedSubject === s.id);
      var btnClass = isActive
        ? 'px-3 py-1.5 rounded-xl bg-amber-500 text-slate-950 font-black shadow-xs cursor-pointer text-xs'
        : 'px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-950 text-slate-700 dark:text-slate-300 hover:text-amber-500 border border-slate-200 dark:border-slate-800 cursor-pointer text-xs transition-all';

      return (
        '<button type="button" class="vault-subj-pill ' + btnClass + '" data-subj="' + s.id + '">' +
          escapeHtml(s.label) + ' <span class="opacity-70 font-mono text-[10px]">(' + count + ')</span>' +
        '</button>'
      );
    }).join('');

    container.querySelectorAll('.vault-subj-pill').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        STATE.vaultSelectedSubject = e.currentTarget.getAttribute('data-subj');
        renderPyqVault();
      });
    });
  }

  function renderVaultYearPills() {
    var container = document.getElementById('vaultYearPillsGroup');
    if (!container) return;

    var years = ['all', '2026', '2025', '2024', '2023', '2022', '2021', '2020', '2019', '2018', '2017', '2016', '2015', '2014', '2013', '2012', '2011'];

    container.innerHTML = years.map(function (y) {
      var count = (y === 'all')
        ? STATE.pyqs.length
        : STATE.pyqs.filter(function (q) { return String(q.year) === y; }).length;

      var isActive = (String(STATE.vaultSelectedYear) === y);
      var btnClass = isActive
        ? 'px-3 py-1.5 rounded-xl bg-amber-500 text-slate-950 font-black shadow-xs cursor-pointer text-xs'
        : 'px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-950 text-slate-700 dark:text-slate-300 hover:text-amber-500 border border-slate-200 dark:border-slate-800 cursor-pointer text-xs font-mono transition-all';

      return (
        '<button type="button" class="vault-year-pill ' + btnClass + '" data-year="' + y + '">' +
          (y === 'all' ? 'All Years' : y) + ' <span class="opacity-70 text-[10px]">(' + count + ')</span>' +
        '</button>'
      );
    }).join('');

    container.querySelectorAll('.vault-year-pill').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        STATE.vaultSelectedYear = e.currentTarget.getAttribute('data-year');
        renderPyqVault();
      });
    });
  }

  function renderVaultAnalytics(questions) {
    var total = questions.length;
    var easy = 0, mod = 0, hard = 0;
    var multi = 0, pairs = 0, direct = 0;
    var topicFreq = {};

    questions.forEach(function (q) {
      var diff = (q.difficulty || 'Moderate').toLowerCase();
      if (diff === 'easy') easy++;
      else if (diff === 'hard') hard++;
      else mod++;

      var txt = (q.question_text || '').toLowerCase();
      if (txt.includes('how many of the pairs') || txt.includes('pairs given above')) pairs++;
      else if (txt.includes('1 and 2') || txt.includes('consider the following statements')) multi++;
      else direct++;

      if (q.sub_topic) {
        topicFreq[q.sub_topic] = (topicFreq[q.sub_topic] || 0) + 1;
      }
    });

    var easyPct = total ? Math.round((easy / total) * 100) : 0;
    var modPct = total ? Math.round((mod / total) * 100) : 0;
    var hardPct = total ? Math.round((hard / total) * 100) : 0;

    var multiPct = total ? Math.round((multi / total) * 100) : 0;
    var pairsPct = total ? Math.round((pairs / total) * 100) : 0;
    var directPct = total ? Math.round((direct / total) * 100) : 0;

    var easyEl = document.getElementById('vaultEasyText');
    var modEl = document.getElementById('vaultModText');
    var hardEl = document.getElementById('vaultHardText');
    if (easyEl) easyEl.textContent = 'Easy: ' + easyPct + '% (' + easy + ')';
    if (modEl) modEl.textContent = 'Moderate: ' + modPct + '% (' + mod + ')';
    if (hardEl) hardEl.textContent = 'Hard: ' + hardPct + '% (' + hard + ')';

    var multiEl = document.getElementById('vaultMultiText');
    var pairsEl = document.getElementById('vaultPairsText');
    var directEl = document.getElementById('vaultDirectText');
    if (multiEl) multiEl.textContent = 'Multi-Stmt: ' + multiPct + '%';
    if (pairsEl) pairsEl.textContent = 'Pairs/New: ' + pairsPct + '%';
    if (directEl) directEl.textContent = 'Direct: ' + directPct + '%';

    // SVG Donut 1: Difficulty
    var diffDonut = document.getElementById('vaultDifficultyDonut');
    if (diffDonut) {
      diffDonut.innerHTML = (
        '<svg viewBox="0 0 36 36" class="w-14 h-14 -rotate-90">' +
          '<circle cx="18" cy="18" r="14" fill="none" stroke="#10b981" stroke-width="4" stroke-dasharray="' + easyPct + ' 100" stroke-dashoffset="0" />' +
          '<circle cx="18" cy="18" r="14" fill="none" stroke="#f59e0b" stroke-width="4" stroke-dasharray="' + modPct + ' 100" stroke-dashoffset="-' + easyPct + '" />' +
          '<circle cx="18" cy="18" r="14" fill="none" stroke="#ef4444" stroke-width="4" stroke-dasharray="' + hardPct + ' 100" stroke-dashoffset="-' + (easyPct + modPct) + '" />' +
        '</svg>' +
        '<div class="absolute text-[10px] font-mono font-bold text-slate-800 dark:text-white">' + total + 'Q</div>'
      );
    }

    // SVG Donut 2: Question Pattern
    var patternDonut = document.getElementById('vaultPatternDonut');
    if (patternDonut) {
      patternDonut.innerHTML = (
        '<svg viewBox="0 0 36 36" class="w-14 h-14 -rotate-90">' +
          '<circle cx="18" cy="18" r="14" fill="none" stroke="#3b82f6" stroke-width="4" stroke-dasharray="' + multiPct + ' 100" stroke-dashoffset="0" />' +
          '<circle cx="18" cy="18" r="14" fill="none" stroke="#a855f7" stroke-width="4" stroke-dasharray="' + pairsPct + ' 100" stroke-dashoffset="-' + multiPct + '" />' +
          '<circle cx="18" cy="18" r="14" fill="none" stroke="#14b8a6" stroke-width="4" stroke-dasharray="' + directPct + ' 100" stroke-dashoffset="-' + (multiPct + pairsPct) + '" />' +
        '</svg>' +
        '<div class="absolute text-[10px] font-mono font-bold text-slate-800 dark:text-white">' + (multiPct + pairsPct) + '%</div>'
      );
    }

    // High Yield Micro-Topic Badges
    var topTopicsGroup = document.getElementById('vaultTopTopicsPillGroup');
    if (topTopicsGroup) {
      var sortedTopics = Object.keys(topicFreq).sort(function (a, b) {
        return topicFreq[b] - topicFreq[a];
      }).slice(0, 5);

      topTopicsGroup.innerHTML = sortedTopics.map(function (tp) {
        return (
          '<span class="px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20">' +
            escapeHtml(tp) + ' (' + topicFreq[tp] + ')' +
          '</span>'
        );
      }).join('');
    }
  }

  function renderVaultQuestions(questions) {
    var container = document.getElementById('vaultQuestionsContainer');
    var statusText = document.getElementById('vaultFeedStatusText');
    if (!container) return;

    if (statusText) {
      statusText.textContent = 'Showing ' + questions.length + ' authentic UPSC Prelims Questions';
    }

    if (questions.length === 0) {
      container.innerHTML = (
        '<div class="p-8 text-center rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col items-center gap-2">' +
          '<span class="text-3xl">🔍</span>' +
          '<span class="text-sm font-bold text-slate-800 dark:text-white">No questions found matching your filter</span>' +
          '<span class="text-xs text-slate-500 dark:text-slate-400">Try adjusting your search query, subject, or year filter.</span>' +
        '</div>'
      );
      return;
    }

    var letters = ['A', 'B', 'C', 'D'];

    container.innerHTML = questions.map(function (q) {
      var isExpanded = STATE.vaultExpandedQuestions.has(q.id);
      var distractors = isExpanded ? getDistractorAnalysis(q) : [];

      var diffBadgeColor = 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30';
      if ((q.difficulty || '').toLowerCase() === 'easy') diffBadgeColor = 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30';
      if ((q.difficulty || '').toLowerCase() === 'hard') diffBadgeColor = 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30';

      return (
        '<div class="light-card rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-md flex flex-col gap-4" id="vault-card-' + q.id + '">' +
          
          '<!-- Header Badges -->' +
          '<div class="flex items-center justify-between gap-2 flex-wrap border-b border-slate-200 dark:border-slate-800 pb-3">' +
            '<div class="flex items-center gap-2 flex-wrap">' +
              '<span class="px-2.5 py-0.5 rounded-lg bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20 text-xs font-mono font-bold">UPSC ' + q.year + '</span>' +
              '<span class="px-2.5 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold">' + escapeHtml(q.subject || 'GS-1') + '</span>' +
              (q.sub_topic ? '<span class="px-2 py-0.5 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 text-[11px] font-mono">' + escapeHtml(q.sub_topic) + '</span>' : '') +
              '<span class="px-2 py-0.5 rounded-lg border text-[11px] font-bold font-mono ' + diffBadgeColor + '">' + escapeHtml(q.difficulty || 'Moderate') + '</span>' +
            '</div>' +

            '<button type="button" class="vault-solve-one-btn px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs shadow-xs transition-all cursor-pointer flex items-center gap-1 shrink-0" data-qid="' + q.id + '">' +
              '<span>🎯 Solve in Focus Player</span>' +
            '</button>' +
          '</div>' +

          '<!-- Question Statement -->' +
          '<div class="text-xs sm:text-sm font-semibold text-slate-900 dark:text-slate-100 leading-relaxed">' +
            '<p class="whitespace-pre-line">' + escapeHtml(q.question_text) + '</p>' +
          '</div>' +

          '<!-- Expand / Collapse Brainstorming Drawer -->' +
          '<div class="flex items-center justify-between pt-1">' +
            '<button type="button" class="vault-toggle-card-btn text-xs font-bold text-amber-600 dark:text-amber-500 hover:text-amber-700 dark:hover:text-amber-400 flex items-center gap-1.5 cursor-pointer" data-qid="' + q.id + '">' +
              '<span>' + (isExpanded ? '▲ Hide Forensic Key & Traps' : '▼ 🧠 Brainstorm & Decoded Answer Key') + '</span>' +
            '</button>' +
          '</div>' +

          (isExpanded ? (
            '<div class="flex flex-col gap-3.5 pt-3 border-t border-slate-200 dark:border-slate-800">' +
              
              '<!-- Official Key Pill -->' +
              '<div class="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-between text-xs">' +
                '<span class="font-black text-emerald-700 dark:text-emerald-400">Official UPSC Answer Key:</span>' +
                '<span class="px-2.5 py-0.5 rounded-md bg-emerald-500 text-slate-950 font-mono font-black text-xs">' +
                  'Option (' + letters[q.correct_index] + ')' +
                '</span>' +
              '</div>' +

              '<!-- Option-by-Option Distractor Deep Dive -->' +
              '<div class="flex flex-col gap-2">' +
                '<span class="text-xs font-mono uppercase font-black text-amber-600 dark:text-amber-500 tracking-wider">🔬 Option-by-Option Distractor Deep Dive:</span>' +
                '<div class="grid grid-cols-1 gap-2">' +
                  distractors.map(function (d) {
                    var badgeClass = d.isCorrect
                      ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30'
                      : 'bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30';
                    return (
                      '<div class="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex flex-col gap-1 text-xs">' +
                        '<div class="flex items-center justify-between gap-2">' +
                          '<span class="font-bold text-slate-800 dark:text-white font-mono">Option ' + d.letter + '</span>' +
                          '<span class="px-2 py-0.5 rounded text-[10px] font-bold ' + badgeClass + '">' + escapeHtml(d.label) + '</span>' +
                        '</div>' +
                        '<p class="text-slate-800 dark:text-slate-300 font-medium">' + escapeHtml(d.optionText) + '</p>' +
                        '<p class="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-200 dark:border-slate-900 pt-1 mt-0.5">' +
                          '<strong>Diagnosis:</strong> ' + escapeHtml(d.details) +
                        '</p>' +
                      '</div>'
                    );
                  }).join('') +
                '</div>' +
              '</div>' +

              '<!-- Topper Elimination Trap -->' +
              '<div class="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 flex flex-col gap-1 text-xs">' +
                '<span class="font-bold text-amber-700 dark:text-amber-400 uppercase text-[10px] tracking-wider flex items-center gap-1">' +
                  '<span>⚡</span> Topper Elimination Trap' +
                '</span>' +
                '<p class="text-amber-900 dark:text-amber-200 leading-relaxed text-[11px]">' +
                  escapeHtml(q.elimination_trap || 'Pay close attention to subtle swaps between constitutional provisions and subordinate legislation.') +
                '</p>' +
              '</div>' +

              '<!-- Forensic Explanation -->' +
              '<div class="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex flex-col gap-1.5 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">' +
                '<span class="font-bold text-slate-900 dark:text-white text-xs">Official UPSC Forensic Breakdown:</span>' +
                '<p class="whitespace-pre-line">' + escapeHtml(q.explanation || 'Official UPSC key validated explanation.') + '</p>' +
                (q.standard_book_ref ? '<span class="text-[11px] text-amber-700 dark:text-amber-400 font-mono pt-1">📖 Standard Reference: ' + escapeHtml(q.standard_book_ref) + '</span>' : '') +
              '</div>' +

            '</div>'
          ) : '') +

        '</div>'
      );
    }).join('');

    // Toggle single card
    container.querySelectorAll('.vault-toggle-card-btn').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        var qId = e.currentTarget.getAttribute('data-qid');
        if (STATE.vaultExpandedQuestions.has(qId)) {
          STATE.vaultExpandedQuestions.delete(qId);
        } else {
          STATE.vaultExpandedQuestions.add(qId);
        }
        renderVaultQuestions(questions);
      });
    });

    // Solve in focus player
    container.querySelectorAll('.vault-solve-one-btn').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        var qId = e.currentTarget.getAttribute('data-qid');
        var question = STATE.pyqs.find(function (item) { return item.id === qId; });
        if (question) {
          window.startPracticeWithSingleQuestion(question);
        }
      });
    });
  }

  // Launch single question in focus player
  window.startPracticeWithSingleQuestion = function (q) {
    if (!q) return;
    STATE.playerQuestions = [q];
    STATE.playerIndex = 0;
    STATE.isExamMode = false;
    STATE.isReviewMode = false;
    STATE.currentTest = null;
    switchViewMode('player');
  };

  // ==========================================================
  // MISTAKES NOTEBOOK & 10-MINUTE MICRO-CORRECTION GENERATOR
  // ==========================================================

  window.openMistakesModal = function () {
    switchViewMode('mistakes');
  };

  window.closeMistakesModal = function () {
    switchViewMode('dashboard');
  };

  window.openEVSimulator = function () {
    switchViewMode('cutoff_ev');
  };

  window.closeEVSimulator = function () {
    switchViewMode('dashboard');
  };

  function renderMistakesModal() {
    var container = document.getElementById('modalMistakesContainer');
    var badge = document.getElementById('modalMistakesCountBadge');
    if (!container) return;

    var allMistakes = STATE.pyqs.filter(function (q) {
      return STATE.mistakes.has(q.id);
    });

    var filter = STATE.mistakesFilter || 'all';
    var mistakeQuestions = allMistakes.filter(function (q) {
      if (filter === 'all') return true;
      return STATE.leakTags[q.id] === filter;
    });

    if (badge) badge.textContent = allMistakes.length + ' Gap' + (allMistakes.length === 1 ? '' : 's') + ' Logged';

    // Update filter buttons styling
    document.querySelectorAll('.mistake-filter-btn').forEach(function (btn) {
      const f = btn.getAttribute('data-filter');
      const count = (f === 'all')
        ? allMistakes.length
        : allMistakes.filter(function (q) { return STATE.leakTags[q.id] === f; }).length;

      btn.textContent = (f === 'all' ? 'All Gaps' : (f === 'concept' ? '🔴 Conceptual' : (f === 'silly' ? '🟡 Silly Trap' : (f === 'elimination' ? '🔵 Over-Elim' : '🟣 Memory')))) + ' (' + count + ')';

      if (f === filter) {
        btn.className = 'mistake-filter-btn px-2.5 py-1 rounded-lg bg-amber-500 text-slate-950 font-black text-[11px] cursor-pointer shadow-xs';
      } else {
        btn.className = 'mistake-filter-btn px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-950 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 font-bold text-[11px] cursor-pointer hover:border-slate-400';
      }
    });

    if (mistakeQuestions.length === 0) {
      container.innerHTML = (
        '<div class="p-8 text-center rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex flex-col items-center gap-2">' +
          '<span class="text-4xl">🎉</span>' +
          '<span class="text-sm font-black text-emerald-600 dark:text-emerald-400">Zero Active Mark Leaks!</span>' +
          '<p class="text-xs text-slate-600 dark:text-slate-400 max-w-md leading-relaxed">' +
            'You currently have no recorded mistakes. Solve questions in Focus Player or take Mock Tests — any wrong attempts will be automatically organized here into high-yield micro-corrections.' +
          '</p>' +
        '</div>'
      );
      return;
    }

    var letters = ['A', 'B', 'C', 'D'];

    container.innerHTML = mistakeQuestions.map(function (q) {
      var userAns = STATE.answers[q.id];
      var userPickText = (userAns && userAns.selectedIndex !== undefined && q.options)
        ? ('Option (' + letters[userAns.selectedIndex] + '): ' + q.options[userAns.selectedIndex])
        : 'Incorrect Attempt';
      var correctText = (q.options && q.correct_index !== undefined)
        ? ('Option (' + letters[q.correct_index] + '): ' + q.options[q.correct_index])
        : 'Official Key';

      var firstExpLine = (q.explanation || '').split('\n')[0] || '';

      return (
        '<div class="p-4 rounded-2xl bg-white dark:bg-slate-950 border border-rose-300 dark:border-rose-500/30 flex flex-col gap-3 text-xs shadow-xs">' +
          
          '<!-- Top Header -->' +
          '<div class="flex items-center justify-between gap-2 flex-wrap">' +
            '<div class="flex items-center gap-2">' +
              '<span class="px-2 py-0.5 rounded bg-rose-500/20 text-rose-700 dark:text-rose-400 font-bold font-mono text-[10px]">Mark Leak (-0.66)</span>' +
              (STATE.leakTags[q.id] ? (
                STATE.leakTags[q.id] === 'concept' ? '<span class="px-2 py-0.5 rounded bg-rose-500 text-white font-bold text-[10px]">🔴 Conceptual Gap</span>' :
                STATE.leakTags[q.id] === 'silly' ? '<span class="px-2 py-0.5 rounded bg-amber-500 text-slate-950 font-bold text-[10px]">🟡 Silly Trap</span>' :
                STATE.leakTags[q.id] === 'elimination' ? '<span class="px-2 py-0.5 rounded bg-blue-500 text-white font-bold text-[10px]">🔵 Over-Elimination</span>' :
                '<span class="px-2 py-0.5 rounded bg-purple-500 text-white font-bold text-[10px]">🟣 Memory Slip</span>'
              ) : '') + '' +
              '<span class="font-bold text-slate-800 dark:text-slate-300">' + escapeHtml(q.subject || 'GS-1') + ' (' + q.year + ')</span>' +
              (q.sub_topic ? '<span class="text-slate-500 dark:text-slate-400 text-[10px]">· ' + escapeHtml(q.sub_topic) + '</span>' : '') +
            '</div>' +
            
            '<button type="button" class="remove-mistake-gap-btn text-[11px] text-slate-500 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400 cursor-pointer font-bold" data-qid="' + q.id + '">' +
              'Remove Gap ✕' +
            '</button>' +
          '</div>' +

          '<!-- Question statement -->' +
          '<p class="font-medium text-slate-900 dark:text-slate-200 leading-relaxed line-clamp-3">' + escapeHtml(q.question_text) + '</p>' +

          '<!-- Comparison: Your Pick vs Official Key -->' +
          '<div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">' +
            '<div class="p-2 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-800 dark:text-rose-300">' +
              '<span class="font-bold block text-[10px] uppercase text-rose-600 dark:text-rose-400">Your Selection ✗:</span>' +
              '<span class="line-clamp-2">' + escapeHtml(userPickText) + '</span>' +
            '</div>' +
            '<div class="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 dark:text-emerald-300">' +
              '<span class="font-bold block text-[10px] uppercase text-emerald-600 dark:text-emerald-400">Official UPSC Key ✓:</span>' +
              '<span class="line-clamp-2">' + escapeHtml(correctText) + '</span>' +
            '</div>' +
          '</div>' +

          '<!-- 10-Minute Micro-Correction Generator Box -->' +
          '<div class="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 flex flex-col gap-1.5">' +
            '<div class="flex items-center gap-1.5 text-amber-700 dark:text-amber-400 font-bold text-[11px] uppercase font-mono">' +
              '<span>⚡</span> 10-Minute Active Micro-Correction' +
            '</div>' +
            '<p class="text-amber-900 dark:text-amber-100 text-[11px] leading-relaxed">' +
              '<strong>Factual Distinction:</strong> ' + escapeHtml(firstExpLine || q.explanation) +
            '</p>' +
            (q.standard_book_ref ? '<span class="text-[10px] text-amber-700 dark:text-amber-300 font-mono">📖 ' + escapeHtml(q.standard_book_ref) + '</span>' : '') +
          '</div>' +

          '<!-- Remedial Action Bar -->' +
          '<div class="flex items-center justify-between pt-1 border-t border-slate-200 dark:border-slate-900">' +
            '<button type="button" class="test-mistake-recall-btn px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs cursor-pointer flex items-center gap-1" data-qid="' + q.id + '">' +
              '<span>🎯 Test Active Recall in Focus Mode</span>' +
            '</button>' +
            '<span class="text-[10px] text-slate-500">Correct attempt auto-clears this gap</span>' +
          '</div>' +

        '</div>'
      );
    }).join('');

    // Remove single mistake
    container.querySelectorAll('.remove-mistake-gap-btn').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        var qId = e.currentTarget.getAttribute('data-qid');
        STATE.mistakes.delete(qId);
        persistState();
        renderMistakesModal();
        updateDashboardActivity();
        showToast('Gap removed from notebook.');
      });
    });

    // Test active recall in focus player
    container.querySelectorAll('.test-mistake-recall-btn').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        var qId = e.currentTarget.getAttribute('data-qid');
        var question = STATE.pyqs.find(function (item) { return item.id === qId; });
        if (question) {
          window.closeMistakesModal();
          window.startPracticeWithSingleQuestion(question);
        }
      });
    });
  }

  // 1-Click Mistakes Flash-Sheet Generator & Print
  function generateAndPrintFlashSheet() {
    var mistakeQuestions = STATE.pyqs.filter(function (q) {
      return STATE.mistakes.has(q.id);
    });

    if (mistakeQuestions.length === 0) {
      showToast('No mistakes logged to export! Great job maintaining accuracy.');
      return;
    }

    var printContainer = document.getElementById('printFlashSheetContainer');
    if (!printContainer) return;

    var letters = ['A', 'B', 'C', 'D'];
    var dateStr = new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' });

    printContainer.innerHTML = (
      '<div style="padding: 24px; font-family: ui-sans-serif, system-ui, sans-serif; color: #0f172a; max-width: 800px; margin: 0 auto;">' +
        '<div style="border-bottom: 2px solid #0f172a; padding-bottom: 12px; margin-bottom: 20px;">' +
          '<h1 style="font-size: 20px; font-weight: 900; margin: 0; color: #0f172a;">CookedMains UPSC Prelims 10-Minute Micro-Correction Flash-Sheet</h1>' +
          '<div style="display: flex; justify-content: space-between; font-size: 11px; color: #475569; margin-top: 6px;">' +
            '<span>Target: Active Recall &amp; 100% Mark Leak Recovery</span>' +
            '<span>Generated: ' + dateStr + ' · ' + mistakeQuestions.length + ' High-Yield Gaps</span>' +
          '</div>' +
        '</div>' +

        '<div style="display: flex; flex-direction: column; gap: 16px;">' +
          mistakeQuestions.map(function (q, idx) {
            var correctOpt = (q.options && q.correct_index !== undefined)
              ? ('Option (' + letters[q.correct_index] + '): ' + q.options[q.correct_index])
              : 'Official Key';
            var firstLine = (q.explanation || '').split('\n')[0] || '';

            return (
              '<div style="border: 1px solid #cbd5e1; border-radius: 8px; padding: 12px; page-break-inside: avoid;">' +
                '<div style="display: flex; justify-content: space-between; font-size: 10px; font-weight: bold; color: #64748b; margin-bottom: 6px;">' +
                  '<span>GAP #' + (idx + 1) + ' · ' + escapeHtml(q.subject || 'GS') + ' (' + q.year + ')' + (q.sub_topic ? ' · ' + escapeHtml(q.sub_topic) : '') + '</span>' +
                  '<span style="color: #b91c1c;">Mark Penalty: -0.66</span>' +
                '</div>' +
                '<p style="font-size: 12px; font-weight: 600; margin: 0 0 8px 0; line-height: 1.4;">' + escapeHtml(q.question_text) + '</p>' +
                '<div style="background: #f1f5f9; padding: 8px; border-radius: 6px; font-size: 11px; margin-bottom: 6px;">' +
                  '<strong>Official UPSC Answer Key:</strong> ' + escapeHtml(correctOpt) +
                '</div>' +
                '<div style="background: #fffbeb; border-left: 3px solid #f59e0b; padding: 8px; font-size: 11px;">' +
                  '<strong>⚡ Micro-Correction Active Recall Fact:</strong> ' + escapeHtml(firstLine || q.explanation) +
                  (q.standard_book_ref ? '<br><span style="color: #b45309; font-size: 10px;">📖 Reference: ' + escapeHtml(q.standard_book_ref) + '</span>' : '') +
                '</div>' +
              '</div>'
            );
          }).join('') +
        '</div>' +

        '<div style="margin-top: 24px; padding-top: 12px; border-top: 1px solid #cbd5e1; font-size: 10px; color: #94a3b8; text-align: center;">' +
          'CookedMains Radar · UPSC CSE Prelims &amp; Mains Integrated Forensic Engine' +
        '</div>' +
      '</div>'
    );

    window.print();
  }

  function setupListeners() {
    // Mobile Sidebar Drawer
    const openSideBtn = document.getElementById('openMobileSidebarBtn');
    const closeSideBtn = document.getElementById('closeSidebarMobileBtn');
    const sideNav = document.getElementById('sidebarNav');
    const backdrop = document.getElementById('mobileSidebarBackdrop');

    const toggleSidebar = function (open) {
      if (!sideNav || !backdrop) return;
      if (open) {
        sideNav.classList.remove('-translate-x-full');
        backdrop.classList.remove('hidden');
      } else {
        sideNav.classList.add('-translate-x-full');
        backdrop.classList.add('hidden');
      }
    };

    if (openSideBtn) openSideBtn.addEventListener('click', function () { toggleSidebar(true); });
    if (closeSideBtn) closeSideBtn.addEventListener('click', function () { toggleSidebar(false); });
    if (backdrop) backdrop.addEventListener('click', function () { toggleSidebar(false); });

    // Nav Links
    document.getElementById('sideNavHome')?.addEventListener('click', function () {
      switchViewMode('dashboard');
      toggleSidebar(false);
    });
    document.getElementById('sideNavPractice')?.addEventListener('click', function () {
      window.startPracticeSession('all');
      toggleSidebar(false);
    });
    document.getElementById('sideNavMockTests')?.addEventListener('click', function () {
      window.openMockGenerator();
      toggleSidebar(false);
    });
    document.getElementById('sideNavMistakes')?.addEventListener('click', function () {
      window.openMistakesModal();
      toggleSidebar(false);
    });

    document.getElementById('closeMistakesModalBtn')?.addEventListener('click', window.closeMistakesModal);
    document.getElementById('startMistakesPracticeBtn')?.addEventListener('click', function () {
      const mistakeList = STATE.pyqs.filter(function (q) { return STATE.mistakes.has(q.id); });
      if (mistakeList.length === 0) {
        showToast('No mistakes logged yet! Solve questions to track errors.');
        return;
      }
      window.closeMistakesModal();
      STATE.playerQuestions = mistakeList;
      STATE.playerIndex = 0;
      STATE.isExamMode = false;
      STATE.isReviewMode = false;
      STATE.currentTest = null;
      switchViewMode('player');
    });

    document.getElementById('exportMistakesFlashSheetBtn')?.addEventListener('click', generateAndPrintFlashSheet);
    document.getElementById('clearAllMistakesBtn')?.addEventListener('click', function () {
      STATE.mistakes.clear();
      persistState();
      renderMistakesModal();
      updateDashboardActivity();
      showToast('All mistakes cleared.');
    });

    const oldMistakesBlock = null;

    // Theme & Lang
    document.getElementById('sidebarThemeToggle')?.addEventListener('click', toggleTheme);
    document.getElementById('sidebarLangToggle')?.addEventListener('click', function () {
      STATE.language = STATE.language === 'en' ? 'hi' : 'en';
      localStorage.setItem('cm_prelims_lang', STATE.language);
      showToast(STATE.language === 'hi' ? 'भाषा: हिंदी' : 'Language: English');
    });

    
    // Topic Search & Matrix Listeners
    const topicInput = document.getElementById('globalTopicSearchInput');
    const clearTopicBtn = document.getElementById('clearTopicSearchBtn');

    if (topicInput) {
      topicInput.addEventListener('input', function (e) {
        STATE.matrixSearchQuery = e.target.value.trim();
        renderMatrixFeed();
      });
    }

    if (clearTopicBtn) {
      clearTopicBtn.addEventListener('click', function () {
        if (topicInput) topicInput.value = '';
        STATE.matrixSearchQuery = '';
        renderMatrixFeed();
      });
    }

    // Dedicated Sidebar Prelims PYQ Vault Nav Link
    document.getElementById('sideNavPyqVault')?.addEventListener('click', function () {
      switchViewMode('vault');
      toggleSidebar(false);
    });

    // Vault Search Input
    const vaultSearchInput = document.getElementById('vaultSearchInput');
    const clearVaultSearchBtn = document.getElementById('clearVaultSearchBtn');
    if (vaultSearchInput) {
      vaultSearchInput.addEventListener('input', function (e) {
        STATE.vaultSearchQuery = e.target.value.trim();
        if (clearVaultSearchBtn) {
          if (STATE.vaultSearchQuery) clearVaultSearchBtn.classList.remove('hidden');
          else clearVaultSearchBtn.classList.add('hidden');
        }
        renderPyqVault();
      });
    }

    if (clearVaultSearchBtn) {
      clearVaultSearchBtn.addEventListener('click', function () {
        if (vaultSearchInput) vaultSearchInput.value = '';
        STATE.vaultSearchQuery = '';
        clearVaultSearchBtn.classList.add('hidden');
        renderPyqVault();
      });
    }

    // Vault Mode Switcher (Subject vs Year)
    document.getElementById('vaultModeSubjectBtn')?.addEventListener('click', function () {
      STATE.vaultMode = 'subject';
      renderPyqVault();
    });

    document.getElementById('vaultModeYearBtn')?.addEventListener('click', function () {
      STATE.vaultMode = 'year';
      renderPyqVault();
    });

    // Vault Difficulty Filter Buttons
    document.querySelectorAll('.vault-diff-btn').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        const diff = e.currentTarget.getAttribute('data-diff');
        STATE.vaultSelectedDifficulty = diff;
        document.querySelectorAll('.vault-diff-btn').forEach(function (b) {
          b.className = (b.getAttribute('data-diff') === diff)
            ? 'vault-diff-btn px-2 py-0.5 rounded-md bg-amber-500 text-slate-950 font-black cursor-pointer'
            : 'vault-diff-btn px-2 py-0.5 rounded-md text-slate-400 hover:text-white cursor-pointer';
        });
        renderPyqVault();
      });
    });

    // Vault Launch All Filtered in Focus Player
    document.getElementById('vaultLaunchFilteredPracticeBtn')?.addEventListener('click', function () {
      const filtered = getFilteredVaultQuestions();
      if (filtered.length === 0) {
        showToast('No questions in current filter to practice.');
        return;
      }
      STATE.playerQuestions = filtered;
      STATE.playerIndex = 0;
      STATE.isExamMode = false;
      STATE.isReviewMode = false;
      STATE.currentTest = null;
      switchViewMode('player');
    });

    // Vault Expand All Answers Button
    document.getElementById('vaultToggleAllAnswersBtn')?.addEventListener('click', function () {
      const filtered = getFilteredVaultQuestions();
      const allExpanded = filtered.every(function (q) { return STATE.vaultExpandedQuestions.has(q.id); });
      if (allExpanded) {
        filtered.forEach(function (q) { STATE.vaultExpandedQuestions.delete(q.id); });
        this.innerHTML = '<span>💡 Expand All Answers</span>';
      } else {
        filtered.forEach(function (q) { STATE.vaultExpandedQuestions.add(q.id); });
        this.innerHTML = '<span>▲ Collapse All Answers</span>';
      }
      renderVaultQuestions(filtered);
    });

    // Fallback for Sidebar Search & Matrix Nav Link
    document.getElementById('sideNavSearchMatrix')?.addEventListener('click', function () {
      switchViewMode('vault');
      toggleSidebar(false);
    });

    // Year Buttons
    document.querySelectorAll('.matrix-year-btn').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        const yr = e.currentTarget.getAttribute('data-year');
        STATE.matrixSelectedYear = yr;
        document.querySelectorAll('.matrix-year-btn').forEach(function (b) {
          b.className = (b.getAttribute('data-year') === yr)
            ? 'matrix-year-btn px-3 py-1 rounded-xl bg-amber-500 text-slate-950 font-black cursor-pointer transition-all'
            : 'matrix-year-btn px-2.5 py-1 rounded-xl bg-slate-800 text-slate-300 hover:text-white font-mono cursor-pointer transition-all';
        });
        renderMatrixFeed();
      });
    });

    // Subject Buttons
    document.querySelectorAll('.matrix-subj-btn').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        const sub = e.currentTarget.getAttribute('data-subject');
        STATE.matrixSelectedSubject = sub;
        document.querySelectorAll('.matrix-subj-btn').forEach(function (b) {
          b.className = (b.getAttribute('data-subject') === sub)
            ? 'matrix-subj-btn px-3 py-1 rounded-xl bg-amber-500 text-slate-950 font-black cursor-pointer transition-all'
            : 'matrix-subj-btn px-2.5 py-1 rounded-xl bg-slate-800 text-slate-300 hover:text-white font-semibold cursor-pointer transition-all';
        });
        renderMatrixFeed();
      });
    });

    // High-Yield Quick Chips
    document.querySelectorAll('.matrix-chip-btn').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        const kw = e.currentTarget.getAttribute('data-kw');
        if (topicInput) topicInput.value = kw;
        STATE.matrixSearchQuery = kw;
        renderMatrixFeed();
      });
    });

    // Solve All Filtered Button
    document.getElementById('solveAllFilteredBtn')?.addEventListener('click', function () {
      const matches = getFilteredMatrixQuestions();
      if (matches.length === 0) {
        showToast('No matching questions to solve.');
        return;
      }
      STATE.playerQuestions = matches;
      STATE.playerIndex = 0;
      STATE.isExamMode = false;
      STATE.isReviewMode = false;
      STATE.currentTest = null;
      switchViewMode('player');
      showToast('🚀 Loaded ' + matches.length + ' questions into Focus Mode!');
    });

    // Subject Grid Cards
    document.querySelectorAll('.subj-grid-card').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        const sub = e.currentTarget.getAttribute('data-subject');
        window.startPracticeSession(sub);
      });
    });

    // Quick Chips
    document.querySelectorAll('.quick-chip-btn').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        const kw = e.currentTarget.getAttribute('data-kw');
        window.startPracticeSession('all', kw);
      });
    });

    // Mock Generator Modal Triggers
    document.getElementById('openMockGenBtn')?.addEventListener('click', window.openMockGenerator);
    document.getElementById('closeMockGenBtn')?.addEventListener('click', window.closeMockGenerator);
    document.getElementById('cancelMockGenBtn')?.addEventListener('click', window.closeMockGenerator);
    document.getElementById('startGeneratedMockBtn')?.addEventListener('click', function () {
      const format = document.querySelector('input[name="mockFormat"]:checked')?.value || 'full';
      const subject = document.getElementById('mockSubjectSelect')?.value || 'all';
      const mode = document.querySelector('input[name="mockMode"]:checked')?.value || 'exam';
      generateAndStartMock(format, subject, mode);
    });

    // Player Controls
    document.getElementById('exitPlayerBtn')?.addEventListener('click', function () {
      if (STATE.isExamMode && !STATE.isReviewMode) {
        window.openSubmitConfirmModal();
      } else {
        switchViewMode('dashboard');
      }
    });

    document.getElementById('playerSubmitExamBtn')?.addEventListener('click', window.openSubmitConfirmModal);
    document.getElementById('returnToTestBtn')?.addEventListener('click', window.closeSubmitConfirmModal);
    document.getElementById('confirmFinalSubmitBtn')?.addEventListener('click', window.submitExamSession);

    document.getElementById('playerPrevBtn')?.addEventListener('click', function () {
      if (STATE.playerIndex > 0) {
        STATE.playerIndex--;
        STATE.stagedSelection = null;
        renderCurrentPlayerQuestion();
      }
    });
    document.getElementById('playerNextBtn')?.addEventListener('click', function () {
      if (STATE.playerIndex < STATE.playerQuestions.length - 1) {
        STATE.playerIndex++;
        STATE.stagedSelection = null;
        renderCurrentPlayerQuestion();
      }
    });
    document.getElementById('playerFlagBtn')?.addEventListener('click', function () {
      const q = STATE.playerQuestions[STATE.playerIndex];
      if (!q) return;
      if (STATE.flagged.has(q.id)) {
        STATE.flagged.delete(q.id);
        // toast removed
      } else {
        STATE.flagged.add(q.id);
        // toast removed
      }
      persistState();
      renderCurrentPlayerQuestion();
    });

    // Staged Confirmation Buttons
    document.getElementById('playerClearStagedBtn')?.addEventListener('click', function () {
      STATE.stagedSelection = null;
      renderCurrentPlayerQuestion();
    });
    document.getElementById('playerSubmitStagedBtn')?.addEventListener('click', submitStagedAnswer);

    // Palette Modal
    document.getElementById('openPaletteBtn')?.addEventListener('click', openPalette);
    document.getElementById('closePaletteBtn')?.addEventListener('click', closePalette);
    document.getElementById('paletteModal')?.addEventListener('click', function (e) {
      if (e.target.id === 'paletteModal') closePalette();
    });

    
    // Cutoff EV Simulator Triggers
    document.getElementById('sideNavEV')?.addEventListener('click', function () {
      window.openEVSimulator();
      toggleSidebar(false);
    });
    document.getElementById('closeEVModalBtn')?.addEventListener('click', window.closeEVSimulator);
    document.getElementById('closeEVModalBtn2')?.addEventListener('click', window.closeEVSimulator);
    document.getElementById('cutoffEVModal')?.addEventListener('click', function (e) {
      if (e.target.id === 'cutoffEVModal') window.closeEVSimulator();
    });

    document.getElementById('evTotalSlider')?.addEventListener('input', function () { recalculateEV('total'); });
    document.getElementById('evSureSlider')?.addEventListener('input', function () { recalculateEV('pool'); });
    document.getElementById('evFiftySlider')?.addEventListener('input', function () { recalculateEV('pool'); });
    document.getElementById('evWildSlider')?.addEventListener('input', function () { recalculateEV('pool'); });

    document.getElementById('launchSprintWithEVBtn')?.addEventListener('click', function () {
      const total = parseInt(document.getElementById('evTotalSlider')?.value || 85, 10);
      const sure = parseInt(document.getElementById('evSureSlider')?.value || 45, 10);
      const fifty = parseInt(document.getElementById('evFiftySlider')?.value || 30, 10);
      const wild = parseInt(document.getElementById('evWildSlider')?.value || 10, 10);
      const netText = document.getElementById('evNetScoreText')?.textContent || '+95.0';
      const plannedNet = parseFloat(netText.replace('+', ''));

      STATE.activeStrategy = {
        isActive: true,
        targetTotal: total,
        targetSure: sure,
        targetFifty: fifty,
        targetWild: wild,
        plannedNet: plannedNet,
        counts: { sure: 0, fifty: 0, wild: 0 }
      };

      window.closeEVSimulator();
      window.startPracticeSession('all');
      showToast('🎯 Active Strategy Loaded: Target ' + total + ' attempts (Sure: ' + sure + ', 50:50: ' + fifty + ', Wild: ' + wild + ')');
    });

    // Wire up Dashboard Cutoff EV Card
    document.getElementById('dashboardCutoffEVCard')?.addEventListener('click', function () {
      switchViewMode('cutoff_ev');
    });

    // Exit buttons for integrated views
    document.getElementById('exitMistakesBtn')?.addEventListener('click', function () {
      switchViewMode('dashboard');
    });
    document.getElementById('exitCutoffEVBtn')?.addEventListener('click', function () {
      switchViewMode('dashboard');
    });
    document.getElementById('exitCutoffEVBtn2')?.addEventListener('click', function () {
      switchViewMode('dashboard');
    });

    // Wire up Mistakes Notebook leak filter buttons
    document.querySelectorAll('.mistake-filter-btn').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        STATE.mistakesFilter = e.currentTarget.getAttribute('data-filter');
        renderMistakesModal();
      });
    });

    // Post-Report Buttons
    document.getElementById('reportReviewSolutionsBtn')?.addEventListener('click', function () {
      STATE.isReviewMode = true;
      STATE.playerIndex = 0;
      switchViewMode('player');
    });

    document.getElementById('reportRetakeDrillBtn')?.addEventListener('click', function () {
      const wrong = (STATE.testResults && STATE.testResults.wrongQuestions) ? STATE.testResults.wrongQuestions : [];
      if (wrong.length === 0) {
        showToast('Zero mistakes recorded! Flawless accuracy!');
        return;
      }
      STATE.playerQuestions = shuffleArray(wrong);
      STATE.playerIndex = 0;
      STATE.isExamMode = false;
      STATE.isReviewMode = false;
      STATE.currentTest = null;
      switchViewMode('player');
      showToast('🎯 Loaded ' + wrong.length + ' remedial questions!');
    });
  }

  // Initialize
  document.addEventListener('DOMContentLoaded', function () {
    loadPersistedState();
    initTheme();
    setupListeners();
    initQuestions();
  });

})();
