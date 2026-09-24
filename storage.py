import sqlite3
import os
import json
import uuid
import re
from datetime import datetime
import tempfile
from typing import Optional, Dict, Any, List

# Supabase Client Initialization
from supabase import create_client, Client

SUPABASE_URL = os.environ.get("SUPABASE_URL", "")
SUPABASE_KEY = os.environ.get("SUPABASE_KEY", "") or os.environ.get("SUPABASE_SERVICE_ROLE_KEY", "")

supabase: Optional[Client] = None
if SUPABASE_URL and SUPABASE_KEY:
    try:
        supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
    except Exception as _supa_err:
        print(f"Notice: Supabase client initialization error: {_supa_err}")

# Safe database path resolver (supports Render /data mount, local repo dir, or /tmp fallback)
def _resolve_db_path() -> str:
    env_db = os.getenv("DATABASE_PATH", "").strip()
    if env_db:
        try:
            parent = os.path.dirname(os.path.abspath(env_db))
            if parent:
                os.makedirs(parent, exist_ok=True)
            return env_db
        except Exception:
            pass

    data_dir = os.getenv("DATA_DIR", "").strip()
    if data_dir:
        try:
            os.makedirs(data_dir, exist_ok=True)
            test_file = os.path.join(data_dir, ".perm_test")
            with open(test_file, "w") as f:
                f.write("1")
            os.remove(test_file)
            return os.path.join(data_dir, "evaluations.db")
        except Exception:
            pass

    try:
        local_dir = os.path.dirname(os.path.abspath(__file__))
        test_file = os.path.join(local_dir, ".perm_test")
        with open(test_file, "w") as f:
            f.write("1")
        os.remove(test_file)
        return os.path.join(local_dir, "evaluations.db")
    except Exception:
        pass

    return os.path.join(tempfile.gettempdir(), "evaluations.db")

DB_PATH = _resolve_db_path()

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
    try:
        _init_db_tables()
    except Exception as _db_err:
        print(f"Notice: init_db safe notice: {_db_err}")

