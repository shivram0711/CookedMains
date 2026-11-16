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
    searchQuery: '',
    viewMode: 'dashboard', // 'dashboard' | 'player' | 'report'
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
  function switchViewMode(mode) {
    STATE.viewMode = mode;
    const dashView = document.getElementById('dashboardOverviewView');
    const playerView = document.getElementById('questionPlayerView');
    const reportView = document.getElementById('mockReportView');
    const breadcrumb = document.getElementById('breadcrumbCurrent');

    if (mode === 'player') {
      if (dashView) dashView.classList.add('hidden');
      if (reportView) reportView.classList.add('hidden');
      if (playerView) playerView.classList.remove('hidden');
      if (breadcrumb) {
        breadcrumb.textContent = STATE.isExamMode 
          ? (STATE.currentTest ? STATE.currentTest.title : 'Timed Exam Simulation')
          : 'Question Player Focus Mode';
      }
      renderCurrentPlayerQuestion();
    } else if (mode === 'report') {
      if (dashView) dashView.classList.add('hidden');
      if (playerView) playerView.classList.add('hidden');
      if (reportView) reportView.classList.remove('hidden');
      if (breadcrumb) breadcrumb.textContent = 'Forensic Mock Scorecard';
    } else {
      if (playerView) playerView.classList.add('hidden');
      if (reportView) reportView.classList.add('hidden');
      if (dashView) dashView.classList.remove('hidden');
      if (breadcrumb) breadcrumb.textContent = 'Prelims Dashboard';
      updateDashboardActivity();
      renderDashboardMockHistory();
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

    // Save to Mock History in localStorage
    STATE.mockHistory.unshift({
      id: result.id,
      title: result.title,
      timestamp: result.timestamp,
      netScore: result.netScore,
      maxMarks: result.maxMarks,
      accuracy: result.accuracy,
      attemptedCount: result.attemptedCount,
      totalQuestions: result.totalQuestions,
      isAboveCutoff: result.isAboveCutoff
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
        '<div class="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between text-xs">' +
          '<div class="flex flex-col">' +
            '<span class="font-bold text-white truncate max-w-[140px]">' + escapeHtml(h.title) + '</span>' +
            '<span class="text-[10px] text-slate-400 font-mono">' + dateStr + ' · ' + h.accuracy + '% acc</span>' +
          '</div>' +
          '<div class="flex flex-col items-end">' +
            '<span class="font-black font-mono ' + (h.isAboveCutoff ? 'text-emerald-400' : 'text-amber-400') + '">' + (h.netScore > 0 ? '+' : '') + h.netScore + '</span>' +
            '<span class="text-[9px] font-mono text-slate-500">/ ' + h.maxMarks + '</span>' +
          '</div>' +
        '</div>'
      );
    }).join('');
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
        } else {
          expBox.classList.add('hidden');
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
    // toast removed to prevent blocking next button
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
      const mistakeList = STATE.pyqs.filter(function (q) { return STATE.mistakes.has(q.id); });
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

    // Sidebar Search & Matrix Nav Link
    document.getElementById('sideNavSearchMatrix')?.addEventListener('click', function () {
      switchViewMode('dashboard');
      toggleSidebar(false);
      setTimeout(function () {
        const sec = document.getElementById('topicSearchMatrixSection');
        if (sec) sec.scrollIntoView({ behavior: 'smooth' });
        if (topicInput) topicInput.focus();
      }, 100);
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
      window.closeEVSimulator();
      window.startPracticeSession('all');
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
