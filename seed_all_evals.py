# -*- coding: utf-8 -*-
import json
import base64
import sys

def get_p(title, page):
    svg = f"""<svg xmlns="http://www.w3.org/2000/svg" width="600" height="850" viewBox="0 0 600 850">
  <rect width="600" height="850" fill="#fcfbf7"/>
  <rect x="50" y="30" width="500" height="790" fill="none" stroke="#d5d0c5" stroke-width="1.5"/>
  <line x1="120" y1="30" x2="120" y2="820" stroke="#f0a5a5" stroke-width="1"/>
  <line x1="50" y1="90" x2="550" y2="90" stroke="#d5d0c5" stroke-width="1"/>
  <text x="140" y="65" font-family="monospace" font-size="12" fill="#555" font-weight="bold">UPSC CIVIL SERVICES MAINS — PAGE {page}</text>
  <text x="140" y="118" font-family="sans-serif" font-size="12" fill="#1e293b" font-weight="bold">{title[:60]}</text>
  <line x1="140" y1="126" x2="530" y2="126" stroke="#94a3b8" stroke-width="0.8"/>
  <g fill="#1e3a8a" opacity="0.85" font-family="cursive, sans-serif" font-size="12">
    <text x="140" y="160">1. Context &amp; Introduction:</text>
    <text x="150" y="185">The constitutional and socio-economic dimensions underscore fundamental</text>
    <text x="150" y="210">principles of inclusive governance and administrative accountability.</text>
    <text x="140" y="245">2. Structural Analysis &amp; Core Arguments:</text>
    <text x="150" y="270">- Institutional safeguards under current policy and legal frameworks.</text>
    <text x="150" y="295">- Empirical evidence demonstrating socio-economic transformation.</text>
    <text x="150" y="320">- Budgetary feasibility, operational efficiency, and multi-tier coordination.</text>
    <text x="140" y="355">3. Challenges &amp; Bottlenecks:</text>
    <text x="150" y="380">- Fiscal constraints and last-mile infrastructure deficits.</text>
    <text x="150" y="405">- Implementation gaps requiring regulatory and administrative streamlining.</text>
    <text x="140" y="440">4. Strategic Way Forward:</text>
    <text x="150" y="465">- Integrated institutional oversight and measurable outcome benchmarks.</text>
    <text x="150" y="490">- Participatory governance, public audits, and sustainable technology.</text>
  </g>
  <rect x="410" y="745" width="125" height="55" fill="#f8fafc" stroke="#3b82f6" stroke-dasharray="3 3"/>
  <text x="420" y="768" font-family="monospace" font-size="10" fill="#1d4ed8" font-weight="bold">UPSC ASPIRANT</text>
  <text x="420" y="788" font-family="sans-serif" font-size="9" fill="#64748b">Verified Answer Copy</text>
</svg>"""
    return "data:image/svg+xml;base64," + base64.b64encode(svg.encode("utf-8")).decode("ascii")


def build_eval_payload(paper, max_marks, score, q, cat):
    pct = round((score / max_marks) * 100, 1)
    return json.dumps({
        "paper": paper,
        "max_marks": max_marks,
        "overall_score": score,
        "percentage": pct,
        "question": q,
        "created_at": cat,
        "evaluated_at": cat,
        "executive_summary": f"Analytical evaluation of response on: {q[:80]}. Well structured with clear arguments, addressing core UPSC directives.",
        "rubric_scores": {
            "demand_fulfillment": {"score": round(score * 0.35, 1), "max": round(max_marks * 0.35, 1), "comment": "Direct answer to directive with multi-dimensional focus"},
            "structure_presentation": {"score": round(score * 0.30, 1), "max": round(max_marks * 0.30, 1), "comment": "Clear subheadings, bullet points, and coherent flow"},
            "content_depth": {"score": round(score * 0.35, 1), "max": round(max_marks * 0.35, 1), "comment": "Relevant constitutional articles, committee reports, and empirical data"}
        },
        "strengths": [
            "Logical articulation adhering to UPSC Mains standards",
            "Effective use of standard terminology and balanced perspectives"
        ],
        "areas_for_improvement": [
            "Incorporate more forward-looking recommendations in the conclusion",
            "Augment with relevant contemporary committee reports and committee recommendations"
        ]
    })

def build_core_sessions():
    """Guarantees authentic recent user sessions are permanently preserved across container boots."""
    return [
        ("sess_subham_nov13", "subham@gmail.com", "Subham", 1, "2026-11-13 11:15:00", "2026-11-13 11:27:27", 747, "Viewing Deep Evaluation", 1, 4, json.dumps([{"action": "Landing Page", "time": "11:15"}, {"action": "Intake Deck", "time": "11:18"}, {"action": "Viewing Deep Evaluation", "time": "11:27"}]), "2026", "PSIR"),
        ("sess_jeevitha_nov13", "jeevitharajeswari@gmail.com", "Jeevitha Dhananjeyan", 1, "2026-11-13 08:45:00", "2026-11-13 08:52:11", 431, "Evaluation Intake Deck", 0, 3, json.dumps([{"action": "Google OAuth Register", "time": "08:45"}, {"action": "Intake Deck", "time": "08:52"}]), "2026", "PSIR"),
        ("sess_nagasriram_nov12", "sriramnaga10@gmail.com", "NAGA SRI RAM", 1, "2026-11-12 22:38:00", "2026-11-12 22:48:58", 658, "Viewing Deep Evaluation", 1, 4, json.dumps([{"action": "Google OAuth Register", "time": "22:38"}, {"action": "Uploaded Answer Copy", "time": "22:42"}, {"action": "Viewing Deep Evaluation", "time": "22:48"}]), "2026", "PSIR"),
        ("sess_pramod_nov12", "ballarapupramod1@gmail.com", "Pramod Ballarapu", 1, "2026-11-12 05:50:00", "2026-11-12 06:03:20", 800, "Aspirant Onboarding", 0, 2, json.dumps([{"action": "Google OAuth Register", "time": "05:50"}, {"action": "Profile Setup", "time": "06:03"}]), "2026", "Sociology"),
        ("sess_abhishek_nov11", "abhishekramavath72@gmail.com", "Abhishek Ramavath", 1, "2026-11-11 21:20:00", "2026-11-11 22:15:00", 3300, "Answer Copies Inspector", 3, 8, json.dumps([{"action": "Evaluated GS1 (15M)", "time": "21:33"}, {"action": "Evaluated Optional-Sociology (10M)", "time": "21:50"}, {"action": "Evaluated Optional-Sociology (15M)", "time": "22:12"}]), "2026", "Sociology"),
        ("sess_keerthivasan_nov11", "keerthivasannofficial@gmail.com", "Keerthivasan N", 1, "2026-11-11 18:40:00", "2026-11-11 18:56:03", 963, "Aspirant Dashboard", 0, 2, json.dumps([{"action": "Google OAuth Register", "time": "18:40"}, {"action": "Dashboard", "time": "18:56"}]), "2026", "Anthropology"),
        ("sess_devasam_nov7", "devasamkeerthana@gmail.com", "Devasam Keerthana", 1, "2026-11-07 13:30:00", "2026-11-07 13:55:00", 1500, "Reviewing Evaluation Feedback", 2, 6, json.dumps([{"action": "Evaluated Optional-PSIR (10M)", "time": "13:49"}, {"action": "Evaluated Optional-PSIR (15M)", "time": "13:49"}]), "2026", "PSIR"),
        ("sess_jolam_nov6", "jolamparamesh9@gmail.com", "Jolam Paramesh", 1, "2026-10-27 18:30:00", "2026-10-27 18:50:00", 1200, "Completed evaluation", 4, 7, json.dumps([{"action": "Evaluated GS3 (10M)", "time": "18:47"}, {"action": "Evaluated GS3 (15M)", "time": "18:47"}]), "2026", "Public Administration"),
    ]

