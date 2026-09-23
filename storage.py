import sqlite3
import os
import json
import uuid
import re
from datetime import datetime
from typing import Optional, Dict, Any, List

# Support persistent volume disks (e.g. Render /data mount) or default local directory
DATA_DIR = os.getenv("DATA_DIR", "")
if DATA_DIR and os.path.exists(DATA_DIR):
    DB_PATH = os.path.join(DATA_DIR, "evaluations.db")
else:
    DB_PATH = os.getenv("DATABASE_PATH", os.path.join(os.path.dirname(__file__), "evaluations.db"))

def get_db():
    conn = sqlite3.connect(DB_PATH, timeout=20.0)
    conn.row_factory = sqlite3.Row
    try:
        conn.execute("PRAGMA journal_mode=WAL;")
        conn.execute("PRAGMA busy_timeout=5000;")
    except Exception:
        pass
    return conn

def init_db():
    """Initializes SQLite tables for users, single evaluations, and full 20-question test series."""
    conn = get_db()
    cursor = conn.cursor()
    
    # Users table with 5 free starter credits by default
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id TEXT PRIMARY KEY,
            email TEXT UNIQUE NOT NULL,
            name TEXT NOT NULL,
            avatar TEXT,
            free_credits INTEGER DEFAULT 5,
            is_pro INTEGER DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)
    
    # Evaluated answer scripts history locker
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS evaluations (
            id TEXT PRIMARY KEY,
            user_id TEXT NOT NULL,
            user_email TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            paper TEXT NOT NULL,
            max_marks INTEGER NOT NULL,
            question TEXT NOT NULL,
            overall_score REAL NOT NULL,
            percentage REAL NOT NULL,
            evaluation_json TEXT NOT NULL,
            pages_json TEXT NOT NULL,
            thumbnail TEXT,
            is_rewrite INTEGER DEFAULT 0,
            file_hash TEXT,
            has_been_rewritten INTEGER DEFAULT 0,
            rewrite_eval_id TEXT,
            baseline_eval_id TEXT,
            FOREIGN KEY (user_id) REFERENCES users(id)
        )
    """)
    for col_def in [
        "ALTER TABLE evaluations ADD COLUMN file_hash TEXT",
        "ALTER TABLE evaluations ADD COLUMN has_been_rewritten INTEGER DEFAULT 0",
        "ALTER TABLE evaluations ADD COLUMN rewrite_eval_id TEXT",
        "ALTER TABLE evaluations ADD COLUMN baseline_eval_id TEXT",
        "ALTER TABLE users ADD COLUMN free_rewrites INTEGER DEFAULT 2",
        "ALTER TABLE users ADD COLUMN target_year TEXT DEFAULT '2026'",
        "ALTER TABLE users ADD COLUMN optional_subject TEXT DEFAULT 'PSIR'",
        "ALTER TABLE users ADD COLUMN plan_tier TEXT DEFAULT 'starter'",
        "ALTER TABLE users ADD COLUMN is_admin INTEGER DEFAULT 0",
        "ALTER TABLE users ADD COLUMN last_active TIMESTAMP"
    ]:
        try:
            cursor.execute(col_def)
        except Exception:
            pass

    # Aspirant Feedback & Bug Reports Table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS feedback (
            id TEXT PRIMARY KEY,
            user_email TEXT,
            user_name TEXT,
            category TEXT NOT NULL,
            rating INTEGER NOT NULL,
            message TEXT NOT NULL,
            screenshot_data TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)
    try:
        cursor.execute("ALTER TABLE feedback ADD COLUMN screenshot_data TEXT")
    except Exception:
        pass

    # Subscriptions & UPI Transactions Table
    cursor.execute("""
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
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            approved_at TIMESTAMP
        )
    """)

    # Admin Settings Table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS admin_settings (
            key TEXT PRIMARY KEY,
            value TEXT NOT NULL,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)
    try:
        cursor.execute("INSERT OR IGNORE INTO admin_settings (key, value) VALUES ('admin_upi_id', '9661228832-2@ybl')")
        cursor.execute("INSERT OR IGNORE INTO admin_settings (key, value) VALUES ('admin_pin', 'Admin@MainsMentor2026')")
    except Exception:
        pass
    
    # Full 20-Question UPSC Test Series table (250 Marks / 50 Pages)
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS test_series (
            id TEXT PRIMARY KEY,
            user_id TEXT NOT NULL,
            user_email TEXT NOT NULL,
            test_title TEXT NOT NULL,
            paper TEXT NOT NULL,
            total_marks REAL DEFAULT 0.0,
            percentage REAL DEFAULT 0.0,
            attempted_count INTEGER DEFAULT 0,
            total_questions INTEGER DEFAULT 20,
            tier_verdict TEXT DEFAULT 'Evaluating',
            projected_gs_total REAL DEFAULT 0.0,
            fatigue_metric_json TEXT DEFAULT '{}',
            radar_scores_json TEXT DEFAULT '{}',
            status TEXT DEFAULT 'processing',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id)
        )
    """)
    
    # Individual questions within a 20-question test series
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS test_questions (
            id TEXT PRIMARY KEY,
            test_series_id TEXT NOT NULL,
            question_number INTEGER NOT NULL,
            marks_weightage INTEGER NOT NULL,
            question_text TEXT NOT NULL,
            score_awarded REAL DEFAULT 0.0,
            is_attempted INTEGER DEFAULT 1,
            evaluation_json TEXT DEFAULT '{}',
            pages_json TEXT DEFAULT '[]',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (test_series_id) REFERENCES test_series(id)
        )
    """)
    
    # Ingested Current Affairs Articles Knowledge Base
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS current_affairs_articles (
            id TEXT PRIMARY KEY,
            title TEXT NOT NULL,
            source TEXT NOT NULL,
            url TEXT UNIQUE NOT NULL,
            published_date TEXT,
            summary TEXT,
            category TEXT DEFAULT 'general',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)
    
    # Dynamic UPSC Mains Questions generated from daily news
    cursor.execute("""
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
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)
    
    conn.commit()
    conn.close()

