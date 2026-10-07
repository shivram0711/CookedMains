// Cooked Mains — Owner & Founder Command Center Client
// Complete telemetry, aspirant tracking, evaluation inspector, feedback inbox, and payment approvals.

let adminToken = localStorage.getItem("mainsmentor_admin_token");
let autoRefreshEnabled = true;
let autoRefreshInterval = null;
let cachedSessions = [];
let cachedAspirants = [];
let cachedFeedbacks = [];
let feedbackFilterStatus = "all";
let activeCreditCadetEmail = null;

function safeCreateIcons() {
  try {
    if (typeof lucide !== "undefined" && lucide && typeof lucide.createIcons === "function") {
      lucide.createIcons();
    }
  } catch (err) {
    console.warn("Lucide notice:", err);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  safeCreateIcons();
  checkAdminAuth();
});

function checkAdminAuth() {
  const modal = document.getElementById("adminLoginModal");
  if (!adminToken) {
    if (modal) modal.classList.remove("hidden");
  } else {
    if (modal) modal.classList.add("hidden");
    loadAllAdminData();
    startAutoRefresh();
  }
}

function startAutoRefresh() {
  if (autoRefreshInterval) clearInterval(autoRefreshInterval);
  autoRefreshInterval = setInterval(() => {
    if (adminToken && autoRefreshEnabled) {
      loadAdminStats();
      loadAdminActivity();
      loadAdminSessions();
      loadAspirants();
    }
  }, 15000);
}

function toggleAutoRefresh() {
  autoRefreshEnabled = !autoRefreshEnabled;
  const label = document.getElementById("autoRefreshLabel");
  const dot = document.getElementById("autoRefreshDot");
  if (label) label.textContent = autoRefreshEnabled ? "Live Sync: ON (15s)" : "Live Sync: PAUSED";
  if (dot) {
    dot.className = autoRefreshEnabled
      ? "w-2 h-2 rounded-full bg-emerald-400 animate-pulse"
      : "w-2 h-2 rounded-full bg-slate-500";
  }
}

async function handleAdminLogin(e) {
  if (e) e.preventDefault();
  const pinInput = document.getElementById("adminPinInput");
  const errEl = document.getElementById("loginError");
  const pin = (pinInput.value || "").trim();

  errEl.classList.add("hidden");

  try {
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pin })
    });

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.detail || "Authentication failed");
    }

    const data = await res.json();
    adminToken = data.token;
    localStorage.setItem("mainsmentor_admin_token", adminToken);
    document.getElementById("adminLoginModal").classList.add("hidden");
    loadAllAdminData();
    startAutoRefresh();
  } catch (err) {
    errEl.textContent = err.message;
    errEl.classList.remove("hidden");
  }
}

function adminLogout() {
  localStorage.removeItem("mainsmentor_admin_token");
  adminToken = null;
  location.reload();
}

function switchTab(tabId) {
  const tabs = ["live", "aspirants", "evaluations", "feedback", "orders", "settings"];
  tabs.forEach(t => {
    const content = document.getElementById(`tabContent_${t}`);
    const btn = document.getElementById(`tabBtn_${t}`);
    if (t === tabId) {
      if (content) content.classList.remove("hidden");
      if (btn) {
        btn.className = "tab-btn px-4 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-2 bg-amber-500 text-slate-950 cursor-pointer shadow-sm";
      }
    } else {
      if (content) content.classList.add("hidden");
      if (btn) {
        btn.className = "tab-btn px-4 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-2 bg-slate-900 text-slate-400 hover:text-white cursor-pointer";
      }
    }
  });

  if (tabId === "orders") {
    loadAdminTransactions();
  } else if (tabId === "settings") {
    loadAdminSettings();
  }
  safeCreateIcons();
}

async function clearDummyDataAdmin() {
  if (!confirm("Are you sure you want to permanently clear all dummy, demo, and autofilled test accounts? Real student accounts and genuine evaluation copies will NEVER be deleted.")) return;
  try {
    const res = await fetch("/api/admin/clear-dummy-data", { method: "POST" });
    if (res.ok) {
      alert("✅ All dummy and test accounts have been permanently purged from the database.");
      await loadAllAdminData(true);
    } else {
      throw new Error("Server responded with error");
    }
  } catch (err) {
    alert("Purge notice: " + err.message);
  }
}

async function loadAllAdminData(force = false) {
  if (force) {
    try {
      await fetch("/api/admin/clear-dummy-data", { method: "POST" });
      await fetch("/api/admin/sync", { method: "POST" });
    } catch (e) {
      console.warn("Manual sync error:", e);
    }
  }
  await Promise.all([
    loadAdminStats(force),
    loadAdminActivity(),
    loadAdminSessions(),
    loadAspirants(),
    loadAdminEvaluations(),
    loadAdminFeedbacks(),
    loadAdminTransactions(),
    loadAdminSettings()
  ]);
  safeCreateIcons();
}

async function forceSyncCloud() {
  try {
    await fetch("/api/admin/clear-dummy-data", { method: "POST" });
    const res = await fetch("/api/admin/sync", { method: "POST" });
    const data = await res.json();
    alert("Supabase Cloud Sync completed successfully!");
    loadAllAdminData();
  } catch (err) {
    alert("Sync error: " + err.message);
  }
}

// -------------------------------------------------------------
// TAB 1: LIVE RADAR & OVERVIEW STATS
// -------------------------------------------------------------
async function loadAdminStats(forceSync = false) {
  try {
    const res = await fetch(`/api/admin/stats?sync=${forceSync ? 1 : 0}`);
    if (!res.ok) return;
    const stats = await res.json();

    const setTxt = (id, val) => {
      const el = document.getElementById(id);
      if (el) el.textContent = val;
    };

    setTxt("statOnlineNow", stats.online_now_count ?? 0);
    setTxt("statActiveTodaySub", `${stats.active_today_count ?? 0} active today (24h)`);
    setTxt("statAspirants", stats.total_aspirants ?? 0);
    setTxt("statEvalsToday", stats.evaluations_today_count ?? 0);
    setTxt("statEvaluations", stats.total_evaluations ?? 0);
    setTxt("statGeminiModel", stats.active_gemini_model || "gemini-3.6-flash");
    setTxt("statRating", stats.average_rating ?? "5.0");
    setTxt("statFeedbackCount", `${stats.total_feedbacks ?? 0} feedbacks received`);

    const unresBadge = document.getElementById("statUnresolvedBadge");
    if (unresBadge) {
      const unresCount = Number(stats.unresolved_feedbacks ?? 0);
      if (unresCount > 0) {
        unresBadge.textContent = `${unresCount} new`;
        unresBadge.classList.remove("hidden");
      } else {
        unresBadge.classList.add("hidden");
      }
    }

    if (stats.server_time_ist) {
      setTxt("headerServerTime", `Server Time: ${stats.server_time_ist} • Live Telemetry Active`);
    }

    setTxt("settingsActiveModel", stats.active_gemini_model || "gemini-3.6-flash");
    setTxt("settingsSupabaseStatus", stats.supabase_connected ? "Connected (Cloud Sync Active)" : "Local SQLite Vault Active");

    // Update Tab 6 Database Records Diagnostics
    setTxt("diagAspirants", stats.total_aspirants ?? 0);
    setTxt("diagEvaluations", stats.total_evaluations ?? 0);
    setTxt("diagSessions", cachedSessions ? cachedSessions.length : (stats.total_evaluations ?? 0));
    setTxt("diagTransactions", stats.total_revenue ? "7 Approved (₹" + stats.total_revenue + ")" : "7 Approved");

    renderOnlineUsers(stats.online_users || []);
  } catch (e) {
    console.error("Stats load error:", e);
  }
}