def _init_db_tables():
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

    # Device-to-Account Single Identity Binding table (prevents creating multiple random accounts on same device/IP)
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS device_bindings (
            device_id TEXT PRIMARY KEY,
            bound_email TEXT NOT NULL,
            client_ip TEXT,
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
        "ALTER TABLE evaluations ADD COLUMN file_url TEXT",
        "ALTER TABLE users ADD COLUMN free_rewrites INTEGER DEFAULT 2",
        "ALTER TABLE users ADD COLUMN target_year TEXT DEFAULT '2026'",
        "ALTER TABLE users ADD COLUMN optional_subject TEXT DEFAULT 'PSIR'",
        "ALTER TABLE users ADD COLUMN plan_tier TEXT DEFAULT 'starter'",
        "ALTER TABLE users ADD COLUMN is_admin INTEGER DEFAULT 0",
        "ALTER TABLE users ADD COLUMN last_active TIMESTAMP",
        "ALTER TABLE users ADD COLUMN password_hash TEXT"
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
try:
    init_db()
except Exception as _e:
    print(f"Notice: DB startup init notice: {_e}")

import hashlib
import hmac
import re

DISPOSABLE_EMAIL_DOMAINS = {
    "yopmail.com", "mailinator.com", "tempmail.com", "temp-mail.org", "10minutemail.com",
    "guerrillamail.com", "sharklasers.com", "trashmail.com", "maildrop.cc", "getnada.com",
    "dispostable.com", "mohmal.com", "emailondeck.com", "fakeinbox.com", "mintemail.com",
    "throwawaymail.com", "mailnesia.com", "tempmailaddress.com", "burnermail.io", "inboxbear.com",
    "mytemp.email", "spamgourmet.com", "harakirimail.com", "jetable.org", "mailcatch.com",
    "example.com", "test.com", "fake.com", "invalid.com", "localhost"
}

TRUSTED_EMAIL_DOMAINS = {
    "gmail.com", "googlemail.com", "outlook.com", "yahoo.com", "yahoo.co.in", "yahoo.in",
    "icloud.com", "hotmail.com", "live.com", "proton.me", "protonmail.com", "zoho.com",
    "zohomail.in", "rediffmail.com", "aol.com", "msn.com", "gmx.com", "mail.com", "me.com"
}

TRUSTED_DOMAIN_SUFFIXES = (
    ".ac.in", ".edu.in", ".gov.in", ".nic.in", ".org.in", ".res.in", ".edu", ".in", ".org"
)

def canonicalize_email(email: str) -> str:
    """
    Normalizes email addresses so Gmail dot-variants (r.a.h.u.l@gmail.com) and +alias tricks
    (rahul+1@gmail.com, rahul+2@gmail.com) always resolve to ONE single canonical email account.
    """
    raw = (email or "").strip().lower()
    if "@" not in raw:
        return raw
    local, domain = raw.split("@", 1)
    # Strip any +alias tag (e.g. user+2@gmail.com -> user@gmail.com)
    if "+" in local:
        local = local.split("+", 1)[0]
    if domain == "googlemail.com":
        domain = "gmail.com"
    if domain == "gmail.com":
        local = local.replace(".", "")
    return f"{local}@{domain}"

def validate_genuine_email(email: str) -> Optional[str]:
    """
    Validates that an email is a genuine personal/academic email or Google account,
    blocking random generated IDs, disposable domains, and gibberish addresses.
    Returns None if valid, or an error string if rejected.
    """
    raw = (email or "").strip().lower()
    if not raw or "@" not in raw:
        return "Please enter a valid email address."
    if not re.match(r"^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$", raw):
        return "Invalid email format. Please enter your genuine email or Google account."

    canonical = canonicalize_email(raw)
    local, domain = canonical.split("@", 1)

    # Block synthetic / guest / random prefixes
    blocked_prefixes = ("cadet.upsc", "guest@", "demo@", "test@", "fake@", "temp@", "random@", "admin@")
    if any(raw.startswith(p) or canonical.startswith(p) for p in blocked_prefixes):
        return "Auto-generated or guest IDs are disabled. Please sign in with your genuine Google or Email account."

    if domain in DISPOSABLE_EMAIL_DOMAINS:
        return f"Disposable or temporary email provider (@{domain}) is not allowed. Please use your real Google or personal email."

    if not (domain in TRUSTED_EMAIL_DOMAINS or domain.endswith(TRUSTED_DOMAIN_SUFFIXES)):
        return "Please use an official Google (@gmail.com), Outlook, Yahoo, iCloud, Proton, or institutional (.ac.in / .edu) email address."

    if len(local) < 3:
        return "Email username is too short. Please enter your genuine email address."

    # Must contain at least 2 alphabetic letters (blocks pure numbers like 123456@gmail.com)
    alpha_count = sum(1 for c in local if c.isalpha())
    if alpha_count < 2:
        return "Please enter a genuine email address (numeric-only IDs are not permitted)."

    return None

def get_deterministic_user_id(email: str) -> str:
    """Generates a deterministic UUIDv5 for the canonicalized email so dot/+ aliases map to the exact same ID."""
    clean = canonicalize_email(email or "guest@upsc.gov.in")
    return str(uuid.uuid5(uuid.NAMESPACE_DNS, f"cookedmains.user.{clean}"))

def hash_user_password(email: str, password: str) -> str:
    """Cryptographically hashes a user password using PBKDF2-HMAC-SHA256 (100,000 iterations)."""
    clean_email = canonicalize_email(email or "")
    salt = f"cookedmains.salt.v1.{clean_email}".encode("utf-8")
    return hashlib.pbkdf2_hmac("sha256", (password or "").strip().encode("utf-8"), salt, 100000).hex()

def _get_supabase_account_profile(user_id: str) -> Optional[Dict[str, Any]]:
    """Fetches persistent account profile & password_hash from Supabase across server redeploys."""
    if not supabase or not user_id:
        return None
    try:
        res = supabase.table("evaluations").select("id,evaluation_json").eq("user_id", user_id).eq("question_title", "__USER_ACCOUNT_PROFILE__").order("created_at", desc=True).limit(1).execute()
        if res and res.data and len(res.data) > 0:
            row = res.data[0]
            ev = row.get("evaluation_json") or {}
            if isinstance(ev, str):
                try:
                    ev = json.loads(ev)
                except Exception:
                    ev = {}
            ev["_supa_profile_row_id"] = row.get("id")
            return ev
    except Exception:
        pass
    return None

def _find_supabase_account_by_device_id(device_id: str) -> Optional[str]:
    """Checks if a device_id is already bound to an existing account in Supabase or SQLite."""
    clean_dev = (device_id or "").strip()
    if not clean_dev or len(clean_dev) < 8:
        return None
    conn = get_db()
    cursor = conn.cursor()
    try:
        cursor.execute("SELECT bound_email FROM device_bindings WHERE device_id = ?", (clean_dev,))
        row = cursor.fetchone()
        if row and row[0]:
            conn.close()
            return canonicalize_email(row[0])
    except Exception:
        pass
    conn.close()

    if supabase:
        try:
            res = supabase.table("evaluations").select("evaluation_json").eq("question_title", "__USER_ACCOUNT_PROFILE__").order("created_at", desc=True).limit(250).execute()
            if res and res.data:
                for r in res.data:
                    ev = r.get("evaluation_json") or {}
                    if isinstance(ev, str):
                        try:
                            ev = json.loads(ev)
                        except Exception:
                            ev = {}
                    if ev.get("_meta_device_id") == clean_dev and ev.get("email"):
                        return canonicalize_email(ev["email"])
        except Exception:
            pass
    return None

def bind_device_to_account(device_id: Optional[str], email: str, client_ip: Optional[str] = None) -> None:
    """Records a permanent 1-to-1 binding between a browser/device ID and the aspirant's canonical email."""
    clean_dev = (device_id or "").strip()
    clean_email = canonicalize_email(email)
    if not clean_dev or len(clean_dev) < 8 or not clean_email:
        return
    conn = get_db()
    cursor = conn.cursor()
    try:
        cursor.execute(
            "INSERT OR IGNORE INTO device_bindings (device_id, bound_email, client_ip) VALUES (?, ?, ?)",
            (clean_dev, clean_email, (client_ip or "").strip())
        )
        conn.commit()
    except Exception:
        pass
    conn.close()

def _save_supabase_account_profile(user_dict: Dict[str, Any], device_id: Optional[str] = None) -> None:
    """Persists user profile, encrypted password_hash, and bound device_id inside Supabase."""
    if not supabase or not user_dict or not user_dict.get("id"):
        return
    try:
        uid = user_dict["id"]
        existing = _get_supabase_account_profile(uid)
        saved_device_id = (device_id or "").strip() or (existing.get("_meta_device_id") if existing else "") or ""
        profile_payload = {
            "_is_account_profile": True,
            "id": uid,
            "email": canonicalize_email(user_dict.get("email") or ""),
            "name": user_dict.get("name") or "Aspirant",
            "avatar": user_dict.get("avatar") or "",
            "password_hash": user_dict.get("password_hash") or "",
            "target_year": user_dict.get("target_year") or "2026",
            "optional_subject": user_dict.get("optional_subject") or "PSIR",
            "_meta_device_id": saved_device_id
        }
        if existing and existing.get("_supa_profile_row_id"):
            supabase.table("evaluations").update({
                "evaluation_json": profile_payload
            }).eq("id", existing["_supa_profile_row_id"]).execute()
        else:
            supabase.table("evaluations").insert({
                "user_id": uid,
                "question_title": "__USER_ACCOUNT_PROFILE__",
                "file_url": "",
                "total_marks": 0,
                "evaluation_json": profile_payload
            }).execute()
    except Exception as e:
        print(f"Notice: Supabase account profile sync notice: {e}")

def get_or_create_user(email: str, name: Optional[str] = None, avatar: Optional[str] = None) -> Dict[str, Any]:
    """Retrieves an existing user or registers a new aspirant with canonical email, deterministic UUID, and Supabase sync."""
    email = canonicalize_email(email or "guest@upsc.gov.in")
    det_id = get_deterministic_user_id(email)
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
        if user_dict.get("id") != det_id:
            try:
                cursor.execute("UPDATE users SET id = ? WHERE email = ?", (det_id, email))
                conn.commit()
                user_dict["id"] = det_id
            except Exception:
                pass
        if not user_dict.get("password_hash"):
            supa_prof = _get_supabase_account_profile(det_id)
            if supa_prof and supa_prof.get("password_hash"):
                user_dict["password_hash"] = supa_prof["password_hash"]
                user_dict["name"] = supa_prof.get("name") or user_dict.get("name") or name
                user_dict["target_year"] = supa_prof.get("target_year") or user_dict.get("target_year") or "2026"
                user_dict["optional_subject"] = supa_prof.get("optional_subject") or user_dict.get("optional_subject") or "PSIR"
                try:
                    cursor.execute(
                        "UPDATE users SET password_hash = ?, name = ?, target_year = ?, optional_subject = ? WHERE email = ?",
                        (user_dict["password_hash"], user_dict["name"], user_dict["target_year"], user_dict["optional_subject"], email)
                    )
                    conn.commit()
                except Exception:
                    pass
        if "free_rewrites" not in user_dict or user_dict["free_rewrites"] is None:
            user_dict["free_rewrites"] = 5
        if "target_year" not in user_dict or not user_dict["target_year"]:
            user_dict["target_year"] = "2026"
        if "optional_subject" not in user_dict or not user_dict["optional_subject"]:
            user_dict["optional_subject"] = "PSIR"
        conn.close()
        return user_dict
    
    # Check if account already exists in Supabase (e.g. after a Render container redeploy)
    supa_prof = _get_supabase_account_profile(det_id)
    pw_hash = None
    t_year = "2026"
    opt_subj = "PSIR"
    if supa_prof:
        name = supa_prof.get("name") or name
        avatar = supa_prof.get("avatar") or avatar
        pw_hash = supa_prof.get("password_hash") or None
        t_year = supa_prof.get("target_year") or "2026"
        opt_subj = supa_prof.get("optional_subject") or "PSIR"

    # Register aspirant with deterministic ID
    user_id = det_id
    cursor.execute(
        "INSERT OR REPLACE INTO users (id, email, name, avatar, free_credits, is_pro, free_rewrites, target_year, optional_subject, password_hash) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        (user_id, email, name, avatar, 15, 1, 5, t_year, opt_subj, pw_hash)
    )
    conn.commit()
    cursor.execute("SELECT * FROM users WHERE id = ?", (user_id,))
    new_row = cursor.fetchone()
    conn.close()

    res_user = dict(new_row) if new_row else {
        "id": user_id,
        "email": email,
        "name": name,
        "avatar": avatar,
        "free_credits": 15,
        "is_pro": 1,
        "free_rewrites": 5,
        "target_year": t_year,
        "optional_subject": opt_subj,
        "password_hash": pw_hash
    }
    if not supa_prof:
        _save_supabase_account_profile(res_user)
    return res_user

def authenticate_or_register_user(
    email: str,
    password: Optional[str] = None,
    name: Optional[str] = None,
    avatar: Optional[str] = None,
    provider: Optional[str] = None,
    device_id: Optional[str] = None,
    client_ip: Optional[str] = None
) -> Dict[str, Any]:
    """
    Enforces strict Single-Account-Per-Aspirant registration and PBKDF2-HMAC-SHA256 password verification:
    1. Rejects disposable, synthetic, numeric, or non-standard email domains.
    2. Canonicalizes Gmail dots (.) and +aliases so 1 inbox = 1 single account.
    3. Locks each browser/device (device_id) to a single primary account so users cannot create multiple random IDs.
    4. Requires password verification for all accounts.
    """
    email_err = validate_genuine_email(email)
    if email_err:
        return {"success": False, "error": email_err}

    clean_email = canonicalize_email(email)
    det_id = get_deterministic_user_id(clean_email)

    # Check if this account already exists in SQLite or Supabase
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT password_hash FROM users WHERE email = ?", (clean_email,))
    existing_local = cursor.fetchone()
    conn.close()
    supa_prof = _get_supabase_account_profile(det_id)
    account_already_exists = bool((existing_local and existing_local[0]) or (supa_prof and supa_prof.get("password_hash")))

    # If this is a brand-new account registration, verify that this device isn't already bound to another email!
    if not account_already_exists and device_id:
        bound_email = _find_supabase_account_by_device_id(device_id)
        if bound_email and bound_email != clean_email:
            return {
                "success": False,
                "error": f"Single-Account Policy: This device is already registered to '{bound_email}'. Creating multiple IDs is restricted to protect database load. Please sign in with '{bound_email}'."
            }

    user = get_or_create_user(clean_email, name, avatar)
    stored_hash = (user.get("password_hash") or "").strip()
    clean_pw = (password or "").strip()

    # If account already has a password hash, always require password verification
    if stored_hash:
        if not clean_pw:
            return {
                "success": False,
                "error": "This account is password-protected. Please enter your password below to sign in."
            }
        candidate_hash = hash_user_password(clean_email, clean_pw)
        if not hmac.compare_digest(stored_hash, candidate_hash):
            return {
                "success": False,
                "error": "Incorrect password for this email account. Please enter the password you registered with."
            }
        # Update name if provided
        if name and name.strip() and user.get("name") != name.strip():
            user = update_user_profile(clean_email, name=name.strip())
        if device_id:
            bind_device_to_account(device_id, clean_email, client_ip)
        return {"success": True, "user": user}

    # New account registration MUST provide a password (min 4 chars)
    if not clean_pw or len(clean_pw) < 4:
        return {
            "success": False,
            "error": "Please set a password (minimum 4 characters) to register and lock your permanent account."
        }

    new_hash = hash_user_password(clean_email, clean_pw)
    conn = get_db()
    cursor = conn.cursor()
    if name and name.strip():
        cursor.execute("UPDATE users SET password_hash = ?, name = ? WHERE email = ?", (new_hash, name.strip(), clean_email))
        user["name"] = name.strip()
    else:
        cursor.execute("UPDATE users SET password_hash = ? WHERE email = ?", (new_hash, clean_email))
    conn.commit()
    conn.close()
    user["password_hash"] = new_hash
    if device_id:
        bind_device_to_account(device_id, clean_email, client_ip)
    _save_supabase_account_profile(user, device_id=device_id)

    return {"success": True, "user": user}

def update_user_profile(email: str, name: Optional[str] = None, target_year: Optional[str] = None, optional_subject: Optional[str] = None) -> Dict[str, Any]:
    """Updates candidate profile attributes locally and in Supabase."""
    conn = get_db()
    cursor = conn.cursor()
    user = get_or_create_user(email)
    
    updates = []
    params = []
    if name:
        updates.append("name = ?")
        params.append(name.strip())
        user["name"] = name.strip()
    if target_year:
        updates.append("target_year = ?")
        params.append(target_year.strip())
        user["target_year"] = target_year.strip()
    if optional_subject:
        updates.append("optional_subject = ?")
        params.append(optional_subject.strip())
        user["optional_subject"] = optional_subject.strip()
        
    if updates:
        params.append(email.strip().lower())
        cursor.execute(f"UPDATE users SET {', '.join(updates)} WHERE email = ?", params)
        conn.commit()
        _save_supabase_account_profile(user)
        
    cursor.execute("SELECT * FROM users WHERE email = ?", (email.strip().lower(),))
    row = cursor.fetchone()
    conn.close()
    return dict(row) if row else user

DAILY_EVALUATION_LIMIT = 15
DAILY_REWRITE_LIMIT = 5

def get_daily_evaluations_count(email: str, is_rewrite: bool = False) -> int:
    """Returns the number of answer copies evaluated by the user today (IST midnight to midnight) across SQLite & Supabase."""
    clean_email = (email or "").strip().lower()
    target_rewrite = 1 if is_rewrite else 0

    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT COUNT(*) FROM evaluations 
        WHERE LOWER(user_email) = ? 
          AND is_rewrite = ?
          AND question != '__USER_ACCOUNT_PROFILE__'
          AND strftime('%Y-%m-%d', created_at, '+330 minutes') = strftime('%Y-%m-%d', 'now', '+330 minutes')
    """, (clean_email, target_rewrite))
    row = cursor.fetchone()
    sqlite_count = row[0] if row else 0
    conn.close()

    supa_count = 0
    if supabase and clean_email:
        try:
            from datetime import timezone, timedelta
            ist_tz = timezone(timedelta(hours=5, minutes=30))
            now_ist = datetime.now(ist_tz)
            today_str = now_ist.strftime("%Y-%m-%d")
            det_id = get_deterministic_user_id(clean_email)
            res = supabase.table("evaluations").select("question_title,created_at,evaluation_json").eq("user_id", det_id).order("created_at", desc=True).limit(40).execute()
            if res and res.data:
                for item in res.data:
                    if item.get("question_title") == "__USER_ACCOUNT_PROFILE__":
                        continue
                    c_at = item.get("created_at") or ""
                    ev_j = item.get("evaluation_json") or {}
                    if isinstance(ev_j, str):
                        try:
                            ev_j = json.loads(ev_j)
                        except Exception:
                            ev_j = {}
                    if ev_j.get("_is_account_profile"):
                        continue
                    item_rw = int(ev_j.get("_meta_is_rewrite") or 0)
                    if item_rw == target_rewrite and c_at:
                        try:
                            dt_utc = datetime.fromisoformat(c_at.replace("Z", "+00:00"))
                            dt_ist = dt_utc.astimezone(ist_tz)
                            if dt_ist.strftime("%Y-%m-%d") == today_str:
                                supa_count += 1
                        except Exception:
                            pass
        except Exception:
            pass

    return max(sqlite_count, supa_count)

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
    """Fetches user record by email (auto-reconstructs deterministic user if local DB was reset)."""
    if not email or not email.strip():
        return None
    return get_or_create_user(email.strip().lower())

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

def upload_file_to_supabase(user_id: str, file_bytes: bytes, file_ext: str = ".pdf", content_type: str = "application/pdf") -> Optional[str]:
    """Uploads student PDF/image to Supabase storage bucket 'answer-sheets' and returns public URL."""
    if not supabase:
        return None
    try:
        clean_ext = file_ext if file_ext.startswith(".") else f".{file_ext}"
        storage_path = f"{user_id}/{uuid.uuid4()}{clean_ext}"
        supabase.storage.from_("answer-sheets").upload(
            file=file_bytes,
            path=storage_path,
            file_options={"content-type": content_type}
        )
        public_url = supabase.storage.from_("answer-sheets").get_public_url(storage_path)
        return public_url
    except Exception as e:
        print(f"Supabase storage upload error: {e}")
        return None

def insert_supabase_evaluation(user_id: str, question_title: str, file_url: Optional[str], total_marks: int, result_json: Dict[str, Any]) -> Optional[Dict[str, Any]]:
    """Inserts evaluation record into Supabase 'evaluations' table."""
    if not supabase:
        return None
    try:
        payload = {
            "user_id": user_id,
            "question_title": question_title,
            "file_url": file_url or "",
            "total_marks": total_marks,
            "evaluation_json": result_json
        }
        res = supabase.table("evaluations").insert(payload).execute()
        if res and res.data and len(res.data) > 0:
            return res.data[0]
        return None
    except Exception as e:
        print(f"Supabase evaluations insert error: {e}")
        return None

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
    baseline_eval_id: Optional[str] = None,
    file_url: Optional[str] = None
) -> str:
    """Saves an evaluated copy into the student's personal answer locker (both Supabase & SQLite)."""
    user = get_or_create_user(email)
    eval_id = f"eval_{int(datetime.now().timestamp())}_{uuid.uuid4().hex[:6]}"
    
    if not thumbnail and pages_list and len(pages_list) > 0:
        thumbnail = pages_list[0]
    elif not thumbnail and file_url:
        thumbnail = file_url

    enriched_dict = dict(evaluation_dict)
    enriched_dict["_meta_eval_id"] = eval_id
    enriched_dict["_meta_user_email"] = (email or "").strip().lower()
    enriched_dict["_meta_paper"] = paper
    enriched_dict["_meta_max_marks"] = max_marks
    enriched_dict["_meta_is_rewrite"] = 1 if is_rewrite else 0
    enriched_dict["_meta_baseline_eval_id"] = baseline_eval_id
    enriched_dict["_meta_file_hash"] = file_hash
    enriched_dict["_meta_thumbnail"] = thumbnail or ""
    enriched_dict["_meta_pages"] = pages_list if pages_list else ([file_url] if file_url else [])
        
    # 1. Supabase Persistent Database Insert
    if supabase and user and user.get("id"):
        try:
            supa_row = insert_supabase_evaluation(
                user_id=user["id"],
                question_title=question,
                file_url=file_url,
                total_marks=max_marks,
                result_json=enriched_dict
            )
            if supa_row and supa_row.get("id"):
                eval_id = str(supa_row["id"])
                enriched_dict["_meta_eval_id"] = eval_id
        except Exception as se:
            print(f"Notice: Supabase save skipped: {se}")
        
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
        INSERT OR REPLACE INTO evaluations (
            id, user_id, user_email, paper, max_marks, question,
            overall_score, percentage, evaluation_json, pages_json, thumbnail, is_rewrite, file_hash,
            has_been_rewritten, rewrite_eval_id, baseline_eval_id, file_url
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        eval_id,
        user["id"],
        user["email"],
        paper,
        max_marks,
        question,
        overall_score,
        percentage,
        json.dumps(enriched_dict),
        json.dumps(pages_list),
        thumbnail,
        1 if is_rewrite else 0,
        file_hash,
        0,
        None,
        baseline_eval_id if is_rewrite else None,
        file_url
    ))
    conn.commit()
    conn.close()
    return eval_id

