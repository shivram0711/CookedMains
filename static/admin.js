// Cooked Mains — Owner & Founder Command Center Client

let adminToken = localStorage.getItem("mainsmentor_admin_token");
let autoRefreshEnabled = true;
let autoRefreshInterval = null;

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
  const tabs = ["live", "aspirants", "evaluations", "feedback", "settings"];
  tabs.forEach(t => {
    const content = document.getElementById(`tabContent_${t}`);
    const btn = document.getElementById(`tabBtn_${t}`);
    if (t === tabId) {
      if (content) content.classList.remove("hidden");
      if (btn) {
        btn.className = "tab-btn px-4 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-2 bg-amber-500 text-slate-950 cursor-pointer";
      }
    } else {
      if (content) content.classList.add("hidden");
      if (btn) {
        btn.className = "tab-btn px-4 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-2 bg-slate-900 text-slate-400 hover:text-white cursor-pointer";
      }
    }
  });
}

async function loadAllAdminData() {
  await Promise.all([
    loadAdminStats(),
    loadAdminActivity(),
    loadAspirants(),
    loadAdminEvaluations(),
    loadAdminFeedbacks()
  ]);
  safeCreateIcons();
}

async function loadAdminStats() {
  try {
    const res = await fetch("/api/admin/stats");
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

    if (stats.server_time_ist) {
      setTxt("headerServerTime", `Server Time: ${stats.server_time_ist} • Live Telemetry Active`);
    }

    setTxt("settingsActiveModel", stats.active_gemini_model || "gemini-3.6-flash");
    setTxt("settingsSupabaseStatus", stats.supabase_connected ? "Connected (Cloud Sync Active)" : "Local SQLite Active");
    if (Array.isArray(stats.blacklisted_models) && stats.blacklisted_models.length > 0) {
      setTxt("settingsBlacklistedModels", stats.blacklisted_models.join(", "));
    }

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
      <div class="p-8 rounded-xl bg-slate-950/70 border border-slate-800/80 text-center space-y-2">
        <div class="text-slate-400 text-xs font-semibold">No active browser tabs in the last 2.5 minutes</div>
        <p class="text-[11px] text-slate-500">As soon as an aspirant opens the website or uploads an answer sheet, their live screen status appears here automatically.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = onlineList.map(u => {
    const secStr = u.seconds_ago <= 5 ? "Just now" : `${u.seconds_ago}s ago`;
    return `
      <div class="p-3.5 rounded-xl bg-slate-950 border border-emerald-500/30 flex items-center justify-between gap-3">
        <div class="space-y-0.5 min-w-0">
          <div class="flex items-center space-x-2">
            <span class="w-2 h-2 rounded-full bg-emerald-400 animate-ping shrink-0"></span>
            <span class="font-bold text-white text-xs truncate">${escapeHtml(u.name || "Aspirant")}</span>
            <span class="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">${secStr}</span>
          </div>
          <div class="text-[11px] font-mono text-slate-400 truncate">${escapeHtml(u.email || "")}</div>
          <div class="text-[11px] text-amber-300 font-semibold pt-0.5">📍 Screen: ${escapeHtml(u.current_view || "Browsing")}</div>
        </div>
        ${u.is_authenticated ? `
          <button onclick="filterCopiesByEmail('${escapeHtml(u.email)}')" class="shrink-0 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-[11px] font-bold text-amber-300 border border-slate-700">
            View Copies
          </button>
        ` : ""}
      </div>
    `;
  }).join("");
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
      }

      return `
        <div class="p-3.5 rounded-xl bg-slate-950 border border-slate-800/90 hover:border-slate-700 transition flex items-start justify-between gap-3">
          <div class="space-y-1 min-w-0">
            <div class="flex flex-wrap items-center gap-2">
              <span class="px-2 py-0.5 rounded text-[10px] font-bold border ${badgeColor}">${iconEmoji} ${escapeHtml(ev.title || "Activity")}</span>
              <span class="text-[10.5px] font-mono text-slate-400">${escapeHtml(ev.user_email || "")}</span>
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
  } catch (e) {
    console.error("Activity load error:", e);
  }
}

let searchTimer = null;
function debounceAspirantSearch() {
  clearTimeout(searchTimer);
  searchTimer = setTimeout(() => {
    loadAspirants();
  }, 300);
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

    if (!aspirants || aspirants.length === 0) {
      tbody.innerHTML = `<tr><td colspan="6" class="p-8 text-center text-slate-500 font-sans">No registered aspirants found.</td></tr>`;
      return;
    }

    tbody.innerHTML = aspirants.map(asp => {
      const usedToday = Number(asp.daily_used_today || 0);
      const remToday = Number(asp.daily_remaining_today ?? Math.max(0, 15 - usedToday));
      const pctUsed = Math.min(100, Math.round((usedToday / 15) * 100));
      const totalCopies = Number(asp.evaluations_count || 0);
      const avgPct = Number(asp.avg_percentage || 0).toFixed(1);

      return `
        <tr class="hover:bg-slate-800/40 transition">
          <td class="p-3.5">
            ${asp.is_online ? `
              <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10.5px] font-bold">
                <span class="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                <span>Online Now</span>
              </span>
              <div class="text-[10px] text-amber-300 font-medium mt-1">${escapeHtml(asp.current_view || "")}</div>
            ` : `
              <span class="text-[11px] font-mono text-slate-400 block">${escapeHtml(asp.last_seen_display || "Offline")}</span>
            `}
          </td>
          <td class="p-3.5">
            <div class="font-bold text-white text-xs">${escapeHtml(asp.name || "UPSC Aspirant")}</div>
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
              📂 View Copies (${totalCopies})
            </button>
            <button onclick="resetDailyQuota('${escapeHtml(asp.email)}')" class="px-2.5 py-1.5 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/30 text-[11px] font-bold transition" title="Reset today's quota & restore 15 evaluations">
              🔄 Reset 15 Quota
            </button>
            <button onclick="adjustCredits('${escapeHtml(asp.email)}', 5, 0)" class="px-2.5 py-1.5 rounded-lg bg-sky-500/15 hover:bg-sky-500/25 text-sky-300 border border-sky-500/30 text-[11px] font-bold transition">
              +5 Credits
            </button>
          </td>
        </tr>
      `;
    }).join("");
  } catch (e) {
    tbody.innerHTML = `<tr><td colspan="6" class="p-8 text-center text-rose-400">Error loading aspirants: ${e.message}</td></tr>`;
  }
}

function filterCopiesByEmail(email) {
  switchTab("evaluations");
  const inp = document.getElementById("evalEmailFilterInput");
  if (inp) inp.value = email || "";
  loadAdminEvaluations();
}

function clearEvalFilter() {
  const inp = document.getElementById("evalEmailFilterInput");
  if (inp) inp.value = "";
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
  const emailFilter = (document.getElementById("evalEmailFilterInput")?.value || "").trim();

  try {
    const res = await fetch(`/api/admin/evaluations?email=${encodeURIComponent(emailFilter)}&limit=60`);
    if (!res.ok) throw new Error("Could not load evaluations");
    const evals = await res.json();

    if (!evals || evals.length === 0) {
      tbody.innerHTML = `<tr><td colspan="6" class="p-8 text-center text-slate-500">No evaluated answer copies found${emailFilter ? ` for ${escapeHtml(emailFilter)}` : ""}.</td></tr>`;
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
            <div class="font-mono text-[11px] text-amber-400">${escapeHtml(ev.user_email || "")}</div>
          </td>
          <td class="p-3.5 whitespace-nowrap">
            <span class="px-2.5 py-1 rounded-lg bg-slate-800 text-amber-300 border border-slate-700 font-mono font-bold text-xs">
              ${escapeHtml(ev.paper || "GS")} • ${maxM}M
            </span>
          </td>
          <td class="p-3.5 max-w-md">
            <p class="text-xs text-slate-200 font-serif line-clamp-2">${escapeHtml(ev.question || "UPSC Mains Answer Copy")}</p>
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
  document.getElementById("inspectPagesContainer").innerHTML = `<div class="p-8 text-center text-slate-400 text-xs">Loading uploaded handwritten pages...</div>`;

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
          <div class="rounded-xl overflow-hidden border border-slate-700 bg-slate-950 space-y-1">
            <div class="px-3 py-1.5 bg-slate-900 border-b border-slate-800 text-[11px] font-mono font-bold text-amber-300">
              Page ${idx + 1} of ${pages.length}
            </div>
            <img src="${p}" alt="Page ${idx + 1}" class="w-full h-auto object-contain">
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

async function resetDailyQuota(email) {
  try {
    const res = await fetch("/api/admin/aspirant/reset-daily", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email })
    });
    if (!res.ok) throw new Error("Failed to reset quota");
    loadAspirants();
    loadAdminActivity();
  } catch (e) {
    alert(`Error: ${e.message}`);
  }
}

async function adjustCredits(email, deltaCredits, deltaRewrites) {
  try {
    const res = await fetch("/api/admin/aspirant/credits", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        delta_credits: deltaCredits,
        delta_rewrites: deltaRewrites
      })
    });
    if (!res.ok) throw new Error("Failed to update credits");
    loadAspirants();
    loadAdminStats();
  } catch (e) {
    alert(`Error: ${e.message}`);
  }
}

async function loadAdminFeedbacks() {
  const container = document.getElementById("feedbacksContainer");
  if (!container) return;

  try {
    const res = await fetch("/api/admin/feedbacks");
    if (!res.ok) throw new Error("Could not load feedbacks");
    const list = await res.json();

    if (!list || list.length === 0) {
      container.innerHTML = `<div class="col-span-2 p-8 text-center text-slate-500 bg-slate-900/40 rounded-2xl border border-slate-800 font-sans">No aspirant feedbacks or bug reports submitted yet.</div>`;
      return;
    }

    container.innerHTML = list.map(fb => {
      const stars = "★".repeat(fb.rating || 5) + "☆".repeat(5 - (fb.rating || 5));
      const hasShot = Boolean(fb.screenshot_data && fb.screenshot_data.startsWith("data:image"));
      return `
        <div class="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3 shadow-sm">
          <div class="flex items-start justify-between gap-2">
            <div>
              <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30 uppercase tracking-wider">
                ${escapeHtml(fb.category || "Feedback")}
              </span>
              <h4 class="font-bold text-white text-xs mt-1.5">${escapeHtml(fb.user_name || "UPSC Aspirant")} <span class="text-slate-400 font-mono font-normal">(${escapeHtml(fb.user_email || "Anonymous")})</span></h4>
            </div>
            <div class="text-right">
              <span class="text-amber-400 font-mono text-sm tracking-widest block">${stars}</span>
              <button onclick="deleteFeedback('${fb.id}')" class="text-[10px] text-rose-400 hover:underline mt-1">✓ Resolve / Delete</button>
            </div>
          </div>
          <p class="text-xs text-slate-200 leading-relaxed bg-slate-950/80 p-3.5 rounded-xl border border-slate-800/90 font-sans">
            "${escapeHtml(fb.message)}"
          </p>
          ${hasShot ? `
            <div class="pt-1">
              <span class="text-[10px] font-mono uppercase tracking-wider text-amber-400 block mb-1.5">📸 Attached Screenshot:</span>
              <a href="${fb.screenshot_data}" target="_blank" title="Click to view full size">
                <img src="${fb.screenshot_data}" alt="Screenshot" class="w-full max-h-56 object-contain rounded-xl border border-slate-700 bg-slate-950 p-1">
              </a>
            </div>
          ` : ""}
          <div class="text-[10px] text-slate-500 font-mono text-right">
            Submitted: ${escapeHtml(fb.created_at || "")}
          </div>
        </div>
      `;
    }).join("");
  } catch (e) {
    container.innerHTML = `<div class="col-span-2 p-8 text-center text-rose-400">Error loading feedbacks: ${e.message}</div>`;
  }
}

async function deleteFeedback(feedbackId) {
  try {
    await fetch(`/api/admin/feedback/${encodeURIComponent(feedbackId)}`, { method: "DELETE" });
    loadAdminFeedbacks();
    loadAdminStats();
  } catch (e) {
    alert("Could not delete feedback");
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

function escapeHtml(str) {
  return String(str || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
