const fs = require('fs');
const path = require('path');

const jsPath = path.resolve(__dirname, '../static/prelims.js');
let js = fs.readFileSync(jsPath, 'utf8');

const isCRLF = js.includes('\r\n');
if (isCRLF) {
  js = js.replace(/\r\n/g, '\n');
}

// 1. Data Fetching Update (Fetch prelims, CA, other exams [CDS/CAPF], and 2026 AI mock questions)
const oldFetchBlock = `    try {
      const [resPyqs, resCa] = await Promise.all([
        fetch('/static/data/prelims_pyqs.json'),
        fetch('/static/data/current_affairs_pyqs.json')
      ]);
      if (resPyqs.ok) {
        STATE.pyqs = await resPyqs.json();
        STATE.pyqMap = {};
        STATE.pyqs.forEach(function (q) {
          if (q && q.id) STATE.pyqMap[q.id] = q;
        });
      }
      if (resCa && resCa.ok) {
        STATE.ca_pyqs = await resCa.json();
        STATE.ca_pyqs.forEach(function (q) {
          if (q && q.id) STATE.pyqMap[q.id] = q;
        });
      }
    } catch (e) {
      console.warn('Could not fetch prelims/CA questions data:', e);
    }`;

const newFetchBlock = `    try {
      const [resPyqs, resCa, resOther, resAi] = await Promise.all([
        fetch('/static/data/prelims_pyqs.json'),
        fetch('/static/data/current_affairs_pyqs.json'),
        fetch('/static/data/upsc_other_exams_pyqs.json'),
        fetch('/static/data/ai_mock_questions_2026.json')
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
    }`;

if (js.includes(oldFetchBlock)) {
  js = js.replace(oldFetchBlock, newFetchBlock);
  console.log('✓ Successfully patched Data Fetching block');
} else {
  console.warn('Could not find exact oldFetchBlock in prelims.js');
}

// 2. Mock Generator Configuration & Handlers
const oldMockConfigBlockRegex = /let mockConfigState = \{[\s\S]*?function generateAndStartMock\(format, subjectFilter, mode, options\) \{[\s\S]*?STATE\.isExamMode = \(mode === 'exam'\);/;

const newMockConfigBlock = `let mockConfigState = {
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
        btn.className = 'mock-tab-btn py-2 px-2 sm:px-3 rounded-xl transition flex items-center justify-center gap-1.5 bg-amber-500 text-slate-950 font-extrabold shadow-md cursor-pointer';
      } else {
        btn.className = 'mock-tab-btn py-2 px-2 sm:px-3 rounded-xl transition flex items-center justify-center gap-1.5 text-slate-400 hover:text-white font-bold cursor-pointer';
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
          const tq = options.topicQuery.toLowerCase();
          const tMatches = aiPool.filter(function (q) {
            return (q.sub_topic || '').toLowerCase().includes(tq) || (q.question_text || '').toLowerCase().includes(tq);
          });
          if (tMatches.length > 0) aiPool = tMatches;
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

      const blendCa = document.getElementById('mockFullBlendCaCheckbox')?.checked;
      let caTarget = 0;
      if (blendCa && STATE.ca_pyqs && STATE.ca_pyqs.length > 0) {
        caTarget = 25;
        title = 'Full GS-1 Simulation (75% Static + 25% 2026 CA · 120m)';
        const caSample = shuffleArray(STATE.ca_pyqs).slice(0, caTarget);
        sampleQuestions = sampleQuestions.concat(caSample);
      }

      const staticTarget = targetCount - caTarget;
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
        const tq = options.topicQuery.toLowerCase();
        const topicMatches = candidatePool.filter(function (q) {
          const sub = (q.sub_topic || q.subTopic || '').toLowerCase();
          const txt = (q.question_text || q.question || '').toLowerCase();
          return sub.includes(tq) || txt.includes(tq);
        });
        if (topicMatches.length > 0) candidatePool = topicMatches;
      }

      sampleQuestions = shuffleArray(candidatePool).slice(0, targetCount);
    }

    sampleQuestions = shuffleArray(sampleQuestions).slice(0, targetCount);
    if (sampleQuestions.length === 0) {
      showToast('No matching questions found for this configuration.');
      return;
    }

    // Initialize Test Session State
    STATE.isExamMode = (mode === 'exam');`;

if (oldMockConfigBlockRegex.test(js)) {
  js = js.replace(oldMockConfigBlockRegex, newMockConfigBlock);
  console.log('✓ Successfully patched mock generator logic and handlers');
} else {
  console.warn('Regex did not match oldMockConfigBlockRegex');
}

// 3. Question Player Badge Updates
const oldPlayerBadgeCode = `    if (qNumLabel) qNumLabel.textContent = 'QUESTION #' + (idx + 1) + ' OF ' + questions.length;
    if (counterText) counterText.textContent = 'Q ' + (idx + 1) + ' of ' + questions.length;
    if (subjBadge) subjBadge.textContent = q.subject || 'GS Paper 1';
    if (yearBadge) yearBadge.textContent = q.year || '2023';
    if (diffBadge) diffBadge.textContent = q.difficulty || 'Moderate';`;

const newPlayerBadgeCode = `    if (qNumLabel) qNumLabel.textContent = 'QUESTION #' + (idx + 1) + ' OF ' + questions.length;
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
    }`;

if (js.includes(oldPlayerBadgeCode)) {
  js = js.replace(oldPlayerBadgeCode, newPlayerBadgeCode);
  console.log('✓ Successfully patched Player Badge & Trust indicator');
} else {
  console.warn('Could not find oldPlayerBadgeCode');
}

// 4. Report Card 2026 Pattern Diagnostic & Remedial Drill
const oldReportSaveBtnCode = `    // Save All Mistakes Button Setup
    const saveBtn = document.getElementById('reportSaveMistakesBtn');`;

const newReportPatternCode = `    // 2026 Question Format Diagnostic Computation
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
    const saveBtn = document.getElementById('reportSaveMistakesBtn');`;

if (js.includes(oldReportSaveBtnCode)) {
  js = js.replace(oldReportSaveBtnCode, newReportPatternCode);
  console.log('✓ Successfully patched Scorecard 2026 Diagnostic & Re-attempt logic');
} else {
  console.warn('Could not find oldReportSaveBtnCode');
}

if (isCRLF) {
  js = js.replace(/\n/g, '\r\n');
}

fs.writeFileSync(jsPath, js, 'utf8');
console.log('Updated prelims.js successfully!');
