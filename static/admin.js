// Cooked Mains - Admin Dashboard Client

let adminToken = localStorage.getItem("mainsmentor_admin_token");

document.addEventListener("DOMContentLoaded", () => {
  lucide.createIcons();
  checkAdminAuth();
});

function checkAdminAuth() {
  const modal = document.getElementById("adminLoginModal");
  if (!adminToken) {
    if (modal) modal.classList.remove("hidden");
  } else {
    if (modal) modal.classList.add("hidden");
    loadAllAdminData();
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
  const tabs = ['transactions', 'aspirants', 'feedback', 'settings'];
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
    loadAdminTransactions(),
    loadAspirants(),
    loadAdminFeedbacks(),
    loadAdminSettings()
  ]);
  lucide.createIcons();
}

async function loadAdminStats() {
  try {
    const res = await fetch("/api/admin/stats");
    if (!res.ok) return;
    const stats = await res.json();
    document.getElementById("statAspirants").textContent = stats.total_aspirants || 0;
    document.getElementById("statEvaluations").textContent = stats.total_evaluations || 0;
    document.getElementById("statPending").textContent = stats.pending_orders || 0;
    document.getElementById("statRevenue").textContent = `₹${stats.total_revenue || 0}`;
    document.getElementById("statRating").textContent = stats.average_rating || "5.0";
    document.getElementById("statFeedbackCount").textContent = `${stats.total_feedbacks || 0} reviews received`;
    
    const badge = document.getElementById("txCountBadge");
    if (badge) badge.textContent = stats.pending_orders || 0;
  } catch (e) {
    console.error("Stats load error:", e);
  }
}

async function loadAdminTransactions() {
  const tbody = document.getElementById("transactionsTableBody");
  if (!tbody) return;

  try {
    const res = await fetch("/api/admin/transactions");
    if (!res.ok) throw new Error("Could not fetch orders");
    const txs = await res.json();

    if (!txs || txs.length === 0) {
      tbody.innerHTML = `<tr><td colspan="7" class="p-8 text-center text-slate-500 font-sans">No UPI subscription orders submitted yet.</td></tr>`;
      return;
    }

    tbody.innerHTML = txs.map(tx => {
      const isPending = tx.status === 'pending';
      const isApproved = tx.status === 'approved';
      const dateStr = tx.created_at ? new Date(tx.created_at).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }) : 'Just now';

      return `
        <tr class="hover:bg-slate-800/30 transition">
          <td class="p-3.5">
            <span class="font-mono font-bold text-amber-400 block">${tx.id}</span>
            <span class="text-[10px] text-slate-500">${dateStr}</span>
          </td>
          <td class="p-3.5">
            <div class="font-bold text-white">${escapeHtml(tx.user_name || 'Aspirant')}</div>
            <div class="text-[10.5px] text-slate-400 font-mono">${escapeHtml(tx.user_email || '')}</div>
          </td>
          <td class="p-3.5">
            <span class="font-semibold text-slate-200">${escapeHtml(tx.plan_name)}</span>
          </td>
          <td class="p-3.5 font-mono font-bold text-emerald-400 text-sm">
            ₹${tx.amount}
          </td>
          <td class="p-3.5">
            <span class="font-mono font-extrabold bg-slate-950 px-2 py-1 rounded border border-slate-800 text-amber-300 select-all block max-w-fit">
              ${escapeHtml(tx.utr_number || 'N/A')}
            </span>
          </td>
          <td class="p-3.5">
            <span class="px-2.5 py-1 rounded-full text-[10.5px] font-bold uppercase tracking-wider ${
              isApproved ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' :
              isPending ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40 animate-pulse' :
              'bg-rose-500/20 text-rose-400 border border-rose-500/40'
            }">
              ${isApproved ? '✓ Auto-Approved' : tx.status}
            </span>
          </td>
          <td class="p-3.5 text-right space-x-1.5">
            ${isPending ? `
              <button onclick="approveTx('${tx.id}')" class="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-[11px] shadow transition active:scale-95 cursor-pointer">
                ✓ Approve &amp; Credit
              </button>
              <button onclick="rejectTx('${tx.id}')" class="px-2.5 py-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-400 border border-rose-500/40 text-[11px] font-semibold transition cursor-pointer">
                ✕ Reject
              </button>
            ` : `
              <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10.5px] font-bold font-mono">
                ✓ Balance Unlocked
              </span>
            `}
          </td>
        </tr>
      `;
    }).join("");
  } catch (e) {
    tbody.innerHTML = `<tr><td colspan="7" class="p-8 text-center text-rose-400 font-sans">Error loading transactions: ${e.message}</td></tr>`;
  }
}

async function approveTx(txId) {
  if (!confirm(`Confirm approval of order ${txId}?\nThis will instantly credit evaluations/rewrites to the aspirant's account.`)) return;

  try {
    const res = await fetch("/api/admin/transaction/approve", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tx_id: txId })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.detail || "Approval failed");
    alert(`Success: ${data.message}`);
    loadAllAdminData();
  } catch (err) {
    alert(`Error: ${err.message}`);
  }
}

