# question_generator.py - AI Question Generator for UPSC Mains Daily Answer Writing
import os
import json
import asyncio
from datetime import datetime
from typing import List, Dict, Any, Optional
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

from storage import (
    save_daily_news_question, 
    get_daily_news_questions, 
    get_recent_current_affairs
)
from evaluator_engine import parse_llm_json_response
from news_ingestion import get_top_editorial_articles, ingest_all_feeds

QUESTION_GENERATOR_PROMPT = """You are a Senior UPSC Syllabus Analyst & Member of the UPSC Mains Question Setting Board.

TASK:
Analyze the provided current affairs article from national newspapers (The Hindu, Indian Express, LiveMint) and formulate an authentic, high-standard UPSC Mains Examination question.

GUIDELINES:
1. Map strictly to one General Studies paper: "GS1", "GS2", "GS3", or "GS4".
2. Identify the specific UPSC Syllabus Topic Head (e.g. "Judicial Accountability", "Bilateral Groupings", "Infrastructure & Logistics", "Ethics in Governance").
3. Frame an authentic UPSC Mains question with proper directive wording ("Critically examine", "Elucidate", "Discuss", "Analyze"). 
   - Choose either 10 Marks (150 words) or 15 Marks (250 words).
4. Formulate exactly 3 core Demands of the Question that an evaluator will mark against.
5. Provide 3-5 concrete Value Addition Anchors (e.g. Constitutional Articles, Supreme Court judgments, Acts, NITI Aayog/Law Commission/RBI reports, or empirical data metrics).

ARTICLE TITLE: {title}
SOURCE: {source}
PUBLISHED: {published_date}
SUMMARY/CONTENT:
{summary}

OUTPUT FORMAT:
Return strictly a single valid JSON object with NO markdown formatting, backticks, or commentary outside the JSON:
{{
  "gs_paper": "GS2",
  "syllabus_topic": "Bilateral, Regional and Global Groupings involving India",
  "question": "In light of recent developments, critically examine the balance between national strategic autonomy and expanding multilateral partnerships. Suggest a forward-looking roadmap. (15 Marks, 250 Words)",
  "marks": 15,
  "word_limit": 250,
  "demands_of_question": [
    "Contextualize the current global geopolitical transition and India's position.",
    "Critically analyze strategic autonomy tensions with concrete bilateral/multilateral examples.",
    "Provide balanced policy recommendations and a forward-looking diplomatic roadmap."
  ],
  "value_addition_anchors": [
    "18th BRICS Declaration & Expansion",
    "Voice of Global South Summit",
    "Multi-alignment Doctrine",
    "Article 51 (Promotion of International Peace and Security)"
  ]
}}
"""

def _get_gemini_client(api_key: Optional[str] = None):
    key = api_key or os.environ.get("GEMINI_API_KEY") or os.environ.get("GOOGLE_API_KEY")
    if not key:
        raise ValueError("No Gemini API key available for question generation.")
    return genai.Client(api_key=key.strip())

def generate_question_from_article(article: Dict[str, Any], api_key: Optional[str] = None) -> Optional[Dict[str, Any]]:
    """Generates a structured UPSC question from a single news article."""
    try:
        client = _get_gemini_client(api_key)
        prompt = QUESTION_GENERATOR_PROMPT.format(
            title=article.get("title", ""),
            source=article.get("source", "National Daily"),
            published_date=article.get("published_date", "Today"),
            summary=article.get("summary", "")
        )

        candidate_models = [
            "gemini-3.6-flash",
            "gemini-3.5-flash",
            "gemini-3.7-flash",
            "gemini-flash-lite-latest",
            "gemini-3.1-flash-lite"
        ]

        config = types.GenerateContentConfig(
            temperature=0.3,
            response_mime_type="application/json"
        )

        raw_text = None
        for mod in candidate_models:
            try:
                response = client.models.generate_content(
                    model=mod,
                    contents=prompt,
                    config=config
                )
                if response and response.text:
                    raw_text = response.text
                    break
            except Exception:
                continue

        if not raw_text:
            return None

        parsed = parse_llm_json_response(raw_text)
        
        # Standardize paper
        p = str(parsed.get("gs_paper", "GS2")).upper().replace("PAPER", "").replace(" ", "").strip()
        if p not in ["GS1", "GS2", "GS3", "GS4"]:
            p = "GS2"

        q_dict = {
            "date_str": datetime.now().strftime("%Y-%m-%d"),
            "paper": p,
            "syllabus_topic": parsed.get("syllabus_topic", "Current Affairs & Governance"),
            "question": parsed.get("question", "").strip(),
            "marks": int(parsed.get("marks", 15)),
            "word_limit": int(parsed.get("word_limit", 250)),
            "demands_of_question": parsed.get("demands_of_question", []),
            "value_addition_anchors": parsed.get("value_addition_anchors", []),
            "source_headline": article.get("title", ""),
            "source_url": article.get("url", ""),
            "source_name": article.get("source", "Daily News")
        }

        if q_dict["question"]:
            q_id = save_daily_news_question(q_dict)
            q_dict["id"] = q_id
            return q_dict
    except Exception as e:
        print(f"Error generating question for '{article.get('title')}': {e}")

    return None

def generate_daily_questions_cohort(num_questions: int = 4, api_key: Optional[str] = None) -> List[Dict[str, Any]]:
    """
    Ingests live articles and generates a cohort of UPSC Mains questions covering distinct GS papers.
    """
    articles = get_top_editorial_articles(limit=15)
    if not articles:
        ingest_all_feeds()
        articles = get_top_editorial_articles(limit=15)

    generated = []
    seen_papers = set()
    
    for art in articles:
        if len(generated) >= num_questions:
            break
        q = generate_question_from_article(art, api_key=api_key)
        if q:
            generated.append(q)
            seen_papers.add(q["paper"])

    return generated

def get_or_generate_today_questions(paper: Optional[str] = None, force_refresh: bool = False, api_key: Optional[str] = None) -> List[Dict[str, Any]]:
    """
    Fetches today's news questions. If none exist or force_refresh is True, generates a fresh cohort.
    """
    today_str = datetime.now().strftime("%Y-%m-%d")
    existing = get_daily_news_questions(date_str=today_str, paper=paper)

    if existing and not force_refresh:
        return existing

    # Generate fresh questions
    new_qs = generate_daily_questions_cohort(num_questions=4, api_key=api_key)
    if paper and paper.strip().upper() not in ["ALL", "TODAY", ""]:
        clean_p = paper.strip().upper()
        return [q for q in new_qs if q["paper"] == clean_p]
    return new_qs