# Auto-initialize DB on import
init_db()

def get_or_create_user(email: str, name: Optional[str] = None, avatar: Optional[str] = None) -> Dict[str, Any]:
    """Retrieves an existing user or registers a new aspirant with 5 free evaluation credits and 2 free re-evaluations."""
    email = email.strip().lower()
    if not name:
        name = email.split("@")[0].capitalize()
    if not avatar:
        avatar = f"https://api.dicebear.com/7.x/bottts/svg?seed={email}"
        
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM users WHERE email = ?", (email,))
    row = cursor.fetchone()
    
    if row:
        user_dict = dict(row)
        if "free_rewrites" not in user_dict or user_dict["free_rewrites"] is None:
            user_dict["free_rewrites"] = 2
        if "target_year" not in user_dict or not user_dict["target_year"]:
            user_dict["target_year"] = "2026"
        if "optional_subject" not in user_dict or not user_dict["optional_subject"]:
            user_dict["optional_subject"] = "PSIR"
        conn.close()
        return user_dict
    
    # Register new aspirant with 5 free evaluations and 2 free rewrites
    user_id = str(uuid.uuid4())
    cursor.execute(
        "INSERT INTO users (id, email, name, avatar, free_credits, is_pro, free_rewrites, target_year, optional_subject) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
        (user_id, email, name, avatar, 5, 0, 2, "2026", "PSIR")
    )
    conn.commit()
    cursor.execute("SELECT * FROM users WHERE id = ?", (user_id,))
    new_row = cursor.fetchone()
    conn.close()
    return dict(new_row)

def update_user_profile(email: str, name: Optional[str] = None, target_year: Optional[str] = None, optional_subject: Optional[str] = None) -> Dict[str, Any]:
    """Updates candidate profile attributes."""
    conn = get_db()
    cursor = conn.cursor()
    user = get_or_create_user(email)
    
    updates = []
    params = []
    if name:
        updates.append("name = ?")
        params.append(name.strip())
    if target_year:
        updates.append("target_year = ?")
        params.append(target_year.strip())
    if optional_subject:
        updates.append("optional_subject = ?")
        params.append(optional_subject.strip())
        
    if updates:
        params.append(email.strip().lower())
        cursor.execute(f"UPDATE users SET {', '.join(updates)} WHERE email = ?", params)
        conn.commit()
        
    cursor.execute("SELECT * FROM users WHERE email = ?", (email.strip().lower(),))
    row = cursor.fetchone()
    conn.close()
    return dict(row) if row else user

DAILY_EVALUATION_LIMIT = 15
DAILY_REWRITE_LIMIT = 5

def get_daily_evaluations_count(email: str, is_rewrite: bool = False) -> int:
    """Returns the number of answer copies evaluated by the user today (IST midnight to midnight)."""
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT COUNT(*) FROM evaluations 
        WHERE LOWER(user_email) = ? 
          AND is_rewrite = ?
          AND strftime('%Y-%m-%d', created_at, '+330 minutes') = strftime('%Y-%m-%d', 'now', '+330 minutes')
    """, (email.strip().lower(), 1 if is_rewrite else 0))
    row = cursor.fetchone()
    count = row[0] if row else 0
    conn.close()
    return count

def get_user_daily_quota(email: str) -> Dict[str, Any]:
    """Returns today's usage and remaining allowance for an aspirant (15 copies/day, 5 rewrites/day)."""
    evals_today = get_daily_evaluations_count(email, is_rewrite=False)
    rewrites_today = get_daily_evaluations_count(email, is_rewrite=True)
    return {
        "daily_eval_limit": DAILY_EVALUATION_LIMIT,
        "daily_eval_used": evals_today,
        "daily_eval_remaining": max(0, DAILY_EVALUATION_LIMIT - evals_today),
        "daily_rewrite_limit": DAILY_REWRITE_LIMIT,
        "daily_rewrite_used": rewrites_today,
        "daily_rewrite_remaining": max(0, DAILY_REWRITE_LIMIT - rewrites_today),
        "resets_at": "Midnight IST"
    }

def use_user_rewrite(email: str) -> Dict[str, Any]:
    """
    Checks rewrite usage under the generous daily limit (5 rewrites/day).
    100% free for all aspirants.
    """
    user = get_or_create_user(email)
    quota = get_user_daily_quota(email)
    if quota["daily_rewrite_remaining"] <= 0:
        return {
            "success": False,
            "free_rewrites": 0,
            "daily_quota": quota,
            "error": "Daily re-evaluation limit reached (5 of 5 used today). Resets at midnight IST."
        }
    return {
        "success": True,
        "free_rewrites": quota["daily_rewrite_remaining"],
        "daily_quota": quota,
        "is_pro": True
    }

def save_feedback(user_email: str, user_name: str, category: str, rating: int, message: str, screenshot_data: Optional[str] = None) -> Dict[str, Any]:
    """Persists candidate bug report, review, or suggestions along with optional screenshot."""
    conn = get_db()
    cursor = conn.cursor()
    fid = str(uuid.uuid4())
    cursor.execute(
        "INSERT INTO feedback (id, user_email, user_name, category, rating, message, screenshot_data) VALUES (?, ?, ?, ?, ?, ?, ?)",
        (fid, (user_email or "").strip().lower(), (user_name or "").strip(), category, int(rating), message.strip(), screenshot_data)
    )
    conn.commit()
    conn.close()
    return {"id": fid, "status": "success"}