async function rejectTx(txId) {
  const reason = prompt("Enter rejection reason (optional):", "UTR not matched in SBI statement");
  if (reason === null) return;

  try {
    const res = await fetch("/api/admin/transaction/reject", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tx_id: txId, notes: reason })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.detail || "Rejection failed");
    loadAllAdminData();
  } catch (err) {
    alert(`Error: ${err.message}`);
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
      tbody.innerHTML = `<tr><td colspan="7" class="p-8 text-center text-slate-500 font-sans">No registered aspirants found.</td></tr>`;
      return;
    }

    tbody.innerHTML = aspirants.map(asp => {
      const isPro = Boolean(asp.is_pro);
      const tierBadge = isPro ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30' :
        asp.plan_tier === 'revision' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
        asp.plan_tier === 'sachet' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
        'bg-slate-800 text-slate-400 border border-slate-700';

      return `
        <tr class="hover:bg-slate-800/30 transition">
          <td class="p-3.5">
            <div class="font-bold text-white">${escapeHtml(asp.name || 'Aspirant')}</div>
            <div class="text-[10.5px] text-slate-400 font-mono">${escapeHtml(asp.email || '')}</div>
          </td>
          <td class="p-3.5">
            <span class="font-mono text-slate-300 font-bold block">${asp.target_year || '2026'}</span>
            <span class="text-[10px] text-slate-500">${escapeHtml(asp.optional_subject || 'PSIR')}</span>
          </td>
          <td class="p-3.5">
            <span class="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${tierBadge}">
              ${isPro ? 'Mains Pro' : (asp.plan_tier || 'Free Starter')}
            </span>
          </td>
          <td class="p-3.5 font-mono font-bold ${isPro ? 'text-indigo-400' : 'text-amber-400'}">
            ${isPro ? '∞ Unlimited' : asp.free_credits}
          </td>
          <td class="p-3.5 font-mono font-bold text-emerald-400">
            ${isPro ? '∞ Unlimited' : (asp.free_rewrites || 0)}
          </td>
          <td class="p-3.5 font-mono text-slate-300">
            ${asp.evaluations_count || 0} copies
          </td>
          <td class="p-3.5 text-right">
            <button onclick="giftCredits('${asp.email}')" class="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 text-xs font-semibold transition cursor-pointer">
              + Add Checks
            </button>
          </td>
        </tr>
      `;
    }).join("");
  } catch (e) {
    tbody.innerHTML = `<tr><td colspan="7" class="p-8 text-center text-rose-400 font-sans">Error loading aspirants: ${e.message}</td></tr>`;
  }
}

async function giftCredits(email) {
  const creditsStr = prompt(`Add how many evaluation checks for ${email}?`, "5");
  if (!creditsStr) return;
  const credits = parseInt(creditsStr);
  if (isNaN(credits) || credits <= 0) return;

  try {
    const res = await fetch("/api/admin/aspirant/credits", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, delta_credits: credits, delta_rewrites: 2 })
    });
    if (!res.ok) throw new Error("Failed to add credits");
    alert(`Successfully added ${credits} evaluation checks!`);
    loadAspirants();
  } catch (err) {
    alert(`Error: ${err.message}`);
  }
}

async function loadAdminFeedbacks() {
  const container = document.getElementById("feedbacksContainer");
  if (!container) return;

  try {
    const res = await fetch("/api/admin/feedbacks");
    if (!res.ok) throw new Error("Could not fetch feedback");
    const feedbacks = await res.json();

    if (!feedbacks || feedbacks.length === 0) {
      container.innerHTML = `<div class="col-span-2 p-8 text-center text-slate-500 font-sans bg-slate-900/60 border border-slate-800 rounded-2xl">No feedback received yet.</div>`;
      return;
    }

    container.innerHTML = feedbacks.map(fb => {
      const stars = "★".repeat(fb.rating) + "☆".repeat(5 - fb.rating);
      const dateStr = fb.created_at ? new Date(fb.created_at).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recently';

      return `
        <div class="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3 shadow-sm">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-2">
              <span class="text-amber-400 font-bold text-sm tracking-wider">${stars}</span>
              <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700">
                ${escapeHtml(fb.category || 'Feedback')}
              </span>
            </div>
            <span class="text-[10px] text-slate-500 font-mono">${dateStr}</span>
          </div>
          <p class="text-xs text-slate-200 leading-relaxed font-sans">${escapeHtml(fb.message)}</p>
          <div class="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10.5px] text-slate-400">
            <span>By: <strong class="text-white">${escapeHtml(fb.user_name || 'Anonymous Aspirant')}</strong> (${escapeHtml(fb.user_email || 'No email')})</span>
            ${fb.screenshot_data ? `<a href="${fb.screenshot_data}" target="_blank" class="text-amber-400 hover:underline">View Screenshot ↗</a>` : ''}
          </div>
        </div>
      `;
    }).join("");
  } catch (e) {
    container.innerHTML = `<div class="col-span-2 text-rose-400 p-4">Error loading feedback: ${e.message}</div>`;
  }
}

async function loadAdminSettings() {
  try {
    const res = await fetch("/api/admin/settings");
    if (!res.ok) return;
    const settings = await res.json();
    if (settings.admin_upi_id) {
      const input = document.getElementById("adminUpiInput");
      if (input) input.value = settings.admin_upi_id;
    }
  } catch (e) {
    console.error("Settings load error:", e);
  }
}

async function saveUpiSetting(e) {
  if (e) e.preventDefault();
  const input = document.getElementById("adminUpiInput");
  const upiId = (input.value || "").trim();

  try {
    const res = await fetch("/api/admin/settings/upi", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ upi_id: upiId })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.detail || "Update failed");
    alert(`Active UPI ID updated to: ${data.admin_upi_id}`);
  } catch (err) {
    alert(`Error: ${err.message}`);
  }
}

function escapeHtml(text) {
  if (!text) return "";
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
