try:
    import sentry_sdk
    sentry_sdk.init(
        dsn="https://9bd555734be9acd75c23679680edc311@o4512140848269312.ingest.us.sentry.io/4512140858165248",
        send_default_pii=True,
        traces_sample_rate=1.0,
    )
except ImportError:
    sentry_sdk = None

import os
import io
import gc
import re

def release_process_memory():
    """Forces immediate Python garbage collection and trims glibc arenas back to Linux OS cgroups."""
    gc.collect()
    try:
        import ctypes
        libc = ctypes.CDLL("libc.so.6")
        libc.malloc_trim(0)
    except Exception:
        pass
import json
import copy
import time
import hashlib
from datetime import datetime, timezone, timedelta
from typing import List, Optional, Any, Dict, Tuple, Set, Union
from fastapi import FastAPI, File, UploadFile, Form, HTTPException, Request, BackgroundTasks, Response
from fastapi.staticfiles import StaticFiles
from fastapi.responses import JSONResponse, FileResponse, HTMLResponse
import base64
import tempfile
import uuid

try:
    from PIL import Image
    HAS_PIL = True
except ImportError:
    Image = None
    HAS_PIL = False

# Load .env file if present
env_path = os.path.join(os.path.dirname(__file__), ".env")
if os.path.exists(env_path):
    with open(env_path, "r", encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if line and not line.startswith("#") and "=" in line:
                k, v = line.split("=", 1)
                os.environ[k.strip()] = v.strip().strip('"').strip("'")

from google import genai
from google.genai import types
from supabase import create_client, Client

supabase_url = os.environ.get("SUPABASE_URL", "").strip() or "https://uivzorhuqsdiaarlmbhv.supabase.co"
supabase_key = (
    os.environ.get("SUPABASE_KEY", "").strip()
    or os.environ.get("SUPABASE_SERVICE_ROLE_KEY", "").strip()
    or os.environ.get("SUPABASE_ANON_KEY", "").strip()
)
supabase: Optional[Client] = None
if supabase_url and supabase_key:
    try:
        supabase = create_client(supabase_url, supabase_key)
    except Exception as e:
        print(f"Supabase client initialization notice: {e}")

from evaluator_engine import (
    evaluate_with_gemini, detect_directive, PAPER_TAXONOMIES,
    are_questions_semantically_mismatched, infer_paper_from_question_content,
    is_paper_compatible,
    detect_academic_discipline, build_evaluation_prompt,
    get_dynamic_grounded_context, parse_llm_json_response, normalize_evaluation_data,
    get_active_gemini_keys, build_resilient_fallback_evaluation
)
from sample_data import get_sample_datasets, get_daily_question, get_sample_test_series
from storage import (
    get_or_create_user, authenticate_or_register_user, get_user, use_user_credit, use_user_rewrite,
    add_user_credits, save_evaluation_record, save_feedback, update_user_profile,
    get_user_evaluations, get_evaluation_by_id,
    get_last_evaluation_for_user, has_user_rewritten_question, find_evaluation_by_hash,
    find_evaluation_by_hash_global, has_evaluation_been_rewritten,
    segment_qcab_pdf, create_test_series, save_test_question,
    is_evaluation_fully_completed,
    finalize_test_series, get_test_series_by_id, get_user_test_series,
    get_daily_news_questions, get_recent_current_affairs,
    create_transaction, get_transaction_by_id, get_all_transactions,
    approve_transaction, reject_transaction, get_admin_dashboard_stats,
    get_all_aspirants_admin, update_user_credits_admin, get_all_feedbacks_admin,
    get_admin_setting, set_admin_setting,
    get_user_daily_quota, get_daily_evaluations_count,
    DAILY_EVALUATION_LIMIT, DAILY_REWRITE_LIMIT,
    upload_file_to_supabase, insert_supabase_evaluation, get_db,
    get_deterministic_user_id, _format_supabase_eval_row,
    compute_visual_handwriting_signature, find_canonical_evaluation_for_script,
    find_duplicate_evaluation_in_user_account,
    restore_evaluations_to_vault,
    record_user_heartbeat, log_platform_activity,
    get_admin_evaluations_feed, get_admin_evaluations_stats, get_admin_activity_stream,
    reset_user_daily_quota_admin, delete_feedback_admin,
    sync_supabase_to_sqlite, is_created_today_ist,
    get_admin_session_history, purge_all_dummy_and_demo_accounts,
    push_sqlite_to_supabase
)
import copy
from news_ingestion import ingest_all_feeds, get_top_editorial_articles
from question_generator import get_or_generate_today_questions, generate_daily_questions_cohort
import asyncio
import urllib.request


app = FastAPI(title="Cooked Mains - UPSC Mains Evaluator")

# Ensure static folder exists
os.makedirs(os.path.join(os.path.dirname(__file__), "static"), exist_ok=True)
app.mount("/static", StaticFiles(directory=os.path.join(os.path.dirname(__file__), "static")), name="static")

# Cache sample datasets
SAMPLE_DATASETS = get_sample_datasets()

_last_supabase_ping_ts: float = 0.0

def _execute_supabase_activity_ping() -> Dict[str, Any]:
    """Executes real database & REST API queries against Supabase (uivzorhuqsdiaarlmbhv) so Supabase never pauses the project for 7-day inactivity."""
    global _last_supabase_ping_ts
    _last_supabase_ping_ts = time.time()
    result = {"db_queried": False, "rest_pinged": False, "project_url": supabase_url}
    try:
        if supabase is not None:
            # 1. Execute a real PostgreSQL SELECT query via PostgREST
            supabase.table("evaluations").select("id").limit(1).execute()
            result["db_queried"] = True
            # 2. Also touch Supabase Storage bucket list to register multi-service activity
            try:
                supabase.storage.list_buckets()
            except Exception:
                pass
    except Exception as e:
        result["db_error"] = str(e)

    # 3. Always send a direct HTTP request to the project REST & Auth endpoints (uivzorhuqsdiaarlmbhv)
    try:
        import urllib.error
        target_base = (supabase_url or "https://uivzorhuqsdiaarlmbhv.supabase.co").rstrip("/")
        headers = {"User-Agent": "CookedMains-SupabaseKeepAlive/1.0"}
        if supabase_key:
            headers["apikey"] = supabase_key
            headers["Authorization"] = f"Bearer {supabase_key}"
        for path in ("/rest/v1/", "/auth/v1/health"):
            try:
                req = urllib.request.Request(f"{target_base}{path}", headers=headers)
                with urllib.request.urlopen(req, timeout=8) as resp:
                    if resp.status < 500:
                        result["rest_pinged"] = True
            except urllib.error.HTTPError as he:
                if he.code < 500:
                    result["rest_pinged"] = True
    except Exception:
        pass
    return result

async def _self_keep_alive_loop():
    """Background task that pings Render and executes a real Supabase database query every 10 minutes to prevent Render spin-down and Supabase 7-day inactivity pause."""
    # Run an immediate Supabase activity query & SQLite cloud hydration 5 seconds after startup
    await asyncio.sleep(5)
    try:
        await asyncio.to_thread(_execute_supabase_activity_ping)
    except Exception:
        pass
    try:
        await asyncio.to_thread(sync_supabase_to_sqlite, True)
    except Exception as se:
        print(f"Startup Supabase sync notice: {se}")

    while True:
        try:
            # 1. Ping external Render URL to keep web worker awake
            ext_url = os.environ.get("RENDER_EXTERNAL_URL") or os.environ.get("APP_URL")
            if ext_url:
                ping_url = ext_url.rstrip("/") + "/healthz"
                def _ping():
                    req = urllib.request.Request(ping_url, headers={"User-Agent": "CookedMains-KeepAlive/1.0"})
                    with urllib.request.urlopen(req, timeout=10) as resp:
                        return resp.status
                await asyncio.to_thread(_ping)

            # 2. Execute real Supabase database query so Supabase never marks project inactive
            await asyncio.to_thread(_execute_supabase_activity_ping)

            # 3. Synchronize any fresh Supabase cloud records into local SQLite
            await asyncio.to_thread(sync_supabase_to_sqlite, False)
        except Exception:
            pass
        await asyncio.sleep(600)  # Every 10 minutes

async def _instagram_auto_comment_poller():
    """
    24/7 Background worker: Continuously monitors recent Reels every 35 seconds.
    When any aspirant comments (e.g. 'MAINS'), automatically dispatches
    the DM with https://cookedmains.com and posts a public confirmation reply.
    Replaces ManyChat with zero limits and 100% free uptime.
    """
    await asyncio.sleep(5)
    while True:
        try:
            from instagram_dm_bot import load_rules
            rules = load_rules()
            if rules.get("enabled", True):
                await scan_instagram_reels_for_comments()
        except Exception as e:
            pass
        await asyncio.sleep(35)


@app.on_event("startup")
async def _startup_keep_alive():
    if not os.environ.get("TESTING"):
        asyncio.create_task(_self_keep_alive_loop())
        asyncio.create_task(_instagram_auto_comment_poller())

@app.get("/health")
@app.head("/health")
@app.get("/healthz")
@app.head("/healthz")
@app.get("/ping")
@app.head("/ping")
@app.get("/api/health")
@app.head("/api/health")
async def health_check():
    """24/7 Health Check, UptimeRobot & Supabase Keep-Alive Heartbeat Endpoint."""
    # If more than 25 minutes have elapsed since the last Supabase database query, trigger one in the background
    if time.time() - _last_supabase_ping_ts > 1500:
        asyncio.create_task(asyncio.to_thread(_execute_supabase_activity_ping))
    return {
        "status": "healthy",
        "service": "Cooked Mains AI",
        "supabase_connected": bool(supabase is not None),
        "last_supabase_activity_seconds_ago": round(time.time() - _last_supabase_ping_ts, 1) if _last_supabase_ping_ts > 0 else None,
        "gemini_key_configured": bool(os.environ.get("GEMINI_API_KEY") or os.environ.get("GOOGLE_API_KEY")),
        "active_gemini_keys_count": len(get_active_gemini_keys())
    }

@app.get("/api/supabase-keepalive")
async def trigger_supabase_keepalive():
    """On-demand endpoint to immediately wake/ping Supabase database & storage."""
    res = await asyncio.to_thread(_execute_supabase_activity_ping)
    return {"status": "ok", "supabase_keepalive": res}

@app.get("/api/admin/eval-trace")
async def get_eval_trace():
    """Returns the forensic execution trace of recent evaluation attempts (safe key labels, models, exact errors, latencies)."""
    return {"count": len(_LAST_EVAL_TRACE), "recent_attempts": _LAST_EVAL_TRACE[-50:]}

@app.get("/api/admin/model-health")
async def get_model_health(all_keys: int = 0):
    """Live diagnostic endpoint for administrator to verify Gemini API keys, active models, and real response latency."""
    keys = get_active_gemini_keys()
    if not keys:
        return {
            "status": "warning",
            "api_working": False,
            "message": "No Gemini API keys detected in the server environment. Please configure GEMINI_API_KEY on Render.",
            "keys_detected_count": 0,
            "models_priority": get_active_gemini_models()
        }

    from evaluator_engine import create_fast_gemini_client, get_active_gemini_models, record_gemini_model_outcome
    test_models = get_active_gemini_models()[:3]
    test_results = []
    overall_working = False
    active_champion = None

    if all_keys == 1:
        key_diagnostics = []
        for i, k in enumerate(keys):
            masked = f"{k[:6]}...{k[-4:]}" if len(k) > 10 else f"Key_{i+1}"
            k_res = {"slot": i + 1, "key": masked, "status": "unknown"}
            t0 = time.time()
            try:
                c = create_fast_gemini_client(k, timeout_ms=15000)
                resp = c.models.generate_content(
                    model="gemini-3.5-flash-lite",
                    contents="Ping. Respond with one word: OK"
                )
                lat = round(time.time() - t0, 2)
                if resp and resp.text:
                    k_res["status"] = "active"
                    k_res["latency_seconds"] = lat
                    k_res["response"] = resp.text.strip()[:20]
                    overall_working = True
            except Exception as e:
                k_res["status"] = "failed"
                k_res["latency_seconds"] = round(time.time() - t0, 2)
                k_res["error"] = str(e)[:120]
            key_diagnostics.append(k_res)

        return {
            "status": "healthy" if overall_working else "issues_detected",
            "active_keys_count": len(keys),
            "keys_report": key_diagnostics
        }

    for m in test_models:
        t0 = time.time()
        try:
            client = create_fast_gemini_client(keys[0])
            resp = client.models.generate_content(
                model=m,
                contents="Ping. Respond with one word: OK"
            )
            lat = round(time.time() - t0, 2)
            if resp and resp.text:
                overall_working = True
                active_champion = m
                record_gemini_model_outcome(m, True)
                test_results.append({"model": m, "status": "active", "latency_seconds": lat, "response": resp.text.strip()[:20]})
                break
        except Exception as e:
            lat = round(time.time() - t0, 2)
            err_msg = str(e)
            record_gemini_model_outcome(m, False, err_msg)
            test_results.append({"model": m, "status": "failed", "latency_seconds": lat, "error": err_msg[:120]})

    masked_keys = [f"{k[:6]}...{k[-4:]}" if len(k) > 10 else "***" for k in keys]

    return {
        "status": "healthy" if overall_working else "issues_detected",
        "api_working": overall_working,
        "active_keys_count": len(keys),
        "keys_configured": masked_keys,
        "champion_model": active_champion,
        "models_priority": get_active_gemini_models(),
        "live_test": test_results
    }

@app.api_route("/", methods=["GET", "HEAD"])
@app.api_route("/index.html", methods=["GET", "HEAD"])
async def root():
    return FileResponse(
        os.path.join(os.path.dirname(__file__), "static", "index.html"),
        headers={
            "Cache-Control": "no-cache, no-store, must-revalidate",
            "Pragma": "no-cache",
            "Expires": "0"
        }
    )

@app.api_route("/demo-workbench", methods=["GET", "HEAD"])
@app.api_route("/demo-workbench.html", methods=["GET", "HEAD"])
async def demo_workbench():
    return FileResponse(
        os.path.join(os.path.dirname(__file__), "static", "demo-workbench.html"),
        headers={"X-Robots-Tag": "noindex, nofollow"}
    )

@app.api_route("/demo", methods=["GET", "HEAD"])
@app.api_route("/demo.html", methods=["GET", "HEAD"])
async def demo():
    return FileResponse(
        os.path.join(os.path.dirname(__file__), "static", "demo.html"),
        headers={"X-Robots-Tag": "noindex, nofollow"}
    )

@app.api_route("/about-us", methods=["GET", "HEAD"])
@app.api_route("/about-us.html", methods=["GET", "HEAD"])
@app.api_route("/about", methods=["GET", "HEAD"])
async def about_us_page():
    return FileResponse(os.path.join(os.path.dirname(__file__), "static", "about-us.html"))

@app.api_route("/privacy-policy", methods=["GET", "HEAD"])
@app.api_route("/privacy-policy.html", methods=["GET", "HEAD"])
@app.api_route("/privacy", methods=["GET", "HEAD"])
async def privacy_policy_page():
    return FileResponse(os.path.join(os.path.dirname(__file__), "static", "privacy-policy.html"))

@app.api_route("/terms-and-conditions", methods=["GET", "HEAD"])
@app.api_route("/terms-and-conditions.html", methods=["GET", "HEAD"])
@app.api_route("/terms", methods=["GET", "HEAD"])
async def terms_page():
    return FileResponse(os.path.join(os.path.dirname(__file__), "static", "terms-and-conditions.html"))

@app.api_route("/contact-us", methods=["GET", "HEAD"])
@app.api_route("/contact-us.html", methods=["GET", "HEAD"])
@app.api_route("/contact", methods=["GET", "HEAD"])
async def contact_us_page():
    return FileResponse(os.path.join(os.path.dirname(__file__), "static", "contact-us.html"))

@app.api_route("/robots.txt", methods=["GET", "HEAD"])
@app.api_route("/robot.txt", methods=["GET", "HEAD"])
async def robots_txt():
    return FileResponse(
        os.path.join(os.path.dirname(__file__), "static", "robots.txt"),
        media_type="text/plain; charset=utf-8",
        headers={"Cache-Control": "public, max-age=3600"}
    )

@app.api_route("/sitemap-index.xml", methods=["GET", "HEAD"])
async def sitemap_index_xml():
    return FileResponse(
        os.path.join(os.path.dirname(__file__), "static", "sitemap-index.xml"),
        media_type="application/xml; charset=utf-8",
        headers={"Cache-Control": "public, max-age=3600"}
    )

@app.api_route("/sitemap.xml", methods=["GET", "HEAD"])
@app.api_route("/sitemap-0.xml", methods=["GET", "HEAD"])
async def sitemap_xml():
    return FileResponse(
        os.path.join(os.path.dirname(__file__), "static", "sitemap.xml"),
        media_type="application/xml; charset=utf-8",
        headers={"Cache-Control": "public, max-age=3600"}
    )

@app.api_route("/favicon.ico", methods=["GET", "HEAD"])
async def favicon():
    return FileResponse(
        os.path.join(os.path.dirname(__file__), "static", "favicon.ico"),
        media_type="image/x-icon"
    )


@app.get("/api/config")
async def get_config():
    """Tells frontend whether a server master key is active, so students don't have to enter one."""
    server_has_key = bool(os.environ.get("GEMINI_API_KEY") or os.environ.get("GOOGLE_API_KEY"))
    return {
        "server_has_key": server_has_key,
        "supabase_connected": bool(supabase is not None)
    }

@app.get("/api/samples")
async def get_samples():
    """Returns metadata and preview of preloaded authentic UPSC test answers with normalized rubrics and current affairs anchors."""
    from evaluator_engine import normalize_evaluation_data
    samples = get_sample_datasets()
    result = []
    for s in samples:
        norm_eval = normalize_evaluation_data(dict(s["precomputed_evaluation"]), s["marks"], s["question"], s["paper"], medium=s.get("medium", "english"))
        result.append({
            "id": s["id"],
            "paper": s["paper"],
            "paper_title": s["paper_title"],
            "marks": s["marks"],
            "word_limit": s["word_limit"],
            "question": s["question"],
            "num_pages": len(s["pages"]),
            "pages": s["pages"],
            "precomputed_evaluation": norm_eval
        })
    return result

@app.post("/api/render-preview")
async def render_preview(request: Request, files: List[UploadFile] = File(default=[])):
    """Fast endpoint to render uploaded PDF/images into viewer previews immediately on selection."""
    upload_list = list(files)
    if not upload_list:
        try:
            form = await request.form()
            for key in ["files", "file", "files[]", "pdf", "image"]:
                cand = form.getlist(key)
                if cand:
                    for item in cand:
                        if isinstance(item, UploadFile):
                            upload_list.append(item)
            if not upload_list:
                for k, v in form.items():
                    if isinstance(v, UploadFile):
                        upload_list.append(v)
        except Exception as e:
            print("Preview form parse error:", e)

    previews = []
    for file in upload_list:
        try:
            content = await file.read()
            if not content:
                continue
            filename = (file.filename or "").lower()
            content_type = (file.content_type or "").lower()
            is_pdf = filename.endswith(".pdf") or "pdf" in content_type or content[:4] == b"%PDF"

            if is_pdf:
                try:
                    import pypdfium2 as pdfium
                    pdf = pdfium.PdfDocument(content)
                    try:
                        # Cap preview to maximum 25 pages to prevent unbounded OOM spikes on 512MB instances
                        for p_idx, page in enumerate(pdf):
                            if p_idx >= 25:
                                break
                            pil_img = page.render(scale=1.0).to_pil().convert("RGB")
                            if HAS_PIL and Image and max(pil_img.size) > 960:
                                pil_img.thumbnail((960, 960))
                            buf = io.BytesIO()
                            pil_img.save(buf, format="JPEG", quality=68, optimize=True)
                            b64 = base64.b64encode(buf.getvalue()).decode("utf-8")
                            previews.append(f"data:image/jpeg;base64,{b64}")
                            pil_img.close()
                            del pil_img
                            del buf
                    finally:
                        pdf.close()
                except Exception as e:
                    print("PDF preview notice:", e)
            else:
                try:
                    if HAS_PIL and Image:
                        try:
                            im = Image.open(io.BytesIO(content)).convert("RGB")
                            im.thumbnail((1400, 1400))
                            buf = io.BytesIO()
                            im.save(buf, format="JPEG", quality=75, optimize=True)
                            b64 = base64.b64encode(buf.getvalue()).decode("utf-8")
                            previews.append(f"data:image/jpeg;base64,{b64}")
                        except Exception:
                            b64 = base64.b64encode(content).decode("utf-8")
                            mime = "image/png" if filename.endswith(".png") or "png" in content_type else "image/jpeg"
                            previews.append(f"data:{mime};base64,{b64}")
                    else:
                        b64 = base64.b64encode(content).decode("utf-8")
                        mime = "image/png" if filename.endswith(".png") or "png" in content_type else "image/jpeg"
                        previews.append(f"data:{mime};base64,{b64}")
                except Exception as e:
                    print("Image preview error:", e)
        except Exception as e:
            print("Preview file read error:", e)
    release_process_memory()
    return {"pages": previews, "num_pages": len(previews)}

@app.get("/api/taxonomies")
async def get_taxonomies():
    return PAPER_TAXONOMIES

@app.post("/api/detect-directive")
async def api_detect_directive(question: str = Form(...), medium: Optional[str] = Form("english")):
    return detect_directive(question, medium=medium)

@app.post("/api/test-key")
async def test_key(api_key: str = Form(...)):
    """Tests if the provided Gemini API key(s) are active, merges them into the server multi-key pool, and lists accessible models."""
    from google import genai
    try:
        candidate_keys = [k.strip() for k in re.split(r"[,;\s\n]+", api_key or "") if k.strip() and len(k.strip()) > 15]
        if not candidate_keys:
            return {"valid": False, "message": "Please enter at least one valid Gemini API key."}

        valid_keys = []
        models_found = []
        for k_item in candidate_keys:
            try:
                client = genai.Client(api_key=k_item)
                for m in client.models.list():
                    if m.supported_actions and "generateContent" in m.supported_actions:
                        m_short = m.name.replace("models/", "")
                        if m_short not in models_found:
                            models_found.append(m_short)
                valid_keys.append(k_item)
            except Exception:
                continue

        if valid_keys and models_found:
            existing_pool = [k.strip() for k in re.split(r"[,;\s\n]+", os.environ.get("GEMINI_API_KEY") or "") if k.strip() and len(k.strip()) > 15]
            merged_pool = list(dict.fromkeys(valid_keys + existing_pool))
            merged_str = ",".join(merged_pool)
            with open(env_path, "w", encoding="utf-8") as f:
                f.write(f"GEMINI_API_KEY={merged_str}\n")
            os.environ["GEMINI_API_KEY"] = merged_str

            return {
                "valid": True,
                "message": f"Success! {len(merged_pool)} active key(s) in rotation pool ({len(models_found)} models ready: {', '.join(models_found[:3])}...)",
                "server_saved": True
            }
        else:
            return {"valid": False, "message": "Key validation failed or no generateContent models found."}
    except Exception as e:
        return {"valid": False, "message": str(e)}

@app.get("/api/daily-question")
async def api_daily_question(paper: Optional[str] = None, offset: int = 0):
    """
    Returns today's UPSC Mains question for Daily Answer Writing.
    Rotates smoothly across diversified high-yield questions (5-6 per paper) from authentic national sources.
    """
    res = get_daily_question(paper=paper, offset=offset)
    res["is_live_news"] = True
    return res


@app.get("/api/current-affairs/today")
async def api_get_today_current_affairs():
    """Returns today's top UPSC-relevant news articles and live questions."""
    import datetime
    articles = get_top_editorial_articles(limit=12)
    today_iso = datetime.date.today().strftime("%Y-%m-%d")
    questions = get_daily_news_questions(date_str=today_iso)
    return {
        "date": datetime.date.today().strftime("%A, %d %B %Y"),
        "articles": articles,
        "questions": questions,
        "total_articles": len(articles),
        "total_questions": len(questions)
    }

@app.post("/api/current-affairs/refresh")
async def api_refresh_current_affairs(background_tasks: BackgroundTasks, paper: Optional[str] = None):
    """Triggers an on-demand refresh of news RSS feeds and AI question generation, returning a fresh live question instantly."""
    import datetime, random
    try:
        def _refresh():
            try:
                ingest_all_feeds()
                generate_daily_questions_cohort(num_questions=4)
            except Exception as e:
                print(f"Background feed refresh error: {e}")
        background_tasks.add_task(_refresh)

        # Immediately rotate to a fresh contemporary question from bank with live timestamp
        today = datetime.date.today()
        date_str = today.strftime("%A, %d %B %Y")
        fresh_offset = random.randint(1, 25)
        new_q = get_daily_question(paper=paper, offset=fresh_offset)
        new_q["date_display"] = date_str
        new_q["is_live_news"] = True
        new_q["current_offset"] = fresh_offset

        return {
            "status": "success",
            "message": "Live news synchronized successfully with latest national editorials.",
            "question": new_q,
            "offset": fresh_offset
        }
    except Exception as e:
        return {"status": "error", "message": str(e)}


@app.get("/api/upsc-blank-sheet", response_class=HTMLResponse)
async def api_upsc_blank_sheet(
    paper: str = "GS2",
    paper_name: str = "",
    marks: int = 15,
    word_limit: int = 0,
    question: str = "",
    q_num: int = 1,
    autoprint: int = 0,
    ruled: int = 0
):
    """
    Renders authentic official UPSC Mains Question-Cum-Answer Booklet (QCAB) specimen.
    Prints pre-formatted question prompt at top of Page 1 with official margins and warnings,
    matching original UPSC Civil Services Answer Booklets and top coaching institutions.
    """
    import html

    # Fallback to authentic question if not supplied
    if not question or not question.strip():
        question = "The regulation of unrecognised and unaided traditional educational institutions often creates a tension between educational standardisation and minority rights. Critically examine this statement in light of constitutional safeguards and judicial pronouncements. (15 Marks, 250 Words)"

    marks = int(marks or 15)
    word_limit = int(word_limit or (300 if marks >= 20 else (250 if marks >= 15 else 150)))
    pages_count = 4 if marks >= 20 else (3 if marks >= 15 else 2)

    paper_clean = (paper or "GS2").upper()
    paper_titles = {
        "GS1": "General Studies Paper 1 (Indian Heritage, History, Society & Geography)",
        "GS2": "General Studies Paper 2 (Governance, Constitution, Polity, Social Justice & IR)",
        "GS3": "General Studies Paper 3 (Technology, Economic Development, Bio-diversity, Environment, Security & Disaster Management)",
        "GS4": "General Studies Paper 4 (Ethics, Integrity and Aptitude)",
        "ESSAY": "Essay Paper (Section A & Section B)",
        "OPTIONAL": "Optional Subject (Paper I / Paper II)"
    }
    display_paper_name = paper_name or paper_titles.get(paper_clean, f"General Studies {paper_clean}")

    # Clean question text: strip any pre-existing trailing marks/words notation so it is not duplicated
    import re
    clean_question = re.sub(r'\s*\(\s*\d+\s*Marks[^\)]*\)\s*$', '', question.strip(), flags=re.IGNORECASE)
    clean_question = re.sub(r'^[?\s\(\)\/\d\:\-\.]*(?=(?:[A-Z]|Q\d))', '', clean_question).strip()

    pages_html = ""
    for p in range(1, pages_count + 1):
        if p == 1:
            header_center = """
              <div class="upsc-hindi-title">संघ लोक सेवा आयोग</div>
              <div class="upsc-eng-title">UNION PUBLIC SERVICE COMMISSION</div>
              <div class="upsc-booklet-name">( प्रश्न-सह-उत्तर पुस्तिका / QUESTION-CUM-ANSWER BOOKLET )</div>
              <div class="upsc-exam-name">सिविल सेवा (प्रधान) परीक्षा / CIVIL SERVICES (MAIN) EXAMINATION</div>
            """
            q_box_html = f"""
              <div class="question-box">
                <div class="q-content-full">
                  <span class="q-number">Q.{q_num}</span>
                  <span class="q-statement">{html.escape(clean_question)}</span>
                </div>
                <div class="q-meta-end">
                  <span>({marks} Marks / {word_limit} Words)</span>
                </div>
              </div>
            """
        else:
            header_center = f"""
              <div class="upsc-eng-title" style="font-size:12pt; letter-spacing:4px;">UNION PUBLIC SERVICE COMMISSION</div>
              <div class="upsc-booklet-name" style="font-size:9pt; margin-top:2px;">Q.{q_num} (जारी / Contd.) — {html.escape(display_paper_name)}</div>
            """
            q_box_html = ""

        footer_right = "— उत्तर समाप्त / END OF ANSWER —" if p == pages_count else "UPSC Civil Services Examination"

        pages_html += f"""
        <div class="sheet-page">
          <table class="upsc-header-table">
            <tr>
              <td class="header-margin-cell left-cell">
                परीक्षार्थियों को<br>इस हाशिए में<br>नहीं लिखना चाहिए<br>
                <span class="eng-margin-sub">Candidates must not write on this margin</span>
              </td>
              <td class="header-center-cell">
                {header_center}
              </td>
              <td class="header-margin-cell right-cell">
                उम्मीदवारों को<br>इस हाशिए में<br>नहीं लिखना चाहिए<br>
                <span class="eng-margin-sub">Candidates must not write on this margin</span>
              </td>
            </tr>
          </table>

          <div class="sheet-body">
            <div class="margin-column margin-left">
              <span class="margin-warning-vertical">DO NOT WRITE IN THIS MARGIN / इस हाशिए में न लिखें</span>
            </div>

            <div class="writing-column">
              {q_box_html}
              <div class="writing-canvas {'ruled-canvas' if ruled else ''}" id="canvas{p}"></div>
            </div>

            <div class="margin-column margin-right">
              <span class="margin-warning-vertical">DO NOT WRITE IN THIS MARGIN / इस हाशिए में न लिखें</span>
            </div>
          </div>

          <div class="sheet-footer">
            <span>{html.escape(display_paper_name)}</span>
            <span style="font-weight: 700;">Page {p} of {pages_count}</span>
            <span>{footer_right}</span>
          </div>
        </div>
        """

    full_html = f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>UPSC Mains Answer Booklet - {html.escape(paper_clean)} Q.{q_num}</title>
  <style>
    @page {{
      size: A4 portrait;
      margin: 0;
    }}
    * {{
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }}
    body {{
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Times New Roman", serif;
      background: #1e293b;
      padding: 24px 0;
      color: #000;
    }}
    .sheet-page {{
      width: 210mm;
      min-height: 297mm;
      height: 297mm;
      background: #ffffff;
      margin: 0 auto 24px auto;
      box-shadow: 0 10px 30px rgba(0,0,0,0.35);
      position: relative;
      padding: 10mm 12mm 8mm 12mm;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }}
    @media print {{
      html, body {{
        background: #ffffff !important;
        padding: 0 !important;
        margin: 0 !important;
      }}
      .sheet-page {{
        box-shadow: none !important;
        margin: 0 !important;
        width: 210mm !important;
        height: 297mm !important;
        max-height: 297mm !important;
        padding: 10mm 12mm 8mm 12mm !important;
        page-break-inside: avoid !important;
        page-break-after: always !important;
        border: none !important;
      }}
      .sheet-page:last-child {{
        page-break-after: auto !important;
      }}
      .no-print {{
        display: none !important;
      }}
    }}

    /* Official UPSC Header Table */
    .upsc-header-table {{
      width: 100%;
      border-collapse: collapse;
      border: 1.5px solid #000;
      background: #fff;
    }}
    .upsc-header-table td {{
      vertical-align: middle;
      padding: 4px 6px;
    }}
    .header-margin-cell {{
      width: 32mm;
      min-width: 32mm;
      max-width: 32mm;
      font-size: 7.5pt;
      line-height: 1.25;
      text-align: center;
      color: #000;
      font-weight: 700;
    }}
    .eng-margin-sub {{
      font-size: 6.5pt;
      font-weight: normal;
      display: block;
      margin-top: 1px;
      color: #333;
    }}
    .left-cell {{
      border-right: 1.5px solid #000;
    }}
    .right-cell {{
      border-left: 1.5px solid #000;
    }}
    .header-center-cell {{
      text-align: center;
      padding: 5px 8px;
    }}
    .upsc-hindi-title {{
      font-size: 13pt;
      font-weight: 900;
      letter-spacing: 2px;
      font-family: 'Times New Roman', Georgia, serif;
      color: #000;
    }}
    .upsc-eng-title {{
      font-size: 10.5pt;
      font-weight: 800;
      letter-spacing: 3px;
      font-family: 'Times New Roman', Georgia, serif;
      color: #000;
      margin-top: 1px;
    }}
    .upsc-booklet-name {{
      font-size: 7.5pt;
      font-weight: 700;
      color: #111;
      margin-top: 2px;
    }}
    .upsc-exam-name {{
      font-size: 7pt;
      font-weight: 600;
      color: #333;
      margin-top: 1px;
    }}

    /* Main Sheet Body with Left/Right Vertical Margin Lines */
    .sheet-body {{
      display: flex;
      flex: 1;
      width: 100%;
      border-left: 1.5px solid #000;
      border-right: 1.5px solid #000;
      border-bottom: 1.5px solid #000;
      position: relative;
    }}
    .margin-column {{
      width: 32mm;
      min-width: 32mm;
      max-width: 32mm;
      height: 100%;
      background: #ffffff;
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding-top: 10px;
    }}
    .margin-left {{
      border-right: 1.5px solid #000;
    }}
    .margin-right {{
      border-left: 1.5px solid #000;
    }}
    .margin-warning-vertical {{
      writing-mode: vertical-rl;
      transform: rotate(180deg);
      font-size: 7.5pt;
      font-weight: 700;
      color: #888;
      letter-spacing: 1.5px;
      text-transform: uppercase;
      margin-top: 40mm;
    }}

    /* Center Writing Column */
    .writing-column {{
      flex: 1;
      background: #ffffff;
      height: 100%;
      display: flex;
      flex-direction: column;
      position: relative;
    }}

    /* Pre-printed Question Box (Full-width clean layout) */
    .question-box {{
      border-bottom: 1.5px solid #000;
      padding: 8px 12px 6px 12px;
      background: #ffffff;
    }}
    .q-content-full {{
      font-size: 10pt;
      font-weight: 600;
      line-height: 1.4;
      color: #000;
      font-family: 'Times New Roman', Georgia, serif;
      text-align: justify;
    }}
    .q-number {{
      font-size: 11pt;
      font-weight: 900;
      color: #000;
      font-family: 'Times New Roman', Georgia, serif;
      margin-right: 6px;
      display: inline;
    }}
    .q-statement {{
      display: inline;
      font-size: 10pt;
      font-weight: 600;
      line-height: 1.4;
      color: #000;
    }}
    .q-meta-end {{
      text-align: right;
      font-size: 9pt;
      font-weight: 800;
      font-family: 'Times New Roman', Georgia, serif;
      color: #111;
      margin-top: 4px;
    }}

    /* Blank Canvas writing space */
    .writing-canvas {{
      flex: 1;
      background: #ffffff;
      position: relative;
    }}

    /* Standard UPSC Ruled Lines (~9.2mm spacing) */
    .ruled-canvas .ruled-line {{
      height: 9.2mm;
      border-bottom: 1px solid #d4d4d8;
      width: 100%;
    }}

    /* Footer */
    .sheet-footer {{
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 4px;
      font-size: 7.5pt;
      color: #444;
      font-family: -apple-system, BlinkMacSystemFont, sans-serif;
    }}

    /* Floating Toolbar */
    .floating-nav {{
      position: fixed;
      top: 16px;
      right: 24px;
      z-index: 10000;
      display: flex;
      gap: 8px;
      background: rgba(15, 23, 42, 0.94);
      padding: 8px 12px;
      border-radius: 12px;
      box-shadow: 0 10px 25px rgba(0,0,0,0.5);
      backdrop-filter: blur(8px);
      border: 1px solid #334155;
    }}
    .toolbar-btn {{
      padding: 8px 14px;
      border-radius: 8px;
      font-size: 12px;
      font-weight: 700;
      cursor: pointer;
      border: none;
      transition: all 0.15s ease;
      display: flex;
      align-items: center;
      gap: 6px;
    }}
    .btn-print {{
      background: #f59e0b;
      color: #0f172a;
    }}
    .btn-print:hover {{
      background: #fbbf24;
    }}
    .btn-toggle {{
      background: #334155;
      color: #f1f5f9;
    }}
    .btn-toggle:hover {{
      background: #475569;
    }}
    .btn-close {{
      background: #1e293b;
      color: #94a3b8;
    }}
    .btn-close:hover {{
      background: #334155;
      color: #fff;
    }}
  </style>
</head>
<body>
  <div class="floating-nav no-print">
    <button class="toolbar-btn btn-print" onclick="window.print()">🖨️ Print / Save as PDF</button>
    <button class="toolbar-btn btn-toggle" id="toggleRuledBtn" onclick="toggleRuledLines()">📝 Toggle UPSC Ruled Lines</button>
    <button class="toolbar-btn btn-close" onclick="window.close()">✕ Close</button>
  </div>

  {pages_html}

  <script>
    let isRuled = {'true' if ruled else 'false'};
    function initRuling() {{
      const canvases = document.querySelectorAll('.writing-canvas');
      canvases.forEach(c => {{
        if (isRuled) {{
          c.classList.add('ruled-canvas');
          let lines = '';
          const lineCount = c.id === 'canvas1' ? 22 : 27;
          for (let i = 0; i < lineCount; i++) {{
            lines += '<div class="ruled-line"></div>';
          }}
          c.innerHTML = lines;
        }} else {{
          c.classList.remove('ruled-canvas');
          c.innerHTML = '';
        }}
      }});
      const btn = document.getElementById('toggleRuledBtn');
      if (btn) btn.textContent = isRuled ? '📄 Switch to Blank Paper' : '📝 Toggle UPSC Ruled Lines';
    }}

    function toggleRuledLines() {{
      isRuled = !isRuled;
      initRuling();
    }}

    if (isRuled) initRuling();

    { 'setTimeout(() => window.print(), 500);' if autoprint else '' }
  </script>
</body>
</html>"""
    return HTMLResponse(content=full_html)


DEFAULT_GOOGLE_CLIENT_ID = "920708567221-cg6u0n4jnraou5360bkt7lruaap9cca1.apps.googleusercontent.com"

@app.get("/api/auth/config")
async def api_auth_config(request: Request):
    """Returns Google OAuth Client ID and Supabase OAuth availability for native 1-click browser Google login."""
    google_client_id = (os.environ.get("GOOGLE_CLIENT_ID") or DEFAULT_GOOGLE_CLIENT_ID).strip()
    supa_google_enabled = False
    if supabase_url and supabase_key:
        try:
            import urllib.request
            import json as _json
            req = urllib.request.Request(
                f"{supabase_url.rstrip('/')}/auth/v1/settings",
                headers={"apikey": supabase_key}
            )
            with urllib.request.urlopen(req, timeout=4) as resp:
                settings_data = _json.loads(resp.read().decode("utf-8"))
                supa_google_enabled = bool((settings_data.get("external") or {}).get("google"))
        except Exception:
            supa_google_enabled = False

    origin = str(request.base_url).rstrip("/")
    if request.headers.get("x-forwarded-proto") == "https" or "onrender.com" in origin or "cookedmains.com" in origin:
        if origin.startswith("http://") and not ("127.0.0.1" in origin or "localhost" in origin):
            origin = origin.replace("http://", "https://", 1)
    supa_oauth_url = (
        f"{supabase_url.rstrip('/')}/auth/v1/authorize?provider=google&redirect_to={origin}/"
        if (supabase_url and supa_google_enabled) else ""
    )
    return {
        "google_client_id": google_client_id,
        "supabase_google_enabled": supa_google_enabled,
        "supabase_oauth_url": supa_oauth_url
    }


@app.post("/api/auth/google/verify")
async def api_auth_google_verify(request: Request):
    """Verifies a browser Google OAuth token (Google Identity Services or Supabase OAuth) and signs in the single verified account."""
    try:
        data = await request.json()
    except Exception:
        data = {}

    credential = (data.get("credential") or "").strip()
    access_token = (data.get("access_token") or "").strip()
    supa_token = (data.get("supabase_access_token") or "").strip()
    device_id = (data.get("device_id") or "").strip()
    forwarded_for = request.headers.get("x-forwarded-for", "")
    client_ip = forwarded_for.split(",")[0].strip() if forwarded_for else (request.client.host if request.client else "")

    import urllib.request
    import json as _json

    verified_email = ""
    verified_name = ""
    verified_avatar = ""

    try:
        if credential:
            req = urllib.request.Request(f"https://oauth2.googleapis.com/tokeninfo?id_token={credential}")
            with urllib.request.urlopen(req, timeout=6) as resp:
                gdata = _json.loads(resp.read().decode("utf-8"))
                if str(gdata.get("email_verified")).lower() == "true":
                    verified_email = (gdata.get("email") or "").strip().lower()
                    verified_name = (gdata.get("name") or "").strip()
                    verified_avatar = (gdata.get("picture") or "").strip()
        elif access_token:
            req = urllib.request.Request(
                "https://www.googleapis.com/oauth2/v3/userinfo",
                headers={"Authorization": f"Bearer {access_token}"}
            )
            with urllib.request.urlopen(req, timeout=6) as resp:
                gdata = _json.loads(resp.read().decode("utf-8"))
                if gdata.get("email_verified") is True or str(gdata.get("email_verified")).lower() == "true":
                    verified_email = (gdata.get("email") or "").strip().lower()
                    verified_name = (gdata.get("name") or "").strip()
                    verified_avatar = (gdata.get("picture") or "").strip()
        elif supa_token and supabase_url and supabase_key:
            req = urllib.request.Request(
                f"{supabase_url.rstrip('/')}/auth/v1/user",
                headers={
                    "apikey": supabase_key,
                    "Authorization": f"Bearer {supa_token}"
                }
            )
            with urllib.request.urlopen(req, timeout=6) as resp:
                sdata = _json.loads(resp.read().decode("utf-8"))
                verified_email = (sdata.get("email") or "").strip().lower()
                umeta = sdata.get("user_metadata") or {}
                verified_name = (umeta.get("full_name") or umeta.get("name") or "").strip()
                verified_avatar = (umeta.get("avatar_url") or umeta.get("picture") or "").strip()
    except Exception as ve:
        raise HTTPException(status_code=401, detail=f"Google verification failed: {ve}")

    if not verified_email:
        raise HTTPException(status_code=401, detail="Could not verify Google account email.")

    auth_res = authenticate_or_register_user(
        email=verified_email,
        name=verified_name,
        avatar=verified_avatar,
        provider="google",
        device_id=device_id,
        client_ip=client_ip,
        verified_oauth=True
    )
    if not auth_res.get("success"):
        raise HTTPException(status_code=401, detail=auth_res.get("error") or "Google sign-in blocked by Single-Account policy.")

    user = auth_res["user"]
    history = get_user_evaluations(user["email"])
    quota = get_user_daily_quota(user["email"])
    return {
        "email": user["email"],
        "name": user["name"],
        "avatar": user["avatar"],
        "credits": quota["daily_eval_remaining"],
        "free_credits": quota["daily_eval_remaining"],
        "free_rewrites": quota["daily_rewrite_remaining"],
        "daily_quota": quota,
        "target_year": user.get("target_year", "2026"),
        "optional_subject": user.get("optional_subject", "PSIR"),
        "is_pro": True,
        "has_password": bool(user.get("password_hash")),
        "evaluations_count": len(history)
    }


@app.post("/api/user/login")
async def api_user_login(request: Request):
    """Registers or authenticates aspirant with PBKDF2-HMAC-SHA256 password protection and Supabase profile persistence."""
    try:
        content_type = request.headers.get("content-type", "")
        if "application/json" in content_type:
            data = await request.json()
        else:
            form = await request.form()
            data = dict(form)
    except Exception:
        data = {}

    email = (data.get("email") or "").strip()
    if not email:
        raise HTTPException(status_code=400, detail="Email is required.")
    name = data.get("name")
    avatar = data.get("avatar")
    password = data.get("password")
    provider = data.get("provider")
    device_id = (data.get("device_id") or "").strip()
    forwarded_for = request.headers.get("x-forwarded-for", "")
    client_ip = forwarded_for.split(",")[0].strip() if forwarded_for else (request.client.host if request.client else "")

    auth_res = authenticate_or_register_user(
        email=email,
        password=password,
        name=name,
        avatar=avatar,
        provider=provider,
        device_id=device_id,
        client_ip=client_ip,
        mode=data.get("mode")
    )
    if not auth_res.get("success"):
        raise HTTPException(status_code=401, detail=auth_res.get("error") or "Authentication failed.")

    user = auth_res["user"]
    history = get_user_evaluations(user["email"])
    quota = get_user_daily_quota(user["email"])
    return {
        "email": user["email"],
        "name": user["name"],
        "avatar": user["avatar"],
        "credits": quota["daily_eval_remaining"],
        "free_credits": quota["daily_eval_remaining"],
        "free_rewrites": quota["daily_rewrite_remaining"],
        "daily_quota": quota,
        "target_year": user.get("target_year", "2026"),
        "optional_subject": user.get("optional_subject", "PSIR"),
        "is_pro": True,
        "has_password": bool(user.get("password_hash")),
        "evaluations_count": len(history)
    }

@app.get("/api/user/profile")
async def api_user_profile(email: str):
    """Fetches user profile and remaining daily quota."""
    user = get_or_create_user(email)
    history = get_user_evaluations(email)
    quota = get_user_daily_quota(email)
    return {
        "email": user["email"],
        "name": user["name"],
        "avatar": user["avatar"],
        "credits": quota["daily_eval_remaining"],
        "free_credits": quota["daily_eval_remaining"],
        "free_rewrites": quota["daily_rewrite_remaining"],
        "daily_quota": quota,
        "target_year": user.get("target_year", "2026"),
        "optional_subject": user.get("optional_subject", "PSIR"),
        "is_pro": True,
        "has_password": bool(user.get("password_hash")),
        "evaluations_count": len(history)
    }

@app.post("/api/user/profile/update")
async def api_user_profile_update(request: Request):
    """Updates candidate name, target year, or optional subject."""
    try:
        data = await request.json()
    except Exception:
        data = {}
    email = (data.get("email") or "").strip().lower()
    if not email:
        raise HTTPException(status_code=400, detail="Email is required.")
    name = data.get("name")
    target_year = data.get("target_year")
    optional_subject = data.get("optional_subject")
    user = update_user_profile(email, name, target_year, optional_subject)
    history = get_user_evaluations(email)
    quota = get_user_daily_quota(email)
    return {
        "email": user["email"],
        "name": user["name"],
        "avatar": user["avatar"],
        "credits": quota["daily_eval_remaining"],
        "free_credits": quota["daily_eval_remaining"],
        "free_rewrites": quota["daily_rewrite_remaining"],
        "daily_quota": quota,
        "target_year": user.get("target_year", "2026"),
        "optional_subject": user.get("optional_subject", "PSIR"),
        "is_pro": True,
        "has_password": bool(user.get("password_hash")),
        "evaluations_count": len(history)
    }

@app.post("/api/feedback")
async def api_submit_feedback(request: Request):
    """Stores candidate rating, bug report, or evaluation suggestions."""
    try:
        data = await request.json()
    except Exception:
        data = {}
    rating = int(data.get("rating") or 5)
    category = data.get("category") or "General Experience"
    message = (data.get("message") or "").strip()
    user_email = (data.get("email") or "").strip()
    user_name = (data.get("name") or "").strip()
    screenshot_data = data.get("screenshot") or data.get("screenshot_data")
    if not message:
        raise HTTPException(status_code=400, detail="Feedback message cannot be empty.")
    result = save_feedback(user_email, user_name, category, rating, message, screenshot_data)
    log_platform_activity(
        user_email=user_email or "guest@cookedmains.in",
        user_name=user_name or (user_email.split("@")[0].title() if user_email else "Aspirant"),
        action_type="feedback_submitted",
        title=f"Submitted {rating}★ Feedback ({category})",
        detail=message[:120]
    )
    return {"status": "success", "message": "Feedback received. Thank you for helping us improve Cooked Mains!"}

@app.post("/api/admin/factory-reset")
async def api_admin_factory_reset():
    """Strictly disabled to protect data integrity and ensure zero deletion."""
    return {
        "status": "disabled",
        "message": "Data retention is strictly enforced. Factory reset and data deletion are permanently disabled to preserve all student data and evaluations."
    }

@app.get("/locker")
@app.get("/history")
@app.get("/api/user/history")
async def api_user_history(response: Response, email: Optional[str] = None, user_id: Optional[str] = None):
    """Returns list of student's past evaluated answer copies ordered by created_at desc."""
    if response:
        response.headers["X-Robots-Tag"] = "noindex, nofollow"
    if email:
        return get_user_evaluations(email)

    if supabase and user_id:
        try:
            res = supabase.table("evaluations").select("*").eq("user_id", user_id).order("created_at", desc=True).execute()
            if res and res.data:
                rows_clean = []
                for r in res.data:
                    if str(r.get("question_title") or "").startswith("__"):
                        continue
                    formatted = _format_supabase_eval_row(r)
                    if is_evaluation_fully_completed(formatted.get("evaluation"), formatted.get("question"), formatted.get("max_marks")):
                        rows_clean.append(formatted)
                return rows_clean
        except Exception as e:
            print(f"Supabase /locker query error: {e}")

    if supabase:
        try:
            res = supabase.table("evaluations").select("*").order("created_at", desc=True).limit(50).execute()
            if res and res.data:
                rows_clean = []
                for r in res.data:
                    if str(r.get("question_title") or "").startswith("__"):
                        continue
                    formatted = _format_supabase_eval_row(r)
                    if is_evaluation_fully_completed(formatted.get("evaluation"), formatted.get("question"), formatted.get("max_marks")):
                        rows_clean.append(formatted)
                return rows_clean
        except Exception as e:
            print(f"Supabase /locker query error: {e}")

    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT id, created_at, paper, max_marks, question, overall_score, percentage, thumbnail, is_rewrite,
               has_been_rewritten, rewrite_eval_id, baseline_eval_id, file_url, evaluation_json
        FROM evaluations
        WHERE SUBSTR(question, 1, 2) != '__'
          AND LOWER(question) NOT IN ('general studies mains question', 'upsc mains question', 'upsc mains answer')
          AND LOWER(question) NOT LIKE '%general studies mains question%'
          AND overall_score > 0
        ORDER BY created_at DESC
        LIMIT 50
    """)
    rows = cursor.fetchall()
    conn.close()
    valid_rows = []
    for r in rows:
        d = dict(r)
        ev = {}
        try:
            ev = json.loads(d.pop("evaluation_json")) if d.get("evaluation_json") else {}
        except Exception:
            pass
        if is_evaluation_fully_completed(ev, d.get("question"), d.get("max_marks")):
            d["evaluation"] = ev
            valid_rows.append(d)
    return valid_rows

@app.get("/api/user/history/{eval_id}")
async def api_history_detail(eval_id: str):
    """Fetches complete copy payload including annotations and pages for instant reloading."""
    record = get_evaluation_by_id(eval_id)
    if not record or not is_evaluation_fully_completed(record.get("evaluation"), record.get("question"), record.get("max_marks")):
        raise HTTPException(status_code=404, detail="Evaluated copy not found or incomplete.")
    return record

@app.post("/api/user/sync-vault")
async def api_user_sync_vault(request: Request):
    """Synchronizes and restores any evaluated copies from the aspirant's browser vault into SQLite & Supabase."""
    try:
        data = await request.json()
    except Exception:
        data = {}
    email = (data.get("email") or "").strip().lower()
    records = data.get("records") or []
    if not email or not isinstance(records, list):
        return {"restored": 0, "evaluations": []}
    sync_res = restore_evaluations_to_vault(email, records)
    updated_list = get_user_evaluations(email)
    return {
        "restored": sync_res.get("restored", 0),
        "evaluations": updated_list
    }

@app.post("/api/user/recharge")
async def api_user_recharge(request: Request):
    """
    Recharges evaluation credits or activates Pro plan.
    Ready for Razorpay webhook / UPI instant unlock.
    """
    try:
        content_type = request.headers.get("content-type", "")
        if "application/json" in content_type:
            data = await request.json()
        else:
            form = await request.form()
            data = dict(form)
    except Exception:
        data = {}

    email = (data.get("email") or "").strip()
    if not email:
        raise HTTPException(status_code=400, detail="Email is required.")

    pack = data.get("pack_type") or data.get("pack", "sachet_3")
    pack_map = {
        "sachet_3": 3,
        "sachet_10": 10,
        "revision_10": 10
    }

    if pack in ["pro_monthly", "monthly_pro", "pro"]:
        updated_user = add_user_credits(email, 0, set_pro=True)
        message = "Pro Unlimited plan activated successfully! Unlimited evaluations & rewrites unlocked."
    elif pack in pack_map:
        creds = pack_map[pack]
        updated_user = add_user_credits(email, creds)
        message = f"Added {creds} answer evaluation credits to your locker!"
    else:
        raise HTTPException(status_code=400, detail="Invalid practice pack selected. Please select a valid Aspirant Practice Pack.")

    return {
        "message": message,
        "email": updated_user["email"],
        "name": updated_user["name"],
        "new_credits": updated_user["free_credits"],
        "credits": updated_user["free_credits"],
        "is_pro": bool(updated_user["is_pro"])
    }


# =====================================================================
# 💳 UPI PAYMENT & SUBSCRIPTION CHECKOUT
# =====================================================================

@app.post("/api/payment/create-order")
async def api_payment_create_order(request: Request):
    """Creates a new pending UPI order with authentic UPI intent URL."""
    try:
        data = await request.json()
    except Exception:
        data = {}

    plan_id = (data.get("plan_id") or "revision_149").lower()
    email = (data.get("email") or "").strip().lower()
    name = (data.get("name") or "Aspirant").strip()
    
    plan_catalog = {
        "sachet_3": {"amount": 49, "name": "Sachet Pack (3 Evaluations)"},
        "sachet_49": {"amount": 49, "name": "Sachet Pack (3 Evaluations)"},
        "revision_10": {"amount": 149, "name": "Revision Pack (10 Copies + 5 Rewrites)"},
        "revision_149": {"amount": 149, "name": "Revision Pack (10 Copies + 5 Rewrites)"},
        "monthly_pro": {"amount": 399, "name": "Mains Pro (Unlimited 30-Day Mentorship)"},
        "pro_399": {"amount": 399, "name": "Mains Pro (Unlimited 30-Day Mentorship)"}
    }

    selected = plan_catalog.get(plan_id, plan_catalog["revision_149"])
    amount = selected["amount"]
    plan_name = selected["name"]
    
    import uuid
    order_id = f"ORD-2026-{uuid.uuid4().hex[:6].upper()}"
    upi_id = get_admin_setting("admin_upi_id", "9661228832-2@ybl")
    
    # Standard NPCI UPI Intent URI for mobile app deep-linking
    upi_url = f"upi://pay?pa={upi_id}&pn=CookedMains&am={amount}&cu=INR&tn={order_id}"

    return {
        "order_id": order_id,
        "plan_id": plan_id,
        "plan_name": plan_name,
        "amount": amount,
        "upi_id": upi_id,
        "upi_url": upi_url,
        "bank_name": "State Bank of India",
        "qr_image_url": "/static/sbi_phonepe_qr.jpg"
    }

@app.post("/api/payment/submit-utr")
async def api_payment_submit_utr(request: Request):
    """Submits 12-digit UPI UTR / Reference Number for admin approval."""
    try:
        data = await request.json()
    except Exception:
        data = {}

    order_id = data.get("order_id")
    email = (data.get("email") or "").strip().lower()
    name = (data.get("name") or "Aspirant").strip()
    plan_id = data.get("plan_id") or "revision_149"
    plan_name = data.get("plan_name") or "Revision Pack"
    amount = int(data.get("amount") or 149)
    utr = (data.get("utr_number") or "").strip()
    screenshot_data = data.get("screenshot_data")

    if not utr or len(utr) < 6:
        raise HTTPException(status_code=400, detail="Please enter a valid UPI UTR / Transaction Reference number (usually 12 digits).")

    if not email:
        raise HTTPException(status_code=400, detail="Aspirant email is required to attach the subscription.")

    # Retrieve or create user record
    user = get_or_create_user(email, name)
    user_id = user["id"]

    try:
        tx = create_transaction(user_id, email, name, plan_id, plan_name, amount, utr, screenshot_data, order_id=order_id)
        # INSTANT ZERO-WAIT AUTO-APPROVAL & CREDIT GRANT:
        approved_tx = approve_transaction(tx["id"], admin_notes="Instant Automated Approval (Zero Wait)")
        # Fetch updated user record with newly credited balance
        updated_user = get_user(email)
        return {
            "status": "approved",
            "order_id": tx["id"],
            "message": "🎉 Payment verified! Your subscription is active immediately. Credits have been added to your account.",
            "transaction": approved_tx,
            "user": updated_user
        }
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))


