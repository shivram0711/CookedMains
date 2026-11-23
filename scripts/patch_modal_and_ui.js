const fs = require('fs');
const path = require('path');

const htmlPath = path.resolve(__dirname, '../static/prelims.html');
let html = fs.readFileSync(htmlPath, 'utf8');

// Normalize CRLF
const isCRLF = html.includes('\r\n');
if (isCRLF) {
  html = html.replace(/\r\n/g, '\n');
}

// 1. Dashboard 4 cards
const oldCardsRegex = /<!-- Card 1: Full Simulation -->[\s\S]*?<!-- Card 3: Weakness Drill -->[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/;

const newDashboardCards = `<!-- Card 1: Full Simulation (PYQs) -->
                <div class="light-card p-4 rounded-2xl bg-white dark:bg-slate-950 border-2 border-amber-500/40 hover:border-amber-500 shadow-sm hover:shadow-md transition-all flex flex-col justify-between gap-3 group">
                  <div class="flex flex-col gap-1.5">
                    <div class="flex items-center justify-between">
                      <span class="text-xs font-black text-amber-700 dark:text-amber-400 flex items-center gap-1">
                        <span>🏆</span> Full Simulation (PYQs)
                      </span>
                      <span class="px-2 py-0.5 rounded-md bg-amber-500/15 text-amber-700 dark:text-amber-300 text-[10px] font-mono font-bold">120 Mins</span>
                    </div>
                    <span class="text-[11px] text-slate-600 dark:text-slate-400 font-medium">100 Qs · CSE + CDS + CAPF 10-Yr Mix</span>
                  </div>
                  <button type="button" onclick="window.launchQuickMock('full')" class="btn-action-primary w-full py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition-all">
                    <span>▶ Start Full PYQ Test</span>
                  </button>
                </div>

                <!-- Card 2: Sectional Sprint (PYQs) -->
                <div class="light-card p-4 rounded-2xl bg-white dark:bg-slate-950 border-2 border-emerald-500/40 hover:border-emerald-500 shadow-sm hover:shadow-md transition-all flex flex-col justify-between gap-3 group">
                  <div class="flex flex-col gap-1.5">
                    <div class="flex items-center justify-between">
                      <span class="text-xs font-black text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                        <span>⚡</span> Sectional (PYQs)
                      </span>
                      <span class="px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 text-[10px] font-mono font-bold">30 Mins</span>
                    </div>
                    <span class="text-[11px] text-slate-600 dark:text-slate-400 font-medium">25 Qs · Official Keys · CSE/CDS/CAPF</span>
                  </div>
                  <button type="button" onclick="window.openMockGenerator('sectional')" class="btn-action-emerald w-full py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition-all">
                    <span>▶ Customize &amp; Start</span>
                  </button>
                </div>

                <!-- Card 3: 2026 AI Mock (Fresh) -->
                <div class="light-card p-4 rounded-2xl bg-white dark:bg-slate-950 border-2 border-purple-500/40 hover:border-purple-500 shadow-sm hover:shadow-md transition-all flex flex-col justify-between gap-3 group">
                  <div class="flex flex-col gap-1.5">
                    <div class="flex items-center justify-between">
                      <span class="text-xs font-black text-purple-700 dark:text-purple-400 flex items-center gap-1">
                        <span>🤖</span> 2026 AI Mock (Fresh)
                      </span>
                      <span class="px-2 py-0.5 rounded-md bg-purple-500/15 text-purple-700 dark:text-purple-300 text-[10px] font-mono font-bold">UPSC Standard</span>
                    </div>
                    <span class="text-[11px] text-slate-600 dark:text-slate-400 font-medium">Pairs &amp; Stmt I-II · Optional CA Blend</span>
                  </div>
                  <button type="button" onclick="window.openMockGenerator('ai_mock')" class="w-full py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer">
                    <span>▶ Generate AI Mock</span>
                  </button>
                </div>

                <!-- Card 4: Weakness Drill -->
                <div class="light-card p-4 rounded-2xl bg-white dark:bg-slate-950 border-2 border-rose-500/40 hover:border-rose-500 shadow-sm hover:shadow-md transition-all flex flex-col justify-between gap-3 group">
                  <div class="flex flex-col gap-1.5">
                    <div class="flex items-center justify-between">
                      <span class="text-xs font-black text-rose-700 dark:text-rose-400 flex items-center gap-1">
                        <span>🎯</span> Weakness Drill
                      </span>
                      <span class="px-2 py-0.5 rounded-md bg-rose-500/15 text-rose-700 dark:text-rose-300 text-[10px] font-mono font-bold">20 Mins</span>
                    </div>
                    <span class="text-[11px] text-slate-600 dark:text-slate-400 font-medium">15 Qs · Injects your logged mistakes</span>
                  </div>
                  <button type="button" onclick="window.launchQuickMock('weakness')" class="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer">
                    <span>▶ Drill Mistakes</span>
                  </button>
                </div>
              </div>
            </div>`;

// Update Dashboard Grid container class
html = html.replace(
  '<div class="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">',
  '<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">'
);

if (oldCardsRegex.test(html)) {
  html = html.replace(oldCardsRegex, newDashboardCards);
  console.log('✓ Successfully patched Dashboard cards');
} else {
  console.warn('Regex did not match oldCardsRegex');
}

// 2. Modal Segmented Nav Tabs
const oldModalNavRegex = /<div class="grid grid-cols-2 sm:grid-cols-4 p-1 rounded-2xl bg-slate-950 border border-slate-800 text-xs font-bold shadow-inner gap-1" id="mockFormatTabGroup">[\s\S]*?<\/div>/;

const newModalNav = `<div class="grid grid-cols-2 sm:grid-cols-4 p-1 rounded-2xl bg-slate-950 border border-slate-800 text-xs font-bold shadow-inner gap-1" id="mockFormatTabGroup">
          <button type="button" class="mock-tab-btn py-2 px-2 rounded-xl transition flex items-center justify-center gap-1.5 text-slate-400 hover:text-white cursor-pointer" data-format="full" onclick="window.onMockFormatChange('full')">
            <span>🏆</span>
            <span class="truncate">Full Simulation (PYQs)</span>
          </button>
          <button type="button" class="mock-tab-btn py-2 px-2 rounded-xl transition flex items-center justify-center gap-1.5 bg-amber-500 text-slate-950 shadow-md cursor-pointer" data-format="sectional" onclick="window.onMockFormatChange('sectional')">
            <span>⚡</span>
            <span class="truncate">Sectional (PYQs)</span>
          </button>
          <button type="button" class="mock-tab-btn py-2 px-2 rounded-xl transition flex items-center justify-center gap-1.5 text-slate-400 hover:text-white cursor-pointer" data-format="ai_mock" onclick="window.onMockFormatChange('ai_mock')">
            <span>🤖</span>
            <span class="truncate">2026 UPSC AI Mock</span>
          </button>
          <button type="button" class="mock-tab-btn py-2 px-2 rounded-xl transition flex items-center justify-center gap-1.5 text-slate-400 hover:text-white cursor-pointer" data-format="weakness" onclick="window.onMockFormatChange('weakness')">
            <span>🎯</span>
            <span class="truncate">Mistake Drill</span>
          </button>
        </div>`;

if (oldModalNavRegex.test(html)) {
  html = html.replace(oldModalNavRegex, newModalNav);
  console.log('✓ Successfully patched Modal Nav Tabs');
} else {
  console.warn('Regex did not match oldModalNavRegex');
}

// 3. Add Exam Sources to Full Blueprint Card
const examSourcesHtml = `
          <!-- UPSC Exam Sources Selector (Official Answer Keys Verified) -->
          <div class="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col gap-2">
            <div class="flex items-center justify-between flex-wrap gap-1">
              <span class="text-xs font-bold text-white flex items-center gap-1.5">
                <span>🏛️</span>
                <span>Include UPSC Exam Sources (10-Year Verified):</span>
              </span>
              <span class="text-[10px] font-mono text-emerald-400 font-bold">100% Official Answer Keys</span>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <label class="p-2 rounded-xl border border-slate-800 bg-slate-950 flex items-center justify-between cursor-pointer hover:border-amber-500/50 has-[:checked]:border-amber-500 has-[:checked]:bg-amber-500/10">
                <span class="text-xs font-bold text-slate-200">🏆 UPSC Civil Services (CSE)</span>
                <input type="checkbox" value="UPSC CSE" checked class="mock-source-check accent-amber-500 w-3.5 h-3.5 rounded cursor-pointer" onchange="window.updateMockLiveSummary()">
              </label>
              <label class="p-2 rounded-xl border border-slate-800 bg-slate-950 flex items-center justify-between cursor-pointer hover:border-amber-500/50 has-[:checked]:border-amber-500 has-[:checked]:bg-amber-500/10">
                <span class="text-xs font-bold text-slate-200">⚔️ Combined Defence (CDS)</span>
                <input type="checkbox" value="UPSC CDS" checked class="mock-source-check accent-amber-500 w-3.5 h-3.5 rounded cursor-pointer" onchange="window.updateMockLiveSummary()">
              </label>
              <label class="p-2 rounded-xl border border-slate-800 bg-slate-950 flex items-center justify-between cursor-pointer hover:border-amber-500/50 has-[:checked]:border-amber-500 has-[:checked]:bg-amber-500/10">
                <span class="text-xs font-bold text-slate-200">🎖️ Armed Police (CAPF AC)</span>
                <input type="checkbox" value="UPSC CAPF" checked class="mock-source-check accent-amber-500 w-3.5 h-3.5 rounded cursor-pointer" onchange="window.updateMockLiveSummary()">
              </label>
            </div>
          </div>`;

if (!html.includes('Include UPSC Exam Sources (10-Year Verified)')) {
  // Insert before <!-- Hybrid Current Affairs Blending Toggle in Full Blueprint
  html = html.replace(
    '<!-- Hybrid Current Affairs Blending Toggle (2026 Innovation) -->',
    examSourcesHtml + '\n\n          <!-- Hybrid Current Affairs Blending Toggle (2026 Innovation) -->'
  );
  console.log('✓ Successfully inserted Exam Sources into Full Blueprint');
}

// 4. Add Exam Sources to Sectional Controls
if (!html.includes('Sectional UPSC Exam Sources')) {
  const sectionalSourcesHtml = `
          <!-- Sectional UPSC Exam Sources -->
          <div class="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col gap-2">
            <div class="flex items-center justify-between flex-wrap gap-1">
              <span class="text-xs font-bold text-white flex items-center gap-1.5">
                <span>🏛️</span>
                <span>Sectional UPSC Exam Sources:</span>
              </span>
              <span class="text-[10px] font-mono text-emerald-400 font-bold">Official Keys Verified</span>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <label class="p-2 rounded-xl border border-slate-800 bg-slate-950 flex items-center justify-between cursor-pointer hover:border-amber-500/50 has-[:checked]:border-amber-500 has-[:checked]:bg-amber-500/10">
                <span class="text-xs font-bold text-slate-200">🏆 Civil Services (CSE)</span>
                <input type="checkbox" value="UPSC CSE" checked class="mock-sec-source-check accent-amber-500 w-3.5 h-3.5 rounded cursor-pointer" onchange="window.updateMockLiveSummary()">
              </label>
              <label class="p-2 rounded-xl border border-slate-800 bg-slate-950 flex items-center justify-between cursor-pointer hover:border-amber-500/50 has-[:checked]:border-amber-500 has-[:checked]:bg-amber-500/10">
                <span class="text-xs font-bold text-slate-200">⚔️ Combined Defence (CDS)</span>
                <input type="checkbox" value="UPSC CDS" checked class="mock-sec-source-check accent-amber-500 w-3.5 h-3.5 rounded cursor-pointer" onchange="window.updateMockLiveSummary()">
              </label>
              <label class="p-2 rounded-xl border border-slate-800 bg-slate-950 flex items-center justify-between cursor-pointer hover:border-amber-500/50 has-[:checked]:border-amber-500 has-[:checked]:bg-amber-500/10">
                <span class="text-xs font-bold text-slate-200">🎖️ Armed Police (CAPF AC)</span>
                <input type="checkbox" value="UPSC CAPF" checked class="mock-sec-source-check accent-amber-500 w-3.5 h-3.5 rounded cursor-pointer" onchange="window.updateMockLiveSummary()">
              </label>
            </div>
          </div>
`;
  html = html.replace(
    '<!-- Sectional Current Affairs Blending Toggle -->',
    sectionalSourcesHtml + '\n          <!-- Sectional Current Affairs Blending Toggle -->'
  );
  console.log('✓ Successfully inserted Exam Sources into Sectional Controls');
}

// 5. Replace Dedicated Monthly CA Controls with Upgraded 2026 AI Mock Controls
const oldCaControlsRegex = /<!-- 4\. DEDICATED MONTHLY CURRENT AFFAIRS CONTROLS[\s\S]*?<\/div>\s*<\/div>\s*<!-- 4\. EXAM MODE/;

const newAiMockControls = `<!-- 3. UPGRADED 2026 UPSC AI MOCK CONTROLS (Visible when format === 'ai_mock') -->
        <div id="mockAiMockControls" class="hidden flex flex-col gap-5">
          
          <!-- AI Mock Generator Header Banner -->
          <div class="p-4 rounded-2xl bg-gradient-to-br from-purple-500/15 via-slate-950 to-slate-950 border border-purple-500/30 flex flex-col gap-2.5">
            <div class="flex items-center justify-between flex-wrap gap-2">
              <div class="flex items-center gap-2">
                <span class="text-2xl">🤖</span>
                <div>
                  <h4 class="text-sm font-black text-white">2026 UPSC AI Mock Test Generator</h4>
                  <p class="text-xs text-slate-300">Brand-new UPSC-standard questions strictly reflecting 2026 prelims patterns &amp; reverse-osmosis CA integration.</p>
                </div>
              </div>
              <span class="px-2.5 py-1 rounded-full bg-purple-500/20 text-purple-300 font-mono text-xs font-bold">2026 Pattern Ready</span>
            </div>

            <!-- Pattern Tags Callout -->
            <div class="flex items-center gap-2 flex-wrap text-[10px] font-mono pt-1">
              <span class="px-2 py-0.5 rounded-md bg-slate-900 border border-purple-500/30 text-purple-300 font-bold">🧩 Pair Matching ("Only one pair...")</span>
              <span class="px-2 py-0.5 rounded-md bg-slate-900 border border-purple-500/30 text-purple-300 font-bold">⚖️ Statement-I &amp; II Format</span>
              <span class="px-2 py-0.5 rounded-md bg-slate-900 border border-purple-500/30 text-purple-300 font-bold">🎯 Reverse-Osmosis CA</span>
              <span class="px-2 py-0.5 rounded-md bg-slate-900 border border-purple-500/30 text-purple-300 font-bold">📜 Elimination-Proof</span>
            </div>
          </div>

          <!-- Mock Scope Selector: Full Length vs Sectional vs Specific Topic -->
          <div class="flex flex-col gap-2">
            <span class="text-xs font-bold text-white flex items-center gap-1.5">
              <span>🎯</span>
              <span>Select AI Mock Scope:</span>
            </span>

            <div class="grid grid-cols-1 sm:grid-cols-3 gap-2" id="aiMockScopeSelector">
              <label class="p-3 rounded-2xl border-2 border-purple-500 bg-purple-500/15 flex items-center justify-between cursor-pointer transition group" onclick="window.onAiMockScopeChange('full')">
                <div class="flex flex-col">
                  <span class="text-xs font-bold text-white group-hover:text-purple-300">🏆 Full Paper (100 Qs)</span>
                  <span class="text-[10px] text-slate-400">All 6 core pillars</span>
                </div>
                <input type="radio" name="aiMockScope" value="full" checked class="accent-purple-500">
              </label>

              <label class="p-3 rounded-2xl border border-slate-800 bg-slate-950 flex items-center justify-between cursor-pointer transition hover:border-purple-500 group" onclick="window.onAiMockScopeChange('sectional')">
                <div class="flex flex-col">
                  <span class="text-xs font-bold text-white group-hover:text-purple-300">⚡ Sectional Subjects</span>
                  <span class="text-[10px] text-slate-400">Custom subject mix</span>
                </div>
                <input type="radio" name="aiMockScope" value="sectional" class="accent-purple-500">
              </label>

              <label class="p-3 rounded-2xl border border-slate-800 bg-slate-950 flex items-center justify-between cursor-pointer transition hover:border-purple-500 group" onclick="window.onAiMockScopeChange('topic')">
                <div class="flex flex-col">
                  <span class="text-xs font-bold text-white group-hover:text-purple-300">🔍 Topic Drill</span>
                  <span class="text-[10px] text-slate-400">Specific micro-themes</span>
                </div>
                <input type="radio" name="aiMockScope" value="topic" class="accent-purple-500">
              </label>
            </div>
          </div>

          <!-- Subject Selection (Visible when Scope === 'sectional' or 'topic') -->
          <div id="aiMockSubjectContainer" class="hidden flex flex-col gap-2.5">
            <div class="flex items-center justify-between flex-wrap gap-2">
              <span class="text-xs font-bold text-white flex items-center gap-1.5">
                <span>📚</span>
                <span>Select Disciplines:</span>
              </span>
              <div class="flex items-center gap-1 text-[10px] font-bold">
                <button type="button" onclick="window.selectAiMockSubjects('all')" class="px-2 py-0.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white cursor-pointer">All Core</button>
                <button type="button" onclick="window.selectAiMockSubjects('clear')" class="px-2 py-0.5 rounded-lg bg-slate-800 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 cursor-pointer">Reset</button>
              </div>
            </div>

            <div class="grid grid-cols-2 sm:grid-cols-3 gap-2" id="aiMockSubjectCheckboxes">
              <label class="p-2.5 rounded-xl border border-slate-800 bg-slate-950 flex items-center justify-between cursor-pointer transition hover:border-purple-500/50 has-[:checked]:border-purple-500 has-[:checked]:bg-purple-500/15">
                <span class="text-xs font-bold text-slate-200">🏛️ Polity &amp; Gov</span>
                <input type="checkbox" value="Polity & Governance" checked class="ai-mock-subj-check accent-purple-500 w-3.5 h-3.5 rounded cursor-pointer" onchange="window.updateMockLiveSummary()">
              </label>
              <label class="p-2.5 rounded-xl border border-slate-800 bg-slate-950 flex items-center justify-between cursor-pointer transition hover:border-purple-500/50 has-[:checked]:border-purple-500 has-[:checked]:bg-purple-500/15">
                <span class="text-xs font-bold text-slate-200">📈 Economy &amp; Agri</span>
                <input type="checkbox" value="Economy" checked class="ai-mock-subj-check accent-purple-500 w-3.5 h-3.5 rounded cursor-pointer" onchange="window.updateMockLiveSummary()">
              </label>
              <label class="p-2.5 rounded-xl border border-slate-800 bg-slate-950 flex items-center justify-between cursor-pointer transition hover:border-purple-500/50 has-[:checked]:border-purple-500 has-[:checked]:bg-purple-500/15">
                <span class="text-xs font-bold text-slate-200">🌿 Environment</span>
                <input type="checkbox" value="Environment & Ecology" checked class="ai-mock-subj-check accent-purple-500 w-3.5 h-3.5 rounded cursor-pointer" onchange="window.updateMockLiveSummary()">
              </label>
              <label class="p-2.5 rounded-xl border border-slate-800 bg-slate-950 flex items-center justify-between cursor-pointer transition hover:border-purple-500/50 has-[:checked]:border-purple-500 has-[:checked]:bg-purple-500/15">
                <span class="text-xs font-bold text-slate-200">📜 History &amp; Art</span>
                <input type="checkbox" value="History & Culture" checked class="ai-mock-subj-check accent-purple-500 w-3.5 h-3.5 rounded cursor-pointer" onchange="window.updateMockLiveSummary()">
              </label>
              <label class="p-2.5 rounded-xl border border-slate-800 bg-slate-950 flex items-center justify-between cursor-pointer transition hover:border-purple-500/50 has-[:checked]:border-purple-500 has-[:checked]:bg-purple-500/15">
                <span class="text-xs font-bold text-slate-200">🌍 Geography</span>
                <input type="checkbox" value="Geography" checked class="ai-mock-subj-check accent-purple-500 w-3.5 h-3.5 rounded cursor-pointer" onchange="window.updateMockLiveSummary()">
              </label>
              <label class="p-2.5 rounded-xl border border-slate-800 bg-slate-950 flex items-center justify-between cursor-pointer transition hover:border-purple-500/50 has-[:checked]:border-purple-500 has-[:checked]:bg-purple-500/15">
                <span class="text-xs font-bold text-slate-200">🔬 Sci-Tech &amp; IR</span>
                <input type="checkbox" value="Science & Technology" checked class="ai-mock-subj-check accent-purple-500 w-3.5 h-3.5 rounded cursor-pointer" onchange="window.updateMockLiveSummary()">
              </label>
            </div>
          </div>

          <!-- Specific Topic Input (Visible when Scope === 'topic') -->
          <div id="aiMockTopicContainer" class="hidden flex flex-col gap-2">
            <span class="text-xs font-bold text-white flex items-center justify-between">
              <span class="flex items-center gap-1.5">
                <span>🔍</span>
                <span>Specific Topic / Keyword:</span>
              </span>
              <span class="text-[10px] text-slate-400">e.g. Monetary Policy, CBDC, Hoysala, Wetlands, CRISPR</span>
            </span>
            <input type="text" id="aiMockTopicInput" placeholder="Type any topic e.g. Delimitation, High Seas Treaty, Semiconductors..." class="light-input w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs font-medium focus:outline-none focus:border-purple-500" oninput="window.updateMockLiveSummary()">
            
            <div class="flex items-center gap-1.5 flex-wrap text-[10px] pt-0.5">
              <span class="text-slate-500 font-mono">Popular:</span>
              <button type="button" onclick="window.applyAiMockTopicChip('Constitutional Bodies')" class="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 hover:text-purple-300 cursor-pointer">Constitutional Bodies</button>
              <button type="button" onclick="window.applyAiMockTopicChip('CBDC & UPI')" class="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 hover:text-purple-300 cursor-pointer">CBDC &amp; UPI</button>
              <button type="button" onclick="window.applyAiMockTopicChip('BBNJ High Seas')" class="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 hover:text-purple-300 cursor-pointer">BBNJ High Seas</button>
              <button type="button" onclick="window.applyAiMockTopicChip('Semiconductors')" class="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 hover:text-purple-300 cursor-pointer">Semiconductors</button>
              <button type="button" onclick="window.applyAiMockTopicChip('Hoysala Temples')" class="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 hover:text-purple-300 cursor-pointer">Hoysala Temples</button>
              <button type="button" onclick="window.applyAiMockTopicChip('GLOFs')" class="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 hover:text-purple-300 cursor-pointer">Himalayan GLOFs</button>
            </div>
          </div>

          <!-- Current Affairs Integration (OPTIONAL TOGGLE!) -->
          <div class="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col gap-2.5">
            <div class="flex items-center justify-between">
              <span class="text-xs font-bold text-white flex items-center gap-1.5">
                <span>📰</span>
                <span>Current Affairs Integration (Optional):</span>
              </span>
              <span class="text-[10px] font-mono text-emerald-400 font-bold">PIB &amp; Monthly Dossiers</span>
            </div>

            <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <label class="p-2.5 rounded-xl border border-slate-800 bg-slate-950 flex items-center justify-between cursor-pointer hover:border-purple-500 has-[:checked]:border-purple-500 has-[:checked]:bg-purple-500/15">
                <span class="text-xs font-bold text-slate-300">🚫 Pure Static (0% CA)</span>
                <input type="radio" name="aiMockCaBlend" value="none" class="accent-purple-500 cursor-pointer" onchange="window.onAiMockCaBlendChange('none')">
              </label>

              <label class="p-2.5 rounded-xl border-2 border-purple-500 bg-purple-500/15 flex items-center justify-between cursor-pointer hover:border-purple-500 has-[:checked]:border-purple-500 has-[:checked]:bg-purple-500/15">
                <span class="text-xs font-bold text-slate-200">⭐ 25% CA (Standard)</span>
                <input type="radio" name="aiMockCaBlend" value="standard" checked class="accent-purple-500 cursor-pointer" onchange="window.onAiMockCaBlendChange('standard')">
              </label>

              <label class="p-2.5 rounded-xl border border-slate-800 bg-slate-950 flex items-center justify-between cursor-pointer hover:border-purple-500 has-[:checked]:border-purple-500 has-[:checked]:bg-purple-500/15">
                <span class="text-xs font-bold text-slate-300">📈 50% CA (Heavy)</span>
                <input type="radio" name="aiMockCaBlend" value="heavy" class="accent-purple-500 cursor-pointer" onchange="window.onAiMockCaBlendChange('heavy')">
              </label>

              <label class="p-2.5 rounded-xl border border-slate-800 bg-slate-950 flex items-center justify-between cursor-pointer hover:border-purple-500 has-[:checked]:border-purple-500 has-[:checked]:bg-purple-500/15">
                <span class="text-xs font-bold text-slate-300">📰 100% Monthly CA</span>
                <input type="radio" name="aiMockCaBlend" value="pure_ca" class="accent-purple-500 cursor-pointer" onchange="window.onAiMockCaBlendChange('pure_ca')">
              </label>
            </div>

            <!-- Target Monthly Magazines / Dossiers Sub-Selector (Visible when CA > 0) -->
            <div id="aiMockCaMonthsSection" class="pt-2 border-t border-slate-800/80 flex flex-col gap-2">
              <div class="flex items-center justify-between">
                <span class="text-[11px] font-bold text-slate-300">Target Monthly Dossiers (Uploaded Magazines &amp; PIB):</span>
                <div class="flex items-center gap-2">
                  <button type="button" onclick="window.selectAiMockMonths('all')" class="text-[10px] text-emerald-400 hover:underline cursor-pointer">All (Jan–Jul 2026)</button>
                  <span class="text-slate-600">·</span>
                  <button type="button" onclick="window.selectAiMockMonths('clear')" class="text-[10px] text-slate-400 hover:text-rose-400 cursor-pointer">Reset</button>
                </div>
              </div>
              <div class="grid grid-cols-2 sm:grid-cols-4 gap-1.5" id="aiMockCaMonthCheckboxes">
                <label class="p-1.5 rounded-lg border border-slate-800 bg-slate-950 flex items-center justify-between text-[11px] cursor-pointer hover:border-emerald-500/50 has-[:checked]:border-emerald-500 has-[:checked]:bg-emerald-500/15">
                  <span class="text-slate-300">❄️ Jan 2026</span>
                  <input type="checkbox" value="January 2026" checked class="ai-mock-month-check accent-emerald-500 w-3 h-3 rounded cursor-pointer" onchange="window.updateMockLiveSummary()">
                </label>
                <label class="p-1.5 rounded-lg border border-slate-800 bg-slate-950 flex items-center justify-between text-[11px] cursor-pointer hover:border-emerald-500/50 has-[:checked]:border-emerald-500 has-[:checked]:bg-emerald-500/15">
                  <span class="text-slate-300">🌱 Feb 2026</span>
                  <input type="checkbox" value="February 2026" checked class="ai-mock-month-check accent-emerald-500 w-3 h-3 rounded cursor-pointer" onchange="window.updateMockLiveSummary()">
                </label>
                <label class="p-1.5 rounded-lg border border-slate-800 bg-slate-950 flex items-center justify-between text-[11px] cursor-pointer hover:border-emerald-500/50 has-[:checked]:border-emerald-500 has-[:checked]:bg-emerald-500/15">
                  <span class="text-slate-300">🌸 Mar 2026</span>
                  <input type="checkbox" value="March 2026" checked class="ai-mock-month-check accent-emerald-500 w-3 h-3 rounded cursor-pointer" onchange="window.updateMockLiveSummary()">
                </label>
                <label class="p-1.5 rounded-lg border border-slate-800 bg-slate-950 flex items-center justify-between text-[11px] cursor-pointer hover:border-emerald-500/50 has-[:checked]:border-emerald-500 has-[:checked]:bg-emerald-500/15">
                  <span class="text-slate-300">☀️ Apr 2026</span>
                  <input type="checkbox" value="April 2026" checked class="ai-mock-month-check accent-emerald-500 w-3 h-3 rounded cursor-pointer" onchange="window.updateMockLiveSummary()">
                </label>
                <label class="p-1.5 rounded-lg border border-slate-800 bg-slate-950 flex items-center justify-between text-[11px] cursor-pointer hover:border-emerald-500/50 has-[:checked]:border-emerald-500 has-[:checked]:bg-emerald-500/15">
                  <span class="text-slate-300">🔥 May 2026</span>
                  <input type="checkbox" value="May 2026" checked class="ai-mock-month-check accent-emerald-500 w-3 h-3 rounded cursor-pointer" onchange="window.updateMockLiveSummary()">
                </label>
                <label class="p-1.5 rounded-lg border border-slate-800 bg-slate-950 flex items-center justify-between text-[11px] cursor-pointer hover:border-emerald-500/50 has-[:checked]:border-emerald-500 has-[:checked]:bg-emerald-500/15">
                  <span class="text-slate-300">🌧️ Jun 2026</span>
                  <input type="checkbox" value="June 2026" checked class="ai-mock-month-check accent-emerald-500 w-3 h-3 rounded cursor-pointer" onchange="window.updateMockLiveSummary()">
                </label>
                <label class="p-1.5 rounded-lg border border-slate-800 bg-slate-950 flex items-center justify-between text-[11px] cursor-pointer hover:border-emerald-500/50 has-[:checked]:border-emerald-500 has-[:checked]:bg-emerald-500/15">
                  <span class="text-slate-300">⚡ Jul 2026</span>
                  <input type="checkbox" value="July 2026" checked class="ai-mock-month-check accent-emerald-500 w-3 h-3 rounded cursor-pointer" onchange="window.updateMockLiveSummary()">
                </label>
                <label class="p-1.5 rounded-lg border border-slate-800 bg-slate-950 flex items-center justify-between text-[11px] cursor-pointer hover:border-emerald-500/50 has-[:checked]:border-emerald-500 has-[:checked]:bg-emerald-500/15">
                  <span class="text-slate-300">🌐 PIB / Hindu</span>
                  <span class="text-[9px] font-mono text-emerald-400 font-bold">100% Sync</span>
                </label>
              </div>
            </div>
          </div>

          <!-- Question Count for AI Mock -->
          <div class="flex flex-col gap-2">
            <span class="text-xs font-bold text-white flex items-center gap-1.5">
              <span>⏱️</span>
              <span>Test Volume &amp; Duration:</span>
            </span>

            <div class="grid grid-cols-3 sm:grid-cols-6 gap-2" id="aiMockQuestionCountGroup">
              <button type="button" class="ai-mock-qcount-pill p-2 rounded-xl border border-slate-800 bg-slate-950 text-slate-300 text-xs font-mono font-bold hover:border-purple-500 cursor-pointer transition text-center" data-count="10" onclick="window.setAiMockQuestionCount(10)">
                <span class="block text-sm font-black">10 Qs</span>
                <span class="block text-[10px] text-slate-500">12m</span>
              </button>
              <button type="button" class="ai-mock-qcount-pill p-2 rounded-xl border border-slate-800 bg-slate-950 text-slate-300 text-xs font-mono font-bold hover:border-purple-500 cursor-pointer transition text-center" data-count="20" onclick="window.setAiMockQuestionCount(20)">
                <span class="block text-sm font-black">20 Qs</span>
                <span class="block text-[10px] text-slate-500">24m</span>
              </button>
              <button type="button" class="ai-mock-qcount-pill p-2 rounded-xl border-2 border-purple-500 bg-purple-500/20 text-purple-300 text-xs font-mono font-bold cursor-pointer transition text-center active" data-count="25" onclick="window.setAiMockQuestionCount(25)">
                <span class="block text-sm font-black">25 Qs</span>
                <span class="block text-[10px] text-purple-400">30m</span>
              </button>
              <button type="button" class="ai-mock-qcount-pill p-2 rounded-xl border border-slate-800 bg-slate-950 text-slate-300 text-xs font-mono font-bold hover:border-purple-500 cursor-pointer transition text-center" data-count="30" onclick="window.setAiMockQuestionCount(30)">
                <span class="block text-sm font-black">30 Qs</span>
                <span class="block text-[10px] text-slate-500">36m</span>
              </button>
              <button type="button" class="ai-mock-qcount-pill p-2 rounded-xl border border-slate-800 bg-slate-950 text-slate-300 text-xs font-mono font-bold hover:border-purple-500 cursor-pointer transition text-center" data-count="50" onclick="window.setAiMockQuestionCount(50)">
                <span class="block text-sm font-black">50 Qs</span>
                <span class="block text-[10px] text-slate-500">60m</span>
              </button>
              <button type="button" class="ai-mock-qcount-pill p-2 rounded-xl border border-slate-800 bg-slate-950 text-slate-300 text-xs font-mono font-bold hover:border-purple-500 cursor-pointer transition text-center" data-count="100" onclick="window.setAiMockQuestionCount(100)">
                <span class="block text-sm font-black">100 Qs</span>
                <span class="block text-[10px] text-slate-500">120m</span>
              </button>
            </div>

            <!-- Custom Count Input Inline -->
            <div class="flex items-center justify-between pt-1 text-xs">
              <span class="text-slate-400">Or type custom question count:</span>
              <div class="flex items-center gap-2">
                <input type="number" id="aiMockCustomCountInput" min="5" max="100" value="25" class="light-input w-20 px-2.5 py-1 rounded-xl bg-slate-950 border border-slate-800 text-center font-mono font-bold text-white text-xs focus:outline-none focus:border-purple-500" oninput="window.onAiMockCustomCountInput(this.value)">
                <span class="text-slate-500 font-mono text-[11px]" id="aiMockCustomCalcDuration">~30 Mins (1.2m / Q)</span>
              </div>
            </div>
          </div>

        </div>

        <!-- 4. EXAM MODE`;

if (oldCaControlsRegex.test(html)) {
  html = html.replace(oldCaControlsRegex, newAiMockControls);
  console.log('✓ Successfully upgraded to 2026 UPSC AI Mock Controls');
} else {
  console.warn('Regex did not match oldCaControlsRegex');
}

// 6. Clarify Simulation Mode Options (Time-Bounded vs Untimed)
const oldSimModeRegex = /<div class="grid grid-cols-1 sm:grid-cols-2 gap-2\.5">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>\s*<!-- Sticky Live Action Footer Bar/;

const newSimMode = `<div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <label class="p-3 rounded-2xl bg-slate-950 border-2 border-amber-500/50 flex items-start gap-3 cursor-pointer has-[:checked]:border-amber-500 has-[:checked]:bg-amber-500/10 transition group">
              <input type="radio" name="mockMode" value="exam" checked class="accent-amber-500 mt-1 cursor-pointer">
              <div class="flex flex-col gap-0.5">
                <span class="text-xs font-bold text-white group-hover:text-amber-400">⏱️ Timed Examination Mode</span>
                <span class="text-[11px] text-slate-400 leading-snug">Strict countdown timer, solutions hidden until final submission, official -0.66 negative penalty, auto-submits on time.</span>
              </div>
            </label>

            <label class="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-start gap-3 cursor-pointer has-[:checked]:border-amber-500 has-[:checked]:bg-amber-500/10 transition group">
              <input type="radio" name="mockMode" value="tutor" class="accent-amber-500 mt-1 cursor-pointer">
              <div class="flex flex-col gap-0.5">
                <span class="text-xs font-bold text-white group-hover:text-amber-400">🕊️ Untimed Practice Mode</span>
                <span class="text-[11px] text-slate-400 leading-snug">Untimed self-paced practice without timer stress; instant explanations available and submit whenever ready.</span>
              </div>
            </label>
          </div>
        </div>

      </div>

      <!-- Sticky Live Action Footer Bar`;

if (oldSimModeRegex.test(html)) {
  html = html.replace(oldSimModeRegex, newSimMode);
  console.log('✓ Successfully patched Simulation Mode controls');
} else {
  console.warn('Regex did not match oldSimModeRegex');
}

// 7. In Question Player View: Add Source Trust Badge
if (!html.includes('playerSourceTrustBadge')) {
  const oldQHeader = `<span id="playerQNumberLabel" class="font-bold text-amber-500">QUESTION #1</span>`;
  const newQHeader = `<div class="flex items-center gap-2 flex-wrap">
                <span id="playerQNumberLabel" class="font-bold text-amber-500">QUESTION #1</span>
                <span id="playerSourceTrustBadge" class="hidden px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-[10px] font-mono font-bold"></span>
              </div>`;
  html = html.replace(oldQHeader, newQHeader);
  console.log('✓ Successfully added playerSourceTrustBadge');
}

// 8. In Report View: Add 2026 Pattern Diagnostic Box
if (!html.includes('reportPatternDiagnosticBox')) {
  const patternBoxHtml = `
        <!-- 2026 Question Format Diagnostic Card -->
        <div id="reportPatternDiagnosticBox" class="light-card p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col gap-4">
          <div class="flex items-center justify-between border-b border-slate-800 pb-3">
            <div class="flex items-center gap-2">
              <span class="text-xl">⚖️</span>
              <div>
                <h3 class="text-sm font-extrabold text-white">2026 UPSC Question Pattern Diagnostic</h3>
                <p class="text-[11px] text-slate-400">Accuracy across modern elimination-resistant question archetypes</p>
              </div>
            </div>
            <span class="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-mono text-[10px] font-bold">2026 Rigor</span>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div class="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col gap-1">
              <span class="text-[10px] font-mono text-purple-400 uppercase font-bold">🧩 Pair Matching ("Only one pair")</span>
              <span id="reportPatternPairAcc" class="text-lg font-black text-white">0%</span>
              <span id="reportPatternPairCount" class="text-[10px] text-slate-400">0 / 0 Solved</span>
            </div>

            <div class="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col gap-1">
              <span class="text-[10px] font-mono text-amber-400 uppercase font-bold">⚖️ Statement-I &amp; Statement-II</span>
              <span id="reportPatternStmtAcc" class="text-lg font-black text-white">0%</span>
              <span id="reportPatternStmtCount" class="text-[10px] text-slate-400">0 / 0 Solved</span>
            </div>

            <div class="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col gap-1">
              <span class="text-[10px] font-mono text-teal-400 uppercase font-bold">📜 Multi-Statement &amp; CA</span>
              <span id="reportPatternMultiAcc" class="text-lg font-black text-white">0%</span>
              <span id="reportPatternMultiCount" class="text-[10px] text-slate-400">0 / 0 Solved</span>
            </div>
          </div>
        </div>
`;
  html = html.replace(
    '<!-- 2-Column Psychological & Behavioral Diagnostics -->',
    patternBoxHtml + '\n        <!-- 2-Column Psychological & Behavioral Diagnostics -->'
  );
  console.log('✓ Successfully added reportPatternDiagnosticBox');
}

// 9. In Report View: Add Re-attempt Missed Questions Action Button
if (!html.includes('reportReattemptWrongsBtn')) {
  const reattemptBtnHtml = `
            <button type="button" id="reportReattemptWrongsBtn" class="mt-2 w-full py-2.5 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 font-bold text-xs border border-purple-500/40 transition-all cursor-pointer flex items-center justify-center gap-2">
              <span>🚀</span>
              <span id="reportReattemptWrongsText">Re-attempt Missed Questions Now (Targeted Drill)</span>
            </button>`;
  html = html.replace(
    '</button>\n          </div>\n\n          <!-- Right Card: Subject Accuracy',
    '</button>' + reattemptBtnHtml + '\n          </div>\n\n          <!-- Right Card: Subject Accuracy'
  );
  console.log('✓ Successfully added reportReattemptWrongsBtn');
}

if (isCRLF) {
  html = html.replace(/\n/g, '\r\n');
}

fs.writeFileSync(htmlPath, html, 'utf8');
console.log('Updated prelims.html successfully!');
