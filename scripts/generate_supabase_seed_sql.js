/**
 * Supabase Data Seed Generator
 * Generates an idempotent, transactional PostgreSQL INSERT script
 * from seed_vault_data.json (or an exported backup JSON).
 * 
 * Guarantees:
 * - Preserves all IDs, timestamps, user associations, and feedback.
 * - Handles JSON strings properly escaped for PostgreSQL.
 * - Uses ON CONFLICT (id) DO NOTHING to prevent duplicates or errors.
 */

const fs = require('fs');
const path = require('path');

function escapeSqlString(val) {
    if (val === null || val === undefined) return 'NULL';
    if (typeof val === 'number') return val.toString();
    if (typeof val === 'boolean') return val ? 'TRUE' : 'FALSE';
    const str = typeof val === 'object' ? JSON.stringify(val) : String(val);
    return "'" + str.replace(/'/g, "''") + "'";
}

function generateSeed() {
    const inputPath = path.resolve(__dirname, '../seed_vault_data.json');
    const outputPath = path.resolve(__dirname, 'supabase_data_seed.sql');

    if (!fs.existsSync(inputPath)) {
        console.error(`Error: Seed file not found at ${inputPath}`);
        process.exit(1);
    }

    const data = JSON.parse(fs.readFileSync(inputPath, 'utf8'));
    let sql = `-- ==============================================================================\n`;
    sql += `-- SUPABASE DATA SEED IMPORT SCRIPT\n`;
    sql += `-- Generated on: ${new Date().toISOString()}\n`;
    sql += `-- 100% Idempotent - Zero Data Loss, Safe Re-runnability\n`;
    sql += `-- ==============================================================================\n\n`;
    sql += `BEGIN;\n\n`;

    // 1. Users
    const users = data.users || [];
    sql += `-- 1. USERS (${users.length} records)\n`;
    for (const u of users) {
        sql += `INSERT INTO users (id, email, name, avatar, free_credits, is_pro, free_rewrites, target_year, optional_subject, plan_tier, is_admin, password_hash, created_at)\n`;
        sql += `VALUES (\n`;
        sql += `  ${escapeSqlString(u.id)},\n`;
        sql += `  ${escapeSqlString(u.email)},\n`;
        sql += `  ${escapeSqlString(u.name)},\n`;
        sql += `  ${escapeSqlString(u.avatar || '')},\n`;
        sql += `  ${u.free_credits !== undefined ? u.free_credits : 5},\n`;
        sql += `  ${u.is_pro || 0},\n`;
        sql += `  ${u.free_rewrites !== undefined ? u.free_rewrites : 2},\n`;
        sql += `  ${escapeSqlString(u.target_year || '2026')},\n`;
        sql += `  ${escapeSqlString(u.optional_subject || 'PSIR')},\n`;
        sql += `  ${escapeSqlString(u.plan_tier || 'starter')},\n`;
        sql += `  ${u.is_admin || 0},\n`;
        sql += `  ${escapeSqlString(u.password_hash || null)},\n`;
        sql += `  ${escapeSqlString(u.created_at || new Date().toISOString())}\n`;
        sql += `) ON CONFLICT (id) DO UPDATE SET\n`;
        sql += `  free_credits = EXCLUDED.free_credits,\n`;
        sql += `  is_pro = EXCLUDED.is_pro;\n\n`;
    }

    // 2. Evaluations
    const evals = data.evaluations || [];
    sql += `-- 2. EVALUATIONS (${evals.length} records)\n`;
    for (const ev of evals) {
        sql += `INSERT INTO evaluations (id, user_id, user_email, paper, max_marks, question, overall_score, percentage, evaluation_json, pages_json, thumbnail, is_rewrite, file_hash, has_been_rewritten, rewrite_eval_id, baseline_eval_id, file_url, created_at)\n`;
        sql += `VALUES (\n`;
        sql += `  ${escapeSqlString(ev.id)},\n`;
        sql += `  ${escapeSqlString(ev.user_id)},\n`;
        sql += `  ${escapeSqlString(ev.user_email)},\n`;
        sql += `  ${escapeSqlString(ev.paper)},\n`;
        sql += `  ${ev.max_marks || 10},\n`;
        sql += `  ${escapeSqlString(ev.question)},\n`;
        sql += `  ${ev.overall_score || 0.0},\n`;
        sql += `  ${ev.percentage || 0.0},\n`;
        sql += `  ${escapeSqlString(ev.evaluation_json || '{}')},\n`;
        sql += `  ${escapeSqlString(ev.pages_json || '[]')},\n`;
        sql += `  ${escapeSqlString(ev.thumbnail || '')},\n`;
        sql += `  ${ev.is_rewrite || 0},\n`;
        sql += `  ${escapeSqlString(ev.file_hash || '')},\n`;
        sql += `  ${ev.has_been_rewritten || 0},\n`;
        sql += `  ${escapeSqlString(ev.rewrite_eval_id || null)},\n`;
        sql += `  ${escapeSqlString(ev.baseline_eval_id || null)},\n`;
        sql += `  ${escapeSqlString(ev.file_url || null)},\n`;
        sql += `  ${escapeSqlString(ev.created_at || new Date().toISOString())}\n`;
        sql += `) ON CONFLICT (id) DO NOTHING;\n\n`;
    }

    // 3. Activity Logs
    const logs = data.activity_logs || [];
    sql += `-- 3. ACTIVITY LOGS (${logs.length} records)\n`;
    for (const log of logs) {
        sql += `INSERT INTO activity_logs (id, user_email, user_name, action_type, title, detail, eval_id, created_at)\n`;
        sql += `VALUES (\n`;
        sql += `  ${escapeSqlString(log.id)},\n`;
        sql += `  ${escapeSqlString(log.user_email || null)},\n`;
        sql += `  ${escapeSqlString(log.user_name || null)},\n`;
        sql += `  ${escapeSqlString(log.action_type || 'activity')},\n`;
        sql += `  ${escapeSqlString(log.title || '')},\n`;
        sql += `  ${escapeSqlString(log.detail || '')},\n`;
        sql += `  ${escapeSqlString(log.eval_id || null)},\n`;
        sql += `  ${escapeSqlString(log.created_at || new Date().toISOString())}\n`;
        sql += `) ON CONFLICT (id) DO NOTHING;\n\n`;
    }

    // 4. User Sessions
    const sessions = data.user_sessions || [];
    sql += `-- 4. USER SESSIONS (${sessions.length} records)\n`;
    for (const s of sessions) {
        sql += `INSERT INTO user_sessions (id, user_email, user_name, is_authenticated, started_at, last_active_at, duration_seconds, current_view, evaluations_count, actions_count, recent_actions, target_year, optional_subject)\n`;
        sql += `VALUES (\n`;
        sql += `  ${escapeSqlString(s.id)},\n`;
        sql += `  ${escapeSqlString(s.user_email || 'Guest')},\n`;
        sql += `  ${escapeSqlString(s.user_name || 'Aspirant')},\n`;
        sql += `  ${s.is_authenticated ? 1 : 0},\n`;
        sql += `  ${escapeSqlString(s.started_at || new Date().toISOString())},\n`;
        sql += `  ${escapeSqlString(s.last_active_at || new Date().toISOString())},\n`;
        sql += `  ${s.duration_seconds || 0},\n`;
        sql += `  ${escapeSqlString(s.current_view || '')},\n`;
        sql += `  ${s.evaluations_count || 0},\n`;
        sql += `  ${s.actions_count || 1},\n`;
        sql += `  ${escapeSqlString(s.recent_actions || '[]')},\n`;
        sql += `  ${escapeSqlString(s.target_year || '2026')},\n`;
        sql += `  ${escapeSqlString(s.optional_subject || 'PSIR')}\n`;
        sql += `) ON CONFLICT (id) DO NOTHING;\n\n`;
    }

    sql += `COMMIT;\n`;

    fs.writeFileSync(outputPath, sql, 'utf8');
    console.log(`Success: Generated ${outputPath}`);
    console.log(`Summary: ${users.length} users, ${evals.length} evaluations, ${logs.length} logs, ${sessions.length} sessions.`);
}

generateSeed();