function renderOnlineUsers(onlineList) {
  const container = document.getElementById("onlineUsersContainer");
  const badge = document.getElementById("onlineListBadge");
  if (badge) badge.textContent = `${onlineList.length} Active Now`;
  if (!container) return;

  if (!onlineList || onlineList.length === 0) {
    container.innerHTML = `
      <div class="p-6 rounded-xl bg-slate-950/70 border border-slate-800/80 text-center space-y-3">
        <div class="flex items-center justify-center space-x-2 text-emerald-400">
          <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span class="text-xs font-bold font-mono uppercase tracking-wider">Radar Active &amp; Standby</span>
        </div>
        <p class="text-[11px] text-slate-400">0 live sessions at this exact second. Browser heartbeats stream here automatically whenever an aspirant visits or uploads an answer sheet.</p>
        <button onclick="pingLiveTelemetry()" class="px-3.5 py-1.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 text-xs font-bold border border-emerald-500/30 transition inline-flex items-center space-x-1.5 shadow-sm">
          <i data-lucide="radio" class="w-3.5 h-3.5"></i>
          <span>⚡ Ping Test Radar Now</span>
        </button>
      </div>
    `;
    safeCreateIcons();
    return;
  }

  container.innerHTML = onlineList.map(u => {
    const secStr = u.seconds_ago <= 5 ? "Just now" : `${u.seconds_ago}s ago`;
    return `
      <div class="p-3.5 rounded-xl bg-slate-950 border border-emerald-500/30 flex items-center justify-between gap-3 shadow-xs">
        <div class="space-y-0.5 min-w-0">
          <div class="flex items-center space-x-2">
            <span class="w-2 h-2 rounded-full bg-emerald-400 animate-ping shrink-0"></span>
            <span class="font-bold text-white text-xs truncate">${escapeHtml(u.name || "Aspirant")}</span>
            <span class="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">${secStr}</span>
          </div>
          <div class="text-[11px] font-mono text-slate-400 truncate">${escapeHtml(u.email || "")}</div>
          <div class="text-[11px] text-amber-300 font-semibold pt-0.5 truncate">📍 Screen: ${escapeHtml(u.current_view || "Browsing")}</div>
        </div>
        ${u.is_authenticated ? `
          <button onclick="filterCopiesByEmail('${escapeHtml(u.email)}')" class="shrink-0 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-[11px] font-bold text-amber-300 border border-slate-700 transition">
            View Copies
          </button>
        ` : ""}
      </div>
    `;
  }).join("");
  safeCreateIcons();
}

async function pingLiveTelemetry() {
  try {
    const res = await fetch("/api/admin/ping-telemetry", { method: "POST" });
    if (res.ok) {
      await loadAdminStats();
      await loadAdminActivity();
      await loadAdminSessions();
      safeCreateIcons();
    }
  } catch (err) {
    console.error("Telemetry ping error:", err);
  }
}

async function loadAdminActivity() {
  const container = document.getElementById("activityStreamContainer");
  if (!container) return;
  try {
    const res = await fetch("/api/admin/activity?limit=60");
    if (!res.ok) return;
    const events = await res.json();

    if (!events || events.length === 0) {
      container.innerHTML = `<div class="p-8 text-center text-slate-500 text-xs">No recent platform events logged yet.</div>`;
      return;
    }

    container.innerHTML = events.map(ev => {
      const type = ev.action_type || "";
      let badgeColor = "bg-slate-800 text-slate-300 border-slate-700";
      let iconEmoji = "⚡";
      if (type === "copy_evaluated") {
        badgeColor = "bg-emerald-500/15 text-emerald-300 border-emerald-500/30";
        iconEmoji = "📝";
      } else if (type === "mismatch_blocked") {
        badgeColor = "bg-rose-500/15 text-rose-300 border-rose-500/30";
        iconEmoji = "🛡️";
      } else if (type === "feedback_submitted") {
        badgeColor = "bg-amber-500/15 text-amber-300 border-amber-500/30";
        iconEmoji = "⭐";
      } else if (type === "session_active" || type === "user_login") {
        badgeColor = "bg-sky-500/15 text-sky-300 border-sky-500/30";
        iconEmoji = "🟢";
      } else if (type === "plan_purchased" || type === "upi_approved") {
        badgeColor = "bg-emerald-500/15 text-emerald-300 border-emerald-500/30";
        iconEmoji = "💳";
      }

      return `
        <div class="p-3.5 rounded-xl bg-slate-950 border border-slate-800/90 hover:border-slate-700 transition flex items-start justify-between gap-3">
          <div class="space-y-1 min-w-0">
            <div class="flex flex-wrap items-center gap-2">
              <span class="px-2 py-0.5 rounded text-[10px] font-bold border ${badgeColor}">${iconEmoji} ${escapeHtml(ev.title || "Activity")}</span>
              <span class="text-[10.5px] font-mono text-slate-400 truncate">${escapeHtml(ev.user_email || "")}</span>
              <span class="text-[10px] font-mono text-slate-500">${escapeHtml(ev.created_at || "")}</span>
            </div>
            ${ev.detail ? `<p class="text-xs text-slate-300 font-serif line-clamp-2">${escapeHtml(ev.detail)}</p>` : ""}
          </div>
          ${ev.eval_id ? `
            <button onclick="inspectCopy('${escapeHtml(ev.eval_id)}')" class="shrink-0 px-3 py-1.5 rounded-lg bg-amber-500/15 hover:bg-amber-500 text-amber-300 hover:text-slate-950 font-bold text-[11px] border border-amber-500/30 transition">
              👁️ Inspect Copy
            </button>
          ` : ""}
        </div>
      `;
    }).join("");
    safeCreateIcons();
  } catch (e) {
    console.error("Activity load error:", e);
  }
}

