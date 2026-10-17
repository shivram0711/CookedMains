"""
Dedicated Long-Document UPSC Essay Evaluation Pipeline
=====================================================
Features:
- Batched, resumable, asynchronous evaluation for long essay booklets (10-50 pages).
- Page-level content extraction and transcription without premature scoring.
- Preserves original PDF page numbers across annotations and candidate viewer.
- Targeted visual rechecks for uncertain handwriting.
- Single comprehensive whole-essay holistic synthesis.
- Checkpoint persistence and idempotent retries (zero duplicate credit charges).
"""

import os
import io
import re
import json
import uuid
import time
import base64
import asyncio
from typing import Dict, Any, List, Optional, Tuple

import pypdfium2 as pdfium
from PIL import Image

from storage import (
    get_essay_job,
    create_essay_job,
    update_essay_job_progress,
    save_essay_job_checkpoint,
    complete_essay_job,
    fail_essay_job,
    mark_essay_job_credit_deducted,
    save_evaluation_record,
    use_user_credit,
    get_user,
    log_platform_activity,
)
from evaluator_engine import (
    create_fast_gemini_client,
    get_active_gemini_models,
    get_active_gemini_keys,
    record_gemini_model_outcome,
    execute_gemini_with_resilience,
    parse_llm_json_response,
)
from google.genai import types


def parse_page_range(total_pages: int, range_str: Optional[str] = None) -> List[int]:
    """
    Parses a page range string (e.g., '1-12', '5-18', '1,2,3,4,8', 'all')
    into an ordered list of 1-based original page numbers within [1, total_pages].
    """
    if total_pages <= 0:
        return []
    if not range_str or range_str.strip().lower() in ["all", "", "none"]:
        return list(range(1, total_pages + 1))

    cleaned = range_str.strip().replace(" ", "")
    result_pages = set()

    parts = cleaned.split(",")
    for part in parts:
        if not part:
            continue
        if "-" in part:
            sub = part.split("-", 1)
            start_s, end_s = sub[0], sub[1]
            start = int(start_s) if start_s.isdigit() else 1
            end = int(end_s) if end_s.isdigit() else total_pages
            start = max(1, min(start, total_pages))
            end = max(1, min(end, total_pages))
            if start <= end:
                for p in range(start, end + 1):
                    result_pages.add(p)
            else:
                for p in range(end, start + 1):
                    result_pages.add(p)
        elif part.isdigit():
            p_val = int(part)
            if 1 <= p_val <= total_pages:
                result_pages.add(p_val)

    if not result_pages:
        return list(range(1, total_pages + 1))
    return sorted(list(result_pages))


def ingest_essay_pdf(
    pdf_bytes: bytes,
    page_range: Optional[str] = None,
    preview_scale: float = 1.3,
    analysis_scale: float = 0.95
) -> Dict[str, Any]:
    """
    Renders PDF pages into:
    1. High-resolution preview images (for candidate-copy booklet viewer)
    2. Optimized analysis JPEG images (for fast multimodal Gemini vision processing)
    Preserves original 1-based page numbers.
    """
    pdf = pdfium.PdfDocument(pdf_bytes)
    total_pdf_pages = len(pdf)

    selected_page_numbers = parse_page_range(total_pdf_pages, page_range)
    pages_data = []
    previews_list = []

    for idx, page_num in enumerate(selected_page_numbers):
        # pypdfium2 is 0-indexed
        pdf_page = pdf.get_page(page_num - 1)

        # 1. Preview render (for booklet UI)
        pil_preview = pdf_page.render(scale=preview_scale).to_pil().convert("RGB")
        if max(pil_preview.size) > 1200:
            pil_preview.thumbnail((1200, 1200))
        prev_buf = io.BytesIO()
        pil_preview.save(prev_buf, format="JPEG", quality=75)
        prev_bytes = prev_buf.getvalue()
        prev_b64 = f"data:image/jpeg;base64,{base64.b64encode(prev_bytes).decode('utf-8')}"
        previews_list.append(prev_b64)

        # 2. Analysis render (optimized payload for vision LLM)
        pil_analysis = pdf_page.render(scale=analysis_scale).to_pil().convert("RGB")
        if max(pil_analysis.size) > 1024:
            pil_analysis.thumbnail((1024, 1024))
        ana_buf = io.BytesIO()
        pil_analysis.save(ana_buf, format="JPEG", quality=70)
        ana_bytes = ana_buf.getvalue()

        pages_data.append({
            "original_page_number": page_num,
            "page_index": idx,
            "preview_b64": prev_b64,
            "analysis_bytes": ana_bytes,
        })

        del pil_preview
        del pil_analysis

    return {
        "total_pdf_pages": total_pdf_pages,
        "selected_pages": selected_page_numbers,
        "pages": pages_data,
        "previews_list": previews_list,
    }


