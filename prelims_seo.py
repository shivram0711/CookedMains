"""
prelims_seo.py
High-Performance Dynamic SEO Page Renderer for UPSC Prelims
Pre-renders semantic HTML with Schema.org Quiz structured data for subject hubs and year archives.
"""

import os
import json
import html
from typing import Dict, List, Optional, Any

BASE_DIR = os.path.dirname(__file__)
DATA_PATH = os.path.join(BASE_DIR, "static", "data", "prelims_pyqs.json")

# Subject mapping dictionary: slug -> metadata
SUBJECT_META = {
    "polity": {
        "name": "Polity & Governance",
        "title": "UPSC Polity PYQs Topic-Wise with Official Answer Keys (2011–2026) | CookedMains",
        "description": "Practice 300+ authentic UPSC Prelims Polity & Governance PYQs with official answer keys, NCERT/Laxmikanth standard references, and topper elimination traps.",
        "icon": "🏛️",
        "badge": "High Yield Core",
        "color": "amber",
        "slug": "polity",
        "match_keys": ["Polity & Governance", "Polity"]
    },
    "economy": {
        "name": "Economy & Banking",
        "title": "UPSC Economy PYQs Topic-Wise with Official Explanations (2011–2026) | CookedMains",
        "description": "Master 310+ authentic UPSC Prelims Economy & Banking questions. Monetary policy, balance of payments, fiscal deficit, and budget concepts solved with official keys.",
        "icon": "📈",
        "badge": "High Yield Core",
        "color": "emerald",
        "slug": "economy",
        "match_keys": ["Economy", "Economy & Banking"]
    },
    "environment": {
        "name": "Environment & Ecology",
        "title": "UPSC Environment & Ecology PYQs Topic-Wise with Solutions (2011–2026) | CookedMains",
        "description": "Solve 270+ authentic UPSC Prelims Environment & Ecology PYQs. National parks, climate treaties, IUCN statuses, and wildlife acts with official keys.",
        "icon": "🌿",
        "badge": "20-25% Weightage",
        "color": "emerald",
        "slug": "environment",
        "match_keys": ["Environment & Ecology", "Environment"]
    },
    "history": {
        "name": "History & Art-Culture",
        "title": "UPSC History & Art-Culture PYQs Topic-Wise with Official Keys (2011–2026) | CookedMains",
        "description": "Practice 270+ authentic UPSC History & Art-Culture PYQs (2011–2026). Decoded elimination techniques and standard references.",
        "icon": "📜",
        "badge": "Core Foundation",
        "color": "amber",
        "slug": "history",
        "match_keys": ["History & Culture", "History"]
    },
    "geography": {
        "name": "Geography & Mapping",
        "title": "UPSC Geography & Mapping PYQs Topic-Wise with Official Keys (2011–2026) | CookedMains",
        "description": "Practice 200+ authentic UPSC Prelims Geography and Mapping PYQs. River systems, geomorphology, oceanography, and world map locations with official solutions.",
        "icon": "🌍",
        "badge": "Map & Concepts",
        "color": "sky",
        "slug": "geography",
        "match_keys": ["Geography", "Geography & Mapping"]
    },
    "science-and-tech": {
        "name": "Science & Technology",
        "title": "UPSC Science & Technology PYQs Topic-Wise with Solutions (2011–2026) | CookedMains",
        "description": "Practice 210+ authentic UPSC Prelims Science & Tech questions (2011–2026). Biotechnology, AI, space missions, CRISPR, and defense tech solved with official keys.",
        "icon": "🔬",
        "badge": "Current Applied",
        "color": "indigo",
        "slug": "science-and-tech",
        "match_keys": ["Science & Technology", "Sci-Tech", "Science and Technology"]
    }
}

# Alias mapping
SLUG_ALIASES = {
    "polity-governance": "polity",
    "economy-banking": "economy",
    "environment-ecology": "environment",
    "history-culture": "history",
    "geography-mapping": "geography",
    "science-tech": "science-and-tech",
    "sci-tech": "science-and-tech"
}

_QUESTIONS_CACHE: Optional[List[Dict[str, Any]]] = None

def load_pyqs() -> List[Dict[str, Any]]:
    global _QUESTIONS_CACHE
    if _QUESTIONS_CACHE is not None:
        return _QUESTIONS_CACHE
    try:
        if os.path.exists(DATA_PATH):
            with open(DATA_PATH, "r", encoding="utf-8") as f:
                _QUESTIONS_CACHE = json.load(f)
        else:
            _QUESTIONS_CACHE = []
    except Exception:
        _QUESTIONS_CACHE = []
    return _QUESTIONS_CACHE