def get_user(email: str) -> Optional[Dict[str, Any]]:
    """Fetches user record by email."""
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM users WHERE email = ?", (email.strip().lower(),))
    row = cursor.fetchone()
    conn.close()
    return dict(row) if row else None

def use_user_credit(email: str) -> Dict[str, Any]:
    """
    Checks standard evaluation usage under the generous daily limit (15 copies/day).
    100% free for all aspirants.
    """
    user = get_or_create_user(email)
    quota = get_user_daily_quota(email)
    if quota["daily_eval_remaining"] <= 0:
        return {
            "success": False,
            "free_credits": 0,
            "daily_quota": quota,
            "error": "Daily evaluation limit reached (15 of 15 used today). Resets at midnight IST."
        }
    return {
        "success": True,
        "free_credits": quota["daily_eval_remaining"],
        "daily_quota": quota,
        "is_pro": True
    }

def add_user_credits(email: str, credits_to_add: int, set_pro: bool = False) -> Dict[str, Any]:
    """Adds evaluation credits or upgrades user to Pro plan."""
    user = get_or_create_user(email)
    conn = get_db()
    cursor = conn.cursor()
    if set_pro:
        cursor.execute("UPDATE users SET is_pro = 1 WHERE email = ?", (email.strip().lower(),))
    else:
        cursor.execute("UPDATE users SET free_credits = free_credits + ? WHERE email = ?", (credits_to_add, email.strip().lower()))
    conn.commit()
    cursor.execute("SELECT * FROM users WHERE email = ?", (email.strip().lower(),))
    updated = cursor.fetchone()
    conn.close()
    return dict(updated)

def save_evaluation_record(
    email: str,
    paper: str,
    max_marks: int,
    question: str,
    overall_score: float,
    percentage: float,
    evaluation_dict: Dict[str, Any],
    pages_list: List[str],
    thumbnail: Optional[str] = None,
    is_rewrite: bool = False,
    file_hash: Optional[str] = None,
    baseline_eval_id: Optional[str] = None
) -> str:
    """Saves an evaluated copy into the student's personal answer locker and locks baseline if rewritten."""
    user = get_or_create_user(email)
    eval_id = f"eval_{int(datetime.now().timestamp())}_{uuid.uuid4().hex[:6]}"
    
    if not thumbnail and pages_list and len(pages_list) > 0:
        thumbnail = pages_list[0]
        
    conn = get_db()
    cursor = conn.cursor()

    # If this is a re-evaluation, permanently lock the baseline evaluation so it can never be rewritten again!
    if is_rewrite and baseline_eval_id:
        cursor.execute("""
            UPDATE evaluations 
            SET has_been_rewritten = 1, rewrite_eval_id = ? 
            WHERE id = ?
        """, (eval_id, baseline_eval_id.strip()))

    cursor.execute("""
        INSERT INTO evaluations (
            id, user_id, user_email, paper, max_marks, question,
            overall_score, percentage, evaluation_json, pages_json, thumbnail, is_rewrite, file_hash,
            has_been_rewritten, rewrite_eval_id, baseline_eval_id
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        eval_id,
        user["id"],
        user["email"],
        paper,
        max_marks,
        question,
        overall_score,
        percentage,
        json.dumps(evaluation_dict),
        json.dumps(pages_list),
        thumbnail,
        1 if is_rewrite else 0,
        file_hash,
        0,
        None,
        baseline_eval_id if is_rewrite else None
    ))
    conn.commit()
    conn.close()
    return eval_id

def get_user_evaluations(email: str) -> List[Dict[str, Any]]:
    """Returns list of student's past evaluated answer copies for the side drawer."""
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT id, created_at, paper, max_marks, question, overall_score, percentage, thumbnail, is_rewrite,
               has_been_rewritten, rewrite_eval_id, baseline_eval_id
        FROM evaluations
        WHERE user_email = ?
        ORDER BY created_at DESC
    """, (email.strip().lower(),))
    rows = cursor.fetchall()
    conn.close()
    result = []
    for r in rows:
        d = dict(r)
        d["total_score"] = d["overall_score"]
        result.append(d)
    return result

def get_evaluation_by_id(eval_id: str) -> Optional[Dict[str, Any]]:
    """Fetches complete copy payload including annotations and pages."""
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM evaluations WHERE id = ?", (eval_id.strip(),))
    row = cursor.fetchone()
    conn.close()
    if not row:
        return None
    res = dict(row)
    res["total_score"] = res["overall_score"]
    res["evaluation"] = json.loads(res["evaluation_json"])
    res["evaluation_data"] = res["evaluation"]
    res["pages"] = json.loads(res["pages_json"])
    res["page_images"] = res["pages"]
    if res.get("has_been_rewritten") or res.get("rewrite_eval_id"):
        res["has_been_rewritten"] = 1
        res["evaluation"]["has_been_rewritten"] = 1
        res["evaluation"]["rewrite_eval_id"] = res.get("rewrite_eval_id")
    return res

def get_last_evaluation_for_user(email: str) -> Optional[Dict[str, Any]]:
    """Returns the most recent evaluation for the user to compare against a rewrite."""
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT * FROM evaluations 
        WHERE user_email = ? 
        ORDER BY created_at DESC LIMIT 1
    """, (email.strip().lower(),))
    row = cursor.fetchone()
    conn.close()
    if not row:
        return None
    res = dict(row)
    res["evaluation"] = json.loads(res["evaluation_json"])
    res["evaluation_data"] = res["evaluation"]
    res["pages"] = json.loads(res["pages_json"])
    res["page_images"] = res["pages"]
    if res.get("has_been_rewritten") or res.get("rewrite_eval_id"):
        res["has_been_rewritten"] = 1
        res["evaluation"]["has_been_rewritten"] = 1
    return res