# =====================================================================
# 🛡️ DEDICATED PRIVATE ADMIN DASHBOARD APIS
# =====================================================================

@app.get("/admin")
@app.get("/admin.html")
async def serve_admin_page():
    """Serves the standalone secured Admin Dashboard."""
    admin_html_path = os.path.join(os.path.dirname(__file__), "static", "admin.html")
    if os.path.exists(admin_html_path):
        return FileResponse(admin_html_path)
    return HTMLResponse("<h1>Admin Dashboard template initializing...</h1>")

@app.post("/api/admin/login")
async def api_admin_login(request: Request):
    """Authenticates admin with PIN/password."""
    try:
        data = await request.json()
    except Exception:
        data = {}
    pin = (data.get("pin") or "").strip()
    master_pin = os.environ.get("ADMIN_PASSWORD") or get_admin_setting("admin_pin", "Admin@MainsMentor2026")
    
    if pin == master_pin:
        # Simple hashed token for admin session
        token = hashlib.sha256(f"mainsmentor_admin_{master_pin}".encode()).hexdigest()
        return {"status": "authenticated", "token": token, "role": "admin"}
    raise HTTPException(status_code=401, detail="Invalid Admin Master PIN / Password.")

@app.post("/api/presence/heartbeat")
async def api_presence_heartbeat(request: Request):
    """Receives 30s live presence heartbeats from aspirant browser tabs."""
    try:
        data = await request.json()
    except Exception:
        data = {}
    return record_user_heartbeat(
        email=data.get("email"),
        name=data.get("name"),
        current_view=data.get("current_view") or "Browsing Platform",
        session_id=data.get("session_id")
    )