def get_prelims_seo_page(slug: str) -> Optional[str]:
    """
    Returns full pre-rendered HTML for a given subject slug or 4-digit year.
    Returns None if the slug does not match any known SEO target.
    """
    raw_slug = slug.strip().lower()
    norm_slug = SLUG_ALIASES.get(raw_slug, raw_slug)

    all_questions = load_pyqs()
    if not all_questions:
        return None

    # Check if subject
    if norm_slug in SUBJECT_META:
        meta = SUBJECT_META[norm_slug]
        match_keys = meta["match_keys"]
        filtered = [q for q in all_questions if q.get("subject") in match_keys]
        return render_subject_page(meta, filtered)

    # Check if 4-digit year between 2011 and 2026
    if raw_slug.isdigit() and 2011 <= int(raw_slug) <= 2026:
        year_num = int(raw_slug)
        filtered = [q for q in all_questions if q.get("year") == year_num]
        return render_year_page(year_num, filtered)

    # Check if single authentic question ID (e.g. 2026-q001, q_2024_p1_1, etc.)
    matching_q = next((q for q in all_questions if str(q.get("id", "")).lower() == raw_slug), None)
    if matching_q:
        return render_question_page(matching_q)

    return None


def render_subject_page(meta: Dict[str, Any], questions: List[Dict[str, Any]]) -> str:
    """Renders high-contrast, Schema-rich subject landing page."""
    subject_name = meta["name"]
    title = meta["title"]
    description = meta["description"]
    canonical_url = f"https://cookedmains.com/prelims/{meta['slug']}"
    count = len(questions)

    # Build Quiz Schema.org JSON-LD
    schema_questions = []
    for idx, q in enumerate(questions[:25]):  # Include up to 25 items in rich Quiz schema
        q_text = q.get("question_text", "").strip()
        opts = q.get("options", [])
        c_opt = q.get("correct_option", "")
        c_idx = q.get("correct_index", -1)
        
        correct_answer_text = ""
        if 0 <= c_idx < len(opts):
            correct_answer_text = f"Option {c_opt}: {opts[c_idx]}"
        elif opts:
            correct_answer_text = f"Option {c_opt}"

        schema_questions.append({
            "@type": "Question",
            "name": f"UPSC {q.get('year', 2024)} {subject_name} Question {idx + 1}",
            "text": q_text,
            "learningResourceType": "Practice problem",
            "educationalLevel": "Competitive exam",
            "suggestedAnswer": [{"@type": "Answer", "text": opt} for opt in opts],
            "acceptedAnswer": {
                "@type": "Answer",
                "text": correct_answer_text,
                "comment": {
                    "@type": "Comment",
                    "text": q.get("explanation", "")
                }
            }
        })

    quiz_schema = {
        "@context": "https://schema.org",
        "@type": ["Quiz", "ItemPage"],
        "name": f"UPSC Prelims {subject_name} PYQs (2011–2026)",
        "description": description,
        "educationalLevel": "UPSC Civil Services Examination (IAS/IPS)",
        "about": subject_name,
        "hasPart": schema_questions
    }

    # Render questions HTML
    cards_html = []
    for idx, q in enumerate(questions, 1):
        q_id = q.get("id", f"q{idx}")
        year = q.get("year", "PYQ")
        sub_topic = html.escape(q.get("sub_topic", subject_name))
        difficulty = html.escape(q.get("difficulty", "Moderate"))
        diff_color = "text-amber-400 bg-amber-950/60 border-amber-800/60" if difficulty == "Tough" else "text-emerald-400 bg-emerald-950/60 border-emerald-800/60"
        
        q_text = html.escape(q.get("question_text", "")).replace("\n", "<br>")
        opts = q.get("options", [])
        c_opt = q.get("correct_option", "")
        c_idx = q.get("correct_index", -1)
        explanation = html.escape(q.get("explanation", "")).replace("\n", "<br>")
        ref = html.escape(q.get("standard_book_ref", "Standard UPSC Reference Material"))
        trap = html.escape(q.get("elimination_trap", ""))

        opts_html = []
        letters = ["A", "B", "C", "D"]
        for opt_i, opt_text in enumerate(opts):
            letter = letters[opt_i] if opt_i < len(letters) else str(opt_i + 1)
            is_correct = (letter == c_opt or opt_i == c_idx)
            cls_base = "border-slate-800 bg-slate-900/40 text-slate-200"
            correct_badge = f'<span class="ml-auto text-xs font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800">UPSC Key ({c_opt})</span>' if is_correct else ''
            
            opts_html.append(f'''
            <div class="flex items-start gap-3 p-3.5 rounded-lg border {cls_base} text-sm leading-relaxed">
              <span class="flex-shrink-0 w-6 h-6 rounded-md bg-slate-800 border border-slate-700 font-bold text-xs flex items-center justify-center text-slate-300">{letter}</span>
              <div class="flex-1">{html.escape(str(opt_text))}</div>
              {correct_badge}
            </div>
            ''')

        trap_block = f'''
        <div class="mt-3 p-3 rounded-lg bg-red-950/30 border border-red-900/40 text-xs text-red-200/90 leading-relaxed">
          <span class="font-bold text-red-400">⚠️ Elimination Trap:</span> {trap}
        </div>
        ''' if trap else ''

        cards_html.append(f'''
        <article class="p-6 rounded-xl bg-slate-900/90 border border-slate-800 shadow-lg hover:border-slate-700 transition" id="{q_id}">
          <div class="flex flex-wrap items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-800/80">
            <div class="flex flex-wrap items-center gap-2">
              <span class="px-2.5 py-1 rounded-md text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">UPSC {year}</span>
              <span class="px-2.5 py-1 rounded-md text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700">{sub_topic}</span>
              <span class="px-2.5 py-1 rounded-md text-xs font-semibold border {diff_color}">{difficulty}</span>
            </div>
            <a href="/prelims?subject={meta['slug']}&qid={q_id}" class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-amber-300 bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 transition">
              <span>🎯 Solve in Focus Mode</span>
              <span>→</span>
            </a>
          </div>

          <p class="text-slate-100 font-medium text-base leading-relaxed mb-5">
            <span class="font-bold text-amber-400 mr-1.5">Q{idx}.</span> {q_text}
          </p>

          <div class="grid grid-cols-1 gap-2.5 mb-5">
            {''.join(opts_html)}
          </div>

          <details class="group rounded-lg border border-slate-800 bg-slate-950/60 p-4">
            <summary class="flex items-center justify-between cursor-pointer text-sm font-semibold text-slate-300 hover:text-amber-400 transition select-none">
              <span class="flex items-center gap-2">
                <span>🧠 Official UPSC Key &amp; Decoded Answer</span>
                <span class="text-xs px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">Official Key: Option {c_opt}</span>
              </span>
              <span class="text-slate-500 group-open:rotate-180 transition">▼</span>
            </summary>
            <div class="mt-4 pt-3 border-t border-slate-800 text-sm text-slate-300 leading-relaxed space-y-3">
              <div>
                <p class="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Standard Reference</p>
                <p class="text-xs text-slate-300 bg-slate-900 p-2 rounded border border-slate-800">📖 {ref}</p>
              </div>
              <div>
                <p class="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Detailed Explanation</p>
                <p class="text-slate-300 text-sm leading-relaxed">{explanation}</p>
              </div>
              {trap_block}
            </div>
          </details>
        </article>
        ''')

    # Subject pills for internal linking
    subject_links = []
    for s_key, s_data in SUBJECT_META.items():
        is_cur = (s_key == meta["slug"])
        active_cls = "bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20" if is_cur else "bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800 hover:border-slate-700"
        subject_links.append(f'''
        <a href="/prelims/{s_key}" class="px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition {active_cls}">
          {s_data["icon"]} {s_data["name"]}
        </a>
        ''')

    # Years pills
    year_links = []
    for y in range(2026, 2010, -1):
        year_links.append(f'''
        <a href="/prelims/pyqs/{y}" class="px-3 py-1.5 rounded-md text-xs font-semibold bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 transition">
          {y}
        </a>
        ''')

    return f'''<!DOCTYPE html>
<html lang="en" class="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0">
  <title>{html.escape(title)}</title>
  <meta name="description" content="{html.escape(description)}">
  <meta name="keywords" content="UPSC {subject_name} PYQs, UPSC Prelims {subject_name} topic wise, UPSC CSE {subject_name} questions with solutions, UPSC Official Answer Key">
  <link rel="canonical" href="{canonical_url}">

  <!-- OpenGraph -->
  <meta property="og:type" content="website">
  <meta property="og:url" content="{canonical_url}">
  <meta property="og:title" content="{html.escape(title)}">
  <meta property="og:description" content="{html.escape(description)}">
  <meta property="og:image" content="https://cookedmains.com/static/brand_logo_dark.png">

  <!-- Twitter -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="{html.escape(title)}">
  <meta name="twitter:description" content="{html.escape(description)}">
  <meta name="twitter:image" content="https://cookedmains.com/static/brand_logo_dark.png">

  <!-- Schema.org Quiz JSON-LD -->
  <script type="application/ld+json">
  {json.dumps(quiz_schema, ensure_ascii=False, indent=2)}
  </script>

  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;600;700&display=swap">
  <link rel="icon" type="image/png" href="/static/favicon-32x32.png">

  <!-- Tailwind CSS -->
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    body {{ font-family: 'Plus Jakarta Sans', sans-serif; }}
    .font-mono {{ font-family: 'JetBrains Mono', monospace; }}
    html.dark {{ background-color: #020617; color: #f8fafc; }}
    html.dark body {{ background-color: #020617; color: #f8fafc; }}
    html.dark .brand-logo-light {{ display: none !important; }}
    html.dark .brand-logo-dark {{ display: block !important; }}
    html:not(.dark) {{ background-color: #f8fafc; color: #0f172a; }}
    html:not(.dark) body {{ background-color: #f8fafc; color: #0f172a; }}
    html:not(.dark) .brand-logo-light {{ display: block !important; }}
    html:not(.dark) .brand-logo-dark {{ display: none !important; }}
    html:not(.dark) .light-card {{ background-color: #ffffff !important; border-color: #e2e8f0 !important; color: #0f172a !important; }}
  </style>
  <script>
    tailwind.config = {{
      darkMode: 'class',
      theme: {{
        extend: {{
          colors: {{
            slate: {{
              850: '#151f33',
              900: '#0f172a',
              950: '#020617'
            }}
          }}
        }}
      }}
    }};
  </script>
</head>
<body class="bg-slate-950 text-slate-100 min-h-screen antialiased selection:bg-amber-500 selection:text-slate-950">

  <!-- Sticky Top Conversion Banner -->
  <header class="sticky top-0 z-50 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
    <div class="max-w-6xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-3">
      <div class="flex items-center gap-3">
        <a href="/prelims" class="flex items-center gap-2 group">
          <img src="/static/brand_logo_light.png" alt="Cooked Mains Logo" class="brand-logo-light h-8 w-auto object-contain">
          <img src="/static/brand_logo_dark.png" alt="Cooked Mains Logo" class="brand-logo-dark h-8 w-auto object-contain">
          <div class="flex flex-col justify-center">
            <span class="text-sm font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight flex items-center">
              Cooked <span class="text-amber-500 ml-1">Mains</span>
            </span>
            <span class="text-[9px] font-mono font-bold tracking-wider text-amber-500 uppercase leading-none mt-0.5">
              DASHBOARD
            </span>
          </div>
        </a>
        <span class="text-slate-600">/</span>
        <a href="/prelims/pyqs" class="text-xs font-semibold text-slate-400 hover:text-slate-200 transition">PYQs Archive</a>
        <span class="text-slate-600">/</span>
        <span class="text-xs font-bold text-amber-400">{subject_name}</span>
      </div>

      <div class="flex items-center gap-2.5">
        <a href="/prelims/cutoff-calculator" class="hidden sm:inline-flex text-xs font-semibold text-slate-300 hover:text-white px-3 py-1.5 rounded-lg border border-slate-800 hover:bg-slate-800 transition">
          📊 EV Calculator
        </a>
        <a href="/prelims/mock-tests" class="hidden sm:inline-flex text-xs font-semibold text-slate-300 hover:text-white px-3 py-1.5 rounded-lg border border-slate-800 hover:bg-slate-800 transition">
          ⚡ Mock Tests
        </a>
        <a href="/prelims?subject={meta['slug']}" class="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold text-slate-950 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 shadow-md shadow-amber-500/20 hover:scale-105 transition">
          <span>🚀 Practice in Timed Focus Mode</span>
          <span>→</span>
        </a>
      </div>
    </div>
  </header>

  <main class="max-w-5xl mx-auto px-4 py-8">
    <!-- Hero Header -->
    <div class="mb-8 p-6 sm:p-8 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-900/60 border border-slate-800 shadow-xl">
      <div class="flex flex-wrap items-center gap-2 mb-3">
        <span class="px-2.5 py-1 rounded-md text-xs font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">{meta['badge']}</span>
        <span class="px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700">{count} Solved Questions</span>
        <span class="px-2.5 py-1 rounded-md text-xs font-medium text-emerald-400 bg-emerald-950/60 border border-emerald-800/60">Official UPSC Keys 2011–2026</span>
      </div>

      <h1 class="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight mb-3">
        {meta['icon']} UPSC Prelims {subject_name} PYQs Topic-Wise
      </h1>
      <p class="text-slate-300 text-sm sm:text-base leading-relaxed max-w-3xl mb-6">
        Authentic UPSC Civil Services Examination questions with official UPSC answer keys, standard textbook citations (NCERT, Laxmikanth, Economic Survey, Environment manuals), and examiner elimination traps.
      </p>

      <div class="flex flex-wrap items-center gap-3">
        <a href="/prelims?subject={meta['slug']}" class="px-5 py-2.5 rounded-xl text-sm font-bold bg-amber-500 text-slate-950 hover:bg-amber-400 shadow-lg shadow-amber-500/25 transition">
          🎯 Launch {subject_name} Sprint in Focus Player
        </a>
        <a href="/prelims/cutoff-calculator" class="px-4 py-2.5 rounded-xl text-sm font-semibold bg-slate-800 text-slate-200 hover:bg-slate-700 border border-slate-700 transition">
          Benchmark Expected Score (-0.66 EV)
        </a>
      </div>
    </div>

    <!-- Subject Switcher Bar -->
    <section class="mb-8" aria-label="Browse all subjects">
      <div class="flex items-center justify-between mb-2">
        <h2 class="text-xs font-bold uppercase tracking-wider text-slate-400">Filter by Core UPSC Disciplines</h2>
        <a href="/prelims/pyqs" class="text-xs font-semibold text-amber-400 hover:underline">View All 16 Years →</a>
      </div>
      <div class="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {''.join(subject_links)}
      </div>
    </section>

    <!-- Year Archive Strip -->
    <section class="mb-8" aria-label="Browse by exam year">
      <h2 class="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Jump to Specific Exam Year</h2>
      <div class="flex items-center gap-1.5 flex-wrap">
        {''.join(year_links)}
      </div>
    </section>

    <!-- Questions Feed -->
    <section class="space-y-6" aria-label="UPSC Questions List">
      <div class="flex items-center justify-between pb-2 border-b border-slate-800">
        <h2 class="text-lg font-bold text-slate-200 flex items-center gap-2">
          <span>Official Questions Vault</span>
          <span class="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">{count} Questions</span>
        </h2>
        <span class="text-xs text-slate-400">Strict UPSC Keys • Zero Hallucinations</span>
      </div>

      {''.join(cards_html)}
    </section>

    <!-- Bottom Conversion Card -->
    <div class="mt-12 p-8 rounded-2xl bg-gradient-to-r from-amber-500/10 via-slate-900 to-emerald-500/10 border border-slate-800 text-center">
      <h3 class="text-xl sm:text-2xl font-bold text-white mb-2">Ready to test your real UPSC Prelims speed?</h3>
      <p class="text-sm text-slate-400 max-w-xl mx-auto mb-6">
        Simulate actual exam pressure with our 100-Question UPSC Full Simulation and Sectional Sprints with instant negative marking penalty analytics.
      </p>
      <div class="flex flex-wrap items-center justify-center gap-3">
        <a href="/prelims" class="px-6 py-3 rounded-xl text-sm font-bold text-slate-950 bg-amber-500 hover:bg-amber-400 shadow-lg shadow-amber-500/25 transition">
          🚀 Open Interactive Prelims Command Center
        </a>
        <a href="/prelims/mock-tests" class="px-5 py-3 rounded-xl text-sm font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 transition">
          ⚡ Configure Custom Mock Test
        </a>
      </div>
    </div>
  </main>

  <footer class="mt-16 border-t border-slate-800 bg-slate-950 py-8 text-center text-xs text-slate-400">
    <p>© 2026 CookedMains. Authentic UPSC CSE Prelims &amp; Mains preparation technology.</p>
  </footer>
  <script>
    (function() {{
      const savedTheme = localStorage.getItem('prelims_theme') || 'dark';
      if (savedTheme === 'dark') document.documentElement.classList.add('dark');
      else document.documentElement.classList.remove('dark');
    }})();
  </script>
</body>
</html>'''


