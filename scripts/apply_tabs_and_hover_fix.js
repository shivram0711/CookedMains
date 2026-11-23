const fs = require('fs');

const prelimsHtmlPath = 'C:/Users/HP/.gemini/antigravity/scratch/upsc-mains-evaluator/static/prelims.html';
let html = fs.readFileSync(prelimsHtmlPath, 'utf8');

// 1. Expand modal width from max-w-2xl to max-w-3xl lg:max-w-4xl
html = html.replace(
  'class="light-card relative w-full max-w-2xl max-h-[92vh] flex flex-col rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden my-auto"',
  'class="light-card relative w-full max-w-3xl lg:max-w-4xl max-h-[92vh] flex flex-col rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden my-auto"'
);

// 2. Replace the tab switcher markup inside #mockFormatTabGroup
const oldTabGroupMarkup = `<div class="grid grid-cols-2 sm:grid-cols-4 p-1 rounded-2xl bg-slate-950 border border-slate-800 text-xs font-bold shadow-inner gap-1" id="mockFormatTabGroup">
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

const newTabGroupMarkup = `<div class="grid grid-cols-2 lg:grid-cols-4 p-1.5 rounded-2xl bg-slate-950 border border-slate-800 text-xs font-bold shadow-inner gap-1.5" id="mockFormatTabGroup">
          <button type="button" class="mock-tab-btn" data-format="full" onclick="window.onMockFormatChange('full')" title="Official UPSC 100-Question Timed Simulation">
            <span>🏆</span>
            <span>Full Simulation (PYQs)</span>
          </button>
          <button type="button" class="mock-tab-btn active" data-format="sectional" onclick="window.onMockFormatChange('sectional')" title="Topic & Subject-wise PYQ Sprints">
            <span>⚡</span>
            <span>Sectional (PYQs)</span>
          </button>
          <button type="button" class="mock-tab-btn" data-format="ai_mock" onclick="window.onMockFormatChange('ai_mock')" title="Fresh 2026 Elimination-Proof Mock Questions">
            <span>🤖</span>
            <span>2026 AI Mock</span>
          </button>
          <button type="button" class="mock-tab-btn" data-format="weakness" onclick="window.onMockFormatChange('weakness')" title="Targeted Drill on Your Recorded Mistakes">
            <span>🎯</span>
            <span>Mistakes Drill</span>
          </button>
        </div>`;

if (html.includes(oldTabGroupMarkup)) {
  html = html.replace(oldTabGroupMarkup, newTabGroupMarkup);
  console.log('Successfully replaced old tab group markup');
} else {
  console.log('Searching by regex for tab group...');
  const tabRegex = /<div class="grid grid-cols-2 sm:grid-cols-4[^"]*" id="mockFormatTabGroup">[\s\S]*?<\/div>/;
  if (tabRegex.test(html)) {
    html = html.replace(tabRegex, newTabGroupMarkup);
    console.log('Successfully replaced tab group via regex');
  } else {
    console.error('Failed to find tab group markup!');
  }
}

// 3. Inject CSS styles for .mock-tab-btn and .sidebar-nav-item
const customStyles = `
    /* ====================================================
       PROFESSIONAL MOCK FORMAT TABS (Dark & Light Mode)
       ==================================================== */
    #mockFormatTabGroup {
      transition: background-color 0.2s ease, border-color 0.2s ease;
    }
    html.dark #mockFormatTabGroup {
      background-color: #020617 !important;
      border-color: #1e293b !important;
    }
    html:not(.dark) #mockFormatTabGroup {
      background-color: #f1f5f9 !important;
      border-color: #e2e8f0 !important;
    }

    .mock-tab-btn {
      position: relative;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 0.45rem;
      padding: 0.65rem 0.85rem;
      border-radius: 0.875rem;
      font-size: 0.78rem;
      font-weight: 700;
      line-height: 1.25;
      white-space: nowrap;
      cursor: pointer;
      border: 1px solid transparent;
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
      user-select: none;
      outline: none;
    }
    .mock-tab-btn span:first-child {
      display: inline-block;
      transition: transform 0.2s ease;
      font-size: 0.95rem;
    }
    .mock-tab-btn:hover span:first-child {
      transform: scale(1.18);
    }

    /* Dark Mode Tab Button States */
    html.dark .mock-tab-btn {
      color: #94a3b8;
      background-color: transparent;
      border-color: transparent;
    }
    html.dark .mock-tab-btn:hover:not(.active) {
      color: #fde68a !important;
      background-color: rgba(245, 158, 11, 0.14) !important;
      border-color: rgba(245, 158, 11, 0.4) !important;
      box-shadow: 0 0 14px rgba(245, 158, 11, 0.18) !important;
      transform: translateY(-1px);
    }
    html.dark .mock-tab-btn.active {
      color: #020617 !important;
      background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%) !important;
      font-weight: 900 !important;
      border-color: #f59e0b !important;
      box-shadow: 0 4px 14px -2px rgba(245, 158, 11, 0.45) !important;
      transform: translateY(-1px);
    }

    /* Light Mode Tab Button States */
    html:not(.dark) .mock-tab-btn {
      color: #475569;
      background-color: #ffffff;
      border-color: #e2e8f0;
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
    }
    html:not(.dark) .mock-tab-btn:hover:not(.active) {
      color: #78350f !important;
      background-color: #fef3c7 !important;
      border-color: #f59e0b !important;
      box-shadow: 0 2px 8px -1px rgba(245, 158, 11, 0.25) !important;
      transform: translateY(-1px);
    }
    html:not(.dark) .mock-tab-btn.active {
      color: #020617 !important;
      background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%) !important;
      font-weight: 900 !important;
      border-color: #b45309 !important;
      box-shadow: 0 4px 12px -2px rgba(245, 158, 11, 0.35) !important;
      transform: translateY(-1px);
    }

    /* ====================================================
       PROFESSIONAL SIDEBAR NAVIGATION & HOVER EFFECTS
       Visible, High-Contrast & Interactive in Dark & Light Modes
       ==================================================== */
    .sidebar-nav-item {
      position: relative;
      border-radius: 0.75rem;
      transition: all 0.22s cubic-bezier(0.4, 0, 0.2, 1);
      cursor: pointer;
      user-select: none;
    }

    /* Icon hover micro-interaction */
    .sidebar-nav-item span:first-child {
      display: inline-block;
      transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
    }
    .sidebar-nav-item:hover span:first-child {
      transform: scale(1.18);
    }

    /* DARK MODE SIDEBAR ITEMS */
    html.dark .sidebar-nav-item {
      color: #94a3b8;
      background-color: transparent;
      border: 1px solid transparent;
    }
    html.dark .sidebar-nav-item:hover {
      background-color: rgba(245, 158, 11, 0.12) !important;
      color: #fbbf24 !important;
      border-color: rgba(245, 158, 11, 0.4) !important;
      box-shadow: 0 0 16px -2px rgba(245, 158, 11, 0.2), inset 0 0 8px rgba(245, 158, 11, 0.05) !important;
      transform: translateX(4px);
    }
    html.dark .sidebar-nav-item:hover span,
    html.dark .sidebar-nav-item:hover div {
      color: #fde68a !important;
    }
    html.dark .sidebar-nav-item.active {
      background-color: rgba(245, 158, 11, 0.18) !important;
      color: #fbbf24 !important;
      border-color: rgba(245, 158, 11, 0.5) !important;
      font-weight: 800 !important;
      box-shadow: 0 0 18px -2px rgba(245, 158, 11, 0.25) !important;
    }
    html.dark .sidebar-nav-item.active span {
      color: #fbbf24 !important;
    }

    /* LIGHT MODE SIDEBAR ITEMS */
    html:not(.dark) .sidebar-nav-item {
      color: #334155;
      background-color: #ffffff;
      border: 1px solid #e2e8f0;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.03);
    }
    html:not(.dark) .sidebar-nav-item:hover {
      background-color: rgba(245, 158, 11, 0.15) !important;
      color: #78350f !important;
      border-color: rgba(245, 158, 11, 0.45) !important;
      box-shadow: 0 3px 10px -2px rgba(245, 158, 11, 0.22), 0 1px 3px rgba(0, 0, 0, 0.04) !important;
      transform: translateX(4px);
    }
    html:not(.dark) .sidebar-nav-item:hover span,
    html:not(.dark) .sidebar-nav-item:hover div {
      color: #78350f !important;
    }
    html:not(.dark) .sidebar-nav-item.active {
      background-color: rgba(245, 158, 11, 0.18) !important;
      color: #78350f !important;
      border-color: rgba(245, 158, 11, 0.5) !important;
      font-weight: 800 !important;
      box-shadow: 0 3px 12px -2px rgba(245, 158, 11, 0.25) !important;
    }
    html:not(.dark) .sidebar-nav-item.active span {
      color: #78350f !important;
    }
`;

// Replace the old sidebar styles or insert customStyles into <style>
const oldSidebarHoverRule = `    /* Sidebar Navigation in Light Mode - No Black Hover! */
    html:not(.dark) .sidebar-nav-item:hover {
      background-color: rgba(245, 158, 11, 0.12) !important;
      color: #92400e !important;
    }
    html:not(.dark) .sidebar-nav-item.active {
      background-color: rgba(245, 158, 11, 0.18) !important;
      color: #78350f !important;
      border-color: rgba(245, 158, 11, 0.4) !important;
    }`;

if (html.includes(oldSidebarHoverRule)) {
  html = html.replace(oldSidebarHoverRule, customStyles);
  console.log('Replaced old sidebar hover rule with enhanced styles');
} else {
  // Append before </style>
  html = html.replace('</style>', customStyles + '\n  </style>');
  console.log('Appended customStyles to </style>');
}

fs.writeFileSync(prelimsHtmlPath, html, 'utf8');
console.log('Updated prelims.html successfully!');