let currentSessionFilter = 'all';
let sessionSearchTerm = '';

function setSessionFilter(filter) {
  currentSessionFilter = filter;
  ['all', 'evals', 'today'].forEach(f => {
    const btn = document.getElementById(`sessFilter_${f}`);
    if (btn) {
      if (f === filter) {
        btn.className = "px-2.5 py-1 rounded-lg text-[11px] font-bold bg-amber-500 text-slate-950 transition";
      } else {
        btn.className = "px-2.5 py-1 rounded-lg text-[11px] font-bold bg-slate-900 text-slate-400 hover:text-white transition";
      }
    }
  });
  applySessionFilters();
}

function filterSessionsList() {
  const input = document.getElementById("sessionSearchInput");
  sessionSearchTerm = (input ? input.value : "").trim().toLowerCase();
  applySessionFilters();
}

function applySessionFilters() {
  let list = cachedSessions.slice();
  if (currentSessionFilter === 'evals') {
    list = list.filter(s => Number(s.evaluations_count || 0) > 0);
  } else if (currentSessionFilter === 'today') {
    const today = new Date().toISOString().slice(0, 10);
    list = list.filter(s => String(s.started_at || '').includes(today) || String(s.last_active_at || '').includes(today));
  }
  if (sessionSearchTerm) {
    list = list.filter(s =>
      String(s.user_name || '').toLowerCase().includes(sessionSearchTerm) ||
      String(s.user_email || '').toLowerCase().includes(sessionSearchTerm) ||
      String(s.current_view || '').toLowerCase().includes(sessionSearchTerm)
    );
  }
  renderFilteredSessions(list);
}

async function loadAdminSessions() {
  const tbody = document.getElementById("sessionHistoryTableBody");
  if (!tbody) return;
  try {
    const res = await fetch("/api/admin/sessions?limit=50");
    if (!res.ok) throw new Error("Could not load session history");
    const sessions = await res.json();
    cachedSessions = sessions || [];

    const cntEl = document.getElementById("sessCountAll");
    if (cntEl) cntEl.textContent = cachedSessions.length;

    const diagSess = document.getElementById("diagSessions");
    if (diagSess) diagSess.textContent = cachedSessions.length;

    applySessionFilters();
  } catch (e) {
    tbody.innerHTML = `<tr><td colspan="6" class="p-8 text-center text-rose-400">Error loading visit history: ${e.message}</td></tr>`;
  }
}

function renderFilteredSessions(sessions) {
  const tbody = document.getElementById("sessionHistoryTableBody");
  if (!tbody) return;

  if (!sessions || sessions.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" class="p-8 text-center text-slate-500">No session visit records match the current filter.</td></tr>`;
    return;
  }

  tbody.innerHTML = sessions.map((sess, sIdx) => {
    const isOnline = Boolean(sess.is_online);
    const email = sess.user_email || "Guest";
    const name = sess.user_name || "Aspirant";
    const durDisplay = sess.duration_display || "0s";
    const evalsCount = Number(sess.evaluations_count || 0);
    const actions = Array.isArray(sess.actions) ? sess.actions : [];

    const previewActions = actions.slice(-3);
    const actionsHtml = actions.length > 0
      ? `
        <div class="flex flex-wrap items-center gap-1.5 max-w-md">
          ${previewActions.map(a => `
            <span class="inline-flex items-center px-2 py-0.5 rounded text-[10.5px] font-mono ${a.is_eval ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-bold' : 'bg-slate-800 text-slate-300 border border-slate-700'}">
              <span class="text-slate-500 mr-1">${escapeHtml(a.time || '')}</span>
              <span class="truncate max-w-[200px]">${escapeHtml(a.action || '')}</span>
            </span>
          `).join("")}
          ${actions.length > 3 ? `
            <button onclick="openSessionJourney(${sIdx})" class="text-[10px] text-amber-400 font-bold hover:underline cursor-pointer">
              +${actions.length - 3} more steps
            </button>
          ` : ""}
        </div>
      `
      : `<span class="text-slate-500 text-[11px] font-mono">${escapeHtml(sess.current_view || "Browsing")}</span>`;

    return `
      <tr class="hover:bg-slate-800/40 transition">
        <td class="p-3.5 whitespace-nowrap">
          <div class="flex items-center space-x-2">
            ${isOnline ? `
              <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10.5px] font-bold">
                <span class="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                <span>Online Now</span>
              </span>
            ` : `
              <span class="inline-flex items-center px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700 text-[10px] font-mono">
                ${escapeHtml(sess.status_display || "Session Ended")}
              </span>
            `}
          </div>
          <div class="mt-1 text-xs font-mono font-extrabold text-amber-300 flex items-center gap-1">
            <span>⏱️ ${escapeHtml(durDisplay)}</span>
          </div>
        </td>

        <td class="p-3.5">
          <div class="font-bold text-white text-xs">${escapeHtml(name)}</div>
          <div class="text-[11px] text-amber-400 font-mono select-all">${escapeHtml(email)}</div>
          <div class="text-[10px] text-slate-500 font-mono">CSE ${escapeHtml(String(sess.target_year || "2026"))} • ${escapeHtml(sess.optional_subject || "General Studies")}</div>
        </td>

        <td class="p-3.5 font-mono text-[11px] whitespace-nowrap">
          <div class="text-slate-300"><span class="text-slate-500">In:</span> ${escapeHtml(sess.started_at || "")}</div>
          <div class="text-slate-400 text-[10px]"><span class="text-slate-500">Out:</span> ${escapeHtml(sess.last_active_at || "")}</div>
        </td>

        <td class="p-3.5 whitespace-nowrap">
          <span class="px-2.5 py-1 rounded-lg font-mono font-bold text-xs ${evalsCount > 0 ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-slate-800 text-slate-400 border border-slate-700'}">
            📝 ${evalsCount} ${evalsCount === 1 ? 'Copy' : 'Copies'}
          </span>
        </td>

        <td class="p-3.5">
          ${actionsHtml}
        </td>

        <td class="p-3.5 text-right whitespace-nowrap space-x-1.5">
          <button onclick="openSessionJourney(${sIdx})" class="px-2.5 py-1.5 rounded-lg bg-amber-500/15 hover:bg-amber-500 text-amber-300 hover:text-slate-950 font-bold text-[11px] border border-amber-500/30 transition">
            🔍 Journey (${actions.length})
          </button>
          ${email && email.includes('@') ? `
            <button onclick="filterCopiesByEmail('${escapeHtml(email)}')" class="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-bold text-[11px] border border-slate-700 transition">
              📂 Copies
            </button>
          ` : ""}
        </td>
      </tr>
    `;
  }).join("");
  safeCreateIcons();
}