def has_evaluation_been_rewritten(eval_id: Optional[str] = None) -> bool:
    """Checks if a specific baseline evaluation record has already been re-evaluated."""
    if not eval_id:
        return False
    conn = get_db()
    cursor = conn.cursor()

    # 1. Check if the evaluation itself is marked as rewritten
    cursor.execute("SELECT has_been_rewritten, rewrite_eval_id FROM evaluations WHERE id = ?", (eval_id.strip(),))
    row = cursor.fetchone()
    if row and (row[0] == 1 or row[1]):
        conn.close()
        return True

    # 2. Check if any other evaluation claims this eval_id as its baseline
    cursor.execute("SELECT id FROM evaluations WHERE baseline_eval_id = ?", (eval_id.strip(),))
    if cursor.fetchone():
        conn.close()
        return True

    conn.close()
    return False

def has_user_rewritten_question(email: str, question: Optional[str] = None, baseline_eval_id: Optional[str] = None) -> bool:
    """Checks if THIS specific user has already performed a re-evaluation for this question or baseline copy."""
    # 1. Check if the baseline copy itself has already been rewritten
    if baseline_eval_id and has_evaluation_been_rewritten(baseline_eval_id):
        return True

    if not email:
        return False
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT id, question, is_rewrite, evaluation_json
        FROM evaluations 
        WHERE user_email = ? AND is_rewrite = 1
    """, (email.strip().lower(),))
    rows = cursor.fetchall()
    conn.close()

    q_norm = "".join(c.lower() for c in (question or "") if c.isalnum())
    for r in rows:
        if baseline_eval_id:
            try:
                ev_data = json.loads(r["evaluation_json"])
                prev_ev = ev_data.get("previous_evaluation") or {}
                if prev_ev.get("id") == baseline_eval_id or prev_ev.get("eval_id") == baseline_eval_id:
                    return True
            except Exception:
                pass
        db_q_norm = "".join(c.lower() for c in (r["question"] or "") if c.isalnum())
        if q_norm and db_q_norm:
            if len(q_norm) > 20 and len(db_q_norm) > 20:
                if q_norm in db_q_norm or db_q_norm in q_norm:
                    return True
            elif q_norm == db_q_norm:
                return True
    return False

def find_evaluation_by_hash_global(file_hash: str) -> Optional[Dict[str, Any]]:
    """Checks globally across all users and sessions if this exact answer sheet hash has already been evaluated."""
    if not file_hash or not file_hash.strip():
        return None
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT * FROM evaluations 
        WHERE file_hash = ? 
        ORDER BY created_at DESC LIMIT 1
    """, (file_hash.strip(),))
    row = cursor.fetchone()
    conn.close()
    if not row:
        return None
    res = dict(row)
    try:
        res["evaluation"] = json.loads(res["evaluation_json"])
        res["pages"] = json.loads(res["pages_json"])
    except Exception:
        pass
    return res

def find_evaluation_by_hash(email: Optional[str], file_hash: str) -> Optional[Dict[str, Any]]:
    """Checks if this exact file hash has already been evaluated in this specific user's account."""
    if not file_hash or not email or not email.strip():
        return None
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT * FROM evaluations 
        WHERE user_email = ? AND file_hash = ? 
        ORDER BY created_at DESC LIMIT 1
    """, (email.strip().lower(), file_hash.strip()))
    row = cursor.fetchone()
    conn.close()
    if row:
        res = dict(row)
        try:
            res["evaluation"] = json.loads(res["evaluation_json"])
            res["pages"] = json.loads(res["pages_json"])
        except Exception:
            pass
        return res
    return None


# -------------------------------------------------------------
# FULL 20-QUESTION UPSC TEST SERIES (250M / 50-PAGE QCAB) ENGINE
# -------------------------------------------------------------

def segment_qcab_pdf(pdf_bytes: bytes) -> List[Dict[str, Any]]:
    """
    Takes a UPSC QCAB PDF (usually 50 pages for full GS 250M test)
    and segments it into 20 distinct question bundles:
      - Q1 to Q10: 2 pages each (10-markers) -> Pages 0-1, 2-3, ... 18-19
      - Q11 to Q20: 3 pages each (15-markers) -> Pages 20-22, 23-25, ... 47-49
    Returns list of dicts: [
        {"question_number": 1, "marks": 10, "pages": [b64_img1, b64_img2]}, ...
    ]
    """
    import pymupdf
    import base64
    doc = pymupdf.open(stream=pdf_bytes, filetype="pdf")
    total_pages = len(doc)
    
    # Pre-render all pages to base64 jpeg
    rendered_pages = []
    for p_idx in range(total_pages):
        page = doc[p_idx]
        pix = page.get_pixmap(dpi=150)
        img_b64 = "data:image/jpeg;base64," + base64.b64encode(pix.tobytes("jpeg")).decode("utf-8")
        rendered_pages.append(img_b64)
    doc.close()
    
    # Segment into questions
    questions = []
    curr_page = 0
    
    # Q1 to Q10: 10 Marks, 2 pages each
    for q_num in range(1, 11):
        if curr_page >= total_pages:
            break
        q_pages = rendered_pages[curr_page : curr_page + 2]
        curr_page += 2
        questions.append({
            "question_number": q_num,
            "marks": 10,
            "pages": q_pages
        })
            
    # Q11 to Q20: 15 Marks, 3 pages each
    for q_num in range(11, 21):
        if curr_page >= total_pages:
            break
        q_pages = rendered_pages[curr_page : curr_page + 3]
        curr_page += 3
        questions.append({
            "question_number": q_num,
            "marks": 15,
            "pages": q_pages
        })
        
    return questions

def create_test_series(email: str, test_title: str, paper: str = "GS2", total_questions: int = 20) -> str:
    """Initializes a new 20-question test series evaluation entry."""
    user = get_or_create_user(email)
    test_id = f"ts-{uuid.uuid4().hex[:12]}"
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO test_series (
            id, user_id, user_email, test_title, paper, total_questions, status
        ) VALUES (?, ?, ?, ?, ?, ?, 'processing')
    """, (test_id, user["id"], user["email"], test_title, paper, total_questions))
    conn.commit()
    conn.close()
    return test_id