def ingest_essay_images(
    image_bytes_list: List[bytes],
    page_range: Optional[str] = None
) -> Dict[str, Any]:
    """
    Handles multi-image uploads (camera/gallery photos).
    """
    total_images = len(image_bytes_list)
    selected_page_numbers = parse_page_range(total_images, page_range)
    pages_data = []
    previews_list = []

    for idx, page_num in enumerate(selected_page_numbers):
        raw_b = image_bytes_list[page_num - 1]
        try:
            pil_img = Image.open(io.BytesIO(raw_b)).convert("RGB")
        except Exception:
            continue

        # Preview
        prev_copy = pil_img.copy()
        if max(prev_copy.size) > 1200:
            prev_copy.thumbnail((1200, 1200))
        pbuf = io.BytesIO()
        prev_copy.save(pbuf, format="JPEG", quality=75)
        p_bytes = pbuf.getvalue()
        p_b64 = f"data:image/jpeg;base64,{base64.b64encode(p_bytes).decode('utf-8')}"
        previews_list.append(p_b64)

        # Analysis
        ana_copy = pil_img.copy()
        if max(ana_copy.size) > 1024:
            ana_copy.thumbnail((1024, 1024))
        abuf = io.BytesIO()
        ana_copy.save(abuf, format="JPEG", quality=70)
        a_bytes = abuf.getvalue()

        pages_data.append({
            "original_page_number": page_num,
            "page_index": idx,
            "preview_b64": p_b64,
            "analysis_bytes": a_bytes,
        })

    return {
        "total_pdf_pages": total_images,
        "selected_pages": selected_page_numbers,
        "pages": pages_data,
        "previews_list": previews_list,
    }