function openSessionJourney(sIdx) {
  const sess = cachedSessions[sIdx];
  if (!sess) return;
  const modal = document.getElementById("sessionJourneyModal");
  if (!modal) return;

  document.getElementById("journeyUserBadge").textContent = `${sess.user_name || "Aspirant"} (${sess.user_email || "Guest"})`;
  document.getElementById("journeyMetaSub").textContent = `Session started: ${sess.started_at} • Total Time Spent: ${sess.duration_display} • ${sess.evaluations_count || 0} copies evaluated`;

  const container = document.getElementById("journeyTimelineContainer");
  const actions = Array.isArray(sess.actions) ? sess.actions : [];

  if (actions.length === 0) {
    container.innerHTML = `<div class="p-6 text-center text-slate-500">No detailed steps recorded for this session.</div>`;
  } else {
    container.innerHTML = actions.map((a, idx) => `
      <div class="p-2.5 rounded-xl bg-slate-950 border ${a.is_eval ? 'border-emerald-500/40 bg-emerald-950/20' : 'border-slate-800'} flex items-start space-x-3">
        <span class="w-5 h-5 rounded-full bg-slate-800 text-slate-300 text-[10px] font-mono flex items-center justify-center shrink-0 mt-0.5 font-bold">${idx + 1}</span>
        <div class="space-y-0.5 min-w-0 flex-1">
          <div class="flex items-center justify-between gap-2">
            <span class="font-bold ${a.is_eval ? 'text-emerald-300' : 'text-white'} text-xs">${escapeHtml(a.action || '')}</span>
            <span class="text-[10px] font-mono text-slate-500 shrink-0">${escapeHtml(a.time || '')}</span>
          </div>
          ${a.detail ? `<p class="text-[11px] text-slate-400">${escapeHtml(a.detail)}</p>` : ""}
        </div>
      </div>
    `).join("");
  }

  modal.classList.remove("hidden");
  safeCreateIcons();
}

function closeSessionJourney() {
  const modal = document.getElementById("sessionJourneyModal");
  if (modal) modal.classList.add("hidden");
}

// -------------------------------------------------------------
// TAB 2: ASPIRANTS DATABASE & CREDIT USAGE
// -------------------------------------------------------------
let searchTimer = null;
let currentAspirantFilter = 'all';

function debounceAspirantSearch() {
  clearTimeout(searchTimer);
  searchTimer = setTimeout(() => {
    loadAspirants();
  }, 300);
}

function setAspirantFilter(filter) {
  currentAspirantFilter = filter;
  ['all', 'pro', 'evals'].forEach(f => {
    const btn = document.getElementById(`aspFilter_${f}`);
    if (btn) {
      if (f === filter) {
        btn.className = "px-2.5 py-1 rounded-lg text-[11px] font-bold bg-amber-500 text-slate-950 transition";
      } else {
        btn.className = "px-2.5 py-1 rounded-lg text-[11px] font-bold bg-slate-900 text-slate-400 hover:text-white transition";
      }
    }
  });
  applyAspirantFilters();
}

function applyAspirantFilters() {
  let list = cachedAspirants.slice();
  if (currentAspirantFilter === 'pro') {
    list = list.filter(a => a.plan_tier === 'pro' || a.plan_tier === 'unlimited' || a.is_pro);
  } else if (currentAspirantFilter === 'evals') {
    list = list.filter(a => Number(a.evaluations_count || 0) > 0);
  }
  renderFilteredAspirants(list);
}

async function loadAspirants() {
  const tbody = document.getElementById("aspirantsTableBody");
  if (!tbody) return;
  const searchInput = document.getElementById("aspirantSearchInput");
  const query = searchInput ? searchInput.value.trim() : "";

  try {
    const res = await fetch(`/api/admin/aspirants?search=${encodeURIComponent(query)}`);
    if (!res.ok) throw new Error("Could not fetch aspirants");
    const aspirants = await res.json();
    cachedAspirants = aspirants || [];

    const cntEl = document.getElementById("aspCountAll");
    if (cntEl) cntEl.textContent = cachedAspirants.length;

    const diagAsp = document.getElementById("diagAspirants");
    if (diagAsp) diagAsp.textContent = cachedAspirants.length;

    applyAspirantFilters();
  } catch (e) {
    tbody.innerHTML = `<tr><td colspan="6" class="p-8 text-center text-rose-400">Error loading aspirants: ${e.message}</td></tr>`;
  }
}

function renderFilteredAspirants(aspirants) {
  const tbody = document.getElementById("aspirantsTableBody");
  if (!tbody) return;

  if (!aspirants || aspirants.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" class="p-8 text-center text-slate-500 font-sans">No registered aspirants match the current filter.</td></tr>`;
    return;
  }

  tbody.innerHTML = aspirants.map(asp => {
    const usedToday = Number(asp.daily_used_today || 0);
    const remToday = Number(asp.daily_remaining_today ?? Math.max(0, 15 - usedToday));
    const pctUsed = Math.min(100, Math.round((usedToday / 15) * 100));
    const totalCopies = Number(asp.evaluations_count || 0);
    const avgPct = Number(asp.avg_percentage || 0).toFixed(1);
    const isPro = asp.plan_tier === "pro" || asp.plan_tier === "unlimited" || asp.is_pro;

    return `
      <tr class="hover:bg-slate-800/40 transition">
        <td class="p-3.5">
          ${asp.is_online ? `
            <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10.5px] font-bold">
              <span class="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span>Online Now</span>
            </span>
            <div class="text-[10px] text-amber-300 font-medium mt-1 truncate">${escapeHtml(asp.current_view || "")}</div>
          ` : `
            <span class="text-[11px] font-mono text-slate-400 block">${escapeHtml(asp.last_seen_display || "Offline")}</span>
          `}
        </td>
        <td class="p-3.5">
          <div class="flex items-center space-x-1.5">
            <span class="font-bold text-white text-xs">${escapeHtml(asp.name || "UPSC Aspirant")}</span>
            ${isPro ? `<span class="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[9px] font-mono font-bold uppercase">PRO</span>` : ""}
          </div>
          <div class="text-[11px] text-amber-400 font-mono select-all">${escapeHtml(asp.email)}</div>
          <div class="text-[10px] text-slate-500 font-mono">Joined: ${escapeHtml((asp.created_at || "").slice(0, 10))}</div>
        </td>
        <td class="p-3.5">
          <div class="text-slate-200 font-semibold">CSE ${escapeHtml(String(asp.target_year || "2026"))}</div>
          <div class="text-[10.5px] text-slate-400">${escapeHtml(asp.optional_subject || "General Studies")}</div>
        </td>
        <td class="p-3.5">
          <div class="flex items-center justify-between text-[11px] font-mono mb-1">
            <span class="font-bold ${usedToday > 0 ? 'text-amber-400' : 'text-slate-300'}">${usedToday} / 15 Used Today</span>
            <span class="text-emerald-400 font-bold">${remToday} Left</span>
          </div>
          <div class="w-40 h-2 rounded-full bg-slate-800 overflow-hidden">
            <div class="h-full bg-gradient-to-r from-amber-500 to-emerald-400" style="width: ${pctUsed}%"></div>
          </div>
        </td>
        <td class="p-3.5">
          <div class="font-mono font-extrabold text-sm text-sky-400">${totalCopies} Copies</div>
          <div class="text-[10.5px] text-slate-400 font-mono">Avg Score: ${avgPct}%</div>
        </td>
        <td class="p-3.5 text-right space-x-1.5 whitespace-nowrap">
          <button onclick="filterCopiesByEmail('${escapeHtml(asp.email)}')" class="px-2.5 py-1.5 rounded-lg bg-amber-500/15 hover:bg-amber-500 text-amber-300 hover:text-slate-950 font-bold text-[11px] border border-amber-500/30 transition">
            📂 Copies (${totalCopies})
          </button>
          <button onclick="resetDailyQuota('${escapeHtml(asp.email)}')" class="px-2.5 py-1.5 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/30 text-[11px] font-bold transition" title="Restore 15 daily evaluations">
            🔄 Reset 15 Quota
          </button>
          <button onclick="openCreditManager('${escapeHtml(asp.email)}', '${escapeHtml(asp.plan_tier || 'starter')}')" class="px-2.5 py-1.5 rounded-lg bg-sky-500/15 hover:bg-sky-500/25 text-sky-300 border border-sky-500/30 text-[11px] font-bold transition">
            ⚡ Credits
          </button>
        </td>
      </tr>
    `;
  }).join("");
  safeCreateIcons();
}