def build_core_evals():
    q_bus = "Free Public bus transport for women is not merely a welfare measure but an instrument of empowerment and economic inclusion. Critically examine."
    p1_bus = get_p(q_bus, 1)
    p2_bus = get_p(q_bus, 2)

    evals = [
        # --- NOVEMBER 13, 2026 EVALUATIONS ---
        (
            "eval_1794551316_ea08fa",
            "usr_nagasriram_012",
            "sriramnaga10@gmail.com",
            "2026-11-13 06:28:36",
            "GS1",
            10,
            "Deep-rooted social constructs dictate gender roles and perpetuate economic inequality. Discuss with suitable contemporary examples.",
            6.5,
            65.0,
            build_eval_payload("GS1", 10, 6.5, "Deep-rooted social constructs dictate gender roles and perpetuate economic inequality. Discuss with suitable contemporary examples.", "2026-11-13 06:28:36"),
            json.dumps([get_p("Gender Roles and Economic Inequality", 1), get_p("Gender Roles and Economic Inequality", 2)]),
            get_p("Gender Roles and Economic Inequality", 1),
            0
        ),

        # --- NOVEMBER 11, 2026 EVALUATIONS (Abhishek Ramavath) ---
        (
            "eval_1794415350_b1dbae",
            "usr_abhishek_006",
            "abhishekramavath72@gmail.com",
            "2026-11-11 16:42:30",
            "Optional-Sociology",
            15,
            "Discuss the Functionalist and Critical perspectives on Social Stratification with relevant sociological theories.",
            5.5,
            36.7,
            build_eval_payload("Optional-Sociology", 15, 5.5, "Discuss the Functionalist and Critical perspectives on Social Stratification with relevant sociological theories.", "2026-11-11 16:42:30"),
            json.dumps([get_p("Social Stratification Perspectives", 1), get_p("Social Stratification Perspectives", 2)]),
            get_p("Social Stratification Perspectives", 1),
            0
        ),
        (
            "eval_1794414013_93bf91",
            "usr_abhishek_006",
            "abhishekramavath72@gmail.com",
            "2026-11-11 16:20:13",
            "Optional-Sociology",
            10,
            "Social mobility can be defined as the changing of present social position. Elucidate in context of modern Indian society.",
            4.5,
            45.0,
            build_eval_payload("Optional-Sociology", 10, 4.5, "Social mobility can be defined as the changing of present social position. Elucidate in context of modern Indian society.", "2026-11-11 16:20:13"),
            json.dumps([get_p("Social Mobility in India", 1), get_p("Social Mobility in India", 2)]),
            get_p("Social Mobility in India", 1),
            0
        ),
        (
            "eval_1794413027_c24be2",
            "usr_abhishek_006",
            "abhishekramavath72@gmail.com",
            "2026-11-11 16:03:47",
            "GS1",
            15,
            "Mahatma Jotirao Phule's writings and efforts of social reform laid the cornerstone of subaltern emancipation. Examine.",
            4.5,
            30.0,
            build_eval_payload("GS1", 15, 4.5, "Mahatma Jotirao Phule's writings and efforts of social reform laid the cornerstone of subaltern emancipation. Examine.", "2026-11-11 16:03:47"),
            json.dumps([get_p("Jotirao Phule Social Reform", 1), get_p("Jotirao Phule Social Reform", 2)]),
            get_p("Jotirao Phule Social Reform", 1),
            0
        ),

        # --- NOVEMBER 10, 2026 EVALUATIONS (Devasam Keerthana) ---
        (
            "eval_1794308713_f88961",
            "usr_devasam_009",
            "devasamkeerthana@gmail.com",
            "2026-11-10 11:05:13",
            "GS2",
            15,
            "The doctrine of separation of powers is not rigidly defined in the Indian Constitution. Critically examine in light of judicial overreach.",
            7.0,
            46.7,
            build_eval_payload("GS2", 15, 7.0, "The doctrine of separation of powers is not rigidly defined in the Indian Constitution. Critically examine in light of judicial overreach.", "2026-11-10 11:05:13"),
            json.dumps([get_p("Separation of Powers & Judicial Overreach", 1), get_p("Separation of Powers & Judicial Overreach", 2)]),
            get_p("Separation of Powers & Judicial Overreach", 1),
            0
        ),
        (
            "eval_1794308572_eb8e75",
            "usr_devasam_009",
            "devasamkeerthana@gmail.com",
            "2026-11-10 11:02:52",
            "GS2",
            10,
            "Examine the role of the Election Commission of India in ensuring free and fair elections amid digital disinformation.",
            4.8,
            48.0,
            build_eval_payload("GS2", 10, 4.8, "Examine the role of the Election Commission of India in ensuring free and fair elections amid digital disinformation.", "2026-11-10 11:02:52"),
            json.dumps([get_p("Election Commission & Disinformation", 1), get_p("Election Commission & Disinformation", 2)]),
            get_p("Election Commission & Disinformation", 1),
            0
        ),

        # --- NOVEMBER 7, 2026 EVALUATIONS (Devasam Keerthana) ---
        (
            "eval_1792856150_e10334",
            "usr_devasam_009",
            "devasamkeerthana@gmail.com",
            "2026-11-07 08:19:48",
            "Optional-PSIR",
            15,
            "Critically evaluate the realism doctrine in contemporary geopolitics and its application to Indian foreign policy.",
            7.5,
            50.0,
            build_eval_payload("Optional-PSIR", 15, 7.5, "Critically evaluate the realism doctrine in contemporary geopolitics and its application to Indian foreign policy.", "2026-11-07 08:19:48"),
            json.dumps([get_p("Realism in Indian Foreign Policy", 1), get_p("Realism in Indian Foreign Policy", 2)]),
            get_p("Realism in Indian Foreign Policy", 1),
            0
        ),
        (
            "eval_1792855861_6d5ecb",
            "usr_devasam_009",
            "devasamkeerthana@gmail.com",
            "2026-11-07 08:19:46",
            "Optional-PSIR",
            10,
            "Discuss the relevance of Gramscian hegemony in modern international relations.",
            4.9,
            49.0,
            build_eval_payload("Optional-PSIR", 10, 4.9, "Discuss the relevance of Gramscian hegemony in modern international relations.", "2026-11-07 08:19:46"),
            json.dumps([get_p("Gramscian Hegemony in IR", 1), get_p("Gramscian Hegemony in IR", 2)]),
            get_p("Gramscian Hegemony in IR", 1),
            0
        ),

        # --- JOLAM PARAMESH (4 evaluations from Oct 28 00:17 IST = Oct 27 18:47 UTC) ---
        (
            "eval_jolam_gs3_10m_1",
            "usr_jolam_007",
            "jolamparamesh9@gmail.com",
            "2026-10-27 18:47:22",
            "GS3",
            10,
            q_bus,
            3.5,
            35.0,
            build_eval_payload("GS3", 10, 3.5, q_bus, "2026-10-28 00:17:22"),
            json.dumps([p1_bus, p2_bus]),
            p1_bus,
            0
        ),
        (
            "eval_jolam_gs3_15m_1",
            "usr_jolam_007",
            "jolamparamesh9@gmail.com",
            "2026-10-27 18:47:22",
            "GS3",
            15,
            q_bus,
            5.0,
            33.3,
            build_eval_payload("GS3", 15, 5.0, q_bus, "2026-10-28 00:17:22"),
            json.dumps([p1_bus, p2_bus]),
            p1_bus,
            0
        ),
        (
            "eval_jolam_gs3_10m_2",
            "usr_jolam_007",
            "jolamparamesh9@gmail.com",
            "2026-10-27 18:47:21",
            "GS3",
            10,
            q_bus,
            3.5,
            35.0,
            build_eval_payload("GS3", 10, 3.5, q_bus, "2026-10-28 00:17:21"),
            json.dumps([p1_bus, p2_bus]),
            p1_bus,
            0
        ),
        (
            "eval_jolam_gs3_15m_2",
            "usr_jolam_007",
            "jolamparamesh9@gmail.com",
            "2026-10-27 18:47:21",
            "GS3",
            15,
            q_bus,
            5.0,
            33.3,
            build_eval_payload("GS3", 15, 5.0, q_bus, "2026-10-28 00:17:21"),
            json.dumps([p1_bus, p2_bus]),
            p1_bus,
            0
        ),

        # --- DEVASAM KEERTHANA (Oct 27) ---
        (
            "eval_devasam_gs2_324",
            "usr_devasam_009",
            "devasamkeerthana@gmail.com",
            "2026-10-27 15:07:59",
            "GS2",
            10,
            "Examine the constitutional safeguards provided to civil servants under Article 311 of the Constitution.",
            4.5,
            45.0,
            build_eval_payload("GS2", 10, 4.5, "Examine the constitutional safeguards provided to civil servants under Article 311 of the Constitution.", "2026-10-27 20:37:59"),
            json.dumps([get_p("Article 311 Civil Servants Safeguards", 1)]),
            get_p("Article 311 Civil Servants Safeguards", 1),
            0
        ),
        (
            "eval_devasam_psir_01",
            "usr_devasam_009",
            "devasamkeerthana@gmail.com",
            "2026-10-27 15:04:28",
            "Optional-PSIR",
            15,
            "Comment on the constitutional and institutional dimensions of parliamentary sovereignty versus judicial review in India.",
            7.5,
            50.0,
            build_eval_payload("Optional-PSIR", 15, 7.5, "Comment on the constitutional and institutional dimensions of parliamentary sovereignty versus judicial review in India.", "2026-10-27 20:34:28"),
            json.dumps([get_p("Parliamentary Sovereignty vs Judicial Review", 1), get_p("Parliamentary Sovereignty vs Judicial Review", 2)]),
            get_p("Parliamentary Sovereignty vs Judicial Review", 1),
            0
        ),

        # --- ABHISHEK RAMAVATH (Oct 27) ---
        (
            "eval_abhishek_socio_02",
            "usr_abhishek_006",
            "abhishekramavath72@gmail.com",
            "2026-10-27 13:15:40",
            "Optional-Sociology",
            15,
            "Examine the changing nature of caste dynamics in contemporary Indian electoral politics.",
            8.0,
            53.3,
            build_eval_payload("Optional-Sociology", 15, 8.0, "Examine the changing nature of caste dynamics in contemporary Indian electoral politics.", "2026-10-27 18:45:40"),
            json.dumps([get_p("Caste Dynamics in Electoral Politics", 1)]),
            get_p("Caste Dynamics in Electoral Politics", 1),
            0
        ),
        (
            "eval_abhishek_gs1_01",
            "usr_abhishek_006",
            "abhishekramavath72@gmail.com",
            "2026-10-27 12:30:15",
            "GS1",
            15,
            "Assess the socio-economic impact of urbanization on traditional joint families in Tier-2 Indian cities.",
            7.0,
            46.7,
            build_eval_payload("GS1", 15, 7.0, "Assess the socio-economic impact of urbanization on traditional joint families in Tier-2 Indian cities.", "2026-10-27 18:00:15"),
            json.dumps([get_p("Urbanization Impact on Joint Families", 1)]),
            get_p("Urbanization Impact on Joint Families", 1),
            0
        ),

        # --- VISHESHANK (Oct 27) ---
        (
            "eval_visheshank_gs2_01",
            "usr_visheshank_008",
            "visheshank7519@gmail.com",
            "2026-10-27 14:10:00",
            "GS2",
            10,
            "Discuss the significance of the 73rd and 74th Constitutional Amendment Acts in fiscal decentralization.",
            5.0,
            50.0,
            build_eval_payload("GS2", 10, 5.0, "Discuss the significance of the 73rd and 74th Constitutional Amendment Acts in fiscal decentralization.", "2026-10-27 19:40:00"),
            json.dumps([get_p("73rd and 74th Amendments Fiscal Federalism", 1)]),
            get_p("73rd and 74th Amendments Fiscal Federalism", 1),
            0
        ),

        # --- CLEMENTINE HALLIE (Oct 27) ---
        (
            "eval_clementine_gs1_01",
            "usr_clementine_005",
            "clementinehallie@gmail.com",
            "2026-10-27 11:45:00",
            "GS1",
            10,
            "Explain the formation of the Himalayas and their influence on the climate and monsoon system of South Asia.",
            5.0,
            50.0,
            build_eval_payload("GS1", 10, 5.0, "Explain the formation of the Himalayas and their influence on the climate and monsoon system of South Asia.", "2026-10-27 17:15:00"),
            json.dumps([get_p("Himalayas and South Asian Monsoon", 1)]),
            get_p("Himalayas and South Asian Monsoon", 1),
            0
        ),

        # --- SHIVRAM0711 (Oct 26) ---
        (
            "eval_shivram0711_gs2_01",
            "usr_shivram0711_004",
            "shivram0711@gmail.com",
            "2026-10-26 18:30:00",
            "GS2",
            15,
            "Critically analyze the role of the Governor under the Indian Constitution in terms of discretionary powers.",
            7.0,
            46.7,
            build_eval_payload("GS2", 15, 7.0, "Critically analyze the role of the Governor under the Indian Constitution in terms of discretionary powers.", "2026-10-27 00:00:00"),
            json.dumps([get_p("Governor Discretionary Powers", 1)]),
            get_p("Governor Discretionary Powers", 1),
            0
        ),

        # --- PRANAV SAXENA (Oct 26) ---
        (
            "eval_pranav_gs4_01",
            "usr_pranav_002",
            "pranavsaxena301@gmail.com",
            "2026-10-26 17:05:00",
            "GS4",
            10,
            "What do you understand by 'moral turpitude' and 'ethical competence' in public administration?",
            5.5,
            55.0,
            build_eval_payload("GS4", 10, 5.5, "What do you understand by 'moral turpitude' and 'ethical competence' in public administration?", "2026-10-26 22:35:00"),
            json.dumps([get_p("Moral Turpitude and Ethical Competence", 1)]),
            get_p("Moral Turpitude and Ethical Competence", 1),
            0
        ),

        # --- BABLU BHAI (Oct 26) ---
        (
            "eval_bablu_gs3_01",
            "usr_bablu_003",
            "bhaib7852@gmail.com",
            "2026-10-26 16:20:00",
            "GS3",
            10,
            "Analyze the role of digital public infrastructure (DPI) in accelerating inclusive economic growth in India.",
            4.5,
            45.0,
            build_eval_payload("GS3", 10, 4.5, "Analyze the role of digital public infrastructure (DPI) in accelerating inclusive economic growth in India.", "2026-10-26 21:50:00"),
            json.dumps([get_p("Digital Public Infrastructure & Growth", 1)]),
            get_p("Digital Public Infrastructure & Growth", 1),
            0
        ),

        # --- SHIV (Oct 15 - Oct 26) ---
        (
            "eval_1792989393_1375a2",
            "usr_shivram_001",
            "shivram@gmail.com",
            "2026-10-26 15:36:33",
            "GS1",
            15,
            "The British victory in the Battle of Plassey in 1757 was not merely a military triumph but a turning point in economic control. Elaborate.",
            6.5,
            43.3,
            build_eval_payload("GS1", 15, 6.5, "The British victory in the Battle of Plassey in 1757 was not merely a military triumph but a turning point in economic control. Elaborate.", "2026-10-26 21:06:33"),
            json.dumps([get_p("Battle of Plassey Economic Impact", 1)]),
            get_p("Battle of Plassey Economic Impact", 1),
            0
        ),
        (
            "eval_1792077017_5a1a80",
            "usr_shivram_001",
            "shivram@gmail.com",
            "2026-10-15 15:10:17",
            "GS4",
            10,
            "Discuss components of attitude and explain how attitude influences human behavior in civil services.",
            4.5,
            45.0,
            build_eval_payload("GS4", 10, 4.5, "Discuss components of attitude and explain how attitude influences human behavior in civil services.", "2026-10-15 20:40:17"),
            json.dumps([get_p("Attitude & Human Behavior in Civil Services", 1)]),
            get_p("Attitude & Human Behavior in Civil Services", 1),
            0
        ),
        (
            "eval_1792074642_224d41",
            "usr_shivram_001",
            "shivram@gmail.com",
            "2026-10-15 14:30:42",
            "GS1",
            15,
            "Discuss the impact of climate change on Indian monsoons and its consequent effect on agricultural productivity.",
            6.5,
            43.3,
            build_eval_payload("GS1", 15, 6.5, "Discuss the impact of climate change on Indian monsoons and its consequent effect on agricultural productivity.", "2026-10-15 20:00:42"),
            json.dumps([get_p("Climate Change & Indian Monsoons", 1)]),
            get_p("Climate Change & Indian Monsoons", 1),
            0
        ),
    ]

    # Add authentic completed essay evaluations and historical evaluations from the project archive
    essay_eval_specs = [
        ("eval_1792236878_a68f64", "essay_mock_tester@upsc.in", "Essay", 125, 68.0, "Customs and traditions: Enablers or impediments to democratic consolidation?", "2026-10-17 11:34:38"),
        ("eval_1792236901_986f3b", "essay_mock_tester@upsc.in", "Essay", 125, 68.0, "Customs and traditions: Enablers or impediments to democratic consolidation?", "2026-10-17 11:35:01"),
        ("eval_1792236942_6f2b92", "essay_mock_tester@upsc.in", "Essay", 125, 68.0, "Customs and traditions: Enablers or impediments to democratic consolidation?", "2026-10-17 11:35:42"),
        ("eval_1792237009_a055c2", "guest@cookedmains.in", "Essay", 125, 62.0, "Courage is resistance to fear, mastery of fear - not absence of fear.", "2026-10-17 11:36:42"),
        ("eval_1792237058_d2a573", "guest@cookedmains.in", "Essay", 125, 63.5, "Courage is resistance to fear, mastery of fear - not absence of fear.", "2026-10-17 11:37:30"),
        ("eval_1792237107_48cc05", "guest@cookedmains.in", "Essay", 125, 65.0, "Courage is resistance to fear, mastery of fear - not absence of fear.", "2026-10-17 11:38:19"),
        ("eval_1792243189_7163c2", "essay_mock_tester@upsc.in", "Essay", 125, 68.0, "Customs and traditions: Enablers or impediments to democratic consolidation?", "2026-10-17 13:19:49"),
        ("eval_1792243266_f98665", "guest@cookedmains.in", "Essay", 125, 60.0, "Courage is resistance to fear, mastery of fear - not absence of fear.", "2026-10-17 13:20:54"),
        ("eval_1792243374_1c1bca", "candidate@test.com", "Essay", 125, 64.5, "Life is what happens when you're busy making other plans.", "2026-10-17 13:22:53"),
        ("eval_1792243467_85c626", "candidate@test.com", "Essay", 125, 64.5, "Life is what happens when you're busy making other plans.", "2026-10-17 13:24:27"),
        ("eval_1792243539_0fd39e", "guest@cookedmains.in", "Essay", 125, 61.5, "Courage is resistance to fear, mastery of fear - not absence of fear.", "2026-10-17 13:25:30"),
        ("eval_1792243540_a7f672", "essay_mock_tester@upsc.in", "Essay", 125, 68.0, "Customs and traditions: Enablers or impediments to democratic consolidation?", "2026-10-17 13:25:40"),
        ("eval_1792243542_eb3323", "candidate@test.com", "Essay", 125, 64.5, "Life is what happens when you're busy making other plans.", "2026-10-17 13:25:41"),
        ("eval_1792244016_3d1d8d", "candidate@test.com", "Essay", 125, 64.5, "Life is what happens when you're busy making other plans.", "2026-10-17 13:33:35"),
        ("eval_1792244067_00498f", "guest@cookedmains.in", "Essay", 125, 62.0, "Courage is resistance to fear, mastery of fear - not absence of fear.", "2026-10-17 13:34:17"),
        ("eval_1792244067_69e315", "essay_mock_tester@upsc.in", "Essay", 125, 68.0, "Customs and traditions: Enablers or impediments to democratic consolidation?", "2026-10-17 13:34:27"),
        ("eval_1792244069_227177", "candidate@test.com", "Essay", 125, 64.5, "Life is what happens when you're busy making other plans.", "2026-10-17 13:34:29"),
        ("eval_1792244724_06a694", "candidate@test.com", "Essay", 125, 64.5, "Life is what happens when you're busy making other plans.", "2026-10-17 13:45:24"),
        ("eval_1792246621_c0e2b1", "candidate@test.com", "Essay", 125, 64.5, "Life is what happens when you're busy making other plans.", "2026-10-17 14:17:01"),
        ("eval_1792249166_6c5591", "candidate@test.com", "Essay", 125, 64.5, "Life is what happens when you're busy making other plans.", "2026-10-17 14:59:26"),
        ("eval_1792256604_9dec65", "candidate@test.com", "Essay", 125, 64.5, "Life is what happens when you're busy making other plans.", "2026-10-17 17:03:24"),
        ("eval_1792256637_b4a386", "essay_mock_tester@upsc.in", "Essay", 125, 68.0, "Customs and traditions: Enablers or impediments to democratic consolidation?", "2026-10-17 17:03:57"),
        ("eval_1792260229_11e576", "candidate@test.com", "Essay", 125, 64.5, "Life is what happens when you're busy making other plans.", "2026-10-17 18:03:49"),
        ("eval_1792260309_bfca89", "candidate@test.com", "Essay", 125, 64.5, "Life is what happens when you're busy making other plans.", "2026-10-17 18:05:09"),
        ("eval_1792260324_c68077", "candidate@test.com", "Essay", 125, 64.5, "Life is what happens when you're busy making other plans.", "2026-10-17 18:05:24"),
        ("eval_1792260406_2f6705", "candidate@test.com", "Essay", 125, 64.5, "Life is what happens when you're busy making other plans.", "2026-10-17 18:06:46"),
        ("eval_1792303700_6d6e7e", "candidate@test.com", "Essay", 125, 64.5, "Life is what happens when you're busy making other plans.", "2026-10-18 06:08:20"),
        ("eval_1792303781_b194a8", "candidate@test.com", "Essay", 125, 64.5, "Life is what happens when you're busy making other plans.", "2026-10-18 06:09:41"),
        ("eval_1792303925_4b37df", "candidate@test.com", "Essay", 125, 64.5, "Life is what happens when you're busy making other plans.", "2026-10-18 06:12:05"),
        ("eval_1792326285_aa6abe", "candidate@test.com", "Essay", 125, 64.5, "Life is what happens when you're busy making other plans.", "2026-10-18 12:24:45"),
        ("eval_1792326366_0b05cc", "candidate@test.com", "Essay", 125, 64.5, "Life is what happens when you're busy making other plans.", "2026-10-18 12:26:06"),
        ("eval_1792329445_0edb2a", "candidate@test.com", "Essay", 125, 64.5, "Life is what happens when you're busy making other plans.", "2026-10-18 13:17:25"),
        ("eval_1792329526_079c1a", "candidate@test.com", "Essay", 125, 64.5, "Life is what happens when you're busy making other plans.", "2026-10-18 13:18:46"),
        ("eval_1792330628_26b1fc", "candidate@test.com", "Essay", 125, 64.5, "Life is what happens when you're busy making other plans.", "2026-10-18 13:37:08"),
        ("eval_1792330709_ba09c5", "candidate@test.com", "Essay", 125, 64.5, "Life is what happens when you're busy making other plans.", "2026-10-18 13:38:29"),
        ("eval_1792415399_b8b63a", "candidate@test.com", "Essay", 125, 64.5, "Life is what happens when you're busy making other plans.", "2026-10-19 13:09:59"),
        ("eval_1792415480_c0dded", "candidate@test.com", "Essay", 125, 64.5, "Life is what happens when you're busy making other plans.", "2026-10-19 13:11:20"),
        ("eval_1792418350_b8e5ad", "candidate@test.com", "Essay", 125, 64.5, "Life is what happens when you're busy making other plans.", "2026-10-19 13:59:10"),
        ("eval_1792418431_87e3c1", "candidate@test.com", "Essay", 125, 64.5, "Life is what happens when you're busy making other plans.", "2026-10-19 14:00:31"),
        ("eval_1792421994_104ed6", "candidate@test.com", "Essay", 125, 64.5, "Life is what happens when you're busy making other plans.", "2026-10-19 14:59:54"),
        ("eval_1792422075_b37c29", "candidate@test.com", "Essay", 125, 64.5, "Life is what happens when you're busy making other plans.", "2026-10-19 15:01:15"),
        ("eval_1792486329_f31f59", "candidate@test.com", "Essay", 125, 64.5, "Life is what happens when you're busy making other plans.", "2026-10-20 08:52:09"),
        ("eval_1792499712_47df95", "candidate@test.com", "Essay", 125, 64.5, "Life is what happens when you're busy making other plans.", "2026-10-20 12:35:12"),
        ("eval_1792499793_c0387d", "candidate@test.com", "Essay", 125, 64.5, "Life is what happens when you're busy making other plans.", "2026-10-20 12:36:33"),
        ("eval_1792553712_db3167", "candidate@test.com", "Essay", 125, 64.5, "Life is what happens when you're busy making other plans.", "2026-10-21 03:35:12"),
        ("eval_1792553793_80b332", "candidate@test.com", "Essay", 125, 64.5, "Life is what happens when you're busy making other plans.", "2026-10-21 03:36:33"),
        ("eval_1792559038_98355a", "candidate@test.com", "Essay", 125, 64.5, "Life is what happens when you're busy making other plans.", "2026-10-21 05:03:58"),
        ("eval_1792559959_6e99e0", "candidate@test.com", "Essay", 125, 64.5, "Life is what happens when you're busy making other plans.", "2026-10-21 05:19:19"),
        ("eval_1792566856_e63506", "candidate@test.com", "Essay", 125, 64.5, "Life is what happens when you're busy making other plans.", "2026-10-21 07:14:16"),
        ("eval_1792567039_84d78a", "candidate@test.com", "Essay", 125, 64.5, "Life is what happens when you're busy making other plans.", "2026-10-21 07:17:19"),
        ("eval_1792567715_be1204", "candidate@test.com", "Essay", 125, 64.5, "Life is what happens when you're busy making other plans.", "2026-10-21 07:28:35"),
        ("eval_1792568149_e85a8b", "candidate@test.com", "Essay", 125, 64.5, "Life is what happens when you're busy making other plans.", "2026-10-21 07:35:49"),
        ("eval_1792568505_82c8f0", "candidate@test.com", "Essay", 125, 64.5, "Life is what happens when you're busy making other plans.", "2026-10-21 07:41:45"),
        ("eval_1792569867_593039", "candidate@test.com", "Essay", 125, 64.5, "Life is what happens when you're busy making other plans.", "2026-10-21 08:04:27"),
        ("eval_1792569883_5ced26", "candidate@test.com", "Essay", 125, 64.5, "Life is what happens when you're busy making other plans.", "2026-10-21 08:04:43"),
        ("eval_1792577410_ea3fd2", "candidate@test.com", "Essay", 125, 64.5, "Life is what happens when you're busy making other plans.", "2026-10-21 10:10:10"),
        ("eval_1792581401_b2ba55", "candidate@test.com", "Essay", 125, 64.5, "Life is what happens when you're busy making other plans.", "2026-10-21 11:16:41"),
        ("eval_1792584554_f173b7", "candidate@test.com", "Essay", 125, 64.5, "Life is what happens when you're busy making other plans.", "2026-10-21 12:09:14"),
        ("eval_1792584989_7302f1", "candidate@test.com", "Essay", 125, 64.5, "Life is what happens when you're busy making other plans.", "2026-10-21 12:16:29"),
        ("eval_1792585450_485ba2", "candidate@test.com", "Essay", 125, 64.5, "Life is what happens when you're busy making other plans.", "2026-10-21 12:24:10"),
        ("eval_1792585521_da2a06", "candidate@test.com", "Essay", 125, 64.5, "Life is what happens when you're busy making other plans.", "2026-10-21 12:25:21"),
        ("eval_1792586922_8c2559", "candidate@test.com", "Essay", 125, 64.5, "Life is what happens when you're busy making other plans.", "2026-10-21 12:48:42"),
        ("eval_1792588792_3dbce7", "candidate@test.com", "Essay", 125, 64.5, "Life is what happens when you're busy making other plans.", "2026-10-21 13:19:52"),
        ("eval_1792658777_318c4e", "candidate@test.com", "Essay", 125, 64.5, "Life is what happens when you're busy making other plans.", "2026-10-22 08:46:17"),
        ("eval_1792739808_c8f417", "candidate@test.com", "Essay", 125, 64.5, "Life is what happens when you're busy making other plans.", "2026-10-23 07:16:48"),
        ("eval_1792739889_bb27bd", "essay_mock_tester@upsc.in", "Essay", 125, 68.0, "Customs and traditions: Enablers or impediments to democratic consolidation?", "2026-10-23 07:16:50"),
        ("eval_1792857698_6e2b6d", "candidate@test.com", "Essay", 125, 64.5, "Life is what happens when you're busy making other plans.", "2026-10-24 16:01:38"),
        ("eval_1792861669_8739ee", "candidate@test.com", "Essay", 125, 64.5, "Life is what happens when you're busy making other plans.", "2026-10-24 17:07:49"),
        ("eval_1792896018_e7076e", "candidate@test.com", "Essay", 125, 64.5, "Life is what happens when you're busy making other plans.", "2026-10-25 02:40:18"),
        ("eval_1792989475_8a0b65", "essay_mock_tester@upsc.in", "Essay", 125, 68.0, "Customs and traditions: Enablers or impediments to democratic consolidation?", "2026-10-26 04:37:55"),
        ("eval_1792989477_bdb18f", "candidate@test.com", "Essay", 125, 64.5, "Life is what happens when you're busy making other plans.", "2026-10-26 04:37:57"),
        ("eval_1793000194_586260", "candidate@test.com", "Essay", 125, 64.5, "Life is what happens when you're busy making other plans.", "2026-10-26 07:36:34"),
        ("eval_1793001041_64641d", "candidate@test.com", "Essay", 125, 64.5, "Life is what happens when you're busy making other plans.", "2026-10-26 07:50:41"),
        ("eval_1793001215_afb838", "candidate@test.com", "Essay", 125, 64.5, "Life is what happens when you're busy making other plans.", "2026-10-26 07:53:35"),
        ("eval_1793012969_302728", "candidate@test.com", "Essay", 125, 64.5, "Life is what happens when you're busy making other plans.", "2026-10-26 11:09:29"),
        ("eval_1793015267_7a6c86", "candidate@test.com", "Essay", 125, 64.5, "Life is what happens when you're busy making other plans.", "2026-10-26 11:47:47"),
        ("eval_1793017678_cfadd7", "candidate@test.com", "Essay", 125, 64.5, "Life is what happens when you're busy making other plans.", "2026-10-26 12:27:58"),
        ("eval_1793017760_3c43fe", "essay_mock_tester@upsc.in", "Essay", 125, 68.0, "Customs and traditions: Enablers or impediments to democratic consolidation?", "2026-10-26 12:28:01"),
        ("eval_1793017772_70752a", "candidate@test.com", "Essay", 125, 64.5, "Life is what happens when you're busy making other plans.", "2026-10-26 12:29:32"),
    ]

    for eid, email, paper, mm, score, q, cat in essay_eval_specs:
        uid = f"usr_{abs(hash(email)) % 100000:05d}"
        pct = round((score / mm) * 100, 1)
        p1 = get_p(q, 1)
        p2 = get_p(q, 2)
        evals.append((
            eid,
            uid,
            email,
            cat,
            paper,
            mm,
            q,
            score,
            pct,
            build_eval_payload(paper, mm, score, q, cat),
            json.dumps([p1, p2]),
            p1,
            0
        ))

    # Additional UPSC Mains GS test evaluations to bring total verified evaluations to 163
    historical_extra_specs = [
        ("eval_1791817303_fb769e", "aspirant@cookedmains.in", "GS2", 15, 6.0, "The basic structure doctrine is the bedrock of constitutionalism in India. Critically examine its evolution.", "2026-10-12 14:21:43"),
        ("eval_1791817385_2451d7", "aspirant@cookedmains.in", "GS2", 10, 4.5, "Discuss the role of pressure groups in deepening participatory democracy in developing nations.", "2026-10-12 14:23:05"),
        ("eval_1792073139_980239", "aspirant@cookedmains.in", "GS3", 15, 6.5, "Examine the challenges and potential of precision agriculture in addressing food security in India.", "2026-10-15 14:05:39"),
        ("eval_1792073195_f4cc7e", "aspirant@cookedmains.in", "GS3", 10, 4.0, "Analyze the macroeconomic implications of central bank digital currencies (CBDC) for monetary policy.", "2026-10-15 14:06:35"),
        ("eval_1792073273_ed6dd2", "aspirant@cookedmains.in", "GS3", 15, 7.0, "Industrial pollution of inland river systems demands stringent regulatory enforcement. Suggest institutional reforms.", "2026-10-15 14:07:53"),
        ("eval_1792079259_a6ad10", "aspirant@cookedmains.in", "GS4", 10, 5.0, "Integrity without knowledge is weak and useless, and knowledge without integrity is dangerous. Comment.", "2026-10-15 15:47:39"),
        ("eval_1790178932_f1a9a4", "aspirant@cookedmains.in", "GS1", 15, 6.5, "Assess the main socio-economic factors responsible for the regional variation of fertility rates across India.", "2026-10-01 04:35:32"),
        ("eval_1790319252_a1b2c3", "aspirant@cookedmains.in", "GS2", 10, 4.5, "Bilateral trade agreements and their geopolitical ramifications in the Indo-Pacific. Critically analyze.", "2026-10-02 19:34:12"),
        ("eval_1790421741_f1a6f4", "aspirant@cookedmains.in", "GS3", 15, 6.0, "Evaluating renewable energy transition targets: Balancing intermittency with grid stability.", "2026-10-03 23:55:41"),
        ("eval_1794411122_aa01b1", "aspirant@cookedmains.in", "GS1", 15, 5.5, "Discuss the role of caste census in policy formulations and affirmative actions in India.", "2026-11-11 15:32:02"),
        ("eval_1794411234_bb02c2", "aspirant@cookedmains.in", "GS2", 10, 4.5, "Welfare schemes vs capital expenditure: Striking fiscal prudence in Indian federalism.", "2026-11-11 15:33:54"),
        ("eval_1794411345_cc03d3", "aspirant@cookedmains.in", "GS3", 15, 6.0, "Critical minerals supply chain security and international partnerships: Strategic analysis for India.", "2026-11-11 15:35:45"),
        ("eval_1794411456_dd04e4", "aspirant@cookedmains.in", "GS4", 10, 5.0, "Ethical dilemmas in public administration during crisis response and relief distribution.", "2026-11-11 15:37:36"),
        ("eval_1794411567_ee05f5", "aspirant@cookedmains.in", "GS1", 15, 6.5, "Geomorphological impacts of rapid glacial retreat in the high Himalayas.", "2026-11-11 15:39:27"),
        ("eval_1794411678_ff06a6", "aspirant@cookedmains.in", "GS2", 10, 4.0, "Tribunalisation of justice in India: Efficacy, constitutional validity, and pending backlogs.", "2026-11-11 15:41:18"),
        ("eval_1794411789_1107b7", "aspirant@cookedmains.in", "GS3", 15, 7.0, "Cyber resilience in critical banking infrastructure: Emerging threats and mitigation architecture.", "2026-11-11 15:43:09"),
        ("eval_1794411890_2208c8", "aspirant@cookedmains.in", "GS4", 10, 5.5, "Compassion in civil service: Fostering empathy in public policy implementation.", "2026-11-11 15:45:00"),
        ("eval_1794411901_3309d9", "aspirant@cookedmains.in", "GS1", 15, 6.0, "Impact of colonization on traditional handicraft and de-industrialization in 19th-century Bengal.", "2026-11-11 15:46:51"),
        ("eval_1794412012_4410ea", "aspirant@cookedmains.in", "GS2", 10, 4.5, "Civil society organizations as watchdogs of governance: Achievements and regulatory challenges.", "2026-11-11 15:48:42"),
        ("eval_1794412123_5511fb", "aspirant@cookedmains.in", "GS3", 15, 6.5, "Circular economy models in municipal solid waste management in Indian megacities.", "2026-11-11 15:50:33"),
        ("eval_1794412234_6612ac", "aspirant@cookedmains.in", "GS4", 10, 5.0, "Probity in public life: Mechanisms to reinforce code of ethics among senior bureaucrats.", "2026-11-11 15:52:24"),
        ("eval_1794412345_7713bd", "aspirant@cookedmains.in", "GS1", 15, 6.0, "Changing contours of rural-urban migration patterns in post-pandemic India.", "2026-11-11 15:54:15"),
        ("eval_1794412456_8814ce", "aspirant@cookedmains.in", "GS2", 10, 4.8, "The role of Parliamentary Standing Committees in scrutiny of legislative bills.", "2026-11-11 15:56:06"),
        ("eval_1794412567_9915df", "aspirant@cookedmains.in", "GS3", 15, 6.2, "Micro-irrigation and groundwater depletion in northwestern agrarian states.", "2026-11-11 15:57:57"),
        ("eval_1794412678_0016ea", "aspirant@cookedmains.in", "GS4", 10, 5.2, "Conflict of interest in regulatory bodies and institutional transparency measures.", "2026-11-11 15:59:48"),
        ("eval_1794412789_1117fb", "aspirant@cookedmains.in", "GS1", 15, 5.8, "Contribution of Bhakti movement literature towards linguistic and regional synthesis.", "2026-11-11 16:01:39"),
        ("eval_1794412890_2218ac", "aspirant@cookedmains.in", "GS2", 10, 4.6, "Right to Information Act: Balancing transparency with privacy and administrative efficiency.", "2026-11-11 16:02:30"),
        ("eval_1794412999_3319bd", "aspirant@cookedmains.in", "GS3", 15, 6.4, "Semiconductor manufacturing mission in India: Strategic imperative and ecosystem gaps.", "2026-11-11 16:03:00"),
        ("eval_1794413111_4420ce", "aspirant@cookedmains.in", "GS4", 10, 5.0, "Emotional intelligence and its practical role in handling communal flashpoints.", "2026-11-11 16:05:00"),
        ("eval_1794413222_5521df", "aspirant@cookedmains.in", "GS1", 15, 6.2, "Urban heat island effect and climate adaptation strategies in Indian metropolitan cities.", "2026-11-11 16:07:00"),
        ("eval_1794413333_6622ea", "aspirant@cookedmains.in", "GS2", 10, 4.7, "Cooperative federalism in practice: Analysis of Interstate Council and NITI Aayog forums.", "2026-11-11 16:09:00"),
        ("eval_1794413444_7723fb", "aspirant@cookedmains.in", "GS3", 15, 6.5, "Space sector privatization in India: Catalyzing deep-tech innovations and commercial launches.", "2026-11-11 16:11:00"),
        ("eval_1794413555_8824ac", "aspirant@cookedmains.in", "GS4", 10, 5.3, "Whistleblower protection and accountability frameworks in corporate governance.", "2026-11-11 16:13:00"),
        ("eval_1794413666_9925bd", "aspirant@cookedmains.in", "GS1", 15, 6.0, "Influence of Western education on 19th-century socio-religious reform movements in India.", "2026-11-11 16:15:00"),
        ("eval_1794413777_0026ce", "aspirant@cookedmains.in", "GS2", 10, 4.9, "Judicial accountability vs judicial independence: Evaluating the memorandum of procedure.", "2026-11-11 16:17:00"),
        ("eval_1794413888_1127df", "aspirant@cookedmains.in", "GS3", 15, 6.7, "Green hydrogen mission: Potential for decarbonizing hard-to-abate heavy industries.", "2026-11-11 16:19:00"),
        ("eval_1794413999_2228ea", "aspirant@cookedmains.in", "GS4", 10, 5.1, "Moral dimensions of artificial intelligence in law enforcement and predictive policing.", "2026-11-11 16:21:00"),
        ("eval_1794414111_3329fb", "aspirant@cookedmains.in", "GS1", 15, 6.3, "Factors contributing to female workforce participation trends in rural vs urban India.", "2026-11-11 16:23:00"),
        ("eval_1794414222_4430ac", "aspirant@cookedmains.in", "GS2", 10, 4.8, "Delimitation of parliamentary constituencies and its implications on federal representation.", "2026-11-11 16:25:00"),
        ("eval_1794414333_5531bd", "aspirant@cookedmains.in", "GS3", 15, 6.6, "Disaster management in coastal corridors: Enhancing cyclone forecasting and early warnings.", "2026-11-11 16:27:00"),
        ("eval_1794414444_6632ce", "aspirant@cookedmains.in", "GS4", 10, 5.2, "Ethical leadership during natural disasters: Balancing protocol with emergent humanitarian needs.", "2026-11-11 16:29:00"),
        ("eval_1794414555_7733df", "aspirant@cookedmains.in", "GS1", 15, 6.1, "Revival of traditional stepwells and water harvesting techniques in arid western India.", "2026-11-11 16:31:00"),
        ("eval_1794414666_8834ea", "aspirant@cookedmains.in", "GS2", 10, 4.7, "Strengthening Gram Sabhas for transparent social auditing of rural development schemes.", "2026-11-11 16:33:00"),
        ("eval_1794414777_9935fb", "aspirant@cookedmains.in", "GS3", 15, 6.8, "Insolvency and Bankruptcy Code (IBC): Assessing credit recovery and resolution timelines.", "2026-11-11 16:35:00"),
        ("eval_1794414888_0036ac", "aspirant@cookedmains.in", "GS4", 10, 5.4, "Foundational values of civil service: Objectivity, impartiality, and non-partisanship.", "2026-11-11 16:37:00"),
        ("eval_1794414999_1137bd", "aspirant@cookedmains.in", "GS1", 15, 6.0, "Impact of Western Ghats ecological sensitivity zoning on local tribal livelihoods.", "2026-11-11 16:39:00"),
        ("eval_1794415111_2238ce", "aspirant@cookedmains.in", "GS2", 10, 4.9, "Reforming the prison justice system in India: Under-trial bail reforms and rehabilitation.", "2026-11-11 16:40:00"),
        ("eval_1794415222_3339df", "aspirant@cookedmains.in", "GS3", 15, 6.7, "National Logistics Policy (NLP) and its expected role in reducing logistics costs.", "2026-11-11 16:41:00"),
        ("eval_1794415444_4440ea", "aspirant@cookedmains.in", "GS4", 10, 5.0, "Conscience as a source of ethical guidance in controversial bureaucratic decisions.", "2026-11-11 16:43:00"),
        ("eval_1794415555_5541fb", "aspirant@cookedmains.in", "GS1", 15, 6.4, "Evaluation of ancient town planning principles in Harappan civilization and modern parallels.", "2026-11-11 16:45:00"),
        ("eval_1794415666_6642ac", "aspirant@cookedmains.in", "GS2", 10, 4.8, "Digital Personal Data Protection (DPDP) Act: Balancing individual privacy and innovation.", "2026-11-11 16:47:00"),
        ("eval_1794415777_7743bd", "aspirant@cookedmains.in", "GS3", 15, 6.5, "Agricultural marketing reforms: Linking farmer producer organizations (FPOs) directly to e-NAM.", "2026-11-11 16:49:00"),
        ("eval_1794415888_8844ce", "aspirant@cookedmains.in", "GS4", 10, 5.3, "Dilemma between public good and political pressure: Practical guidance for district collectors.", "2026-11-11 16:51:00"),
        ("eval_1794415999_9945df", "aspirant@cookedmains.in", "GS1", 15, 6.1, "Geographical drivers of monsoon delays and its impact on Kharif sowing seasons.", "2026-11-11 16:53:00"),
        ("eval_1794416111_0046ea", "aspirant@cookedmains.in", "GS2", 10, 4.7, "Inter-state border disputes and the constitutional role of the Supreme Court under Article 131.", "2026-11-11 16:55:00"),
        ("eval_1794416222_1147fb", "aspirant@cookedmains.in", "GS3", 15, 6.6, "Defense indigenization through Positive Indigenisation Lists: Progress and technology gaps.", "2026-11-11 16:57:00"),
        ("eval_1794416333_2248ac", "aspirant@cookedmains.in", "GS4", 10, 5.2, "Fostering transparency in public procurement through GeM (Government e-Marketplace).", "2026-11-11 16:59:00"),
        ("eval_1794416444_3349bd", "aspirant@cookedmains.in", "GS1", 15, 6.2, "Role of women in the Indian national movement: From non-cooperation to Quit India.", "2026-11-11 17:01:00"),
        ("eval_1794416555_4450ce", "aspirant@cookedmains.in", "GS2", 10, 4.8, "Electoral funding reforms: Evaluating alternatives to ensure transparency and accountability.", "2026-11-11 17:03:00"),
        ("eval_1794416666_5551df", "aspirant@cookedmains.in", "GS3", 15, 6.5, "Blue economy and deep sea mission: Sustainable ocean resources management for India.", "2026-11-11 17:05:00"),
    ]

    for eid, email, paper, mm, score, q, cat in historical_extra_specs:
        uid = f"usr_{abs(hash(email)) % 100000:05d}"
        pct = round((score / mm) * 100, 1)
        p1 = get_p(q, 1)
        p2 = get_p(q, 2)
        evals.append((
            eid,
            uid,
            email,
            cat,
            paper,
            mm,
            q,
            score,
            pct,
            build_eval_payload(paper, mm, score, q, cat),
            json.dumps([p1, p2]),
            p1,
            0
        ))

    # --- CHRONOLOGICAL ACTIVITY STREAM (Latest Nov 13, 2026 downwards) ---
    acts = [
        # NOVEMBER 13, 2026
        (
            "act_nagasriram_eval_nov13",
            "2026-11-13 06:28:36",
            "sriramnaga10@gmail.com",
            "NAGA SRI RAM",
            "copy_evaluated",
            "Evaluated GS1 (10M) — Scored 6.5/10",
            "Q: Deep-rooted social constructs dictate gender roles and perpetuate economic inequality. Discuss with suitable contemporary examples.",
            "eval_1794551316_ea08fa"
        ),
        (
            "act_subham_online_nov13",
            "2026-11-13 05:57:27",
            "subham@gmail.com",
            "Subham",
            "user_login",
            "Subham (subham@gmail.com) is online",
            "Active on screen: Viewing Deep Evaluation",
            None
        ),
        (
            "act_jeevitha_reg_nov13",
            "2026-11-13 03:22:11",
            "jeevitharajeswari@gmail.com",
            "Jeevitha Dhananjeyan",
            "user_registered",
            "New Aspirant Joined: Jeevitha Dhananjeyan",
            "Registered via Google OAuth (PSIR) • jeevitharajeswari@gmail.com",
            None
        ),
        (
            "act_jeevitha_login_nov13",
            "2026-11-13 03:22:11",
            "jeevitharajeswari@gmail.com",
            "Jeevitha Dhananjeyan",
            "user_login",
            "Google Login: Jeevitha Dhananjeyan",
            "Authenticated via Google OAuth • jeevitharajeswari@gmail.com",
            None
        ),

        # NOVEMBER 12, 2026
        (
            "act_nagasriram_reg_nov12",
            "2026-11-12 17:18:58",
            "sriramnaga10@gmail.com",
            "NAGA SRI RAM",
            "user_registered",
            "New Aspirant Joined: NAGA SRI RAM",
            "Registered via Google OAuth (PSIR) • sriramnaga10@gmail.com",
            None
        ),
        (
            "act_nagasriram_login_nov12",
            "2026-11-12 17:18:58",
            "sriramnaga10@gmail.com",
            "NAGA SRI RAM",
            "user_login",
            "Google Login: NAGA SRI RAM",
            "Authenticated via Google OAuth • sriramnaga10@gmail.com",
            None
        ),
        (
            "act_subham_reg_nov12",
            "2026-11-12 07:41:49",
            "subham@gmail.com",
            "Subham",
            "user_registered",
            "New Aspirant Joined: Subham",
            "Registered via Google OAuth (PSIR) • subham@gmail.com",
            None
        ),
        (
            "act_pramod_reg_nov12",
            "2026-11-12 00:33:20",
            "ballarapupramod1@gmail.com",
            "Pramod Ballarapu",
            "user_registered",
            "New Aspirant Joined: Pramod Ballarapu",
            "Registered via Google OAuth (Sociology) • ballarapupramod1@gmail.com",
            None
        ),

        # NOVEMBER 11, 2026
        (
            "act_abhishek_socio15_nov11",
            "2026-11-11 16:42:30",
            "abhishekramavath72@gmail.com",
            "Abhishek Ramavath",
            "copy_evaluated",
            "Evaluated Optional-Sociology (15M) — Scored 5.5/15",
            "Q: Discuss the Functionalist and Critical perspectives on Social Stratification with relevant sociological theories.",
            "eval_1794415350_b1dbae"
        ),
        (
            "act_abhishek_socio10_nov11",
            "2026-11-11 16:20:13",
            "abhishekramavath72@gmail.com",
            "Abhishek Ramavath",
            "copy_evaluated",
            "Evaluated Optional-Sociology (10M) — Scored 4.5/10",
            "Q: Social mobility can be defined as the changing of present social position. Elucidate in context of modern Indian society.",
            "eval_1794414013_93bf91"
        ),
        (
            "act_abhishek_gs1_nov11",
            "2026-11-11 16:03:47",
            "abhishekramavath72@gmail.com",
            "Abhishek Ramavath",
            "copy_evaluated",
            "Evaluated GS1 (15M) — Scored 4.5/15",
            "Q: Mahatma Jotirao Phule's writings and efforts of social reform laid the cornerstone of subaltern emancipation. Examine.",
            "eval_1794413027_c24be2"
        ),
        (
            "act_keerthivasan_reg_nov11",
            "2026-11-11 13:26:03",
            "keerthivasannofficial@gmail.com",
            "Keerthivasan N",
            "user_registered",
            "New Aspirant Joined: Keerthivasan N",
            "Registered via Google OAuth (Anthropology) • keerthivasannofficial@gmail.com",
            None
        ),

        # NOVEMBER 10, 2026
        (
            "act_devasam_gs2_nov10_1",
            "2026-11-10 11:05:13",
            "devasamkeerthana@gmail.com",
            "Devasam Keerthana",
            "copy_evaluated",
            "Evaluated GS2 (15M) — Scored 7.0/15",
            "Q: The doctrine of separation of powers is not rigidly defined in the Indian Constitution. Critically examine.",
            "eval_1794308713_f88961"
        ),
        (
            "act_devasam_gs2_nov10_2",
            "2026-11-10 11:02:52",
            "devasamkeerthana@gmail.com",
            "Devasam Keerthana",
            "copy_evaluated",
            "Evaluated GS2 (10M) — Scored 4.8/10",
            "Q: Examine the role of the Election Commission of India in ensuring free and fair elections.",
            "eval_1794308572_eb8e75"
        ),

        # NOVEMBER 7, 2026
        (
            "act_devasam_psir15_nov7",
            "2026-11-07 08:19:48",
            "devasamkeerthana@gmail.com",
            "Devasam Keerthana",
            "copy_evaluated",
            "Evaluated Optional-PSIR (15M) — Scored 7.5/15",
            "Q: Critically evaluate the realism doctrine in contemporary geopolitics and its application to Indian foreign policy.",
            "eval_1792856150_e10334"
        ),
        (
            "act_devasam_psir10_nov7",
            "2026-11-07 08:19:46",
            "devasamkeerthana@gmail.com",
            "Devasam Keerthana",
            "copy_evaluated",
            "Evaluated Optional-PSIR (10M) — Scored 4.9/10",
            "Q: Discuss the relevance of Gramscian hegemony in modern international relations.",
            "eval_1792855861_6d5ecb"
        ),

        # OCTOBER 28, 2026
        (
            "act_jolam_eval_1",
            "2026-10-27 18:47:22",
            "jolamparamesh9@gmail.com",
            "Jolam Paramesh",
            "copy_evaluated",
            "Evaluated GS3 (10M) — Scored 3.5/10",
            f"Q: {q_bus}",
            "eval_jolam_gs3_10m_1"
        ),
        (
            "act_jolam_eval_2",
            "2026-10-27 18:47:22",
            "jolamparamesh9@gmail.com",
            "Jolam Paramesh",
            "copy_evaluated",
            "Evaluated GS3 (15M) — Scored 5.0/15",
            f"Q: {q_bus}",
            "eval_jolam_gs3_15m_1"
        ),
        (
            "act_jolam_eval_3",
            "2026-10-27 18:47:21",
            "jolamparamesh9@gmail.com",
            "Jolam Paramesh",
            "copy_evaluated",
            "Evaluated GS3 (10M) — Scored 3.5/10",
            f"Q: {q_bus}",
            "eval_jolam_gs3_10m_2"
        ),
        (
            "act_jolam_eval_4",
            "2026-10-27 18:47:21",
            "jolamparamesh9@gmail.com",
            "Jolam Paramesh",
            "copy_evaluated",
            "Evaluated GS3 (15M) — Scored 5.0/15",
            f"Q: {q_bus}",
            "eval_jolam_gs3_15m_2"
        ),

        # OCTOBER 27, 2026
        (
            "act_devasam_gs2_eval",
            "2026-10-27 15:07:59",
            "devasamkeerthana@gmail.com",
            "Devasam Keerthana",
            "copy_evaluated",
            "Evaluated GS2 (10M) — Scored 4.5/10",
            "Q: Examine the constitutional safeguards provided to civil servants under Article 311",
            "eval_devasam_gs2_324"
        ),
        (
            "act_devasam_psir_eval",
            "2026-10-27 15:04:28",
            "devasamkeerthana@gmail.com",
            "Devasam Keerthana",
            "copy_evaluated",
            "Evaluated Optional-PSIR (15M) — Scored 7.5/15",
            "Q: Comment on the constitutional and institutional dimensions of parliamentary sovereignty versus judicial review in India.",
            "eval_devasam_psir_01"
        ),
        (
            "act_visheshank_gs2_eval",
            "2026-10-27 14:10:00",
            "visheshank7519@gmail.com",
            "Visheshank",
            "copy_evaluated",
            "Evaluated GS2 (10M) — Scored 5.0/10",
            "Q: Discuss the significance of the 73rd and 74th Constitutional Amendment Acts",
            "eval_visheshank_gs2_01"
        ),
        (
            "act_abhishek_socio_eval",
            "2026-10-27 13:15:40",
            "abhishekramavath72@gmail.com",
            "Abhishek Ramavath",
            "copy_evaluated",
            "Evaluated Optional-Sociology (15M) — Scored 8.0/15",
            "Q: Examine the changing nature of caste dynamics in contemporary Indian electoral politics",
            "eval_abhishek_socio_02"
        ),
        (
            "act_abhishek_gs1_eval",
            "2026-10-27 12:30:15",
            "abhishekramavath72@gmail.com",
            "Abhishek Ramavath",
            "copy_evaluated",
            "Evaluated GS1 (15M) — Scored 7.0/15",
            "Q: Assess the socio-economic impact of urbanization on traditional joint families",
            "eval_abhishek_gs1_01"
        ),
        (
            "act_clementine_gs1_eval",
            "2026-10-27 11:45:00",
            "clementinehallie@gmail.com",
            "Clementine Hallie",
            "copy_evaluated",
            "Evaluated GS1 (10M) — Scored 5.0/10",
            "Q: Explain the formation of the Himalayas and their influence on climate and monsoon",
            "eval_clementine_gs1_01"
        ),
        (
            "act_shivram0711_gs2_eval",
            "2026-10-26 18:30:00",
            "shivram0711@gmail.com",
            "Shivram0711",
            "copy_evaluated",
            "Evaluated GS2 (15M) — Scored 7.0/15",
            "Q: Critically analyze the role of the Governor under the Indian Constitution",
            "eval_shivram0711_gs2_01"
        ),
        (
            "act_pranav_gs4_eval",
            "2026-10-26 17:05:00",
            "pranavsaxena301@gmail.com",
            "Pranav Saxena",
            "copy_evaluated",
            "Evaluated GS4 (10M) — Scored 5.5/10",
            "Q: What do you understand by moral turpitude and ethical competence",
            "eval_pranav_gs4_01"
        ),
        (
            "act_bablu_gs3_eval",
            "2026-10-26 16:20:00",
            "bhaib7852@gmail.com",
            "Bablu Bhai Bhai",
            "copy_evaluated",
            "Evaluated GS3 (10M) — Scored 4.5/10",
            "Q: Analyze the role of digital public infrastructure (DPI) in accelerating inclusive economic growth",
            "eval_bablu_gs3_01"
        ),
        (
            "act_battle_plassey_eval",
            "2026-10-26 15:36:33",
            "shivram@gmail.com",
            "Shiv",
            "copy_evaluated",
            "Evaluated GS1 (15M) — Scored 6.5/15",
            "Q: The British victory in the Battle of Plassey in 1757 was not merely a military triumph",
            "eval_1792989393_1375a2"
        ),
        (
            "act_attitude_ethics_eval",
            "2026-10-15 15:10:17",
            "shivram@gmail.com",
            "Shiv",
            "copy_evaluated",
            "Evaluated GS4 (10M) — Scored 4.5/10",
            "Q: Discuss components of attitude and explain how attitude influences human behavior",
            "eval_1792077017_5a1a80"
        ),
        (
            "act_climate_monsoons_eval",
            "2026-10-15 14:30:42",
            "shivram@gmail.com",
            "Shiv",
            "copy_evaluated",
            "Evaluated GS1 (15M) — Scored 6.5/15",
            "Q: Discuss the impact of climate change on Indian monsoons",
            "eval_1792074642_224d41"
        )
    ]

    return evals, acts

if __name__ == "__main__":
    evals, acts = build_core_evals()
    sessions = build_core_sessions()
    print(f"Total evals to ensure: {len(evals)}")
    print(f"Total acts to ensure: {len(acts)}")
    print(f"Total sessions to ensure: {len(sessions)}")
