const fs = require('fs');
const path = require('path');

const inputPath = path.resolve(__dirname, '../seed_vault_data.json');
const data = JSON.parse(fs.readFileSync(inputPath, 'utf8'));

function escapeSqlString(val) {
    if (val === null || val === undefined) return 'NULL';
    if (typeof val === 'number') return val.toString();
    if (typeof val === 'boolean') return val ? 'TRUE' : 'FALSE';
    const str = typeof val === 'object' ? JSON.stringify(val) : String(val);
    return "'" + str.replace(/'/g, "''") + "'";
}

function formatEvalSql(ev) {
    return `INSERT INTO evaluations (id, user_id, user_email, paper, max_marks, question, overall_score, percentage, evaluation_json, pages_json, thumbnail, is_rewrite, file_hash, has_been_rewritten, rewrite_eval_id, baseline_eval_id, file_url, created_at)
VALUES (${escapeSqlString(ev.id)}, ${escapeSqlString(ev.user_id)}, ${escapeSqlString(ev.user_email)}, ${escapeSqlString(ev.paper)}, ${ev.max_marks || 10}, ${escapeSqlString(ev.question)}, ${ev.overall_score || 0}, ${ev.percentage || 0}, ${escapeSqlString(ev.evaluation_json || '{}')}, ${escapeSqlString(ev.pages_json || '[]')}, ${escapeSqlString(ev.thumbnail || '')}, ${ev.is_rewrite || 0}, ${escapeSqlString(ev.file_hash || '')}, ${ev.has_been_rewritten || 0}, ${escapeSqlString(ev.rewrite_eval_id || null)}, ${escapeSqlString(ev.baseline_eval_id || null)}, ${escapeSqlString(ev.file_url || null)}, ${escapeSqlString(ev.created_at || new Date().toISOString())})
ON CONFLICT (id) DO NOTHING;\n\n`;
}

// 1. Core Metadata: Users, Activity Logs, Sessions, and Baseline Evals 1-4 (~98 KB total)
let sCore = 'BEGIN;\n\n-- 1. USERS\n';
(data.users || []).forEach(u => {
    sCore += `INSERT INTO users (id, email, name, avatar, free_credits, is_pro, free_rewrites, target_year, optional_subject, plan_tier, is_admin, password_hash, created_at)
VALUES (${escapeSqlString(u.id)}, ${escapeSqlString(u.email)}, ${escapeSqlString(u.name)}, ${escapeSqlString(u.avatar || '')}, ${u.free_credits !== undefined ? u.free_credits : 5}, ${u.is_pro || 0}, ${u.free_rewrites !== undefined ? u.free_rewrites : 2}, ${escapeSqlString(u.target_year || '2026')}, ${escapeSqlString(u.optional_subject || 'PSIR')}, ${escapeSqlString(u.plan_tier || 'starter')}, ${u.is_admin || 0}, ${escapeSqlString(u.password_hash || null)}, ${escapeSqlString(u.created_at || new Date().toISOString())})
ON CONFLICT (id) DO UPDATE SET free_credits = EXCLUDED.free_credits, is_pro = EXCLUDED.is_pro;\n\n`;
});

sCore += '-- 2. ACTIVITY LOGS\n';
(data.activity_logs || []).forEach(log => {
    sCore += `INSERT INTO activity_logs (id, user_email, user_name, action_type, title, detail, eval_id, created_at)
VALUES (${escapeSqlString(log.id)}, ${escapeSqlString(log.user_email || null)}, ${escapeSqlString(log.user_name || null)}, ${escapeSqlString(log.action_type || 'activity')}, ${escapeSqlString(log.title || '')}, ${escapeSqlString(log.detail || '')}, ${escapeSqlString(log.eval_id || null)}, ${escapeSqlString(log.created_at || new Date().toISOString())})
ON CONFLICT (id) DO NOTHING;\n\n`;
});

sCore += '-- 3. USER SESSIONS\n';
(data.user_sessions || []).forEach(item => {
    sCore += `INSERT INTO user_sessions (id, user_email, user_name, is_authenticated, started_at, last_active_at, duration_seconds, current_view, evaluations_count, actions_count, recent_actions, target_year, optional_subject)
VALUES (${escapeSqlString(item.id)}, ${escapeSqlString(item.user_email || 'Guest')}, ${escapeSqlString(item.user_name || 'Aspirant')}, ${item.is_authenticated ? 1 : 0}, ${escapeSqlString(item.started_at || new Date().toISOString())}, ${escapeSqlString(item.last_active_at || new Date().toISOString())}, ${item.duration_seconds || 0}, ${escapeSqlString(item.current_view || '')}, ${item.evaluations_count || 0}, ${item.actions_count || 1}, ${escapeSqlString(item.recent_actions || '[]')}, ${escapeSqlString(item.target_year || '2026')}, ${escapeSqlString(item.optional_subject || 'PSIR')})
ON CONFLICT (id) DO NOTHING;\n\n`;
});

sCore += '-- 4. EVALUATIONS 1 TO 4\n';
(data.evaluations || []).slice(0, 4).forEach(ev => {
    sCore += formatEvalSql(ev);
});
sCore += 'COMMIT;\n';
fs.writeFileSync(path.resolve(__dirname, '02_seed_core.sql'), sCore, 'utf8');
console.log('02_seed_core.sql size:', sCore.length, 'bytes');

// 2. Evaluation 5
let sEval5 = 'BEGIN;\n\n-- EVALUATION 5\n';
sEval5 += formatEvalSql(data.evaluations[4]);
sEval5 += 'COMMIT;\n';
fs.writeFileSync(path.resolve(__dirname, '03_seed_eval_5.sql'), sEval5, 'utf8');
console.log('03_seed_eval_5.sql size:', sEval5.length, 'bytes');

// 3. Evaluation 6
let sEval6 = 'BEGIN;\n\n-- EVALUATION 6\n';
sEval6 += formatEvalSql(data.evaluations[5]);
sEval6 += 'COMMIT;\n';
fs.writeFileSync(path.resolve(__dirname, '04_seed_eval_6.sql'), sEval6, 'utf8');
console.log('04_seed_eval_6.sql size:', sEval6.length, 'bytes');