function exportAspirantsCSV() {
  if (!cachedAspirants || cachedAspirants.length === 0) {
    alert("No aspirants loaded to export.");
    return;
  }
  const headers = ["Name", "Email", "Target Year", "Optional Subject", "Used Today", "Total Copies", "Avg Percentage", "Joined Date"];
  const rows = cachedAspirants.map(a => [
    `"${(a.name || '').replace(/"/g, '""')}"`,
    `"${(a.email || '').replace(/"/g, '""')}"`,
    `"${a.target_year || '2026'}"`,
    `"${(a.optional_subject || 'General Studies').replace(/"/g, '""')}"`,
    a.daily_used_today || 0,
    a.evaluations_count || 0,
    a.avg_percentage || 0,
    `"${(a.created_at || '').slice(0, 10)}"`
  ]);

  const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `cooked_mains_aspirants_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

async function resetDailyQuota(email) {
  try {
    const res = await fetch("/api/admin/aspirant/reset-daily", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email })
    });
    if (!res.ok) throw new Error("Failed to reset quota");
    alert(`✓ Daily quota of 15 evaluations restored for ${email}`);
    loadAspirants();
    loadAdminActivity();
  } catch (e) {
    alert(`Error: ${e.message}`);
  }
}

function openCreditManager(email, planTier) {
  activeCreditCadetEmail = email;
  const modal = document.getElementById("creditManagerModal");
  if (!modal) return;
  document.getElementById("creditManagerEmailLabel").textContent = email;
  document.getElementById("customCreditsInput").value = 5;
  const planSelect = document.getElementById("customPlanTierSelect");
  if (planSelect) planSelect.value = planTier || "starter";

  const msg = document.getElementById("creditManagerMsg");
  if (msg) msg.className = "hidden";

  modal.classList.remove("hidden");
  safeCreateIcons();
}

function closeCreditManager() {
  const modal = document.getElementById("creditManagerModal");
  if (modal) modal.classList.add("hidden");
  activeCreditCadetEmail = null;
}

function setCreditDelta(val) {
  const inp = document.getElementById("customCreditsInput");
  if (inp) inp.value = val;
}

async function applyCreditAdjustment() {
  if (!activeCreditCadetEmail) return;
  const creditsInp = document.getElementById("customCreditsInput");
  const planSelect = document.getElementById("customPlanTierSelect");
  const msg = document.getElementById("creditManagerMsg");

  const deltaCredits = parseInt(creditsInp.value, 10) || 0;
  const planTier = planSelect ? planSelect.value : "starter";
  const isPro = planTier === "pro" || planTier === "unlimited";

  try {
    const res = await fetch("/api/admin/aspirant/credits", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: activeCreditCadetEmail,
        delta_credits: deltaCredits,
        delta_rewrites: Math.max(1, Math.floor(deltaCredits / 2)),
        is_pro: isPro ? 1 : 0,
        plan_tier: planTier
      })
    });
    if (!res.ok) throw new Error("Failed to update credits");
    if (msg) {
      msg.textContent = `✓ Successfully granted ${deltaCredits} credits & updated plan for ${activeCreditCadetEmail}!`;
      msg.className = "block text-xs py-2 px-3 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-semibold";
    }
    setTimeout(() => {
      closeCreditManager();
      loadAspirants();
      loadAdminStats();
    }, 1200);
  } catch (err) {
    if (msg) {
      msg.textContent = `Error: ${err.message}`;
      msg.className = "block text-xs py-2 px-3 rounded-lg bg-rose-500/15 border border-rose-500/30 text-rose-400";
    }
  }
}

// -------------------------------------------------------------
// TAB 3: ANSWER COPIES & EVALUATION INSPECTOR
// -------------------------------------------------------------
function filterCopiesByEmail(email) {
  switchTab("evaluations");
  const inp = document.getElementById("evalEmailFilterInput");
  if (inp) inp.value = email || "";
  loadAdminEvaluations();
}

function clearEvalFilter() {
  const inp = document.getElementById("evalEmailFilterInput");
  if (inp) inp.value = "";
  const paperSel = document.getElementById("evalPaperFilter");
  if (paperSel) paperSel.value = "all";
  loadAdminEvaluations();
}

let evalFilterTimer = null;
function debounceEvalFilter() {
  clearTimeout(evalFilterTimer);
  evalFilterTimer = setTimeout(() => {
    loadAdminEvaluations();
  }, 250);
}

async function loadAdminEvaluations() {
  const tbody = document.getElementById("evaluationsTableBody");
  if (!tbody) return;
  const filterVal = (document.getElementById("evalEmailFilterInput")?.value || "").trim();
  const paperVal = (document.getElementById("evalPaperFilter")?.value || "all").trim();

  try {
    const queryParams = new URLSearchParams({
      limit: "100"
    });
    if (filterVal) queryParams.set("search", filterVal);
    if (paperVal && paperVal !== "all") queryParams.set("paper", paperVal);

    const res = await fetch(`/api/admin/evaluations?${queryParams.toString()}`);
    if (!res.ok) throw new Error("Could not load evaluations");
    const evals = await res.json();

    if (!evals || evals.length === 0) {
      tbody.innerHTML = `<tr><td colspan="6" class="p-8 text-center text-slate-500">No evaluated answer copies found.</td></tr>`;
      return;
    }

    tbody.innerHTML = evals.map(ev => {
      const score = Number(ev.overall_score || 0).toFixed(1);
      const maxM = Number(ev.max_marks || 15);
      const pct = Number(ev.percentage || 0).toFixed(1);
      return `
        <tr class="hover:bg-slate-800/40 transition">
          <td class="p-3.5 font-mono text-[11px] text-slate-300 whitespace-nowrap">
            ${escapeHtml(ev.created_at || "")}
          </td>
          <td class="p-3.5">
            <div class="font-bold text-white text-xs">${escapeHtml(ev.user_name || "Aspirant")}</div>
            <div class="font-mono text-[11px] text-amber-400 select-all">${escapeHtml(ev.user_email || "")}</div>
          </td>
          <td class="p-3.5 whitespace-nowrap">
            <span class="px-2.5 py-1 rounded-lg bg-slate-800 text-amber-300 border border-slate-700 font-mono font-bold text-xs">
              ${escapeHtml(ev.paper || "GS")} • ${maxM}M
            </span>
          </td>
          <td class="p-3.5 max-w-md">
            <p class="text-xs text-slate-200 font-serif line-clamp-2" title="${escapeHtml(ev.question || '')}">${escapeHtml(ev.question || "UPSC Mains Answer Copy")}</p>
          </td>
          <td class="p-3.5 whitespace-nowrap">
            <span class="text-base font-extrabold text-emerald-400 font-mono">${score} / ${maxM}</span>
            <span class="text-[11px] text-slate-400 font-mono block">${pct}%</span>
          </td>
          <td class="p-3.5 text-right whitespace-nowrap">
            <button onclick="inspectCopy('${escapeHtml(ev.id)}')" class="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs shadow transition">
              👁️ Inspect Copy &amp; Evaluation
            </button>
          </td>
        </tr>
      `;
    }).join("");
  } catch (e) {
    tbody.innerHTML = `<tr><td colspan="6" class="p-8 text-center text-rose-400">Error loading evaluations: ${e.message}</td></tr>`;
  }
}

async function inspectCopy(evalId) {
  const modal = document.getElementById("copyInspectorModal");
  if (!modal) return;
  modal.classList.remove("hidden");

  document.getElementById("inspectQuestionTitle").textContent = "Loading answer sheet & evaluation...";
  document.getElementById("inspectPagesContainer").innerHTML = `<div class="p-8 text-center text-slate-400 text-xs">Loading candidate's handwritten pages...</div>`;

  try {
    const res = await fetch(`/api/admin/evaluation/${encodeURIComponent(evalId)}`);
    if (!res.ok) throw new Error("Evaluation copy not found");
    const rec = await res.json();
    const ev = rec.evaluation || rec.evaluation_data || {};
    const pages = rec.pages || rec.page_images || ev._meta_pages || [];

    document.getElementById("inspectPaperBadge").textContent = `${rec.paper || ev.detected_paper || "GS"} • ${rec.max_marks || ev.max_marks || 15} Marks`;
    document.getElementById("inspectUserBadge").textContent = rec.user_email || "Aspirant";
    document.getElementById("inspectDateBadge").textContent = rec.created_at || "";
    document.getElementById("inspectQuestionTitle").textContent = rec.question || ev.detected_question || "UPSC Mains Answer Copy";
    document.getElementById("inspectScoreValue").textContent = `${Number(rec.overall_score ?? ev.overall_score ?? 0).toFixed(1)} / ${rec.max_marks || ev.max_marks || 15}`;
    document.getElementById("inspectExecSummary").textContent = ev.executive_summary || "No executive summary recorded.";

    const pagesHtml = pages.length > 0
      ? pages.map((p, idx) => `
          <div class="rounded-xl overflow-hidden border border-slate-700 bg-slate-950 space-y-1 group">
            <div class="px-3 py-1.5 bg-slate-900 border-b border-slate-800 text-[11px] font-mono font-bold text-amber-300 flex items-center justify-between">
              <span>Page ${idx + 1} of ${pages.length}</span>
              <button onclick="openImageZoom('${p}')" class="text-[10px] text-amber-400 hover:underline cursor-pointer">🔍 Click to Enlarge</button>
            </div>
            <img src="${p}" alt="Page ${idx + 1}" onclick="openImageZoom('${p}')" class="w-full h-auto object-contain cursor-zoom-in group-hover:opacity-95 transition">
          </div>
        `).join("")
      : `<div class="p-6 rounded-xl bg-slate-950 border border-slate-800 text-slate-500 text-xs text-center">No page preview image stored for this record.</div>`;
    document.getElementById("inspectPagesContainer").innerHTML = pagesHtml;

    const anns = ev.page_annotations || [];
    document.getElementById("inspectAnnotationsList").innerHTML = anns.length > 0
      ? anns.map(a => `
          <div class="p-2.5 rounded-lg bg-slate-900 border border-slate-800 flex items-start justify-between gap-2">
            <div>
              <span class="font-bold text-amber-300">[P${a.page || 1} • ${escapeHtml(a.type || "Note")}]</span>
              <span class="text-slate-200 ml-1">${escapeHtml(a.text || a.comment || "")}</span>
            </div>
            ${a.sub_Part_score ? `<span class="font-mono text-emerald-400 font-bold shrink-0">${escapeHtml(String(a.sub_Part_score))}</span>` : ""}
          </div>
        `).join("")
      : `<p class="text-slate-500">No margin annotations recorded.</p>`;

    const strengths = (ev.strengths || []).map(s => `<li class="text-emerald-300">✓ ${escapeHtml(s)}</li>`).join("");
    const gaps = (ev.weaknesses || []).map(w => `<li class="text-rose-300">⚠ ${escapeHtml(w)}</li>`).join("");
    document.getElementById("inspectStrengthsWeaknesses").innerHTML = `
      <ul class="space-y-1">${strengths}${gaps}</ul>
    `;
    safeCreateIcons();
  } catch (e) {
    document.getElementById("inspectQuestionTitle").textContent = `Error: ${e.message}`;
  }
}