async def analyze_page_batch(
    batch_pages: List[Dict[str, Any]],
    topic: str,
    medium: str = "english",
    api_key: Optional[str] = None,
    timeout_seconds: int = 35
) -> List[Dict[str, Any]]:
    """
    Stage 1: Analyzes a small batch of pages (e.g. 2-4 pages).
    Extracts structured transcription, substantive points, page role, and uncertain spans.
    Does NOT score pages independently or enforce rigid templates.
    """
    keys_to_try = get_active_gemini_keys(api_key)
    if not keys_to_try:
        raise RuntimeError("No active Gemini API key configured.")

    page_nums = [p["original_page_number"] for p in batch_pages]
    is_hindi = (medium or "").lower() == "hindi" or bool(re.search(r'[\u0900-\u097F]', topic or ""))

    prompt = f"""You are an expert UPSC Essay Evaluator transcribing and analyzing handwritten candidate booklet pages.
ESSAY TOPIC: "{topic}"
LANGUAGE MEDIUM: {"Hindi (Devanagari)" if is_hindi else "English"}
ORIGINAL PAGES IN THIS BATCH: {page_nums}

CRITICAL INSTRUCTIONS:
1. Carefully transcribe the candidate's actual handwritten text for each page in this batch.
2. If any words or handwriting are illegible or ambiguous, list them explicitly in "uncertain_spans" — DO NOT guess or hallucinate.
3. Identify the candidate's substantive points, ideas, philosophical reflections, historical/contemporary examples, and quotes on each page.
4. Characterize the organic role of each page in the developing essay (e.g. "Opening anecdotal hook", "Thesis formulation & scope definition", "Philosophical / Ethical inquiry", "Historical perspective", "Socio-economic analysis", "Counter-argument & critical scrutiny", "Administrative & constitutional synthesis", "Concluding reflection").
5. Do NOT score these pages individually. Do NOT impose rigid section templates.
6. Provide exact verbatim quotes in "evidence_snippets" linking key arguments to the page.

OUTPUT STRICT JSON WITH THIS SCHEMA:
{{
  "pages": [
    {{
      "original_page_number": <integer matching the booklet page>,
      "transcription": "<faithful verbatim transcription of the handwriting on this page>",
      "uncertain_spans": ["<any illegible or ambiguous words/lines on this page>"],
      "substantive_points": [
        {{
          "claim": "<core idea or argument expressed on this page>",
          "argument_nature": "<philosophical / ethical / historical / socio-economic / administrative / global / literary>",
          "quotes_or_examples": ["<thinkers, books, facts, historical cases cited>"],
          "approx_location": "<top / middle / bottom of page>"
        }}
      ],
      "page_role": "<descriptive role of this page in the candidate's overall essay narrative>",
      "evidence_snippets": [
        {{
          "quote": "<exact short quote from candidate's handwriting>",
          "significance": "<why this point matters to the essay topic>"
        }}
      ]
    }}
  ]
}}"""

    multimodal_parts = []
    for p in batch_pages:
        multimodal_parts.append(types.Part.from_bytes(data=p["analysis_bytes"], mime_type="image/jpeg"))

    contents_payload = multimodal_parts + [prompt]

    gen_config = types.GenerateContentConfig(
        temperature=0.0,
        top_p=1.0,
        top_k=1,
        response_mime_type="application/json"
    )

    batch_start = time.time()
    for current_key in keys_to_try:
        if time.time() - batch_start > timeout_seconds:
            break
        try:
            client = create_fast_gemini_client(current_key)
        except Exception:
            continue

        models = get_active_gemini_models(client)[:4]
        for model_name in models:
            if time.time() - batch_start > timeout_seconds:
                break
            try:
                response = await asyncio.to_thread(
                    execute_gemini_with_resilience,
                    client=client,
                    model=model_name,
                    contents=contents_payload,
                    config=gen_config,
                    max_retries=1
                )
                if response and response.text:
                    parsed = parse_llm_json_response(response.text)
                    if isinstance(parsed, dict) and "pages" in parsed and isinstance(parsed["pages"], list):
                        record_gemini_model_outcome(model_name, True)
                        return parsed["pages"]
            except Exception as ge:
                record_gemini_model_outcome(model_name, False, str(ge))
                continue

    raise TimeoutError(f"Failed to analyze essay page batch {page_nums} within timeout limit.")


async def targeted_visual_recheck(
    page_data: Dict[str, Any],
    uncertain_spans: List[str],
    medium: str = "english",
    api_key: Optional[str] = None
) -> Tuple[str, List[str]]:
    """
    Stage 2: Rechecks uncertain spans with a focused high-contrast visual inspection.
    Preserves genuine illegibility instead of inventing text.
    """
    if not uncertain_spans:
        return "", []

    keys_to_try = get_active_gemini_keys(api_key)
    if not keys_to_try:
        return "", uncertain_spans

    p_num = page_data["original_page_number"]
    prompt = f"""Focus solely on deciphering the following uncertain handwriting spans on Booklet Page {p_num}:
Uncertain Spans: {uncertain_spans}

Instructions:
1. Re-read the visual image carefully at the specified locations.
2. Return resolved text only where you are confident in the handwriting.
3. If still illegible or faded, explicitly preserve as "[Illegible: <description>]". DO NOT invent words.

Output JSON:
{{
  "resolved_text": "<clarified text or preserved illegible notation>",
  "remaining_uncertain_spans": ["<any spans that remain truly undecipherable>"]
}}"""

    part = types.Part.from_bytes(data=page_data["analysis_bytes"], mime_type="image/jpeg")
    config = types.GenerateContentConfig(temperature=0.0, response_mime_type="application/json")

    try:
        client = create_fast_gemini_client(keys_to_try[0])
        models = get_active_gemini_models(client)[:2]
        for m in models:
            try:
                resp = await asyncio.to_thread(
                    execute_gemini_with_resilience,
                    client=client,
                    model=m,
                    contents=[part, prompt],
                    config=config,
                    max_retries=1
                )
                if resp and resp.text:
                    data = parse_llm_json_response(resp.text)
                    if isinstance(data, dict):
                        return data.get("resolved_text", ""), data.get("remaining_uncertain_spans", [])
            except Exception:
                continue
    except Exception:
        pass

    return "", uncertain_spans


