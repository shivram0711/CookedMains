import os
import datetime
try:
    from PIL import Image, ImageDraw, ImageFont
    HAS_PIL = True
except ImportError:
    HAS_PIL = False
import io
import base64

def generate_sample_upsc_sheet(
    q_num: int,
    q_english: str,
    q_hindi: str,
    marks: int,
    handwritten_lines: list,
    page_num: int = 1,
    total_pages: int = 2
) -> str:
    """
    Generates an authentic-looking UPSC Mains answer booklet page with margins,
    official warning headers, printed question, and realistic candidate handwriting simulation.
    Returns base64 data URI of the JPEG.
    """
    if not HAS_PIL:
        return "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI5MDAiIGhlaWdodD0iMTIwMCIgdmlld0JveD0iMCAwIDkwMCAxMjAwIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZmNmYmY4Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iMjQiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiM4ODgiPlVQU0MgTWFpbnMgU2FtcGxlIFNoZWV0PC90ZXh0Pjwvc3ZnPg=="

    width, height = 900, 1200
    img = Image.new("RGB", (width, height), color=(252, 251, 248))
    draw = ImageDraw.Draw(img)

    # UPSC Margins (Left margin at 120px, Right margin at 780px)
    margin_left = 110
    margin_right = 790
    
    # Draw vertical margin guidelines
    draw.line([(margin_left, 0), (margin_left, height)], fill=(210, 205, 200), width=2)
    draw.line([(margin_right, 0), (margin_right, height)], fill=(210, 205, 200), width=2)

    # Ruled horizontal lines
    line_spacing = 32
    start_y = 200 if page_num == 1 else 100
    for y in range(start_y, height - 60, line_spacing):
        draw.line([(margin_left, y), (margin_right, y)], fill=(235, 232, 226), width=1)

    # Header: "Do not write in this margin" in margins
    # Left & right margins text (simulated vertical/light text)
    draw.text((15, 300), "उम्मीदवारों को\nइस हाशिए में\nनहीं लिखना\nचाहिए", fill=(190, 185, 180))
    draw.text((15, 450), "Candidates\nmust not\nwrite on\nthis margin", fill=(190, 185, 180))

    draw.text((800, 300), "उम्मीदवारों को\nइस हाशिए में\nनहीं लिखना\nचाहिए", fill=(190, 185, 180))
    draw.text((800, 450), "Candidates\nmust not\nwrite on\nthis margin", fill=(190, 185, 180))

    # Page Header if page 1
    if page_num == 1:
        draw.rectangle([(margin_left, 20), (margin_right, 180)], outline=(160, 155, 150), width=2, fill=(248, 246, 242))
        
        # Question box
        draw.text((margin_left + 15, 30), f"Q.{q_num}) {q_english}", fill=(30, 30, 30))
        draw.text((margin_left + 15, 90), f"({q_hindi})", fill=(90, 90, 90))
        draw.text((margin_right - 140, 145), f"({marks} Marks / {150 if marks == 10 else 250} Words)", fill=(100, 100, 100))

    # Candidate answer simulation (blue ink handwriting style)
    ink_color = (25, 45, 110) # Classic Reynolds / Parker Blue ink
    curr_y = start_y + 12
    
    for item in handwritten_lines:
        text = item.get("text", "")
        is_heading = item.get("heading", False)
        is_underline = item.get("underline", False)
        indent = item.get("indent", 0)
        
        x = margin_left + 25 + indent
        if is_heading:
            draw.text((x, curr_y), text, fill=(15, 30, 85))
            if is_underline:
                draw.line([(x, curr_y + 18), (x + len(text) * 7.5, curr_y + 18)], fill=(15, 30, 85), width=2)
            curr_y += line_spacing
        elif item.get("diagram"):
            # Draw box / diagram simulation
            d_box = [(x + 40, curr_y), (x + 450, curr_y + 90)]
            draw.rectangle(d_box, outline=(25, 45, 110), width=2, fill=(245, 247, 255))
            draw.text((x + 70, curr_y + 25), item.get("diagram_title", "Flowchart / Schematic"), fill=(25, 45, 110))
            draw.text((x + 70, curr_y + 50), item.get("diagram_sub", "Checks & Balances Matrix"), fill=(60, 70, 120))
            curr_y += 105
        else:
            draw.text((x, curr_y), text, fill=ink_color)
            if is_underline:
                draw.line([(x, curr_y + 18), (x + len(text) * 7.2, curr_y + 18)], fill=ink_color, width=1)
            curr_y += line_spacing

    # Footer: Page number
    draw.text((width // 2 - 20, height - 35), f"- {page_num} -", fill=(140, 135, 130))

    # Convert to JPEG base64
    buf = io.BytesIO()
    img.save(buf, format="JPEG", quality=85)
    b64 = base64.b64encode(buf.getvalue()).decode("utf-8")
    return f"data:image/jpeg;base64,{b64}"

def get_sample_datasets():
    # Sample 1: GS2 Separation of Powers
    gs2_p1_lines = [
        {"text": "Introduction:", "heading": True, "underline": True},
        {"text": "The doctrine of separation of powers, formulated by Montesquieu, divides state", "indent": 0},
        {"text": "authority into Executive, Legislature, and Judiciary. Unlike the USA's rigid separation,", "indent": 0},
        {"text": "the Indian Constitution adopts 'organic separation' with parliamentary executive.", "indent": 0, "underline": True},
        {"text": "", "indent": 0},
        {"text": "1. Non-Rigid Separation in Indian Framework:", "heading": True, "underline": True},
        {"text": "• Executive drawn from Legislature: Council of Ministers are part of Parliament (Art 75(3)).", "indent": 15},
        {"text": "• Executive exercising Legislative powers: Ordinance making power under Article 123.", "indent": 15},
        {"text": "• Judicial review over legislative actions under Article 13.", "indent": 15},
        {"text": "• Parliament can impeach judges under Article 124(4).", "indent": 15},
        {"text": "", "indent": 0},
        {"text": "Structural Flowchart:", "heading": True},
        {"diagram": True, "diagram_title": "Checks & Balances Architecture (Trias Politica)", "diagram_sub": "Legislature <-> Executive <-> Judiciary"},
        {"text": "", "indent": 0},
        {"text": "2. Checks and Balances Preventing Authoritarianism:", "heading": True, "underline": True},
        {"text": "• Basic Structure Doctrine (Kesavananda Bharati, 1973) limits amending power (Art 368).", "indent": 15},
        {"text": "• Parliamentary Committees (PAC, DRSCs) scrutinize executive spendings.", "indent": 15}
    ]

    gs2_p2_lines = [
        {"text": "• Independent Institutions: CAG (Art 148), ECI (Art 324) act as external watchdogs.", "indent": 15},
        {"text": "", "indent": 0},
        {"text": "3. Contemporary Concerns & Vulnerabilities:", "heading": True, "underline": True},
        {"text": "• Frequent ordinance route bypassing parliamentary debate.", "indent": 15},
        {"text": "• Tribunals under executive control affecting judicial independence.", "indent": 15},
        {"text": "• Decline in parliamentary sittings and bills passed without discussion.", "indent": 15},
        {"text": "", "indent": 0},
        {"text": "Conclusion & Way Forward:", "heading": True, "underline": True},
        {"text": "As noted by Dr. B.R. Ambedkar, Constitution provides sufficient checks, but its success", "indent": 0},
        {"text": "depends on constitutional morality. Fostering parliamentary deliberation and upholding", "indent": 0},
        {"text": "institutional autonomy is crucial for preserving democratic resilience.", "indent": 0}
    ]

    sample_1_img1 = generate_sample_upsc_sheet(
        q_num=1,
        q_english="The doctrine of separation of powers is not rigidly followed in the Indian Constitution, yet checks and balances prevent authoritarianism. Critically analyse.",
        q_hindi="भारतीय संविधान में शक्तियों के पृथक्करण के सिद्धांत का कठोरता से पालन नहीं किया जाता, फिर भी नियंत्रण और संतुलन अधिनायकवाद को रोकते हैं। समालोचनात्मक विश्लेषण कीजिए।",
        marks=10,
        handwritten_lines=gs2_p1_lines,
        page_num=1,
        total_pages=2
    )
    sample_1_img2 = generate_sample_upsc_sheet(
        q_num=1,
        q_english="The doctrine of separation of powers is not rigidly followed in the Indian Constitution, yet checks and balances prevent authoritarianism. Critically analyse.",
        q_hindi="भारतीय संविधान में शक्तियों के पृथक्करण के सिद्धांत का कठोरता से पालन नहीं किया जाता, फिर भी नियंत्रण और संतुलन अधिनायकवाद को रोकते हैं। समालोचनात्मक विश्लेषण कीजिए।",
        marks=10,
        handwritten_lines=gs2_p2_lines,
        page_num=2,
        total_pages=2
    )

    # Pre-calibrated authentic evaluation for Sample 1
    sample_1_eval = {
        "overall_score": 4.5,
        "max_marks": 10,
        "percentile_verdict": "Above Average (Top 15% Mains Score)",
        "executive_summary": "A commendable, structured attempt with clear sub-headings and good constitutional knowledge. However, to break into the 5.5+ topper bracket, you must substantiate the 'Critically Analyse' directive with recent institutional flashpoints (e.g., Tribunal Reforms Act conflict, Subordinate legislation scrutiny).",
        "directive_compliance": {
            "directive": "Critically Analyse",
            "adherence_score": "7/10",
            "evaluation": "Good balance between demonstrating how checks work (60%) vs current structural frictions (30%).",
            "gap": "Missed discussing the judicial overreach/activism counter-dimension (e.g., Court appointing committees on policy matters)."
        },
        "rubric_scores": {
            "intro_score": 0.75,
            "intro_max": 1.5,
            "core_demand_score": 2.0,
            "core_demand_max": 5.0,
            "value_add_score": 0.75,
            "value_add_max": 1.5,
            "presentation_score": 0.5,
            "presentation_max": 1.0,
            "conclusion_score": 0.5,
            "conclusion_max": 1.0
        },
        "intro_audit": {
            "current_critique": "Solid conceptual intro mentioning Montesquieu and parliamentary executive. Could be sharper by directly citing Article 50 (DPSP) as constitutional baseline.",
            "missing_elements": ["Article 50 mention (Separation of Judiciary from Executive)", "Indira Nehru Gandhi v. Raj Narain (1975) reference establishing Separation of Powers as Basic Structure"],
            "model_intro_rewrite": "Unlike the US's rigid separation under Montesquieu, India adopts a system of 'differentiated functions with overlapping personnel' (Art 50, 75). In Indira Nehru Gandhi case (1975), the Supreme Court affirmed that separation of powers, tempered by checks and balances, is part of the Basic Structure."
        },
        "body_audit": {
            "strengths": [
                "Excellent structural division: Non-rigid separation vs Checks & Balances",
                "Accurate article citations (Art 75(3), Art 123, Art 148, Art 324)",
                "Neat schematic diagram linking Legislature, Executive, and Judiciary",
                "Relevant mention of parliamentary committees and Basic Structure Doctrine"
            ],
            "critical_gaps": [
                "Lacks mention of the other side of checks: Judicial Activism vs Judicial Overreach (e.g., NJAC judgment striking down 99th CAA)",
                "Did not mention Article 121 & 122 (Parliament cannot discuss conduct of judges; Courts cannot inquire into legislative proceedings)",
                "Contemporary examples like Delegated Legislation and the Tribunalization debate would score extra marks"
            ],
            "missing_dimensions": [
                "Judicial Overreach dimension (Courts entering policy domains)",
                "Federal check (Governor's discretionary powers and Art 356)",
                "2nd ARC (Ethics in Governance) recommendation on parliamentary standards"
            ]
        },
        "value_add_checklist": {
            "constitutional_articles": [
                "Article 50: Separation of judiciary from executive in the public services",
                "Article 121 & 122: Mutual respect and non-interference between Parliament and Judiciary",
                "Article 142: Inherent powers of SC (often debated as overreach)"
            ],
            "sc_judgments_or_reports": [
                "Indira Nehru Gandhi v. Raj Narain (1975) - Separation of powers as Basic Structure",
                "Ram Jawaya Kapur v. State of Punjab (1955) - Executive cannot usurp legislative domain",
                "2nd ARC 6th Report - Local Governance and functional devolution"
            ],
            "data_and_facts": [
                "Percentage of bills referred to Parliamentary Standing Committees dropped from 71% (15th LS) to ~16% (17th LS)",
                "Over 70 ordinances repromulgated between 2014-2024"
            ],
            "schematics_or_maps": [
                "Interlocking VENN diagram or Trias Politica balance triangular schematic (which you successfully drew!)"
            ]
        },
        "conclusion_audit": {
            "current_critique": "Very good ending quoting Dr. Ambedkar and constitutional morality. Crisp and forward-looking.",
            "model_conclusion_rewrite": "As Dr. B.R. Ambedkar remarked, 'The Constitution can only provide the organs of state; their functioning depends upon the people.' Upholding constitutional morality and constructive parliamentary oversight is indispensable to preserve this delicate equilibrium."
        },
        "transcribed_text": "Introduction:\nThe doctrine of separation of powers, formulated by Montesquieu, divides state authority into Executive, Legislature, and Judiciary. Unlike the USA's rigid separation, the Indian Constitution adopts 'organic separation' with parliamentary executive.\n\n1. Non-Rigid Separation in Indian Framework:\n• Executive drawn from Legislature: Council of Ministers are part of Parliament (Art 75(3)).\n• Executive exercising Legislative powers: Ordinance making power under Article 123.\n• Judicial review over legislative actions under Article 13.\n• Parliament can impeach judges under Article 124(4).\n\n2. Checks and Balances Preventing Authoritarianism:\n• Basic Structure Doctrine (Kesavananda Bharati, 1973) limits amending power (Art 368).\n• Parliamentary Committees (PAC, DRSCs) scrutinize executive spendings.\n• Independent Institutions: CAG (Art 148), ECI (Art 324) act as external watchdogs.\n\n3. Contemporary Concerns & Vulnerabilities:\n• Frequent ordinance route bypassing parliamentary debate.\n• Tribunals under executive control affecting judicial independence.\n• Decline in parliamentary sittings and bills passed without discussion.\n\nConclusion & Way Forward:\nAs noted by Dr. B.R. Ambedkar, Constitution provides sufficient checks, but its success depends on constitutional morality. Fostering parliamentary deliberation and upholding institutional autonomy is crucial for preserving democratic resilience.",
        "full_model_answer": """Q. The doctrine of separation of powers is not rigidly followed in the Indian Constitution, yet checks and balances prevent authoritarianism. Critically analyse. (10 Marks / 150 Words)

--- MODEL TOPPER ANSWER ---

Introduction:
Unlike the American doctrine of rigid compartmentalization (Montesquieu), the Indian Constitution embodies a system of **'differentiated functions with overlapping personnel'** (Art 50, 75). In the Indira Gandhi v. Raj Narain case (1975), the Supreme Court held separation of powers to be an integral facet of the **Basic Structure**.

[EXAM-HALL SCHEMATIC / FLOWCHART]:
+-------------------------------------------------------------+
|               CHECKS & BALANCES EQUILIBRIUM                 |
|                                                             |
|           +-----------------------------------+             |
|           |       EXECUTIVE (Art 53/75)       |             |
|           +-----------------------------------+             |
|                   /                       \\                |
|       (Ordinance / Art 123)      (Executive Accountability) |
|                 /                           \\               |
|                v                             v              |
|   +-----------------------+      +-----------------------+  |
|   |  JUDICIARY (Art 124)  |<---->| LEGISLATURE (Art 79)  |  |
|   | (Judicial Review/13)  |      | (Impeachment 124(4))  |  |
|   +-----------------------+      +-----------------------+  |
+-------------------------------------------------------------+

1. Non-Rigid Separation in India (Organic Coordination):
• Executive in Legislature: Council of Ministers collectively responsible to Lok Sabha (**Art 75(3)**).
• Executive Legislation: Ordinance promulgation under **Article 123**.
• Judicial Review: Power to strike down ultra-vires laws (**Art 13, 32, 226**).
• Inter-organ Oversight: Impeachment of Judges by Parliament (**Art 124(4)**).

2. Checks and Balances Preventing Authoritarianism:
• Basic Structure Doctrine: Curbs constituent overreach (**Kesavananda Bharati, 1973**).
• Financial Scrutiny: CAG audits (**Art 148**) and Public Accounts Committee ensure fiscal probity.
• Institutional Quadrant: Independent Election Commission (**Art 324**) and Judiciary guard democratic sanctity.

3. Structural Strains & Critical Gaps:
• Executive Dominance: Proliferation of ordinances and declining referral to Standing Committees (~16% in 17th Lok Sabha).
• Judicial Overreach: Occasional policy incursions (e.g. framing enforcement guidelines).

Way Forward:
As Dr. B.R. Ambedkar cautioned, constitutional mechanisms are only as resilient as the **'constitutional morality'** of their custodians. Institutional autonomy and spirited parliamentary deliberation are vital to sustain this democratic equilibrium.""",
        "visual_annotations": [
            {
                "page": 1,
                "approx_y_percent": 18,
                "tag": "Intro",
                "type": "tick",
                "marks_awarded": "+1.0 / 2.0",
                "remark": "✓ **Good Premise**: Accurately defined **organic separation**.\n✗ **Add**: Contextual reference to **Art 50**."
            },
            {
                "page": 1,
                "approx_y_percent": 35,
                "tag": "Art 123",
                "type": "tick",
                "marks_awarded": "+1.0 / 2.0",
                "remark": "✓ **Accurate Articles**: Precise recall of **Art 75(3)** & **Art 123**."
            },
            {
                "page": 1,
                "approx_y_percent": 55,
                "tag": "Diagram",
                "type": "star",
                "marks_awarded": "+0.5 / 1.0",
                "remark": "✓ **Topper Schematic**: Well-drawn balance matrix fetches **+0.5 marks**."
            },
            {
                "page": 2,
                "approx_y_percent": 25,
                "tag": "Mentor Upgrade Lever",
                "type": "suggestion",
                "marks_awarded": "+1.5 / 3.0",
                "remark": "✎ **Directive Dialectic**: Integrate the counter-dimension (**Judicial Overreach / NJAC 99th CAA**) to fulfill the 'Critically' command word and unlock +1.0 Mark."
            },
            {
                "page": 2,
                "approx_y_percent": 80,
                "tag": "Conclusion",
                "type": "tick",
                "marks_awarded": "+1.0 / 2.0",
                "remark": "✓ **Strong Finish**: High-yield finish quoting **Ambedkar** and **Constitutional Morality**."
            }
        ],
        "next_attempt_focus": {
            "target_section": "Body Dimension II: Judicial Dialectic (-1.5M Recoverable)",
            "student_draft_quote": "Parliament can impeach judges under Article 124(4)... Basic Structure Doctrine limits amending power... Contemporary concerns: Frequent ordinance route.",
            "core_directive": "Critically Analyse: A balanced dialectic demands showing both how checks restrain the executive AND how judicial overreach itself upsets constitutional balance.",
            "plug_and_play_example": "While basic structure (Kesavananda Bharati, 1973) curbs executive dominance, judicial overreach in policy domains (e.g., striking down NJAC via 99th CAA, framing pollution bans) risks eroding democratic legitimacy unless disciplined by judicial restraint.",
            "why_it_earns_marks": "Directly satisfies the 'Critically' directive by presenting the anti-thesis (Judicial Overreach) against the thesis (Executive Overreach), demonstrating master-level dialectical depth.",
            "where_to_place_in_sheet": "Insert as the first bullet under your Heading 3 ('Contemporary Concerns & Vulnerabilities') on Page 2."
        }
    }

    # Sample 2: GS3 Agriculture 15 Marks
    gs3_lines = [
        {"text": "Introduction:", "heading": True, "underline": True},
        {"text": "Agriculture employs 45.6% of India's workforce (PLFS 2023-24) while contributing ~18%", "indent": 0},
        {"text": "to national GVA. However, structural challenges and climate risks threaten farm viability.", "indent": 0},
        {"text": "", "indent": 0},
        {"text": "1. Key Vulnerabilities Faced by Indian Agriculture:", "heading": True, "underline": True},
        {"text": "• Fragmented landholdings: 86% farmers are small & marginal (<2 ha) (Agri Census).", "indent": 15},
        {"text": "• Low productivity: Yields of cereals/pulses are 30-40% lower than global averages.", "indent": 15},
        {"text": "• Climate vulnerability: Increasing erratic monsoons, heatwaves, and soil salinization.", "indent": 15},
        {"text": "• Ground water depletion: 60% irrigation relies on depleting tube-wells (Punjab/Haryana).", "indent": 15},
        {"text": "", "indent": 0},
        {"text": "2. Pillars of Climate-Smart Agriculture (CSA):", "heading": True, "underline": True},
        {"text": "• Micro-irrigation & Water management: Drip and sprinkler under PMKSY 'Per Drop More Crop'.", "indent": 15},
        {"text": "• Climate resilient seed varieties: ICRISAT biofortified, drought & flood-tolerant seeds.", "indent": 15},
        {"text": "• Solarization of Agri Feeder: PM-KUSUM scheme for decentralized clean solar power.", "indent": 15},
        {"text": "• Natural & Regenerative Farming: Zero Budget Natural Farming (ZBNF), bio-fertilizers.", "indent": 15},
        {"text": "", "indent": 0},
        {"text": "Conclusion & Way Forward:", "heading": True, "underline": True},
        {"text": "Implementing Ashok Dalwai Committee recommendations on doubling farmers' income by", "indent": 0},
        {"text": "integrating CSA with Agri-Tech stack is vital for achieving SDG 2 (Zero Hunger) & SDG 13.", "indent": 0}
    ]

    sample_2_img1 = generate_sample_upsc_sheet(
        q_num=2,
        q_english="Despite being the backbone of the rural economy, Indian agriculture suffers from low productivity, fragmented landholdings, and climate vulnerability. Discuss the measures needed to achieve climate-smart agriculture.",
        q_hindi="ग्रामीण अर्थव्यवस्था की रीढ़ होने के बावजूद, भारतीय कृषि कम उत्पादकता, खंडित जोत और जलवायु भेद्यता से ग्रस्त है। जलवायु-अनुकूल कृषि प्राप्त करने के लिए आवश्यक उपायों पर चर्चा कीजिए।",
        marks=15,
        handwritten_lines=gs3_lines,
        page_num=1,
        total_pages=1
    )

    sample_2_eval = {
        "overall_score": 6.5,
        "max_marks": 15,
        "percentile_verdict": "Interview Range (Solid 6.5/15 attempt)",
        "executive_summary": "Very rich data points (PLFS 45.6%, 86% small farmers) and clear scheme mapping (PMKSY, PM-KUSUM, ZBNF). To touch 8.0/15, add a specific flowchart on the FAO Climate Smart Agriculture 3-Pillar framework (Productivity, Adaptation, Mitigation).",
        "directive_compliance": {
            "directive": "Discuss",
            "adherence_score": "8/10",
            "evaluation": "Comprehensive coverage of vulnerabilities followed by multi-sectoral measures.",
            "gap": "Could have added institutional/credit dimensions (KCC, PMFBY revamping)."
        },
        "rubric_scores": {
            "intro_score": 1.25,
            "intro_max": 2.0,
            "core_demand_score": 3.0,
            "core_demand_max": 7.5,
            "value_add_score": 1.0,
            "value_add_max": 2.5,
            "presentation_score": 0.75,
            "presentation_max": 1.5,
            "conclusion_score": 0.5,
            "conclusion_max": 1.5
        },
        "intro_audit": {
            "current_critique": "Terrific opening with authentic PLFS and GVA data. High-scoring start.",
            "missing_elements": ["Explicit definition of Climate Smart Agriculture (CSA) by FAO"],
            "model_intro_rewrite": "Employing 45.6% of India's workforce (PLFS 2023-24) and contributing 18% to GVA, agriculture remains India's socio-economic bedrock. However, with 86% smallholders and IPCC warnings of 10-40% crop yield reduction by 2100, Climate-Smart Agriculture (CSA) based on FAO's trinity of productivity, resilience, and mitigation is non-negotiable."
        },
        "body_audit": {
            "strengths": [
                "Concrete statistical backing (86% small/marginal farmers from Agri Census)",
                "Direct policy integration (PM-KUSUM, PMKSY, ICRISAT seeds)",
                "Balanced coverage of challenges and solutions"
            ],
            "critical_gaps": [
                "Missing the Agro-ecological zoning concept (crop diversification away from water-guzzling paddy in Punjab)",
                "Did not mention livestock & agroforestry integration (crucial for income smoothing during climate shocks)"
            ],
            "missing_dimensions": [
                "Post-harvest infrastructure (PM-AIF, cold chains to prevent 15-20% perishables loss)",
                "Digital Agriculture Mission (AgriStack, Kisan Drones for precision spray)"
            ]
        },
        "value_add_checklist": {
            "constitutional_articles": [
                "Article 48: Organization of agriculture and animal husbandry on modern lines"
            ],
            "sc_judgments_or_reports": [
                "Ashok Dalwai Committee on Doubling Farmers' Income (DFI)",
                "M.S. Swaminathan Committee (C2+50% pricing formula and farm ecology)"
            ],
            "data_and_facts": [
                "FAO: CSA increases yields by up to 20% while reducing GHG emissions by 15%",
                "IPCC WG-II Report: South Asia faces severe ground water depletion and yield volatility"
            ],
            "schematics_or_maps": [
                "FAO 3-Pillar Triangle: 1. Food Security (Yields) | 2. Adaptation (Resilience) | 3. Mitigation (Lower Emissions)"
            ]
        },
        "conclusion_audit": {
            "current_critique": "Clean connection to Ashok Dalwai Committee, SDG 2, and SDG 13.",
            "model_conclusion_rewrite": "Adopting the Ashok Dalwai Committee's paradigm shift from 'production-centric' to 'income & climate resilience-centric' agriculture will secure nutritional security and realize the vision of Viksit Bharat 2047."
        },
        "transcribed_text": "Introduction:\nAgriculture employs 45.6% of India's workforce (PLFS 2023-24) while contributing ~18% to national GVA. However, structural challenges and climate risks threaten farm viability.\n\n1. Key Vulnerabilities Faced by Indian Agriculture:\n• Fragmented landholdings: 86% farmers are small & marginal (<2 ha) (Agri Census).\n• Low productivity: Yields of cereals/pulses are 30-40% lower than global averages.\n• Climate vulnerability: Increasing erratic monsoons, heatwaves, and soil salinization.\n• Ground water depletion: 60% irrigation relies on depleting tube-wells (Punjab/Haryana).\n\n2. Pillars of Climate-Smart Agriculture (CSA):\n• Micro-irrigation & Water management: Drip and sprinkler under PMKSY 'Per Drop More Crop'.\n• Climate resilient seed varieties: ICRISAT biofortified, drought & flood-tolerant seeds.\n• Solarization of Agri Feeder: PM-KUSUM scheme for decentralized clean solar power.\n• Natural & Regenerative Farming: Zero Budget Natural Farming (ZBNF), bio-fertilizers.\n\nConclusion & Way Forward:\nImplementing Ashok Dalwai Committee recommendations on doubling farmers' income by integrating CSA with Agri-Tech stack is vital for achieving SDG 2 (Zero Hunger) & SDG 13.",
        "full_model_answer": "Q. Despite being the backbone of the rural economy, Indian agriculture suffers from low productivity, fragmented landholdings, and climate vulnerability. Discuss the measures needed to achieve climate-smart agriculture. (15 Marks / 250 Words)\n\n--- MODEL TOPPER ANSWER ---\n\nIntroduction:\nSustaining 45.6% of India's workforce (PLFS 2023-24) and contributing ~18% to GVA, agriculture remains India's socio-economic bedrock. However, with 86% small and marginal landholders and IPCC projections of 10–40% crop loss by 2100, Climate-Smart Agriculture (CSA) based on FAO's trinity of productivity, adaptation, and mitigation is an urgent imperative.\n\n1. Critical Structural Vulnerabilities:\n• Operational Fragmentation: Average holding size shrank to 1.08 ha, limiting capital investment and mechanization.\n• Yield Deficits: Cereal/pulse yields lag global peers by 30–50% due to sub-optimal seed replacement rates.\n• Climate Fragility: Shifting isohyets, El Niño episodes, terminal heatwaves, and monoculture-induced groundwater collapse (over 60% tubewell reliance).\n\n2. Key Pillars of Climate-Smart Agriculture (CSA):\nA. Water & Energy Decoupling:\n• Precision Irrigation: Expansion of micro-irrigation (drip/sprinkler) under PMKSY ('More Crop Per Drop').\n• Solar Decentralization: PM-KUSUM for solar-powered irrigation, turning farmers from energy consumers to 'Urjadata'.\n\nB. Varietal & Ecological Resilience:\n• Biofortified Germplasm: Adoption of ICAR/ICRISAT drought/saline-tolerant cultivars (e.g. CR Dhan 315).\n• Regenerative Agro-Ecology: Natural farming (Bhartiya Prakritik Krishi Paddhati) to restore soil organic carbon (SOC).\n\nC. Institutional & Post-Harvest Interventions:\n• Farmer Producer Organizations (FPOs): Aggregation of 10,000 FPOs to achieve economies of scale.\n• Value Chain Decarbonization: PM-AIF funding for cold storage to reduce 15-20% perishable loss.\n\nWay Forward:\nOperationalizing the Ashok Dalwai Committee roadmap by transitioning from 'production-centric' to 'climate-resilient income security' will safeguard nutritional sovereignty and achieve SDG 2 (Zero Hunger) alongside SDG 13 (Climate Action).",
        "visual_annotations": [
            {
                "page": 1,
                "approx_y_percent": 15,
                "tag": "Data",
                "type": "star",
                "remark": "Excellent PLFS data quote! Examiners love precise figures."
            },
            {
                "page": 1,
                "approx_y_percent": 40,
                "tag": "Pointers",
                "type": "tick",
                "remark": "Crisp points with Agri Census facts."
            },
            {
                "page": 1,
                "approx_y_percent": 70,
                "tag": "Schemes",
                "type": "tick",
                "remark": "Good integration of PM-KUSUM and PMKSY."
            },
            {
                "page": 1,
                "approx_y_percent": 88,
                "tag": "Conclusion",
                "type": "tick",
                "marks_awarded": "+1.0 / 2.0",
                "remark": "✓ **Strong Link**: Solid synthesis with **SDG 2** and **Ashok Dalwai report**."
            }
        ],
        "next_attempt_focus": {
            "target_section": "Body: Conceptual Framework for CSA (-2.0M Recoverable)",
            "student_draft_quote": "Pillars of Climate-Smart Agriculture: Micro-irrigation under PMKSY, Climate resilient seeds, Solarization under PM-KUSUM, Natural farming.",
            "core_directive": "Discuss: Move from an unstructured scheme list to an authoritative global institutional framework with measurable targets.",
            "plug_and_play_example": "According to the FAO framework, Climate-Smart Agriculture rests on a non-negotiable trinity: Sustainably increasing agricultural productivity, building climate resilience/adaptation, and reducing GHG emissions (mitigation) towards Net Zero 2070.",
            "why_it_earns_marks": "Elevates your answer from a general GS student's scheme catalogue to an international policy expert's conceptual architecture, fetching +1.0 to +1.5 marks instantly.",
            "where_to_place_in_sheet": "Draw this as a 3-pillar visual block at the top of Page 2, right before listing government initiatives."
        }
    }
    # Sample 3: PSIR Optional 20 Marks (Plato's Justice & Aristotle's Virtue Ethics)
    psir_lines_p1 = [
        {"text": "Introduction:", "heading": True, "underline": True},
        {"text": "Plato is regarded as the father of political philosophy. For Plato, Justice is the", "indent": 0},
        {"text": "\"architectonic notion\".", "indent": 0},
        {"text": "", "indent": 0},
        {"text": "Plato's theory of Justice gives the idea of a just state. As per him, a just state", "indent": 0},
        {"text": "is one, where individual performs functions as per the spiritual qualities of soul.", "indent": 0},
        {"text": "", "indent": 0},
        {"text": "The spiritual qualities of soul are described in Plato's Myth of Metals where", "indent": 0},
        {"text": "men are classified as men of Gold, Silver & Copper as per the", "indent": 0}
    ]

    psir_lines_p2 = [
        {"text": "respective dominance of Reason, Courage and Appetite.", "indent": 0},
        {"text": "", "indent": 0},
        {"text": "Plato's just state is characterized by Proper Stationing, Non-Interference and", "indent": 0},
        {"text": "Functional Specialization.", "indent": 0},
        {"text": "", "indent": 0},
        {"text": "Aristotle, a disciple of Plato as well as his greatest critique, gives the", "indent": 0},
        {"text": "concept of Virtue ethics in his work Nichomachean ethics. As per Aristotle,", "indent": 0},
        {"text": "a just state is essential for a well ordered society.", "indent": 0},
        {"text": "", "indent": 0},
        {"text": "As per Aristotle, there are four cardinal virtues that makes a man", "indent": 0},
        {"text": "virtuous - Justice, Courage, Fortitude and Temparance.", "indent": 0}
    ]

    psir_lines_p3 = [
        {"text": "State is individual writ large, i.e., State is nothing but a reflection of", "indent": 0},
        {"text": "its individuals. If the individuals are just, the State will be just, and", "indent": 0},
        {"text": "ultimately the society will be well ordered.", "indent": 0},
        {"text": "", "indent": 0},
        {"text": "In contemporary times, Plato's theory of justice and Aristotle's theory of virtue", "indent": 0},
        {"text": "ethics are of great relevance in addressing the issues of social inequality & moral decay.", "indent": 0},
        {"text": "", "indent": 0},
        {"text": "Plato's theory of functional specialization can be used to reduce the caste", "indent": 0},
        {"text": "based social inequalities by prioritizing", "indent": 0}
    ]

    psir_lines_p4 = [
        {"text": "merit over birth. Similarly, Aristotle's theory of virtue ethics can help in the", "indent": 0},
        {"text": "development of essential cardinal virtues in individuals, which will help develop", "indent": 0},
        {"text": "reason and critical thinking in man.", "indent": 0},
        {"text": "", "indent": 0},
        {"text": "Their ideas help in contributing to modern political and ethical thought", "indent": 0},
        {"text": "by highlighting the important role of ethics in politics and help in the", "indent": 0},
        {"text": "development of a virtuous society.", "indent": 0},
        {"text": "", "indent": 0},
        {"text": "A society guided by virtues will uphold scientific temper, as proposed by", "indent": 0},
        {"text": "Fundamental duties and help in mitigation of social inequalities & moral decay.", "indent": 0}
    ]

    sample_3_img1 = generate_sample_upsc_sheet(
        q_num=2,
        q_english="Discuss the relevance of Plato's theory of justice and Aristotle's concept of virtue ethics in addressing contemporary issues of social inequality and moral decay. How can their ideas contribute to modern political and ethical thought?",
        q_hindi="समकालीन असमानता और नैतिक पतन के समाधान में प्लेटो के न्याय के सिद्धांत और अरस्तू की सद्गुण नैतिकता की प्रासंगिकता पर चर्चा करें। उनके विचार आधुनिक राजनीतिक और नैतिक चिंतन में कैसे योगदान दे सकते हैं?",
        marks=20,
        handwritten_lines=psir_lines_p1,
        page_num=1,
        total_pages=4
    )

    sample_3_img2 = generate_sample_upsc_sheet(
        q_num=2,
        q_english="Discuss the relevance of Plato's theory of justice and Aristotle's concept of virtue ethics in addressing contemporary issues of social inequality and moral decay. How can their ideas contribute to modern political and ethical thought?",
        q_hindi="समकालीन असमानता और नैतिक पतन के समाधान में प्लेटो के न्याय के सिद्धांत और अरस्तू की सद्गुण नैतिकता की प्रासंगिकता पर चर्चा करें। उनके विचार आधुनिक राजनीतिक और नैतिक चिंतन में कैसे योगदान दे सकते हैं?",
        marks=20,
        handwritten_lines=psir_lines_p2,
        page_num=2,
        total_pages=4
    )

    sample_3_img3 = generate_sample_upsc_sheet(
        q_num=2,
        q_english="Discuss the relevance of Plato's theory of justice and Aristotle's concept of virtue ethics in addressing contemporary issues of social inequality and moral decay. How can their ideas contribute to modern political and ethical thought?",
        q_hindi="समकालीन असमानता और नैतिक पतन के समाधान में प्लेटो के न्याय के सिद्धांत और अरस्तू की सद्गुण नैतिकता की प्रासंगिकता पर चर्चा करें। उनके विचार आधुनिक राजनीतिक और नैतिक चिंतन में कैसे योगदान दे सकते हैं?",
        marks=20,
        handwritten_lines=psir_lines_p3,
        page_num=3,
        total_pages=4
    )

    sample_3_img4 = generate_sample_upsc_sheet(
        q_num=2,
        q_english="Discuss the relevance of Plato's theory of justice and Aristotle's concept of virtue ethics in addressing contemporary issues of social inequality and moral decay. How can their ideas contribute to modern political and ethical thought?",
        q_hindi="समकालीन असमानता और नैतिक पतन के समाधान में प्लेटो के न्याय के सिद्धांत और अरस्तू की सद्गुण नैतिकता की प्रासंगिकता पर चर्चा करें। उनके विचार आधुनिक राजनीतिक और नैतिक चिंतन में कैसे योगदान दे सकते हैं?",
        marks=20,
        handwritten_lines=psir_lines_p4,
        page_num=4,
        total_pages=4
    )

    sample_3_eval = {
        "overall_score": 8.5,
        "max_marks": 20,
        "percentile_verdict": "Average Attempt (42.5% Score — Strong Recovery Potential)",
        "executive_summary": "Good foundational grasp of Plato and Aristotle, and your handwriting is clean and legible! You lost marks today on two easily avoidable traps: first, giving Plato's famous quote to Aristotle, and second, bringing in Indian Fundamental Duties instead of political thinkers. Fix these two and draw a quick 45-second diagram to easily jump into the topper bracket (13.5+).",
        "fatal_blunders_alert": {
            "has_blunder": True,
            "title": "Critical Attribution & Disciplinary Alerts",
            "attribution_error": "Candidate attributed Plato's foundational maxim ('State is individual writ large' from The Republic) directly to Aristotle on Page 3. In UPSC Optionals, misattributing foundational maxims triggers severe penalization (-2.0 marks).",
            "disciplinary_leak": "Candidate forced Indian Article 51A Fundamental Duties ('scientific temper') into a classical Western Political Thought answer on Page 4. In PSIR Paper 1, maintain strict disciplinary boundaries by citing Western political theorists (Popper, MacIntyre, Sandel, Rawls) rather than Indian GS2 constitutional articles."
        },
        "next_attempt_focus": {
            "target_section": "Body & Theoretical Synthesis (-6.0 Marks Recoverable)",
            "core_directive": "Contrast Plato's functional meritocracy with modern universal rights, and deploy Aristotle's distributive justice and Eudaimonia to solve moral decay.",
            "plug_and_play_example": "While Plato's functional specialization offers a framework for merit-based allocation, its inherent class rigidity requires careful adaptation in modern democratic societies striving for universal equality, prompting a dialogue with contemporary theories like Rawls's justice as fairness."
        },
        "missing_keywords_cards": [
            {
                "number": 1,
                "term": "Eudaimonia",
                "thinker": "Aristotle",
                "definition": "Central concept in Aristotle's virtue ethics representing teleological human flourishing or living well, which is the ultimate goal of virtuous statecraft.",
                "where_to_use": "Use in Body section to counter modern consumerism and civic moral decay."
            },
            {
                "number": 2,
                "term": "Philosopher King & Tripartite Soul",
                "thinker": "Plato",
                "definition": "The rule of reason over appetite and courage, embodying wisdom and justice as the prerequisite for an uncorrupted polity.",
                "where_to_use": "Use in Introduction/Body to ground Plato's architectonic conception of justice."
            },
            {
                "number": 3,
                "term": "Distributive Justice (Proportionate Equality)",
                "thinker": "Aristotle",
                "definition": "Allocation of honors, wealth, and offices in proportion to merit and moral contribution, rather than absolute arithmetic equality.",
                "where_to_use": "Use in contemporary application to inform debates on affirmative action and wealth redistribution."
            },
            {
                "number": 4,
                "term": "Communitarianism & Alasdair MacIntyre",
                "thinker": "Modern Political Thought",
                "definition": "Revival of Aristotelian teleology and virtue ethics in 'After Virtue', arguing that justice is grounded in shared community traditions rather than atomized liberal individualism.",
                "where_to_use": "Use in Modern Contribution section to connect classical Greek philosophy to contemporary theory."
            }
        ],
        "micro_hygiene": {
            "spelling_errors": ["Nichomachean (Correct: Nicomachean)", "Temparance (Correct: Temperance)"],
            "grammar_and_syntax": "Ensure compound terms like 'caste-based' and 'well-ordered' are consistently hyphenated.",
            "presentation_and_word_count": "Word count is brief for a 20-marker (~250 words vs 350 words expected). Clear handwriting with good paragraph transitions."
        },
        "directive_compliance": {
            "directive": "Discuss / Comprehensive Analysis",
            "adherence_score": "6/10",
            "evaluation": "You explored both thinkers using clear headings, which is great. To meet the 'Discuss' demand fully, add modern applications and critical counter-arguments.",
            "gap": "Include Karl Popper's critique of Plato's rigid classes and connect Aristotle's virtues to modern public leadership."
        },
        "section_scores": {
            "intro_awarded": 1.5,
            "intro_max": 3.5,
            "body_awarded": 6.0,
            "body_max": 13.5,
            "conclusion_awarded": 1.0,
            "conclusion_max": 3.0
        },
        "rubric_scores": {
            "intro_score": 1.5,
            "intro_max": 3.0,
            "core_demand_score": 5.0,
            "core_demand_max": 9.5,
            "value_add_score": 1.0,
            "value_add_max": 3.5,
            "presentation_score": 0.5,
            "presentation_max": 2.0,
            "conclusion_score": 0.5,
            "conclusion_max": 2.0
        },
        "intro_audit": {
            "current_critique": "Good start mentioning 'architectonic'! To make it topper-grade, connect justice directly with Aristotle's goal of human flourishing (Eudaimonia) in your very first sentence.",
            "missing_elements": ["**Teleological foundation (Good Life)**", "**Context connecting justice to virtue**"],
            "model_intro_rewrite": "Plato's theory of justice and Aristotle's virtue ethics form the foundational bedrock of Western political philosophy, linking individual moral excellence to the normative realization of the just state."
        },
        "body_audit": {
            "strengths": [
                "**Clear exposition** of Plato's functional specialization and Myth of Metals.",
                "**Structured detailing** of Aristotle's cardinal virtues from Nicomachean Ethics."
            ],
            "critical_gaps": [
                "**Attribution Slip**: Plato's quote ('State is individual writ large') given to Aristotle.",
                "**GS-4 Tone Leak**: Cited Fundamental Duties instead of political thinkers like MacIntyre or Sandel."
            ],
            "missing_dimensions": [
                "**Modern meritocracy vs Rawlsian equality of opportunity**.",
                "**Nolan Committee standards and civic character building**."
            ]
        },
        "value_add_checklist": {
            "constitutional_articles_or_scholars": [
                "Alasdair MacIntyre (After Virtue)",
                "Karl Popper (The Open Society and Its Enemies)"
            ],
            "sc_judgments_or_theories": [
                "Teleological ethics framework",
                "Distributive justice paradigms (Rawls vs Aristotle)"
            ],
            "data_and_facts": [
                "N/A - Not applicable (Do not overburden aspirant with irrelevant GS2 facts)"
            ],
            "schematics_or_maps": [
                "Comparison matrix between Platonic Justice and Aristotelian Virtue Ethics"
            ]
        },
        "recommended_diagram_visual": """+-------------------------------------------------------------+
|               CLASSICAL GREEK ETHICAL-POLITICAL MATRIX       |
|                                                             |
|           +-----------------------------------+             |
|           |   TELEOLOGICAL MORAL STATECRAFT   |             |
|           +-----------------------------------+             |
|                   /                       \\                |
|           [STRUCTURAL ORDER]          [CHARACTER FORMATION] |
|                 /                           \\               |
|                v                             v              |
|   +-----------------------+      +-----------------------+  |
|   |    PLATO'S JUSTICE    |      |  ARISTOTLE'S VIRTUES  |  |
|   | - Tripartite Soul     |      | - Nicomachean Ethics  |  |
|   | - Functional Spec.    |<---->| - Golden Mean/Mesotes |  |
|   | - Myth of Metals      |      | - Eudaimonia (Telos)  |  |
|   +-----------------------+      +-----------------------+  |
|                \\                             /              |
|                 +---------------------------+               |
|                               v                             |
|          +-----------------------------------------+        |
|          |     CONTEMPORARY ETHICAL RENEWAL        |        |
|          | - Meritocracy vs Rawlsian Equality      |        |
|          | - Nolan Committee (Civic Character)     |        |
|          | - Communitarian Critique of Atomism     |        |
|          +-----------------------------------------+        |
+-------------------------------------------------------------+""",
        "conclusion_audit": {
            "current_critique": "Ending drifts into generic administrative platitudes rather than a **philosophical synthesis**.",
            "model_conclusion_rewrite": "Thus, while classical paradigms require modern democratic recalibration, Plato's quest for structural harmony and Aristotle's emphasis on character remain indispensable antidotes to contemporary moral relativism."
        },
        "transcribed_text": "Introduction:\nPlato is regarded as the father of political philosophy. For Plato, Justice is the architectonic notion.\n\nPlato's theory of Justice gives the idea of a just state. As per him, a just state is one, where individual performs functions as per the spiritual qualities of soul.\n\nThe spiritual qualities of soul are described in Plato's Myth of Metals where men are classified as men of Gold, Silver & Copper as per the respective dominance of Reason, Courage and Appetite.\n\nPlato's just state is characterized by Proper Stationing, Non-Interference and Functional Specialization. Aristotle, a disciple of Plato as well as his greatest critique, gives the concept of Virtue ethics in his work Nichomachean ethics. As per Aristotle, a just state is essential for a well ordered society.\n\nAs per Aristotle, there are four cardinal virtues that makes a man virtuous - Justice, Courage, Fortitude and Temparance.\n\nState is individual writ large, i.e., State is nothing but a reflection of its individuals. If the individuals are just, the State will be just, and ultimately the society will be well ordered.\n\nIn contemporary times, Plato's theory of justice and Aristotle's theory of virtue ethics are of great relevance in addressing the issues of social inequality & moral decay. Plato's theory of functional specialization can be used to reduce the caste based social inequalities by prioritizing merit over birth.\n\nSimilarly, Aristotle's theory of virtue ethics can help in the development of essential cardinal virtues in individuals, which will help develop reason and critical thinking in man. Their ideas help in contributing to modern political and ethical thought by highlighting the important role of ethics in politics and help in the development of a virtuous society.\n\nA society guided by virtues will uphold scientific temper, as proposed by Fundamental duties and help in mitigation of social inequalities & moral decay.",
        "full_model_answer": """Q. Discuss the relevance of Plato's theory of justice and Aristotle's concept of virtue ethics in addressing contemporary issues of social inequality and moral decay. How can their ideas contribute to modern political and ethical thought? (20 Marks / 300 Words)

--- UPSC TOPPER MODEL ANSWER (EXAM-READY STRUCTURE) ---

1. Introduction: The Teleological Nexus Between Justice & Virtue
Plato and Aristotle established the teleological foundation of Western political philosophy, asserting that the state exists not merely for life, but for the **"good life"**. For Plato, justice (*dikaiosyne*) is the **architectonic virtue** harmonizing the soul and the polis; for Aristotle (*Nicomachean Ethics*), civic virtue cultivates character to attain **Eudaimonia** (human flourishing).

2. Dimension I: Plato's Justice & Addressing Social Inequality
• **Foundational Principle**: Plato replaces birth-based hierarchy with **moral-intellectual meritocracy** grounded in the tripartite soul (Reason, Courage, Appetite) and **Functional Specialization** (*Myth of Metals*).
• **Contemporary Application**: Offers a blueprint to dismantle hereditary stratification (e.g. caste or feudal privilege) by aligning societal roles with innate capacity rather than lineage.
• **Democratic Critique (Dialectic)**: However, Karl Popper (*The Open Society and Its Enemies*) critiques Plato's closed hierarchy as authoritarian. Modern democracies must temper Platonic functionalism with **Rawlsian equality of opportunity** and universal human dignity.

[EXAM-HALL SCHEMATIC / FLOWCHART]:
+-------------------------------------------------------------+
|               CLASSICAL GREEK ETHICAL-POLITICAL MATRIX       |
|                                                             |
|           +-----------------------------------+             |
|           |   TELEOLOGICAL MORAL STATECRAFT   |             |
|           +-----------------------------------+             |
|                   /                       \\                |
|           [STRUCTURAL ORDER]          [CHARACTER FORMATION] |
|                 /                           \\               |
|                v                             v              |
|   +-----------------------+      +-----------------------+  |
|   |    PLATO'S JUSTICE    |      |  ARISTOTLE'S VIRTUES  |  |
|   | - Tripartite Soul     |      | - Nicomachean Ethics  |  |
|   | - Functional Spec.    |<---->| - Golden Mean/Mesotes |  |
|   | - Myth of Metals      |      | - Eudaimonia (Telos)  |  |
|   +-----------------------+      +-----------------------+  |
|                \\                             /              |
|                 +---------------------------+               |
|                               v                             |
|          +-----------------------------------------+        |
|          |     CONTEMPORARY ETHICAL RENEWAL        |        |
|          | - Meritocracy vs Rawlsian Equality      |        |
|          | - Nolan Committee (Civic Character)     |        |
|          | - Communitarian Critique of Atomism     |        |
|          +-----------------------------------------+        |
+-------------------------------------------------------------+

3. Dimension II: Aristotle's Virtue Ethics & Combating Moral Decay
• **Cultivation of Character**: Virtue is not innate but habitual (*Ethos*). Addressing moral decay requires institutionalizing character formation rather than relying solely on coercive penal laws.
• **Doctrine of the Mean (*Mesotes*)**: The 'Golden Mean' provides an ethical rudder against contemporary hyper-consumerism, radical political polarization, and executive excess.
• **Public Administration & Civic Integrity**: Aristotle's emphasis on *phronesis* (practical wisdom) directly informs modern public service standards, prefiguring the **Nolan Committee Principles** (integrity, accountability, objectivity).

4. Dimension III: Contribution to Modern Political & Ethical Thought
• **Communitarian Revival**: Modern communitarians like **Alasdair MacIntyre** (*After Virtue*) and **Michael Sandel** deploy Aristotelian civic virtue to challenge unencumbered liberal individualism.
• **Capabilities Approach**: **Martha Nussbaum** and **Amartya Sen** ground modern human development indices in Aristotelian *Eudaimonia* (substantive freedoms to flourish).
• **Distributive Justice**: Aristotle's **proportionate equality** (treating equals equally, unequals unequally) provides the ethical justification for contemporary affirmative action.

5. Way Forward & Visionary Synthesis:
While classical Greek thought must be decoupled from historic exclusions, synthesizing **Platonic structural merit** with **Aristotelian civic character** offers an enduring antidote to modern moral anomie, ensuring that democratic institutions are guided not just by procedures, but by ethical purpose.""",
        "jargon_buster": [
            {
                "term": "Architectonic",
                "meaning": "The master science or overarching organizing principle that structures all subordinate disciplines."
            },
            {
                "term": "Eudaimonia",
                "meaning": "Aristotle's telos of human flourishing or living well through active virtue, distinct from mere momentary pleasure."
            },
            {
                "term": "Mesotes (Golden Mean)",
                "meaning": "The virtuous balance between two extremes of excess and deficiency (e.g. Courage between Rashness and Cowardice)."
            },
            {
                "term": "Phronesis",
                "meaning": "Practical wisdom: the ability to discern the right moral action in complex, real-world circumstances."
            }
        ],
        "visual_annotations": [
            {
                "page": 1,
                "approx_y_percent": 18,
                "tag": "Architectonic",
                "type": "tick",
                "marks_awarded": "+1.5 / 3.5",
                "remark": "✓ **High-Yield Term**: Correct use of Plato's **'architectonic notion'**."
            },
            {
                "page": 2,
                "approx_y_percent": 60,
                "tag": "Lexical Polish",
                "type": "suggestion",
                "marks_awarded": "+2.5 / 4.5",
                "remark": "✎ **Spelling Watch**: Candidate wrote **'Nichomachean'** (Correct: *Nicomachean*) and **'Temparance'** (Correct: *Temperance*)."
            },
            {
                "page": 3,
                "approx_y_percent": 20,
                "tag": "Attribution Alert",
                "type": "suggestion",
                "marks_awarded": "+2.0 / 4.5",
                "remark": "✎ **Attribution Correction**: Attributed **'State is individual writ large'** to Aristotle. Note: This is Plato's foundational maxim (*The Republic*, Book II). Correcting this preserves +1.5 marks."
            },
            {
                "page": 3,
                "approx_y_percent": 75,
                "tag": "Caste Link",
                "type": "tick",
                "marks_awarded": "+1.5 / 4.5",
                "remark": "✓ **Relevance**: Sincere attempt linking functional specialization to caste reform."
            },
            {
                "page": 4,
                "approx_y_percent": 75,
                "tag": "Disciplinary Scope",
                "type": "suggestion",
                "marks_awarded": "+1.5 / 3.0",
                "remark": "✎ **Disciplinary Alignment**: Avoid inserting **Art 51A Fundamental Duties** into Western Political Thought. Ground modern contribution in **Popper, MacIntyre, Sandel**."
            }
        ],
        "next_attempt_focus": {
            "target_section": "Body: Contemporary Democratic Reconciliation (-3.0M Recoverable)",
            "student_draft_quote": "In contemporary times, Plato's theory of justice and Aristotle's theory of virtue ethics are of great relevance... Plato's functional specialization can reduce caste inequalities by prioritizing merit over birth... society guided by virtues will uphold scientific temper as proposed by Fundamental Duties.",
            "core_directive": "Critically Evaluate: Avoid anachronistic disciplinary leaks (e.g. citing Art 51A Fundamental Duties in Western Political Thought) and engage with democratic critiques like Karl Popper.",
            "plug_and_play_example": "While Karl Popper (The Open Society and Its Enemies) critiques Platonic functionalism as totalitarian, contemporary thinkers like Michael Sandel and Alasdair MacIntyre rehabilitate Aristotelian civic virtue to counter atomized liberal individualism and institutional cynicism.",
            "why_it_earns_marks": "Demonstrates authentic optional-level scholarly mastery (Popper, Sandel, MacIntyre) and eliminates disciplinary contamination, converting a 7/20 into an elite 13+/20.",
            "where_to_place_in_sheet": "Write this as the opening analytical bridge under Section 4 ('Contribution to Modern Political & Ethical Thought') on Page 4."
        }
    }

    # Sample 4: GS4 Ethics Conduct vs Ethics 10 Marks (Masterclass & Multi-Topper Calibrated)
    gs4_p1_lines = [
        {"text": "Introduction:", "heading": True, "underline": True},
        {"text": "While both guide administrative conduct, Code of Conduct represents the minimum legal", "indent": 0},
        {"text": "floor of acceptable behavior, whereas Code of Ethics embodies the moral ceiling and", "indent": 0},
        {"text": "aspirational values of public service rooted in Constitutional Morality.", "indent": 0, "underline": True},
        {"text": "", "indent": 0},
        {"text": "1. Conceptual Distinction Matrix:", "heading": True, "underline": True},
        {"text": "• Nature: Conduct is negative & prescriptive ('Do not'); Ethics is positive & aspirational.", "indent": 15},
        {"text": "• Source: Conduct stems from Central Civil Services Rules 1964; Ethics from Conscience & Art 14/21.", "indent": 15},
        {"text": "• Enforcement: Conduct relies on disciplinary penal sanction; Ethics relies on moral conviction.", "indent": 15},
        {"text": "• Scope: Conduct covers codified scenarios; Ethics navigates discretionary gray zones.", "indent": 15},
        {"text": "", "indent": 0},
        {"text": "2. Why External Compliance Fails Without Moral Compass:", "heading": True, "underline": True},
        {"text": "a) Loophole Exploitation & 'Creative Compliance':", "heading": False, "underline": True},
        {"text": "• Rules create compliance checklists without conviction (Robert Klitgaard: C = M + D - A).", "indent": 15},
        {"text": "• Example: ICICI-Videocon deal observed technical rules while violating spirit of probity.", "indent": 15},
        {"text": "b) Rule Fetishism vs Compassion in Gray Zones:", "heading": False, "underline": True},
        {"text": "• Strict rule-compliance without empathy causes systemic cruelty (e.g. Jharkhand Aadhaar", "indent": 15},
        {"text": "  starvation death where ration was denied due to biometric fingerprint failure).", "indent": 15}
    ]

    gs4_p2_lines = [
        {"text": "c) Moral Muteness Under Hierarchy & Coercion:", "heading": False, "underline": True},
        {"text": "• Civil servants succumb to political pressure when lacking moral courage (Aristotle's Phronesis).", "indent": 15},
        {"text": "• Contrast: Sanjukta Parashar IPS & Armstrong Pame IAS demonstrated that personal", "indent": 15},
        {"text": "  character transcends administrative inertia to serve public good.", "indent": 15},
        {"text": "", "indent": 0},
        {"text": "Schematic: Value Hierarchy in Administration:", "heading": True},
        {"diagram": True, "diagram_title": "Triple Bottom Line Priority Pyramid", "diagram_sub": "National/Constitutional > Public Good > Code of Conduct > Self"},
        {"text": "", "indent": 0},
        {"text": "3. Fostering Internal Moral Compass (Synthesis):", "heading": True, "underline": True},
        {"text": "• Kant's Categorical Imperative: Duty performed out of reverence for moral law, not fear.", "indent": 15},
        {"text": "• Nishkam Karma (Gita): Detached public service without opportunistic rent-seeking.", "indent": 15},
        {"text": "• Swarochish Somavanshi IAS: Using administrative discretion with compassion for malnourished children.", "indent": 15},
        {"text": "", "indent": 0},
        {"text": "Conclusion & Way Forward:", "heading": True, "underline": True},
        {"text": "As recommended by the 2nd ARC 4th Report (Ethics in Governance), India must enact a", "indent": 0},
        {"text": "statutory Public Service Bill codifying Nolan Principles, ensuring external accountability", "indent": 0},
        {"text": "is reinforced by internalized constitutional ethics.", "indent": 0}
    ]

    sample_4_img1 = generate_sample_upsc_sheet(
        q_num=4,
        q_english="Differentiate between 'Code of Conduct' and 'Code of Ethics'. Why does external compliance alone fail to prevent bureaucratic corruption without an internal moral compass? Elucidate with examples.",
        q_hindi="'आचार संहिता' (Code of Conduct) और 'नीतिपरक संहिता' (Code of Ethics) में अंतर स्पष्ट कीजिए। आंतरिक नैतिक दिशा-सूचक (moral compass) के बिना केवल बाह्य अनुपालन नौकरशाही भ्रष्टाचार को रोकने में विफल क्यों रहता है? सोदाहरण स्पष्ट कीजिए।",
        marks=10,
        handwritten_lines=gs4_p1_lines,
        page_num=1,
        total_pages=2
    )

    sample_4_img2 = generate_sample_upsc_sheet(
        q_num=4,
        q_english="Differentiate between 'Code of Conduct' and 'Code of Ethics'. Why does external compliance alone fail to prevent bureaucratic corruption without an internal moral compass? Elucidate with examples.",
        q_hindi="'आचार संहिता' (Code of Conduct) और 'नीतिपरक संहिता' (Code of Ethics) में अंतर स्पष्ट कीजिए। आंतरिक नैतिक दिशा-सूचक (moral compass) के बिना केवल बाह्य अनुपालन नौकरशाही भ्रष्टाचार को रोकने में विफल क्यों रहता है? सोदाहरण स्पष्ट कीजिए।",
        marks=10,
        handwritten_lines=gs4_p2_lines,
        page_num=2,
        total_pages=2
    )

    sample_4_eval = {
        "overall_score": 5.5,
        "max_marks": 10,
        "percentile_verdict": "Exceptional (Top 3% All-India UPSC Score)",
        "executive_summary": "An outstanding, masterclass-grade GS-4 answer exemplifying the KEE (Keyword -> Explanation -> Example) model. Accurately contrasts minimum legal standards (Conduct) with aspirational moral ceilings (Ethics), utilizes Klitgaard's corruption formula (C=M+D-A), contrasts systemic failures (Jharkhand Aadhaar biometric denial) with officer role models (Swarochish Somavanshi IAS, Armstrong Pame IAS), and concludes with 2nd ARC recommendations.",
        "directive_compliance": {
            "directive": "Elucidate",
            "adherence_score": "9/10",
            "evaluation": "Superior explanatory clarity utilizing multi-parameter tabular distinction, real administrative flashpoints, and philosophical synthesis.",
            "gap": "Could add the Mayer-Salovey model or Daniel Goleman's Emotional Intelligence quadrants to explain how officers withstand institutional stress."
        },
        "section_scores": {
            "intro_awarded": 1.5,
            "intro_max": 2.0,
            "body_awarded": 3.0,
            "body_max": 6.5,
            "conclusion_awarded": 1.0,
            "conclusion_max": 1.5
        },
        "rubric_scores": {
            "intro_score": 1.0,
            "intro_max": 1.5,
            "core_demand_score": 2.5,
            "core_demand_max": 5.0,
            "value_add_score": 1.0,
            "value_add_max": 1.5,
            "presentation_score": 0.5,
            "presentation_max": 1.0,
            "conclusion_score": 0.5,
            "conclusion_max": 1.0
        },
        "intro_audit": {
            "current_critique": "Crisp, topper-grade conceptual opening establishing the 'floor vs ceiling' distinction. Exactly within the 15% spatial allocation rule.",
            "missing_elements": [
                "**Summum Bonum** (Highest Good of Public Administration)",
                "**Doctrine of Public Trust** reference"
            ],
            "model_intro_rewrite": "While both serve as integrity safeguards, a Code of Conduct establishes the legal floor (minimum acceptable behavior), whereas a Code of Ethics embodies the aspirational moral ceiling guided by Constitutional Morality (Art 14, 21) and the Doctrine of Public Trust."
        },
        "body_audit": {
            "strengths": [
                "**Structured 4-parameter contrast table** (Nature, Source, Enforcement, Scope).",
                "**KEE Model Execution**: Applied Klitgaard's equation followed by concrete corporate & administrative failure cases.",
                "**High-impact named officer benchmarks**: Swarochish Somavanshi IAS, Sanjukta Parashar IPS, and Armstrong Pame IAS.",
                "**Philosophical balance**: Harmonized Kant's Deontology with Bhagavad Gita's Nishkam Karma."
            ],
            "critical_gaps": [
                "Could formalize the psychological CAB Model (Cognition-Affect-Behavior) to explain how an external code shifts into an internalized habit."
            ],
            "missing_dimensions": [
                "**Max Weber's 'Iron Cage of Bureaucracy'** (danger of rules becoming cold proceduralism).",
                "**Whistleblower protection mechanism** under the Whistle Blowers Protection Act 2014."
            ]
        },
        "value_add_checklist": {
            "constitutional_articles_or_scholars": [
                "2nd ARC 4th Report (Ethics in Governance - Public Service Bill)",
                "Nolan Committee 7 Principles of Public Life (1995)",
                "Immanuel Kant (Categorical Imperative) & Bhagavad Gita (Nishkam Karma)"
            ],
            "sc_judgments_or_theories": [
                "Robert Klitgaard's Corruption Equation: C = M + D - A",
                "Doctrine of Public Trust (M.C. Mehta v. Kamal Nath, 1997)"
            ],
            "data_and_facts": [
                "Central Civil Services (Conduct) Rules 1964 vs Proposed Civil Services Code"
            ],
            "schematics_or_maps": [
                "Triple Bottom Line Priority Pyramid (National > Public > Professional > Personal Interest)"
            ]
        },
        "recommended_diagram_visual": """+-------------------------------------------------------------+
|              VALUE HIERARCHY IN PUBLIC SERVICE              |
|                                                             |
|                       /\\                                    |
|                      /  \\     [1. CONSTITUTIONAL MORALITY]  |
|                     /    \\      Art 14, 21, Public Trust    |
|                    /------\\                                 |
|                   /        \\    [2. PUBLIC INTEREST]        |
|                  /          \\     Nolan Principles, Antyodaya|
|                 /------------\\                              |
|                /              \\   [3. CODE OF CONDUCT]      |
|               /                \\    CCS Rules, Minimum Floor|
|              /------------------\\                           |
|             /  PERSONAL BENEFIT  \\ [4. SELF-INTEREST (BASE)]|
+-------------------------------------------------------------+""",
        "next_attempt_focus": {
            "target_section": "Body: Discretionary Gray Zones & Moral Dilemma (-1.5M Recoverable)",
            "student_draft_quote": "Civil servants succumb to political pressure when lacking moral courage... personal character transcends administrative inertia to serve public good.",
            "core_directive": "Elucidate with concrete administrative dilemmas: Show the exact cognitive friction between Weberian proceduralism and compassionate discretion.",
            "plug_and_play_example": "In administrative gray zones where rules conflict with empathy, an ethical bureaucrat relies on Aristotelian phronesis (practical wisdom) to prevent Weberian procedural compliance from degenerating into bureaucratic cruelty.",
            "why_it_earns_marks": "Directly links administrative doctrine (Weber's iron cage) with philosophical virtue ethics (Phronesis) to resolve real-world public service dilemmas, fetching +0.5 to +1.0M.",
            "where_to_place_in_sheet": "Place this immediately after your ICICI-Videocon or Aadhaar biometric starvation case study on Page 1."
        },
        "missing_keywords_cards": [
            {
                "number": 1,
                "term": "Creative Compliance & Moral Myopia",
                "thinker": "Dennis Moberg / Business Ethics",
                "definition": "Technically obeying the letter of the law while knowingly subverting its ethical intent.",
                "where_to_use": "Use when explaining why penal rules alone fail without an internal conscience."
            },
            {
                "number": 2,
                "term": "Phronesis (Practical Wisdom)",
                "thinker": "Aristotle",
                "definition": "The moral virtue that enables a decision-maker to apply general ethical principles wisely to concrete, ambiguous real-life dilemmas.",
                "where_to_use": "Use in the body when discussing bureaucratic discretion and gray zones."
            },
            {
                "number": 3,
                "term": "Nishkam Karma & Sthitaprajna",
                "thinker": "Bhagavad Gita (Chapter 2)",
                "definition": "Duty performed without attachment to personal fruits or fear of retribution, maintaining mental equilibrium under pressure.",
                "where_to_use": "Use as an Indian philosophical anchor for civil service neutrality and selfless dedication."
            },
            {
                "number": 4,
                "term": "Nolan Principles & Public Service Code",
                "thinker": "Lord Nolan Committee (1995) / 2nd ARC",
                "definition": "The seven foundational principles (Selflessness, Integrity, Objectivity, Accountability, Openness, Honesty, Leadership) recommended for statutory adoption.",
                "where_to_use": "Use in conclusion to ground long-term institutional reform recommendations."
            }
        ],
        "micro_hygiene": {
            "spelling_errors": ["None detected — clean presentation."],
            "grammar_and_syntax": "Clean academic phrasing with crisp bullet formatting and strong conceptual clarity.",
            "presentation_and_word_count": "Optimal 160-word density perfectly fitting 2 ruled booklet pages."
        },
        "fatal_blunders_alert": "None. Flawless conceptual boundaries maintained between GS-2 legal formalism and GS-4 ethical philosophy.",
        "conclusion_audit": {
            "current_critique": "Solid, forward-looking finish linking the 2nd ARC 4th Report with statutory codification. Concludes with authority.",
            "model_conclusion_rewrite": "As underscored by the 2nd ARC (Ethics in Governance), rules can deter malfeasance, but only an internalized Code of Ethics inspires excellence. Institutionalizing the Public Service Bill alongside value-based training will align bureaucratic duty with constitutional conscience."
        },
        "transcribed_text": "Introduction:\nWhile both guide administrative conduct, Code of Conduct represents the minimum legal floor of acceptable behavior, whereas Code of Ethics embodies the moral ceiling and aspirational values of public service rooted in Constitutional Morality.\n\n1. Conceptual Distinction Matrix:\n• Nature: Conduct is negative & prescriptive ('Do not'); Ethics is positive & aspirational.\n• Source: Conduct stems from Central Civil Services Rules 1964; Ethics from Conscience & Art 14/21.\n• Enforcement: Conduct relies on disciplinary penal sanction; Ethics relies on moral conviction.\n• Scope: Conduct covers codified scenarios; Ethics navigates discretionary gray zones.\n\n2. Why External Compliance Fails Without Moral Compass:\na) Loophole Exploitation & 'Creative Compliance':\n• Rules create compliance checklists without conviction (Robert Klitgaard: C = M + D - A).\n• Example: ICICI-Videocon deal observed technical rules while violating spirit of probity.\nb) Rule Fetishism vs Compassion in Gray Zones:\n• Strict rule-compliance without empathy causes systemic cruelty (e.g. Jharkhand Aadhaar starvation death where ration was denied due to biometric fingerprint failure).\nc) Moral Muteness Under Hierarchy & Coercion:\n• Civil servants succumb to political pressure when lacking moral courage (Aristotle's Phronesis).\n• Contrast: Sanjukta Parashar IPS & Armstrong Pame IAS demonstrated that personal character transcends administrative inertia to serve public good.\n\n3. Fostering Internal Moral Compass (Synthesis):\n• Kant's Categorical Imperative: Duty performed out of reverence for moral law, not fear.\n• Nishkam Karma (Gita): Detached public service without opportunistic rent-seeking.\n• Swarochish Somavanshi IAS: Using administrative discretion with compassion for malnourished children.\n\nConclusion & Way Forward:\nAs recommended by the 2nd ARC 4th Report (Ethics in Governance), India must enact a statutory Public Service Bill codifying Nolan Principles, ensuring external accountability is reinforced by internalized constitutional ethics.",
        "full_model_answer": """Q. Differentiate between 'Code of Conduct' and 'Code of Ethics'. Why does external compliance alone fail to prevent bureaucratic corruption without an internal moral compass? Elucidate with examples. (10 Marks / 150 Words)

--- MODEL TOPPER ANSWER ---

1. Introduction:
While both govern bureaucratic behavior, a **Code of Conduct** sets the enforceable legal floor (minimum acceptable standards), whereas a **Code of Ethics** embodies the aspirational moral ceiling (*Summum Bonum*) grounded in Constitutional Morality (**Art 14, 21**) and the Doctrine of Public Trust.

2. Conceptual Distinction Matrix:
| Parameter | Code of Conduct | Code of Ethics |
| :--- | :--- | :--- |
| **Nature** | Prescriptive & Prohibitive ('Thou shalt not') | Aspirational & Values-based ('Thou shalt') |
| **Origin** | Central Civil Services Rules, 1964 | Moral Conscience & Constitutional Morals |
| **Enforcement** | Departmental inquiries & penal sanctions | Conscience & peer scrutiny |
| **Scope** | Explicitly codified scenarios | Ambiguous discretionary gray zones |

3. [EXAM-HALL SCHEMATIC / FLOWCHART]:
+-------------------------------------------------------------+
|              VALUE HIERARCHY IN PUBLIC SERVICE              |
|                                                             |
|                       /\\                                    |
|                      /  \\     [1. CONSTITUTIONAL MORALITY]  |
|                     /    \\      Art 14, 21, Public Trust    |
|                    /------\\                                 |
|                   /        \\    [2. PUBLIC INTEREST]        |
|                  /          \\     Nolan Principles, Antyodaya|
|                 /------------\\                              |
|                /              \\   [3. CODE OF CONDUCT]      |
|               /                \\    CCS Rules, Minimum Floor|
|              /------------------\\                           |
|             /  PERSONAL BENEFIT  \\ [4. SELF-INTEREST (BASE)]|
+-------------------------------------------------------------+

4. Why External Compliance Fails Without an Internal Moral Compass:
• **Creative Compliance & Loophole Hunting**: External rules encourage ticking boxes while violating ethical intent (**Robert Klitgaard's Formula: $C = M + D - A$**). E.g., ICICI-Videocon conflict-of-interest loan disclosures.
• **Rule Fetishism vs Compassion in Gray Zones**: Rigid rule adherence devoid of empathy causes administrative violence. E.g., The tragic **Jharkhand Aadhaar starvation case**, where ration was denied to an impoverished family due to biometric failure. Conversely, **Swarochish Somavanshi IAS** used administrative discretion with compassion to provide air conditioning for malnourished pediatric wards.
• **Moral Muteness Under Coercion**: Without Aristotelian *phronesis* (moral courage), officers surrender to political pressure. Officers like **Sanjukta Parashar IPS** and **Armstrong Pame IAS** prove that personal integrity transcends rulebook mediocrity.

5. Philosophical Synthesis:
Cultivating an internal moral compass requires synthesizing **Kant's Categorical Imperative** (duty as an unconditional moral obligation, not fear of penalty) with the Bhagavad Gita's ideal of **Nishkam Karma** (detached, selfless public duty).

6. Conclusion & 2nd ARC Blueprint:
As recommended by the **2nd ARC 4th Report (Ethics in Governance)**, India must enact a statutory **Civil Services Bill** codifying the **Nolan Principles**. Rules alone cannot compel virtue; external compliance must be anchored by an internalized ethical rudder to realize genuine good governance (*Su-shasan*).""",
        "jargon_buster": [
            {
                "term": "Creative Compliance",
                "meaning": "Using technicalities or legal loopholes to bypass the spirit of an ethical rule while technically complying with its letter."
            },
            {
                "term": "Phronesis",
                "meaning": "Aristotle's concept of practical wisdom: knowing the right moral action, at the right time, in the right proportion, in ambiguous gray zones."
            },
            {
                "term": "Summum Bonum",
                "meaning": "The supreme good or highest moral aim that guides ethical decision-making in public life."
            },
            {
                "term": "Klitgaard's Equation",
                "meaning": "Robert Klitgaard's economic formula for corruption: Corruption = Monopoly + Discretion - Accountability (C = M + D - A)."
            }
        ],
        "visual_annotations": [
            {
                "page": 1,
                "approx_y_percent": 16,
                "tag": "Definition",
                "type": "tick",
                "marks_awarded": "+1.5 / 2.0",
                "remark": "✓ **High-Yield Opening**: Outstanding conceptual differentiation between **moral floor** (Conduct) and **moral ceiling** (Ethics)."
            },
            {
                "page": 1,
                "approx_y_percent": 42,
                "tag": "Distinction Matrix",
                "type": "tick",
                "marks_awarded": "+1.5 / 3.0",
                "remark": "✓ **Topper Architecture**: Multi-parameter distinction table (Nature, Source, Enforcement, Scope) immediately establishes structural mastery."
            },
            {
                "page": 1,
                "approx_y_percent": 78,
                "tag": "KEE Model",
                "type": "tick",
                "marks_awarded": "+1.0 / 2.0",
                "remark": "✓ **KEE Model Executed**: Cites **Klitgaard equation (C=M+D-A)** and grounds it in the **Jharkhand Aadhaar starvation case**."
            },
            {
                "page": 2,
                "approx_y_percent": 35,
                "tag": "Officer Benchmarks",
                "type": "star",
                "marks_awarded": "+1.0 / 2.0",
                "remark": "✓ **Hall of Fame**: Concrete invocation of **Swarochish Somavanshi IAS** and **Armstrong Pame IAS** earns +1.0 mark bonus."
            },
            {
                "page": 2,
                "approx_y_percent": 82,
                "tag": "2nd ARC Synthesis",
                "type": "tick",
                "marks_awarded": "+0.5 / 1.0",
                "remark": "✓ **Visionary Conclusion**: Policy-grade conclusion citing **2nd ARC 4th Report (Ethics in Governance)** and **Civil Services Bill**."
            }
        ]
    }

    return [
        {
            "id": "sample-gs2-separation-powers",
            "paper": "GS2",
            "paper_title": "GS Paper 2 (Indian Constitution & Polity)",
            "marks": 10,
            "word_limit": 150,
            "question": "The doctrine of separation of powers is not rigidly followed in the Indian Constitution, yet checks and balances prevent authoritarianism. Critically analyse.",
            "pages": [sample_1_img1, sample_1_img2],
            "precomputed_evaluation": sample_1_eval
        },
        {
            "id": "sample-gs3-agriculture",
            "paper": "GS3",
            "paper_title": "GS Paper 3 (Agriculture & Food Security)",
            "marks": 15,
            "word_limit": 250,
            "question": "Despite being the backbone of the rural economy, Indian agriculture suffers from low productivity, fragmented landholdings, and climate vulnerability. Discuss the measures needed to achieve climate-smart agriculture.",
            "pages": [sample_2_img1],
            "precomputed_evaluation": sample_2_eval
        },
        {
            "id": "sample-optional-plato-aristotle",
            "paper": "Optional-PSIR",
            "paper_title": "Optional: PSIR (Political Theory & Global Politics)",
            "marks": 20,
            "word_limit": 300,
            "question": "Discuss the relevance of Plato's theory of justice and Aristotle's concept of virtue ethics in addressing contemporary issues of social inequality and moral decay. How can their ideas contribute to modern political and ethical thought?",
            "pages": [sample_3_img1, sample_3_img2, sample_3_img3, sample_3_img4],
            "precomputed_evaluation": sample_3_eval
        },
        {
            "id": "sample-gs4-ethics-conduct-vs-ethics",
            "paper": "GS4",
            "paper_title": "GS Paper 4 (Probity in Governance & Administrative Ethics)",
            "marks": 10,
            "word_limit": 150,
            "question": "Differentiate between 'Code of Conduct' and 'Code of Ethics'. Why does external compliance alone fail to prevent bureaucratic corruption without an internal moral compass? Elucidate with examples.",
            "pages": [sample_4_img1, sample_4_img2],
            "precomputed_evaluation": sample_4_eval
        }
    ]

# =====================================================================
# DIVERSIFIED UPSC MAINS QUESTION BANK (CURRENT AFFAIRS + STATIC ANCHORS)
# Sources: The Hindu, Indian Express, PIB, LiveMint, Down To Earth, PRS India
# Every entry contains: source_name, source_headline, source_url, directive, directive_guidance (5-6 sentences)
# =====================================================================
DAILY_QUESTIONS_BANK = [
    {
        "id": "daw-gs1-01",
        "paper": "GS1",
        "paper_name": "GS Paper 1 (Modern Indian History & Freedom Struggle)",
        "marks": 10,
        "word_limit": 150,
        "time_target": "7.0 Minutes",
        "directive": "Discuss",
        "syllabus_topic": "The Freedom Struggle — its various stages and important contributors/contributions from different parts of the country.",
        "question": "The 1929 Central Legislative Assembly incident was not merely an act of revolutionary protest by Bhagat Singh and Batukeshwar Dutt, but a watershed moment that tested legislative autonomy under Speaker Vithalbhai Patel against colonial executive bills. Discuss how revolutionary ideology and parliamentary constitutionalism intersected during the late 1920s freedom struggle.",
        "context": "Historical re-examination of the April 1929 Central Legislative Assembly protest against the Public Safety Bill and Trade Disputes Bill alongside Speaker Vithalbhai Patel’s assertion of parliamentary sovereignty.",
        "source_name": "The Indian Express (Explained)",
        "source_headline": "Two men and a bomb blast: When Bhagat Singh and Sardar Patel’s brother Vithalbhai Patel crossed paths in the Central Legislative Assembly",
        "source_url": "https://indianexpress.com/article/explained/explained-history/bhagat-singh-bombs-assembly-vithalbhai-patel-vallabhbhai-10896364/",
        "micro_dimensions": [
            "Ideological Shift of HSRA: Transition from individual heroic action to ideological mass awakening (\"to make the deaf hear\") against draconian colonial laws",
            "Parliamentary Resistance Within the House: Speaker Vithalbhai Patel’s historic ruling blocking the Public Safety Bill and asserting legislative supremacy over the Viceroy",
            "Complementarity of Two Streams: How Swarajist floor opposition inside the Assembly and HSRA revolutionary critique outside converged against colonial authoritarianism"
        ],
        "topper_benchmarks": "Draw a dual-stream convergence diagram (Swarajist Floor Resistance under Vithalbhai Patel + HSRA Socialist Mass Awakening under Bhagat Singh) converging on the 1929 Public Safety & Trade Disputes Bills.",
        "directive_guidance": "1. Approach this 'Discuss' directive by examining both revolutionary mass awakening and constitutional legislative resistance as complementary anti-colonial streams. 2. Open with an introduction framing April 8, 1929 as a dual confrontation where HSRA's ideological manifesto intersected with Speaker Vithalbhai Patel's assertion of parliamentary sovereignty. 3. Detail the parliamentary stream: Speaker Patel's historic ruling declining to put the draconian Public Safety Bill to vote, establishing the autonomy of the Chair against the colonial Viceroy. 4. Analyze the revolutionary stream: HSRA's deliberate shift under Bhagat Singh from targeted assassination to mass political awakening ('to make the deaf hear') without causing loss of life. 5. Include a conceptual schematic contrasting parliamentary floor opposition with revolutionary popular mobilization converging on the Trade Disputes and Public Safety Bills. 6. Conclude by synthesizing how constitutionalism within the legislature and revolutionary idealism outside together delegitimized British colonial authority."
    },
    {
        "id": "daw-gs1-02",
        "paper": "GS1",
        "paper_name": "GS Paper 1 (Art, Culture & Modern National Symbols)",
        "marks": 15,
        "word_limit": 250,
        "time_target": "9.0 Minutes",
        "directive": "Examine",
        "syllabus_topic": "Salient aspects of Art Forms, Literature and Architecture from ancient to modern times; Modern Indian History.",
        "question": "Literature and patriotic songs during the Indian National Movement served as powerful instruments of mass mobilization while simultaneously navigating diverse cultural sensibilities. Examine the historical role of \"Vande Mataram\" in anti-colonial resistance and how the Constituent Assembly harmonized national symbols with constitutional pluralism.",
        "context": "The Hindu editorial examining the cultural legacy of Bankim Chandra Chattopadhyay’s Vande Mataram from the 1905 Swadeshi Movement to the Constituent Assembly’s January 24, 1950 consensus.",
        "source_name": "The Hindu (Editorial)",
        "source_headline": "A nation’s song: On Vande Mataram’s rendition and the constitutional ethos of composite cultural heritage",
        "source_url": "https://www.thehindu.com/opinion/editorial/a-nations-song-on-vande-matarams-rendition/article71504906.ece",
        "micro_dimensions": [
            "Anti-Colonial Mass Mobilization: Role in 1905 Partition of Bengal (Swadeshi Movement), Barisal Conference, and revolutionary journals across provinces",
            "Literary & Cultural Synthesis: Evolution from Anandamath (1882) to Rabindranath Tagore’s musical rendition at the 1896 Calcutta Congress session",
            "Constitutional Statecraft (1950): Dr. Rajendra Prasad’s statement according equal honour to Jana Gana Mana (National Anthem) and Vande Mataram (National Song) to uphold fraternity"
        ],
        "topper_benchmarks": "Cite the 1896 Congress Session (Tagore), 1905 Swadeshi Movement, and Dr. Rajendra Prasad’s Constituent Assembly declaration of January 24, 1950.",
        "directive_guidance": "1. Approach this 'Examine' directive by probing how cultural literature catalyzed mass nationalism while necessitating delicate constitutional reconciliation to safeguard pluralism. 2. Open by tracing 'Vande Mataram' from Bankim Chandra Chattopadhyay’s Anandamath (1882) to Rabindranath Tagore's musical rendition at the 1896 Calcutta Congress. 3. Detail its mobilizing power during the 1905 Swadeshi Movement (Barisal Conference), uniting students and nationalists against Bengal partition. 4. Interrogate cultural sensibilities and ideological contestations over religious imagery, demonstrating why sensitive historical statecraft was vital. 5. Detail the Constituent Assembly’s statesmanship: Dr. Rajendra Prasad's historic January 24, 1950 declaration according equal honour to Jana Gana Mana (National Anthem) and Vande Mataram (National Song). 6. Conclude by affirming that India's constitutional ethos harmonizes patriotic fervor with fraternity and composite cultural heritage under Article 51A(f).'s Ulgulan against fiscal encroachment. 4. Devote 35% to interrogating historiographical neglect: colonial criminalization of forest dwellers and elitist nationalist historiography focused on metropolitan politics. 5. Embed a quick outline map of central and eastern India marking key tribal insurrection nodes. 6. Conclude with a synthesized perspective on constitutional recognition under the Fifth and Sixth Schedules and PESA 1996."
    },
    {
        "id": "daw-gs1-03",
        "paper": "GS1",
        "paper_name": "GS Paper 1 (Geophysical Hazards & Meteorology)",
        "marks": 10,
        "word_limit": 150,
        "time_target": "7.0 Minutes",
        "directive": "Explain",
        "syllabus_topic": "Important Geophysical phenomena such as earthquakes, Tsunami, Volcanic activity, cyclone; geographical features and their location.",
        "question": "The synoptic interaction between recurving Bay of Bengal depressions and mid-latitude Western Disturbances has increasingly triggered extreme late-monsoon hydro-meteorological hazards across the Indo-Gangetic plains. Explain the geophysical mechanism behind this phenomenon and its socio-economic impact on kharif harvesting and urban drainage.",
        "context": "Meteorological analysis of extreme late-September deluge in the Gangetic plains driven by moisture convergence from a Bay of Bengal deep depression locking with an upper-tropospheric Western Disturbance trough.",
        "source_name": "The Indian Express (Explained)",
        "source_headline": "What is causing the flood-like situation in Uttar Pradesh? Interaction of Bay of Bengal depression and Western Disturbances",
        "source_url": "https://indianexpress.com/article/explained/explained-climate/uttar-pradesh-floods-deep-depression-western-disturbance-10896406/",
        "micro_dimensions": [
            "Synoptic Convergence Mechanism: Warm moist easterly winds from Bay of Bengal low-pressure systems colliding with cold dry mid-latitude westerlies along the Himalayan foothills",
            "Orographic & Urban Amplification: Stalling of monsoon trough over Uttar Pradesh & Bihar leading to cloudburst-scale precipitation within 24–48 hours",
            "Agrarian & Urban Fallout: Waterlogging of mature paddy/pulses crops, delayed rabi sowing, and collapse of concretized tier-2 urban storm-water networks"
        ],
        "topper_benchmarks": "Include a schematic India map illustrating the recurving Bay of Bengal depression track meeting the westerly trough over the Indo-Gangetic plains.",
        "directive_guidance": "1. Approach this 'Explain' directive by elucidating the meteorological physics of synoptic collision step-by-step before linking it to downstream spatial fallout. 2. Open with a crisp geophysical thesis: explain how upper-tropospheric westerly troughs steer recurving tropical depressions northward toward the Himalayan foothills. 3. Unpack the atmospheric mechanism: moisture-laden easterly low-pressure systems colliding with cold, dry mid-latitude westerlies, creating intense convective uplift and cloudburst-scale precipitation. 4. Draw a neat synoptic schematic showing the isobaric collision zone over Uttar Pradesh, Bihar, and the Terai basin. 5. Analyze the compounding socio-economic impacts: catastrophic waterlogging of standing kharif paddy/pulses, delayed rabi sowing, and storm-drain overflow in concretized tier-2 cities. 6. Conclude with multi-tiered mitigation: Doppler radar-guided hyper-local agro-advisories, wetland restoration, and urban Sponge-City storm drainage.'s U-shaped female labor force hypothesis. 3. Group structural inhibitors under thematic subheadings: disproportionate care burden (Time Use Survey), lack of safe transit, and wage polarization. 4. Articulate targeted policy levers: universalization of institutional creches (Palna scheme), digital gig safety, and gender-responsive budgeting. 5. Include a conceptual 30-second flowchart linking female education, formal jobs, demographic dividend, and GDP expansion. 6. Conclude with a visionary forward-looking statement linking gender parity in the workforce to the realization of India's $5-trillion economy."
    },
    {
        "id": "daw-gs1-04",
        "paper": "GS1",
        "paper_name": "GS Paper 1 (Physical Geography & Agro-Climatology)",
        "marks": 15,
        "word_limit": 250,
        "time_target": "9.0 Minutes",
        "directive": "Analyze",
        "syllabus_topic": "Geographical features and their location — changes in critical geographical features (including water-bodies and ice-caps) and in flora and fauna.",
        "question": "Even during years of near-normal national southwest monsoon averages, acute intra-state spatial and temporal rainfall variability continues to induce severe agrarian distress in rain-shadow regions like Marathwada and Vidarbha. Analyze the geographical factors behind this micro-regional drought paradox and suggest agro-climatic cropping reforms.",
        "context": "Sharp spatial divergence in monsoon distribution where leeward Western Ghats rain-shadow districts suffer prolonged dry spells, hurting soybean, cotton, and tur yields.",
        "source_name": "The Indian Express (Explained)",
        "source_headline": "Behind Maharashtra drought crisis, sharp regional variation in monsoon rainfall across Marathwada and Vidarbha",
        "source_url": "https://indianexpress.com/article/explained/maharashtra-monsoon-rainfall-deficit-marathwada-vidarbha-soybean-yield-losses-tur-prices-surge-rabi-crisis-10895361/",
        "micro_dimensions": [
            "Orographic Rain-Shadow Dynamics: Adiabatic warming and moisture depletion on the leeward eastern slopes of the Sahyadris (Western Ghats)",
            "Skewed Cropping & Groundwater Depletion: Dominance of water-guzzling sugarcane and hybrid cotton in low-rainfall basaltic hard-rock aquifers",
            "Agro-Climatic Alignment: Shifting toward climate-resilient millets/pulses, micro-irrigation (PMKSY), and watershed contour bunding (Jalyukt Shivar / Paani Foundation)"
        ],
        "topper_benchmarks": "Sketch a cross-section of the Western Ghats showing windward Konkan orographic rainfall vs leeward Marathwada adiabatic rain-shadow zone.",
        "directive_guidance": "1. Approach this 'Analyze' directive by dissecting the physical orography causing the rain-shadow paradox, then evaluating anthropogenic cropping misalignments. 2. Open by distinguishing macro-monsoonal aggregates from micro-regional deficits, highlighting the vulnerability of the Deccan basaltic plateau. 3. Detail the physical geography: adiabatic warming and rapid moisture exhaustion of southwest monsoon winds descending leeward of the Sahyadri crestline. 4. Interrogate the agrarian distortion: proliferation of water-guzzling sugarcane and Bt cotton in hard-rock basaltic aquifers with low groundwater recharge. 5. Propose comprehensive agro-climatic reforms: shift to climate-smart millets (Shree Anna) and pulses, PMKSY micro-irrigation, and watershed contour bunding (Jalyukt Shivar). 6. Conclude by linking geographic carrying-capacity adherence to sustainable rural livelihoods and mitigating agrarian distress."
    },
    {
        "id": "daw-gs1-05",
        "paper": "GS1",
        "paper_name": "GS Paper 1 (Urbanization, Gender & Public Safety)",
        "marks": 10,
        "word_limit": 150,
        "time_target": "7.0 Minutes",
        "directive": "Critically examine",
        "syllabus_topic": "Role of women and women’s organization, population and associated issues, urbanization, their problems and their remedies.",
        "question": "Rapid urbanization in India has not automatically translated into gender-inclusive public spaces, directly constraining women’s mobility and Female Labour Force Participation Rate (FLFPR). Critically examine why statutory deterrence and dedicated corpora like the Nirbhaya Fund must be integrated with gender-responsive urban design and community policing.",
        "context": "Editorial audit of urban safety infrastructure, underutilization of Nirbhaya Fund allocations, and the link between safe public transit and female workforce participation.",
        "source_name": "The Indian Express (Editorial)",
        "source_headline": "From Nirbhaya to recent urban safety audits, why institutional utilization of the Nirbhaya Fund and gender-sensitive urban planning remain critical",
        "source_url": "https://indianexpress.com/article/opinion/editorials/delhi-women-safety-nirbhaya-fund-crime-10892874/",
        "micro_dimensions": [
            "Mobility-Employment Nexus: How unsafe last-mile transit, dark civic corridors, and lack of public sanitation depress urban Female Labour Force Participation (PLFS)",
            "Institutional & Fiscal Bottlenecks: Underutilization and routine diversion of Nirbhaya Fund toward hardware procurement without community-level gender sensitization",
            "Gender-Responsive Urban Design: CPTED (Crime Prevention Through Environmental Design), pink transit corridors, One-Stop Sakhi Centres, and time-bound fast-track courts"
        ],
        "topper_benchmarks": "Connect safe public mobility directly to PLFS Female Labour Force Participation Rate (FLFPR) and Justice Verma Committee recommendations.",
        "directive_guidance": "1. Approach this 'Critically examine' directive by contrasting punitive statutory measures against structural urban planning deficiencies that restrict women's spatial autonomy. 2. Open with recent PLFS data linking safe, accessible mobility to unlocking India's depressed Female Labour Force Participation Rate (FLFPR). 3. Examine limitations of punitive focus: CCTV installation and legal deterrence alone cannot fix poor last-mile transit, unlit walkways, or deficient public toilets. 4. Audit Nirbhaya Fund implementation: highlight systemic challenges in fund absorption, hardware bias, and lack of ground-level gender-sensitized transit corridors. 5. Detail gender-responsive urban design: Crime Prevention Through Environmental Design (CPTED), dedicated pink transit mobility, active street frontages, and community policing. 6. Conclude by framing gendered right-to-the-city as indispensable for achieving demographic dividend dividends and constitutional equality under Article 15.'Sponge City' urban design model that retrofits traditional percolation pits into municipal building codes."
    },
    {
        "id": "daw-gs1-06",
        "paper": "GS1",
        "paper_name": "GS Paper 1 (Economic Geography & Tribal Resource Rights)",
        "marks": 15,
        "word_limit": 250,
        "time_target": "9.0 Minutes",
        "directive": "Discuss",
        "syllabus_topic": "Social empowerment, communalism, regionalism & secularism; Distribution of key natural resources across the world (including South Asia and the Indian sub-continent).",
        "question": "Mineral-rich belts in Peninsular India disproportionately overlap with Particularly Vulnerable Tribal Group (PVTG) habitats and sacred groves. With reference to the Niyamgiri hills experience and the Forest Rights Act, 2006, discuss how Gram Sabha consent reconciles industrial resource extraction with tribal cultural survival.",
        "context": "Renewed corporate proposals for bauxite mining in Odisha’s Niyamgiri hills, revisiting the landmark 2013 Supreme Court verdict upholding Dongria Kondh Gram Sabha environmental referendums.",
        "source_name": "The Hindu (National)",
        "source_headline": "Vedanta seeks Niyamgiri mining revival, pitches ₹1 lakh crore Odisha investment amid Fifth Schedule forest rights safeguards",
        "source_url": "https://www.thehindu.com/business/vedanta-seeks-niyamgiri-mining-revival-pitches-1-lakh-crore-odisha-investment/article71512881.ece",
        "micro_dimensions": [
            "Resource Curse in Fifth Schedule Areas: Overlap of bauxite, iron ore, and coal reserves with PVTG ancestral habitats across Odisha, Jharkhand, and Chhattisgarh",
            "Constitutional & Statutory Shield: PESA Act 1996, Forest Rights Act (FRA) 2006 Section 3(1)(i) habitat rights, and the 2013 Orissa Mining Corporation (Niyamgiri) Supreme Court ruling",
            "Sustainable Co-Existence Model: Prioritizing Free, Prior and Informed Consent (FPIC), DMF (District Mineral Foundation) trust devolution, and non-destructive eco-livelihoods"
        ],
        "topper_benchmarks": "Explicitly cite Orissa Mining Corporation v. MoEF (2013 SC judgment), PESA 1996, FRA 2006 Habitat Rights of Dongria Kondhs, and Virginius Xaxa Committee.",
        "directive_guidance": "1. Approach this 'Discuss' directive by evaluating the constitutional balance between national industrial mineral demands and tribal ecological citizenship. 2. Open by illustrating the geographical overlap of mineral belts (bauxite, iron ore, coal) with Fifth Schedule areas and PVTG ancestral habitats. 3. Examine the historic Niyamgiri precedent: the 2013 Supreme Court ruling affirming Dongria Kondh Gram Sabha autonomy under the Forest Rights Act, 2006 (FRA). 4. Analyze statutory mechanisms: Free, Prior and Informed Consent (FPIC) under PESA 1996 and FRA Section 3(1)(i) habitat rights for preserving sacred groves (Niyam Raja). 5. Propose sustainable reconciliation models: participatory equity sharing, District Mineral Foundation (DMF) grassroot devolution, and non-invasive green mining. 6. Conclude by underscoring the Virginius Xaxa Committee recommendations: mineral exploitation must uphold constitutional morality and tribal self-determination.'s geological endowment: Monazite placers along the southern coast, carbonatite complexes in Gujarat/Rajasthan, and pegmatite deposits in the Himalayan belt. 4. Interrogate domestic processing constraints: absence of specialized refining metallurgy, acute environmental pollution concerns, and long gestation periods. 5. Highlight policy responses: the Mines and Minerals (Development and Regulation) Amendment Act and Deep Ocean Mission exploration. 6. Conclude by recommending downstream value-addition clusters, circular electronic-waste extraction, and international processing technology tie-ups."
    },
    {
        "id": "daw-gs2-01",
        "paper": "GS2",
        "paper_name": "GS Paper 2 (Constitutional Bodies & Electoral Governance)",
        "marks": 15,
        "word_limit": 250,
        "time_target": "9.0 Minutes",
        "directive": "Examine",
        "syllabus_topic": "Salient features of the Representation of People’s Act; Appointment to various Constitutional posts, powers, functions and responsibilities of various Constitutional Bodies.",
        "question": "Credible electoral rolls and institutional transparency are the twin pillars of Article 324 of the Constitution. In light of recent debates surrounding the Special Intensive Revision (SIR) of voter lists and Election Commission reforms, examine the procedural safeguards needed to prevent arbitrary voter disenfranchisement while ensuring clean electoral rolls.",
        "context": "The Hindu editorial analyzing the Election Commission of India’s Special Intensive Revision (SIR) of electoral rolls, voter deletion grievances, and constitutional accountability.",
        "source_name": "The Hindu (Editorial)",
        "source_headline": "In need of an overhaul: On the Election Commission of India’s institutional transparency and Special Intensive Revision (SIR) of electoral rolls",
        "source_url": "https://www.thehindu.com/opinion/editorial/in-need-of-an-overhaul-on-the-election-commission-of-indias-press-note/article71516004.ece",
        "micro_dimensions": [
            "Constitutional Mandate (Articles 324 & 326): Universal adult suffrage as a constitutional right (PUDR & Lal Babu Hussein Supreme Court rulings against summary deletion)",
            "Vulnerabilities in Summary & Intensive Revisions: Migrant workers, marginalized voters, and algorithmic deduplication errors leading to exclusion without individual notice",
            "Institutional Safeguards: Statutory due-process hearing under Registration of Electors Rules 1960, bipartisan Selection Committee parity (Anoop Baranwal case), and social audit of rolls"
        ],
        "topper_benchmarks": "Anchor your answer in Article 324, Article 326, Lal Babu Hussein v. Electoral Registration Officer (1995 SC), and Anoop Baranwal v. Union of India (2023).",
        "directive_guidance": "1. Approach this 'Examine' directive by scrutinizing procedural vulnerabilities in voter deletion against constitutional guarantees of universal adult suffrage under Article 326. 2. Open by anchoring the Election Commission’s mandate under Article 324 to conduct free, fair elections grounded in clean, indisputable electoral rolls. 3. Detail systemic risks in summary and intensive revisions: algorithmic deduplication errors, unserved notices to migrant/slum dwellers, and lack of transparent hearing. 4. Examine landmark judicial benchmarks: Lal Babu Hussein (1995) establishing that citizenship and franchise cannot be extinguished without strict quasi-judicial due process. 5. Detail institutional safeguards: transparent draft-roll display, mandatory physical verification before deletion under Registration of Electors Rules 1960, and social audits. 6. Conclude by citing Anoop Baranwal (2023): an independent, transparent Election Commission is the indispensable bulwark of democratic legitimacy.'s conception of the Governor as a constitutional sentinel, not a parallel executive. 3. Examine operational realities: bill withholding, indefinite pocket vetoes, and their infringement upon legislative sovereignty. 4. Review judicial guardrails, emphasizing the Supreme Court mandate that 'as soon as possible' implies urgent constitutional dispatch. 5. Enrich your answer with landmark citations: Shamsher Singh (1974), Nabam Rebia (2016), and Sarkaria Commission guidelines. 6. Conclude with a synthesized reform blueprint recommending statutory timelines for bill assent and codification of Punchhi Commission rules."
    },
    {
        "id": "daw-gs2-02",
        "paper": "GS2",
        "paper_name": "GS Paper 2 (Transparency, RTI & Data Privacy)",
        "marks": 15,
        "word_limit": 250,
        "time_target": "9.0 Minutes",
        "directive": "Critically analyze",
        "syllabus_topic": "Important aspects of governance, transparency and accountability, e-governance-applications, models, successes, limitations, and potential; citizens charters.",
        "question": "The amendment to Section 8(1)(j) of the Right to Information Act, 2005 through the Digital Personal Data Protection (DPDP) Act, 2023 has replaced the public-interest override with a blanket exemption for personal information. Critically analyze whether this shift tilts the constitutional balance away from citizen-led transparency toward administrative opacity.",
        "context": "Lead op-ed in The Hindu examining how Section 44(3) of the DPDP Act 2023 removed the Section 8(1)(j) public-interest proviso from the RTI Act 2005.",
        "source_name": "The Hindu (Lead Op-Ed)",
        "source_headline": "The RTI’s shift to a ‘right to deny information’: Assessing Section 44(3) of the DPDP Act and dilution of Section 8(1)(j) of the RTI Act",
        "source_url": "https://www.thehindu.com/opinion/lead/the-rtis-shift-to-a-right-to-deny-information/article70042967.ece",
        "micro_dimensions": [
            "Pre-2023 Harmonious Balance: Section 8(1)(j) allowed disclosure of personal data if larger public interest justified it or if the information could not be denied to Parliament/State Legislature",
            "Impact of Section 44(3) DPDP Act: Blanket exemption of \"personal information\" enables public officials to shield muster rolls, tender records, and asset audits behind privacy claims",
            "Constitutional Reconciliation: Applying Justice K.S. Puttaswamy (2017) proportionality test and Justice B.N. Srikrishna Committee recommendation to restore the public-interest override"
        ],
        "topper_benchmarks": "Contrast Article 19(1)(a) (Right to Know — Raj Narain & S.P. Gupta cases) with Article 21 (Puttaswamy Proportionality Test) and cite Section 44(3) of DPDP Act 2023.",
        "directive_guidance": "1. Approach this 'Critically analyze' directive by conducting a dialectical assessment balancing Article 19(1)(a) (Right to Know) against Article 21 (Informational Privacy). 2. Open by contrasting pre-2023 Section 8(1)(j)—which safeguarded disclosure where larger public interest prevailed—with Section 44(3) of DPDP Act 2023. 3. Detail transparency concerns: how blanket personal data exemptions shield public expenditure, muster rolls, civil service assets, and tender beneficiary audits. 4. Present the counter-perspective: genuine protection against doxxing, identity theft, and corporate harassment of public functionaries. 5. Apply the Puttaswamy (2017) four-fold proportionality test (Legality, Legitimate State Aim, Proportionality, Procedural Safeguards) and Srikrishna Committee norms. 6. Conclude by recommending a legislative amendment restoring the public-interest proviso to prevent privacy laws from becoming an administrative veil.'workhorses of the legislature'. 3. Chart the empirical decline using precise PRS data (from 71% in the 15th Lok Sabha to under 16% in the 17th Lok Sabha). 4. Unpack qualitative impacts: loss of in-camera non-partisan deliberation, exclusion of civil society inputs, and subsequent judicial pushback. 5. Propose structural solutions: mandatory referral of all substantive legislation as in the British House of Commons, and public deposition rules. 6. Conclude with a forward-looking argument that robust committee scrutiny is an indispensable prerequisite for enduring constitutional democracy."
    },
    {
        "id": "daw-gs2-03",
        "paper": "GS2",
        "paper_name": "GS Paper 2 (Electoral Reforms & Political Finance)",
        "marks": 15,
        "word_limit": 250,
        "time_target": "9.0 Minutes",
        "directive": "Discuss",
        "syllabus_topic": "Salient features of the Representation of People’s Act; Structure, organization and functioning of the Executive and the Judiciary.",
        "question": "Following the Supreme Court’s invalidation of the Electoral Bonds scheme, the challenge of regulating anonymous cash donations and opaque political party expenditure remains unresolved. Discuss the structural reforms required in the Representation of the People Act, 1951 to enforce real-time financial audit and the voter’s right to know under Article 19(1)(a).",
        "context": "Analysis in The Hindu on opaque political funding channels, electoral trusts, cash donations below ₹20,000, and statutory scrutiny of candidate Form 26 affidavits.",
        "source_name": "The Hindu (Lead Op-Ed)",
        "source_headline": "The murky world of political party finance and the statutory mandate of candidate disclosures under Form 26",
        "source_url": "https://www.thehindu.com/opinion/lead/the-murky-world-of-political-party-finance/article71504827.ece",
        "micro_dimensions": [
            "Post-Electoral Bonds Vacuum: Persistence of split cash contributions below threshold limits, shell electoral trusts, and unregulated third-party digital campaigning",
            "Constitutional Jurisprudence: Association for Democratic Reforms (ADR v. Union of India, 2024) affirming voter’s fundamental right to financial transparency under Article 19(1)(a)",
            "Institutional Reform Blueprint: Indrajit Gupta Committee (state funding in kind), Law Commission 255th Report, CAG-empaneled audit of political parties, and strict ceilings on party expenditure"
        ],
        "topper_benchmarks": "Cite ADR v. Union of India (2024 Electoral Bonds Verdict), Section 29C of RPA 1951, Indrajit Gupta Committee (1998), and 255th Law Commission Report.",
        "directive_guidance": "1. Approach this 'Discuss' directive by evaluating post-Electoral Bonds political finance avenues across disclosure, audit, and expenditure limits. 2. Open with the landmark ADR v. Union of India (2024) ruling establishing that financial transparency in political funding is integral to Article 19(1)(a). 3. Detail the persistence of opacity: sub-₹20,000 cash donation fragmentation under Section 29C RPA, opaque electoral trusts, and surrogate social media campaign spends. 4. Interrogate regulatory asymmetry: stringent spending ceilings on individual candidates versus zero legal caps on registered political parties. 5. Detail structural reforms: lowering cash donation limits to zero, mandatory CAG-empaneled third-party audits, and Indrajit Gupta Committee state funding in kind. 6. Conclude by linking political finance transparency to eliminating cronyism and leveling the electoral playing field in Indian democracy.'s obligation to ensure quality education against constitutional minority autonomy. 2. Frame the delicate interplay between Article 21A (Right to Education) and Article 30(1) in your introduction. 3. Substantiate legitimate regulatory interests: modernizing curriculum, securing child rights, and enforcing teacher competence. 4. Interrogate the constitutional threshold where state standardization risks extinguishing institutional autonomy or cultural ethos. 5. Cite pivotal landmark jurisprudence: T.M.A. Pai Foundation (2002), P.A. Inamdar (2005), and recent Supreme Court verdicts on state education boards. 6. Conclude with a synthesized Way Forward advocating constructive dual-track models that blend modern science-math education with cultural heritage preservation."
    },
    {
        "id": "daw-gs2-04",
        "paper": "GS2",
        "paper_name": "GS Paper 2 (Civil Society, NGOs & FCRA Regulation)",
        "marks": 10,
        "word_limit": 150,
        "time_target": "7.0 Minutes",
        "directive": "Examine",
        "syllabus_topic": "Development processes and the development industry — the role of NGOs, SHGs, various groups and associations, donors, charities, institutional and other stakeholders.",
        "question": "Non-Governmental Organizations (NGOs) act as vital intermediaries in last-mile social welfare delivery, yet stringent regulatory tightening under FCRA and shifting domestic CSR patterns have placed the voluntary sector at a funding crossroads. Examine how the state can ensure national security compliance without stifling grassroot developmental civil society.",
        "context": "The Hindu Lead article analyzing the contraction of FCRA licenses, concentration of corporate CSR funds in metropolitan districts, and the impact on rural grassroot NGOs.",
        "source_name": "The Hindu (Lead Op-Ed)",
        "source_headline": "India’s NGOs at a new funding crossroads: Balancing regulatory compliance with last-mile developmental delivery",
        "source_url": "https://www.thehindu.com/opinion/lead/indias-ngos-at-a-new-funding-crossroads/article71488462.ece",
        "micro_dimensions": [
            "Developmental Contribution: Last-mile healthcare, tribal education, legal aid, and social audit innovations (MKSS, ASER) supplementing state capacity",
            "Twin Fiscal Squeeze: FCRA 2020 restrictions (prohibition on sub-granting, mandatory SBI New Delhi branch account, 20% administrative cap) coupled with corporate CSR favoring their own foundations",
            "Constructive Partnership Framework: Vijay Kumar Committee recommendations—light-touch risk-based regulation, streamlined DARPAN single-window registration, and social stock exchange mobilization"
        ],
        "topper_benchmarks": "Reference FCRA 2020 amendments (Noel Harper v. Union of India 2022), Vijay Kumar Committee on NGO Accreditation, and SEBI’s Social Stock Exchange (SSE).",
        "directive_guidance": "1. Approach this 'Examine' directive by investigating the dual imperatives of safeguarding national financial integrity and enabling community-level civil society. 2. Open by acknowledging the voluntary sector's indispensable role in tribal welfare, public health, and social accountability (MKSS, ASER). 3. Detail regulatory friction points under FCRA 2020: 20% administrative expense cap, ban on sub-granting to grassroot NGOs, and mandatory centralized SBI New Delhi accounts. 4. Analyze state security concerns substantiated in Noel Harper (2022): preventing illicit foreign funding, religious conversions, and anti-development lobbying. 5. Propose a balanced partnership framework: risk-based tiered compliance (Vijay Kumar Committee), SEBI Social Stock Exchange mobilization, and CSR democratization. 6. Conclude with a synthesized vision: robust national security oversight must complement, not throttle, an active and autonomous democratic civil society."
    },
    {
        "id": "daw-gs2-05",
        "paper": "GS2",
        "paper_name": "GS Paper 2 (India's Foreign Policy & Multilateralism)'s Foreign Policy & Geopolitics)",
        "marks": 15,
        "word_limit": 250,
        "time_target": "9.0 Minutes",
        "directive": "Examine",
        "syllabus_topic": "Bilateral, regional and global groupings and agreements involving India and/or affecting India’s interests.",
        "question": "As traditional Bretton Woods and UN institutions suffer from representation deficits, an expanded BRICS+ has emerged as an alternative platform for \"plausible multilateralism\". Examine how India can leverage BRICS+ to champion Global South developmental finance while safeguarding its strategic autonomy against anti-Western bloc politics.",
        "context": "The Hindu Lead op-ed evaluating India’s diplomatic balancing within an expanded 10-member BRICS+ grouping amidst US-China-Russia geopolitical polarization.",
        "source_name": "The Hindu (Lead Op-Ed)",
        "source_headline": "India and the plausible multilateralism of an expanded BRICS+ in a fragmented world order",
        "source_url": "https://www.thehindu.com/opinion/lead/india-and-the-plausible-multilateralism-of-brics/article71500715.ece",
        "micro_dimensions": [
            "Case for Plausible Multilateralism: IMF/World Bank quota stagnation, weaponization of global payment corridors, and New Development Bank (NDB) local-currency financing",
            "Strategic Tensions Inside BRICS+: Navigating China-Russia attempts to turn BRICS+ into an anti-G7 geopolitical bloc vs India-Brazil-UAE preference for non-aligned economic multipolarity",
            "India’s Diplomatic Imperative: Utilizing BRICS+ for Digital Public Infrastructure (DPI) export, resilient supply chains, and UNSC reform while preserving Quad and Indo-Pacific partnerships"
        ],
        "topper_benchmarks": "Contrast \"Non-Western\" (India’s constructive multipolarity) with \"Anti-Western\" (China-Russia revisionism) and highlight the New Development Bank (NDB) and Voice of Global South.",
        "directive_guidance": "1. Approach this 'Examine' directive by probing India's multi-alignment strategy inside BRICS+ balancing Global South developmental advocacy with non-bloc autonomy. 2. Open with an introduction defining 'plausible multilateralism' in the context of frozen IMF/World Bank quotas and weaponized global payment systems. 3. Detail economic leverage points: capitalizing on the New Development Bank (NDB), promoting national currency settlements, and exporting Digital Public Infrastructure (DPI). 4. Interrogate geopolitical friction: resisting attempts to turn BRICS+ into an anti-Western axis, while maintaining robust Quad, I2U2, and Western technology partnerships. 5. Contrast India’s 'Non-Western' bridge-builder posture against revisionist 'Anti-Western' postures, emphasizing the Voice of the Global South Summit. 6. Conclude with S. Jaishankar’s 'The India Way': leveraging multi-alignment to secure strategic autonomy, energy corridors, and multipolar balance.'s doctrine in 'The India Way' on managing multiple diplomatic partnerships. 3. Analyze the maritime pillar: deepening defense interoperability and technology transfer with the Quad in the Indo-Pacific. 4. Analyze the continental-Eurasian pillar: safeguarding Eurasian energy corridors and championing Global South concerns within BRICS and SCO. 5. Include a clean 2x2 matrix contrasting maritime security imperatives (Quad) with multipolar economic restructuring (BRICS). 6. Conclude by affirming that multi-alignment maximizes national strategic autonomy while establishing India as a bridging power (Vishwa Mitra)."
    },
    {
        "id": "daw-gs2-06",
        "paper": "GS2",
        "paper_name": "GS Paper 2 (International Institutions & UN Security Council Reforms)",
        "marks": 15,
        "word_limit": 250,
        "time_target": "9.0 Minutes",
        "directive": "Critically evaluate",
        "syllabus_topic": "Important International institutions, agencies and fora — their structure, mandate.",
        "question": "At its 81st General Assembly session, the United Nations appears institutionally \"overweight in mandates yet weak in enforcement\" amidst escalating West Asian and Eurasian conflicts. Critically evaluate the structural bottlenecks paralyzing the UN Security Council and assess India’s case for text-based Intergovernmental Negotiations (IGN) reform.",
        "context": "Editorial in The Hindu on the paralysis of the UN Security Council during the 81st UNGA session and the urgent imperative for G4-led structural reform.",
        "source_name": "The Hindu (Editorial)",
        "source_headline": "Overweight and weak: On the United Nations, the 81st session of the UN General Assembly, and the crisis of multilateral conflict resolution",
        "source_url": "https://www.thehindu.com/opinion/editorial/overweight-and-weak-on-the-un-the-81st-session-of-the-un-general-assembly/article71508880.ece",
        "micro_dimensions": [
            "Institutional Paralysis of UNSC: P5 veto weaponization under Chapter VII, anachronistic 1945 geopolitical composition excluding Africa and Latin America, and funding arrears",
            "Overweight Bureaucracy vs Weak Peacekeeping: Fragmentation of UN agencies without enforcement teeth against unilateral sanctions and cross-border aggression",
            "India & G4 Reform Roadmap: Transitioning from open-ended IGN discussions to time-bound Text-Based Negotiations, expansion of Permanent & Non-Permanent seats, and revitalizing UNGA (Uniting for Peace)"
        ],
        "topper_benchmarks": "Cite the 81st UNGA Session, UN Charter Chapter VII veto gridlock, G4 Nations + L.69 Group, and Ezulwini Consensus.",
        "directive_guidance": "1. Approach this 'Critically evaluate' directive by judging UNSC multilateral paralysis against Charter principles, followed by evaluating India's G4 reform pathway. 2. Open by assessing the 81st UNGA session amidst simultaneous conflicts in Ukraine and West Asia, illustrating the complete neutralization of Chapter VII enforcement. 3. Detail core structural bottlenecks: P5 veto weaponization, anachronistic 1945 geopolitical representation excluding Africa and Latin America, and financial arrears. 4. Interrogate the procedural roadblock: perpetual open-ended Intergovernmental Negotiations (IGN) without single, time-bound Text-Based Negotiations (TBN). 5. Substantiate India's permanent seat legitimacy: world's most populous nation, 5th largest economy, largest UN Peacekeeping troop contributor, and Voice of Global South. 6. Conclude by warning that failure to reform the Security Council risks rendering the UN obsolete, akin to the historical fate of the League of Nations.'3Fs' failure: limited devolution of 29 Eleventh Schedule subjects, acute staff shortages, and tied fund rigidities. 4. Interrogate the sociocultural distortion of proxy governance ('Sarpanch Pati') and examine its negation of substantive empowerment. 5. Highlight fiscal vulnerabilities using RBI empirical findings: overwhelming reliance on union/state grants and near-zero local property tax collection. 6. Conclude with a decisive reform agenda: mandatory biometric meetings, independent women-only Gram Sabhas, and incentive-linked devolution indices."
    },
    {
        "id": "daw-gs3-01",
        "paper": "GS3",
        "paper_name": "GS Paper 3 (Manufacturing, Industrial Policy & Employment)",
        "marks": 15,
        "word_limit": 250,
        "time_target": "9.0 Minutes",
        "directive": "Critically analyze",
        "syllabus_topic": "Indian Economy and issues relating to planning, mobilization of resources, growth, development and employment; Effects of liberalization on the economy, changes in industrial policy.",
        "question": "Despite over a decade of \"Make in India\" and Production-Linked Incentive (PLI) schemes, manufacturing’s share in India’s GDP has remained stagnant around 15–17% with low employment elasticity. Critically analyze the structural bottlenecks in domestic value addition, R&D intensity, and MSME credit that must be resolved to achieve manufacturing-led growth.",
        "context": "Comprehensive data review in The Hindu evaluating 12 years of Make in India across manufacturing GVA share, merchandise exports, R&D spend, and labor-intensive job creation.",
        "source_name": "The Hindu (Economy)",
        "source_headline": "12 years of ‘Make in India’ in 12 metrics: Assessing manufacturing share in GDP, employment elasticity, and global value chain integration",
        "source_url": "https://www.thehindu.com/business/Economy/12-years-of-make-in-india-in-12-metrics-low-and-patchy-impact-on-growth-employment-global-share/article71505448.ece",
        "micro_dimensions": [
            "Empirical Performance Audit: Success in mobile/electronics assembly and defense indigenization vs stagnation of overall manufacturing GVA (~16%) and premature deindustrialization",
            "Core Structural Deficits: Screw-driver assembly with high import intensity, inverted duty structures, low private R&D (<0.7% of GDP), and regulatory dwarfism of MSMEs (Economic Survey)",
            "Next-Gen Industrial Strategy: Linking PLI subsidies to domestic component ecosystems, labor-intensive clusters (textiles, footwear, toys), ANRF deep-tech commercialization, and factor-market reforms"
        ],
        "topper_benchmarks": "Cite the 12-year Make in India telemetry (Manufacturing GVA ~16%, Global export share ~1.8%, R&D 0.64% of GDP) and Economic Survey’s \"Missing Middle\" MSME critique.",
        "directive_guidance": "1. Approach this 'Critically analyze' directive by contrasting headline manufacturing achievements against persistent macroeconomic structural deficits. 2. Open with empirical telemetry: 12 years of Make in India with manufacturing GVA stagnant at ~16% and global merchandise export share hovering around 1.8%. 3. Analyze success vs shortfall: high-tech assembly gains in smartphones and defense indigenization contrasted with shallow domestic value addition and screwdriver assembly. 4. Interrogate structural bottlenecks: dismal industrial R&D spend (<0.7% of GDP), inverted duty structures, and the 'missing middle' dwarfism of credit-starved MSMEs. 5. Detail targeted policy correctives: linking PLI incentives to local component depth, factor market deregulation (land, logistics), and ANRF research tie-ups. 6. Conclude with a decisive roadmap: industrial policy must pivot toward labor-intensive manufacturing (textiles, electronics components) to harness demographic dividend."
    },
    {
        "id": "daw-gs3-02",
        "paper": "GS3",
        "paper_name": "GS Paper 3 (Digital Public Infrastructure & Fintech Sustainability)",
        "marks": 15,
        "word_limit": 250,
        "time_target": "9.0 Minutes",
        "directive": "Discuss",
        "syllabus_topic": "Indian Economy and issues relating to mobilization of resources; Science and Technology — developments and their applications and effects in everyday life.",
        "question": "India’s Unified Payments Interface (UPI) has become a global benchmark for Digital Public Infrastructure (DPI), yet the \"zero-MDR\" mandate creates a fiscal and infrastructural sustainability paradox for payment service providers and banks. Discuss policy pathways to sustain digital payment infrastructure without slowing grassroot financial inclusion.",
        "context": "Deliberations between the Finance Ministry, RBI, and banks on budgetary Viability Gap Funding vs tiered Merchant Discount Rate (MDR) for large merchants on UPI.",
        "source_name": "The Hindu (Economy)",
        "source_headline": "Government and banks to decide subsidy architecture for UPI as transaction volumes scale and Merchant Discount Rate (MDR) debates intensify",
        "source_url": "https://www.thehindu.com/business/Economy/government-and-banks-to-decide-subsidy-amount-for-upi-that-will-continue-after-mdr-comes-in/article71507443.ece",
        "micro_dimensions": [
            "Scale vs Revenue Asymmetry: UPI processes over 14+ billion monthly transactions, but the 2020 Zero-MDR mandate eliminated direct cost recovery for core banking servers and cyber fraud filters",
            "Systemic Risks of Under-Investment: Technical outages, concentration duopoly among third-party apps (TPAPs), and dwindling budgetary compensation relative to exponential volume growth",
            "Tiered Sustainability Blueprint: Keeping peer-to-peer (P2P) and small Kirana merchants (up to ₹2,000) 100% free while introducing a nominal 0.15–0.25% MDR for affluent/large institutional merchants and monetizing UPI credit lines"
        ],
        "topper_benchmarks": "Reference NPCI’s 30% market-cap guideline, RBI’s Discussion Paper on Charges in Payment Systems, and tiered MDR differentiation between MSMEs and large corporate merchants.",
        "directive_guidance": "1. Approach this 'Discuss' directive by balancing the public-good nature of digital inclusion with the operational solvency of payment service providers and banks. 2. Open with the scale of India's DPI: UPI clocking 14+ billion monthly transactions as an undisputed global public good for financial democratization. 3. Detail the sustainability paradox: the 2020 Zero-MDR mandate eliminates revenue for maintaining core banking servers, fraud detection, and cybersecurity filters. 4. Interrogate systemic market concentration risks: duopoly of foreign-backed TPAPs (PhonePe, Google Pay) and dwindling budgetary compensation subsidies. 5. Propose a tiered sustainability blueprint: protect small merchants (up to ₹2,000) and P2P transfers with 0% MDR while introducing a nominal tiered MDR on large institutional corporations. 6. Conclude by emphasizing NPCI 30% market cap guidelines and RBI payment charges recommendations to ensure an enduring, self-sustaining DPI ecosystem."
    },
    {
        "id": "daw-gs3-03",
        "paper": "GS3",
        "paper_name": "GS Paper 3 (Sustainable Finance, Blue Economy & Maritime Resilience)",
        "marks": 15,
        "word_limit": 250,
        "time_target": "9.0 Minutes",
        "directive": "Explain",
        "syllabus_topic": "Conservation, environmental pollution and degradation; Infrastructure: Energy, Ports, Roads, Airports, Railways.",
        "question": "What are \"Blue Bonds\"? Explain how sovereign and corporate Blue Bonds under SEBI’s sustainable finance framework can mobilize long-term capital for India’s Maritime Amrit Kaal Vision 2047, green ports, and coastal climate resilience.",
        "context": "The Hindu Economy feature on SEBI’s Blue Bond framework to unlock blended institutional finance for India’s 7,516-km coastline and Blue Economy.",
        "source_name": "The Hindu (Economy)",
        "source_headline": "Blue bonds: India’s new ocean of sustainable finance for coastal infrastructure, green shipping, and marine biodiversity",
        "source_url": "https://www.thehindu.com/business/Economy/blue-bonds-indias-new-ocean-of-finance/article71502859.ece",
        "micro_dimensions": [
            "Conceptual Definition: Debt instruments issued by governments, development banks, or corporations strictly ring-fenced to finance marine conservation, sustainable fisheries, and decarbonized shipping",
            "Strategic Alignment with India’s Blue Economy: Financing Sagarmala 2.0, Green Hydrogen bunkering at major ports, offshore wind corridors (Gujarat & Tamil Nadu), and mangrove restoration (MISHTI scheme)",
            "De-Risking & Governance Safeguards: Avoiding \"blue-washing\" through SEBI’s Green/Blue Debt Securities taxonomy, third-party oceanic impact verification, and multilateral credit guarantees"
        ],
        "topper_benchmarks": "Connect SEBI’s Blue Bond circular directly to Maritime Amrit Kaal Vision 2047, MISHTI mangrove initiative, and PM Matsya Sampada Yojana.",
        "directive_guidance": "1. Approach this 'Explain' directive by clarifying the financial architecture of Blue Bonds before detailing their strategic application across maritime sectors. 2. Open with a crisp definition: Blue Bonds as debt instruments ring-fenced specifically to finance marine conservation, sustainable fisheries, and ocean infrastructure. 3. Detail SEBI's regulatory framework: Green and Blue Debt Securities taxonomy, disclosure safeguards, and independent third-party impact auditing. 4. Map strategic maritime deployment: funding Maritime Amrit Kaal Vision 2047, Green Hydrogen bunkering at major ports, offshore wind corridors, and MISHTI mangrove bio-shields. 5. Address market challenges: preventing 'blue-washing', deepening secondary bond liquidity, and utilizing multilateral credit de-risking guarantees. 6. Conclude by highlighting that ocean finance is vital for transforming India's 7,516-km coastline into an engine of sustainable economic growth and climate resilience."
    },
    {
        "id": "daw-gs3-04",
        "paper": "GS3",
        "paper_name": "GS Paper 3 (Environmental Governance, Western Ghats & Disaster Resilience)",
        "marks": 15,
        "word_limit": 250,
        "time_target": "9.0 Minutes",
        "directive": "Examine",
        "syllabus_topic": "Conservation, environmental pollution and degradation, environmental impact assessment; Disaster and disaster management.",
        "question": "A decade after the Gadgil and Kasturirangan committee reports, the notification of Eco-Sensitive Areas (ESAs) in the Western Ghats remains deadlocked due to state-level developmental apprehensions, even as catastrophic landslides intensify. Examine how cooperative ecological federalism and Payment for Ecosystem Services (PES) can break this impasse.",
        "context": "The Hindu editorial critiquing the prolonged delay and six lapsed draft notifications for demarcating 56,825 sq km of Western Ghats Eco-Sensitive Areas following the Wayanad and Shirur landslides.",
        "source_name": "The Hindu (Editorial)",
        "source_headline": "Narrowed posture: On Karnataka’s rejection of the Kasturirangan Report and the imperative of notifying Western Ghats Eco-Sensitive Areas",
        "source_url": "https://www.thehindu.com/opinion/editorial/narrowed-posture-on-karnataka-and-the-kasturirangan-report/article71508916.ece",
        "micro_dimensions": [
            "The Gadgil vs Kasturirangan Continuum: Gadgil (WGEEP) recommended 64% ESA with bottom-up Gram Sabha zoning; Kasturirangan diluted it to 37% (56,825 sq km) banning only red-category mining/quarrying/thermal plants",
            "Political Economy of State Resistance: Fear of restricting linear infrastructure, plantations, and real estate vs escalating human cost of slope destabilization (Wayanad, Kodagu, Idukki)",
            "Cooperative Ecological Federalism: 16th Finance Commission forest-ecology tax weightage, Green Bonus / Payment for Ecosystem Services (PES) to hill panchayats, and satellite-assisted micro-zonation"
        ],
        "topper_benchmarks": "Draw a comparative table of Gadgil Committee (64% ESA) vs Kasturirangan Committee (37% ESA) and propose a 16th Finance Commission \"Ecological Fiscal Transfer\" mechanism.",
        "directive_guidance": "1. Approach this 'Examine' directive by diagnosing the political economy of state resistance against Western Ghats ESA notifications amidst escalating ecological disasters. 2. Open by contrasting the Gadgil Committee's 64% ESA recommendation (Gram Sabha-led) with Kasturirangan's 37% ESA compromise (red-category bans). 3. Detail the cost of inaction: recurring catastrophic landslides in Wayanad, Shirur, and Kodagu exacerbated by slope cutting, quarrying, and mono-plantations. 4. Interrogate state developmental apprehensions: fear of curbing linear infrastructure, revenue loss, and displacement anxieties of hill farming communities. 5. Propose an ecological federalism blueprint: 16th Finance Commission ecological tax devolution weightage, Green Bonus to hill panchayats, and Payment for Ecosystem Services (PES). 6. Conclude with an actionable synthesis: participatory micro-zonation and local community livelihood guarantees can convert ecological conservation from a burden into an economic asset.'s Bhavantar scheme) and universalized direct income transfers (PM-KISAN). 6. Conclude by recommending a structured transition towards climate-resilient crop diversification backed by cold-chain logistics and FPO empowerment."
    },
    {
        "id": "daw-gs3-05",
        "paper": "GS3",
        "paper_name": "GS Paper 3 (Disaster Management, Early Warning Systems & AI)",
        "marks": 10,
        "word_limit": 150,
        "time_target": "7.0 Minutes",
        "directive": "Discuss",
        "syllabus_topic": "Disaster and disaster management; Science and Technology — developments and their applications and effects in everyday life.",
        "question": "Traditional relief-centric disaster management is increasingly inadequate against compound climate extremes in the Himalayan and riverine basins. Discuss how Artificial Intelligence (AI)-driven hydrological forecasting, transboundary data sharing, and cell-broadcast early warning systems can shift India toward zero-casualty anticipatory disaster governance.",
        "context": "Indian Express Explained analysis on the deployment of AI flood forecasting models (Google Flood Hub, CWC FloodWatch, InSAR landslide monitoring) across India and Nepal.",
        "source_name": "The Indian Express (Explained)",
        "source_headline": "From Nepal to India, how Artificial Intelligence and satellite hydrological models are transforming flood and landslide disaster management",
        "source_url": "https://indianexpress.com/article/explained/explained-ai/disaster-management-india-nepal-using-artificial-intelligence-10896719/",
        "micro_dimensions": [
            "Predictive Leap via AI & Remote Sensing: Machine-learning rainfall-runoff models predicting river surges 5–7 days in advance and LiDAR/InSAR radar detecting millimeter-scale slope creep in Glacial Lakes (GLOFs)",
            "Transboundary & Last-Mile Bottlenecks: Gaps in real-time hydromet telemetry sharing across Himalayan upper-riparian neighbors and language/literacy barriers in village-level evacuation warnings",
            "Sendai Framework & NDMA Integration: Coupling AI dynamic inundation maps with Cell-Broadcast Common Alerting Protocol (Sachet), structural embankment audits, and community Apada Mitra drills"
        ],
        "topper_benchmarks": "Reference NDMA’s Common Alerting Protocol (CAP / Sachet), CWC FloodWatch AI, Sendai Framework Priority 4, and PM’s 10-Point Agenda on Disaster Risk Reduction.",
        "directive_guidance": "1. Approach this 'Discuss' directive by exploring the paradigm shift from post-disaster relief to AI-driven anticipatory early action under the Sendai Framework. 2. Open by highlighting escalating compound disasters in the Himalayan and riverine basins (GLOFs, cloudbursts, flash floods) overwhelming manual gauge networks. 3. Detail predictive technological leaps: AI-powered machine learning hydrological models (CWC FloodWatch, Google Flood Hub) providing 5-7 days advance surge predictions. 4. Address the transboundary telemetry bottleneck: urgency of real-time hydromet data-sharing pacts across upper-riparian Himalayan neighbors (Nepal, Bhutan, China). 5. Unpack last-mile dissemination: NDMA's Common Alerting Protocol (CAP / Sachet) utilizing geo-targeted cell-broadcasts overriding language barriers. 6. Conclude by aligning with the PM's 10-Point Agenda on DRR and Sendai Priority 4 to institutionalize proactive, community-based zero-casualty governance."
    },
    {
        "id": "daw-gs3-06",
        "paper": "GS3",
        "paper_name": "GS Paper 3 (Cyber Security, Critical Infrastructure & AI Governance)",
        "marks": 15,
        "word_limit": 250,
        "time_target": "9.0 Minutes",
        "directive": "Examine",
        "syllabus_topic": "Challenges to internal security through communication networks, role of media and social networking sites in internal security challenges, basics of cyber security.",
        "question": "As autonomous Artificial Intelligence (AI) agents are increasingly integrated into public governance, banking, and power grids, relying solely on voluntary self-regulation by global tech corporations poses severe national security risks. Examine the need for sovereign AI safety audits, red-teaming mandates, and statutory guardrails in India.",
        "context": "Indian Express editorial warning against unvetted deployment of foreign proprietary AI agents in critical governmental, financial, and defense workflows.",
        "source_name": "The Indian Express (Editorial)",
        "source_headline": "AI safety cannot be left to Silicon Valley: Securing government systems and critical infrastructure against autonomous AI security risks",
        "source_url": "https://indianexpress.com/article/opinion/editorials/ai-agents-government-systems-security-risks-10896625/",
        "micro_dimensions": [
            "Threat Vector of Autonomous AI Agents: Prompt-injection exploits, algorithmic backdoors in critical information infrastructure (NCIIPC), deepfake cognitive warfare, and sovereign data exfiltration",
            "Failure of Big-Tech Self-Regulation: Commercial racing dynamics in Silicon Valley repeatedly sideline safety guardrails and local regulatory compliance",
            "Sovereign AI Security Architecture: Establishing an empowered Indian AI Safety Institute (AISI), mandatory algorithmic Red-Teaming before deployment in CII, sovereign foundational models (IndiaAI Mission), and Digital India Act statutory liability"
        ],
        "topper_benchmarks": "Cite the IndiaAI Mission (₹10,372 Cr), NCIIPC (Section 70A IT Act), Bletchley/Seoul AI Safety Declarations, and mandatory pre-deployment algorithmic Red-Teaming.",
        "directive_guidance": "1. Approach this 'Examine' directive by probing beneath commercial self-regulation claims to uncover structural national security vulnerabilities posed by autonomous AI agents. 2. Open by defining autonomous AI agents (goal-directed agency, autonomous API calling) and benchmark against Critical Information Infrastructure (Section 70A IT Act). 3. Detail systemic threat vectors: algorithmic prompt-injection, autonomous data exfiltration, single-point model dependencies, and SCADA industrial manipulation. 4. Interrogate Big-Tech self-regulation failures: commercial racing dynamics prioritizing deployment speed over safety, proprietary model opacity, and lack of sovereign jurisdiction. 5. Detail sovereign institutional mechanisms: establishing an Indian AI Safety Institute (AISI), statutory pre-deployment Red-Teaming under NCIIPC, and Digital India Act liabilities. 6. Conclude by linking sovereign AI safety audits to strategic autonomy, the IndiaAI Mission (₹10,372 Cr), and safeguarding democratic digital resilience.'Examine' directive by probing beneath commercial claims of self-regulation to uncover structural national security vulnerabilities posed by autonomous AI agents in critical infrastructure. 2. Open with an introduction defining autonomous AI agents (algorithmic agency, autonomous multi-step execution) and benchmark against Critical Information Infrastructure (CII under Section 70A IT Act). 3. Detail the threat vectors: prompt-injection exploits, autonomous data exfiltration, backdoors in defense/banking grids, and systemic single-point dependencies. 4. Interrogate Big-Tech self-regulation failures: commercial racing dynamics that deprioritize safety, lack of sovereign jurisdiction, and opacity of proprietary foreign foundational models. 5. Examine institutional sovereign solutions: establishing an Indian AI Safety Institute (AISI), statutory pre-deployment Red-Teaming mandates, and Digital India Act compliance. 6. Conclude by linking sovereign AI safety to strategic autonomy, the IndiaAI Mission (₹10,372 Cr), and safeguarding democratic resilience."
    },
    {
        "id": "daw-gs4-01",
        "paper": "GS4",
        "paper_name": "GS Paper 4 (Public Service Ethics & Administrative Values)",
        "marks": 10,
        "word_limit": 150,
        "time_target": "7.0 Minutes",
        "directive": "Differentiate and Analyze",
        "syllabus_topic": "Probity in Governance: Concept of public service; Philosophical basis of governance and probity; Information sharing and transparency in government.",
        "question": "Differentiate between \"statutory compliance\" and \"constitutional probity\" in public life. Why do legal disclosure mandates (such as candidate asset and criminal antecedent affidavits under Form 26) fail to cleanse public administration unless reinforced by ethical political culture and voter vigilance?",
        "context": "The Hindu Op-Ed on Form 26 electoral affidavits under the Representation of the People Act and the gap between minimalist legal disclosure and substantive moral integrity.",
        "source_name": "The Hindu (Op-Ed)",
        "source_headline": "Form 26 and the statutory mandate: Why ethical disclosure in public life goes beyond mere technical compliance",
        "source_url": "https://www.thehindu.com/opinion/op-ed/form-26-and-the-statutory-mandate/article71516242.ece",
        "micro_dimensions": [
            "Compliance vs Probity: Statutory compliance is rule-bound, external, and minimum-threshold avoidance of penalty; Constitutional probity is internal moral rectitude, fiduciary stewardship, and Nolan’s 7 Principles of Public Life",
            "Pathology of Technical Loopholes: How candidates file technically complete Form 26 affidavits while concealing benami assets or normalizing criminal antecedents as \"badge of dominance\"",
            "Ethical Ecosystem Transformation: Combining strict judicial scrutiny (Lok Prahari & ADR judgments) with internal party democracy, civic education, and Aristotelian civic virtue"
        ],
        "topper_benchmarks": "Contrast \"Letter of the Law (Legal Compliance)\" with \"Spirit of the Law (Constitutional Morality & Nolan Committee Principles)\" and cite the 2nd ARC Report on Ethics in Governance.",
        "directive_guidance": "1. Approach this 'Differentiate and Analyze' directive by systematically distinguishing rule-bound legality from higher moral probity before analyzing behavioral breakdowns. 2. Open with a crisp philosophical foundation: statutory compliance sets the legal floor, while constitutional probity embodies the aspirational ethical ceiling. 3. Provide a clear comparative matrix contrasting Origin, Nature, Enforcement, and Operational Mindset (avoiding punishment vs upholding public trust). 4. Analyze why Form 26 affidavits fail in isolation: 'creative compliance' where candidates mask benami wealth and normalize criminal antecedents as electoral muscle. 5. Highlight the institutional-cultural remedy: 2nd ARC recommendations on public integrity, proactive Election Commission disqualifications, and voter civic awareness. 6. Conclude by affirming Nolan Committee principles: without personal integrity and ethical culture, legal statutes remain powerless hollow shells.'creative compliance' where officers exploit statutory loopholes while fulfilling technical formalities (Klitgaard equation). 5. Ground your argument in real benchmarks: juxtapose rigid rule compliance (welfare denial) against compassionate discretion. 6. Conclude with the 2nd ARC recommendation on enacting a statutory Public Service Bill that internalizes the Nolan Principles."
    },
    {
        "id": "daw-gs4-02",
        "paper": "GS4",
        "paper_name": "GS Paper 4 (Corporate Governance & Trusteeship Ethics)",
        "marks": 20,
        "word_limit": 250,
        "time_target": "9.0 Minutes",
        "directive": "Analyze",
        "syllabus_topic": "Corporate governance; Ethical issues in international relations and funding; Probity in Governance.",
        "question": "When philanthropic trusts hold controlling stakes in mega commercial conglomerates, trustees face a delicate ethical duality between maximizing commercial shareholder returns and preserving public charitable trusteeship (Gandhian Trusteeship). Analyze the ethical principles that should guide corporate boardroom governance in resolving such fiduciary conflicts.",
        "context": "Indian Express Explained analysis on boardroom governance and the relationship between controlling philanthropic trusts and operating holding companies in India.",
        "source_name": "The Indian Express (Explained)",
        "source_headline": "Corporate trust and boardroom governance: Lessons from institutional power struggles in Indian philanthropic-industrial conglomerates",
        "source_url": "https://indianexpress.com/article/explained/explained-economics/venu-srinivasan-tvs-chief-tata-sons-group-power-struggle-10896106/",
        "micro_dimensions": [
            "Ethical Duality of Trust-Controlled Corporations: Balancing commercial agility, minority shareholder rights, and dividend generation with the overarching public philanthropy mandate of charitable trusts",
            "Risk of Ego & Institutional Capture: When personal boardroom rivalries overshadow institutional stability, eroding stakeholder trust and long-term reputation capital",
            "Gandhian Trusteeship & Kotak Committee Norms: Separating ownership from executive management, empowering truly independent directors, transparent succession planning, and Dharmic stewardship (wealth as social trust)"
        ],
        "topper_benchmarks": "Anchor your ethical analysis in Mahatma Gandhi’s Doctrine of Trusteeship, Uday Kotak Committee on Corporate Governance, and Stakeholder Capitalism vs Shareholder Primacy.",
        "directive_guidance": "1. Approach this 'Analyze' directive by examining the ethical tension between commercial profit maximization and social trusteeship obligations in corporate boards. 2. Open by introducing Mahatma Gandhi’s Doctrine of Trusteeship: wealth held by industrialists is a sacred social trust meant for societal welfare. 3. Detail the fiduciary duality: protecting minority shareholder rights and corporate competitiveness versus generating dividends for public philanthropic endowments. 4. Interrogate corporate governance perils: boardroom factionalism, opaque voting blocks, and the erosion of institutional reputation capital. 5. Propose ethical principles from the Uday Kotak Committee: strict firewalling between trust ownership and management, independent board audits, and transparent succession charters. 6. Conclude by framing ethical capitalism: corporate governance must balance commercial viability with social welfare to maintain long-term public trust.'s Deontological maxim: the safety of citizens is an absolute moral end in itself, which no administrative or personal threat can compromise."
    },
    {
        "id": "daw-gs4-03",
        "paper": "GS4",
        "paper_name": "GS Paper 4 (Techno-Ethics, Emotional Intelligence & Welfare Delivery)",
        "marks": 10,
        "word_limit": 150,
        "time_target": "7.0 Minutes",
        "directive": "Discuss",
        "syllabus_topic": "Ethics and Human Interface: Essence, determinants and consequences of Ethics in-human actions; dimensions of ethics; ethical governance.",
        "question": "Algorithms can optimize administrative efficiency, but they cannot bear moral responsibility when an automated welfare exclusion denies food or healthcare to a vulnerable citizen. Discuss the ethical perils of \"automation bias\" in e-governance and propose a framework for human-in-the-loop accountability.",
        "context": "Ethical inquiry into autonomous AI agents in government welfare systems and the moral irreplaceability of human empathy in public administration.",
        "source_name": "The Indian Express (Editorial)",
        "source_headline": "AI safety and ethical governance: Why algorithmic decision-making in public systems requires human moral agency",
        "source_url": "https://indianexpress.com/article/opinion/editorials/ai-agents-government-systems-security-risks-10896625/",
        "micro_dimensions": [
            "Moral Agency Deficit of Algorithms: AI possesses syntactic calculation but lacks semantic empathy, compassion (Karuna), and moral culpability when biometric/algorithmic filters wrongly exclude a starving widow",
            "Peril of Automation Bias & Diffusion of Responsibility: Bureaucrats hiding behind \"the computer rejected your claim\" to evade personal accountability (Hannah Arendt’s \"rule by nobody\")",
            "Human-in-the-Loop Ethical Charter: Mandatory human appellate override, algorithmic explainability, Rawlsian \"Difference Principle\" (protecting the most vulnerable first), and social audit of digital welfare"
        ],
        "topper_benchmarks": "Invoke John Rawls’ Difference Principle, Gandhian Talisman (impact on the poorest citizen), and Hannah Arendt’s critique of bureaucratic \"Rule by Nobody\".",
        "directive_guidance": "1. Approach this 'Discuss' directive by evaluating the dehumanization of public administration through blind algorithmic dependence versus constitutional compassion. 2. Open by distinguishing algorithmic computational efficiency from moral agency: machines possess syntax and processing speed but lack empathy, conscience, and Karuna. 3. Analyze ethical perils: 'automation bias' and diffusion of responsibility where officials hide behind 'the computer said no' (Hannah Arendt’s 'Rule by Nobody'). 4. Illustrate the human cost: denial of rations or pension to elderly citizens due to biometric fingerprint mismatches or database deletion. 5. Formulate a Human-in-the-Loop accountability framework: mandatory human appellate overrides, explainable AI audits, and applying the Rawlsian Difference Principle. 6. Conclude with Gandhi's Talisman: every automated governance tool must be evaluated by whether it restores dignity and relief to the poorest citizen.'s concept of procedural rationalization and its risk of degenerating into callous indifference. 3. Illustrate the human cost of rule-fetishism: genuine beneficiaries denied food grains or medical care due to strict procedural technicalities. 4. Demonstrate how Emotional Intelligence (EI) acts as a corrective rudder: empathetic listening, emotional self-regulation, and compassionate discretion. 5. Provide concrete civil service examples where administrators used creative legal discretion to prioritize the dignity of the marginalized. 6. Conclude by invoking Gandhi's Talisman as the definitive practical moral test for civil servants exercising administrative authority."
    },
    {
        "id": "daw-gs4-04",
        "paper": "GS4",
        "paper_name": "GS Paper 4 (Environmental Ethics & Administrative Dilemmas)",
        "marks": 15,
        "word_limit": 250,
        "time_target": "9.0 Minutes",
        "directive": "Case Study",
        "syllabus_topic": "Case Studies on above issues: Ethical dilemmas in government and private institutions; environmental ethics.",
        "question": "You are the District Collector of a riverine district where rampant illegal riverbed sand mining—backed by politically influential contractors—is altering river courses and threatening downstream tribal villages with catastrophic floods, while local youth depend on the mining trucks for daily wages. Identify the ethical dilemmas involved and outline your step-by-step course of action.",
        "context": "Ground report in The Hindu on illegal mechanized riverbed mining destabilizing Himalayan tributaries and threatening indigenous habitations.",
        "source_name": "The Hindu (Sci-Tech & Environment)",
        "source_headline": "Illegal riverbed mining inviting ecological catastrophe: Balancing infrastructural demand with ecological dharma",
        "source_url": "https://www.thehindu.com/news/national/other-states/illegal-riverbed-mining-inviting-catastrophe-assam-tribal-students-body/article71512277.ece",
        "micro_dimensions": [
            "Core Ethical Dilemmas: Immediate wage livelihood of local youth vs existential flood safety of downstream tribal hamlets; Political coercion/personal career risk vs Constitutional oath & Public Trust Doctrine",
            "Immediate Enforcement & Deterrence: Invoking Section 163 BNSS (144 CrPC) against mechanized in-stream dredging, seizing illegal machinery under MMDR Act & NGT Sustainable Sand Mining Guidelines, and deploying drone/satellite geo-fencing",
            "Compassionate Livelihood Transition: Organizing displaced youth into legal Women/Youth SHG sand-ghat cooperatives for regulated manual desiltation and converging MGNREGA watershed restoration"
        ],
        "topper_benchmarks": "Structure with Stakeholders -> Ethical Dilemmas (Public Trust Doctrine vs Short-Term Populism) -> Immediate Statutory Action (NGT Guidelines + Drone Surveillance) -> Sustainable Livelihood Convergence.",
        "directive_guidance": "1. Structure this 'Case Study' using the standard UPSC rubric: Stakeholder Mapping -> Core Ethical Dilemmas -> Options Evaluation -> Justified Course of Action. 2. Map key stakeholders: downstream tribal villagers (Article 21 life and safety), unemployed local youth, powerful mining contractors, and the administration. 3. Articulate primary ethical dilemmas: ecological protection and human life versus short-term economic livelihoods; constitutional duty versus political coercion. 4. Evaluate non-viable options: turning a blind eye to avoid conflict (moral cowardice) versus sudden unassisted crackdown creating civil unrest without livelihood relief. 5. Detail your definitive course of action: immediate drone surveillance and FIRs under MMDR Act/IPC, impounding mechanized excavators, and registering youth under MGNREGS/DDU-GKY. 6. Conclude by affirming Deontological public duty: the Collector's primary fidelity is to the Constitution, rule of law, and protecting vulnerable human lives.'s largest litigant. 4. Present valid counter-arguments: staffing statutory tribunals (NGT, CAT, TDSAT) requiring seasoned judicial minds. 5. Benchmark against authoritative guidance: Law Commission 14th Report, Justice Lodha proposals, and the Bangalore Principles of Judicial Conduct. 6. Conclude with a synthesized reform proposal: a mandatory statutory 2-year cooling-off period combined with dignified judicial pensions."
    },
    {
        "id": "daw-gs4-05",
        "paper": "GS4",
        "paper_name": "GS Paper 4 (Workplace Ethics & Civil Service Well-Being)",
        "marks": 20,
        "word_limit": 250,
        "time_target": "9.0 Minutes",
        "directive": "Examine",
        "syllabus_topic": "Work culture, Quality of service delivery, Utilization of public funds, challenges of corruption.",
        "question": "Public service employees possess a legitimate right to humane working conditions and collective bargaining, yet disruptions in essential banking and healthcare services disproportionately hurt the poorest citizens. Examine how an ethical administrator should reconcile employee dignity with the doctrine of \"uninterrupted public service delivery\".",
        "context": "Indian Express Explained feature on public sector bank strikes demanding a 5-day workweek and the tension between labor welfare and public utility continuity.",
        "source_name": "The Indian Express (Explained)",
        "source_headline": "Public sector banking strikes, employee welfare, and the history of work-life equilibrium vs essential citizen service continuity",
        "source_url": "https://indianexpress.com/article/explained/explained-history/bank-workers-strike-five-day-work-weekends-10896291/",
        "micro_dimensions": [
            "Kantian Dignity of Labour: Treating frontline public staff (bankers, nurses, teachers) not merely as exhausting instruments but as ends in themselves requiring mental health and work-life balance to prevent burnout",
            "Utilitarian & Antyodaya Duty to Citizens: Daily-wage earners, pensioners, and farmers rely on physical public branches; service paralysis inflicts asymmetric hardship on the digitally excluded",
            "Ethical Institutional Resolution: Proactive institutional grievance redressal (Whitley Council model), staggered shift rosters, digital self-service kiosks, and non-disruptive protest protocols"
        ],
        "topper_benchmarks": "Synthesize Immanuel Kant’s Categorical Imperative (Dignity of Workers) with Sevottam Model & Antyodaya (Uninterrupted Citizen-Centric Service Delivery).",
        "directive_guidance": "1. Approach this 'Examine' directive by scrutinizing administrative leadership obligations through Kantian human dignity and organizational ethics. 2. Open with the Kantian moral imperative: public servants must be treated as moral ends in themselves, never merely as instrumental cogs in the bureaucratic wheel. 3. Detail systemic workplace pathologies: chronic frontline burnout, toxic hierarchical intimidation, leave denials during medical distress, and administrative apathy. 4. Interrogate the leadership failure: confusing institutional dedication with reckless disregard for basic mental and physical well-being. 5. Detail ethical management reforms: institutionalized psychological support, mandatory rotational rest rosters, and grievance redressal without fear of victimization. 6. Conclude by citing the 2nd ARC: compassionate administrative leadership fosters high-morale public institutions capable of delivering superior governance.' principle: justice does not permit the sacrifice of the most vulnerable and voiceless on the altar of utilitarian expediency."
    },
    {
        "id": "daw-gs4-06",
        "paper": "GS4",
        "paper_name": "GS Paper 4 (Disaster Ethics, Safety Scrutiny & Moral Courage)",
        "marks": 10,
        "word_limit": 150,
        "time_target": "7.0 Minutes",
        "directive": "Case Study",
        "syllabus_topic": "Case Studies on disaster ethics, emotional intelligence, and courage of conviction in public administration.",
        "question": "As Sub-Divisional Magistrate in charge of a high-altitude Himalayan pilgrimage corridor, IMD issues a red alert for cloudbursts and landslides during peak yatra week. Local hoteliers, mule operators, and VIP pilgrims pressure you to keep the trek route open to avoid economic losses. Examine the competing ethical obligations and justify your decision.",
        "context": "Evacuation of 1,500 stranded pilgrims along the Kedarnath route in Uttarakhand following intense rain-triggered landslides.",
        "source_name": "The Hindu (National)",
        "source_headline": "Over 1,500 pilgrims stranded along Kedarnath trek route after landslide evacuated amidst fragile Himalayan carrying-capacity warnings",
        "source_url": "https://www.thehindu.com/news/national/uttarakhand/about-1500-pilgrims-stranded-along-kedarnath-trek-route-after-landslide-evacuated/article71518572.ece",
        "micro_dimensions": [
            "Competing Values: Right to Life (Article 21 — Supreme Value) vs Religious sentiment & seasonal livelihood of local pony/hotel operators; Courage of Conviction vs yielding to VIP/commercial pressure",
            "Decisive Precautionary Action: Immediately halting uphill yatra movement under the Disaster Management Act 2005, moving stranded pilgrims to safe NDRF/SDRF shelters, and issuing transparent multilingual advisories",
            "Empathetic Stakeholder Management: Using Emotional Intelligence to engage local trade associations and temple priests as safety partners, while activating dynamic carrying-capacity digital slot booking"
        ],
        "topper_benchmarks": "Apply the Precautionary Principle, Article 21 Primacy of Human Life, Disaster Management Act 2005 Section 34 powers, and Emotional Intelligence in crowd persuasion.",
        "directive_guidance": "1. Structure this 'Case Study' methodically: Stakeholder Identification -> Value Matrix -> Options Analysis -> Justified Course of Action. 2. Map critical stakeholders: thousands of innocent pilgrims, the VIP convoy, tunnel engineers, political executive, and your own official accountability. 3. Articulate core ethical dilemmas: Duty to safeguard human life (Article 21) versus administrative obedience to political hierarchy; short-term prestige versus irreversible catastrophe. 4. Evaluate rejected options: opening the tunnel with cosmetic patches (criminal negligence and breach of public trust) versus resigning or going on leave (dereliction of duty). 5. Outline decisive course of action: issue an immediate Section 144 CrPC closure order, requisition geological experts (GSI/BRO), reroute traffic to the old road, and submit a file note. 6. Conclude with moral courage: public safety is non-negotiable; an ethical civil servant acts as a trustee of citizens' lives regardless of administrative pressure.'rubber-stamping': independent directors failing to voice dissent on audit committees regarding related-party transactions. 4. Analyze conflicts of interest: promoter dominance, informational asymmetry, and revolving-door boardroom appointments. 5. Benchmark against authoritative frameworks: Uday Kotak Committee recommendations on independent director accountability and whistleblowing channels. 6. Conclude by advocating a transition toward Gandhian Trusteeship and ethical stewardship, where business integrity is seen as foundational to economic prosperity."
    },
    {
        "id": "daw-ess-01",
        "paper": "ESSAY",
        "paper_name": "UPSC Mains Essay Paper (Artificial Intelligence & Human Dignity)",
        "marks": 125,
        "word_limit": 1100,
        "time_target": "75.0 Minutes",
        "directive": "Philosophical Essay",
        "syllabus_topic": "Philosophical & Contemporary Essay on Technology, Ethics, and Democratic Conscience.",
        "question": "\"When the algorithm becomes the arbiter, who guards the conscience of the republic?\"",
        "context": "Contemporary debate on autonomous AI systems in governance, warfare, and judiciary vs constitutional morality and human conscience.",
        "source_name": "The Indian Express (Editorial)",
        "source_headline": "AI safety cannot be left to Silicon Valley: Securing human agency in an algorithmic age",
        "source_url": "https://indianexpress.com/article/opinion/editorials/ai-agents-government-systems-security-risks-10896625/",
        "micro_dimensions": [
            "Philosophical Thesis: Tools are extensions of human capability, but conscience is an exclusively moral faculty born of empathy, vulnerability, and lived accountability",
            "Multi-Sectoral Exploration: Algorithmic welfare exclusions, autonomous lethal weapons, deepfake manipulation of elections, and predictive policing biases",
            "Synthesis & Way Forward: Embedding Constitutional Morality (Ambedkar) and Gandhian Sarvodaya as the non-negotiable master-code governing Artificial Intelligence"
        ],
        "topper_benchmarks": "Open with an evocative contrast between Socrates’ Daimonion (inner moral voice) and an unfeeling neural network; traverse Governance, Judiciary, Warfare, and Ethics.",
        "directive_guidance": "1. Approach this philosophical essay by exploring the ethical boundary between algorithmic computational optimization and human moral conscience. 2. Open with an evocative hook contrasting automated efficiency with historical instances where human moral disobedience protected society from blind tyranny. 3. Deconstruct algorithmic logic: explain why algorithms optimize for historic patterns and efficiency metrics, but cannot embody empathy, equity, or justice. 4. Traverse multi-dimensional spheres: judicial bail algorithms, healthcare triage, social credit scoring, and surveillance capitalism. 5. Interrogate the philosophical guardian dilemma: citing Juvenal ('Quis custodiet ipsos custodes?') to argue that society's conscience must remain anchored in human moral agency. 6. Conclude with an inspiring synthesis: technology must serve as an amplifier of human compassion, not an automated surrogate for our ethical responsibility.'s thesis that democracy is government by public reasoning and dissent. 5. Address contemporary crises: echo chambers in digital media, algorithmic polarization, and the silencing of uncomfortable scientific climate truths. 6. Conclude with a poetic, uplifting synthesis uniting Rabindranath Tagore's 'Where the mind is without fear' with enduring intellectual curiosity."
    },
    {
        "id": "daw-ess-02",
        "paper": "ESSAY",
        "paper_name": "UPSC Mains Essay Paper (Ecological Economics & Civilization Survival)",
        "marks": 125,
        "word_limit": 1100,
        "time_target": "75.0 Minutes",
        "directive": "Analytical Essay",
        "syllabus_topic": "Essay on Ecology, Sustainable Development, and Intergenerational Justice.",
        "question": "\"Ecology is permanent economy: A civilization that saws the branch on which it sits cannot call its sawdust prosperity.\"",
        "context": "Recurring Himalayan and Western Ghats landslides highlighting the illusion of GDP growth built on ecological destruction.",
        "source_name": "The Hindu (Editorial)",
        "source_headline": "Narrowed posture: On Karnataka and the Kasturirangan Report — Reconciling development with ecological survival",
        "source_url": "https://www.thehindu.com/opinion/editorial/narrowed-posture-on-karnataka-and-the-kasturirangan-report/article71508916.ece",
        "micro_dimensions": [
            "Deconstructing the Metaphor: How short-term extractive GDP counts the timber (sawdust) as national income while ignoring the collapse of the living biosphere (the branch)",
            "Historical & Contemporary Arc: From Sunderlal Bahuguna’s Chipko axiom (\"Ecology is permanent economy\") to Western Ghats ESA deadlocks, Himalayan carrying capacity, and planetary boundaries",
            "Regenerative Paradigm: Transitioning from anthropocentric conquest (Prakriti as commodity) to Vedic/Constitutional trusteeship (Prakriti as partner — Article 48A & 51A(g))"
        ],
        "topper_benchmarks": "Anchor around Sunderlal Bahuguna’s maxim, Dasgupta Review on the Economics of Biodiversity, and India’s Mission LiFE.",
        "directive_guidance": "1. Structure this essay around Sunderlal Bahuguna’s Chipko axiom, reframing natural capital as the foundational substrate of all economic activity. 2. Open with an introduction juxtaposing industrial GDP obsession against irreversible planetary boundary breaches (Anthropocene epoch). 3. Unpack the fallacy of economic growth disconnected from ecology: water table depletion, soil desertification, and catastrophic climate-induced GDP losses. 4. Traverse global and historical lessons: the collapse of past civilizations (Mesopotamia, Easter Island) that exhausted ecological carrying capacities. 5. Detail the paradigm shift toward ecological economics: circular resource metabolism, Payment for Ecosystem Services, and valuing nature as living infrastructure. 6. Conclude with a visionary civilizational ethos: synthesizing traditional Indian ecological wisdom (Vasudhaiva Kutumbakam) with sustainable development goals.'s historic address or the mythological churning of the ocean (Samudra Manthan). 3. Dissect the economic orthodoxy of GDP-obsessed consumerism that treats ecological externalities as free inputs. 4. Unpack the scientific reality: Stockholm Resilience Centre findings on boundary breaches in climate, biosphere integrity, and nitrogen flows. 5. Integrate constitutional and indigenous ethics: Article 51A(g) compassion for living creatures, Gandhian trusteeship, and traditional sacred groves. 6. Conclude with a visionary manifesto for planetary stewardship, championing India's Mission LiFE as a template for civilizational survival."
    },
    {
        "id": "daw-ess-03",
        "paper": "ESSAY",
        "paper_name": "UPSC Mains Essay Paper (Democratic Philosophy & Sovereign Citizen)",
        "marks": 125,
        "word_limit": 1100,
        "time_target": "75.0 Minutes",
        "directive": "Philosophical Essay",
        "syllabus_topic": "Essay on Democratic Accountability, Transparency, and Citizen Sovereignty.",
        "question": "\"An informed citizen is the true sovereign; when the right to question is dimmed, democracy becomes mere ritual.\"",
        "context": "Two decades of the Right to Information movement in India and the philosophical relationship between transparency and democratic legitimacy.",
        "source_name": "The Hindu (Lead Op-Ed)",
        "source_headline": "The RTI’s shift to a ‘right to deny information’ and the vitality of citizen questioning in democracy",
        "source_url": "https://www.thehindu.com/opinion/lead/the-rtis-shift-to-a-right-to-deny-information/article70042967.ece",
        "micro_dimensions": [
            "Philosophical Core: From Upanishadic \"Prashna\" (spirit of inquiry) and Amartya Sen’s \"Argumentative Indian\" to the modern social contract where rulers are fiduciaries of the people",
            "Ritualistic vs Substantive Democracy: Periodic voting every five years without continuous access to state records reduces citizens from sovereign principals to passive subjects",
            "Institutional Renewal: Protecting whistleblowers, social audits, independent press, and transparent political finance as the oxygen of the Republic"
        ],
        "topper_benchmarks": "Weave Aruna Roy’s MKSS slogan (\"Hamara Paisa, Hamara Hisab\"), Justice Mathew’s dictum in State of UP v. Raj Narain, and Amartya Sen’s Idea of Justice.",
        "directive_guidance": "1. Deconstruct democracy as an active culture of reasoned dissent and constitutional dialogue rather than mere periodic voting rituals. 2. Open with an authoritative philosophical hook from B.R. Ambedkar or Amartya Sen on democracy as 'government by discussion'. 3. Unpack the architecture of inquiry: how Article 19(1)(a), the Right to Information, investigative journalism, and parliamentary scrutiny sustain popular sovereignty. 4. Interrogate contemporary perils: manufacture of consent, echo chambers, criminal defamation chilling effects, and executive opacity. 5. Contrast superficial electoral democracy with substantive deliberative democracy across education, civil society, and grassroots Panchayati Raj. 6. Conclude with a resolute call: preserving the citizen’s courage to ask difficult questions is the ultimate guarantee of a living, enduring constitutional republic.'s prophetic 25th November 1949 Constituent Assembly speech warning against entering 'a life of contradictions'. 3. Unpack John Dewey's and Ambedkar's insight that political institutions are hollow shells without social fraternity (maitri). 4. Examine structural barriers in contemporary India: caste endogamy, residential segregation, gender hierarchies, and rising wealth polarization. 5. Explore democratic revitalization: inclusive public spaces, community dialogue, deliberative Gram Sabhas, and empathetic public education. 6. Conclude with a resonant call for constitutional morality, affirming that democracy is an unending daily discipline of recognizing the equal moral worth of every human being."
    },
    {
        "id": "daw-ess-04",
        "paper": "ESSAY",
        "paper_name": "UPSC Mains Essay Paper (Inclusive Growth & Social Justice)",
        "marks": 125,
        "word_limit": 1100,
        "time_target": "75.0 Minutes",
        "directive": "Socio-Economic Essay",
        "syllabus_topic": "Essay on Inclusive Growth, Employment, and Human Capital.",
        "question": "\"Growth that leaves behind the hands that build it is an arithmetic illusion, not national development.\"",
        "context": "Evaluating jobless growth, automation, and the imperative of labor-intensive manufacturing and human capital investment for Viksit Bharat 2047.",
        "source_name": "The Hindu (Economy)",
        "source_headline": "12 years of ‘Make in India’ in 12 metrics: The quest for job-rich, inclusive structural transformation",
        "source_url": "https://www.thehindu.com/business/Economy/12-years-of-make-in-india-in-12-metrics-low-and-patchy-impact-on-growth-employment-global-share/article71505448.ece",
        "micro_dimensions": [
            "Growth vs Development Distinction: GDP measures aggregate output, whereas development (Mahbub ul Haq & Amartya Sen) measures the expansion of human capabilities, dignified jobs, and median household agency",
            "The Paradox of Capital-Intensive Growth: Rising corporate profits and billionaire wealth alongside informalization, youth underemployment, and stagnant rural real wages",
            "Pathway to Viksit Bharat 2047: Investing in foundational health/education, MSME clusters, female workforce inclusion, and green rural industrialization"
        ],
        "topper_benchmarks": "Contrast GDP growth arithmetic with Amartya Sen’s Capability Approach, ILO India Employment Report, and Gandhian Sarvodaya.",
        "directive_guidance": "1. Deconstruct the ethical and macroeconomic fallacy of K-shaped growth, demonstrating that true national prosperity is measured by bottom-quintile well-being. 2. Open with an evocative contrast between soaring stock market indices and stagnant real wages of migrant construction workers and agrarian labor. 3. Interrogate the 'arithmetic illusion': how aggregate GDP metrics conceal structural wealth concentration (Oxfam data) and unpaid reproductive care work. 4. Traverse sector-specific inequities: gig economy precarity, informal labor vulnerabilities, and widening spatial divergence between metropolitan and rural belts. 5. Detail the egalitarian economic blueprint: universal social safety nets, robust public healthcare and schooling, progressive taxation, and dignified labor standards. 6. Conclude by echoing Mahatma Gandhi and Amartya Sen: the strength of a nation’s development is revealed not in aggregate output, but in the capability expansion of its most vulnerable builders.' inverted-U hypothesis with modern empirical realities documented by Piketty. 5. Detail concrete anchoring roots: radical investment in early childhood nutrition (POSHAN), public skilling infrastructure, and universal social security nets. 6. Conclude by asserting that true economic strength is measured not by the net worth of its top billionaires, but by the dignity, resilience, and capability of its humblest citizens."
    },
    {
        "id": "daw-ess-05",
        "paper": "ESSAY",
        "paper_name": "UPSC Mains Essay Paper (Strategic Autonomy & Multipolar Geopolitics)",
        "marks": 125,
        "word_limit": 1100,
        "time_target": "75.0 Minutes",
        "directive": "Geopolitical & Philosophical Essay",
        "syllabus_topic": "Essay on Geopolitics, Strategic Autonomy, and Vasudhaiva Kutumbakam.",
        "question": "\"In an age of fractured superpowers, true strength lies not in choosing camps, but in building bridges.\"",
        "context": "India’s Vishwamitra (friend to the world) diplomacy bridging the West (Quad/G7) and the Global South / Eurasia (BRICS+/SCO).",
        "source_name": "The Hindu (Lead Op-Ed)",
        "source_headline": "India and the plausible multilateralism of BRICS in a polarized world",
        "source_url": "https://www.thehindu.com/opinion/lead/india-and-the-plausible-multilateralism-of-brics/article71500715.ece",
        "micro_dimensions": [
            "Beyond Cold-War Binary: Why zero-sum alliance politics breeds mutual insecurity, whereas bridge-building diplomacy creates cooperative public goods (vaccine maitri, DPI, solar alliance)",
            "Civilizational Roots: From Emperor Ashoka’s Dhamma and Buddha’s Madhyamaka (Middle Path) to dynamic strategic autonomy (multi-alignment) in the 21st century",
            "Moral Leadership of the Global South: Reforming global governance so that emerging nations are rule-shapers rather than collateral pawns"
        ],
        "topper_benchmarks": "Connect Buddha’s Madhyamaka (Middle Path) and S. Jaishankar’s \"Vishwamitra\" framework to India’s leadership in G20, BRICS+, and Quad.",
        "directive_guidance": "1. Structure this essay around the philosophical and diplomatic art of multi-alignment and strategic autonomy in a polarized multipolar order. 2. Open by contrasting Cold War bloc mentalities with contemporary polycentric global realpolitik and rising geopolitical fractures. 3. Deconstruct the vulnerability of vassalage: why aligning subserviently with rival blocs erodes national sovereignty and strategic maneuverability. 4. Elaborate India’s geopolitical statecraft: acting as a bridging power (Vishwa Mitra), reconciling the Global South with developed institutions, and navigating Quad alongside BRICS. 5. Traverse non-security arenas where bridging leadership is crucial: climate finance negotiations, digital public goods, and pandemic therapeutics. 6. Conclude with a powerful synthesis: a nation's enduring stature comes from ethical leadership, principled issue-based partnerships, and sustaining global dialogue."
    },
    {
        "id": "daw-ess-06",
        "paper": "ESSAY",
        "paper_name": "UPSC Mains Essay Paper (Climate Resilience & Agrobiodiversity)",
        "marks": 125,
        "word_limit": 1100,
        "time_target": "75.0 Minutes",
        "directive": "Philosophical & Scientific Essay",
        "syllabus_topic": "Essay on Science, Biodiversity, Food Security, and Civilizational Resilience.",
        "question": "\"The seeds we save today are the only insurance against the storms of tomorrow.\"",
        "context": "The Hindu feature on Nikolai Vavilov’s siege-era seed bank sacrifices and the urgency of conserving indigenous genetic diversity amidst climate change.",
        "source_name": "The Hindu (Sci-Tech & Environment)",
        "source_headline": "How the science Nikolai Vavilov built changed how we save crops and agro-biodiversity",
        "source_url": "https://www.thehindu.com/sci-tech/energy-and-environment/how-the-science-nikolai-vavilov-built-changed-how-we-save-crops/article71512603.ece",
        "micro_dimensions": [
            "Literal & Metaphorical Dimensions: Seeds as genetic agro-biodiversity (Vavilov, M.S. Swaminathan, Svalbard & Chang La Seed Vaults) AND seeds as institutional values, scientific temper, and ethical education planted for future generations",
            "Peril of Monoculture (In Fields and Minds): How homogenizing crops makes agriculture fragile to climate pests, just as homogenizing thought makes societies brittle to crises",
            "Stewardship for Posterity: Conserving traditional indigenous landraces (Navdanya, PPV&FR Act) alongside nurturing constitutional values and basic scientific research"
        ],
        "topper_benchmarks": "Open with the poignant historical anecdote of Nikolai Vavilov’s scientists guarding seed banks during the 1941 Siege of Leningrad; connect to M.S. Swaminathan’s Evergreen Revolution.",
        "directive_guidance": "1. Develop a multi-layered narrative tracing seeds as biological heritage, cultural archives, and the ultimate bulwark against climate shocks. 2. Open with an evocative hook on indigenous seed diversity conserved by tribal communities versus monocultural corporate hybrid vulnerability. 3. Detail scientific and ecological imperatives: climate extremes (heatwaves, unseasonal deluges) decimating uniform crops while landraces retain resilient genomic traits. 4. Explore socio-economic sovereignty: corporate seed patents and debt traps contrasted with farmer-managed community seed banks (like Rahibai Popere's seed movement). 5. Connect seed conservation to agro-ecological transition: natural farming, soil microbiology restoration, and food security under climate turbulence. 6. Conclude with a civilizational call: safeguarding indigenous seed germplasm is an intergenerational ethical duty essential for safeguarding future human survival.'s civilizational ideal of Vishwa Mitra, demonstrating that true strategic strength lies in the courage to wage peace."
    }
]

def get_daily_question(paper: str = None, offset: int = 0):
    """
    Returns dynamically selected UPSC Mains question for Daily Answer Writing (DAW).
    Rotates daily based on day-of-the-year seed, with support for paper filtering and offset shuffling.
    """
    today = datetime.date.today()
    date_str = today.strftime("%A, %d %B %Y")
    day_seed = today.timetuple().tm_yday

    # Filter by paper if specified
    if paper and paper.strip().upper() not in ["ALL", "TODAY", ""]:
        filtered = [q for q in DAILY_QUESTIONS_BANK if q["paper"].upper() == paper.strip().upper()]
        if not filtered:
            filtered = DAILY_QUESTIONS_BANK
    else:
        filtered = DAILY_QUESTIONS_BANK

    idx = (day_seed + int(offset)) % len(filtered)
    selected = dict(filtered[idx])
    selected["date_display"] = date_str
    selected["day_seed"] = day_seed
    selected["active_filter"] = paper or "TODAY"
    selected["current_offset"] = int(offset)
    selected["total_in_pool"] = len(filtered)
    return selected

def get_sample_test_series():
    """Returns pre-evaluated authentic 20-question UPSC Mains GS-2 Mock Test Series."""
    json_path = os.path.join(os.path.dirname(__file__), "sample_ts_data.json")
    if os.path.exists(json_path):
        with open(json_path, "r", encoding="utf-8") as f:
            return json.load(f)
    return {}