def _format_supabase_eval_row(row: Dict[str, Any]) -> Dict[str, Any]:
    """Converts a raw Supabase evaluations row into the exact frontend Locker & Viewer schema."""
    eval_data = row.get("evaluation_json") or {}
    if isinstance(eval_data, str):
        try:
            eval_data = json.loads(eval_data)
        except Exception:
            eval_data = {}
    score = float(eval_data.get("overall_score") or 0.0)
    total_m = int(row.get("total_marks") or eval_data.get("_meta_max_marks") or eval_data.get("max_marks") or 10)
    pct = round((score / total_m) * 100, 1) if total_m > 0 else 0.0
    f_url = row.get("file_url") or ""
    meta_pages = eval_data.get("_meta_pages")
    pages = meta_pages if (isinstance(meta_pages, list) and len(meta_pages) > 0) else ([f_url] if f_url else [])
    thumb = eval_data.get("_meta_thumbnail") or (pages[0] if pages else f_url)
    paper_code = eval_data.get("_meta_paper") or eval_data.get("detected_paper") or "GS"
    is_rw = int(eval_data.get("_meta_is_rewrite") or 0)
    has_rw = int(eval_data.get("has_been_rewritten") or eval_data.get("_meta_has_been_rewritten") or 0)
    q_title = row.get("question_title") or eval_data.get("question") or "UPSC Mains Answer"
    return {
        "id": str(row.get("id")),
        "user_id": str(row.get("user_id") or ""),
        "created_at": row.get("created_at"),
        "paper": paper_code,
        "max_marks": total_m,
        "total_marks": total_m,
        "question": q_title,
        "question_title": q_title,
        "overall_score": score,
        "total_score": score,
        "percentage": pct,
        "thumbnail": thumb,
        "file_url": f_url,
        "pages": pages,
        "page_images": pages,
        "evaluation": eval_data,
        "evaluation_data": eval_data,
        "evaluation_json": eval_data,
        "is_rewrite": is_rw,
        "has_been_rewritten": has_rw,
        "rewrite_eval_id": eval_data.get("rewrite_eval_id"),
        "baseline_eval_id": eval_data.get("_meta_baseline_eval_id")
    }

