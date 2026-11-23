# prelims_ca_generator.py - Dynamic UPSC Prelims Current Affairs & Reverse-Osmosis Question Generator
import os
import json
import re
import uuid
import random
from typing import List, Dict, Any, Optional
from concurrent.futures import ThreadPoolExecutor, as_completed
from google import genai
from google.genai import types

# Load .env file if present
env_path = os.path.join(os.path.dirname(__file__), ".env")
if os.path.exists(env_path):
    with open(env_path, "r", encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if line and not line.startswith("#") and "=" in line:
                k, v = line.split("=", 1)
                os.environ[k.strip()] = v.strip().strip('"').strip("'")

from evaluator_engine import create_fast_gemini_client, parse_llm_json_response, get_active_gemini_models

CA_DATA_PATH = os.path.join(os.path.dirname(__file__), "static", "data", "current_affairs_pyqs.json")

def _get_gemini_client(api_key: Optional[str] = None):
    key = api_key or os.environ.get("GEMINI_API_KEY") or os.environ.get("GOOGLE_API_KEY")
    if not key:
        return None
    return create_fast_gemini_client(key.strip())

# Verified UPSC Trusted Sources Repository & Topics Blueprint (2026–2027)
TRUSTED_SOURCE_DOMAINS = [
    {"source": "The Hindu / PIB", "domain": "Polity & Governance", "sample_trigger": "Article 200 Presidential Assent Guidelines, Delimitation Commission criteria, Bharatiya Nyaya Sanhita rules, RPA 1951 transhumant pastoral voting rights"},
    {"source": "The Indian Express (Explained) / RBI Bulletin", "domain": "Economy & Agriculture", "sample_trigger": "Index of Eight Core Industries weight revisions, Jalan Economic Capital Framework surplus transfer, Sovereign Green Bonds yield spread, PaRRVA algorithmic market surveillance by SEBI"},
    {"source": "Down To Earth / UNEP / FAO", "domain": "Environment & Ecology", "sample_trigger": "International Year of Rangelands and Pastoralists 2026 (IYRP), C3 vs C4 photosynthetic pathway in savanna grasses, AMOC collapse and Indian summer monsoon tipping point, Shola-grassland exotic weed eradication (Conocarpus ban)"},
    {"source": "Science & Tech (PIB / Nature / DRDO / ISRO)", "domain": "Science & Technology", "sample_trigger": "Borophene 2D allotrope in aerospace lubricants, Netra AEW&C Mk-II AESA radar, Vikram-1 solid-fuel suborbital rocket stage, Qdenga tetravalent dengue vaccine immunogenicity"},
    {"source": "MEA / UN / WTO / IEA", "domain": "International Relations", "sample_trigger": "11th NPT Review Conference Article VI non-proliferation compliance, US-Saudi 123 civil nuclear agreement, WTO Dispute Settlement Appellate Body deadlock and MPIA interim arrangement, India-Nordic clean energy grid partnership"},
    {"source": "ASI / National Museum / Epigraphia Indica", "domain": "History & Culture", "sample_trigger": "Thousand Pillar Kakatiya sandbox foundation engineering, Chola Leiden Copper Plates repatriation, Sanchi Stupa Sariputra relic diplomacy, Mohenjo-daro Dancing Girl centenary and lost-wax bronze casting"}
]

PRELIMS_EXAMINER_SYSTEM_PROMPT = """You are a Senior Question Setter for the Union Public Service Commission (UPSC) Civil Services Preliminary Examination (General Studies Paper 1).

YOUR MISSION:
Synthesize an authentic, rigorous, UPSC-grade Multiple Choice Question (MCQ) based on contemporary high-yield current affairs events from official UPSC-trusted sources (The Hindu, Indian Express Explained, PIB, Down to Earth, PRS Legislative Research, RBI Bulletins, and UNEP/FAO reports).

REVERSE-OSMOSIS PEDAGOGY:
UPSC does NOT ask superficial one-line news trivia. UPSC uses a dynamic news trigger (stimulus) as a gateway to test the underlying STATIC ROOT CONCEPT (NCERT Class 11/12, standard treatises like Laxmikanth, Shankar/PMF IAS, Ramesh Singh, or statutory acts).

QUESTION ARCHETYPE RULES:
1. Archetype: Use statement-based formats ("Consider the following statements... Which of the statements given above is/are correct?") or modern pair-matching ("How many of the above pairs are correctly matched? Only one / Only two / All three / None") or Assertion-Reason ("Statement-I and Statement-II").
2. Options: Exactly 4 options (A, B, C, D).
3. Distractor Craft:
   - Plant realistic examiner traps: invert physiological mechanisms (e.g., C3 vs C4, acute vs chronic), swap statutory authorities vs constitutional bodies, exchange ministries, or use subtle extreme qualifiers ("solely", "mandatorily", "all").
   - Each incorrect option must represent a deliberate trap with a diagnostic explanation.
4. Static Root Linkage: Clearly specify which NCERT chapter or textbook topic forms the bedrock of the question.
5. Topper Elimination Trap: Explain the strategic cognitive trigger a top 50 ranker uses to eliminate wrong options instantly.
6. Mains Linkage: Provide a linked 10/15-marker GS Mains question based on this topic.

STRICT JSON OUTPUT FORMAT:
You must output ONLY valid raw JSON with NO markdown backticks, NO formatting wrappers, matching this exact structure:
{
  "id": "ca-dyn-YYYYMM-XXX",
  "year": 2026,
  "month": "January 2026",
  "subject": "Environment & Ecology",
  "sub_topic": "Concrete sub-topic title",
  "difficulty": "Tough",
  "correct_option": "B",
  "correct_index": 1,
  "upsc_official_key": "Verified authentic key justification",
  "question_text": "In the context of recent developments...",
  "options": [
    "1 and 2 only",
    "2 and 3 only",
    "1 and 3 only",
    "1, 2 and 3"
  ],
  "explanation": "Statement 1 is incorrect because... Statement 2 is correct because... Statement 3 is correct because...",
  "standard_book_ref": "Specific NCERT / Laxmikanth / Govt Report citation",
  "elimination_trap": "How a topper eliminates Statement 1 to reach option B directly",
  "mains_linkage": {
    "paper": "GS3",
    "question": "Examine the policy implications of..."
  },
  "source_tag": "The Hindu / PIB / Down To Earth",
  "static_root": "Exact foundational NCERT static concept",
  "option_analysis": [
    {"option": "A", "status": "Incorrect", "verdict": "Explanation of trap in Option A"},
    {"option": "B", "status": "Correct", "verdict": "Matches authentic statutory and scientific criteria"},
    {"option": "C", "status": "Incorrect", "verdict": "Explanation of trap in Option C"},
    {"option": "D", "status": "Incorrect", "verdict": "Explanation of trap in Option D"}
  ]
}
"""

def generate_single_dynamic_ca_question(
    month: str = "January 2026",
    subject: str = "all",
    difficulty: str = "Tough",
    custom_topic: Optional[str] = None,
    api_key: Optional[str] = None
) -> Optional[Dict[str, Any]]:
    """
    Generates a single high-standard UPSC Prelims MCQ dynamically using Gemini.
    """
    client = _get_gemini_client(api_key=api_key)
    if not client:
        return None

    # Pick a theme / domain
    if subject and subject.lower() != "all":
        domain_candidates = [d for d in TRUSTED_SOURCE_DOMAINS if d["domain"].lower() == subject.lower()]
        domain_info = random.choice(domain_candidates) if domain_candidates else random.choice(TRUSTED_SOURCE_DOMAINS)
    else:
        domain_info = random.choice(TRUSTED_SOURCE_DOMAINS)

    target_subject = domain_info["domain"]
    target_trigger = custom_topic or domain_info["sample_trigger"]
    target_source = domain_info["source"]

    user_prompt = f"""Generate an authentic UPSC Prelims Multiple Choice Question.

TARGET SPECIFICATIONS:
- Month / Temporal Context: {month}
- Subject: {target_subject}
- Difficulty Level: {difficulty}
- Source Pedagogy: {target_source}
- Contemporary Topic Seed / Theme: {target_trigger}
- Format: Statement-based (3 statements) or Pair-Matching.

Ensure authentic phrasing with subtle examiner traps, static root NCERT linkages, and complete 4-option distractor analysis.
Output raw JSON only."""

    try:
        model_name = "gemini-2.5-flash"
        response = client.models.generate_content(
            model=model_name,
            contents=user_prompt,
            config=types.GenerateContentConfig(
                system_instruction=PRELIMS_EXAMINER_SYSTEM_PROMPT,
                temperature=0.35,
                max_output_tokens=2200
            )
        )
        raw_text = response.text or ""
        parsed = parse_llm_json_response(raw_text)

        if not parsed or not isinstance(parsed, dict) or "question_text" not in parsed:
            return None

        # Clean up ID and metadata
        q_id = f"ca-dyn-{uuid.uuid4().hex[:8]}"
        parsed["id"] = q_id
        parsed["year"] = 2026
        parsed["month"] = month if month != "all" else parsed.get("month", "2026 Dossier")
        parsed["subject"] = target_subject
        if "options" not in parsed or len(parsed["options"]) != 4:
            return None

        # Determine correct index
        opt_char = parsed.get("correct_option", "A").upper()
        char_map = {"A": 0, "B": 1, "C": 2, "D": 3}
        parsed["correct_index"] = char_map.get(opt_char, 0)

        return parsed
    except Exception as e:
        print(f"Error generating dynamic CA question: {e}")
        return None


def generate_dynamic_prelims_ca_batch(
    count: int = 3,
    month: str = "January 2026",
    subject: str = "all",
    difficulty: str = "Tough",
    custom_topic: Optional[str] = None,
    api_key: Optional[str] = None,
    save_to_disk: bool = True
) -> List[Dict[str, Any]]:
    """
    Generates a batch of dynamic UPSC questions and optionally merges them into current_affairs_pyqs.json.
    """
    questions = []
    # Cap batch count between 1 and 10 to ensure high quality and prevent timeouts
    target_count = max(1, min(count, 30))

    # Generate in parallel for high speed and scale up to 30 Qs
    max_workers = min(6, target_count)
    if max_workers > 1:
        with ThreadPoolExecutor(max_workers=max_workers) as executor:
            futures = [
                executor.submit(
                    generate_single_dynamic_ca_question,
                    month=month,
                    subject=subject,
                    difficulty=difficulty,
                    custom_topic=custom_topic,
                    api_key=api_key
                )
                for _ in range(target_count)
            ]
            for fut in as_completed(futures):
                try:
                    res = fut.result()
                    if res:
                        questions.append(res)
                except Exception as e:
                    print(f"Parallel CA generation worker error: {e}")
    else:
        q = generate_single_dynamic_ca_question(
            month=month,
            subject=subject,
            difficulty=difficulty,
            custom_topic=custom_topic,
            api_key=api_key
        )
        if q:
            questions.append(q)

    # Fallback padding from verified monthly magazines if AI returns fewer than requested
    if len(questions) < target_count and os.path.exists(CA_DATA_PATH):
        try:
            with open(CA_DATA_PATH, "r", encoding="utf-8") as f:
                curated_ca = json.load(f)
            
            pool = curated_ca
            if subject and subject.lower() != "all":
                pool = [q for q in curated_ca if subject.lower() in (q.get("subject") or "").lower()]
                if not pool:
                    pool = curated_ca

            if custom_topic:
                tokens = [t.strip().lower() for t in custom_topic.split(",") if t.strip()]
                t_matches = [
                    q for q in pool
                    if any(t in (q.get("sub_topic") or "").lower() or t in (q.get("question_text") or "").lower() for t in tokens)
                ]
                if t_matches:
                    pool = t_matches

            existing_ids = {q.get("id") for q in questions}
            remaining_pool = [q for q in pool if q.get("id") not in existing_ids]
            random.shuffle(remaining_pool)
            needed = target_count - len(questions)
            questions.extend(remaining_pool[:needed])
        except Exception as err:
            print(f"Could not load fallback CA questions: {err}")

    if save_to_disk and questions:
        try:
            existing = []
            if os.path.exists(CA_DATA_PATH):
                with open(CA_DATA_PATH, "r", encoding="utf-8") as f:
                    existing = json.load(f)
            
            existing_ids = {item["id"] for item in existing if "id" in item}
            for q in questions:
                if q["id"] not in existing_ids:
                    existing.append(q)
                    existing_ids.add(q["id"])

            with open(CA_DATA_PATH, "w", encoding="utf-8") as f:
                json.dump(existing, f, indent=2, ensure_ascii=False)
            print(f"Successfully saved {len(questions)} dynamic CA questions. Total pool: {len(existing)}")
        except Exception as err:
            print(f"Could not persist questions to CA JSON: {err}")

    return questions