def save_test_question(test_id: str, q_num: int, marks: int, question_text: str, score: float, is_attempted: bool, evaluation_dict: dict, pages_list: list) -> str:
    """Saves the individual evaluation of one question within a test series."""
    q_id = f"{test_id}-q{q_num}"
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("""
        INSERT OR REPLACE INTO test_questions (
            id, test_series_id, question_number, marks_weightage, question_text,
            score_awarded, is_attempted, evaluation_json, pages_json
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        q_id, test_id, q_num, marks, question_text,
        score, 1 if is_attempted else 0,
        json.dumps(evaluation_dict), json.dumps(pages_list)
    ))
    conn.commit()
    conn.close()
    return q_id

def finalize_test_series(test_id: str) -> Dict[str, Any]:
    """
    Computes overall paper score (out of 250), 450+ projected GS tier,
    fatigue curve metrics (Q1-10 avg vs Q11-20 avg), and paper radar scores.
    """
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM test_questions WHERE test_series_id = ? ORDER BY question_number ASC", (test_id,))
    rows = cursor.fetchall()
    
    total_marks = 0.0
    attempted_count = 0
    q1_10_scores = []
    q11_20_scores = []
    
    radar_intro = []
    radar_core = []
    radar_value = []
    radar_pres = []
    radar_conc = []
    
    for r in rows:
        d = dict(r)
        score = float(d["score_awarded"])
        marks = int(d["marks_weightage"])
        is_att = bool(d["is_attempted"])
        
        if is_att and score > 0:
            attempted_count += 1
            total_marks += score
            
        pct = (score / marks) * 100 if marks > 0 else 0
        if d["question_number"] <= 10:
            q1_10_scores.append(pct)
        else:
            q11_20_scores.append(pct)
            
        # Parse rubric
        try:
            ev = json.loads(d["evaluation_json"])
            rubric = ev.get("rubric_scores", {})
            if rubric:
                i_max = rubric.get("intro_max", 2.0)
                c_max = rubric.get("core_demand_max", 5.0)
                v_max = rubric.get("value_add_max", 2.0)
                p_max = rubric.get("presentation_max", 1.5)
                co_max = rubric.get("conclusion_max", 1.5)
                
                radar_intro.append((rubric.get("intro_score", 1.0) / i_max) * 10 if i_max > 0 else 5)
                radar_core.append((rubric.get("core_demand_score", 2.5) / c_max) * 10 if c_max > 0 else 5)
                radar_value.append((rubric.get("value_add_score", 1.0) / v_max) * 10 if v_max > 0 else 5)
                radar_pres.append((rubric.get("presentation_score", 0.8) / p_max) * 10 if p_max > 0 else 5)
                radar_conc.append((rubric.get("conclusion_score", 0.7) / co_max) * 10 if co_max > 0 else 5)
        except Exception:
            pass

    total_marks = round(total_marks, 1)
    percentage = round((total_marks / 250.0) * 100, 1)
    projected_gs_total = round((total_marks / 250.0) * 1000.0, 1)
    
    # 450+ Tier Verdict
    if total_marks >= 112.5:
        tier_verdict = "Topper Bracket (450+ Projected - Top 1% Ranker Grade)"
    elif total_marks >= 100.0:
        tier_verdict = "Competitive Attempt (400-450 Projected - Interview Bracket)"
    elif total_marks >= 87.5:
        tier_verdict = "Average Attempt (350-400 Projected - Needs Refinement)"
    else:
        tier_verdict = "Needs Work (<350 Projected - Focus on 20/20 Completion)"
        
    # Fatigue Analysis (Cognitive stamina drop-off)
    avg_q1_10 = round(sum(q1_10_scores) / len(q1_10_scores), 1) if q1_10_scores else 40.0
    avg_q11_20 = round(sum(q11_20_scores) / len(q11_20_scores), 1) if q11_20_scores else 38.0
    fatigue_drop = round(avg_q1_10 - avg_q11_20, 1)
    
    if fatigue_drop <= 3.0:
        stamina_rating = "Excellent Stamina (Consistent score density across 50 pages)"
    elif fatigue_drop <= 8.0:
        stamina_rating = "Moderate Fatigue Detected (Slight mark erosion in Q15-Q20)"
    else:
        stamina_rating = "High Cognitive Fatigue (Significant point & diagram drop in final 15-markers)"
        
    fatigue_metrics = {
        "q1_10_percentage_avg": avg_q1_10,
        "q11_20_percentage_avg": avg_q11_20,
        "drop_off_pct": fatigue_drop,
        "stamina_rating": stamina_rating
    }
    
    radar_scores = {
        "intro_avg": round(sum(radar_intro) / len(radar_intro), 1) if radar_intro else 6.5,
        "core_demand_avg": round(sum(radar_core) / len(radar_core), 1) if radar_core else 7.0,
        "value_add_avg": round(sum(radar_value) / len(radar_value), 1) if radar_value else 6.0,
        "presentation_avg": round(sum(radar_pres) / len(radar_pres), 1) if radar_pres else 7.2,
        "conclusion_avg": round(sum(radar_conc) / len(radar_conc), 1) if radar_conc else 6.8
    }
    
    cursor.execute("""
        UPDATE test_series SET
            total_marks = ?, percentage = ?, attempted_count = ?,
            tier_verdict = ?, projected_gs_total = ?,
            fatigue_metric_json = ?, radar_scores_json = ?,
            status = 'completed'
        WHERE id = ?
    """, (
        total_marks, percentage, attempted_count,
        tier_verdict, projected_gs_total,
        json.dumps(fatigue_metrics), json.dumps(radar_scores),
        test_id
    ))
    conn.commit()
    conn.close()
    
    return get_test_series_by_id(test_id)

def get_test_series_by_id(test_id: str) -> Optional[Dict[str, Any]]:
    """Retrieves full test series report including all 20 questions."""
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM test_series WHERE id = ?", (test_id,))
    ts_row = cursor.fetchone()
    if not ts_row:
        conn.close()
        return None
        
    ts_dict = dict(ts_row)
    ts_dict["fatigue_metrics"] = json.loads(ts_dict.get("fatigue_metric_json") or "{}")
    ts_dict["radar_scores"] = json.loads(ts_dict.get("radar_scores_json") or "{}")
    
    cursor.execute("SELECT * FROM test_questions WHERE test_series_id = ? ORDER BY question_number ASC", (test_id,))
    q_rows = cursor.fetchall()
    conn.close()
    
    questions = []
    for r in q_rows:
        qd = dict(r)
        qd["evaluation"] = json.loads(qd.get("evaluation_json") or "{}")
        qd["pages"] = json.loads(qd.get("pages_json") or "[]")
        questions.append(qd)
        
    ts_dict["questions"] = questions
    return ts_dict

def get_user_test_series(email: str) -> List[Dict[str, Any]]:
    """Returns list of student's test series submissions."""
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT id, test_title, paper, total_marks, percentage, attempted_count, total_questions, tier_verdict, projected_gs_total, status, created_at
        FROM test_series
        WHERE user_email = ?
        ORDER BY created_at DESC
    """, (email.strip().lower(),))
    rows = cursor.fetchall()
    conn.close()
    return [dict(r) for r in rows]

# ==========================================
# Current Affairs & Dynamic Daily Questions
# ==========================================

def save_current_affairs_articles(articles: List[Dict[str, Any]]) -> int:
    """Saves ingested RSS articles into the knowledge base, ignoring duplicates by URL."""
    if not articles:
        return 0
    conn = get_db()
    cursor = conn.cursor()
    inserted = 0
    for art in articles:
        art_id = art.get("id") or str(uuid.uuid4())
        title = art.get("title", "").strip()
        source = art.get("source", "News").strip()
        url = art.get("url", "").strip()
        pub_date = art.get("published_date", "")
        summary = art.get("summary", "").strip()
        category = art.get("category", "general")
        if not title or not url:
            continue
        try:
            cursor.execute("""
                INSERT OR IGNORE INTO current_affairs_articles (id, title, source, url, published_date, summary, category)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            """, (art_id, title, source, url, pub_date, summary, category))
            if cursor.rowcount > 0:
                inserted += 1
        except Exception:
            pass
    conn.commit()
    conn.close()
    return inserted

def get_recent_current_affairs(limit: int = 40) -> List[Dict[str, Any]]:
    """Retrieves the most recent current affairs articles from the local knowledge base."""
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT id, title, source, url, published_date, summary, category, created_at
        FROM current_affairs_articles
        ORDER BY created_at DESC
        LIMIT ?
    """, (limit,))
    rows = cursor.fetchall()
    conn.close()
    return [dict(r) for r in rows]

