/**
 * Cooked Mains - Dedicated Essay Evaluation Results Experience
 * 
 * Strict Evaluation Principles:
 * - Treats the essay as the candidate's sustained argument & individual viewpoint.
 * - Shows how thinking develops across pages rather than imposing rigid formulas.
 * - Completely removes any prescriptive or fixed frameworks (including "Civilizational Resolution").
 * - Renders sections ONLY when supported by genuine essay evaluation data; hides any section with no valid data.
 * - Filters out generic GS boilerplate fallbacks from lines of reasoning.
 * - Labels thesis as inferred ONLY when inferred from opening framing; omits if not present.
 * - Correctly coordinates page jumps and annotations strictly within uploaded copy boundaries.
 * 
 * Safeguards:
 * - Zero impact on GS evaluation logic, shared components, routing, or reset.
 * - Does not invent feedback or display unsupported placeholder analysis.
 * - Multi-page support for 10+ pages with responsive layout on mobile, tablet, and desktop.
 */

(function () {
  'use strict';

  // Internal state for Essay Evaluation Experience
  const essayState = {
    evalData: null,
    activePages: [],
    currentPageIndex: 0,
    zoomLevel: 1.0,
    activeMobileView: 'analysis' // 'analysis' or 'viewer'
  };

  /**
   * Identifies whether the submission is an Essay paper
   */
  window.isEssaySubmission = function (evalData) {
    if (!evalData) return false;
    const paperVal = String(
      evalData.detected_paper ||
      evalData.paper ||
      evalData.paper_code ||
      (window.state && window.state.paper) ||
      (window.state && window.state.selectedPaperTab) ||
      ""
    ).toUpperCase();

    if (paperVal.includes("ESSAY")) return true;
    if (evalData.detected_paper_display && String(evalData.detected_paper_display).toUpperCase().includes("ESSAY")) return true;
    return false;
  };

  /**
   * Main entry point for rendering an Essay Evaluation
   */
  window.renderEssayEvaluation = function (evalData) {
    if (!evalData) return;
    essayState.evalData = evalData;

    // Resolve uploaded script pages (strictly prioritize submission payload)
    if (Array.isArray(evalData.pages) && evalData.pages.length > 0) {
      essayState.activePages = [...evalData.pages];
    } else if (Array.isArray(evalData.page_images) && evalData.page_images.length > 0) {
      essayState.activePages = [...evalData.page_images];
    } else if (window.state && Array.isArray(window.state.activePages) && window.state.activePages.length > 0) {
      essayState.activePages = [...window.state.activePages];
    } else {
      essayState.activePages = [];
    }

    essayState.currentPageIndex = 0;
    essayState.zoomLevel = 1.0;
    essayState.activeMobileView = 'analysis';

    // Synchronize top studio action bar cleanly
    const topDiscipline = document.getElementById("studioBreadcrumbDiscipline");
    const topQuestion = document.getElementById("studioBreadcrumbQuestion");
    const topScore = document.getElementById("studioTopScore");
    const topMax = document.getElementById("studioTopMaxMarks");
    const topBand = document.getElementById("studioTopBand");

    if (topDiscipline) topDiscipline.textContent = evalData.detected_paper_display || "Essay Paper";
    if (topQuestion) topQuestion.textContent = evalData.detected_question || (window.state && window.state.question) || "UPSC Mains Essay";
    if (topScore && evalData.overall_score !== undefined && evalData.overall_score !== null) {
      topScore.textContent = (parseFloat(evalData.overall_score) || 0.0).toFixed(1);
    }
    if (topMax) topMax.textContent = `/ ${evalData.max_marks || 125}`;
    if (topBand && evalData.percentile_verdict) {
      topBand.textContent = evalData.percentile_verdict;
    }

    const container = document.getElementById("essayEvaluationWorkspace");
    if (!container) return;

    container.innerHTML = buildEssayWorkspaceHTML(evalData);
    initEssayViewer();
    initEssayEvents();

    if (window.lucide && typeof window.lucide.createIcons === 'function') {
      window.lucide.createIcons();
    }
  };

  /**
   * Constructs the full layout HTML for the Essay Workspace
   */
  function buildEssayWorkspaceHTML(evalData) {
    const topic = evalData.detected_question || evalData.question || (window.state && window.state.question) || "UPSC Mains Essay Topic";
    const score = evalData.overall_score !== undefined && evalData.overall_score !== null ? parseFloat(evalData.overall_score) : null;
    const maxMarks = evalData.max_marks || (window.state && window.state.marks) || 125;
    const verdict = evalData.percentile_verdict || null;
    const totalPages = essayState.activePages.length;

    // Build the 6 evaluation sections conditionally
    const sec1 = buildSection1Overview(evalData);
    const sec2 = buildSection2ArgumentJourney(evalData);
    const sec3 = buildSection3TopicAlignment(evalData);
    const sec4 = buildSection4DimensionalAssessment(evalData);
    const sec5 = buildSection5Annotations(evalData);
    const sec6 = buildSection6RevisionPriorities(evalData);

    return `
      <!-- TOP ESSAY HERO DOCKET -->
      <header class="w-full bg-white dark:bg-[#121622] rounded-2xl border border-slate-200 dark:border-slate-800 p-4 sm:p-6 shadow-sm dark:shadow-md transition-colors" aria-labelledby="essayTopicTitle">
        <div class="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div class="space-y-2 flex-1 min-w-0">
            <div class="flex flex-wrap items-center gap-2">
              <span class="px-2.5 py-0.5 rounded-full text-xs font-bold tracking-wide uppercase bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20">
                UPSC Essay Evaluation
              </span>
              <span class="px-2.5 py-0.5 rounded-full text-xs font-mono font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                Sustained Argument Assessment
              </span>
              ${verdict ? `
                <span class="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
                  ${escapeHTML(verdict)}
                </span>
              ` : ''}
            </div>
            <h1 id="essayTopicTitle" class="text-base sm:text-lg md:text-xl font-bold font-serif text-slate-900 dark:text-slate-100 leading-snug tracking-tight">
              &ldquo;${escapeHTML(topic)}&rdquo;
            </h1>
            <p class="text-xs text-slate-500 dark:text-slate-400">
              Evaluated on thesis coherence, sustained relevance, multi-perspective reasoning, and candidate voice preservation.
            </p>
          </div>

          ${score !== null ? `
            <div class="flex items-center md:flex-col md:items-end justify-between border-t md:border-t-0 md:border-l border-slate-200 dark:border-slate-800 pt-3 md:pt-0 md:pl-6 shrink-0">
              <span class="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Evaluated Mark</span>
              <div class="flex items-baseline space-x-1">
                <span class="text-2xl sm:text-3xl font-extrabold font-mono text-amber-600 dark:text-amber-400">${score.toFixed(1)}</span>
                <span class="text-sm font-semibold font-mono text-slate-400 dark:text-slate-500">/ ${maxMarks}</span>
              </div>
            </div>
          ` : ''}
        </div>

        <!-- MOBILE & TABLET VIEW SWITCHER TABS -->
        <div class="lg:hidden mt-4 pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2">
          <button id="essayMobileViewAnalysisBtn" class="flex-1 py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center space-x-1.5 transition ${essayState.activeMobileView === 'analysis' ? 'bg-amber-500 text-white shadow-sm' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'}" aria-pressed="${essayState.activeMobileView === 'analysis'}">
            <i data-lucide="book-open" class="w-3.5 h-3.5"></i>
            <span>Evaluation Analysis</span>
          </button>
          <button id="essayMobileViewScriptBtn" class="flex-1 py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center space-x-1.5 transition ${essayState.activeMobileView === 'viewer' ? 'bg-amber-500 text-white shadow-sm' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'}" aria-pressed="${essayState.activeMobileView === 'viewer'}">
            <i data-lucide="file-text" class="w-3.5 h-3.5"></i>
            <span>Uploaded Script (${totalPages} ${totalPages === 1 ? 'Page' : 'Pages'})</span>
          </button>
        </div>
      </header>

      <!-- MAIN WORKSPACE LAYOUT (50:50 on Desktop, Togglable on Mobile/Tablet) -->
      <div class="flex flex-col lg:flex-row gap-6 items-start w-full">
        
        <!-- LEFT COLUMN: MULTI-PAGE ESSAY SCRIPT VIEWER -->
        <aside id="essayScriptViewerColumn" class="essay-col-viewer shrink-0 flex flex-col gap-4 essay-sticky-sidebar ${essayState.activeMobileView === 'analysis' ? 'essay-mobile-hidden' : ''}" aria-label="Candidate Uploaded Essay Script">
          ${buildScriptViewerHTML(evalData)}
        </aside>

        <!-- RIGHT COLUMN: ESSAY EVALUATION SECTIONS (Rendered strictly when data exists) -->
        <main id="essayAnalysisColumn" class="essay-col-analysis flex flex-col gap-6 min-w-0 ${essayState.activeMobileView === 'viewer' ? 'essay-mobile-hidden' : ''}" aria-label="Essay Evaluation Breakdown">
          ${sec1}
          ${sec2}
          ${sec3}
          ${sec4}
          ${sec5}
          ${sec6}
        </main>
      </div>
    `;
  }

  /**
   * Helper: verify page number against transcribed text or hints.
   * If cannot reliably identify the page within 1..totalPages, returns null to omit false claims.
   */
  function verifyCandidatePage(quote, rawPage, hintText, transcribedText, totalPages) {
    if (!totalPages || totalPages <= 0) return null;

    // 1. Prioritize text-grounded search against transcribedText
    if (transcribedText && quote) {
      const quoteWords = String(quote).toLowerCase().replace(/[^a-z0-9\s]/g, '').split(/\s+/).filter(w => w.length > 3);
      if (quoteWords.length >= 2) {
        const pages = transcribedText.split(/\[Page\s*(\d+)\]/i);
        let bestPage = null;
        let maxMatches = 0;

        for (let i = 1; i < pages.length; i += 2) {
          const pNum = parseInt(pages[i], 10);
          if (pNum < 1 || pNum > totalPages) continue;
          const pText = pages[i + 1].toLowerCase();
          let matches = 0;
          for (const qw of quoteWords) {
            if (pText.includes(qw)) matches++;
          }
          if (matches > maxMatches && matches >= 2) {
            maxMatches = matches;
            bestPage = pNum;
          }
        }
        if (bestPage) return bestPage;
      }
    }

    // 2. Hint text / badge mentioning "Page X"
    if (hintText) {
      const m = String(hintText).match(/Page\s*(\d+)/i);
      if (m) {
        const p = parseInt(m[1], 10);
        if (p >= 1 && p <= totalPages) return p;
      }
    }

    // 3. Raw page number within valid range
    if (typeof rawPage === 'number' && rawPage >= 1 && rawPage <= totalPages) {
      return rawPage;
    }

    return null;
  }

  /**
   * Helper: parse page range from text, e.g. "(Pages 4-6)" or "Page 2"
   */
  function parsePageRange(text, totalPages) {
    const pages = new Set();
    if (!text) return [];
    const rangeMatch = String(text).match(/\(Pages?\s*(\d+)(?:[-–](\d+))?\)/i);
    if (rangeMatch) {
      const start = parseInt(rangeMatch[1], 10);
      const end = rangeMatch[2] ? parseInt(rangeMatch[2], 10) : start;
      for (let p = Math.max(1, start); p <= Math.min(totalPages, end); p++) {
        pages.add(p);
      }
    } else {
      const singleMatch = String(text).match(/Page\s*(\d+)/i);
      if (singleMatch) {
        const p = parseInt(singleMatch[1], 10);
        if (p >= 1 && p <= totalPages) pages.add(p);
      }
    }
    return Array.from(pages);
  }

  /**
   * Section 1: Essay Overview
   * Highlights central thesis (inferred vs stated), executive assessment, and high-impact diagnostic takeaway
   */
  function buildSection1Overview(evalData) {
    const summary = evalData.executive_summary || evalData.examiner_overall_verdict || evalData.overall_assessment || null;

    // Detect thesis: check explicit fields first, else infer from intro analysis
    let thesis = null;
    let isInferred = false;

    if (evalData.central_thesis && String(evalData.central_thesis).trim()) {
      thesis = String(evalData.central_thesis).trim();
      isInferred = false;
    } else if (evalData.thesis_statement && String(evalData.thesis_statement).trim()) {
      thesis = String(evalData.thesis_statement).trim();
      isInferred = false;
    } else if (evalData.intro_audit && evalData.intro_audit.topic_vs_question_relevance) {
      thesis = String(evalData.intro_audit.topic_vs_question_relevance).trim();
      isInferred = true;
    }

    // Extract candidate opening passage if available to ground the inferred thesis
    let openingEvidence = null;
    if (evalData.point_by_point_audit && evalData.point_by_point_audit[0] && evalData.point_by_point_audit[0].what_you_wrote) {
      openingEvidence = evalData.point_by_point_audit[0].what_you_wrote;
    } else if (evalData.intro_audit && evalData.intro_audit.opening_passage) {
      openingEvidence = evalData.intro_audit.opening_passage;
    } else if (evalData.transcribed_text) {
      const p1Match = evalData.transcribed_text.match(/\[Page\s*1\]\s*(.*?)(?=\[Page\s*2\]|$)/s);
      if (p1Match) {
        openingEvidence = p1Match[1].trim().split('\n').filter(Boolean).slice(0, 2).join(' ');
      }
    }

    const fatalAlert = evalData.fatal_blunders_alert && evalData.fatal_blunders_alert.has_blunder
      ? evalData.fatal_blunders_alert
      : null;

    const guidance = evalData.body_audit && evalData.body_audit.examiner_guidance
      ? evalData.body_audit.examiner_guidance
      : null;

    if (!thesis && !summary && !fatalAlert && !guidance) {
      return '';
    }

    return `
      <section class="bg-white dark:bg-[#121622] rounded-2xl border border-slate-200 dark:border-slate-800 p-4 sm:p-5 shadow-sm space-y-4" aria-labelledby="section1Heading">
        <div class="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
          <h2 id="section1Heading" class="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center space-x-2">
            <span class="w-2 h-2 rounded-full bg-amber-500"></span>
            <span>1. Essay Overview & Central Thesis</span>
          </h2>
          <span class="text-[10px] text-slate-400 font-mono">Foundational Premise</span>
        </div>

        <!-- Central Thesis Card (Rendered only when thesis data exists) -->
        ${thesis ? `
          <div class="rounded-xl p-3.5 bg-amber-500/5 dark:bg-amber-500/10 border border-amber-500/25 space-y-3">
            <div class="flex items-center justify-between gap-2">
              <span class="text-[11px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 flex items-center space-x-1.5">
                <i data-lucide="compass" class="w-3.5 h-3.5"></i>
                <span>${isInferred ? "Inferred Thesis (Tentative Interpretation)" : "Candidate's Stated Thesis"}</span>
              </span>
              <span class="text-[10px] px-2.5 py-0.5 rounded-full font-medium ${isInferred ? 'bg-amber-500/15 text-amber-800 dark:text-amber-300 border border-amber-500/20' : 'bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 border border-emerald-500/20'}">
                ${isInferred ? 'Inferred — Not Stated Verbatim' : 'Explicitly Stated in Draft'}
              </span>
            </div>

            ${isInferred && openingEvidence ? `
              <div class="space-y-1">
                <div class="flex items-center justify-between">
                  <span class="text-[10px] font-bold uppercase tracking-wider text-slate-500">Candidate's Opening Framing (From Page 1):</span>
                  <button type="button" onclick="window.essayJumpToPage(1)" class="text-[10px] font-semibold text-amber-600 dark:text-amber-400 hover:underline">
                    View in Script &rarr;
                  </button>
                </div>
                <div class="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-serif italic text-slate-800 dark:text-slate-200 leading-relaxed">
                  &ldquo;${escapeHTML(openingEvidence)}&rdquo;
                </div>
              </div>
            ` : ''}

            <div class="space-y-1">
              <span class="text-[10px] font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300 block">
                ${isInferred ? "Evaluator's Inferred Thesis:" : "Candidate's Stated Premise:"}
              </span>
              <p class="text-xs sm:text-sm font-serif italic text-slate-800 dark:text-slate-200 leading-relaxed">
                &ldquo;${escapeHTML(thesis)}&rdquo;
              </p>
            </div>

            ${isInferred ? `
              <p class="text-[11px] text-slate-500 dark:text-slate-400 pt-0.5">
                Note: Inferred by the evaluator from your opening narrative framing. This is a tentative interpretation to verify whether subsequent arguments remain anchored in this proposition—it is not an imposed thesis or a replacement for your individual voice.
              </p>
            ` : ''}
          </div>
        ` : ''}

        <!-- Evaluator Summary -->
        ${summary ? `
          <div class="space-y-1">
            <h3 class="text-xs font-semibold text-slate-700 dark:text-slate-300">High-Level Evaluator Assessment</h3>
            <div class="text-xs text-slate-600 dark:text-slate-300 leading-relaxed space-y-1">
              ${formatMarkdownText(summary)}
            </div>
          </div>
        ` : ''}

        <!-- Diagnostic Alert / High-Priority Guidance -->
        ${fatalAlert ? `
          <div class="rounded-xl p-3 bg-rose-500/10 border border-rose-500/30 text-rose-800 dark:text-rose-300 space-y-1 text-xs">
            <div class="flex items-center space-x-1.5 font-bold">
              <i data-lucide="alert-triangle" class="w-3.5 h-3.5 text-rose-500"></i>
              <span>${escapeHTML(fatalAlert.title || 'Evaluator Thematic Alert')}</span>
            </div>
            <p>${escapeHTML(fatalAlert.attribution_error || fatalAlert.disciplinary_leak || 'Ensure arguments do not drift into purely administrative bulleting.')}</p>
          </div>
        ` : (guidance ? `
          <div class="rounded-xl p-3 bg-indigo-500/5 dark:bg-indigo-500/10 border border-indigo-500/20 text-slate-700 dark:text-slate-300 space-y-1 text-xs">
            <div class="flex items-center space-x-1.5 font-semibold text-indigo-700 dark:text-indigo-400">
              <i data-lucide="lightbulb" class="w-3.5 h-3.5"></i>
              <span>Evaluator's Structural Takeaway</span>
            </div>
            <p class="leading-relaxed">${escapeHTML(guidance)}</p>
          </div>
        ` : '')}
      </section>
    `;
  }

  /**
   * Section 2: Argument Journey
   * Chronological reasoning chain grounded in candidate's actual written passages and verified pages.
   * Strictly filters out language/grammar issues (moved to expression assessment) and avoids duplicate stages.
   */
  function buildSection2ArgumentJourney(evalData) {
    const journeyStages = [];
    const totalPages = essayState.activePages.length || 1;
    const seenQuotes = new Set();

    function normalizeQuote(str) {
      return String(str || '').toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 35);
    }

    function isCandidateVerbatimQuote(claim, transcribedText) {
      if (!claim || typeof claim !== 'string') return false;
      const str = claim.trim();
      if (str.includes('...') || str.includes('…') || str.includes('..')) return false;
      if (/\.\s+[a-z]/.test(str)) return false;
      if (transcribedText) {
        const cleanClaim = str.replace(/[^a-zA-Z0-9\s]/g, '').toLowerCase().trim();
        const cleanTranscript = transcribedText.replace(/[^a-zA-Z0-9\s]/g, '').toLowerCase();
        if (!cleanTranscript.includes(cleanClaim) || cleanClaim.split(/\s+/).length < 5) {
          return false;
        }
      }
      return true;
    }

    // 1. Process candidate reasoning stages from point_by_point_audit
    if (Array.isArray(evalData.point_by_point_audit) && evalData.point_by_point_audit.length > 0) {
      evalData.point_by_point_audit.forEach((pt, idx) => {
        if (!pt || !pt.title) return;

        // Verify entry is genuinely essay-specific: reject GS-shaped subparts or boilerplate
        if (/^(part\s+[a-z]|sub-?part|demand\s+\d+|gs\d|question\s+\d|directive|qcab)/i.test(pt.title) ||
            /^(part\s+[a-z]|sub-?part|demand\s+\d+|gs\d|qcab)/i.test(pt.badge || '')) {
          return;
        }

        // Filter out dedicated language / grammar / mechanical items from the reasoning journey
        if (/^(grammar|grammatical precision|typograph|spelling|punctuation|language precision|mechanical slips)/i.test(pt.title) ||
            /^(typographical slips|grammatical errors|punctuation slips)/i.test(pt.title)) {
          return;
        }

        const rawQuote = (pt.what_you_wrote || '').trim();
        const qKey = normalizeQuote(rawQuote);
        if (qKey && seenQuotes.has(qKey)) {
          return; // Skip duplicate stage
        }
        if (qKey) seenQuotes.add(qKey);

        const verifiedPage = verifyCandidatePage(rawQuote, pt.page, pt.badge, evalData.transcribed_text, totalPages);
        const cleanAnalysis = (pt.examiner_verdict || '').replace(/,?\s*though\s+spelling\s+errors?[^.]*\.?/gi, '').trim();
        const isVerbatim = isCandidateVerbatimQuote(rawQuote, evalData.transcribed_text);

        journeyStages.push({
          stage: pt.title || `Reasoning Stage ${journeyStages.length + 1}`,
          page: verifiedPage,
          claim: rawQuote,
          isVerbatim: isVerbatim,
          analysis: cleanAnalysis,
          status: pt.is_positive ? 'strong' : 'drift',
          statusLabel: pt.credit_badge || (pt.is_positive ? 'Coherent Reasoning' : 'Counter-Perspective')
        });
      });
    } else if (evalData.body_audit && Array.isArray(evalData.body_audit.strengths) && evalData.body_audit.strengths.length > 0) {
      // Fallback only if point_by_point_audit absent: extract candidate text
      evalData.body_audit.strengths.forEach((strengthText, idx) => {
        let cleanText = strengthText;
        let title = `Argument Development ${idx + 1}`;
        const headerMatch = strengthText.match(/^\*\*([^*]+)\*\*:\s*(.*)/s);
        if (headerMatch) {
          title = headerMatch[1].replace(/\s*\(Pages?[^)]*\)/gi, '').trim();
          cleanText = headerMatch[2];
        }

        let quotedCandidate = '';
        const quoteMatch = cleanText.match(/citing\s+\*\*([^*]+)\*\*|"([^"]+)"|'([^']+)'/);
        if (quoteMatch) {
          quotedCandidate = (quoteMatch[1] || quoteMatch[2] || quoteMatch[3] || '').trim();
        }

        const qKey = normalizeQuote(quotedCandidate);
        if (qKey && seenQuotes.has(qKey)) return;
        if (qKey) seenQuotes.add(qKey);

        const verifiedPage = verifyCandidatePage(quotedCandidate, null, strengthText, evalData.transcribed_text, totalPages);

        if (quotedCandidate || verifiedPage !== null) {
          journeyStages.push({
            stage: title,
            page: verifiedPage,
            claim: quotedCandidate,
            analysis: cleanText,
            status: 'strong',
            statusLabel: 'Coherent Reasoning'
          });
        }
      });
    }

    // 2. Concluding Synthesis: check if conclusion was already covered in point_by_point_audit
    const hasConcludingStage = journeyStages.some(s => s.page === totalPages || /conclusion|synthesis|edison/i.test(s.stage));
    if (!hasConcludingStage && evalData.conclusion_audit && (evalData.conclusion_audit.current_critique || evalData.conclusion_audit.conclusion_archetype)) {
      const isWeak = Boolean(evalData.conclusion_audit.failure_mode && !/none/i.test(evalData.conclusion_audit.failure_mode));

      let concludingQuote = '';
      if (evalData.transcribed_text) {
        const lastPage = evalData.transcribed_text.split(/\[Page\s*(\d+)\]/i);
        if (lastPage.length >= 3) {
          const lastPageText = lastPage[lastPage.length - 1].trim();
          const lastSentences = lastPageText.split('.').map(s => s.trim()).filter(Boolean);
          if (lastSentences.length > 0) {
            concludingQuote = lastSentences.slice(-1)[0] + '.';
          }
        }
      }

      const qKey = normalizeQuote(concludingQuote);
      if (!qKey || !seenQuotes.has(qKey)) {
        journeyStages.push({
          stage: evalData.conclusion_audit.conclusion_archetype ? `Concluding Synthesis: ${evalData.conclusion_audit.conclusion_archetype}` : 'Concluding Synthesis',
          page: totalPages,
          claim: concludingQuote,
          analysis: evalData.conclusion_audit.current_critique || '',
          status: isWeak ? 'drift' : 'strong',
          statusLabel: isWeak ? evalData.conclusion_audit.failure_mode : 'Concluding Synthesis'
        });
      }
    }

    // 3. Order strictly by candidate's actual progression (page order)
    journeyStages.sort((a, b) => {
      const pA = a.page !== null && a.page !== undefined ? a.page : 999;
      const pB = b.page !== null && b.page !== undefined ? b.page : 999;
      return pA - pB;
    });

    if (journeyStages.length === 0) {
      return '';
    }

    return `
      <section class="bg-white dark:bg-[#121622] rounded-2xl border border-slate-200 dark:border-slate-800 p-4 sm:p-5 shadow-sm space-y-4" aria-labelledby="section2Heading">
        <div class="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
          <div class="space-y-0.5">
            <h2 id="section2Heading" class="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center space-x-2">
              <span class="w-2 h-2 rounded-full bg-indigo-500"></span>
              <span>2. Argument Journey</span>
            </h2>
            <p class="text-[11px] text-slate-500 dark:text-slate-400">
              Chronological reasoning chain: tracks how candidate ideas develop from opening premise to concluding synthesis.
            </p>
          </div>
          <span class="text-[10px] text-slate-400 font-mono">${journeyStages.length} Distinct Stages</span>
        </div>

        <!-- Journey Timeline -->
        <div class="essay-journey-timeline space-y-5 pt-1">
          ${journeyStages.map((stg) => {
            const badgeClass = stg.status === 'strong'
              ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20'
              : 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20';

            // Check if claim is a confident verbatim quotation vs an evaluator excerpt/paraphrase
            const hasClaim = Boolean(stg.claim && String(stg.claim).trim().length > 0);
            const isConfidentVerbatim = Boolean(hasClaim && stg.isVerbatim);

            return `
              <div class="essay-journey-node space-y-2">
                <div class="essay-journey-dot"></div>
                <div class="flex flex-wrap items-center justify-between gap-1.5">
                  <span class="text-xs font-bold text-slate-900 dark:text-slate-100">${escapeHTML(stg.stage)}</span>
                  <div class="flex items-center space-x-2">
                    <span class="text-[10px] font-semibold px-2 py-0.5 rounded-full border ${badgeClass}">
                      ${escapeHTML(stg.statusLabel)}
                    </span>
                    ${stg.page !== null && stg.page !== undefined ? `
                      <button type="button" onclick="window.essayJumpToPage(${stg.page})" class="text-[10px] font-mono font-medium text-amber-600 dark:text-amber-400 hover:underline cursor-pointer">
                        Page ${stg.page} &rarr;
                      </button>
                    ` : ''}
                  </div>
                </div>

                ${isConfidentVerbatim ? `
                  <div class="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 font-serif italic">
                    &ldquo;${escapeHTML(stg.claim)}&rdquo;
                  </div>
                ` : (hasClaim ? `
                  <div class="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-400">
                    <span class="font-semibold block text-[10px] uppercase text-slate-400 mb-0.5">Evaluator Excerpt / Paraphrase:</span>
                    <span class="text-slate-700 dark:text-slate-300">${escapeHTML(stg.claim)}</span>
                  </div>
                ` : `
                  <div class="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-400">
                    <span class="font-semibold block text-[10px] uppercase text-slate-400">Candidate Progression Focus:</span>
                    <span>${escapeHTML(stg.analysis || 'Argument developed in candidate script.')}</span>
                  </div>
                `)}

                ${stg.analysis ? `
                  <div class="text-xs text-slate-600 dark:text-slate-400 leading-relaxed pl-1">
                    ${formatMarkdownText(stg.analysis)}
                  </div>
                ` : ''}
              </div>
            `;
          }).join('')}
        </div>
      </section>
    `;
  }

  /**
   * Section 3: Topic Alignment Across Pages
   * Strictly bounded to actual uploaded pages. No phantom or fabricated pages.
   */
  function buildSection3TopicAlignment(evalData) {
    const totalPages = essayState.activePages.length || 0;
    if (totalPages === 0) return '';

    // Aggregate page observations strictly within 1..totalPages
    const pageDataMap = {};
    for (let p = 1; p <= totalPages; p++) {
      pageDataMap[p] = { annotations: [], observations: [] };
    }

    if (Array.isArray(evalData.visual_annotations)) {
      evalData.visual_annotations.forEach(ann => {
        const p = ann.page || ann.page_number || 1;
        if (p >= 1 && p <= totalPages) {
          pageDataMap[p].annotations.push(ann);
        }
      });
    }

    // Page-referenced observations from body_audit
    if (evalData.body_audit && Array.isArray(evalData.body_audit.strengths)) {
      evalData.body_audit.strengths.forEach(s => {
        const pages = parsePageRange(s, totalPages);
        pages.forEach(p => {
          pageDataMap[p].observations.push({ text: s, isStrength: true });
        });
      });
    }

    if (evalData.body_audit && Array.isArray(evalData.body_audit.critical_gaps)) {
      evalData.body_audit.critical_gaps.forEach(g => {
        const pages = parsePageRange(g, totalPages);
        pages.forEach(p => {
          pageDataMap[p].observations.push({ text: g, isStrength: false });
        });
      });
    }

    const displayPages = Array.from({ length: totalPages }, (_, i) => i + 1);

    return `
      <section class="bg-white dark:bg-[#121622] rounded-2xl border border-slate-200 dark:border-slate-800 p-4 sm:p-5 shadow-sm space-y-4" aria-labelledby="section3Heading">
        <div class="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
          <div class="space-y-0.5">
            <h2 id="section3Heading" class="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center space-x-2">
              <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>3. Topic Alignment Across Pages</span>
            </h2>
            <p class="text-[11px] text-slate-500 dark:text-slate-400">
              Follow your argument's development page-by-page. Select any page to inspect observations.
            </p>
          </div>
          <span class="text-[10px] text-slate-400 font-mono">${totalPages} ${totalPages === 1 ? 'Page' : 'Pages'}</span>
        </div>

        <!-- Horizontal Interactive Page Selector Strip -->
        <div class="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-slate-100 dark:border-slate-800/80" role="tablist" aria-label="Essay Pages Alignment Selector">
          ${displayPages.map(pageNum => {
            const hasData = (pageDataMap[pageNum].annotations.length > 0 || pageDataMap[pageNum].observations.length > 0);
            const isCurrent = pageNum === essayState.currentPageIndex + 1;
            return `
              <button type="button" onclick="window.essaySelectAlignmentPage(${pageNum})" class="essay-page-strip-item px-3 py-1 rounded-lg text-xs font-mono font-medium border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:border-amber-500 whitespace-nowrap cursor-pointer ${isCurrent ? 'active' : ''}">
                Pg ${pageNum} ${hasData ? '&bull;' : ''}
              </button>
            `;
          }).join('')}
        </div>

        <!-- Selected Page Observations Container -->
        <div id="essayPageAlignmentDetail" class="space-y-3 pt-1">
          ${renderPageAlignmentDetails(essayState.currentPageIndex + 1, pageDataMap[essayState.currentPageIndex + 1])}
        </div>
      </section>
    `;
  }

  /**
   * Helper to render details for a specific page in Section 3
   */
  function renderPageAlignmentDetails(pageNum, pageInfo) {
    const anns = (pageInfo && Array.isArray(pageInfo.annotations)) ? pageInfo.annotations : [];
    const obss = (pageInfo && Array.isArray(pageInfo.observations)) ? pageInfo.observations : [];

    if (anns.length === 0 && obss.length === 0) {
      return `
        <div class="rounded-xl p-3 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs text-slate-500">
          <span>Page ${pageNum}: No critical reasoning deviations or margin marks recorded on this page.</span>
          <button type="button" onclick="window.essayJumpToPage(${pageNum})" class="text-xs font-semibold text-amber-600 dark:text-amber-400 hover:underline">
            View Page ${pageNum} in Script &rarr;
          </button>
        </div>
      `;
    }

    return `
      <div class="space-y-2.5">
        <div class="flex items-center justify-between">
          <span class="text-xs font-bold text-slate-800 dark:text-slate-200">
            Observations on Page ${pageNum}
          </span>
          <button type="button" onclick="window.essayJumpToPage(${pageNum})" class="text-xs font-semibold text-amber-600 dark:text-amber-400 hover:underline cursor-pointer flex items-center space-x-1">
            <i data-lucide="eye" class="w-3.5 h-3.5"></i>
            <span>Jump to Page ${pageNum}</span>
          </button>
        </div>

        ${pageInfo.observations.map(obs => `
          <div class="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1 text-xs">
            <div class="flex items-center justify-between">
              <span class="font-semibold text-slate-900 dark:text-slate-100">
                ${obs.isStrength ? 'Candidate Argument Developed' : 'Analytical Scope Gap'}
              </span>
              <span class="text-[10px] px-2 py-0.5 rounded ${obs.isStrength ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-600 border border-amber-500/20'}">
                ${obs.isStrength ? 'Coherent' : 'Scope Limitation'}
              </span>
            </div>
            <div class="text-slate-600 dark:text-slate-400 leading-relaxed pt-0.5">
              ${formatMarkdownText(obs.text)}
            </div>
          </div>
        `).join('')}

        ${pageInfo.annotations.map(ann => `
          <div class="p-3 rounded-xl bg-amber-500/5 dark:bg-amber-500/10 border border-amber-500/20 space-y-1 text-xs">
            <div class="flex items-center justify-between font-semibold text-amber-800 dark:text-amber-300">
              <span>${escapeHTML(ann.tag || 'Examiner Script Margin Observation')}</span>
              ${ann.marks_awarded ? `<span class="font-mono text-[10px]">${escapeHTML(ann.marks_awarded)}</span>` : ''}
            </div>
            <p class="text-slate-700 dark:text-slate-300">${formatMarkdownText(ann.remark || '')}</p>
          </div>
        `).join('')}
      </div>
    `;
  }

  /**
   * Section 4: Essay-Specific Assessment Dimensions
   * Removed any fixed or prescriptive labels (e.g. "Civilizational Resolution").
   * Renders only dimensions backed by actual returned data.
   */
  function buildSection4DimensionalAssessment(evalData) {
    const dimensions = [];

    // 1. Thesis Interpretation & Framing (from intro_audit)
    if (evalData.intro_audit && (evalData.intro_audit.current_critique || evalData.intro_audit.topic_vs_question_relevance)) {
      dimensions.push({
        title: 'Thesis Interpretation & Framing',
        score: evalData.intro_audit.intro_score,
        max: evalData.intro_audit.intro_max,
        content: `
          <div class="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
            ${evalData.intro_audit.intro_archetype ? `<p><strong>Opening Structure:</strong> ${escapeHTML(evalData.intro_audit.intro_archetype)}</p>` : ''}
            ${evalData.intro_audit.topic_vs_question_relevance ? `<p><strong>Topic Grounding:</strong> ${escapeHTML(evalData.intro_audit.topic_vs_question_relevance)}</p>` : ''}
            ${evalData.intro_audit.current_critique ? `<p><strong>Evaluator Critique:</strong> ${escapeHTML(evalData.intro_audit.current_critique)}</p>` : ''}
          </div>
        `
      });
    }

    // 2. Reasoning Depth & Analytical Rigor (from body_audit)
    if (evalData.body_audit) {
      const strengths = Array.isArray(evalData.body_audit.strengths) ? evalData.body_audit.strengths : [];
      const allGaps = Array.isArray(evalData.body_audit.critical_gaps) ? evalData.body_audit.critical_gaps : [];
      const substantiveGaps = allGaps.filter(g => !/grammar|typograph|slip|spelling|colloquial|language/i.test(g));
      const languageGaps = allGaps.filter(g => /grammar|typograph|slip|spelling|colloquial|language/i.test(g));

      if (strengths.length > 0 || substantiveGaps.length > 0) {
        dimensions.push({
          title: 'Reasoning Depth & Analytical Rigor',
          score: evalData.body_audit.body_score,
          max: evalData.body_audit.body_max,
          content: `
            <div class="space-y-2 text-xs">
              ${strengths.length > 0 ? `
                <div class="space-y-1">
                  <span class="font-bold text-emerald-700 dark:text-emerald-400 text-[11px] uppercase tracking-wider">&check; Strong Lines of Reasoning:</span>
                  <ul class="list-disc pl-4 space-y-0.5 text-slate-700 dark:text-slate-300">
                    ${strengths.map(s => `<li>${formatMarkdownText(s)}</li>`).join('')}
                  </ul>
                </div>
              ` : ''}
              ${substantiveGaps.length > 0 ? `
                <div class="space-y-1 pt-1">
                  <span class="font-bold text-rose-700 dark:text-rose-400 text-[11px] uppercase tracking-wider">&bull; Critical Gaps in Argument Scope:</span>
                  <ul class="list-disc pl-4 space-y-0.5 text-slate-700 dark:text-slate-300">
                    ${substantiveGaps.map(g => `<li>${formatMarkdownText(g)}</li>`).join('')}
                  </ul>
                </div>
              ` : ''}
            </div>
          `
        });
      }

      // Dedicated Expression & Language Precision dimension (moved from Argument Journey)
      if (languageGaps.length > 0) {
        dimensions.push({
          title: 'Expression, Style & Language Precision',
          content: `
            <div class="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
              <span class="font-bold text-slate-800 dark:text-slate-200 text-[11px] uppercase tracking-wider block">Language &amp; Mechanical Observations:</span>
              <ul class="list-disc pl-4 space-y-1">
                ${languageGaps.map(g => `<li>${formatMarkdownText(g)}</li>`).join('')}
              </ul>
              <p class="text-[11px] text-slate-500 dark:text-slate-400 pt-1">
                Evaluator note: Typographical slips and colloquialisms are assessed here under expression and style; they do not alter the substantive validity of your argument journey.
              </p>
            </div>
          `
        });
      }
    }

    // 3. Multi-Dimensionality & Perspectives (from body_audit.missing_dimensions)
    if (evalData.body_audit && Array.isArray(evalData.body_audit.missing_dimensions) && evalData.body_audit.missing_dimensions.length > 0) {
      dimensions.push({
        title: 'Thematic Dimensions & Perspectives',
        content: `
          <div class="space-y-1.5 text-xs">
            <p class="text-slate-600 dark:text-slate-400">Dimensions that deepen perspective for this topic:</p>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              ${evalData.body_audit.missing_dimensions.map(dim => `
                <div class="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300">
                  ${formatMarkdownText(dim)}
                </div>
              `).join('')}
            </div>
          </div>
        `
      });
    }

    // 4. Evidence & Substantiation (from current_affairs_value_add or missing_keywords_cards)
    if (evalData.current_affairs_value_add || Array.isArray(evalData.missing_keywords_cards)) {
      const curEx = evalData.current_affairs_value_add;
      const kwCards = Array.isArray(evalData.missing_keywords_cards) ? evalData.missing_keywords_cards.slice(0, 3) : [];
      if ((curEx && curEx.current_example_insertion && curEx.current_example_insertion.recommended_insertion) || kwCards.length > 0) {
        dimensions.push({
          title: 'Evidence & Substantiation',
          content: `
            <div class="space-y-2 text-xs">
              ${curEx && curEx.current_example_insertion && curEx.current_example_insertion.recommended_insertion ? `
                <div class="p-2.5 rounded-lg bg-indigo-500/5 dark:bg-indigo-500/10 border border-indigo-500/20 text-slate-700 dark:text-slate-300 space-y-1">
                  <span class="font-bold text-indigo-700 dark:text-indigo-400 text-[11px]">Substantiation Recommendation:</span>
                  <p>${formatMarkdownText(curEx.current_example_insertion.recommended_insertion)}</p>
                </div>
              ` : ''}
              ${kwCards.length > 0 ? `
                <div class="space-y-1 pt-1">
                  <span class="font-semibold text-slate-700 dark:text-slate-300 text-[11px]">Key Concepts for Analytical Rigor:</span>
                  <div class="flex flex-wrap gap-1.5">
                    ${kwCards.map(c => `
                      <span class="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 font-mono text-[11px]">
                        ${escapeHTML(c.term || '')}
                      </span>
                    `).join('')}
                  </div>
                </div>
              ` : ''}
            </div>
          `
        });
      }
    }

    // 5. Concluding Synthesis (from conclusion_audit) - no prescriptive "Civilizational Resolution" label!
    if (evalData.conclusion_audit && (evalData.conclusion_audit.current_critique || evalData.conclusion_audit.conclusion_archetype)) {
      const conclTitle = evalData.conclusion_audit.conclusion_archetype
        ? `Conclusion: ${evalData.conclusion_audit.conclusion_archetype}`
        : 'Concluding Synthesis';

      dimensions.push({
        title: conclTitle,
        score: evalData.conclusion_audit.conclusion_score || evalData.conclusion_audit.score,
        max: evalData.conclusion_audit.conclusion_max,
        content: `
          <div class="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
            ${evalData.conclusion_audit.failure_mode && !/none/i.test(evalData.conclusion_audit.failure_mode) ? `<p><strong>Evaluator Observation:</strong> ${escapeHTML(evalData.conclusion_audit.failure_mode)}</p>` : ''}
            ${evalData.conclusion_audit.current_critique ? `<p>${formatMarkdownText(evalData.conclusion_audit.current_critique)}</p>` : ''}
          </div>
        `
      });
    }

    // 6. Word & Time Discipline (from upsc_exam_hall_discipline)
    if (evalData.upsc_exam_hall_discipline) {
      const d = evalData.upsc_exam_hall_discipline;
      dimensions.push({
        title: 'Word Count & Exam Discipline',
        content: `
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
            <div class="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <span class="text-[10px] text-slate-400 block uppercase">Word Count</span>
              <span class="font-bold font-mono text-slate-800 dark:text-slate-200">${d.estimated_word_count || 'N/A'}w</span>
            </div>
            <div class="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <span class="text-[10px] text-slate-400 block uppercase">Limit Status</span>
              <span class="font-bold text-slate-800 dark:text-slate-200">${escapeHTML(d.word_budget_status || 'Compliant')}</span>
            </div>
            <div class="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <span class="text-[10px] text-slate-400 block uppercase">Estimated Time</span>
              <span class="font-bold font-mono text-slate-800 dark:text-slate-200">${d.estimated_writing_time_mins || 'N/A'}m</span>
            </div>
            <div class="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <span class="text-[10px] text-slate-400 block uppercase">Margin Space</span>
              <span class="font-bold text-slate-800 dark:text-slate-200">${escapeHTML(d.margin_discipline || 'Compliant')}</span>
            </div>
          </div>
        `
      });
    }

    if (dimensions.length === 0) {
      return '';
    }

    return `
      <section class="bg-white dark:bg-[#121622] rounded-2xl border border-slate-200 dark:border-slate-800 p-4 sm:p-5 shadow-sm space-y-4" aria-labelledby="section4Heading">
        <div class="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
          <div class="space-y-0.5">
            <h2 id="section4Heading" class="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center space-x-2">
              <span class="w-2 h-2 rounded-full bg-blue-500"></span>
              <span>4. Essay-Specific Assessment Dimensions</span>
            </h2>
            <p class="text-[11px] text-slate-500 dark:text-slate-400">
              Evaluator feedback structured around authentic essay dimensions without forced GS rubrics.
            </p>
          </div>
          <span class="text-[10px] text-slate-400 font-mono">${dimensions.length} Dimensions</span>
        </div>

        <div class="space-y-3">
          ${dimensions.map((dim, idx) => `
            <details class="group rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 overflow-hidden" ${idx < 2 ? 'open' : ''}>
              <summary class="p-3 sm:p-3.5 flex items-center justify-between cursor-pointer select-none font-semibold text-xs text-slate-800 dark:text-slate-200 group-hover:bg-slate-100 dark:group-hover:bg-slate-800/60 transition">
                <span class="flex items-center space-x-2">
                  <span class="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                  <span>${escapeHTML(dim.title)}</span>
                </span>
                <div class="flex items-center space-x-3">
                  ${dim.score !== undefined && dim.score !== null ? `
                    <span class="font-mono text-xs font-bold text-amber-600 dark:text-amber-400">
                      ${dim.score} ${dim.max ? `/ ${dim.max}` : ''}
                    </span>
                  ` : ''}
                  <i data-lucide="chevron-down" class="w-3.5 h-3.5 text-slate-400 group-open:rotate-180 transition-transform"></i>
                </div>
              </summary>
              <div class="p-3 sm:p-3.5 pt-0 border-t border-slate-200 dark:border-slate-800/60">
                ${dim.content}
              </div>
            </details>
          `).join('')}
        </div>
      </section>
    `;
  }

  /**
   * Section 5: Page-Linked Annotations
   * Clearly separates candidate text, evaluator remark, and voice-preserving revision.
   * Precise page and pin linkage.
   */
  function buildSection5Annotations(evalData) {
    const rawAnnotations = Array.isArray(evalData.visual_annotations) ? evalData.visual_annotations : [];
    if (rawAnnotations.length === 0) {
      return '';
    }

    const totalPages = essayState.activePages.length || 1;

    return `
      <section class="bg-white dark:bg-[#121622] rounded-2xl border border-slate-200 dark:border-slate-800 p-4 sm:p-5 shadow-sm space-y-4" aria-labelledby="section5Heading">
        <div class="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
          <div class="space-y-0.5">
            <h2 id="section5Heading" class="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center space-x-2">
              <span class="w-2 h-2 rounded-full bg-amber-500"></span>
              <span>5. Page-Linked Annotations</span>
            </h2>
            <p class="text-[11px] text-slate-500 dark:text-slate-400">
              Passage-specific observations directly mapped to your uploaded pages. Click to locate in script.
            </p>
          </div>
          <span class="text-[10px] text-slate-400 font-mono">${rawAnnotations.length} Remarks</span>
        </div>

        <div class="space-y-3">
          ${rawAnnotations.map((ann, i) => {
            const pageNum = Math.min(totalPages, Math.max(1, ann.page || ann.page_number || 1));
            const remarkText = ann.remark || '';
            
            // Extract quotes or splits if formatted
            let candidateText = ann.quote || '';
            let evaluatorObservation = remarkText;

            if (remarkText.includes('📌 **Candidate**:') || remarkText.includes('✓ **Candidate**:')) {
              const parts = remarkText.split(/[📌✓]\s*\*\*Candidate\*\*:\s*|\n*[💡✎]\s*\*\*(?:Prescription|Expansion Tip|Actionable Fix|To Score Full Marks)\*\*:\s*|\n*⚡\s*\*\*Diagnostic\*\*:\s*/i);
              if (parts.length > 1) {
                candidateText = parts[1].split('\n')[0].replace(/^["'*]+|["'*]+$/g, '');
                evaluatorObservation = parts.slice(2).join('\n') || parts[0];
              }
            }

            // Clean out backend GS-specific fallback templates if injected into annotation
            evaluatorObservation = evaluatorObservation
              .split('\n')
              .filter(line => !/outcome-linked fiscal governance|last-mile capacity building/i.test(line))
              .join('\n')
              .trim();

            return `
              <div class="essay-annotation-card rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 p-3 sm:p-3.5 space-y-2.5 transition cursor-pointer" onclick="window.essayJumpToPageAndHighlight(${pageNum}, ${i})">
                <div class="flex items-center justify-between gap-2">
                  <div class="flex items-center space-x-2">
                    <span class="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/25">
                      Page ${pageNum}
                    </span>
                    <span class="text-xs font-bold text-slate-800 dark:text-slate-200">
                      ${escapeHTML(ann.tag || 'Examiner Margin Note')}
                    </span>
                  </div>
                  <button type="button" class="text-[11px] font-semibold text-amber-600 dark:text-amber-400 hover:underline flex items-center space-x-1">
                    <span>Jump &rarr;</span>
                  </button>
                </div>

                ${candidateText ? `
                  <div class="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-serif italic text-xs text-slate-800 dark:text-slate-200">
                    &ldquo;${escapeHTML(candidateText)}&rdquo;
                  </div>
                ` : ''}

                <div class="text-xs text-slate-600 dark:text-slate-300 leading-relaxed space-y-1">
                  <span class="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Evaluator Observation</span>
                  <div>${formatMarkdownText(evaluatorObservation)}</div>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </section>
    `;
  }

  /**
   * Section 6: Revision Priorities
   * Actionable suggestions that strictly preserve candidate voice and point of view
   */
  function buildSection6RevisionPriorities(evalData) {
    const priorities = [];
    const totalPages = essayState.activePages.length || 1;

    // Next attempt focus
    if (evalData.next_attempt_focus) {
      const naf = evalData.next_attempt_focus;
      const verifiedDraftPage = verifyCandidatePage(naf.student_draft_quote, null, naf.booklet_placement, evalData.transcribed_text, totalPages);

      priorities.push({
        title: naf.target_section || 'Reinforcing Argument Transitions',
        weakness: naf.student_draft_quote || '',
        verifiedPage: verifiedDraftPage,
        optionalExample: naf.topper_transformation || '',
        why: naf.mentor_why || ''
      });
    }

    // Critical gaps from body audit
    if (evalData.body_audit && Array.isArray(evalData.body_audit.critical_gaps)) {
      evalData.body_audit.critical_gaps.slice(0, 2).forEach((gap, idx) => {
        let cleanGap = gap;
        let title = `Analytical Revision ${idx + 2}`;
        const headerMatch = gap.match(/^\*\*([^*]+)\*\*:\s*(.*)/s);
        if (headerMatch) {
          title = headerMatch[1].replace(/\s*\(Pages?[^)]*\)/gi, '').trim();
          cleanGap = headerMatch[2];
        }

        const verifiedGapPage = verifyCandidatePage(null, null, gap, evalData.transcribed_text, totalPages);

        priorities.push({
          title: title,
          weakness: cleanGap,
          verifiedPage: verifiedGapPage,
          optionalExample: '',
          why: 'Preserves your perspective while addressing counterarguments examiners look for.'
        });
      });
    }

    if (priorities.length === 0) {
      return '';
    }

    return `
      <section class="bg-white dark:bg-[#121622] rounded-2xl border border-slate-200 dark:border-slate-800 p-4 sm:p-5 shadow-sm space-y-4" aria-labelledby="section6Heading">
        <div class="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
          <div class="space-y-0.5">
            <h2 id="section6Heading" class="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center space-x-2">
              <span class="w-2 h-2 rounded-full bg-rose-500"></span>
              <span>6. Revision Priorities (Preserving Candidate Voice)</span>
            </h2>
            <p class="text-[11px] text-slate-500 dark:text-slate-400">
              Actionable repairs to strengthen reasoning. Suggested alternatives are optional examples, not required dogmas.
            </p>
          </div>
          <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/20">
            Voice Preserved
          </span>
        </div>

        <!-- Voice Preservation Principle Advisory Banner -->
        <div class="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/25 text-xs text-amber-900 dark:text-amber-200 flex items-start space-x-2.5">
          <i data-lucide="shield-check" class="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5"></i>
          <div class="space-y-1">
            <span class="font-bold block text-slate-900 dark:text-slate-100">Preserving Candidate Voice &amp; Individual Perspective:</span>
            <p class="leading-relaxed text-slate-700 dark:text-slate-300">
              Evaluator revision suggestions are <strong>strictly optional illustrations</strong>, not mandatory formulas. You do not need to adopt heavy academic or abstract jargon (e.g. <em>&ldquo;epistemological heuristic&rdquo;</em>). Retain your authentic tone, direct phrasing, and personal arguments while strengthening the logical transitions between paragraphs.
            </p>
          </div>
        </div>

        <div class="space-y-3">
          ${priorities.map((prio, idx) => `
            <div class="p-3.5 sm:p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 space-y-3">
              <div class="flex items-center justify-between">
                <span class="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center space-x-1.5">
                  <span class="w-4 h-4 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-mono text-[10px] flex items-center justify-center font-bold">
                    ${idx + 1}
                  </span>
                  <span>${escapeHTML(prio.title)}</span>
                </span>
                ${prio.verifiedPage ? `
                  <button type="button" onclick="window.essayJumpToPage(${prio.verifiedPage})" class="text-[10px] font-mono font-medium text-amber-600 dark:text-amber-400 hover:underline cursor-pointer">
                    Page ${prio.verifiedPage} &rarr;
                  </button>
                ` : ''}
              </div>

              ${prio.weakness ? `
                <div class="space-y-1">
                  <span class="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                    Candidate's Original Draft Wording (Keep Your Voice &amp; Perspective)${prio.verifiedPage ? ` &bull; Page ${prio.verifiedPage}` : ''}:
                  </span>
                  <div class="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-serif italic text-slate-800 dark:text-slate-200 leading-relaxed">
                    &ldquo;${escapeHTML(prio.weakness)}&rdquo;
                  </div>
                </div>
              ` : ''}

              ${prio.optionalExample ? `
                <div class="p-3 rounded-lg bg-amber-500/5 dark:bg-amber-500/10 border border-amber-500/25 space-y-1 text-xs">
                  <span class="font-bold text-amber-800 dark:text-amber-400 text-[10px] uppercase tracking-wider flex items-center space-x-1">
                    <i data-lucide="info" class="w-3 h-3"></i>
                    <span>Optional Alternative Phrasing (Evaluator Suggestion &mdash; Optional Example Only):</span>
                  </span>
                  <p class="text-slate-800 dark:text-slate-200 font-serif leading-relaxed">
                    ${formatMarkdownText(prio.optionalExample)}
                  </p>
                  <p class="text-[10px] text-slate-500 dark:text-slate-400 pt-0.5">
                    Stylistic note: This phrasing is provided solely to demonstrate how conceptual depth can be signaled. Feel free to express this in your own natural vocabulary.
                  </p>
                </div>
              ` : ''}

              ${prio.why ? `
                <div class="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed pl-0.5">
                  <strong>Evaluator Rationale:</strong> ${escapeHTML(prio.why)}
                </div>
              ` : ''}
            </div>
          `).join('')}
        </div>
      </section>
    `;
  }

  /**
   * Builds the interactive Multi-Page Essay Script Viewer
   * Designed to comfortably handle 10+ pages
   */
  function buildScriptViewerHTML(evalData) {
    const totalPages = essayState.activePages.length;

    return `
      <div id="essayViewerCard" class="bg-white dark:bg-[#121622] rounded-2xl border border-slate-200 dark:border-slate-800 p-3.5 sm:p-4 shadow-sm flex flex-col gap-3 transition-colors">
        <!-- Viewer Header Bar -->
        <div class="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
          <div class="flex items-center space-x-2">
            <h2 class="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center space-x-1.5">
              <i data-lucide="file-text" class="w-3.5 h-3.5 text-amber-500"></i>
              <span>Uploaded Essay Script</span>
            </h2>
            <span id="essayViewerPageCountBadge" class="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
              ${totalPages > 0 ? `${totalPages} ${totalPages === 1 ? 'Page' : 'Pages'}` : 'No Pages'}
            </span>
          </div>

          <!-- Zoom Controls -->
          <div class="flex items-center space-x-1">
            <button type="button" id="essayZoomOutBtn" title="Zoom Out" class="essay-zoom-btn bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer">
              &minus;
            </button>
            <span id="essayZoomIndicator" class="text-[11px] font-mono px-1.5 text-slate-500">100%</span>
            <button type="button" id="essayZoomInBtn" title="Zoom In" class="essay-zoom-btn bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer">
              +
            </button>
            <button type="button" id="essayZoomResetBtn" title="Reset Zoom" class="essay-zoom-btn text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer ml-1">
              Reset
            </button>
          </div>
        </div>

        <!-- Pagination Controls for 10+ Pages -->
        ${totalPages > 1 ? `
          <div class="flex flex-wrap items-center justify-between gap-2 p-2 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
            <div class="flex items-center space-x-1.5">
              <button type="button" id="essayPrevPageBtn" class="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:border-amber-500 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center space-x-1">
                <i data-lucide="chevron-left" class="w-3.5 h-3.5"></i>
                <span class="hidden sm:inline">Prev</span>
              </button>
              <button type="button" id="essayNextPageBtn" class="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:border-amber-500 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center space-x-1">
                <span class="hidden sm:inline">Next</span>
                <i data-lucide="chevron-right" class="w-3.5 h-3.5"></i>
              </button>
            </div>

            <!-- Page Quick Dropdown / Jump -->
            <div class="flex items-center space-x-2">
              <label for="essayPageJumpSelect" class="text-[11px] text-slate-500 font-medium">Page:</label>
              <select id="essayPageJumpSelect" class="px-2 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-mono font-bold text-slate-800 dark:text-slate-200 cursor-pointer">
                ${Array.from({ length: totalPages }, (_, i) => `
                  <option value="${i}">Page ${i + 1} of ${totalPages}</option>
                `).join('')}
              </select>
            </div>
          </div>
        ` : ''}

        <!-- Canvas Container for Script Image & Annotations -->
        <div id="essayImageWrapper" class="relative w-full overflow-auto rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 min-h-[420px] max-h-[72vh] flex items-start justify-center p-2">
          ${totalPages > 0 ? `
            <div id="essayImageStage" class="relative max-w-full origin-top transition-transform duration-150">
              <img id="essayActivePageImage" src="${essayState.activePages[0]}" alt="Uploaded Candidate Essay Page 1" class="rounded shadow-md max-w-full block select-none" />
              <div id="essayAnnotationsLayer" class="absolute inset-0 pointer-events-none"></div>
            </div>
          ` : `
            <div class="py-16 text-center text-xs text-slate-400 space-y-1">
              <i data-lucide="file-question" class="w-8 h-8 mx-auto text-slate-300 dark:text-slate-600 mb-2"></i>
              <p>Uploaded copy script is not accessible for direct visual display.</p>
              <p class="text-[11px] text-slate-500">Evaluation analysis and line observations remain available.</p>
            </div>
          `}
        </div>
      </div>
    `;
  }

  /**
   * Initializes Script Viewer interactions (page switching, annotations overlay, zoom)
   */
  function initEssayViewer() {
    renderCurrentPage();
  }

  function renderCurrentPage() {
    const totalPages = essayState.activePages.length;
    if (totalPages === 0) return;

    const img = document.getElementById("essayActivePageImage");
    const select = document.getElementById("essayPageJumpSelect");
    const prevBtn = document.getElementById("essayPrevPageBtn");
    const nextBtn = document.getElementById("essayNextPageBtn");

    if (img) {
      img.src = essayState.activePages[essayState.currentPageIndex];
      img.alt = `Uploaded Candidate Essay Page ${essayState.currentPageIndex + 1}`;
    }

    if (select) {
      select.value = String(essayState.currentPageIndex);
    }

    if (prevBtn) prevBtn.disabled = essayState.currentPageIndex === 0;
    if (nextBtn) nextBtn.disabled = essayState.currentPageIndex === totalPages - 1;

    renderPageAnnotationsOverlay();
  }

  function renderPageAnnotationsOverlay() {
    const layer = document.getElementById("essayAnnotationsLayer");
    if (!layer || !essayState.evalData) return;

    layer.innerHTML = '';
    const pageNum = essayState.currentPageIndex + 1;
    const allAnnotations = Array.isArray(essayState.evalData.visual_annotations)
      ? essayState.evalData.visual_annotations
      : [];

    allAnnotations.forEach((ann, globalIdx) => {
      if ((ann.page || ann.page_number || 1) === pageNum) {
        const topY = ann.start_y_percent !== undefined ? ann.start_y_percent : (ann.approx_y_percent || 20);
        const heightY = ann.end_y_percent !== undefined ? Math.max(8, ann.end_y_percent - topY) : 12;

        const pin = document.createElement("div");
        pin.className = "essay-annotation-pin pointer-events-auto";
        pin.id = `essay-pin-${globalIdx}`;
        pin.style.top = `${topY}%`;
        pin.style.height = `${heightY}%`;
        pin.title = ann.tag || "Evaluator Observation";
        pin.setAttribute("tabindex", "0");
        pin.setAttribute("role", "button");
        pin.setAttribute("aria-label", `Annotation: ${ann.tag || 'Observation'}`);

        pin.onclick = () => {
          highlightAnnotationPin(pin);
        };

        layer.appendChild(pin);
      }
    });
  }

  function highlightAnnotationPin(pin) {
    document.querySelectorAll(".essay-annotation-pin").forEach(p => p.classList.remove("active-pin"));
    if (pin) {
      pin.classList.add("active-pin");
      pin.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  /**
   * Initializes event listeners for zoom, pagination, and view switching
   */
  function initEssayEvents() {
    // Zoom buttons
    const zoomIn = document.getElementById("essayZoomInBtn");
    const zoomOut = document.getElementById("essayZoomOutBtn");
    const zoomReset = document.getElementById("essayZoomResetBtn");
    const stage = document.getElementById("essayImageStage");
    const indicator = document.getElementById("essayZoomIndicator");

    const updateZoom = () => {
      if (stage) stage.style.transform = `scale(${essayState.zoomLevel})`;
      if (indicator) indicator.textContent = `${Math.round(essayState.zoomLevel * 100)}%`;
    };

    if (zoomIn) {
      zoomIn.onclick = () => {
        essayState.zoomLevel = Math.min(2.5, essayState.zoomLevel + 0.15);
        updateZoom();
      };
    }
    if (zoomOut) {
      zoomOut.onclick = () => {
        essayState.zoomLevel = Math.max(0.6, essayState.zoomLevel - 0.15);
        updateZoom();
      };
    }
    if (zoomReset) {
      zoomReset.onclick = () => {
        essayState.zoomLevel = 1.0;
        updateZoom();
      };
    }

    // Pagination
    const prevBtn = document.getElementById("essayPrevPageBtn");
    const nextBtn = document.getElementById("essayNextPageBtn");
    const jumpSelect = document.getElementById("essayPageJumpSelect");

    if (prevBtn) {
      prevBtn.onclick = () => {
        if (essayState.currentPageIndex > 0) {
          essayState.currentPageIndex--;
          renderCurrentPage();
        }
      };
    }

    if (nextBtn) {
      nextBtn.onclick = () => {
        if (essayState.currentPageIndex < essayState.activePages.length - 1) {
          essayState.currentPageIndex++;
          renderCurrentPage();
        }
      };
    }

    if (jumpSelect) {
      jumpSelect.onchange = (e) => {
        essayState.currentPageIndex = parseInt(e.target.value, 10);
        renderCurrentPage();
      };
    }

    // Mobile/Tablet View Switcher
    const analysisBtn = document.getElementById("essayMobileViewAnalysisBtn");
    const scriptBtn = document.getElementById("essayMobileViewScriptBtn");

    if (analysisBtn && scriptBtn) {
      analysisBtn.onclick = () => {
        essayState.activeMobileView = 'analysis';
        const viewerCol = document.getElementById("essayScriptViewerColumn");
        const analysisCol = document.getElementById("essayAnalysisColumn");
        if (viewerCol) viewerCol.classList.add("essay-mobile-hidden");
        if (analysisCol) analysisCol.classList.remove("essay-mobile-hidden");
        analysisBtn.className = "flex-1 py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center space-x-1.5 transition bg-amber-500 text-white shadow-sm";
        scriptBtn.className = "flex-1 py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center space-x-1.5 transition bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300";
      };

      scriptBtn.onclick = () => {
        essayState.activeMobileView = 'viewer';
        const viewerCol = document.getElementById("essayScriptViewerColumn");
        const analysisCol = document.getElementById("essayAnalysisColumn");
        if (viewerCol) viewerCol.classList.remove("essay-mobile-hidden");
        if (analysisCol) analysisCol.classList.add("essay-mobile-hidden");
        scriptBtn.className = "flex-1 py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center space-x-1.5 transition bg-amber-500 text-white shadow-sm";
        analysisBtn.className = "flex-1 py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center space-x-1.5 transition bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300";
      };
    }
  }

  /**
   * Global helper: jump to a specific page from an analysis observation
   */
  window.essayJumpToPage = function (pageNum) {
    const totalPages = essayState.activePages.length || 1;
    const targetIdx = Math.max(0, Math.min(totalPages - 1, pageNum - 1));
    essayState.currentPageIndex = targetIdx;
    renderCurrentPage();

    // If on mobile/tablet, switch to viewer
    if (window.innerWidth < 1024) {
      const scriptBtn = document.getElementById("essayMobileViewScriptBtn");
      if (scriptBtn) scriptBtn.click();
    }

    const viewerCard = document.getElementById("essayViewerCard");
    if (viewerCard) {
      viewerCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  /**
   * Global helper: jump to page and highlight corresponding annotation pin
   */
  window.essayJumpToPageAndHighlight = function (pageNum, annotationIndex) {
    window.essayJumpToPage(pageNum);
    setTimeout(() => {
      const pin = document.getElementById(`essay-pin-${annotationIndex}`);
      if (pin) {
        highlightAnnotationPin(pin);
      }
    }, 200);
  };

  /**
   * Global helper: select alignment page in Section 3
   */
  window.essaySelectAlignmentPage = function (pageNum) {
    const totalPages = essayState.activePages.length || 1;
    if (pageNum < 1 || pageNum > totalPages) return;

    document.querySelectorAll(".essay-page-strip-item").forEach((btn, i) => {
      if (i + 1 === pageNum) btn.classList.add("active");
      else btn.classList.remove("active");
    });

    const detailContainer = document.getElementById("essayPageAlignmentDetail");
    if (detailContainer && essayState.evalData) {
      const pageObservations = [];
      if (essayState.evalData.body_audit && Array.isArray(essayState.evalData.body_audit.strengths)) {
        essayState.evalData.body_audit.strengths.forEach(s => {
          const pages = parsePageRange(s, totalPages);
          if (pages.includes(pageNum)) {
            pageObservations.push({ text: s, isStrength: true });
          }
        });
      }
      if (essayState.evalData.body_audit && Array.isArray(essayState.evalData.body_audit.critical_gaps)) {
        essayState.evalData.body_audit.critical_gaps.forEach(g => {
          const pages = parsePageRange(g, totalPages);
          if (pages.includes(pageNum)) {
            pageObservations.push({ text: g, isStrength: false });
          }
        });
      }

      const pageInfo = {
        annotations: (essayState.evalData.visual_annotations || []).filter(a => (a.page || a.page_number || 1) === pageNum),
        observations: pageObservations
      };
      detailContainer.innerHTML = renderPageAlignmentDetails(pageNum, pageInfo);
    }
  };

  // Safe markdown and text helpers
  function escapeHTML(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function formatMarkdownText(str) {
    if (!str) return '';
    let escaped = escapeHTML(str);
    // Convert bold **text**
    escaped = escaped.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    // Convert bullet newlines
    escaped = escaped.replace(/\n\s*[-•]\s*/g, '<br>&bull; ');
    // Convert newlines
    escaped = escaped.replace(/\n/g, '<br>');
    return escaped;
  }

})();
