const fs = require('fs');
const path = require('path');

const p = path.join(__dirname, '..', 'static', 'index.html');
let content = fs.readFileSync(p, 'utf8');

const targetRegex = /<!-- ================================================================= -->\r?\n\s*<!-- 🎯 INTERACTIVE CUTOFF SWEET SPOT & NEGATIVE MARKING SIMULATOR[\s\S]*?<\/section>/;

const replacement = `<!-- ================================================================= -->
    <!-- 🏛️ COOKEDMAINS INTEGRATED ECOSYSTEM PORTAL (Prelims + Mains + OS) -->
    <!-- ================================================================= -->
    <section class="w-full max-w-6xl mx-auto px-4 my-8">
      <div class="text-center mb-6">
        <span class="text-xs font-mono font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
          The Integrated UPSC CSE Preparation Ecosystem
        </span>
        <h2 class="text-xl sm:text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight mt-2">
          From Prelims Precision to Mains Mastery
        </h2>
        <p class="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl mx-auto">
          Every tool is scientifically calibrated to eliminate mark leaks, automate syllabus consistency, and elevate your scores above the final cutoff.
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        <!-- Pillar 1: Prelims Dashboard & 1,280+ PYQs -->
        <div class="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 flex flex-col justify-between gap-5 shadow-lg hover:border-amber-500/50 transition-all group">
          <div class="flex flex-col gap-3">
            <div class="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
              🎯
            </div>
            <div>
              <span class="text-[10px] font-mono uppercase tracking-wider text-amber-600 dark:text-amber-400 font-bold">1,280+ UPSC PYQs (2011–2026)</span>
              <h3 class="text-lg font-black text-slate-900 dark:text-white mt-0.5">Prelims Dashboard</h3>
            </div>
            <p class="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Distraction-free 1-at-a-time question player with 10-Second Statement Slicer, Topper's Trap Detector, and Cutoff EV Sweet Spot calculator. Zero endless scrolling.
            </p>
          </div>
          <a href="/prelims" class="w-full py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md">
            <span>Launch Prelims Dashboard</span>
            <span>→</span>
          </a>
        </div>

        <!-- Pillar 2: Mains Answer Writing Studio -->
        <div class="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 flex flex-col justify-between gap-5 shadow-lg hover:border-emerald-500/50 transition-all group">
          <div class="flex flex-col gap-3">
            <div class="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
              ✍️
            </div>
            <div>
              <span class="text-[10px] font-mono uppercase tracking-wider text-emerald-600 dark:text-emerald-400 font-bold">Instant Multimodal Evaluation</span>
              <h3 class="text-lg font-black text-slate-900 dark:text-white mt-0.5">Mains Evaluator Studio</h3>
            </div>
            <p class="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Submit your handwritten copies (10 &amp; 15 markers) for instant line-by-line examiner annotations, 5-dimension rubric scores, and model answers calibrated to IAS benchmarks.
            </p>
          </div>
          <a href="#mainsEvaluationSection" onclick="window.scrollTo({ top: 300, behavior: 'smooth' }); return false;" class="w-full py-2.5 px-4 rounded-xl bg-slate-900 dark:bg-emerald-500 hover:bg-slate-800 dark:hover:bg-emerald-400 text-white dark:text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md">
            <span>Evaluate Handwritten Copy</span>
            <span>→</span>
          </a>
        </div>

        <!-- Pillar 3: Syllabus Roadmap & Habit OS -->
        <div class="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 flex flex-col justify-between gap-5 shadow-lg hover:border-indigo-500/50 transition-all group">
          <div class="flex flex-col gap-3">
            <div class="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
              🗺️
            </div>
            <div>
              <span class="text-[10px] font-mono uppercase tracking-wider text-indigo-600 dark:text-indigo-400 font-bold">Habit OS &amp; Milestone Timeline</span>
              <h3 class="text-lg font-black text-slate-900 dark:text-white mt-0.5">Syllabus Study Roadmap</h3>
            </div>
            <p class="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Never fall off track. Vertical connected milestone timeline across all 11 GS subjects, planned vs done study hours meter, streak counter, and gamified module unlocks.
            </p>
          </div>
          <a href="/planner" class="w-full py-2.5 px-4 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md">
            <span>Open Syllabus Roadmap</span>
            <span>→</span>
          </a>
        </div>

      </div>
    </section>`;

if (targetRegex.test(content)) {
  content = content.replace(targetRegex, replacement);
  fs.writeFileSync(p, content, 'utf8');
  console.log('SUCCESS: Replaced section in index.html');
} else {
  console.error('ERROR: targetRegex did not match');
  process.exit(1);
}