def search_current_affairs(query: str, limit: int = 6) -> List[Dict[str, Any]]:
    """
    Searches local current affairs articles matching query keywords.
    Provides fast, zero-API-cost grounded context for UPSC evaluations.
    """
    conn = get_db()
    cursor = conn.cursor()
    words = [w.strip().lower() for w in re.split(r'[\s,;:?.\(\)]+', query) if len(w.strip()) > 3]
    stopwords = {"what", "when", "where", "which", "with", "from", "that", "this", "these", "those", "have", "been", "discuss", "examine", "critically", "analyse", "elucidate", "elaborate", "marks", "words"}
    search_terms = [w for w in words if w not in stopwords][:8]

    if not search_terms:
        # Fallback to most recent articles
        return get_recent_current_affairs(limit)

    conditions = []
    params = []
    for term in search_terms:
        conditions.append("(title LIKE ? OR summary LIKE ?)")
        params.extend([f"%{term}%", f"%{term}%"])

    sql = f"""
        SELECT id, title, source, url, published_date, summary, category, created_at
        FROM current_affairs_articles
        WHERE {' OR '.join(conditions)}
        ORDER BY created_at DESC
        LIMIT ?
    """
    params.append(limit)
    try:
        cursor.execute(sql, tuple(params))
        rows = cursor.fetchall()
        conn.close()
        results = [dict(r) for r in rows]
        if results:
            return results
    except Exception:
        conn.close()

    return get_recent_current_affairs(limit)

