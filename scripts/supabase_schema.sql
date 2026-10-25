-- ==============================================================================
-- COOKEDMAINS PRODUCTION POSTGRESQL SCHEMA (SUPABASE 100% COMPATIBLE)
-- Upgrades existing pilot tables and creates missing tables safely.
-- Idempotent: Can be run multiple times without errors.
-- ==============================================================================

-- 1. USERS TABLE
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    avatar TEXT,
    free_credits INTEGER DEFAULT 5,
    is_pro INTEGER DEFAULT 0,
    free_rewrites INTEGER DEFAULT 2,
    target_year TEXT DEFAULT '2026',
    optional_subject TEXT DEFAULT 'PSIR',
    plan_tier TEXT DEFAULT 'starter',
    is_admin INTEGER DEFAULT 0,
    last_active TIMESTAMPTZ,
    password_hash TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE users ADD COLUMN IF NOT EXISTS free_credits INTEGER DEFAULT 5;
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_pro INTEGER DEFAULT 0;
ALTER TABLE users ADD COLUMN IF NOT EXISTS free_rewrites INTEGER DEFAULT 2;
ALTER TABLE users ADD COLUMN IF NOT EXISTS target_year TEXT DEFAULT '2026';
ALTER TABLE users ADD COLUMN IF NOT EXISTS optional_subject TEXT DEFAULT 'PSIR';
ALTER TABLE users ADD COLUMN IF NOT EXISTS plan_tier TEXT DEFAULT 'starter';
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_admin INTEGER DEFAULT 0;
ALTER TABLE users ADD COLUMN IF NOT EXISTS last_active TIMESTAMPTZ;
ALTER TABLE users ADD COLUMN IF NOT EXISTS password_hash TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP;

CREATE INDEX IF NOT EXISTS idx_users_email ON users (email);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users (created_at DESC);