def render_year_page(year: int, questions: List[Dict[str, Any]]) -> str:
    """Renders year-specific UPSC Prelims solved question paper."""
    title = f"UPSC Prelims {year} Question Paper with Official Keys & Explanations | CookedMains"
    description = f"Complete UPSC CSE Prelims {year} General Studies Paper 1 solved question paper. Official answer key, elimination traps, and subject-wise breakdown."
    canonical_url = f"https://cookedmains.com/prelims/pyqs/{year}"
    count = len(questions)

    # Simple Quiz schema
    schema_questions = []
    for idx, q in enumerate(questions[:25]):
        q_text = q.get("question_text", "").strip()
        opts = q.get("options", [])
        c_opt = q.get("correct_option", "")
        c_idx = q.get("correct_index", -1)
        ans_text = opts[c_idx] if 0 <= c_idx < len(opts) else f"Option {c_opt}"

        schema_questions.append({
            "@type": "Question",
            "name": f"UPSC Prelims {year} GS1 Question {idx + 1}",
            "text": q_text,
            "learningResourceType": "Practice problem",
            "educationalLevel": "Competitive exam",
            "suggestedAnswer": [{"@type": "Answer", "text": opt} for opt in opts],
            "acceptedAnswer": {
                "@type": "Answer",
                "text": ans_text,
                "comment": {
                    "@type": "Comment",
                    "text": q.get("explanation", "")
                }
            }
        })

    quiz_schema = {
        "@context": "https://schema.org",
        "@type": ["Quiz", "ItemPage"],
        "name": f"UPSC Prelims {year} Solved Paper",
        "description": description,
        "educationalLevel": "UPSC Civil Services Examination",
        "hasPart": schema_questions
    }

    # Render questions HTML
    cards_html = []
    letters = ["A", "B", "C", "D"]
    for idx, q in enumerate(questions, 1):
        q_id = q.get("id", f"q{idx}")
        subject = html.escape(q.get("subject", "General Studies"))
        sub_topic = html.escape(q.get("sub_topic", ""))
        difficulty = html.escape(q.get("difficulty", "Moderate"))
        q_text = html.escape(q.get("question_text", "")).replace("\n", "<br>")
        opts = q.get("options", [])
        c_opt = q.get("correct_option", "")
        c_idx = q.get("correct_index", -1)
        explanation = html.escape(q.get("explanation", "")).replace("\n", "<br>")
        ref = html.escape(q.get("standard_book_ref", "Standard Reference"))

        opts_html = []
        for opt_i, opt_text in enumerate(opts):
            letter = letters[opt_i] if opt_i < len(letters) else str(opt_i + 1)
            is_correct = (letter == c_opt or opt_i == c_idx)
            cls_base = "border-slate-800 bg-slate-900/40 text-slate-200"
            badge = f'<span class="ml-auto text-xs font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800">Key ({c_opt})</span>' if is_correct else ''
            opts_html.append(f'''
            <div class="flex items-start gap-3 p-3 rounded-lg border {cls_base} text-sm">
              <span class="flex-shrink-0 w-6 h-6 rounded bg-slate-800 font-bold text-xs flex items-center justify-center text-slate-300">{letter}</span>
              <div class="flex-1">{html.escape(str(opt_text))}</div>
              {badge}
            </div>
            ''')

        cards_html.append(f'''
        <article class="p-6 rounded-xl bg-slate-900/90 border border-slate-800 shadow-lg" id="{q_id}">
          <div class="flex flex-wrap items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-800/80">
            <div class="flex items-center gap-2">
              <span class="px-2.5 py-1 rounded text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">{subject}</span>
              <span class="text-xs text-slate-400">{sub_topic}</span>
            </div>
            <a href="/prelims?year={year}&qid={q_id}" class="text-xs font-semibold text-amber-300 hover:text-amber-200">
              Solve in Focus Mode →
            </a>
          </div>

          <p class="text-slate-100 font-medium text-base leading-relaxed mb-4">
            <span class="font-bold text-amber-400">Q{idx}.</span> {q_text}
          </p>

          <div class="grid grid-cols-1 gap-2 mb-4">
            {''.join(opts_html)}
          </div>

          <details class="group rounded-lg border border-slate-800 bg-slate-950/60 p-3.5">
            <summary class="flex items-center justify-between cursor-pointer text-xs font-semibold text-slate-300 hover:text-amber-400 select-none">
              <span>🧠 Official Key: Option {c_opt} (Click for Rationale)</span>
              <span class="group-open:rotate-180 transition">▼</span>
            </summary>
            <div class="mt-3 pt-3 border-t border-slate-800 text-xs text-slate-300 space-y-2">
              <p><span class="font-bold text-slate-400">Reference:</span> {ref}</p>
              <p class="leading-relaxed">{explanation}</p>
            </div>
          </details>
        </article>
        ''')

    # Year archive strip
    year_links = []
    for y in range(2026, 2010, -1):
        is_cur = (y == year)
        active_cls = "bg-amber-500 text-slate-950 font-bold" if is_cur else "bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800"
        year_links.append(f'''
        <a href="/prelims/pyqs/{y}" class="px-3 py-1.5 rounded-md text-xs font-semibold transition {active_cls}">
          {y}
        </a>
        ''')

    return f'''<!DOCTYPE html>
<html lang="en" class="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0">
  <title>{html.escape(title)}</title>
  <meta name="description" content="{html.escape(description)}">
  <link rel="canonical" href="{canonical_url}">

  <!-- OpenGraph -->
  <meta property="og:type" content="website">
  <meta property="og:url" content="{canonical_url}">
  <meta property="og:title" content="{html.escape(title)}">
  <meta property="og:description" content="{html.escape(description)}">
  <meta property="og:image" content="https://cookedmains.com/static/brand_logo_dark.png">

  <!-- Schema.org Quiz JSON-LD -->
  <script type="application/ld+json">
  {json.dumps(quiz_schema, ensure_ascii=False, indent=2)}
  </script>

  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;600;700&display=swap">
  <link rel="icon" type="image/png" href="/static/favicon-32x32.png">

  <!-- Tailwind CSS -->
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    body {{ font-family: 'Plus Jakarta Sans', sans-serif; }}
    .font-mono {{ font-family: 'JetBrains Mono', monospace; }}
    html.dark {{ background-color: #020617; color: #f8fafc; }}
    html.dark body {{ background-color: #020617; color: #f8fafc; }}
    html.dark .brand-logo-light {{ display: none !important; }}
    html.dark .brand-logo-dark {{ display: block !important; }}
    html:not(.dark) {{ background-color: #f8fafc; color: #0f172a; }}
    html:not(.dark) body {{ background-color: #f8fafc; color: #0f172a; }}
    html:not(.dark) .brand-logo-light {{ display: block !important; }}
    html:not(.dark) .brand-logo-dark {{ display: none !important; }}
    html:not(.dark) .light-card {{ background-color: #ffffff !important; border-color: #e2e8f0 !important; color: #0f172a !important; }}
  </style>
</head>
<body class="bg-slate-950 text-slate-100 min-h-screen antialiased">
  <header class="sticky top-0 z-50 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
    <div class="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <a href="/prelims" class="font-black text-white hover:text-amber-400">CookedMains</a>
        <span class="text-slate-600">/</span>
        <a href="/prelims/pyqs" class="text-xs text-slate-400 hover:text-white">PYQs</a>
        <span class="text-slate-600">/</span>
        <span class="text-xs font-bold text-amber-400">Prelims {year}</span>
      </div>
      <a href="/prelims?year={year}" class="px-4 py-2 rounded-lg text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300">
        Solve {year} Paper with Timer →
      </a>
    </div>
  </header>

  <main class="max-w-5xl mx-auto px-4 py-8">
    <div class="mb-8 p-6 rounded-2xl bg-slate-900 border border-slate-800">
      <h1 class="text-2xl sm:text-3xl font-black text-white mb-2">UPSC Prelims {year} Solved Paper</h1>
      <p class="text-slate-300 text-sm mb-4">Official questions with official keys, references, and trap analysis.</p>
      <div class="flex flex-wrap gap-1.5">
        {''.join(year_links)}
      </div>
    </div>

    <section class="space-y-6">
      {''.join(cards_html)}
    </section>
  </main>

  <footer class="mt-16 border-t border-slate-800 py-8 text-center text-xs text-slate-500">
    <p>© 2026 CookedMains. All rights reserved.</p>
  </footer>
  <script>
    (function() {{
      const savedTheme = localStorage.getItem('prelims_theme') || 'dark';
      if (savedTheme === 'dark') document.documentElement.classList.add('dark');
      else document.documentElement.classList.remove('dark');
    }})();
  </script>
</body>
</html>'''