async def evaluate_whole_essay(
    topic: str,
    ordered_page_records: List[Dict[str, Any]],
    total_pages: int,
    medium: str = "english",
    api_key: Optional[str] = None
) -> Dict[str, Any]:
    """
    Stage 3: Performs whole-essay holistic evaluation based on all ordered page records.
    Assesses thesis coherence, multi-dimensional argumentation, balance, expression, and synthesis.
    Returns schema completely compatible with renderEssayEvaluation and the candidate booklet viewer.
    """
    keys_to_try = get_active_gemini_keys(api_key)
    if not keys_to_try:
        raise RuntimeError("No active Gemini API key configured.")

    is_hindi = (medium or "").lower() == "hindi" or bool(re.search(r'[\u0900-\u097F]', topic or ""))

    # Assemble chronological essay chronicle with original page markings
    essay_chronicle_lines = []
    full_transcription_parts = []
    for r in ordered_page_records:
        p_num = r.get("original_page_number", 1)
        role = r.get("page_role", "Body discussion")
        txt = r.get("transcription", "").strip()
        pts = r.get("substantive_points", [])
        snippets = r.get("evidence_snippets", [])

        full_transcription_parts.append(f"[Page {p_num}]\n{txt}")

        claims_str = "; ".join([p.get("claim", "") for p in pts if isinstance(p, dict) and p.get("claim")])
        quotes_str = "; ".join([s.get("quote", "") for s in snippets if isinstance(s, dict) and s.get("quote")])

        essay_chronicle_lines.append(
            f"--- PAGE {p_num} (Role: {role}) ---\n"
            f"Candidate Text: {txt[:400]}...\n"
            f"Substantive Arguments: {claims_str}\n"
            f"Verbatim Evidence: {quotes_str}\n"
        )

    essay_chronicle = "\n".join(essay_chronicle_lines)
    transcribed_full_text = "\n\n".join(full_transcription_parts)

    system_prompt = f"""You are a senior UPSC Mains Essay Paper Examiner evaluating an authentic 125-Mark Essay answer copy.
ESSAY TOPIC: "{topic}"
TOTAL BOOKLET PAGES EVALUATED: {total_pages}
MEDIUM: {"Hindi (Devanagari)" if is_hindi else "English"}

COMPLETE PAGE-BY-PAGE CANDIDATE ESSAY CHRONICLE:
{essay_chronicle}

OFFICIAL UPSC ESSAY EVALUATION CRITERIA (125 MARKS):
1. Thesis Articulation & Sustained Relevance (20M): Did candidate define a central philosophical/thematic thesis and sustain it, or drift into generic General Studies bullet points?
2. Multi-Dimensional Exploration (50M): Exploration across diverse spheres (philosophical, ethical, historical, socio-cultural, economic, administrative, global, scientific).
3. Organic Structure & Coherence (20M): Smooth transitions between paragraphs; natural essayist flow rather than rigid forced templates.
4. Substantiation & Depth of Examples (20M): Relevant quotes, literature, constitutional doctrines, historical precedents, and contemporary cases.
5. Concluding Synthesis (15M): Visionary, forward-looking resolution that harmonizes divergent perspectives into a cohesive thesis.

GRADING CALIBRATION (Strict UPSC Bell Curve):
- Topper (>58%): 73 - 88 / 125
- Competitive (49-58%): 61 - 72 / 125
- Average (38-48%): 48 - 60 / 125
- Needs Work (<38%): 25 - 47 / 125

MANDATORY RULES:
- Cite ONLY authentic verbatim text written by the candidate (provided in chronicle above).
- Link each observation, strength, and gap to its EXACT ORIGINAL PAGE NUMBER (e.g. Page 1, Page 3, Page 7).
- NEVER use generic placeholder quotes like "Candidate wrote about topic".
- Output strict JSON format adhering to the schema below.

JSON OUTPUT SCHEMA:
{{
  "overall_score": <float between 25.0 and 90.0, e.g. 58.5>,
  "max_marks": 125,
  "percentile_verdict": "<Topper (58%+)|Competitive (49-58%)|Average (38-48%)|Needs Work (<38%)>",
  "detected_question": "{topic}",
  "detected_paper": "Essay",
  "detected_paper_display": "UPSC Essay Paper (125 Marks)",
  "intro_audit": {{
    "intro_score": <float, max 20.0>,
    "intro_max": 20.0,
    "intro_archetype": "<Anecdotal Hook | Philosophical Inversion | Socratic Inquiry | Historical Framing>",
    "topic_vs_question_relevance": "<assessment of thesis formulation in opening pages>",
    "current_critique": "<evaluator remarks on the opening pages>",
    "opening_passage": "<verbatim quote from candidate's Page 1 or opening paragraph>"
  }},
  "body_audit": {{
    "body_score": <float, max 85.0>,
    "body_max": 85.0,
    "strengths": [
      "<specific strength citing candidate writing and original page number, e.g. 'Nuanced philosophical contrast between justice and fairness on Page 4'>",
      "<second specific strength citing original page number>"
    ],
    "critical_gaps": [
      "<critical gap citing where candidate missed an essential dimension, with page reference>",
      "<second critical gap>"
    ],
    "missing_dimensions": [
      "<unaddressed socio-economic, administrative, or ethical angle>"
    ],
    "examiner_guidance": "<constructive mentor advice for the candidate to breach 75+ marks in UPSC Essay>"
  }},
  "conclusion_audit": {{
    "conclusion_score": <float, max 20.0>,
    "conclusion_max": 20.0,
    "conclusion_archetype": "<Cohesive Synthesis | Futuristic Vision | Dialectical Resolution>",
    "failure_mode": "<None / Cohesive Synthesis | Abrupt Ending | Unsubstantiated Moralizing>",
    "current_critique": "<critique of ending pages and how well the thesis was resolved>",
    "way_ahead_prescriptions": "<specific recommendation to strengthen the closing synthesis>"
  }},
  "point_by_point_audit": [
    {{
      "page": <integer original page number, e.g. 1>,
      "what_you_wrote": "<verbatim quote from candidate handwriting on this page>",
      "evaluator_remark": "<constructive examiner insight on this specific argument>",
      "verdict": "<Effective | Strong Dimension | Needs Nuance | Superficial>",
      "badge": "<Philosophical Hook | Socio-Economic | Historical Evidence | Counter-Perspective | Synthesis>"
    }}
  ],
  "visual_annotations": [
    {{
      "page": <integer original page number, e.g. 2>,
      "box_2d": [180, 100, 320, 900],
      "label": "Examiner Margin Note",
      "text": "<specific margin observation for this paragraph>",
      "type": "<strength | critical | suggestion>"
    }}
  ],
  "rubric_scores": {{
    "intro_score": <float>,
    "core_demand_score": <float, thesis coherence & multi-perspective exploration>,
    "value_add_score": <float, depth of literature & historical cases>,
    "presentation_score": <float, structure, transitions & language>,
    "context_score": <float, concluding synthesis & balance>
  }},
  "upsc_exam_hall_discipline": {{
    "handwriting_legibility": "<Clean & Readable | Moderate | Dense / Needs Spacing>",
    "margin_discipline": "<Maintained strictly | Slight margin encroachment>",
    "word_count_compliance": "<Target: ~1000-1200 words across booklet pages>"
  }},
  "next_attempt_focus": {{
    "thesis_crystallization": "<exact recommendation to sharpen central thesis>",
    "student_draft_quote": "<quote from candidate>",
    "booklet_placement": "<Page number and paragraph>",
    "examiner_upgrade_sentence": "<model upgrade sentence candidate can use in next attempt>"
  }},
  "model_answer": "<structured 800-1000 word model essay outline / blueprint with key dimensions and quotes for this topic>"
}}"""

    config = types.GenerateContentConfig(
        temperature=0.0,
        top_p=1.0,
        top_k=1,
        response_mime_type="application/json"
    )

    eval_start = time.time()
    for current_key in keys_to_try:
        if time.time() - eval_start > 55:
            break
        try:
            client = create_fast_gemini_client(current_key)
        except Exception:
            continue

        models = get_active_gemini_models(client)[:4]
        for model_name in models:
            if time.time() - eval_start > 55:
                break
            try:
                response = await asyncio.to_thread(
                    execute_gemini_with_resilience,
                    client=client,
                    model=model_name,
                    contents=[system_prompt],
                    config=config,
                    max_retries=1
                )
                if response and response.text:
                    parsed = parse_llm_json_response(response.text)
                    if isinstance(parsed, dict) and "overall_score" in parsed:
                        record_gemini_model_outcome(model_name, True)
                        # Attach verified transcribed full text
                        parsed["transcribed_text"] = transcribed_full_text
                        return parsed
            except Exception as ge:
                record_gemini_model_outcome(model_name, False, str(ge))
                continue

    raise TimeoutError("Whole-essay synthesis timed out across active Gemini keys.")