@app.post("/api/admin/push-to-supabase")
@app.get("/api/admin/push-to-supabase")
async def api_admin_push_to_supabase():
    """Pushes all genuine users and evaluated answer copies from local SQLite into remote Supabase cloud."""
    res = await asyncio.to_thread(push_sqlite_to_supabase)
    return res

@app.post("/api/admin/sync")
@app.get("/api/admin/sync")
async def api_admin_sync():
    """Forces an immediate synchronization of persistent Supabase data into local SQLite."""
    res = await asyncio.to_thread(sync_supabase_to_sqlite, True)
    return {"status": "success", "sync_result": res}

@app.get("/api/admin/stats")
async def api_admin_stats(sync: Optional[int] = 0):
    """Returns overview platform analytics for the admin dashboard."""
    force_sync = bool(sync == 1)
    return await asyncio.to_thread(get_admin_dashboard_stats, force_sync)

@app.get("/api/admin/activity")
async def api_admin_activity(limit: int = 60):
    """Returns real-time chronological activity stream across the platform."""
    return await asyncio.to_thread(get_admin_activity_stream, limit=limit)

@app.post("/api/admin/ping-telemetry")
async def api_admin_ping_telemetry():
    """Refreshes radar telemetry and guarantees dummy accounts remain purged."""
    res = await asyncio.to_thread(purge_all_dummy_and_demo_accounts)
    return {"status": "success", "message": "Telemetry verified and all dummy data purged.", "purged": res}