def render_question_page(q: Dict[str, Any]) -> str:
    """Renders a standalone semantic QAPage for an individual UPSC past question."""
    qid = html.escape(str(q.get("id", "")))
    year = q.get("year", "2024")
    subject = html.escape(str(q.get("subject", "General Studies")))
    sub_topic = html.escape(str(q.get("sub_topic", subject)))
    raw_text = q.get("question_text", "")
    escaped_text = html.escape(raw_text)
    
    headline_clean = " ".join(raw_text.replace("\n", " ").split())[:75]
    if len(raw_text) > 75:
        headline_clean += "..."
    escaped_headline = html.escape(headline_clean)
    
    title = f"UPSC Prelims {year} {subject}: {escaped_headline} | Official Answer Key & Solution"
    description = f"Practice this authentic UPSC Prelims {year} {subject} question on {sub_topic}. Verified with official UPSC answer key, Topper elimination trap analysis, and standard references."
    canonical_url = f"https://cookedmains.com/prelims/question/{qid}"
    
    options = q.get("options", [])
    correct_opt = str(q.get("correct_option", "A")).upper()
    correct_idx = q.get("correct_index", 0)
    explanation = html.escape(q.get("explanation", "Official UPSC verified solution."))
    elim_trap = html.escape(q.get("elimination_trap", "UPSC tests subtle conceptual definitions."))
    book_ref = html.escape(q.get("standard_book_ref", ""))
    
    options_html = []
    accepted_answer_text = ""
    labels = ["A", "B", "C", "D"]
    for i, opt in enumerate(options):
        lbl = labels[i] if i < len(labels) else str(i+1)
        is_correct = (lbl == correct_opt) or (i == correct_idx)
        opt_text = html.escape(str(opt))
        if is_correct:
            accepted_answer_text = f"Option {lbl}: {opt_text}"
            options_html.append(f"""
            <div class="p-3.5 rounded-2xl bg-emerald-500/10 border-2 border-emerald-500/50 flex items-start gap-3">
              <span class="w-7 h-7 rounded-lg bg-emerald-500 text-slate-950 font-black flex items-center justify-center text-xs shrink-0">{lbl}</span>
              <div class="flex flex-col gap-0.5">
                <span class="text-xs font-bold text-emerald-400">Official UPSC Key Confirmed</span>
                <p class="text-xs text-white font-medium">{opt_text}</p>
              </div>
            </div>""")
        else:
            options_html.append(f"""
            <div class="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-start gap-3">
              <span class="w-7 h-7 rounded-lg bg-slate-800 text-slate-300 font-bold flex items-center justify-center text-xs shrink-0">{lbl}</span>
              <p class="text-xs text-slate-300 pt-1">{opt_text}</p>
            </div>""")

    schema_json = json.dumps({
        "@context": "https://schema.org",
        "@type": "QAPage",
        "mainEntity": {
            "@type": "Question",
            "name": f"UPSC Prelims {year} {subject}: {headline_clean}",
            "text": raw_text,
            "answerCount": 1,
            "acceptedAnswer": {
                "@type": "Answer",
                "text": accepted_answer_text or explanation,
                "url": canonical_url
            }
        }
    })

    mains_link = q.get("mains_linkage", {})
    mains_html = ""
    if mains_link and mains_link.get("question"):
        m_q = html.escape(mains_link.get("question", ""))
        m_p = html.escape(mains_link.get("paper", "GS"))
        mains_html = f"""
        <div class="p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-emerald-500/10 to-slate-900 border border-amber-500/30 flex items-center justify-between gap-4 flex-wrap">
          <div class="flex flex-col gap-1 flex-1 min-w-[200px]">
            <span class="text-[11px] font-bold text-amber-400 flex items-center gap-1.5">✍️ Related Mains Question ({m_p})</span>
            <p class="text-xs text-slate-300 italic">"{m_q}"</p>
          </div>
          <a href="/?paper={m_p}&question={html.escape(mains_link.get('question', ''))}" target="_blank" class="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition shadow-md shrink-0">
            Evaluate Mains Copy →
          </a>
        </div>"""

    subject_slug = q.get("subject", "").lower().replace(" & ", "-").replace(" ", "-")

    return f"""<!DOCTYPE html>
<html lang="en" class="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0">
  <title>{title}</title>
  <meta name="description" content="{description}">
  <link rel="canonical" href="{canonical_url}">
  <meta property="og:type" content="article">
  <meta property="og:url" content="{canonical_url}">
  <meta property="og:title" content="{title}">
  <meta property="og:description" content="{description}">
  <meta property="og:image" content="https://cookedmains.com/static/brand_logo_dark.png">
  <script type="application/ld+json">
  {schema_json}
  </script>
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {{
      darkMode: 'class',
      theme: {{
        extend: {{
          colors: {{
            amber: {{ 400: '#fbbf24', 500: '#f59e0b', 600: '#d97706' }},
            slate: {{ 850: '#0f172a', 900: '#0b1120', 950: '#020617' }}
          }}
        }}
      }}
    }};
  </script>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;600;700&display=swap">
  <style>
    body {{ font-family: 'Plus Jakarta Sans', sans-serif; }}
    .font-mono {{ font-family: 'JetBrains Mono', monospace; }}
  </style>
</head>
<body class="bg-slate-950 text-slate-100 min-h-screen flex flex-col antialiased">
  <header class="border-b border-slate-800 bg-slate-900/60 backdrop-blur-md sticky top-0 z-40">
    <div class="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
      <a href="/" class="flex items-center gap-2">
        <div class="w-8 h-8 rounded-xl bg-amber-500 flex items-center justify-center font-black text-slate-950 text-sm">CM</div>
        <span class="font-black text-base text-white">Cooked<span class="text-amber-400">Mains</span></span>
        <span class="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-amber-500/15 text-amber-400 font-bold ml-1">PYQ Vault</span>
      </a>
      <div class="flex items-center gap-3">
        <a href="/prelims/pyqs" class="text-xs font-semibold text-slate-400 hover:text-white transition">All PYQs</a>
        <a href="/prelims?qid={qid}&mode=focus" class="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition shadow-md">
          Practice in Focus Mode →
        </a>
      </div>
    </div>
  </header>

  <main class="flex-1 max-w-4xl mx-auto px-4 py-8 w-full flex flex-col gap-6">
    <nav class="flex items-center gap-2 text-xs font-mono text-slate-500 flex-wrap" aria-label="Breadcrumb">
      <a href="/" class="hover:text-slate-300">Home</a>
      <span>/</span>
      <a href="/prelims/pyqs" class="hover:text-slate-300">Prelims PYQs</a>
      <span>/</span>
      <a href="/prelims/pyqs/{subject_slug}" class="hover:text-slate-300">{subject}</a>
      <span>/</span>
      <span class="text-amber-400 font-semibold">{qid}</span>
    </nav>

    <div class="p-6 sm:p-7 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col gap-5 shadow-2xl">
      <div class="flex items-center justify-between flex-wrap gap-2 pb-3 border-b border-slate-800">
        <div class="flex items-center gap-2">
          <span class="px-2.5 py-0.5 rounded-md bg-amber-500/15 text-amber-400 text-xs font-black font-mono">UPSC CSE {year}</span>
          <span class="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-xs font-semibold">{subject}</span>
          <span class="text-xs text-slate-500">· {sub_topic}</span>
        </div>
        <span class="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold font-mono">Verified Key Confirmed</span>
      </div>

      <div class="text-sm sm:text-base font-semibold text-white leading-relaxed whitespace-pre-line">
        {escaped_text}
      </div>

      <div class="flex flex-col gap-2.5 pt-2">
        {''.join(options_html)}
      </div>

      <div class="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex flex-col gap-1.5 text-xs text-amber-200">
        <span class="font-bold text-amber-400 uppercase tracking-wider text-[11px] flex items-center gap-1">🎯 Topper's Trap Detector</span>
        <p class="leading-relaxed font-semibold">{elim_trap}</p>
      </div>

      <div class="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col gap-2 text-xs leading-relaxed text-slate-300">
        <span class="font-bold text-white text-sm">Official UPSC Forensic Breakdown:</span>
        <p class="whitespace-pre-line">{explanation}</p>
        {f'<span class="text-[11px] text-amber-400 font-mono pt-2 border-t border-slate-800">📖 Reference: {book_ref}</span>' if book_ref else ''}
      </div>

      {mains_html}

      <div class="pt-3 border-t border-slate-800 flex items-center justify-between flex-wrap gap-3">
        <span class="text-xs text-slate-400">Want to test under exam timer?</span>
        <a href="/prelims?qid={qid}&mode=focus" class="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition shadow-md flex items-center gap-1.5">
          <span>Solve in Timed Player</span>
          <span>→</span>
        </a>
      </div>
    </div>
  </main>

  <footer class="border-t border-slate-800 py-6 text-center text-xs text-slate-500">
    © 2026 CookedMains · Authentic UPSC CSE Prelims Question Vault
  </footer>
  <script>
    (function() {{
      const savedTheme = localStorage.getItem('prelims_theme') || 'dark';
      if (savedTheme === 'dark') document.documentElement.classList.add('dark');
      else document.documentElement.classList.remove('dark');
    }})();
  </script>
</body>
</html>"""