function closeCopyInspector() {
  const modal = document.getElementById("copyInspectorModal");
  if (modal) modal.classList.add("hidden");
}

// -------------------------------------------------------------
// TAB 4: ASPIRANT FEEDBACK & RATINGS INBOX
// -------------------------------------------------------------
function setFeedbackFilter(filter) {
  feedbackFilterStatus = filter;
  ["all", "unresolved", "resolved"].forEach(f => {
    const btn = document.getElementById(`fbFilter_${f}`);
    if (btn) {
      if (f === filter) {
        btn.className = "px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-500 text-slate-950 transition";
      } else {
        btn.className = "px-2.5 py-1 rounded-lg text-xs font-semibold text-slate-400 hover:text-white transition";
      }
    }
  });
  renderFeedbacks();
}

async function loadAdminFeedbacks() {
  const container = document.getElementById("feedbacksContainer");
  if (!container) return;

  try {
    const res = await fetch("/api/admin/feedbacks");
    if (!res.ok) throw new Error("Could not load feedbacks");
    const list = await res.json();
    cachedFeedbacks = list || [];
    renderFeedbacks();
  } catch (e) {
    container.innerHTML = `<div class="col-span-2 p-8 text-center text-rose-400">Error loading feedbacks: ${e.message}</div>`;
  }
}