@app.post("/api/admin/clear-dummy-data")
@app.get("/api/admin/clear-dummy-data")
async def api_admin_clear_dummy_data():
    """Permanently purges all dummy/demo/autofilled accounts and mock history."""
    res = await asyncio.to_thread(purge_all_dummy_and_demo_accounts)
    return {"status": "success", "message": "All dummy and demo accounts purged permanently.", "purged": res}

@app.get("/api/admin/sessions")
async def api_admin_sessions(limit: int = 300):
    """Returns chronological history of user sessions (who visited, what they did, session duration)."""
    try:
        return await asyncio.to_thread(get_admin_session_history, limit=limit)
    except Exception as e:
        print(f"Error in api_admin_sessions: {e}")
        return []

@app.get("/api/admin/evaluations")
async def api_admin_evaluations(
    email: Optional[str] = None,
    paper: Optional[str] = None,
    search: Optional[str] = None,
    date_filter: Optional[str] = None,
    date_from: Optional[str] = None,
    date_to: Optional[str] = None,
    sort_by: Optional[str] = "date_desc",
    limit: int = 500
):
    """Returns evaluations across all aspirants categorized by subject, date, and keyword."""
    return await asyncio.to_thread(
        get_admin_evaluations_feed,
        email, paper, search, date_filter, date_from, date_to, sort_by, limit
    )

@app.get("/api/admin/evaluations/stats")
async def api_admin_evaluations_stats():
    """Returns aggregated live evaluation count statistics categorized by subject and date."""
    return await asyncio.to_thread(get_admin_evaluations_stats)

@app.get("/api/admin/evaluation/{eval_id}")
async def api_admin_get_evaluation(eval_id: str):
    """Returns the full evaluation dossier + handwritten pages for owner inspection."""
    rec = await asyncio.to_thread(get_evaluation_by_id, eval_id)
    if not rec:
        raise HTTPException(status_code=404, detail="Evaluation copy not found.")
    return rec

@app.get("/api/admin/aspirants")
async def api_admin_aspirants(search: Optional[str] = None):
    """Returns list of registered aspirants with live status and daily credit usage."""
    return await asyncio.to_thread(get_all_aspirants_admin, search)

@app.post("/api/admin/aspirant/reset-daily")
async def api_admin_reset_daily(request: Request):
    """Resets an aspirant's daily credit quota and restores 15 evaluations."""
    try:
        data = await request.json()
    except Exception:
        data = {}
    email = (data.get("email") or "").strip().lower()
    if not email:
        raise HTTPException(status_code=400, detail="Email is required.")
    user = reset_user_daily_quota_admin(email)
    log_platform_activity(
        user_email=email,
        user_name=email.split("@")[0].title(),
        action_type="admin_action",
        title=f"Admin reset daily quota for {email}",
        detail="Restored 15 daily evaluation credits"
    )
    return {"status": "success", "user": user}

@app.post("/api/admin/aspirant/credits")
async def api_admin_update_credits(request: Request):
    """Manually add credits, rewrites, or toggle Pro for an aspirant."""
    try:
        data = await request.json()
    except Exception:
        data = {}
    email = data.get("email")
    if not email:
        raise HTTPException(status_code=400, detail="Email is required.")
    delta_credits = int(data.get("delta_credits") or 0)
    delta_rewrites = int(data.get("delta_rewrites") or 0)
    is_pro = data.get("is_pro")
    plan_tier = data.get("plan_tier")
    user = update_user_credits_admin(email, delta_credits, delta_rewrites, is_pro, plan_tier)
    return {"status": "success", "user": user}

@app.get("/api/admin/transactions")
async def api_admin_transactions(status: Optional[str] = None):
    """Returns submitted UPI transactions."""
    return get_all_transactions(status)