async def execute_essay_pipeline_background(
    job_id: str,
    pages_data: List[Dict[str, Any]],
    api_key: Optional[str] = None
) -> None:
    """
    Main resumable background worker for essay evaluation.
    1. Reads existing checkpoints to support resuming interrupted jobs.
    2. Processes pages in small batches (batch_size=2 to 4).
    3. Handles timeouts/failures by automatically shrinking batch size and retrying.
    4. Executes targeted visual recheck for uncertain spans.
    5. Runs whole-essay holistic evaluation.
    6. Persists final evaluation and deducts credit idempotently.
    """
    job = get_essay_job(job_id)
    if not job:
        print(f"[ESSAY WORKER] Job {job_id} not found.")
        return

    user_email = job.get("user_email", "guest@cookedmains.in")
    topic = job.get("question", "UPSC Mains Essay")
    medium = job.get("medium", "english")
    total_pages = len(pages_data)
    batch_size = job.get("batch_size") or 3

    # Check already completed checkpoints
    checkpoints = job.get("checkpoints") or {}
    completed_page_nums = {int(k) for k in checkpoints.keys() if str(k).isdigit()}

    # Filter pages that still need processing
    pages_to_process = [p for p in pages_data if p["original_page_number"] not in completed_page_nums]
    print(f"[ESSAY WORKER] Job {job_id}: Total pages={total_pages}, already checkpointed={len(completed_page_nums)}, remaining={len(pages_to_process)}")

    pages_by_num = {p["original_page_number"]: p for p in pages_data}

    # Stage 1: Batched Page Analysis
    if pages_to_process:
        curr_batch_size = batch_size
        idx = 0
        while idx < len(pages_to_process):
            batch = pages_to_process[idx:idx + curr_batch_size]
            b_nums = [p["original_page_number"] for p in batch]
            first_p, last_p = b_nums[0], b_nums[-1]

            processed_count = len(completed_page_nums) + idx
            progress_pct = int(10 + (processed_count / max(1, total_pages)) * 65)
            progress_msg = f"Reading pages {first_p}–{last_p} of {total_pages}..."

            update_essay_job_progress(job_id, progress_pct, progress_msg, current_batch_index=idx, status="processing")
            print(f"[ESSAY WORKER] Processing batch {b_nums} ({progress_pct}%)...")

            try:
                page_results = await analyze_page_batch(batch, topic=topic, medium=medium, api_key=api_key)
                new_records = {}
                for pr in page_results:
                    p_no = pr.get("original_page_number")
                    if p_no:
                        new_records[str(p_no)] = pr
                        completed_page_nums.add(int(p_no))

                save_essay_job_checkpoint(job_id, new_records, current_batch_index=idx, progress_pct=progress_pct, progress_message=f"Analyzed pages up to {last_p}")
                idx += len(batch)
            except Exception as batch_err:
                print(f"[ESSAY WORKER] Error processing batch {b_nums}: {batch_err}")
                if curr_batch_size > 1:
                    print(f"[ESSAY WORKER] Reducing batch size from {curr_batch_size} to 1 and retrying...")
                    curr_batch_size = 1
                    continue
                else:
                    fail_essay_job(job_id, f"Failed while reading Page {first_p}: {str(batch_err)}")
                    return

    # Reload all checkpoints
    updated_job = get_essay_job(job_id) or {}
    all_checkpoints = updated_job.get("checkpoints") or {}
    ordered_records = []
    for p in pages_data:
        p_no = p["original_page_number"]
        if str(p_no) in all_checkpoints:
            ordered_records.append(all_checkpoints[str(p_no)])
        elif p_no in all_checkpoints:
            ordered_records.append(all_checkpoints[p_no])

    if len(ordered_records) < total_pages:
        fail_essay_job(job_id, f"Incomplete page records ({len(ordered_records)} of {total_pages} processed).")
        return

    # Stage 2: Targeted Recheck for uncertain spans
    update_essay_job_progress(job_id, 78, "Mapping essay argument across pages...", status="processing")
    for r in ordered_records:
        u_spans = r.get("uncertain_spans") or []
        p_no = r.get("original_page_number")
        if u_spans and p_no in pages_by_num:
            try:
                resolved_text, rem_spans = await targeted_visual_recheck(pages_by_num[p_no], u_spans, medium=medium, api_key=api_key)
                if resolved_text:
                    r["transcription"] = r.get("transcription", "") + "\n" + resolved_text
                    r["uncertain_spans"] = rem_spans
            except Exception as recheck_err:
                print(f"Notice: recheck error on Page {p_no}: {recheck_err}")

    # Stage 3: Whole-Essay Synthesis
    update_essay_job_progress(job_id, 86, "Synthesizing whole-essay feedback...", status="processing")
    try:
        eval_result = await evaluate_whole_essay(
            topic=topic,
            ordered_page_records=ordered_records,
            total_pages=total_pages,
            medium=medium,
            api_key=api_key
        )
    except Exception as synth_err:
        print(f"[ESSAY WORKER] Whole-essay synthesis error: {synth_err}")
        fail_essay_job(job_id, f"Synthesis error: {str(synth_err)}")
        return

    # Save to candidate Locker
    previews = updated_job.get("pages") or [p["preview_b64"] for p in pages_data]
    eval_id = f"eval_{int(time.time())}_{uuid.uuid4().hex[:6]}"
    overall_score = float(eval_result.get("overall_score") or 55.0)
    pct = round((overall_score / 125.0) * 100, 1)

    saved_id = save_evaluation_record(
        email=user_email,
        paper="Essay",
        max_marks=125,
        question=topic,
        overall_score=overall_score,
        percentage=pct,
        evaluation_dict=eval_result,
        pages_list=previews,
        forced_eval_id=eval_id
    )

    # Complete Job
    complete_essay_job(job_id, eval_result, eval_id=saved_id or eval_id)

    # Idempotent Credit Handling: deduct credit only once upon 100% completion
    was_not_yet_deducted = mark_essay_job_credit_deducted(job_id)
    if was_not_yet_deducted:
        use_user_credit(user_email)

    user_info = get_user(user_email)
    log_platform_activity(
        user_email=user_email,
        user_name=(user_info.get("name") if user_info else None) or user_email.split("@")[0].title(),
        action_type="copy_evaluated",
        title=f"Evaluated Essay Paper (125M) — Scored {overall_score}/125",
        detail=f"Topic: {topic[:80]}",
        eval_id=saved_id or eval_id
    )
    print(f"[ESSAY WORKER SUCCESS] Job {job_id} completed successfully! Score: {overall_score}/125")