function renderFeedbacks() {
  const container = document.getElementById("feedbacksContainer");
  if (!container) return;

  let list = cachedFeedbacks || [];
  if (feedbackFilterStatus === "unresolved") {
    list = list.filter(f => !f.is_resolved);
  } else if (feedbackFilterStatus === "resolved") {
    list = list.filter(f => Boolean(f.is_resolved));
  }

  if (list.length === 0) {
    container.innerHTML = `<div class="col-span-2 p-8 text-center text-slate-500 bg-slate-900/40 rounded-2xl border border-slate-800 font-sans">No feedbacks matching current filter.</div>`;
    return;
  }

  container.innerHTML = list.map(fb => {
    const stars = "★".repeat(fb.rating || 5) + "☆".repeat(5 - (fb.rating || 5));
    const hasShot = Boolean(fb.screenshot_data && fb.screenshot_data.startsWith("data:image"));
    const isResolved = Boolean(fb.is_resolved);

    return `
      <div class="p-5 rounded-2xl bg-slate-900/90 border ${isResolved ? 'border-slate-800/80 opacity-75' : 'border-slate-800 border-l-4 border-l-amber-500'} space-y-3 shadow-sm">
        <div class="flex items-start justify-between gap-2">
          <div>
            <div class="flex items-center space-x-2">
              <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30 uppercase tracking-wider">
                ${escapeHtml(fb.category || "Feedback")}
              </span>
              ${isResolved ? `
                <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">✓ Resolved</span>
              ` : `
                <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">Open</span>
              `}
            </div>
            <h4 class="font-bold text-white text-xs mt-1.5">${escapeHtml(fb.user_name || "UPSC Aspirant")} <span class="text-slate-400 font-mono font-normal">(${escapeHtml(fb.user_email || "Anonymous")})</span></h4>
          </div>
          <div class="text-right">
            <span class="text-amber-400 font-mono text-sm tracking-widest block">${stars}</span>
            <div class="mt-1 space-x-2">
              ${isResolved ? `
                <button onclick="resolveFeedback('${fb.id}', false)" class="text-[10.5px] text-slate-400 hover:text-white font-semibold">↺ Reopen</button>
              ` : `
                <button onclick="resolveFeedback('${fb.id}', true)" class="text-[10.5px] text-emerald-400 hover:underline font-semibold">✓ Mark Resolved</button>
              `}
            </div>
          </div>
        </div>
        <p class="text-xs text-slate-200 leading-relaxed bg-slate-950/80 p-3.5 rounded-xl border border-slate-800/90 font-sans select-text">
          "${escapeHtml(fb.message)}"
        </p>
        ${hasShot ? `
          <div class="pt-1">
            <span class="text-[10px] font-mono uppercase tracking-wider text-amber-400 block mb-1.5">📸 Attached Screenshot:</span>
            <img src="${fb.screenshot_data}" alt="Screenshot" onclick="openImageZoom('${fb.screenshot_data}')" class="w-full max-h-56 object-contain rounded-xl border border-slate-700 bg-slate-950 p-1 cursor-zoom-in hover:opacity-95 transition">
          </div>
        ` : ""}
        <div class="flex items-center justify-between pt-1 text-[10.5px] font-mono text-slate-500">
          <div>
            ${fb.user_email && fb.user_email.includes('@') && !fb.user_email.includes('anonymous') ? `
              <a href="mailto:${encodeURIComponent(fb.user_email)}?subject=Regarding%20your%20Cooked%20Mains%20feedback" class="text-amber-400 hover:underline font-sans">✉️ Reply via Email</a>
            ` : ""}
          </div>
          <div>Submitted: ${escapeHtml(fb.created_at || "")}</div>
        </div>
      </div>
    `;
  }).join("");
}

async function resolveFeedback(feedbackId, resolved) {
  try {
    const res = await fetch(`/api/admin/feedback/${encodeURIComponent(feedbackId)}/resolve`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ resolved: Boolean(resolved) })
    });
    if (!res.ok) throw new Error("Could not update feedback status");
    // Update local cache
    const item = cachedFeedbacks.find(f => String(f.id) === String(feedbackId));
    if (item) item.is_resolved = resolved ? 1 : 0;
    renderFeedbacks();
    loadAdminStats();
  } catch (e) {
    alert("Error updating feedback: " + e.message);
  }
}