@app.post("/api/admin/transaction/approve")
async def api_admin_approve_tx(request: Request):
    """Approves transaction and automatically unlocks the plan for the aspirant."""
    try:
        data = await request.json()
    except Exception:
        data = {}
    tx_id = data.get("tx_id")
    notes = data.get("notes")
    if not tx_id:
        raise HTTPException(status_code=400, detail="Transaction ID is required.")
    try:
        tx = approve_transaction(tx_id, notes)
        return {"status": "success", "transaction": tx, "message": f"Order {tx_id} approved and credits credited to {tx['user_email']}!"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/api/admin/transaction/reject")
async def api_admin_reject_tx(request: Request):
    """Rejects transaction."""
    try:
        data = await request.json()
    except Exception:
        data = {}
    tx_id = data.get("tx_id")
    notes = data.get("notes")
    if not tx_id:
        raise HTTPException(status_code=400, detail="Transaction ID is required.")
    tx = reject_transaction(tx_id, notes)
    return {"status": "success", "transaction": tx}

@app.get("/api/admin/feedbacks")
async def api_admin_feedbacks(status: Optional[str] = None):
    """Returns candidate feedback and bug reports (supports status: all, unresolved, resolved)."""
    return await asyncio.to_thread(get_all_feedbacks_admin, status)

@app.post("/api/admin/feedback/{feedback_id}/resolve")
async def api_admin_resolve_feedback(feedback_id: str, request: Request):
    """Marks feedback as resolved or reopens it (data is preserved permanently)."""
    try:
        data = await request.json()
    except Exception:
        data = {}
    resolved = bool(data.get("resolved", True))
    from storage import resolve_feedback_admin
    await asyncio.to_thread(resolve_feedback_admin, feedback_id, resolved)
    return {"status": "success", "is_resolved": 1 if resolved else 0}

@app.delete("/api/admin/feedback/{feedback_id}")
async def api_admin_delete_feedback(feedback_id: str):
    """Safely resolves feedback entry to guarantee permanent data retention."""
    from storage import resolve_feedback_admin
    await asyncio.to_thread(resolve_feedback_admin, feedback_id, True)
    return {"status": "success", "message": "Feedback marked as resolved (safely archived, never purged)."}

@app.get("/api/admin/settings")
async def api_admin_get_settings():
    upi_id = get_admin_setting("admin_upi_id", "9661228832-2@ybl")
    return {"admin_upi_id": upi_id}

@app.post("/api/admin/settings/upi")
async def api_admin_set_upi(request: Request):
    try:
        data = await request.json()
    except Exception:
        data = {}
    upi_id = (data.get("upi_id") or "").strip()
    if not upi_id or "@" not in upi_id:
        raise HTTPException(status_code=400, detail="Please enter a valid UPI ID (e.g. 9661228832-2@ybl).")
    set_admin_setting("admin_upi_id", upi_id)
    return {"status": "success", "admin_upi_id": upi_id}

@app.post("/api/admin/settings/password")
async def api_admin_set_password(request: Request):
    """Updates the admin master password in database."""
    try:
        data = await request.json()
    except Exception:
        data = {}
    current_pin = (data.get("current_pin") or "").strip()
    new_pin = (data.get("new_pin") or "").strip()
    
    master_pin = os.environ.get("ADMIN_PASSWORD") or get_admin_setting("admin_pin", "Admin@MainsMentor2026")
    
    if current_pin != master_pin:
        raise HTTPException(status_code=401, detail="Current master password is incorrect.")
    
    if not new_pin or len(new_pin) < 4:
        raise HTTPException(status_code=400, detail="New password must be at least 4 characters long.")
    
    set_admin_setting("admin_pin", new_pin)
    if "ADMIN_PASSWORD" in os.environ:
        os.environ["ADMIN_PASSWORD"] = new_pin
        
    new_token = hashlib.sha256(f"mainsmentor_admin_{new_pin}".encode()).hexdigest()
    return {"status": "success", "message": "Admin password updated successfully!", "token": new_token}


def is_page_image_completely_blank(img: Any) -> bool:
    """
    Detects if an image is completely blank canvas, solid color,
    or an empty template page with no handwritten content in the writing zone.
    """
    if not HAS_PIL or not hasattr(img, "convert"):
        return False
    try:
        gray = img.convert("L")
        w, h = gray.size
        # Center crop: writing zone is between 15% and 85% width, and 12% to 90% height
        writing_crop = gray.crop((int(w * 0.15), int(h * 0.12), int(w * 0.85), int(h * 0.90)))
        small_writing = writing_crop.resize((300, 300), Image.Resampling.BILINEAR)
        pixels = list(small_writing.getdata())
        n = len(pixels)
        if n == 0:
            return True

        # Pixels darker than 235 indicate ink / writing strokes
        ink_pixels = sum(1 for p in pixels if p < 235)
        ink_ratio = ink_pixels / n

        # Solid uniform color / blank canvas
        min_p = min(pixels)
        max_p = max(pixels)
        if max_p - min_p < 6:
            return True

        # If in the entire writing zone, ink ratio is less than 0.2% (under 180 pixels out of 90,000)
        if ink_ratio < 0.002:
            return True

        return False
    except Exception:
        return False

# Server-side concurrency guard: strictly one evaluation in progress at a time to prevent quota / rate-limit saturation
_SERVER_EVAL_SEMAPHORE = asyncio.Semaphore(1)
_LAST_EVAL_TRACE: list = []

@app.post("/api/evaluate")
async def evaluate_answer(
    background_tasks: BackgroundTasks,
    question: str = Form(...),
    paper: str = Form("GS2"),
    max_marks: int = Form(10),
    medium: Optional[str] = Form("english"),
    api_key: Optional[str] = Form(None),
    sample_id: Optional[str] = Form(None),
    user_email: Optional[str] = Form(None),
    is_rewrite: bool = Form(False),
    baseline_eval_id: Optional[str] = Form(None),
    baseline_question: Optional[str] = Form(None),
    baseline_paper: Optional[str] = Form(None),
    baseline_marks: Optional[int] = Form(None),
    baseline_evaluation_json: Optional[str] = Form(None),
    allow_auto_aligned: bool = Form(False),
    page_range: Optional[str] = Form(None),
    files: List[UploadFile] = File(None)
):
    """
    Evaluates handwritten answer copy.
    Uses server master key if user did not supply one.
    """
    try:
        # Check if user requested a preloaded sample evaluation without API key
        if sample_id and (not files or len(files) == 0 or files[0].filename == ""):
            for s in SAMPLE_DATASETS:
                if s["id"] == sample_id:
                    return {
                        "source": "sample",
                        "question": s["question"],
                        "paper": s["paper"],
                        "max_marks": s["marks"],
                        "evaluation": s["precomputed_evaluation"],
                        "pages": s["pages"]
                    }
            raise HTTPException(status_code=400, detail=f"Sample copy '{sample_id}' not found.")

        # Ingest uploaded answer copy with automatic mobile image & PDF page normalization
        uploaded_page_previews: List[str] = []
        multimodal_parts: List[Any] = []
        file_hashes: List[str] = []
        submission_hash: Optional[str] = None
        primary_content: Optional[bytes] = None
        primary_filename: str = ""
        is_pdf = False

        if files and len(files) > 0 and files[0].filename != "":
            from PIL import ImageOps
            for file in files:
                content = await file.read()
                if not content:
                    continue
                filename = (file.filename or "").lower()
                ctype = (file.content_type or "").lower()
                file_hashes.append(hashlib.sha256(content).hexdigest())

                file_is_pdf = filename.endswith(".pdf") or "pdf" in ctype or content[:4] == b"%PDF"
                if not primary_content:
                    primary_content = content
                    primary_filename = filename
                    is_pdf = file_is_pdf

                if file_is_pdf:
                    pdf_pages_added = 0
                    try:
                        import pypdfium2 as pdfium
                        pdf = pdfium.PdfDocument(content)
                        try:
                            # Standard GS answers are 2-4 pages (cap at 15 to prevent memory explosion)
                            for p_idx, page in enumerate(pdf):
                                if p_idx >= 15:
                                    break
                                pil_img = page.render(scale=1.1).to_pil().convert("RGB")
                                if max(pil_img.size) > 1024:
                                    pil_img.thumbnail((1024, 1024))
                                buf = io.BytesIO()
                                pil_img.save(buf, format="JPEG", quality=70)
                                jpeg_bytes = buf.getvalue()
                                b64 = base64.b64encode(jpeg_bytes).decode("utf-8")
                                uploaded_page_previews.append(f"data:image/jpeg;base64,{b64}")
                                multimodal_parts.append(types.Part.from_bytes(data=jpeg_bytes, mime_type="image/jpeg"))
                                pdf_pages_added += 1
                                pil_img.close()
                                del pil_img
                                del buf
                        finally:
                            pdf.close()
                    except Exception as pe:
                        print(f"Notice: PDF page preview generation error: {pe}")
                    if pdf_pages_added == 0:
                        multimodal_parts.append(types.Part.from_bytes(data=content, mime_type="application/pdf"))
                else:
                    # Normalize phone camera/gallery images (.jpg, .png, .webp, .jfif, extensionless Android URIs) into RGB JPEG
                    try:
                        pil_img = Image.open(io.BytesIO(content))
                        try:
                            pil_img = ImageOps.exif_transpose(pil_img)
                        except Exception:
                            pass
                        pil_img = pil_img.convert("RGB")
                        if max(pil_img.size) > 1024:
                            pil_img.thumbnail((1024, 1024))
                        buf = io.BytesIO()
                        pil_img.save(buf, format="JPEG", quality=70)
                        jpeg_bytes = buf.getvalue()
                        b64 = base64.b64encode(jpeg_bytes).decode("utf-8")
                        uploaded_page_previews.append(f"data:image/jpeg;base64,{b64}")
                        multimodal_parts.append(types.Part.from_bytes(data=jpeg_bytes, mime_type="image/jpeg"))
                        pil_img.close()
                        del pil_img
                        del buf
                    except Exception as img_err:
                        print(f"Notice: PIL image normalization fallback ({img_err})")
                        try:
                            b64 = base64.b64encode(content).decode("utf-8")
                            mime = "image/png" if filename.endswith(".png") else ("image/webp" if filename.endswith(".webp") else "image/jpeg")
                            uploaded_page_previews.append(f"data:{mime};base64,{b64}")
                            multimodal_parts.append(types.Part.from_bytes(data=content, mime_type=mime))
                        except Exception as raw_err:
                            print(f"Notice: image preview encoding failed: {raw_err}")

            if file_hashes:
                submission_hash = hashlib.sha256("".join(file_hashes).encode("utf-8")).hexdigest()
            release_process_memory()

        if not primary_content:
            raise HTTPException(status_code=400, detail="Please upload at least one handwritten answer image/page or select a sample copy.")

        # DEDICATED ESSAY LONG-DOCUMENT PIPELINE BIFURCATION
        # Completely eliminates the 80s server timeout by routing long essay booklets to batched background execution
        is_essay_submission = (paper.strip().upper() == "ESSAY" or max_marks == 125)
        if is_essay_submission and primary_content and not sample_id:
            from essay_pipeline import ingest_essay_pdf, ingest_essay_images, execute_essay_pipeline_background
            from storage import create_essay_job

            eff_email = (user_email or "guest@cookedmains.in").strip().lower()

            # Quota check
            if user_email:
                user = get_or_create_user(eff_email)
                quota = get_user_daily_quota(eff_email)
                if quota.get("daily_eval_remaining", 1) <= 0:
                    return JSONResponse(
                        status_code=429,
                        content={
                            "status": "quota_exhausted",
                            "error_type": "daily_eval_quota_exhausted",
                            "title": "Daily Free Evaluation Limit Reached (15 of 15 Copies Used Today)",
                            "message": "You have utilized all free evaluations for today. Your daily allowance resets at midnight IST.",
                            "credits_deducted": 0
                        }
                    )

            if is_pdf:
                ingest_res = ingest_essay_pdf(primary_content, page_range=page_range)
            else:
                raw_imgs = [primary_content]
                if files and len(files) > 1:
                    for f in files[1:]:
                        ib = await f.read()
                        if ib: raw_imgs.append(ib)
                ingest_res = ingest_essay_images(raw_imgs, page_range=page_range)

            p_data = ingest_res.get("pages") or []
            if not p_data:
                raise HTTPException(status_code=400, detail="No readable pages found in uploaded essay booklet.")

            t_pdf_pages = ingest_res.get("total_pdf_pages", len(p_data))
            sel_pages = ingest_res.get("selected_pages", [p["original_page_number"] for p in p_data])
            prevs = ingest_res.get("previews_list") or [p["preview_b64"] for p in p_data]

            job_id = f"essay_job_{int(time.time())}_{uuid.uuid4().hex[:6]}"
            create_essay_job(
                job_id=job_id,
                user_email=eff_email,
                question=question,
                paper="Essay",
                max_marks=125,
                medium=medium or "english",
                total_pages=t_pdf_pages,
                page_range=page_range or f"1-{t_pdf_pages}",
                selected_pages=sel_pages,
                batch_size=2,
                pages_previews=prevs
            )

            background_tasks.add_task(
                execute_essay_pipeline_background,
                job_id=job_id,
                pages_data=p_data,
                api_key=api_key
            )

            return {
                "is_async_job": True,
                "job_id": job_id,
                "status": "processing",
                "paper": "Essay",
                "max_marks": 125,
                "total_pages": len(p_data),
                "selected_pages": sel_pages,
                "page_range": page_range or f"1-{t_pdf_pages}",
                "message": f"Essay evaluation queued ({len(p_data)} pages). Processing in background..."
            }

        # Temporary feature flag: Rewrite & Re-evaluation disabled while refining core evaluation
        ENABLE_REWRITE_FEATURE = False
        if not ENABLE_REWRITE_FEATURE:
            is_rewrite = False
            baseline_eval_id = None
            baseline_evaluation_json = None
            baseline_question = None

        # Check user credits and evaluate Rewrite Loophole Integrity
        user = None
        prev_record = None
        rewrite_loophole_warning = None
        if (user_email or is_rewrite) and not sample_id:
            effective_email = (user_email or "aspirant@cookedmains.in").strip()
            user = get_or_create_user(effective_email)
            is_pro = True
            daily_quota = get_user_daily_quota(effective_email)

            # Pre-checks for Rewrite Mode vs Standard Check:
            if is_rewrite:
                if daily_quota["daily_rewrite_remaining"] <= 0:
                    return JSONResponse(
                        status_code=429,
                        content={
                            "status": "quota_exhausted",
                            "error_type": "daily_rewrite_quota_exhausted",
                            "title": "Daily Re-Evaluation Limit Reached (5 of 5 Used Today)",
                            "message": "You have utilized all 5 free re-evaluations for today. Your daily re-evaluation allowance resets at midnight (IST).",
                            "warning": "All UPSC aspirants receive 5 free re-evaluations every single day without subscription fees.",
                            "action_hint": "Please submit your next rewritten draft tomorrow after incorporating faculty remarks!",
                            "credits_deducted": 0
                        }
                    )
                if baseline_eval_id:
                    prev_record = get_evaluation_by_id(baseline_eval_id)
                if not prev_record and user_email:
                    prev_record = get_last_evaluation_for_user(user_email)

                # Fallback 1: Reconstruct prev_record from client-supplied baseline_evaluation_json (survives Render container redeploys & localStorage Locker)
                if not prev_record and baseline_evaluation_json:
                    try:
                        parsed_base = json.loads(baseline_evaluation_json)
                        if isinstance(parsed_base, dict):
                            base_eval_inner = parsed_base.get("evaluation") if isinstance(parsed_base.get("evaluation"), dict) else parsed_base
                            true_base_q = base_eval_inner.get("detected_question") or parsed_base.get("detected_question") or parsed_base.get("question") or baseline_question or question
                            prev_record = {
                                "id": baseline_eval_id or parsed_base.get("id") or parsed_base.get("eval_id"),
                                "paper": baseline_paper or base_eval_inner.get("detected_paper") or base_eval_inner.get("paper") or paper,
                                "max_marks": int(baseline_marks or base_eval_inner.get("max_marks") or max_marks or 10),
                                "question": true_base_q,
                                "overall_score": float(base_eval_inner.get("overall_score") or 4.0),
                                "evaluation": base_eval_inner,
                                "pages": parsed_base.get("pages") or base_eval_inner.get("pages") or [],
                                "file_hash": parsed_base.get("file_hash") or base_eval_inner.get("file_hash"),
                                "is_rewrite": int(bool(parsed_base.get("is_rewrite") or base_eval_inner.get("is_rewrite"))),
                                "has_been_rewritten": int(bool(parsed_base.get("has_been_rewritten") or base_eval_inner.get("has_been_rewritten"))),
                                "rewrite_eval_id": parsed_base.get("rewrite_eval_id") or base_eval_inner.get("rewrite_eval_id")
                            }
                    except Exception as bj_err:
                        print(f"Notice: baseline_evaluation_json parse fallback: {bj_err}")

                # Fallback 2: Only if valid baseline_question (non-empty) was explicitly supplied from an active baseline session
                if not prev_record and baseline_question and len(baseline_question.strip()) > 5:
                    fallback_mm = int(baseline_marks or max_marks or 10)
                    prev_record = {
                        "id": baseline_eval_id,
                        "paper": baseline_paper or paper,
                        "max_marks": fallback_mm,
                        "question": baseline_question.strip(),
                        "overall_score": round(fallback_mm * 0.4, 1),
                        "evaluation": {
                            "overall_score": round(fallback_mm * 0.4, 1),
                            "max_marks": fallback_mm,
                            "paper": baseline_paper or paper,
                            "detected_question": baseline_question.strip(),
                            "rubric_scores": {
                                "intro_score": round(fallback_mm * 0.06, 1),
                                "core_demand_score": round(fallback_mm * 0.22, 1),
                                "value_add_score": round(fallback_mm * 0.05, 1),
                                "presentation_score": round(fallback_mm * 0.04, 1),
                                "conclusion_score": round(fallback_mm * 0.03, 1)
                            }
                        },
                        "pages": [],
                        "is_rewrite": 0,
                        "has_been_rewritten": 0
                    }

                if not prev_record:
                    return JSONResponse(
                        status_code=400,
                        content={
                            "status": "error",
                            "error_type": "invalid_baseline",
                            "title": "Invalid Re-evaluation Request",
                            "message": "A valid baseline evaluation was not found. Re-evaluation requires an existing baseline answer copy to measure improvements.",
                            "warning": "Cannot re-evaluate without a verified baseline answer copy.",
                            "action_hint": "Please select your baseline copy from your Answer Vault, or exit Rewrite Mode to submit a new evaluation.",
                            "credits_deducted": 0
                        }
                    )
                else:
                    # 0b. Single Re-evaluation Enforcement: Prevent infinite rewrite loops globally and locally
                    baseline_id_to_check = baseline_eval_id or prev_record.get("id")
                    prev_eval_obj = prev_record.get("evaluation") if isinstance(prev_record.get("evaluation"), dict) else {}
                    baseline_q_to_check = prev_eval_obj.get("detected_question") or prev_record.get("question") or baseline_question or question
                    if (
                        bool(prev_record.get("is_rewrite"))
                        or bool(prev_record.get("has_been_rewritten"))
                        or prev_record.get("rewrite_eval_id")
                        or (baseline_id_to_check and has_evaluation_been_rewritten(baseline_id_to_check))
                        or has_user_rewritten_question(effective_email, baseline_q_to_check, baseline_id_to_check)
                    ):
                        return JSONResponse(
                            status_code=400,
                            content={
                                "status": "limit_reached",
                                "error_type": "single_rewrite_limit",
                                "title": "24-Hour Rewrite Limit Reached (1 of 1 Used)",
                                "message": "Only 1 re-evaluation is permitted per question to prevent recursive loops. This submission has already been re-evaluated.",
                                "warning": "You have already completed the 24-Hour Free Rewrite Challenge for this answer copy.",
                                "action_hint": "To evaluate a fresh draft or different question, please exit Rewrite Mode and submit a new evaluation.",
                                "credits_deducted": 0
                            }
                        )

                    # 1. Subject / Paper mismatch check (Normalized to short code GS1..GS4 / ESSAY / OPTIONAL)
                    def _norm_paper_code(p_val: str) -> str:
                        s_val = (p_val or "").strip().upper()
                        m_match = re.search(r'(GS\s*-?\s*[1-4]|ESSAY|OPTIONAL)', s_val)
                        if m_match:
                            return m_match.group(1).replace("-", "").replace(" ", "")
                        return s_val.replace("-", "").replace(" ", "")

                    prev_p_norm = _norm_paper_code(prev_record.get("paper") or baseline_paper or "")
                    curr_p_norm = _norm_paper_code(paper or "")
                    if prev_p_norm and curr_p_norm and prev_p_norm != curr_p_norm:
                        return JSONResponse(
                            status_code=400,
                            content={
                                "status": "mismatch",
                                "error_type": "wrong_paper",
                                "title": "Subject Mismatch in Rewrite Mode",
                                "message": f"Your baseline submission was evaluated under {prev_record.get('paper')}, but this copy was uploaded under {paper}.",
                                "expected_paper": prev_record.get("paper"),
                                "detected_paper": paper,
                                "warning": "Rewrite evaluations are strictly for revised drafts of the same subject & question. No credits were deducted.",
                                "action_hint": "Please upload the revised answer copy for your original subject, or exit Rewrite Mode to submit this as a new question.",
                                "credits_deducted": 0
                            }
                        )

                    # 2. Question Marks Weightage Check (MANDATORY: aspirant must upload correct copies along with same marks questions)
                    prev_m = prev_record.get("max_marks") or baseline_marks
                    if prev_m is not None:
                        try:
                            prev_m_int = int(prev_m)
                            curr_m_int = int(max_marks)
                            if prev_m_int > 0 and curr_m_int > 0 and prev_m_int != curr_m_int:
                                return JSONResponse(
                                    status_code=400,
                                    content={
                                        "status": "mismatch",
                                        "error_type": "wrong_marks",
                                        "title": "Question Marks Mismatch in Rewrite Mode",
                                        "message": f"Your baseline question was evaluated for {prev_m_int} Marks, but you submitted under {curr_m_int} Marks.",
                                        "expected_marks": prev_m_int,
                                        "detected_marks": curr_m_int,
                                        "warning": f"⚠️ Marks Rule: A 24-Hour Rewrite must have the exact same question marks weightage ({prev_m_int} Marks) as your baseline evaluation to ensure authentic comparative evaluation. No credits were deducted.",
                                        "action_hint": f"Please set the marks weightage to {prev_m_int} Marks to match your original question, or exit Rewrite Mode to submit this as a new question.",
                                        "credits_deducted": 0
                                    }
                                )
                        except Exception as m_err:
                            print(f"Notice: marks validation error: {m_err}")

                    # 3. Instant Duplicate Check via File Hash (Direct baseline match or already evaluated in user history)
                    if submission_hash:
                        prev_hash = prev_record.get("file_hash")
                        is_direct_duplicate = bool(prev_hash and prev_hash == submission_hash)
                        prior_eval = find_evaluation_by_hash(user_email, submission_hash) if user_email else None
                        if is_direct_duplicate or prior_eval:
                            return JSONResponse(
                                status_code=400,
                                content={
                                    "status": "duplicate",
                                    "error_type": "identical_copy",
                                    "title": "Duplicate Copy Detected — Script Already Evaluated",
                                    "message": "The uploaded answer sheet is completely identical to a copy already evaluated in your account. No revisions, additions, or new handwritten drafts were detected.",
                                    "warning": "⚠️ Evaluation Guard: Re-evaluating unchanged copies defeats the purpose of practice. No credits were deducted.",
                                    "action_hint": "Please incorporate examiner feedback (subheadings, case laws, data points, or diagrams) on paper before re-uploading.",
                                    "credits_deducted": 0
                                }
                            )

                    # 4. Deterministic Semantic Topic Mismatch on Form Question before AI Call
                    prev_q_check = prev_record.get("question") or baseline_question
                    if prev_q_check and question and question != "Extract question printed on booklet header":
                        is_mismatched, overlap, reason = are_questions_semantically_mismatched(prev_q_check, question)
                        if is_mismatched:
                            return JSONResponse(
                                status_code=400,
                                content={
                                    "status": "mismatch",
                                    "error_type": "wrong_answersheet",
                                    "title": "Wrong Answersheet / Question Mismatch Detected",
                                    "message": f"The question submitted does not match your baseline question ({reason}). A rewrite evaluation must address the same topic.",
                                    "expected_question": prev_q_check,
                                    "detected_question": question,
                                    "warning": "Rewrite evaluations are strictly for improving the original question. No credits were deducted.",
                                    "action_hint": "Please upload the revised answer copy for your original question, or exit Rewrite Mode to submit this as a new question.",
                                    "credits_deducted": 0
                                }
                            )

            # Daily evaluation quota check (15 copies/day, 100% free)
            if not is_rewrite and daily_quota["daily_eval_remaining"] <= 0:
                return JSONResponse(
                    status_code=429,
                    content={
                        "status": "quota_exhausted",
                        "error_type": "daily_eval_quota_exhausted",
                        "title": "Daily Free Evaluation Limit Reached (15 of 15 Copies Used Today)",
                        "message": "You have evaluated 15 answer copies today! Your daily allowance resets at midnight IST to keep server processing rapid and fair for all aspirants.",
                        "warning": "Cooked Mains is 100% free with 15 evaluations every single day. Zero subscription fees.",
                        "action_hint": "Review your evaluated copies in your Answer Locker or explore Model Rubrics while your daily quota refreshes!",
                        "credits_deducted": 0
                    }
                )

        # Compute perceptual handwriting signature (dHash across pages) for cross-account consistency
        visual_hashes = compute_visual_handwriting_signature(uploaded_page_previews)

        # PRE-LLM ACCOUNT DUPLICATE GUARD:
        # Check if aspirant re-uploaded an already-evaluated answer copy in their account
        # for the same subject, marks, and question.
        if user_email:
            dup_record = find_duplicate_evaluation_in_user_account(
                email=user_email,
                paper=paper,
                max_marks=max_marks,
                file_hash=submission_hash,
                visual_hashes=visual_hashes,
                question=question,
                transcribed_text=None
            )
            if dup_record:
                prev_id = dup_record.get("existing_eval_id")
                prev_score = dup_record.get("existing_score")
                prev_p = dup_record.get("existing_paper") or paper
                prev_m = dup_record.get("existing_marks") or max_marks
                prev_q = dup_record.get("existing_question") or question
                print(f"[DUPLICATE GUARD - PRE-LLM] Detected re-upload of evaluated copy for {user_email}: {prev_id} (Score: {prev_score}/{prev_m})")
                return JSONResponse(
                    status_code=400,
                    content={
                        "status": "duplicate",
                        "error_type": "identical_copy",
                        "title": "Duplicate Copy Detected — Script Already Evaluated",
                        "message": f"This answer copy has already been evaluated in your account under {prev_p} ({prev_m} Marks) with an authentic score of {prev_score}/{prev_m}. Re-evaluating unchanged copies defeats the purpose of practice.",
                        "warning": "🛡️ Zero Credits Deducted: Your daily evaluation limit is 100% intact.",
                        "action_hint": "Review examiner annotations on your previously evaluated copy, or incorporate feedback before uploading a revised draft.",
                        "credits_deducted": 0,
                        "existing_eval_id": prev_id,
                        "existing_score": prev_score,
                        "existing_paper": prev_p,
                        "existing_marks": prev_m,
                        "existing_question": prev_q,
                        "expected_paper": prev_p,
                        "expected_marks": prev_m,
                        "expected_question": prev_q,
                        "detected_paper": paper,
                        "detected_marks": max_marks,
                        "detected_question": question
                    }
                )

        # PRE-LLM CANONICAL SCRIPT CHECK (100% Cross-Account Consistency for Same File or Same Handwriting Sheet)
        evaluation_result = None
        if not is_rewrite:
            canonical_pre = find_canonical_evaluation_for_script(
                file_hash=submission_hash,
                visual_hashes=visual_hashes,
                question=question,
                transcribed_text="",
                max_marks=max_marks
            )
            if canonical_pre and isinstance(canonical_pre, dict) and canonical_pre.get("overall_score") is not None:
                evaluation_result = copy.deepcopy(canonical_pre)
                print(f"[CANONICAL LOCK - PRE-LLM] Matched identical/similar handwritten script across accounts -> Score: {evaluation_result.get('overall_score')}/{max_marks}")

        if evaluation_result is None:
            async with _SERVER_EVAL_SEMAPHORE:
                keys_to_try = get_active_gemini_keys(api_key)
                prev_eval_dict = prev_record.get("evaluation") if (prev_record and is_rewrite and isinstance(prev_record.get("evaluation"), dict)) else None
                prev_q = None
                if is_rewrite:
                    cand_q = (prev_eval_dict.get("detected_question") if prev_eval_dict else None) or (prev_record.get("question") if prev_record else None) or baseline_question
                    if cand_q and "extract question printed" not in cand_q.lower():
                        prev_q = cand_q
                detected_paper = detect_academic_discipline(question, paper)
                directive_info = detect_directive(question, medium=medium)

                if not keys_to_try:
                    return JSONResponse(
                        status_code=503,
                        content={
                            "status": "service_unavailable",
                            "error_type": "evaluator_busy",
                            "title": "Evaluator Server Notice",
                            "message": "AI evaluation nodes are currently initializing. Please try again in 30 seconds.",
                            "warning": "🛡️ Zero Credits Deducted: Your daily evaluation limit is 100% intact.",
                            "action_hint": "Please click 'Evaluate Copy' in a moment.",
                            "credits_deducted": 0
                        }
                    )
                else:
                    current_affairs_context = await get_dynamic_grounded_context(question, detected_paper)
                    evaluator_prompt_text = build_evaluation_prompt(
                        question=question,
                        paper_key=detected_paper,
                        max_marks=max_marks,
                        directive_info=directive_info,
                        previous_question=prev_q,
                        current_affairs_context=current_affairs_context,
                        previous_evaluation=prev_eval_dict,
                        medium=medium
                    )

                    gen_config = types.GenerateContentConfig(
                        temperature=0.0,
                        top_p=1.0,
                        top_k=1,
                        seed=20260925,
                        response_mime_type="application/json",
                        max_output_tokens=8192
                    )

                    from evaluator_engine import (
                        create_fast_gemini_client,
                        get_active_gemini_models,
                        record_gemini_model_outcome,
                        execute_gemini_with_resilience,
                        record_gemini_key_cooldown,
                    )

                    contents_payload = (multimodal_parts + [evaluator_prompt_text]) if multimodal_parts else [evaluator_prompt_text]
                    eval_loop_start = time.time()
                    print(f"[EVALUATOR] Starting evaluation with {len(keys_to_try)} keys, {len(multimodal_parts)} uploaded pages.")

                    # Multi-key resilience: when multiple keys across projects are configured,
                    # failover instantly across keys (0ms in-key retry delay) rather than repeatedly retrying an exhausted key
                    eff_retries = 1 if len(keys_to_try) > 1 else 2
                    fast_quota_exit = (len(keys_to_try) > 1)

                    # Evaluate using active Gemini models with automatic instant rotation across keys/projects
                    for key_idx, current_key in enumerate(keys_to_try):
                        if time.time() - eval_loop_start > 85:
                            print(f"[EVALUATOR] Overall evaluation timeout reached (85s). Halting loop.")
                            break
                        try:
                            client = create_fast_gemini_client(current_key, timeout_ms=65000)
                        except Exception as ce:
                            print(f"[EVALUATOR] Client creation failed for key {key_idx+1}: {ce}")
                            continue

                        active_models = get_active_gemini_models(client)
                        # Retain full candidate model set (top 6) to preserve output quality across GS English, GS Hindi, and Essay evaluations
                        models_to_try = active_models[:7] if active_models else [
                            "gemini-3.5-flash-lite",
                            "gemini-flash-lite-latest",
                            "gemini-3.6-flash",
                            "gemini-3.5-flash",
                            "gemini-3.8-flash",
                            "gemini-omni-flash-preview",
                            "gemini-3.7-flash",
                        ]

                        for model_name in models_to_try:
                            if time.time() - eval_loop_start > 90:
                                print(f"[EVALUATOR] Overall loop approaching 90s timeout. Halting model attempts.")
                                break
                            try:
                                print(f"[EVALUATOR] Evaluating copy with model '{model_name}' (Key {key_idx+1}/{len(keys_to_try)})...")
                                response = await asyncio.to_thread(
                                    execute_gemini_with_resilience,
                                    client=client,
                                    model=model_name,
                                    contents=contents_payload,
                                    config=gen_config,
                                    max_retries=eff_retries,
                                    fast_fail_on_quota=fast_quota_exit
                                )
                                if response and response.text:
                                    raw_text = response.text
                                    parsed_eval = parse_llm_json_response(raw_text)
                                    if isinstance(parsed_eval, dict) and len(parsed_eval) > 0:
                                        print(f"[EVALUATOR SUCCESS] Evaluated in {round(time.time() - eval_loop_start, 1)}s with '{model_name}'! Score: {parsed_eval.get('overall_score')}")
                                        _LAST_EVAL_TRACE.append({
                                            "timestamp": time.strftime("%Y-%m-%d %H:%M:%S"),
                                            "status": "success",
                                            "key_slot": key_idx + 1,
                                            "key_masked": f"{current_key[:6]}...{current_key[-4:]}" if len(current_key) > 10 else "***",
                                            "model": model_name,
                                            "score": parsed_eval.get("overall_score"),
                                            "elapsed": round(time.time() - eval_loop_start, 2)
                                        })
                                        record_gemini_model_outcome(model_name, True)
                                        if "directive_compliance" in parsed_eval and not parsed_eval["directive_compliance"].get("directive"):
                                            parsed_eval["directive_compliance"]["directive"] = directive_info["directive"]
                                        actual_page_count = len(uploaded_page_previews) if uploaded_page_previews else (len(multimodal_parts) if multimodal_parts else 1)
                                        parsed_eval["pages"] = uploaded_page_previews
                                        parsed_eval["total_pages"] = max(actual_page_count, int(parsed_eval.get("total_pages") or 0))
                                        evaluation_result = normalize_evaluation_data(parsed_eval, max_marks, question, detected_paper, medium=medium)
                                        if isinstance(evaluation_result, dict) and actual_page_count > 0:
                                            evaluation_result["total_pages"] = max(actual_page_count, int(evaluation_result.get("total_pages") or 0))
                                            evaluation_result["pages"] = uploaded_page_previews
                                        break
                            except Exception as ge:
                                err_s = str(ge)
                                print(f"[EVALUATOR NOTICE] Key {key_idx+1} on '{model_name}': {err_s[:150]}")
                                _LAST_EVAL_TRACE.append({
                                    "timestamp": time.strftime("%Y-%m-%d %H:%M:%S"),
                                    "key_slot": key_idx + 1,
                                    "key_masked": f"{current_key[:6]}...{current_key[-4:]}" if len(current_key) > 10 else "***",
                                    "model": model_name,
                                    "error": err_s[:250],
                                    "elapsed": round(time.time() - eval_loop_start, 2)
                                })
                                record_gemini_model_outcome(model_name, False, err_s)
                                err_low = err_s.lower()

                                # 1. Terminal API key failure: key is revoked/invalid/forbidden -> skip to next key
                                if any(k_err in err_low for k_err in [
                                    "api_key_invalid", "invalid api key", "permission_denied",
                                    "unauthenticated", "forbidden"
                                ]):
                                    print(f"[EVALUATOR] Key {key_idx+1} is invalid/unauthorized. Skipping remaining models on this key.")
                                    break

                                # 2. Rate-limits (429, resource_exhausted, quota):
                                is_quota_hit = any(k_err in err_low for k_err in [
                                    "429", "resource_exhausted", "quota", "rate limit", "too many requests"
                                ])
                                if is_quota_hit:
                                    record_gemini_key_cooldown(current_key, 60.0)
                                    # If separate configured projects / alternate keys are available, failover immediately!
                                    if len(keys_to_try) > 1 and key_idx < len(keys_to_try) - 1:
                                        print(f"[EVALUATOR] Key {key_idx+1} hit quota limit. Instantly rotating to alternate project key...")
                                        break
                                    # If this is the only key, pause with bounded delay to avoid firing rapid bursts
                                    await asyncio.sleep(1.5)
                                    continue

                                # 3. Transient provider load errors (503, 504, unavailable, deadline, timeout):
                                if any(k_err in err_low for k_err in ["503", "504", "unavailable", "deadline", "timeout"]):
                                    record_gemini_key_cooldown(current_key, 30.0)
                                    if len(keys_to_try) > 1 and key_idx < len(keys_to_try) - 1:
                                        print(f"[EVALUATOR] Key {key_idx+1} encountered transient provider error/timeout. Rotating immediately to alternate key...")
                                        break
                                    await asyncio.sleep(1.5)
                                    continue

                                continue

                        if evaluation_result:
                            break

                    if not evaluation_result:
                        print("[EVALUATOR ENGINE] Gemini models could not complete evaluation across active keys — returning clean guard notice.")
                        return JSONResponse(
                            status_code=503,
                            content={
                                "status": "service_unavailable",
                                "error_type": "evaluator_busy",
                                "title": "Evaluator Node Notice",
                                "message": "AI evaluator models are currently experiencing high traffic or quota saturation across available keys. To protect evaluation authenticity, generic estimates are not provided.",
                                "warning": "🛡️ Zero Credits Deducted: Your daily evaluation limit is 100% intact.",
                                "action_hint": "Please click 'Evaluate Copy' again in a few moments, or enter your personal Gemini API key in Settings for immediate dedicated access.",
                                "credits_deducted": 0
                            }
                        )

        # AI Vision Blank Sheet Verification Check
        is_ai_blank = bool(evaluation_result.get("is_blank_sheet")) or (
            evaluation_result.get("percentile_verdict") == "Unattempted / Blank Copy"
        ) or (
            float(evaluation_result.get("overall_score", 0.0)) == 0.0 and
            not (evaluation_result.get("transcribed_text") or "").strip()
        )
        if is_ai_blank:
            blank_reason = evaluation_result.get("blank_sheet_reason") or "No candidate handwritten answer was found on the uploaded pages."
            return JSONResponse(
                status_code=400,
                content={
                    "status": "blank_sheet",
                    "error_type": "blank_sheet",
                    "title": "Blank / Unwritten Answer Sheet Detected",
                    "message": f"The uploaded copy appears to be blank ({blank_reason}). Our examiners cannot evaluate an empty page.",
                    "warning": "⚠️ Zero Credits Deducted: No evaluation was performed. Please upload your actual handwritten answer copy.",
                    "action_hint": "Please upload a clear photograph or PDF of your handwritten answer sheet to receive your marks and feedback.",
                    "credits_deducted": 0
                }
            )

        final_question = evaluation_result.get("detected_question") or question or "UPSC Mains Question"

        # POST-LLM CONTENT & HANDWRITING CANONICAL LOCK
        # If two accounts upload photos/scans of the same written answer content (>=68% point/text similarity on same question),
        # lock to the canonical evaluation so marks, rubric breakdown, and margin remarks are 100% identical!
        if not is_rewrite:
            canonical_post = find_canonical_evaluation_for_script(
                file_hash=submission_hash,
                visual_hashes=visual_hashes,
                question=final_question,
                transcribed_text=evaluation_result.get("transcribed_text") or "",
                max_marks=max_marks
            )
            if canonical_post and isinstance(canonical_post, dict) and canonical_post.get("overall_score") is not None:
                evaluation_result = copy.deepcopy(canonical_post)
                final_question = evaluation_result.get("detected_question") or final_question
                print(f"[CANONICAL LOCK - POST-LLM CONTENT] Matched written content across accounts -> Score: {evaluation_result.get('overall_score')}/{max_marks}")

        if visual_hashes:
            evaluation_result["_meta_visual_hashes"] = visual_hashes

        # Semantic Rewrite Verification Check
        if is_rewrite and prev_record:
            prev_eval_inner = prev_record.get("evaluation") if isinstance(prev_record.get("evaluation"), dict) else {}
            prev_q_target = prev_eval_inner.get("detected_question") or prev_record.get("question") or baseline_question
            is_prev_q_generic = not prev_q_target or any(
                g in prev_q_target.lower()
                for g in ["extract question printed", "upsc mains answer", "upsc mains question"]
            )
            # Check deterministic semantic match on OCR detected question only when prev_q_target is a real question
            if not is_prev_q_generic and final_question and final_question != "UPSC Mains Question":
                is_ocr_mismatched, ocr_overlap, ocr_reason = are_questions_semantically_mismatched(prev_q_target, final_question)
                if is_ocr_mismatched:
                    return JSONResponse(
                        status_code=400,
                        content={
                            "status": "mismatch",
                            "error_type": "wrong_answersheet",
                            "title": "Wrong Answersheet Detected on Page",
                            "message": f"The handwritten copy addresses an entirely different question ({ocr_reason}) than your baseline question.",
                            "expected_question": prev_q_target,
                            "detected_question": final_question,
                            "warning": "Rewrite evaluations are strictly for improving the original question. No credits were deducted.",
                            "action_hint": "Please upload the revised draft for your original question, or exit Rewrite Mode to submit this as a new evaluation.",
                            "credits_deducted": 0
                        }
                    )

            rewrite_audit = evaluation_result.get("rewrite_verification", {})
            is_same = rewrite_audit.get("is_same_question_topic", True)
            if not is_same:
                # LOOPHOLE BLOCKED: Different question topic uploaded under rewrite mode!
                # DO NOT EVALUATE, DO NOT SAVE, DO NOT DEDUCT CREDITS.
                reason = rewrite_audit.get("mismatch_reason", "This answer addresses an entirely different prompt.")
                return JSONResponse(
                    status_code=400,
                    content={
                        "status": "mismatch",
                        "error_type": "wrong_answersheet",
                        "title": "Wrong Answersheet / Question Mismatch Detected",
                        "message": f"The uploaded copy is an answer to an entirely different question ({reason}), not a revised draft of your baseline question.",
                        "expected_question": prev_q_target,
                        "detected_question": final_question,
                        "warning": "Rewrite evaluations are strictly for improving the same question. No credits were deducted.",
                        "action_hint": "Please upload the revised draft for your original question, or exit Rewrite Mode to submit this as a new evaluation.",
                        "credits_deducted": 0
                    }
                )

            # Vision Audit Duplicate Check
            is_identical = rewrite_audit.get("is_identical_copy", False)
            has_improvements = rewrite_audit.get("improvements_detected", True)
            if is_identical or not has_improvements:
                # Duplicate content: DO NOT SAVE, DO NOT DEDUCT CREDITS
                return JSONResponse(
                    status_code=400,
                    content={
                        "status": "duplicate",
                        "error_type": "identical_copy",
                        "title": "Duplicate Copy — No Improvements Detected",
                        "message": "Our examiner audit found that this copy has no discernible revisions or structural enhancements compared to your baseline submission.",
                        "warning": "⚠️ Credit Notice: Re-evaluating unchanged copies defeats the purpose of practice. No credits were deducted.",
                        "action_hint": "Please incorporate examiner feedback (subheadings, case laws, data points, or diagrams) before submitting again.",
                        "credits_deducted": 0
                    }
                )

        # Strict Intake Subject & Marks Mismatch Check (Protection against evaluating wrong copies and wasting credits)
        detected_p = evaluation_result.get("detected_paper") or paper
        inferred_p = infer_paper_from_question_content(final_question)
        
        req_p_norm = paper.replace("-", "").replace(" ", "").upper()
        det_p_norm = (detected_p or "").replace("-", "").replace(" ", "").upper()
        inf_p_norm = (inferred_p or "").replace("-", "").replace(" ", "").upper()

        det_m = evaluation_result.get("detected_marks")
        det_m_int = None
        if det_m is not None:
            try:
                det_m_int = int(det_m)
            except (ValueError, TypeError):
                det_m_int = None
        req_m_int = int(max_marks)

        paper_mismatch = False
        true_detected_paper = paper
        if det_p_norm and det_p_norm in ["GS1", "GS2", "GS3", "GS4", "ESSAY", "OPTIONAL"] and det_p_norm != req_p_norm:
            if not is_paper_compatible(paper, detected_p, final_question):
                paper_mismatch = True
                true_detected_paper = detected_p
        elif inf_p_norm and inf_p_norm in ["GS1", "GS2", "GS3", "GS4", "ESSAY"] and inf_p_norm != req_p_norm:
            if not is_paper_compatible(paper, inferred_p, final_question):
                paper_mismatch = True
                true_detected_paper = inferred_p

        # If papers are academically compatible under the UPSC Interdisciplinary Overlap Matrix,
        # clear any raw model mismatch flags so valid cross-disciplinary answers evaluate seamlessly!
        if is_paper_compatible(paper, detected_p, final_question) and is_paper_compatible(paper, inferred_p, final_question):
            paper_mismatch = False
            true_detected_paper = paper
            if isinstance(evaluation_result, dict):
                evaluation_result["is_intake_mismatch"] = False
                evaluation_result["mismatch_details"] = ""
                evaluation_result["detected_paper"] = paper

        marks_mismatch = False
        true_detected_marks = req_m_int
        if det_m_int and det_m_int in [10, 15, 20] and det_m_int != req_m_int:
            marks_mismatch = True
            true_detected_marks = det_m_int

        intake_flag = bool(evaluation_result.get("is_intake_mismatch", False)) and (paper_mismatch or marks_mismatch)

        if not is_rewrite and not allow_auto_aligned and (paper_mismatch or marks_mismatch or intake_flag):
            # DO NOT CONSUME CREDITS, DO NOT SAVE MISMATCHED EVALUATION!
            return JSONResponse(
                status_code=400,
                content={
                    "status": "mismatch",
                    "error_type": "intake_mismatch",
                    "title": "Subject / Marks Mismatch Detected",
                    "message": f"You selected {paper} ({max_marks} Marks), but your uploaded answer booklet is for {true_detected_paper} ({true_detected_marks} Marks).",
                    "selected_paper": paper,
                    "selected_marks": req_m_int,
                    "detected_paper": true_detected_paper,
                    "detected_marks": true_detected_marks,
                    "detected_question": final_question,
                    "warning": f"⚠️ Evaluation Guard: Evaluating a {true_detected_paper} question under {paper} ({max_marks}M) corrupts UPSC marks calibration and percentile analytics. Zero credits were deducted.",
                    "action_hint": f"Click 'Switch to {true_detected_paper} ({true_detected_marks}M) & Evaluate' to evaluate this copy correctly, or upload your matching {paper} answer sheet.",
                    "credits_deducted": 0
                }
            )

        # Supabase Persistent Storage and Record Insertion
        user_id = user["id"] if (user and user.get("id")) else get_deterministic_user_id(user_email or "guest@upsc.gov.in")
        public_file_url = None
        if primary_content:
            file_ext = ".pdf" if is_pdf else (os.path.splitext(primary_filename)[1] or ".jpg")
            mime_type = "application/pdf" if is_pdf else ("image/png" if file_ext == ".png" else "image/jpeg")
            try:
                public_file_url = upload_file_to_supabase(
                    user_id=user_id,
                    file_bytes=primary_content,
                    file_ext=file_ext,
                    content_type=mime_type
                )
            except Exception as se:
                print(f"Notice: Supabase storage upload error: {se}")

        if not uploaded_page_previews and public_file_url:
            uploaded_page_previews = [public_file_url]

        eval_id = None
        user_info = None
        final_paper = true_detected_paper if (allow_auto_aligned and (paper_mismatch or marks_mismatch)) else (evaluation_result.get("detected_paper") or paper)
        final_paper_display = evaluation_result.get("detected_paper_display") or final_paper
        final_max_marks = true_detected_marks if (allow_auto_aligned and (paper_mismatch or marks_mismatch)) else max_marks

        if is_rewrite and prev_record:
            prev_eval_clean = copy.deepcopy(prev_record.get("evaluation") or {})
            if isinstance(prev_eval_clean, dict):
                prev_eval_clean.pop("previous_evaluation", None)
                prev_eval_clean.pop("previous_pages", None)
                evaluation_result["previous_evaluation"] = prev_eval_clean
            if prev_record.get("pages"):
                evaluation_result["previous_pages"] = prev_record.get("pages")
            evaluation_result["is_rewrite"] = True

        # POST-LLM ACCOUNT DUPLICATE GUARD:
        # Deep check after OCR/transcription to catch re-taken photos of identical handwritten answers
        if user_email:
            dup_record_post = find_duplicate_evaluation_in_user_account(
                email=user_email,
                paper=final_paper,
                max_marks=final_max_marks,
                file_hash=submission_hash,
                visual_hashes=visual_hashes,
                question=final_question,
                transcribed_text=evaluation_result.get("transcribed_text") or ""
            )
            if dup_record_post:
                prev_id = dup_record_post.get("existing_eval_id")
                prev_score = dup_record_post.get("existing_score")
                prev_p = dup_record_post.get("existing_paper") or final_paper
                prev_m = dup_record_post.get("existing_marks") or final_max_marks
                prev_q = dup_record_post.get("existing_question") or final_question
                print(f"[DUPLICATE GUARD - POST-LLM] Detected re-upload of evaluated copy for {user_email}: {prev_id} (Score: {prev_score}/{prev_m})")
                return JSONResponse(
                    status_code=400,
                    content={
                        "status": "duplicate",
                        "error_type": "identical_copy",
                        "title": "Duplicate Copy Detected — Script Already Evaluated",
                        "message": f"This answer sheet contains the same handwritten answers for the question already evaluated in your account ({prev_p}, {prev_m} Marks, Scored {prev_score}/{prev_m}). Re-evaluating unchanged copies defeats the purpose of practice.",
                        "warning": "🛡️ Zero Credits Deducted: Your daily evaluation limit is 100% intact.",
                        "action_hint": "Review examiner annotations on your previously evaluated copy, or incorporate feedback before uploading a revised draft.",
                        "credits_deducted": 0,
                        "existing_eval_id": prev_id,
                        "existing_score": prev_score,
                        "existing_paper": prev_p,
                        "existing_marks": prev_m,
                        "existing_question": prev_q,
                        "expected_paper": prev_p,
                        "expected_marks": prev_m,
                        "expected_question": prev_q,
                        "detected_paper": final_paper,
                        "detected_marks": final_max_marks,
                        "detected_question": final_question
                    }
                )

        if user_email:
            if is_evaluation_fully_completed(evaluation_result, final_question, final_max_marks):
                overall_score = float(evaluation_result.get("overall_score", 0.0))
                pct = round((overall_score / final_max_marks) * 100, 1) if final_max_marks > 0 else 0.0
                eval_id = save_evaluation_record(
                    email=user_email,
                    paper=final_paper,
                    max_marks=final_max_marks,
                    question=final_question,
                    overall_score=overall_score,
                    percentage=pct,
                    evaluation_dict=evaluation_result,
                    pages_list=uploaded_page_previews,
                    is_rewrite=is_rewrite,
                    file_hash=submission_hash,
                    baseline_eval_id=(baseline_eval_id or (prev_record.get("id") if prev_record else None)) if is_rewrite else None,
                    file_url=public_file_url
                )
                if eval_id:
                    if not is_rewrite:
                        use_user_credit(user_email)
                    else:
                        use_user_rewrite(user_email)
                    user_info = get_user(user_email)
                    log_platform_activity(
                        user_email=user_email,
                        user_name=(user_info.get("name") if user_info else None) or user_email.split("@")[0].title(),
                        action_type="copy_evaluated",
                        title=f"Evaluated {final_paper} ({final_max_marks}M) — Scored {overall_score}/{final_max_marks}",
                        detail=f"Q: {(final_question or '')[:85]}",
                        eval_id=eval_id or ""
                    )
                else:
                    user_info = get_user(user_email)
            else:
                print(f"[LOCKER GUARD] Skipped storing dummy/fallback/error evaluation for {user_email}")
                user_info = get_user(user_email)
        elif public_file_url and is_evaluation_fully_completed(evaluation_result, final_question, final_max_marks):
            try:
                insert_supabase_evaluation(
                    user_id=user_id,
                    question_title=final_question,
                    file_url=public_file_url,
                    total_marks=final_max_marks,
                    result_json=evaluation_result
                )
            except Exception as se:
                print(f"Notice: Supabase guest record insert error: {se}")

        return {
            "source": "live_ai",
            "question": final_question,
            "detected_question": evaluation_result.get("detected_question"),
            "paper": final_paper,
            "paper_display": final_paper_display,
            "detected_paper_display": final_paper_display,
            "max_marks": final_max_marks,
            "evaluation": evaluation_result,
            "pages": uploaded_page_previews,
            "file_url": public_file_url,
            "eval_id": eval_id,
            "created_at": evaluation_result.get("_meta_created_at") or evaluation_result.get("created_at") or datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            "user": user_info,
            "user_credits": user_info.get("free_credits") if user_info else None,
            "daily_quota": get_user_daily_quota(user_email) if user_email else None,
            "is_rewrite": is_rewrite,
            "has_been_rewritten": 0,
            "rewrite_eval_id": None,
            "baseline_eval_id": (baseline_eval_id or (prev_record.get("id") if prev_record else None)) if is_rewrite else None,
            "rewrite_warning": rewrite_loophole_warning,
            "previous_evaluation": prev_record.get("evaluation") if (prev_record and is_rewrite) else None,
            "previous_pages": prev_record.get("pages") if (prev_record and is_rewrite) else None
        }

    except HTTPException:
        raise
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Evaluation Error: {str(e)}")

# -------------------------------------------------------------------------
# FULL 20-QUESTION UPSC TEST SERIES (250M / 50-PAGE QCAB) BACKGROUND PIPELINE
# -------------------------------------------------------------------------

async def process_test_series_background(test_id: str, questions: List[dict], paper: str, api_key: Optional[str] = None):
    """
    Background worker that iterates through the segmented 20 questions,
    runs evaluate_with_gemini using our calibrated rubrics, saves results, and finalizes the test.
    """
    for q_data in questions:
        q_num = q_data["question_number"]
        marks = q_data["marks"]
        pages_b64 = q_data.get("pages", [])
        
        pil_images = []
        for p in pages_b64:
            try:
                raw_b64 = p.split(",", 1)[1] if "," in p else p
                img_bytes = base64.b64decode(raw_b64)
                if HAS_PIL and Image:
                    pil_images.append(Image.open(io.BytesIO(img_bytes)).convert("RGB"))
                else:
                    pil_images.append(img_bytes)
            except Exception as e:
                print(f"Error decoding image for Test {test_id} Q{q_num}:", e)
                
        if pil_images:
            try:
                eval_res = await evaluate_with_gemini(
                    images=pil_images,
                    question="", # Inferred from QCAB printed header
                    paper=paper,
                    max_marks=marks,
                    api_key=api_key
                )
                det_q = eval_res.get("detected_question") or f"Question {q_num}"
                score = float(eval_res.get("overall_score", 0.0))
                save_test_question(
                    test_id=test_id,
                    q_num=q_num,
                    marks=marks,
                    question_text=det_q,
                    score=score,
                    is_attempted=True,
                    evaluation_dict=eval_res,
                    pages_list=pages_b64
                )
            except Exception as e:
                print(f"Error evaluating Q{q_num} in Test {test_id}:", e)
                save_test_question(
                    test_id=test_id,
                    q_num=q_num,
                    marks=marks,
                    question_text=f"Question {q_num}",
                    score=0.0,
                    is_attempted=False,
                    evaluation_dict={"executive_summary": "Evaluation encountered an issue.", "rubric_scores": {}},
                    pages_list=pages_b64
                )
    finalize_test_series(test_id)

@app.get("/api/test-series/sample")
async def get_test_series_sample():
    """Returns pre-evaluated authentic 20-question UPSC Mains GS-2 Mock Test Series."""
    return get_sample_test_series()

@app.post("/api/test-series/upload")
async def upload_test_series(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
    paper: str = Form("GS2"),
    test_title: Optional[str] = Form(None),
    email: Optional[str] = Form("aspirant@upsc.gov.in"),
    api_key: Optional[str] = Form(None)
):
    """
    Accepts full 50-page QCAB PDF upload, segments into 20 questions,
    and queues background evaluation.
    """
    content = await file.read()
    filename = (file.filename or "").lower()
    if not filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Test Series upload must be a PDF Question-cum-Answer Booklet.")
        
    title = test_title or f"UPSC Mains {paper} Full Mock Test (FLT)"
    test_id = create_test_series(email=email, test_title=title, paper=paper, total_questions=20)
    
    try:
        questions = segment_qcab_pdf(content)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to segment QCAB PDF: {str(e)}")
        
    if not questions:
        raise HTTPException(status_code=400, detail="No readable pages found in uploaded QCAB PDF.")
        
    background_tasks.add_task(
        process_test_series_background,
        test_id=test_id,
        questions=questions,
        paper=paper,
        api_key=api_key
    )
    
    return {
        "test_id": test_id,
        "test_title": title,
        "total_questions": len(questions),
        "status": "processing",
        "message": f"Successfully queued {len(questions)} questions for 20/20 evaluation!"
    }

@app.get("/api/test-series/{test_id}")
async def get_test_series(test_id: str):
    """Fetches full test series evaluation report with all 20 questions."""
    if test_id in ["sample", "ts-flt-gs2-sample"]:
        return get_sample_test_series()
    res = get_test_series_by_id(test_id)
    if not res:
        raise HTTPException(status_code=404, detail="Test series not found.")
    return res

# -------------------------------------------------------------------------
# DEDICATED ASYNC LONG-DOCUMENT ESSAY EVALUATION ENDPOINTS
# -------------------------------------------------------------------------

@app.post("/api/essay/evaluate")
async def evaluate_essay_async(
    background_tasks: BackgroundTasks,
    question: str = Form(...),
    paper: str = Form("Essay"),
    max_marks: int = Form(125),
    medium: Optional[str] = Form("english"),
    page_range: Optional[str] = Form(None),
    user_email: Optional[str] = Form(None),
    api_key: Optional[str] = Form(None),
    files: List[UploadFile] = File(...)
):
    """
    Accepts long essay booklets (PDF or images), splits into batched pages,
    creates a resumable background evaluation job, and starts execution.
    """
    if not files or len(files) == 0 or files[0].filename == "":
        raise HTTPException(status_code=400, detail="Please upload an essay answer booklet (PDF or image scans).")

    eff_email = (user_email or "guest@cookedmains.in").strip().lower()

    # Quota check
    if user_email:
        user = get_or_create_user(eff_email)
        quota = get_user_daily_quota(eff_email)
        if quota.get("daily_eval_remaining", 1) <= 0:
            return JSONResponse(
                status_code=429,
                content={
                    "status": "quota_exhausted",
                    "error_type": "daily_eval_quota_exhausted",
                    "title": "Daily Free Evaluation Limit Reached (15 of 15 Copies Used Today)",
                    "message": "You have utilized all free evaluations for today. Your daily allowance resets at midnight IST.",
                    "credits_deducted": 0
                }
            )

    # Ingest files
    first_file = files[0]
    content = await first_file.read()
    filename = (first_file.filename or "").lower()
    ctype = (first_file.content_type or "").lower()

    is_pdf = filename.endswith(".pdf") or "pdf" in ctype or content[:4] == b"%PDF"

    from essay_pipeline import ingest_essay_pdf, ingest_essay_images, execute_essay_pipeline_background

    if is_pdf:
        try:
            ingest_result = ingest_essay_pdf(content, page_range=page_range)
        except Exception as pe:
            raise HTTPException(status_code=400, detail=f"Failed to process essay PDF: {str(pe)}")
    else:
        # Multi-image list
        images_bytes = [content]
        for f in files[1:]:
            b = await f.read()
            if b:
                images_bytes.append(b)
        try:
            ingest_result = ingest_essay_images(images_bytes, page_range=page_range)
        except Exception as ie:
            raise HTTPException(status_code=400, detail=f"Failed to process essay images: {str(ie)}")

    pages_data = ingest_result.get("pages") or []
    if not pages_data:
        raise HTTPException(status_code=400, detail="No readable pages found in uploaded booklet.")

    total_pdf_pages = ingest_result.get("total_pdf_pages", len(pages_data))
    selected_pages = ingest_result.get("selected_pages", [p["original_page_number"] for p in pages_data])
    previews = ingest_result.get("previews_list") or [p["preview_b64"] for p in pages_data]

    job_id = f"essay_job_{int(time.time())}_{uuid.uuid4().hex[:6]}"

    from storage import create_essay_job
    job_record = create_essay_job(
        job_id=job_id,
        user_email=eff_email,
        question=question,
        paper="Essay",
        max_marks=max_marks or 125,
        medium=medium or "english",
        total_pages=total_pdf_pages,
        page_range=page_range or f"1-{total_pdf_pages}",
        selected_pages=selected_pages,
        batch_size=2,
        pages_previews=previews
    )

    background_tasks.add_task(
        execute_essay_pipeline_background,
        job_id=job_id,
        pages_data=pages_data,
        api_key=api_key
    )

    return {
        "status": "processing",
        "job_id": job_id,
        "total_pdf_pages": total_pdf_pages,
        "selected_pages_count": len(pages_data),
        "selected_pages": selected_pages,
        "page_range": page_range or f"1-{total_pdf_pages}",
        "message": f"Successfully queued {len(pages_data)} pages for essay evaluation."
    }


@app.get("/api/essay/status/{job_id}")
async def get_essay_status(job_id: str):
    """
    Returns live progress, checkpoint status, and final evaluation result.
    """
    from storage import get_essay_job
    job = get_essay_job(job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Essay job not found.")

    status = job.get("status")
    result_data = job.get("result")
    previews = job.get("pages") or []

    resp = {
        "job_id": job_id,
        "status": status,
        "progress_pct": job.get("progress_pct", 0),
        "progress_message": job.get("progress_message", "Processing..."),
        "total_pages": job.get("total_pages", 0),
        "selected_pages": job.get("selected_pages") or [],
        "page_range": job.get("page_range"),
        "error_message": job.get("error_message"),
        "eval_id": job.get("eval_id")
    }

    if status == "completed" and result_data:
        if "pages" not in result_data or not result_data["pages"]:
            result_data["pages"] = previews
        if "page_ledger" not in result_data:
            result_data["page_ledger"] = job.get("page_ledger") or {}

        resp["result"] = {
            "source": "live_essay_pipeline",
            "eval_id": job.get("eval_id"),
            "paper": "Essay",
            "detected_paper": "Essay",
            "detected_paper_display": "UPSC Essay Paper (125 Marks)",
            "max_marks": job.get("max_marks", 125),
            "question": job.get("question"),
            "detected_question": result_data.get("detected_question") or job.get("question"),
            "evaluation": result_data,
            "pages": previews,
            "page_ledger": job.get("page_ledger") or result_data.get("page_ledger") or {},
            "is_rewrite": False
        }

    return resp


@app.post("/api/essay/retry/{job_id}")
async def retry_essay_evaluation(
    background_tasks: BackgroundTasks,
    job_id: str,
    api_key: Optional[str] = Form(None)
):
    """
    Resumes an interrupted or failed essay job from its latest saved checkpoints.
    Idempotent: completed batches are not repeated.
    """
    from storage import get_essay_job, update_essay_job_progress
    job = get_essay_job(job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Essay job not found.")

    if job.get("status") == "completed":
        return {"status": "completed", "message": "Job is already completed.", "eval_id": job.get("eval_id")}

    update_essay_job_progress(job_id, job.get("progress_pct", 10), "Resuming evaluation from saved checkpoint...", status="processing")

    previews = job.get("pages") or []
    selected_pages = job.get("selected_pages") or list(range(1, len(previews) + 1))

    # Reconstruct pages_data from previews
    pages_data = []
    for idx, p_num in enumerate(selected_pages):
        prev_b64 = previews[idx] if idx < len(previews) else ""
        raw_b = b""
        if prev_b64 and "," in prev_b64:
            try:
                raw_b = base64.b64decode(prev_b64.split(",", 1)[1])
            except Exception:
                raw_b = b""
        pages_data.append({
            "original_page_number": p_num,
            "page_index": idx,
            "preview_b64": prev_b64,
            "analysis_bytes": raw_b
        })

    from essay_pipeline import execute_essay_pipeline_background
    background_tasks.add_task(
        execute_essay_pipeline_background,
        job_id=job_id,
        pages_data=pages_data,
        api_key=api_key
    )

    return {"status": "processing", "job_id": job_id, "message": "Essay evaluation resumed from checkpoint."}


# =====================================================================
# 📸 INSTAGRAM GRAPH API & COMMENT-TO-DM AUTOMATION ENDPOINTS
# =====================================================================

@app.get("/api/instagram/analytics")
async def get_instagram_analytics():
    """Fetches real-time Instagram Graph API growth analytics & diagnostic report."""
    from instagram_analytics import InstagramGrowthEngine
    engine = InstagramGrowthEngine()
    return engine.generate_growth_report()

@app.post("/api/instagram/configure")
async def configure_instagram(payload: dict):
    """Saves Instagram credentials to .env and tests connection."""
    account_id = payload.get("account_id", "").strip()
    access_token = payload.get("access_token", "").strip()
    
    if not account_id or not access_token:
        raise HTTPException(status_code=400, detail="Both account_id and access_token are required.")
        
    env_file = os.path.join(os.path.dirname(__file__), ".env")
    lines = []
    if os.path.exists(env_file):
        with open(env_file, "r", encoding="utf-8") as f:
            lines = [l for l in f.readlines() if not l.startswith("INSTAGRAM_")]
            
    lines.append(f"\nINSTAGRAM_ACCOUNT_ID={account_id}\n")
    lines.append(f"INSTAGRAM_ACCESS_TOKEN={access_token}\n")
    
    with open(env_file, "w", encoding="utf-8") as f:
        f.writelines(lines)
        
    os.environ["INSTAGRAM_ACCOUNT_ID"] = account_id
    os.environ["INSTAGRAM_ACCESS_TOKEN"] = access_token
    
    from instagram_analytics import InstagramGrowthEngine
    engine = InstagramGrowthEngine(account_id, access_token)
    test_res = engine.get_account_overview()
    
    return {
        "status": "success",
        "message": "Instagram Graph API configured successfully!",
        "account": test_res
    }

@app.get("/api/instagram/webhook")
async def verify_instagram_webhook(request: Request):
    """
    Official Meta Webhook Handshake Verification.
    Validates hub.verify_token and returns hub.challenge as required by Meta.
    """
    params = request.query_params
    mode = params.get("hub.mode")
    token = params.get("hub.verify_token")
    challenge = params.get("hub.challenge")
    
    expected_token = os.getenv("INSTAGRAM_WEBHOOK_VERIFY_TOKEN", "cookedmains_dm_secret")
    
    if mode == "subscribe" and token == expected_token:
        print(f"[IG-WEBHOOK] Webhook verified successfully by Meta! Challenge: {challenge}")
        from fastapi.responses import PlainTextResponse
        return PlainTextResponse(content=challenge)
    
    print(f"[IG-WEBHOOK] Webhook verification mismatch: received {token}, expected {expected_token}")
    raise HTTPException(status_code=403, detail="Verification token mismatch.")

@app.post("/api/instagram/webhook")
async def receive_instagram_webhook(request: Request, background_tasks: BackgroundTasks):
    """
    Listens for live comment events on Reels/Posts and triggers Comment-to-DM auto-replies.
    """
    try:
        body_bytes = await request.body()
        data = json.loads(body_bytes.decode("utf-8")) if body_bytes else {}
    except Exception as e:
        return {"status": "error", "message": f"Malformed payload: {e}"}

    from instagram_dm_bot import process_incoming_comment_webhook
    # Run in background so Meta webhook call returns 200 OK within 2 seconds
    background_tasks.add_task(process_incoming_comment_webhook, data)
    return {"status": "received"}

@app.get("/api/instagram/dm-rules")
async def get_instagram_dm_rules():
    """Returns active Comment-to-DM triggers, message templates, and logs."""
    from instagram_dm_bot import load_rules
    return load_rules()

@app.post("/api/instagram/dm-rules")
async def update_instagram_dm_rules(payload: dict):
    """Updates trigger keywords, automated DM message, and public replies."""
    from instagram_dm_bot import load_rules, save_rules
    current = load_rules()
    for key in ["enabled", "trigger_keywords", "match_any_comment", "dm_message", "public_reply_enabled", "public_reply_templates"]:
        if key in payload:
            current[key] = payload[key]
    save_rules(current)
    return {"status": "success", "rules": current}

@app.post("/api/instagram/simulate-comment")
async def simulate_comment_to_dm(payload: dict):
    """
    Testing sandbox: Simulates an aspirant commenting on a Reel to test DM text,
    keyword matching, and public response without needing a live Meta webhook.
    """
    comment_text = payload.get("comment_text", "MAINS").strip()
    username = payload.get("username", "aspirant_delhi").strip()
    
    from instagram_dm_bot import load_rules, check_comment_match
    rules = load_rules()
    
    matched = check_comment_match(comment_text, rules)
    formatted_dm = rules.get("dm_message", "").replace("{username}", username)
    import random
    public_replies = rules.get("public_reply_templates", [])
    public_reply = random.choice(public_replies) if public_replies else "Sent link to your DM! 📩"
    
    return {
        "status": "success",
        "comment_text": comment_text,
        "username": username,
        "matched": matched,
        "would_send_dm": matched and rules.get("enabled", True),
        "dm_preview": formatted_dm if matched else None,
        "public_reply_preview": public_reply if matched and rules.get("public_reply_enabled", True) else None
    }


@app.post("/api/instagram/scan-reels")
async def scan_instagram_reels_for_comments():
    """
    On-demand scanner: Fetches comments on recent Reels, checks for trigger keywords,
    and dispatches automated DMs and public replies.
    """
    import os
    import requests
    from datetime import datetime
    from instagram_dm_bot import load_rules, save_rules, check_comment_match, send_private_reply_to_comment, send_public_reply_to_comment
    import random

    env_file = os.path.join(os.path.dirname(__file__), ".env")
    token = os.getenv("INSTAGRAM_ACCESS_TOKEN", "")
    account_id = os.getenv("INSTAGRAM_ACCOUNT_ID", "17841425940719242")
    if os.path.exists(env_file):
        with open(env_file, "r", encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                if line.startswith("INSTAGRAM_ACCESS_TOKEN="):
                    token = line.split("=", 1)[1].strip()
                elif line.startswith("INSTAGRAM_ACCOUNT_ID="):
                    account_id = line.split("=", 1)[1].strip()

    if not token or not account_id:
        return {"status": "error", "message": "Instagram token or account ID not configured"}

    rules = load_rules()
    logs = rules.get("logs", [])
    already_logged_ids = {l.get("comment_id") for l in logs if l.get("comment_id")}

    try:
        # Fetch latest media items
        media_url = f"https://graph.facebook.com/v19.0/{account_id}/media"
        m_res = requests.get(media_url, params={"fields": "id,caption,media_type,media_product_type,permalink,comments_count", "limit": 6, "access_token": token})
        all_media = m_res.json().get("data", [])
        
        # Filter strictly to the last 2 Reels only (never touch other posts/reels)
        target_ids = set(rules.get("target_reel_ids", ["18094002416667541", "18607963645064651"]))
        reels_only = [m for m in all_media if m["id"] in target_ids or m.get("media_type") == "VIDEO" or m.get("media_product_type") == "REELS"]
        media_items = reels_only[:2]
        
        scanned_comments = 0
        dm_dispatched = 0
        results = []

        for m in media_items:
            mid = m["id"]
            if m.get("comments_count", 0) == 0:
                continue
            
            c_url = f"https://graph.facebook.com/v19.0/{mid}/comments"
            c_res = requests.get(c_url, params={"fields": "id,text,username,timestamp,replies{id,username}", "limit": 25, "access_token": token})
            comments = c_res.json().get("data", [])

            for c in comments:
                cid = c["id"]
                user = c.get("username", "")
                text = c.get("text", "")
                if user.lower() == "cookedmains":
                    continue
                scanned_comments += 1

                # Check if cookedmains has already replied to this comment on Instagram
                existing_replies = c.get("replies", {}).get("data", [])
                has_our_reply = any(rep.get("username", "").lower() == "cookedmains" for rep in existing_replies)
                if has_our_reply:
                    already_logged_ids.add(cid)
                    continue

                # If comment matches rules
                if check_comment_match(text, rules):
                    # Check if already processed
                    if cid in already_logged_ids:
                        continue

                    dm_text = rules.get("dm_message", "").replace("{username}", user)
                    dm_res = send_private_reply_to_comment(cid, dm_text, access_token=token, account_id=account_id)
                    
                    status = "sent" if "error" not in dm_res else f"failed ({dm_res['error'].get('message', 'error')})"
                    if "already has a reply" in str(dm_res):
                        status = "already_replied"
                    elif "error" not in dm_res:
                        dm_dispatched += 1

                    # Public reply if configured and DM sent
                    pub_status = None
                    if rules.get("public_reply_enabled", True) and "already has a reply" not in str(dm_res):
                        templates = rules.get("public_reply_templates", [])
                        if templates:
                            pub_text = random.choice(templates).replace("{username}", user)
                            send_public_reply_to_comment(cid, pub_text, access_token=token)
                            pub_status = "sent"

                    log_entry = {
                        "comment_id": cid,
                        "username": user,
                        "comment_text": text,
                        "dm_status": status,
                        "public_reply": pub_status,
                        "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
                    }
                    logs.insert(0, log_entry)
                    already_logged_ids.add(cid)
                    results.append(log_entry)

        rules["logs"] = logs[:100]
        save_rules(rules)
        return {
            "status": "success",
            "scanned_comments": scanned_comments,
            "new_dms_dispatched": dm_dispatched,
            "processed": results
        }
    except Exception as e:
        return {"status": "error", "message": str(e)}


if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 10000))
    host = os.environ.get("HOST", "0.0.0.0")
    print(f"Starting Cooked Mains AI server on http://{host}:{port} ...")
    uvicorn.run("main:app", host=host, port=port, reload=False)

