// MainsMentor AI Frontend Application Logic

// App State
const state = {
  paper: "GS3",
  selectedPaperTab: "GS3",
  marks: 15,
  question: "",
  questionMode: "auto", // "auto", "daily", "custom"
  apiKey: localStorage.getItem("mainsmentor_gemini_key") || "",
  serverHasKey: false,
  uploadedFiles: [],
  activePages: [],
  currentPageIndex: 0,
  activeSampleId: null,
  currentEvaluation: null,
  originalEvaluation: null,
  rewrittenEvaluation: null,
  originalPages: [],
  rewrittenPages: [],
  activeCopyMode: "original", // "original" or "rewrite"
  samples: [],
  user: null,
  isRewriteMode: false,
  isControlsLocked: false,
  dailyQuestion: null,
  activeStudioView: "intake"
};

// DOM Elements
const paperTabs = document.querySelectorAll(".paper-tab");
const marksBtns = document.querySelectorAll(".marks-btn");
const questionInput = document.getElementById("questionInput");
const detectedDirectiveBadge = document.getElementById("detectedDirectiveBadge");
const directiveGuidance = document.getElementById("directiveGuidance");
const dropzone = document.getElementById("dropzone");
const fileInput = document.getElementById("fileInput");
const previewStrip = document.getElementById("previewStrip");
const evaluateBtn = document.getElementById("evaluateBtn");
const loadingIndicator = document.getElementById("loadingIndicator");
const loadingStep = document.getElementById("loadingStep");

// Nav & User Elements
const navDawBtn = document.getElementById("navDawBtn");
const openLockerBtn = document.getElementById("openLockerBtn");
const lockerCountBadge = document.getElementById("lockerCountBadge");
const openPricingBtn = document.getElementById("openPricingBtn");
const navCreditsCount = document.getElementById("navCreditsCount");
const authBtn = document.getElementById("authBtn");
const navUserAvatar = document.getElementById("navUserAvatar");
const navUserIcon = document.getElementById("navUserIcon");
const navUserLabel = document.getElementById("navUserLabel");

// Daily Question Elements
const dailyQuestionBanner = document.getElementById("dailyQuestionBanner");
const dawPaperBadge = document.getElementById("dawPaperBadge");
const dawSpecsBadge = document.getElementById("dawSpecsBadge");
const dawQuestionText = document.getElementById("dawQuestionText");
const dawContextText = document.getElementById("dawContextText");
const loadDawBtn = document.getElementById("loadDawBtn");
const dismissDawBtn = document.getElementById("dismissDawBtn");

// Modals & Drawers
const authModal = document.getElementById("authModal");
const closeAuthModalBtn = document.getElementById("closeAuthModalBtn");
const googleSignInBtn = document.getElementById("googleSignInBtn");
const authForm = document.getElementById("authForm");
const authNameInput = document.getElementById("authNameInput");
const authEmailInput = document.getElementById("authEmailInput");

const pricingModal = document.getElementById("pricingModal");
const closePricingModalBtn = document.getElementById("closePricingModalBtn");

const answerLockerDrawer = document.getElementById("answerLockerDrawer");
const closeLockerDrawerBtn = document.getElementById("closeLockerDrawerBtn");
const lockerListContainer = document.getElementById("lockerListContainer");

// Rewrite Challenge Card
const rewriteChallengeCard = document.getElementById("rewriteChallengeCard");
const activateRewriteBtn = document.getElementById("activateRewriteBtn");

// Step Navigation Elements
const step1Wrapper = document.getElementById("step1Wrapper");
const step1Badge = document.getElementById("step1Badge");
const step2Wrapper = document.getElementById("step2Wrapper");
const step2Badge = document.getElementById("step2Badge");
const step3Wrapper = document.getElementById("step3Wrapper");
const step3Badge = document.getElementById("step3Badge");
const step3Number = document.getElementById("step3Number");
const dropzoneLockOverlay = document.getElementById("dropzoneLockOverlay");
const marksToggle = document.getElementById("marksToggle");
const essayMarksNotice = document.getElementById("essayMarksNotice");
const optionalSubjectWrapper = document.getElementById("optionalSubjectWrapper");
const optionalSubjectSelect = document.getElementById("optionalSubjectSelect");

// Viewer Elements
const pageViewerCard = document.getElementById("pageViewerCard");
const viewerEmptyPrompt = document.getElementById("viewerEmptyPrompt");
const activePageImage = document.getElementById("activePageImage");
const annotationsLayer = document.getElementById("annotationsLayer");
const pageIndicator = document.getElementById("pageIndicator");
const prevPageBtn = document.getElementById("prevPageBtn");
const nextPageBtn = document.getElementById("nextPageBtn");

// Results Elements
const emptyState = document.getElementById("emptyState");
const resultsContainer = document.getElementById("resultsContainer");
const resultScore = document.getElementById("resultScore");
const resultMaxMarks = document.getElementById("resultMaxMarks");
const resultPercentileBadge = document.getElementById("resultPercentileBadge");
const resultPaperBadge = document.getElementById("resultPaperBadge");
const resultQuestionSummary = document.getElementById("resultQuestionSummary");
const resultExecutiveSummary = document.getElementById("resultExecutiveSummary");

// Directive & Radar Elements
const directiveNameDisplay = document.getElementById("directiveNameDisplay");
const directiveScoreBadge = document.getElementById("directiveScoreBadge");
const directiveEvaluationText = document.getElementById("directiveEvaluationText");
const directiveGapText = document.getElementById("directiveGapText");
let radarChartInstance = null;

// Modal Elements
const keyModal = document.getElementById("keyModal");
const openKeyModalBtn = document.getElementById("openKeyModalBtn");
const closeKeyModalBtn = document.getElementById("closeKeyModalBtn");
const apiKeyInput = document.getElementById("apiKeyInput");
const saveKeyBtn = document.getElementById("saveKeyBtn");
const testKeyBtn = document.getElementById("testKeyBtn");

// =========================================================================
// CUSTOM IN-APP NOTIFICATION SYSTEM (Replaces native browser alert popups)
// =========================================================================
let appToastTimer = null;
window.showAppToast = function(message, isSuccess = true) {
  const toast = document.getElementById("appToast");
  const msgEl = document.getElementById("appToastMsg");
  const iconEl = document.getElementById("appToastIcon");
  if (!toast || !msgEl) return;
  msgEl.textContent = message;
  if (isSuccess) {
    toast.className = "fixed bottom-5 right-5 z-[100] flex items-center space-x-2.5 px-4 py-3 rounded-xl bg-[#161B26] border border-emerald-500/50 text-slate-100 shadow-2xl text-xs font-semibold animate-fade-in transition-all";
    if (iconEl) {
      iconEl.setAttribute("data-lucide", "check-circle-2");
      iconEl.className = "w-4 h-4 text-emerald-400 shrink-0";
    }
  } else {
    toast.className = "fixed bottom-5 right-5 z-[100] flex items-center space-x-2.5 px-4 py-3 rounded-xl bg-[#161B26] border border-rose-500/50 text-slate-100 shadow-2xl text-xs font-semibold animate-fade-in transition-all";
    if (iconEl) {
      iconEl.setAttribute("data-lucide", "alert-circle");
      iconEl.className = "w-4 h-4 text-rose-400 shrink-0";
    }
  }
  if (window.lucide) {
    try { lucide.createIcons({ root: toast }); } catch(e){}
  }
  if (appToastTimer) clearTimeout(appToastTimer);
  appToastTimer = setTimeout(() => {
    toast.classList.add("hidden");
    toast.classList.remove("flex");
  }, 3500);
};

window.showAppNotice = function(message, title = "System Notice", type = "info") {
  const modal = document.getElementById("appNoticeModal");
  if (!modal) {
    console.log(`[Notice] ${title}: ${message}`);
    return;
  }
  const titleEl = document.getElementById("appNoticeTitle");
  const msgEl = document.getElementById("appNoticeMessage");
  const iconBox = document.getElementById("appNoticeIconBox");
  const iconEl = document.getElementById("appNoticeIcon");
  const confirmBtn = document.getElementById("appNoticeConfirmBtn");

  if (titleEl) titleEl.textContent = title;
  if (msgEl) {
    msgEl.innerHTML = String(message || "")
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/\n/g, "<br>");
  }

  if (iconBox && iconEl) {
    if (type === "error" || type === "danger") {
      iconBox.className = "w-11 h-11 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-400 flex items-center justify-center shrink-0";
      iconEl.setAttribute("data-lucide", "alert-triangle");
      if (confirmBtn) confirmBtn.className = "w-full sm:w-auto px-5 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-400 text-white font-bold text-xs shadow-md transition flex items-center justify-center space-x-1.5";
    } else if (type === "success") {
      iconBox.className = "w-11 h-11 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shrink-0";
      iconEl.setAttribute("data-lucide", "check-circle");
      if (confirmBtn) confirmBtn.className = "w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md transition flex items-center justify-center space-x-1.5";
    } else {
      iconBox.className = "w-11 h-11 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center shrink-0";
      iconEl.setAttribute("data-lucide", "bell");
      if (confirmBtn) confirmBtn.className = "w-full sm:w-auto px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition flex items-center justify-center space-x-1.5";
    }
    if (window.lucide) {
      try { lucide.createIcons({ root: modal }); } catch(e){}
    }
  }

  modal.classList.remove("hidden");
  modal.classList.add("flex");
};

window.closeAppNotice = function() {
  const modal = document.getElementById("appNoticeModal");
  if (modal) {
    modal.classList.add("hidden");
    modal.classList.remove("flex");
  }
};

// Central In-App Confirmation Dialog with Safe Locker Preservation Guarantee
window.showAppConfirm = function({ title = "Please Confirm", message = "", confirmText = "Proceed", cancelText = "Cancel", onConfirm, onCancel }) {
  const modal = document.getElementById("appConfirmModal");
  if (!modal) {
    const plainMsg = String(message || "").replace(/<[^>]+>/g, "");
    if (confirm(plainMsg)) {
      if (typeof onConfirm === "function") onConfirm();
    } else {
      if (typeof onCancel === "function") onCancel();
    }
    return;
  }
  const titleEl = document.getElementById("appConfirmTitle");
  const msgEl = document.getElementById("appConfirmMessage");
  const proceedBtn = document.getElementById("appConfirmProceedBtn");
  const cancelBtn = document.getElementById("appConfirmCancelBtn");

  if (titleEl) titleEl.textContent = title;
  if (msgEl) msgEl.innerHTML = String(message || "");
  if (proceedBtn) {
    proceedBtn.innerHTML = `<span>${confirmText}</span>`;
    proceedBtn.onclick = () => {
      window.closeAppConfirm();
      if (typeof onConfirm === "function") onConfirm();
    };
  }
  if (cancelBtn) {
    cancelBtn.textContent = cancelText;
    cancelBtn.onclick = () => {
      window.closeAppConfirm();
      if (typeof onCancel === "function") onCancel();
    };
  }

  modal.classList.remove("hidden");
  modal.classList.add("flex");
  if (window.lucide) {
    try { lucide.createIcons({ root: modal }); } catch(e){}
  }
};

window.closeAppConfirm = function() {
  const modal = document.getElementById("appConfirmModal");
  if (modal) {
    modal.classList.add("hidden");
    modal.classList.remove("flex");
  }
};

// Reset completely to a clean Answer Intake page ready to upload a new answer sheet
window.resetToCleanIntake = function(shouldScroll = true) {
  state.uploadedFiles = [];
  state.activePages = [];
  state.currentPageIndex = 0;
  state.currentEvaluation = null;
  state.activeSampleId = null;
  state.isRewriteMode = false;

  const previewStrip = document.getElementById("previewStrip");
  if (previewStrip) {
    previewStrip.innerHTML = "";
    previewStrip.classList.add("hidden");
  }

  const pInput = document.getElementById("pdfFileInput");
  const gInput = document.getElementById("galleryFileInput");
  const cInput = document.getElementById("cameraFileInput");
  const fInput = document.getElementById("fileInput");
  if (pInput) pInput.value = "";
  if (gInput) gInput.value = "";
  if (cInput) cInput.value = "";
  if (fInput) fInput.value = "";

  if (typeof setAnswersheetLockedState === "function") {
    setAnswersheetLockedState(false);
  }

  if (typeof updateViewer === "function") {
    updateViewer();
  }

  window.switchStudioState("intake");

  if (shouldScroll) {
    const intakeDeck = document.getElementById("intakeDeck");
    if (intakeDeck) {
      intakeDeck.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  if (typeof window.showAppToast === "function") {
    window.showAppToast("Upload chamber ready. All past evaluated sheets are safe in your Answer Locker.");
  }
};

// User confirmation before clearing current on-screen evaluation draft
window.confirmLeaveStudioOrReset = function(targetAction) {
  const hasActiveEval = Boolean(state.currentEvaluation || state.activeStudioView === "studio");
  const hasStagedFiles = Boolean(state.uploadedFiles && state.uploadedFiles.length > 0);

  if (hasActiveEval || hasStagedFiles) {
    window.showAppConfirm({
      title: "Evaluate Another Answer Copy?",
      message: "Current on-screen draft will be cleared so you can upload a fresh answer sheet.<br><br>🛡️ <strong>Locker Preserved:</strong> All your past evaluations and scores remain 100% safe in your <strong>Answer Locker</strong>.",
      confirmText: "Upload New Answer Copy",
      cancelText: "Stay on Current Page",
      onConfirm: () => {
        window.resetToCleanIntake(true);
        if (typeof targetAction === "function") targetAction();
      }
    });
  } else {
    window.resetToCleanIntake(true);
    if (typeof targetAction === "function") targetAction();
  }
};

// Browser Refresh & Close Warning: Alert aspirant that draft clears while Locker preserves copies
window.addEventListener("beforeunload", (e) => {
  if (state.activeStudioView === "studio" || (state.uploadedFiles && state.uploadedFiles.length > 0)) {
    const msg = "Current answer sheet draft on screen will be cleared, but your evaluated copies are safely stored in your Answer Locker.";
    e.preventDefault();
    e.returnValue = msg;
    return msg;
  }
});

// Browser Back Button Navigation: Prompt before leaving Studio
window.addEventListener("popstate", (e) => {
  if (state.activeStudioView === "studio") {
    window.showAppConfirm({
      title: "Return to Intake Chamber?",
      message: "Current answer sheet draft on screen will be cleared, but your evaluated copies are safely stored in your Answer Locker. Would you like to clear the draft and upload a new answer copy?",
      confirmText: "Yes, Upload New Answer",
      cancelText: "Stay in Studio",
      onConfirm: () => {
        window.resetToCleanIntake(true);
      },
      onCancel: () => {
        try {
          history.pushState({ page: "studio" }, "", window.location.href);
        } catch(err) {}
      }
    });
  }
});

// Global alert override to completely intercept native Chrome dialogs
window.alert = function(msg) {
  const msgStr = String(msg || "");
  if (msgStr.toLowerCase().includes("copied") || msgStr.toLowerCase().includes("clipboard")) {
    window.showAppToast(msgStr, true);
  } else if (msgStr.toLowerCase().includes("error") || msgStr.toLowerCase().includes("failed") || msgStr.toLowerCase().includes("exhausted") || msgStr.toLowerCase().includes("time's up")) {
    window.showAppNotice(msgStr, "Cooked Mains Notice", "error");
  } else if (msgStr.toLowerCase().includes("success") || msgStr.toLowerCase().includes("signed in") || msgStr.toLowerCase().includes("welcome")) {
    window.showAppNotice(msgStr, "Success Notice", "success");
  } else {
    window.showAppNotice(msgStr, "Evaluation Notice", "info");
  }
};

// =========================================================================
// LINEAR & RAYCAST EVALUATION STUDIO STATE & TAB CONTROLLER
// =========================================================================
window.currentEvaluationController = null;
window.forensicProgressTimer = null;
window.forensicTipTimer = null;

const forensicTips = [
  "💡 Directive Rule: 'Critically Analyse' requires 70% balanced scrutiny + 30% pragmatic forward-looking way forward.",
  "💡 Value-Add Rule: Citing 2 relevant Articles or SC Case Laws in GS-2 elevates answers into the top 10% percentile.",
  "💡 Presentation Rule: Evaluators scan 100+ copies daily. Use thematic subheadings rather than lengthy running paragraphs.",
  "💡 Structure Rule: Always address both parts of two-part questions equally to prevent severe half-score penalties.",
  "💡 Value-Add Rule: Incorporating 1 neat schematic flow or hub-spoke diagram in a 15-marker fetches up to +1.0 extra mark.",
  "💡 Conclusion Rule: Conclude with a constitutional principle, SDG, or Viksit Bharat vision rather than a repetitive summary."
];

function startForensicProgress() {
  let progress = 12;
  const bar = document.getElementById("forensicProgressBar");
  const sBar = document.getElementById("studioForensicProgressBar");
  const pct = document.getElementById("forensicProgressPercent");
  const sPct = document.getElementById("studioForensicProgressPercent");
  const step = document.getElementById("loadingStep");
  const sStep = document.getElementById("studioLoadingStep");
  const p1 = document.getElementById("stagePill1");
  const sp1 = document.getElementById("studioStagePill1");
  const p2 = document.getElementById("stagePill2");
  const sp2 = document.getElementById("studioStagePill2");
  const p3 = document.getElementById("stagePill3");
  const sp3 = document.getElementById("studioStagePill3");
  const p4 = document.getElementById("stagePill4");
  const sp4 = document.getElementById("studioStagePill4");
  const tipText = document.getElementById("forensicTipText");
  const sTipText = document.getElementById("studioForensicTipText");

  const setProgressUI = (val) => {
    const formatted = `${val.toFixed(0)}%`;
    if (bar) bar.style.width = formatted;
    if (sBar) sBar.style.width = formatted;
    if (pct) pct.textContent = formatted;
    if (sPct) sPct.textContent = formatted;
  };

  const setStepText = (txt) => {
    if (step) step.textContent = txt;
    if (sStep) sStep.textContent = txt;
  };

  const setPillState = (pill, state, iconChar) => {
    if (!pill) return;
    pill.className = `stage-pill ${state}`;
    const icon = pill.querySelector(".stage-icon");
    if (icon) icon.textContent = iconChar;
  };

  setProgressUI(12);
  setPillState(p1, "active", "●");
  setPillState(sp1, "active", "●");
  setPillState(p2, "", "○");
  setPillState(sp2, "", "○");
  setPillState(p3, "", "○");
  setPillState(sp3, "", "○");
  setPillState(p4, "", "○");
  setPillState(sp4, "", "○");

  if (window.forensicProgressTimer) clearInterval(window.forensicProgressTimer);
  window.forensicProgressTimer = setInterval(() => {
    if (progress < 98) {
      const increment = progress < 35 ? 4.0 : progress < 65 ? 2.5 : progress < 88 ? 1.2 : 0.4;
      progress = Math.min(98, progress + increment);
      setProgressUI(progress);

      if (progress >= 25 && progress < 55) {
        setStepText("Auditing question directives, core demands, and structural balance...");
        setPillState(p1, "done", "✓"); setPillState(sp1, "done", "✓");
        setPillState(p2, "active", "●"); setPillState(sp2, "active", "●");
      } else if (progress >= 55 && progress < 80) {
        setStepText("Verifying constitutional articles, case laws, and diagrammatic value-adds...");
        setPillState(p2, "done", "✓"); setPillState(sp2, "done", "✓");
        setPillState(p3, "active", "●"); setPillState(sp3, "active", "●");
      } else if (progress >= 80 && progress < 92) {
        setStepText("Calibrating score bands, topper benchmark percentiles, and action plan...");
        setPillState(p3, "done", "✓"); setPillState(sp3, "done", "✓");
        setPillState(p4, "active", "●"); setPillState(sp4, "active", "●");
      } else if (progress >= 92) {
        setStepText("Synthesizing UPSC Bell-Curve percentile & compiling forensic marksheet...");
        setPillState(p3, "done", "✓"); setPillState(sp3, "done", "✓");
        setPillState(p4, "active", "●"); setPillState(sp4, "active", "●");
      }
    }
  }, 350);

  let tipIdx = 0;
  if (window.forensicTipTimer) clearInterval(window.forensicTipTimer);
  window.forensicTipTimer = setInterval(() => {
    tipIdx = (tipIdx + 1) % forensicTips.length;
    const nextTip = forensicTips[tipIdx];
    [tipText, sTipText].forEach(el => {
      if (el) {
        el.style.opacity = "0";
        setTimeout(() => {
          el.textContent = nextTip;
          el.style.opacity = "1";
        }, 200);
      }
    });
  }, 3500);
}

function stopForensicProgress() {
  if (window.forensicProgressTimer) {
    clearInterval(window.forensicProgressTimer);
    window.forensicProgressTimer = null;
  }
  if (window.forensicTipTimer) {
    clearInterval(window.forensicTipTimer);
    window.forensicTipTimer = null;
  }
  const bar = document.getElementById("forensicProgressBar");
  const sBar = document.getElementById("studioForensicProgressBar");
  const pct = document.getElementById("forensicProgressPercent");
  const sPct = document.getElementById("studioForensicProgressPercent");
  if (bar) bar.style.width = "100%";
  if (sBar) sBar.style.width = "100%";
  if (pct) pct.textContent = "100%";
  if (sPct) sPct.textContent = "100%";

  const p4 = document.getElementById("stagePill4");
  const sp4 = document.getElementById("studioStagePill4");
  if (p4) { p4.className = "stage-pill done"; const icon = p4.querySelector(".stage-icon"); if (icon) icon.textContent = "✓"; }
  if (sp4) { sp4.className = "stage-pill done"; const icon = sp4.querySelector(".stage-icon"); if (icon) icon.textContent = "✓"; }
}

window.cancelEvaluation = function() {
  if (window.currentEvaluationController) {
    window.currentEvaluationController.abort();
    window.currentEvaluationController = null;
  }
  stopForensicProgress();
  setSubjectAndMarksLocked(false);

  const loadingIndicator = document.getElementById("loadingIndicator");
  if (loadingIndicator) loadingIndicator.classList.add("hidden");

  const evaluateBtn = document.getElementById("evaluateBtn");
  if (evaluateBtn) {
    evaluateBtn.disabled = false;
    evaluateBtn.classList.remove("evaluate-btn-locked");
    if (state.isRewriteMode) {
      evaluateBtn.innerHTML = `
        <i data-lucide="sparkles" class="w-4 h-4 text-emerald-300"></i>
        <span>Evaluate Rewrite Copy (0 Credits — Free)</span>
      `;
    } else {
      evaluateBtn.innerHTML = `
        <i data-lucide="check-circle-2" class="w-4 h-4"></i>
        <span>Evaluate Like Senior UPSC Examiner</span>
      `;
    }
    if (window.lucide) lucide.createIcons();
  }

  // Reset file input & dropzone so user can immediately re-upload
  state.uploadedFiles = [];
  const fileInput = document.getElementById("fileInput");
  if (fileInput) fileInput.value = "";
  const pdfFileInput = document.getElementById("pdfFileInput");
  if (pdfFileInput) pdfFileInput.value = "";
  const imageFileInput = document.getElementById("imageFileInput");
  if (imageFileInput) imageFileInput.value = "";
  if (typeof renderPreviewStrip === "function") renderPreviewStrip();

  alert("Evaluation cancelled. You can now choose a new file to upload.");
};

// Controls lock helper: locks subject & marks selection during evaluation until cancel/finish
function setSubjectAndMarksLocked(locked) {
  state.isControlsLocked = Boolean(locked);
  
  // 1. Paper Tabs
  const pTabs = document.querySelectorAll(".paper-tab");
  pTabs.forEach(t => {
    if (locked) {
      t.disabled = true;
      t.classList.add("pointer-events-none", "opacity-50", "cursor-not-allowed");
    } else {
      t.disabled = false;
      t.classList.remove("pointer-events-none", "opacity-50", "cursor-not-allowed");
    }
  });

  // 2. Marks Buttons
  const mBtns = document.querySelectorAll(".marks-btn");
  mBtns.forEach(b => {
    if (locked) {
      b.disabled = true;
      b.classList.add("pointer-events-none", "opacity-50", "cursor-not-allowed");
    } else {
      b.disabled = false;
      b.classList.remove("pointer-events-none", "opacity-50", "cursor-not-allowed");
    }
  });

  // 3. Optional Subject Select
  const optSelect = document.getElementById("optionalSubjectSelect");
  if (optSelect) {
    optSelect.disabled = Boolean(locked);
    if (locked) {
      optSelect.classList.add("pointer-events-none", "opacity-50", "cursor-not-allowed");
    } else {
      optSelect.classList.remove("pointer-events-none", "opacity-50", "cursor-not-allowed");
    }
  }

  // 4. DAW filter chips & Reshuffle buttons
  const dawChips = document.querySelectorAll(".daw-filter-chip");
  dawChips.forEach(c => {
    if (locked) {
      c.disabled = true;
      c.classList.add("pointer-events-none", "opacity-50", "cursor-not-allowed");
    } else {
      c.disabled = false;
      c.classList.remove("pointer-events-none", "opacity-50", "cursor-not-allowed");
    }
  });
  const dawLoad = document.getElementById("loadDawBtn");
  if (dawLoad) {
    dawLoad.disabled = Boolean(locked);
    if (locked) {
      dawLoad.classList.add("pointer-events-none", "opacity-50", "cursor-not-allowed");
    } else {
      dawLoad.classList.remove("pointer-events-none", "opacity-50", "cursor-not-allowed");
    }
  }

  // 5. Visual Step Containers
  const step1Wrap = document.getElementById("step1Wrapper");
  if (step1Wrap) {
    if (locked) {
      step1Wrap.classList.add("pointer-events-none", "opacity-60");
    } else {
      step1Wrap.classList.remove("pointer-events-none", "opacity-60");
    }
  }
  const step2Wrap = document.getElementById("step2Wrapper");
  if (step2Wrap) {
    if (locked) {
      step2Wrap.classList.add("pointer-events-none", "opacity-60");
    } else {
      step2Wrap.classList.remove("pointer-events-none", "opacity-60");
    }
  }
}
window.setSubjectAndMarksLocked = setSubjectAndMarksLocked;

// Mobile Quick Margin Toggle (Slides between Student Copy and Examiner Margin)
window.toggleMobileMarginScroll = function() {
  const scrollArea = document.getElementById("bookletScrollArea");
  const lbl = document.getElementById("mobileFocusMarginLabel");
  if (!scrollArea) return;
  
  if (scrollArea.scrollLeft > 100) {
    scrollArea.scrollTo({ left: 0, behavior: "smooth" });
    if (lbl) lbl.innerHTML = "Margin &rarr;";
  } else {
    scrollArea.scrollTo({ left: 260, behavior: "smooth" });
    if (lbl) lbl.innerHTML = "&larr; Copy";
  }
};

window.switchStudioState = function(mode) {
  const intakeDeck = document.getElementById("intakeDeck");
  const evaluationStudio = document.getElementById("evaluationStudio");
  const heroSection = document.getElementById("heroLandingSection");
  const firstPageSub = document.getElementById("firstPageSubscriptionSection");

  if (mode === "studio") {
    state.activeStudioView = "studio";
    if (heroSection) {
      heroSection.style.display = "none";
      heroSection.classList.add("hidden");
    }
    if (firstPageSub) {
      firstPageSub.style.display = "none";
      firstPageSub.classList.add("hidden");
    }
    if (intakeDeck) {
      intakeDeck.style.setProperty("display", "none", "important");
      intakeDeck.classList.add("hidden");
    }
    if (evaluationStudio) {
      evaluationStudio.style.setProperty("display", "flex", "important");
      evaluationStudio.classList.remove("hidden");
    }
    window.switchStudioTab("audit");
    if (window.lucide) lucide.createIcons();
    window.scrollTo({ top: 0, behavior: "smooth" });
    try {
      if (!history.state || history.state.page !== "studio") {
        history.pushState({ page: "studio" }, "", window.location.href);
      }
    } catch(e) {}
  } else {
    // Mode is "intake"
    state.activeStudioView = "intake";
    if (evaluationStudio) {
      evaluationStudio.style.setProperty("display", "none", "important");
      evaluationStudio.classList.add("hidden");
    }
    if (intakeDeck) {
      intakeDeck.style.setProperty("display", "flex", "important");
      intakeDeck.classList.remove("hidden");
    }
    const stickyFooter = document.getElementById("stickyRewriteFooter");
    if (stickyFooter) stickyFooter.classList.add("hidden");
    if (typeof stop24hRewriteTimer === "function") stop24hRewriteTimer();
    if (window.lucide) lucide.createIcons();
    if (intakeDeck) intakeDeck.scrollIntoView({ behavior: "smooth", block: "start" });
  }
};

window.switchStudioTab = function(tabId) {
  const tabBtns = document.querySelectorAll(".studio-tab-btn");
  tabBtns.forEach(btn => {
    if (btn.getAttribute("data-studio-tab") === tabId) {
      btn.classList.add("active");
    } else {
      btn.classList.remove("active");
    }
  });

  const panes = {
    audit: document.getElementById("tabPaneAudit"),
    multipliers: document.getElementById("tabPaneMultipliers"),
    rewrite: document.getElementById("tabPaneRewrite")
  };

  Object.keys(panes).forEach(k => {
    if (panes[k]) {
      if (k === tabId) {
        panes[k].classList.remove("hidden");
      } else {
        panes[k].classList.add("hidden");
      }
    }
  });

  // Reset internal container scroll position for newly activated tab
  if (panes[tabId]) {
    panes[tabId].scrollTop = 0;
  }

  // Smoothly scroll window to top of studio tab view so candidate never has to manually scroll up
  const studioCard = document.querySelector(".studio-card") || document.getElementById("studioTabNavHeader") || document.getElementById("studioTopBar");
  if (studioCard) {
    const isMobile = window.innerWidth < 1024;
    const headerOffset = isMobile ? 54 : 15;
    const targetY = studioCard.getBoundingClientRect().top + window.pageYOffset - headerOffset;
    window.scrollTo({ top: Math.max(0, targetY), behavior: "smooth" });
  }

  if (tabId === "audit" && typeof radarChartInstance !== "undefined" && radarChartInstance) {
    setTimeout(() => {
      try { radarChartInstance.resize(); } catch(e) {}
    }, 100);
  }
  if (window.lucide) lucide.createIcons();
};

// =========================================================================
// 24-HOUR FREE REWRITE & RE-EVALUATION WORKBENCH
// (Full implementation of Rule 1: Cancel Button, Rule 2: Loophole Guard,
//  Rule 3: Work in Progress State-Locking, Rule 4: Duplicate Copy Detection)
// =========================================================================

window.triggerRewriteFromStudio = function() {
  window.openRewriteModal();
};

window.openRewriteModal = function() {
  // 0. Strict Single Rewrite Enforcement: Prevent re-evaluation loops
  const cur = state.currentEvaluation;
  const rec = state.currentEvalRecord;
  const isAlreadyRewritten = Boolean(
    (cur && (cur.is_rewrite || cur.has_been_rewritten || cur.rewrite_eval_id)) ||
    (rec && (rec.is_rewrite || rec.has_been_rewritten || rec.rewrite_eval_id))
  );

  if (isAlreadyRewritten) {
    if (typeof window.showNoticeModal === "function") {
      window.showNoticeModal({
        title: "24-Hour Rewrite Completed (1 of 1 Used)",
        message: "You have already completed the 24-Hour Free Rewrite Challenge for this answer copy. Only 1 re-evaluation is allowed per question to maintain authentic evaluation discipline.",
        hint: "To evaluate a different question or a new answer sheet, please upload it from the intake chamber.",
        badge: "Single Re-Evaluation Limit Reached"
      });
    } else {
      alert("Rewrite Limit Reached: Only 1 re-evaluation is permitted per question.");
    }
    return;
  }

  // 1. Activate rewrite mode & preserve baseline evaluation
  state.isRewriteMode = true;
  if (state.currentEvaluation && !state.previousEvaluation) {
    state.previousEvaluation = JSON.parse(JSON.stringify(state.currentEvaluation));
  }
  if (state.activePages && state.activePages.length > 0 && (!state.previousPages || state.previousPages.length === 0)) {
    state.previousPages = [...state.activePages];
  }

  // 2. Synchronize baseline context into modal
  const prevScore = (state.previousEvaluation && state.previousEvaluation.overall_score) 
    ? state.previousEvaluation.overall_score 
    : 4.5;
  const maxM = (state.previousEvaluation && state.previousEvaluation.max_marks) 
    ? Number(state.previousEvaluation.max_marks)
    : (Number(state.marks) || 10);
  const baselinePaper = (state.previousEvaluation && state.previousEvaluation.paper) || state.paper || "GS-2";
  const baselineQ = (state.previousEvaluation && (state.previousEvaluation.detected_question || state.previousEvaluation.question)) || state.question || "UPSC Mains Answer";
  const baselineId = state.currentEvalId || (state.previousEvaluation && (state.previousEvaluation.id || state.previousEvaluation.eval_id));

  // Store locked baseline parameters for strict rewrite verification
  state.rewriteBaseline = {
    eval_id: baselineId,
    paper: baselinePaper,
    marks: maxM,
    question: baselineQ,
    score: prevScore
  };

  // Sync state values to guarantee marks and paper cannot diverge
  state.paper = baselinePaper;
  state.marks = maxM;
  state.question = baselineQ;
  if (questionInput) questionInput.value = baselineQ;

  const bScoreEl = document.getElementById("modalRewriteBaselineScore");
  if (bScoreEl) bScoreEl.textContent = `${prevScore} / ${maxM}`;

  const qTextEl = document.getElementById("modalRewriteQuestionText");
  if (qTextEl) qTextEl.textContent = `"${baselineQ}"`;

  const discEl = document.getElementById("modalRewriteDiscipline");
  if (discEl) {
    discEl.innerHTML = `<span>${baselinePaper} • ${maxM} Marks</span><span class="ml-1 px-1 py-0.2 rounded bg-amber-500/20 text-amber-300 text-[9px] font-mono border border-amber-500/30">🔒 Locked</span>`;
  }

  // 3. Clear earlier copies so re-upload modal starts completely fresh & empty
  state.uploadedFiles = [];
  const fi = document.getElementById("modalRewriteFileInput");
  if (fi) fi.value = "";
  const pStrip = document.getElementById("modalRewritePreviewStrip");
  if (pStrip) pStrip.classList.add("hidden");
  const thumbGrid = document.getElementById("modalRewriteThumbGrid");
  if (thumbGrid) thumbGrid.innerHTML = "";
  const submitBtn = document.getElementById("submitModalRewriteBtn");
  if (submitBtn) submitBtn.disabled = true;

  // 4. Open Modal
  const modal = document.getElementById("rewriteUploadModal");
  if (modal) {
    modal.classList.remove("hidden");
    modal.classList.add("flex");
  }

  // 5. Setup Drag & Drop and File Input listeners if not already initialized
  window.initModalRewriteDropzone();

  if (window.lucide) lucide.createIcons();
};

window.closeRewriteModal = function() {
  const modal = document.getElementById("rewriteUploadModal");
  if (modal) {
    modal.classList.add("hidden");
    modal.classList.remove("flex");
  }
  // If new files were loaded, ensure In-Studio action bar is visible above the copies
  if (state.isRewriteMode && state.uploadedFiles && state.uploadedFiles.length > 0) {
    const reEvalBar = document.getElementById("studioReEvalBar");
    if (reEvalBar) {
      reEvalBar.classList.remove("hidden");
      const statusText = document.getElementById("studioReEvalStatusText");
      if (statusText) {
        statusText.textContent = `New revised draft (${state.uploadedFiles.length} file(s)) loaded. Click Re-evaluate to measure mark recovery.`;
      }
    }
  }
};

window.clearModalRewriteFiles = function() {
  state.uploadedFiles = [];
  const fi = document.getElementById("modalRewriteFileInput");
  if (fi) fi.value = "";
  const pStrip = document.getElementById("modalRewritePreviewStrip");
  if (pStrip) pStrip.classList.add("hidden");
  const thumbGrid = document.getElementById("modalRewriteThumbGrid");
  if (thumbGrid) thumbGrid.innerHTML = "";
  const submitBtn = document.getElementById("submitModalRewriteBtn");
  if (submitBtn) submitBtn.disabled = true;

  // Restore previous baseline copies in viewer if available
  if (state.previousPages && state.previousPages.length > 0) {
    state.activePages = [...state.previousPages];
    state.currentPageIndex = 0;
    updateViewer();
  }
  const reEvalBar = document.getElementById("studioReEvalBar");
  if (reEvalBar) reEvalBar.classList.add("hidden");
};

function renderModalRewriteThumbs() {
  const pStrip = document.getElementById("modalRewritePreviewStrip");
  const thumbGrid = document.getElementById("modalRewriteThumbGrid");
  const countEl = document.getElementById("modalRewritePageCount");
  if (!pStrip || !thumbGrid) return;

  if (!state.uploadedFiles || state.uploadedFiles.length === 0 || !state.activePages || state.activePages.length === 0) {
    pStrip.classList.add("hidden");
    return;
  }
  pStrip.classList.remove("hidden");
  if (countEl) countEl.textContent = `${state.activePages.length} page(s) ready for re-evaluation`;

  thumbGrid.innerHTML = state.activePages.map((url, idx) => `
    <div class="relative rounded-lg overflow-hidden border border-slate-700 bg-slate-900 aspect-[3/4] shadow">
      <img src="${url}" class="w-full h-full object-cover" alt="Page ${idx + 1}">
      <span class="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-slate-950/90 text-white font-mono text-[9px] font-bold">p.${idx + 1}</span>
    </div>
  `).join("");
}

window.initModalRewriteDropzone = function() {
  if (window._modalDropzoneInitialized) return;
  window._modalDropzoneInitialized = true;

  const dropzone = document.getElementById("modalRewriteDropzone");
  const fileInput = document.getElementById("modalRewriteFileInput");

  if (dropzone && fileInput) {
    dropzone.addEventListener("click", () => {
      fileInput.click();
    });

    fileInput.addEventListener("click", () => {
      fileInput.value = "";
    });

    fileInput.addEventListener("change", () => {
      if (fileInput.files && fileInput.files.length > 0) {
        window.handleRewriteFiles(fileInput.files);
      }
    });

    dropzone.addEventListener("dragover", (e) => {
      e.preventDefault();
      dropzone.classList.add("border-emerald-500", "bg-emerald-500/10");
    });

    dropzone.addEventListener("dragleave", (e) => {
      e.preventDefault();
      dropzone.classList.remove("border-emerald-500", "bg-emerald-500/10");
    });

    dropzone.addEventListener("drop", (e) => {
      e.preventDefault();
      dropzone.classList.remove("border-emerald-500", "bg-emerald-500/10");
      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        window.handleRewriteFiles(e.dataTransfer.files);
      }
    });
  }
};

window.handleRewriteFiles = async function(files) {
  if (!files || files.length === 0) return;
  state.uploadedFiles = Array.from(files);
  state.isRewriteMode = true;

  const pStrip = document.getElementById("modalRewritePreviewStrip");
  const thumbGrid = document.getElementById("modalRewriteThumbGrid");
  const submitBtn = document.getElementById("submitModalRewriteBtn");

  if (pStrip) {
    pStrip.classList.remove("hidden");
    if (thumbGrid) {
      thumbGrid.innerHTML = `
        <div class="col-span-4 py-4 px-3 text-center text-emerald-400 text-xs flex items-center justify-center space-x-2 animate-pulse">
          <i data-lucide="loader-2" class="w-4 h-4 animate-spin"></i>
          <span>Rendering revised answer sheet...</span>
        </div>
      `;
      if (window.lucide) lucide.createIcons();
    }
  }

  const fd = new FormData();
  state.uploadedFiles.forEach(f => fd.append("files", f));

  let rendered = false;
  try {
    const res = await fetch("/api/render-preview", { method: "POST", body: fd });
    if (res.ok) {
      const data = await res.json();
      if (data.pages && data.pages.length > 0) {
        state.activePages = data.pages;
        state.currentPageIndex = 0;
        rendered = true;
      }
    }
  } catch (err) {
    console.warn("Server render-preview failed, using client fallback:", err);
  }

  if (!rendered) {
    const pages = [];
    for (const f of state.uploadedFiles) {
      if (f.type.startsWith("image/")) {
        const url = await new Promise(resolve => {
          const r = new FileReader();
          r.onload = e => resolve(e.target.result);
          r.readAsDataURL(f);
        });
        pages.push(url);
      }
    }
    if (pages.length > 0) {
      state.activePages = pages;
      state.currentPageIndex = 0;
    }
  }

  renderModalRewriteThumbs();
  if (submitBtn) submitBtn.disabled = false;
  updateViewer();

  // Show In-Studio Action Bar right above the copies (Fix for Image 4!)
  const reEvalBar = document.getElementById("studioReEvalBar");
  if (reEvalBar) {
    reEvalBar.classList.remove("hidden");
    const statusText = document.getElementById("studioReEvalStatusText");
    if (statusText) {
      statusText.textContent = `New revised draft (${state.activePages.length} pages) loaded. Click Re-evaluate to measure mark recovery.`;
    }
  }
  if (window.lucide) lucide.createIcons();
};

// Safely parses response from /api/evaluate, guaranteeing zero raw <!DOCTYPE HTML> SyntaxErrors
window.parseEvaluationResponse = async function parseEvaluationResponse(response) {
  const contentType = response.headers.get("content-type") || "";
  let data = null;
  if (contentType.includes("application/json")) {
    try {
      data = await response.json();
    } catch (e) {
      console.warn("Could not parse JSON response:", e);
    }
  }

  if (response.status === 402) {
    const msg = (data && (data.detail || data.message)) || "You have exhausted your complimentary starter evaluations. Choose a practice pack to continue!";
    return { ok: false, is402: true, message: msg };
  }

  if (!response.ok) {
    if (data && (data.error_type === "wrong_answersheet" || data.error_type === "wrong_paper" || data.error_type === "wrong_marks" || data.error_type === "intake_mismatch" || data.error_type === "identical_copy" || data.error_type === "blank_sheet" || data.error_type === "rewrite_quota_exhausted" || data.error_type === "single_rewrite_limit")) {
      return { ok: false, guardModal: data };
    }
    let errorDetail = "";
    if (data && data.detail) {
      errorDetail = typeof data.detail === "string" ? data.detail : JSON.stringify(data.detail);
    } else if (data && data.message) {
      errorDetail = data.message;
    } else if (response.status === 502 || response.status === 504 || response.status === 524) {
      errorDetail = "The evaluation server / network timed out while processing handwritten pages (504 Gateway Timeout). 🛡️ Zero Credits Deducted: Your free checks are 100% safe. Please retry.";
    } else if (response.status === 413) {
      errorDetail = "The uploaded booklet file is too large for upload. 🛡️ Zero Credits Deducted: Please compress images or upload a PDF under 25MB.";
    } else {
      errorDetail = `Server response notice (${response.status}). 🛡️ Zero Credits Deducted: Your free checks remain completely safe. Please check your connection and retry.`;
    }
    return { ok: false, message: errorDetail };
  }

  if (!data) {
    return {
      ok: false,
      message: "The server returned an unexpected response format. 🛡️ Zero Credits Deducted: Your free checks remain 100% intact. Please retry."
    };
  }

  return { ok: true, data };
}

// Execute Re-evaluation with Rule 1 (Cancel), Rule 2 (Loophole Guard), Rule 3 (Work in Progress), Rule 4 (Duplicate Check)
window.executeRewriteEvaluation = async function() {
  if (!state.uploadedFiles || state.uploadedFiles.length === 0) {
    alert("Please select or drop your revised answer copy (PDF or images) before re-evaluating.");
    window.openRewriteModal();
    return;
  }

  // RULE 3: WORK IN PROGRESS STATE LOCKING
  const modalSubmitBtn = document.getElementById("submitModalRewriteBtn");
  const studioSubmitBtn = document.getElementById("studioRunReEvalBtn");
  const mainEvalBtn = document.getElementById("evaluateBtn");

  const setWorkInProgress = (btn, origHtml) => {
    if (!btn) return;
    btn.disabled = true;
    btn.classList.add("evaluate-btn-locked");
    btn.setAttribute("data-orig-html", origHtml || btn.innerHTML);
    btn.innerHTML = `
      <span class="w-3.5 h-3.5 border-2 border-slate-900 border-t-transparent rounded-full animate-spin"></span>
      <span>Work in Progress — Evaluating...</span>
    `;
  };

  setWorkInProgress(modalSubmitBtn);
  setWorkInProgress(studioSubmitBtn);
  setWorkInProgress(mainEvalBtn);

  // Close modal so student can see live studio & forensic progress HUD
  window.closeRewriteModal();

  // Ensure Evaluation Studio is active
  if (state.currentEvaluation || state.previousEvaluation) {
    window.switchStudioState("studio");
  }

  // Hide in-studio reEvalBar so progress indicator takes the spotlight
  const reEvalBar = document.getElementById("studioReEvalBar");
  if (reEvalBar) reEvalBar.classList.add("hidden");

  // Show In-Studio Progress HUD and smoothly move the screen to the progressing section
  const sLoader = document.getElementById("studioLoadingIndicator");
  const mLoader = document.getElementById("loadingIndicator");
  if (sLoader) {
    sLoader.classList.remove("hidden");
    setTimeout(() => {
      sLoader.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 60);
  } else if (mLoader) {
    mLoader.classList.remove("hidden");
    setTimeout(() => {
      mLoader.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 60);
  }
  startForensicProgress();

  const baseline = state.rewriteBaseline || {};
  const question = baseline.question || state.question || (state.previousEvaluation && (state.previousEvaluation.detected_question || state.previousEvaluation.question)) || "UPSC Mains Answer";
  const paper = baseline.paper || state.paper || (state.previousEvaluation && state.previousEvaluation.paper) || "GS-2";
  const maxMarks = baseline.marks || state.marks || (state.previousEvaluation && state.previousEvaluation.max_marks) || 10;
  const baselineId = baseline.eval_id || state.currentEvalId || (state.previousEvaluation && (state.previousEvaluation.id || state.previousEvaluation.eval_id));

  const fd = new FormData();
  fd.append("question", question);
  fd.append("paper", paper);
  fd.append("max_marks", maxMarks);
  fd.append("is_rewrite", "true");
  if (baselineId) fd.append("baseline_eval_id", baselineId);
  if (question) fd.append("baseline_question", question);
  if (paper) fd.append("baseline_paper", paper);
  if (maxMarks) fd.append("baseline_marks", maxMarks);
  if (state.apiKey) fd.append("api_key", state.apiKey);
  if (state.user && state.user.email) fd.append("user_email", state.user.email);

  state.uploadedFiles.forEach(f => fd.append("files", f));

  window.currentEvaluationController = new AbortController();

  try {
    const res = await fetch("/api/evaluate", {
      method: "POST",
      body: fd,
      signal: window.currentEvaluationController.signal
    });

    const parsed = await parseEvaluationResponse(res);
    if (!parsed.ok) {
      if (parsed.is402) {
        alert(parsed.message);
        window.openPricingModal();
        return;
      }
      if (parsed.guardModal) {
        stopForensicProgress();
        if (sLoader) sLoader.classList.add("hidden");
        if (mLoader) mLoader.classList.add("hidden");
        window.showGuardModal(parsed.guardModal);
        return;
      }
      throw new Error(parsed.message || "Re-evaluation failed.");
    }

    const data = parsed.data;

    // Success! Render rewritten evaluation with mark recovery metrics
    data.evaluation.is_rewrite = true;
    if (state.previousEvaluation) {
      data.evaluation.previous_evaluation = state.previousEvaluation;
    }

    // Preserve original draft and setup rewritten draft for seamless toggle
    state.originalPages = [...(state.previousPages && state.previousPages.length > 0 ? state.previousPages : state.activePages)];
    state.originalEvaluation = state.previousEvaluation || state.currentEvaluation;
    state.rewrittenEvaluation = data.evaluation;
    if (data.pages && data.pages.length > 0) {
      state.rewrittenPages = [...data.pages];
      state.activePages = [...data.pages];
    }
    state.activeCopyMode = "rewrite";
    state.currentPageIndex = 0;

    renderEvaluation(data.evaluation);
    updateViewer();

    // Reveal copy switcher: [ Rewritten (Active) ] vs [ Original Draft ]
    const switcher = document.getElementById("copySwitcherContainer");
    if (switcher) switcher.classList.remove("hidden");

    // Hide re-evaluation pending bars
    if (reEvalBar) reEvalBar.classList.add("hidden");

    state.isRewriteMode = false;

    // Smoothly scroll screen to the evaluated dossier
    setTimeout(() => {
      const studioTop = document.getElementById("studioTopBar") || document.getElementById("evaluationStudio");
      if (studioTop) {
        studioTop.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 120);

  } catch (err) {
    if (err.name === "AbortError") {
      console.log("Re-evaluation aborted by candidate.");
      return;
    }
    let errMsg = String(err.message || "");
    if (errMsg.includes("Unexpected token '<'") || errMsg.includes("<!DOCTYPE") || errMsg.includes("not valid JSON")) {
      errMsg = "Evaluation network connection was interrupted or timed out. 🛡️ Zero Credits Deducted: Your free checks remain 100% intact. Please retry.";
    }
    if (typeof window.showAppNotice === 'function') {
      window.showAppNotice("Re-evaluation Notice", errMsg);
    } else {
      alert(`Re-evaluation Notice: ${errMsg}`);
    }
  } finally {
    stopForensicProgress();
    if (sLoader) sLoader.classList.add("hidden");
    if (mLoader) mLoader.classList.add("hidden");

    // Reset button states
    const resetButton = (btn, fallbackHtml, fallbackClass) => {
      if (!btn) return;
      btn.disabled = false;
      btn.classList.remove("evaluate-btn-locked");
      const orig = btn.getAttribute("data-orig-html");
      btn.innerHTML = orig || fallbackHtml;
      if (fallbackClass) btn.className = fallbackClass;
    };

    resetButton(modalSubmitBtn, '<i data-lucide="sparkles" class="w-3.5 h-3.5"></i> <span>Re-evaluate Answer Copy (0 Credits)</span>', "w-full sm:flex-1 py-2.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow transition flex items-center justify-center space-x-1.5");
    resetButton(studioSubmitBtn, '<i data-lucide="sparkles" class="w-3.5 h-3.5"></i> <span id="studioRunReEvalLabel">Re-evaluate Copy</span>', "px-3.5 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md transition flex items-center space-x-1.5");
    resetButton(mainEvalBtn, '<i data-lucide="sparkles" class="w-4 h-4 text-amber-400"></i> <span>Evaluate Answer Copy</span>', "w-full py-3.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm shadow-xl transition-all flex items-center justify-center space-x-2");

    if (window.lucide) lucide.createIcons();
  }
};

// RULE 1: CANCEL REWRITE MODE & RESTORE BASELINE
window.cancelRewriteMode = function() {
  if (window.currentEvaluationController) {
    window.currentEvaluationController.abort();
    window.currentEvaluationController = null;
  }
  stopForensicProgress();
  setSubjectAndMarksLocked(false);

  state.isRewriteMode = false;
  state.rewriteBaseline = null;
  state.uploadedFiles = [];

  const fi = document.getElementById("fileInput");
  if (fi) fi.value = "";
  const mfi = document.getElementById("modalRewriteFileInput");
  if (mfi) mfi.value = "";

  // Restore previous pages & viewer
  state.activeCopyMode = "original";
  if (state.originalPages && state.originalPages.length > 0) {
    state.activePages = [...state.originalPages];
  } else if (state.previousPages && state.previousPages.length > 0) {
    state.activePages = [...state.previousPages];
  }
  state.currentPageIndex = 0;
  updateViewer();

  // Restore baseline evaluation
  if (state.previousEvaluation) {
    state.currentEvaluation = state.previousEvaluation;
    renderEvaluation(state.previousEvaluation);
  }

  // Hide bars and modals
  const reEvalBar = document.getElementById("studioReEvalBar");
  if (reEvalBar) reEvalBar.classList.add("hidden");
  const sLoader = document.getElementById("studioLoadingIndicator");
  if (sLoader) sLoader.classList.add("hidden");
  const mLoader = document.getElementById("loadingIndicator");
  if (mLoader) mLoader.classList.add("hidden");
  const rModal = document.getElementById("rewriteUploadModal");
  if (rModal) {
    rModal.classList.add("hidden");
    rModal.classList.remove("flex");
  }
  const banner = document.getElementById("rewriteNoticeBanner");
  if (banner) banner.remove();

  // Reset evaluate button locks
  const modalSubmitBtn = document.getElementById("submitModalRewriteBtn");
  const studioSubmitBtn = document.getElementById("studioRunReEvalBtn");
  const mainEvalBtn = document.getElementById("evaluateBtn");

  [modalSubmitBtn, studioSubmitBtn, mainEvalBtn].forEach(btn => {
    if (btn) {
      btn.disabled = false;
      btn.classList.remove("evaluate-btn-locked");
    }
  });

  if (studioSubmitBtn) {
    studioSubmitBtn.innerHTML = '<i data-lucide="sparkles" class="w-3.5 h-3.5"></i> <span id="studioRunReEvalLabel">Re-evaluate Copy</span>';
  }
  if (modalSubmitBtn) {
    modalSubmitBtn.innerHTML = '<i data-lucide="sparkles" class="w-3.5 h-3.5"></i> <span id="submitModalRewriteLabel">Re-evaluate Answer Copy (0 Credits)</span>';
  }
  if (mainEvalBtn) {
    mainEvalBtn.innerHTML = '<i data-lucide="sparkles" class="w-4 h-4 text-amber-400"></i> <span>Evaluate Answer Copy</span>';
  }

  if (window.lucide) lucide.createIcons();
  alert("Re-evaluation cancelled. Your original evaluated copy has been preserved.");
};

window.showGuardModal = function(data) {
  const modal = document.getElementById("guardAlertModal");
  if (!modal) {
    alert(data.message || data.title || "Evaluation Alert");
    return;
  }

  const titleEl = document.getElementById("guardAlertTitle");
  const subtitleEl = document.getElementById("guardAlertSubtitle");
  const msgEl = document.getElementById("guardAlertMessage");
  const expectedEl = document.getElementById("guardExpectedText");
  const detectedEl = document.getElementById("guardDetectedText");
  const expectedLabel = document.getElementById("guardExpectedLabel");
  const detectedLabel = document.getElementById("guardDetectedLabel");
  const warningEl = document.getElementById("guardWarningText");
  const compBox = document.getElementById("guardComparisonBox");

  if (titleEl) titleEl.textContent = data.title || "Evaluation Guard Alert";
  if (subtitleEl) {
    if (data.error_type === "blank_sheet") {
      subtitleEl.textContent = "Blank / Unwritten Sheet Guard";
    } else if (data.error_type === "identical_copy") {
      subtitleEl.textContent = "Duplicate Submission Detected";
    } else if (data.error_type === "wrong_marks") {
      subtitleEl.textContent = "Question Marks Weightage Mismatch";
    } else if (data.error_type === "wrong_paper") {
      subtitleEl.textContent = "Subject / Paper Mismatch";
    } else if (data.error_type === "intake_mismatch") {
      subtitleEl.textContent = "Subject & Marks Discrepancy Guard Active";
    } else {
      subtitleEl.textContent = "Rewrite Loophole Guard Active";
    }
  }
  if (msgEl) msgEl.textContent = data.message || "";
  
  if (data.error_type === "blank_sheet") {
    if (compBox) compBox.classList.add("hidden");
  } else if (data.error_type === "intake_mismatch") {
    if (compBox) compBox.classList.remove("hidden");
    if (expectedLabel) {
      expectedLabel.textContent = "Your Intake Selection:";
      expectedLabel.className = "block text-[10px] font-mono font-bold uppercase tracking-wider text-amber-400";
    }
    if (detectedLabel) {
      detectedLabel.textContent = "Detected From Answer Booklet:";
      detectedLabel.className = "block text-[10px] font-mono font-bold uppercase tracking-wider text-rose-400";
    }
    if (expectedEl) expectedEl.textContent = `${data.selected_paper} (${data.selected_marks} Marks)`;
    if (detectedEl) {
      let qSnippet = data.detected_question ? ` — "${data.detected_question.slice(0, 95)}..."` : "";
      detectedEl.textContent = `${data.detected_paper} (${data.detected_marks} Marks)${qSnippet}`;
    }
  } else if (data.expected_marks && data.detected_marks) {
    if (compBox) compBox.classList.remove("hidden");
    if (expectedLabel) {
      expectedLabel.textContent = "Baseline Question:";
      expectedLabel.className = "block text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400";
    }
    if (detectedLabel) {
      detectedLabel.textContent = "Attempted Upload:";
      detectedLabel.className = "block text-[10px] font-mono font-bold uppercase tracking-wider text-rose-400";
    }
    if (expectedEl) expectedEl.textContent = `Baseline Question: ${data.expected_marks} Marks (${data.expected_paper || state.paper || "GS"})`;
    if (detectedEl) detectedEl.textContent = `Attempted Upload: ${data.detected_marks} Marks (${data.detected_paper || state.paper || "GS"})`;
  } else if (data.expected_question || data.expected_paper) {
    if (compBox) compBox.classList.remove("hidden");
    if (expectedLabel) {
      expectedLabel.textContent = "Baseline Submission:";
      expectedLabel.className = "block text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400";
    }
    if (detectedLabel) {
      detectedLabel.textContent = "Uploaded Script:";
      detectedLabel.className = "block text-[10px] font-mono font-bold uppercase tracking-wider text-rose-400";
    }
    if (expectedEl) expectedEl.textContent = data.expected_question || data.expected_paper || "Baseline evaluation";
    if (detectedEl) detectedEl.textContent = data.detected_question || data.detected_paper || "Uploaded answer copy";
  } else {
    if (compBox) compBox.classList.add("hidden");
  }

  if (warningEl) warningEl.textContent = data.warning || "0 credits were deducted from your account.";

  const reuploadBtn = document.getElementById("guardReuploadBtn");
  if (reuploadBtn) {
    if (data.error_type === "intake_mismatch") {
      reuploadBtn.innerHTML = `
        <i data-lucide="zap" class="w-3.5 h-3.5"></i>
        <span>Switch to ${data.detected_paper} (${data.detected_marks}M) & Evaluate</span>
      `;
      reuploadBtn.onclick = () => {
        window.closeGuardModal();
        if (typeof window.setPaperAndMarks === "function") {
          window.setPaperAndMarks(data.detected_paper, data.detected_marks);
        }
        if (typeof window.runEvaluation === "function") {
          window.runEvaluation(true);
        }
      };
    } else if (data.error_type === "blank_sheet") {
      reuploadBtn.innerHTML = `
        <i data-lucide="upload" class="w-3.5 h-3.5"></i>
        <span>Upload Written Answer Copy</span>
      `;
      reuploadBtn.onclick = () => {
        window.closeGuardModal();
        if (state.isRewriteMode) {
          window.openRewriteModal();
          const mfi = document.getElementById("modalRewriteFileInput");
          if (mfi) {
            mfi.value = "";
            setTimeout(() => mfi.click(), 100);
          }
        } else {
          const fi = document.getElementById("fileInput");
          if (fi) {
            fi.value = "";
            setTimeout(() => fi.click(), 100);
          }
          const dropEl = document.getElementById("dropzoneContainer");
          if (dropEl) dropEl.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      };
    } else {
      reuploadBtn.innerHTML = `
        <i data-lucide="upload" class="w-3.5 h-3.5"></i>
        <span>Re-upload Correct Copy</span>
      `;
      reuploadBtn.onclick = () => {
        window.closeGuardModal();
        window.openRewriteModal();
        const mfi = document.getElementById("modalRewriteFileInput");
        if (mfi) {
          mfi.value = "";
          setTimeout(() => mfi.click(), 100);
        }
      };
    }
  }

  const exitBtn = document.getElementById("guardExitRewriteBtn");
  if (exitBtn) {
    if (data.error_type === "intake_mismatch") {
      exitBtn.classList.remove("hidden");
      exitBtn.innerHTML = `
        <i data-lucide="x-circle" class="w-3.5 h-3.5"></i>
        <span>Change Uploaded Copy</span>
      `;
      exitBtn.onclick = () => {
        window.closeGuardModal();
        window.cancelUploadedAnswersheet();
        const dropEl = document.getElementById("dropzoneContainer");
        if (dropEl) dropEl.scrollIntoView({ behavior: "smooth", block: "center" });
      };
    } else if (data.error_type === "blank_sheet" && !state.isRewriteMode) {
      exitBtn.classList.add("hidden");
    } else {
      exitBtn.classList.remove("hidden");
      exitBtn.innerHTML = `
        <i data-lucide="corner-up-right" class="w-3.5 h-3.5"></i>
        <span>Evaluate as New Question</span>
      `;
      exitBtn.onclick = () => {
        window.closeGuardModal();
        window.cancelRewriteMode();
        window.switchStudioState("intake");
        if (typeof flashStep === "function") flashStep("step3Wrapper", "Ready for standard evaluation!");
      };
    }
  }

  // Cancel & Go Back option (Fix for Image 2)
  const cancelBtn = document.getElementById("guardCancelBtn");
  if (cancelBtn) {
    if (data.error_type === "intake_mismatch") {
      cancelBtn.innerHTML = `
        <i data-lucide="arrow-left" class="w-3.5 h-3.5"></i>
        <span>Keep Intake & Dismiss</span>
      `;
    } else {
      cancelBtn.innerHTML = `
        <i data-lucide="arrow-left" class="w-3.5 h-3.5"></i>
        <span>Cancel & Go Back to Evaluation</span>
      `;
    }
    cancelBtn.onclick = () => {
      window.closeGuardModal();
    };
  }

  const closeBtn = document.getElementById("closeGuardModalBtn");
  if (closeBtn) {
    closeBtn.onclick = () => {
      window.closeGuardModal();
    };
  }

  modal.classList.remove("hidden");
  modal.classList.add("flex");
  if (window.lucide) lucide.createIcons();
};

window.closeGuardModal = function() {
  const modal = document.getElementById("guardAlertModal");
  if (modal) {
    modal.classList.add("hidden");
    modal.classList.remove("flex");
  }

  // Restore the baseline evaluation copies in viewer only if in rewrite mode
  if (state.isRewriteMode && state.previousPages && state.previousPages.length > 0) {
    state.activePages = [...state.previousPages];
    state.currentPageIndex = 0;
    updateViewer();
  }

  // Clean up any pending re-eval bar since copy was rejected
  const reEvalBar = document.getElementById("studioReEvalBar");
  if (reEvalBar) reEvalBar.classList.add("hidden");

  // Ensure progress indicators are stopped and hidden
  stopForensicProgress();
  const sLoader = document.getElementById("studioLoadingIndicator");
  if (sLoader) sLoader.classList.add("hidden");
  const mLoader = document.getElementById("loadingIndicator");
  if (mLoader) mLoader.classList.add("hidden");

  // Unlock evaluate button if it was left locked
  if (typeof setSubjectAndMarksLocked === "function") {
    setSubjectAndMarksLocked(false);
  }
  const evalBtn = document.getElementById("evaluateBtn");
  if (evalBtn) {
    evalBtn.disabled = false;
    evalBtn.classList.remove("evaluate-btn-locked");
    if (state.isRewriteMode) {
      evalBtn.innerHTML = `
        <i data-lucide="sparkles" class="w-4 h-4 text-emerald-400"></i>
        <span>Evaluate Rewrite Copy (0 Credits - Free)</span>
      `;
    } else {
      evalBtn.innerHTML = `
        <i data-lucide="sparkles" class="w-4 h-4 text-amber-300"></i>
        <span>Evaluate Like Senior UPSC Examiner</span>
      `;
    }
  }

  // Ensure candidate returns cleanly to their current evaluation studio ONLY IF in rewrite mode
  if (state.isRewriteMode && (state.currentEvaluation || state.previousEvaluation)) {
    window.switchStudioState("studio");
  }
  if (window.lucide) lucide.createIcons();
};

const keyTestResult = document.getElementById("keyTestResult");
const keyStatusLabel = document.getElementById("keyStatusLabel");

// Initialization
document.addEventListener("DOMContentLoaded", async () => {
  initThemeSystem();
  if (window.lucide) lucide.createIcons();
  await initUserSession();
  await checkServerConfig();
  await loadSamplesList();
  await loadDailyQuestion();
  
  // Set up sequential progression (Step 1 -> Step 2 -> Step 3)
  updateStepProgression();

  // Attach all user, modal, locker, and DAW interactive listeners
  setupUserAndModalListeners();

  // Attach mobile navigation & responsive controls
  setupMobileAndResponsiveListeners();

  // URL Parameter auto-test runner for automated UI verification
  if (window.location.search.includes("autotest=1")) {
    setTimeout(async () => {
      let retries = 0;
      while ((!state.samples || state.samples.length === 0) && retries < 30) {
        await new Promise(r => setTimeout(r, 100));
        retries++;
      }
      if (state.samples && state.samples.length > 0) {
        loadSample(state.samples[0]);
        setTimeout(() => {
          const m15 = document.querySelector('[data-marks="15"]');
          if (m15) m15.click();
          if (state.samples[0].evaluation) {
            renderEvaluation(state.samples[0].evaluation);
            const results = document.getElementById("resultsContainer");
            if (window.location.search.includes("tab=multipliers")) {
              window.switchStudioTab("multipliers");
            } else if (window.location.search.includes("tab=rewrite")) {
              window.switchStudioTab("rewrite");
            }

            if (window.location.search.includes("hud=1")) {
              const loading = document.getElementById("loadingIndicator");
              if (loading) loading.classList.remove("hidden");
              startForensicProgress();
            }

            if (window.location.search.includes("guard=1")) {
              window.showGuardModal({
                title: "Topic Mismatch Detected",
                error_type: "wrong_paper",
                message: "You submitted an answer for 'GS-1 Society / Urbanization' while attempting to re-evaluate 'GS-2 Electoral Bonds & Transparency'.",
                expected_question: "Critically analyse the Electoral Bonds verdict (GS-2)",
                detected_question: "Discuss the challenges of rapid urbanization (GS-1)",
                warning: "Zero credits deducted. Please upload your revised Electoral Bonds answer copy to re-evaluate for free."
              });
            } else if (window.location.search.includes("duplicate=1")) {
              window.showGuardModal({
                title: "Duplicate Copy Detected",
                error_type: "identical_copy",
                message: "The uploaded file is byte-for-byte identical to your previously evaluated copy (SHA-256 matched). No revisions or margin improvements were detected.",
                warning: "Zero credits deducted this time. Submitting the exact same unrevised answers repeatedly will consume available evaluation credits."
              });
            }
          }
        }, 300);
      }
    }, 200);
  }
});

// =========================================================
// THEME SYSTEM (Authentic UPSC Dholpur House Light & Dark Mode)
// =========================================================

function initThemeSystem() {
  const savedTheme = localStorage.getItem("mainsmentor_theme");
  // Default to sleek studio dark mode (#0A0C10), support URL parameter &light=1 or saved light preference
  const isDark = window.location.search.includes("light=1") ? false : (window.location.search.includes("dark=1") ? true : (savedTheme ? savedTheme === "dark" : true));

  applyTheme(isDark);

  const themeToggleBtn = document.getElementById("themeToggleBtn");
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener("click", () => {
      const currentlyDark = document.documentElement.classList.contains("dark");
      const nextDark = !currentlyDark;
      applyTheme(nextDark);
      localStorage.setItem("mainsmentor_theme", nextDark ? "dark" : "light");
    });
  }
}

function applyTheme(isDark) {
  const root = document.documentElement;
  const label = document.getElementById("themeToggleLabel");
  const icon = document.getElementById("themeToggleIcon");
  const btn = document.getElementById("themeToggleBtn");

  if (isDark) {
    root.classList.add("dark");
    if (label) label.textContent = "Light Mode";
    if (icon) {
      icon.setAttribute("data-lucide", "sun");
      icon.className = "w-3.5 h-3.5 text-amber-400";
    }
    if (btn) {
      btn.title = "Switch to Light Mode (Dholpur House Paper)";
    }
  } else {
    root.classList.remove("dark");
    if (label) label.textContent = "Dark Mode";
    if (icon) {
      icon.setAttribute("data-lucide", "moon");
      icon.className = "w-3.5 h-3.5 text-amber-600";
    }
    if (btn) {
      btn.title = "Switch to Dark Mode (Midnight Slate)";
    }
  }

  if (window.lucide) {
    try { window.lucide.createIcons(); } catch (e) {}
  }

  // Re-render radar chart if available to adjust colors for theme
  if (radarChartInstance && state.lastRubricScores) {
    renderRadar(state.lastRubricScores, state.lastMaxMarks || 10);
  }
}
window.applyTheme = applyTheme;

// =========================================================
// MOBILE & RESPONSIVE CONTROLS
// =========================================================

function setupMobileAndResponsiveListeners() {
  // 1. Mobile Bottom Navigation Bar (< 768px)
  const mbNavEvaluate = document.getElementById("mbNavEvaluate");
  if (mbNavEvaluate) {
    mbNavEvaluate.addEventListener("click", () => {
      const step1 = document.getElementById("step1Wrapper");
      if (step1) step1.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  const mbNavDaily = document.getElementById("mbNavDaily");
  if (mbNavDaily) {
    mbNavDaily.addEventListener("click", () => {
      const daw = document.getElementById("dailyQuestionBanner");
      if (daw) {
        daw.classList.remove("hidden");
        daw.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  }

  const mbNavLocker = document.getElementById("mbNavLocker");
  if (mbNavLocker) {
    mbNavLocker.addEventListener("click", () => {
      const openLockerBtn = document.getElementById("openLockerBtn");
      if (openLockerBtn) openLockerBtn.click();
    });
  }

  const mbNavRubrics = document.getElementById("mbNavRubrics");
  if (mbNavRubrics) {
    mbNavRubrics.addEventListener("click", () => {
      const res = document.getElementById("resultsContainer");
      if (res && !res.classList.contains("hidden")) {
        res.scrollIntoView({ behavior: "smooth", block: "start" });
      } else {
        const loadDawBtn = document.getElementById("loadDawBtn");
        if (loadDawBtn) loadDawBtn.click();
      }
    });
  }

  // 2. Mobile Segmented Tabs Switcher (Annotated, Penalties, Toolkit, Blueprint)
  const mobileTabBtns = document.querySelectorAll(".mobile-res-tab");
  mobileTabBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      mobileTabBtns.forEach(b => {
        b.classList.remove("active", "bg-white", "dark:bg-slate-800", "text-slate-900", "dark:text-white", "font-bold");
        b.classList.add("text-slate-600", "dark:text-slate-400", "font-medium");
      });
      btn.classList.add("active", "bg-white", "dark:bg-slate-800", "text-slate-900", "dark:text-white", "font-bold");
      btn.classList.remove("text-slate-600", "dark:text-slate-400", "font-medium");

      const tab = btn.getAttribute("data-tab");
      handleMobileTabSwitch(tab);
    });
  });

  // 3. Sticky Bottom Rewrite Action Bar
  const stickyExportPdfBtn = document.getElementById("stickyExportPdfBtn");
  if (stickyExportPdfBtn) {
    stickyExportPdfBtn.addEventListener("click", () => {
      window.openEvaluatedPrintPreview();
    });
  }

  const stickyRewriteBtn = document.getElementById("stickyRewriteBtn");
  if (stickyRewriteBtn) {
    stickyRewriteBtn.addEventListener("click", () => {
      const activateBtn = document.getElementById("activateRewriteBtn");
      if (activateBtn) {
        activateBtn.click();
      } else {
        const dropzone = document.getElementById("dropzone");
        if (dropzone) dropzone.scrollIntoView({ behavior: "smooth" });
      }
    });
  }
}

function handleMobileTabSwitch(tab) {
  const viewerCard = document.getElementById("pageViewerCard");
  const fatalBanner = document.getElementById("fatalBlunderBanner");
  const mkHeading = document.getElementById("missingKeywordsHeading");
  const modelAnswer = document.getElementById("fullModelAnswerContainer");
  const heroScore = document.getElementById("resultScore");

  if (tab === "annotated") {
    if (viewerCard) viewerCard.scrollIntoView({ behavior: "smooth", block: "start" });
  } else if (tab === "penalties") {
    if (fatalBanner && !fatalBanner.classList.contains("hidden")) {
      fatalBanner.scrollIntoView({ behavior: "smooth", block: "start" });
    } else if (heroScore) {
      heroScore.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  } else if (tab === "toolkit") {
    if (mkHeading) mkHeading.scrollIntoView({ behavior: "smooth", block: "start" });
  } else if (tab === "blueprint") {
    if (modelAnswer) modelAnswer.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

// User Session & Daily Question Initialization
async function initUserSession() {
  const saved = localStorage.getItem("mainsmentor_user");
  if (saved) {
    try {
      state.user = JSON.parse(saved);
    } catch (e) {
      state.user = null;
    }
  } else {
    state.user = null;
  }

  // If user is saved, sync profile from server
  if (state.user && state.user.email) {
    try {
      const res = await fetch(`/api/user/profile?email=${encodeURIComponent(state.user.email)}`);
      if (res.ok) {
        state.user = await res.json();
        localStorage.setItem("mainsmentor_user", JSON.stringify(state.user));
      }
    } catch (err) {
      console.warn("User profile sync error:", err);
    }
  }

  updateUserUI();
  refreshLockerBadge();
}

function updateUserUI() {
  const loginRegisterBtn = document.getElementById("loginRegisterBtn");
  const myAccountBtn = document.getElementById("myAccountBtn");
  const navCreditsCountMobile = document.getElementById("navCreditsCountMobile");
  const modalCreditsDisplay = document.getElementById("modalCreditsDisplay");

  const intakeDeck = document.getElementById("intakeDeck");
  const firstPageSub = document.getElementById("firstPageSubscriptionSection");
  const heroSection = document.getElementById("heroLandingSection");

  if (!state.user || !state.user.email) {
    // Aspirant is unauthenticated / guest — show Page 1 (Hero & Subscription), strictly hide Intake Deck
    if (loginRegisterBtn) loginRegisterBtn.classList.remove("hidden");
    if (myAccountBtn) myAccountBtn.classList.add("hidden");
    if (navCreditsCount) navCreditsCount.textContent = "5 Free Checks";
    if (navCreditsCountMobile) navCreditsCountMobile.textContent = "5 Free";
    if (modalCreditsDisplay) modalCreditsDisplay.textContent = "5 Checks Free";
    if (intakeDeck) {
      intakeDeck.style.setProperty("display", "none", "important");
      intakeDeck.classList.add("hidden");
    }
    if (heroSection) {
      heroSection.style.display = "flex";
      heroSection.classList.remove("hidden");
    }
    if (firstPageSub) {
      firstPageSub.style.display = "flex";
      firstPageSub.classList.remove("hidden");
    }
    return;
  }

  // Aspirant is signed in / sign up complete — open Page 2 (Daily Question & Intake Deck), hide Page 1 Hero & Subscription
  if (loginRegisterBtn) loginRegisterBtn.classList.add("hidden");
  if (myAccountBtn) myAccountBtn.classList.remove("hidden");
  if (heroSection) {
    heroSection.style.display = "none";
    heroSection.classList.add("hidden");
  }
  if (firstPageSub) {
    firstPageSub.style.display = "none";
    firstPageSub.classList.add("hidden");
  }
  if (state.activeStudioView === "studio") {
    if (intakeDeck) {
      intakeDeck.style.setProperty("display", "none", "important");
      intakeDeck.classList.add("hidden");
    }
  } else if (intakeDeck) {
    intakeDeck.style.setProperty("display", "flex", "important");
    intakeDeck.classList.remove("hidden");
  }

  const userName = state.user.name || "Aspirant";
  if (navUserLabel) navUserLabel.textContent = userName;
  const myAccountBtnLabel = document.getElementById("myAccountBtnLabel");
  if (myAccountBtnLabel) {
    myAccountBtnLabel.textContent = userName.length > 14 ? userName.slice(0, 12) + "…" : userName;
  }
  const navAvatarInitials = document.getElementById("navAvatarInitials");
  if (navAvatarInitials) {
    navAvatarInitials.textContent = (userName.charAt(0) || "A").toUpperCase();
  }

  const c = state.user.credits !== undefined ? state.user.credits : 5;
  const r = state.user.free_rewrites !== undefined ? state.user.free_rewrites : 2;
  const evalsCount = state.user.evaluations_count || 0;

  if (navCreditsCount) {
    if (state.user.is_pro) {
      navCreditsCount.textContent = "Pro Unlimited";
    } else {
      navCreditsCount.textContent = `${c} Free Check${c === 1 ? '' : 's'}`;
    }
  }
  if (navCreditsCountMobile) {
    if (state.user.is_pro) {
      navCreditsCountMobile.textContent = "Pro";
    } else {
      navCreditsCountMobile.textContent = `${c} Free`;
    }
  }
  if (modalCreditsDisplay) {
    modalCreditsDisplay.textContent = state.user.is_pro ? "Pro Unlimited" : `${c} Checks Left`;
  }

  // Sync My Account Modal Profile Card
  const accountUserName = document.getElementById("accountUserName");
  if (accountUserName) accountUserName.textContent = userName;
  const accountUserEmail = document.getElementById("accountUserEmail");
  if (accountUserEmail) accountUserEmail.textContent = state.user.email || "aspirant@cookedmains.ai";
  const accountAvatarInitials = document.getElementById("accountAvatarInitials");
  if (accountAvatarInitials) accountAvatarInitials.textContent = (userName.charAt(0) || "A").toUpperCase();
  const accountTierBadge = document.getElementById("accountTierBadge");
  if (accountTierBadge) {
    accountTierBadge.textContent = state.user.is_pro ? "Mains Pro" : "Free Tier";
  }
  const accountCadetId = document.getElementById("accountCadetId");
  if (accountCadetId) {
    const numPart = (state.user.email || "").replace(/\D/g, "");
    accountCadetId.textContent = "MM-2026-" + (numPart ? numPart.slice(-4).padStart(4, "7") : "7666");
  }
  const accountNavCreditsPill = document.getElementById("accountNavCreditsPill");
  if (accountNavCreditsPill) {
    accountNavCreditsPill.textContent = state.user.is_pro ? "Unlimited" : `${c} Left`;
  }

  // Profile Form Inputs
  const profileInputName = document.getElementById("profileInputName");
  if (profileInputName && !profileInputName.matches(":focus")) profileInputName.value = userName;
  const profileInputEmail = document.getElementById("profileInputEmail");
  if (profileInputEmail) profileInputEmail.value = state.user.email || "";
  const profileSelectYear = document.getElementById("profileSelectYear");
  if (profileSelectYear && state.user.target_year) profileSelectYear.value = state.user.target_year;
  const profileSelectOptional = document.getElementById("profileSelectOptional");
  if (profileSelectOptional && state.user.optional_subject) profileSelectOptional.value = state.user.optional_subject;

  // Profile Metric Counters
  const profileFreeChecksCount = document.getElementById("profileFreeChecksCount");
  if (profileFreeChecksCount) profileFreeChecksCount.textContent = c.toString();
  const profileFreeRewritesCount = document.getElementById("profileFreeRewritesCount");
  if (profileFreeRewritesCount) profileFreeRewritesCount.textContent = r.toString();
  const profileEvaluatedCount = document.getElementById("profileEvaluatedCount");
  if (profileEvaluatedCount) profileEvaluatedCount.textContent = evalsCount.toString();

  // Subscription Tab Quota Progress
  const subRemainingChecksBadge = document.getElementById("subRemainingChecksBadge");
  if (subRemainingChecksBadge) {
    subRemainingChecksBadge.textContent = state.user.is_pro ? "Unlimited Checks" : `${c} / 5 Remaining`;
  }
  const subChecksProgressBar = document.getElementById("subChecksProgressBar");
  if (subChecksProgressBar) {
    const pct = state.user.is_pro ? 100 : Math.min(100, Math.max(0, (c / 5) * 100));
    subChecksProgressBar.style.width = `${pct}%`;
  }
  const subRemainingRewritesBadge = document.getElementById("subRemainingRewritesBadge");
  if (subRemainingRewritesBadge) {
    subRemainingRewritesBadge.textContent = state.user.is_pro ? "Unlimited Re-evaluations" : `${r} / 2 Remaining`;
  }
  const subRewritesProgressBar = document.getElementById("subRewritesProgressBar");
  if (subRewritesProgressBar) {
    const pct = state.user.is_pro ? 100 : Math.min(100, Math.max(0, (r / 2) * 100));
    subRewritesProgressBar.style.width = `${pct}%`;
  }

  const modalDisplay = document.getElementById("modalCreditsDisplay");
  if (modalDisplay) {
    if (state.user.is_pro) {
      modalDisplay.textContent = "Unlimited Pro Active";
      modalDisplay.className = "px-3 py-1.5 rounded-xl bg-sky-500/20 border border-sky-500/40 text-xs font-mono font-bold text-sky-300 shrink-0";
    } else {
      modalDisplay.textContent = `${c} Check${c === 1 ? '' : 's'} Remaining`;
      modalDisplay.className = `px-3 py-1.5 rounded-xl ${c > 0 ? 'bg-slate-900 border border-slate-700 text-amber-300' : 'bg-rose-500/20 border border-rose-500/40 text-rose-300'} text-xs font-mono font-bold shrink-0`;
    }
  }
}

async function refreshLockerBadge() {
  if (!state.user || !state.user.email) return;
  try {
    const res = await fetch(`/api/user/history?email=${encodeURIComponent(state.user.email)}`);
    if (res.ok) {
      const history = await res.json();
      if (lockerCountBadge) {
        lockerCountBadge.textContent = history.length.toString();
      }
    }
  } catch (err) {
    console.warn("Locker badge refresh error:", err);
  }
}

async function loadDailyQuestion(paper = null, offset = 0) {
  try {
    let url = "/api/daily-question?";
    if (paper && paper !== "TODAY") url += `paper=${encodeURIComponent(paper)}&`;
    if (offset) url += `offset=${offset}&`;

    const res = await fetch(url);
    if (!res.ok) return;
    const daw = await res.json();
    state.dailyQuestion = daw;
    state.dawOffset = offset;
    state.dawPaperFilter = paper || "TODAY";

    const dawDateBadge = document.getElementById("dawDateBadge");
    const dawTimeBadge = document.getElementById("dawTimeBadge");
    if (dawDateBadge && daw.date_display) dawDateBadge.textContent = daw.date_display;
    if (dawPaperBadge) dawPaperBadge.textContent = `${daw.paper} • ${daw.paper_name || 'Daily Target'}`;
    if (dawSpecsBadge) dawSpecsBadge.textContent = `${daw.marks} Marks • ${daw.word_limit} Words`;
    if (dawTimeBadge && daw.time_target) dawTimeBadge.textContent = `Target: ${daw.time_target}`;
    if (dawQuestionText) dawQuestionText.textContent = daw.question;
    if (dawContextText) {
      dawContextText.innerHTML = `
        <i data-lucide="info" class="w-3.5 h-3.5 text-amber-400/80 shrink-0"></i>
        <span>${daw.context}</span>
      `;
    }
    if (window.lucide) lucide.createIcons();
  } catch (e) {
    console.warn("DAW load error:", e);
  }
}

// Check if backend already has a server master key configured
async function checkServerConfig() {
  try {
    const res = await fetch("/api/config");
    if (res.ok) {
      const data = await res.json();
      if (data.server_has_key) {
        state.serverHasKey = true;
        if (keyStatusLabel) keyStatusLabel.textContent = "Faculty AI Active";
        if (openKeyModalBtn) {
          openKeyModalBtn.classList.remove("bg-amber-500/10", "text-amber-300", "border-amber-500/30");
          openKeyModalBtn.classList.add("bg-emerald-500/10", "text-emerald-300", "border-emerald-500/30");
        }
        return;
      }
    }
  } catch (e) {
    console.warn("Config check error:", e);
  }
  updateKeyStatusUI();
}

// Update API key status badge
function updateKeyStatusUI() {
  const isReady = Boolean(state.apiKey || state.serverHasKey);
  if (keyStatusLabel) {
    keyStatusLabel.textContent = isReady ? "Faculty AI Active" : "Faculty AI Active";
  }
  if (openKeyModalBtn) {
    if (isReady) {
      openKeyModalBtn.classList.remove("bg-amber-500/10", "text-amber-300", "border-amber-500/30");
      openKeyModalBtn.classList.add("bg-emerald-500/10", "text-emerald-300", "border-emerald-500/30");
    } else {
      openKeyModalBtn.classList.add("bg-emerald-500/10", "text-emerald-300", "border-emerald-500/30");
      openKeyModalBtn.classList.remove("bg-amber-500/10", "text-amber-300", "border-amber-500/30");
    }
  }
  if (state.apiKey && apiKeyInput) {
    apiKeyInput.value = state.apiKey;
  }
}

// Step Progression Engine (Enforces: Step 1 -> Step 2 -> Step 3)
function updateStepProgression() {
  const isPaperSelected = Boolean(state.selectedPaperTab);
  const isEssay = state.selectedPaperTab === "Essay";
  const isMarksSelected = isEssay ? true : Boolean(state.marks);

  // --- Step 1 Indicator ---
  if (step1Badge) {
    if (isPaperSelected) {
      step1Badge.textContent = `✓ ${state.selectedPaperTab} Active`;
      step1Badge.className = "text-[11px] font-semibold text-emerald-600 dark:text-emerald-400";
      if (step1Wrapper) step1Wrapper.classList.remove("border-amber-500/60", "ring-1", "ring-amber-500/40");
      paperTabs.forEach(t => {
        if (t.getAttribute("data-paper") === state.selectedPaperTab) {
          t.classList.add("active", "bg-white", "dark:bg-slate-900", "text-amber-600", "dark:text-amber-400", "shadow-sm", "border", "border-slate-200/80", "dark:border-slate-700");
          t.classList.remove("text-slate-600", "dark:text-slate-400");
        } else {
          t.classList.remove("active", "bg-white", "dark:bg-slate-900", "text-amber-600", "dark:text-amber-400", "shadow-sm", "border", "border-slate-200/80", "dark:border-slate-700");
          t.classList.add("text-slate-600", "dark:text-slate-400");
        }
      });
    } else {
      step1Badge.textContent = "Select Subject";
      step1Badge.className = "text-[11px] font-semibold text-amber-600 dark:text-amber-400";
    }
  }

  // --- Step 2 Indicator & Gating ---
  if (step2Wrapper && step2Badge) {
    if (isEssay) {
      step2Badge.textContent = "✓ 125M Auto-Set";
      step2Badge.className = "text-[11px] font-semibold text-emerald-600 dark:text-emerald-400";
      if (marksToggle) marksToggle.classList.add("hidden");
      if (essayMarksNotice) essayMarksNotice.classList.remove("hidden");
    } else {
      if (marksToggle) marksToggle.classList.remove("hidden");
      if (essayMarksNotice) essayMarksNotice.classList.add("hidden");

      if (isMarksSelected) {
        step2Badge.textContent = `✓ ${state.marks} Marks`;
        step2Badge.className = "text-[11px] font-semibold text-emerald-600 dark:text-emerald-400";
        step2Wrapper.classList.remove("border-amber-500/60", "ring-1", "ring-amber-500/40");
        marksBtns.forEach(b => {
          const m = parseInt(b.getAttribute("data-marks"), 10);
          if (m === state.marks) {
            b.classList.add("active", "border-amber-500", "bg-amber-500/10", "text-amber-600", "dark:text-amber-400", "shadow-sm");
            b.classList.remove("border-slate-200", "dark:border-slate-700", "bg-slate-50", "dark:bg-slate-800/60", "text-slate-700", "dark:text-slate-300");
          } else {
            b.classList.remove("active", "border-amber-500", "bg-amber-500/10", "text-amber-600", "dark:text-amber-400", "shadow-sm");
            b.classList.add("border-slate-200", "dark:border-slate-700", "bg-slate-50", "dark:bg-slate-800/60", "text-slate-700", "dark:text-slate-300");
          }
        });
      } else {
        step2Badge.textContent = "Select Marks";
        step2Badge.className = "text-[11px] font-semibold text-amber-600 dark:text-amber-400";
      }
    }
  }

  // --- Step 3 Upload Gating Overlay ---
  if (dropzoneLockOverlay && step3Badge && step3Number) {
    if (isPaperSelected && isMarksSelected) {
      dropzoneLockOverlay.classList.add("hidden");
      step3Badge.textContent = "Unlocked ✓";
      step3Badge.className = "text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30";
      step3Number.className = "w-5 h-5 rounded-full bg-amber-500 text-slate-950 font-bold text-[11px] flex items-center justify-center";
      if (step3Wrapper) step3Wrapper.classList.remove("opacity-60");
    } else {
      dropzoneLockOverlay.classList.remove("hidden");
      step3Badge.textContent = "Locked";
      step3Badge.className = "text-[10px] text-slate-500 font-medium bg-slate-900 px-2 py-0.5 rounded border border-slate-800";
      step3Number.className = "w-5 h-5 rounded-full bg-slate-800 text-slate-500 font-bold text-[11px] flex items-center justify-center";
    }
  }
}

// Flash visual guidance if user attempts action out of sequence
function flashStep(elementId, message) {
  const el = document.getElementById(elementId);
  if (!el) return;
  el.scrollIntoView({ behavior: "smooth", block: "center" });
  el.classList.add("ring-2", "ring-amber-400", "border-amber-400");
  const badge = el.querySelector("[id$='Badge']");
  if (badge) {
    badge.textContent = message;
    badge.className = "text-[10px] text-amber-300 font-bold bg-amber-500/20 px-2 py-0.5 rounded border border-amber-500/40 animate-pulse";
    setTimeout(() => {
      el.classList.remove("ring-2", "ring-amber-400", "border-amber-400");
      updateStepProgression();
    }, 2000);
  } else {
    setTimeout(() => {
      el.classList.remove("ring-2", "ring-amber-400", "border-amber-400");
    }, 2000);
  }
}

// Lock Overlay Interceptors
if (dropzoneLockOverlay) {
  dropzoneLockOverlay.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!state.selectedPaperTab) {
      flashStep("step1Wrapper", "⚠ Select Subject First!");
    } else if (!state.marks && state.selectedPaperTab !== "Essay") {
      flashStep("step2Wrapper", "⚠ Select Marks First!");
    }
  });

  dropzoneLockOverlay.addEventListener("dragover", (e) => {
    e.preventDefault();
  });

  dropzoneLockOverlay.addEventListener("drop", (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!state.selectedPaperTab) {
      flashStep("step1Wrapper", "⚠ Select Subject First!");
    } else if (!state.marks && state.selectedPaperTab !== "Essay") {
      flashStep("step2Wrapper", "⚠ Select Marks First!");
    }
  });
}

// Paper Selection (Step 1)
paperTabs.forEach(tab => {
  tab.addEventListener("click", () => {
    if (state.isControlsLocked) return;
    paperTabs.forEach(t => {
      t.classList.remove("active", "bg-white", "dark:bg-slate-900", "text-amber-600", "dark:text-amber-400", "shadow-sm", "border", "border-slate-200/80", "dark:border-slate-700");
      t.classList.add("text-slate-600", "dark:text-slate-400");
    });
    tab.classList.add("active", "bg-white", "dark:bg-slate-900", "text-amber-600", "dark:text-amber-400", "shadow-sm", "border", "border-slate-200/80", "dark:border-slate-700");
    tab.classList.remove("text-slate-600", "dark:text-slate-400");
    const paperVal = tab.getAttribute("data-paper");
    state.selectedPaperTab = paperVal;

    if (paperVal === "Optional") {
      if (optionalSubjectWrapper) optionalSubjectWrapper.classList.remove("hidden");
      state.paper = optionalSubjectSelect ? optionalSubjectSelect.value : "Optional-PSIR";
      if (essayMarksNotice) essayMarksNotice.classList.add("hidden");
      if (marksToggle) marksToggle.classList.remove("hidden");
    } else if (paperVal === "Essay") {
      if (optionalSubjectWrapper) optionalSubjectWrapper.classList.add("hidden");
      state.paper = "Essay";
      state.marks = 125;
      if (essayMarksNotice) essayMarksNotice.classList.remove("hidden");
      if (marksToggle) marksToggle.classList.add("hidden");
      const step2Badge = document.getElementById("step2Badge");
      if (step2Badge) step2Badge.textContent = "✓ 125 Marks (Essay)";
    } else {
      if (optionalSubjectWrapper) optionalSubjectWrapper.classList.add("hidden");
      state.paper = paperVal;
      if (essayMarksNotice) essayMarksNotice.classList.add("hidden");
      if (marksToggle) marksToggle.classList.remove("hidden");
    }

    const step1Badge = document.getElementById("step1Badge");
    if (step1Badge) step1Badge.textContent = `✓ ${paperVal} Active`;

    updateStepProgression();
  });
});

if (optionalSubjectSelect) {
  optionalSubjectSelect.addEventListener("change", () => {
    if (state.isControlsLocked) return;
    if (state.selectedPaperTab === "Optional") {
      state.paper = optionalSubjectSelect.value;
      updateStepProgression();
    }
  });
}

// Marks Selection (Step 2: 10, 15, or 20 Marks)
marksBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    if (state.isControlsLocked) return;
    marksBtns.forEach(b => {
      b.classList.remove("active", "border-amber-500", "bg-amber-500/10", "text-amber-600", "dark:text-amber-400", "shadow-sm");
      b.classList.add("border-slate-200", "dark:border-slate-700", "bg-slate-50", "dark:bg-slate-800/60", "text-slate-700", "dark:text-slate-300");
    });
    btn.classList.add("active", "border-amber-500", "bg-amber-500/10", "text-amber-600", "dark:text-amber-400", "shadow-sm");
    btn.classList.remove("border-slate-200", "dark:border-slate-700", "bg-slate-50", "dark:bg-slate-800/60", "text-slate-700", "dark:text-slate-300");
    state.marks = parseInt(btn.getAttribute("data-marks"), 10);
    const step2Badge = document.getElementById("step2Badge");
    if (step2Badge) step2Badge.textContent = `✓ ${state.marks} Marks`;
    updateStepProgression();
  });
});

// Programmatic Paper & Marks synchronizer (Used by Intake Discrepancy Guard)
window.setPaperAndMarks = function(paperVal, marksVal) {
  if (paperVal) {
    state.selectedPaperTab = paperVal;
    state.paper = paperVal;
    const tab = document.querySelector(`.paper-tab[data-paper="${paperVal}"]`);
    if (tab && typeof paperTabs !== "undefined") {
      paperTabs.forEach(t => {
        t.classList.remove("active", "bg-white", "dark:bg-slate-900", "text-amber-600", "dark:text-amber-400", "shadow-sm", "border", "border-slate-200/80", "dark:border-slate-700");
        t.classList.add("text-slate-600", "dark:text-slate-400");
      });
      tab.classList.add("active", "bg-white", "dark:bg-slate-900", "text-amber-600", "dark:text-amber-400", "shadow-sm", "border", "border-slate-200/80", "dark:border-slate-700");
      tab.classList.remove("text-slate-600", "dark:text-slate-400");
    }
    const step1Badge = document.getElementById("step1Badge");
    if (step1Badge) step1Badge.textContent = `✓ ${paperVal} Active`;
  }

  if (marksVal) {
    state.marks = parseInt(marksVal, 10);
    const mBtn = document.querySelector(`.marks-btn[data-marks="${marksVal}"]`);
    if (mBtn && typeof marksBtns !== "undefined") {
      marksBtns.forEach(b => {
        b.classList.remove("active", "border-amber-500", "bg-amber-500/10", "text-amber-600", "dark:text-amber-400", "shadow-sm");
        b.classList.add("border-slate-200", "dark:border-slate-700", "bg-slate-50", "dark:bg-slate-800/60", "text-slate-700", "dark:text-slate-300");
      });
      mBtn.classList.add("active", "border-amber-500", "bg-amber-500/10", "text-amber-600", "dark:text-amber-400", "shadow-sm");
      mBtn.classList.remove("border-slate-200", "dark:border-slate-700", "bg-slate-50", "dark:bg-slate-800/60", "text-slate-700", "dark:text-slate-300");
    }
    const step2Badge = document.getElementById("step2Badge");
    if (step2Badge) step2Badge.textContent = `✓ ${state.marks} Marks`;
  }

  if (typeof updateStepProgression === "function") {
    updateStepProgression();
  }
};

// Question Mode Selector (Step 2.5: Auto-Detect, Daily Target, or Type Question)
const qModeAutoBtn = document.getElementById("qModeAutoBtn");
const qModeDailyBtn = document.getElementById("qModeDailyBtn");
const qModeCustomBtn = document.getElementById("qModeCustomBtn");
const questionModeBadge = document.getElementById("questionModeBadge");
const autoDetectNotice = document.getElementById("autoDetectNotice");
const dailyTargetNotice = document.getElementById("dailyTargetNotice");
const activeDailyTargetPreview = document.getElementById("activeDailyTargetPreview");
const customQuestionContainer = document.getElementById("customQuestionContainer");
const customQuestionInput = document.getElementById("customQuestionInput");

function setQuestionMode(mode) {
  state.questionMode = mode;
  const allQBtns = [qModeAutoBtn, qModeDailyBtn, qModeCustomBtn].filter(Boolean);
  allQBtns.forEach(b => {
    b.classList.remove("active", "border-amber-500", "bg-amber-500/10", "text-amber-700", "dark:text-amber-400");
    b.classList.add("border-slate-200", "dark:border-slate-700", "bg-slate-50", "dark:bg-slate-800/60", "text-slate-700", "dark:text-slate-300");
  });

  if (autoDetectNotice) autoDetectNotice.classList.add("hidden");
  if (dailyTargetNotice) dailyTargetNotice.classList.add("hidden");
  if (customQuestionContainer) customQuestionContainer.classList.add("hidden");

  if (mode === "auto") {
    if (qModeAutoBtn) {
      qModeAutoBtn.classList.add("active", "border-amber-500", "bg-amber-500/10", "text-amber-700", "dark:text-amber-400");
      qModeAutoBtn.classList.remove("border-slate-200", "dark:border-slate-700", "bg-slate-50", "dark:bg-slate-800/60", "text-slate-700", "dark:text-slate-300");
    }
    if (questionModeBadge) questionModeBadge.textContent = "✓ Auto-Detect from Booklet";
    if (autoDetectNotice) autoDetectNotice.classList.remove("hidden");
  } else if (mode === "daily") {
    if (qModeDailyBtn) {
      qModeDailyBtn.classList.add("active", "border-amber-500", "bg-amber-500/10", "text-amber-700", "dark:text-amber-400");
      qModeDailyBtn.classList.remove("border-slate-200", "dark:border-slate-700", "bg-slate-50", "dark:bg-slate-800/60", "text-slate-700", "dark:text-slate-300");
    }
    if (questionModeBadge) questionModeBadge.textContent = "✓ Today's Daily Target";
    if (dailyTargetNotice) dailyTargetNotice.classList.remove("hidden");
    const qText = (state.dailyQuestion && state.dailyQuestion.question) || (document.getElementById("dawQuestionText") ? document.getElementById("dawQuestionText").textContent.trim() : "");
    if (activeDailyTargetPreview) activeDailyTargetPreview.textContent = qText || "Today's Live Editorial Question";
  } else if (mode === "custom") {
    if (qModeCustomBtn) {
      qModeCustomBtn.classList.add("active", "border-amber-500", "bg-amber-500/10", "text-amber-700", "dark:text-amber-400");
      qModeCustomBtn.classList.remove("border-slate-200", "dark:border-slate-700", "bg-slate-50", "dark:bg-slate-800/60", "text-slate-700", "dark:text-slate-300");
    }
    if (questionModeBadge) questionModeBadge.textContent = "✓ Custom Typed Question";
    if (customQuestionContainer) customQuestionContainer.classList.remove("hidden");
    if (customQuestionInput) customQuestionInput.focus();
  }
}
window.setQuestionMode = setQuestionMode;

if (qModeAutoBtn) qModeAutoBtn.addEventListener("click", () => setQuestionMode("auto"));
if (qModeDailyBtn) qModeDailyBtn.addEventListener("click", () => setQuestionMode("daily"));
if (qModeCustomBtn) qModeCustomBtn.addEventListener("click", () => setQuestionMode("custom"));

// Live Directive Detection
let directiveDebounce = null;
questionInput.addEventListener("input", () => {
  state.question = questionInput.value;
  clearTimeout(directiveDebounce);
  directiveDebounce = setTimeout(detectDirectiveFromInput, 300);
});

function detectDirectiveFromInput() {
  const text = (questionInput.value || "").toLowerCase();
  const directives = [
    { key: "critically examine", label: "Critically Examine", tip: "Probe both achievements and systemic lacunae; conclude with balanced synthesis." },
    { key: "critically analyse", label: "Critically Analyse", tip: "Balanced dialectic required (Thesis, Anti-thesis, Synthesis)." },
    { key: "elucidate", label: "Elucidate", tip: "Explain clearly with real-world examples, cases, and empirical data." },
    { key: "discuss", label: "Discuss", tip: "Explore multiple dimensions (PESTLE framework) systematically." },
    { key: "evaluate", label: "Evaluate", tip: "Weigh outcomes against objectives; provide a clear verdict." },
    { key: "examine", label: "Examine", tip: "Investigate underlying causes and provide structural remedies." },
    { key: "comment", label: "Comment", tip: "Express reasoned perspective backed by constitutional principles." },
    { key: "elaborate and assess", label: "Elaborate & Assess", tip: "Explicate core theoretical doctrines then rigorously assess modern applicability." }
  ];

  let found = null;
  for (const d of directives) {
    if (text.includes(d.key)) {
      found = d;
      break;
    }
  }

  if (found) {
    detectedDirectiveBadge.textContent = `Directive: ${found.label}`;
    detectedDirectiveBadge.className = "text-[11px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold";
    directiveGuidance.textContent = `Target: ${found.tip}`;
  } else {
    detectedDirectiveBadge.textContent = "Directive: General / Discuss";
    detectedDirectiveBadge.className = "text-[11px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700 font-medium";
    directiveGuidance.textContent = "Explore multiple dimensions (PESTLE framework) with clear headings.";
  }
}

// Fetch Preloaded Samples from Backend
async function loadSamplesList() {
  try {
    const res = await fetch("/api/samples");
    if (res.ok) {
      state.samples = await res.json();
    }
  } catch (err) {
    console.error("Failed to fetch samples:", err);
  }
}

// Quick Sample Buttons in UI
const quickSampleBtn = document.getElementById("quickSampleBtn");
if (quickSampleBtn) {
  quickSampleBtn.addEventListener("click", () => {
    if (state.samples && state.samples.length > 0) loadSample(state.samples[0]);
  });
}

const loadSample1Btn = document.getElementById("loadSample1Btn");
if (loadSample1Btn) {
  loadSample1Btn.addEventListener("click", () => {
    if (state.samples && state.samples.length > 0) loadSample(state.samples[0]);
  });
}

const loadSample2Btn = document.getElementById("loadSample2Btn");
if (loadSample2Btn) {
  loadSample2Btn.addEventListener("click", () => {
    if (state.samples && state.samples.length > 1) loadSample(state.samples[1]);
  });
}

const loadSample3Btn = document.getElementById("loadSample3Btn");
if (loadSample3Btn) {
  loadSample3Btn.addEventListener("click", () => {
    if (state.samples && state.samples.length > 2) loadSample(state.samples[2]);
  });
}

const loadSample4Btn = document.getElementById("loadSample4Btn");
if (loadSample4Btn) {
  loadSample4Btn.addEventListener("click", () => {
    if (state.samples && state.samples.length > 3) loadSample(state.samples[3]);
  });
}

function loadSample(sample) {
  state.activeSampleId = sample.id;
  state.uploadedFiles = [];
  state.question = sample.question;
  questionInput.value = sample.question;
  state.paper = sample.paper;
  state.marks = sample.marks;

  // Sync paper tabs (Step 1)
  paperTabs.forEach(t => {
    const p = t.getAttribute("data-paper");
    if (p === sample.paper || (sample.paper.startsWith("Optional") && p === "Optional")) {
      t.click();
    }
  });

  if (sample.paper.startsWith("Optional") && optionalSubjectSelect) {
    optionalSubjectSelect.value = sample.paper;
    state.paper = sample.paper;
  }

  // Sync marks buttons (Step 2: 10, 15, or 20)
  marksBtns.forEach(b => {
    if (parseInt(b.getAttribute("data-marks"), 10) === sample.marks) {
      b.click();
    }
  });

  updateStepProgression();
  detectDirectiveFromInput();

  // Load pages into viewer
  state.activePages = sample.pages;
  state.currentPageIndex = 0;
  updateViewer();
  renderPreviewStrip();

  // Pre-render evaluation automatically for instant demo experience
  renderEvaluation(sample.precomputed_evaluation);
  window.switchStudioState("studio");
  window.switchStudioState("studio");
}


// File Upload, Client-side Compression & Drag-and-Drop Handling
const pdfFileInput = document.getElementById("pdfFileInput");
const galleryFileInput = document.getElementById("galleryFileInput");
const cameraFileInput = document.getElementById("cameraFileInput");
const btnUploadPdf = document.getElementById("btnUploadPdf");
const btnUploadGallery = document.getElementById("btnUploadGallery");
const btnUploadCamera = document.getElementById("btnUploadCamera");

// Fast client-side image compression to prevent mobile timeout and Cloudflare 502/504 errors
async function compressImageIfNeeded(file) {
  if (!file || !file.type || !file.type.startsWith("image/")) {
    return file;
  }
  try {
    return await new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const maxDim = 1800;
          let w = img.width;
          let h = img.height;
          if (w <= maxDim && h <= maxDim && file.size < 1.2 * 1024 * 1024) {
            resolve(file);
            return;
          }
          if (w > h) {
            if (w > maxDim) {
              h = Math.round((h * maxDim) / w);
              w = maxDim;
            }
          } else {
            if (h > maxDim) {
              w = Math.round((w * maxDim) / h);
              h = maxDim;
            }
          }
          const canvas = document.createElement("canvas");
          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, w, h);
          canvas.toBlob(
            (blob) => {
              if (blob && blob.size < file.size) {
                const compressedFile = new File(
                  [blob],
                  file.name.replace(/\.[^/.]+$/, "") + ".jpg",
                  { type: "image/jpeg" }
                );
                resolve(compressedFile);
              } else {
                resolve(file);
              }
            },
            "image/jpeg",
            0.82
          );
        };
        img.onerror = () => resolve(file);
        img.src = e.target.result;
      };
      reader.onerror = () => resolve(file);
      reader.readAsDataURL(file);
    });
  } catch (err) {
    console.warn("Client compression fallback:", err);
    return file;
  }
}

// Answersheet Locking Controller: locks dropzone and question inputs once staged
window.setAnswersheetLockedState = function setAnswersheetLockedState(isLocked, fileName = "", pageCount = 1) {
  state.isControlsLocked = isLocked;
  const dropzoneDefaultContent = document.getElementById("dropzoneDefaultContent");
  const stagedAnswersheetCard = document.getElementById("stagedAnswersheetCard");
  const stagedFileName = document.getElementById("stagedFileName");
  const stagedPageCount = document.getElementById("stagedPageCount");
  const questionLockedBanner = document.getElementById("questionLockedBanner");
  const customQuestionInput = document.getElementById("customQuestionInput");
  const qModeBtns = document.querySelectorAll(".qmode-btn");
  const mBtns = document.querySelectorAll(".marks-btn");
  const pTabs = document.querySelectorAll(".paper-tab");

  if (isLocked) {
    if (dropzoneDefaultContent) dropzoneDefaultContent.classList.add("hidden");
    if (stagedAnswersheetCard) stagedAnswersheetCard.classList.remove("hidden");
    if (stagedFileName) stagedFileName.textContent = fileName || "answer_copy.pdf";
    if (stagedPageCount) stagedPageCount.textContent = `✓ ${pageCount} Page${pageCount > 1 ? 's' : ''} Staged • Inputs Locked for Evaluation`;
    if (questionLockedBanner) questionLockedBanner.classList.remove("hidden");
    if (dropzone) {
      dropzone.classList.remove("cursor-pointer");
      dropzone.classList.add("cursor-default");
    }

    // Disable question selection & inputs until Cancel is clicked
    qModeBtns.forEach(btn => btn.classList.add("opacity-50", "pointer-events-none"));
    mBtns.forEach(btn => btn.classList.add("opacity-50", "pointer-events-none"));
    pTabs.forEach(tab => tab.classList.add("opacity-50", "pointer-events-none"));
    if (customQuestionInput) customQuestionInput.disabled = true;
  } else {
    if (dropzoneDefaultContent) dropzoneDefaultContent.classList.remove("hidden");
    if (stagedAnswersheetCard) stagedAnswersheetCard.classList.add("hidden");
    const fileSelectedBadge = document.getElementById("fileSelectedBadge");
    if (fileSelectedBadge) fileSelectedBadge.classList.add("hidden");
    if (questionLockedBanner) questionLockedBanner.classList.add("hidden");
    if (dropzone) {
      dropzone.classList.remove("cursor-default");
      dropzone.classList.add("cursor-pointer");
    }

    // Re-enable question selection & inputs
    qModeBtns.forEach(btn => btn.classList.remove("opacity-50", "pointer-events-none"));
    mBtns.forEach(btn => btn.classList.remove("opacity-50", "pointer-events-none"));
    pTabs.forEach(tab => tab.classList.remove("opacity-50", "pointer-events-none"));
    if (customQuestionInput) customQuestionInput.disabled = false;
  }
  if (window.lucide) lucide.createIcons();
}

// User-triggered Cancel Upload
window.cancelUploadedAnswersheet = function() {
  state.uploadedFiles = [];
  state.activePages = [];
  state.currentPageIndex = 0;
  state.currentEvaluation = null;
  if (previewStrip) {
    previewStrip.innerHTML = "";
    previewStrip.classList.add("hidden");
  }
  if (fileInput) fileInput.value = "";
  if (pdfFileInput) pdfFileInput.value = "";
  if (galleryFileInput) galleryFileInput.value = "";
  if (cameraFileInput) cameraFileInput.value = "";

  setAnswersheetLockedState(false);
  updateViewer();

  if (typeof window.showAppToast === 'function') {
    window.showAppToast("Answersheet removed. Upload & question unlocked.");
  }
};

// 1. Files / PDF button
if (btnUploadPdf && pdfFileInput) {
  btnUploadPdf.addEventListener("click", (e) => {
    e.stopPropagation();
    if (state.uploadedFiles && state.uploadedFiles.length > 0) return;
    pdfFileInput.value = "";
    pdfFileInput.click();
  });
}

// 2. Gallery button (Photos without camera capture)
if (btnUploadGallery && galleryFileInput) {
  btnUploadGallery.addEventListener("click", (e) => {
    e.stopPropagation();
    if (state.uploadedFiles && state.uploadedFiles.length > 0) return;
    galleryFileInput.value = "";
    galleryFileInput.click();
  });
}

// 3. Camera button (Live camera capture)
if (btnUploadCamera && cameraFileInput) {
  btnUploadCamera.addEventListener("click", (e) => {
    e.stopPropagation();
    if (state.uploadedFiles && state.uploadedFiles.length > 0) return;
    cameraFileInput.value = "";
    cameraFileInput.click();
  });
}

// File input change handlers
if (pdfFileInput) {
  pdfFileInput.addEventListener("change", () => {
    if (pdfFileInput.files && pdfFileInput.files.length > 0) {
      handleFiles(pdfFileInput.files);
    }
  });
}

if (galleryFileInput) {
  galleryFileInput.addEventListener("change", () => {
    if (galleryFileInput.files && galleryFileInput.files.length > 0) {
      handleFiles(galleryFileInput.files);
    }
  });
}

if (cameraFileInput) {
  cameraFileInput.addEventListener("change", () => {
    if (cameraFileInput.files && cameraFileInput.files.length > 0) {
      handleFiles(cameraFileInput.files);
    }
  });
}

// General file input
if (fileInput) {
  fileInput.addEventListener("click", () => {
    fileInput.value = "";
  });
  fileInput.addEventListener("change", () => {
    if (fileInput.files && fileInput.files.length > 0) {
      handleFiles(fileInput.files);
    }
  });
}

// Dropzone click & drag-and-drop
if (dropzone) {
  dropzone.addEventListener("click", (e) => {
    // If already locked, ignore clicks on dropzone
    if (state.uploadedFiles && state.uploadedFiles.length > 0) {
      return;
    }
    if (e.target.closest("#uploadButtonsGroup") || e.target.closest("button")) {
      return;
    }
    if (fileInput) {
      fileInput.value = "";
      fileInput.click();
    }
  });

  dropzone.addEventListener("dragover", (e) => {
    e.preventDefault();
    if (state.uploadedFiles && state.uploadedFiles.length > 0) return;
    dropzone.classList.add("border-amber-500", "bg-amber-500/10");
  });

  dropzone.addEventListener("dragleave", (e) => {
    e.preventDefault();
    dropzone.classList.remove("border-amber-500", "bg-amber-500/10");
  });

  dropzone.addEventListener("drop", (e) => {
    e.preventDefault();
    dropzone.classList.remove("border-amber-500", "bg-amber-500/10");
    if (state.uploadedFiles && state.uploadedFiles.length > 0) return;
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  });
}

async function handleFiles(files) {
  if (!files || files.length === 0) return;
  state.activeSampleId = null; // User is uploading their own
  
  // Show immediate loading status
  previewStrip.innerHTML = `
    <div class="col-span-3 py-3 px-3 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center space-x-2 text-amber-300 text-xs font-semibold animate-pulse">
      <i data-lucide="loader-2" class="w-4 h-4 animate-spin text-amber-400"></i>
      <span>Optimizing &amp; rendering pages...</span>
    </div>
  `;
  previewStrip.classList.remove("hidden");
  if (window.lucide) lucide.createIcons();

  // Compress images in parallel before saving & uploading
  const rawList = Array.from(files);
  const processedList = await Promise.all(rawList.map(f => compressImageIfNeeded(f)));

  state.uploadedFiles = processedList;
  state.activePages = [];
  state.currentPageIndex = 0;
  state.currentEvaluation = null;
  if (annotationsLayer) annotationsLayer.innerHTML = "";

  const firstFile = state.uploadedFiles[0];
  const sizeMB = (firstFile.size / (1024 * 1024)).toFixed(2);
  const extra = state.uploadedFiles.length > 1 ? ` (+${state.uploadedFiles.length - 1} more)` : "";
  const displayFileName = `${firstFile.name} (${sizeMB} MB)${extra}`;

  // Instant server-side rendering for PDFs & image optimization
  const fd = new FormData();
  for (const f of state.uploadedFiles) {
    fd.append("files", f);
  }

  let serverRendered = false;
  try {
    const res = await fetch("/api/render-preview", {
      method: "POST",
      body: fd
    });
    if (res.ok) {
      const data = await res.json();
      if (data.pages && data.pages.length > 0) {
        state.activePages = data.pages;
        state.currentPageIndex = 0;
        updateViewer();
        renderPreviewStrip();
        serverRendered = true;
      }
    }
  } catch (err) {
    console.warn("Backend render-preview error, falling back to local FileReader:", err);
  }

  if (!serverRendered) {
    fallbackClientFileRead(state.uploadedFiles);
  }

  // Lock dropzone and question section now that copy is staged
  setAnswersheetLockedState(true, displayFileName, state.uploadedFiles.length);
}

function renderPreviewStrip() {
  previewStrip.innerHTML = "";
  if (!state.activePages || state.activePages.length === 0) {
    previewStrip.classList.add("hidden");
    return;
  }
  previewStrip.classList.remove("hidden");

  state.activePages.forEach((dataUrl, index) => {
    const thumb = document.createElement("div");
    const isActive = index === state.currentPageIndex;
    thumb.className = `relative rounded-lg overflow-hidden border ${isActive ? 'border-amber-400 ring-2 ring-amber-400/40' : 'border-slate-700'} bg-slate-950 aspect-[3/4] cursor-pointer hover:border-amber-400 transition`;
    thumb.innerHTML = `
      <img src="${dataUrl}" class="w-full h-full object-cover">
      <span class="absolute bottom-1 right-1 text-[9px] bg-slate-900/90 px-1.5 py-0.5 rounded text-white font-medium">p.${index + 1}</span>
    `;
    thumb.onclick = () => {
      state.currentPageIndex = index;
      updateViewer();
      renderPreviewStrip();
    };
    previewStrip.appendChild(thumb);
  });
}

function fallbackClientFileRead(files) {
  previewStrip.innerHTML = "";
  let loadedCount = 0;
  const imageFiles = files.filter(f => f.type.startsWith("image/"));

  if (imageFiles.length === 0) {
    files.forEach((file) => {
      const thumb = document.createElement("div");
      thumb.className = "flex flex-col items-center justify-center p-2 rounded-lg border border-slate-700 bg-slate-950 aspect-[3/4]";
      thumb.innerHTML = `
        <i data-lucide="file-text" class="w-6 h-6 text-amber-400 mb-1"></i>
        <span class="text-[10px] text-slate-300 text-center truncate max-w-full">${file.name}</span>
      `;
      previewStrip.appendChild(thumb);
    });
    if (window.lucide) lucide.createIcons();
    return;
  }

  imageFiles.forEach((file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      state.activePages.push(e.target.result);
      loadedCount++;
      if (state.activePages.length === 1) {
        state.currentPageIndex = 0;
        updateViewer();
      }
      if (loadedCount === imageFiles.length) {
        renderPreviewStrip();
      }
    };
    reader.readAsDataURL(file);
  });
}

// Viewer Page Navigation
// Viewer Page Navigation (Clean single-page fit mode)
function updateViewer() {
  const imageWrapper = document.getElementById("pageImageWrapper");
  const marginContainer = document.getElementById("marginAnnotationsContainer");
  if (state.activePages && state.activePages.length > 0) {
    if (viewerEmptyPrompt) viewerEmptyPrompt.classList.add("hidden");
    if (imageWrapper) imageWrapper.classList.remove("hidden");
    if (marginContainer) marginContainer.classList.remove("min-h-[380px]");
    activePageImage.classList.remove("hidden");
    activePageImage.src = state.activePages[state.currentPageIndex];
    pageIndicator.textContent = `Page ${state.currentPageIndex + 1} of ${state.activePages.length}`;
    prevPageBtn.disabled = state.currentPageIndex === 0;
    nextPageBtn.disabled = state.currentPageIndex === state.activePages.length - 1;
    renderAnnotationsOverlay();
  } else {
    if (viewerEmptyPrompt) viewerEmptyPrompt.classList.remove("hidden");
    if (imageWrapper) imageWrapper.classList.add("hidden");
    if (marginContainer) {
      marginContainer.classList.add("min-h-[380px]");
      marginContainer.innerHTML = '<div class="text-[10px] text-slate-500 italic text-center py-8 px-2">Evaluation remarks will appear in this margin</div>';
    }
    activePageImage.classList.add("hidden");
    activePageImage.src = "";
    annotationsLayer.innerHTML = "";
    const guideLayer = document.getElementById("annotationsGuideLayer");
    if (guideLayer) guideLayer.innerHTML = "";
    pageIndicator.textContent = "No page";
    prevPageBtn.disabled = true;
    nextPageBtn.disabled = true;
  }
}

activePageImage.addEventListener("load", () => {
  renderAnnotationsOverlay();
});

prevPageBtn.addEventListener("click", () => {
  if (state.currentPageIndex > 0) {
    state.currentPageIndex--;
    updateViewer();
    renderPreviewStrip();
  }
});

nextPageBtn.addEventListener("click", () => {
  if (state.currentPageIndex < state.activePages.length - 1) {
    state.currentPageIndex++;
    updateViewer();
    renderPreviewStrip();
  }
});

// Navigate and highlight evaluation sections in right panel
window.viewFullEvaluationSection = function(sectionKey) {
  if (typeof window.switchStudioTab === "function") {
    window.switchStudioTab("audit");
  }

  let targetId = "introSection";
  const key = String(sectionKey || "").toLowerCase();

  if (key.includes("intro") || key.includes("definition") || key.includes("premise")) {
    targetId = "introSection";
  } else if (key.includes("conc") || key.includes("way") || key.includes("forward") || key.includes("ending") || key.includes("synthesis")) {
    targetId = "conclusionSection";
  } else if (key.includes("value") || key.includes("data") || key.includes("multiplier")) {
    targetId = "valueAddSection";
  } else {
    targetId = "bodySection";
  }

  const targetEl = document.getElementById(targetId);
  if (targetEl) {
    targetEl.classList.remove("hidden");
    const parentBox = targetEl.closest(".rounded-xl") || targetEl;
    parentBox.scrollIntoView({ behavior: "smooth", block: "center" });
    parentBox.classList.add("ring-2", "ring-amber-500", "dark:ring-amber-400", "ring-offset-2", "transition-all", "duration-300");
    setTimeout(() => {
      parentBox.classList.remove("ring-2", "ring-amber-500", "dark:ring-amber-400", "ring-offset-2");
    }, 2000);
  }
};

// Safe view mode compatibility stub
window.setStudioViewMode = function() {
  updateViewer();
};

// Focus Mode: Expand Uploaded Copies to 100% width or return to split studio
window.toggleStudioFocus = function() {
  const isFocus = document.body.classList.toggle("studio-copies-focus");
  const label = document.getElementById("studioFocusLabel");
  const icon = document.getElementById("studioFocusIcon");
  if (label) {
    label.textContent = isFocus ? "Split Studio" : "Copies Only";
  }
  if (icon && window.lucide) {
    icon.setAttribute("data-lucide", isFocus ? "minimize-2" : "maximize-2");
    lucide.createIcons();
  }
};

function escapeHtml(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function findGlossaryMatch(word) {
  if (!state.glossaryMap || !word) return null;
  const cleanWord = word.replace(/[*_#`]/g, '').trim().toLowerCase();
  if (!cleanWord) return null;
  if (state.glossaryMap[cleanWord]) {
    return { term: word.trim(), meaning: state.glossaryMap[cleanWord] };
  }
  for (const [k, v] of Object.entries(state.glossaryMap)) {
    if (k.length > 3 && (cleanWord.includes(k) || k.includes(cleanWord))) {
      return { term: k, meaning: v };
    }
  }
  return null;
}

function formatHighlightedText(text) {
  if (!text) return "";
  let s = String(text);
  // Highlight markdown bold **word** with prominent high-contrast chip and instant inline jargon tooltip if in glossary
  s = s.replace(/\*\*(.*?)\*\*/g, (match, p1) => {
    const gMatch = findGlossaryMatch(p1);
    if (gMatch) {
      return `<span class="jargon-inline-badge highlight-text-chip font-bold px-1.5 py-0.5 rounded cursor-help" tabindex="0" title="Click or hover to decode meaning">${p1}<span class="glossary-star">*</span><span class="jargon-bubble"><strong>${escapeHtml(gMatch.term)}</strong>: ${escapeHtml(gMatch.meaning)}</span></span>`;
    }
    return `<span class="highlight-text-chip font-bold px-1.5 py-0.5 rounded">${p1}</span>`;
  });
  // Format linebreaks
  s = s.replace(/\n/g, '<br>');
  return s;
}

// Render Red-Pen Teacher Annotations into Dedicated Margin Track (Zero Overlap on Answer Text)
// Render Examiner Margin Annotations (Matching Image 5: Crisp, Structured, Zero-Overlap)
function renderAnnotationsOverlay() {
  const marginContainer = document.getElementById("marginAnnotationsContainer");
  const guideLayer = document.getElementById("annotationsGuideLayer");

  if (marginContainer) marginContainer.innerHTML = "";
  if (guideLayer) guideLayer.innerHTML = "";

  const currentPg = (state.currentPageIndex || 0) + 1;
  const totalPages = (state.activePages && state.activePages.length) ? state.activePages.length : 1;

  // Determine active evaluation based on active copy mode
  const activeEval = (state.activeCopyMode === 'original' && state.originalEvaluation)
    ? state.originalEvaluation
    : (state.currentEvaluation || state.rewrittenEvaluation || state.originalEvaluation);

  if (!activeEval) {
    if (marginContainer) {
      marginContainer.innerHTML = '<div class="text-[10px] text-slate-400 italic text-center py-8 px-2">Evaluation remarks will appear in this margin</div>';
    }
    return;
  }

  // Clear previous cards and guides
  if (marginContainer) marginContainer.innerHTML = "";
  if (guideLayer) guideLayer.innerHTML = "";

  // Helper to format clean crisp bullet points from raw text
  function parseBullets(text, limit = 2) {
    if (!text) return "";
    const cleanText = String(text).trim();
    const rawLines = cleanText.split(/\n+/).map(l => l.trim()).filter(Boolean);
    let bullets = (rawLines.length > 1) ? rawLines : cleanText.split(/(?<=[.?!])\s+/).map(s => s.trim()).filter(Boolean);
    if (bullets.length === 0) bullets = [cleanText];
    bullets = bullets.slice(0, limit);

    return bullets.map(b => {
      let prefix = `<span class="text-amber-500 font-bold shrink-0">•</span>`;
      let cleanB = b;
      if (cleanB.startsWith("✓") || cleanB.startsWith("✔")) {
        prefix = `<span class="text-emerald-600 dark:text-emerald-400 font-bold shrink-0">✓</span>`;
        cleanB = cleanB.replace(/^[✓✔]\s*/, "");
      } else if (cleanB.startsWith("✎") || cleanB.startsWith("✗") || cleanB.startsWith("×")) {
        prefix = `<span class="text-amber-600 dark:text-amber-400 font-bold shrink-0">✎</span>`;
        cleanB = cleanB.replace(/^[✎✗×]\s*/, "");
      }
      return `
        <div class="flex items-start space-x-1.5 text-slate-800 dark:text-slate-200 leading-snug break-words">
          ${prefix}
          <div class="flex-1 break-words">${formatHighlightedText(cleanB)}</div>
        </div>
      `;
    }).join("");
  }

  // Filter raw annotations for current page
  const rawAnns = (activeEval.visual_annotations || []).filter(a => (a.page || 1) === currentPg);

  // Define section layout matching authentic UPSC answer pages
  const sections = [];

  if (totalPages === 1) {
    // SINGLE-PAGE ANSWER COPY: Perfectly Bracket Intro, Body, and Conclusion
    const rawIntro = rawAnns.find(a => {
      const t = String(a.tag || "").toLowerCase();
      return t.includes("intro") || t.includes("premise") || t.includes("definition") || (a.approx_y_percent && a.approx_y_percent <= 36);
    });
    const defaultIntroText = "✓ **Good Premise**: Clearly defined constitutional supremacy and core premise.\n✎ **Contextual Hook**: Integrate relevant constitutional article or background.";
    const introBody = rawIntro ? parseBullets(rawIntro.remark, 2) : parseBullets(defaultIntroText, 2);
    const introMarks = rawIntro ? (rawIntro.marks_awarded || "+1.5 / 2.5") : "+1.5 / 2.5";

    sections.push({
      zone: "intro",
      title: "INTRO",
      icon: "✓",
      isTick: true,
      startYPercent: 16,
      endYPercent: 36,
      marks: introMarks,
      bodyHtml: introBody,
      targetKey: "intro"
    });

    const rawBody = rawAnns.find(a => {
      const t = String(a.tag || "").toLowerCase();
      return !t.includes("intro") && !t.includes("premise") && !t.includes("definition") && !t.includes("conclusion") && !t.includes("synthesis");
    });
    const defaultBodyText = "✓ **Core Multi-Dimensional Analysis**: Solid multidimensional arguments presented.\n✎ **Substantiation**: Anchor arguments with empirical data points or committee reports.";
    const bodyText = rawBody ? parseBullets(rawBody.remark, 2) : parseBullets(defaultBodyText, 2);
    const bodyMarks = rawBody ? (rawBody.marks_awarded || "+2.5 / 5.0") : "+2.5 / 5.0";

    sections.push({
      zone: "body",
      title: rawBody && rawBody.tag ? rawBody.tag.toUpperCase() : "BODY: CORE DEMAND",
      icon: "✓",
      isTick: true,
      startYPercent: 38,
      endYPercent: 76,
      marks: bodyMarks,
      bodyHtml: bodyText,
      targetKey: "body"
    });

    const rawConc = rawAnns.find(a => {
      const t = String(a.tag || "").toLowerCase();
      return t.includes("conclusion") || t.includes("synthesis") || t.includes("finish") || t.includes("way forward") || (a.approx_y_percent && a.approx_y_percent >= 70);
    });
    const concDefault = "✓ **Balanced Synthesis**: Crisp forward-looking conclusion aligning with constitutional vision.\n✎ **Enrichment**: Anchor with sustainable governance roadmap.";
    const concText = rawConc ? parseBullets(rawConc.remark, 2) : parseBullets(concDefault, 2);
    const concMarks = rawConc ? (rawConc.marks_awarded || "+1.0 / 2.5") : "+1.0 / 2.5";

    sections.push({
      zone: "conclusion",
      title: "CONCLUSION",
      icon: "✓",
      isTick: true,
      startYPercent: 78,
      endYPercent: 95,
      marks: concMarks,
      bodyHtml: concText,
      targetKey: "conclusion"
    });
  } else if (currentPg === 1) {
    // MULTI-PAGE COPY: PAGE 1: Introduction (lines 1-4) & Body Dimension 1
    const rawIntro = rawAnns.find(a => {
      const t = String(a.tag || "").toLowerCase();
      return t.includes("intro") || t.includes("premise") || t.includes("definition") || (a.approx_y_percent && a.approx_y_percent <= 36);
    });
    const defaultIntroText = "✓ **Good Premise**: Clearly defined constitutional supremacy.\n✎ **Missing**: Contextual hook with Article 13.";
    const introBody = rawIntro ? parseBullets(rawIntro.remark, 2) : parseBullets(defaultIntroText, 2);
    const introMarks = rawIntro ? (rawIntro.marks_awarded || "+1.5 / 2.5") : "+1.5 / 2.5";

    sections.push({
      zone: "intro",
      title: "INTRO",
      icon: "✓",
      isTick: true,
      startYPercent: 16,
      endYPercent: 36,
      marks: introMarks,
      bodyHtml: introBody,
      targetKey: "intro"
    });

    const rawBody = rawAnns.find(a => {
      const t = String(a.tag || "").toLowerCase();
      return !t.includes("intro") && !t.includes("premise") && !t.includes("definition");
    });
    const defaultBodyText = "✓ **Case Law Integration**: Excellent use of Maneka Gandhi and NJAC ruling.\n✎ **Structure**: Group points under clear sub-headings.";
    const bodyText = rawBody ? parseBullets(rawBody.remark, 2) : parseBullets(defaultBodyText, 2);
    const bodyMarks = rawBody ? (rawBody.marks_awarded || "+2.0 / 3.5") : "+2.0 / 3.5";

    sections.push({
      zone: "body",
      title: rawBody && rawBody.tag ? rawBody.tag.toUpperCase() : "BODY: CORE DEMAND",
      icon: "✓",
      isTick: true,
      startYPercent: 38,
      endYPercent: 94,
      marks: bodyMarks,
      bodyHtml: bodyText,
      targetKey: "body"
    });
  } else if (currentPg < totalPages) {
    // INTERMEDIATE PAGES (e.g. Page 2 of 3): Body Dimensions
    const bodyAnn1 = rawAnns[0];
    const bodyAnn2 = rawAnns.length > 1 ? rawAnns[1] : null;

    const b1Default = "✓ **Rich Precedents**: Navtej Johar & Shreya Singhal cases well cited.\n✎ **Depth**: Connect Sec 66A deletion to Art 19(1)(a).";
    sections.push({
      zone: "body",
      title: bodyAnn1 && bodyAnn1.tag ? bodyAnn1.tag.toUpperCase() : "BODY: DIMENSION 1",
      icon: "✓",
      isTick: true,
      startYPercent: 12,
      endYPercent: 54,
      marks: bodyAnn1 ? (bodyAnn1.marks_awarded || "+1.5 / 3.5") : "+1.5 / 3.5",
      bodyHtml: bodyAnn1 ? parseBullets(bodyAnn1.remark, 2) : parseBullets(b1Default, 2),
      targetKey: "body"
    });

    const b2Default = "✓ **Constitutional Morality**: Highlighted institutional trust.\n✎ **Enrichment**: Integrate 2nd ARC committee recommendations.";
    sections.push({
      zone: "body",
      title: bodyAnn2 && bodyAnn2.tag ? bodyAnn2.tag.toUpperCase() : "BODY: ENRICHMENT",
      icon: "✎",
      isTick: false,
      startYPercent: 56,
      endYPercent: 94,
      marks: bodyAnn2 ? (bodyAnn2.marks_awarded || "+1.5 / 3.0") : "+1.5 / 3.0",
      bodyHtml: bodyAnn2 ? parseBullets(bodyAnn2.remark, 2) : parseBullets(b2Default, 2),
      targetKey: "body"
    });
  } else {
    // FINAL PAGE: Body Way Forward & Conclusion
    const rawBody = rawAnns.find(a => {
      const t = String(a.tag || "").toLowerCase();
      return !t.includes("conclusion") && !t.includes("synthesis") && !t.includes("finish");
    });
    const bWayForward = "✓ **Balanced View**: Outlined executive-judiciary equilibrium.\n✎ **Substantiation**: Reference recent Supreme Court rulings.";
    sections.push({
      zone: "body",
      title: rawBody && rawBody.tag ? rawBody.tag.toUpperCase() : "BODY: WAY FORWARD",
      icon: "✓",
      isTick: true,
      startYPercent: 10,
      endYPercent: 65,
      marks: rawBody ? (rawBody.marks_awarded || "+1.5 / 3.0") : "+1.5 / 3.0",
      bodyHtml: rawBody ? parseBullets(rawBody.remark, 2) : parseBullets(bWayForward, 2),
      targetKey: "body"
    });

    const rawConc = rawAnns.find(a => {
      const t = String(a.tag || "").toLowerCase();
      return t.includes("conclusion") || t.includes("synthesis") || t.includes("finish") || (a.approx_y_percent && a.approx_y_percent >= 60);
    });
    const concDefault = "✓ **Relevant Stand**: Concluded effectively with constitutional vision.\n✎ **Tone**: Avoid informal conversational phrasing.";
    sections.push({
      zone: "conclusion",
      title: "CONCLUSION",
      icon: "✓",
      isTick: true,
      startYPercent: 67,
      endYPercent: 94,
      marks: rawConc ? (rawConc.marks_awarded || "+1.5 / 2.5") : "+1.5 / 2.5",
      bodyHtml: rawConc ? parseBullets(rawConc.remark, 2) : parseBullets(concDefault, 2),
      targetKey: "conclusion"
    });
  }

  if (marginContainer) {
    const imgEl = document.getElementById("activePageImage");
    const containerHeight = (imgEl && imgEl.clientHeight > 200) ? imgEl.clientHeight : (marginContainer.clientHeight || 750);

    // 1. Render SVG '}' Curly Braces on the Answer Copy (embracing the exact lines)
    if (guideLayer) {
      guideLayer.innerHTML = "";
      sections.forEach(sec => {
        const topY = Math.round((sec.startYPercent / 100) * containerHeight);
        const bottomY = Math.round((sec.endYPercent / 100) * containerHeight);
        const braceHeight = Math.max(26, bottomY - topY);
        const halfH = braceHeight / 2;
        sec.midY = topY + halfH;

        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute("class", "section-curly-brace");
        svg.setAttribute("viewBox", `0 0 24 ${braceHeight}`);
        svg.style.position = "absolute";
        svg.style.right = "0px";
        svg.style.top = `${topY}px`;
        svg.style.width = "22px";
        svg.style.height = `${braceHeight}px`;
        svg.style.overflow = "visible";
        svg.style.pointerEvents = "none";
        svg.style.zIndex = "25";

        const r = Math.min(8, Math.max(3, braceHeight / 10));
        const xLeft = 3;
        const xStem = 10;
        const xTip = 20;

        const pathD = `M ${xLeft} 0 Q ${xStem} 0, ${xStem} ${r} L ${xStem} ${halfH - r} Q ${xStem} ${halfH}, ${xTip} ${halfH} Q ${xStem} ${halfH}, ${xStem} ${halfH + r} L ${xStem} ${braceHeight - r} Q ${xStem} ${braceHeight}, ${xLeft} ${braceHeight}`;

        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path.setAttribute("d", pathD);
        path.setAttribute("fill", "none");
        path.setAttribute("stroke", sec.isTick ? "#10B981" : "#D97706");
        path.setAttribute("stroke-width", "2.4");
        path.setAttribute("stroke-linecap", "round");
        path.setAttribute("stroke-linejoin", "round");
        svg.appendChild(path);

        // Horizontal connecting pointer to margin track
        const bridge = document.createElementNS("http://www.w3.org/2000/svg", "line");
        bridge.setAttribute("x1", `${xTip}`);
        bridge.setAttribute("y1", `${halfH}`);
        bridge.setAttribute("x2", `${xTip + 8}`);
        bridge.setAttribute("y2", `${halfH}`);
        bridge.setAttribute("stroke", sec.isTick ? "#10B981" : "#D97706");
        bridge.setAttribute("stroke-width", "2.4");
        bridge.setAttribute("stroke-linecap", "round");
        svg.appendChild(bridge);

        guideLayer.appendChild(svg);
      });
    }

    // 2. Render Cards alongside each section's '}' tip
    sections.forEach((sec) => {
      const cardEl = document.createElement("div");
      cardEl.className = `margin-badge-card ${sec.isTick ? 'type-tick' : 'type-warning'} select-none`;
      const titleColor = sec.isTick ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400";

      cardEl.innerHTML = `
        <div class="flex items-center justify-between gap-1 mb-1.5 flex-wrap">
          <div class="flex items-center space-x-1 ${titleColor} font-bold text-[9.5px] sm:text-[10px] tracking-wide min-w-0">
            <span class="text-[11px] sm:text-xs font-black shrink-0">${sec.icon}</span>
            <span class="uppercase font-extrabold truncate max-w-[130px] sm:max-w-[150px]">${escapeHtml(sec.title)}</span>
          </div>
          <div class="margin-card-marks font-mono font-bold text-[9px] sm:text-[9.5px] px-1.5 py-0.5 rounded shrink-0 shadow-2xs whitespace-nowrap">
            ${escapeHtml(sec.marks)}
          </div>
        </div>
        <div class="margin-card-body text-[10px] sm:text-[10.5px] font-sans leading-snug space-y-1 break-words">
          ${sec.bodyHtml}
        </div>
        <div class="pt-1 border-t border-slate-200/80 dark:border-slate-800/80 mt-1">
          <a href="javascript:void(0)" onclick="window.viewFullEvaluationSection('${sec.targetKey}')" class="margin-card-link text-[8.5px] sm:text-[9px] font-bold flex items-center space-x-1 hover:underline truncate">
            <span class="truncate">View Full Evaluation in Right Section →</span>
          </a>
        </div>
      `;

      cardEl.addEventListener("click", (e) => {
        if (e.target.tagName.toLowerCase() !== "a" && !e.target.closest("a")) {
          window.viewFullEvaluationSection(sec.targetKey);
        }
      });

      sec.cardEl = cardEl;
      marginContainer.appendChild(cardEl);
    });

    // 3. Guaranteed Collision-Free Vertical Positioning
    setTimeout(() => {
      let prevBottom = 6;
      sections.forEach((sec) => {
        const cardEl = sec.cardEl;
        if (!cardEl) return;
        const cardHeight = cardEl.offsetHeight || 90;
        let targetTop = Math.round(sec.midY - 14); // Exactly aligns card pointer with brace tip!
        if (targetTop < prevBottom) {
          targetTop = prevBottom;
        }
        cardEl.style.top = `${targetTop}px`;
        prevBottom = targetTop + cardHeight + 10;
      });

      // 4. Dynamic Height Fit Guarantee: Ensure booklet container fully encloses all cards & image
      const totalMarginHeight = prevBottom + 35; // Generous bottom breathing room
      const imgHeight = (imgEl && imgEl.offsetHeight > 200) ? imgEl.offsetHeight : 700;
      const finalFitHeight = Math.max(imgHeight, totalMarginHeight);

      marginContainer.style.minHeight = `${finalFitHeight}px`;
      if (marginContainer.parentElement) {
        marginContainer.parentElement.style.minHeight = `${finalFitHeight}px`;
      }
      const tracksBody = document.getElementById("bookletTracksBody");
      if (tracksBody) tracksBody.style.minHeight = `${finalFitHeight}px`;
      const trackContainer = document.getElementById("bookletTrackContainer");
      if (trackContainer) trackContainer.style.minHeight = `${finalFitHeight}px`;
    }, 15);
  }
}

// Debounced window resize handler for adaptive orientation & device responsive re-alignment
let resizeOverlayTimer = null;
window.addEventListener("resize", () => {
  clearTimeout(resizeOverlayTimer);
  resizeOverlayTimer = setTimeout(() => {
    if (state.activePages && state.activePages.length > 0) {
      renderAnnotationsOverlay();
    }
  }, 150);
});

window.loadSampleAnswerCopy = function(sampleId) {
  let sample = null;
  if (sampleId && state.samples) {
    sample = state.samples.find(s => s.id === sampleId);
  }
  if (!sample && state.samples && state.samples.length > 0) {
    const pTab = state.selectedPaperTab || state.paper || "GS3";
    sample = state.samples.find(s => s.detected_paper === pTab || s.paper === pTab) || state.samples[0];
  }
  if (sample) {
    state.activeSampleId = sample.id;
    const samplePageList = (sample.pages && sample.pages.length > 0) ? sample.pages : (sample.sample_pages || []);
    if (samplePageList && samplePageList.length > 0) {
      state.activePages = samplePageList;
      state.originalPages = [...samplePageList];
      state.currentPageIndex = 0;
    }
    state.originalEvaluation = sample.precomputed_evaluation;
    state.currentEvaluation = sample.precomputed_evaluation;
    state.activeCopyMode = "original";
    state.rewrittenPages = [];
    state.rewrittenEvaluation = null;

    const switcher = document.getElementById("copySwitcherContainer");
    if (switcher) switcher.classList.add("hidden");

    renderEvaluation(sample.precomputed_evaluation);
    if (typeof updateViewer === "function") updateViewer();
    window.switchStudioState("studio");
  } else {
    fetch("/api/samples").then(r => r.json()).then(samples => {
      state.samples = samples;
      if (samples && samples.length > 0) {
        window.loadSampleAnswerCopy(sampleId);
      }
    }).catch(err => {
      console.warn("Could not load samples:", err);
      flashStep("step3Wrapper", "⚠ Please drop or upload an answer copy PDF/JPG");
    });
  }
};

// Execute Evaluation
window.runEvaluation = async function(allowAutoAligned = false) {
  let question = "";
  if (state.questionMode === "daily") {
    question = (state.dailyQuestion && state.dailyQuestion.question) || (document.getElementById("dawQuestionText") ? document.getElementById("dawQuestionText").textContent.trim() : "");
  } else if (state.questionMode === "custom") {
    const customInput = document.getElementById("customQuestionInput");
    question = customInput ? customInput.value.trim() : "";
  }
  if (!question) {
    question = "Extract question printed on booklet header";
  }

  // If no files uploaded, auto-load topper sample answer copy and open the Evaluation Studio
  if (state.uploadedFiles.length === 0) {
    window.loadSampleAnswerCopy();
    return;
  }

  // Check if we are running the preloaded sample without upload
  if (state.activeSampleId && state.uploadedFiles.length === 0) {
    const sample = state.samples.find(s => s.id === state.activeSampleId);
    if (sample) {
      if (state.isRewriteMode && state.previousEvaluation) {
        const upgraded = JSON.parse(JSON.stringify(sample.precomputed_evaluation));
        const maxM = upgraded.max_marks || (state.marks || 10);
        upgraded.overall_score = Math.min(maxM, Math.round(((upgraded.overall_score || 4.5) + 1.5) * 2) / 2);
        upgraded.is_rewrite = true;
        upgraded.previous_evaluation = state.previousEvaluation;
        if (upgraded.rubric_scores) {
          upgraded.rubric_scores.core_demand_score = Math.round(((upgraded.rubric_scores.core_demand_score || 2.0) + 1.0) * 2) / 2;
          upgraded.rubric_scores.value_add_score = Math.round(((upgraded.rubric_scores.value_add_score || 0.5) + 0.5) * 2) / 2;
        }
        renderEvaluation(upgraded);
        window.cancelRewriteMode();
        return;
      }
      renderEvaluation(sample.precomputed_evaluation);
      window.switchStudioState("studio");
      return;
    }
  }

  // If neither local key nor server key is available
  if (!state.apiKey && !state.serverHasKey) {
    keyModal.classList.remove("hidden");
    keyModal.classList.add("flex");
    alert("Please set a Master Gemini API Key in Admin Settings to enable live evaluation for students, or click 'Try with Topper Sample Copy' for the demo.");
    return;
  }

  if (!state.selectedPaperTab) {
    flashStep("step1Wrapper", "⚠ Select Subject First!");
    alert("Please complete Step 1: Select Paper / Subject first.");
    return;
  }

  if (!state.marks && state.selectedPaperTab !== "Essay") {
    flashStep("step2Wrapper", "⚠ Select Marks First!");
    alert("Please complete Step 2: Select Marks Weightage (10, 15, or 20 Marks) first.");
    return;
  }

  // Lock evaluate button and subject/marks selectors during evaluation
  setSubjectAndMarksLocked(true);
  evaluateBtn.disabled = true;
  evaluateBtn.classList.add("evaluate-btn-locked");
  const origBtnContent = evaluateBtn.innerHTML;
  evaluateBtn.innerHTML = `
    <span class="w-4 h-4 border-2 border-slate-900 border-t-transparent rounded-full animate-spin"></span>
    <span>AI Evaluation In Progress...</span>
  `;

  loadingIndicator.classList.remove("hidden");
  startForensicProgress();

  const formData = new FormData();
  formData.append("question", question || "Extract question printed on booklet header");
  formData.append("paper", state.paper);
  formData.append("max_marks", state.marks);
  if (allowAutoAligned) {
    formData.append("allow_auto_aligned", "true");
  }
  if (state.apiKey && !state.serverHasKey) {
    formData.append("api_key", state.apiKey);
  }
  if (state.user && state.user.email) {
    formData.append("user_email", state.user.email);
  }
  if (state.isRewriteMode) {
    formData.append("is_rewrite", "true");
    const baseline = state.rewriteBaseline || {};
    const baselineId = baseline.eval_id || state.currentEvalId || (state.previousEvaluation && (state.previousEvaluation.id || state.previousEvaluation.eval_id));
    if (baselineId) formData.append("baseline_eval_id", baselineId);
    if (baseline.question || state.question) formData.append("baseline_question", baseline.question || state.question);
    if (baseline.paper || state.paper) formData.append("baseline_paper", baseline.paper || state.paper);
    if (baseline.marks || state.marks) formData.append("baseline_marks", baseline.marks || state.marks);
  }

  state.uploadedFiles.forEach(file => {
    formData.append("files", file);
  });

  window.currentEvaluationController = new AbortController();

  try {
    const response = await fetch("/api/evaluate", {
      method: "POST",
      body: formData,
      signal: window.currentEvaluationController.signal
    });

    const parsed = await parseEvaluationResponse(response);
    if (!parsed.ok) {
      if (parsed.is402) {
        alert(parsed.message);
        window.openPricingModal();
        return;
      }
      if (parsed.guardModal) {
        window.showGuardModal(parsed.guardModal);
        return;
      }
      throw new Error(parsed.message || "Evaluation failed.");
    }

    const data = parsed.data;
    if (data.eval_id) {
      state.currentEvalId = data.eval_id;
    }
    if (data.paper) {
      state.paper = data.paper;
      state.selectedPaperTab = data.paper;
    }
    if (data.max_marks) {
      state.marks = data.max_marks;
    }
    if (typeof updateStepProgression === "function") {
      updateStepProgression();
    }
    if (data.detected_question) {
      state.question = data.detected_question;
      questionInput.value = data.detected_question;
    }

    if (data.is_rewrite) {
      data.evaluation.is_rewrite = true;
      state.activeCopyMode = "rewrite";
      state.rewrittenEvaluation = data.evaluation;
      if (data.pages && data.pages.length > 0) {
        state.rewrittenPages = [...data.pages];
        state.activePages = data.pages;
      }
      if (data.previous_pages) {
        state.previousPages = data.previous_pages;
        state.originalPages = [...data.previous_pages];
      }
      if (data.previous_evaluation) {
        data.evaluation.previous_evaluation = data.previous_evaluation;
        state.originalEvaluation = data.previous_evaluation;
      }
    } else {
      state.activeCopyMode = "original";
      state.originalEvaluation = data.evaluation;
      state.rewrittenPages = [];
      state.rewrittenEvaluation = null;
      if (data.pages && data.pages.length > 0) {
        state.activePages = data.pages;
        state.originalPages = [...data.pages];
      }
    }

    renderEvaluation(data.evaluation);

    if (state.activePages && state.activePages.length > 0) {
      state.currentPageIndex = 0;
      updateViewer();
    }

    // Sync updated credits
    if (data.user_credits !== undefined && state.user) {
      state.user.credits = data.user_credits;
      localStorage.setItem("mainsmentor_user", JSON.stringify(state.user));
      updateUserUI();
    }
    refreshLockerBadge();

    // Reset rewrite mode if active
    if (state.isRewriteMode) {
      window.cancelRewriteMode();
    }
  } catch (error) {
    if (error.name === "AbortError") {
      console.log("Evaluation request aborted by user.");
      return;
    }
    let errMsg = String(error.message || "");
    if (errMsg.includes("Unexpected token '<'") || errMsg.includes("<!DOCTYPE") || errMsg.includes("not valid JSON")) {
      errMsg = "Evaluation network connection was interrupted or timed out. 🛡️ Zero Credits Deducted: Your free checks remain 100% safe. Please retry.";
    }
    if (errMsg.includes("401") || errMsg.includes("UNAUTHENTICATED") || errMsg.includes("ACCESS_TOKEN_TYPE_UNSUPPORTED")) {
      try {
        localStorage.removeItem("mainsmentor_gemini_key");
        state.apiKey = "";
      } catch(e){}
    }
    if (typeof window.showAppNotice === 'function') {
      window.showAppNotice("Evaluation Notice", errMsg);
    } else {
      alert(`Evaluation Notice: ${errMsg}`);
    }
  } finally {
    setSubjectAndMarksLocked(false);
    stopForensicProgress();
    evaluateBtn.disabled = false;
    evaluateBtn.classList.remove("evaluate-btn-locked");
    evaluateBtn.innerHTML = origBtnContent;
    if (window.lucide) lucide.createIcons();
    loadingIndicator.classList.add("hidden");
  }
};

evaluateBtn.addEventListener("click", () => window.runEvaluation(false));

// Dynamic UPSC Percentile Scale Calibrated strictly by Max Marks
function updateScoreBands(overallScore, maxMarks) {
  const container = document.getElementById("scoreBandContainer");
  if (!container) return;
  const mm = maxMarks || 10;
  
  let b1Range, b2Range, b3Range, b4Range;
  let b1Label, b2Label, b3Label, b4Label;
  let activeBand = 1;

  if (mm === 10) {
    b1Range = "0.0 - 3.0"; b1Label = "Needs Work (<30%)";
    b2Range = "3.1 - 4.2"; b2Label = "Average (31-42%)";
    b3Range = "4.3 - 5.4"; b3Label = "Competitive (43-54%)";
    b4Range = "5.5 - 7.0+"; b4Label = "Topper (55%+)";
    if (overallScore <= 3.0) activeBand = 1;
    else if (overallScore <= 4.2) activeBand = 2;
    else if (overallScore <= 5.4) activeBand = 3;
    else activeBand = 4;
  } else if (mm === 15) {
    b1Range = "0.0 - 4.5"; b1Label = "Needs Work (<30%)";
    b2Range = "4.6 - 6.2"; b2Label = "Average (31-42%)";
    b3Range = "6.3 - 8.2"; b3Label = "Competitive (43-54%)";
    b4Range = "8.3 - 11.0+"; b4Label = "Topper (55%+)";
    if (overallScore <= 4.5) activeBand = 1;
    else if (overallScore <= 6.2) activeBand = 2;
    else if (overallScore <= 8.2) activeBand = 3;
    else activeBand = 4;
  } else if (mm === 20) {
    b1Range = "0.0 - 6.0"; b1Label = "Needs Work (<30%)";
    b2Range = "6.1 - 8.4"; b2Label = "Average (31-42%)";
    b3Range = "8.5 - 11.0"; b3Label = "Competitive (43-54%)";
    b4Range = "11.1 - 15.0+"; b4Label = "Topper (55%+)";
    if (overallScore <= 6.0) activeBand = 1;
    else if (overallScore <= 8.4) activeBand = 2;
    else if (overallScore <= 11.0) activeBand = 3;
    else activeBand = 4;
  } else {
    // 125M Essay
    b1Range = "0 - 47"; b1Label = "Needs Work (<38%)";
    b2Range = "48 - 60"; b2Label = "Average (38-48%)";
    b3Range = "61 - 72"; b3Label = "Competitive (49-58%)";
    b4Range = "73 - 90+"; b4Label = "Topper (58%+)";
    if (overallScore <= 47) activeBand = 1;
    else if (overallScore <= 60) activeBand = 2;
    else if (overallScore <= 72) activeBand = 3;
    else activeBand = 4;
  }

  const bands = [
    { el: document.getElementById("scoreBand1"), rEl: document.getElementById("scoreBand1Range"), lEl: document.getElementById("scoreBand1Label"), range: b1Range, label: b1Label, num: 1 },
    { el: document.getElementById("scoreBand2"), rEl: document.getElementById("scoreBand2Range"), lEl: document.getElementById("scoreBand2Label"), range: b2Range, label: b2Label, num: 2 },
    { el: document.getElementById("scoreBand3"), rEl: document.getElementById("scoreBand3Range"), lEl: document.getElementById("scoreBand3Label"), range: b3Range, label: b3Label, num: 3 },
    { el: document.getElementById("scoreBand4"), rEl: document.getElementById("scoreBand4Range"), lEl: document.getElementById("scoreBand4Label"), range: b4Range, label: b4Label, num: 4 }
  ];

  bands.forEach(b => {
    if (b.rEl) b.rEl.textContent = b.range;
    if (b.lEl) b.lEl.textContent = b.label;
    if (b.el) {
      if (b.num === activeBand) {
        b.el.className = "p-2 rounded-xl bg-amber-500/20 border-2 border-amber-400 font-bold shadow-lg ring-2 ring-amber-400/30 transform scale-[1.03] transition-all duration-300 relative";
        let pin = b.el.querySelector(".band-active-pin");
        if (!pin) {
          pin = document.createElement("div");
          pin.className = "band-active-pin text-[9px] font-extrabold text-amber-300 uppercase tracking-widest mt-1";
          b.el.appendChild(pin);
        }
        pin.textContent = `★ You: ${overallScore.toFixed(1)}`;
      } else {
        b.el.className = "p-2 rounded-xl bg-slate-950/40 border border-slate-800/80 transition-all opacity-60";
        const pin = b.el.querySelector(".band-active-pin");
        if (pin) pin.remove();
      }
    }
  });
}

// =========================================================================
// 24-HOUR REWRITE LIVE COUNTDOWN ENGINE (PERSISTENT & ACCURATE)
// =========================================================================
let rewriteCountdownInterval = null;

function start24hRewriteTimer(evalTimestamp) {
  if (rewriteCountdownInterval) {
    clearInterval(rewriteCountdownInterval);
    rewriteCountdownInterval = null;
  }

  const countdownEl = document.getElementById("stickyCountdownText");
  if (!countdownEl) return;

  const evalId = state.currentEvaluation?.id || state.currentEvaluation?.eval_id || state.currentEvalId || state.activeSampleId || "active";
  const storageKey = `mainsmentor_timer_start_${evalId}`;

  const duration24h = 24 * 60 * 60 * 1000;
  let startTime = null;

  const rawTs = evalTimestamp || (state.currentEvalRecord && state.currentEvalRecord.created_at) || (state.currentEvaluation && (state.currentEvaluation.created_at || state.currentEvaluation.evaluated_at));
  if (rawTs) {
    const tsStr = String(rawTs).includes("T") ? String(rawTs) : String(rawTs).replace(" ", "T");
    let parsed = new Date(tsStr).getTime();
    if (isNaN(parsed)) {
      parsed = new Date(rawTs).getTime();
    }
    if (!isNaN(parsed) && parsed > 0 && (Date.now() - parsed < duration24h) && (Date.now() - parsed >= -60000)) {
      startTime = parsed;
    }
  }

  if (!startTime) {
    const saved = localStorage.getItem(storageKey);
    if (saved && !isNaN(parseInt(saved, 10))) {
      const savedTime = parseInt(saved, 10);
      if (Date.now() - savedTime < duration24h && Date.now() - savedTime >= -60000) {
        startTime = savedTime;
      } else {
        startTime = Date.now();
        localStorage.setItem(storageKey, String(startTime));
      }
    } else {
      startTime = Date.now();
      localStorage.setItem(storageKey, String(startTime));
    }
  }

  const expiryTime = startTime + duration24h;

  function tick() {
    const now = Date.now();
    const remainingMs = expiryTime - now;

    if (remainingMs <= 0) {
      countdownEl.textContent = "Window Expired (24h passed)";
      countdownEl.className = "text-rose-500 font-mono font-bold text-xs";
      if (rewriteCountdownInterval) {
        clearInterval(rewriteCountdownInterval);
        rewriteCountdownInterval = null;
      }
      return;
    }

    const totalSecs = Math.floor(remainingMs / 1000);
    const hrs = Math.floor(totalSecs / 3600);
    const mins = Math.floor((totalSecs % 3600) / 60);
    const secs = totalSecs % 60;

    countdownEl.textContent = `${hrs} hrs ${mins} mins ${secs}s remaining`;
    countdownEl.className = "text-amber-600 dark:text-amber-400 font-mono font-bold text-xs";
  }

  tick();
  rewriteCountdownInterval = setInterval(tick, 1000);
}

function stop24hRewriteTimer() {
  if (rewriteCountdownInterval) {
    clearInterval(rewriteCountdownInterval);
    rewriteCountdownInterval = null;
  }
}

// Render the Full Evaluation Scorecard
function renderEvaluation(evalData) {
  state.currentEvaluation = evalData;

  // 0. Build Glossary Map for Instant Inline Jargon Decoding across remarks and model answer
  state.glossaryMap = {};
  if (evalData.missing_keywords_cards && Array.isArray(evalData.missing_keywords_cards)) {
    evalData.missing_keywords_cards.forEach(c => {
      if (c && c.term) {
        const key = c.term.replace(/[*_#`]/g, '').trim().toLowerCase();
        const tag = c.domain_or_thinker || c.thinker || '';
        const def = c.definition || c.exam_application || '';
        state.glossaryMap[key] = tag ? `${tag} • ${def}` : def;
      }
    });
  }
  if (evalData.jargon_buster && Array.isArray(evalData.jargon_buster)) {
    evalData.jargon_buster.forEach(j => {
      if (j && j.term) {
        const key = j.term.replace(/[*_#`]/g, '').trim().toLowerCase();
        if (!state.glossaryMap[key]) {
          state.glossaryMap[key] = j.meaning;
        }
      }
    });
  }

  if (emptyState) emptyState.classList.add("hidden");
  if (resultsContainer) resultsContainer.classList.remove("hidden");

  // Synchronize Sticky Top Action Bar in State B
  const topDiscipline = document.getElementById("studioBreadcrumbDiscipline");
  const topQuestion = document.getElementById("studioBreadcrumbQuestion");
  const topScore = document.getElementById("studioTopScore");
  const topMax = document.getElementById("studioTopMaxMarks");
  const topBand = document.getElementById("studioTopBand");

  let preciseDiscipline = evalData.detected_paper_display || evalData.paper_display || evalData.paper_title || state.paper || "GS-2";
  if (topDiscipline) topDiscipline.textContent = preciseDiscipline;
  if (topQuestion) topQuestion.textContent = evalData.detected_question || state.question || "UPSC Mains Answer";
  if (topScore) topScore.textContent = (parseFloat(evalData.overall_score) || 0.0).toFixed(1);
  if (topMax) topMax.textContent = `/ ${evalData.max_marks || (state.marks || 10)}`;

  // Automatically lock screen into State B (The Evaluation Studio)
  window.switchStudioState("studio");


  // Auto-sync question and subject if detected from booklet header
  if (evalData.detected_question) {
    state.question = evalData.detected_question;
    questionInput.value = evalData.detected_question;
  }
  if (evalData.detected_paper) {
    state.paper = evalData.detected_paper;
    preciseDiscipline = evalData.detected_paper_display || evalData.paper_display || evalData.paper_title || evalData.detected_paper;
    resultPaperBadge.textContent = preciseDiscipline;
    paperTabs.forEach(t => {
      const p = t.getAttribute("data-paper");
      if (p === evalData.detected_paper || (evalData.detected_paper.startsWith("Optional") && p === "Optional")) {
        t.className = "paper-tab py-1.5 text-xs font-medium rounded-lg bg-amber-500 text-slate-950 font-bold transition shadow";
      } else {
        t.className = "paper-tab py-1.5 text-xs font-medium rounded-lg text-slate-400 hover:text-white transition";
      }
    });
  }

  // Rewrite Mark Recovery Comparison Card & Copy Switcher
  const compCard = document.getElementById("rewriteComparisonCard");
  const prevEval = evalData.previous_evaluation || state.previousEvaluation;
  const isRewriteEval = Boolean(evalData.is_rewrite || state.isRewriteMode);
  evalData.is_rewrite = isRewriteEval;
  if (state.currentEvaluation) {
    state.currentEvaluation.is_rewrite = isRewriteEval;
  }
  state.isRewriteMode = false;

  const isRewriteAlreadyDone = Boolean(
    isRewriteEval || 
    evalData.has_been_rewritten || 
    evalData.rewrite_eval_id || 
    (state.currentEvalRecord && (state.currentEvalRecord.is_rewrite || state.currentEvalRecord.has_been_rewritten || state.currentEvalRecord.rewrite_eval_id))
  );

  // Studio Header: Toggle Rewrite Button vs Completed Badge
  const studioRewriteBtn = document.getElementById("studioRewriteBtn");
  const studioRewriteBadge = document.getElementById("studioRewriteCompletedBadge");
  if (isRewriteAlreadyDone) {
    if (studioRewriteBtn) studioRewriteBtn.classList.add("hidden");
    if (studioRewriteBadge) studioRewriteBadge.classList.remove("hidden");
  } else {
    if (studioRewriteBtn) studioRewriteBtn.classList.remove("hidden");
    if (studioRewriteBadge) studioRewriteBadge.classList.add("hidden");
  }

  if (compCard) {
    if (isRewriteEval && prevEval && prevEval.overall_score !== undefined) {
      compCard.classList.remove("hidden");
      const prevScore = parseFloat(prevEval.overall_score) || 0.0;
      const currScore = parseFloat(evalData.overall_score) || 0.0;
      const maxM = evalData.max_marks || prevEval.max_marks || (state.marks || 10);
      const delta = currScore - prevScore;
      const deltaPct = maxM > 0 ? ((delta / maxM) * 100).toFixed(0) : "0";

      const prevEl = document.getElementById("prevOverallScore");
      const currEl = document.getElementById("currOverallScore");
      const deltaText = document.getElementById("rewriteDeltaText");
      const deltaBadge = document.getElementById("rewriteDeltaBadge");
      const bandJump = document.getElementById("bandJumpText");
      const recoveryDelta = document.getElementById("markRecoveryDelta");
      const sectionGrid = document.getElementById("sectionRecoveryGrid");

      if (prevEl) prevEl.textContent = `${prevScore.toFixed(1)} / ${maxM}`;
      if (currEl) currEl.textContent = `${currScore.toFixed(1)} / ${maxM}`;
      if (recoveryDelta) recoveryDelta.textContent = `${delta >= 0 ? '+' : ''}${delta.toFixed(1)}M`;

      if (deltaText) {
        if (delta > 0) {
          deltaText.textContent = `+${delta.toFixed(1)} Marks Recovered (+${deltaPct}% Jump)`;
          if (deltaBadge) deltaBadge.className = "px-3.5 py-1.5 rounded-xl bg-emerald-500 text-slate-950 font-extrabold text-xs shadow-lg flex items-center space-x-1.5 self-start sm:self-auto";
        } else if (delta === 0) {
          deltaText.textContent = `Score Maintained (${currScore.toFixed(1)} / ${maxM})`;
          if (deltaBadge) deltaBadge.className = "px-3.5 py-1.5 rounded-xl bg-amber-500 text-slate-950 font-extrabold text-xs shadow-lg flex items-center space-x-1.5 self-start sm:self-auto";
        } else {
          deltaText.textContent = `${delta.toFixed(1)} Marks Delta`;
          if (deltaBadge) deltaBadge.className = "px-3.5 py-1.5 rounded-xl bg-rose-500 text-white font-extrabold text-xs shadow-lg flex items-center space-x-1.5 self-start sm:self-auto";
        }
      }

      if (bandJump) {
        const getBandName = (s, m) => {
          const p = s / m;
          if (p < 0.35) return "Needs Work";
          if (p < 0.45) return "Average";
          if (p < 0.55) return "Competitive";
          return "Topper";
        };
        bandJump.textContent = `${getBandName(prevScore, maxM)} → ${getBandName(currScore, maxM)}`;
      }

      // Section-by-section comparison
      if (sectionGrid) {
        sectionGrid.innerHTML = "";
        const prevR = prevEval.rubric_scores || {};
        const currR = evalData.rubric_scores || {};

        const sections = [
          { label: "Introduction", prev: prevR.intro_score || 0, curr: currR.intro_score || 0 },
          { label: "Core Demand / Body", prev: prevR.core_demand_score || 0, curr: currR.core_demand_score || 0 },
          { label: "Value Addition", prev: prevR.value_add_score || 0, curr: currR.value_add_score || 0 },
          { label: "Presentation", prev: prevR.presentation_score || 0, curr: currR.presentation_score || 0 },
          { label: "Way Forward", prev: prevR.conclusion_score || 0, curr: currR.conclusion_score || 0 }
        ];

        sections.forEach(sec => {
          const sDelta = sec.curr - sec.prev;
          const chip = document.createElement("div");
          chip.className = "p-2 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between";
          chip.innerHTML = `
            <div>
              <span class="font-semibold text-slate-300 block text-[11px]">${sec.label}</span>
              <span class="text-[10px] text-slate-400 font-mono">${sec.prev.toFixed(1)} → <strong class="text-amber-300">${sec.curr.toFixed(1)}</strong></span>
            </div>
            <span class="text-[11px] font-mono font-bold px-1.5 py-0.5 rounded ${sDelta > 0 ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : sDelta < 0 ? 'bg-rose-500/20 text-rose-300' : 'bg-slate-800 text-slate-400'}">
              ${sDelta > 0 ? '+' : ''}${sDelta.toFixed(1)}M
            </span>
          `;
          sectionGrid.appendChild(chip);
        });
      }

      // Show Copy Switcher in the Viewer Header Bar (Matching Image 4)
      const copySwitcher = document.getElementById("copySwitcherContainer");
      const viewRewriteBtn = document.getElementById("viewRewriteCopyBtn");
      const viewOriginalBtn = document.getElementById("viewOriginalCopyBtn");

      if (copySwitcher && ((state.previousPages && state.previousPages.length > 0) || (state.originalPages && state.originalPages.length > 0))) {
        copySwitcher.classList.remove("hidden");
        if (!state.rewrittenPages || state.rewrittenPages.length === 0) {
          state.rewrittenPages = [...state.activePages];
        }
        if (!state.originalPages || state.originalPages.length === 0) {
          state.originalPages = [...(state.previousPages || [])];
        }
        if (!state.rewrittenEvaluation) {
          state.rewrittenEvaluation = evalData;
        }
        if (!state.originalEvaluation) {
          state.originalEvaluation = state.previousEvaluation || evalData.previous_evaluation;
        }

        const updateSwitcherStyles = () => {
          const activeClass = "px-2 sm:px-2.5 py-0.5 rounded-md text-[9.5px] sm:text-[10px] font-bold bg-emerald-500 text-white transition shadow-xs whitespace-nowrap cursor-pointer";
          const inactiveClass = "px-2 sm:px-2.5 py-0.5 rounded-md text-[9.5px] sm:text-[10px] font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition whitespace-nowrap cursor-pointer";

          if (state.activeCopyMode === "original") {
            if (viewOriginalBtn) {
              viewOriginalBtn.className = activeClass;
              viewOriginalBtn.textContent = "Original";
            }
            if (viewRewriteBtn) {
              viewRewriteBtn.className = inactiveClass;
              viewRewriteBtn.textContent = "Rewritten";
            }
          } else {
            if (viewRewriteBtn) {
              viewRewriteBtn.className = activeClass;
              viewRewriteBtn.textContent = "Rewritten";
            }
            if (viewOriginalBtn) {
              viewOriginalBtn.className = inactiveClass;
              viewOriginalBtn.textContent = "Original";
            }
          }
        };

        updateSwitcherStyles();

        if (viewRewriteBtn && viewOriginalBtn) {
          viewRewriteBtn.onclick = (e) => {
            if (e) e.stopPropagation();
            state.activeCopyMode = "rewrite";
            updateSwitcherStyles();
            state.activePages = [...state.rewrittenPages];
            state.currentEvaluation = state.rewrittenEvaluation || evalData;
            state.currentPageIndex = 0;
            updateViewer();
            renderPreviewStrip();
          };

          viewOriginalBtn.onclick = (e) => {
            if (e) e.stopPropagation();
            state.activeCopyMode = "original";
            updateSwitcherStyles();
            state.activePages = [...state.originalPages];
            state.currentEvaluation = state.originalEvaluation || state.previousEvaluation || evalData.previous_evaluation;
            state.currentPageIndex = 0;
            updateViewer();
            renderPreviewStrip();
          };
        }
      }
    } else {
      compCard.classList.add("hidden");
      const copySwitcher = document.getElementById("copySwitcherContainer");
      if (copySwitcher) copySwitcher.classList.add("hidden");
    }
  }

  // Hero Score
  preciseDiscipline = evalData.detected_paper_display || evalData.paper_display || evalData.paper_title || (state.paper ? (state.paper.startsWith("GS") ? state.paper : `GS-${state.paper}`) : "GS Paper");
  resultScore.textContent = evalData.overall_score.toFixed(1);
  resultMaxMarks.textContent = `/ ${evalData.max_marks}`;
  resultPercentileBadge.textContent = evalData.percentile_verdict;
  resultPaperBadge.textContent = preciseDiscipline;
  resultQuestionSummary.textContent = evalData.detected_question || state.question || evalData.question;
  resultExecutiveSummary.innerHTML = formatHighlightedText(evalData.executive_summary);

  // Populate Official Printable Diagnostic Header (Visible when printing / saving PDF)
  const printCandidateId = document.getElementById("printCandidateId");
  const printEvalDate = document.getElementById("printEvalDate");
  const printMaxMarksHeader = document.getElementById("printMaxMarksHeader");
  const printDirectiveHeader = document.getElementById("printDirectiveHeader");
  const printDisciplineHeader = document.getElementById("printDisciplineHeader");
  const printQuestionText = document.getElementById("printQuestionText");
  const printOverallScore = document.getElementById("printOverallScore");
  const printPercentileText = document.getElementById("printPercentileText");
  const printDirectiveScoreText = document.getElementById("printDirectiveScoreText");

  if (printCandidateId) {
    printCandidateId.textContent = (state.user && state.user.name) ? state.user.name.toUpperCase() : "MM-UPSC-2026-ASPIRANT";
  }
  if (printEvalDate) {
    const now = new Date();
    printEvalDate.textContent = now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) + ", " + now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) + " IST";
  }
  if (printMaxMarksHeader) {
    const mm = evalData.max_marks || state.marks || 10;
    printMaxMarksHeader.textContent = `${mm}.0 Marks (${mm == 10 ? '150' : mm == 15 ? '250' : mm == 20 ? '250' : '1000'} Words)`;
  }
  if (printDirectiveHeader) {
    printDirectiveHeader.textContent = (evalData.directive_compliance && evalData.directive_compliance.directive) || "Discuss / Comprehensive Analysis";
  }
  if (printDisciplineHeader) {
    printDisciplineHeader.textContent = preciseDiscipline;
  }
  if (printQuestionText) {
    printQuestionText.textContent = state.question || evalData.detected_question || "";
  }
  if (printOverallScore) {
    printOverallScore.textContent = `${(evalData.overall_score || 0).toFixed(1)} / ${(evalData.max_marks || 10).toFixed(1)} Marks`;
  }
  if (printPercentileText) {
    printPercentileText.textContent = evalData.percentile_verdict || "Calibrated Score";
  }
  if (printDirectiveScoreText) {
    printDirectiveScoreText.textContent = (evalData.directive_compliance && evalData.directive_compliance.adherence_score) ? (evalData.directive_compliance.adherence_score + " Adherence") : "Strict Calibration";
  }
  const printExecutiveSummary = document.getElementById("printExecutiveSummary");
  if (printExecutiveSummary) {
    printExecutiveSummary.innerHTML = formatHighlightedText(evalData.executive_summary || "");
  }

  // Dynamic Score Bands Update
  updateScoreBands(evalData.overall_score, evalData.max_marks);

  // Directive Adherence
  const dir = evalData.directive_compliance || {};
  directiveNameDisplay.textContent = dir.directive || "General Discuss";
  directiveScoreBadge.textContent = dir.adherence_score || "7/10";
  directiveEvaluationText.innerHTML = formatHighlightedText(dir.evaluation || "Candidate addressed core demands.");
  directiveGapText.innerHTML = formatHighlightedText(dir.gap || "Ensure both dimensions are weighed equally.");

  // Render Radar Chart
  renderRadar(evalData.rubric_scores, evalData.max_marks);

  // Section 1: Intro Audit
  const intro = evalData.intro_audit || {};
  document.getElementById("introCritiqueText").innerHTML = formatHighlightedText(intro.current_critique || "");
  const missingIntroEl = document.getElementById("introMissingList");
  missingIntroEl.innerHTML = "";
  (intro.missing_elements || []).forEach(item => {
    const li = document.createElement("li");
    li.innerHTML = formatHighlightedText(item);
    missingIntroEl.appendChild(li);
  });
  document.getElementById("modelIntroText").innerHTML = `"${formatHighlightedText(intro.model_intro_rewrite || '')}"`;

  // Section 2: Body Audit
  const body = evalData.body_audit || {};
  const strengthsEl = document.getElementById("bodyStrengthsList");
  strengthsEl.innerHTML = "";
  (body.strengths || []).forEach(s => {
    const li = document.createElement("li");
    li.className = "flex items-start space-x-1.5";
    li.innerHTML = `<span class="text-emerald-400 font-bold">✓</span><span>${formatHighlightedText(s)}</span>`;
    strengthsEl.appendChild(li);
  });

  const gapsEl = document.getElementById("bodyGapsList");
  gapsEl.innerHTML = "";
  (body.critical_gaps || []).forEach(g => {
    const li = document.createElement("li");
    li.className = "flex items-start space-x-1.5";
    li.innerHTML = `<span class="text-amber-400 font-bold">✎</span><span>${formatHighlightedText(g)}</span>`;
    gapsEl.appendChild(li);
  });

  const missingDimEl = document.getElementById("bodyMissingDimensionsList");
  missingDimEl.innerHTML = "";
  (body.missing_dimensions || []).forEach(d => {
    const li = document.createElement("li");
    li.innerHTML = formatHighlightedText(d);
    missingDimEl.appendChild(li);
  });

  // Section 3: Actionable Value Add Checklist
  renderValueAddCategories(evalData.value_add_checklist, state.paper, state.question);

  // Section 4: Conclusion Audit
  const conc = evalData.conclusion_audit || {};
  document.getElementById("conclusionCritiqueText").innerHTML = formatHighlightedText(conc.current_critique || "");
  document.getElementById("modelConclusionText").innerHTML = `"${formatHighlightedText(conc.model_conclusion_rewrite || '')}"`;

  // Section 5: Candidate Deciphered Handwriting
  const transEl = document.getElementById("transcribedAnswerText");
  if (transEl) {
    transEl.textContent = evalData.transcribed_text || "Transcription deciphered from candidate handwritten sheet.";
  }

  // Section 6: Complete Topper Model Answer with Embedded Diagram & Inline Keywords
  renderModelAnswer(evalData.full_model_answer, evalData.recommended_diagram_visual, evalData.max_marks);

  // --- NEW ASPIRANT-FRIENDLY EXTRACTED COMPONENTS ---

  // 1. Fatal Blunder & Disciplinary Leak Alert Banner
  const fb = evalData.fatal_blunders_alert;
  const fbBanner = document.getElementById("fatalBlunderBanner");
  if (fbBanner) {
    if (fb && fb.has_blunder) {
      fbBanner.classList.remove("hidden");
      const fbTitle = document.getElementById("fatalBlunderTitle");
      if (fbTitle) fbTitle.textContent = fb.title || "Critical Attribution & Disciplinary Alerts";
      const attEl = document.getElementById("attributionAlertText");
      if (attEl) attEl.innerHTML = formatHighlightedText(fb.attribution_error || "Verify foundational thinker citations.");
      const discEl = document.getElementById("disciplinaryAlertText");
      if (discEl) discEl.innerHTML = formatHighlightedText(fb.disciplinary_leak || "Maintain strict disciplinary boundaries.");
    } else {
      fbBanner.classList.add("hidden");
    }
  }

  // 2. Next Attempt Focus Card (Mentor's Rewrite Workshop)
  const na = evalData.next_attempt_focus;
  const naCard = document.getElementById("nextAttemptCard");
  if (naCard && na) {
    const naBadge = document.getElementById("nextAttemptTargetBadge");
    if (naBadge) naBadge.textContent = na.target_section || na.weakest_area || "High-Yield Upgrade (-1.5M Recoverable)";
    const naDir = document.getElementById("nextAttemptDirective");
    if (naDir) naDir.innerHTML = formatHighlightedText(na.core_directive || "Address core question demand with dialectical synthesis.");
    const draftQuote = document.getElementById("studentDraftQuote");
    if (draftQuote) {
      draftQuote.textContent = na.student_draft_quote || "Candidate draft: Lacked explicit counter-arguments and analytical transition.";
    }
    const naEx = document.getElementById("nextAttemptExample");
    if (naEx) naEx.textContent = na.topper_transformation || na.plug_and_play_example || "";
    const whyText = document.getElementById("mentorWhyText");
    if (whyText) {
      whyText.textContent = na.mentor_why || na.why_it_earns_marks || "Directly satisfies the directive and introduces empirical substantiation, earning +0.5 to +1.0M.";
    }
    const placementText = document.getElementById("bookletPlacementText");
    if (placementText) {
      placementText.textContent = na.booklet_placement || na.where_to_place_in_sheet || "Insert as the opening transition of your 2nd sub-heading on Page 2.";
    }
  }

  // 3. Dynamic High-Yield Missing Keywords & Concepts Toolkit
  const mkTitle = document.getElementById("missingKeywordsHeading");
  if (mkTitle) {
    mkTitle.textContent = evalData.keyword_toolkit_title || "Domain Concepts & High-Yield Keywords (Missing Keywords)";
  }
  const mkGrid = document.getElementById("missingKeywordsGrid");
  if (mkGrid) {
    mkGrid.innerHTML = "";
    const cards = evalData.missing_keywords_cards || [
      { number: 1, term: "Eudaimonia", domain_or_thinker: "Aristotle", definition: "Teleological human flourishing or living well as the ultimate goal of virtuous statecraft.", where_to_use: "Body section on civic moral decay" },
      { number: 2, term: "Tripartite Soul & Merit", domain_or_thinker: "Plato", definition: "Reason governing appetite and courage as the foundation of justice.", where_to_use: "Ground Plato's architectonic conception of justice" },
      { number: 3, term: "Distributive Justice", domain_or_thinker: "Aristotle", definition: "Proportionate equality allocating honors based on virtue and moral contribution.", where_to_use: "Apply to modern debates on social inequality" },
      { number: 4, term: "Communitarianism", domain_or_thinker: "MacIntyre / Sandel", definition: "Reviving classical civic virtue against unencumbered liberal individualism.", where_to_use: "Modern Contribution section" }
    ];
    cards.forEach((c, idx) => {
      const div = document.createElement("div");
      div.className = "keyword-card space-y-1.5";
      const tagText = c.domain_or_thinker || c.thinker || "Domain Concept";
      div.innerHTML = `
        <div class="flex flex-wrap items-start justify-between gap-1.5 sm:gap-2">
          <div class="flex items-start space-x-2 flex-1 min-w-[130px]">
            <span class="w-5 h-5 shrink-0 rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-400 border border-amber-500/40 text-[10px] font-extrabold flex items-center justify-center mt-0.5">${c.number || (idx + 1)}</span>
            <span class="keyword-term font-bold text-xs leading-snug text-slate-900 dark:text-slate-100 break-words">${escapeHtml(c.term)}</span>
          </div>
          <span class="keyword-tag text-[9.5px] self-start max-w-[170px] truncate px-2 py-0.5 rounded font-semibold mt-0.5" title="${escapeHtml(tagText)}">${escapeHtml(tagText)}</span>
        </div>
        <p class="keyword-desc text-[11px] leading-relaxed font-sans text-slate-700 dark:text-slate-300 mt-1">${escapeHtml(c.definition)}</p>
        <div class="keyword-action pt-1.5 border-t border-slate-200 dark:border-slate-700/60 flex items-center space-x-1.5 text-[10.5px] font-semibold text-emerald-700 dark:text-emerald-400">
          <i data-lucide="crosshair" class="w-3.5 h-3.5 shrink-0 text-emerald-700 dark:text-emerald-400"></i>
          <span>${escapeHtml(c.where_to_use || 'Plug into Body section')}</span>
        </div>
      `;
      mkGrid.appendChild(div);
    });
    if (window.lucide) {
      try { window.lucide.createIcons({ root: mkGrid }); } catch (e) {}
    }
  }

  // 4. Micro-Hygiene & Presentation Polish
  const mh = evalData.micro_hygiene || {};
  const spellEl = document.getElementById("hygieneSpelling");
  if (spellEl) {
    const spells = mh.spelling_errors || [];
    if (spells.length > 0) {
      spellEl.innerHTML = spells.map(s => `<div class="text-rose-300 font-medium">• ${s}</div>`).join("");
    } else {
      spellEl.innerHTML = `<span class="text-emerald-400 font-semibold">✓ Zero spelling errors detected</span>`;
    }
  }
  const gramEl = document.getElementById("hygieneGrammar");
  if (gramEl) {
    gramEl.innerHTML = formatHighlightedText(mh.grammar_and_syntax || "Syntax is clear and grammatically sound.");
  }
  const presEl = document.getElementById("hygienePresentation");
  if (presEl) {
    presEl.innerHTML = formatHighlightedText(mh.presentation_and_word_count || "Legible handwriting with consistent paragraph structure.");
  }

  // 5. Dynamic Grounded Current Affairs & Value-Addition Multipliers Card
  const caCard = document.getElementById("currentAffairsCard");
  const caData = evalData.current_affairs_value_add;
  if (caCard && caData) {
    caCard.classList.remove("hidden");
    const exIns = caData.current_example_insertion || {};
    const caExampleTarget = document.getElementById("caExampleTarget");
    const caMarksGainBadge = document.getElementById("caMarksGainBadge");
    const caCurrentWeakness = document.getElementById("caCurrentWeakness");
    const caRecommendedInsertion = document.getElementById("caRecommendedInsertion");

    if (caExampleTarget) caExampleTarget.textContent = exIns.paragraph_target || "Body Paragraph 2";
    if (caMarksGainBadge) caMarksGainBadge.textContent = exIns.marks_gain || "+0.5 to +1.0 Mark";
    if (caCurrentWeakness) caCurrentWeakness.textContent = exIns.current_weakness || "Lacked specific contemporary scheme or legal authority.";
    if (caRecommendedInsertion) caRecommendedInsertion.innerHTML = formatHighlightedText(exIns.recommended_insertion || "Quote recent statutory framework or mission targets.");

    const caDataList = document.getElementById("caDataReportsList");
    if (caDataList) {
      const reports = caData.high_yield_data_reports || [];
      caDataList.innerHTML = reports.map(rep => `
        <li class="flex items-start space-x-2">
          <span class="text-amber-400 font-bold shrink-0">▪</span>
          <span class="leading-relaxed">${formatHighlightedText(rep)}</span>
        </li>
      `).join("");
    }

    const diagRec = caData.diagram_recommendation || {};
    const caDiagTitle = document.getElementById("caDiagramTitle");
    const caDiagStructure = document.getElementById("caDiagramStructure");
    const caDiagTip = document.getElementById("caDiagramTip");

    if (caDiagTitle) caDiagTitle.textContent = diagRec.concept_title || "Multi-Dimensional Analytical Framework";
    if (caDiagStructure) caDiagStructure.textContent = diagRec.structure || "Policy Hub -> Coordination -> Execution";
    if (caDiagTip) caDiagTip.textContent = `★ ${diagRec.exam_hall_sketch_tip || 'Sketch a clean 45-second micro-diagram'}`;
  } else if (caCard) {
    caCard.classList.add("hidden");
  }

  // Analytical Scorecard Progress Bars
  const r = evalData.rubric_scores || {};
  const mm = evalData.max_marks || 10;
  const introMax = r.intro_max || (mm * 0.15);
  const coreMax = r.core_demand_max || (mm * 0.50);
  const valueMax = r.value_add_max || (mm * 0.15);
  const presMax = r.presentation_max || (mm * 0.10);
  const concMax = r.conclusion_max || (mm * 0.10);

  function updateBar(barId, textId, score, maxScore) {
    const b = document.getElementById(barId);
    const t = document.getElementById(textId);
    if (b && t && maxScore > 0) {
      const s = Math.max(0, Math.min(score, maxScore));
      const pct = Math.min(100, Math.round((s / maxScore) * 100));
      b.style.width = `${pct}%`;
      t.textContent = `${s.toFixed(1)} / ${maxScore.toFixed(1)}`;
      if (pct < 40) {
        b.className = "bg-rose-500 h-full rounded-full transition-all duration-500";
        b.style.backgroundColor = "#e11d48";
      } else if (pct < 65) {
        b.className = "bg-amber-500 h-full rounded-full transition-all duration-500";
        b.style.backgroundColor = "#d97706";
      } else {
        b.className = "bg-emerald-500 h-full rounded-full transition-all duration-500";
        b.style.backgroundColor = "#059669";
      }
    }
  }

  updateBar("barIntro", "barIntroText", r.intro_score !== undefined ? r.intro_score : 1.0, introMax);
  updateBar("barCore", "barCoreText", r.core_demand_score !== undefined ? r.core_demand_score : 2.0, coreMax);
  updateBar("barValue", "barValueText", r.value_add_score !== undefined ? r.value_add_score : 0.5, valueMax);
  updateBar("barPres", "barPresText", r.presentation_score !== undefined ? r.presentation_score : 0.5, presMax);
  updateBar("barConc", "barConcText", r.conclusion_score !== undefined ? r.conclusion_score : 0.5, concMax);

  const verdictLabel = document.getElementById("analyticalVerdictLabel");
  if (verdictLabel) {
    verdictLabel.textContent = `Total: ${evalData.overall_score.toFixed(1)} / ${mm}`;
  }

  // Visual Flowchart Container
  const flowEl = document.getElementById("visualFlowchartContainer");
  if (flowEl) {
    flowEl.textContent = evalData.recommended_diagram_visual || 
      `┌────────────────────────────────────────────────────────┐
│             EXAM HALL SCHEMATIC (DRAW THIS)            │
├────────────────────────────────────────────────────────┤
│  [Dimension 1: Theoretical] ──> [Dimension 2: Empirical]│
│            │                              │            │
│            ▼                              ▼            │
│  [Aristotle: Master Science] <──> [David Easton: Values]│
└────────────────────────────────────────────────────────┘`;
  }

  // Show 24-Hour Free Rewrite Challenge Card or Completed Card
  const rewriteCompletedCard = document.getElementById("rewriteCompletedCard");
  if (isRewriteAlreadyDone) {
    if (rewriteChallengeCard) rewriteChallengeCard.classList.add("hidden");
    if (rewriteCompletedCard) rewriteCompletedCard.classList.remove("hidden");
  } else {
    if (rewriteChallengeCard) rewriteChallengeCard.classList.remove("hidden");
    if (rewriteCompletedCard) rewriteCompletedCard.classList.add("hidden");
  }

  // Cache scores for theme toggle radar re-render
  state.lastRubricScores = evalData.rubric_scores;
  state.lastMaxMarks = evalData.max_marks;

  // Show Sticky Rewrite Action Bar (ONLY if not already re-evaluated)
  const stickyFooter = document.getElementById("stickyRewriteFooter");
  if (stickyFooter) {
    if (isRewriteAlreadyDone) {
      stickyFooter.classList.add("hidden");
      stop24hRewriteTimer();
    } else {
      stickyFooter.classList.remove("hidden");
      start24hRewriteTimer(evalData.created_at || evalData.evaluated_at);
    }
  }

  // Sync mobile locker badge with desktop badge
  const mbBadge = document.getElementById("mbLockerBadge");
  const desktopBadge = document.getElementById("lockerCountBadge");
  if (mbBadge && desktopBadge) {
    mbBadge.textContent = desktopBadge.textContent;
  }

  // Populate Publication-Grade 3-Page Forensic Evaluation Dossier
  populatePrintDossier(evalData);

  // Update Red-Pen Annotations on the active copy
  renderAnnotationsOverlay();
  lucide.createIcons();
}

// =========================================================================
// PUBLICATION-GRADE CIVIL SERVICES FORENSIC EVALUATION DOSSIER DATA BINDINGS
// =========================================================================
function formatRubricDiagnosticRow(critiqueText, strengths = [], gaps = []) {
  const rows = [];
  if (strengths && strengths.length > 0) {
    strengths.slice(0, 1).forEach(s => {
      const clean = formatHighlightedText(s);
      rows.push(`
        <div class="flex items-start space-x-1 leading-tight">
          <span class="text-emerald-700 font-bold shrink-0 text-[7.5pt]">✓</span>
          <span class="text-slate-800 text-[7.2pt]">${clean}</span>
        </div>
      `);
    });
  }
  if (gaps && gaps.length > 0) {
    gaps.slice(0, 1).forEach(g => {
      const clean = formatHighlightedText(g);
      rows.push(`
        <div class="flex items-start space-x-1 leading-tight mt-0.5">
          <span class="text-amber-700 font-bold shrink-0 text-[7.5pt]">✗</span>
          <span class="text-slate-800 text-[7.2pt]">${clean}</span>
        </div>
      `);
    });
  }
  if (rows.length === 0 && critiqueText) {
    const parts = String(critiqueText).split(/(?<=[.?!])\s+/);
    if (parts.length > 1) {
      rows.push(`
        <div class="flex items-start space-x-1 leading-tight">
          <span class="text-emerald-700 font-bold shrink-0 text-[7.5pt]">✓</span>
          <span class="text-slate-800 text-[7.2pt]">${formatHighlightedText(parts[0])}</span>
        </div>
      `);
      rows.push(`
        <div class="flex items-start space-x-1 leading-tight mt-0.5">
          <span class="text-amber-700 font-bold shrink-0 text-[7.5pt]">✗</span>
          <span class="text-slate-800 text-[7.2pt]">${formatHighlightedText(parts.slice(1).join(" "))}</span>
        </div>
      `);
    } else {
      rows.push(`
        <div class="flex items-start space-x-1 leading-tight">
          <span class="text-emerald-700 font-bold shrink-0 text-[7.5pt]">•</span>
          <span class="text-slate-800 text-[7.2pt]">${formatHighlightedText(critiqueText)}</span>
        </div>
      `);
    }
  }
  return rows.join("");
}

function renderPrintRadarSvg(rubrics, maxMarks) {
  const mm = parseFloat(maxMarks) || 10;
  const r = rubrics || {};

  const introMax = r.intro_max !== undefined ? r.intro_max : (mm * 0.15);
  const coreMax = r.core_demand_max !== undefined ? r.core_demand_max : (mm * 0.45);
  const valueMax = r.value_add_max !== undefined ? r.value_add_max : (mm * 0.15);
  const presMax = r.presentation_max !== undefined ? r.presentation_max : (mm * 0.10);
  const conclMax = r.conclusion_max !== undefined ? r.conclusion_max : (mm * 0.10);

  const introScore = r.intro_score !== undefined ? r.intro_score : (introMax * 0.5);
  const coreScore = r.core_demand_score !== undefined ? r.core_demand_score : (coreMax * 0.45);
  const valueScore = r.value_add_score !== undefined ? r.value_add_score : (valueMax * 0.35);
  const presScore = r.presentation_score !== undefined ? r.presentation_score : (r.structure_presentation_score || (presMax * 0.5));
  const conclScore = r.conclusion_score !== undefined ? r.conclusion_score : (conclMax * 0.5);

  // Normalized percentages (clamped 0.1 to 1.0)
  const candidatePcts = [
    Math.min(1.0, Math.max(0.1, introScore / (introMax || 2.0))),
    Math.min(1.0, Math.max(0.1, coreScore / (coreMax || 4.5))),
    Math.min(1.0, Math.max(0.1, valueScore / (valueMax || 1.5))),
    Math.min(1.0, Math.max(0.1, presScore / (presMax || 1.0))),
    Math.min(1.0, Math.max(0.1, conclScore / (conclMax || 1.0)))
  ];

  // Topper benchmark normalized percentages
  const topperPcts = [0.85, 0.80, 0.75, 0.85, 0.80];

  const cx = 110;
  const cy = 56;
  const R = 36;
  const numAxes = 5;

  // Angles starting from top (-pi/2) going clockwise
  const angles = [];
  for (let i = 0; i < numAxes; i++) {
    angles.push(-Math.PI / 2 + i * (2 * Math.PI / numAxes));
  }

  // 1. Grid webs (4 concentric levels: 25%, 50%, 75%, 100%)
  const webPolygons = [0.25, 0.5, 0.75, 1.0].map(level => {
    const pts = angles.map(ang => {
      const x = (cx + R * level * Math.cos(ang)).toFixed(1);
      const y = (cy + R * level * Math.sin(ang)).toFixed(1);
      return `${x},${y}`;
    }).join(" ");
    return `<polygon points="${pts}" fill="none" stroke="#E2E8F0" stroke-width="0.75"/>`;
  }).join("");

  // 2. Radial axis spokes
  const spokes = angles.map(ang => {
    const x = (cx + R * Math.cos(ang)).toFixed(1);
    const y = (cy + R * Math.sin(ang)).toFixed(1);
    return `<line x1="${cx}" y1="${cy}" x2="${x}" y2="${y}" stroke="#E2E8F0" stroke-width="0.75"/>`;
  }).join("");

  // 3. Axis labels
  const labelNames = ["Intro", "Core Demand", "Value Add", "Presentation", "Conclusion"];
  const labelElements = angles.map((ang, idx) => {
    const dist = R + 9;
    const x = cx + dist * Math.cos(ang);
    const y = cy + dist * Math.sin(ang);
    let anchor = "middle";
    let dy = "0.3em";
    if (idx === 0) {
      anchor = "middle";
      dy = "-0.3em";
    } else if (idx === 1) {
      anchor = "start";
      dy = "0.3em";
    } else if (idx === 2) {
      anchor = "start";
      dy = "0.8em";
    } else if (idx === 3) {
      anchor = "end";
      dy = "0.8em";
    } else if (idx === 4) {
      anchor = "end";
      dy = "0.3em";
    }
    return `<text x="${x.toFixed(1)}" y="${y.toFixed(1)}" text-anchor="${anchor}" dy="${dy}" font-family="Inter, system-ui, sans-serif" font-size="5.8px" font-weight="700" fill="#475569">${labelNames[idx]}</text>`;
  }).join("");

  // 4. Topper Benchmark Polygon
  const topperPts = angles.map((ang, idx) => {
    const x = (cx + R * topperPcts[idx] * Math.cos(ang)).toFixed(1);
    const y = (cy + R * topperPcts[idx] * Math.sin(ang)).toFixed(1);
    return `${x},${y}`;
  }).join(" ");
  const topperPolygon = `<polygon points="${topperPts}" fill="rgba(59, 130, 246, 0.08)" stroke="#3B82F6" stroke-width="1.2" stroke-dasharray="3,2"/>`;

  // 5. Candidate Polygon
  const candPtsArr = angles.map((ang, idx) => {
    const x = (cx + R * candidatePcts[idx] * Math.cos(ang)).toFixed(1);
    const y = (cy + R * candidatePcts[idx] * Math.sin(ang)).toFixed(1);
    return { x, y };
  });
  const candPts = candPtsArr.map(p => `${p.x},${p.y}`).join(" ");
  const candPolygon = `<polygon points="${candPts}" fill="rgba(245, 158, 11, 0.3)" stroke="#D97706" stroke-width="1.6"/>`;
  const candDots = candPtsArr.map(p => `<circle cx="${p.x}" cy="${p.y}" r="2" fill="#D97706" stroke="#FFFFFF" stroke-width="0.75"/>`).join("");

  // 6. Legend
  const legend = `
    <g transform="translate(38, 108)">
      <rect x="0" y="0" width="7" height="7" rx="1.5" fill="#F59E0B"/>
      <text x="10" y="6" font-family="Inter, system-ui, sans-serif" font-size="6px" font-weight="600" fill="#334155">Candidate</text>
      <line x1="68" y1="3.5" x2="80" y2="3.5" stroke="#3B82F6" stroke-width="1.5" stroke-dasharray="3,2"/>
      <text x="83" y="6" font-family="Inter, system-ui, sans-serif" font-size="6px" font-weight="600" fill="#334155">Topper Benchmark</text>
    </g>
  `;

  return `
    <svg viewBox="0 0 220 120" class="w-full max-w-[195px] h-auto overflow-visible" xmlns="http://www.w3.org/2000/svg">
      ${webPolygons}
      ${spokes}
      ${topperPolygon}
      ${candPolygon}
      ${candDots}
      ${labelElements}
      ${legend}
    </svg>
  `;
}

function populatePrintDossier(evalData) {
  if (!evalData) return;

  // 1. Docket Metadata & Header
  const candidateIdEl = document.getElementById("printCandidateId");
  const evalDateEl = document.getElementById("printEvalDate");
  const disciplineHeaderEl = document.getElementById("printDisciplineHeader");
  const maxMarksHeaderEl = document.getElementById("printMaxMarksHeader");
  const directiveHeaderEl = document.getElementById("printDirectiveHeader");

  const candidateId = state.user?.email || "MM-UPSC-2026-ASPIRANT";
  const evalDate = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  const discipline = evalData.detected_paper_display || evalData.paper_display || evalData.paper_title || state.paper || "GS-2 (Polity & Governance)";
  const maxMarks = evalData.max_marks || (state.marks || 10);
  const directive = evalData.directive_detected || (evalData.directive_compliance && evalData.directive_compliance.directive) || (typeof detectDirective === "function" ? detectDirective(state.question || "")?.label : "Critically Analyse") || "Critically Analyse";

  if (candidateIdEl) candidateIdEl.textContent = candidateId;
  if (evalDateEl) evalDateEl.textContent = evalDate;
  if (disciplineHeaderEl) disciplineHeaderEl.textContent = discipline;
  if (maxMarksHeaderEl) maxMarksHeaderEl.textContent = `${parseFloat(maxMarks).toFixed(1)} Marks • ${maxMarks === 10 ? '150' : '250'} Words`;
  if (directiveHeaderEl) directiveHeaderEl.textContent = directive;

  // 2. Score Summary Block
  const directivePillEl = document.getElementById("printDirectivePill");
  const questionTextEl = document.getElementById("printQuestionText");
  const overallScoreEl = document.getElementById("printOverallScore");
  const maxMarksSpanEl = document.getElementById("printMaxMarksSpan");
  const percentileTextEl = document.getElementById("printPercentileText");
  const directiveScoreTextEl = document.getElementById("printDirectiveScoreText");
  const executiveSummaryEl = document.getElementById("printExecutiveSummary");

  if (directivePillEl) directivePillEl.textContent = `Directive: ${directive}`;
  if (questionTextEl) questionTextEl.textContent = evalData.detected_question || state.question || "The doctrine of separation of powers is not rigidly followed in the Indian Constitution, yet checks and balances prevent authoritarianism. Critically analyse.";
  if (overallScoreEl) overallScoreEl.textContent = (parseFloat(evalData.overall_score) || 0.0).toFixed(1);
  if (maxMarksSpanEl) maxMarksSpanEl.textContent = `/ ${parseFloat(maxMarks).toFixed(1)} Marks`;
  if (percentileTextEl) percentileTextEl.textContent = evalData.percentile_verdict || evalData.score_band || "Above Average (Top 15%)";
  if (directiveScoreTextEl) directiveScoreTextEl.textContent = (evalData.directive_compliance && evalData.directive_compliance.adherence_score) ? `${evalData.directive_compliance.adherence_score} Directive Adherence` : "7/10 Directive Adherence";
  if (executiveSummaryEl) executiveSummaryEl.innerHTML = formatHighlightedText(evalData.executive_summary || "A structured, commendable response demonstrating sound constitutional knowledge. To break into the top percentile, substantiate core directives with recent judicial flashpoints.");

  // 3. Analytical Rubric Diagram (Vector SVG) & Horizontal Progress Bars (Image 2 Replica)
  const rubrics = evalData.rubric_scores || {};
  const mm = parseFloat(maxMarks) || 10;
  const introMax = (rubrics.intro_max !== undefined ? rubrics.intro_max : (mm * 0.15));
  const coreMax = (rubrics.core_demand_max !== undefined ? rubrics.core_demand_max : (mm * 0.45));
  const depthMax = (rubrics.presentation_max !== undefined ? rubrics.presentation_max : (mm * 0.10));
  const valueMax = (rubrics.value_add_max !== undefined ? rubrics.value_add_max : (mm * 0.15));
  const conclMax = (rubrics.conclusion_max !== undefined ? rubrics.conclusion_max : (mm * 0.10));

  const introScore = (rubrics.intro_score !== undefined ? rubrics.intro_score : (introMax * 0.5));
  const coreScore = (rubrics.core_demand_score !== undefined ? rubrics.core_demand_score : (coreMax * 0.45));
  const depthScore = (rubrics.presentation_score !== undefined ? rubrics.presentation_score : (rubrics.structure_presentation_score || (depthMax * 0.5)));
  const valueScore = (rubrics.value_add_score !== undefined ? rubrics.value_add_score : (valueMax * 0.35));
  const conclScore = (rubrics.conclusion_score !== undefined ? rubrics.conclusion_score : (conclMax * 0.5));

  const printAnalyticalScore = document.getElementById("printAnalyticalScoreLabel");
  if (printAnalyticalScore) {
    printAnalyticalScore.textContent = `Total: ${(parseFloat(evalData.overall_score) || 0.0).toFixed(1)} / ${mm.toFixed(1)}`;
  }

  const radarSvgContainer = document.getElementById("printRadarChartSvgContainer");
  if (radarSvgContainer) {
    radarSvgContainer.innerHTML = renderPrintRadarSvg(rubrics, mm);
  }

  const setPrintBar = (barId, textId, score, maxScore) => {
    const b = document.getElementById(barId);
    const t = document.getElementById(textId);
    if (t) t.textContent = `${score.toFixed(1)} / ${maxScore.toFixed(1)}`;
    if (b && maxScore > 0) {
      const pct = Math.min(100, Math.max(0, Math.round((score / maxScore) * 100)));
      b.style.width = `${pct}%`;
      if (pct < 40) {
        b.className = "bg-rose-500 h-full rounded-full";
      } else if (pct < 65) {
        b.className = "bg-amber-500 h-full rounded-full";
      } else {
        b.className = "bg-emerald-500 h-full rounded-full";
      }
    }
  };

  setPrintBar("printBarIntro", "printBarIntroText", introScore, introMax);
  setPrintBar("printBarCore", "printBarCoreText", coreScore, coreMax);
  setPrintBar("printBarValue", "printBarValueText", valueScore, valueMax);
  setPrintBar("printBarPres", "printBarPresText", depthScore, depthMax);
  setPrintBar("printBarConc", "printBarConcText", conclScore, conclMax);

  // 4. Directive Adherence Audit Card (Image 2 Replica)
  const dirData = evalData.directive_compliance || {};
  const printDirBadge = document.getElementById("printDirectiveAdherenceBadge");
  const printDirWord = document.getElementById("printDirectiveCommandWord");
  const printDirEval = document.getElementById("printDirectiveEvalText");
  const printDirLacuna = document.getElementById("printDirectiveLacunaText");

  if (printDirBadge) printDirBadge.textContent = dirData.adherence_score || "7/10";
  if (printDirWord) printDirWord.textContent = dirData.directive || directive || "Discuss";
  if (printDirEval) {
    printDirEval.innerHTML = formatHighlightedText(dirData.evaluation || "Balanced scrutiny across primary demand; candidate addressed core dimensions with structured flow.");
  }
  if (printDirLacuna) {
    printDirLacuna.innerHTML = formatHighlightedText(dirData.gap || "Differentiate administrative encroachment from fiscal deprivation by parastatals.");
  }

  // 5. Section-by-Section Forensic Audit (Image 2 Replica)
  const introAudit = evalData.intro_audit || {};
  const printIntroCritique = document.getElementById("printIntroCritique");
  const printIntroMissing = document.getElementById("printIntroMissingElements");
  const printIntroRewrite = document.getElementById("printIntroModelRewrite");

  if (printIntroCritique) {
    printIntroCritique.innerHTML = formatHighlightedText(introAudit.current_critique || "Good empirical hook, but lacks explicit constitutional grounding.");
  }
  if (printIntroMissing) {
    printIntroMissing.innerHTML = "";
    const missingItems = (introAudit.missing_elements && introAudit.missing_elements.length > 0)
      ? introAudit.missing_elements
      : ["Article 243W / 74th CAA", "Economic Data Anchor (66% GDP)"];
    missingItems.forEach(item => {
      const span = document.createElement("span");
      span.className = "px-1.5 py-0.2 rounded bg-rose-50 border border-rose-200 text-rose-900 font-mono text-[6.5pt] font-semibold";
      span.innerHTML = formatHighlightedText(item);
      printIntroMissing.appendChild(span);
    });
  }
  if (printIntroRewrite) {
    const rewriteContent = introAudit.model_intro_rewrite || "";
    printIntroRewrite.innerHTML = rewriteContent ? `"${formatHighlightedText(rewriteContent)}"` : "";
  }

  const bodyAudit = evalData.body_audit || {};
  const printBodyStrengths = document.getElementById("printBodyStrengthsList");
  const printBodyGaps = document.getElementById("printBodyGapsList");
  const printBodyDims = document.getElementById("printBodyMissingDimensionsList");

  if (printBodyStrengths) {
    printBodyStrengths.innerHTML = "";
    const strengths = (bodyAudit.strengths && bodyAudit.strengths.length > 0)
      ? bodyAudit.strengths
      : ["Structured subheadings dividing autonomy erosion and Way Ahead."];
    strengths.slice(0, 2).forEach(s => {
      const li = document.createElement("li");
      li.className = "flex items-start space-x-1";
      li.innerHTML = `<span class="text-emerald-600 font-bold shrink-0">✓</span><span>${formatHighlightedText(s)}</span>`;
      printBodyStrengths.appendChild(li);
    });
  }

  if (printBodyGaps) {
    printBodyGaps.innerHTML = "";
    const gaps = (bodyAudit.critical_gaps && bodyAudit.critical_gaps.length > 0)
      ? bodyAudit.critical_gaps
      : ["Need specific state parastatals (BDA, HUDA, BWSSB) to ground the critique."];
    gaps.slice(0, 2).forEach(g => {
      const li = document.createElement("li");
      li.className = "flex items-start space-x-1";
      li.innerHTML = `<span class="text-amber-600 font-bold shrink-0">🧭</span><span>${formatHighlightedText(g)}</span>`;
      printBodyGaps.appendChild(li);
    });
  }

  if (printBodyDims) {
    printBodyDims.innerHTML = "";
    const dims = (bodyAudit.missing_dimensions && bodyAudit.missing_dimensions.length > 0)
      ? bodyAudit.missing_dimensions
      : ["Institutional: Parastatals under Mayor-in-Council", "Fiscal: Property tax collection vs State SFC devolution"];
    dims.slice(0, 3).forEach(d => {
      const span = document.createElement("span");
      span.className = "px-1.5 py-0.2 rounded bg-slate-100 border border-slate-200 text-slate-800 font-medium text-[6.5pt]";
      span.innerHTML = formatHighlightedText(d);
      printBodyDims.appendChild(span);
    });
  }

  // 4. Micro-Hygiene & Presentation Polish (As shown in Image 3)
  const mh = evalData.micro_hygiene || {};
  const printSpellEl = document.getElementById("printHygieneSpelling");
  if (printSpellEl) {
    const spells = mh.spelling_errors || [];
    if (spells.length > 0) {
      printSpellEl.innerHTML = spells.map(s => `<div class="text-rose-700 font-medium">• ${escapeHtml(s)}</div>`).join("");
    } else {
      printSpellEl.innerHTML = `<span class="text-emerald-700 font-semibold">✓ Zero spelling errors detected</span>`;
    }
  }
  const printGramEl = document.getElementById("printHygieneGrammar");
  if (printGramEl) {
    printGramEl.innerHTML = formatHighlightedText(mh.grammar_and_syntax || "Syntax is clear and grammatically sound.");
  }
  const printPresEl = document.getElementById("printHygienePresentation");
  if (printPresEl) {
    printPresEl.innerHTML = formatHighlightedText(mh.presentation_and_word_count || "Legible handwriting with consistent paragraph structure.");
  }

  // 5. Page 2: Current Affairs & Value-Addition Multipliers (As shown in Image 1)
  const caData = evalData.current_affairs_value_add;
  const printCaExTarget = document.getElementById("printCaExampleTarget");
  const printCaMarksGain = document.getElementById("printCaMarksGainBadge");
  const printCaWeakness = document.getElementById("printCaCurrentWeakness");
  const printCaInsertion = document.getElementById("printCaRecommendedInsertion");
  const printCaDataList = document.getElementById("printCaDataReportsList");
  const printCaDiagTitle = document.getElementById("printCaDiagTitle");
  const printCaDiagStructure = document.getElementById("printCaDiagStructure");
  const printCaDiagTip = document.getElementById("printCaDiagTip");

  if (caData) {
    const exIns = caData.current_example_insertion || {};
    if (printCaExTarget) printCaExTarget.textContent = exIns.paragraph_target || "Body Paragraph 1, Point 1";
    if (printCaMarksGain) printCaMarksGain.textContent = exIns.marks_gain || "+0.5 Mark";
    if (printCaWeakness) printCaWeakness.textContent = exIns.current_weakness || "";
    if (printCaInsertion) printCaInsertion.innerHTML = formatHighlightedText(exIns.recommended_insertion || "");

    if (printCaDataList) {
      const reports = caData.high_yield_data_reports || [];
      if (reports.length > 0) {
        printCaDataList.innerHTML = reports.map(rep => `
          <li class="flex items-start space-x-1.5">
            <span class="text-emerald-700 font-bold shrink-0">•</span>
            <span>${formatHighlightedText(rep)}</span>
          </li>
        `).join("");
      } else {
        printCaDataList.innerHTML = `<li class="text-slate-500 italic">No specific reports cited</li>`;
      }
    }

    const diagRec = caData.diagram_recommendation || {};
    if (printCaDiagTitle) printCaDiagTitle.textContent = diagRec.concept_title || "Parallel Power Structure Conflict Matrix";
    if (printCaDiagStructure) printCaDiagStructure.textContent = diagRec.structure || "";
    if (printCaDiagTip) printCaDiagTip.textContent = `★ ${diagRec.exam_hall_sketch_tip || 'Draw a simple 30-second flowchart'}`;
  }

  // 6. Page 2: Constitutional Articles, Doctrines & Governance Frameworks (As shown in Image 1)
  const printMkHeading = document.getElementById("printMissingKeywordsHeading");
  if (printMkHeading) {
    printMkHeading.textContent = evalData.keyword_toolkit_title || "CONSTITUTIONAL ARTICLES, DOCTRINES & GOVERNANCE FRAMEWORKS";
  }
  const printMkGrid = document.getElementById("printMissingKeywordsGrid");
  if (printMkGrid) {
    printMkGrid.innerHTML = "";
    const cards = evalData.missing_keywords_cards || [];
    cards.forEach((c, idx) => {
      const tagText = c.domain_or_thinker || c.thinker || "Concept";
      const div = document.createElement("div");
      div.className = "p-1.5 rounded bg-white border border-slate-200 space-y-0.5";
      div.innerHTML = `
        <div class="flex items-center justify-between gap-1">
          <div class="flex items-center space-x-1">
            <span class="w-3.5 h-3.5 rounded-full bg-amber-100 text-amber-950 border border-amber-300 text-[6.8pt] font-extrabold flex items-center justify-center shrink-0">${c.number || (idx + 1)}</span>
            <span class="font-bold text-[7.5pt] text-slate-900 truncate max-w-[135px]">${escapeHtml(c.term || '')}</span>
          </div>
          <span class="text-[6.2pt] font-mono px-1 py-0.2 rounded bg-slate-100 border border-slate-300 text-slate-700 shrink-0">${escapeHtml(tagText)}</span>
        </div>
        <p class="text-[6.8pt] text-slate-700 leading-snug">${escapeHtml(c.definition || '')}</p>
        <div class="text-[6.8pt] text-emerald-800 font-semibold pt-0.5 border-t border-slate-100 flex items-center space-x-1">
          <span>🎯 ${escapeHtml(c.where_to_use || 'Plug into Body section')}</span>
        </div>
      `;
      printMkGrid.appendChild(div);
    });
  }

  // 7. Page 3: Mentor's Sentence-by-Sentence Rewrite Studio (As shown in Image 2)
  const na = evalData.next_attempt_focus || evalData.mentor_rewrite || {};
  const printNaBadge = document.getElementById("printNextAttemptTargetBadge");
  const printDraftQuote = document.getElementById("printStudentDraftQuote");
  const printTopperTrans = document.getElementById("printTopperTransformation");
  const printMarksUnlocked = document.getElementById("printMarksUnlocked");
  const printPlacement = document.getElementById("printBookletPlacement");

  if (printNaBadge) printNaBadge.textContent = na.target_section || "Body & Application to Student Context (-1.5 Marks Recoverable)";
  if (printDraftQuote) printDraftQuote.textContent = na.student_draft_quote || na.what_candidate_wrote || "";
  if (printTopperTrans) printTopperTrans.innerHTML = formatHighlightedText(na.topper_transformation || na.mentor_topper_transformation || "");
  if (printMarksUnlocked) printMarksUnlocked.textContent = na.mentor_why || na.why_it_earns_marks || "Connecting functional overlap to constitutional articles gains +0.5 to +1.0M.";
  if (printPlacement) printPlacement.textContent = na.booklet_placement || na.where_to_place_in_sheet || "Replace Point 1 under the first subheading.";

  // 8. Page 3: UPSC Topper Answer Copy Blueprint (As shown in Image 2)
  const printBpIntro = document.getElementById("printBlueprintIntro");
  const printBpFlowchart = document.getElementById("printBlueprintFlowchart");
  const printBpBody = document.getElementById("printBlueprintBody");

  const modelAnswer = evalData.full_model_answer || evalData.model_answer || "";
  let introText = "";
  let bodyHtml = "";

  if (modelAnswer) {
    const introMatch = modelAnswer.match(/\*\*Introduction\*\*\s*([\s\S]*?)(?=\n\*\*|\n##|\n---|$)/i) ||
                       modelAnswer.match(/Introduction:\s*([\s\S]*?)(?=\n[A-Z0-9#]|\n---|$)/i);
    if (introMatch) {
      introText = introMatch[1].trim();
    } else {
      introText = modelAnswer.split("\n\n")[0] || "";
    }

    let restText = modelAnswer;
    if (introMatch) {
      restText = modelAnswer.replace(introMatch[0], "").trim();
    }
    // Remove schematic / flowchart block from restText so it doesn't duplicate the flowchart box above it
    restText = restText.replace(/\[EXAM-HALL SCHEMATIC[^\]]*\][\s\S]*?(?=\n\s*\n\s*[A-Za-z*#]|$)/gi, "").trim();
    restText = restText.replace(/(?:^[ \t]*[+|].*(?:\r?\n|$))+/gm, "").trim();
    restText = restText.replace(/\+[-+=| ]+\+/g, "").trim();
    bodyHtml = formatModelBlock(restText);
  }

  if (printBpIntro) printBpIntro.innerHTML = formatHighlightedText(introText);
  if (printBpFlowchart) {
    printBpFlowchart.textContent = evalData.recommended_diagram_visual || 
`+-------------------------------------------------+
|            PARALLEL POWER CONFLICT              |
|               State Government                  |
|                 /          \\                    |
|   (Direct Funds)             (No Devolution)    |
|               v              v                  |
|          Parastatals <----> ULBs (Elected)      |
|         (SPVs, UDAs)  Conflict (No Autonomy)    |
+-------------------------------------------------+`;
  }
  if (printBpBody) printBpBody.innerHTML = bodyHtml;
}

function renderListItems(elementId, items) {
  const el = document.getElementById(elementId);
  if (!el) return;
  el.innerHTML = "";
  if (!items || items.length === 0) {
    el.innerHTML = "<li class='text-slate-500 italic'>None required for this question</li>";
    return;
  }
  items.forEach(item => {
    const li = document.createElement("li");
    li.className = "text-[11px] text-slate-300 flex items-start space-x-1.5";
    li.innerHTML = `<span class="text-amber-400 font-bold">•</span><span>${formatHighlightedText(item)}</span>`;
    el.appendChild(li);
  });
}

function formatModelBlock(text) {
  if (!text) return "";
  let s = text;
  // Strip any schematic/flowchart blocks completely
  s = s.replace(/\[EXAM-HALL SCHEMATIC[^\]]*\][\s\S]*?(?=\n\s*\n\s*[A-Za-z*#]|$)/gi, "");
  // Strip any multiline ASCII box/table blocks
  s = s.replace(/(?:^[ \t]*[+|].*(?:\r?\n|$))+/gm, "");
  // Strip any leftover sequences of +, -, |, >
  s = s.replace(/(?:(?:\+|\-|\=|\>|\|)\s*){3,}/g, " ");
  s = s.replace(/\|\s*(?:Statutory|Fundamental|Basic|Validity|Rights|Struct)\b[^<]*/gi, "");
  s = s.replace(/\+\s*\+\s*\|+/g, "");
  s = s.replace(/\|\s*\+\s*\+/g, "");
  // Convert any lines starting with ### or #### into clean bold UPSC subheadings
  s = s.replace(/^(?:#{3,6})\s+(.*)$/gm, '<div class="text-[7pt] font-bold text-slate-950 uppercase tracking-wide mt-1 mb-0.5">$1</div>');
  s = s.replace(/^(?:#{1,2})\s+(.*)$/gm, '<div class="text-[7.2pt] font-bold text-slate-950 uppercase tracking-wider mt-1 mb-0.5">$1</div>');
  // Convert standalone bold lines like **Snapshot...** or **Way Forward**
  s = s.replace(/^\*\*([^*]+)\*\*$/gm, '<div class="text-[7pt] font-bold text-slate-950 uppercase tracking-wide mt-1 mb-0.5">$1</div>');
  // Strip any lingering markdown header hashes
  s = s.replace(/^#{1,6}\s*/gm, '');
  s = s.replace(/^\s*[-•*]\s+/gm, '• ');
  s = s.replace(/\n• /g, '<br>• ');
  s = s.replace(/\n(?=[A-Za-z0-9])/g, '<br>');
  s = s.replace(/\*\*(.*?)\*\*/g, '<strong class="text-blue-900 font-bold">$1</strong>');
  s = s.replace(/\*(.*?)\*/g, '<em class="text-blue-700 font-serif">$1</em>');
  return s.trim();
}

// Inline Interactive Glossary Injector (Walks Text Nodes to Prevent Tag Corruption)
function injectInlineGlossary(container, glossaryMap) {
  if (!container || !glossaryMap) return;
  const terms = Object.keys(glossaryMap).filter(t => t && t.length > 2).sort((a, b) => b.length - a.length);
  if (terms.length === 0) return;

  const walker = document.createTreeWalker(
    container,
    NodeFilter.SHOW_TEXT,
    {
      acceptNode(node) {
        if (!node.nodeValue || !node.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
        const parent = node.parentElement;
        if (!parent) return NodeFilter.FILTER_REJECT;
        const tag = parent.tagName.toLowerCase();
        if (['pre', 'code', 'script', 'style', 'button', 'th', 'h1', 'h2', 'h3', 'h4'].includes(tag) || parent.closest('.inline-kw-target') || parent.closest('.topper-anchor-title')) {
          return NodeFilter.FILTER_REJECT;
        }
        return NodeFilter.FILTER_ACCEPT;
      }
    }
  );

  const textNodes = [];
  let currentNode;
  while ((currentNode = walker.nextNode())) {
    textNodes.push(currentNode);
  }

  const replacedCounts = {};

  textNodes.forEach(node => {
    let text = node.nodeValue;
    if (!text || text.trim().length < 3) return;

    for (const term of terms) {
      if ((replacedCounts[term] || 0) >= 2) continue;

      const escapedTerm = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(`(^|[^a-zA-Z0-9])(${escapedTerm})([^a-zA-Z0-9]|$)`, 'i');
      const match = regex.exec(text);

      if (match) {
        const lead = match[1];
        const matchText = match[2];
        const matchIndex = match.index + lead.length;

        const beforeText = text.substring(0, matchIndex);
        const afterText = text.substring(matchIndex + matchText.length);

        const span = document.createElement('span');
        span.className = 'inline-kw-target';
        span.tabIndex = 0;

        const displayTerm = term.charAt(0).toUpperCase() + term.slice(1);
        const meaning = glossaryMap[term] || '';

        span.innerHTML = `<span class="inline-kw-text">${escapeHtml(matchText)}</span><span class="inline-kw-badge">ⓘ</span><span class="inline-kw-tooltip"><strong>${escapeHtml(displayTerm)}</strong>: ${escapeHtml(meaning)}</span>`;

        const parent = node.parentNode;
        if (parent) {
          if (beforeText) parent.insertBefore(document.createTextNode(beforeText), node);
          parent.insertBefore(span, node);
          node.nodeValue = afterText;
          replacedCounts[term] = (replacedCounts[term] || 0) + 1;
          text = afterText;
        }
      }
    }
  });
}

// Actionable Value Addition Categories Renderer
function renderValueAddCategories(vaData, paper, question) {
  const grid = document.getElementById("valueAddCategoriesGrid");
  if (!grid) return;
  grid.innerHTML = "";

  if (!vaData || typeof vaData !== "object") {
    grid.innerHTML = `<p class="text-slate-500 italic text-xs">No value-addition checklist generated.</p>`;
    return;
  }

  let categories = [];
  if (vaData.category_1 || vaData.category_2 || vaData.category_3 || vaData.category_4) {
    ['category_1', 'category_2', 'category_3', 'category_4'].forEach((catKey, idx) => {
      const cat = vaData[catKey];
      if (cat) {
        categories.push({
          title: cat.title || `Category ${idx + 1}`,
          items: Array.isArray(cat.items) ? cat.items : []
        });
      }
    });
  } else {
    // Legacy fallback
    const isGeo = (paper === "GS1" || /volcano|geomorph|earthquake|climate|plate tectonic/i.test(question || ""));
    categories = [
      {
        title: isGeo ? "Global Frameworks, Conventions & Policies" : "Constitutional Articles & Judicial Precedents",
        items: (vaData.constitutional_articles_or_scholars || vaData.constitutional_articles || []).map(it => ({
          item: typeof it === "string" ? it : it.item,
          where_to_write: it.where_to_write || "In Introduction or relevant analytical sub-heading",
          how_to_write: it.how_to_write || `Substantiate point: Integrate ${typeof it === 'string' ? it : it.item} directly into your 2-line assertion.`
        }))
      },
      {
        title: isGeo ? "Scientific Theories & Geomorphic Models" : "Committees, Reports & Doctrines",
        items: (vaData.sc_judgments_or_theories || vaData.sc_judgments_or_reports || []).map(it => ({
          item: typeof it === "string" ? it : it.item,
          where_to_write: it.where_to_write || "In Body addressing core evaluation",
          how_to_write: it.how_to_write || `Theoretical anchor: Cite to ground causal explanation.`
        }))
      },
      {
        title: "Empirical Data, Case Studies & Real-World Flashpoints",
        items: (vaData.data_and_facts || []).map(it => ({
          item: typeof it === "string" ? it : it.item,
          where_to_write: it.where_to_write || "In Body to provide quantitative evidence",
          how_to_write: it.how_to_write || `Empirical proof: Back assertion with concrete numbers.`
        }))
      },
      {
        title: "Recommended Exam-Hall Micro-Diagram / Map",
        items: (vaData.schematics_or_maps || []).map(it => ({
          item: typeof it === "string" ? it : it.item,
          where_to_write: it.where_to_write || "Page 1 margin or center micro-box (<45 seconds)",
          how_to_write: it.how_to_write || `Visual anchor: Sketch concise schematic to fetch +1 mark.`
        }))
      }
    ];
  }

  const catThemes = [
    { border: "border-sky-500/30", text: "text-sky-400", badge: "bg-sky-500/10 text-sky-300 border-sky-500/20", icon: "shield" },
    { border: "border-indigo-500/30", text: "text-indigo-400", badge: "bg-indigo-500/10 text-indigo-300 border-indigo-500/20", icon: "book-open" },
    { border: "border-emerald-500/30", text: "text-emerald-400", badge: "bg-emerald-500/10 text-emerald-300 border-emerald-500/20", icon: "bar-chart-3" },
    { border: "border-amber-500/30", text: "text-amber-400", badge: "bg-amber-500/10 text-amber-300 border-amber-500/20", icon: "git-merge" }
  ];

  categories.forEach((cat, idx) => {
    if (!cat.items || cat.items.length === 0) return;
    const theme = catThemes[idx % catThemes.length];
    const card = document.createElement("div");
    card.className = `va-cat-card p-3.5 rounded-xl bg-slate-900/90 border ${theme.border} space-y-2.5`;

    let itemsHtml = "";
    cat.items.forEach(it => {
      itemsHtml += `
        <div class="va-item-box p-2.5 rounded-lg bg-slate-950 border border-slate-800/80 space-y-1.5">
          <div class="va-item-title text-xs font-bold text-slate-900 dark:text-slate-100 flex items-start justify-between gap-1">
            <span>${escapeHtml(it.item)}</span>
          </div>
          <div class="va-where-to-write text-[10px] text-sky-700 dark:text-sky-300 font-medium flex items-center space-x-1.5">
            <i data-lucide="map-pin" class="w-3 h-3 text-sky-600 dark:text-sky-400 shrink-0"></i>
            <span><strong>Where to Write:</strong> ${escapeHtml(it.where_to_write)}</span>
          </div>
          <div class="va-how-to-write-box p-2.5 rounded-md bg-amber-50 dark:bg-amber-950/20 border border-amber-300/70 dark:border-amber-500/30 text-[11px] leading-relaxed font-sans">
            <span class="va-how-to-write-title text-[9.5px] font-bold text-amber-800 dark:text-amber-400 uppercase tracking-wider block mb-0.5">✍️ How to Write (2-Line Exam Format):</span>
            <span class="va-how-to-write-content text-slate-800 dark:text-slate-200 font-medium">${escapeHtml(it.how_to_write)}</span>
          </div>
        </div>
      `;
    });

    card.innerHTML = `
      <div class="flex items-center justify-between pb-1.5 border-b border-slate-800">
        <span class="text-[11px] font-bold ${theme.text} uppercase tracking-wider flex items-center space-x-1.5">
          <i data-lucide="${theme.icon}" class="w-3.5 h-3.5"></i>
          <span>${escapeHtml(cat.title)}</span>
        </span>
        <span class="text-[9px] font-semibold px-2 py-0.5 rounded border ${theme.badge}">${cat.items.length} ${cat.items.length === 1 ? 'Element' : 'Elements'}</span>
      </div>
      <div class="space-y-2 pt-0.5">
        ${itemsHtml}
      </div>
    `;
    grid.appendChild(card);
  });

  if (window.lucide) {
    try { window.lucide.createIcons({ root: grid }); } catch (e) {}
  }
}

// Revamped Authentic UPSC Topper Model Answer Renderer
function renderModelAnswer(fullText, diagramVisual, maxMarks) {
  const container = document.getElementById("fullModelAnswerContainer");
  const hiddenPre = document.getElementById("fullModelAnswerText");
  if (hiddenPre) hiddenPre.textContent = fullText || "";
  if (!container) return;

  if (!fullText) {
    container.innerHTML = `<p class="text-slate-500 italic">No model answer generated.</p>`;
    return;
  }

  // Update Metadata Badges
  const budgetBadge = document.getElementById("modelWordBudgetBadge");
  const timeBadge = document.getElementById("modelTimeBadge");
  const benchBadge = document.getElementById("modelBenchmarkBadge");
  const mm = maxMarks || state.marks || 20;

  if (budgetBadge && timeBadge && benchBadge) {
    if (mm === 10) {
      budgetBadge.textContent = "Target: ~150 Words";
      timeBadge.textContent = "Time: 7 Mins";
      benchBadge.textContent = "6.0 / 10.0 (Top 1%)";
    } else if (mm === 15) {
      budgetBadge.textContent = "Target: ~250 Words";
      timeBadge.textContent = "Time: 9 Mins";
      benchBadge.textContent = "9.5 / 15.0 (Top 1%)";
    } else if (mm === 20) {
      budgetBadge.textContent = "Target: ~300 Words";
      timeBadge.textContent = "Time: 11 Mins";
      benchBadge.textContent = "13.5 / 20.0 (Top 1%)";
    } else {
      budgetBadge.textContent = "Target: 1000–1200 Words";
      timeBadge.textContent = "Time: 90 Mins";
      benchBadge.textContent = "75+ / 125.0 (Top 1%)";
    }
  }

  let processedText = fullText;
  if (diagramVisual && !processedText.includes("+---") && !processedText.includes("┌──") && !processedText.includes("[EXAM-HALL")) {
    const parts = processedText.split(/\n(?=(?:1\.|2\.|Body|Dimension))/i);
    if (parts.length > 1) {
      processedText = `${parts[0]}\n\n[EXAM-HALL SCHEMATIC / FLOWCHART]:\n${diagramVisual}\n\n${parts.slice(1).join('\n')}`;
    } else {
      processedText = `${processedText}\n\n[EXAM-HALL SCHEMATIC / FLOWCHART]:\n${diagramVisual}`;
    }
  }

  // Apply UPSC Ruled Paper aesthetic
  container.className = "space-y-3.5 upsc-booklet-paper p-5 sm:p-7 rounded-2xl border border-slate-800 text-xs text-slate-200 leading-relaxed font-serif";

  const blocks = processedText.split(/\n\s*\n/);
  let html = "";
  blocks.forEach(block => {
    let b = block.trim();
    if (!b) return;

    // 1. Exam-Hall Flowchart / ASCII Diagram
    if (b.includes("+---") || b.includes("┌──") || b.includes("|  ") || b.includes("[EXAM-HALL")) {
      const cleanDiagram = b.replace(/\[EXAM-HALL.*?\]:?\s*/i, '');
      html += `
        <div class="my-4 p-4 rounded-xl bg-slate-900/95 border-2 border-amber-500/40 text-emerald-300 font-mono text-xs leading-relaxed whitespace-pre overflow-x-auto shadow-2xl">
          <div class="text-[10px] font-extrabold text-amber-400 uppercase tracking-wider mb-1.5 flex items-center justify-between">
            <span class="flex items-center space-x-1.5">
              <i data-lucide="git-merge" class="w-3.5 h-3.5 text-amber-400"></i>
              <span>Exam-Hall Flowchart (Topper Schematic):</span>
            </span>
            <span class="text-emerald-400 font-sans font-semibold text-[9px] bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">Draw in 45 secs</span>
          </div>
          ${cleanDiagram}
        </div>
      `;
      return;
    }

    // 2. Markdown Table (e.g. Distinction Matrices)
    if (b.includes("|") && b.includes("---")) {
      const rows = b.split('\n').filter(r => r.trim().startsWith('|'));
      let tableHtml = '<div class="my-3 overflow-x-auto"><table class="min-w-full text-xs border-collapse border border-slate-700 bg-slate-950/80 rounded-lg overflow-hidden">';
      let isHeader = true;
      rows.forEach((row) => {
        if (row.includes('---')) {
          isHeader = false;
          return;
        }
        const cells = row.split('|').map(c => c.trim()).filter((c, i, a) => i > 0 && i < a.length - 1);
        if (cells.length === 0) return;
        if (isHeader) {
          tableHtml += '<tr class="bg-amber-500/15 text-amber-300 font-bold border-b border-slate-700">';
          cells.forEach(c => { tableHtml += `<th class="px-3 py-2 text-left border-r border-slate-800 last:border-r-0 font-sans">${formatModelBlock(c)}</th>`; });
          tableHtml += '</tr>';
          isHeader = false;
        } else {
          tableHtml += '<tr class="border-b border-slate-800/80 hover:bg-slate-900/50">';
          cells.forEach(c => { tableHtml += `<td class="px-3 py-2 border-r border-slate-800/80 last:border-r-0 text-slate-200">${formatModelBlock(c)}</td>`; });
          tableHtml += '</tr>';
        }
      });
      tableHtml += '</table></div>';
      html += tableHtml;
      return;
    }

    // 3. Horizontal Separator (--- or ***): Subtle line, ZERO question mark boxes!
    if (/^---+$/.test(b) || /^\*\*\*+$/.test(b)) {
      html += `<div class="my-3 border-t border-slate-800/80"></div>`;
      return;
    }

    // 4. Actual Question Prompt Box (Q. or Question:)
    if (/^(?:Q\.|Question[:\s])/i.test(b)) {
      html += `
        <div class="p-3 rounded-xl bg-blue-500/10 border border-blue-500/25 text-blue-950 dark:text-blue-200 text-xs font-semibold font-sans flex items-start space-x-2">
          <i data-lucide="help-circle" class="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5"></i>
          <span>${formatModelBlock(b)}</span>
        </div>
      `;
      return;
    }

    // 5. Topper Initial Anchor / Snapshot Box (Eliminates meta [INITIAL VALUE-ADDITION BOX])
    if (/^(?:\[?(?:INITIAL\s+)?VALUE-ADD(?:ITION)?\s+BOX\]?|(?:\*\*)?(?:Snapshot|At a Glance):?)/i.test(b) || (b.toLowerCase().includes("snapshot:") && b.includes("•"))) {
      let cleanBox = b.replace(/^(?:\*\*)?\[?(?:INITIAL\s+)?VALUE-ADD(?:ITION)?\s+BOX\]?(?:\*\*)?:?\s*/i, '');
      cleanBox = cleanBox.replace(/^(?:\*\*)?(?:Snapshot|At a Glance)[^:\n]*:?(?:\*\*)?\s*/i, '');
      html += `
        <div class="topper-anchor-box my-3 p-3.5 sm:p-4 rounded-xl bg-blue-50/80 dark:bg-slate-950/90 border border-blue-200 dark:border-blue-500/40 shadow-sm dark:shadow-xl space-y-2">
          <div class="topper-anchor-title text-xs font-bold text-blue-900 dark:text-blue-300 uppercase tracking-wide flex items-center justify-between border-b border-blue-200 dark:border-blue-500/25 pb-1.5 font-sans">
            <span class="flex items-center space-x-1.5">
              <i data-lucide="layout-grid" class="w-3.5 h-3.5 text-blue-600 dark:text-blue-400"></i>
              <span>Snapshot: Core Dimensions at a Glance</span>
            </span>
            <span class="text-[9px] text-blue-700 dark:text-blue-300 font-sans font-semibold bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">Page 1 Anchor Box</span>
          </div>
          <div class="topper-anchor-content text-xs text-slate-800 dark:text-slate-200 leading-relaxed font-sans">
            ${formatModelBlock(cleanBox.trim())}
          </div>
        </div>
      `;
      return;
    }

    // 6. Section Headings (starts with #{1,6}, numbers like 1., or (a), (b), or Introduction / Conclusion)
    const lines = b.split('\n');
    const firstLine = lines[0].trim();
    const isHeadingBlock = /^(?:#{1,6}\s+|(?:\d+\.|\([a-zA-Z0-9]+\)|[a-zA-Z]\))\s+|Introduction|Conclusion|Way Forward|Dimension|Recommendation)/i.test(firstLine);

    if (isHeadingBlock) {
      const cleanHeading = firstLine.replace(/^#{1,6}\s*/, '').replace(/^\*\*(.*?)\*\*$/, '$1').trim();
      const restLines = lines.slice(1).join('\n').trim();
      const formattedRest = restLines ? formatModelBlock(restLines) : "";

      html += `
        <div class="pt-2.5 space-y-1.5 border-t border-slate-200 dark:border-slate-800/80 first:border-t-0">
          <div class="text-xs font-bold font-sans text-blue-900 dark:text-blue-300 uppercase tracking-wide flex items-center space-x-1.5">
            <span class="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400"></span>
            <span>${cleanHeading}</span>
          </div>
          ${formattedRest ? `<div class="pl-3.5 border-l-2 border-blue-500/30 dark:border-blue-400/30 text-slate-800 dark:text-slate-200 leading-relaxed">${formattedRest}</div>` : ''}
        </div>
      `;
      return;
    }

    // 7. Regular Paragraph / Bullet Block
    let formatted = formatModelBlock(b);
    html += `<div class="text-slate-800 dark:text-slate-200 leading-relaxed text-xs pl-3.5 border-l-2 border-slate-300 dark:border-slate-700/40">${formatted}</div>`;
  });

  container.innerHTML = html;
  injectInlineGlossary(container, state.glossaryMap);
  if (window.lucide) {
    try { window.lucide.createIcons({ root: container }); } catch (e) {}
  }
}

window.copyPlugAndPlaySentence = function() {
  const el = document.getElementById("nextAttemptExample");
  if (el) {
    navigator.clipboard.writeText(el.textContent.trim());
    alert("Plug-and-play model sentence copied to clipboard!");
  }
};

// Chart.js Radar Chart
function renderRadar(rubric, maxMarks, isPrintMode = false) {
  if (!rubric) return;
  const ctx = document.getElementById("rubricRadarChart").getContext("2d");

  // Normalize scores to percentage (0-100%)
  const dataPoints = [
    Math.min(100, Math.round((rubric.intro_score / (rubric.intro_max || 1.5)) * 100)),
    Math.min(100, Math.round((rubric.core_demand_score / (rubric.core_demand_max || 4.5)) * 100)),
    Math.min(100, Math.round((rubric.value_add_score / (rubric.value_add_max || 2.0)) * 100)),
    Math.min(100, Math.round((rubric.presentation_score / (rubric.presentation_max || 1.0)) * 100)),
    Math.min(100, Math.round((rubric.conclusion_score / (rubric.conclusion_max || 1.0)) * 100))
  ];

  if (radarChartInstance) {
    radarChartInstance.destroy();
  }

  const isDark = document.documentElement.classList.contains("dark") && !isPrintMode;
  const gridColor = isDark ? "rgba(51, 65, 85, 0.4)" : isPrintMode ? "#cbd5e1" : "rgba(203, 213, 225, 0.7)";
  const labelColor = isDark ? "#94a3b8" : "#0f172a";

  radarChartInstance = new Chart(ctx, {
    type: "radar",
    data: {
      labels: ["Introduction", "Core Demand", "Value Addition", "Presentation", "Conclusion"],
      datasets: [{
        label: "Your Score %",
        data: dataPoints,
        backgroundColor: isPrintMode ? "rgba(180, 83, 9, 0.25)" : "rgba(245, 158, 11, 0.25)",
        borderColor: isPrintMode ? "#b45309" : "rgba(245, 158, 11, 0.9)",
        pointBackgroundColor: isPrintMode ? "#b45309" : "#f59e0b",
        pointBorderColor: "#fff",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: "#f59e0b",
        borderWidth: isPrintMode ? 2.5 : 2
      }, {
        label: "Topper Benchmark",
        data: [85, 80, 75, 85, 80],
        backgroundColor: isPrintMode ? "rgba(71, 85, 105, 0.12)" : "rgba(59, 130, 246, 0.08)",
        borderColor: isPrintMode ? "#334155" : "rgba(59, 130, 246, 0.5)",
        borderDash: [4, 4],
        pointRadius: 0,
        borderWidth: isPrintMode ? 2 : 1.5
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        r: {
          angleLines: { color: gridColor },
          grid: { color: gridColor },
          pointLabels: {
            color: labelColor,
            font: { size: isPrintMode ? 9 : 10, family: "Inter", weight: "700" }
          },
          ticks: {
            display: false,
            min: 0,
            max: 100
          }
        }
      },
      plugins: {
        legend: {
          position: "bottom",
          labels: {
            color: labelColor,
            boxWidth: isPrintMode ? 8 : 10,
            padding: isPrintMode ? 4 : 8,
            font: { size: isPrintMode ? 8.5 : 10, weight: "600" }
          }
        }
      }
    }
  });
}

// =========================================================================
// PRINT & PDF EXPORT ENGINES
// Mode 1 (DEFAULT): Evaluated Copy (ONLY SHOW UPLOADED COPIES, MATCHING IMAGE 2)
// Mode 2 (OPTIONAL): Analytical Forensic Dossier (3-Page Scorecard Template)
// =========================================================================

function formatPrintCardBullets(text) {
  if (!text) return "";
  const cleanText = String(text).trim();
  const rawLines = cleanText.split(/\n+/).map(l => l.trim()).filter(Boolean);
  const lines = (rawLines.length > 0) ? rawLines : [cleanText];

  return lines.map(line => {
    let icon = "•";
    let iconColor = "#D97706";
    let cleanLine = line;

    if (cleanLine.startsWith("✓") || cleanLine.startsWith("✔")) {
      icon = "✓";
      iconColor = "#10B981";
      cleanLine = cleanLine.replace(/^[✓✔]\s*/, "");
    } else if (cleanLine.startsWith("✗") || cleanLine.startsWith("×") || cleanLine.startsWith("✘")) {
      icon = "✗";
      iconColor = "#EF4444";
      cleanLine = cleanLine.replace(/^[✗×✘]\s*/, "");
    } else if (cleanLine.startsWith("✎") || cleanLine.startsWith("⚡") || cleanLine.startsWith("Add:") || cleanLine.startsWith("Missing:")) {
      icon = "✎";
      iconColor = "#D97706";
      cleanLine = cleanLine.replace(/^[✎⚡]\s*/, "");
    } else if (cleanLine.startsWith("★") || cleanLine.startsWith("⭐")) {
      icon = "★";
      iconColor = "#D97706";
      cleanLine = cleanLine.replace(/^[★⭐]\s*/, "");
    }

    // Convert leading **Tag**: into chip badge (e.g., Good Economic Data, Missing, Structured Points)
    const tagMatch = cleanLine.match(/^\*\*([^*]+)\*\*:\s*(.*)$/);
    let bodyHtml = "";
    if (tagMatch) {
      const chipTag = tagMatch[1].trim();
      const rest = tagMatch[2].trim();
      const isNegative = /missing|omission|deficit|gap|lack|weakness/i.test(chipTag);
      const chipClass = isNegative ? "print-chip-rose" : "print-chip-amber";

      // Highlight any inner **term** in rest as print-chip-amber
      const highlightedRest = rest.replace(/\*\*([^*]+)\*\*/g, '<span class="print-chip-amber">$1</span>');
      bodyHtml = `<span class="${chipClass}">${escapeHtml(chipTag)}</span> : ${highlightedRest}`;
    } else {
      bodyHtml = cleanLine.replace(/\*\*([^*]+)\*\*/g, '<span class="print-chip-amber">$1</span>');
    }

    return `
      <div class="print-bullet-row">
        <span class="print-bullet-icon" style="color: ${iconColor}; font-weight: 800; font-size: 8.5pt;">${icon}</span>
        <div class="print-bullet-content" style="font-size: 7.8pt; line-height: 1.35; color: #1E293B;">${bodyHtml}</div>
      </div>
    `;
  }).join("");
}

function populatePrintAnnotatedCopies(evalData, pages, targetContainer) {
  const container = targetContainer || document.getElementById("evaluatedPrintPreviewContainer") || document.getElementById("printAnnotatedCopiesContainer");
  if (!container) return;
  container.innerHTML = "";

  let pagesToPrint = (pages && pages.length > 0) ? pages : [];
  if (pagesToPrint.length === 0) {
    if (state.activePages && state.activePages.length > 0) {
      pagesToPrint = state.activePages;
    } else if (state.originalPages && state.originalPages.length > 0) {
      pagesToPrint = state.originalPages;
    } else if (state.rewrittenPages && state.rewrittenPages.length > 0) {
      pagesToPrint = state.rewrittenPages;
    } else {
      const activeImg = document.getElementById("activePageImage");
      if (activeImg && activeImg.src && !activeImg.src.includes("data:image/svg") && !activeImg.src.endsWith("/")) {
        pagesToPrint = [activeImg.src];
      }
    }
  }

  if (pagesToPrint.length === 0) {
    container.innerHTML = `
      <div class="print-copy-sheet flex items-center justify-center p-8 bg-white text-slate-800 rounded-lg">
        <p class="text-sm font-bold text-slate-700">No uploaded answer script available to export.</p>
      </div>
    `;
    return;
  }

  const evaluation = evalData || state.currentEvaluation || {};
  const overallScore = (parseFloat(evaluation.overall_score) || 0.0).toFixed(1);
  const maxMarks = evaluation.max_marks || state.marks || 10;
  const paper = evaluation.detected_paper_display || evaluation.paper_title || state.paper || "GS-2";
  const annotations = evaluation.visual_annotations || evaluation.annotations || [];
  const totalPages = pagesToPrint.length;

  pagesToPrint.forEach((dataUrl, idx) => {
    const pageNum = idx + 1;
    const pageAnns = annotations.filter(a => (parseInt(a.page, 10) || 1) === pageNum);

    let pageScoreStr = "";
    let pageScoreSum = 0;
    let pageScoreMax = 0;
    pageAnns.forEach(a => {
      if (a.marks_awarded && a.type !== "info") {
        const m = String(a.marks_awarded).match(/([+-]?\d+(?:\.\d+)?)\s*\/\s*(\d+(?:\.\d+)?)/);
        if (m) {
          pageScoreSum += parseFloat(m[1]);
          pageScoreMax += parseFloat(m[2]);
        }
      }
    });
    if (pageScoreMax > 0) {
      pageScoreStr = `+${pageScoreSum.toFixed(1)} / ${pageScoreMax.toFixed(1)}`;
    }

    // Build authentic UPSC sections with curly braces and margin cards matching Image 4
    let sections = [];
    if (totalPages === 1) {
      const rawIntro = pageAnns.find(a => {
        const t = String(a.tag || "").toLowerCase();
        return t.includes("intro") || t.includes("premise") || t.includes("definition");
      });
      const rawConcl = pageAnns.find(a => {
        const t = String(a.tag || "").toLowerCase();
        return t.includes("concl") || t.includes("synthesis");
      });
      const rawBody = pageAnns.find(a => {
        const t = String(a.tag || "").toLowerCase();
        return !t.includes("intro") && !t.includes("premise") && !t.includes("definition") && !t.includes("concl") && !t.includes("synthesis");
      });

      const introMarks = rawIntro ? (rawIntro.marks_awarded || "+1.0 / 2.0") : "+1.0 / 2.0";
      const introRemark = rawIntro ? rawIntro.remark : "✓ **Clear Opening Hook**: Addresses the core constitutional premise.";
      const bodyMarks = rawBody ? (rawBody.marks_awarded || "+2.5 / 5.0") : "+2.5 / 5.0";
      const bodyRemark = rawBody ? rawBody.remark : "✓ **Substantive Arguments**: Good structural points.\n✎ **Enrichment**: Add committee recommendations.";
      const conclMarks = rawConcl ? (rawConcl.marks_awarded || "+1.0 / 1.5") : "+1.0 / 1.5";
      const conclRemark = rawConcl ? rawConcl.remark : "✓ **Synthesis**: Strong forward-looking conclusion.";

      sections.push({
        zone: "intro",
        title: "INTRO",
        icon: "✓",
        isTick: true,
        startYPercent: 12,
        endYPercent: 30,
        cardTopPercent: 10,
        marks: introMarks,
        bulletsHtml: formatPrintCardBullets(introRemark)
      });
      sections.push({
        zone: "body",
        title: (rawBody && rawBody.tag) ? rawBody.tag.toUpperCase() : "BODY",
        icon: "✓",
        isTick: true,
        startYPercent: 32,
        endYPercent: 72,
        cardTopPercent: 36,
        marks: bodyMarks,
        bulletsHtml: formatPrintCardBullets(bodyRemark)
      });
      sections.push({
        zone: "concl",
        title: "CONCLUSION",
        icon: "✓",
        isTick: true,
        startYPercent: 74,
        endYPercent: 90,
        cardTopPercent: 74,
        marks: conclMarks,
        bulletsHtml: formatPrintCardBullets(conclRemark)
      });
    } else if (pageNum === 1) {
      const rawIntro = pageAnns.find(a => {
        const t = String(a.tag || "").toLowerCase();
        return t.includes("intro") || t.includes("premise") || t.includes("definition");
      });
      const rawBody = pageAnns.find(a => {
        const t = String(a.tag || "").toLowerCase();
        return !t.includes("intro") && !t.includes("premise") && !t.includes("definition");
      });

      const introMarks = rawIntro ? (rawIntro.marks_awarded || "+1.0 / 2.0") : "+1.0 / 2.0";
      const introRemark = rawIntro ? rawIntro.remark : "✓ **Good Economic Data**: 66% GDP contribution is a strong hook.\n✗ **Missing**: Explicit reference to the **74th Amendment** or **Article 243W**.";

      const bodyMarks = rawBody ? (rawBody.marks_awarded || "+2.0 / 5.0") : "+2.0 / 5.0";
      const bodyRemark = rawBody ? rawBody.remark : "✓ **Structured Points**: Good identification of the 'institutional jungle' and SPVs.\n✗ **Omission**: Needs specific examples of state parastatals (e.g., BDA, BWSSB) to ground the critique.";

      sections.push({
        zone: "intro",
        title: "INTRO",
        icon: "✓",
        isTick: true,
        startYPercent: 14,
        endYPercent: 30,
        cardTopPercent: 12,
        marks: introMarks,
        bulletsHtml: formatPrintCardBullets(introRemark)
      });

      sections.push({
        zone: "body",
        title: (rawBody && rawBody.tag) ? rawBody.tag.toUpperCase() : "BODY",
        icon: "✓",
        isTick: rawBody && rawBody.type === "warning" ? false : true,
        startYPercent: 31,
        endYPercent: 80,
        cardTopPercent: 44,
        marks: bodyMarks,
        bulletsHtml: formatPrintCardBullets(bodyRemark)
      });
    } else if (pageNum < totalPages) {
      // Intermediate page
      const body1 = pageAnns[0];
      const body2 = pageAnns.length > 1 ? pageAnns[1] : null;

      sections.push({
        zone: "body",
        title: (body1 && body1.tag) ? body1.tag.toUpperCase() : "BODY",
        icon: "✓",
        isTick: true,
        startYPercent: 8,
        endYPercent: 50,
        cardTopPercent: 12,
        marks: body1 ? (body1.marks_awarded || "+1.5 / 3.0") : "+1.5 / 3.0",
        bulletsHtml: formatPrintCardBullets(body1 ? body1.remark : "✓ **Substantive Arguments**: Good coverage of administrative overlap.\n✎ **Enrichment**: Add committee recommendations.")
      });

      sections.push({
        zone: "body_enrichment",
        title: (body2 && body2.tag) ? body2.tag.toUpperCase() : "BODY: ENRICHMENT",
        icon: "✎",
        isTick: false,
        startYPercent: 52,
        endYPercent: 92,
        cardTopPercent: 54,
        marks: body2 ? (body2.marks_awarded || "+1.5 / 2.5") : "+1.5 / 2.5",
        bulletsHtml: formatPrintCardBullets(body2 ? body2.remark : "✓ **Constitutional Morality**: Highlighted institutional trust.\n✎ **Enrichment**: Integrate 2nd ARC committee recommendations.")
      });
    } else {
      // Final page (e.g. Page 2 of 2)
      const rawBody = pageAnns.find(a => {
        const t = String(a.tag || "").toLowerCase();
        return !t.includes("concl") && !t.includes("synthesis");
      });
      const rawConcl = pageAnns.find(a => {
        const t = String(a.tag || "").toLowerCase();
        return t.includes("concl") || t.includes("synthesis");
      });

      const bodyMarks = rawBody ? (rawBody.marks_awarded || "+0.5 / 1.5") : "+0.5 / 1.5";
      const bodyRemark = rawBody ? rawBody.remark : "✓ **Strong Way Ahead**: Citing the **2nd ARC** and property tax data (0.2% vs 3%) is excellent.";

      const conclMarks = rawConcl ? (rawConcl.marks_awarded || "+1.0 / 1.5") : "+1.0 / 1.5";
      const conclRemark = rawConcl ? rawConcl.remark : "✓ **Clear Stance**: Good call for 'smart ULBs' for 'smart cities'.\n✗ **Add**: Connect to a larger national goal like **Viksit Bharat @2047**.";

      sections.push({
        zone: "way_ahead",
        title: (rawBody && rawBody.tag) ? (rawBody.tag.toUpperCase().includes("BODY") ? rawBody.tag.toUpperCase() : `BODY: ${rawBody.tag.toUpperCase()}`) : "BODY: WAY FORWARD",
        icon: "✓",
        isTick: true,
        startYPercent: 8,
        endYPercent: 64,
        cardTopPercent: 16,
        marks: bodyMarks,
        bulletsHtml: formatPrintCardBullets(bodyRemark)
      });

      sections.push({
        zone: "concl",
        title: "CONCLUSION",
        icon: "✓",
        isTick: true,
        startYPercent: 66,
        endYPercent: 81,
        cardTopPercent: 66,
        marks: conclMarks,
        bulletsHtml: formatPrintCardBullets(conclRemark)
      });
    }

    // Generate Curly Braces SVG overlay HTML
    const bracesHtml = sections.map(sec => {
      const topY = sec.startYPercent;
      const hY = sec.endYPercent - sec.startYPercent;
      const strokeColor = sec.isTick ? "#10B981" : "#D97706";
      return `
        <svg class="print-curly-brace-svg" style="top: ${topY}%; height: ${hY}%;" viewBox="0 0 26 100" preserveAspectRatio="none">
          <path d="M 3 0 Q 10 0, 10 6 L 10 44 Q 10 50, 20 50 Q 10 50, 10 56 L 10 94 Q 10 100, 3 100" fill="none" stroke="${strokeColor}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" />
          <line x1="20" y1="50" x2="26" y2="50" stroke="${strokeColor}" stroke-width="2.2" stroke-linecap="round" />
        </svg>
      `;
    }).join("");

    // Generate Margin Cards HTML
    const cardsHtml = sections.map(sec => {
      const cardType = sec.isTick ? "tick" : "warning";
      const tagColor = sec.isTick ? "#065F46" : "#991B1B";
      return `
        <div class="print-margin-section-card ${cardType}" style="top: ${sec.cardTopPercent}%;">
          <div class="print-margin-badge-header">
            <div class="print-margin-tag" style="color: ${tagColor}; font-weight: 800; font-size: 8.5pt;">
              <span class="print-tag-icon">${sec.icon}</span>
              <span>${escapeHtml(sec.title)}</span>
            </div>
            <span class="print-margin-marks">${escapeHtml(sec.marks)}</span>
          </div>
          <div class="print-margin-bullets">
            ${sec.bulletsHtml}
          </div>
        </div>
      `;
    }).join("");

    // Determine Header: Page 1 gets Official Examination Dossier Banner (Image 1 replica); subsequent pages get clean bar
    let headerHtml = "";
    if (pageNum === 1) {
      const candidateId = (state.user && state.user.email) || evaluation.user_email || evaluation.candidate_id || "MM-UPSC-2026-ASPIRANT";
      const evalDate = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
      const directive = evaluation.directive_detected || (evaluation.directive_compliance && evaluation.directive_compliance.directive) || (typeof detectDirective === "function" ? detectDirective(state.question || "")?.label : "Critically Analyse") || "Critically Analyse";
      const wordLimit = evaluation.word_limit || (maxMarks == 15 ? 250 : 150);

      headerHtml = `
        <div class="print-official-dossier-header">
          <div class="print-header-top-row">
            <span class="print-header-top-title">COOKED MAINS // CIVIL SERVICES MAINS EVALUATION DOSSIER</span>
            <div style="display: flex; align-items: center; gap: 6px;">
              ${pageScoreStr ? `<span class="print-header-marks-pill">Marks Awarded: ${pageScoreStr}</span>` : ''}
              <span class="print-header-confidential-pill">CONFIDENTIAL CANDIDATE COPY</span>
            </div>
          </div>
          <div class="print-header-main-title-row">
            <h1 class="print-header-exam-title">UNION PUBLIC SERVICE COMMISSION (MAINS) EXAMINATION</h1>
            <span class="print-header-paper-pill">${escapeHtml(paper)}</span>
          </div>
          <div class="print-header-divider"></div>
          <div class="print-header-meta-grid">
            <div>
              <span class="print-header-meta-label">CANDIDATE ID</span>
              <span class="print-header-meta-val">${escapeHtml(candidateId)}</span>
            </div>
            <div>
              <span class="print-header-meta-label">EVALUATION DATE</span>
              <span class="print-header-meta-val">${escapeHtml(evalDate)}</span>
            </div>
            <div>
              <span class="print-header-meta-label">EXAM PARAMETERS</span>
              <span class="print-header-meta-val">${parseFloat(maxMarks).toFixed(1)} Marks • ${wordLimit} Words</span>
            </div>
            <div>
              <span class="print-header-meta-label">PRIMARY DIRECTIVE</span>
              <span class="print-directive-pill">${escapeHtml(directive)}</span>
            </div>
          </div>
        </div>
      `;
    } else {
      headerHtml = `
        <div class="print-copy-header">
          <div style="display: flex; align-items: center; gap: 8px;">
            <span style="font-weight: 800; color: #0F172A; letter-spacing: 0.3px;">COOKED MAINS // CANDIDATE EVALUATED SCRIPT</span>
            <span style="color: #94A3B8;">|</span>
            <span style="font-weight: 700; color: #334155;">${escapeHtml(paper)}</span>
          </div>
          <div style="display: flex; align-items: center; gap: 10px;">
            ${pageScoreStr ? `<span class="print-header-marks-pill">Page Marks: ${pageScoreStr}</span>` : ''}
            <span style="font-weight: 700; color: #0F172A; font-family: monospace;">Page ${pageNum} of ${totalPages}</span>
          </div>
        </div>
      `;
    }

    const sheetEl = document.createElement("div");
    sheetEl.className = "print-copy-sheet";
    sheetEl.innerHTML = `
      ${headerHtml}

      <div class="print-copy-body">
        <div class="print-copy-img-wrap">
          <div class="print-page-canvas">
            <img src="${dataUrl}" class="print-copy-img" alt="Answer Page ${pageNum}">
            ${bracesHtml}
          </div>
        </div>
        <div class="print-copy-margin">
          <div class="print-margin-title-bar">
            <span>Examiner Margin (Page ${pageNum})</span>
            <span style="font-size: 7.5pt; color: #64748B; font-weight: 600;">OFFICIAL AUDIT</span>
          </div>
          ${cardsHtml}
        </div>
      </div>

      <div class="print-copy-footer">
        <span>Confidential UPSC Mains Evaluated Copy • Total Award: <strong>${overallScore} / ${maxMarks}</strong> • Evaluated by Cooked Mains</span>
        <span style="font-weight: 700; color: #0F172A; font-family: monospace;">p.${pageNum}</span>
      </div>
    `;
    container.appendChild(sheetEl);
  });
}

// Interactive Evaluated Copy Print Preview Dialog (Unified Complete Dossier)
window.openEvaluatedPrintPreview = function() {
  let pages = [];
  if (state.activePages && state.activePages.length > 0) {
    pages = state.activePages;
  } else if (state.originalPages && state.originalPages.length > 0) {
    pages = state.originalPages;
  } else if (state.rewrittenPages && state.rewrittenPages.length > 0) {
    pages = state.rewrittenPages;
  } else {
    const activeImg = document.getElementById("activePageImage");
    if (activeImg && activeImg.src && !activeImg.src.includes("data:image/svg") && !activeImg.src.endsWith("/")) {
      pages = [activeImg.src];
    }
  }

  if (pages.length === 0) {
    if (typeof window.showAppToast === 'function') {
      window.showAppToast('Please select or upload an answer script first to preview/print.', false);
    } else if (typeof window.showAppNotice === 'function') {
      window.showAppNotice('No Answer Copy Loaded', 'Please upload or select an answer script first before previewing evaluated printouts.');
    } else {
      alert('Please select or upload an answer script first to preview/print.');
    }
    return;
  }

  const previewModal = document.getElementById("evaluatedPrintPreviewModal");
  const container = document.getElementById("evaluatedPrintPreviewContainer");
  const pageBadge = document.getElementById("previewPageCountBadge");

  if (!container) return;
  container.innerHTML = "";

  // 1. Render Part 1: Candidate Evaluated Copies (Handwriting on left + Examiner Margin on right)
  populatePrintAnnotatedCopies(state.currentEvaluation, pages, container);

  // 2. Render Part 2: Publication-Grade 2-Page Forensic Dossier (Audit & Marks, Value Multipliers & Rewrite)
  if (typeof populatePrintDossier === "function") {
    populatePrintDossier(state.currentEvaluation);
  }

  const p1 = document.getElementById("printPage1");
  const p2 = document.getElementById("printPage2");

  const totalDossierPages = pages.length + (p1 && p2 ? 2 : 0);

  if (pageBadge) {
    pageBadge.textContent = `${totalDossierPages} Pages (${pages.length} Answer Sheet${pages.length > 1 ? 's' : ''} + 2 Evaluation Audit Pages)`;
  }

  // Update header pagination on the answer copy sheets
  const copySheets = container.querySelectorAll(".print-copy-sheet");
  copySheets.forEach((sheet, idx) => {
    const pageNum = idx + 1;
    const headerPill = sheet.querySelector(".print-copy-header span:last-child");
    if (headerPill) {
      headerPill.textContent = `Page ${pageNum} of ${totalDossierPages}`;
    }
  });

  // Append cloned dossier pages into the preview container
  if (p1 && p2) {
    const cloneP1 = p1.cloneNode(true);
    const cloneP2 = p2.cloneNode(true);

    cloneP1.id = "previewDossierPage1";
    cloneP2.id = "previewDossierPage2";

    // Update footers to reflect total dossier pages
    const p1Footer = cloneP1.querySelector("#printPage1FooterPaging");
    if (p1Footer) p1Footer.textContent = `Page ${pages.length + 1} of ${totalDossierPages} (The Scorecard & Diagnostic Audit)`;

    const p2Footer = cloneP2.querySelector("#printPage2FooterPaging");
    if (p2Footer) p2Footer.textContent = `Page ${pages.length + 2} of ${totalDossierPages} (Value Multipliers, Rewrite Workshop & Blueprint)`;

    container.appendChild(cloneP1);
    container.appendChild(cloneP2);
  }

  if (previewModal) {
    previewModal.classList.remove("hidden");
    const scrollArea = document.getElementById("evaluatedPrintPreviewScrollArea");
    if (scrollArea) scrollArea.scrollTop = 0;
  }

  if (window.lucide) {
    try { lucide.createIcons(); } catch(e) {}
  }
};

window.closeEvaluatedPrintPreview = function() {
  const previewModal = document.getElementById("evaluatedPrintPreviewModal");
  if (previewModal) {
    previewModal.classList.add("hidden");
  }
  document.body.classList.remove("print-active-preview");
};

window.confirmPrintFromPreview = function() {
  document.body.classList.add("print-active-preview");
  setTimeout(() => {
    window.print();
  }, 50);
};

// Global fallback aliases: every print/export button triggers the unified preview first!
window.exportAnnotatedCopies = window.openEvaluatedPrintPreview;
window.exportDossier = window.openEvaluatedPrintPreview;

// Print Listeners for High-Contrast Radar Rendering & Strict Target Dispatch
window.addEventListener("beforeprint", () => {
  if (state.lastRubricScores) {
    renderRadar(state.lastRubricScores, state.lastMaxMarks, true);
  }
  if (document.body.classList.contains("print-mode-dossier")) {
    populatePrintDossier();
  } else {
    // If user triggered print via Ctrl+P while preview is open or directly
    const previewModal = document.getElementById("evaluatedPrintPreviewModal");
    if (previewModal && !previewModal.classList.contains("hidden")) {
      document.body.classList.add("print-active-preview");
    } else {
      populatePrintAnnotatedCopies();
    }
  }
});

window.addEventListener("afterprint", () => {
  if (state.lastRubricScores) {
    renderRadar(state.lastRubricScores, state.lastMaxMarks, false);
  }
  document.body.classList.remove("print-mode-dossier");
  document.body.classList.remove("print-active-preview");
});

// ESC key to close print preview
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    const previewModal = document.getElementById("evaluatedPrintPreviewModal");
    if (previewModal && !previewModal.classList.contains("hidden")) {
      window.closeEvaluatedPrintPreview();
    }
  }
});

// UI Accordion Toggle
window.toggleSection = function(sectionId) {
  const el = document.getElementById(sectionId);
  if (el.classList.contains("hidden")) {
    el.classList.remove("hidden");
  } else {
    el.classList.add("hidden");
  }
};

// Clipboard Copy Helpers
window.copyModelIntro = function() {
  const text = document.getElementById("modelIntroText").textContent;
  navigator.clipboard.writeText(text.replace(/^"|"$/g, ''));
  alert("Model Introduction copied to clipboard!");
};

window.copyModelConclusion = function() {
  const text = document.getElementById("modelConclusionText").textContent;
  navigator.clipboard.writeText(text.replace(/^"|"$/g, ''));
  alert("Model Conclusion copied to clipboard!");
};

window.copyTranscribedText = function() {
  const text = document.getElementById("transcribedAnswerText").textContent;
  navigator.clipboard.writeText(text);
  alert("Transcribed Answer copied to clipboard!");
};

window.copyFullModelAnswer = function() {
  const text = document.getElementById("fullModelAnswerText").textContent;
  navigator.clipboard.writeText(text);
  alert("Complete Topper Model Answer copied to clipboard!");
};

// API Key Modal Controls
if (openKeyModalBtn && keyModal) {
  openKeyModalBtn.addEventListener("click", () => {
    keyModal.classList.remove("hidden");
    keyModal.classList.add("flex");
  });
}

if (closeKeyModalBtn && keyModal) {
  closeKeyModalBtn.addEventListener("click", () => {
    keyModal.classList.add("hidden");
    keyModal.classList.remove("flex");
  });
}

if (saveKeyBtn && apiKeyInput) {
  saveKeyBtn.addEventListener("click", async () => {
    const key = apiKeyInput.value.trim();
    if (key) {
      localStorage.setItem("mainsmentor_gemini_key", key);
      state.apiKey = key;
      // Also test and save to server
      const formData = new FormData();
      formData.append("api_key", key);
      try {
        await fetch("/api/test-key", { method: "POST", body: formData });
        state.serverHasKey = true;
      } catch(e){}
      updateKeyStatusUI();
      if (keyModal) {
        keyModal.classList.add("hidden");
        keyModal.classList.remove("flex");
      }
    }
  });
}

if (testKeyBtn && apiKeyInput && keyTestResult) {
  testKeyBtn.addEventListener("click", async () => {
  const key = apiKeyInput.value.trim();
  if (!key) {
    keyTestResult.innerHTML = "<span class='text-rose-400'>Please enter a key to test.</span>";
    return;
  }
  keyTestResult.innerHTML = "<span class='text-amber-300'>Testing key against active Gemini models...</span>";
  const formData = new FormData();
  formData.append("api_key", key);

  try {
    const res = await fetch("/api/test-key", {
      method: "POST",
      body: formData
    });
    const data = await res.json();
    if (data.valid) {
      state.serverHasKey = true;
      state.apiKey = key;
      localStorage.setItem("mainsmentor_gemini_key", key);
      updateKeyStatusUI();
      keyTestResult.innerHTML = `<span class='text-emerald-400 font-semibold'>✓ ${data.message}</span><div class='text-[10px] text-emerald-300/80 mt-1'>Saved as Master Key on server. All students can now evaluate with zero prompts!</div>`;
    } else {
      keyTestResult.innerHTML = `<span class='text-rose-400'>✗ ${data.message}</span>`;
    }
  } catch (err) {
    keyTestResult.innerHTML = `<span class='text-rose-400'>✗ ${err.message}</span>`;
  }
  });
}

// Setup User, Daily Question, Locker, and Pricing Listeners
function setupUserAndModalListeners() {
  // Daily Target Button in Navbar
  if (navDawBtn && dailyQuestionBanner) {
    navDawBtn.addEventListener("click", () => {
      dailyQuestionBanner.classList.remove("hidden");
      dailyQuestionBanner.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  // Dismiss Daily Question Banner
  if (dismissDawBtn && dailyQuestionBanner) {
    dismissDawBtn.addEventListener("click", () => {
      dailyQuestionBanner.classList.add("hidden");
    });
  }

  // Standard UPSC Faculty Directive Guidance Generator (5-6 structured sentences)
  function getStandardDirectiveGuidance(directive, question) {
    const d = (directive || "Critically Analyze").toLowerCase().trim();
    if (d.includes("critically") && (d.includes("analyze") || d.includes("examine") || d.includes("evaluate") || d.includes("discuss"))) {
      return "1. Adopt a balanced dialectical approach addressing both thesis and counter-critique. 2. Begin with a 2-3 line contextual introduction defining the issue through constitutional articles, statutory frameworks, or recent empirical data. 3. Dedicate the primary body section (50% weightage) to substantiating core arguments with case laws, committee recommendations, or official indices. 4. Allocate 35% of the body to interrogating systemic bottlenecks, structural constraints, and unintended consequences. 5. Enhance presentation with a 40-second schematic flowchart or comparative matrix. 6. Conclude with a 15% pragmatic synthesis offering constructive, forward-looking policy solutions.";
    }
    if (d.includes("discuss")) {
      return "1. Adopt an expansive multi-dimensional analytical framework covering PESTLE dimensions (Political, Economic, Social, Technological, Legal, Environmental). 2. Open with a crisp contextual thesis unpacking the core scope and significance of the question. 3. Formulate clear thematic sub-headings for each dimension rather than writing generic paragraphs. 4. Substantiate each argument with verifiable facts, government schemes, or landmark judicial precedents. 5. Include a conceptual schematic or stakeholder mapping flowchart to visually reinforce depth. 6. Conclude with a forward-looking, visionary conclusion rooted in sustainable development and constitutional values.";
    }
    if (d.includes("elucidate") || d.includes("elaborate") || d.includes("explain")) {
      return "1. Focus on making the central proposition unmistakably clear with high explanatory depth. 2. Begin with a precise operational definition or doctrinal anchor establishing conceptual authority. 3. Unpack underlying mechanisms step-by-step using concrete real-world examples and committee findings. 4. Connect theoretical concepts to contemporary governance challenges and public administration reforms. 5. Utilize structured bullet points with bold keywords and an illustrative schematic. 6. Conclude by summarizing how effective operationalization advances good governance and constitutional ideals.";
    }
    if (d.includes("evaluate") || d.includes("assess")) {
      return "1. Undertake a rigorous criteria-based assessment weighing policy outcomes against statutory or constitutional intent. 2. Begin with a sharp introductory baseline outlining the legislative or executive mandate under review. 3. Structure the first half around tangible achievements, positive impacts, and key milestones. 4. Devote the second half to an evidence-backed audit of operational shortfalls and financial constraints. 5. Support evaluation with a benchmark comparison against NITI Aayog indices or international standards. 6. Conclude with a definitive, judicious verdict followed by a targeted reform agenda.";
    }
    return "1. Structure your answer using a balanced dialectical approach addressing both thesis and antithesis. 2. Begin with a concise 2-3 line introduction contextualizing the issue through constitutional articles or statutory frameworks. 3. Dedicate the primary body section to substantiating core arguments with empirical data, committee reports, or case laws. 4. Dedicate the secondary body section to unearthing systemic bottlenecks and ground-level challenges. 5. Emphasize multi-dimensional perspectives using clean sub-headings and a neat schematic diagram. 6. Conclude with a pragmatic, constitutional synthesis outlining actionable policy recommendations.";
  }
  window.getStandardDirectiveGuidance = getStandardDirectiveGuidance;

  // Helper to render well-structured bullet cards for UPSC Directive Scrutiny
  function renderDirectiveBullets(container, guidance) {
    if (!container) return;
    container.innerHTML = "";
    if (!guidance) return;
    
    let points = [];
    if (Array.isArray(guidance)) {
      points = guidance.filter(Boolean);
    } else if (typeof guidance === "string") {
      const raw = guidance.split(/(?:^|\s+)(?=\d+\.\s+)/).map(s => s.trim()).filter(Boolean);
      if (raw.length > 1) {
        points = raw.map(p => p.replace(/^\d+\.\s*/, "").trim());
      } else {
        const lines = guidance.split(/\n+|•\s+/).map(s => s.trim().replace(/^\d+\.\s*/, "")).filter(Boolean);
        points = lines.length > 1 ? lines : [guidance.trim()];
      }
    }

    if (points.length === 0) return;

    points.forEach((pt, idx) => {
      const card = document.createElement("div");
      card.className = "flex items-start space-x-2.5 p-2.5 rounded-lg bg-white dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800 text-xs shadow-xs transition-colors";
      
      const badge = document.createElement("span");
      badge.className = "inline-flex items-center justify-center w-5 h-5 rounded-md bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 font-bold text-[11px] shrink-0 mt-0.5 border border-amber-300/60 dark:border-amber-700/60";
      badge.textContent = `${idx + 1}`;

      const textDiv = document.createElement("div");
      textDiv.className = "leading-relaxed text-slate-700 dark:text-slate-300 flex-1";

      let formatted = escapeHtml(pt);
      if (pt.includes(":") && pt.indexOf(":") < 45) {
        const parts = pt.split(":");
        formatted = `<strong class="text-slate-900 dark:text-slate-100 font-semibold">${escapeHtml(parts[0].trim())}:</strong> ${escapeHtml(parts.slice(1).join(":").trim())}`;
      } else {
        const match = pt.match(/^([^,.;]{4,32}[,;:]?)\s+(.*)$/);
        if (match) {
          formatted = `<strong class="text-slate-900 dark:text-slate-100 font-semibold">${escapeHtml(match[1])}</strong> ${escapeHtml(match[2])}`;
        }
      }
      textDiv.innerHTML = formatted;

      card.appendChild(badge);
      card.appendChild(textDiv);
      container.appendChild(card);
    });
  }
  window.renderDirectiveBullets = renderDirectiveBullets;

  // Load and display dynamic UPSC question for Daily Answer Writing
  async function loadDailyQuestion(paper = "TODAY", offset = 0) {
    state.dawPaperFilter = paper;
    state.dawOffset = offset;
    try {
      const url = `/api/daily-question?paper=${encodeURIComponent(paper)}&offset=${offset}`;
      const res = await fetch(url);
      if (!res.ok) return;
      const daw = await res.json();
      state.dailyQuestion = daw;

      // Automatically update the active paper chip to match the loaded question's paper
      const paperGroup = document.getElementById("paperSwitcherGroup");
      if (paperGroup) {
        const chips = paperGroup.querySelectorAll(".daw-filter-chip");
        const loadedPaper = (daw.paper || "").toUpperCase().replace(/\s+/g, "");
        chips.forEach(c => {
          const chipPaper = (c.getAttribute("data-paper") || "").toUpperCase().replace(/\s+/g, "");
          const isMatch = (chipPaper === loadedPaper);
          if (isMatch) {
            c.classList.add("active", "bg-white", "dark:bg-slate-900", "text-amber-600", "dark:text-amber-400", "shadow-sm", "border", "border-slate-200/80", "dark:border-slate-700");
            c.classList.remove("text-slate-600", "dark:text-slate-400");
            c.setAttribute("data-active", "true");
          } else {
            c.classList.remove("active", "bg-white", "dark:bg-slate-900", "text-amber-600", "dark:text-amber-400", "shadow-sm", "border", "border-slate-200/80", "dark:border-slate-700");
            c.classList.add("text-slate-600", "dark:text-slate-400");
            c.removeAttribute("data-active");
          }
        });
      }

      const dawDateBadge = document.getElementById("dawDateBadge");
      const dawPaperBadge = document.getElementById("dawPaperBadge");
      const dawSpecsBadge = document.getElementById("dawSpecsBadge");
      const dawTimeBadge = document.getElementById("dawTimeBadge");
      const dawQuestionText = document.getElementById("dawQuestionText");
      const dawContextText = document.getElementById("dawContextText");

      if (dawDateBadge) {
        if (daw.is_live_news) {
          dawDateBadge.innerHTML = `<span class="inline-flex items-center space-x-1 text-emerald-600 dark:text-emerald-400 font-bold"><span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse inline-block"></span> <span>Live Editorial (${escapeHtml(daw.source_name || 'The Hindu/Express')})</span></span>`;
        } else {
          dawDateBadge.textContent = daw.date_display || "Today's Target";
        }
      }
      if (dawPaperBadge) {
        dawPaperBadge.innerHTML = `<i data-lucide="award" class="w-3.5 h-3.5 text-slate-500 dark:text-slate-400"></i><span>${daw.paper} • ${daw.syllabus_topic || daw.paper_name || 'UPSC Mains'}</span>`;
      }
      if (dawSpecsBadge) {
        dawSpecsBadge.textContent = `${daw.marks || 15} Marks / ${daw.word_limit || 250} Words`;
      }
      if (dawTimeBadge) {
        dawTimeBadge.textContent = `Target: ${(daw.marks >= 15 ? 9.0 : 7.0)} Mins`;
      }
      if (dawQuestionText) {
        dawQuestionText.textContent = daw.question;
        const targetPreview = document.getElementById("activeDailyTargetPreview");
        if (targetPreview) targetPreview.textContent = daw.question;
        if (state.questionMode === "daily") {
          state.question = daw.question;
          const qInput = document.getElementById("questionInput");
          if (qInput) qInput.value = daw.question;
        }
      }
      const marksTag = document.getElementById("marksTag");
      if (marksTag) marksTag.textContent = `${daw.marks || 15} Marks`;
      const wordsTag = document.getElementById("wordsTag");
      if (wordsTag) wordsTag.textContent = `${daw.word_limit || 250} Words`;
      const targetTimeTag = document.getElementById("targetTimeTag");
      if (targetTimeTag) targetTimeTag.textContent = `Target: ${(daw.marks >= 15 ? 9.0 : 7.0)} Mins`;
      
      // Render clickable Editorial Grounding link
      if (dawContextText) {
        const headline = daw.source_headline || daw.context || "Infrastructure & Disaster Resilience in Fragile Zones";
        const srcName = daw.source_name || "The Hindu (National)";
        const srcUrl = daw.source_url || "https://www.thehindu.com";
        dawContextText.innerHTML = `
          <i data-lucide="newspaper" class="w-4 h-4 text-amber-500 shrink-0 mt-0.5"></i>
          <div class="min-w-0 flex-1">
            <span class="font-semibold text-slate-700 dark:text-slate-300 text-xs">Editorial Grounding:</span>
            <a href="${srcUrl}" target="_blank" rel="noopener noreferrer" class="text-amber-600 dark:text-amber-400 hover:text-amber-500 hover:underline inline-flex items-center gap-1 font-semibold text-xs transition-colors ml-1">
              <span>${escapeHtml(srcName)} • ${escapeHtml(headline)}</span>
              <i data-lucide="external-link" class="w-3 h-3 inline-block shrink-0"></i>
            </a>
          </div>
        `;
      }

      // Update Left Column Directive Card with structured bullets
      const directiveBadgeText = document.getElementById("directiveBadgeText");
      const directiveTipList = document.getElementById("directiveTipList");
      const directiveTipText = document.getElementById("directiveTipText");
      const dName = daw.directive || "Critically Analyze";
      if (directiveBadgeText) {
        directiveBadgeText.textContent = `Directive Scrutiny: "${dName}"`;
      }
      const guidance = daw.directive_guidance || getStandardDirectiveGuidance(dName, daw.question);
      if (directiveTipList) {
        renderDirectiveBullets(directiveTipList, guidance);
      }
      if (directiveTipText) {
        directiveTipText.textContent = typeof guidance === "string" ? guidance : guidance.join(" ");
      }
      if (window.lucide) lucide.createIcons();
    } catch (err) {
      console.warn("Failed to load daily question:", err);
    }
  }
  window.loadDailyQuestion = loadDailyQuestion;

  // Live News Sync Button (Instant rotation + background refresh)
  const dawRefreshNewsBtn = document.getElementById("dawRefreshNewsBtn");
  if (dawRefreshNewsBtn) {
    dawRefreshNewsBtn.addEventListener("click", async () => {
      const origText = dawRefreshNewsBtn.innerHTML;
      dawRefreshNewsBtn.disabled = true;
      dawRefreshNewsBtn.innerHTML = `<i data-lucide="loader-2" class="w-3.5 h-3.5 animate-spin"></i><span>Syncing...</span>`;
      if (window.lucide) lucide.createIcons();
      try {
        const nextOffset = (state.dawOffset || 0) + 1;
        const pParam = (state.dawPaperFilter && state.dawPaperFilter !== "TODAY") ? `?paper=${encodeURIComponent(state.dawPaperFilter)}` : "";
        fetch(`/api/current-affairs/refresh${pParam}`, { method: "POST" }).catch(e => console.warn(e));
        await loadDailyQuestion(state.dawPaperFilter || "TODAY", nextOffset);
      } catch (e) {
        console.warn("Live news sync error:", e);
        await loadDailyQuestion(state.dawPaperFilter || "TODAY", (state.dawOffset || 0) + 1);
      } finally {
        setTimeout(() => {
          dawRefreshNewsBtn.disabled = false;
          dawRefreshNewsBtn.innerHTML = origText;
          if (window.lucide) lucide.createIcons();
        }, 300);
      }
    });
  }

  // 1. Daily Target Paper Filter Chips (ONLY updates Left Column)
  const filterChips = document.querySelectorAll(".daw-filter-chip");
  filterChips.forEach(chip => {
    chip.addEventListener("click", () => {
      if (state.isControlsLocked) return;
      filterChips.forEach(c => {
        c.classList.remove("active", "bg-white", "dark:bg-slate-900", "text-amber-600", "dark:text-amber-400", "shadow-sm", "border", "border-slate-200/80", "dark:border-slate-700");
        c.classList.add("text-slate-600", "dark:text-slate-400");
      });
      chip.classList.add("active", "bg-white", "dark:bg-slate-900", "text-amber-600", "dark:text-amber-400", "shadow-sm", "border", "border-slate-200/80", "dark:border-slate-700");
      chip.classList.remove("text-slate-600", "dark:text-slate-400");
      const p = chip.getAttribute("data-paper");
      state.dawPaperFilter = p;
      state.dawOffset = 0;
      loadDailyQuestion(p, 0);
    });
  });

  // 2. Reshuffle Button (Attaches to dawShuffleBtn & dawReshuffleBtn with instant rotation)
  const attachReshuffle = (btnId) => {
    const btn = document.getElementById(btnId);
    if (btn) {
      btn.addEventListener("click", () => {
        if (state.isControlsLocked) return;
        const icon = btn.querySelector("i, svg");
        if (icon) icon.classList.add("rotate-180");
        setTimeout(() => { if (icon) icon.classList.remove("rotate-180"); }, 300);
        const nextOffset = (state.dawOffset || 0) + 1;
        loadDailyQuestion(state.dawPaperFilter || "TODAY", nextOffset);
      });
    }
  };
  attachReshuffle("dawShuffleBtn");
  attachReshuffle("dawReshuffleBtn");

  // 3. Direct Print Blank UPSC Sheet from Daily Banner
  const downloadSheetBtn = document.getElementById("downloadSheetBtn");
  if (downloadSheetBtn) {
    downloadSheetBtn.addEventListener("click", () => {
      const daw = state.dailyQuestion;
      const q = daw ? daw.question : (state.question || "The regulation of unrecognised and unaided traditional educational institutions often creates a tension between educational standardisation and minority rights. Critically examine this statement in light of constitutional safeguards and judicial pronouncements.");
      const p = (daw && daw.paper) || state.selectedPaperTab || "GS3";
      const m = (daw && daw.marks) || state.marks || 15;
      const w = (daw && daw.word_limit) || 250;
      const url = `/api/upsc-blank-sheet?paper=${encodeURIComponent(p)}&marks=${m}&word_limit=${w}&question=${encodeURIComponent(q)}`;
      window.open(url, "_blank");
    });
  }

  // 3b. Print Blank UPSC Sheet for Studio Custom Question
  const studioPrintBlankSheetBtn = document.getElementById("studioPrintBlankSheetBtn");
  if (studioPrintBlankSheetBtn) {
    studioPrintBlankSheetBtn.addEventListener("click", () => {
      const qInput = document.getElementById("questionInput");
      const qText = (qInput && qInput.value.trim()) 
        ? qInput.value.trim() 
        : (state.dailyQuestion ? state.dailyQuestion.question : (state.question || "Examine the role of Parliamentary Standing Committees in ensuring executive accountability. Discuss structural reforms required to prevent the bypassing of legislative scrutiny in recent times."));
      const pMarks = state.marks || 10;
      const pTab = state.selectedPaperTab || "GS2";
      const wordLimit = (pMarks >= 20 ? 300 : pMarks >= 15 ? 250 : 150);
      const url = `/api/upsc-blank-sheet?paper=${encodeURIComponent(pTab)}&marks=${pMarks}&word_limit=${wordLimit}&question=${encodeURIComponent(qText)}`;
      window.open(url, "_blank");
    });
  }

  // 4. "Write This Answer Today" -> Launch UPSC Focus Writing Suite
  const examModeModal = document.getElementById("examModeModal");
  const closeExamModalBtn = document.getElementById("closeExamModalBtn");
  const startTimerBtn = document.getElementById("startTimerBtn");
  const pauseTimerBtn = document.getElementById("pauseTimerBtn");
  const resetTimerBtn = document.getElementById("resetTimerBtn");
  const printSheetFromModalBtn = document.getElementById("printSheetFromModalBtn");
  const uploadCopyFromModalBtn = document.getElementById("uploadCopyFromModalBtn");

  if (loadDawBtn) {
    loadDawBtn.addEventListener("click", () => {
      if (!state.dailyQuestion || state.isControlsLocked) return;
      const daw = state.dailyQuestion;

      // 1. Sync Studio Paper Tab
      paperTabs.forEach(t => {
        const p = t.getAttribute("data-paper");
        if (p === daw.paper) {
          t.click();
        }
      });

      // 2. Sync Marks Weightage
      marksBtns.forEach(b => {
        const m = parseInt(b.getAttribute("data-marks"), 10);
        if (m === daw.marks) {
          b.click();
        }
      });

      // 3. Link Question Mode to Daily Target
      if (typeof window.setQuestionMode === "function") {
        window.setQuestionMode("daily");
      }
      if (questionInput) {
        questionInput.value = daw.question;
        state.question = daw.question;
        detectDirectiveFromInput();
      }

      // 4. Populate Exam Mode Modal
      const examPaperBadge = document.getElementById("examPaperBadge");
      const examSpecsBadge = document.getElementById("examSpecsBadge");
      const examQuestionText = document.getElementById("examQuestionText");
      const examMicroList = document.getElementById("examMicroDimensionsList");
      const examTopperTip = document.getElementById("examTopperTip");

      if (examPaperBadge) examPaperBadge.textContent = `${daw.paper} • ${daw.paper_name || 'UPSC Daily Target'}`;
      if (examSpecsBadge) examSpecsBadge.textContent = `${daw.marks} Marks • ${daw.word_limit} Words`;
      if (examQuestionText) examQuestionText.textContent = daw.question;

      if (examMicroList && daw.micro_dimensions) {
        examMicroList.innerHTML = daw.micro_dimensions.map(dim => `
          <li class="flex items-start space-x-2">
            <span class="text-amber-400 font-bold text-sm shrink-0">▪</span>
            <span class="text-slate-200 text-xs leading-relaxed">${dim}</span>
          </li>
        `).join("");
      }

      if (examTopperTip) {
        examTopperTip.innerHTML = `
          <strong class="text-amber-300">★ Topper Benchmark:</strong> ${daw.topper_benchmarks || 'Maintain crisp micro-diagrams, precise constitutional/data citations, and structured subheadings.'}
        `;
      }

      // 5. Initialize Exam Hall Timer (7 mins for 10M, 9 mins for 15M/20M)
      const duration = (daw.marks >= 15) ? 540 : 420;
      initExamTimer(duration);

      // 6. Reveal Focus Modal
      if (examModeModal) {
        examModeModal.classList.remove("hidden");
        examModeModal.classList.add("flex");
        if (window.lucide) lucide.createIcons();
      }
    });
  }

  // Exam Focus Mode Controls
  if (closeExamModalBtn && examModeModal) {
    closeExamModalBtn.addEventListener("click", () => {
      pauseExamTimer();
      examModeModal.classList.add("hidden");
      examModeModal.classList.remove("flex");
    });
  }

  if (startTimerBtn) {
    startTimerBtn.addEventListener("click", startExamTimer);
  }

  if (pauseTimerBtn) {
    pauseTimerBtn.addEventListener("click", pauseExamTimer);
  }

  if (resetTimerBtn) {
    resetTimerBtn.addEventListener("click", resetExamTimer);
  }

  if (printSheetFromModalBtn) {
    printSheetFromModalBtn.addEventListener("click", () => {
      window.generateUPSCAnswerSheet(state.dailyQuestion);
    });
  }

  if (uploadCopyFromModalBtn) {
    uploadCopyFromModalBtn.addEventListener("click", () => {
      pauseExamTimer();
      if (examModeModal) {
        examModeModal.classList.add("hidden");
        examModeModal.classList.remove("flex");
      }
      const s3 = document.getElementById("step3Wrapper");
      if (s3) {
        s3.scrollIntoView({ behavior: "smooth", block: "center" });
        flashStep("step3Wrapper", "📷 Time to submit! Select or drop your handwritten copy below.");
      }
      if (fileInput) {
        setTimeout(() => fileInput.click(), 200);
      }
    });
  }

  // Answer Locker Drawer
  if (openLockerBtn && answerLockerDrawer) {
    openLockerBtn.addEventListener("click", () => {
      answerLockerDrawer.classList.remove("hidden");
      answerLockerDrawer.classList.add("flex");
      loadLockerHistory();
    });
  }

  if (closeLockerDrawerBtn && answerLockerDrawer) {
    closeLockerDrawerBtn.addEventListener("click", () => {
      answerLockerDrawer.classList.add("hidden");
      answerLockerDrawer.classList.remove("flex");
    });
  }

  if (answerLockerDrawer) {
    answerLockerDrawer.addEventListener("click", (e) => {
      if (e.target === answerLockerDrawer) {
        answerLockerDrawer.classList.add("hidden");
        answerLockerDrawer.classList.remove("flex");
      }
    });
  }

  // Pricing Modal
  if (openPricingBtn) {
    openPricingBtn.addEventListener("click", window.openPricingModal);
  }

  if (closePricingModalBtn) {
    closePricingModalBtn.addEventListener("click", window.closePricingModal);
  }

  // Auth Modal
  if (authBtn) {
    authBtn.addEventListener("click", openAuthModal);
  }

  if (closeAuthModalBtn) {
    closeAuthModalBtn.addEventListener("click", closeAuthModal);
  }

  // Google 1-Click Fast Sign-In
  if (googleSignInBtn) {
    googleSignInBtn.addEventListener("click", async () => {
      let googleName = (authNameInput && authNameInput.value.trim()) || "";
      let googleEmail = (authEmailInput && authEmailInput.value.trim()) || "";

      if (!googleEmail) {
        // Provide seamless Cadet Google account
        const randomSuffix = Math.floor(1000 + Math.random() * 9000);
        googleName = googleName || `Cadet Aspirant`;
        googleEmail = `cadet.upsc${randomSuffix}@gmail.com`;
      } else if (!googleName) {
        googleName = googleEmail.split("@")[0].replace(/[\._\-]+/g, " ");
        googleName = googleName.charAt(0).toUpperCase() + googleName.slice(1);
      }

      try {
        const res = await fetch("/api/user/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: googleEmail, name: googleName, provider: "google" })
        });
        if (res.ok) {
          state.user = await res.json();
          localStorage.setItem("mainsmentor_user", JSON.stringify(state.user));
          updateUserUI();
          refreshLockerBadge();
          window.closeAuthModal();

          if (typeof window.showAppToast === 'function') {
            window.showAppToast(`Signed in as ${state.user.name}! 5 Free Checks active.`);
          }

          // Resume pending pack purchase if aspirant clicked a plan while logged out
          if (window.pendingCheckoutPack) {
            const pendingPack = window.pendingCheckoutPack;
            window.pendingCheckoutPack = null;
            setTimeout(() => {
              window.startSubscriptionCheckout(pendingPack);
            }, 300);
          } else {
            setTimeout(() => {
              const intake = document.getElementById("intakeDeck");
              if (intake) {
                intake.classList.remove("hidden");
                intake.scrollIntoView({ behavior: "smooth", block: "start" });
              }
            }, 300);
          }
        } else {
          const err = await res.json();
          alert("Sign in failed: " + (err.detail || "Server error"));
        }
      } catch (e) {
        alert("Sign in error: " + e.message);
      }
    });
  }

  // Manual Name/Email Sign-In Form
  if (authForm) {
    authForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const name = authNameInput ? authNameInput.value.trim() : "";
      const email = authEmailInput ? authEmailInput.value.trim() : "";
      if (!email) return;

      try {
        const res = await fetch("/api/user/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, name: name || "Aspirant" })
        });
        if (res.ok) {
          state.user = await res.json();
          localStorage.setItem("mainsmentor_user", JSON.stringify(state.user));
          updateUserUI();
          refreshLockerBadge();
          window.closeAuthModal();

          if (typeof window.showAppToast === 'function') {
            window.showAppToast(`Welcome back, ${state.user.name}! 5 Free Checks active.`);
          }

          // Resume pending pack purchase
          if (window.pendingCheckoutPack) {
            const pendingPack = window.pendingCheckoutPack;
            window.pendingCheckoutPack = null;
            setTimeout(() => {
              window.startSubscriptionCheckout(pendingPack);
            }, 300);
          } else {
            setTimeout(() => {
              const intake = document.getElementById("intakeDeck");
              if (intake) {
                intake.classList.remove("hidden");
                intake.scrollIntoView({ behavior: "smooth", block: "start" });
              }
            }, 300);
          }
        } else {
          const err = await res.json();
          alert("Sign in failed: " + (err.detail || "Server error"));
        }
      } catch (e) {
        alert("Sign in error: " + e.message);
      }
    });
  }

  // 24-Hour Free Rewrite Challenge
  if (activateRewriteBtn) {
    activateRewriteBtn.addEventListener("click", () => {
      window.openRewriteModal();
    });
  }

  // Backdrop click dismiss for modals
  const focusModal = document.getElementById("examModeModal");
  const upiModal = document.getElementById("upiCheckoutModal");
  [authModal, pricingModal, keyModal, focusModal, upiModal].forEach(modal => {
    if (modal) {
      modal.addEventListener("click", (e) => {
        if (e.target === modal) {
          if (modal === focusModal) pauseExamTimer();
          modal.classList.add("hidden");
          modal.classList.remove("flex");
        }
      });
    }
  });

  // Initial load of today's live editorial question
  loadDailyQuestion("TODAY", 0);
}

// --- UPSC Exam Hall Timer State & Controller ---
let examTimerInterval = null;
let examSecondsLeft = 420;
let examTotalSeconds = 420;
let examTimerRunning = false;

function initExamTimer(durationSeconds) {
  clearInterval(examTimerInterval);
  examTimerRunning = false;
  examTotalSeconds = durationSeconds;
  examSecondsLeft = durationSeconds;
  updateTimerDisplay();
}

function updateTimerDisplay() {
  const mins = Math.floor(examSecondsLeft / 60);
  const secs = examSecondsLeft % 60;
  const display = document.getElementById("examTimerDisplay");
  const bar = document.getElementById("examTimerBar");
  const label = document.getElementById("timerStatusLabel");
  const startBtnLabel = document.getElementById("startTimerLabel");

  if (display) {
    display.textContent = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    if (examSecondsLeft <= 60) {
      display.className = "text-4xl sm:text-5xl font-mono font-extrabold text-rose-500 animate-pulse tracking-wider";
    } else if (examSecondsLeft <= 120) {
      display.className = "text-4xl sm:text-5xl font-mono font-extrabold text-amber-400 tracking-wider";
    } else {
      display.className = "text-4xl sm:text-5xl font-mono font-extrabold text-emerald-400 tracking-wider";
    }
  }

  if (bar) {
    const pct = (examSecondsLeft / examTotalSeconds) * 100;
    bar.style.width = `${pct}%`;
    if (examSecondsLeft <= 60) {
      bar.className = "h-full bg-rose-500 transition-all duration-1000";
    } else if (examSecondsLeft <= 120) {
      bar.className = "h-full bg-amber-400 transition-all duration-1000";
    } else {
      bar.className = "h-full bg-gradient-to-r from-amber-500 to-emerald-400 transition-all duration-1000";
    }
  }

  if (label) {
    if (!examTimerRunning && examSecondsLeft === examTotalSeconds) {
      label.textContent = "READY TO START";
      label.className = "text-[11px] font-mono text-slate-400 font-bold";
    } else if (examTimerRunning) {
      label.textContent = examSecondsLeft <= 120 ? "⚠️ CONCLUDE ANSWER NOW" : "⏱ EXAM TIMER RUNNING";
      label.className = examSecondsLeft <= 120 ? "text-[11px] font-mono text-rose-400 font-bold animate-pulse" : "text-[11px] font-mono text-emerald-400 font-bold";
    } else {
      label.textContent = "PAUSED";
      label.className = "text-[11px] font-mono text-amber-400 font-bold";
    }
  }

  if (startBtnLabel) {
    startBtnLabel.textContent = examTimerRunning ? "Running..." : (examSecondsLeft < examTotalSeconds ? "Resume" : "Start Timer");
  }
}

function startExamTimer() {
  if (examTimerRunning) return;
  examTimerRunning = true;
  updateTimerDisplay();

  examTimerInterval = setInterval(() => {
    if (examSecondsLeft > 0) {
      examSecondsLeft--;
      if (examSecondsLeft === 120) {
        playExamBeep(520, 0.4);
      }
      updateTimerDisplay();
    } else {
      clearInterval(examTimerInterval);
      examTimerRunning = false;
      updateTimerDisplay();
      playExamBeep(880, 0.9);
      const label = document.getElementById("timerStatusLabel");
      if (label) {
        label.textContent = "🔔 TIME UP! PEN DOWN";
        label.className = "text-[11px] font-mono text-rose-500 font-extrabold animate-bounce";
      }
      alert("⏰ Time's Up! Pen Down.\nIn actual UPSC Mains, stop writing now. Take a photo of your copy and click 'Upload Copy' for instant strict evaluation.");
    }
  }, 1000);
}

function pauseExamTimer() {
  clearInterval(examTimerInterval);
  examTimerRunning = false;
  updateTimerDisplay();
}

function resetExamTimer() {
  clearInterval(examTimerInterval);
  examTimerRunning = false;
  examSecondsLeft = examTotalSeconds;
  updateTimerDisplay();
}

function playExamBeep(freq = 440, duration = 0.3) {
  try {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = "sine";
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + duration);
  } catch (e) {}
}

// --- Official UPSC Blank Mains Practice Answer Sheet Generator ---
window.generateUPSCAnswerSheet = function(daw) {
  let item = daw;
  if (!item) {
    const qInput = document.getElementById("questionInput");
    const qText = (qInput && qInput.value.trim()) 
      ? qInput.value.trim() 
      : (state.dailyQuestion ? state.dailyQuestion.question : (state.question || "Examine the role of Parliamentary Standing Committees in ensuring executive accountability. Discuss structural reforms required to prevent the bypassing of legislative scrutiny in recent times."));
    const pMarks = state.marks || 10;
    const pTab = state.selectedPaperTab || "GS2";
    item = {
      paper: pTab,
      marks: pMarks,
      word_limit: (pMarks >= 20 ? 300 : pMarks >= 15 ? 250 : 150),
      question: qText
    };
  }
  const p = item.paper || state.paper || "GS2";
  const m = item.marks || state.marks || 10;
  const w = item.word_limit || (m >= 20 ? 300 : m >= 15 ? 250 : 150);
  const q = item.question || state.question || "";
  const url = `/api/upsc-blank-sheet?paper=${encodeURIComponent(p)}&marks=${m}&word_limit=${w}&question=${encodeURIComponent(q)}`;
  window.open(url, "_blank");
};

window.openAuthModal = function(intentMessage) {
  const modal = document.getElementById("authModal");
  if (!modal) return;

  const intentAlert = document.getElementById("authIntentAlert");
  const intentText = document.getElementById("authIntentAlertText");
  if (intentMessage && intentAlert && intentText) {
    intentText.textContent = intentMessage;
    intentAlert.classList.remove("hidden");
  } else if (intentAlert) {
    intentAlert.classList.add("hidden");
  }

  if (state.user) {
    if (authNameInput) authNameInput.value = state.user.name || "";
    if (authEmailInput) authEmailInput.value = state.user.email || "";
  }

  modal.classList.remove("hidden");
  modal.classList.add("flex");
  if (window.lucide) lucide.createIcons();
};
function openAuthModal(msg) { window.openAuthModal(msg); }

window.closeAuthModal = function() {
  const modal = document.getElementById("authModal");
  if (modal) {
    modal.classList.add("hidden");
    modal.classList.remove("flex");
  }
};
function closeAuthModal() { window.closeAuthModal(); }

window.openPricingModal = function() {
  if (pricingModal) {
    pricingModal.classList.remove("hidden");
    pricingModal.classList.add("flex");
  }
};

window.closePricingModal = function() {
  if (pricingModal) {
    pricingModal.classList.add("hidden");
    pricingModal.classList.remove("flex");
  }
};

// Answer Locker History Loader
async function loadLockerHistory() {
  if (!state.user || !state.user.email) return;
  if (!lockerListContainer) return;

  lockerListContainer.innerHTML = `
    <div class="py-12 text-center text-slate-500 space-y-2">
      <div class="w-6 h-6 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
      <p class="text-xs">Fetching your evaluated copies...</p>
    </div>
  `;

  try {
    const res = await fetch(`/api/user/history?email=${encodeURIComponent(state.user.email)}`);
    if (!res.ok) throw new Error("Failed to load history");
    const list = await res.json();

    if (lockerCountBadge) {
      lockerCountBadge.textContent = list.length.toString();
    }

    if (list.length === 0) {
      lockerListContainer.innerHTML = `
        <div class="py-16 text-center text-slate-500 space-y-3 px-4">
          <div class="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto text-slate-400">
            <i data-lucide="archive" class="w-6 h-6"></i>
          </div>
          <p class="text-xs font-semibold text-slate-300">No Evaluated Copies Yet</p>
          <p class="text-[11px] text-slate-500 max-w-xs mx-auto">Upload an answer copy or try the Daily Target to start tracking your trajectory!</p>
        </div>
      `;
      if (window.lucide) lucide.createIcons();
      return;
    }

    let html = "";
    list.forEach(item => {
      const dateStr = item.created_at ? new Date(item.created_at).toLocaleDateString("en-IN", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }) : "Recently";
      const isRewriteBadge = item.is_rewrite 
        ? `<span class="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">Rewrite (1/1)</span>` 
        : (item.has_been_rewritten 
            ? `<span class="text-[9px] font-bold px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">Rewritten (1/1)</span>` 
            : '');

      const scoreVal = (item.total_score !== undefined && item.total_score !== null)
        ? item.total_score
        : ((item.overall_score !== undefined && item.overall_score !== null) ? item.overall_score : 0);
      const scoreNum = Number(scoreVal) || 0;
      const scoreFormatted = scoreNum.toFixed(1);

      const maxMarks = Number(item.max_marks) || 10;
      const pct = (item.percentage !== undefined && item.percentage !== null)
        ? Number(item.percentage).toFixed(1)
        : ((maxMarks > 0) ? ((scoreNum / maxMarks) * 100).toFixed(1) : "0.0");

      html += `
        <div class="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-amber-500/40 transition space-y-2.5">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-2">
              <span class="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-amber-300 border border-slate-700">${item.paper || "GS"}</span>
              ${isRewriteBadge}
            </div>
            <span class="text-[10px] text-slate-500 font-mono">${dateStr}</span>
          </div>
          <p class="text-xs text-slate-200 font-serif line-clamp-2 leading-relaxed">${item.question || "UPSC Mains Practice Answer"}</p>
          <div class="flex items-center justify-between pt-1 border-t border-slate-800/80">
            <div class="flex items-baseline space-x-1">
              <span class="text-base font-extrabold text-amber-400 font-serif">${scoreFormatted}</span>
              <span class="text-xs text-slate-500">/ ${maxMarks}</span>
              <span class="text-[10px] text-slate-400 font-mono ml-1.5">(${pct}%)</span>
            </div>
            <button onclick="window.viewSavedCopy('${item.id}')" class="px-3 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500 text-amber-300 hover:text-slate-950 font-bold text-xs border border-amber-500/30 transition flex items-center space-x-1">
              <span>Open Copy</span>
              <i data-lucide="arrow-right" class="w-3 h-3"></i>
            </button>
          </div>
        </div>
      `;
    });
    lockerListContainer.innerHTML = html;
    if (window.lucide) lucide.createIcons();
  } catch (err) {
    lockerListContainer.innerHTML = `
      <div class="p-4 text-center text-rose-400 text-xs">
        Failed to load answer locker: ${err.message}
      </div>
    `;
  }
}

// Restore a saved evaluated copy from Locker
window.viewSavedCopy = async function(evalId) {
  try {
    const res = await fetch(`/api/user/history/${evalId}`);
    if (!res.ok) throw new Error("Copy not found");
    const record = await res.json();

    // Close drawer & account modal
    if (answerLockerDrawer) {
      answerLockerDrawer.classList.add("hidden");
      answerLockerDrawer.classList.remove("flex");
    }
    if (typeof window.closeAccountModal === "function") {
      window.closeAccountModal();
    }

    // Set active baseline context
    state.currentEvalId = record.id;
    state.currentEvalRecord = record;
    if (record.paper) state.paper = record.paper;
    if (record.max_marks) state.marks = Number(record.max_marks);
    if (record.question) {
      state.question = record.question;
      if (questionInput) questionInput.value = record.question;
    }

    // Restore evaluation into UI
    const evalData = record.evaluation || record.evaluation_data;
    if (evalData) {
      evalData.eval_id = record.id;
      evalData.max_marks = record.max_marks || evalData.max_marks;
      evalData.paper = record.paper || evalData.paper;
      evalData.is_rewrite = Boolean(record.is_rewrite || evalData.is_rewrite);
      evalData.has_been_rewritten = Boolean(record.has_been_rewritten || evalData.has_been_rewritten);
      evalData.rewrite_eval_id = record.rewrite_eval_id || evalData.rewrite_eval_id;
      evalData.baseline_eval_id = record.baseline_eval_id || evalData.baseline_eval_id;
      renderEvaluation(evalData);
      state.previousEvaluation = JSON.parse(JSON.stringify(evalData));
    }

    // If page images are present, restore viewer
    const pages = record.pages || record.page_images;
    if (pages && pages.length > 0) {
      state.activePages = pages;
      state.previousPages = [...pages];
      state.currentPageIndex = 0;
      updateViewer();
    }

    // Scroll to results
    const results = document.getElementById("resultsContainer");
    if (results) results.scrollIntoView({ behavior: "smooth", block: "start" });
  } catch (err) {
    alert(`Could not load copy: ${err.message}`);
  }
};

// Smooth scroll to intake chamber (gates for auth first if aspirant is not signed in)
window.scrollToEvaluation = function() {
  if (!state.user || !state.user.email) {
    window.openAuthModal("Sign in or register to unlock your 5 Free Evaluations and access the evaluation chamber.");
    return;
  }
  window.switchStudioState("intake");
};

// Smooth scroll to 1st page subscription section or open pricing modal
window.scrollToSubscriptionPlans = function() {
  const firstPageSub = document.getElementById("firstPageSubscriptionSection");
  if (firstPageSub && !firstPageSub.classList.contains("hidden") && firstPageSub.style.display !== "none") {
    firstPageSub.scrollIntoView({ behavior: "smooth", block: "start" });
  } else {
    window.openPricingModal();
  }
};

// =====================================================================
// 💳 DIRECT ZERO-FEE UPI CHECKOUT SUITE (PhonePe / SBI QR: 9661228832-2@ybl)
// =====================================================================

// Starts subscription checkout: gates for auth first, then calls create-order and opens #upiCheckoutModal
window.startSubscriptionCheckout = async function(packId) {
  if (!state.user || !state.user.email) {
    window.pendingCheckoutPack = packId;
    const packLabels = {
      'sachet_3': 'Sachet Pack (₹49)',
      'sachet_49': 'Sachet Pack (₹49)',
      'revision_10': 'Revision Pack (₹149)',
      'revision_149': 'Revision Pack (₹149)',
      'monthly_pro': 'Mains Pro (₹399/mo)',
      'pro_399': 'Mains Pro (₹399/mo)'
    };
    const packLabel = packLabels[packId] || 'Practice Pack';
    window.openAuthModal(`Please sign in or create an account first to unlock your ${packLabel}. Checkout opens immediately!`);
    return;
  }

  // Close modals
  window.closePricingModal();
  window.closeAccountModal();

  try {
    const res = await fetch("/api/payment/create-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: state.user.email,
        name: state.user.name || "Aspirant",
        plan_id: packId
      })
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail || "Could not initialize UPI order");
    }

    const order = await res.json();
    window.activeCheckoutOrder = order;

    // Populate #upiCheckoutModal
    const planNameEl = document.getElementById("checkoutPlanName");
    if (planNameEl) planNameEl.textContent = order.plan_name;
    const orderIdBadge = document.getElementById("checkoutOrderIdBadge");
    if (orderIdBadge) orderIdBadge.textContent = order.order_id;
    const amountEl = document.getElementById("checkoutAmountDisplay");
    if (amountEl) amountEl.textContent = `₹${order.amount}`;
    const upiIdEl = document.getElementById("checkoutUpiIdText");
    if (upiIdEl) upiIdEl.textContent = order.upi_id;
    const qrImgEl = document.getElementById("checkoutQrImage");
    if (qrImgEl) qrImgEl.src = order.qr_image_url || "/static/sbi_phonepe_qr.jpg";
    const intentBtn = document.getElementById("checkoutUpiIntentBtn");
    if (intentBtn && order.upi_url) intentBtn.href = order.upi_url;

    // Reset inputs
    const utrInput = document.getElementById("checkoutUtrInput");
    if (utrInput) utrInput.value = "";
    const utrCounter = document.getElementById("checkoutUtrCounter");
    if (utrCounter) utrCounter.textContent = "0 / 12 Digits";
    const screenshotInput = document.getElementById("checkoutScreenshotInput");
    if (screenshotInput) screenshotInput.value = "";

    // Show form state, hide success state
    const formState = document.getElementById("checkoutFormState");
    const successState = document.getElementById("checkoutSuccessState");
    if (formState) formState.classList.remove("hidden");
    if (successState) successState.classList.add("hidden");

    // Open upiCheckoutModal
    const upiModal = document.getElementById("upiCheckoutModal");
    if (upiModal) {
      upiModal.classList.remove("hidden");
      upiModal.classList.add("flex");
      if (window.lucide) lucide.createIcons();
    }
  } catch (e) {
    alert("Checkout error: " + e.message);
  }
};

// Backwards compatibility for rechargePack calls
window.rechargePack = function(packType) {
  window.startSubscriptionCheckout(packType);
};

window.closeUpiCheckoutModal = function() {
  const upiModal = document.getElementById("upiCheckoutModal");
  if (upiModal) {
    upiModal.classList.add("hidden");
    upiModal.classList.remove("flex");
  }
};

window.copyCheckoutUpiId = function() {
  const upiIdEl = document.getElementById("checkoutUpiIdText");
  const upiId = (upiIdEl ? upiIdEl.textContent : "9661228832-2@ybl").trim();
  navigator.clipboard.writeText(upiId).then(() => {
    const label = document.getElementById("copyUpiIdLabel");
    if (label) {
      const orig = label.textContent;
      label.textContent = "Copied!";
      setTimeout(() => { label.textContent = orig; }, 2200);
    }
    if (typeof window.showAppToast === "function") {
      window.showAppToast(`Copied UPI ID: ${upiId}`);
    }
  }).catch(() => {
    alert(`UPI ID: ${upiId}`);
  });
};

window.handleUtrInput = function(input) {
  if (!input) return;
  input.value = input.value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
  const counter = document.getElementById("checkoutUtrCounter");
  if (counter) {
    const len = input.value.length;
    counter.textContent = `${len} / 12 Digits`;
    if (len >= 12) {
      counter.classList.add("text-emerald-400");
      counter.classList.remove("text-slate-400");
    } else {
      counter.classList.remove("text-emerald-400");
      counter.classList.add("text-slate-400");
    }
  }
};

window.submitUpiPaymentProof = async function() {
  const utrInput = document.getElementById("checkoutUtrInput");
  const utr = utrInput ? utrInput.value.trim() : "";
  if (!utr || utr.length < 6) {
    alert("Please enter a valid UPI UTR / Transaction Reference Number (usually 12 digits from your PhonePe/GPay receipt).");
    if (utrInput) utrInput.focus();
    return;
  }

  if (!window.activeCheckoutOrder) {
    alert("Order session expired. Please re-select your plan.");
    window.closeUpiCheckoutModal();
    return;
  }

  const submitBtn = document.getElementById("submitCheckoutProofBtn");
  const origContent = submitBtn ? submitBtn.innerHTML : "";
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.innerHTML = `<span>Submitting Proof...</span>`;
  }

  let screenshotData = null;
  const screenshotInput = document.getElementById("checkoutScreenshotInput");
  if (screenshotInput && screenshotInput.files && screenshotInput.files[0]) {
    try {
      screenshotData = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.onerror = () => resolve(null);
        reader.readAsDataURL(screenshotInput.files[0]);
      });
    } catch (err) {
      screenshotData = null;
    }
  }

  try {
    const res = await fetch("/api/payment/submit-utr", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        order_id: window.activeCheckoutOrder.order_id,
        email: state.user.email,
        name: state.user.name || "Aspirant",
        plan_id: window.activeCheckoutOrder.plan_id,
        plan_name: window.activeCheckoutOrder.plan_name,
        amount: window.activeCheckoutOrder.amount,
        utr_number: utr,
        screenshot_data: screenshotData
      })
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail || "Failed to submit transaction proof");
    }

    const data = await res.json();

    // Instant Zero-Wait Subscription Activation: Sync User & Balance
    if (data.user) {
      state.user = data.user;
      localStorage.setItem("mainsmentor_user", JSON.stringify(state.user));
      updateUserUI();
      refreshLockerBadge();
    }

    // Show instant celebration success state in modal
    const formState = document.getElementById("checkoutFormState");
    const successState = document.getElementById("checkoutSuccessState");
    if (formState) formState.classList.add("hidden");
    if (successState) successState.classList.remove("hidden");

    const successOrderId = document.getElementById("successOrderId");
    if (successOrderId) successOrderId.textContent = window.activeCheckoutOrder.order_id;
    const successUtrNumber = document.getElementById("successUtrNumber");
    if (successUtrNumber) successUtrNumber.textContent = utr;

    if (window.lucide) lucide.createIcons();

    if (typeof window.showAppToast === "function") {
      window.showAppToast("🎉 Subscription verified & activated instantly! Credits unlocked.");
    }
  } catch (e) {
    alert("Submission Error: " + e.message);
  } finally {
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.innerHTML = origContent;
      if (window.lucide) lucide.createIcons();
    }
  }
};

// Immediate continuation after instant UPI subscription checkout
window.onInstantSubscriptionComplete = function() {
  window.closeUpiCheckoutModal();
  updateUserUI();
  window.switchStudioState("intake");
};

// Initialize User, Daily Question, Locker, and Pricing Listeners
setupUserAndModalListeners();

// Load evaluation by ID directly into active studio
window.loadEvaluationById = async function(evalId) {
  if (!evalId) return false;
  try {
    const res = await fetch(`/api/user/history/${encodeURIComponent(evalId)}`);
    if (!res.ok) {
      console.warn("Could not fetch evaluation:", evalId, res.status);
      return false;
    }
    const record = await res.json();
    state.currentEvalId = record.id;
    state.currentEvalRecord = record;
    if (record.paper) state.paper = record.paper;
    if (record.max_marks) state.marks = Number(record.max_marks);
    if (record.question) {
      state.question = record.question;
      const qInput = document.getElementById("questionInput");
      if (qInput) qInput.value = record.question;
    }
    const evalData = record.evaluation || record.evaluation_data;
    if (evalData) {
      evalData.eval_id = record.id;
      evalData.created_at = record.created_at;
      evalData.max_marks = record.max_marks || evalData.max_marks;
      evalData.paper = record.paper || evalData.paper;
      renderEvaluation(evalData);
      state.previousEvaluation = JSON.parse(JSON.stringify(evalData));
    }
    const pages = record.pages || record.page_images;
    if (pages && pages.length > 0) {
      state.activePages = pages;
      state.previousPages = [...pages];
      state.currentPageIndex = 0;
      updateViewer();
    }
    window.switchStudioState("studio");
    return true;
  } catch(e) {
    console.error("Failed to load evaluation by ID:", e);
    return false;
  }
};

// Auto Evaluation / Sample / ID Hook
const urlParams = new URLSearchParams(window.location.search);
const evalIdParam = urlParams.get("eval_id");
if (evalIdParam) {
  setTimeout(() => {
    window.loadEvaluationById(evalIdParam);
  }, 250);
} else if (urlParams.get("autoeval") === "1" || urlParams.get("load_sample") === "true") {
  setTimeout(() => {
    if (typeof window.loadSampleAnswerCopy === "function") {
      window.loadSampleAnswerCopy();
    }
  }, 400);
}

// Global Keyboard Shortcut: Print feature paused temporarily
document.addEventListener("keydown", (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "p") {
    // Print feature paused for evaluated copies
  }
});

/* ================================================================= */
/* 🎓 COMPREHENSIVE ASPIRANT ACCOUNT & EVALUATION SUITE CONTROLLERS  */
/* Sub-menus: Profile, Subscription, Weekly Locker, Tracker, Feedback*/
/* ================================================================= */
window.openAccountModal = function(tab = 'profile') {
  const modal = document.getElementById("accountModal");
  if (!modal) return;
  modal.classList.remove("hidden");
  modal.classList.add("flex");
  updateUserUI();
  window.switchAccountTab(tab);
};

window.closeAccountModal = function() {
  const modal = document.getElementById("accountModal");
  if (modal) {
    modal.classList.add("hidden");
    modal.classList.remove("flex");
  }
};

// Close modal when clicking outside dialog container
const accountModalEl = document.getElementById("accountModal");
if (accountModalEl) {
  accountModalEl.addEventListener("click", (e) => {
    if (e.target === accountModalEl) {
      window.closeAccountModal();
    }
  });
}

window.switchAccountTab = function(tabName) {
  const tabs = ['profile', 'subscription', 'locker', 'tracker', 'feedback'];
  tabs.forEach(t => {
    const btn = document.getElementById(`accountNavBtn_${t}`);
    if (btn) {
      if (t === tabName) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    }
    const pane = document.getElementById(`accountPane_${t}`);
    if (pane) {
      if (t === tabName) {
        pane.classList.remove('hidden');
      } else {
        pane.classList.add('hidden');
      }
    }
  });

  const titleEl = document.getElementById("accountTabTitle");
  const subEl = document.getElementById("accountTabSubtitle");
  if (titleEl && subEl) {
    switch(tabName) {
      case 'profile':
        titleEl.textContent = "Aspirant Profile";
        subEl.textContent = "Configure your UPSC preparation profile, optional subject, and target year";
        break;
      case 'subscription':
        titleEl.textContent = "Subscription & Free Quota";
        subEl.textContent = "Track remaining evaluation checks and re-evaluation cycles";
        break;
      case 'locker':
        titleEl.textContent = "Answer Vault & Locker";
        subEl.textContent = "Browse, search, and reload past evaluated handwritten copies";
        break;
      case 'tracker':
        titleEl.textContent = "Progress & Forensic Tracker";
        subEl.textContent = "Visual analytics, forensic weakness audit, and strategic targets";
        break;
      case 'feedback':
        titleEl.textContent = "Feedback & Bug Reports";
        subEl.textContent = "Rate our faculty rubrics, report glitches, and request features";
        break;
    }
  }

  if (tabName === 'locker') {
    window.loadWeeklyLocker();
  } else if (tabName === 'tracker') {
    setTimeout(() => window.renderPerformanceTracker(), 50);
  }

  if (window.lucide) {
    try { lucide.createIcons(); } catch(e) {}
  }
};

// -------------------------------------------------------------
// 1. My Profile & Settings
// -------------------------------------------------------------
window.saveAspirantProfile = async function() {
  if (!state.user || !state.user.email) return;
  const nameInput = document.getElementById("profileInputName");
  const yearSelect = document.getElementById("profileSelectYear");
  const optSelect = document.getElementById("profileSelectOptional");

  const newName = (nameInput ? nameInput.value : "").trim() || state.user.name;
  const newYear = yearSelect ? yearSelect.value : (state.user.target_year || "2026");
  const newOpt = optSelect ? optSelect.value : (state.user.optional_subject || "PSIR");

  try {
    const res = await fetch("/api/user/profile/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: state.user.email,
        name: newName,
        target_year: newYear,
        optional_subject: newOpt
      })
    });
    if (!res.ok) throw new Error("Failed to save profile changes");
    const updated = await res.json();
    state.user = { ...state.user, ...updated };
    localStorage.setItem("mainsmentor_user", JSON.stringify(state.user));
    updateUserUI();

    if (typeof window.showAppToast === 'function') {
      window.showAppToast("Profile updated successfully!");
    } else if (typeof window.showAppNotice === 'function') {
      window.showAppNotice("Profile Saved", "Your candidate details, target year, and optional subject have been saved.");
    } else {
      alert("Profile updated successfully!");
    }
  } catch (err) {
    alert(`Could not save profile: ${err.message}`);
  }
};

window.saveCustomApiKey = async function() {
  const input = document.getElementById("profileCustomKeyInput");
  const key = (input ? input.value : "").trim();
  const statusEl = document.getElementById("profileKeyStatusMessage");
  if (!key) {
    localStorage.removeItem("mainsmentor_api_key");
    if (statusEl) statusEl.innerHTML = `<span class="text-emerald-500 font-semibold">Using central server faculty engine (zero-key mode).</span>`;
    return;
  }

  if (statusEl) statusEl.innerHTML = `<span class="text-amber-500 font-semibold">Testing key connection...</span>`;
  try {
    const formData = new FormData();
    formData.append("api_key", key);
    const res = await fetch("/api/test-key", { method: "POST", body: formData });
    const data = await res.json();
    if (data.valid) {
      localStorage.setItem("mainsmentor_api_key", key);
      if (statusEl) statusEl.innerHTML = `<span class="text-emerald-500 font-bold">✓ Custom Key Active: ${data.message}</span>`;
    } else {
      if (statusEl) statusEl.innerHTML = `<span class="text-rose-500 font-bold">✗ Key Error: ${data.message}</span>`;
    }
  } catch (err) {
    if (statusEl) statusEl.innerHTML = `<span class="text-rose-500 font-bold">Network Error: ${err.message}</span>`;
  }
};

// -------------------------------------------------------------
// 2. Answer Locker (Weekly Grouped + Live Search + Subject Filter)
// -------------------------------------------------------------
state.lockerHistory = [];
state.lockerFilterSubject = 'ALL';
state.lockerSearchQuery = '';

window.loadWeeklyLocker = async function() {
  const container = document.getElementById("accountLockerWeeklyContainer");
  if (!container) return;
  if (!state.user || !state.user.email) return;

  container.innerHTML = `
    <div class="py-12 text-center text-slate-500 space-y-2">
      <div class="w-6 h-6 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
      <p class="text-xs">Fetching evaluated answer copies...</p>
    </div>
  `;

  try {
    const res = await fetch(`/api/user/history?email=${encodeURIComponent(state.user.email)}`);
    if (!res.ok) throw new Error("Failed to fetch locker history");
    const list = await res.json();
    state.lockerHistory = Array.isArray(list) ? list : [];

    // Sync badges
    const countStr = state.lockerHistory.length.toString();
    const navLockerCount = document.getElementById("accountNavLockerCount");
    if (navLockerCount) navLockerCount.textContent = countStr;
    if (lockerCountBadge) lockerCountBadge.textContent = countStr;
    const mbBadge = document.getElementById("mbLockerBadge");
    if (mbBadge) mbBadge.textContent = countStr;

    window.renderWeeklyLocker();
  } catch (err) {
    container.innerHTML = `
      <div class="p-4 text-center text-rose-400 text-xs">
        Failed to load weekly answer locker: ${err.message}
      </div>
    `;
  }
};

window.setLockerSubjectFilter = function(subj) {
  state.lockerFilterSubject = (subj || 'ALL').toUpperCase();
  document.querySelectorAll('.locker-subject-chip').forEach(chip => {
    if (chip.id === `lockerFilterChip_${subj}`) {
      chip.classList.add('active');
    } else {
      chip.classList.remove('active');
    }
  });
  window.renderWeeklyLocker();
};

window.filterWeeklyLocker = function() {
  const input = document.getElementById("accountLockerSearchInput");
  state.lockerSearchQuery = (input ? input.value : '').trim().toLowerCase();
  window.renderWeeklyLocker();
};

window.renderWeeklyLocker = function() {
  const container = document.getElementById("accountLockerWeeklyContainer");
  if (!container) return;

  if (!state.lockerHistory || state.lockerHistory.length === 0) {
    container.innerHTML = `
      <div class="py-16 text-center text-slate-500 space-y-3 px-4">
        <div class="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center mx-auto text-slate-400">
          <i data-lucide="archive" class="w-6 h-6"></i>
        </div>
        <p class="text-xs font-semibold text-slate-700 dark:text-slate-300">No Evaluated Copies in Locker</p>
        <p class="text-[11px] text-slate-500 max-w-xs mx-auto">Upload an answer copy or try the Daily Target to start tracking your trajectory!</p>
      </div>
    `;
    if (window.lucide) lucide.createIcons();
    return;
  }

  // Filter items
  const filtered = state.lockerHistory.filter(item => {
    const paperMatch = state.lockerFilterSubject === 'ALL' || 
      (item.paper || '').toUpperCase().includes(state.lockerFilterSubject);
    
    const qText = (item.question || '').toLowerCase();
    const pText = (item.paper || '').toLowerCase();
    const searchMatch = !state.lockerSearchQuery || 
      qText.includes(state.lockerSearchQuery) || 
      pText.includes(state.lockerSearchQuery);

    return paperMatch && searchMatch;
  });

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="py-12 text-center text-slate-500 space-y-2 px-4">
        <i data-lucide="search-x" class="w-8 h-8 mx-auto text-slate-400"></i>
        <p class="text-xs font-semibold text-slate-700 dark:text-slate-300">No matching answer copies found</p>
        <p class="text-[11px] text-slate-400">Try adjusting your search keyword or subject filter.</p>
      </div>
    `;
    if (window.lucide) lucide.createIcons();
    return;
  }

  // Group into weekly buckets
  const now = new Date();
  const groups = {
    thisWeek: { title: "This Week (Recent Practice)", icon: "calendar", items: [] },
    lastWeek: { title: "Last Week (7–14 Days Ago)", icon: "clock-3", items: [] },
    twoToFourWeeks: { title: "2–4 Weeks Ago", icon: "history", items: [] },
    earlier: { title: "Earlier History & Archive", icon: "archive", items: [] }
  };

  filtered.forEach(item => {
    const created = item.created_at ? new Date(item.created_at) : new Date();
    const diffDays = Math.floor((now - created) / (1000 * 60 * 60 * 24));

    if (diffDays < 7) {
      groups.thisWeek.items.push(item);
    } else if (diffDays < 14) {
      groups.lastWeek.items.push(item);
    } else if (diffDays < 28) {
      groups.twoToFourWeeks.items.push(item);
    } else {
      groups.earlier.items.push(item);
    }
  });

  let html = "";
  Object.values(groups).forEach(grp => {
    if (grp.items.length === 0) return;

    html += `
      <div class="space-y-3">
        <div class="flex items-center justify-between pb-1.5 border-b border-slate-200 dark:border-slate-800">
          <div class="flex items-center space-x-2 text-xs font-bold text-slate-800 dark:text-slate-200">
            <i data-lucide="${grp.icon}" class="w-3.5 h-3.5 text-amber-500"></i>
            <span>${grp.title}</span>
          </div>
          <span class="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold">${grp.items.length} ${grp.items.length === 1 ? 'copy' : 'copies'}</span>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
    `;

    grp.items.forEach(item => {
      const dateStr = item.created_at ? new Date(item.created_at).toLocaleDateString("en-IN", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }) : "Recently";
      const isRewriteBadge = item.is_rewrite 
        ? `<span class="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 border border-emerald-500/30">Rewrite (1/1)</span>` 
        : (item.has_been_rewritten 
            ? `<span class="text-[9px] font-bold px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-600 dark:text-cyan-300 border border-cyan-500/30">Rewritten (1/1)</span>` 
            : '');

      const scoreVal = (item.total_score !== undefined && item.total_score !== null)
        ? item.total_score
        : ((item.overall_score !== undefined && item.overall_score !== null) ? item.overall_score : 0);
      const scoreNum = Number(scoreVal) || 0;
      const scoreFormatted = scoreNum.toFixed(1);

      const maxMarks = Number(item.max_marks) || 10;
      const pct = (item.percentage !== undefined && item.percentage !== null)
        ? Number(item.percentage).toFixed(1)
        : ((maxMarks > 0) ? ((scoreNum / maxMarks) * 100).toFixed(1) : "0.0");

      let paperBadgeColor = "bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30";
      const pUpper = (item.paper || "").toUpperCase();
      if (pUpper.includes("GS2")) paperBadgeColor = "bg-blue-500/15 text-blue-700 dark:text-blue-400 border-blue-500/30";
      else if (pUpper.includes("GS3")) paperBadgeColor = "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30";
      else if (pUpper.includes("GS4")) paperBadgeColor = "bg-purple-500/15 text-purple-700 dark:text-purple-400 border-purple-500/30";
      else if (pUpper.includes("ESSAY")) paperBadgeColor = "bg-rose-500/15 text-rose-700 dark:text-rose-400 border-rose-500/30";

      html += `
        <div class="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80 hover:border-amber-500/40 transition shadow-sm space-y-2.5">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-1.5">
              <span class="text-[10px] font-bold px-2 py-0.5 rounded border ${paperBadgeColor}">${item.paper || "GS"}</span>
              ${isRewriteBadge}
            </div>
            <span class="text-[10px] text-slate-500 font-mono">${dateStr}</span>
          </div>
          <p class="text-xs text-slate-800 dark:text-slate-200 font-serif line-clamp-2 leading-relaxed font-medium">${item.question || "UPSC Mains Handwritten Answer"}</p>
          <div class="flex items-center justify-between pt-1.5 border-t border-slate-200 dark:border-slate-800/80">
            <div class="flex items-baseline space-x-1">
              <span class="text-base font-extrabold text-amber-500 font-serif">${scoreFormatted}</span>
              <span class="text-xs text-slate-500">/ ${maxMarks}</span>
              <span class="text-[10px] text-slate-400 font-mono ml-1">(${pct}%)</span>
            </div>
            <button onclick="window.viewSavedCopy('${item.id}')" class="px-2.5 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500 text-amber-700 dark:text-amber-300 hover:text-slate-950 font-bold text-xs border border-amber-500/30 transition flex items-center space-x-1 cursor-pointer">
              <span>Review Copy</span>
              <i data-lucide="arrow-right" class="w-3 h-3"></i>
            </button>
          </div>
        </div>
      `;
    });

    html += `
        </div>
      </div>
    `;
  });

  container.innerHTML = html;
  if (window.lucide) lucide.createIcons();
};

// -------------------------------------------------------------
// 3. Progress Tracker & Charts (Chart.js Integration)
// -------------------------------------------------------------
window.accountTrajectoryChartInstance = null;
window.accountSubjectChartInstance = null;
window.accountRadarChartInstance = null;

window.renderPerformanceTracker = function() {
  const history = state.lockerHistory || [];
  const totalCopies = history.length;
  
  let totalPct = 0;
  let peakPct = 0;
  history.forEach(item => {
    const score = Number(item.total_score || item.overall_score || 0);
    const maxMarks = Number(item.max_marks || 10);
    const pct = (maxMarks > 0) ? (score / maxMarks) * 100 : 0;
    totalPct += pct;
    if (pct > peakPct) peakPct = pct;
  });

  const avgPct = totalCopies > 0 ? (totalPct / totalCopies) : 0;
  const avgScoreMarks = ((avgPct / 100) * 10).toFixed(1);
  const peakScoreMarks = ((peakPct / 100) * 10).toFixed(1);

  const tcEl = document.getElementById("trackerTotalCopies");
  if (tcEl) tcEl.textContent = totalCopies.toString();
  const asEl = document.getElementById("trackerAvgScore");
  if (asEl) asEl.textContent = totalCopies > 0 ? `${avgScoreMarks} / 10 (${avgPct.toFixed(0)}%)` : "5.4 / 10 (54%)";
  const psEl = document.getElementById("trackerPeakScore");
  if (psEl) psEl.textContent = totalCopies > 0 ? `${peakScoreMarks} / 10 (${peakPct.toFixed(0)}%)` : "7.0 / 10 (70%)";
  const drEl = document.getElementById("trackerDirectiveRate");
  if (drEl) drEl.textContent = totalCopies > 0 ? "78%" : "82%";

  // Render Chart 1: Trajectory Line Chart
  const trajCanvas = document.getElementById("accountTrackerTrajectoryCanvas");
  if (trajCanvas && typeof Chart !== 'undefined') {
    if (window.accountTrajectoryChartInstance) {
      window.accountTrajectoryChartInstance.destroy();
      window.accountTrajectoryChartInstance = null;
    }

    let labels = [];
    let dataPoints = [];
    if (totalCopies >= 2) {
      const chronList = [...history].reverse();
      labels = chronList.map((item, idx) => `Copy #${idx+1} (${item.paper || 'GS'})`);
      dataPoints = chronList.map(item => {
        const s = Number(item.total_score || item.overall_score || 0);
        const m = Number(item.max_marks || 10);
        return m > 0 ? Number(((s / m) * 100).toFixed(1)) : 50;
      });
    } else {
      labels = ['Attempt 1 (Baseline)', 'Attempt 2 (Directives)', 'Attempt 3 (PESTLE Depth)', 'Attempt 4 (Diagrams)', 'Attempt 5 (Target)'];
      dataPoints = totalCopies === 1 
        ? [Number(((Number(history[0].total_score || 5) / Number(history[0].max_marks || 10)) * 100).toFixed(1)), 52, 58, 63, 68]
        : [44, 50, 56, 62, 68];
    }

    window.accountTrajectoryChartInstance = new Chart(trajCanvas, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Aspirant Score (%)',
            data: dataPoints,
            borderColor: '#f59e0b',
            backgroundColor: 'rgba(245, 158, 11, 0.1)',
            borderWidth: 3,
            tension: 0.35,
            pointRadius: 5,
            pointBackgroundColor: '#f59e0b',
            fill: true
          },
          {
            label: '50% Mains Interview Benchmark',
            data: labels.map(() => 50),
            borderColor: '#64748b',
            borderWidth: 2,
            borderDash: [5, 5],
            pointRadius: 0,
            fill: false
          },
          {
            label: '60% AIR Top 50 Standard',
            data: labels.map(() => 60),
            borderColor: '#10b981',
            borderWidth: 2,
            borderDash: [3, 3],
            pointRadius: 0,
            fill: false
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            min: 20,
            max: 85,
            ticks: { callback: v => v + "%", color: '#94a3b8' },
            grid: { color: 'rgba(148, 163, 184, 0.1)' }
          },
          x: {
            ticks: { color: '#94a3b8', font: { size: 10 } },
            grid: { display: false }
          }
        },
        plugins: {
          legend: { position: 'top', labels: { boxWidth: 12, color: '#94a3b8', font: { size: 10 } } }
        }
      }
    });
  }

  // Render Chart 2: Subject Performance Bar Chart
  const subjCanvas = document.getElementById("accountTrackerSubjectCanvas");
  if (subjCanvas && typeof Chart !== 'undefined') {
    if (window.accountSubjectChartInstance) {
      window.accountSubjectChartInstance.destroy();
      window.accountSubjectChartInstance = null;
    }

    const papers = ['GS 1', 'GS 2', 'GS 3', 'GS 4', 'Essay', 'Optional'];
    const paperAverages = papers.map(p => {
      const pUpper = p.replace(/\s+/g, '').toUpperCase();
      const matching = history.filter(item => (item.paper || '').replace(/\s+/g, '').toUpperCase() === pUpper);
      if (matching.length > 0) {
        const sum = matching.reduce((acc, curr) => {
          const sc = Number(curr.total_score || curr.overall_score || 0);
          const mm = Number(curr.max_marks || 10);
          return acc + (mm > 0 ? (sc / mm) * 100 : 50);
        }, 0);
        return Number((sum / matching.length).toFixed(1));
      }
      if (p === 'GS 1') return 52;
      if (p === 'GS 2') return 56;
      if (p === 'GS 3') return 48;
      if (p === 'GS 4') return 60;
      if (p === 'Essay') return 62;
      return 55;
    });

    window.accountSubjectChartInstance = new Chart(subjCanvas, {
      type: 'bar',
      data: {
        labels: papers,
        datasets: [{
          label: 'Average Score (%)',
          data: paperAverages,
          backgroundColor: [
            'rgba(245, 158, 11, 0.75)',
            'rgba(59, 130, 246, 0.75)',
            'rgba(16, 185, 129, 0.75)',
            'rgba(168, 85, 247, 0.75)',
            'rgba(244, 63, 94, 0.75)',
            'rgba(20, 184, 166, 0.75)'
          ],
          borderRadius: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            min: 0,
            max: 80,
            ticks: { callback: v => v + "%", color: '#94a3b8' },
            grid: { color: 'rgba(148, 163, 184, 0.1)' }
          },
          x: {
            ticks: { color: '#94a3b8' },
            grid: { display: false }
          }
        },
        plugins: {
          legend: { display: false }
        }
      }
    });
  }

  // Render Chart 3: 6-Dimension Competency Radar Chart
  const radarCanvas = document.getElementById("accountTrackerRadarCanvas");
  if (radarCanvas && typeof Chart !== 'undefined') {
    if (window.accountRadarChartInstance) {
      window.accountRadarChartInstance.destroy();
      window.accountRadarChartInstance = null;
    }

    window.accountRadarChartInstance = new Chart(radarCanvas, {
      type: 'radar',
      data: {
        labels: [
          'Directive Adherence',
          'Intro & Punch',
          'PESTLE Multi-Dimensionality',
          'Diagrams & Flowcharts',
          'Presentation & Headings',
          'Way Forward & Synthesis'
        ],
        datasets: [
          {
            label: 'Candidate Current Level',
            data: [74, 65, 58, 42, 78, 68],
            borderColor: '#a855f7',
            backgroundColor: 'rgba(168, 85, 247, 0.2)',
            borderWidth: 2,
            pointBackgroundColor: '#a855f7'
          },
          {
            label: 'Top 50 Rank Topper Benchmark',
            data: [85, 80, 85, 80, 85, 85],
            borderColor: '#10b981',
            backgroundColor: 'rgba(16, 185, 129, 0.05)',
            borderWidth: 1.5,
            borderDash: [4, 4],
            pointBackgroundColor: '#10b981'
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          r: {
            min: 0,
            max: 100,
            ticks: { display: false, stepSize: 20 },
            grid: { color: 'rgba(148, 163, 184, 0.15)' },
            angleLines: { color: 'rgba(148, 163, 184, 0.2)' },
            pointLabels: { color: '#94a3b8', font: { size: 9.5 } }
          }
        },
        plugins: {
          legend: { position: 'top', labels: { boxWidth: 10, color: '#94a3b8', font: { size: 9.5 } } }
        }
      }
    });
  }
};

// -------------------------------------------------------------
// 4. Feedback & Bug Report Controller
// -------------------------------------------------------------
state.feedbackRating = 5;
state.feedbackCategory = 'Website Glitch / Bug';

window.setFeedbackRating = function(rating) {
  state.feedbackRating = rating;
  const container = document.getElementById("feedbackStarsContainer");
  if (container) {
    const btns = container.querySelectorAll(".star-btn");
    btns.forEach((btn, idx) => {
      const starNum = idx + 1;
      const svg = btn.querySelector("svg");
      if (starNum <= rating) {
        btn.className = "star-btn text-amber-400 p-1 hover:scale-110 transition";
        if (svg) svg.classList.add("fill-amber-400");
      } else {
        btn.className = "star-btn text-slate-400 dark:text-slate-600 p-1 hover:scale-110 transition";
        if (svg) svg.classList.remove("fill-amber-400");
      }
    });
  }
  const desc = document.getElementById("feedbackRatingDesc");
  if (desc) {
    const texts = {
      5: "⭐⭐⭐⭐⭐ Outstanding faculty evaluation!",
      4: "⭐⭐⭐⭐ Very good, minor improvements needed.",
      3: "⭐⭐⭐ Average, evaluation or website could be better.",
      2: "⭐⭐ Below expectations, faced issues.",
      1: "⭐ Disappointed, needs urgent fixing."
    };
    desc.textContent = texts[rating] || "";
  }
};

window.setFeedbackCategory = function(cat) {
  state.feedbackCategory = cat;
  const container = document.getElementById("feedbackCategoryContainer");
  if (container) {
    container.querySelectorAll(".feedback-cat-btn").forEach(btn => {
      if (btn.textContent.includes(cat) || btn.getAttribute("onclick")?.includes(cat)) {
        btn.className = "feedback-cat-btn active px-3 py-1.5 rounded-xl text-xs font-semibold bg-amber-500 text-slate-950 transition cursor-pointer";
      } else {
        btn.className = "feedback-cat-btn px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700 transition cursor-pointer";
      }
    });
  }
};

// Feedback Screenshot Attachment Handler
state.feedbackScreenshotBase64 = null;

const feedbackGalleryInput = document.getElementById("feedbackGalleryInput");
const feedbackCameraInput = document.getElementById("feedbackCameraInput");

async function handleFeedbackScreenshotSelect(file) {
  if (!file || !file.type.startsWith("image/")) return;
  try {
    const compressed = await compressImageIfNeeded(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      state.feedbackScreenshotBase64 = e.target.result;
      const previewBox = document.getElementById("feedbackScreenshotPreview");
      const previewImg = document.getElementById("feedbackScreenshotImg");
      const previewName = document.getElementById("feedbackScreenshotName");
      if (previewBox && previewImg && previewName) {
        previewImg.src = e.target.result;
        previewName.textContent = file.name || "bug_screenshot.jpg";
        previewBox.classList.remove("hidden");
      }
      if (window.lucide) lucide.createIcons();
    };
    reader.readAsDataURL(compressed);
  } catch (err) {
    console.warn("Feedback screenshot processing error:", err);
  }
}

if (feedbackGalleryInput) {
  feedbackGalleryInput.addEventListener("change", () => {
    if (feedbackGalleryInput.files && feedbackGalleryInput.files[0]) {
      handleFeedbackScreenshotSelect(feedbackGalleryInput.files[0]);
    }
  });
}

if (feedbackCameraInput) {
  feedbackCameraInput.addEventListener("change", () => {
    if (feedbackCameraInput.files && feedbackCameraInput.files[0]) {
      handleFeedbackScreenshotSelect(feedbackCameraInput.files[0]);
    }
  });
}

window.removeFeedbackScreenshot = function() {
  state.feedbackScreenshotBase64 = null;
  const previewBox = document.getElementById("feedbackScreenshotPreview");
  if (previewBox) previewBox.classList.add("hidden");
  if (feedbackGalleryInput) feedbackGalleryInput.value = "";
  if (feedbackCameraInput) feedbackCameraInput.value = "";
};

window.submitAspirantFeedback = async function() {
  const msgInput = document.getElementById("feedbackMessageInput");
  const message = (msgInput ? msgInput.value : "").trim();
  if (!message) {
    if (typeof window.showAppNotice === 'function') {
      window.showAppNotice("Feedback Required", "Please enter a few words about your experience, bug report, or suggestion.");
    } else {
      alert("Please enter a few words about your feedback or bug report.");
    }
    return;
  }

  const submitBtn = document.getElementById("feedbackSubmitBtn");
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.innerHTML = `<span class="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></span> Submitting...`;
  }

  try {
    const res = await fetch("/api/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: state.user?.email || "anonymous@cookedmains.ai",
        name: state.user?.name || "Aspirant",
        rating: state.feedbackRating || 5,
        category: state.feedbackCategory || "General Experience",
        message: message,
        screenshot: state.feedbackScreenshotBase64
      })
    });
    if (!res.ok) throw new Error("Could not submit feedback");
    if (msgInput) msgInput.value = "";
    window.removeFeedbackScreenshot();
    if (typeof window.showAppNotice === 'function') {
      window.showAppNotice("Feedback Submitted!", "Thank you for helping us improve Cooked Mains! Your feedback has been recorded directly for our faculty and engineering team.");
    } else {
      alert("Thank you for your feedback! It has been submitted successfully.");
    }
  } catch (err) {
    alert(`Feedback error: ${err.message}`);
  } finally {
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.innerHTML = `<i data-lucide="send" class="w-4 h-4"></i> <span>Submit Feedback</span>`;
      if (window.lucide) lucide.createIcons();
    }
  }
};

// -------------------------------------------------------------
// 5. Logout & Switch Cadet (Lands on Top of Home Page)
// -------------------------------------------------------------
window.logoutAspirant = function() {
  localStorage.removeItem("mainsmentor_user");
  localStorage.removeItem("mainsmentor_api_key");
  state.user = null;
  state.activeStudioView = "intake";

  window.closeAccountModal();
  updateUserUI();
  refreshLockerBadge();

  // Reset viewport to home hero & subscription display; strictly hide intake deck & evaluation studio
  const studio = document.getElementById("evaluationStudio");
  const intake = document.getElementById("intakeDeck");
  const hero = document.getElementById("heroLandingSection");
  const firstPageSub = document.getElementById("firstPageSubscriptionSection");
  if (studio) {
    studio.classList.add("hidden");
    studio.style.display = "none";
  }
  if (intake) {
    intake.style.setProperty("display", "none", "important");
    intake.classList.add("hidden");
  }
  if (hero) {
    hero.classList.remove("hidden");
    hero.style.display = "flex";
  }
  if (firstPageSub) {
    firstPageSub.classList.remove("hidden");
    firstPageSub.style.display = "flex";
  }

  // Smoothly land on top of the home page
  window.scrollTo({ top: 0, behavior: "smooth" });

  if (typeof window.showAppToast === 'function') {
    window.showAppToast("Signed out successfully. Welcome back anytime!");
  }
};



