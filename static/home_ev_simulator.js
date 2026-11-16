// CookedMains — Interactive Cutoff Sweet Spot & Negative Marking Simulator (home_ev_simulator.js)
(function () {
  'use strict';

  function initEVSimulator() {
    const totalSlider = document.getElementById('evTotalSlider');
    const sureSlider = document.getElementById('evSureSlider');
    const fiftySlider = document.getElementById('evFiftySlider');
    const wildSlider = document.getElementById('evWildSlider');

    if (!totalSlider || !sureSlider || !fiftySlider || !wildSlider) return;

    function recalculate(source) {
      let total = parseInt(totalSlider.value, 10);
      let sure = parseInt(sureSlider.value, 10);
      let fifty = parseInt(fiftySlider.value, 10);
      let wild = parseInt(wildSlider.value, 10);

      if (source === 'total') {
        // Auto-distribute based on typical aspirant ratios
        sure = Math.max(25, Math.min(60, Math.round(total * 0.54)));
        fifty = Math.max(10, Math.min(40, Math.round(total * 0.32)));
        wild = Math.max(0, total - sure - fifty);

        sureSlider.value = sure;
        fiftySlider.value = fifty;
        wildSlider.value = wild;
      } else {
        // One of the breakdown sliders moved: update total
        total = sure + fifty + wild;
        totalSlider.value = Math.max(65, Math.min(95, total));
      }

      // Update Displays
      const totalDisplay = document.getElementById('evTotalDisplay');
      const sureDisplay = document.getElementById('evSureDisplay');
      const fiftyDisplay = document.getElementById('evFiftyDisplay');
      const wildDisplay = document.getElementById('evWildDisplay');

      if (totalDisplay) totalDisplay.textContent = `${total} / 100`;
      if (sureDisplay) sureDisplay.textContent = `${sure} questions`;
      if (fiftyDisplay) fiftyDisplay.textContent = `${fifty} questions`;
      if (wildDisplay) wildDisplay.textContent = `${wild} questions`;

      // Mathematical Calculation
      // Sure-shot: 90% accuracy
      const sureCorrect = sure * 0.90;
      const sureWrong = sure * 0.10;

      // 50:50: 50% accuracy
      const fiftyCorrect = fifty * 0.50;
      const fiftyWrong = fifty * 0.50;

      // Wild guess: 25% random accuracy (1 in 4)
      const wildCorrect = wild * 0.25;
      const wildWrong = wild * 0.75;

      const totalCorrect = sureCorrect + fiftyCorrect + wildCorrect;
      const totalWrong = sureWrong + fiftyWrong + wildWrong;

      const gross = totalCorrect * 2.0;
      const penalty = totalWrong * (2.0 / 3.0);
      const net = gross - penalty;

      const CUTOFF = 88.0;
      const delta = net - CUTOFF;

      // Update Result Elements
      const netText = document.getElementById('evNetScoreText');
      const grossText = document.getElementById('evGrossScoreText');
      const penaltyText = document.getElementById('evPenaltyScoreText');
      const verdictPill = document.getElementById('evVerdictPill');
      const deltaNotice = document.getElementById('evCutoffDeltaNotice');
      const deltaText = document.getElementById('evCutoffDeltaText');
      const takeawayText = document.getElementById('evTacticalTakeaway');

      if (netText) netText.textContent = net.toFixed(1);
      if (grossText) grossText.textContent = `+${gross.toFixed(1)}`;
      if (penaltyText) penaltyText.textContent = `-${penalty.toFixed(1)}`;

      if (net >= CUTOFF) {
        if (verdictPill) {
          verdictPill.className = 'text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30';
          verdictPill.textContent = 'Cutoff Cleared';
        }
        if (deltaNotice) {
          deltaNotice.className = 'text-[11px] p-2.5 rounded-lg font-semibold flex items-center gap-2 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20';
        }
        if (deltaText) {
          deltaText.textContent = `🎉 Clearing the standard 88.0 cutoff by +${delta.toFixed(1)} marks!`;
        }
      } else {
        if (verdictPill) {
          verdictPill.className = 'text-[10px] font-bold px-2 py-0.5 rounded-md bg-rose-500/15 text-rose-700 dark:text-rose-400 border border-rose-500/30';
          verdictPill.textContent = 'Below Cutoff';
        }
        if (deltaNotice) {
          deltaNotice.className = 'text-[11px] p-2.5 rounded-lg font-semibold flex items-center gap-2 bg-rose-500/10 text-rose-700 dark:text-rose-300 border border-rose-500/20';
        }
        if (deltaText) {
          deltaText.textContent = `⚠️ Trailing the standard 88.0 cutoff by ${delta.toFixed(1)} marks (Mark-Bleed Trap!).`;
        }
      }

      // Tactical Takeaway Generation
      if (takeawayText) {
        if (wild >= 8) {
          const wildBleed = (wildWrong * (2.0 / 3.0)).toFixed(1);
          const potentialNet = (net + (wildWrong * (2.0 / 3.0)) - (wildCorrect * 2.0)).toFixed(1);
          takeawayText.textContent = `🚨 Negative Bleed: Your ${wild} wild guesses lose -${wildBleed} marks in pure penalties. Eliminating them immediately jumps your Net Score to ${potentialNet} marks!`;
        } else if (total < 75) {
          takeawayText.textContent = `⚠️ Under-Attempt Ceiling: At ${total} attempts, even strong accuracy caps your score near the cutoff edge (${net.toFixed(1)}M). Safe rankers push to 80–85 attempts using structured 50:50 elimination.`;
        } else if (net >= 95) {
          takeawayText.textContent = `💎 Ranker Safe Zone: Net ${net.toFixed(1)} marks (+${delta.toFixed(1)} safe buffer). Disciplined 50:50 elimination combined with zero FOMO guesses ensures you clear the cutoff effortlessly.`;
        } else {
          takeawayText.textContent = `🎯 Competitive Threshold: You are hovering at ${net.toFixed(1)} marks. Converting just 3 more 50:50 questions into correct keys with Topper Trap elimination gives you a safe 92+ buffer!`;
        }
      }
    }

    // Attach Listeners
    totalSlider.addEventListener('input', () => recalculate('total'));
    sureSlider.addEventListener('input', () => recalculate('pool'));
    fiftySlider.addEventListener('input', () => recalculate('pool'));
    wildSlider.addEventListener('input', () => recalculate('pool'));

    // Initial calculation
    recalculate('total');
  }

  // Auto-init on DOM Ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initEVSimulator);
  } else {
    initEVSimulator();
  }
})();
