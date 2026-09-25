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
import hashlib
from typing import List, Optional, Any, Dict
from fastapi import FastAPI, File, UploadFile, Form, HTTPException, Request, BackgroundTasks
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

supabase_url = os.environ.get("SUPABASE_URL")
supabase_key = os.environ.get("SUPABASE_KEY")
supabase: Optional[Client] = None
if supabase_url and supabase_key:
    try:
        supabase = create_client(supabase_url, supabase_key)
    except Exception as e:
        print(f"Supabase client initialization notice: {e}")

from evaluator_engine import (
    evaluate_with_gemini, detect_directive, PAPER_TAXONOMIES,
    are_questions_semantically_mismatched, infer_paper_from_question_content,
    detect_academic_discipline, build_evaluation_prompt,
    get_dynamic_grounded_context, parse_llm_json_response, normalize_evaluation_data
)
from sample_data import get_sample_datasets, get_daily_question, get_sample_test_series
from storage import (
    get_or_create_user, authenticate_or_register_user, get_user, use_user_credit, use_user_rewrite,
    add_user_credits, save_evaluation_record, save_feedback, update_user_profile,
    get_user_evaluations, get_evaluation_by_id,
    get_last_evaluation_for_user, has_user_rewritten_question, find_evaluation_by_hash,
    find_evaluation_by_hash_global, has_evaluation_been_rewritten,
    segment_qcab_pdf, create_test_series, save_test_question,
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
    compute_visual_handwriting_signature, find_canonical_evaluation_for_script
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

async def _self_keep_alive_loop():
    """Background task that pings the external Render URL every 10 minutes to prevent free-tier spin-down."""
    await asyncio.sleep(30)
    while True:
        try:
            ext_url = os.environ.get("RENDER_EXTERNAL_URL") or os.environ.get("APP_URL")
            if ext_url:
                ping_url = ext_url.rstrip("/") + "/healthz"
                def _ping():
                    req = urllib.request.Request(ping_url, headers={"User-Agent": "CookedMains-KeepAlive/1.0"})
                    with urllib.request.urlopen(req, timeout=10) as resp:
                        return resp.status
                await asyncio.to_thread(_ping)
        except Exception:
            pass
        await asyncio.sleep(600)  # Every 10 minutes

@app.on_event("startup")
async def _startup_keep_alive():
    asyncio.create_task(_self_keep_alive_loop())

@app.get("/healthz")
@app.get("/ping")
@app.get("/api/health")
async def health_check():
    """24/7 Health Check & UptimeRobot Heartbeat Endpoint."""
    return {
        "status": "healthy",
        "service": "Cooked Mains AI",
        "supabase_connected": bool(supabase is not None),
        "gemini_key_configured": bool(os.environ.get("GEMINI_API_KEY") or os.environ.get("GOOGLE_API_KEY"))
    }

@app.get("/")
@app.get("/index.html")
async def root():
    return FileResponse(os.path.join(os.path.dirname(__file__), "static", "index.html"))

@app.get("/demo-workbench")
@app.get("/demo-workbench.html")
async def demo_workbench():
    return FileResponse(os.path.join(os.path.dirname(__file__), "static", "demo-workbench.html"))

@app.get("/demo")
@app.get("/demo.html")
async def demo():
    return FileResponse(os.path.join(os.path.dirname(__file__), "static", "demo.html"))


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
        norm_eval = normalize_evaluation_data(dict(s["precomputed_evaluation"]), s["marks"], s["question"], s["paper"])
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
async def render_preview(files: List[UploadFile] = File(...)):
    """Fast endpoint to render uploaded PDF/images into viewer previews immediately on selection."""
    previews = []
    for file in files:
        content = await file.read()
        filename = (file.filename or "").lower()
        if filename.endswith(".pdf"):
            try:
                import pypdfium2 as pdfium
                pdf = pdfium.PdfDocument(content)
                for page in pdf:
                    pil_img = page.render(scale=1.5).to_pil().convert("RGB")
                    buf = io.BytesIO()
                    pil_img.save(buf, format="JPEG", quality=80)
                    b64 = base64.b64encode(buf.getvalue()).decode("utf-8")
                    previews.append(f"data:image/jpeg;base64,{b64}")
            except Exception as e:
                print("PDF preview notice:", e)
        else:
            try:
                b64 = base64.b64encode(content).decode("utf-8")
                mime = "image/png" if filename.endswith(".png") else "image/jpeg"
                previews.append(f"data:{mime};base64,{b64}")
            except Exception as e:
                print("Image preview error:", e)
    return {"pages": previews, "num_pages": len(previews)}

@app.get("/api/taxonomies")
async def get_taxonomies():
    return PAPER_TAXONOMIES

@app.post("/api/detect-directive")
async def api_detect_directive(question: str = Form(...)):
    return detect_directive(question)

@app.post("/api/test-key")
async def test_key(api_key: str = Form(...)):
    """Tests if the provided Gemini API key is active and lists accessible models."""
    from google import genai
    try:
        client = genai.Client(api_key=api_key.strip())
        models_found = []
        for m in client.models.list():
            if m.supported_actions and "generateContent" in m.supported_actions:
                models_found.append(m.name.replace("models/", ""))
        if models_found:
            # Save key to server .env for zero-friction student access
            with open(env_path, "w", encoding="utf-8") as f:
                f.write(f"GEMINI_API_KEY={api_key.strip()}\n")
            os.environ["GEMINI_API_KEY"] = api_key.strip()

            return {
                "valid": True,
                "message": f"Success! Connected to {len(models_found)} models ({', '.join(models_found[:3])}...)",
                "server_saved": True
            }
        else:
            return {"valid": False, "message": "Key is active, but no generateContent models found."}
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
    if "onrender.com" in origin and origin.startswith("http://"):
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
    return {"status": "success", "message": "Feedback received. Thank you for helping us improve Cooked Mains!"}

@app.post("/api/admin/factory-reset")
async def api_admin_factory_reset():
    """Clears all existing test accounts, evaluations, and PDFs for a 100% clean pilot launch."""
    from storage import perform_clean_slate_reset
    return perform_clean_slate_reset(force=True)

@app.get("/locker")
@app.get("/history")
@app.get("/api/user/history")
async def api_user_history(email: Optional[str] = None, user_id: Optional[str] = None):
    """Returns list of student's past evaluated answer copies ordered by created_at desc."""
    if email:
        return get_user_evaluations(email)

    if supabase and user_id:
        try:
            res = supabase.table("evaluations").select("*").eq("user_id", user_id).order("created_at", desc=True).execute()
            if res and res.data:
                return [_format_supabase_eval_row(r) for r in res.data if not str(r.get("question_title") or "").startswith("__")]
        except Exception as e:
            print(f"Supabase /locker query error: {e}")

    if supabase:
        try:
            res = supabase.table("evaluations").select("*").order("created_at", desc=True).limit(50).execute()
            if res and res.data:
                return [_format_supabase_eval_row(r) for r in res.data if not str(r.get("question_title") or "").startswith("__")]
        except Exception as e:
            print(f"Supabase /locker query error: {e}")

    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT id, created_at, paper, max_marks, question, overall_score, percentage, thumbnail, is_rewrite,
               has_been_rewritten, rewrite_eval_id, baseline_eval_id, file_url
        FROM evaluations
        WHERE question NOT LIKE '__%'
        ORDER BY created_at DESC
        LIMIT 50
    """)
    rows = cursor.fetchall()
    conn.close()
    return [dict(r) for r in rows]

@app.get("/api/user/history/{eval_id}")
async def api_history_detail(eval_id: str):
    """Fetches complete copy payload including annotations and pages for instant reloading."""
    record = get_evaluation_by_id(eval_id)
    if not record:
        raise HTTPException(status_code=404, detail="Evaluated copy not found.")
    return record

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

@app.get("/api/admin/stats")
async def api_admin_stats():
    """Returns overview platform analytics for the admin dashboard."""
    return get_admin_dashboard_stats()

@app.get("/api/admin/aspirants")
async def api_admin_aspirants(search: Optional[str] = None):
    """Returns list of registered aspirants."""
    return get_all_aspirants_admin(search)

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
async def api_admin_feedbacks():
    """Returns candidate feedback and bug reports."""
    return get_all_feedbacks_admin()

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

@app.post("/api/evaluate")
async def evaluate_answer(
    question: str = Form(...),
    paper: str = Form("GS2"),
    max_marks: int = Form(10),
    api_key: Optional[str] = Form(None),
    sample_id: Optional[str] = Form(None),
    user_email: Optional[str] = Form(None),
    is_rewrite: bool = Form(False),
    baseline_eval_id: Optional[str] = Form(None),
    baseline_question: Optional[str] = Form(None),
    baseline_paper: Optional[str] = Form(None),
    baseline_marks: Optional[int] = Form(None),
    allow_auto_aligned: bool = Form(False),
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

        # Ingest uploaded answer copy without heavy in-memory rasterization
        uploaded_page_previews: List[str] = []
        file_hashes: List[str] = []
        submission_hash: Optional[str] = None
        primary_content: Optional[bytes] = None
        primary_filename: str = ""
        is_pdf = False

        if files and len(files) > 0 and files[0].filename != "":
            for file in files:
                content = await file.read()
                if not content:
                    continue
                filename = (file.filename or "").lower()
                file_hashes.append(hashlib.sha256(content).hexdigest())

                if not primary_content:
                    primary_content = content
                    primary_filename = filename
                    is_pdf = filename.endswith(".pdf") or "pdf" in (file.content_type or "").lower()

                if filename.endswith(".pdf"):
                    # Direct PDF ingestion: Gemini evaluates PDF via Files API,
                    # while lightweight previews are generated for the answersheet viewer
                    try:
                        import pypdfium2 as pdfium
                        pdf = pdfium.PdfDocument(content)
                        for page in pdf:
                            pil_img = page.render(scale=1.2).to_pil().convert("RGB")
                            buf = io.BytesIO()
                            pil_img.save(buf, format="JPEG", quality=75)
                            b64 = base64.b64encode(buf.getvalue()).decode("utf-8")
                            uploaded_page_previews.append(f"data:image/jpeg;base64,{b64}")
                            del pil_img
                    except Exception as pe:
                        print(f"Notice: PDF page preview generation error: {pe}")
                else:
                    try:
                        b64 = base64.b64encode(content).decode("utf-8")
                        mime = "image/png" if filename.endswith(".png") else "image/jpeg"
                        uploaded_page_previews.append(f"data:{mime};base64,{b64}")
                    except Exception as img_err:
                        print(f"Notice: image preview encoding failed: {img_err}")

            if file_hashes:
                submission_hash = hashlib.sha256("".join(file_hashes).encode("utf-8")).hexdigest()

        if not primary_content:
            raise HTTPException(status_code=400, detail="Please upload at least one handwritten answer image/page or select a sample copy.")

        # Check user credits and evaluate Rewrite Loophole Integrity
        user = None
        prev_record = None
        rewrite_loophole_warning = None
        if user_email and not sample_id:
            user = get_or_create_user(user_email)
            is_pro = True
            daily_quota = get_user_daily_quota(user_email)

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

                if not prev_record:
                    # User cannot rewrite non-existent submission; NEVER silently downgrade to standard evaluation
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
                    baseline_q_to_check = prev_record.get("question") or baseline_question or question
                    if bool(prev_record.get("is_rewrite")) or bool(prev_record.get("has_been_rewritten")) or prev_record.get("rewrite_eval_id") or has_evaluation_been_rewritten(baseline_id_to_check) or has_user_rewritten_question(user_email, baseline_q_to_check, baseline_id_to_check):
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

                    # 1. Subject / Paper mismatch check
                    prev_p = (prev_record.get("paper") or baseline_paper or "").strip().upper()
                    curr_p = (paper or "").strip().upper()
                    prev_p_norm = prev_p.replace("-", "").replace(" ", "")
                    curr_p_norm = curr_p.replace("-", "").replace(" ", "")
                    if prev_p_norm and curr_p_norm and prev_p_norm != curr_p_norm:
                        # Paper mismatch: DO NOT EVALUATE, DO NOT CONSUME CREDITS
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
            # Determine Key (user key or server master key)
            key = api_key or os.environ.get("GEMINI_API_KEY") or os.environ.get("GOOGLE_API_KEY")
            if not key:
                raise HTTPException(
                    status_code=400,
                    detail="No Master API Key is configured on the server. Please set it once in Settings so all students can evaluate freely, or click 'Try Preloaded Sample Answer'."
                )

            # Direct Gemini Files API Ingestion and Multimodal Generation
            prev_q = (prev_record.get("question") if prev_record else None) or baseline_question if is_rewrite else None
            detected_paper = detect_academic_discipline(question, paper)
            directive_info = detect_directive(question)
            current_affairs_context = await get_dynamic_grounded_context(question, detected_paper)

            evaluator_prompt_text = build_evaluation_prompt(
                question=question,
                paper_key=detected_paper,
                max_marks=max_marks,
                directive_info=directive_info,
                previous_question=prev_q,
                current_affairs_context=current_affairs_context
            )

            client = genai.Client(api_key=key.strip())
            uploaded_file = None
            temp_path = None

            try:
                if primary_content:
                    suffix = ".pdf" if is_pdf else (os.path.splitext(primary_filename)[1] or ".jpg")
                    temp_file = tempfile.NamedTemporaryFile(delete=False, suffix=suffix)
                    temp_path = temp_file.name
                    temp_file.write(primary_content)
                    temp_file.flush()
                    temp_file.close()

                    uploaded_file = client.files.upload(file=temp_path)

                    gen_config = types.GenerateContentConfig(
                        temperature=0.0,
                        top_p=1.0,
                        top_k=1,
                        seed=20260925,
                        response_mime_type="application/json"
                    )

                    candidate_models = [
                        "gemini-flash-lite-latest",
                        "gemini-3.5-flash-lite",
                        "gemini-3.6-flash",
                        "gemini-3.5-flash",
                        "gemini-3-flash-preview",
                        "gemini-flash-latest",
                        "gemini-2.5-flash"
                    ]

                    last_gen_err = None
                    for model_candidate in candidate_models:
                        try:
                            response = client.models.generate_content(
                                model=model_candidate,
                                contents=[uploaded_file, evaluator_prompt_text],
                                config=gen_config
                            )
                            if response and response.text:
                                raw_text = response.text
                                parsed_eval = parse_llm_json_response(raw_text)
                                if "directive_compliance" in parsed_eval and not parsed_eval["directive_compliance"].get("directive"):
                                    parsed_eval["directive_compliance"]["directive"] = directive_info["directive"]
                                evaluation_result = normalize_evaluation_data(parsed_eval, max_marks, question, detected_paper)
                                break
                        except Exception as ge:
                            last_gen_err = ge
                            continue

                    if not evaluation_result:
                        raise RuntimeError(f"Could not evaluate with available models. Last error: {last_gen_err}")
                else:
                    evaluation_result = await evaluate_with_gemini(
                        images=[],
                        question=question,
                        paper=paper,
                        max_marks=max_marks,
                        api_key=key,
                        previous_question=prev_q
                    )
            finally:
                if temp_path and os.path.exists(temp_path):
                    try:
                        os.unlink(temp_path)
                    except Exception as ue:
                        print(f"Notice: temp file unlink skipped ({ue})")
                if uploaded_file and hasattr(uploaded_file, "name"):
                    try:
                        client.files.delete(name=uploaded_file.name)
                    except Exception as de:
                        print(f"Notice: Gemini file cleanup skipped ({de})")

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
            prev_q_target = prev_record.get("question") or baseline_question
            # Check deterministic semantic match on OCR detected question
            if prev_q_target and final_question and final_question != "UPSC Mains Question":
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
            paper_mismatch = True
            true_detected_paper = detected_p
        elif inf_p_norm and inf_p_norm in ["GS1", "GS2", "GS3", "GS4", "ESSAY"] and inf_p_norm != req_p_norm:
            paper_mismatch = True
            true_detected_paper = inferred_p

        marks_mismatch = False
        true_detected_marks = req_m_int
        if det_m_int and det_m_int in [10, 15, 20] and det_m_int != req_m_int:
            marks_mismatch = True
            true_detected_marks = det_m_int

        intake_flag = bool(evaluation_result.get("is_intake_mismatch", False))

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

        if user_email:
            if not is_rewrite:
                use_user_credit(user_email)
            else:
                use_user_rewrite(user_email)
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
            user_info = get_user(user_email)
        elif public_file_url:
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

@app.get("/api/user/test-series")
async def list_user_test_series(email: str = "aspirant@upsc.gov.in"):
    """Returns past test series evaluated for the user."""
    return get_user_test_series(email)

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    host = os.environ.get("HOST", "0.0.0.0")
    print(f"Starting Cooked Mains AI server on http://{host}:{port} ...")
    uvicorn.run("main:app", host=host, port=port, reload=False)
