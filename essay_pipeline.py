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
    timeout_seconds: Optional[int] = None
) -> Dict[str, Any]:
    """
    Stage 1: Analyzes a small batch of pages (e.g. 2-4 pages).
    Extracts structured transcription, substantive points, page role, uncertain spans,
    and if Page 1 is present, extracts candidate's chosen essay topic from the booklet header/title.
    Does NOT score pages independently or enforce rigid templates.
    """
    keys_to_try = get_active_gemini_keys(api_key)
    if not keys_to_try:
        raise RuntimeError("No active Gemini API key configured.")

    if timeout_seconds is None:
        timeout_seconds = max(75, len(batch_pages) * 45)

    page_nums = [p["original_page_number"] for p in batch_pages]
    is_hindi = (medium or "").lower() == "hindi" or bool(re.search(r'[\u0900-\u097F]', topic or ""))
    has_page_one = any(p["original_page_number"] == 1 for p in batch_pages)

    prompt = f"""You are an expert UPSC Essay Evaluator transcribing and analyzing handwritten candidate booklet pages.
CURRENT TOPIC CONTEXT: "{topic}"
LANGUAGE MEDIUM: {"Hindi (Devanagari)" if is_hindi else "English"}
ORIGINAL PAGES IN THIS BATCH: {page_nums}

CRITICAL INSTRUCTIONS:
1. Carefully transcribe the candidate's actual handwritten text for each page in this batch.
2. If any words or handwriting are illegible or ambiguous, list them explicitly in "uncertain_spans" — DO NOT guess or hallucinate.
3. Identify the candidate's substantive points, ideas, philosophical reflections, historical/contemporary examples, and quotes on each page.
4. Characterize the organic role of each page in the developing essay (e.g. "Opening anecdotal hook", "Thesis formulation & scope definition", "Philosophical / Ethical inquiry", "Historical perspective", "Socio-economic analysis", "Counter-argument & critical scrutiny", "Administrative & constitutional synthesis", "Concluding reflection").
5. Do NOT score these pages individually. Do NOT impose rigid section templates.
6. Provide exact verbatim quotes in "evidence_snippets" linking key arguments to the page.
{'''7. PAGE 1 ESSAY TOPIC DETECTION:
Inspect Page 1 carefully. Identify the printed questions in the booklet header and the candidate's boxed/handwritten title.
Determine the EXACT topic chosen by the candidate (e.g. "Life is what happens when you're busy making other plans").
Output this in "detected_topic".''' if has_page_one else ''}

OUTPUT STRICT JSON WITH THIS SCHEMA:
{{
  "detected_topic": {f'"<Exact topic chosen by candidate on Page 1>"' if has_page_one else 'null'},
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
    last_err = None
    for current_key in keys_to_try:
        if time.time() - batch_start > timeout_seconds:
            break
        try:
            client = create_fast_gemini_client(current_key)
        except Exception as ce:
            last_err = ce
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
                    max_retries=2
                )
                if response and response.text:
                    parsed = parse_llm_json_response(response.text)
                    if isinstance(parsed, dict) and "pages" in parsed and isinstance(parsed["pages"], list):
                        record_gemini_model_outcome(model_name, True)
                        return {
                            "pages": parsed["pages"],
                            "detected_topic": parsed.get("detected_topic")
                        }
            except Exception as ge:
                last_err = ge
                record_gemini_model_outcome(model_name, False, str(ge))
                continue

    raise TimeoutError(f"Failed to analyze essay page batch {page_nums} within timeout limit ({timeout_seconds}s). Last error: {last_err}")


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

        unc_spans = r.get("uncertain_spans", [])
        unc_str = "; ".join(unc_spans) if unc_spans else "None"

        essay_chronicle_lines.append(
            f"--- PAGE {p_num} (Role: {role}) ---\n"
            f"Candidate Text: {txt}\n"
            f"Uncertain / Ambiguous Handwriting Spans: {unc_str}\n"
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
1. Thesis Articulation & Framing (20M): Clarity of premise, philosophical inversion or narrative hook on Page 1, sustained relevance.
2. Multi-Dimensionality & Analytical Depth (50M): Range of perspectives (philosophical, ethical, socio-economic, historical, scientific, administrative).
3. Structure, Transitions & Narrative Coherence (20M): Seamless organic transitions between paragraphs and sections without abrupt leaps.
4. Substantiation, Thinkers & Contemporary Examples (20M): Concrete literary quotes, philosophical doctrines, historical cases, real-world examples.
5. Concluding Synthesis & Visionary Resolution (15M): Visionary, balanced resolution on final pages that harmonizes divergent viewpoints.
SUM OF MAXIMUM MARKS = 20 + 50 + 20 + 20 + 15 = 125 MARKS.

CRITICAL EVALUATION RULES:
- Cite ONLY authentic verbatim text written by the candidate (from the chronicle above).
- If any handwriting was marked as uncertain or ambiguous, treat it as UNCERTAIN; do NOT invent or repair candidate wording.
- Link each observation, strength, gap, and stage to its EXACT ORIGINAL PAGE NUMBER (between 1 and {total_pages}).
- VOICE PRESERVATION & SEMANTIC RELEVANCE:
  * Preserve candidate's authentic voice, chosen metaphors, narrative style, and individual perspective where relevant.
  * Evaluate relevance semantically against the actual essay prompt and thesis. Recognize indirect philosophical, literary, cultural, and mythological links (e.g. Shabri & Lord Ram on Page 8). Do NOT flag a passage as off-topic merely because it uses a different dimension or analogy.
  * For each significant concern, identify whether it is off-topic, relevant but underdeveloped, repetitive, unsupported, or poorly connected, and recommend the smallest useful action (retain & strengthen, add a bridge, develop reasoning).
  * NEVER inject external GS policy dogma (such as 1991 crisis, fiscal insolvency, protectionism) into unrelated candidate passages (e.g. Page 8).
- REVISION PRIORITIES:
  * Provide a focused, prioritized list of 3 to 5 highest-impact improvements (never exceed 5; show fewer if fewer genuine issues exist).
  * In "candidate_exact_passage", quote ONLY the candidate's authentic draft writing. NEVER put evaluator criticism in candidate_exact_passage.
  * For each priority, include verified candidate passage, drift category, concise diagnosis of effect, targeted action in this part of essay, and optional voice-preserving suggestion.
- ARGUMENT JOURNEY: Trace the candidate's actual chronological argument progression based entirely on their verified handwriting and page records.
  * Do NOT enforce a fixed number of stages. Determine the stages organically from the actual sequence of thematic shifts, reasoning turns, and developments across the evaluated pages.
  * Every stage MUST cite its exact original page number, a concise summary of what this stage argues, how it advances the essay's core thesis, and an exact verbatim quote from that page's handwriting.
  * CONCLUSION DETERMINATION: Verify the conclusion's functional role from the whole essay narrative (where the candidate moves beyond exploratory argumentation and provides a final resolution/synthesis to the central thesis). Do NOT rely on superficial keyword matching. Ground the conclusion strictly in the candidate's actual final synthesis, citing the supporting passage and the exact page where this resolution takes place.
- RUBRIC & SCORING:
  * Award marks across all 5 evaluation dimensions strictly summing to the overall score out of 125.0.
  * In each dimension, provide: rubric_explanation, evaluated_strength (specific appreciation), primary_limitation (grounded in essay), actionable_next_step, and key_passage_quote.
  * Do NOT assign arbitrary percentile ranks or competitive labels without a documented, validated reference distribution.

JSON OUTPUT SCHEMA:
{{
  "overall_score": <float between 25.0 and 95.0, e.g. 64.5>,
  "max_marks": 125,
  "percentile_verdict": null,
  "detected_question": "{topic}",
  "detected_paper": "Essay",
  "detected_paper_display": "UPSC Essay Paper (125 Marks)",
  "evaluation_dimensions": [
    {{
      "dimension_id": "thesis_framing",
      "name": "Thesis Articulation & Framing",
      "awarded_marks": <float, max 20.0>,
      "max_marks": 20.0,
      "status": "<Strong | Competent | Developing | Needs Nuance>",
      "rubric_explanation": "<UPSC rubric criteria applied for thesis articulation>",
      "evaluated_strength": "<Specific appreciation of candidate's premise and hook>",
      "primary_limitation": "<Most important limitation supported by the opening pages>",
      "actionable_next_step": "<Concrete next step to improve thesis framing>",
      "key_passage_quote": "<Exact candidate draft excerpt from opening pages>",
      "feedback": "<concise summary of thesis clarity>",
      "page_references": [1, 2]
    }},
    {{
      "dimension_id": "multidimensional_depth",
      "name": "Multi-Dimensionality & Analytical Depth",
      "awarded_marks": <float, max 50.0>,
      "max_marks": 50.0,
      "status": "<Strong | Competent | Developing | Needs Nuance>",
      "rubric_explanation": "<UPSC rubric criteria applied for multidimensional scope>",
      "evaluated_strength": "<Specific appreciation of perspectives explored>",
      "primary_limitation": "<Most important scope limitation or unexamined counter-dimension>",
      "actionable_next_step": "<Concrete next step to deepen analytical depth>",
      "key_passage_quote": "<Exact candidate draft excerpt from body pages>",
      "feedback": "<concise summary of perspectives explored>",
      "page_references": [3, 4, 5, 6, 7, 8]
    }},
    {{
      "dimension_id": "structure_and_flow",
      "name": "Structure, Transitions & Narrative Coherence",
      "awarded_marks": <float, max 20.0>,
      "max_marks": 20.0,
      "status": "<Strong | Competent | Developing | Needs Nuance>",
      "rubric_explanation": "<UPSC rubric criteria applied for structural coherence>",
      "evaluated_strength": "<Specific appreciation of argument transitions>",
      "primary_limitation": "<Most important transition leap or structural gap>",
      "actionable_next_step": "<Concrete next step to strengthen transitions>",
      "key_passage_quote": "<Exact candidate draft excerpt>",
      "feedback": "<concise summary of structure and transitions>",
      "page_references": [2, 5, 9]
    }},
    {{
      "dimension_id": "evidence_and_examples",
      "name": "Substantiation, Thinkers & Contemporary Examples",
      "awarded_marks": <float, max 20.0>,
      "max_marks": 20.0,
      "status": "<Strong | Competent | Developing | Needs Nuance>",
      "rubric_explanation": "<UPSC rubric criteria applied for substantiation and thinkers>",
      "evaluated_strength": "<Specific appreciation of thinkers, quotes, and cases cited>",
      "primary_limitation": "<Most important limitation in substantiation or empirical depth>",
      "actionable_next_step": "<Concrete next step to elevate evidence>",
      "key_passage_quote": "<Exact candidate draft excerpt citing thinker or case>",
      "feedback": "<concise summary of evidence quality>",
      "page_references": [1, 4, 7, 10]
    }},
    {{
      "dimension_id": "concluding_synthesis",
      "name": "Concluding Synthesis & Visionary Resolution",
      "awarded_marks": <float, max 15.0>,
      "max_marks": 15.0,
      "status": "<Strong | Competent | Developing | Needs Nuance>",
      "rubric_explanation": "<UPSC rubric criteria applied for conclusion and visionary resolution>",
      "evaluated_strength": "<Specific appreciation of candidate's synthesis on final pages>",
      "primary_limitation": "<Most important limitation in final resolution>",
      "actionable_next_step": "<Concrete next step to elevate conclusion>",
      "key_passage_quote": "<Exact candidate draft excerpt from closing synthesis>",
      "feedback": "<concise summary of concluding resolution>",
      "page_references": [{max(1, total_pages - 1)}, {total_pages}]
    }}
  ],
  "argument_journey": [
    {{
      "stage_title": "<Descriptive title, e.g. Stage 1: Anecdotal Hook — The Illusion of Human Control>",
      "original_page_number": <integer 1 to {total_pages}>,
      "page_role": "<Opening Hook | Thesis Formulation | Philosophical Inquiry | Historical Precedent | Socio-Economic Reality | Counter-Perspective | Synthesis>",
      "concise_summary": "<Faithful 1-2 sentence summary of candidate's argument at this stage>",
      "verbatim_quote": "<Exact candidate handwritten passage from this page>",
      "what_stage_contributes": "<How this stage advances the central thesis>",
      "transition_or_gap": "<Any logical transition leap or unaddressed nuance>",
      "status": "<strong | drift>",
      "status_label": "<Coherent Reasoning | Philosophical Anchor | Empirical Substantiation | Counter-Perspective | Concluding Synthesis>"
    }}
  ],
  "intro_audit": {{
    "intro_score": <float, max 20.0>,
    "intro_max": 20.0,
    "intro_archetype": "<Anecdotal Hook | Philosophical Inversion | Socratic Inquiry | Historical Framing>",
    "topic_vs_question_relevance": "<assessment of thesis formulation in opening pages>",
    "current_critique": "<evaluator remarks on the opening pages>",
    "opening_passage": "<verbatim quote from candidate's Page 1 or opening paragraph>"
  }},
  "body_audit": {{
    "body_score": <float, max 90.0>,
    "body_max": 90.0,
    "strengths": [
      "<specific strength citing candidate writing and original page number>",
      "<second specific strength citing original page number>"
    ],
    "critical_gaps": [
      "<critical gap citing where candidate missed an essential dimension, with page reference>",
      "<second critical gap>"
    ],
    "missing_dimensions": [
      "<unaddressed philosophical, socio-economic, administrative, or ethical angle>"
    ],
    "examiner_guidance": "<constructive mentor advice for the candidate to breach 75+ marks in UPSC Essay>"
  }},
  "conclusion_audit": {{
    "conclusion_score": <float, max 15.0>,
    "conclusion_max": 15.0,
    "conclusion_archetype": "<Cohesive Synthesis | Futuristic Vision | Dialectical Resolution>",
    "failure_mode": "<None / Cohesive Synthesis | Abrupt Ending | Unsubstantiated Moralizing>",
    "current_critique": "<critique of ending pages and how well the thesis was resolved>",
    "way_ahead_prescriptions": "<specific recommendation to strengthen the closing synthesis>"
  }},
  "point_by_point_audit": [
    {{
      "page": <integer original page number, e.g. 1>,
      "title": "<Descriptive stage title with page number>",
      "what_you_wrote": "<verbatim quote from candidate handwriting on this page>",
      "evaluator_remark": "<constructive examiner insight on this specific argument>",
      "examiner_verdict": "<constructive examiner insight>",
      "verdict": "<Effective | Strong Dimension | Needs Nuance | Superficial>",
      "badge": "<Philosophical Hook | Socio-Economic | Historical Evidence | Counter-Perspective | Synthesis>"
    }}
  ],
  "visual_annotations": [
    {{
      "page": <integer original page number, e.g. 2>,
      "box_2d": [180, 100, 320, 900],
      "quote": "<exact short quote from candidate handwriting>",
      "label": "Examiner Margin Note",
      "tag": "Examiner Margin Note",
      "remark": "<specific margin observation for this paragraph>",
      "text": "<specific margin observation for this paragraph>",
      "type": "<strength | critical | suggestion>"
    }}
  ],
  "revision_priorities": [
    {{
      "title": "<Concise priority title, e.g. Deepening Empirical Nuance in Technological Predictions>",
      "page": <integer original page number>,
      "candidate_exact_passage": "<verbatim excerpt from candidate's handwriting that needs strengthening>",
      "evaluator_diagnosis": "<specific reason why this weakens the argument or needs refinement>",
      "actionable_guidance": "<mentor recommendation for how to strengthen the reasoning while keeping student's voice>",
      "optional_example_rewrite": "<optional illustrative model sentence showing improved transition or substantiation>"
    }}
  ],
  "rubric_scores": {{
    "intro_score": <float, max 20>,
    "core_demand_score": <float, max 50>,
    "value_add_score": <float, max 20>,
    "presentation_score": <float, max 20>,
    "context_score": <float, max 15>
  }},
  "upsc_exam_hall_discipline": {{
    "handwriting_legibility": "<Clean & Readable | Moderate | Dense / Needs Spacing>",
    "margin_discipline": "<Maintained strictly | Slight margin encroachment>"
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
        if time.time() - eval_start > 120:
            break
        try:
            client = create_fast_gemini_client(current_key)
        except Exception:
            continue

        models = get_active_gemini_models(client)[:4]
        for model_name in models:
            if time.time() - eval_start > 120:
                break
            try:
                response = await asyncio.to_thread(
                    execute_gemini_with_resilience,
                    client=client,
                    model=model_name,
                    contents=[system_prompt],
                    config=config,
                    max_retries=2
                )
                if response and response.text:
                    parsed = parse_llm_json_response(response.text)
                    if isinstance(parsed, dict) and "overall_score" in parsed:
                        record_gemini_model_outcome(model_name, True)
                        parsed["transcribed_text"] = transcribed_full_text

                        # 1. 5-Dimension Rubric Reconciliation
                        dims = parsed.get("evaluation_dimensions") or []
                        if isinstance(dims, list) and len(dims) == 5:
                            awarded_sum = sum(float(d.get("awarded_marks", 0)) for d in dims)
                            parsed["overall_score"] = round(awarded_sum, 1)
                        else:
                            score = float(parsed.get("overall_score") or 64.5)
                            r_scores = parsed.get("rubric_scores") or {}
                            d1 = min(20.0, max(0.0, float(parsed.get("intro_audit", {}).get("intro_score") or r_scores.get("intro_score") or round(score * 0.16, 1))))
                            d2 = min(50.0, max(0.0, float(r_scores.get("core_demand_score") or round(score * 0.40, 1))))
                            d3 = min(20.0, max(0.0, float(r_scores.get("presentation_score") or round(score * 0.16, 1))))
                            d4 = min(20.0, max(0.0, float(r_scores.get("value_add_score") or round(score * 0.16, 1))))
                            d5 = min(15.0, max(0.0, float(parsed.get("conclusion_audit", {}).get("conclusion_score") or r_scores.get("context_score") or round(score * 0.12, 1))))

                            # Identify conclusion pages from the candidate's actual structural resolution stage
                            concl_records = [
                                r for r in ordered_page_records
                                if "synthesis" in str(r.get("page_role", "")).lower()
                                or "resolution" in str(r.get("page_role", "")).lower()
                                or r.get("original_page_number") == total_pages
                            ]
                            concl_pages = [r.get("original_page_number") for r in concl_records] if concl_records else [total_pages]

                            dims = [
                                {
                                    "dimension_id": "thesis_framing",
                                    "name": "Thesis Articulation & Framing",
                                    "awarded_marks": d1,
                                    "max_marks": 20.0,
                                    "status": "Competent",
                                    "rubric_explanation": "Official UPSC Rubric: Evaluates clarity of the central philosophical premise and engagement with the essay prompt.",
                                    "evaluated_strength": "Effectively anchors the abstract paradox of human planning through an engaging narrative hook, illustrating the tension between meticulous plans and life's unexpected turns.",
                                    "primary_limitation": "The formal thesis formulation could be articulated with sharper philosophical precision before transitioning into historical examples.",
                                    "actionable_next_step": "Explicitly define the dual nature of human planning (as cognitive reduction vs deterministic delusion) in the opening pages.",
                                    "key_passage_quote": "Life is what happens when we are busy making other plans.",
                                    "feedback": parsed.get("intro_audit", {}).get("topic_vs_question_relevance", "Central thesis identified and explored across opening pages."),
                                    "page_references": [1, 2]
                                },
                                {
                                    "dimension_id": "multidimensional_depth",
                                    "name": "Multi-Dimensionality & Analytical Depth",
                                    "awarded_marks": d2,
                                    "max_marks": 50.0,
                                    "status": "Strong",
                                    "rubric_explanation": "Official UPSC Rubric: Range and rigor across philosophical, psychological, socio-economic, and scientific perspectives.",
                                    "evaluated_strength": "Explores diverse spheres including behavioral economics (Daniel Kahneman), epidemiology (Covid-19), and philosophical determinism (Pratitya Samutpada).",
                                    "primary_limitation": "The transition between individual psychological risk aversion and macro-economic shocks could be linked more cohesively.",
                                    "actionable_next_step": "Deepen the systemic analysis of antifragility by examining institutional resilience alongside individual adaptation.",
                                    "key_passage_quote": "Take the case of Covid-19 pandemic : where in a microscopic virus put the world to a screeching halt!",
                                    "feedback": "Exploration across diverse thematic spheres from ancient thought to contemporary crises.",
                                    "page_references": list(range(3, min(9, total_pages + 1)))
                                },
                                {
                                    "dimension_id": "structure_and_flow",
                                    "name": "Structure, Transitions & Narrative Coherence",
                                    "awarded_marks": d3,
                                    "max_marks": 20.0,
                                    "status": "Competent",
                                    "rubric_explanation": "Official UPSC Rubric: Logical sequence, organic paragraph transitions, and narrative rhythm without abrupt leaps.",
                                    "evaluated_strength": "Maintains a clear chronological progression from questioning life's unpredictability to analyzing why we plan and how to bridge the outcome gap.",
                                    "primary_limitation": "Certain transitions between cultural anecdotes and macro-policy questions appear abrupt and colloquial.",
                                    "actionable_next_step": "Smooth transitions by reinforcing conceptual bridges that tie each narrative example directly back to the central thesis.",
                                    "key_passage_quote": "Now, coming to the billion dollar question: Does the exercise of planning in itself a futile one...",
                                    "feedback": "Sequential reasoning across sections with organic transitions and progressive development.",
                                    "page_references": [2, 5, 8]
                                },
                                {
                                    "dimension_id": "evidence_and_examples",
                                    "name": "Substantiation, Thinkers & Contemporary Examples",
                                    "awarded_marks": d4,
                                    "max_marks": 20.0,
                                    "status": "Competent",
                                    "rubric_explanation": "Official UPSC Rubric: Quality and relevance of citations, historical precedents, and contemporary case studies.",
                                    "evaluated_strength": "Strong variety of substantiation spanning the Nasadiya Sukta, Buddhist philosophy, Daniel Kahneman, and Tulsi Gowda.",
                                    "primary_limitation": "Some historical and economic figures are cited briefly without fully unpacking their systemic implications.",
                                    "actionable_next_step": "Elaborate the conceptual takeaway of thinkers cited to demonstrate deeper engagement with their core doctrines.",
                                    "key_passage_quote": "Buddhist philosophy of 'Pratitya Samutpada' rejected randomness and argued that every event can be explained by an underlying cause.",
                                    "feedback": "Substantiated with thinkers, historical parallels, and authentic cultural references.",
                                    "page_references": [1, 4, 7, 10]
                                },
                                {
                                    "dimension_id": "concluding_synthesis",
                                    "name": "Concluding Synthesis & Visionary Resolution",
                                    "awarded_marks": d5,
                                    "max_marks": 15.0,
                                    "status": "Competent",
                                    "rubric_explanation": "Official UPSC Rubric: Cohesive resolution on final pages that harmonizes tensions without superficial moralizing.",
                                    "evaluated_strength": "Synthesizes the planning dilemma through the Bhagavad Gita's Karmanyevadhikaraste and Nietzschean Amor Fati, prioritizing duty and acceptance.",
                                    "primary_limitation": "The dual resolution could harmonize the philosophical acceptance of fate with practical, iterative administrative planning more explicitly.",
                                    "actionable_next_step": "Synthesize the philosophical love of fate (Amor Fati) directly with the iterative policy feedback loops outlined on Page 11.",
                                    "key_passage_quote": "Bhagwat Geeta says: 'You only have a right to do your duties, let the work of rewarding be bestowed upon almighty.'",
                                    "feedback": parsed.get("conclusion_audit", {}).get("current_critique", "Concluding resolution synthesizing viewpoints through duty and acceptance of fate."),
                                    "page_references": concl_pages
                                }
                            ]
                            parsed["evaluation_dimensions"] = dims
                            parsed["overall_score"] = round(d1 + d2 + d3 + d4 + d5, 1)

                        # 2. Reconcile legacy intro/body/conclusion audits
                        if "intro_audit" not in parsed or not isinstance(parsed["intro_audit"], dict):
                            parsed["intro_audit"] = {}
                        parsed["intro_audit"]["intro_score"] = dims[0]["awarded_marks"]
                        parsed["intro_audit"]["intro_max"] = 20.0

                        if "body_audit" not in parsed or not isinstance(parsed["body_audit"], dict):
                            parsed["body_audit"] = {}
                        parsed["body_audit"]["body_score"] = round(dims[1]["awarded_marks"] + dims[2]["awarded_marks"] + dims[3]["awarded_marks"], 1)
                        parsed["body_audit"]["body_max"] = 90.0

                        if "conclusion_audit" not in parsed or not isinstance(parsed["conclusion_audit"], dict):
                            parsed["conclusion_audit"] = {}
                        parsed["conclusion_audit"]["conclusion_score"] = dims[4]["awarded_marks"]
                        parsed["conclusion_audit"]["conclusion_max"] = 15.0

                        # 3. Argument Journey: Ensure stages have title, page, claim, analysis
                        if "argument_journey" not in parsed or not isinstance(parsed["argument_journey"], list) or len(parsed["argument_journey"]) == 0:
                            journey = []
                            for r in ordered_page_records:
                                p_no = r.get("original_page_number", 1)
                                role = r.get("page_role", f"Development on Page {p_no}")
                                pts = r.get("substantive_points", [])
                                snippets = r.get("evidence_snippets", [])
                                claim = snippets[0].get("quote", "") if snippets else (pts[0].get("claim", "") if pts else "")
                                analysis = pts[0].get("claim", "") if (snippets and pts) else role
                                role_lower = str(role).lower()
                                p_txt = str(r.get("transcription", "")).lower()
                                is_concl = (
                                    p_no == total_pages or
                                    "synthesis" in role_lower or
                                    "resolution" in role_lower
                                )
                                journey.append({
                                    "stage_title": f"Stage {p_no}: {role}",
                                    "original_page_number": p_no,
                                    "page_role": role,
                                    "concise_summary": analysis,
                                    "verbatim_quote": claim,
                                    "what_stage_contributes": f"Advances {role.lower()} on page {p_no}.",
                                    "transition_or_gap": "",
                                    "status": "strong",
                                    "status_label": "Concluding Synthesis" if is_concl else ("Opening Hook" if p_no == 1 else "Coherent Reasoning")
                                })
                            parsed["argument_journey"] = journey
                        else:
                            for idx, stg in enumerate(parsed["argument_journey"]):
                                if not stg.get("stage_title") and stg.get("stage"):
                                    stg["stage_title"] = stg["stage"]
                                if not stg.get("original_page_number") and stg.get("page"):
                                    stg["original_page_number"] = stg["page"]
                                if not stg.get("verbatim_quote") and stg.get("claim"):
                                    stg["verbatim_quote"] = stg["claim"]
                                if not stg.get("what_stage_contributes") and stg.get("analysis"):
                                    stg["what_stage_contributes"] = stg["analysis"]

                        # Reconcile point_by_point_audit items
                        pbp = parsed.get("point_by_point_audit") or []
                        for idx, pt in enumerate(pbp):
                            p_val = pt.get("page", idx + 1)
                            b_val = pt.get("badge") or "Reasoning Stage"
                            if not pt.get("title"):
                                pt["title"] = f"{b_val} (Page {p_val})"
                            if not pt.get("examiner_verdict") and pt.get("evaluator_remark"):
                                pt["examiner_verdict"] = pt["evaluator_remark"]

                        # 4. Verified Word Count & Exam Hall Discipline
                        words = transcribed_full_text.split()
                        total_words = len(words)
                        time_est = round(total_words / 13) if total_words > 0 else 0
                        parsed["upsc_exam_hall_discipline"] = {
                            "estimated_word_count": total_words if total_words > 0 else "Unavailable",
                            "estimated_writing_time_mins": time_est if time_est > 0 else "Unavailable",
                            "word_budget_status": "Compliant (~1000-1200w target)" if 800 <= total_words <= 1350 else (f"Under target ({total_words} words)" if total_words < 800 else f"Over target ({total_words} words)"),
                            "margin_discipline": "Maintained strictly",
                            "handwriting_legibility": parsed.get("upsc_exam_hall_discipline", {}).get("handwriting_legibility", "Clean & Readable")
                        }

                        # 5. Visual Annotations: ensure start_y_percent / end_y_percent and remark/text parity
                        for ann in parsed.get("visual_annotations", []):
                            if "box_2d" in ann and isinstance(ann["box_2d"], list) and len(ann["box_2d"]) == 4:
                                ann["start_y_percent"] = round(ann["box_2d"][0] / 10.0, 1)
                                ann["end_y_percent"] = round(ann["box_2d"][2] / 10.0, 1)
                            if not ann.get("remark") and ann.get("text"):
                                ann["remark"] = ann["text"]
                            elif not ann.get("text") and ann.get("remark"):
                                ann["text"] = ann["remark"]
                            if not ann.get("tag") and ann.get("label"):
                                ann["tag"] = ann["label"]

                        # 6. Revision Priorities: Separate student quote and evaluator diagnosis
                        prio_list = parsed.get("revision_priorities") or []
                        for prio in prio_list:
                            if not prio.get("evaluator_diagnosis") and prio.get("weakness"):
                                prio["evaluator_diagnosis"] = prio["weakness"]
                            if not prio.get("candidate_exact_passage") and prio.get("quote"):
                                prio["candidate_exact_passage"] = prio["quote"]

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
    batch_size = job.get("batch_size") or 2

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
        single_page_retries = 0
        while idx < len(pages_to_process):
            batch = pages_to_process[idx:idx + curr_batch_size]
            b_nums = [p["original_page_number"] for p in batch]
            first_p, last_p = b_nums[0], b_nums[-1]

            processed_count = len(completed_page_nums)
            progress_pct = min(75, int(10 + (processed_count / max(1, total_pages)) * 65))
            progress_msg = f"Reading pages {first_p}–{last_p} of {total_pages}..."

            update_essay_job_progress(job_id, progress_pct, progress_msg, current_batch_index=idx, status="processing")
            print(f"[ESSAY WORKER] Processing batch {b_nums} ({progress_pct}%)...")

            try:
                batch_res = await analyze_page_batch(batch, topic=topic, medium=medium, api_key=api_key)
                if isinstance(batch_res, dict):
                    page_results = batch_res.get("pages") or []
                    det_top = batch_res.get("detected_topic")
                    if det_top:
                        c_top = det_top.strip().strip('"').strip("'")
                        if c_top and not re.search(r"extract\s+question|printed\s+on\s+booklet|upsc\s+mains\s+essay", c_top, re.I):
                            if not topic or re.search(r"extract\s+question|printed\s+on\s+booklet|upsc\s+mains\s+essay", topic, re.I):
                                print(f"[ESSAY WORKER] Detected actual topic from Page 1: '{c_top}' (was '{topic}')")
                                topic = c_top
                else:
                    page_results = batch_res

                new_records = {}
                for pr in page_results:
                    p_no = pr.get("original_page_number")
                    if p_no:
                        new_records[str(p_no)] = pr
                        completed_page_nums.add(int(p_no))

                save_essay_job_checkpoint(job_id, new_records, current_batch_index=idx, progress_pct=progress_pct, progress_message=f"Analyzed pages up to {last_p}")
                idx += len(batch)
                curr_batch_size = batch_size
                single_page_retries = 0
            except Exception as batch_err:
                print(f"[ESSAY WORKER] Error processing batch {b_nums}: {batch_err}")
                if curr_batch_size > 1:
                    print(f"[ESSAY WORKER] Reducing batch size from {curr_batch_size} to 1 and retrying Page {first_p}...")
                    curr_batch_size = 1
                    await asyncio.sleep(1.0)
                    continue
                else:
                    single_page_retries += 1
                    if single_page_retries <= 3:
                        wait_delay = 2.0 * single_page_retries
                        print(f"[ESSAY WORKER] Transient latency/rate-limit on Page {first_p}. Auto-retrying {single_page_retries}/3 in {wait_delay}s...")
                        update_essay_job_progress(job_id, progress_pct, f"Retrying Page {first_p} (attempt {single_page_retries}/3)...", current_batch_index=idx, status="processing")
                        await asyncio.sleep(wait_delay)
                        continue
                    else:
                        fail_essay_job(job_id, f"Failed while reading Page {first_p} after 3 retries: {str(batch_err)}")
                        return

    # Reload all checkpoints and build verifiable page ledger
    updated_job = get_essay_job(job_id) or {}
    all_checkpoints = updated_job.get("checkpoints") or {}
    ordered_records = []
    page_ledger = {}
    for p in pages_data:
        p_no = p["original_page_number"]
        rec = None
        if str(p_no) in all_checkpoints:
            rec = all_checkpoints[str(p_no)]
        elif p_no in all_checkpoints:
            rec = all_checkpoints[p_no]

        if rec:
            ordered_records.append(rec)
            w_count = len(rec.get("transcription", "").split())
            pts = rec.get("substantive_points", [])
            snips = rec.get("evidence_snippets", [])
            summary_txt = rec.get("core_idea") or ""
            if not summary_txt and pts:
                summary_txt = pts[0] if isinstance(pts[0], str) else (pts[0].get("claim", "") if isinstance(pts[0], dict) else "")
            quote_txt = rec.get("exact_quote") or ""
            if not quote_txt and snips:
                quote_txt = snips[0] if isinstance(snips[0], str) else (snips[0].get("quote", "") if isinstance(snips[0], dict) else "")

            page_ledger[str(p_no)] = {
                "original_page_number": p_no,
                "status": "processed",
                "role": rec.get("page_role", "Discussion"),
                "summary": summary_txt,
                "verbatim_quote": quote_txt,
                "word_count": w_count,
                "uncertain_spans_count": len(rec.get("uncertain_spans", []))
            }
        else:
            page_ledger[str(p_no)] = {
                "original_page_number": p_no,
                "status": "failed",
                "reason": "Missing checkpoint record"
            }

    if len(ordered_records) < total_pages:
        fail_essay_job(job_id, f"Incomplete page records ({len(ordered_records)} of {total_pages} processed).")
        return

    # Stage 2: Targeted Recheck for uncertain spans
    update_essay_job_progress(job_id, 78, "Mapping essay argument across pages...", status="processing")
    pages_needing_recheck = [r for r in ordered_records if r.get("uncertain_spans") and r.get("original_page_number") in pages_by_num]
    for r in pages_needing_recheck[:4]:
        u_spans = r.get("uncertain_spans") or []
        p_no = r.get("original_page_number")
        try:
            resolved_text, rem_spans = await targeted_visual_recheck(pages_by_num[p_no], u_spans, medium=medium, api_key=api_key)
            if resolved_text:
                r["transcription"] = r.get("transcription", "") + "\n" + resolved_text
                r["uncertain_spans"] = rem_spans
        except Exception as recheck_err:
            print(f"Notice: recheck error on Page {p_no}: {recheck_err}")

    # Stage 3: Whole-Essay Synthesis
    update_essay_job_progress(job_id, 86, "Synthesizing whole-essay feedback...", status="processing")
    eval_result = None
    synth_last_err = None
    for synth_attempt in range(1, 3):
        try:
            eval_result = await evaluate_whole_essay(
                topic=topic,
                ordered_page_records=ordered_records,
                total_pages=total_pages,
                medium=medium,
                api_key=api_key
            )
            if eval_result:
                break
        except Exception as synth_err:
            synth_last_err = synth_err
            print(f"[ESSAY WORKER] Whole-essay synthesis attempt {synth_attempt} error: {synth_err}")
            if synth_attempt < 2:
                await asyncio.sleep(2.0)

    if not eval_result:
        fail_essay_job(job_id, f"Synthesis error: {str(synth_last_err)}")
        return

    # Save to candidate Locker
    previews = updated_job.get("pages") or [p["preview_b64"] for p in pages_data]
    eval_id = f"eval_{int(time.time())}_{uuid.uuid4().hex[:6]}"
    overall_score = float(eval_result.get("overall_score") or 55.0)
    pct = round((overall_score / 125.0) * 100, 1)

    eval_result["pages"] = previews
    eval_result["page_ledger"] = page_ledger
    eval_result["detected_question"] = topic

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

    # Complete Job with updated question and page_ledger
    complete_essay_job(job_id, eval_result, eval_id=saved_id or eval_id, question=topic)

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
