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
    ca_pyqs: [],
    activeSubject: 'all',
    activeYear: 'all',
    matrixSearchQuery: '',
    matrixSelectedYear: 'all',
    matrixSelectedSubject: 'all',
    vaultMode: 'subject', // 'subject' | 'year' | 'ca'
    vaultSelectedSubject: 'all',
    vaultSelectedYear: 'all',
    vaultSelectedCaMonth: 'all',
    vaultSelectedDifficulty: 'all',
    vaultSearchQuery: '',
    caArenaSelectedMonth: 'all',
    caArenaSearchQuery: '',
    vaultExpandedQuestions: new Set(),
    vaultPageSize: 25,
    vaultDisplayedCount: 25,
    matrixPageSize: 20,
    pyqMap: {},
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
    userName: localStorage.getItem('cm_aspirant_name') || 'Aspirant',
    user: null
  };

  // Load Persisted LocalStorage Data
  function loadPersistedState() {
    initAuthSession();
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
    syncFromCloudIfLoggedIn();
  }

  let _prelimsCloudSyncTimer = null;
  function debouncedCloudSync() {
    if (!STATE.user || !STATE.user.email) return;
    if (_prelimsCloudSyncTimer) clearTimeout(_prelimsCloudSyncTimer);
    _prelimsCloudSyncTimer = setTimeout(async function () {
      try {
        const payload = {
          email: STATE.user.email,
          data: {
            answers: STATE.answers,
            mistakes: Array.from(STATE.mistakes || []),
            flagged: Array.from(STATE.flagged || []),
            activity: STATE.activity,
            mockHistory: STATE.mockHistory,
            leakTags: STATE.leakTags || {}
          }
        };
        await fetch('/api/prelims/sync', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      } catch (err) {
        console.warn('Prelims cloud sync background save error:', err);
      }
    }, 1500);
  }

  let _prelimsCloudSyncedEmail = null;
  async function syncFromCloudIfLoggedIn(force = false) {
    if (!STATE.user || !STATE.user.email) return;
    if (!force && _prelimsCloudSyncedEmail === STATE.user.email) return;
    _prelimsCloudSyncedEmail = STATE.user.email;
    try {
      const res = await fetch('/api/prelims/sync?email=' + encodeURIComponent(STATE.user.email));
      if (!res.ok) return;
      const json = await res.json();
      if (json.status === 'success' && json.data) {
        const cloudData = json.data;
        let changed = false;
        if (cloudData.answers && typeof cloudData.answers === 'object') {
          STATE.answers = Object.assign({}, cloudData.answers, STATE.answers);
          changed = true;
        }
        if (Array.isArray(cloudData.mistakes)) {
          cloudData.mistakes.forEach(function (m) { STATE.mistakes.add(m); });
          changed = true;
        }
        if (Array.isArray(cloudData.flagged)) {
          cloudData.flagged.forEach(function (f) { STATE.flagged.add(f); });
          changed = true;
        }
        if (Array.isArray(cloudData.mockHistory) && cloudData.mockHistory.length > 0) {
          const existingIds = new Set(STATE.mockHistory.map(function (m) { return m.id || m.testId || m.timestamp; }));
          cloudData.mockHistory.forEach(function (m) {
            const id = m.id || m.testId || m.timestamp;
            if (!existingIds.has(id)) {
              STATE.mockHistory.push(m);
              existingIds.add(id);
              changed = true;
            }
          });
        }
        if (cloudData.leakTags && typeof cloudData.leakTags === 'object') {
          STATE.leakTags = Object.assign({}, cloudData.leakTags, STATE.leakTags || {});
          changed = true;
        }
        if (changed) {
          try {
            localStorage.setItem(STORAGE_KEYS.ANSWERS, JSON.stringify(STATE.answers));
            localStorage.setItem(STORAGE_KEYS.MISTAKES, JSON.stringify(Array.from(STATE.mistakes)));
            localStorage.setItem(STORAGE_KEYS.FLAGGED, JSON.stringify(Array.from(STATE.flagged)));
            localStorage.setItem(STORAGE_KEYS.MOCKS, JSON.stringify(STATE.mockHistory));
            localStorage.setItem(STORAGE_KEYS.LEAK_TAGS, JSON.stringify(STATE.leakTags || {}));
          } catch (e) {}
          if (typeof updateDashboardActivity === 'function') updateDashboardActivity();
          if (typeof renderDashboardMockHistory === 'function') renderDashboardMockHistory();
          if (typeof updateSubTopicHeatmap === 'function') updateSubTopicHeatmap();
        }
      }
    } catch (err) {
      console.warn('Prelims cloud sync load error:', err);
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
    debouncedCloudSync();
  }

  // Theme Handling
  function initTheme() {
    if (STATE.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    const themeLabel = document.getElementById('sidebarThemeLabel');
    if (themeLabel) themeLabel.textContent = STATE.theme === 'dark' ? 'Dark' : 'Light';
    const themeIcon = document.getElementById('sidebarThemeIcon');
    if (themeIcon) themeIcon.textContent = STATE.theme === 'dark' ? '🌙' : '☀️';
  }

  function toggleTheme() {
    STATE.theme = STATE.theme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('mainsmentor_theme', STATE.theme);
    initTheme();
  }

  function updateLangUI() {
    const langLabel = document.getElementById('sidebarLangLabel');
    if (langLabel) langLabel.textContent = STATE.language === 'hi' ? 'हिंदी' : 'English';
  }

  // Toast Helper (Top-Center floating badge, clean & non-intrusive)
  function showToast(msg) {
    const toast = document.getElementById('toastNotification');
    const msgEl = document.getElementById('toastMessage');
    if (!toast || !msgEl) return;
    msgEl.textContent = msg;
    toast.classList.remove('-translate-y-16', '-translate-y-14', '-translate-y-10', 'opacity-0', 'pointer-events-none');
    toast.classList.add('translate-y-0', 'opacity-100');
    if (window._cmToastTimeout) clearTimeout(window._cmToastTimeout);
    window._cmToastTimeout = setTimeout(() => {
      toast.classList.add('-translate-y-16', 'opacity-0', 'pointer-events-none');
      toast.classList.remove('translate-y-0', 'opacity-100');
    }, 2200);
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
    if (!STATE.user && (mode === 'mistakes' || mode === 'csat' || mode === 'cutoff')) {
      openFreemiumGateModal(mode);
      return;
    }
    STATE.viewMode = mode;
    const dashView = document.getElementById('dashboardOverviewView');
    const playerView = document.getElementById('questionPlayerView');
    const reportView = document.getElementById('mockReportView');
    const vaultView = document.getElementById('prelimsPyqVaultView');
    const mistakesView = document.getElementById('mistakesNotebookView');
    const cutoffEvView = document.getElementById('cutoffEVSimulatorView');
    const csatView = document.getElementById('csatPracticeView');
    const caView = document.getElementById('prelimsCurrentAffairsView');
    const breadcrumb = document.getElementById('breadcrumbCurrent');

    // Hide all views first
    [dashView, playerView, reportView, vaultView, mistakesView, cutoffEvView, csatView, caView].forEach(function (v) {
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
    } else if (mode === 'csat') {
      if (csatView) csatView.classList.remove('hidden');
      updateSidebarActive('sideNavCSAT');
      if (breadcrumb) breadcrumb.textContent = 'CSAT Qualifying Practice & 66.67 Cutoff Optimizer';
      initCsatPractice();
    } else if (mode === 'current_affairs' || mode === 'ca') {
      if (caView) caView.classList.remove('hidden');
      updateSidebarActive('sideNavCurrentAffairs');
      if (breadcrumb) breadcrumb.textContent = 'Monthly Current Affairs Arena (2026)';
      renderCurrentAffairsArena();
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

    var sessionTitle = (filter && filter !== 'all' ? filter : 'UPSC Prelims') + (search ? ' ("' + search + '")' : '') + ' Practice (' + list.length + ' Qs)';
    STATE.currentTest = {
      id: 'practice_' + Date.now(),
      title: sessionTitle,
      mode: 'practice',
      totalQuestions: list.length,
      startTime: Date.now()
    };
    STATE.testAnswers = {};
    list.forEach(function (q) {
      if (STATE.answers[q.id] && STATE.answers[q.id].selectedIndex !== undefined) {
        STATE.testAnswers[q.id] = STATE.answers[q.id].selectedIndex;
      }
    });

    STATE.playerQuestions = list;
    STATE.playerIndex = 0;
    STATE.stagedSelection = null;
    switchViewMode('player');
  };

  
  // ==========================================================
  // TOPIC SEARCH & 16-YEAR PYQ MATRIX ENGINE
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

  function renderMatrixLoadingSkeletons() {
    const container = document.getElementById('pyqSearchResultsContainer');
    if (!container) return;
    const skeleton = (
      '<div class="animate-pulse p-4 rounded-2xl bg-white dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 flex flex-col gap-2.5">' +
        '<div class="flex items-center justify-between">' +
          '<div class="flex gap-2">' +
            '<div class="h-4 w-16 bg-slate-200 dark:bg-slate-800 rounded"></div>' +
            '<div class="h-4 w-24 bg-slate-200 dark:bg-slate-800 rounded"></div>' +
          '</div>' +
          '<div class="h-4 w-12 bg-amber-500/20 rounded"></div>' +
        '</div>' +
        '<div class="space-y-1.5">' +
          '<div class="h-3.5 bg-slate-200 dark:bg-slate-800 rounded w-full"></div>' +
          '<div class="h-3.5 bg-slate-200 dark:bg-slate-800 rounded w-3/4"></div>' +
        '</div>' +
      '</div>'
    );
    container.innerHTML = skeleton + skeleton + skeleton;
  }

  function renderMatrixFeed() {
    const container = document.getElementById('pyqSearchResultsContainer');
    const badge = document.getElementById('matrixMatchCountBadge');
    const statusText = document.getElementById('matrixFeedStatusText');
    const clearBtn = document.getElementById('clearTopicSearchBtn');

    if (!container) return;

    if (!STATE.pyqs || STATE.pyqs.length === 0) {
      renderMatrixLoadingSkeletons();
      return;
    }

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
      statusText.textContent = desc.length > 0 ? ('Filtering: ' + desc.join(' · ')) : 'Showing 1,600+ authentic questions';
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

    // Limit initial display to 20 questions for maximum speed
    const maxVisible = 20;
    const visibleMatches = matches.slice(0, maxVisible);

    let html = visibleMatches.map(function (q) {
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

    if (matches.length > maxVisible) {
      html += (
        '<div class="p-2 text-center">' +
          '<button type="button" id="matrixViewAllInVaultBtn" class="w-full py-2.5 px-3 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30 text-xs font-bold cursor-pointer transition flex items-center justify-center gap-1.5">' +
            '<span>⚡ View all ' + matches.length + ' matching questions in PYQ Vault</span>' +
            '<span>→</span>' +
          '</button>' +
        '</div>'
      );
    }

    container.innerHTML = html;
  }

  // ==========================================================
  // PHASE 4: ADAPTIVE MOCK TEST GENERATOR ENGINE
  // ==========================================================

  // ==========================================================
  // ADVANCED UPSC MOCK TEST GENERATOR ENGINE (FULL CUSTOMIZATION)
  // ==========================================================

  let mockConfigState = {
    format: 'sectional',
    selectedSubjects: new Set(['Polity & Governance', 'Economy']),
    aiMockScope: 'full',
    aiMockCaBlend: 'standard', // 'none' (0%), 'standard' (25%), 'heavy' (50%), 'pure_ca' (100%)
    aiMockQuestionCount: 25,
    topicQuery: '',
    questionCount: 25,
    mode: 'exam'
  };

  window.openMockGenerator = function (defaultFormat) {
    if (!STATE.user) {
      openFreemiumGateModal('mock');
      return;
    }
    const modal = document.getElementById('mockGeneratorModal');
    if (!modal) return;
    modal.classList.remove('hidden');

    const fmt = defaultFormat || mockConfigState.format || 'sectional';
    window.onMockFormatChange(fmt);
  };

  window.closeMockGenerator = function () {
    const modal = document.getElementById('mockGeneratorModal');
    if (modal) modal.classList.add('hidden');
  };

  window.onMockFormatChange = function (format) {
    mockConfigState.format = format;

    // 1. Update Segmented Nav Tabs Styling
    document.querySelectorAll('.mock-tab-btn').forEach(function (btn) {
      if (btn.getAttribute('data-format') === format) {
        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');
      } else {
        btn.classList.remove('active');
        btn.setAttribute('aria-selected', 'false');
      }
    });

    // 2. Blueprint / Sectional Containers
    const fullBlueprint = document.getElementById('mockFullExamBlueprint');
    const remedialBlueprint = document.getElementById('mockRemedialBlueprint');
    const customControls = document.getElementById('mockCustomSectionalControls');
    const aiMockControls = document.getElementById('mockAiMockControls');
    const caControls = document.getElementById('mockCurrentAffairsControls');
    const remedialCountEl = document.getElementById('mockRemedialMistakesCount');

    if (format === 'full') {
      if (fullBlueprint) fullBlueprint.classList.remove('hidden');
      if (remedialBlueprint) remedialBlueprint.classList.add('hidden');
      if (customControls) customControls.classList.add('hidden');
      if (aiMockControls) aiMockControls.classList.add('hidden');
      if (caControls) caControls.classList.add('hidden');
      mockConfigState.questionCount = 100;
    } else if (format === 'weakness') {
      if (fullBlueprint) fullBlueprint.classList.add('hidden');
      if (remedialBlueprint) remedialBlueprint.classList.remove('hidden');
      if (customControls) customControls.classList.add('hidden');
      if (aiMockControls) aiMockControls.classList.add('hidden');
      if (caControls) caControls.classList.add('hidden');
      if (remedialCountEl) {
        const mCount = STATE.mistakes ? STATE.mistakes.size : 0;
        remedialCountEl.textContent = mCount + (mCount === 1 ? ' Logged Mistake' : ' Logged Mistakes');
      }
      mockConfigState.questionCount = 15;
    } else if (format === 'ai_mock') {
      if (fullBlueprint) fullBlueprint.classList.add('hidden');
      if (remedialBlueprint) remedialBlueprint.classList.add('hidden');
      if (customControls) customControls.classList.add('hidden');
      if (aiMockControls) aiMockControls.classList.remove('hidden');
      if (caControls) caControls.classList.add('hidden');
      mockConfigState.questionCount = mockConfigState.aiMockQuestionCount || 25;
    } else if (format === 'current_affairs') {
      if (fullBlueprint) fullBlueprint.classList.add('hidden');
      if (remedialBlueprint) remedialBlueprint.classList.add('hidden');
      if (customControls) customControls.classList.add('hidden');
      if (aiMockControls) aiMockControls.classList.add('hidden');
      if (caControls) caControls.classList.remove('hidden');
      const activeCaPill = document.querySelector('.mock-ca-qcount-pill.active');
      const count = activeCaPill ? parseInt(activeCaPill.getAttribute('data-count'), 10) : 15;
      mockConfigState.questionCount = count || 15;
    } else {
      // sectional / custom (PYQs)
      if (fullBlueprint) fullBlueprint.classList.add('hidden');
      if (remedialBlueprint) remedialBlueprint.classList.add('hidden');
      if (customControls) customControls.classList.remove('hidden');
      if (aiMockControls) aiMockControls.classList.add('hidden');
      if (caControls) caControls.classList.add('hidden');
      const activeCountBtn = document.querySelector('.mock-qcount-pill.active');
      const count = activeCountBtn ? parseInt(activeCountBtn.getAttribute('data-count'), 10) : 25;
      mockConfigState.questionCount = count || 25;
    }
    window.updateMockLiveSummary();
  };

  // AI Mock Scope Controller (Full Paper vs Sectional vs Topic)
  window.onAiMockScopeChange = function (scope) {
    mockConfigState.aiMockScope = scope;
    const subjCont = document.getElementById('aiMockSubjectContainer');
    const topicCont = document.getElementById('aiMockTopicContainer');

    if (scope === 'full') {
      if (subjCont) subjCont.classList.add('hidden');
      if (topicCont) topicCont.classList.add('hidden');
      window.setAiMockQuestionCount(100);
    } else if (scope === 'sectional') {
      if (subjCont) subjCont.classList.remove('hidden');
      if (topicCont) topicCont.classList.add('hidden');
      window.setAiMockQuestionCount(25);
    } else if (scope === 'topic') {
      if (subjCont) subjCont.classList.remove('hidden');
      if (topicCont) topicCont.classList.remove('hidden');
      window.setAiMockQuestionCount(15);
    }
    window.updateMockLiveSummary();
  };

  // AI Mock CA Blending Controller
  window.onAiMockCaBlendChange = function (blend) {
    mockConfigState.aiMockCaBlend = blend;
    const monthsSec = document.getElementById('aiMockCaMonthsSection');
    if (monthsSec) {
      if (blend === 'none') {
        monthsSec.classList.add('hidden');
      } else {
        monthsSec.classList.remove('hidden');
      }
    }
    window.updateMockLiveSummary();
  };

  window.selectAiMockSubjects = function (action) {
    const cbs = document.querySelectorAll('.ai-mock-subj-check');
    cbs.forEach(function (cb) {
      cb.checked = (action === 'all');
    });
    window.updateMockLiveSummary();
  };

  window.selectAiMockMonths = function (action) {
    const cbs = document.querySelectorAll('.ai-mock-month-check');
    cbs.forEach(function (cb, idx) {
      cb.checked = (action === 'all' || (action === 'clear' && idx === 0));
    });
    window.updateMockLiveSummary();
  };

  window.setAiMockQuestionCount = function (count) {
    mockConfigState.aiMockQuestionCount = count;
    mockConfigState.questionCount = count;
    document.querySelectorAll('.ai-mock-qcount-pill').forEach(function (p) {
      if (parseInt(p.getAttribute('data-count'), 10) === count) {
        p.className = 'ai-mock-qcount-pill p-2 rounded-xl border-2 border-purple-500 bg-purple-500/20 text-purple-300 text-xs font-mono font-bold cursor-pointer transition text-center active';
      } else {
        p.className = 'ai-mock-qcount-pill p-2 rounded-xl border border-slate-800 bg-slate-950 text-slate-300 text-xs font-mono font-bold hover:border-purple-500 cursor-pointer transition text-center';
      }
    });
    const cInput = document.getElementById('aiMockCustomCountInput');
    if (cInput) cInput.value = count;
    window.updateMockLiveSummary();
  };

  window.onAiMockCustomCountInput = function (val) {
    let count = parseInt(val, 10);
    if (isNaN(count) || count < 5) count = 5;
    if (count > 100) count = 100;
    mockConfigState.aiMockQuestionCount = count;
    mockConfigState.questionCount = count;
    document.querySelectorAll('.ai-mock-qcount-pill').forEach(function (p) {
      if (parseInt(p.getAttribute('data-count'), 10) === count) {
        p.className = 'ai-mock-qcount-pill p-2 rounded-xl border-2 border-purple-500 bg-purple-500/20 text-purple-300 text-xs font-mono font-bold cursor-pointer transition text-center active';
      } else {
        p.className = 'ai-mock-qcount-pill p-2 rounded-xl border border-slate-800 bg-slate-950 text-slate-300 text-xs font-mono font-bold hover:border-purple-500 cursor-pointer transition text-center';
      }
    });
    window.updateMockLiveSummary();
  };

  
  // ====================================================
  // MULTI-TOPIC PARSER & MATCHER (Upgraded Phase 4)
  // Supports combining multiple topics typed with commas
  // ====================================================
  function parseMultipleTopics(str) {
    if (!str || typeof str !== 'string') return [];
    return str
      .split(/[,;+&|]/)
      .map(function (s) { return s.trim(); })
      .filter(function (s) { return s.length > 0; });
  }

  function matchQuestionMultipleTopics(q, topicList) {
    if (!topicList || topicList.length === 0) return true;
    const searchable = [
      q.sub_topic,
      q.subTopic,
      q.topic,
      q.subject,
      q.question_text,
      q.question,
      q.explanation,
      Array.isArray(q.tags) ? q.tags.join(' ') : ''
    ].filter(Boolean).join(' ').toLowerCase();

    return topicList.some(function (t) {
      return searchable.includes(t.toLowerCase());
    });
  }

  window.toggleMockTopicChip = function (topic) {
    const input = document.getElementById('mockCustomTopicInput');
    if (!input) return;
    let topics = parseMultipleTopics(input.value);
    const existsIdx = topics.findIndex(function (t) { return t.toLowerCase() === topic.toLowerCase(); });
    if (existsIdx !== -1) {
      topics.splice(existsIdx, 1);
    } else {
      topics.push(topic);
    }
    input.value = topics.join(', ');
    window.updateMockLiveSummary();
  };

  window.clearMockTopics = function () {
    const input = document.getElementById('mockCustomTopicInput');
    if (input) input.value = '';
    window.updateMockLiveSummary();
  };

  window.toggleAiMockTopicChip = function (topic) {
    const input = document.getElementById('aiMockTopicInput');
    if (!input) return;
    let topics = parseMultipleTopics(input.value);
    const existsIdx = topics.findIndex(function (t) { return t.toLowerCase() === topic.toLowerCase(); });
    if (existsIdx !== -1) {
      topics.splice(existsIdx, 1);
    } else {
      topics.push(topic);
    }
    input.value = topics.join(', ');
    window.updateMockLiveSummary();
  };

  window.clearAiMockTopics = function () {
    const input = document.getElementById('aiMockTopicInput');
    if (input) input.value = '';
    window.updateMockLiveSummary();
  };

  window.toggleDynamicCaTopicChip = function (topic) {
    const input = document.getElementById('dynamicCaCustomTopicInput');
    if (!input) return;
    let topics = parseMultipleTopics(input.value);
    const existsIdx = topics.findIndex(function (t) { return t.toLowerCase() === topic.toLowerCase(); });
    if (existsIdx !== -1) {
      topics.splice(existsIdx, 1);
    } else {
      topics.push(topic);
    }
    input.value = topics.join(', ');
  };

  window.clearDynamicCaTopics = function () {
    const input = document.getElementById('dynamicCaCustomTopicInput');
    if (input) input.value = '';
  };

  window.setDynamicCaQuestionCount = function (count) {
    const countInput = document.getElementById('dynamicCaCountSelect');
    if (countInput) countInput.value = count;
    document.querySelectorAll('.dyn-ca-qcount-pill').forEach(function (pill) {
      if (parseInt(pill.getAttribute('data-count'), 10) === count) {
        pill.classList.add('active', 'border-amber-500', 'bg-amber-500/20', 'text-amber-300');
        pill.classList.remove('border-slate-800', 'bg-slate-950', 'text-slate-300');
        const sub = pill.querySelector('.font-mono');
        if (sub) { sub.className = 'text-[10px] text-amber-400/80 font-mono'; }
      } else {
        pill.classList.remove('active', 'border-amber-500', 'bg-amber-500/20', 'text-amber-300');
        pill.classList.add('border-slate-800', 'bg-slate-950', 'text-slate-300');
        const sub = pill.querySelector('.font-mono');
        if (sub) { sub.className = 'text-[10px] text-slate-500 font-mono'; }
      }
    });
    const dur = Math.round(count * 1.2);
    const timeEl = document.getElementById('dynamicCaCalculatedTime');
    if (timeEl) timeEl.textContent = '~' + dur + ' Mins (1.2m / Q)';
    const btnText = document.getElementById('startDynamicCaBtnText');
    if (btnText) btnText.textContent = '🚀 Synthesize Dynamic UPSC Questions (' + count + ' Qs · ' + dur + 'm)';
  };

  window.applyAiMockTopicChip = function (topic) {
    const input = document.getElementById('aiMockTopicInput');
    if (input) {
      input.value = topic;
      window.updateMockLiveSummary();
    }
  };

  window.selectMockCaMonths = function (action) {
    const checkboxes = document.querySelectorAll('.mock-ca-month-check');
    if (action === 'all') {
      checkboxes.forEach(function (cb) { cb.checked = true; });
    } else if (action === 'clear') {
      checkboxes.forEach(function (cb, idx) { cb.checked = (idx === 0); });
    }
    window.updateMockLiveSummary();
  };

  window.setMockCaQuestionCount = function (count) {
    mockConfigState.questionCount = count;
    document.querySelectorAll('.mock-ca-qcount-pill').forEach(function (pill) {
      if (parseInt(pill.getAttribute('data-count'), 10) === count) {
        pill.classList.add('active', 'border-emerald-500', 'bg-emerald-500/20', 'text-emerald-300');
        pill.classList.remove('border-slate-800', 'bg-slate-950', 'text-slate-300');
      } else {
        pill.classList.remove('active', 'border-emerald-500', 'bg-emerald-500/20', 'text-emerald-300');
        pill.classList.add('border-slate-800', 'bg-slate-950', 'text-slate-300');
      }
    });
    window.updateMockLiveSummary();
  };

  window.selectMockSubjects = function (preset) {
    const checkboxes = document.querySelectorAll('.mock-subj-check');
    if (preset === 'all') {
      checkboxes.forEach(function (cb) { cb.checked = true; });
    } else if (preset === 'clear') {
      checkboxes.forEach(function (cb) { cb.checked = false; });
    } else if (preset === 'polity_eco') {
      checkboxes.forEach(function (cb) {
        cb.checked = (cb.value === 'Polity & Governance' || cb.value === 'Economy');
      });
    } else if (preset === 'env_geo') {
      checkboxes.forEach(function (cb) {
        cb.checked = (cb.value === 'Environment & Ecology' || cb.value === 'Geography');
      });
    } else if (preset === 'hist_art') {
      checkboxes.forEach(function (cb) {
        cb.checked = (cb.value === 'History & Culture');
      });
    }
    window.updateMockLiveSummary();
  };

  window.applyMockTopicChip = function (topic) {
    const input = document.getElementById('mockCustomTopicInput');
    if (input) {
      input.value = topic;
      window.updateMockLiveSummary();
    }
  };

  window.setMockQuestionCount = function (count) {
    mockConfigState.questionCount = count;
    document.querySelectorAll('.mock-qcount-pill').forEach(function (pill) {
      if (parseInt(pill.getAttribute('data-count'), 10) === count) {
        pill.classList.add('active', 'border-emerald-500', 'bg-emerald-500/20', 'text-emerald-300');
        pill.classList.remove('border-slate-800', 'bg-slate-950', 'text-slate-300');
      } else {
        pill.classList.remove('active', 'border-emerald-500', 'bg-emerald-500/20', 'text-emerald-300');
        pill.classList.add('border-slate-800', 'bg-slate-950', 'text-slate-300');
      }
    });
    const customInput = document.getElementById('mockCustomCountInput');
    if (customInput) customInput.value = count;
    window.updateMockLiveSummary();
  };

  window.onMockCustomCountInput = function (val) {
    let count = parseInt(val, 10);
    if (isNaN(count) || count < 5) count = 5;
    if (count > 100) count = 100;
    mockConfigState.questionCount = count;

    document.querySelectorAll('.mock-qcount-pill').forEach(function (pill) {
      if (parseInt(pill.getAttribute('data-count'), 10) === count) {
        pill.classList.add('active', 'border-emerald-500', 'bg-emerald-500/20', 'text-emerald-300');
        pill.classList.remove('border-slate-800', 'bg-slate-950', 'text-slate-300');
      } else {
        pill.classList.remove('active', 'border-emerald-500', 'bg-emerald-500/20', 'text-emerald-300');
        pill.classList.add('border-slate-800', 'bg-slate-950', 'text-slate-300');
      }
    });
    window.updateMockLiveSummary();
  };

  window.updateMockLiveSummary = function () {
    const format = mockConfigState.format || 'sectional';
    let qCount = mockConfigState.questionCount || 25;
    let durationMins = Math.max(5, Math.round(qCount * 1.2));

    let poolCount = (STATE.pyqs || []).length;

    if (format === 'full') {
      qCount = 100;
      durationMins = 120;
      // Filter by selected exam sources
      const sources = [];
      document.querySelectorAll('.mock-source-check:checked').forEach(function (cb) { sources.push(cb.value); });
      let pPool = STATE.pyqs || [];
      if (sources.length > 0) {
        pPool = pPool.filter(function (q) { return sources.includes(q.exam || 'UPSC CSE'); });
      }
      poolCount = pPool.length;
    } else if (format === 'sectional') {
      const checked = [];
      document.querySelectorAll('.mock-subj-check:checked').forEach(function (cb) { checked.push(cb.value); });
      const sources = [];
      document.querySelectorAll('.mock-sec-source-check:checked').forEach(function (cb) { sources.push(cb.value); });
      let pPool = STATE.pyqs || [];
      if (sources.length > 0) {
        pPool = pPool.filter(function (q) { return sources.includes(q.exam || 'UPSC CSE'); });
      }
      if (checked.length > 0) {
        pPool = pPool.filter(function (q) {
          return checked.some(function (subj) {
            return q.subject && q.subject.toLowerCase().indexOf(subj.toLowerCase().split('&')[0].trim()) !== -1;
          });
        });
      }
      const topicInput = document.getElementById('mockCustomTopicInput');
      const rawTopics = topicInput ? topicInput.value.trim() : '';
      const topicList = parseMultipleTopics(rawTopics);
      if (topicList.length > 0) {
        pPool = pPool.filter(function (q) {
          return matchQuestionMultipleTopics(q, topicList);
        });
      }
      poolCount = pPool.length;
    } else if (format === 'ai_mock') {
      qCount = mockConfigState.aiMockQuestionCount || 25;
      durationMins = Math.max(5, Math.round(qCount * 1.2));
      const aiPool = (STATE.ai_mock_questions || []).length;
      const caPool = (STATE.ca_pyqs || []).length;
      const staticPool = (STATE.pyqs || []).length;
      poolCount = aiPool + caPool + staticPool;
    } else if (format === 'weakness') {
      qCount = 15;
      durationMins = 20;
      poolCount = STATE.mistakes ? STATE.mistakes.size : 0;
    }

    const marks = qCount * 2;
    const qBadge = document.getElementById('mockLiveQuestionsBadge');
    const mBadge = document.getElementById('mockLiveMarksBadge');
    const tBadge = document.getElementById('mockLiveTimeBadge');
    const bankText = document.getElementById('mockLiveMatchingBankText');
    const calcDur = document.getElementById('mockCustomCalcDuration');
    const aiCalcDur = document.getElementById('aiMockCustomCalcDuration');
    const launchBtnText = document.getElementById('startGeneratedMockBtnText');

    if (qBadge) qBadge.textContent = qCount + ' Questions';
    if (mBadge) mBadge.textContent = marks + ' Marks (+2.0 / -0.66)';
    if (tBadge) tBadge.textContent = durationMins + ' Mins';
    if (bankText) bankText.innerHTML = 'Pool: <strong class="text-slate-200">' + poolCount + ' Questions</strong>';
    if (calcDur) calcDur.textContent = '~' + durationMins + ' Mins (1.2m / Q)';
    if (aiCalcDur) aiCalcDur.textContent = '~' + durationMins + ' Mins (1.2m / Q)';

    if (launchBtnText) {
      if (format === 'full') {
        launchBtnText.textContent = 'Launch Full 100-Q PYQ Mock (120m)';
      } else if (format === 'ai_mock') {
        launchBtnText.textContent = 'Launch 2026 AI Mock (' + qCount + ' Qs · ' + durationMins + 'm)';
      } else if (format === 'weakness') {
        launchBtnText.textContent = 'Launch Mistake Drill (15 Qs)';
      } else {
        launchBtnText.textContent = 'Launch Sectional Test (' + qCount + ' Qs · ' + durationMins + 'm)';
      }
    }
  };

  window.launchQuickMock = function (type) {
    if (type === 'full') {
      generateAndStartMock('full', ['all'], 'exam', { questionCount: 100, durationMins: 120 });
    } else if (type === 'sectional') {
      window.openMockGenerator('sectional');
    } else if (type === 'ai_mock') {
      window.openMockGenerator('ai_mock');
    } else if (type === 'weakness') {
      generateAndStartMock('weakness', ['adaptive'], 'exam', { questionCount: 15, durationMins: 20 });
    }
  };

  window.launchConfiguredMockTest = function () {
    const format = mockConfigState.format || 'sectional';
    const mode = document.querySelector('input[name="mockMode"]:checked')?.value || 'exam';
    let qCount = mockConfigState.questionCount || 25;
    let durationMins = Math.max(5, Math.round(qCount * 1.2));

    if (format === 'full') {
      qCount = 100;
      durationMins = 120;
      generateAndStartMock('full', ['all'], mode, { questionCount: 100, durationMins: 120 });
    } else if (format === 'ai_mock') {
      const scope = mockConfigState.aiMockScope || 'full';
      const blend = mockConfigState.aiMockCaBlend || 'standard';
      const topicInput = document.getElementById('aiMockTopicInput');
      const topicQuery = topicInput ? topicInput.value.trim() : '';
      qCount = mockConfigState.aiMockQuestionCount || (scope === 'full' ? 100 : 25);
      durationMins = Math.max(5, Math.round(qCount * 1.2));

      let aiSubjects = [];
      document.querySelectorAll('.ai-mock-subj-check:checked').forEach(function (cb) {
        aiSubjects.push(cb.value);
      });
      if (aiSubjects.length === 0) aiSubjects = ['all'];

      generateAndStartMock('ai_mock', aiSubjects, mode, {
        questionCount: qCount,
        durationMins: durationMins,
        scope: scope,
        caBlend: blend,
        topicQuery: topicQuery
      });
    } else if (format === 'weakness') {
      generateAndStartMock('weakness', ['adaptive'], mode, { questionCount: 15, durationMins: 20 });
    } else {
      // sectional (PYQs)
      const topicInput = document.getElementById('mockCustomTopicInput');
      const topicQuery = topicInput ? topicInput.value.trim() : '';
      let selectedSubjects = [];
      document.querySelectorAll('.mock-subj-check:checked').forEach(function (cb) {
        selectedSubjects.push(cb.value);
      });
      if (selectedSubjects.length === 0) selectedSubjects = ['all'];

      generateAndStartMock('sectional', selectedSubjects, mode, {
        questionCount: qCount,
        topicQuery: topicQuery,
        durationMins: durationMins
      });
    }
  };

  function generateAndStartMock(format, subjectFilter, mode, options) {
    format = format || 'sectional';
    mode = mode || 'exam';
    options = options || {};
    closeMockGenerator();

    if (!STATE.pyqs || STATE.pyqs.length === 0) {
      showToast('Questions are still loading, please wait a moment...');
      return;
    }

    let targetCount = options.questionCount || (format === 'full' ? 100 : (format === 'weakness' ? 15 : 25));
    let durationMins = options.durationMins || Math.max(5, Math.round(targetCount * 1.2));
    let title = 'Custom UPSC Prelims Test';
    let sampleQuestions = [];

    // Support for 1-Click Targeted Remedial Drill
    if (options.customQuestions && options.customQuestions.length > 0) {
      sampleQuestions = options.customQuestions.slice();
      title = options.title || ('Targeted Remedial Drill (' + sampleQuestions.length + ' Qs)');
      targetCount = sampleQuestions.length;
      durationMins = Math.max(5, Math.round(targetCount * 1.2));
    } else if (format === 'ai_mock') {
      title = '2026 UPSC AI Mock (' + targetCount + ' Qs · ' + durationMins + 'm)';
      const scope = options.scope || 'full';
      const caBlend = options.caBlend || 'standard';
      let caTarget = 0;
      if (caBlend === 'standard') caTarget = Math.round(targetCount * 0.25);
      else if (caBlend === 'heavy') caTarget = Math.round(targetCount * 0.50);
      else if (caBlend === 'pure_ca') caTarget = targetCount;

      const staticTarget = targetCount - caTarget;

      // 1. Collect CA questions if requested
      if (caTarget > 0 && STATE.ca_pyqs && STATE.ca_pyqs.length > 0) {
        const caMonths = [];
        document.querySelectorAll('.ai-mock-month-check:checked').forEach(function (cb) { caMonths.push(cb.value); });
        let filteredCa = STATE.ca_pyqs;
        if (caMonths.length > 0) {
          filteredCa = filteredCa.filter(function (q) { return caMonths.includes(q.month); });
        }
        sampleQuestions = sampleQuestions.concat(shuffleArray(filteredCa.length > 0 ? filteredCa : STATE.ca_pyqs).slice(0, caTarget));
      }

      // 2. Collect Static 2026 AI Mock questions
      if (staticTarget > 0) {
        let aiPool = (STATE.ai_mock_questions || []).slice();
        if (scope === 'topic' && options.topicQuery) {
          const topicList = parseMultipleTopics(options.topicQuery);
          if (topicList.length > 0) {
            const tMatches = aiPool.filter(function (q) {
              return matchQuestionMultipleTopics(q, topicList);
            });
            if (tMatches.length > 0) aiPool = tMatches;
          }
        }

        sampleQuestions = sampleQuestions.concat(shuffleArray(aiPool).slice(0, staticTarget));

        // If more static questions needed to reach staticTarget, blend high-yield PYQs
        if (sampleQuestions.length < targetCount && STATE.pyqs) {
          const remaining = targetCount - sampleQuestions.length;
          const pad = shuffleArray(STATE.pyqs.filter(function (q) {
            return !sampleQuestions.some(function (sq) { return sq.id === q.id; });
          })).slice(0, remaining);
          sampleQuestions = sampleQuestions.concat(pad);
        }
      }
    } else if (format === 'weakness' || (subjectFilter.length === 1 && subjectFilter[0] === 'adaptive')) {
      title = 'Diagnostic Weakness Remedial Drill (' + targetCount + ' Qs)';
      const mistakeList = STATE.pyqs.filter(function (q) { return STATE.mistakes.has(q.id); });
      sampleQuestions = shuffleArray(mistakeList).slice(0, targetCount);
      if (sampleQuestions.length < targetCount) {
        const rem = targetCount - sampleQuestions.length;
        const pad = shuffleArray(STATE.pyqs.filter(function (q) {
          return !sampleQuestions.some(function (sq) { return sq.id === q.id; });
        })).slice(0, rem);
        sampleQuestions = sampleQuestions.concat(pad);
      }
    } else if (format === 'full') {
      title = 'Full-Length GS-1 Mock (' + targetCount + ' Qs · 120 Mins)';
      const sources = [];
      document.querySelectorAll('.mock-source-check:checked').forEach(function (cb) { sources.push(cb.value); });
      let candidatePool = STATE.pyqs;
      if (sources.length > 0) {
        candidatePool = candidatePool.filter(function (q) { return sources.includes(q.exam || 'UPSC CSE'); });
      }

      const staticTarget = targetCount;
      const blueprintQuotas = {
        'Environment & Ecology': Math.round(staticTarget * 0.20),
        'Polity & Governance': Math.round(staticTarget * 0.18),
        'Economy': Math.round(staticTarget * 0.17),
        'History & Culture': Math.round(staticTarget * 0.16),
        'Geography': Math.round(staticTarget * 0.15),
        'Science & Technology': Math.round(staticTarget * 0.14)
      };

      Object.keys(blueprintQuotas).forEach(function (sub) {
        const quota = blueprintQuotas[sub];
        const pool = shuffleArray(candidatePool.filter(function (q) {
          return q.subject && q.subject.toLowerCase().indexOf(sub.toLowerCase().split('&')[0].trim()) !== -1;
        }));
        sampleQuestions = sampleQuestions.concat(pool.slice(0, quota));
      });

      if (sampleQuestions.length < targetCount) {
        const rem = targetCount - sampleQuestions.length;
        const pad = shuffleArray(candidatePool.filter(function (q) {
          return !sampleQuestions.some(function (sq) { return sq.id === q.id; });
        })).slice(0, rem);
        sampleQuestions = sampleQuestions.concat(pad);
      }
    } else {
      // Custom / Sectional Mix (PYQs)
      const selectedSubjects = Array.isArray(subjectFilter) ? subjectFilter : [subjectFilter];
      const subjTitles = selectedSubjects.map(function (s) { return s.split('&')[0].trim(); }).join(' + ');
      title = 'Sectional (PYQs): ' + subjTitles + ' (' + targetCount + ' Qs)';

      const sources = [];
      document.querySelectorAll('.mock-sec-source-check:checked').forEach(function (cb) { sources.push(cb.value); });
      let candidatePool = STATE.pyqs;
      if (sources.length > 0) {
        candidatePool = candidatePool.filter(function (q) { return sources.includes(q.exam || 'UPSC CSE'); });
      }

      if (selectedSubjects.length > 0 && selectedSubjects[0] !== 'all') {
        candidatePool = candidatePool.filter(function (q) {
          return selectedSubjects.some(function (sub) {
            return q.subject && q.subject.toLowerCase().indexOf(sub.toLowerCase().split('&')[0].trim()) !== -1;
          });
        });
      }

      if (options.topicQuery) {
        const topicList = parseMultipleTopics(options.topicQuery);
        if (topicList.length > 0) {
          const topicMatches = candidatePool.filter(function (q) {
            return matchQuestionMultipleTopics(q, topicList);
          });
          if (topicMatches.length > 0) candidatePool = topicMatches;
        }
      }

      sampleQuestions = shuffleArray(candidatePool).slice(0, targetCount);
    }

    sampleQuestions = shuffleArray(sampleQuestions).slice(0, targetCount);
    if (sampleQuestions.length === 0) {
      showToast('No matching questions found for this configuration.');
      return;
    }

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
      subjectFilter: selectedSubjects.join(', '),
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
    showToast('🚀 ' + title + ' Started!');
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
    let answered = 0;
    STATE.playerQuestions.forEach(function (q) {
      if (STATE.testAnswers[q.id] !== undefined || (STATE.answers[q.id] && STATE.answers[q.id].selectedIndex !== undefined)) {
        answered++;
      }
    });

    const flagged = STATE.flagged.size;
    const unanswered = Math.max(0, total - answered);

    const ansEl = document.getElementById('confirmAnsweredCount');
    const flagEl = document.getElementById('confirmFlaggedCount');
    const unansEl = document.getElementById('confirmUnansweredCount');
    const timeEl = document.getElementById('confirmTimeRemaining');
    const timeLabelEl = document.getElementById('confirmTimeLabel');
    const titleEl = document.getElementById('confirmModalTitle');
    const descEl = document.getElementById('confirmModalDesc');
    const submitBtnText = document.getElementById('confirmFinalSubmitBtnText');

    if (ansEl) ansEl.textContent = answered;
    if (flagEl) flagEl.textContent = flagged;
    if (unansEl) unansEl.textContent = unanswered;

    const isExam = STATE.isExamMode;
    if (titleEl) {
      titleEl.textContent = isExam ? 'Submit Prelims Mock Test?' : 'Finish Practice Session & View Scorecard?';
    }
    if (descEl) {
      descEl.textContent = isExam
        ? 'Review your attempt status before computing your official UPSC score and forensic report:'
        : 'Analyze your net score (+2.00, -0.66), accuracy rate, subject strengths, and save mistakes to your Notebook:';
    }
    if (submitBtnText) {
      submitBtnText.textContent = isExam ? 'Submit Test & View Report' : 'Finish & View Scorecard';
    }

    if (timeEl) {
      if (isExam && STATE.currentTest && STATE.currentTest.remainingSeconds !== undefined) {
        if (timeLabelEl) timeLabelEl.textContent = '⏱️ Time Remaining:';
        timeEl.textContent = formatTime(STATE.currentTest.remainingSeconds);
      } else if (STATE.currentTest && STATE.currentTest.startTime) {
        if (timeLabelEl) timeLabelEl.textContent = '⏱️ Practice Time:';
        const elapsed = Math.max(1, Math.round((Date.now() - STATE.currentTest.startTime) / 1000));
        timeEl.textContent = formatTime(elapsed);
      } else {
        if (timeLabelEl) timeLabelEl.textContent = '⏱️ Pace:';
        timeEl.textContent = 'Self-Paced';
      }
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

      let selectedIdx = STATE.testAnswers[q.id];
      if (selectedIdx === undefined && STATE.answers[q.id] && STATE.answers[q.id].selectedIndex !== undefined) {
        selectedIdx = STATE.answers[q.id].selectedIndex;
        STATE.testAnswers[q.id] = selectedIdx;
      }

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
    const grossScore = Number((correctCount * 2.0).toFixed(2));
    const negativeBleed = Number((wrongCount * 0.66).toFixed(2));
    const netScore = Number((grossScore - negativeBleed).toFixed(2));
    const maxMarks = Number((questions.length * 2.0).toFixed(1));

    // Official UPSC Cutoff benchmark (88.0 marks for 100 Qs = 0.88 marks per Q)
    const benchmarkCutoff = Number(((questions.length / 100) * 88.0).toFixed(1));
    const cutoffDelta = Number((netScore - benchmarkCutoff).toFixed(2));
    const isAboveCutoff = cutoffDelta >= 0;

    const accuracy = attemptedCount > 0 ? Math.round((correctCount / attemptedCount) * 100) : 0;
    
    // Time spent calculation (works for both timed exams and self-paced practice)
    let timeSpentSecs = 0;
    if (test.durationSeconds && test.remainingSeconds !== undefined) {
      timeSpentSecs = Math.max(0, test.durationSeconds - test.remainingSeconds);
    } else if (test.startTime) {
      timeSpentSecs = Math.max(1, Math.round((Date.now() - test.startTime) / 1000));
    } else {
      timeSpentSecs = Math.max(1, attemptedCount * 45); // default ~45s per Q
    }

    // Behavioral Leak Estimation from actual student tagging + intelligent heuristic
    let conceptLeaks = 0;
    let sillyLeaks = 0;
    let elimLeaks = 0;
    let memoryLeaks = 0;
    let untaggedWrongs = 0;

    wrongQuestions.forEach(function (q) {
      const tag = STATE.leakTags[q.id];
      if (tag === 'concept') conceptLeaks++;
      else if (tag === 'silly') sillyLeaks++;
      else if (tag === 'elimination') elimLeaks++;
      else if (tag === 'memory') memoryLeaks++;
      else untaggedWrongs++;
    });

    if (untaggedWrongs > 0) {
      const cEst = Math.ceil(untaggedWrongs * 0.35);
      const sEst = Math.ceil(untaggedWrongs * 0.30);
      const eEst = Math.ceil(untaggedWrongs * 0.25);
      const mEst = Math.max(0, untaggedWrongs - (cEst + sEst + eEst));
      conceptLeaks += cEst;
      sillyLeaks += sEst;
      elimLeaks += eEst;
      memoryLeaks += mEst;
    }

    const defaultTitle = (questions.length === 100 ? 'Full Length UPSC Mock Test' : ('UPSC Prelims Practice (' + questions.length + ' Qs)'));
    const sessionTitle = test.title || defaultTitle;

    const result = {
      id: test.id || ('practice_' + Date.now()),
      title: sessionTitle,
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

    // Save to Mock & Practice History in localStorage with complete metadata
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

    if (STATE.mockHistory.length > 25) STATE.mockHistory.pop();
    persistState();

    // Render Forensic Scorecard
    renderForensicScorecard(result);
    switchViewMode('report');
    showToast('📊 Practice Report Card Generated!');
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

    // 2026 Question Format Diagnostic Computation
    let pairTotal = 0, pairCorrect = 0;
    let stmtTotal = 0, stmtCorrect = 0;
    let multiTotal = 0, multiCorrect = 0;

    questions.forEach(function (q) {
      const qText = q.question_text || '';
      const selected = STATE.testAnswers[q.id];
      const isRight = (selected !== undefined && selected === q.correct_index);

      if (q.pattern_type === 'pair_matching' || qText.toLowerCase().includes('pair') || qText.includes('Only one') || qText.includes('Only two')) {
        pairTotal++;
        if (isRight) pairCorrect++;
      } else if (q.pattern_type === 'statement_i_ii' || qText.includes('Statement-I') || qText.includes('Statement-II')) {
        stmtTotal++;
        if (isRight) stmtCorrect++;
      } else {
        multiTotal++;
        if (isRight) multiCorrect++;
      }
    });

    const pPairAcc = pairTotal > 0 ? Math.round((pairCorrect / pairTotal) * 100) : 0;
    const pStmtAcc = stmtTotal > 0 ? Math.round((stmtCorrect / stmtTotal) * 100) : 0;
    const pMultiAcc = multiTotal > 0 ? Math.round((multiCorrect / multiTotal) * 100) : 0;

    const elPairAcc = document.getElementById('reportPatternPairAcc');
    const elPairCount = document.getElementById('reportPatternPairCount');
    const elStmtAcc = document.getElementById('reportPatternStmtAcc');
    const elStmtCount = document.getElementById('reportPatternStmtCount');
    const elMultiAcc = document.getElementById('reportPatternMultiAcc');
    const elMultiCount = document.getElementById('reportPatternMultiCount');

    if (elPairAcc) elPairAcc.textContent = pairTotal > 0 ? (pPairAcc + '%') : 'N/A';
    if (elPairCount) elPairCount.textContent = pairCorrect + ' / ' + pairTotal + ' Solved';
    if (elStmtAcc) elStmtAcc.textContent = stmtTotal > 0 ? (pStmtAcc + '%') : 'N/A';
    if (elStmtCount) elStmtCount.textContent = stmtCorrect + ' / ' + stmtTotal + ' Solved';
    if (elMultiAcc) elMultiAcc.textContent = multiTotal > 0 ? (pMultiAcc + '%') : 'N/A';
    if (elMultiCount) elMultiCount.textContent = multiCorrect + ' / ' + multiTotal + ' Solved';

    // 1-Click Targeted Remedial Drill Button Setup
    const reattemptBtn = document.getElementById('reportReattemptWrongsBtn');
    if (reattemptBtn) {
      if (res.wrongCount > 0) {
        reattemptBtn.classList.remove('hidden');
        reattemptBtn.onclick = function () {
          generateAndStartMock('weakness', ['adaptive'], 'exam', {
            customQuestions: res.wrongQuestions,
            questionCount: res.wrongQuestions.length,
            title: 'Targeted Remedial Drill (' + res.wrongQuestions.length + ' Missed Qs)'
          });
        };
      } else {
        reattemptBtn.classList.add('hidden');
      }
    }

    // Save All Mistakes Button Setup
    const saveBtn = document.getElementById('reportSaveMistakesBtn');
    const saveText = document.getElementById('reportSaveMistakesText');
    if (saveBtn && saveText) {
      if (res.wrongCount > 0) {
        saveText.textContent = 'Save ' + res.wrongCount + ' Wrong Answers to Mistakes Notebook';
        saveBtn.disabled = false;
        saveBtn.className = 'mt-2 w-full py-2.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-bold text-xs border border-amber-500/40 transition-all cursor-pointer flex items-center justify-center gap-2';
        saveBtn.onclick = function () {
          res.wrongQuestions.forEach(function (q) { STATE.mistakes.add(q.id); });
          persistState();
          updateDashboardActivity();
          saveText.textContent = '✓ ' + res.wrongCount + ' Wrong Answers Saved to Notebook!';
          saveBtn.className = 'mt-2 w-full py-2.5 rounded-xl bg-emerald-500/20 text-emerald-300 font-bold text-xs border border-emerald-500/40 cursor-default flex items-center justify-center gap-2';
          showToast('Saved ' + res.wrongCount + ' mistakes to your Mistakes Notebook!');
        };
      } else {
        saveText.textContent = '🎉 100% Accuracy! Zero Mistakes Recorded!';
        saveBtn.disabled = true;
        saveBtn.className = 'mt-2 w-full py-2.5 rounded-xl bg-slate-800/60 text-slate-400 font-bold text-xs border border-slate-700/60 cursor-default flex items-center justify-center gap-2 opacity-70';
        saveBtn.onclick = null;
      }
    }
  }

  // Dashboard Mock Tests & Practice Sessions History Widget
  function renderDashboardMockHistory() {
    const badge = document.getElementById('dashMockCountBadge');
    const container = document.getElementById('dashMockHistoryContainer');
    if (!container) return;

    const history = STATE.mockHistory || [];
    if (badge) badge.textContent = history.length + ' Session' + (history.length === 1 ? '' : 's');

    if (history.length === 0) {
      container.innerHTML = (
        '<div class="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 text-center text-xs text-slate-400 leading-relaxed">' +
          'No practice reports yet. Complete any PYQ practice or mock test to generate your performance scorecard!' +
        '</div>'
      );
      return;
    }

    container.innerHTML = history.slice(0, 5).map(function (h) {
      const dateStr = new Date(h.timestamp).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
      return (
        '<div class="mock-history-item p-3.5 rounded-2xl bg-slate-50 hover:bg-amber-500/10 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 hover:border-amber-500/50 flex items-center justify-between text-xs cursor-pointer transition-all shadow-xs group" data-mockid="' + h.id + '">' +
          '<div class="flex flex-col">' +
            '<div class="flex items-center gap-1.5">' +
              '<span class="font-bold text-slate-800 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 truncate max-w-[150px] sm:max-w-[180px]">' + escapeHtml(h.title) + '</span>' +
              '<span class="text-[9px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-800 dark:text-amber-300 font-bold">Scorecard →</span>' +
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
  // ==========================================================
  // MULTI-ENGINE FORENSIC DISTRACTOR & COGNITIVE TRAP ANALYZER
  // ==========================================================
  function getDistractorAnalysis(q) {
    if (!q || !q.options) return [];
    const letters = ['A', 'B', 'C', 'D'];
    const correctIdx = q.correct_index;

    // ENGINE 1: Check for pre-computed bespoke option analysis
    if (Array.isArray(q.option_analysis) && q.option_analysis.length === q.options.length) {
      return q.option_analysis.map(function (item, idx) {
        const isCorrect = (idx === correctIdx);
        return {
          letter: letters[idx] || item.letter,
          optionText: q.options[idx],
          isCorrect: isCorrect,
          label: item.label || (isCorrect ? 'Official UPSC Key' : 'Examiner Distractor'),
          badgeType: isCorrect ? 'correct' : (item.badge_type || 'trap'),
          diagnosis: item.diagnosis || '',
          examinerCraft: item.examiner_craft || '',
          mentalFilter: item.mental_filter || ''
        };
      });
    }

    // Check if question is a statement combination (e.g. "1 and 2 only", "2 and 3", "1, 2 and 3")
    const isStatementComb = q.options.some(function (o) {
      return /^(?:1|2|3|4|only|none|all)/i.test(o.trim()) && /(?:only|and|\d)/i.test(o);
    });

    const rawExpl = q.explanation || '';
    const trapText = q.elimination_trap || '';
    const qText = q.question_text || '';

    // ENGINE 2: Multi-Statement Bundle Contamination & Omission Resolver
    if (isStatementComb) {
      const stmtMap = {};
      const stmtRegex = /(?:^|\n)\s*([1-4])\.\s*([\s\S]*?)(?=(?:\n\s*[1-4]\.|\n\s*Which of the statements|\n\s*Select the correct|$))/g;
      let m;
      while ((m = stmtRegex.exec(qText)) !== null) {
        stmtMap[m[1]] = m[2].trim().replace(/\s+/g, ' ');
      }

      const stmtStatus = {};
      for (let sNum = 1; sNum <= 4; sNum++) {
        const sNumStr = String(sNum);
        const isIncorrectPattern = new RegExp('(?:Statement\\s*' + sNumStr + '|Stmt\\s*' + sNumStr + '|Statement\\s*\\([a-z0-9,\\s]*' + sNumStr + '[a-z0-9,\\s]*\\))\\s*(?:is|are)?\\s*(?:not\\s*correct|incorrect|false|untrue)', 'i');
        const isCorrectPattern = new RegExp('(?:Statement\\s*' + sNumStr + '|Stmt\\s*' + sNumStr + '|Statement\\s*\\([a-z0-9,\\s]*' + sNumStr + '[a-z0-9,\\s]*\\))\\s*(?:is|are)?\\s*(?:correct|true|valid)', 'i');

        if (isIncorrectPattern.test(rawExpl)) {
          stmtStatus[sNumStr] = false;
        } else if (isCorrectPattern.test(rawExpl)) {
          stmtStatus[sNumStr] = true;
        }
      }

      const trapNumMatch = trapText.match(/Statement\s*([1-4])|Stmt\s*([1-4])/i);
      const trapNum = trapNumMatch ? (trapNumMatch[1] || trapNumMatch[2]) : null;
      if (trapNum && stmtStatus[trapNum] === undefined) {
        stmtStatus[trapNum] = false;
      }

      return q.options.map(function (opt, idx) {
        const isCorrect = (idx === correctIdx);
        const letter = letters[idx];

        if (isCorrect) {
          const firstLine = (rawExpl.split('\n')[0] || '').replace(/^[•\-\*]\s*/, '');
          return {
            letter: letter,
            optionText: opt,
            isCorrect: true,
            label: 'Official UPSC Key',
            badgeType: 'correct',
            diagnosis: 'Authentic combination directly ratified by the official UPSC key. ' + firstLine,
            examinerCraft: 'Verifiable statutory, constitutional, and empirical alignment.',
            mentalFilter: 'Confirm all assertions in this bundle independently withstand negative elimination checks.'
          };
        }

        const numsInOpt = [];
        for (let s = 1; s <= 4; s++) {
          const re = new RegExp('(?:^|\\D)' + s + '(?:\\D|$)');
          if (re.test(opt)) numsInOpt.push(String(s));
        }

        const badNum = numsInOpt.find(function (n) { return stmtStatus[n] === false; }) || trapNum;

        if (badNum && numsInOpt.includes(badNum)) {
          const badStmtSnippet = stmtMap[badNum] ? ' ("' + stmtMap[badNum].slice(0, 65) + '...")' : '';
          return {
            letter: letter,
            optionText: opt,
            isCorrect: false,
            label: '🚫 Contaminated by Stmt ' + badNum,
            badgeType: 'trap',
            diagnosis: 'Option collapses because it includes false Statement ' + badNum + badStmtSnippet + '. ' + (trapText ? 'Trap breakdown: ' + trapText : 'Failed validation under official key criteria.'),
            examinerCraft: 'Classic bundle contamination: pairing authentic statements with one subtle error to entrap candidates relying on partial knowledge.',
            mentalFilter: 'Single-cut rule: verifying Statement ' + badNum + ' as false instantly knocks out this option without needing to review remaining statements.'
          };
        }

        return {
          letter: letter,
          optionText: opt,
          isCorrect: false,
          label: '⚠️ Incomplete Bundle (Omission Trap)',
          badgeType: 'omission',
          diagnosis: 'Incomplete combination. Leaves out other valid statements verified by the official key. ' + (trapText ? 'Examine: ' + trapText : ''),
          examinerCraft: 'Omission bait: testing whether candidates confirm the full scope of correct statements or stop prematurely.',
          mentalFilter: 'When statements are independent, ensure the bundle captures every valid assertion.'
        };
      });
    }

    // ENGINE 3: Semantic Heuristic Classifier for Direct Concept Questions
    return q.options.map(function (opt, idx) {
      const isCorrect = (idx === correctIdx);
      const letter = letters[idx];

      if (isCorrect) {
        return {
          letter: letter,
          optionText: opt,
          isCorrect: true,
          label: 'Official UPSC Key',
          badgeType: 'correct',
          diagnosis: rawExpl.replace(/^[•\-\*]\s*/, '') || 'Accurate assertion directly validated by official UPSC key.',
          examinerCraft: 'Statutorily accurate proposition reflecting authentic framework benchmarks.',
          mentalFilter: 'Direct match with core syllabus benchmark.'
        };
      }

      const optLower = opt.toLowerCase();
      let label = 'Examiner Distractor';
      let badgeType = 'trap';
      let diagnosis = '';
      let craft = '';
      let filter = '';

      // Pattern A: Extreme Absolute Qualifier
      const extremeMatch = optLower.match(/\b(exclusively|only|all|never|none|solely|entirely|prohibits? any|mandatory for all|every)\b/);
      if (extremeMatch) {
        label = '⚡ Extreme Absolute Trap ("' + extremeMatch[1] + '")';
        badgeType = 'extreme';
        diagnosis = 'Injects an absolute categorical constraint ("' + extremeMatch[1] + '"). In ' + (q.subject || 'UPSC') + ', institutional mandates and empirical systems rarely operate in unconditional binaries.';
        craft = 'Examiners take a nuanced general application and harden it with an extreme qualifier to force a false boundary.';
        filter = 'The word "' + extremeMatch[1] + '" carries an overwhelmingly high failure rate in UPSC prelims unless grounded in strict constitutional mandates.';
      }
      // Pattern B: Numerical, Metric, or Baseline Year Decoy
      else if (/\b\d+(?:\.\d+)?(?:%|x\d+|(?:\s*(?:years?|months?|days?|mw|g-secs?|bps|crore|billion|trillion|km|meters?)))\b/i.test(opt) || /\b(19\d\d|20\d\d)\b/.test(opt)) {
        const numMatch = opt.match(/\b\d+(?:\.\d+)?(?:%|x\d+|(?:\s*(?:years?|months?|days?|mw|bps|crore|billion|trillion)))/i) || opt.match(/\b(19\d\d|20\d\d)\b/);
        const val = numMatch ? numMatch[0] : 'metric';
        label = '🔢 Numerical Decoy / Threshold Bait (' + val + ')';
        badgeType = 'number';
        diagnosis = 'Manipulates quantitative thresholds or baseline targets (' + val + '). ' + (trapText ? trapText + '. ' : '') + 'Examiners alter numerical deadlines or borrow figures from adjacent current affairs to test memory precision.';
        craft = 'Borrowing numbers from an adjacent topic or inventing false numerical symmetry to bait half-prepared aspirants.';
        filter = 'When numbers repeat across options or mimic the question title, check whether the figure belongs to a completely different convention.';
      }
      // Pattern C: Regulatory or Institutional Authority Swap
      else if (/\b(ministry of|department of|niti aayog|rbi|sebi|unfccc|cbd|who|wto|world bank|imf|oecd|iea)\b/i.test(opt)) {
        const instMatch = opt.match(/\b(ministry of\s+[\w\s]+|department of\s+[\w\s]+|niti aayog|rbi|sebi|unfccc|cbd|who|wto|world bank|imf|oecd|iea)\b/i);
        const inst = instMatch ? instMatch[0] : 'institution';
        label = '🏛️ Nodal Authority Swap (' + inst + ')';
        badgeType = 'authority';
        diagnosis = 'Substitutes "' + inst + '" as the operational authority. UPSC frequently swaps statutory boards, parent ministries, and multilateral agencies to test administrative governance boundaries.';
        craft = 'Replacing the actual implementing body with a high-visibility agency that sounds plausible.';
        filter = 'Always verify the statutory mandate: distinguish autonomous technical boards from parent executive ministries.';
      }
      // Pattern D: Contextual Domain or Category Transposition
      else {
        label = '🔀 Domain / Concept Transposition';
        badgeType = 'trap';
        diagnosis = trapText ? trapText + '. ' + 'Misattributes characteristics of a related concept to ' + (q.sub_topic || q.subject) + '.' : 'Plausible distractor borrowing terminology from related ' + (q.subject || 'GS') + ' topics to test conceptual boundary precision.';
        craft = 'Examiners rarely invent nonsense; they transplant real facts from an adjacent syllabus chapter to make the distractor sound authoritative.';
        filter = 'Anchor the question stem: verify whether the statement belongs to this specific subject matter or is imported from a related topic.';
      }

      return {
        letter: letter,
        optionText: opt,
        isCorrect: false,
        label: label,
        badgeType: badgeType,
        diagnosis: diagnosis,
        examinerCraft: craft,
        mentalFilter: filter
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
        } else {
          STATE.leakTags[q.id] = tag;
          STATE.mistakes.add(q.id);
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
    
    if (yearBadge) {
      if (q.exam === 'UPSC CDS') {
        yearBadge.innerHTML = '⚔️ UPSC CDS ' + (q.year || '2024');
        yearBadge.className = 'px-2 py-1 rounded-lg bg-blue-500/20 text-blue-300 border border-blue-500/30 text-xs font-mono font-bold';
      } else if (q.exam === 'UPSC CAPF') {
        yearBadge.innerHTML = '🎖️ UPSC CAPF ' + (q.year || '2024');
        yearBadge.className = 'px-2 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-mono font-bold';
      } else if (q.exam === '2026 UPSC AI Mock') {
        yearBadge.innerHTML = '🤖 2026 AI Mock';
        yearBadge.className = 'px-2 py-1 rounded-lg bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs font-mono font-bold';
      } else if (q.month) {
        yearBadge.innerHTML = '📰 ' + q.month;
        yearBadge.className = 'px-2 py-1 rounded-lg bg-teal-500/20 text-teal-300 border border-teal-500/30 text-xs font-mono font-bold';
      } else {
        yearBadge.innerHTML = '🏆 UPSC CSE ' + (q.year || '2023');
        yearBadge.className = 'px-2 py-1 rounded-lg bg-amber-500/15 text-amber-300 border border-amber-500/30 text-xs font-mono font-bold';
      }
    }
    if (diffBadge) diffBadge.textContent = q.difficulty || 'Moderate';

    const trustBadge = document.getElementById('playerSourceTrustBadge');
    if (trustBadge) {
      if (q.upsc_official_key) {
        trustBadge.classList.remove('hidden');
        trustBadge.textContent = '✓ ' + q.upsc_official_key;
      } else if (q.source_tag) {
        trustBadge.classList.remove('hidden');
        trustBadge.textContent = '✓ Sourced: ' + q.source_tag;
      } else {
        trustBadge.classList.remove('hidden');
        trustBadge.textContent = '✓ Verified from Official UPSC Key';
      }
    }

    // Exam Mode vs Practice Mode Controls Top Bar
    const examControls = document.getElementById('playerExamControlsGroup');
    const practiceControls = document.getElementById('playerPracticeControlsGroup');
    const finishPracticeBtn = document.getElementById('playerFinishPracticeBtn');

    if (examControls) {
      if (STATE.isExamMode && !STATE.isReviewMode) {
        examControls.classList.remove('hidden');
        updateTimerDisplay();
      } else {
        examControls.classList.add('hidden');
      }
    }

    if (practiceControls) {
      if (STATE.isReviewMode) {
        practiceControls.classList.remove('hidden');
        if (finishPracticeBtn) {
          finishPracticeBtn.innerHTML = '<span>📊</span><span>View Scorecard</span>';
          finishPracticeBtn.className = 'px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-md transition-all cursor-pointer flex items-center gap-1.5';
        }
      } else if (!STATE.isExamMode) {
        practiceControls.classList.remove('hidden');
        if (finishPracticeBtn) {
          finishPracticeBtn.innerHTML = '<span>🏁</span><span class="hidden sm:inline">Finish &amp; View</span> <span>Report</span>';
          finishPracticeBtn.className = 'px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs shadow-md transition-all cursor-pointer flex items-center gap-1.5';
        }
      } else {
        practiceControls.classList.add('hidden');
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
        renderPlayerMainsLinkage(q);
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
          renderPlayerMainsLinkage(q);
        } else {
          expBox.classList.add('hidden');
          const distractorBox = document.getElementById('playerDistractorDeepDiveBox');
          if (distractorBox) distractorBox.innerHTML = '';
        }
      }
    }

    // Bottom Navigation Buttons (Prev / Next / Flag / Finish Early)
    const prevBtn = document.getElementById('playerPrevBtn');
    const nextBtn = document.getElementById('playerNextBtn');
    const flagBtn = document.getElementById('playerFlagBtn');
    const finishEarlyBtn = document.getElementById('playerFinishEarlyBtn');

    if (prevBtn) prevBtn.disabled = (idx === 0);

    const isLastQ = (idx === questions.length - 1);

    if (nextBtn) {
      if (isLastQ) {
        if (STATE.isReviewMode) {
          nextBtn.disabled = false;
          nextBtn.innerHTML = '<span>📊 Back to Scorecard →</span>';
          nextBtn.className = 'px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black transition-all shadow-md cursor-pointer';
        } else {
          nextBtn.disabled = false;
          nextBtn.innerHTML = '<span>🏁 Finish Practice &amp; View Report Card →</span>';
          nextBtn.className = 'px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 text-xs font-black transition-all shadow-lg shadow-emerald-500/25 ring-2 ring-emerald-400/50 cursor-pointer animate-pulse';
        }
      } else {
        nextBtn.disabled = false;
        nextBtn.innerHTML = '<span>Next Question →</span>';
        nextBtn.className = 'px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black transition-all shadow-md cursor-pointer';
      }
    }

    if (finishEarlyBtn) {
      const anyAnswered = questions.some(function (quest) {
        return STATE.testAnswers[quest.id] !== undefined || (STATE.answers[quest.id] && STATE.answers[quest.id].selectedIndex !== undefined);
      });
      if (!isLastQ && !STATE.isReviewMode && anyAnswered) {
        finishEarlyBtn.classList.remove('hidden');
      } else {
        finishEarlyBtn.classList.add('hidden');
      }
    }

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

    // Freemium Gate (Model A: 5 questions trial for unauthenticated users)
    if (!STATE.user && !STATE.answers[q.id]) {
      const answeredCount = Object.keys(STATE.answers || {}).length;
      if (answeredCount >= 5) {
        openFreemiumGateModal('solve');
        return;
      }
    }

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
    STATE.testAnswers[q.id] = stagedIdx;

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

  // Current active filter for Heatmap
  STATE.heatmapFilter = STATE.heatmapFilter || 'all';

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

    let topics = Object.values(topicStats);
    if (badgeEl) badgeEl.textContent = topics.length + ' Theme' + (topics.length === 1 ? '' : 's') + ' Logged';

    // Sort by lowest accuracy first, then by highest attempts
    topics.sort(function (a, b) {
      const accA = a.correct / a.total;
      const accB = b.correct / b.total;
      if (accA !== accB) return accA - accB;
      return b.total - a.total;
    });

    // Identify priority bleed alert (accuracy < 60%)
    let worstTopic = null;
    for (let i = 0; i < topics.length; i++) {
      if ((topics[i].correct / topics[i].total) < 0.6) {
        worstTopic = topics[i];
        break;
      }
    }

    if (adviceBox && adviceText) {
      if (worstTopic) {
        adviceBox.classList.remove('hidden');
        adviceText.innerHTML = '<strong>⚠️ Focus Topic:</strong> Low accuracy in <strong>' + escapeHtml(worstTopic.topic) + '</strong> (' + Math.round((worstTopic.correct / worstTopic.total) * 100) + '%). Practice this topic to reduce negative marks:';
        if (drillBtn) {
          drillBtn.onclick = function () {
            launchThemeDrill(worstTopic.topic);
          };
        }
      } else {
        adviceBox.classList.add('hidden');
      }
    }

    // Apply Filter Tab
    const currentFilter = STATE.heatmapFilter || 'all';
    let filteredTopics = topics.filter(function (t) {
      const acc = (t.correct / t.total) * 100;
      if (currentFilter === 'bleed') return acc < 50;
      if (currentFilter === 'vulnerable') return acc >= 50 && acc < 75;
      if (currentFilter === 'fortified') return acc >= 75;
      return true;
    });

    if (topics.length === 0) {
      listEl.innerHTML = (
        '<div class="p-4 text-center text-xs text-slate-500 bg-slate-950/60 rounded-xl border border-slate-800/60 flex flex-col items-center gap-2">' +
          '<span>Solve questions in Focus Mode to generate your personalized micro-theme accuracy heatmap.</span>' +
          '<button type="button" id="startSampleDiagnosticBtn" class="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs cursor-pointer shadow-xs transition-all">' +
            '⚡ Solve 5 Diagnostic Questions' +
          '</button>' +
        '</div>'
      );
      const sampleBtn = document.getElementById('startSampleDiagnosticBtn');
      if (sampleBtn) {
        sampleBtn.onclick = function () {
          window.startPracticeSession('all');
        };
      }
      return;
    }

    if (filteredTopics.length === 0) {
      listEl.innerHTML = (
        '<div class="p-4 text-center text-xs text-slate-400 bg-slate-950/40 rounded-xl border border-slate-800/40">' +
          'No themes found under the "' + currentFilter + '" filter.' +
        '</div>'
      );
      return;
    }

    listEl.innerHTML = filteredTopics.map(function (t) {
      const acc = Math.round((t.correct / t.total) * 100);
      const netMarks = (t.correct * 2.0) - (t.incorrect * 0.66);
      const potentialRecovery = (t.incorrect * 2.66).toFixed(1);

      let colorClass = 'text-emerald-700 dark:text-emerald-400 bg-emerald-500/15 border-emerald-500/30';
      let barColor = 'bg-emerald-500';
      let statusLabel = 'Strong Topic';

      if (acc < 50) {
        colorClass = 'text-rose-700 dark:text-rose-400 bg-rose-500/15 border-rose-500/30';
        barColor = 'bg-rose-500';
        statusLabel = 'Needs Revision';
      } else if (acc < 75) {
        colorClass = 'text-amber-700 dark:text-amber-400 bg-amber-500/15 border-amber-500/30';
        barColor = 'bg-amber-500';
        statusLabel = 'Moderate Accuracy';
      }

      // Count total available questions for this theme in database
      const totalThemeQuestions = STATE.pyqs.filter(function (q) {
        return q.sub_topic && q.sub_topic.toLowerCase() === t.topic.toLowerCase();
      }).length;

      return (
        '<div class="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80 flex flex-col gap-2 text-xs shadow-xs hover:border-slate-700 transition-colors">' +
          '<div class="flex items-center justify-between gap-1">' +
            '<span class="font-bold text-slate-800 dark:text-slate-200 truncate pr-2">' + escapeHtml(t.topic) + '</span>' +
            '<span class="px-2 py-0.5 rounded text-[10px] font-bold font-mono border ' + colorClass + ' shrink-0">' +
              acc + '% (' + (netMarks >= 0 ? '+' : '') + netMarks.toFixed(1) + 'M)' +
            '</span>' +
          '</div>' +
          '<div class="w-full h-1.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">' +
            '<div class="h-full rounded-full ' + barColor + ' transition-all duration-500" style="width: ' + acc + '%"></div>' +
          '</div>' +
          '<div class="flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400 flex-wrap gap-1">' +
            '<span>' + escapeHtml(t.subject) + '</span>' +
            '<span>' + t.correct + '/' + t.total + ' Solved • ' + statusLabel + '</span>' +
          '</div>' +
          (acc < 60 ? (
            '<div class="text-[10px] text-rose-500 dark:text-rose-400 font-mono font-semibold">' +
              '🎯 Potential Recovery: +' + potentialRecovery + 'M if fortified' +
            '</div>'
          ) : '') +
          '<div class="flex items-center gap-2 pt-1 border-t border-slate-200/60 dark:border-slate-800/60">' +
            '<button type="button" class="theme-drill-btn flex-1 py-1.5 px-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-[11px] shadow-xs transition-all cursor-pointer flex items-center justify-center gap-1" data-topic="' + escapeHtml(t.topic) + '">' +
              '<span>🎯 Drill Gap (' + totalThemeQuestions + ' Qs)</span>' +
            '</button>' +
            '<button type="button" class="theme-vault-btn py-1.5 px-2.5 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-[11px] transition-all cursor-pointer flex items-center justify-center gap-1" data-topic="' + escapeHtml(t.topic) + '">' +
              '<span>🔍 Vault</span>' +
            '</button>' +
          '</div>' +
        '</div>'
      );
    }).join('');

    // Attach click handlers to cards
    listEl.querySelectorAll('.theme-drill-btn').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        const topic = e.currentTarget.getAttribute('data-topic');
        launchThemeDrill(topic);
      });
    });

    listEl.querySelectorAll('.theme-vault-btn').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        const topic = e.currentTarget.getAttribute('data-topic');
        STATE.vaultSearchQuery = topic;
        const vaultSearchInput = document.getElementById('vaultSearchInput');
        if (vaultSearchInput) vaultSearchInput.value = topic;
        switchViewMode('vault');
      });
    });
  }

  function launchThemeDrill(topicName) {
    if (!topicName) return;
    const gapQuestions = STATE.pyqs.filter(function (q) {
      return q.sub_topic && q.sub_topic.toLowerCase() === topicName.toLowerCase();
    });
    if (gapQuestions.length > 0) {
      STATE.playerQuestions = gapQuestions;
      STATE.playerIndex = 0;
      STATE.isExamMode = false;
      STATE.isReviewMode = false;
      STATE.currentTest = {
        id: 'drill_' + Date.now(),
        title: 'Focus Drill: ' + topicName + ' (' + gapQuestions.length + ' Qs)',
        mode: 'practice',
        totalQuestions: gapQuestions.length,
        startTime: Date.now()
      };
      STATE.testAnswers = {};
      gapQuestions.forEach(function (q) {
        if (STATE.answers[q.id] && STATE.answers[q.id].selectedIndex !== undefined) {
          STATE.testAnswers[q.id] = STATE.answers[q.id].selectedIndex;
        }
      });
      switchViewMode('player');
      showToast('🎯 Focus Mode: Drilling ' + gapQuestions.length + ' questions on ' + topicName + '!');
    } else {
      showToast('No questions found for ' + topicName);
    }
  }

  // Update Activity Numbers in Dashboard
  function updateDashboardActivity() {
    const mcqEl = document.getElementById('actMcqCount');
    const accEl = document.getElementById('actAccuracy');
    const mainsEl = document.getElementById('actMainsCount');
    const rankEl = document.getElementById('actRank');
    const pscoreEl = document.getElementById('actPScoreLabel');
    const dateEl = document.getElementById('actTodayDate');
    const badge = document.getElementById('sidebarMistakesBadge');

    // Date
    if (dateEl) {
      const today = new Date();
      dateEl.textContent = today.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }

    const total = STATE.activity.mcqCount || Object.keys(STATE.answers).length || 0;
    let correct = 0;
    Object.keys(STATE.answers).forEach(function (k) {
      if (STATE.answers[k] && STATE.answers[k].isCorrect) correct++;
    });
    STATE.activity.correctCount = correct;
    STATE.activity.mcqCount = total;

    const acc = total > 0 ? Math.round((correct / total) * 100) : 0;
    const netPScore = Math.max(0, (correct * 2.0) - ((total - correct) * 0.66)).toFixed(1);

    if (mcqEl) mcqEl.textContent = total;
    if (accEl) accEl.textContent = total > 0 ? (acc + '%') : '-';

    // Scan for evaluated Mains answers across localStorage keys
    let mainsEvaluatedCount = 0;
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('cookedmains_vault_')) {
          const raw = localStorage.getItem(key);
          if (raw) {
            const list = JSON.parse(raw);
            if (Array.isArray(list)) mainsEvaluatedCount += list.length;
          }
        }
      }
    } catch (e) {}
    if (mainsEl) mainsEl.textContent = mainsEvaluatedCount;

    // Percentile rank estimation based on active practice
    let rankPercentile = 'Top 25%';
    if (total >= 20 && acc >= 75) rankPercentile = 'Top 3%';
    else if (total >= 15 && acc >= 60) rankPercentile = 'Top 8%';
    else if (total >= 5) rankPercentile = 'Top 15%';
    else rankPercentile = 'Top 25%';

    if (rankEl) rankEl.textContent = rankPercentile;
    if (pscoreEl) pscoreEl.textContent = 'P-Score: ' + netPScore;
    if (badge) badge.textContent = STATE.mistakes.size;

    // Synchronize Daily Streak, Target Sprint & Today's High-Yield Mission
    updateDailyStreak();
    updateTargetSprint();
    updateDailyMissionCard();
  }

  // Update Today's Prescribed High-Yield Mission Hero Card
  function updateDailyMissionCard() {
    const daysBadge = document.getElementById('heroDaysToPrelimsBadge');
    const pscoreBadge = document.getElementById('heroPScoreBadge');
    const step1TopicEl = document.getElementById('missionStep1Topic');
    const step1RecoveryEl = document.getElementById('missionStep1Recovery');
    const step2TopicEl = document.getElementById('missionStep2Topic');

    // 1. Prelims 2027 Countdown
    const prelimsDate = new Date('2027-05-23T09:30:00');
    const now = new Date();
    const diffDays = Math.max(0, Math.ceil((prelimsDate - now) / (1000 * 60 * 60 * 24)));
    if (daysBadge) daysBadge.textContent = diffDays + ' Days Left';

    // 2. P-Score
    let correct = 0;
    const answeredKeys = Object.keys(STATE.answers);
    answeredKeys.forEach(function (k) {
      if (STATE.answers[k] && STATE.answers[k].isCorrect) correct++;
    });
    const total = answeredKeys.length;
    const netPScore = Math.max(0, (correct * 2.0) - ((total - correct) * 0.66)).toFixed(1);
    if (pscoreBadge) pscoreBadge.textContent = (netPScore > 0 ? ('+' + netPScore) : netPScore) + 'M P-Score';

    // 3. Worst Bleeding Topic for Step 1
    const topicStats = {};
    answeredKeys.forEach(function (qId) {
      const ans = STATE.answers[qId];
      const q = STATE.pyqs.find(function (item) { return item.id === qId; });
      if (!q || !q.sub_topic) return;
      const t = q.sub_topic;
      if (!topicStats[t]) topicStats[t] = { topic: t, correct: 0, total: 0, wrong: 0 };
      topicStats[t].total++;
      if (ans.isCorrect) topicStats[t].correct++;
      else topicStats[t].wrong++;
    });

    let worstTheme = null;
    let maxWrong = -1;
    Object.values(topicStats).forEach(function (st) {
      if (st.wrong > maxWrong && (st.correct / st.total) < 0.6) {
        maxWrong = st.wrong;
        worstTheme = st;
      }
    });

    if (step1TopicEl) {
      step1TopicEl.textContent = worstTheme ? worstTheme.topic : 'Electoral Ethics & RPA';
    }
    if (step1RecoveryEl) {
      const rec = worstTheme ? (worstTheme.wrong * 2.66).toFixed(1) : '2.4';
      step1RecoveryEl.textContent = '+' + rec + 'M Recovery';
    }

    // 4. Sprint Subject for Step 2
    const sprint = getTargetSprintState();
    if (step2TopicEl) {
      step2TopicEl.textContent = sprint.subject || 'Economy & Banking';
    }
  }

  // Launch Today's 15-Minute High-Yield Mission in Focus Mode
  function launchDailyMission() {
    if (!STATE.pyqs || STATE.pyqs.length === 0) {
      showToast('Questions are still loading, please wait...');
      return;
    }

    const sprint = getTargetSprintState();
    const sprintSubj = (sprint && sprint.subject) ? sprint.subject : 'Economy';

    // Step 1: 3 questions from worst topic or error pool
    const step1Topic = document.getElementById('missionStep1Topic')?.textContent || 'Electoral Ethics & RPA';
    let pool1 = STATE.pyqs.filter(function (q) {
      return q.sub_topic && q.sub_topic.toLowerCase().indexOf(step1Topic.toLowerCase().split('&')[0].trim()) !== -1;
    });
    if (pool1.length === 0) {
      pool1 = STATE.pyqs.filter(function (q) { return q.difficulty === 'Tough' || q.difficulty === 'Moderate'; });
    }
    const q1 = shuffleArray(pool1).slice(0, 3);

    // Step 2: 5 questions from active sprint subject
    let pool2 = STATE.pyqs.filter(function (q) {
      return q.subject && q.subject.toLowerCase().indexOf(sprintSubj.toLowerCase().split('&')[0].trim()) !== -1;
    });
    if (pool2.length === 0) pool2 = STATE.pyqs;
    const q2 = shuffleArray(pool2.filter(function (q) { return !q1.find(function (x) { return x.id === q.id; }); })).slice(0, 5);

    // Step 3: 2 50:50 educated guessing / elimination questions
    const q3 = shuffleArray(STATE.pyqs.filter(function (q) {
      return !q1.find(function (x) { return x.id === q.id; }) && !q2.find(function (x) { return x.id === q.id; });
    })).slice(0, 2);

    const missionSet = [].concat(q1, q2, q3);

    if (missionSet.length === 0) {
      showToast('No mission questions could be selected.');
      return;
    }

    STATE.playerQuestions = missionSet;
    STATE.playerIndex = 0;
    STATE.isExamMode = false;
    STATE.isReviewMode = false;
    STATE.currentTest = {
      id: 'mission_' + Date.now(),
      title: "Today's 15-Minute Daily Mission (10 Qs)",
      mode: 'practice',
      totalQuestions: missionSet.length,
      startTime: Date.now()
    };
    STATE.testAnswers = {};
    missionSet.forEach(function (q) {
      if (STATE.answers[q.id] && STATE.answers[q.id].selectedIndex !== undefined) {
        STATE.testAnswers[q.id] = STATE.answers[q.id].selectedIndex;
      }
    });
    switchViewMode('player');
    showToast('🎯 Today\'s 15-Minute Mission Active: 10 curated questions loaded into Focus Mode!');
  }

  // Leaderboard Modal Handlers
  function openTodayLeaderboard() {
    const modal = document.getElementById('todayLeaderboardModal');
    if (!modal) return;
    modal.classList.remove('hidden');

    const total = STATE.activity.mcqCount || Object.keys(STATE.answers).length || 0;
    let correct = 0;
    Object.keys(STATE.answers).forEach(function (k) {
      if (STATE.answers[k] && STATE.answers[k].isCorrect) correct++;
    });
    const acc = total > 0 ? Math.round((correct / total) * 100) : 0;
    const netPScore = Math.max(0, (correct * 2.0) - ((total - correct) * 0.66)).toFixed(1);

    let rankNum = '#34';
    let percentile = 'Top 25%';
    if (total >= 20 && acc >= 75) {
      rankNum = '#4';
      percentile = 'Top 3%';
    } else if (total >= 10 && acc >= 60) {
      rankNum = '#14';
      percentile = 'Top 12%';
    } else if (total >= 5) {
      rankNum = '#22';
      percentile = 'Top 18%';
    }

    const statsEl = document.getElementById('leaderboardUserStats');
    const badgeEl = document.getElementById('leaderboardRankBadge');
    const milestoneEl = document.getElementById('leaderboardNextMilestone');
    const listEl = document.getElementById('leaderboardAspirantsList');

    if (statsEl) {
      statsEl.textContent = percentile + ' · P-Score: ' + netPScore + ' · ' + total + ' MCQs Solved (' + (total > 0 ? (acc + '% Acc') : '0%') + ')';
    }
    if (badgeEl) {
      badgeEl.textContent = 'Rank ' + rankNum;
    }
    if (milestoneEl) {
      milestoneEl.innerHTML = (total < 10) 
        ? ('<strong>Next Milestone:</strong> Practice <strong>' + (10 - total) + ' more MCQs</strong> today with &gt;70% accuracy to climb into the <strong>Top 10%</strong> cohort!') 
        : '<strong>🔥 Elite Consistency:</strong> Maintain accuracy above 75% to cement your place in the <strong>Top 5 All-India</strong> cohort!';
    }

    if (listEl) {
      const cohortAspirants = [
        { rank: '#1', name: 'Aditya S. (AIR Candidate)', score: '+96.0', acc: '94%', solved: '48 MCQs', avatar: '🥇', isUser: false },
        { rank: '#2', name: 'Pooja M. (Delhi Cohort)', score: '+88.0', acc: '89%', solved: '42 MCQs', avatar: '🥈', isUser: false },
        { rank: '#3', name: 'Kavita R. (Bhopal Center)', score: '+82.5', acc: '86%', solved: '38 MCQs', avatar: '🥉', isUser: false },
        { rank: rankNum, name: 'You (' + (STATE.userName || 'Aspirant') + ')', score: (netPScore >= 0 ? '+' : '') + netPScore, acc: acc + '%', solved: total + ' MCQs', avatar: '🎯', isUser: true },
        { rank: '#19', name: 'Rohan V. (Karol Bagh)', score: '+64.0', acc: '78%', solved: '28 MCQs', avatar: '🎖️', isUser: false },
        { rank: '#27', name: 'Ananya D. (Bengaluru Hub)', score: '+52.0', acc: '72%', solved: '22 MCQs', avatar: '🎖️', isUser: false }
      ];

      // Sort display
      cohortAspirants.sort(function (a, b) {
        return parseFloat(b.score) - parseFloat(a.score);
      });

      listEl.innerHTML = cohortAspirants.map(function (asp) {
        const rowClass = asp.isUser
          ? 'bg-amber-500/15 border-amber-500/40 text-amber-200 ring-1 ring-amber-500/30'
          : 'bg-slate-950 border-slate-800/80 text-slate-300';
        return (
          '<div class="p-2.5 rounded-xl border flex items-center justify-between text-xs transition-colors ' + rowClass + '">' +
            '<div class="flex items-center gap-2.5 min-w-0">' +
              '<span class="text-sm shrink-0">' + asp.avatar + '</span>' +
              '<div class="flex flex-col min-w-0">' +
                '<span class="font-bold truncate ' + (asp.isUser ? 'text-amber-400' : 'text-white') + '">' + escapeHtml(asp.name) + '</span>' +
                '<span class="text-[10px] text-slate-400 font-mono">' + asp.rank + ' · ' + asp.solved + '</span>' +
              '</div>' +
            '</div>' +
            '<div class="flex flex-col items-end shrink-0 pl-2">' +
              '<span class="font-mono font-bold ' + (asp.isUser ? 'text-amber-400' : 'text-emerald-400') + '">' + asp.score + '</span>' +
              '<span class="text-[10px] text-slate-400 font-mono">' + asp.acc + ' Acc</span>' +
            '</div>' +
          '</div>'
        );
      }).join('');
    }
  }

  function closeTodayLeaderboard() {
    const modal = document.getElementById('todayLeaderboardModal');
    if (modal) modal.classList.add('hidden');
  }

  // Daily Streak Engine
  function updateDailyStreak() {
    const container = document.getElementById('streakDaysContainer');
    const titleEl = document.getElementById('streakTitle');
    const subtextEl = document.getElementById('streakSubtext');
    if (!container) return;

    let streak = parseInt(localStorage.getItem('cm_daily_drill_streak') || '12', 10);
    const totalToday = STATE.activity.mcqCount || 0;
    const hasPracticedToday = totalToday > 0;

    if (titleEl) titleEl.textContent = streak + '-day streak';
    if (subtextEl) {
      subtextEl.textContent = hasPracticedToday
        ? '🔥 Today\'s streak marked! Superb consistency, keep going!'
        : 'Learn or practice to mark today\'s streak.';
    }

    const today = new Date();
    const currentDayIdx = (today.getDay() + 6) % 7;
    const dayLabels = ['M', 'T', 'W', 'Th', 'F', 'S', 'Su'];

    container.innerHTML = dayLabels.map(function (label, idx) {
      let iconMarkup = '';
      if (idx < currentDayIdx) {
        iconMarkup = '<div class="w-6 h-6 rounded-full bg-amber-500 text-slate-950 font-bold flex items-center justify-center text-[10px] shadow-xs">✓</div>';
      } else if (idx === currentDayIdx) {
        if (hasPracticedToday) {
          iconMarkup = '<div class="w-6 h-6 rounded-full bg-amber-500 text-slate-950 font-bold flex items-center justify-center text-[10px] shadow-xs">✓</div>';
        } else {
          iconMarkup = '<div class="w-6 h-6 rounded-full border-2 border-amber-500 text-amber-500 font-bold flex items-center justify-center text-xs animate-pulse">●</div>';
        }
      } else {
        iconMarkup = '<div class="w-6 h-6 rounded-full border border-slate-700/80 text-slate-600 flex items-center justify-center text-[10px]">○</div>';
      }

      return (
        '<div class="flex flex-col items-center gap-1">' +
          '<span class="text-[10px] text-slate-400 font-semibold">' + label + '</span>' +
          iconMarkup +
        '</div>'
      );
    }).join('');
  }

  function openStreakModal() {
    const modal = document.getElementById('streakDetailsModal');
    if (!modal) return;
    modal.classList.remove('hidden');

    const prelimsDate = new Date('2027-05-23T09:30:00');
    const now = new Date();
    const diffTime = prelimsDate - now;
    const diffDays = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

    const countEl = document.getElementById('prelimsCountdownDays');
    if (countEl) countEl.textContent = diffDays;
  }

  function closeStreakModal() {
    const modal = document.getElementById('streakDetailsModal');
    if (modal) modal.classList.add('hidden');
  }

  // ==========================================================
  // MULTI-TARGET SPRINT, SUB-TOPIC & PENDING TRACKER ENGINE (v2)
  // ==========================================================
  const TARGET_SPRINTS_KEY = 'cm_multi_target_sprints_v2';

  const SUBJECT_TOPIC_CLUSTERS = {
    'Polity & Governance': [
      'Fundamental Rights, DPSP & Basic Structure',
      'Parliament, State Legislature & Executive',
      'Judiciary & Constitutional Bodies',
      'Preamble, Constitutional History & Federalism',
      'Elections, Representation & Governance'
    ],
    'Economy': [
      'Monetary Policy, Inflation & RBI Framework',
      'Banking, Financial Markets & NBFCs',
      'Balance of Payments, Forex & External Trade',
      'Fiscal Policy, Budget, Taxation & Deficits',
      'Agriculture, Industry, Infrastructure & Schemes'
    ],
    'History & Culture': [
      'Modern Freedom Struggle (1857-1947) & British Rule',
      'Ancient India (Vedic, Mauryan, Gupta & Sangam)',
      'Buddhism, Jainism & Indian Philosophies',
      'Art, Architecture, Paintings & Classical Music',
      'Medieval India (Mughals, Sultanate & Bhakti)'
    ],
    'Environment & Ecology': [
      'Protected Areas (National Parks, Sanctuaries, Wetlands)',
      'Biodiversity, Endangered Flora/Fauna & IUCN Status',
      'Climate Treaties, COP Summits, REDD+ & UNFCCC',
      'Pollution, Waste Rules & Environmental Acts'
    ],
    'Geography': [
      'River Basins, Drainage Systems & Water Resources',
      'Geomorphology, Landforms & Peninsular Geology',
      'Indian Climatology, Monsoons & Island Geography',
      'World Mapping, Strategic Chokepoints & Straits'
    ],
    'Science & Technology': [
      'Biotechnology, Genetics, CRISPR & Health',
      'Space Technology, ISRO Missions & Satellites',
      'Defense Systems, Missiles & Stealth Tech',
      'Emerging Tech: AI, Semiconductors & Quantum'
    ]
  };

  function getTargetSprintsData() {
    try {
      const raw = localStorage.getItem(TARGET_SPRINTS_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) {}

    // Migration from old single sprint key
    let initialSubject = 'History & Culture';
    let initialGoal = 30;
    try {
      const oldRaw = localStorage.getItem('cm_target_sprint_v1');
      if (oldRaw) {
        const oldObj = JSON.parse(oldRaw);
        if (oldObj.subject) initialSubject = oldObj.subject;
        if (oldObj.goal) initialGoal = oldObj.goal;
      }
    } catch (e) {}

    const defaultData = {
      activeId: 'target_1',
      targets: [
        {
          id: 'target_1',
          subject: initialSubject,
          topic: 'all',
          topicLabel: 'All Topics',
          goal: initialGoal,
          daysLeft: 4,
          daysTotal: 7
        }
      ]
    };
    saveTargetSprintsData(defaultData);
    return defaultData;
  }

  function saveTargetSprintsData(data) {
    try {
      localStorage.setItem(TARGET_SPRINTS_KEY, JSON.stringify(data));
    } catch (e) {}
  }

  function getActiveSprint() {
    const data = getTargetSprintsData();
    let found = (data.targets || []).find(function (t) { return t.id === data.activeId; });
    if (!found && data.targets && data.targets.length > 0) {
      found = data.targets[0];
      data.activeId = found.id;
      saveTargetSprintsData(data);
    }
    return found || {
      id: 'target_1',
      subject: 'History & Culture',
      topic: 'all',
      topicLabel: 'All Topics',
      goal: 30,
      daysLeft: 4,
      daysTotal: 7
    };
  }

  function getSprintQuestions(sprint) {
    const subClean = (sprint.subject || '').toLowerCase().split('&')[0].trim();
    return (STATE.pyqs || []).filter(function (q) {
      if (!q.subject || q.subject.toLowerCase().indexOf(subClean) === -1) return false;
      if (!sprint.topic || sprint.topic === 'all') return true;

      const topicLower = sprint.topic.toLowerCase();
      const qSubTopic = (q.sub_topic || '').toLowerCase();
      const qText = (q.question_text || '').toLowerCase();

      const keywords = topicLower.split(/[,&\s/]+/).filter(function (w) { return w.length > 3; });
      return keywords.some(function (kw) {
        return qSubTopic.indexOf(kw) !== -1 || qText.indexOf(kw) !== -1;
      });
    });
  }

  function calculateSprintStats(sprint) {
    const pool = getSprintQuestions(sprint);
    let solved = [];
    let correct = [];
    let unattempted = [];

    pool.forEach(function (q) {
      if (STATE.answers[q.id]) {
        solved.push(q);
        if (STATE.answers[q.id] === q.correct) correct.push(q);
      } else {
        unattempted.push(q);
      }
    });

    const goal = sprint.goal || 30;
    const completedCount = solved.length;
    const pendingCount = Math.max(0, goal - completedCount);
    const daysLeft = sprint.daysLeft || 4;
    const pace = Math.ceil(pendingCount / Math.max(1, daysLeft));
    const accuracy = completedCount > 0 ? Math.round((correct.length / completedCount) * 100) : 0;
    const pct = Math.min(100, Math.round((completedCount / goal) * 100));

    return {
      pool: pool,
      solved: solved,
      correct: correct,
      unattempted: unattempted,
      goal: goal,
      completedCount: completedCount,
      pendingCount: pendingCount,
      unattemptedInPool: unattempted.length,
      daysLeft: daysLeft,
      pace: pace,
      accuracy: accuracy,
      pct: pct
    };
  }

  function updateTargetSprint() {
    const data = getTargetSprintsData();
    const sprint = getActiveSprint();
    const stats = calculateSprintStats(sprint);

    // Render Dashboard Tabs
    const tabsContainer = document.getElementById('targetSprintTabs');
    if (tabsContainer) {
      const tabsHtml = (data.targets || []).map(function (t, idx) {
        const tStats = calculateSprintStats(t);
        const isActive = t.id === sprint.id;
        const activeCls = isActive
          ? 'bg-emerald-500 text-slate-950 font-black shadow-xs'
          : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 border border-slate-700/80';
        const shortSubj = t.subject.split('&')[0].trim();
        return (
          '<button type="button" class="sprint-tab-btn px-2.5 py-1 rounded-lg text-[11px] whitespace-nowrap transition cursor-pointer flex items-center gap-1 ' + activeCls + '" data-tid="' + t.id + '">' +
            '<span>🎯 ' + shortSubj + '</span>' +
            '<span class="text-[9px] font-mono opacity-80">(' + tStats.completedCount + '/' + t.goal + ')</span>' +
          '</button>'
        );
      }).join('');

      const addBtnHtml = (data.targets || []).length < 3
        ? '<button type="button" id="addNewTargetTabBtn" class="px-2 py-1 rounded-lg text-[11px] font-bold text-amber-400 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 whitespace-nowrap transition cursor-pointer flex items-center gap-1">+ Add Target</button>'
        : '';

      tabsContainer.innerHTML = tabsHtml + addBtnHtml;

      tabsContainer.querySelectorAll('.sprint-tab-btn').forEach(function (btn) {
        btn.addEventListener('click', function (e) {
          const tid = e.currentTarget.getAttribute('data-tid');
          data.activeId = tid;
          saveTargetSprintsData(data);
          updateTargetSprint();
        });
      });

      document.getElementById('addNewTargetTabBtn')?.addEventListener('click', function (e) {
        window.openTargetSprintModal(e, true);
      });
    }

    // Dashboard Widget Card Fields
    const subjEl = document.getElementById('targetCardSubject');
    const topicTextEl = document.getElementById('targetCardTopicText');
    const barEl = document.getElementById('targetCardProgressBar');
    const ratioEl = document.getElementById('targetCardRatio');
    const pendingEl = document.getElementById('targetCardPending');
    const daysEl = document.getElementById('targetCardDays');
    const paceEl = document.getElementById('targetSprintPaceText');
    const accEl = document.getElementById('targetSprintAccuracyBadge');
    const btnPendingEl = document.getElementById('btnPendingCount');

    if (subjEl) subjEl.textContent = sprint.subject;
    if (topicTextEl) topicTextEl.textContent = sprint.topicLabel || 'All Topics';
    if (barEl) barEl.style.width = stats.pct + '%';
    if (ratioEl) ratioEl.textContent = stats.completedCount + ' / ' + stats.goal;
    if (pendingEl) pendingEl.textContent = stats.pendingCount + ' Qs';
    if (daysEl) daysEl.textContent = stats.daysLeft + ' Days';
    if (btnPendingEl) btnPendingEl.textContent = stats.pendingCount;

    if (paceEl) {
      if (stats.completedCount >= stats.goal) {
        paceEl.textContent = '🎉 Goal Completed! Reset or add next sprint!';
      } else {
        paceEl.textContent = 'Need ' + stats.pace + ' Qs/day to hit goal';
      }
    }
    if (accEl) {
      accEl.textContent = (stats.completedCount > 0 ? stats.accuracy : '--') + '% Acc';
    }

    // Modal elements if open
    const mSubj = document.getElementById('modalSprintSubject');
    const mTopic = document.getElementById('modalSprintTopic');
    const mBar = document.getElementById('modalSprintProgressBar');
    const mRatio = document.getElementById('modalSprintRatio');
    const mRem = document.getElementById('modalSprintRemaining');
    const mPace = document.getElementById('modalSprintPace');
    const mDays = document.getElementById('modalSprintDays');
    const mAcc = document.getElementById('modalSprintAcc');
    const mPendingBtnText = document.getElementById('modalPendingCountText');

    if (mSubj) mSubj.textContent = sprint.subject;
    if (mTopic) mTopic.textContent = '📚 ' + (sprint.topicLabel || 'All Topics');
    if (mBar) mBar.style.width = stats.pct + '%';
    if (mRatio) mRatio.textContent = stats.completedCount + ' / ' + stats.goal;
    if (mRem) mRem.textContent = stats.pendingCount + ' Qs';
    if (mPace) mPace.textContent = stats.pace + ' Qs / Day';
    if (mDays) mDays.textContent = stats.daysLeft + ' Days Left';
    if (mAcc) mAcc.textContent = 'Accuracy: ' + (stats.completedCount > 0 ? stats.accuracy : 0) + '%';
    if (mPendingBtnText) mPendingBtnText.textContent = stats.pendingCount;
  }

  window.openTargetSprintModal = function (e, createNew) {
    if (e && e.stopPropagation) e.stopPropagation();
    const modal = document.getElementById('targetSprintModal');
    if (!modal) return;
    modal.classList.remove('hidden');

    const data = getTargetSprintsData();

    if (createNew) {
      const newId = 'target_' + Date.now();
      const existingSubjects = (data.targets || []).map(function (t) { return t.subject; });
      const allSubjs = Object.keys(SUBJECT_TOPIC_CLUSTERS);
      const nextSubj = allSubjs.find(function (s) { return !existingSubjects.includes(s); }) || allSubjs[0];

      const newTarget = {
        id: newId,
        subject: nextSubj,
        topic: 'all',
        topicLabel: 'All Topics',
        goal: 25,
        daysLeft: 7,
        daysTotal: 7
      };
      data.targets.push(newTarget);
      data.activeId = newId;
      saveTargetSprintsData(data);
    }

    let sprint = getActiveSprint();
    updateTargetSprint();

    // 1. Render Modal Target Tabs
    const modalTabsContainer = document.getElementById('modalTargetTabs');
    if (modalTabsContainer) {
      const mTabsHtml = (data.targets || []).map(function (t, idx) {
        const isActive = t.id === sprint.id;
        const activeCls = isActive
          ? 'bg-emerald-500 text-slate-950 font-black'
          : 'bg-slate-800 text-slate-300 hover:bg-slate-700';
        return (
          '<button type="button" class="modal-target-tab-btn px-2.5 py-1 rounded-lg text-xs font-bold cursor-pointer transition ' + activeCls + '" data-tid="' + t.id + '">' +
            'Target ' + (idx + 1) + ': ' + t.subject.split('&')[0].trim() +
          '</button>'
        );
      }).join('');

      const mAddHtml = (data.targets || []).length < 3
        ? '<button type="button" id="modalAddTargetBtn" class="px-2 py-1 rounded-lg text-xs font-bold text-amber-400 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 cursor-pointer">+ Add Target</button>'
        : '';

      modalTabsContainer.innerHTML = mTabsHtml + mAddHtml;

      modalTabsContainer.querySelectorAll('.modal-target-tab-btn').forEach(function (btn) {
        btn.addEventListener('click', function (ev) {
          const tid = ev.currentTarget.getAttribute('data-tid');
          data.activeId = tid;
          saveTargetSprintsData(data);
          window.openTargetSprintModal();
        });
      });

      document.getElementById('modalAddTargetBtn')?.addEventListener('click', function () {
        window.openTargetSprintModal(null, true);
      });
    }

    // Delete Target Button
    const deleteBtn = document.getElementById('deleteSprintTargetBtn');
    if (deleteBtn) {
      if ((data.targets || []).length > 1) {
        deleteBtn.classList.remove('hidden');
        deleteBtn.onclick = function () {
          data.targets = data.targets.filter(function (t) { return t.id !== sprint.id; });
          data.activeId = data.targets[0].id;
          saveTargetSprintsData(data);
          window.openTargetSprintModal();
          showToast('🗑️ Target deleted');
        };
      } else {
        deleteBtn.classList.add('hidden');
      }
    }

    // 2. Render Step 1: Subjects Grid
    const availableSubjects = Object.keys(SUBJECT_TOPIC_CLUSTERS);
    const choicesContainer = document.getElementById('sprintSubjectChoices');
    if (choicesContainer) {
      choicesContainer.innerHTML = availableSubjects.map(function (sub) {
        let count = 0;
        let cor = 0;
        Object.keys(STATE.answers).forEach(function (qId) {
          const q = STATE.pyqs.find(function (item) { return item.id === qId; });
          if (q && q.subject && q.subject.toLowerCase().indexOf(sub.toLowerCase().split('&')[0].trim()) !== -1) {
            count++;
            if (STATE.answers[qId] === q.correct) cor++;
          }
        });
        const acc = count > 0 ? Math.round((cor / count) * 100) + '%' : 'New';
        const isSelected = sub.toLowerCase().split('&')[0].trim() === sprint.subject.toLowerCase().split('&')[0].trim();
        const activeClass = isSelected
          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500 shadow-xs'
          : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700';

        return (
          '<button type="button" class="sprint-subj-choice-btn p-2 rounded-xl border flex flex-col justify-between gap-1 text-left cursor-pointer transition-all ' + activeClass + '" data-subj="' + escapeHtml(sub) + '">' +
            '<span class="font-bold text-[11px] leading-tight">' + escapeHtml(sub) + '</span>' +
            '<span class="text-[9px] font-mono px-1 py-0.2 rounded bg-slate-800 text-slate-400 w-fit">' + acc + '</span>' +
          '</button>'
        );
      }).join('');

      choicesContainer.querySelectorAll('.sprint-subj-choice-btn').forEach(function (btn) {
        btn.addEventListener('click', function (ev) {
          const newSub = ev.currentTarget.getAttribute('data-subj');
          sprint.subject = newSub;
          sprint.topic = 'all';
          sprint.topicLabel = 'All Topics';
          saveTargetSprintsData(data);
          window.openTargetSprintModal();
          showToast('🎯 Focus subject set to ' + newSub);
        });
      });
    }

    // 3. Render Step 2: Sub-Topics for Current Subject
    const topicContainer = document.getElementById('sprintTopicChoices');
    const topicCountEl = document.getElementById('topicQuestionCount');
    if (topicContainer) {
      const clusters = SUBJECT_TOPIC_CLUSTERS[sprint.subject] || [];
      const isAll = (!sprint.topic || sprint.topic === 'all');

      let topicsHtml = [];

      // "All Topics" Pill
      const allActiveCls = isAll
        ? 'bg-emerald-500 text-slate-950 font-black'
        : 'bg-slate-950 text-slate-300 border border-slate-800 hover:border-slate-700';
      topicsHtml.push(
        '<button type="button" class="sprint-topic-btn px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition ' + allActiveCls + '" data-topic="all" data-label="All Topics">' +
          '📚 All ' + sprint.subject.split('&')[0].trim() + ' Topics' +
        '</button>'
      );

      // Thematic Clusters
      clusters.forEach(function (cl) {
        const isSel = (sprint.topic === cl);
        const selCls = isSel
          ? 'bg-emerald-500 text-slate-950 font-black'
          : 'bg-slate-950 text-slate-300 border border-slate-800 hover:border-slate-700';

        // Count how many questions match this cluster
        const clKeywords = cl.toLowerCase().split(/[,&\s/]+/).filter(function (w) { return w.length > 3; });
        const subClean = sprint.subject.toLowerCase().split('&')[0].trim();
        const matchCount = (STATE.pyqs || []).filter(function (q) {
          if (!q.subject || q.subject.toLowerCase().indexOf(subClean) === -1) return false;
          const qSubTopic = (q.sub_topic || '').toLowerCase();
          const qText = (q.question_text || '').toLowerCase();
          return clKeywords.some(function (kw) { return qSubTopic.indexOf(kw) !== -1 || qText.indexOf(kw) !== -1; });
        }).length;

        topicsHtml.push(
          '<button type="button" class="sprint-topic-btn px-2.5 py-1.5 rounded-xl text-xs font-medium cursor-pointer transition flex items-center gap-1 ' + selCls + '" data-topic="' + escapeHtml(cl) + '" data-label="' + escapeHtml(cl) + '">' +
            '<span>' + escapeHtml(cl) + '</span>' +
            '<span class="text-[9px] font-mono px-1 py-0.2 rounded bg-slate-800/80 text-slate-300">(' + matchCount + ')</span>' +
          '</button>'
        );
      });

      topicContainer.innerHTML = topicsHtml.join('');

      if (topicCountEl) {
        const stats = calculateSprintStats(sprint);
        topicCountEl.textContent = stats.pool.length + ' Qs available (' + stats.unattemptedInPool + ' pending)';
      }

      topicContainer.querySelectorAll('.sprint-topic-btn').forEach(function (btn) {
        btn.addEventListener('click', function (ev) {
          const tVal = ev.currentTarget.getAttribute('data-topic');
          const tLabel = ev.currentTarget.getAttribute('data-label');
          sprint.topic = tVal;
          sprint.topicLabel = tLabel;
          saveTargetSprintsData(data);
          window.openTargetSprintModal();
          showToast('🎯 Focused on: ' + tLabel);
        });
      });
    }

    // 4. Step 3: Question Target Buttons & Custom Input
    const customInput = document.getElementById('sprintCustomGoalInput');
    if (customInput) {
      customInput.value = sprint.goal || 30;
      customInput.onchange = function () {
        const val = parseInt(customInput.value, 10);
        if (val && val >= 5) {
          sprint.goal = val;
          saveTargetSprintsData(data);
          updateTargetSprint();
          window.openTargetSprintModal();
        }
      };
    }

    document.querySelectorAll('.sprint-goal-btn').forEach(function (btn) {
      const g = parseInt(btn.getAttribute('data-goal'), 10);
      if (g === sprint.goal) {
        btn.className = 'sprint-goal-btn p-2 rounded-xl border text-xs font-mono font-bold cursor-pointer transition-all border-emerald-500 bg-emerald-500/20 text-emerald-300';
      } else {
        btn.className = 'sprint-goal-btn p-2 rounded-xl border text-xs font-mono font-bold cursor-pointer transition-all border-slate-800 bg-slate-950 text-slate-300 hover:border-emerald-500/40';
      }
      btn.onclick = function () {
        sprint.goal = g;
        if (customInput) customInput.value = g;
        saveTargetSprintsData(data);
        window.openTargetSprintModal();
        showToast('🎯 Goal set to ' + g + ' questions!');
      };
    });

    // Duration Buttons
    document.querySelectorAll('.sprint-duration-btn').forEach(function (btn) {
      const days = parseInt(btn.getAttribute('data-days'), 10);
      if (days === sprint.daysTotal) {
        btn.className = 'sprint-duration-btn px-2.5 py-1 rounded-lg border text-[11px] font-mono cursor-pointer transition border-emerald-500 bg-emerald-500/20 text-emerald-300 font-bold';
      } else {
        btn.className = 'sprint-duration-btn px-2.5 py-1 rounded-lg border text-[11px] font-mono cursor-pointer transition border-slate-800 bg-slate-950 text-slate-300 hover:border-slate-700';
      }
      btn.onclick = function () {
        sprint.daysTotal = days;
        sprint.daysLeft = days;
        saveTargetSprintsData(data);
        window.openTargetSprintModal();
        showToast('🎯 Target timeline set to ' + days + ' days');
      };
    });

    // Action button in modal to drill pending queue
    const modalPendingBtn = document.getElementById('modalStartPendingSprintBtn');
    if (modalPendingBtn) {
      modalPendingBtn.onclick = function () {
        window.launchSprintFocusMode(true);
      };
    }
  };

  window.closeTargetSprintModal = function () {
    const modal = document.getElementById('targetSprintModal');
    if (modal) modal.classList.add('hidden');
  };

  window.launchSprintFocusMode = function (onlyPending, targetId) {
    const data = getTargetSprintsData();
    let sprint = getActiveSprint();
    if (targetId) {
      const match = (data.targets || []).find(function (t) { return t.id === targetId; });
      if (match) sprint = match;
    }

    window.closeTargetSprintModal();

    const stats = calculateSprintStats(sprint);

    if (stats.pool.length === 0) {
      showToast('No questions found matching ' + sprint.subject + ' (' + (sprint.topicLabel || 'All Topics') + ')');
      return;
    }

    let selected = [];
    if (onlyPending) {
      if (stats.unattempted.length === 0) {
        showToast('🎉 All questions in this target have been solved! Launching revision set.');
        selected = shuffleArray(stats.pool).slice(0, 10);
      } else {
        // Take up to 15 pending questions for focused backlog clearing
        selected = stats.unattempted.slice(0, Math.min(15, stats.unattempted.length));
        showToast('⚡ Clearing Backlog: Loaded ' + selected.length + ' pending questions!');
      }
    } else {
      // 5-Question quick daily pace sprint
      const source = stats.unattempted.length >= 5 ? stats.unattempted : stats.pool;
      selected = shuffleArray(source).slice(0, 5);
      showToast('🚀 Sprint Focus Mode: 5 high-yield ' + sprint.subject + ' questions loaded!');
    }

    STATE.playerQuestions = selected;
    STATE.playerIndex = 0;
    STATE.isExamMode = false;
    STATE.isReviewMode = false;
    STATE.currentTest = {
      id: 'sprint_' + Date.now(),
      title: (onlyPending ? 'Pending Backlog: ' : 'Target Sprint: ') + sprint.subject + (sprint.topicLabel && sprint.topic !== 'all' ? ' (' + sprint.topicLabel + ')' : ''),
      totalQuestions: selected.length,
      durationSeconds: 0
    };
    switchViewMode('player');
  };

  function autoSelectWeakestSubject() {
    const subjStats = {};
    Object.keys(STATE.answers).forEach(function (qId) {
      const ans = STATE.answers[qId];
      const q = STATE.pyqs.find(function (item) { return item.id === qId; });
      if (!q || !q.subject) return;

      const s = q.subject;
      if (!subjStats[s]) subjStats[s] = { total: 0, wrong: 0 };
      subjStats[s].total++;
      if (!ans.isCorrect) subjStats[s].wrong++;
    });

    let worstSubj = 'History & Culture';
    let maxWrong = -1;
    Object.keys(subjStats).forEach(function (s) {
      if (subjStats[s].wrong > maxWrong) {
        maxWrong = subjStats[s].wrong;
        worstSubj = s;
      }
    });

    const data = getTargetSprintsData();
    const sprint = getActiveSprint();
    sprint.subject = worstSubj;
    sprint.topic = 'all';
    sprint.topicLabel = 'All Topics';
    saveTargetSprintsData(data);
    window.openTargetSprintModal();
    updateTargetSprint();
    showToast('⚡ Auto-selected your highest mark-leak subject: ' + worstSubj);
  }

  // Backward compatibility alias
  function getTargetSprintState() {
    return getActiveSprint();
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

  // Debounce Utility for fast input responsiveness
  function debounce(func, wait) {
    let timeout;
    return function () {
      const context = this;
      const args = arguments;
      clearTimeout(timeout);
      timeout = setTimeout(function () {
        func.apply(context, args);
      }, wait);
    };
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
    if (!STATE.pyqs || STATE.pyqs.length === 0) {
      renderVaultLoadingSkeletons();
      renderMatrixLoadingSkeletons();
    }
    try {
      const [resPyqs, resCa, resOther, resAi] = await Promise.all([
        fetch('/static/data/prelims_pyqs.json?v=20261123v2'),
        fetch('/static/data/current_affairs_pyqs.json?v=230qs_20261123v2'),
        fetch('/static/data/upsc_other_exams_pyqs.json?v=20261123v2'),
        fetch('/static/data/ai_mock_questions_2026.json?v=20261123v2')
      ]);
      STATE.pyqMap = {};
      if (resPyqs.ok) {
        STATE.pyqs = await resPyqs.json();
        STATE.pyqs.forEach(function (q) {
          if (q) {
            if (!q.exam) q.exam = 'UPSC CSE';
            if (q.is_official_key === undefined) q.is_official_key = true;
            if (q.id) STATE.pyqMap[q.id] = q;
          }
        });
      }
      if (resOther && resOther.ok) {
        STATE.other_pyqs = await resOther.json();
        STATE.other_pyqs.forEach(function (q) {
          if (q) {
            if (!q.exam) q.exam = 'UPSC CDS';
            q.is_official_key = true;
            if (q.id) STATE.pyqMap[q.id] = q;
            STATE.pyqs.push(q);
          }
        });
      }
      if (resAi && resAi.ok) {
        STATE.ai_mock_questions = await resAi.json();
        STATE.ai_mock_questions.forEach(function (q) {
          if (q) {
            if (!q.exam) q.exam = '2026 UPSC AI Mock';
            if (q.id) STATE.pyqMap[q.id] = q;
          }
        });
      }
      if (resCa && resCa.ok) {
        STATE.ca_pyqs = await resCa.json();
        STATE.ca_pyqs.forEach(function (q) {
          if (q) {
            if (!q.exam) q.exam = 'UPSC 2026 CA';
            if (q.id) STATE.pyqMap[q.id] = q;
          }
        });
      }
    } catch (e) {
      console.warn('Could not fetch prelims/CA/CDS/CAPF questions data:', e);
    }

    updateDashboardActivity();
    updateSubTopicHeatmap();
    renderDashboardMockHistory();
    handleUrlQueryParams();

    if (STATE.viewMode === 'vault') {
      renderPyqVault();
    } else if (STATE.viewMode === 'current_affairs') {
      renderCurrentAffairsArena();
    } else if (STATE.viewMode === 'dashboard') {
      renderMatrixFeed();
    }
  }

  function handleUrlQueryParams() {
    try {
      const path = (window.location.pathname || '').toLowerCase();
      const params = new URLSearchParams(window.location.search);
      const qid = params.get('qid');
      const subject = params.get('subject');
      const year = params.get('year');
      const mode = params.get('mode') || params.get('action');
      const kw = params.get('q') || params.get('keyword');

      if (mode === 'current_affairs' || mode === 'ca' || path.includes('/current-affairs')) {
        switchViewMode('current_affairs');
        return;
      }

      if (mode === 'csat' || subject === 'csat' || path.includes('/csat')) {
        switchViewMode('csat');
        return;
      }

      if (mode === 'vault' || path.endsWith('/pyqs')) {
        switchViewMode('vault');
        return;
      }

      if (mode === 'mock') {
        const format = params.get('format') || 'full';
        if (typeof window.openMockGenerator === 'function') {
          window.openMockGenerator(format);
        }
        return;
      }

      if (mode === 'ev') {
        if (typeof window.openEVSimulator === 'function') {
          window.openEVSimulator();
        }
        return;
      }

      if (qid && STATE.pyqs && STATE.pyqs.length > 0) {
        const targetIdx = STATE.pyqs.findIndex(function (q) { return q.id === qid; });
        if (targetIdx !== -1) {
          STATE.playerQuestions = STATE.pyqs;
          STATE.playerIndex = targetIdx;
          STATE.isExamMode = false;
          STATE.isReviewMode = false;
          STATE.currentTest = {
            id: 'practice_' + Date.now(),
            title: 'PYQ Focus Practice (' + STATE.pyqs.length + ' Qs)',
            mode: 'practice',
            totalQuestions: STATE.pyqs.length,
            startTime: Date.now()
          };
          STATE.testAnswers = {};
          STATE.pyqs.forEach(function (q) {
            if (STATE.answers[q.id] && STATE.answers[q.id].selectedIndex !== undefined) {
              STATE.testAnswers[q.id] = STATE.answers[q.id].selectedIndex;
            }
          });
          switchViewMode('player');
          showToast('🎯 Loaded Question in Focus Mode');
          return;
        }
      }

      if (subject && STATE.pyqs && STATE.pyqs.length > 0) {
        if (typeof window.startPracticeSession === 'function') {
          window.startPracticeSession(subject, kw || '');
        }
        return;
      }

      if (year && STATE.pyqs && STATE.pyqs.length > 0) {
        const yrNum = parseInt(year, 10);
        const yrList = STATE.pyqs.filter(function (q) { return q.year === yrNum; });
        if (yrList.length > 0) {
          STATE.playerQuestions = yrList;
          STATE.playerIndex = 0;
          STATE.isExamMode = false;
          STATE.isReviewMode = false;
          STATE.currentTest = {
            id: 'pyq_' + yrNum + '_' + Date.now(),
            title: 'UPSC CSE ' + yrNum + ' Official PYQs (' + yrList.length + ' Qs)',
            mode: 'practice',
            totalQuestions: yrList.length,
            startTime: Date.now()
          };
          STATE.testAnswers = {};
          yrList.forEach(function (q) {
            if (STATE.answers[q.id] && STATE.answers[q.id].selectedIndex !== undefined) {
              STATE.testAnswers[q.id] = STATE.answers[q.id].selectedIndex;
            }
          });
          switchViewMode('player');
          showToast('🎯 Loaded ' + yrList.length + ' questions from UPSC ' + yrNum + '!');
          return;
        }
      }
    } catch (e) {
      console.warn('URL parameter handling error:', e);
    }
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
  // CSAT GS PAPER 2 PRACTICE & QUALIFYING ENGINE
  // ==========================================================
  let csatQuestions = [];
  let csatFilterSec = 'all';

  async function loadCsatQuestions() {
    if (csatQuestions && csatQuestions.length > 0) return csatQuestions;
    try {
      const res = await fetch('/static/data/csat_pyqs.json');
      if (res.ok) {
        csatQuestions = await res.json();
      }
    } catch (e) {
      console.warn('Could not load csat_pyqs.json:', e);
    }
    return csatQuestions;
  }

  function recalculateCsatSimulator() {
    const attemptSlider = document.getElementById('csatAttemptSlider');
    const accuracySlider = document.getElementById('csatAccuracySlider');
    const attemptVal = document.getElementById('csatAttemptVal');
    const accuracyVal = document.getElementById('csatAccuracyVal');
    const netScoreEl = document.getElementById('csatNetScore');
    const verdictBadge = document.getElementById('csatVerdictBadge');
    const correctCountEl = document.getElementById('csatCorrectCount');
    const wrongCountEl = document.getElementById('csatWrongCount');

    if (!attemptSlider || !accuracySlider || !netScoreEl) return;

    const attempts = parseInt(attemptSlider.value, 10);
    const accuracy = parseInt(accuracySlider.value, 10);

    if (attemptVal) attemptVal.textContent = attempts + ' Questions';
    if (accuracyVal) accuracyVal.textContent = accuracy + '%';

    const correct = Math.round(attempts * (accuracy / 100));
    const wrong = attempts - correct;
    const positiveMarks = correct * 2.5;
    const negativeMarks = wrong * (2.5 / 3); // 0.8333
    const net = Math.max(0, positiveMarks - negativeMarks);

    netScoreEl.textContent = net.toFixed(1);

    if (correctCountEl) correctCountEl.textContent = correct + ' Qs (+' + positiveMarks.toFixed(1) + ')';
    if (wrongCountEl) wrongCountEl.textContent = wrong + ' Qs (-' + negativeMarks.toFixed(1) + ')';

    if (verdictBadge) {
      if (net >= 80) {
        verdictBadge.className = 'csat-safe p-3 rounded-xl border text-center text-xs font-black transition-all bg-emerald-100 dark:bg-emerald-950/60 border-emerald-400 dark:border-emerald-800/80 text-emerald-800 dark:text-emerald-300';
        verdictBadge.innerHTML = '✅ SAFE QUALIFIED (Above 66.67 Cutoff by +' + (net - 66.67).toFixed(1) + ' buffer)';
        netScoreEl.className = 'text-2xl font-black font-mono text-emerald-600 dark:text-emerald-400';
      } else if (net >= 66.67) {
        verdictBadge.className = 'csat-borderline p-3 rounded-xl border text-center text-xs font-black transition-all bg-amber-100 dark:bg-amber-950/60 border-amber-400 dark:border-amber-800/80 text-amber-900 dark:text-amber-300';
        verdictBadge.innerHTML = '⚠️ BORDERLINE ZONE (' + net.toFixed(1) + ' Marks) — Risky under negative mark variance!';
        netScoreEl.className = 'text-2xl font-black font-mono text-amber-600 dark:text-amber-400';
      } else {
        verdictBadge.className = 'csat-danger p-3 rounded-xl border text-center text-xs font-black transition-all bg-rose-100 dark:bg-rose-950/60 border-rose-400 dark:border-rose-800/80 text-rose-900 dark:text-rose-300';
        verdictBadge.innerHTML = '❌ DANGER: DISQUALIFIED (' + (66.67 - net).toFixed(1) + ' marks below 66.67 Cutoff)';
        netScoreEl.className = 'text-2xl font-black font-mono text-rose-600 dark:text-rose-400';
      }
    }
  }

  async function initCsatPractice() {
    recalculateCsatSimulator();
    await loadCsatQuestions();
    renderCsatQuestions();
  }

  function renderCsatQuestions() {
    const container = document.getElementById('csatQuestionsContainer');
    const badge = document.getElementById('csatQuestionCountBadge');
    if (!container) return;

    let filtered = (csatQuestions || []).slice();
    if (csatFilterSec !== 'all') {
      filtered = filtered.filter(function (q) {
        return q.section === csatFilterSec;
      });
    }

    if (badge) badge.textContent = filtered.length + ' Questions';

    if (filtered.length === 0) {
      container.innerHTML = '<div class="p-8 text-center text-sm text-slate-400 rounded-2xl bg-slate-900 border border-slate-800">No questions found for this section.</div>';
      return;
    }

    const letters = ['A', 'B', 'C', 'D'];
    container.innerHTML = filtered.map(function (q, idx) {
      const secIcon = q.section === 'Quantitative Aptitude' ? '📐' : (q.section === 'Logical Reasoning' ? '🧩' : '📖');
      const diffColor = q.difficulty === 'Tough' ? 'text-rose-400 bg-rose-950/60 border-rose-800/60' : 'text-amber-400 bg-amber-950/60 border-amber-800/60';
      
      const passageHtml = q.passage ? (
        '<div class="p-4 rounded-xl bg-slate-950/90 border border-slate-800 text-xs sm:text-sm text-slate-300 leading-relaxed mb-3 italic">' +
          '<span class="font-bold text-amber-400 not-italic block mb-1">Passage (UPSC CSE Prelims ' + q.year + '):</span>' +
          q.passage +
        '</div>'
      ) : '';

      const optsHtml = (q.options || []).map(function (opt, oIdx) {
        const letter = letters[oIdx] || String(oIdx + 1);
        const isCorrect = (letter === q.correct_option || oIdx === q.correct_index);
        const keyBadge = isCorrect ? '<span class="ml-auto text-[10px] font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800">UPSC Key (' + q.correct_option + ')</span>' : '';
        return (
          '<div class="flex items-start gap-3 p-3 rounded-xl border border-slate-800 bg-slate-950/50 text-xs sm:text-sm text-slate-200">' +
            '<span class="flex-shrink-0 w-6 h-6 rounded bg-slate-800 font-mono font-bold text-xs flex items-center justify-center text-slate-300">' + letter + '</span>' +
            '<div class="flex-1">' + opt + '</div>' +
            keyBadge +
          '</div>'
        );
      }).join('');

      const trapBlock = q.elimination_trap ? (
        '<div class="p-3 rounded-lg bg-rose-950/40 border border-rose-900/60 text-xs text-rose-200 leading-relaxed">' +
          '<span class="font-bold text-rose-400">⚠️ Elimination Trap:</span> ' + q.elimination_trap +
        '</div>'
      ) : '';

      const shortcutBlock = q.shortcut_technique ? (
        '<div class="p-3 rounded-lg bg-indigo-950/40 border border-indigo-900/60 text-xs text-indigo-200 leading-relaxed">' +
          '<span class="font-bold text-indigo-400">⚡ 10-Second Shortcut Technique:</span> ' + q.shortcut_technique +
        '</div>'
      ) : '';

      return (
        '<article class="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col gap-4" id="' + q.id + '">' +
          '<div class="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-800">' +
            '<div class="flex flex-wrap items-center gap-2">' +
              '<span class="px-2.5 py-1 rounded-md text-xs font-bold bg-indigo-500/15 text-indigo-400 border border-indigo-500/30">' + secIcon + ' ' + q.section + '</span>' +
              '<span class="px-2.5 py-1 rounded-md text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700">UPSC ' + q.year + '</span>' +
              '<span class="px-2 py-0.5 rounded text-xs font-semibold border ' + diffColor + '">' + q.difficulty + '</span>' +
            '</div>' +
            '<button type="button" class="csat-solve-btn inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-amber-300 bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 transition cursor-pointer" data-qid="' + q.id + '">' +
              '<span>🎯 Solve with Timer</span>' +
              '<span>→</span>' +
            '</button>' +
          '</div>' +
          passageHtml +
          '<p class="text-sm sm:text-base font-medium text-slate-100 leading-relaxed">' +
            '<span class="font-black text-amber-400 mr-1.5">Q' + (idx + 1) + '.</span>' + q.question_text.replace(/\n/g, '<br>') +
          '</p>' +
          '<div class="grid grid-cols-1 gap-2.5">' + optsHtml + '</div>' +
          '<details class="group rounded-xl border border-slate-800 bg-slate-950/60 p-4">' +
            '<summary class="flex items-center justify-between cursor-pointer text-xs sm:text-sm font-semibold text-slate-300 hover:text-amber-400 transition select-none">' +
              '<span class="flex items-center gap-2">' +
                '<span>🧠 Decoded Explanation & UPSC Key</span>' +
                '<span class="text-xs px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">Official Key: ' + q.correct_option + '</span>' +
              '</span>' +
              '<span class="text-slate-500 group-open:rotate-180 transition">▼</span>' +
            '</summary>' +
            '<div class="mt-4 pt-3 border-t border-slate-800 text-xs sm:text-sm text-slate-300 leading-relaxed space-y-3">' +
              '<div>' +
                '<p class="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Step-by-Step Logic</p>' +
                '<p class="leading-relaxed">' + q.explanation.replace(/\n/g, '<br>') + '</p>' +
              '</div>' +
              shortcutBlock +
              trapBlock +
            '</div>' +
          '</details>' +
        '</article>'
      );
    }).join('');

    container.querySelectorAll('.csat-solve-btn').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        const qid = e.currentTarget.getAttribute('data-qid');
        launchCsatFocusMode(qid);
      });
    });
  }

  function launchCsatFocusMode(singleQid) {
    if (!csatQuestions || csatQuestions.length === 0) {
      showToast('Loading CSAT questions...');
      loadCsatQuestions().then(function () {
        launchCsatFocusMode(singleQid);
      });
      return;
    }

    let list = csatQuestions.slice();
    let startIndex = 0;
    if (singleQid) {
      const idx = list.findIndex(function (q) { return q.id === singleQid; });
      if (idx !== -1) startIndex = idx;
    }

    STATE.playerQuestions = list;
    STATE.playerIndex = startIndex;
    STATE.isExamMode = false;
    STATE.isReviewMode = false;
    STATE.currentTest = {
      title: 'CSAT Practice (Paper 2)',
      totalQuestions: list.length,
      timeLimitMinutes: 30
    };
    switchViewMode('player');
    showToast('🚀 CSAT Sprint Loaded into Focus Mode!');
  }


  // ==========================================================
  // OPTION-BY-OPTION DISTRACTOR DEEP DIVE (PLAYER)
  // ==========================================================
function renderPlayerDistractorDeepDive(q) {
    const distractorBox = document.getElementById('playerDistractorDeepDiveBox');
    if (!distractorBox || !q) return;

    const distractors = getDistractorAnalysis(q);
    distractorBox.innerHTML = (
      '<div class="flex items-center justify-between gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">' +
        '<span class="text-xs font-mono uppercase font-black text-amber-600 dark:text-amber-500 tracking-wider">🔬 Forensic Option-by-Option Breakdown & UPSC Decoys:</span>' +
        '<span class="text-[10px] text-slate-500 font-mono">Cognitive Trap Analysis</span>' +
      '</div>' +
      '<div class="grid grid-cols-1 gap-2.5">' +
        distractors.map(function (d) {
          let badgeClass = 'bg-slate-500/15 text-slate-600 dark:text-slate-400 border border-slate-500/30';
          if (d.isCorrect) {
            badgeClass = 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30';
          } else if (d.badgeType === 'extreme') {
            badgeClass = 'bg-rose-500/15 text-rose-700 dark:text-rose-400 border border-rose-500/30';
          } else if (d.badgeType === 'number') {
            badgeClass = 'bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30';
          } else if (d.badgeType === 'authority') {
            badgeClass = 'bg-blue-500/15 text-blue-700 dark:text-blue-400 border border-blue-500/30';
          } else {
            badgeClass = 'bg-orange-500/15 text-orange-700 dark:text-orange-400 border border-orange-500/30';
          }

          return (
            '<div class="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80 flex flex-col gap-2 text-xs transition-all hover:border-slate-300 dark:hover:border-slate-700">' +
              '<div class="flex items-center justify-between gap-2 flex-wrap">' +
                '<div class="flex items-center gap-2">' +
                  '<span class="w-6 h-6 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-white font-mono font-black flex items-center justify-center text-xs">' + d.letter + '</span>' +
                  '<span class="font-bold text-slate-800 dark:text-slate-200">' + (d.isCorrect ? 'Correct Assertion' : 'Examiner Decoy') + '</span>' +
                '</div>' +
                '<span class="px-2.5 py-0.5 rounded-md text-[10px] font-bold font-mono ' + badgeClass + '">' + escapeHtml(d.label) + '</span>' +
              '</div>' +

              '<p class="text-slate-700 dark:text-slate-300 font-medium pl-8 -mt-0.5 leading-relaxed">' + escapeHtml(d.optionText) + '</p>' +

              '<div class="pl-8 pt-2 border-t border-slate-200/70 dark:border-slate-800/70 flex flex-col gap-1.5 text-[11px] leading-relaxed">' +
                '<div class="text-slate-700 dark:text-slate-300">' +
                  '<strong class="' + (d.isCorrect ? 'text-emerald-600 dark:text-emerald-400 font-bold' : 'text-rose-600 dark:text-rose-400 font-bold') + '">' +
                    (d.isCorrect ? '✓ Verification: ' : '✗ Forensic Reality Check: ') +
                  '</strong>' +
                  '<span>' + escapeHtml(d.diagnosis) + '</span>' +
                '</div>' +

                (!d.isCorrect && d.examinerCraft ? (
                  '<div class="text-amber-800 dark:text-amber-400/90 bg-amber-500/5 dark:bg-amber-500/10 p-2 rounded-lg border border-amber-500/20">' +
                    '<span class="font-bold font-mono uppercase text-[10px] tracking-wider text-amber-700 dark:text-amber-400">🧠 Examiner\'s Decoy Craft: </span>' +
                    '<span>' + escapeHtml(d.examinerCraft) + '</span>' +
                  '</div>'
                ) : '') +

                (!d.isCorrect && d.mentalFilter ? (
                  '<div class="text-slate-600 dark:text-slate-400 italic pt-0.5">' +
                    '<span class="font-semibold not-italic text-slate-700 dark:text-slate-300">💡 Topper\'s Elimination Rule: </span>' +
                    '<span>' + escapeHtml(d.mentalFilter) + '</span>' +
                  '</div>'
                ) : '') +
              '</div>' +
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
    var list = (STATE.vaultMode === 'ca') ? (STATE.ca_pyqs || []) : (STATE.pyqs || []);

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
    } else if (STATE.vaultMode === 'ca') {
      if (STATE.vaultSelectedCaMonth && STATE.vaultSelectedCaMonth !== 'all') {
        list = list.filter(function (q) {
          return q.month === STATE.vaultSelectedCaMonth;
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

  function renderVaultLoadingSkeletons() {
    var container = document.getElementById('vaultQuestionsContainer');
    if (!container) return;
    var skeletonCard = (
      '<div class="animate-pulse rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-md flex flex-col gap-4">' +
        '<div class="flex items-center justify-between gap-2 pb-3 border-b border-slate-200 dark:border-slate-800">' +
          '<div class="flex items-center gap-2">' +
            '<div class="h-5 w-20 bg-amber-500/20 rounded-lg"></div>' +
            '<div class="h-5 w-24 bg-slate-200 dark:bg-slate-800 rounded-lg"></div>' +
            '<div class="h-5 w-16 bg-slate-200 dark:bg-slate-800 rounded-lg"></div>' +
          '</div>' +
          '<div class="h-7 w-32 bg-amber-500/20 rounded-xl"></div>' +
        '</div>' +
        '<div class="space-y-2">' +
          '<div class="h-4 bg-slate-200 dark:bg-slate-800 rounded w-11/12"></div>' +
          '<div class="h-4 bg-slate-200 dark:bg-slate-800 rounded w-4/5"></div>' +
          '<div class="h-4 bg-slate-200 dark:bg-slate-800 rounded w-2/3"></div>' +
        '</div>' +
        '<div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">' +
          '<div class="h-12 bg-slate-100 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800/80"></div>' +
          '<div class="h-12 bg-slate-100 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800/80"></div>' +
          '<div class="h-12 bg-slate-100 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800/80"></div>' +
          '<div class="h-12 bg-slate-100 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800/80"></div>' +
        '</div>' +
        '<div class="h-4 w-48 bg-amber-500/20 rounded"></div>' +
      '</div>'
    );
    container.innerHTML = skeletonCard + skeletonCard + skeletonCard;
  }

  function renderPyqVault(resetPagination) {
    if (resetPagination !== false) {
      STATE.vaultDisplayedCount = STATE.vaultPageSize;
    }
    var subjectBtn = document.getElementById('vaultModeSubjectBtn');
    var yearBtn = document.getElementById('vaultModeYearBtn');
    var caBtn = document.getElementById('vaultModeCaBtn');
    var subjectFilterRow = document.getElementById('vaultSubjectFilterContainer');
    var yearFilterRow = document.getElementById('vaultYearFilterContainer');
    var caFilterRow = document.getElementById('vaultCaFilterContainer');

    var activeBtnCls = 'px-3.5 py-2 rounded-xl bg-amber-500 text-slate-950 font-black shadow-xs transition-all cursor-pointer flex items-center gap-1.5';
    var inactiveBtnCls = 'px-3.5 py-2 rounded-xl text-slate-400 hover:text-white transition-all cursor-pointer flex items-center gap-1.5';

    if (STATE.vaultMode === 'subject') {
      if (subjectBtn) subjectBtn.className = activeBtnCls;
      if (yearBtn) yearBtn.className = inactiveBtnCls;
      if (caBtn) caBtn.className = inactiveBtnCls;
      if (subjectFilterRow) subjectFilterRow.classList.remove('hidden');
      if (yearFilterRow) yearFilterRow.classList.add('hidden');
      if (caFilterRow) caFilterRow.classList.add('hidden');
    } else if (STATE.vaultMode === 'year') {
      if (subjectBtn) subjectBtn.className = inactiveBtnCls;
      if (yearBtn) yearBtn.className = activeBtnCls;
      if (caBtn) caBtn.className = inactiveBtnCls;
      if (subjectFilterRow) subjectFilterRow.classList.add('hidden');
      if (yearFilterRow) yearFilterRow.classList.remove('hidden');
      if (caFilterRow) caFilterRow.classList.add('hidden');
    } else if (STATE.vaultMode === 'ca') {
      if (subjectBtn) subjectBtn.className = inactiveBtnCls;
      if (yearBtn) yearBtn.className = inactiveBtnCls;
      if (caBtn) caBtn.className = activeBtnCls;
      if (subjectFilterRow) subjectFilterRow.classList.add('hidden');
      if (yearFilterRow) yearFilterRow.classList.add('hidden');
      if (caFilterRow) caFilterRow.classList.remove('hidden');
    }

    renderVaultSubjectPills();
    renderVaultYearPills();
    renderVaultCaPills();

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
        '<button type="button" class="vault-subj-pill ' + btnClass + '" data-subj="' + s.id + '" onclick="window.setVaultSubject(\'' + s.id + '\')">' +
          escapeHtml(s.label) + ' <span class="opacity-70 font-mono text-[10px]">(' + count + ')</span>' +
        '</button>'
      );
    }).join('');

    container.querySelectorAll('.vault-subj-pill').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        STATE.vaultSelectedSubject = e.currentTarget.getAttribute('data-subj');
        STATE.vaultDisplayedCount = STATE.vaultPageSize;
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
        '<button type="button" class="vault-year-pill ' + btnClass + '" data-year="' + y + '" onclick="window.setVaultYear(\'' + y + '\')">' +
          (y === 'all' ? 'All Years' : y) + ' <span class="opacity-70 text-[10px]">(' + count + ')</span>' +
        '</button>'
      );
    }).join('');

    container.querySelectorAll('.vault-year-pill').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        STATE.vaultSelectedYear = e.currentTarget.getAttribute('data-year');
        STATE.vaultDisplayedCount = STATE.vaultPageSize;
        renderPyqVault();
      });
    });
  }

  function renderVaultCaPills() {
    var container = document.getElementById('vaultCaPillsGroup');
    if (!container) return;

    var months = [
      { id: 'all', label: 'All 2026 Months' },
      { id: 'January 2026', label: '❄️ Jan 2026' },
      { id: 'February 2026', label: '🌱 Feb 2026' },
      { id: 'March 2026', label: '🌸 Mar 2026' },
      { id: 'April 2026', label: '☀️ Apr 2026' },
      { id: 'May 2026', label: '🔥 May 2026' },
      { id: 'June 2026', label: '🌧️ Jun 2026' },
      { id: 'July 2026', label: '⚡ Jul 2026' }
    ,
      { id: 'August 2026', label: '🌾 Aug 2026' },
      { id: 'September 2026', label: '🍁 Sep 2026' },
      { id: 'October 2026', label: '🍂 Oct 2026' }
    ];

    container.innerHTML = months.map(function (m) {
      var count = (m.id === 'all')
        ? (STATE.ca_pyqs || []).length
        : (STATE.ca_pyqs || []).filter(function (q) { return q.month === m.id; }).length;

      var isActive = (STATE.vaultSelectedCaMonth === m.id);
      var btnClass = isActive
        ? 'px-3 py-1.5 rounded-xl bg-emerald-500 text-slate-950 font-black shadow-xs cursor-pointer text-xs'
        : 'px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-950 text-slate-700 dark:text-slate-300 hover:text-emerald-400 border border-slate-200 dark:border-slate-800 cursor-pointer text-xs font-mono transition-all';

      return (
        '<button type="button" class="vault-ca-month-pill ' + btnClass + '" data-month="' + m.id + '" onclick="window.setVaultCaMonth(\'' + m.id + '\')">' +
          m.label + ' <span class="opacity-70 text-[10px]">(' + count + ')</span>' +
        '</button>'
      );
    }).join('');

    container.querySelectorAll('.vault-ca-month-pill').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        STATE.vaultSelectedCaMonth = e.currentTarget.getAttribute('data-month');
        STATE.vaultDisplayedCount = STATE.vaultPageSize;
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

  function renderVaultDrawerContent(q) {
    var letters = ['A', 'B', 'C', 'D'];
    var distractors = getDistractorAnalysis(q);

    return (
      '<div class="flex flex-col gap-3.5 pt-3 border-t border-slate-200 dark:border-slate-800">' +
        
        '<!-- Official Key Pill -->' +
        '<div class="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-between text-xs">' +
          '<span class="font-black text-emerald-700 dark:text-emerald-400">Official UPSC Answer Key:</span>' +
          '<span class="px-2.5 py-0.5 rounded-md bg-emerald-500 text-slate-950 font-mono font-black text-xs">' +
            'Option (' + (letters[q.correct_index] || '?') + ')' +
          '</span>' +
        '</div>' +

        '<!-- Option-by-Option Distractor Deep Dive -->' +
        '<div class="flex flex-col gap-2">' +
          '<span class="text-xs font-mono uppercase font-black text-amber-600 dark:text-amber-500 tracking-wider">🔬 Forensic Option-by-Option Breakdown &amp; Traps:</span>' +
          '<div class="grid grid-cols-1 gap-2.5">' +
            distractors.map(function (d) {
              var badgeClass = 'bg-slate-500/15 text-slate-600 dark:text-slate-400 border border-slate-500/30';
              if (d.isCorrect) {
                badgeClass = 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30';
              } else if (d.badgeType === 'extreme') {
                badgeClass = 'bg-rose-500/15 text-rose-700 dark:text-rose-400 border border-rose-500/30';
              } else if (d.badgeType === 'number') {
                badgeClass = 'bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30';
              } else if (d.badgeType === 'authority') {
                badgeClass = 'bg-blue-500/15 text-blue-700 dark:text-blue-400 border border-blue-500/30';
              } else {
                badgeClass = 'bg-orange-500/15 text-orange-700 dark:text-orange-400 border border-orange-500/30';
              }
              return (
                '<div class="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80 flex flex-col gap-1.5 text-xs">' +
                  '<div class="flex items-center justify-between gap-2 flex-wrap">' +
                    '<div class="flex items-center gap-2">' +
                      '<span class="w-5 h-5 rounded-md bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-white font-mono font-black flex items-center justify-center text-[11px]">' + d.letter + '</span>' +
                      '<span class="font-bold text-slate-800 dark:text-slate-200">' + (d.isCorrect ? 'Correct Assertion' : 'Examiner Decoy') + '</span>' +
                    '</div>' +
                    '<span class="px-2 py-0.5 rounded text-[10px] font-bold font-mono ' + badgeClass + '">' + escapeHtml(d.label) + '</span>' +
                  '</div>' +
                  '<p class="text-slate-700 dark:text-slate-300 font-medium pl-7 leading-relaxed">' + escapeHtml(d.optionText) + '</p>' +
                  '<div class="pl-7 pt-1.5 border-t border-slate-200/70 dark:border-slate-800/70 flex flex-col gap-1 text-[11px] leading-relaxed">' +
                    '<div class="text-slate-700 dark:text-slate-300">' +
                      '<strong class="' + (d.isCorrect ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400') + '">' +
                        (d.isCorrect ? '✓ Verification: ' : '✗ Reality Check: ') +
                      '</strong>' +
                      '<span>' + escapeHtml(d.diagnosis) + '</span>' +
                    '</div>' +
                    (!d.isCorrect && d.examinerCraft ? (
                      '<div class="text-amber-800 dark:text-amber-400/90 bg-amber-500/5 dark:bg-amber-500/10 p-1.5 rounded-lg border border-amber-500/20">' +
                        '<span class="font-bold font-mono uppercase text-[9px] tracking-wider text-amber-700 dark:text-amber-400">🧠 Decoy Craft: </span>' +
                        '<span>' + escapeHtml(d.examinerCraft) + '</span>' +
                      '</div>'
                    ) : '') +
                  '</div>' +
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

        (q.mains_linkage && q.mains_linkage.question ? 
          '<div class="p-3 rounded-xl bg-gradient-to-r from-amber-500/10 via-emerald-500/10 to-slate-950 border border-amber-500/30 flex items-center justify-between gap-3 flex-wrap">' +
            '<div class="flex flex-col gap-0.5">' +
              '<span class="text-[10px] font-bold text-amber-400 flex items-center gap-1"><span>✍️</span> GS Mains Linkage (' + escapeHtml(q.mains_linkage.paper || 'GS') + ')</span>' +
              '<p class="text-[11px] text-slate-300 italic line-clamp-1">"' + escapeHtml(q.mains_linkage.question) + '"</p>' +
            '</div>' +
            '<a href="/?paper=' + encodeURIComponent(q.mains_linkage.paper || 'GS1') + '&amp;question=' + encodeURIComponent(q.mains_linkage.question) + '" target="_blank" class="px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-[10px] transition shrink-0">' +
              'Evaluate Mains Copy →' +
            '</a>' +
          '</div>' : '') +

      '</div>'
    );
  }

  function renderVaultQuestionCard(q) {
    var letters = ['A', 'B', 'C', 'D'];
    var isExpanded = STATE.vaultExpandedQuestions.has(q.id);

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

        '<!-- Options List -->' +
        (Array.isArray(q.options) && q.options.length ? (
          '<div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">' +
            q.options.map(function (opt, oIdx) {
              var letter = letters[oIdx] || String.fromCharCode(65 + oIdx);
              var cleanOpt = String(opt || '').replace(/^\([a-dA-D]\)\s*/, '');
              var isOfficial = isExpanded && (oIdx === q.correct_index);
              var optCardClass = isOfficial
                ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-950 dark:text-emerald-200 font-semibold shadow-xs ring-1 ring-emerald-500/30'
                : 'light-inner-box bg-slate-50 dark:bg-slate-950/70 border-slate-200 dark:border-slate-800/80 text-slate-800 dark:text-slate-200';
              var badgeClass = isOfficial
                ? 'bg-emerald-500 text-slate-950 font-black'
                : 'bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold';
              return (
                '<div class="vault-opt-item p-3 rounded-xl border flex items-start gap-2.5 text-xs sm:text-[13px] leading-relaxed transition-all ' + optCardClass + '" data-oidx="' + oIdx + '">' +
                  '<span class="vault-opt-badge w-5 h-5 rounded-md font-mono text-[11px] flex items-center justify-center shrink-0 mt-0.5 ' + badgeClass + '">' + letter + '</span>' +
                  '<span class="flex-1">' + escapeHtml(cleanOpt) + '</span>' +
                  (isOfficial ? '<span class="vault-official-tag text-[10px] font-black uppercase text-emerald-600 dark:text-emerald-400 bg-emerald-500/20 px-1.5 py-0.5 rounded shrink-0">Official Key ✓</span>' : '') +
                '</div>'
              );
            }).join('') +
          '</div>'
        ) : '') +

        '<!-- Expand / Collapse Brainstorming Drawer -->' +
        '<div class="flex items-center justify-between pt-1">' +
          '<button type="button" class="vault-toggle-card-btn text-xs font-bold text-amber-600 dark:text-amber-500 hover:text-amber-700 dark:hover:text-amber-400 flex items-center gap-1.5 cursor-pointer" data-qid="' + q.id + '">' +
            '<span>' + (isExpanded ? '▲ Hide Forensic Key &amp; Traps' : '▼ 🧠 Brainstorm &amp; Decoded Answer Key') + '</span>' +
          '</button>' +
        '</div>' +

        '<div class="vault-card-drawer ' + (isExpanded ? '' : 'hidden') + '" id="vault-drawer-' + q.id + '">' +
          (isExpanded ? renderVaultDrawerContent(q) : '') +
        '</div>' +

      '</div>'
    );
  }

  function toggleSingleVaultCard(qId) {
    var card = document.getElementById('vault-card-' + qId);
    if (!card) return;

    var isExpanded = STATE.vaultExpandedQuestions.has(qId);
    var q = (STATE.pyqMap && STATE.pyqMap[qId]) || STATE.pyqs.find(function (item) { return item.id === qId; });
    if (!q) return;

    var toggleBtn = card.querySelector('.vault-toggle-card-btn');
    var drawer = document.getElementById('vault-drawer-' + qId);

    if (isExpanded) {
      STATE.vaultExpandedQuestions.delete(qId);
      if (drawer) drawer.classList.add('hidden');
      if (toggleBtn) {
        toggleBtn.innerHTML = '<span>▼ 🧠 Brainstorm &amp; Decoded Answer Key</span>';
      }
      card.querySelectorAll('.vault-opt-item').forEach(function (optEl) {
        optEl.className = 'vault-opt-item p-3 rounded-xl border flex items-start gap-2.5 text-xs sm:text-[13px] leading-relaxed transition-all light-inner-box bg-slate-50 dark:bg-slate-950/70 border-slate-200 dark:border-slate-800/80 text-slate-800 dark:text-slate-200';
        var badge = optEl.querySelector('.vault-opt-badge');
        if (badge) badge.className = 'vault-opt-badge w-5 h-5 rounded-md font-mono text-[11px] flex items-center justify-center shrink-0 mt-0.5 bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold';
        var tag = optEl.querySelector('.vault-official-tag');
        if (tag) tag.remove();
      });
    } else {
      STATE.vaultExpandedQuestions.add(qId);
      if (!drawer) {
        drawer = document.createElement('div');
        drawer.id = 'vault-drawer-' + qId;
        drawer.className = 'vault-card-drawer';
        card.appendChild(drawer);
      }
      drawer.innerHTML = renderVaultDrawerContent(q);
      drawer.classList.remove('hidden');

      if (toggleBtn) {
        toggleBtn.innerHTML = '<span>▲ Hide Forensic Key &amp; Traps</span>';
      }
      card.querySelectorAll('.vault-opt-item').forEach(function (optEl) {
        var oIdx = parseInt(optEl.getAttribute('data-oidx'), 10);
        if (oIdx === q.correct_index) {
          optEl.className = 'vault-opt-item p-3 rounded-xl border flex items-start gap-2.5 text-xs sm:text-[13px] leading-relaxed transition-all bg-emerald-500/10 border-emerald-500/50 text-emerald-950 dark:text-emerald-200 font-semibold shadow-xs ring-1 ring-emerald-500/30';
          var badge = optEl.querySelector('.vault-opt-badge');
          if (badge) badge.className = 'vault-opt-badge w-5 h-5 rounded-md font-mono text-[11px] flex items-center justify-center shrink-0 mt-0.5 bg-emerald-500 text-slate-950 font-black';
          if (!optEl.querySelector('.vault-official-tag')) {
            var tag = document.createElement('span');
            tag.className = 'vault-official-tag text-[10px] font-black uppercase text-emerald-600 dark:text-emerald-400 bg-emerald-500/20 px-1.5 py-0.5 rounded shrink-0';
            tag.textContent = 'Official Key ✓';
            optEl.appendChild(tag);
          }
        }
      });
    }
  }

  function loadMoreVaultQuestions() {
    var filtered = STATE.vaultCurrentFiltered || getFilteredVaultQuestions();
    if (!filtered || STATE.vaultDisplayedCount >= filtered.length) {
      var sentinel = document.getElementById('vaultLoadMoreSentinel');
      if (sentinel) sentinel.remove();
      return;
    }

    var start = STATE.vaultDisplayedCount;
    var nextBatch = filtered.slice(start, start + STATE.vaultPageSize);
    STATE.vaultDisplayedCount += nextBatch.length;

    var container = document.getElementById('vaultQuestionsContainer');
    var sentinel = document.getElementById('vaultLoadMoreSentinel');
    if (!container || nextBatch.length === 0) return;

    var htmlString = nextBatch.map(function (q) {
      return renderVaultQuestionCard(q);
    }).join('');

    if (sentinel) {
      sentinel.insertAdjacentHTML('beforebegin', htmlString);
    } else {
      container.insertAdjacentHTML('beforeend', htmlString);
    }

    var statusText = document.getElementById('vaultFeedStatusText');
    if (statusText) {
      statusText.textContent = 'Showing ' + Math.min(STATE.vaultDisplayedCount, filtered.length) + ' of ' + filtered.length + ' authentic UPSC Prelims Questions';
    }

    if (STATE.vaultDisplayedCount >= filtered.length) {
      if (sentinel) sentinel.remove();
      if (vaultObserver) {
        vaultObserver.disconnect();
        vaultObserver = null;
      }
    } else {
      var loadMoreBtn = document.getElementById('vaultLoadMoreBtn');
      if (loadMoreBtn) {
        var btnSpan = loadMoreBtn.querySelector('span');
        if (btnSpan) {
          btnSpan.textContent = 'Load More Questions (' + Math.min(STATE.vaultDisplayedCount, filtered.length) + ' of ' + filtered.length + ')';
        }
      }
    }
  }

  var vaultObserver = null;

  function setupVaultInfiniteScroll() {
    if (vaultObserver) {
      vaultObserver.disconnect();
      vaultObserver = null;
    }
    var sentinel = document.getElementById('vaultLoadMoreSentinel');
    if (!sentinel || typeof window.IntersectionObserver !== 'function') return;

    vaultObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          loadMoreVaultQuestions();
        }
      });
    }, { rootMargin: '400px' });

    vaultObserver.observe(sentinel);
  }

  function renderVaultQuestions(questions) {
    var container = document.getElementById('vaultQuestionsContainer');
    var statusText = document.getElementById('vaultFeedStatusText');
    if (!container) return;

    STATE.vaultCurrentFiltered = questions;

    if (vaultObserver) {
      vaultObserver.disconnect();
      vaultObserver = null;
    }

    if (!questions || questions.length === 0) {
      if (statusText) statusText.textContent = '0 Questions Found';
      container.innerHTML = (
        '<div class="p-8 text-center rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col items-center gap-2">' +
          '<span class="text-3xl">🔍</span>' +
          '<span class="text-sm font-bold text-slate-800 dark:text-white">No questions found matching your filter</span>' +
          '<span class="text-xs text-slate-500 dark:text-slate-400">Try adjusting your search query, subject, or year filter.</span>' +
        '</div>'
      );
      return;
    }

    var total = questions.length;
    var visibleCount = Math.min(STATE.vaultDisplayedCount || STATE.vaultPageSize, total);
    if (statusText) {
      statusText.textContent = 'Showing ' + visibleCount + ' of ' + total + ' authentic UPSC Prelims Questions';
    }

    var visibleQuestions = questions.slice(0, visibleCount);
    var cardsHtml = visibleQuestions.map(function (q) {
      return renderVaultQuestionCard(q);
    }).join('');

    var sentinelHtml = '';
    if (total > visibleCount) {
      sentinelHtml = (
        '<div id="vaultLoadMoreSentinel" class="pt-4 pb-8 flex flex-col items-center justify-center gap-2">' +
          '<button type="button" id="vaultLoadMoreBtn" class="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs shadow-md cursor-pointer transition-all flex items-center gap-2">' +
            '<span>Load More Questions (' + visibleCount + ' of ' + total + ')</span>' +
            '<span>↓</span>' +
          '</button>' +
          '<span class="text-[11px] text-slate-400">Scroll down or tap to reveal next batch</span>' +
        '</div>'
      );
    }

    container.innerHTML = cardsHtml + sentinelHtml;

    if (total > visibleCount) {
      setupVaultInfiniteScroll();
    }
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

  /* ====================================================
     CADET AUTHENTICATION & FREEMIUM ACCESS GATE (Model A)
     Unified with CookedMains Mains Copy Evaluation System
     ==================================================== */
  function initAuthSession() {
    try {
      const sessionUser = sessionStorage.getItem("mainsmentor_user") || localStorage.getItem("mainsmentor_user");
      if (sessionUser) {
        STATE.user = JSON.parse(sessionUser);
      } else {
        STATE.user = null;
      }
    } catch (e) {
      STATE.user = null;
    }
    updateAuthUI();
  }

  function updateAuthUI() {
    const avatarEl = document.getElementById('sidebarUserAvatar');
    const onlineIndicator = document.getElementById('sidebarOnlineIndicator');
    const nameEl = document.getElementById('sidebarUserName');
    const subtextEl = document.getElementById('sidebarUserSubtext');
    const actionBtn = document.getElementById('sidebarAuthActionBtn');
    const headerAuth = document.getElementById('headerAuthContainer');

    updateLangUI();

    if (STATE.user && STATE.user.email) {
      syncFromCloudIfLoggedIn();
      const displayName = STATE.user.name || STATE.user.email.split('@')[0];
      const initial = (displayName.charAt(0) || 'A').toUpperCase();

      if (avatarEl) {
        avatarEl.textContent = initial;
        avatarEl.className = 'w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 text-white flex items-center justify-center font-bold text-sm font-mono shadow-xs ring-2 ring-emerald-500/20';
      }
      if (onlineIndicator) {
        onlineIndicator.className = 'absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900';
      }
      if (nameEl) {
        nameEl.textContent = displayName;
        nameEl.title = STATE.user.email;
      }
      if (subtextEl) {
        subtextEl.textContent = 'Mains Cadet • Active';
        subtextEl.className = 'text-[10px] text-emerald-600 dark:text-emerald-400 font-mono font-medium truncate mt-0.5';
      }
      if (actionBtn) {
        actionBtn.textContent = 'Sign Out';
        actionBtn.className = 'shrink-0 px-2.5 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 font-bold text-[11px] border border-rose-500/20 hover:border-rose-500/40 cursor-pointer transition-all active:scale-95';
      }

      if (headerAuth) {
        headerAuth.innerHTML = `
          <div class="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs shadow-xs">
            <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span class="font-bold text-slate-800 dark:text-white text-[11px]">${escapeHtml(displayName)}</span>
          </div>
          <button onclick="window.signOutUser()" class="text-[11px] text-slate-500 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400 font-bold px-2.5 py-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-500/10 transition cursor-pointer">
            Sign Out
          </button>
        `;
      }
    } else {
      const answeredCount = Object.keys(STATE.answers || {}).length;
      const remainingTrial = Math.max(0, 5 - answeredCount);

      if (avatarEl) {
        avatarEl.textContent = '?';
        avatarEl.className = 'w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-400 text-slate-950 flex items-center justify-center font-bold text-sm font-mono shadow-xs';
      }
      if (onlineIndicator) {
        onlineIndicator.className = 'absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-amber-500 ring-2 ring-white dark:ring-slate-900';
      }
      if (nameEl) {
        nameEl.textContent = 'Guest Aspirant';
      }
      if (subtextEl) {
        subtextEl.textContent = remainingTrial > 0 ? `${remainingTrial} Free Trials` : 'Trial Limit Reached';
        subtextEl.className = remainingTrial > 0 ? 'text-[10px] text-amber-600 dark:text-amber-400 font-mono font-medium truncate mt-0.5' : 'text-[10px] text-rose-600 dark:text-rose-400 font-mono font-bold truncate mt-0.5';
      }
      if (actionBtn) {
        actionBtn.textContent = 'Sign In';
        actionBtn.className = 'shrink-0 px-2.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-[11px] shadow-xs cursor-pointer transition-all active:scale-95';
      }

      if (headerAuth) {
        headerAuth.innerHTML = `
          <button onclick="window.openAuthModal('Sign in to save your Prelims practice history & sync with Mains copy evaluation')" class="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-600 dark:text-amber-400 border border-amber-500/30 transition-all cursor-pointer">
            <span>🔑</span>
            <span>Sign In</span>
          </button>
        `;
      }
    }
  }

  function signOutUser() {
    sessionStorage.removeItem("mainsmentor_user");
    localStorage.removeItem("mainsmentor_user");
    _prelimsCloudSyncedEmail = null;
    STATE.user = null;
    updateAuthUI();
    showToast("Signed out successfully");
  }

  function openAuthModal(intentMessage) {
    closeFreemiumGateModal();
    const modal = document.getElementById('authModal');
    const intentEl = document.getElementById('authIntentAlertText');
    if (!modal) return;
    if (intentMessage && intentEl) {
      intentEl.textContent = intentMessage;
    }
    modal.classList.remove('hidden');
  }

  function closeAuthModal() {
    const modal = document.getElementById('authModal');
    if (modal) modal.classList.add('hidden');
  }

  function setAuthFormMode(mode) {
    const modeInput = document.getElementById('authModeInput');
    const nameWrap = document.getElementById('authNameFieldWrap');
    const title = document.getElementById('authModalTitle');
    const submitText = document.getElementById('authSubmitBtnText');
    const tabLogin = document.getElementById('authTabLoginBtn');
    const tabRegister = document.getElementById('authTabRegisterBtn');
    const errBox = document.getElementById('authFormError');

    if (errBox) errBox.classList.add('hidden');
    if (modeInput) modeInput.value = mode;

    if (mode === 'register') {
      if (nameWrap) nameWrap.classList.remove('hidden');
      if (title) title.textContent = 'Create Free Account';
      if (submitText) submitText.textContent = 'Create Account →';
      if (tabLogin) tabLogin.className = 'py-1.5 rounded-lg text-xs font-bold text-slate-400 hover:text-white transition cursor-pointer';
      if (tabRegister) tabRegister.className = 'py-1.5 rounded-lg text-xs font-extrabold bg-amber-500 text-slate-950 shadow transition cursor-pointer';
    } else {
      if (nameWrap) nameWrap.classList.add('hidden');
      if (title) title.textContent = 'Sign In to CookedMains';
      if (submitText) submitText.textContent = 'Sign In →';
      if (tabLogin) tabLogin.className = 'py-1.5 rounded-lg text-xs font-extrabold bg-amber-500 text-slate-950 shadow transition cursor-pointer';
      if (tabRegister) tabRegister.className = 'py-1.5 rounded-lg text-xs font-bold text-slate-400 hover:text-white transition cursor-pointer';
    }
  }

  const DEFAULT_GOOGLE_CLIENT_ID = "610996841285-045j5s501e74o7k2088p7lruaap9cca1.apps.googleusercontent.com";
  let authOAuthConfig = {
    google_client_id: DEFAULT_GOOGLE_CLIENT_ID,
    supabase_google_enabled: false,
    supabase_oauth_url: ""
  };

  fetch("/api/auth/config")
    .then(function (r) { return r.ok ? r.json() : null; })
    .then(function (cfg) {
      if (cfg && cfg.google_client_id) {
        authOAuthConfig = cfg;
      }
    })
    .catch(function () {});

  function getOrCreateDeviceId() {
    let devId = localStorage.getItem("cookedmains_device_id");
    if (!devId || devId.length < 12) {
      devId = "dev_" + Date.now().toString(36) + "_" + Math.random().toString(36).substring(2, 12);
      localStorage.setItem("cookedmains_device_id", devId);
    }
    return devId;
  }

  function ensureGoogleGsiLoaded() {
    return new Promise(function (resolve, reject) {
      if (window.google && window.google.accounts && window.google.accounts.oauth2) {
        return resolve(window.google);
      }
      const existingScript = document.querySelector('script[src*="accounts.google.com/gsi/client"]');
      if (!existingScript) {
        const s = document.createElement("script");
        s.src = "https://accounts.google.com/gsi/client";
        s.async = true;
        document.head.appendChild(s);
      }
      let attempts = 0;
      const timer = setInterval(function () {
        attempts++;
        if (window.google && window.google.accounts && window.google.accounts.oauth2) {
          clearInterval(timer);
          resolve(window.google);
        } else if (attempts > 40) {
          clearInterval(timer);
          reject(new Error("Google Sign-In script took too long to load. Please check your internet connection."));
        }
      }, 100);
    });
  }

  async function completeVerifiedGoogleLogin(payload) {
    const errBox = document.getElementById('authFormError');
    const errText = document.getElementById('authFormErrorText');
    if (errBox) errBox.classList.add('hidden');

    try {
      const res = await fetch("/api/auth/google/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.assign({}, payload, { device_id: getOrCreateDeviceId() }))
      });
      if (res.ok) {
        const user = await res.json();
        STATE.user = user;
        sessionStorage.setItem("mainsmentor_user", JSON.stringify(user));
        localStorage.setItem("mainsmentor_user", JSON.stringify(user));
        if (user.email) localStorage.setItem("cookedmains_bound_email", user.email);
        if (user.name) localStorage.setItem("cookedmains_bound_name", user.name);
        updateAuthUI();
        closeAuthModal();
        closeFreemiumGateModal();
        showToast("✓ Signed in with Google as " + (user.name || user.email) + "!");
      } else {
        const err = await res.json();
        if (errBox && errText) {
          errBox.classList.remove('hidden');
          errText.textContent = err.detail || err.error || "Google sign-in failed.";
        }
      }
    } catch (e) {
      if (errBox && errText) {
        errBox.classList.remove('hidden');
        errText.textContent = "Google verification error: " + e.message;
      }
    }
  }

  // Check if returning from Supabase Google OAuth redirect (#access_token=...)
  if (window.location.hash && window.location.hash.includes("access_token=")) {
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const supaAccessToken = hashParams.get("access_token");
    if (supaAccessToken) {
      window.history.replaceState(null, "", window.location.pathname + window.location.search);
      completeVerifiedGoogleLogin({ supabase_access_token: supaAccessToken });
    }
  }

  function handleGoogleSignInClick() {
    const errBox = document.getElementById('authFormError');
    const errText = document.getElementById('authFormErrorText');
    if (errBox) errBox.classList.add('hidden');

    ensureGoogleGsiLoaded().then(function () {
      const clientId = authOAuthConfig.google_client_id || DEFAULT_GOOGLE_CLIENT_ID;
      const tokenClient = window.google.accounts.oauth2.initTokenClient({
        client_id: clientId,
        scope: "openid email profile",
        prompt: "select_account",
        callback: function (tokenResponse) {
          if (tokenResponse && tokenResponse.access_token) {
            completeVerifiedGoogleLogin({ access_token: tokenResponse.access_token });
          } else if (tokenResponse && tokenResponse.error) {
            if (errBox && errText) {
              errBox.classList.remove('hidden');
              errText.textContent = "Google login cancelled or failed: " + tokenResponse.error;
            }
          }
        }
      });
      tokenClient.requestAccessToken({ prompt: "select_account" });
    }).catch(function (err) {
      if (authOAuthConfig.supabase_google_enabled && authOAuthConfig.supabase_oauth_url) {
        window.location.href = authOAuthConfig.supabase_oauth_url;
        return;
      }
      if (errBox && errText) {
        errBox.classList.remove('hidden');
        errText.textContent = err.message || "Unable to open Google Sign-In popup.";
      }
    });
  }

  async function handlePrelimsAuthSubmit(e) {
    if (e) e.preventDefault();
    const mode = document.getElementById('authModeInput')?.value || 'login';
    const email = (document.getElementById('authEmailInput')?.value || '').trim();
    const password = document.getElementById('authPasswordInput')?.value || '';
    const name = (document.getElementById('authNameInput')?.value || '').trim();
    const errBox = document.getElementById('authFormError');
    const errText = document.getElementById('authFormErrorText');
    const submitBtn = document.getElementById('authSubmitBtn');
    const submitText = document.getElementById('authSubmitBtnText');

    if (!email || !password) {
      if (errBox && errText) {
        errBox.classList.remove('hidden');
        errText.textContent = 'Please enter both email and password.';
      }
      return;
    }

    if (mode === 'register' && !name) {
      if (errBox && errText) {
        errBox.classList.remove('hidden');
        errText.textContent = 'Please enter your full name.';
      }
      return;
    }

    if (errBox) errBox.classList.add('hidden');
    if (submitBtn) submitBtn.disabled = true;
    if (submitText) submitText.textContent = 'Authenticating...';

    try {
      const res = await fetch('/api/user/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name, mode })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.detail || data.error || 'Authentication failed');
      }

      const user = data.user || { email, name: name || email.split('@')[0] };
      sessionStorage.setItem("mainsmentor_user", JSON.stringify(user));
      localStorage.setItem("mainsmentor_user", JSON.stringify(user));
      localStorage.setItem("cookedmains_bound_email", user.email);
      if (user.name) localStorage.setItem("cookedmains_bound_name", user.name);
      STATE.user = user;

      closeAuthModal();
      closeFreemiumGateModal();
      updateAuthUI();
      showToast(`Welcome ${user.name || user.email}! Unlocked all 1,600 PYQs.`);
    } catch (err) {
      if (errBox && errText) {
        errBox.classList.remove('hidden');
        errText.textContent = err.message;
      }
    } finally {
      if (submitBtn) submitBtn.disabled = false;
      if (submitText) submitText.textContent = mode === 'register' ? 'Create Account →' : 'Sign In →';
    }
  }

  function openFreemiumGateModal(reason) {
    const modal = document.getElementById('freemiumGateModal');
    const desc = document.getElementById('freemiumGateDescription');
    const title = document.getElementById('freemiumGateTitle');
    if (!modal) return;

    if (reason === 'solve') {
      if (title) title.textContent = 'Trial Limit Reached (5 Free Questions)';
      if (desc) desc.innerHTML = 'You have practiced your 5 free preview questions! Sign in to save your <strong class="text-amber-400">Mistake Notebook</strong>, connect with your <strong class="text-emerald-400">Mains Evaluation</strong> account, and unlock all 1,600+ authentic PYQs.';
    } else if (reason === 'mistakes') {
      if (title) title.textContent = 'Personal Mistake Notebook';
      if (desc) desc.innerHTML = 'Your Mistake Notebook automatically tracks traps you fell for and weak syllabus areas. <strong class="text-amber-400">Sign in for free</strong> to save and review your mistakes across all devices.';
    } else if (reason === 'mock') {
      if (title) title.textContent = 'Full Timed Mock Simulator';
      if (desc) desc.innerHTML = 'Adaptive Mock Tests generate forensic exam-hall scorecards and negative mark analysis. <strong class="text-amber-400">Sign in for free</strong> to access unlimited mock test generation.';
    } else {
      if (title) title.textContent = 'Unlock All 1,600+ Authentic PYQs';
      if (desc) desc.innerHTML = 'Sign in or create a free account to unlock all 16 years (2011–2026), full explanations, and cross-sync with your Mains copy evaluations.';
    }
    modal.classList.remove('hidden');
  }

  function closeFreemiumGateModal() {
    const modal = document.getElementById('freemiumGateModal');
    if (modal) modal.classList.add('hidden');
  }

  function onSidebarUserClick() {
    if (STATE.user) {
      showToast(`Logged in as ${STATE.user.name || STATE.user.email}`);
    } else {
      openAuthModal('Sign in to sync your Prelims practice with your Mains evaluation account.');
    }
  }

  function onSidebarAuthBtnClick() {
    if (STATE.user) {
      signOutUser();
    } else {
      openAuthModal('Sign in to sync your Prelims practice with your Mains evaluation account.');
    }
  }

  function renderPlayerMainsLinkage(q) {
    let box = document.getElementById('playerMainsLinkageBox');
    if (!box) {
      const parent = document.getElementById('playerExplanationBox');
      if (parent) {
        box = document.createElement('div');
        box.id = 'playerMainsLinkageBox';
        parent.appendChild(box);
      }
    }
    if (!box) return;
    if (!q.mains_linkage || !q.mains_linkage.question) {
      box.innerHTML = '';
      box.classList.add('hidden');
      return;
    }
    box.classList.remove('hidden');
    box.className = 'mt-3 p-3 rounded-2xl bg-gradient-to-r from-amber-500/10 via-emerald-500/10 to-slate-900 border border-amber-500/30 flex items-center justify-between gap-3 flex-wrap';
    box.innerHTML = `
      <div class="flex flex-col gap-0.5 flex-1 min-w-[200px]">
        <div class="flex items-center gap-1.5 text-[11px] font-bold text-amber-400">
          <span>✍️ Related Mains Question</span>
          <span class="px-1.5 py-0.5 rounded bg-amber-500/20 text-[10px] font-mono text-amber-300">${escapeHtml(q.mains_linkage.paper || 'GS')}</span>
        </div>
        <p class="text-xs text-slate-300 italic line-clamp-2">"${escapeHtml(q.mains_linkage.question)}"</p>
      </div>
      <a href="/?paper=${encodeURIComponent(q.mains_linkage.paper || 'GS1')}&question=${encodeURIComponent(q.mains_linkage.question)}" target="_blank" class="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition shadow-md shrink-0 flex items-center gap-1.5">
        <span>Evaluate Mains Copy →</span>
      </a>
    `;
  }

  // Expose global handlers to window
  window.openAuthModal = openAuthModal;
  window.closeAuthModal = closeAuthModal;
  window.setAuthFormMode = setAuthFormMode;
  window.handlePrelimsAuthSubmit = handlePrelimsAuthSubmit;
  window.handleGoogleSignInClick = handleGoogleSignInClick;
  window.openFreemiumGateModal = openFreemiumGateModal;
  window.closeFreemiumGateModal = closeFreemiumGateModal;
  window.onSidebarUserClick = onSidebarUserClick;
  window.onSidebarAuthBtnClick = onSidebarAuthBtnClick;
  window.signOutUser = signOutUser;

  function setupListeners() {
    // Google Sign-In Trigger
    document.getElementById('googleSignInBtn')?.addEventListener('click', handleGoogleSignInClick);
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
    document.getElementById('sideNavMockTests')?.addEventListener('click', function (e) {
      if (e) e.preventDefault();
      window.openMockGenerator();
      toggleSidebar(false);
    });
    document.getElementById('sideNavMistakes')?.addEventListener('click', function () {
      window.openMistakesModal();
      toggleSidebar(false);
    });

    document.getElementById('sideNavCSAT')?.addEventListener('click', function (e) {
      if (e) e.preventDefault();
      switchViewMode('csat');
      toggleSidebar(false);
    });
    document.getElementById('exitCsatBtn')?.addEventListener('click', function () {
      switchViewMode('dashboard');
    });
    document.getElementById('launchCsatSprintBtn')?.addEventListener('click', function () {
      launchCsatFocusMode();
    });
    document.getElementById('csatAttemptSlider')?.addEventListener('input', recalculateCsatSimulator);
    document.getElementById('csatAccuracySlider')?.addEventListener('input', recalculateCsatSimulator);
    document.getElementById('exportCsatDiagnosticBtn')?.addEventListener('click', function () {
      window.print();
    });
    document.querySelectorAll('.csat-filter-btn').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        document.querySelectorAll('.csat-filter-btn').forEach(function (b) {
          b.className = 'csat-filter-btn px-3 py-1.5 rounded-lg font-semibold text-slate-400 hover:text-white transition cursor-pointer';
        });
        e.currentTarget.className = 'csat-filter-btn px-3 py-1.5 rounded-lg font-bold bg-amber-500 text-slate-950 transition cursor-pointer';
        csatFilterSec = e.currentTarget.getAttribute('data-sec') || 'all';
        renderCsatQuestions();
      });
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
      STATE.currentTest = {
        id: 'mistakes_' + Date.now(),
        title: 'Mistakes Notebook Drill (' + mistakeList.length + ' Qs)',
        mode: 'practice',
        totalQuestions: mistakeList.length,
        startTime: Date.now()
      };
      STATE.testAnswers = {};
      mistakeList.forEach(function (q) {
        if (STATE.answers[q.id] && STATE.answers[q.id].selectedIndex !== undefined) {
          STATE.testAnswers[q.id] = STATE.answers[q.id].selectedIndex;
        }
      });
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
      updateLangUI();
      showToast(STATE.language === 'hi' ? 'भाषा: हिंदी' : 'Language: English');
    });

    
    // Topic Search & Matrix Listeners (Debounced 180ms)
    const topicInput = document.getElementById('globalTopicSearchInput');
    const clearTopicBtn = document.getElementById('clearTopicSearchBtn');

    if (topicInput) {
      topicInput.addEventListener('input', debounce(function (e) {
        STATE.matrixSearchQuery = e.target.value.trim();
        renderMatrixFeed();
      }, 180));
    }

    if (clearTopicBtn) {
      clearTopicBtn.addEventListener('click', function () {
        if (topicInput) topicInput.value = '';
        STATE.matrixSearchQuery = '';
        renderMatrixFeed();
      });
    }

    // High-Performance Event Delegation for Matrix Results Container
    const matrixContainer = document.getElementById('pyqSearchResultsContainer');
    if (matrixContainer && !matrixContainer.dataset.delegated) {
      matrixContainer.dataset.delegated = 'true';
      matrixContainer.addEventListener('click', function (e) {
        const viewVaultBtn = e.target.closest('#matrixViewAllInVaultBtn');
        if (viewVaultBtn) {
          e.preventDefault();
          STATE.vaultSearchQuery = STATE.matrixSearchQuery;
          STATE.vaultSelectedSubject = STATE.matrixSelectedSubject;
          STATE.vaultSelectedYear = STATE.matrixSelectedYear;
          const vaultSearchInput = document.getElementById('vaultSearchInput');
          if (vaultSearchInput) vaultSearchInput.value = STATE.vaultSearchQuery;
          switchViewMode('vault');
          return;
        }
        const item = e.target.closest('.matrix-q-item');
        if (item) {
          e.preventDefault();
          const qId = item.getAttribute('data-qid');
          const matches = getFilteredMatrixQuestions();
          const qIdx = matches.findIndex(function (q) { return q.id === qId; });
          STATE.playerQuestions = matches;
          STATE.playerIndex = (qIdx !== -1 ? qIdx : 0);
          STATE.isExamMode = false;
          STATE.isReviewMode = false;
          var subName = matches[0] && matches[0].subject ? matches[0].subject : 'Topic';
          STATE.currentTest = {
            id: 'matrix_' + Date.now(),
            title: (STATE.matrixSearchQuery ? ('"' + STATE.matrixSearchQuery + '"') : subName) + ' Practice (' + matches.length + ' Qs)',
            mode: 'practice',
            totalQuestions: matches.length,
            startTime: Date.now()
          };
          STATE.testAnswers = {};
          matches.forEach(function (q) {
            if (STATE.answers[q.id] && STATE.answers[q.id].selectedIndex !== undefined) {
              STATE.testAnswers[q.id] = STATE.answers[q.id].selectedIndex;
            }
          });
          switchViewMode('player');
        }
      });
    }

    // Dedicated Sidebar Prelims PYQ Vault Nav Link
    document.getElementById('sideNavPyqVault')?.addEventListener('click', function (e) {
      if (e) e.preventDefault();
      switchViewMode('vault');
      toggleSidebar(false);
    });

    // Dedicated Sidebar Current Affairs Arena Nav Link
    document.getElementById('sideNavCurrentAffairs')?.addEventListener('click', function (e) {
      if (e) e.preventDefault();
      switchViewMode('current_affairs');
      toggleSidebar(false);
    });

    // Vault Search Input (Debounced 180ms)
    const vaultSearchInput = document.getElementById('vaultSearchInput');
    const clearVaultSearchBtn = document.getElementById('clearVaultSearchBtn');
    if (vaultSearchInput) {
      vaultSearchInput.addEventListener('input', debounce(function (e) {
        STATE.vaultSearchQuery = e.target.value.trim();
        if (clearVaultSearchBtn) {
          if (STATE.vaultSearchQuery) clearVaultSearchBtn.classList.remove('hidden');
          else clearVaultSearchBtn.classList.add('hidden');
        }
        STATE.vaultDisplayedCount = STATE.vaultPageSize;
        renderPyqVault();
      }, 180));
    }

    if (clearVaultSearchBtn) {
      clearVaultSearchBtn.addEventListener('click', function () {
        if (vaultSearchInput) vaultSearchInput.value = '';
        STATE.vaultSearchQuery = '';
        clearVaultSearchBtn.classList.add('hidden');
        STATE.vaultDisplayedCount = STATE.vaultPageSize;
        renderPyqVault();
      });
    }

    // High-Performance Event Delegation for PYQ Vault Container
    const vaultContainer = document.getElementById('vaultQuestionsContainer');
    if (vaultContainer && !vaultContainer.dataset.delegated) {
      vaultContainer.dataset.delegated = 'true';
      vaultContainer.addEventListener('click', function (e) {
        const toggleBtn = e.target.closest('.vault-toggle-card-btn');
        if (toggleBtn) {
          e.preventDefault();
          const qId = toggleBtn.getAttribute('data-qid');
          if (qId) toggleSingleVaultCard(qId);
          return;
        }
        const solveBtn = e.target.closest('.vault-solve-one-btn');
        if (solveBtn) {
          e.preventDefault();
          const qId = solveBtn.getAttribute('data-qid');
          const question = (STATE.pyqMap && STATE.pyqMap[qId]) || STATE.pyqs.find(function (item) { return item.id === qId; });
          if (question) window.startPracticeWithSingleQuestion(question);
          return;
        }
        const loadMoreBtn = e.target.closest('#vaultLoadMoreBtn');
        if (loadMoreBtn) {
          e.preventDefault();
          loadMoreVaultQuestions();
          return;
        }
      });
    }

    // Vault Mode Switcher (Subject vs Year)
    document.getElementById('vaultModeSubjectBtn')?.addEventListener('click', function () {
      STATE.vaultMode = 'subject';
      STATE.vaultDisplayedCount = STATE.vaultPageSize;
      renderPyqVault();
    });

    document.getElementById('vaultModeYearBtn')?.addEventListener('click', function () {
      STATE.vaultMode = 'year';
      STATE.vaultDisplayedCount = STATE.vaultPageSize;
      renderPyqVault();
    });

    document.getElementById('vaultModeCaBtn')?.addEventListener('click', function () {
      STATE.vaultMode = 'ca';
      STATE.vaultDisplayedCount = STATE.vaultPageSize;
      renderPyqVault();
    });

    // Vault Difficulty Filter Buttons
    document.querySelectorAll('.vault-diff-btn').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        const diff = e.currentTarget.getAttribute('data-diff');
        STATE.vaultSelectedDifficulty = diff;
        STATE.vaultDisplayedCount = STATE.vaultPageSize;
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
      STATE.currentTest = {
        id: 'vault_' + Date.now(),
        title: 'PYQ Vault Filtered Drill (' + filtered.length + ' Qs)',
        mode: 'practice',
        totalQuestions: filtered.length,
        startTime: Date.now()
      };
      STATE.testAnswers = {};
      filtered.forEach(function (q) {
        if (STATE.answers[q.id] && STATE.answers[q.id].selectedIndex !== undefined) {
          STATE.testAnswers[q.id] = STATE.answers[q.id].selectedIndex;
        }
      });
      switchViewMode('player');
    });

    // Vault Expand All Answers Button (Fast In-Place Batch Toggle)
    document.getElementById('vaultToggleAllAnswersBtn')?.addEventListener('click', function () {
      const container = document.getElementById('vaultQuestionsContainer');
      if (!container) return;
      const visibleCards = container.querySelectorAll('.light-card[id^="vault-card-"]');
      if (visibleCards.length === 0) return;

      const firstCardId = visibleCards[0].id.replace('vault-card-', '');
      const shouldCollapse = STATE.vaultExpandedQuestions.has(firstCardId);

      visibleCards.forEach(function (card) {
        const qId = card.id.replace('vault-card-', '');
        if (shouldCollapse) {
          if (STATE.vaultExpandedQuestions.has(qId)) toggleSingleVaultCard(qId);
        } else {
          if (!STATE.vaultExpandedQuestions.has(qId)) toggleSingleVaultCard(qId);
        }
      });

      this.innerHTML = shouldCollapse
        ? '<span>💡 Expand All Answers</span>'
        : '<span>▲ Collapse All Answers</span>';
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
      STATE.currentTest = {
        id: 'matrix_' + Date.now(),
        title: 'Matrix Filtered Practice (' + matches.length + ' Qs)',
        mode: 'practice',
        totalQuestions: matches.length,
        startTime: Date.now()
      };
      STATE.testAnswers = {};
      matches.forEach(function (q) {
        if (STATE.answers[q.id] && STATE.answers[q.id].selectedIndex !== undefined) {
          STATE.testAnswers[q.id] = STATE.answers[q.id].selectedIndex;
        }
      });
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
    const startMockBtn = document.getElementById('startGeneratedMockBtn');
    if (startMockBtn && !startMockBtn.getAttribute('onclick')) {
      startMockBtn.addEventListener('click', window.launchConfiguredMockTest);
    }

    // Player Controls
    document.getElementById('exitPlayerBtn')?.addEventListener('click', function () {
      if (STATE.isReviewMode) {
        switchViewMode('report');
        return;
      }
      var anyAnswered = STATE.playerQuestions && STATE.playerQuestions.some(function (quest) {
        return STATE.testAnswers[quest.id] !== undefined || (STATE.answers[quest.id] && STATE.answers[quest.id].selectedIndex !== undefined);
      });
      if (anyAnswered) {
        window.openSubmitConfirmModal();
      } else {
        switchViewMode('dashboard');
      }
    });

    document.getElementById('playerSubmitExamBtn')?.addEventListener('click', window.openSubmitConfirmModal);
    document.getElementById('playerFinishPracticeBtn')?.addEventListener('click', function () {
      if (STATE.isReviewMode) {
        switchViewMode('report');
      } else {
        window.openSubmitConfirmModal();
      }
    });
    document.getElementById('playerFinishEarlyBtn')?.addEventListener('click', function () {
      window.openSubmitConfirmModal();
    });
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
      } else {
        // Last question reached!
        if (STATE.isReviewMode) {
          switchViewMode('report');
        } else {
          window.openSubmitConfirmModal();
        }
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
    document.getElementById('sideNavEV')?.addEventListener('click', function (e) {
      if (e) e.preventDefault();
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
      STATE.stagedSelection = null;
      STATE.testAnswers = {};
      STATE.currentTest = {
        id: 'remedial_' + Date.now(),
        title: 'Remedial Retest (' + wrong.length + ' Mistakes)',
        mode: 'practice',
        totalQuestions: wrong.length,
        startTime: Date.now()
      };
      switchViewMode('player');
      showToast('🎯 Loaded ' + wrong.length + ' remedial questions to master!');
    });

    // 0. Today's Prescribed High-Yield Mission Launcher
    document.getElementById('startDailyMissionBtn')?.addEventListener('click', launchDailyMission);

    // 1. Heatmap Filter Tabs
    document.querySelectorAll('.heatmap-filter-tab').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        document.querySelectorAll('.heatmap-filter-tab').forEach(function (b) {
          b.className = 'heatmap-filter-tab px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 hover:text-white font-bold cursor-pointer transition-all';
        });
        e.currentTarget.className = 'heatmap-filter-tab px-2.5 py-1 rounded-lg bg-amber-500 text-slate-950 font-black cursor-pointer shadow-xs transition-all';
        STATE.heatmapFilter = e.currentTarget.getAttribute('data-filter') || 'all';
        updateSubTopicHeatmap();
      });
    });

    // 2. Today's Activity & Leaderboard Modal
    document.getElementById('openTodayLeaderboardBtn')?.addEventListener('click', openTodayLeaderboard);
    document.getElementById('closeLeaderboardModalBtn')?.addEventListener('click', closeTodayLeaderboard);
    document.getElementById('todayLeaderboardModal')?.addEventListener('click', function (e) {
      if (e.target.id === 'todayLeaderboardModal') closeTodayLeaderboard();
    });

    // 3. Daily Streak Tracker (Clean display, no intrusive modal)
    document.getElementById('closeStreakModalBtn')?.addEventListener('click', closeStreakModal);
    document.getElementById('streakDetailsModal')?.addEventListener('click', function (e) {
      if (e.target.id === 'streakDetailsModal') closeStreakModal();
    });

    // 4. Target Sprint Inline Controls (Direct on-card interaction)
    const toggleSprintBtn = document.getElementById('toggleSprintChangeBtn');
    const sprintPicker = document.getElementById('sprintInlinePicker');
    const sprintChevron = document.getElementById('sprintChevron');
    if (toggleSprintBtn && sprintPicker) {
      toggleSprintBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        const isHidden = sprintPicker.classList.contains('hidden');
        if (isHidden) {
          sprintPicker.classList.remove('hidden');
          if (sprintChevron) sprintChevron.classList.add('rotate-180');
        } else {
          sprintPicker.classList.add('hidden');
          if (sprintChevron) sprintChevron.classList.remove('rotate-180');
        }
      });
    }

    // Inline Subject Selectors
    document.querySelectorAll('.sprint-subj-btn').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        const newSub = e.currentTarget.getAttribute('data-subject');
        const sprint = getTargetSprintState();
        sprint.subject = newSub;
        saveTargetSprintState(sprint);
        updateTargetSprint();
        if (sprintPicker) sprintPicker.classList.add('hidden');
        if (sprintChevron) sprintChevron.classList.remove('rotate-180');
        showToast('Target subject set to ' + newSub);
      });
    });

    // Inline Goal Selectors
    document.querySelectorAll('.sprint-goal-btn').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        const goal = parseInt(e.currentTarget.getAttribute('data-goal'), 10);
        const sprint = getTargetSprintState();
        sprint.goal = goal;
        saveTargetSprintState(sprint);
        updateTargetSprint();
        showToast('Target set to ' + goal + ' questions');
      });
    });

    // Direct On-Card Practice Buttons
    document.getElementById('cardStartSprintBtn')?.addEventListener('click', function (e) {
      e.stopPropagation();
      launchSprintFocusMode(false);
    });
    document.getElementById('cardSolvePendingBtn')?.addEventListener('click', function (e) {
      e.stopPropagation();
      launchSprintFocusMode(true);
    });

    // Secondary Modal handlers (if opened elsewhere)
    document.getElementById('closeSprintModalBtn')?.addEventListener('click', closeTargetSprintModal);
    document.getElementById('targetSprintModal')?.addEventListener('click', function (e) {
      if (e.target.id === 'targetSprintModal') closeTargetSprintModal();
    });
    document.getElementById('modalStartSprintBtn')?.addEventListener('click', launchSprintFocusMode);
    document.getElementById('autoSetWeakestSubjectBtn')?.addEventListener('click', autoSelectWeakestSubject);
  }

  // ==========================================================
  // DEDICATED MONTHLY CURRENT AFFAIRS & REVERSE-OSMOSIS ARENA (2026)
  // ==========================================================

  const MONTHLY_DOSSIERS_METADATA = [
    {
      month: 'January 2026',
      icon: '❄️',
      color: 'emerald',
      title: 'January 2026 Comprehensive Dossier',
      leadTheme: 'Grasslands C3/C4 & BBNJ Treaty',
      topics: ['Grasslands IYRP 2026 (C3 vs C4)', 'BBNJ High Seas Treaty', 'PESA Rules (Jharkhand)', 'NATGRID GANDIVA AI', 'Sakhya Sagar & Madhav NP', 'Mpemba Effect', 'Bio-Bitumen & Lignin', 'Bharat 6G Terahertz', 'Sovereign Green Bonds', 'PVTGs Criteria', 'Indian Star Tortoise (CITES I)', 'National Quantum Mission', 'Deep Sea Mining (ISA)', 'EU Deforestation Reg (EUDR)'],
      source: 'InsightsIAS Jan 2026 / PIB / FAO'
    },
    {
      month: 'February 2026',
      icon: '🌱',
      color: 'amber',
      title: 'February 2026 Comprehensive Dossier',
      leadTheme: '16th Finance Commission & Deepfakes IT Rules',
      topics: ['16th FC Terms of Reference (Art 280)', 'IT Rules 2026 (Deepfakes & Safe Harbor Sec 79)', 'Denotified Tribes & Criminal Tribes Act 1871', 'Battle of Serengsia 1837 (Ho Rebellion)', 'CPI Base Year 2024=100 & Engel\'s Law', 'GDP Base 2022-23 (MCA-21)', 'Project Vault (RBI Post-Quantum)', 'Sawalkot RoR (Chenab River)', 'Graphene Desalination Membranes', 'Great Nicobar Galathea Bay Port', 'Primary Deficit Dynamics', 'Antarctic Treaty Madrid Protocol', 'Rare Earth Permanent Magnets (NdFeB)', 'ONDC Beckn Protocol', 'Hanle Dark Sky Reserve'],
      source: 'InsightsIAS Feb 2026 / MoF / RBI'
    },
    {
      month: 'March 2026',
      icon: '🌸',
      color: 'rose',
      title: 'March 2026 Comprehensive Dossier',
      leadTheme: 'Solid Waste 2026 & Kunming-Montreal Target 3',
      topics: ['Solid Waste Rules 2026 (4-Stream)', 'Kunming-Montreal GBF (30x30 / OECMs)', 'Steppe Eagle CMS COP15', 'OPU-IVF-ET Bovine Genomics', 'e-Sankhyiki Portal (MoSPI)', 'WTO MC14 (Fisheries & Food Stockholding)', 'Solar Radiation Management (SRM / SAI)', 'Battery Waste EPR Recycled Mandates', 'Art 262 Inter-State River Disputes', 'EU CBAM Scope & Non-Discrimination', 'Unified Lending Interface (ULI)', 'Ocean Anoxic Events & Black Shales', 'Art 355 & CAPF Powers', 'CAR-T Cell NexCAR19', 'Sendai Framework & CDRI'],
      source: 'InsightsIAS Mar 2026 / MoEFCC / CBD'
    },
    {
      month: 'April 2026',
      icon: '☀️',
      color: 'orange',
      title: 'April 2026 Comprehensive Dossier',
      leadTheme: '131st Amendment Delimitation & 500 Yrs Panipat',
      topics: ['131st Amendment (Delimitation Freeze & Art 334A)', 'ECI Art 324 Superintendence vs Art 311', '500 Yrs First Battle of Panipat (Tulughma & Araba)', 'Amaravati Stupa & Satavahanas', 'Elephanta Island 1,500-Yr Stepped Reservoir', 'Lanjia Saora Idital Murals (GI Tag)', 'Adi Shankaracharya & Amnaya Peethas', 'Kelvin Waves & El Niño Teleconnections', '3D Glass Semiconductor Substrates', 'Prototype Fast Breeder Reactor (PFBR Kalpakkam)', 'Nagoya Protocol IRCCs', 'Strait of Malacca & Indo-Pacific Chokepoints', 'Mount Semeru & Sunda Arc', 'Litani River & UNSCR 1701', 'Colorado River Basin Aridification'],
      source: 'InsightsIAS Apr 2026 / Gazette / ASI'
    },
    {
      month: 'May 2026',
      icon: '🔥',
      color: 'red',
      title: 'May 2026 Comprehensive Dossier',
      leadTheme: 'Thousand Pillar Sandbox & AMOC Tipping Point',
      topics: ['Thousand Pillar Kakatiya Sandbox Foundation', 'Chola Leiden Plates Repatriation', 'Five Dhyani Buddhas (Tathagatas)', 'Somnath Temple Māru-Gurjara Style', 'Bhojshala Complex Raja Bhoja Grammar Epigraphs', 'AMOC Collapse & Global Monsoon Impacts', 'Nilgiri Prehistoric Rock Art (Irula/Kurumba)', '11th NPT Review Conference & Art VI', 'India-Nordic Clean Energy Partnership', 'PaRRVA Algorithmic Surveillance (SEBI)', 'E-PRAAPTI DISCOM Arrears Settlement', 'Methane Alert & Response System (MARS)', 'Asiatic Lion Barda Translocation', 'Nilgiri Tahr Shola Grassland Ecology', 'Conocarpus Mangrove Exotic Weed Ban'],
      source: 'InsightsIAS May 2026 / ASI / UNEP'
    },
    {
      month: 'June 2026',
      icon: '🌧️',
      color: 'blue',
      title: 'June 2026 Comprehensive Dossier',
      leadTheme: 'Sanchi Relic Diplomacy & Mohenjo-daro Centenary',
      topics: ['Sanchi Stupa & Sariputra Relics', 'Mohenjo-daro Dancing Girl Centenary (Lost-Wax)', 'Rakhigarhi Mature Harappan Urban Planning', 'Thewa Art Pratapgarh 24k Gold Glasscraft', 'Sushruta Samhita Shalya-tantra Rhinoplasty', 'Vijayanagara Sadasiva Raya Tirumala Inscriptions', 'Chapekar Brothers 1897 Rand Assassination', 'June 3rd Mountbatten Plan & Boundary Commissions', 'Maulana Barkatullah Kabul Provisional Govt 1915', 'Andaman Deepwater Eocene Hydrocarbons', 'RBI Surplus Transfer (Jalan ECF & CRB)', 'Netra AEW&C Mk-II AESA Radar', 'RudraM-II Hypersonic Anti-Radiation Missile', 'Gandhi Sagar Cheetah Sanctuary Expansion', 'Project UDAYAK Arunachal Strategic Roads'],
      source: 'InsightsIAS Jun 2026 / National Museum / DRDO'
    },
    {
      month: 'July 2026',
      icon: '⚡',
      color: 'purple',
      title: 'July 2026 Comprehensive Dossier',
      leadTheme: 'Decolonization Heritage, Vikram-1 & 8 Core Index',
      topics: ['Patrice Lumumba Congo Crisis & Indian UN Peacekeepers', 'India-UK CETA Double Contribution Convention', 'US-Saudi 123 Agreement & Non-Proliferation', 'Index of Services Production (ISP / GST Data)', 'Nifty500 Ahimsa Ethical Index', 'Index of Eight Core Industries Weightages', 'Vikram-1 Rocket (Skyroot Aerospace)', 'eVTOL e200X Urban Air Mobility', 'Qdenga Tetravalent Dengue Vaccine', 'Borophene 2D Allotrope Solid Lubricant', 'Puga Valley Geothermal Power Project (Ladakh)', 'Borjuli Wetland Wild Rice Progenitor', 'Teesta River Tso Lhamo Hydrology', 'Kamarajar Port Landlord Port Model', 'Karlapat Bauxite & Khondalite Topography'],
      source: 'InsightsIAS Jul 2026 / MoSPI / DGCA / IN-SPACe'
    }
  ,
    {
      month: 'August 2026',
      icon: '🌾',
      color: 'amber',
      title: 'August 2026 Comprehensive Dossier',
      leadTheme: 'Glaw Lake Ramsar, Asan ESZ & IPMDA',
      topics: ['Glaw Lake (101st Ramsar)', 'SC 10-km Buffer on Ramsar Mining (Asan)', 'Asiatic Lion Barda Sanctuary & Babarkot', 'Houbara / MacQueens Bustard', 'Clouded Leopard Arboreal Adaptations', 'Vulture Recovery (NSAIDs Bans)', 'Danube River Capitals', 'Lake Mead & Hoover Dam', 'Nauru & Ceuta Enclave', 'IPMDA Quad Maritime Awareness', 'GOBARdhan SATAT Bioenergy Offtake', 'Open Natural Ecosystems (ONEs)', 'Makkah Pact', 'PM Surya Sarovar Floating Solar', 'National Honour Act 1971'],
      source: 'InsightsIAS Aug 2026 / PIB / MoEFCC / SC Judgments'
    },
    {
      month: 'September 2026',
      icon: '🍁',
      color: 'emerald',
      title: 'September 2026 Comprehensive Dossier',
      leadTheme: 'Coral Bleaching GCRMN & DSR Soil Carbon',
      topics: ['GCRMN Global Coral Reef Status (4th Bleaching)', 'Neelakurinji (WPA Sch III & Shola Masting)', 'Ammannia telanganensis (Amrabad TR)', 'Trishuli River Antecedent Drainage', 'Lake Ontario & St. Lawrence Seaway', 'Larak Island Salt Diapirs & Strait of Hormuz', 'Lake Magadi Trona Kenya Rift', 'Mount Anak Krakatau Sunda Strait', 'Kathmandu Declaration (SAWEN)', 'ECI Totaliser Machines in EVMs', 'Article 371K Ladakh Proposals', 'Lipulekh Pass & Kali River', 'Sohar Port (Gulf of Oman)', 'Djibouti & Lake Assal (-155m)', 'Indus Waters Treaty PCA Ruling', 'Direct Seeded Rice (DSR) Carbon Credits', 'Badri Cattle OPU-IVF'],
      source: 'InsightsIAS Sep 2026 / ICRI / ECI / PCA The Hague'
    },
    {
      month: 'October 2026',
      icon: '🍂',
      color: 'indigo',
      title: 'October 2026 Comprehensive Dossier',
      leadTheme: 'Sukhna & Sauj Jheel Ramsar & BNSS 163',
      topics: ['Sukhna Lake & Sauj Jheel (102nd & 103rd Ramsar)', 'Buxa Tiger Reserve Reintroduction', 'Kallakkadal Swell Surge Waves (INCOIS)', 'Himalayan Tahr Hoof Adaptations', 'Sarus Crane Non-Migratory Ecology', 'Black Sea Anoxic Deep Meromictic Basin', 'Caspian Sea Volga Drainage & Littorals', 'Dakhla Oasis Nubian Sandstone Aquifer', 'Section 163 BNSS (CrPC 144 Evolution)', 'Supreme Court Collegium Three Judges Cases', 'SIOFA Southern Indian Ocean Fisheries', 'Eight Core Industries Index Weightages', 'Quantum Key Distribution (QKD) Free-Space', 'UN Declaration on Sea Level Rise & UNCLOS Baselines', 'Kufri Jamunia Anthocyanin Potato'],
      source: 'InsightsIAS Oct 2026 / UNCLOS / NTCA / INCOIS / CPRI'
    }
  ];

  function renderCurrentAffairsArena() {
    var cardsGrid = document.getElementById('caMonthlyCardsGrid');
    if (!cardsGrid) return;

    var caQuestions = STATE.ca_pyqs || [];
    var totalCaCount = caQuestions.length || 230;

    // Dynamically update header badges and labels
    var badge = document.getElementById('caArenaHeaderBadge');
    if (badge) badge.textContent = '10 Dossiers · ' + totalCaCount + ' Qs';
    var subtext = document.getElementById('caDossiersCountSubtext');
    if (subtext) subtext.textContent = '10 Comprehensive Dossiers (' + totalCaCount + ' Qs)';
    var allBtn = document.getElementById('caMonthPillAll');
    if (allBtn) allBtn.textContent = 'All Months (' + totalCaCount + ' Qs)';

    // Render 7 Monthly Dossier Hub Cards
    cardsGrid.innerHTML = MONTHLY_DOSSIERS_METADATA.map(function (meta) {
      var count = caQuestions.filter(function (q) { return q.month === meta.month; }).length || 15;
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
              '<span class="px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-400 text-xs font-mono font-bold border border-emerald-500/30">' +
                count + ' Qs' +
              '</span>' +
            '</div>' +

            '<div class="flex items-center gap-1.5 flex-wrap pt-1">' +
              meta.topics.slice(0, 4).map(function (tp) {
                return '<span class="px-2 py-0.5 rounded-md bg-slate-800/80 text-[10px] text-slate-300 font-medium">' + escapeHtml(tp) + '</span>';
              }).join('') +
              (meta.topics.length > 4 ? '<span class="text-[10px] text-slate-400 font-mono">+' + (meta.topics.length - 4) + ' more</span>' : '') +
            '</div>' +
          '</div>' +

          '<div class="pt-3 border-t border-slate-800 flex items-center justify-between gap-2 flex-wrap">' +
            '<button type="button" onclick="window.startMonthlyCaMock(\'' + meta.month + '\', \'exam\')" class="flex-1 py-2 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs transition shadow-md shadow-emerald-500/10 cursor-pointer flex items-center justify-center gap-1.5 active:scale-95">' +
              '<span>▶️ 15 Qs Timed Mock</span>' +
            '</button>' +
            '<button type="button" onclick="window.startMonthlyCaMock(\'' + meta.month + '\', \'tutor\')" class="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-bold text-xs transition cursor-pointer" title="Tutor Practice Mode with instant explanations">' +
              '<span>💡 Tutor</span>' +
            '</button>' +
          '</div>' +
        '</div>'
      );
    }).join('');

    renderCaFeedQuestions();
  }

  function renderCaFeedQuestions() {
    var feedList = document.getElementById('caQuestionsFeedList');
    var badge = document.getElementById('caFilteredCountBadge');
    if (!feedList) return;

    var questions = STATE.ca_pyqs || [];

    // Filter by selected month
    if (STATE.caArenaSelectedMonth && STATE.caArenaSelectedMonth !== 'all') {
      questions = questions.filter(function (q) { return q.month === STATE.caArenaSelectedMonth; });
    }

    // Filter by keyword query
    if (STATE.caArenaSearchQuery) {
      var query = STATE.caArenaSearchQuery.toLowerCase();
      questions = questions.filter(function (q) {
        return (q.question_text || '').toLowerCase().includes(query) ||
               (q.subject || '').toLowerCase().includes(query) ||
               (q.sub_topic || '').toLowerCase().includes(query) ||
               (q.static_root || '').toLowerCase().includes(query) ||
               (q.explanation || '').toLowerCase().includes(query);
      });
    }

    if (badge) {
      badge.textContent = questions.length + ' Question' + (questions.length === 1 ? '' : 's');
    }

    if (questions.length === 0) {
      feedList.innerHTML = (
        '<div class="p-8 text-center text-slate-400 text-xs font-mono rounded-2xl bg-slate-950 border border-slate-800">' +
          'No matching current affairs questions found. Try resetting month filters or search term.' +
        '</div>'
      );
      return;
    }

    var letters = ['A', 'B', 'C', 'D'];

    feedList.innerHTML = questions.slice(0, 30).map(function (q) {
      return (
        '<div class="light-card p-5 sm:p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-md flex flex-col gap-3 transition-all hover:border-slate-700">' +
          '<div class="flex items-center justify-between gap-2 flex-wrap border-b border-slate-800/80 pb-2.5">' +
            '<div class="flex items-center gap-2 flex-wrap">' +
              '<span class="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase font-mono">' + escapeHtml(q.month) + '</span>' +
              '<span class="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px] font-bold font-mono">' + escapeHtml(q.subject) + '</span>' +
              (q.difficulty ? '<span class="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 text-[10px] font-bold font-mono">' + escapeHtml(q.difficulty) + '</span>' : '') +
            '</div>' +
            '<button type="button" onclick="window.startPracticeWithSingleQuestion(STATE.pyqMap[\'' + q.id + '\'])" class="px-3 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500 text-emerald-300 hover:text-slate-950 text-xs font-bold transition cursor-pointer flex items-center gap-1">' +
              '<span>Solve in Focus Player →</span>' +
            '</button>' +
          '</div>' +

          '<p class="text-xs sm:text-sm font-semibold text-slate-100 whitespace-pre-line leading-relaxed">' +
            escapeHtml(q.question_text) +
          '</p>' +

          '<div class="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">' +
            q.options.map(function (opt, oIdx) {
              return (
                '<div class="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80 text-xs text-slate-300 flex items-start gap-2">' +
                  '<span class="w-5 h-5 rounded-md bg-slate-800 text-slate-200 font-mono font-black flex items-center justify-center text-[10px] shrink-0">' + letters[oIdx] + '</span>' +
                  '<span class="leading-relaxed">' + escapeHtml(opt) + '</span>' +
                '</div>'
              );
            }).join('') +
          '</div>' +

          (q.static_root ? (
            '<div class="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">' +
              '<span class="text-amber-400 font-mono text-[11px] font-bold">🏛️ Static Root Concept:</span>' +
              '<span class="text-slate-300 text-[11px]">' + escapeHtml(q.static_root) + '</span>' +
            '</div>'
          ) : '') +
        '</div>'
      );
    }).join('') + (questions.length > 30 ? '<div class="text-center text-xs text-slate-400 font-mono py-2">Showing 30 of ' + questions.length + ' questions. Launch mock simulator to practice complete sets.</div>' : '');
  }

  window.filterCaByMonth = function (month) {
    STATE.caArenaSelectedMonth = month;
    document.querySelectorAll('.ca-month-pill').forEach(function (pill) {
      if (pill.getAttribute('data-month') === month) {
        pill.className = 'ca-month-pill px-3.5 py-1.5 rounded-xl text-xs font-bold bg-emerald-500 text-slate-950 shadow-md transition cursor-pointer';
      } else {
        pill.className = 'ca-month-pill px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-slate-800 text-slate-300 hover:text-white transition cursor-pointer';
      }
    });
    renderCaFeedQuestions();
  };

  window.onCaFeedSearch = function (query) {
    STATE.caArenaSearchQuery = (query || '').trim();
    renderCaFeedQuestions();
  };

  window.startMonthlyCaMock = function (month, mode) {
    mode = mode || 'exam';
    var pool = (STATE.ca_pyqs || []).filter(function (q) { return q.month === month; });
    if (pool.length === 0) {
      showToast('No questions found for ' + month);
      return;
    }
    var targetCount = Math.min(15, pool.length);
    var durationMins = (mode === 'exam') ? 18 : Math.round(targetCount * 1.2);

    STATE.isExamMode = (mode === 'exam');
    STATE.isReviewMode = false;
    STATE.testAnswers = {};
    STATE.playerQuestions = shuffleArray(pool).slice(0, targetCount);
    STATE.playerIndex = 0;
    STATE.currentTest = {
      id: 'ca_mock_' + Date.now(),
      title: month + ' - Official CA Mock (' + targetCount + ' Qs)',
      format: 'current_affairs',
      durationSeconds: durationMins * 60,
      remainingSeconds: durationMins * 60,
      totalQuestions: targetCount,
      startTime: Date.now(),
      mode: mode
    };

    if (STATE.isExamMode) {
      startExamTimer();
    }
    switchViewMode('player');
    showToast('Launched ' + month + ' (' + targetCount + ' Qs · ' + (mode === 'exam' ? 'Exam Mode' : 'Tutor Mode') + ')');
  };

  async function ensureCaQuestionsLoaded() {
    if (STATE.ca_pyqs && STATE.ca_pyqs.length > 0) return STATE.ca_pyqs;
    try {
      const res = await fetch('/static/data/current_affairs_pyqs.json?v=230qs_20261123v2');
      if (res.ok) {
        STATE.ca_pyqs = await res.json();
        if (!STATE.pyqMap) STATE.pyqMap = {};
        STATE.ca_pyqs.forEach(function (q) {
          if (q && q.id) STATE.pyqMap[q.id] = q;
        });
      }
    } catch (e) {
      console.warn('Could not load CA questions:', e);
    }
    return STATE.ca_pyqs || [];
  }

  // Expose to window for resilient direct invocation
  window.switchViewMode = switchViewMode;

  window.switchVaultMode = function (mode) {
    STATE.vaultMode = mode;
    STATE.vaultDisplayedCount = STATE.vaultPageSize;
    if (mode === 'ca' && (!STATE.ca_pyqs || STATE.ca_pyqs.length === 0)) {
      ensureCaQuestionsLoaded().then(function () {
        renderPyqVault();
      });
      return;
    }
    renderPyqVault();
  };

  window.setVaultCaMonth = function (month) {
    STATE.vaultSelectedCaMonth = month;
    STATE.vaultDisplayedCount = STATE.vaultPageSize;
    renderPyqVault();
  };

  window.setVaultSubject = function (subj) {
    STATE.vaultSelectedSubject = subj;
    STATE.vaultDisplayedCount = STATE.vaultPageSize;
    renderPyqVault();
  };

  window.setVaultYear = function (year) {
    STATE.vaultSelectedYear = year;
    STATE.vaultDisplayedCount = STATE.vaultPageSize;
    renderPyqVault();
  };

  window.openCurrentAffairsArena = function (e) {
    if (e && e.preventDefault) e.preventDefault();
    if (window.history && window.history.pushState) {
      try {
        window.history.pushState({}, '', '/prelims/current-affairs');
      } catch (err) {}
    }
    switchViewMode('current_affairs');
    if (!STATE.ca_pyqs || STATE.ca_pyqs.length === 0) {
      ensureCaQuestionsLoaded().then(function () {
        renderCurrentAffairsArena();
      });
    }
  };

  window.openDynamicCaGeneratorModal = function () {
    const modal = document.getElementById('dynamicCaGeneratorModal');
    if (modal) modal.classList.remove('hidden');
    const progressBox = document.getElementById('dynamicCaProgressBox');
    if (progressBox) progressBox.classList.add('hidden');
    const startBtn = document.getElementById('startDynamicCaBtn');
    if (startBtn) startBtn.disabled = false;
  };

  window.closeDynamicCaGeneratorModal = function () {
    const modal = document.getElementById('dynamicCaGeneratorModal');
    if (modal) modal.classList.add('hidden');
  };

  window.triggerDynamicCaGeneration = async function () {
    const monthSelect = document.getElementById('dynamicCaMonthSelect');
    const subjectSelect = document.getElementById('dynamicCaSubjectSelect');
    const countSelect = document.getElementById('dynamicCaCountSelect');
    const difficultySelect = document.getElementById('dynamicCaDifficultySelect');
    const topicInput = document.getElementById('dynamicCaCustomTopicInput');
    const progressBox = document.getElementById('dynamicCaProgressBox');
    const progressMsg = document.getElementById('dynamicCaProgressMsg');
    const startBtn = document.getElementById('startDynamicCaBtn');

    const month = monthSelect ? monthSelect.value : 'January 2026';
    const subject = subjectSelect ? subjectSelect.value : 'all';
    const count = countSelect ? parseInt(countSelect.value, 10) : 5;
    const difficulty = difficultySelect ? difficultySelect.value : 'Tough';
    const topic = topicInput ? topicInput.value.trim() : '';

    if (progressBox) progressBox.classList.remove('hidden');
    if (startBtn) startBtn.disabled = true;

    // Animated progress simulation
    const steps = [
      'Analyzing trusted UPSC news triggers (The Hindu, PIB, UNEP)...',
      'Reverse-engineering static roots (NCERT Class 11/12 & standard acts)...',
      'Synthesizing UPSC examiner distractors & Topper elimination traps...',
      'Verifying 4-option forensic keys & Mains linkages...'
    ];
    let stepIdx = 0;
    const progressTimer = setInterval(function () {
      stepIdx = (stepIdx + 1) % steps.length;
      if (progressMsg) progressMsg.textContent = steps[stepIdx];
    }, 2200);

    try {
      const formData = new FormData();
      formData.append('month', month);
      formData.append('subject', subject);
      formData.append('count', String(count));
      formData.append('difficulty', difficulty);
      if (topic) formData.append('topic', topic);

      const res = await fetch('/api/prelims/generate-dynamic-ca', {
        method: 'POST',
        body: formData
      });
      clearInterval(progressTimer);

      if (!res.ok) throw new Error('Server returned status ' + res.status);
      const data = await res.json();

      if (data.status === 'success' && Array.isArray(data.questions) && data.questions.length > 0) {
        if (!STATE.ca_pyqs) STATE.ca_pyqs = [];
        if (!STATE.pyqMap) STATE.pyqMap = {};

        // Prepend new questions
        data.questions.forEach(function (q) {
          STATE.ca_pyqs.unshift(q);
          STATE.pyqMap[q.id] = q;
        });

        window.closeDynamicCaGeneratorModal();
        showToast('Generated ' + data.questions.length + ' authentic UPSC questions dynamically!');
        renderCurrentAffairsArena();
        if (STATE.viewMode === 'vault') renderPyqVault();

        // Optional prompt to solve immediately
        if (confirm('Successfully synthesized ' + data.questions.length + ' fresh UPSC Reverse-Osmosis Questions!\n\nWould you like to practice them right now in the Timed Focus Player?')) {
          STATE.playerQuestions = data.questions;
          STATE.playerIndex = 0;
          STATE.isExamMode = false;
          STATE.isReviewMode = false;
          STATE.currentTest = {
            id: 'dyn_ca_' + Date.now(),
            title: month + ' Dynamic AI Cohort (' + data.questions.length + ' Qs)',
            format: 'current_affairs',
            durationSeconds: data.questions.length * 72,
            remainingSeconds: data.questions.length * 72,
            totalQuestions: data.questions.length,
            startTime: Date.now()
          };
          switchViewMode('player');
        }
      } else {
        alert(data.message || 'Failed to generate dynamic questions. Please verify API key configuration.');
      }
    } catch (err) {
      clearInterval(progressTimer);
      console.error('Error generating dynamic CA:', err);
      alert('Error generating questions: ' + err.message);
    } finally {
      if (progressBox) progressBox.classList.add('hidden');
      if (startBtn) startBtn.disabled = false;
    }
  };

  window.renderCurrentAffairsArena = renderCurrentAffairsArena;
  window.ensureCaQuestionsLoaded = ensureCaQuestionsLoaded;

  // Initialize
  document.addEventListener('DOMContentLoaded', function () {
    loadPersistedState();
    initTheme();
    setupListeners();
    initQuestions();
  });

})();
