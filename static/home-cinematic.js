/**
 * Cooked Mains — Cinematic Hero Micro-Interactions (Phase 1 Corrections)
 * Presentation-Only: Subdued 3D Desk Tilt, Fine-Pointer Gating & Reduced-Motion Guards.
 * ZERO application state modification, ZERO API calls, ZERO routing interference.
 */
(function() {
  'use strict';

  const stageWrap = document.getElementById('cinematicStageWrap');
  const viewport = document.getElementById('cinematicDeskViewport');
  if (!stageWrap || !viewport) return;

  // Media Queries for Capabilities and Preferences
  const finePointerQuery = window.matchMedia('(pointer: fine)');
  const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

  function isTiltEligible() {
    // 1. Must NOT request reduced motion
    if (reducedMotionQuery.matches) return false;
    // 2. Must have a fine pointer (mouse/trackpad, NOT touch or stylus coarse pointer)
    if (!finePointerQuery.matches) return false;
    // 3. Must be on desktop two-column layout (min-width: 1024px)
    if (window.innerWidth < 1024) return false;

    return true;
  }

  let isIntersecting = false;
  let rafId = null;
  let currentTiltX = 0;
  let currentTiltY = 0;
  let targetTiltX = 0;
  let targetTiltY = 0;

  function resetTilt() {
    targetTiltX = 0;
    targetTiltY = 0;
    currentTiltX = 0;
    currentTiltY = 0;
    if (stageWrap) {
      stageWrap.style.transform = 'none';
    }
    if (rafId) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
  }

  // Track if hero is visible in viewport before running RAF
  let observer = null;
  if ('IntersectionObserver' in window) {
    observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        isIntersecting = entry.isIntersecting;
        if (!isIntersecting) {
          resetTilt();
        }
      });
    }, { threshold: 0.1 });
    observer.observe(viewport);
  } else {
    isIntersecting = true;
  }

  function updateTransform() {
    if (!isTiltEligible() || !isIntersecting) {
      resetTilt();
      return;
    }

    // Smooth lerp (linear interpolation) for refined physical paper resistance
    currentTiltX += (targetTiltX - currentTiltX) * 0.08;
    currentTiltY += (targetTiltY - currentTiltY) * 0.08;

    // Strict maximum tilt clamp (max ±2.2 deg)
    const clampedX = Math.max(-2.2, Math.min(2.2, currentTiltX));
    const clampedY = Math.max(-2.2, Math.min(2.2, currentTiltY));

    stageWrap.style.transform = `rotateX(${clampedX}deg) rotateY(${clampedY}deg) translateZ(0)`;

    // Keep loop active only if movement is ongoing
    if (Math.abs(targetTiltX - currentTiltX) > 0.01 || Math.abs(targetTiltY - currentTiltY) > 0.01) {
      rafId = requestAnimationFrame(updateTransform);
    } else {
      rafId = null;
    }
  }

  function handlePointerMove(e) {
    if (!isTiltEligible() || !isIntersecting) {
      resetTilt();
      return;
    }

    const rect = viewport.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;

    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const deltaX = (e.clientX - centerX) / (rect.width / 2);
    const deltaY = (e.clientY - centerY) / (rect.height / 2);

    // Subtle opposite-axis tilt
    targetTiltX = -deltaY * 2.0;
    targetTiltY = deltaX * 2.0;

    if (!rafId) {
      rafId = requestAnimationFrame(updateTransform);
    }
  }

  function handlePointerLeave() {
    targetTiltX = 0;
    targetTiltY = 0;
    if (!rafId && isTiltEligible()) {
      rafId = requestAnimationFrame(updateTransform);
    } else if (!isTiltEligible()) {
      resetTilt();
    }
  }

  // Bind to hero viewport
  viewport.addEventListener('pointermove', handlePointerMove, { passive: true });
  viewport.addEventListener('pointerleave', handlePointerLeave, { passive: true });

  // Phase 2: Scroll Storytelling Intersection Observer
  function initScrollStory() {
    const storyNodes = document.querySelectorAll('.cinematic-story-node');
    if (storyNodes.length === 0) return;

    if (reducedMotionQuery.matches || !('IntersectionObserver' in window)) {
      storyNodes.forEach(node => node.classList.add('is-active', 'is-visible'));
      return;
    }

    const storyObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-active', 'is-visible');
        }
      });
    }, { threshold: 0.2 });

    storyNodes.forEach(node => storyObserver.observe(node));
  }

  // Phase 3: UPSC Rubric Inspector (Cooked Mains Evaluation Framework Diagnostic System)
  function initRubricInspector() {
    const tabs = Array.from(document.querySelectorAll('.cinematic-rubric-tab'));
    const panels = Array.from(document.querySelectorAll('.cinematic-rubric-panel'));
    const gaugeSegments = Array.from(document.querySelectorAll('.cinematic-rubric-gauge-segment'));

    if (tabs.length === 0 || panels.length === 0) return;

    function activatePillar(indexStr, shouldFocus) {
      if (!indexStr) return;

      tabs.forEach(tab => {
        const isActive = tab.getAttribute('data-rubric') === indexStr;
        tab.classList.toggle('is-active', isActive);
        tab.setAttribute('aria-selected', isActive ? 'true' : 'false');
        tab.setAttribute('tabindex', isActive ? '0' : '-1');

        if (isActive) {
          if (shouldFocus) {
            const scrollBehavior = reducedMotionQuery.matches ? 'auto' : 'smooth';
            tab.scrollIntoView({ behavior: scrollBehavior, block: 'nearest', inline: 'nearest' });
            tab.focus();
          }
        }
      });

      panels.forEach(panel => {
        const isActive = panel.getAttribute('data-rubric') === indexStr;
        panel.classList.toggle('is-active', isActive);
        panel.style.display = isActive ? 'block' : 'none';
      });

      gaugeSegments.forEach(seg => {
        const isActive = seg.getAttribute('data-rubric') === indexStr;
        seg.classList.toggle('is-active', isActive);
      });

      if (window.lucide && typeof window.lucide.createIcons === 'function') {
        try { window.lucide.createIcons(); } catch(e) {}
      }
    }

    // Attach click and keyboard listeners to tabs
    tabs.forEach((tab, idx) => {
      tab.addEventListener('click', () => {
        const rubricId = tab.getAttribute('data-rubric');
        activatePillar(rubricId, false);
      });

      // Full WAI-ARIA Keyboard Navigation: Arrow Keys, Home, End, Enter, Space
      tab.addEventListener('keydown', (e) => {
        let targetIdx = -1;
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
          targetIdx = (idx + 1) % tabs.length;
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
          targetIdx = (idx - 1 + tabs.length) % tabs.length;
        } else if (e.key === 'Home') {
          targetIdx = 0;
        } else if (e.key === 'End') {
          targetIdx = tabs.length - 1;
        } else if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          const currentId = tab.getAttribute('data-rubric');
          activatePillar(currentId, false);
          return;
        }

        if (targetIdx !== -1) {
          e.preventDefault();
          const targetId = tabs[targetIdx].getAttribute('data-rubric');
          activatePillar(targetId, true);
        }
      });
    });

    // Attach click listeners to gauge segments
    gaugeSegments.forEach(seg => {
      seg.addEventListener('click', () => {
        const rubricId = seg.getAttribute('data-rubric');
        activatePillar(rubricId, false);
      });
    });

    // Default activate pillar 1
    activatePillar('1', false);
  }

  // Phase 4: Before / After Interactive Answer Copy Comparison System
  function initAnswerComparison() {
    const stage = document.getElementById('cinematicCompareStage');
    const handle = document.getElementById('cinematicCompareHandle');
    const splitBtn = document.getElementById('compareModeSplit');
    const beforeBtn = document.getElementById('compareModeBefore');
    const afterBtn = document.getElementById('compareModeAfter');
    if (!stage || !handle) return;

    let currentPos = 50; // percentage
    let isDragging = false;

    function setPosition(percent) {
      currentPos = Math.max(0, Math.min(100, percent));
      stage.style.setProperty('--compare-pos', `${currentPos}%`);
      handle.setAttribute('aria-valuenow', Math.round(currentPos));

      if (splitBtn && beforeBtn && afterBtn) {
        if (currentPos >= 98) {
          beforeBtn.classList.add('is-active');
          splitBtn.classList.remove('is-active');
          afterBtn.classList.remove('is-active');
          beforeBtn.setAttribute('aria-pressed', 'true');
          splitBtn.setAttribute('aria-pressed', 'false');
          afterBtn.setAttribute('aria-pressed', 'false');
        } else if (currentPos <= 2) {
          afterBtn.classList.add('is-active');
          splitBtn.classList.remove('is-active');
          beforeBtn.classList.remove('is-active');
          afterBtn.setAttribute('aria-pressed', 'true');
          splitBtn.setAttribute('aria-pressed', 'false');
          beforeBtn.setAttribute('aria-pressed', 'false');
        } else {
          splitBtn.classList.add('is-active');
          beforeBtn.classList.remove('is-active');
          afterBtn.classList.remove('is-active');
          splitBtn.setAttribute('aria-pressed', 'true');
          beforeBtn.setAttribute('aria-pressed', 'false');
          afterBtn.setAttribute('aria-pressed', 'false');
        }
      }
    }

    function onPointerDown(e) {
      isDragging = true;
      handle.classList.add('is-dragging');
      try {
        handle.setPointerCapture(e.pointerId);
      } catch (err) {}
      updateFromPointer(e);
    }

    function onPointerMove(e) {
      if (!isDragging) return;
      updateFromPointer(e);
    }

    function onPointerUp(e) {
      if (!isDragging) return;
      isDragging = false;
      handle.classList.remove('is-dragging');
      try {
        handle.releasePointerCapture(e.pointerId);
      } catch (err) {}
    }

    function updateFromPointer(e) {
      const rect = stage.getBoundingClientRect();
      if (rect.width === 0) return;
      const offsetX = e.clientX - rect.left;
      const percent = (offsetX / rect.width) * 100;
      setPosition(percent);
    }

    handle.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('pointerup', onPointerUp, { passive: true });
    window.addEventListener('pointercancel', onPointerUp, { passive: true });

    // Click anywhere on stage to jump divider
    stage.addEventListener('pointerdown', (e) => {
      if (e.target === handle || handle.contains(e.target)) return;
      updateFromPointer(e);
      onPointerDown(e);
    });

    // Keyboard navigation on handle
    handle.addEventListener('keydown', (e) => {
      const step = e.shiftKey ? 15 : 5;
      if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
        e.preventDefault();
        setPosition(currentPos - step);
      } else if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
        e.preventDefault();
        setPosition(currentPos + step);
      } else if (e.key === 'Home') {
        e.preventDefault();
        setPosition(0);
      } else if (e.key === 'End') {
        e.preventDefault();
        setPosition(100);
      }
    });

    // Mode Toggle Buttons
    if (splitBtn) {
      splitBtn.addEventListener('click', () => setPosition(50));
    }
    if (beforeBtn) {
      beforeBtn.addEventListener('click', () => setPosition(100));
    }
    if (afterBtn) {
      afterBtn.addEventListener('click', () => setPosition(0));
    }

    // Initialize at 50%
    setPosition(50);
  }

  // Phase 5: Daily Routine Protocol & 6-Stage Forensic Stepper
  function initDailyRoutineStepper() {
    const stepBtns = Array.from(document.querySelectorAll('.cinematic-routine-step-btn'));
    const panels = Array.from(document.querySelectorAll('.cinematic-routine-panel'));
    const prevBtn = document.getElementById('routinePrevStageBtn');
    const nextBtn = document.getElementById('routineNextStageBtn');
    if (stepBtns.length === 0 || panels.length === 0) return;

    let currentIdx = 0;

    function activateStage(index, shouldFocus) {
      if (index < 0 || index >= stepBtns.length) return;
      currentIdx = index;

      stepBtns.forEach((btn, idx) => {
        const isActive = idx === currentIdx;
        btn.classList.toggle('is-active', isActive);
        btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
        btn.setAttribute('tabindex', isActive ? '0' : '-1');

        if (isActive) {
          if (shouldFocus) {
            const scrollBehavior = reducedMotionQuery.matches ? 'auto' : 'smooth';
            btn.scrollIntoView({ behavior: scrollBehavior, block: 'nearest', inline: 'nearest' });
            btn.focus();
          }
        }
      });

      panels.forEach((panel, idx) => {
        const isActive = idx === currentIdx;
        panel.classList.toggle('is-active', isActive);
        panel.style.display = isActive ? 'block' : 'none';
      });

      if (prevBtn) {
        prevBtn.disabled = currentIdx === 0;
        prevBtn.classList.toggle('opacity-50', currentIdx === 0);
        prevBtn.classList.toggle('cursor-not-allowed', currentIdx === 0);
      }
      if (nextBtn) {
        nextBtn.disabled = currentIdx === stepBtns.length - 1;
        nextBtn.classList.toggle('opacity-50', currentIdx === stepBtns.length - 1);
        nextBtn.classList.toggle('cursor-not-allowed', currentIdx === stepBtns.length - 1);
      }

      if (window.lucide && typeof window.lucide.createIcons === 'function') {
        try { window.lucide.createIcons(); } catch(e) {}
      }
    }

    stepBtns.forEach((btn, idx) => {
      btn.addEventListener('click', () => {
        activateStage(idx, false);
      });

      btn.addEventListener('keydown', (e) => {
        let targetIdx = -1;
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
          targetIdx = (idx + 1) % stepBtns.length;
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
          targetIdx = (idx - 1 + stepBtns.length) % stepBtns.length;
        } else if (e.key === 'Home') {
          targetIdx = 0;
        } else if (e.key === 'End') {
          targetIdx = stepBtns.length - 1;
        } else if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          activateStage(idx, false);
          return;
        }

        if (targetIdx !== -1) {
          e.preventDefault();
          activateStage(targetIdx, true);
        }
      });
    });

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        if (currentIdx > 0) activateStage(currentIdx - 1, false);
      });
    }
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        if (currentIdx < stepBtns.length - 1) activateStage(currentIdx + 1, false);
      });
    }

    // Default activate stage 0
    activateStage(0, false);
  }

  // Phase 1b: Cinematic Hero Examiner Desk 4-Step Product Demonstration Sequence
  function initHeroExaminerDesk() {
    const stage = document.querySelector('.examiner-desk-stage');
    const stepPills = Array.from(document.querySelectorAll('.cinematic-demo-step-pill'));
    const fills = Array.from(document.querySelectorAll('.examiner-desk-stage .rubric-fill'));
    if (!stage) return;

    let fillTimeouts = [];
    function clearFillTimeouts() {
      fillTimeouts.forEach(t => clearTimeout(t));
      fillTimeouts = [];
    }

    function applyFillsSequentially() {
      clearFillTimeouts();
      resetFills();
      fills.forEach((fill, index) => {
        const t = setTimeout(() => {
          fill.style.width = fill.getAttribute('data-width') || '100%';
        }, 120 + index * 160);
        fillTimeouts.push(t);
      });
    }

    function applyFillsInstantly() {
      clearFillTimeouts();
      fills.forEach(fill => {
        fill.style.width = fill.getAttribute('data-width') || '100%';
      });
    }

    function resetFills() {
      clearFillTimeouts();
      fills.forEach(fill => {
        fill.style.width = '0%';
      });
    }

    function setStep(stepNum, isManual) {
      stage.setAttribute('data-active-step', String(stepNum));
      stepPills.forEach(pill => {
        const isMatch = pill.getAttribute('data-step') === String(stepNum);
        pill.classList.toggle('is-active', isMatch);
        pill.setAttribute('aria-selected', isMatch ? 'true' : 'false');
        pill.setAttribute('tabindex', isMatch ? '0' : '-1');
      });

      if (stepNum === 3) {
        if (reducedMotionQuery.matches) {
          applyFillsInstantly();
        } else {
          applyFillsSequentially();
        }
      } else if (stepNum === 4) {
        applyFillsInstantly();
      } else {
        resetFills();
      }
    }

    // Timers for auto-play sequence
    let autoTimer1 = null;
    let autoTimer2 = null;
    let autoTimer3 = null;

    function stopAutoTimers() {
      if (autoTimer1) clearTimeout(autoTimer1);
      if (autoTimer2) clearTimeout(autoTimer2);
      if (autoTimer3) clearTimeout(autoTimer3);
      autoTimer1 = null;
      autoTimer2 = null;
      autoTimer3 = null;
    }

    // Bind pill clicks and keyboard navigation
    stepPills.forEach((pill, idx) => {
      pill.addEventListener('click', () => {
        stopAutoTimers();
        const stepNum = parseInt(pill.getAttribute('data-step'), 10) || 1;
        setStep(stepNum, true);
      });

      pill.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
          e.preventDefault();
          stopAutoTimers();
          const nextIdx = (idx + 1) % stepPills.length;
          stepPills[nextIdx].click();
          stepPills[nextIdx].focus();
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
          e.preventDefault();
          stopAutoTimers();
          const prevIdx = (idx - 1 + stepPills.length) % stepPills.length;
          stepPills[prevIdx].click();
          stepPills[prevIdx].focus();
        }
      });
    });

    // Reduced motion: show settled practice evaluation state immediately
    if (reducedMotionQuery.matches) {
      setStep(4, false);
      applyFillsInstantly();
      return;
    }

    // Default start at Step 1: Clean Handwritten Answer Copy
    setStep(1, false);

    const deskViewport = document.getElementById('cinematicDeskViewport');
    let hasRunSequence = false;

    function runPurposefulSequence() {
      if (hasRunSequence) return;
      hasRunSequence = true;

      // Stage 1 (Handwritten Answer) is active
      // After 1.4s -> Stage 2 (Red-Ink Annotations beside passage)
      autoTimer1 = setTimeout(() => {
        setStep(2, false);
        // After an additional 1.6s -> Stage 3 (Rubric Dimensions Sequential Fill)
        autoTimer2 = setTimeout(() => {
          setStep(3, false);
          // After an additional 1.8s -> Stage 4 (Practice Evaluation / Sample Feedback Settled State)
          autoTimer3 = setTimeout(() => {
            setStep(4, false);
          }, 1800);
        }, 1600);
      }, 1400);
    }

    if ('IntersectionObserver' in window && deskViewport) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            runPurposefulSequence();
            observer.disconnect();
          }
        });
      }, { threshold: 0.15 });
      observer.observe(deskViewport);
    } else {
      runPurposefulSequence();
    }
  }

  // Initialize features on DOM ready
  function init() {
    initHeroExaminerDesk();
    initScrollStory();
    initRubricInspector();
    initAnswerComparison();
    initDailyRoutineStepper();
    window.hasCinematicInitialized = true;
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();


