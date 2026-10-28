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

def build_core_evals():
    q_bus = "Free Public bus transport for women is not merely a welfare measure but an instrument of empowerment and economic inclusion. Critically examine."
    p1_bus = get_p(q_bus, 1)
    p2_bus = get_p(q_bus, 2)

    evals = [
        # Jolam Paramesh (4 evaluations from Oct 28 00:17 IST = Oct 27 18:47 UTC)
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
            json.dumps({
                "paper": "GS3",
                "max_marks": 10,
                "overall_score": 3.5,
                "percentage": 35.0,
                "question": q_bus,
                "created_at": "2026-10-28 00:17:22",
                "evaluated_at": "2026-10-28 00:17:22",
                "executive_summary": "The candidate recognizes the social welfare aspects of free public transit but needs deeper analysis of economic multiplier effects, female labor force participation (FLFP), and fiscal sustainability for transport corporations.",
                "rubric_scores": {
                    "demand_fulfillment": {"score": 1.0, "max": 3.0, "comment": "Underlines mobility but lacks economic linkage with workforce"},
                    "structure_presentation": {"score": 1.5, "max": 3.0, "comment": "Structured headings but conclusion is abrupt"},
                    "content_depth": {"score": 1.0, "max": 4.0, "comment": "Cite Delhi Fare-Free Scheme or Karnataka Shakti Scheme data"}
                },
                "_meta_pages": [p1_bus, p2_bus]
            }),
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
            json.dumps({
                "paper": "GS3",
                "max_marks": 15,
                "overall_score": 5.0,
                "percentage": 33.3,
                "question": q_bus,
                "created_at": "2026-10-28 00:17:22",
                "evaluated_at": "2026-10-28 00:17:22",
                "executive_summary": "Comprehensive 15-mark answer discussing women's safety, access to tertiary education, and reduced out-of-pocket expenditure, though requires practical solutions for last-mile feeder connectivity.",
                "rubric_scores": {
                    "demand_fulfillment": {"score": 2.0, "max": 5.0, "comment": "Covers both welfare and economic aspects"},
                    "structure_presentation": {"score": 1.5, "max": 5.0, "comment": "Clear introduction and subheadings"},
                    "content_depth": {"score": 1.5, "max": 5.0, "comment": "Include fiscal deficit impact on state transport undertakings"}
                },
                "_meta_pages": [p1_bus, p2_bus]
            }),
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
            json.dumps({
                "paper": "GS3",
                "max_marks": 10,
                "overall_score": 3.5,
                "percentage": 35.0,
                "question": q_bus,
                "created_at": "2026-10-28 00:17:21",
                "evaluated_at": "2026-10-28 00:17:21",
                "executive_summary": "Good initial conceptual framework highlighting gender-sensitive transport planning. Scope for improvement in analytical depth regarding budgetary subventions.",
                "rubric_scores": {
                    "demand_fulfillment": {"score": 1.5, "max": 3.0, "comment": "Addresses core topic statement"},
                    "structure_presentation": {"score": 1.0, "max": 3.0, "comment": "Readable with bullet points"},
                    "content_depth": {"score": 1.0, "max": 4.0, "comment": "Mention World Bank study on female urban mobility in India"}
                },
                "_meta_pages": [p1_bus, p2_bus]
            }),
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
            json.dumps({
                "paper": "GS3",
                "max_marks": 15,
                "overall_score": 5.0,
                "percentage": 33.3,
                "question": q_bus,
                "created_at": "2026-10-28 00:17:21",
                "evaluated_at": "2026-10-28 00:17:21",
                "executive_summary": "Detailed multi-dimensional exploration linking transit subsidies with labor mobility and urban safety. Recommendation of dedicated bus corridors is noteworthy.",
                "rubric_scores": {
                    "demand_fulfillment": {"score": 2.0, "max": 5.0, "comment": "Addressed both sides of the critical examination"},
                    "structure_presentation": {"score": 1.5, "max": 5.0, "comment": "Systematic flow with diagrammatic points"},
                    "content_depth": {"score": 1.5, "max": 5.0, "comment": "Include operational sustainability reforms"}
                },
                "_meta_pages": [p1_bus, p2_bus]
            }),
            json.dumps([p1_bus, p2_bus]),
            p1_bus,
            0
        ),

        # Devasam Keerthana (2 evaluations)
        (
            "eval_devasam_gs2_324",
            "usr_devasam_009",
            "devasamkeerthana@gmail.com",
            "2026-10-27 15:07:59",
            "GS2",
            10,
            "Examine the constitutional safeguards provided into 324(5) to ensure the independence of the Election Commission of India.",
            4.5,
            45.0,
            json.dumps({
                "paper": "GS2",
                "max_marks": 10,
                "overall_score": 4.5,
                "percentage": 45.0,
                "question": "Examine the constitutional safeguards provided into 324(5) to ensure the independence of the Election Commission of India.",
                "created_at": "2026-10-27 20:37:59",
                "evaluated_at": "2026-10-27 20:37:59",
                "executive_summary": "The answer identifies Article 324(5) conditions of service and tenure of Chief Election Commissioner, but requires deeper exploration of the protection granted to other Election Commissioners and judicial safeguards.",
                "rubric_scores": {
                    "demand_fulfillment": {"score": 1.5, "max": 3.0, "comment": "Addressed key clauses of Article 324(5)"},
                    "structure_presentation": {"score": 1.5, "max": 3.0, "comment": "Clear introduction and constitutional points"},
                    "content_depth": {"score": 1.5, "max": 4.0, "comment": "Include Seshan case and Anoop Baranwal judgment"}
                },
                "_meta_pages": [get_p("Article 324(5) safeguards", 1), get_p("Article 324(5) safeguards", 2)]
            }),
            json.dumps([get_p("Article 324(5) safeguards", 1), get_p("Article 324(5) safeguards", 2)]),
            get_p("Article 324(5) safeguards", 1),
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
            json.dumps({
                "paper": "Optional-PSIR",
                "max_marks": 15,
                "overall_score": 7.5,
                "percentage": 50.0,
                "question": "Comment on the constitutional and institutional dimensions of parliamentary sovereignty versus judicial review in India.",
                "created_at": "2026-10-27 20:34:28",
                "evaluated_at": "2026-10-27 20:34:28",
                "executive_summary": "Balanced discussion comparing British parliamentary supremacy with Indian constitutional supremacy governed by basic structure doctrine.",
                "rubric_scores": {
                    "demand_fulfillment": {"score": 2.5, "max": 5.0, "comment": "Good theoretical foundations cited"},
                    "structure_presentation": {"score": 2.5, "max": 5.0, "comment": "Well structured comparative headings"},
                    "content_depth": {"score": 2.5, "max": 5.0, "comment": "Cite Kesavananda Bharati and Minerva Mills cases"}
                },
                "_meta_pages": [get_p("Parliamentary Sovereignty vs Judicial Review", 1), get_p("Parliamentary Sovereignty vs Judicial Review", 2)]
            }),
            json.dumps([get_p("Parliamentary Sovereignty vs Judicial Review", 1), get_p("Parliamentary Sovereignty vs Judicial Review", 2)]),
            get_p("Parliamentary Sovereignty vs Judicial Review", 1),
            0
        ),

        # Shivram (2 evaluations)
        (
            "eval_1792074642_224d41",
            "usr_shivram_001",
            "shivram@gmail.com",
            "2026-10-25 15:10:42",
            "GS1",
            15,
            "The British victory in the Battle of Plassey in 1757 was not merely a military triumph but a turning point in Indian history. Discuss.",
            6.5,
            43.3,
            json.dumps({
                "paper": "GS1",
                "max_marks": 15,
                "overall_score": 6.5,
                "percentage": 43.3,
                "question": "The British victory in the Battle of Plassey in 1757 was not merely a military triumph but a turning point in Indian history. Discuss.",
                "created_at": "2026-10-25 20:40:42",
                "evaluated_at": "2026-10-25 20:40:42",
                "executive_summary": "Sound historical analysis explaining economic drainage of Bengal and political ascendancy of the East India Company.",
                "rubric_scores": {
                    "demand_fulfillment": {"score": 2.0, "max": 5.0, "comment": "Captured political and economic dimensions"},
                    "structure_presentation": {"score": 2.5, "max": 5.0, "comment": "Chronological progression with clear headings"},
                    "content_depth": {"score": 2.0, "max": 5.0, "comment": "Cite Treaty of Allahabad and dual governance transition"}
                },
                "_meta_pages": [get_p("Battle of Plassey 1757", 1), get_p("Battle of Plassey 1757", 2)]
            }),
            json.dumps([get_p("Battle of Plassey 1757", 1), get_p("Battle of Plassey 1757", 2)]),
            get_p("Battle of Plassey 1757", 1),
            0
        ),
        (
            "eval_1792077017_5a1a80",
            "usr_shivram_001",
            "shivram@gmail.com",
            "2026-10-25 15:50:17",
            "GS4",
            10,
            "Discuss the components of attitude and explain how attitude influences human behavior in public administration.",
            4.5,
            45.0,
            json.dumps({
                "paper": "GS4",
                "max_marks": 10,
                "overall_score": 4.5,
                "percentage": 45.0,
                "question": "Discuss the components of attitude and explain how attitude influences human behavior in public administration.",
                "created_at": "2026-10-25 21:20:17",
                "evaluated_at": "2026-10-25 21:20:17",
                "executive_summary": "CAB model (Cognitive, Affective, Behavioral) well elucidated with ethical examples from civil services.",
                "rubric_scores": {
                    "demand_fulfillment": {"score": 1.5, "max": 3.0, "comment": "Structured around the CAB framework"},
                    "structure_presentation": {"score": 1.5, "max": 3.0, "comment": "Diagrammatic flow and case application"},
                    "content_depth": {"score": 1.5, "max": 4.0, "comment": "Include Nolan Committee principles on public life"}
                },
                "_meta_pages": [get_p("Attitude in Ethics GS4", 1), get_p("Attitude in Ethics GS4", 2)]
            }),
            json.dumps([get_p("Attitude in Ethics GS4", 1), get_p("Attitude in Ethics GS4", 2)]),
            get_p("Attitude in Ethics GS4", 1),
            0
        ),

        # Abhishek Ramavath (2 evaluations)
        (
            "eval_abhishek_gs1_01",
            "usr_abhishek_006",
            "abhishekramavath72@gmail.com",
            "2026-10-27 12:30:15",
            "GS1",
            15,
            "Assess the socio-economic impact of urban flooding in Indian mega-cities and suggest sustainable mitigation strategies.",
            7.0,
            46.7,
            json.dumps({
                "paper": "GS1",
                "max_marks": 15,
                "overall_score": 7.0,
                "percentage": 46.7,
                "question": "Assess the socio-economic impact of urban flooding in Indian mega-cities and suggest sustainable mitigation strategies.",
                "created_at": "2026-10-27 18:00:15",
                "evaluated_at": "2026-10-27 18:00:15",
                "executive_summary": "Well rounded assessment of Bengaluru and Chennai flooding events. Proposes sponge city concept and drainage rejuvenation.",
                "rubric_scores": {
                    "demand_fulfillment": {"score": 2.5, "max": 5.0, "comment": "Clear distinction between social and economic impacts"},
                    "structure_presentation": {"score": 2.5, "max": 5.0, "comment": "Logical sub-sections and clear maps"},
                    "content_depth": {"score": 2.0, "max": 5.0, "comment": "Reference NDMA Urban Flooding Guidelines"}
                },
                "_meta_pages": [get_p("Urban Flooding in India", 1), get_p("Urban Flooding in India", 2)]
            }),
            json.dumps([get_p("Urban Flooding in India", 1), get_p("Urban Flooding in India", 2)]),
            get_p("Urban Flooding in India", 1),
            0
        ),
        (
            "eval_abhishek_socio_02",
            "usr_abhishek_006",
            "abhishekramavath72@gmail.com",
            "2026-10-27 13:15:40",
            "Optional-Sociology",
            15,
            "Examine the changing nature of caste dynamics in contemporary Indian electoral politics with sociological perspectives.",
            8.0,
            53.3,
            json.dumps({
                "paper": "Optional-Sociology",
                "max_marks": 15,
                "overall_score": 8.0,
                "percentage": 53.3,
                "question": "Examine the changing nature of caste dynamics in contemporary Indian electoral politics with sociological perspectives.",
                "created_at": "2026-10-27 18:45:40",
                "evaluated_at": "2026-10-27 18:45:40",
                "executive_summary": "Strong theoretical foundation citing Rajni Kothari, M.N. Srinivas, and Christophe Jaffrelot on political mobilization of caste.",
                "rubric_scores": {
                    "demand_fulfillment": {"score": 3.0, "max": 5.0, "comment": "Insightful conceptual distinction between politicization of caste and casteism"},
                    "structure_presentation": {"score": 2.5, "max": 5.0, "comment": "Academic flow and clear sociological argumentation"},
                    "content_depth": {"score": 2.5, "max": 5.0, "comment": "Contemporary electoral data from recent assembly polls"}
                },
                "_meta_pages": [get_p("Caste Dynamics in Politics", 1), get_p("Caste Dynamics in Politics", 2)]
            }),
            json.dumps([get_p("Caste Dynamics in Politics", 1), get_p("Caste Dynamics in Politics", 2)]),
            get_p("Caste Dynamics in Politics", 1),
            0
        ),

        # Visheshank (1 evaluation)
        (
            "eval_visheshank_gs2_01",
            "usr_visheshank_008",
            "visheshank7519@gmail.com",
            "2026-10-27 14:10:00",
            "GS2",
            10,
            "Discuss the significance of the 73rd and 74th Constitutional Amendment Acts in deepening grassroot democracy in India.",
            5.0,
            50.0,
            json.dumps({
                "paper": "GS2",
                "max_marks": 10,
                "overall_score": 5.0,
                "percentage": 50.0,
                "question": "Discuss the significance of the 73rd and 74th Constitutional Amendment Acts in deepening grassroot democracy in India.",
                "created_at": "2026-10-27 19:40:00",
                "evaluated_at": "2026-10-27 19:40:00",
                "executive_summary": "Analyzes financial, administrative, and political decentralization alongside 3Fs bottleneck (Funds, Functions, Functionaries).",
                "rubric_scores": {
                    "demand_fulfillment": {"score": 1.5, "max": 3.0, "comment": "Addresses both PRIs and ULBs"},
                    "structure_presentation": {"score": 2.0, "max": 3.0, "comment": "Comparative table of powers and schedules"},
                    "content_depth": {"score": 1.5, "max": 4.0, "comment": "Cite 2nd ARC Recommendations on local governance"}
                },
                "_meta_pages": [get_p("73rd and 74th Amendments", 1), get_p("73rd and 74th Amendments", 2)]
            }),
            json.dumps([get_p("73rd and 74th Amendments", 1), get_p("73rd and 74th Amendments", 2)]),
            get_p("73rd and 74th Amendments", 1),
            0
        ),

        # Bablu Bhai (1 evaluation)
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
            json.dumps({
                "paper": "GS3",
                "max_marks": 10,
                "overall_score": 4.5,
                "percentage": 45.0,
                "question": "Analyze the role of digital public infrastructure (DPI) in accelerating inclusive economic growth in India.",
                "created_at": "2026-10-26 21:50:00",
                "evaluated_at": "2026-10-26 21:50:00",
                "executive_summary": "India Stack breakdown (Aadhaar, UPI, DigiLocker, Account Aggregator) with direct benefit transfer efficiency.",
                "rubric_scores": {
                    "demand_fulfillment": {"score": 1.5, "max": 3.0, "comment": "Connected technology with financial inclusion"},
                    "structure_presentation": {"score": 1.5, "max": 3.0, "comment": "Neat bullet format with metrics"},
                    "content_depth": {"score": 1.5, "max": 4.0, "comment": "Highlight cybersecurity and digital divide challenges"}
                },
                "_meta_pages": [get_p("Digital Public Infrastructure DPI", 1), get_p("Digital Public Infrastructure DPI", 2)]
            }),
            json.dumps([get_p("Digital Public Infrastructure DPI", 1), get_p("Digital Public Infrastructure DPI", 2)]),
            get_p("Digital Public Infrastructure DPI", 1),
            0
        ),

        # Pranav Saxena (1 evaluation)
        (
            "eval_pranav_gs4_01",
            "usr_pranav_002",
            "pranavsaxena301@gmail.com",
            "2026-10-26 17:05:00",
            "GS4",
            10,
            "What do you understand by 'moral turpitude'? Discuss how integrity and ethical competence guard civil servants against corruption.",
            5.5,
            55.0,
            json.dumps({
                "paper": "GS4",
                "max_marks": 10,
                "overall_score": 5.5,
                "percentage": 55.0,
                "question": "What do you understand by 'moral turpitude'? Discuss how integrity and ethical competence guard civil servants against corruption.",
                "created_at": "2026-10-26 22:35:00",
                "evaluated_at": "2026-10-26 22:35:00",
                "executive_summary": "Precise conceptual definition followed by institutional and internal safeguards against administrative impropriety.",
                "rubric_scores": {
                    "demand_fulfillment": {"score": 2.0, "max": 3.0, "comment": "Clear distinction between legal compliance and moral duty"},
                    "structure_presentation": {"score": 2.0, "max": 3.0, "comment": "Well organized with case scenarios"},
                    "content_depth": {"score": 1.5, "max": 4.0, "comment": "Quote Kautilya's Arthashastra on public integrity"}
                },
                "_meta_pages": [get_p("Moral Turpitude in Civil Service", 1), get_p("Moral Turpitude in Civil Service", 2)]
            }),
            json.dumps([get_p("Moral Turpitude in Civil Service", 1), get_p("Moral Turpitude in Civil Service", 2)]),
            get_p("Moral Turpitude in Civil Service", 1),
            0
        ),

        # Clementine Hallie (1 evaluation)
        (
            "eval_clementine_gs1_01",
            "usr_clementine_005",
            "clementinehallie@gmail.com",
            "2026-10-27 11:45:00",
            "GS1",
            10,
            "Explain the formation of the Himalayas and their influence on the climate and monsoon system of the Indian subcontinent.",
            5.0,
            50.0,
            json.dumps({
                "paper": "GS1",
                "max_marks": 10,
                "overall_score": 5.0,
                "percentage": 50.0,
                "question": "Explain the formation of the Himalayas and their influence on the climate and monsoon system of the Indian subcontinent.",
                "created_at": "2026-10-27 17:15:00",
                "evaluated_at": "2026-10-27 17:15:00",
                "executive_summary": "Plate tectonics (Indian Plate vs Eurasian Plate) explained with orographic barrier effect on southwest monsoons.",
                "rubric_scores": {
                    "demand_fulfillment": {"score": 2.0, "max": 3.0, "comment": "Good synthesis of geographical process and climatic role"},
                    "structure_presentation": {"score": 1.5, "max": 3.0, "comment": "Clean cross-sectional diagram of Tibetan plateau"},
                    "content_depth": {"score": 1.5, "max": 4.0, "comment": "Mention jet streams and western disturbances"}
                },
                "_meta_pages": [get_p("Himalayan Formation and Climate", 1), get_p("Himalayan Formation and Climate", 2)]
            }),
            json.dumps([get_p("Himalayan Formation and Climate", 1), get_p("Himalayan Formation and Climate", 2)]),
            get_p("Himalayan Formation and Climate", 1),
            0
        ),

        # Shivram0711 (1 evaluation)
        (
            "eval_shivram0711_gs2_01",
            "usr_shivram0711_004",
            "shivram0711@gmail.com",
            "2026-10-26 18:30:00",
            "GS2",
            15,
            "Critically analyze the role of the Governor under the Indian Constitution in light of recent Centre-State friction.",
            7.0,
            46.7,
            json.dumps({
                "paper": "GS2",
                "max_marks": 15,
                "overall_score": 7.0,
                "percentage": 46.7,
                "question": "Critically analyze the role of the Governor under the Indian Constitution in light of recent Centre-State friction.",
                "created_at": "2026-10-27 00:00:00",
                "evaluated_at": "2026-10-27 00:00:00",
                "executive_summary": "Discretionary powers under Article 163, reservation of bills under Article 200, and Sarkaria/Punchhi Commission recommendations.",
                "rubric_scores": {
                    "demand_fulfillment": {"score": 2.5, "max": 5.0, "comment": "Analyzes both constitutional mandate and political friction"},
                    "structure_presentation": {"score": 2.5, "max": 5.0, "comment": "Judicial precedents clearly cited"},
                    "content_depth": {"score": 2.0, "max": 5.0, "comment": "Cite Shamsher Singh case and Nabam Rebia verdict"}
                },
                "_meta_pages": [get_p("Role of Governor in Federalism", 1), get_p("Role of Governor in Federalism", 2)]
            }),
            json.dumps([get_p("Role of Governor in Federalism", 1), get_p("Role of Governor in Federalism", 2)]),
            get_p("Role of Governor in Federalism", 1),
            0
        ),

        # General Studies Evaluation
        (
            "eval_1792989393_1375a2",
            "usr_shivram_001",
            "shivram@gmail.com",
            "2026-10-26 10:06:33",
            "GS1",
            15,
            "Discuss the impact of climate change on Indian monsoons.",
            6.5,
            43.3,
            json.dumps({
                "paper": "GS1",
                "max_marks": 15,
                "overall_score": 6.5,
                "percentage": 43.3,
                "question": "Discuss the impact of climate change on Indian monsoons.",
                "created_at": "2026-10-26 15:36:33",
                "evaluated_at": "2026-10-26 15:36:33",
                "executive_summary": "Analyzes shifting precipitation patterns, frequency of extreme weather events, and implications for agricultural productivity.",
                "rubric_scores": {
                    "demand_fulfillment": {"score": 2.5, "max": 5.0, "comment": "Good balance of meteorological and agrarian impacts"},
                    "structure_presentation": {"score": 2.0, "max": 5.0, "comment": "Systematic flow from causes to impacts"},
                    "content_depth": {"score": 2.0, "max": 5.0, "comment": "Include IPCC AR6 WG1 findings on South Asian monsoons"}
                },
                "_meta_pages": [get_p("Climate Change on Monsoons", 1), get_p("Climate Change on Monsoons", 2)]
            }),
            json.dumps([get_p("Climate Change on Monsoons", 1), get_p("Climate Change on Monsoons", 2)]),
            get_p("Climate Change on Monsoons", 1),
            0
        )
    ]

    acts = [
        # Jolam Paramesh (4 recent activity entries as seen in user's image)
        (
            "act_jolam_eval_1",
            "2026-10-28 00:17:22",
            "jolamparamesh9@gmail.com",
            "Jolam Paramesh",
            "copy_evaluated",
            "Evaluated GS3 (10M) — Scored 3.5/10",
            f"Q: {q_bus}",
            "eval_jolam_gs3_10m_1"
        ),
        (
            "act_jolam_eval_2",
            "2026-10-28 00:17:22",
            "jolamparamesh9@gmail.com",
            "Jolam Paramesh",
            "copy_evaluated",
            "Evaluated GS3 (15M) — Scored 5.0/15",
            f"Q: {q_bus}",
            "eval_jolam_gs3_15m_1"
        ),
        (
            "act_jolam_eval_3",
            "2026-10-28 00:17:21",
            "jolamparamesh9@gmail.com",
            "Jolam Paramesh",
            "copy_evaluated",
            "Evaluated GS3 (10M) — Scored 3.5/10",
            f"Q: {q_bus}",
            "eval_jolam_gs3_10m_2"
        ),
        (
            "act_jolam_eval_4",
            "2026-10-28 00:17:21",
            "jolamparamesh9@gmail.com",
            "Jolam Paramesh",
            "copy_evaluated",
            "Evaluated GS3 (15M) — Scored 5.0/15",
            f"Q: {q_bus}",
            "eval_jolam_gs3_15m_2"
        ),

        # Devasam Keerthana
        (
            "act_devasam_gs2_eval",
            "2026-10-27 20:37:59",
            "devasamkeerthana@gmail.com",
            "Devasam Keerthana",
            "copy_evaluated",
            "Evaluated GS2 (10M) — Scored 4.5/10",
            "Q: Examine the constitutional safeguards provided into 324(5) to ensure the independence",
            "eval_devasam_gs2_324"
        ),
        (
            "act_devasam_psir_eval",
            "2026-10-27 20:34:28",
            "devasamkeerthana@gmail.com",
            "Devasam Keerthana",
            "copy_evaluated",
            "Evaluated Optional-PSIR (15M) — Scored 7.5/15",
            "Q: Comment on constitutional dimensions of parliamentary sovereignty vs judicial review",
            "eval_devasam_psir_01"
        ),

        # Abhishek Ramavath
        (
            "act_abhishek_gs1_eval",
            "2026-10-27 18:00:15",
            "abhishekramavath72@gmail.com",
            "Abhishek Ramavath",
            "copy_evaluated",
            "Evaluated GS1 (15M) — Scored 7.0/15",
            "Q: Assess the socio-economic impact of urban flooding in Indian mega-cities",
            "eval_abhishek_gs1_01"
        ),
        (
            "act_abhishek_socio_eval",
            "2026-10-27 18:45:40",
            "abhishekramavath72@gmail.com",
            "Abhishek Ramavath",
            "copy_evaluated",
            "Evaluated Optional-Sociology (15M) — Scored 8.0/15",
            "Q: Examine changing nature of caste dynamics in contemporary Indian electoral politics",
            "eval_abhishek_socio_02"
        ),

        # Visheshank
        (
            "act_visheshank_gs2_eval",
            "2026-10-27 19:40:00",
            "visheshank7519@gmail.com",
            "Visheshank",
            "copy_evaluated",
            "Evaluated GS2 (10M) — Scored 5.0/10",
            "Q: Discuss the significance of the 73rd and 74th Constitutional Amendment Acts",
            "eval_visheshank_gs2_01"
        ),

        # Shivram
        (
            "act_shivram_gs1_eval",
            "2026-10-25 20:40:42",
            "shivram@gmail.com",
            "Shiv",
            "copy_evaluated",
            "Evaluated GS1 (15M) — Scored 6.5/15",
            "Q: The British victory in the Battle of Plassey in 1757 was not merely a military triumph",
            "eval_1792074642_224d41"
        ),
        (
            "act_shivram_gs4_eval",
            "2026-10-25 21:20:17",
            "shivram@gmail.com",
            "Shiv",
            "copy_evaluated",
            "Evaluated GS4 (10M) — Scored 4.5/10",
            "Q: Discuss components of attitude and explain how attitude influences human behavior",
            "eval_1792077017_5a1a80"
        ),

        # Bablu Bhai
        (
            "act_bablu_gs3_eval",
            "2026-10-26 21:50:00",
            "bhaib7852@gmail.com",
            "Bablu Bhai",
            "copy_evaluated",
            "Evaluated GS3 (10M) — Scored 4.5/10",
            "Q: Analyze the role of digital public infrastructure (DPI) in accelerating inclusive economic growth",
            "eval_bablu_gs3_01"
        ),

        # Pranav Saxena
        (
            "act_pranav_gs4_eval",
            "2026-10-26 22:35:00",
            "pranavsaxena301@gmail.com",
            "Pranav Saxena",
            "copy_evaluated",
            "Evaluated GS4 (10M) — Scored 5.5/10",
            "Q: What do you understand by moral turpitude and ethical competence",
            "eval_pranav_gs4_01"
        ),

        # Clementine Hallie
        (
            "act_clementine_gs1_eval",
            "2026-10-27 17:15:00",
            "clementinehallie@gmail.com",
            "Clementine Hallie",
            "copy_evaluated",
            "Evaluated GS1 (10M) — Scored 5.0/10",
            "Q: Explain the formation of the Himalayas and their influence on climate and monsoon",
            "eval_clementine_gs1_01"
        ),

        # Shivram0711
        (
            "act_shivram0711_gs2_eval",
            "2026-10-27 00:00:00",
            "shivram0711@gmail.com",
            "Shivram0711",
            "copy_evaluated",
            "Evaluated GS2 (15M) — Scored 7.0/15",
            "Q: Critically analyze the role of the Governor under the Indian Constitution",
            "eval_shivram0711_gs2_01"
        ),

        # General Studies Evaluation
        (
            "act_climate_monsoons_eval",
            "2026-10-26 15:36:33",
            "shivram@gmail.com",
            "Shiv",
            "copy_evaluated",
            "Evaluated GS1 (15M) — Scored 6.5/15",
            "Q: Discuss the impact of climate change on Indian monsoons",
            "eval_1792989393_1375a2"
        )
    ]

    return evals, acts

if __name__ == "__main__":
    evals, acts = build_core_evals()
    print(f"Total evals to ensure: {len(evals)}")
    print(f"Total acts to ensure: {len(acts)}")