-- 2. DEVICE BINDINGS
CREATE TABLE IF NOT EXISTS device_bindings (
    device_id TEXT PRIMARY KEY,
    bound_email TEXT NOT NULL,
    client_ip TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_device_bindings_email ON device_bindings (bound_email);

-- 3. EVALUATIONS TABLE
CREATE TABLE IF NOT EXISTS evaluations (
    id TEXT PRIMARY KEY,
    user_id TEXT,
    user_email TEXT,
    paper TEXT,
    max_marks INTEGER,
    question TEXT,
    overall_score NUMERIC(5,2),
    percentage NUMERIC(5,2),
    evaluation_json TEXT,
    pages_json TEXT DEFAULT '[]',
    thumbnail TEXT,
    is_rewrite INTEGER DEFAULT 0,
    file_hash TEXT,
    has_been_rewritten INTEGER DEFAULT 0,
    rewrite_eval_id TEXT,
    baseline_eval_id TEXT,
    file_url TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Upgrade existing pilot columns if table already existed
ALTER TABLE evaluations ADD COLUMN IF NOT EXISTS user_id TEXT;
ALTER TABLE evaluations ADD COLUMN IF NOT EXISTS user_email TEXT;
ALTER TABLE evaluations ADD COLUMN IF NOT EXISTS paper TEXT;
ALTER TABLE evaluations ADD COLUMN IF NOT EXISTS max_marks INTEGER;
ALTER TABLE evaluations ADD COLUMN IF NOT EXISTS question TEXT;
ALTER TABLE evaluations ADD COLUMN IF NOT EXISTS overall_score NUMERIC(5,2);
ALTER TABLE evaluations ADD COLUMN IF NOT EXISTS percentage NUMERIC(5,2);
ALTER TABLE evaluations ADD COLUMN IF NOT EXISTS evaluation_json TEXT;
ALTER TABLE evaluations ADD COLUMN IF NOT EXISTS pages_json TEXT DEFAULT '[]';
ALTER TABLE evaluations ADD COLUMN IF NOT EXISTS thumbnail TEXT;
ALTER TABLE evaluations ADD COLUMN IF NOT EXISTS is_rewrite INTEGER DEFAULT 0;
ALTER TABLE evaluations ADD COLUMN IF NOT EXISTS file_hash TEXT;
ALTER TABLE evaluations ADD COLUMN IF NOT EXISTS has_been_rewritten INTEGER DEFAULT 0;
ALTER TABLE evaluations ADD COLUMN IF NOT EXISTS rewrite_eval_id TEXT;
ALTER TABLE evaluations ADD COLUMN IF NOT EXISTS baseline_eval_id TEXT;
ALTER TABLE evaluations ADD COLUMN IF NOT EXISTS file_url TEXT;
ALTER TABLE evaluations ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP;

CREATE INDEX IF NOT EXISTS idx_evaluations_user_created ON evaluations (user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_evaluations_user_email ON evaluations (user_email);
CREATE INDEX IF NOT EXISTS idx_evaluations_file_hash ON evaluations (file_hash);

-- 4. FEEDBACK & BUG REPORTS
CREATE TABLE IF NOT EXISTS feedback (
    id TEXT PRIMARY KEY,
    user_email TEXT,
    user_name TEXT,
    category TEXT NOT NULL,
    rating INTEGER NOT NULL,
    message TEXT NOT NULL,
    screenshot_data TEXT,
    is_resolved INTEGER DEFAULT 0,
    admin_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE feedback ADD COLUMN IF NOT EXISTS screenshot_data TEXT;
ALTER TABLE feedback ADD COLUMN IF NOT EXISTS is_resolved INTEGER DEFAULT 0;
ALTER TABLE feedback ADD COLUMN IF NOT EXISTS admin_notes TEXT;

CREATE INDEX IF NOT EXISTS idx_feedback_created_at ON feedback (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_feedback_resolved ON feedback (is_resolved);

-- 5. TRANSACTIONS & UPI SUBSCRIPTIONS
CREATE TABLE IF NOT EXISTS transactions (
    id TEXT PRIMARY KEY,
    user_id TEXT,
    user_email TEXT,
    user_name TEXT,
    plan_id TEXT NOT NULL,
    plan_name TEXT NOT NULL,
    amount INTEGER NOT NULL,
    utr_number TEXT UNIQUE,
    payment_method TEXT DEFAULT 'UPI',
    screenshot_data TEXT,
    status TEXT DEFAULT 'pending',
    admin_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    approved_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions (user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_utr ON transactions (utr_number);
CREATE INDEX IF NOT EXISTS idx_transactions_status ON transactions (status);

-- 6. ADMIN SETTINGS
CREATE TABLE IF NOT EXISTS admin_settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO admin_settings (key, value)
VALUES ('admin_upi_id', '9661228832-2@ybl')
ON CONFLICT (key) DO NOTHING;

-- 7. TEST SERIES
CREATE TABLE IF NOT EXISTS test_series (
    id TEXT PRIMARY KEY,
    user_id TEXT,
    user_email TEXT,
    test_title TEXT NOT NULL,
    paper TEXT NOT NULL,
    total_marks NUMERIC(6,2) DEFAULT 0.0,
    percentage NUMERIC(5,2) DEFAULT 0.0,
    attempted_count INTEGER DEFAULT 0,
    total_questions INTEGER DEFAULT 20,
    tier_verdict TEXT DEFAULT 'Evaluating',
    projected_gs_total NUMERIC(6,2) DEFAULT 0.0,
    fatigue_metric_json TEXT DEFAULT '{}',
    radar_scores_json TEXT DEFAULT '{}',
    status TEXT DEFAULT 'processing',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_test_series_user ON test_series (user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_test_series_status ON test_series (status);

-- 8. TEST QUESTIONS
CREATE TABLE IF NOT EXISTS test_questions (
    id TEXT PRIMARY KEY,
    test_series_id TEXT NOT NULL,
    question_number INTEGER NOT NULL,
    marks_weightage INTEGER NOT NULL,
    question_text TEXT NOT NULL,
    score_awarded NUMERIC(5,2) DEFAULT 0.0,
    is_attempted INTEGER DEFAULT 1,
    evaluation_json TEXT DEFAULT '{}',
    pages_json TEXT DEFAULT '[]',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_test_questions_series ON test_questions (test_series_id, question_number);

-- 9. CURRENT AFFAIRS ARTICLES
CREATE TABLE IF NOT EXISTS current_affairs_articles (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    source TEXT NOT NULL,
    url TEXT UNIQUE NOT NULL,
    published_date TEXT,
    summary TEXT,
    category TEXT DEFAULT 'general',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_current_affairs_category ON current_affairs_articles (category);

-- 10. DAILY NEWS QUESTIONS
CREATE TABLE IF NOT EXISTS daily_news_questions (
    id TEXT PRIMARY KEY,
    date_str TEXT NOT NULL,
    paper TEXT NOT NULL,
    syllabus_topic TEXT,
    question TEXT NOT NULL,
    marks INTEGER DEFAULT 15,
    word_limit INTEGER DEFAULT 250,
    demands_json TEXT DEFAULT '[]',
    value_addition_json TEXT DEFAULT '[]',
    source_headline TEXT,
    source_url TEXT,
    source_name TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_daily_news_date ON daily_news_questions (date_str);

-- 11. ESSAY EVALUATION JOBS
CREATE TABLE IF NOT EXISTS essay_jobs (
    id TEXT PRIMARY KEY,
    user_email TEXT NOT NULL,
    question TEXT NOT NULL,
    paper TEXT DEFAULT 'Essay',
    max_marks INTEGER DEFAULT 125,
    medium TEXT DEFAULT 'english',
    total_pages INTEGER DEFAULT 0,
    page_range TEXT,
    selected_pages_json TEXT DEFAULT '[]',
    batch_size INTEGER DEFAULT 3,
    status TEXT DEFAULT 'queued',
    progress_pct INTEGER DEFAULT 0,
    progress_message TEXT DEFAULT 'Queued for essay evaluation...',
    current_batch_index INTEGER DEFAULT 0,
    checkpoints_json TEXT DEFAULT '{}',
    result_json TEXT,
    pages_json TEXT DEFAULT '[]',
    error_message TEXT,
    eval_id TEXT,
    credits_deducted INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_essay_jobs_status_created ON essay_jobs (status, created_at ASC);
CREATE INDEX IF NOT EXISTS idx_essay_jobs_user_email ON essay_jobs (user_email);

-- 12. ACTIVITY LOGS
CREATE TABLE IF NOT EXISTS activity_logs (
    id TEXT PRIMARY KEY,
    created_at TEXT DEFAULT TO_CHAR(CURRENT_TIMESTAMP, 'YYYY-MM-DD HH24:MI:SS'),
    user_email TEXT,
    user_name TEXT,
    action_type TEXT,
    title TEXT,
    detail TEXT,
    eval_id TEXT
);

CREATE INDEX IF NOT EXISTS idx_activity_logs_created ON activity_logs (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_activity_logs_user_email ON activity_logs (user_email);

-- 13. USER SESSIONS
CREATE TABLE IF NOT EXISTS user_sessions (
    id TEXT PRIMARY KEY,
    user_email TEXT NOT NULL,
    user_name TEXT,
    is_authenticated INTEGER DEFAULT 0,
    started_at TEXT NOT NULL,
    last_active_at TEXT NOT NULL,
    duration_seconds INTEGER DEFAULT 0,
    current_view TEXT,
    evaluations_count INTEGER DEFAULT 0,
    actions_count INTEGER DEFAULT 1,
    recent_actions TEXT DEFAULT '[]',
    target_year TEXT DEFAULT '2026',
    optional_subject TEXT DEFAULT 'PSIR'
);

ALTER TABLE user_sessions ADD COLUMN IF NOT EXISTS target_year TEXT DEFAULT '2026';
ALTER TABLE user_sessions ADD COLUMN IF NOT EXISTS optional_subject TEXT DEFAULT 'PSIR';

CREATE INDEX IF NOT EXISTS idx_user_sessions_email ON user_sessions (user_email);
CREATE INDEX IF NOT EXISTS idx_user_sessions_last_active ON user_sessions (last_active_at DESC);