def save_daily_news_question(q_data: Dict[str, Any]) -> str:
    """Saves an AI-generated daily UPSC question derived from live news."""
    conn = get_db()
    cursor = conn.cursor()
    q_id = q_data.get("id") or str(uuid.uuid4())
    date_str = q_data.get("date_str") or datetime.now().strftime("%Y-%m-%d")
    paper = (q_data.get("paper") or q_data.get("gs_paper") or "GS2").upper()
    if not paper.startswith("GS"):
        paper = f"GS{paper}" if paper in ["1","2","3","4"] else "GS2"
    topic = q_data.get("syllabus_topic", "Governance & Current Affairs")
    question = q_data.get("question", "").strip()
    marks = int(q_data.get("marks") or 15)
    word_limit = int(q_data.get("word_limit") or 250)
    demands_json = json.dumps(q_data.get("demands_of_question") or q_data.get("demands") or [])
    value_json = json.dumps(q_data.get("value_addition_anchors") or q_data.get("anchors") or [])
    headline = q_data.get("source_headline", "")
    url = q_data.get("source_url", "")
    source_name = q_data.get("source_name", "Live Current Affairs")

    cursor.execute("""
        INSERT INTO daily_news_questions 
        (id, date_str, paper, syllabus_topic, question, marks, word_limit, demands_json, value_addition_json, source_headline, source_url, source_name)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (q_id, date_str, paper, topic, question, marks, word_limit, demands_json, value_json, headline, url, source_name))
    conn.commit()
    conn.close()
    return q_id

def get_daily_news_questions(date_str: Optional[str] = None, paper: Optional[str] = None) -> List[Dict[str, Any]]:
    """Retrieves AI-generated daily UPSC questions for a given date or paper."""
    conn = get_db()
    cursor = conn.cursor()
    target_date = date_str or datetime.now().strftime("%Y-%m-%d")
    
    if paper and paper.strip().upper() not in ["ALL", "TODAY", ""]:
        clean_paper = paper.strip().upper()
        cursor.execute("""
            SELECT * FROM daily_news_questions
            WHERE date_str = ? AND paper = ?
            ORDER BY created_at DESC
        """, (target_date, clean_paper))
    else:
        cursor.execute("""
            SELECT * FROM daily_news_questions
            WHERE date_str = ?
            ORDER BY created_at DESC
        """, (target_date,))
    rows = cursor.fetchall()
    conn.close()
    
    questions = []
    for r in rows:
        d = dict(r)
        d["demands_of_question"] = json.loads(d.get("demands_json") or "[]")
        d["value_addition_anchors"] = json.loads(d.get("value_addition_json") or "[]")
        questions.append(d)
    return questions


# =====================================================================
# 💳 UPI TRANSACTIONS & SUBSCRIPTIONS GOVERNANCE
# =====================================================================

def create_transaction(user_id: str, user_email: str, user_name: str, plan_id: str, plan_name: str, amount: int, utr_number: str, screenshot_data: Optional[str] = None, order_id: Optional[str] = None) -> Dict[str, Any]:
    """Records a new UPI payment order with 12-digit UTR proof."""
    conn = get_db()
    cursor = conn.cursor()
    
    # Check if UTR already used (Anti-fraud duplicate check)
    clean_utr = utr_number.strip()
    cursor.execute("SELECT id FROM transactions WHERE utr_number = ?", (clean_utr,))
    existing = cursor.fetchone()
    if existing:
        conn.close()
        raise ValueError("This UPI Transaction / UTR number has already been submitted. Please check your reference number.")

    tx_id = order_id or f"ORD-2026-{uuid.uuid4().hex[:6].upper()}"
    cursor.execute("""
        INSERT INTO transactions (id, user_id, user_email, user_name, plan_id, plan_name, amount, utr_number, payment_method, screenshot_data, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'UPI', ?, 'pending')
    """, (tx_id, user_id, user_email, user_name, plan_id, plan_name, amount, clean_utr, screenshot_data))
    
    conn.commit()
    cursor.execute("SELECT * FROM transactions WHERE id = ?", (tx_id,))
    row = cursor.fetchone()
    conn.close()
    return dict(row)

def get_transaction_by_id(tx_id: str) -> Optional[Dict[str, Any]]:
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM transactions WHERE id = ?", (tx_id,))
    row = cursor.fetchone()
    conn.close()
    return dict(row) if row else None

def get_all_transactions(status: Optional[str] = None) -> List[Dict[str, Any]]:
    conn = get_db()
    cursor = conn.cursor()
    if status and status.lower() != 'all':
        cursor.execute("SELECT * FROM transactions WHERE status = ? ORDER BY created_at DESC", (status.lower(),))
    else:
        cursor.execute("SELECT * FROM transactions ORDER BY created_at DESC")
    rows = cursor.fetchall()
    conn.close()
    return [dict(r) for r in rows]

def approve_transaction(tx_id: str, admin_notes: Optional[str] = None) -> Dict[str, Any]:
    """One-click admin approval: marks order approved and instantly upgrades the aspirant's balance."""
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM transactions WHERE id = ?", (tx_id,))
    row = cursor.fetchone()
    if not row:
        conn.close()
        raise ValueError("Transaction not found")
    
    tx = dict(row)
    if tx["status"] == "approved":
        conn.close()
        return tx

    cursor.execute("""
        UPDATE transactions 
        SET status = 'approved', approved_at = CURRENT_TIMESTAMP, admin_notes = ? 
        WHERE id = ?
    """, (admin_notes or "Verified via SBI UPI receipt", tx_id))

    # Credit the user based on plan
    plan_id = tx["plan_id"].lower()
    email = tx["user_email"]
    
    if "sachet" in plan_id:
        cursor.execute("UPDATE users SET free_credits = free_credits + 3, plan_tier = 'sachet' WHERE email = ?", (email,))
    elif "revision" in plan_id:
        cursor.execute("UPDATE users SET free_credits = free_credits + 10, free_rewrites = free_rewrites + 5, plan_tier = 'revision' WHERE email = ?", (email,))
    elif "pro" in plan_id:
        cursor.execute("UPDATE users SET is_pro = 1, free_credits = free_credits + 100, free_rewrites = free_rewrites + 100, plan_tier = 'pro' WHERE email = ?", (email,))
    else:
        cursor.execute("UPDATE users SET free_credits = free_credits + 5 WHERE email = ?", (email,))

    conn.commit()
    cursor.execute("SELECT * FROM transactions WHERE id = ?", (tx_id,))
    updated = cursor.fetchone()
    conn.close()
    return dict(updated)

def reject_transaction(tx_id: str, admin_notes: Optional[str] = None) -> Dict[str, Any]:
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("""
        UPDATE transactions 
        SET status = 'rejected', admin_notes = ? 
        WHERE id = ?
    """, (admin_notes or "Payment not verified / UTR mismatch", tx_id))
    conn.commit()
    cursor.execute("SELECT * FROM transactions WHERE id = ?", (tx_id,))
    row = cursor.fetchone()
    conn.close()
    return dict(row)

# =====================================================================
# 🛡️ ADMIN DASHBOARD AGGREGATIONS & MANAGEMENT
# =====================================================================

def get_admin_dashboard_stats() -> Dict[str, Any]:
    conn = get_db()
    cursor = conn.cursor()
    
    cursor.execute("SELECT COUNT(*) as c FROM users")
    total_aspirants = cursor.fetchone()["c"]
    
    cursor.execute("SELECT COUNT(*) as c FROM evaluations")
    total_evals = cursor.fetchone()["c"]
    
    cursor.execute("SELECT COUNT(*) as c FROM transactions WHERE status = 'pending'")
    pending_orders = cursor.fetchone()["c"]
    
    cursor.execute("SELECT COALESCE(SUM(amount), 0) as s FROM transactions WHERE status = 'approved'")
    total_revenue = cursor.fetchone()["s"]

    cursor.execute("SELECT COUNT(*) as c, COALESCE(AVG(rating), 5.0) as a FROM feedback")
    fb = cursor.fetchone()
    total_feedbacks = fb["c"]
    avg_rating = round(fb["a"], 1)

    conn.close()
    return {
        "total_aspirants": total_aspirants,
        "total_evaluations": total_evals,
        "pending_orders": pending_orders,
        "total_revenue": total_revenue,
        "total_feedbacks": total_feedbacks,
        "average_rating": avg_rating
    }

def get_all_aspirants_admin(search: Optional[str] = None) -> List[Dict[str, Any]]:
    conn = get_db()
    cursor = conn.cursor()
    
    query = """
        SELECT u.*, COUNT(e.id) as evaluations_count 
        FROM users u 
        LEFT JOIN evaluations e ON u.email = e.user_email
    """
    params = []
    if search and search.strip():
        term = f"%{search.strip().lower()}%"
        query += " WHERE LOWER(u.name) LIKE ? OR LOWER(u.email) LIKE ? OR LOWER(u.id) LIKE ?"
        params.extend([term, term, term])
        
    query += " GROUP BY u.id ORDER BY u.created_at DESC"
    cursor.execute(query, params)
    rows = cursor.fetchall()
    conn.close()
    return [dict(r) for r in rows]

def update_user_credits_admin(email: str, delta_credits: int, delta_rewrites: int = 0, is_pro: Optional[int] = None, plan_tier: Optional[str] = None) -> Dict[str, Any]:
    conn = get_db()
    cursor = conn.cursor()
    
    updates = ["free_credits = MAX(0, free_credits + ?)", "free_rewrites = MAX(0, free_rewrites + ?)"]
    params = [delta_credits, delta_rewrites]
    
    if is_pro is not None:
        updates.append("is_pro = ?")
        params.append(1 if is_pro else 0)
    if plan_tier:
        updates.append("plan_tier = ?")
        params.append(plan_tier)
        
    params.append(email.strip().lower())
    sql = f"UPDATE users SET {', '.join(updates)} WHERE email = ?"
    cursor.execute(sql, params)
    conn.commit()
    
    cursor.execute("SELECT * FROM users WHERE email = ?", (email.strip().lower(),))
    user = cursor.fetchone()
    conn.close()
    return dict(user) if user else {}

def get_all_feedbacks_admin() -> List[Dict[str, Any]]:
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM feedback ORDER BY created_at DESC")
    rows = cursor.fetchall()
    conn.close()
    return [dict(r) for r in rows]

def get_admin_setting(key: str, default: str = "") -> str:
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT value FROM admin_settings WHERE key = ?", (key,))
    row = cursor.fetchone()
    conn.close()
    return row["value"] if row else default

def set_admin_setting(key: str, value: str) -> None:
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO admin_settings (key, value, updated_at) VALUES (?, ?, CURRENT_TIMESTAMP)
        ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = CURRENT_TIMESTAMP
    """, (key, value))
    conn.commit()
    conn.close()