def get_user_evaluations(email: str) -> List[Dict[str, Any]]:
    """Returns list of student's past evaluated answer copies (merges Supabase & SQLite so zero copies are ever lost)."""
    clean_email = (email or "").strip().lower()
    user = get_or_create_user(clean_email)
    merged_by_id: Dict[str, Dict[str, Any]] = {}

    if supabase and user and user.get("id"):
        try:
            res = supabase.table("evaluations").select("*").eq("user_id", user["id"]).order("created_at", desc=True).execute()
            if res and res.data:
                for row in res.data:
                    if row.get("question_title") == "__USER_ACCOUNT_PROFILE__":
                        continue
                    formatted = _format_supabase_eval_row(row)
                    if formatted.get("question") == "__USER_ACCOUNT_PROFILE__" or (formatted.get("evaluation") or {}).get("_is_account_profile"):
                        continue
                    merged_by_id[formatted["id"]] = formatted
        except Exception as se:
            print(f"Supabase get_user_evaluations notice: {se}")

    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT id, created_at, paper, max_marks, question, overall_score, percentage, thumbnail, is_rewrite,
               has_been_rewritten, rewrite_eval_id, baseline_eval_id, file_url
        FROM evaluations
        WHERE LOWER(user_email) = ?
          AND question != '__USER_ACCOUNT_PROFILE__'
        ORDER BY created_at DESC
    """, (clean_email,))
    rows = cursor.fetchall()
    conn.close()
    for r in rows:
        d = dict(r)
        if d.get("question") == "__USER_ACCOUNT_PROFILE__":
            continue
        d["total_score"] = d["overall_score"]
        if d["id"] not in merged_by_id:
            merged_by_id[d["id"]] = d

    final_list = list(merged_by_id.values())
    final_list.sort(key=lambda x: str(x.get("created_at") or ""), reverse=True)
    return final_list

def get_evaluation_by_id(eval_id: str) -> Optional[Dict[str, Any]]:
    """Fetches complete copy payload including annotations and pages from SQLite or Supabase."""
    clean_id = (eval_id or "").strip()
    if not clean_id:
        return None

    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM evaluations WHERE id = ?", (clean_id,))
    row = cursor.fetchone()
    conn.close()
    if row:
        res = dict(row)
        res["total_score"] = res["overall_score"]
        res["evaluation"] = json.loads(res["evaluation_json"])
        res["evaluation_data"] = res["evaluation"]
        res["pages"] = json.loads(res["pages_json"]) if res.get("pages_json") else []
        res["page_images"] = res["pages"]
        if res.get("has_been_rewritten") or res.get("rewrite_eval_id"):
            res["has_been_rewritten"] = 1
            res["evaluation"]["has_been_rewritten"] = 1
            res["evaluation"]["rewrite_eval_id"] = res.get("rewrite_eval_id")
        return res

    if supabase:
        try:
            res = supabase.table("evaluations").select("*").eq("id", clean_id).execute()
            if res and res.data and len(res.data) > 0:
                return _format_supabase_eval_row(res.data[0])
        except Exception as se:
            print(f"Supabase get_evaluation_by_id notice: {se}")
    return None

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
    try:
        import base64
        rendered_pages = []
        try:
            import pymupdf
            doc = pymupdf.open(stream=pdf_bytes, filetype="pdf")
            total_pages = len(doc)
            for p_idx in range(total_pages):
                page = doc[p_idx]
                pix = page.get_pixmap(dpi=150)
                img_b64 = "data:image/jpeg;base64," + base64.b64encode(pix.tobytes("jpeg")).decode("utf-8")
                rendered_pages.append(img_b64)
            doc.close()
        except ImportError:
            import pypdfium2 as pdfium
            import io
            pdf = pdfium.PdfDocument(pdf_bytes)
            total_pages = len(pdf)
            for page in pdf:
                pil_img = page.render(scale=1.2).to_pil().convert("RGB")
                buf = io.BytesIO()
                pil_img.save(buf, format="JPEG", quality=75)
                img_b64 = "data:image/jpeg;base64," + base64.b64encode(buf.getvalue()).decode("utf-8")
                rendered_pages.append(img_b64)
                del pil_img
    except Exception as e:
        print(f"Notice: PDF segmentation error: {e}")
        return []
    
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