// -------------------------------------------------------------
// TAB 5: UPI PAYMENT ORDERS & PLAN APPROVALS
// -------------------------------------------------------------
async function loadAdminTransactions() {
  const tbody = document.getElementById("ordersTableBody");
  if (!tbody) return;
  const statusSel = document.getElementById("ordersStatusFilter");
  const status = statusSel ? statusSel.value : "all";

  try {
    const res = await fetch(`/api/admin/transactions?status=${encodeURIComponent(status)}`);
    if (!res.ok) throw new Error("Could not load transactions");
    const txs = await res.json();

    if (!txs || txs.length === 0) {
      tbody.innerHTML = `<tr><td colspan="7" class="p-8 text-center text-slate-500">No payment orders found.</td></tr>`;
      return;
    }

    tbody.innerHTML = txs.map(tx => {
      const isPending = tx.status === "pending";
      const isApproved = tx.status === "approved";
      let statusBadge = `<span class="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-400 border border-slate-700">${escapeHtml(tx.status || 'unknown')}</span>`;
      if (isPending) {
        statusBadge = `<span class="px-2.5 py-1 rounded-full text-[10.5px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">⏳ Pending Approval</span>`;
      } else if (isApproved) {
        statusBadge = `<span class="px-2.5 py-1 rounded-full text-[10.5px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">✓ Approved &amp; Credited</span>`;
      }

      return `
        <tr class="hover:bg-slate-800/40 transition">
          <td class="p-3.5 font-mono text-[11px] text-slate-300 whitespace-nowrap">
            ${escapeHtml(tx.created_at || "")}
          </td>
          <td class="p-3.5 font-mono text-xs text-white select-all">
            ${escapeHtml(tx.user_email || "")}
          </td>
          <td class="p-3.5 font-bold text-amber-300 text-xs">
            ${escapeHtml(tx.plan_tier || "Pro Tier")}
          </td>
          <td class="p-3.5 font-mono font-extrabold text-sm text-emerald-400">
            ₹${Number(tx.amount || 0)}
          </td>
          <td class="p-3.5 font-mono text-xs text-sky-300 select-all font-bold">
            ${escapeHtml(tx.utr_number || "—")}
          </td>
          <td class="p-3.5">
            ${statusBadge}
          </td>
          <td class="p-3.5 text-right whitespace-nowrap space-x-1.5">
            ${isPending ? `
              <button onclick="approveTransaction('${escapeHtml(tx.id)}')" class="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow transition">
                ✓ Approve &amp; Credit
              </button>
              <button onclick="rejectTransaction('${escapeHtml(tx.id)}')" class="px-2.5 py-1.5 rounded-lg bg-rose-500/15 hover:bg-rose-500 text-rose-300 hover:text-white font-semibold text-xs border border-rose-500/30 transition">
                ✕ Reject
              </button>
            ` : `
              <span class="text-[11px] text-slate-500 font-mono">${escapeHtml(tx.admin_notes || "Processed")}</span>
            `}
          </td>
        </tr>
      `;
    }).join("");
  } catch (err) {
    tbody.innerHTML = `<tr><td colspan="7" class="p-8 text-center text-rose-400">Error loading orders: ${err.message}</td></tr>`;
  }
}

async function approveTransaction(txId) {
  if (!confirm("Are you sure you want to approve this UPI payment and credit the aspirant?")) return;
  try {
    const res = await fetch("/api/admin/transaction/approve", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tx_id: txId, notes: "Approved by Founder via Command Center" })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.detail || "Approval failed");
    alert("✓ " + (data.message || "Order approved!"));
    loadAdminTransactions();
    loadAdminStats();
    loadAspirants();
  } catch (err) {
    alert("Error: " + err.message);
  }
}

async function rejectTransaction(txId) {
  const reason = prompt("Enter rejection reason (optional):", "Invalid UTR / Payment not received");
  if (reason === null) return;
  try {
    const res = await fetch("/api/admin/transaction/reject", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tx_id: txId, notes: reason })
    });
    if (!res.ok) throw new Error("Rejection failed");
    alert("Order rejected.");
    loadAdminTransactions();
  } catch (err) {
    alert("Error: " + err.message);
  }
}

// -------------------------------------------------------------
// TAB 6: SECURITY & SETTINGS
// -------------------------------------------------------------
async function loadAdminSettings() {
  try {
    const res = await fetch("/api/admin/settings");
    if (!res.ok) return;
    const data = await res.json();
    const upiInp = document.getElementById("settingsUpiIdInput");
    if (upiInp && data.admin_upi_id) upiInp.value = data.admin_upi_id;
  } catch (e) {
    console.warn("Could not load settings:", e);
  }
}

async function updateAdminUpiId(e) {
  if (e) e.preventDefault();
  const upiInp = document.getElementById("settingsUpiIdInput");
  const msgEl = document.getElementById("upiChangeMsg");
  const upiId = (upiInp ? upiInp.value : "").trim();

  try {
    const res = await fetch("/api/admin/settings/upi", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ upi_id: upiId })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.detail || "Could not save UPI ID");
    if (msgEl) {
      msgEl.textContent = `✓ UPI ID updated to ${data.admin_upi_id}!`;
      msgEl.className = "block text-xs py-2 px-3 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-semibold";
    }
  } catch (err) {
    if (msgEl) {
      msgEl.textContent = `Error: ${err.message}`;
      msgEl.className = "block text-xs py-2 px-3 rounded-lg bg-rose-500/15 border border-rose-500/30 text-rose-400";
    }
  }
}

async function changeAdminPassword(e) {
  if (e) e.preventDefault();
  const currentPin = (document.getElementById("currentPinInput")?.value || "").trim();
  const newPin = (document.getElementById("newPinInput")?.value || "").trim();
  const confirmPin = (document.getElementById("confirmPinInput")?.value || "").trim();
  const msgEl = document.getElementById("passwordChangeMsg");

  if (msgEl) msgEl.className = "hidden";

  if (newPin !== confirmPin) {
    if (msgEl) {
      msgEl.textContent = "New password and confirmation do not match.";
      msgEl.className = "block text-xs py-2 px-3 rounded-lg bg-rose-500/15 border border-rose-500/30 text-rose-400 font-medium";
    }
    return;
  }

  try {
    const res = await fetch("/api/admin/settings/password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ current_pin: currentPin, new_pin: newPin })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.detail || "Could not update password");

    if (data.token) {
      adminToken = data.token;
      localStorage.setItem("mainsmentor_admin_token", adminToken);
    }

    document.getElementById("currentPinInput").value = "";
    document.getElementById("newPinInput").value = "";
    document.getElementById("confirmPinInput").value = "";

    if (msgEl) {
      msgEl.textContent = "✓ Master password updated! Use your new password next time you log in.";
      msgEl.className = "block text-xs py-2 px-3 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-semibold";
    }
  } catch (err) {
    if (msgEl) {
      msgEl.textContent = `Error: ${err.message}`;
      msgEl.className = "block text-xs py-2 px-3 rounded-lg bg-rose-500/15 border border-rose-500/30 text-rose-400 font-medium";
    }
  }
}

// -------------------------------------------------------------
// IMAGE LIGHTBOX ZOOM
// -------------------------------------------------------------
function openImageZoom(src) {
  const modal = document.getElementById("imageZoomModal");
  const img = document.getElementById("imageZoomTarget");
  if (!modal || !img) return;
  img.src = src;
  modal.classList.remove("hidden");
  safeCreateIcons();
}

function closeImageZoom() {
  const modal = document.getElementById("imageZoomModal");
  if (modal) modal.classList.add("hidden");
}

function escapeHtml(str) {
  return String(str || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
