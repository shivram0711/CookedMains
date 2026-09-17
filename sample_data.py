import os
import datetime
from PIL import Image, ImageDraw, ImageFont
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
        "paper_name": "GS Paper 1 (Indian Heritage & Culture)",
        "marks": 10,
        "word_limit": 150,
        "time_target": "7.0 Minutes",
        "directive": "Highlight",
        "syllabus_topic": "Salient aspects of Art Forms, literature and Architecture from ancient to modern times.",
        "question": "The Chola temple architecture represents the zenith of South Indian temple art, where monumentality merged with community life. Highlight the architectural and socioeconomic significance of the Great Living Chola Temples.",
        "context": "Brihadisvara Temple at Thanjavur completed over a millennium of architectural prominence, noted in ASI preservation reports.",
        "source_name": "The Hindu",
        "source_headline": "Millennium of Magnificence: Preserving the Granite Engineering of the Great Living Cholas",
        "source_url": "https://www.thehindu.com/news/national/tamil-nadu/thanjavur-brihadisvara-temple-chola-architecture-heritage/article67891234.ece",
        "micro_dimensions": [
            "Architectural Zenith: Vimana supremacy, Dravidian shikhara evolution, and granite interlocking engineering",
            "Socio-Economic Hub: Temple as landowner, grain bank, employer of artisans, and center of Devadasi traditions",
            "Epigraphical Legacy: Inscriptions detailing local sabhas, irrigation committees (Uttaramerur), and village administration"
        ],
        "topper_benchmarks": "Draw a neat cross-section sketch of Dravidian temple layout (Gopuram, Vimana, Mandapa, Garbhagriha) and cite Uttaramerur inscription.",
        "directive_guidance": "1. Directly identify the most prominent architectural and socio-economic facets without prolonged historical background. 2. Define the Dravidian architectural climax achieved under Rajaraja I and Rajendra I in your introduction. 3. Structure the primary body around structural innovations: monolithic granite shikhara, soaring Vimana, and axial mandapas. 4. Devote the second body section to the temple as an economic nucleus: grain storage, public treasury, and employment hub. 5. Include a quick 40-second labeled diagram showing the vertical hierarchy from Upapitha to Stupi. 6. Conclude by linking Chola architectural patronship to UNESCO World Heritage status and living community traditions."
    },
    {
        "id": "daw-gs1-02",
        "paper": "GS1",
        "paper_name": "GS Paper 1 (Modern Indian History)",
        "marks": 15,
        "word_limit": 250,
        "time_target": "9.0 Minutes",
        "directive": "Critically evaluate",
        "syllabus_topic": "Modern Indian history: significant events, personalities, and tribal/peasant movements.",
        "question": "Tribal uprisings during British colonial rule were not isolated skirmishes but foundational battles for jal, jangal, and jameen against fiscal colonialism. Critically evaluate why mainstream historiography long relegated them to the periphery.",
        "context": "Observance of Janjatiya Gaurav Divas and archival research on the 1855 Santhal Hool and Ulgulan of Birsa Munda.",
        "source_name": "Press Information Bureau (PIB)",
        "source_headline": "Janjatiya Gaurav: Archival Resurgence of Tribal Resistance Against British Colonial Exploitation",
        "source_url": "https://pib.gov.in/PressReleasePage.aspx?PRID=1977218",
        "micro_dimensions": [
            "Nature of Resistance: Defense of customary rights (Khuntkatti system) against Dikus (moneylenders) and British forest acts",
            "Key Movements: Santhal Hul (1855), Kol Uprising (1831), Birsa Munda's Ulgulan (1899), and Rampa Rebellion (1922)",
            "Historiographical Bias: Colonial narrative of 'law & order savagery' vs elite nationalist focus on constitutional agitation"
        ],
        "topper_benchmarks": "Include a map pinpointing tribal movement corridors (Chota Nagpur, Santhal Parganas, Andhra agency tracks) and cite Forest Act 1878 alienation.",
        "directive_guidance": "1. Contrast the profound systemic nature of tribal resistance against the reasons for its historical marginalization. 2. Open with a crisp introduction defining tribal resistance as an existential defense of customary autonomy (Jal-Jangal-Jameen) predating 1857. 3. Dedicate 50% of your body space to substantiating the anti-colonial depth of movements like the Santhal Hul and Birsa's Ulgulan against fiscal encroachment. 4. Devote 35% to interrogating historiographical neglect: colonial criminalization of forest dwellers and elitist nationalist historiography focused on metropolitan politics. 5. Embed a quick outline map of central and eastern India marking key tribal insurrection nodes. 6. Conclude with a synthesized perspective on constitutional recognition under the Fifth and Sixth Schedules and PESA 1996."
    },
    {
        "id": "daw-gs1-03",
        "paper": "GS1",
        "paper_name": "GS Paper 1 (Indian Society)",
        "marks": 10,
        "word_limit": 150,
        "time_target": "7.0 Minutes",
        "directive": "Discuss",
        "syllabus_topic": "Role of women, demographic transition, poverty and developmental issues.",
        "question": "Despite rising female educational attainment, India faces the paradox of low Female Labour Force Participation Rate (FLFPR). Discuss structural bottlenecks and policy levers needed to unlock India's gender dividend.",
        "context": "Periodic Labour Force Survey (PLFS) showing female labor force participation concentrated heavily in unpaid domestic work and rural agriculture.",
        "source_name": "The Indian Express",
        "source_headline": "Explained: Decoding India's Female Labour Force Participation Paradox and Unpaid Care Burden",
        "source_url": "https://indianexpress.com/article/explained/explained-economics/india-female-labour-force-participation-plfs-gender-gap-9234561/",
        "micro_dimensions": [
            "U-Curve Hypothesis: Economic transition causing withdrawal of educated middle-income women from manual labor",
            "Structural Inhibitors: Unpaid care burden (Time Use Survey), mobility safety deficit, and patriarchal marriage market penalties",
            "Policy Levers: State-subsidized creches (Palna scheme), female transport subsidies, and tax incentives for formal women employers"
        ],
        "topper_benchmarks": "Quote Time Use Survey data (women spend 299 mins/day on unpaid domestic care vs 97 mins for men) and Claudia Goldin's Nobel work.",
        "directive_guidance": "1. Adopt an expansive multi-dimensional framework addressing economic, sociocultural, infrastructural, and legal dimensions of female employment. 2. Open with a crisp introduction citing recent PLFS data alongside Claudia Goldin's U-shaped female labor force hypothesis. 3. Group structural inhibitors under thematic subheadings: disproportionate care burden (Time Use Survey), lack of safe transit, and wage polarization. 4. Articulate targeted policy levers: universalization of institutional creches (Palna scheme), digital gig safety, and gender-responsive budgeting. 5. Include a conceptual 30-second flowchart linking female education, formal jobs, demographic dividend, and GDP expansion. 6. Conclude with a visionary forward-looking statement linking gender parity in the workforce to the realization of India's $5-trillion economy."
    },
    {
        "id": "daw-gs1-04",
        "paper": "GS1",
        "paper_name": "GS Paper 1 (Physical Geography & Climatology)",
        "marks": 15,
        "word_limit": 250,
        "time_target": "9.0 Minutes",
        "directive": "Account for",
        "syllabus_topic": "Salient features of world's physical geography; Geophysical phenomena such as cyclones, heatwaves.",
        "question": "Account for the rising frequency and intensity of severe cyclonic storms in the Arabian Sea, traditionally considered calmer than the Bay of Bengal. What vulnerabilities does this pose for India's western coastline?",
        "context": "Recent cyclones Biparjoy and Tauktae demonstrated unprecedented rapid intensification cycles over the warming Arabian Sea basin.",
        "source_name": "Down to Earth",
        "source_headline": "Why the Arabian Sea is Heating Up Faster and Spawning Intense Super Cyclones",
        "source_url": "https://www.downtoearth.org.in/climate-change/arabian-sea-warming-cyclones-climate-change-imd-78214",
        "micro_dimensions": [
            "Climatological Drivers: Rapid sea surface warming (>28°C), positive Indian Ocean Dipole (IOD), and anthropogenic greenhouse forcing",
            "Dynamic Meteorology: Weak vertical wind shear enabling deep convection and prolonged moisture entrapment",
            "Western Coast Vulnerabilities: High urbanization density (Mumbai, Gujarat ports), mangrove depletion, and low historical disaster preparedness"
        ],
        "topper_benchmarks": "Draw Arabian Sea vs Bay of Bengal thermal contrast diagram and recommend Sendai Framework resilient coastal infrastructure.",
        "directive_guidance": "1. Systematically explain primary meteorological causes and link them directly to coastal consequences. 2. Introduce the topic with IMD data noting a 52% increase in Arabian Sea cyclone frequency over the past two decades. 3. Detail thermodynamic drivers in the first section: anomalous Sea Surface Temperature (SST > 30°C) and ocean heat content accumulation. 4. Analyze dynamic meteorological factors: weakened vertical wind shear and shifts in mid-tropospheric humidity. 5. Enumerate western coastal vulnerabilities: high industrial concentration, critical oil refineries, reclaimed mudflats, and port exposure. 6. Conclude by outlining a coastal resilience roadmap: bio-shield mangrove restoration, automated early-warning Doppler radars, and Sendai Framework targets."
    },
    {
        "id": "daw-gs1-05",
        "paper": "GS1",
        "paper_name": "GS Paper 1 (Geography & Urban Hydrology)",
        "marks": 10,
        "word_limit": 150,
        "time_target": "7.0 Minutes",
        "directive": "Examine",
        "syllabus_topic": "Urbanization, their problems and their remedies; Water resources and environmental degradation.",
        "question": "Traditional water-harvesting architectures (Johads, Baolis, Ahar-Pynes) were harmonized with local topography, whereas modern urban engineering has turned rainfall into a disaster hazard. Examine.",
        "context": "Severe urban waterlogging and acute groundwater depletion witnessed across major metropolitan hubs during monsoon months.",
        "source_name": "Yojana and Kurukshetra Magazines",
        "source_headline": "Reviving Ancient Water Wisdom: How Traditional Harvesting Can Solve India's Urban Flooding Crisis",
        "source_url": "https://yojana.gov.in/water-conservation-traditional-harvesting-urban-flood-management.pdf",
        "micro_dimensions": [
            "Traditional Ingenuity: Gravity-fed, decentralized, ecological runoff containment preserving aquifer recharge",
            "Modern Flaws: Impervious concrete cover, encroachment on natural floodplains, and stormwater drains choked by silt",
            "Synthesis: Sponge City framework integrating historical catchment retention with modern municipal urban planning"
        ],
        "topper_benchmarks": "Cite regional examples (Johads in Rajasthan, Ahar-Pynes in Bihar, Eri tanks in Tamil Nadu) and propose the Sponge City Model.",
        "directive_guidance": "1. Dissect the engineering philosophy of indigenous systems versus modern concrete urbanization. 2. Begin with an introduction juxtaposing ancient decentralised hydrology with contemporary concretisation of floodplains. 3. Evaluate indigenous systems: gravity-fed Johads (Rajasthan), cascading Eri systems (Tamil Nadu), and Ahar-Pynes (Bihar). 4. Expose modern urban failures: disappearance of urban wetlands, loss of permeable soil, and fragmented drainage channels. 5. Include a quick 2-column comparative table contrasting ecological runoff recharge versus rapid channelised stormwater runoff. 6. Conclude by championing the 'Sponge City' urban design model that retrofits traditional percolation pits into municipal building codes."
    },
    {
        "id": "daw-gs1-06",
        "paper": "GS1",
        "paper_name": "GS Paper 1 (Economic Geography & Mineral Resources)",
        "marks": 15,
        "word_limit": 250,
        "time_target": "9.0 Minutes",
        "directive": "Elucidate",
        "syllabus_topic": "Distribution of key natural resources across the world (including South Asia and the Indian sub-continent); factors responsible for the location of primary, secondary, and tertiary sector industries.",
        "question": "The global energy transition is fundamentally shifting resource geography from fossil fuel basins to critical mineral corridors. Elucidate India's geological endowment of critical and rare earth elements, and analyze the strategic challenges in domestic extraction and processing.",
        "context": "Economic Survey highlighting domestic mineral security, deep-sea exploration under the Samudrayaan mission, and notified blocks of Lithium in Jammu & Kashmir and Chhattisgarh.",
        "source_name": "Economic Survey & Union Budget",
        "source_headline": "Economic Survey: Redefining Resource Geography Through Critical Minerals and Strategic Value Chains",
        "source_url": "https://www.indiabudget.gov.in/economicsurvey/doc/mineral_security_green_transition.pdf",
        "micro_dimensions": [
            "Geological Endowment: Monazite beach sands (Kerala/Odisha for Thorium & Neodymium), Carbonatites in Rajasthan/Gujarat, and hard-rock pegmatites (J&K Lithium)",
            "Processing Chokepoints: Heavy capital intensity, complex chemical leaching, environmental waste disposal (tailings ponds), and lack of domestic smelting capacity",
            "Strategic Initiatives: National Critical Mineral Mission, offshore seabed exploration, and public-private consortia under MMDR reforms"
        ],
        "topper_benchmarks": "Include a sketch map of India highlighting Monazite sands, Reasi lithium deposit, and Bastar tin-tantalum belt with clean geographic labels.",
        "directive_guidance": "1. Clarify the spatial distribution of critical minerals and systematically explain extraction and refining bottlenecks. 2. Open with an authoritative thesis establishing that clean energy decarbonization replaces oil geopolitics with critical mineral supply security. 3. Map out India's geological endowment: Monazite placers along the southern coast, carbonatite complexes in Gujarat/Rajasthan, and pegmatite deposits in the Himalayan belt. 4. Interrogate domestic processing constraints: absence of specialized refining metallurgy, acute environmental pollution concerns, and long gestation periods. 5. Highlight policy responses: the Mines and Minerals (Development and Regulation) Amendment Act and Deep Ocean Mission exploration. 6. Conclude by recommending downstream value-addition clusters, circular electronic-waste extraction, and international processing technology tie-ups."
    },
    {
        "id": "daw-gs2-01",
        "paper": "GS2",
        "paper_name": "GS Paper 2 (Constitutional Law & Federalism)",
        "marks": 15,
        "word_limit": 250,
        "time_target": "9.0 Minutes",
        "directive": "Critically analyze",
        "syllabus_topic": "Functions and responsibilities of the Union and the States, issues and challenges pertaining to the federal structure.",
        "question": "The Governor's constitutional role was conceived as a sagacious bridge of federal unity, yet delays in granting assent to state legislation have turned the office into an arena of federal friction. Critically analyze in light of Article 200 and recent Supreme Court jurisprudence.",
        "context": "Supreme Court rulings in State of Punjab (2023) and State of Tamil Nadu (2024) establishing that Governors cannot sit indefinitely on bills passed by elected state legislatures.",
        "source_name": "The Hindu",
        "source_headline": "Federalism and the Gavel: Supreme Court Defines Constitutional Timelines for Governors Under Article 200",
        "source_url": "https://www.thehindu.com/news/national/supreme-court-governor-assent-bills-article-200-federalism-ruling/article67567890.ece",
        "micro_dimensions": [
            "Constitutional Schema: Article 200 options (Assent, Withhold, Return for reconsideration, Reserve for President)",
            "Federal Friction: Indefinite pocket veto, bypassing aid and advice of Council of Ministers (Article 163), and subversion of democratic mandate",
            "Judicial Intervention: SC mandates that 'as soon as possible' precludes pocket veto; returning bill makes second passage binding"
        ],
        "topper_benchmarks": "Cite Shamsher Singh (1974), Nabam Rebia (2016), Punjab Case (2023), Sarkaria and Punchhi Commission recommendations.",
        "directive_guidance": "1. Formulate a balanced, dialectical analysis examining constitutional necessity versus potential for partisan friction. 2. Anchor Article 200 within B.R. Ambedkar's conception of the Governor as a constitutional sentinel, not a parallel executive. 3. Examine operational realities: bill withholding, indefinite pocket vetoes, and their infringement upon legislative sovereignty. 4. Review judicial guardrails, emphasizing the Supreme Court mandate that 'as soon as possible' implies urgent constitutional dispatch. 5. Enrich your answer with landmark citations: Shamsher Singh (1974), Nabam Rebia (2016), and Sarkaria Commission guidelines. 6. Conclude with a synthesized reform blueprint recommending statutory timelines for bill assent and codification of Punchhi Commission rules."
    },
    {
        "id": "daw-gs2-02",
        "paper": "GS2",
        "paper_name": "GS Paper 2 (Parliament & Executive Accountability)",
        "marks": 15,
        "word_limit": 250,
        "time_target": "9.0 Minutes",
        "directive": "Discuss",
        "syllabus_topic": "Parliament and State Legislatures: structure, functioning, conduct of business, powers & privileges.",
        "question": "Departmentally Related Parliamentary Standing Committees (DRSCs) act as the institutional conscience of Parliament. Discuss how the declining proportion of bills referred to committees undermines executive accountability and quality of legislation.",
        "context": "PRS Legislative Research data indicating less than 20% of bills were referred to parliamentary committees in the 17th Lok Sabha compared to 71% in the 15th Lok Sabha.",
        "source_name": "PRS Legislative Research",
        "source_headline": "Vital Signs: The Declining Referral of Bills to Parliamentary Committees and the Erosion of Legislative Scrutiny",
        "source_url": "https://prsindia.org/vital-stats/decline-in-bill-referrals-to-parliamentary-committees-17th-lok-sabha",
        "micro_dimensions": [
            "Institutional Rationale: In-camera deliberations, cross-party consensus building, public consultation, and clause-by-clause expert examination",
            "Trend Analysis: Sharp decline from 71% (15th LS) to 27% (16th LS) to under 16% (17th LS) leading to rushed legislation",
            "Systemic Consequences: Sub-optimal drafting, frequent post-enactment judicial litigation, and public agitations"
        ],
        "topper_benchmarks": "Quote exact PRS statistics, cite 2nd ARC and NCRWC recommendations for mandatory referral of major bills to standing committees.",
        "directive_guidance": "1. Provide a comprehensive institutional appraisal of the committee system and its structural bypassing. 2. Open with an authoritative quote from Woodrow Wilson or the 2nd ARC describing Parliamentary Committees as the 'workhorses of the legislature'. 3. Chart the empirical decline using precise PRS data (from 71% in the 15th Lok Sabha to under 16% in the 17th Lok Sabha). 4. Unpack qualitative impacts: loss of in-camera non-partisan deliberation, exclusion of civil society inputs, and subsequent judicial pushback. 5. Propose structural solutions: mandatory referral of all substantive legislation as in the British House of Commons, and public deposition rules. 6. Conclude with a forward-looking argument that robust committee scrutiny is an indispensable prerequisite for enduring constitutional democracy."
    },
    {
        "id": "daw-gs2-03",
        "paper": "GS2",
        "paper_name": "GS Paper 2 (Fundamental Rights & Minority Protections)",
        "marks": 15,
        "word_limit": 250,
        "time_target": "9.0 Minutes",
        "directive": "Critically examine",
        "syllabus_topic": "Structure, organization and functioning of the Executive and the Judiciary; Fundamental Rights and Minority safeguards.",
        "question": "The regulation of unrecognised and unaided traditional educational institutions often creates a tension between educational standardisation and minority rights. Critically examine this statement in light of constitutional safeguards and judicial pronouncements.",
        "context": "Supreme Court rulings on the constitutional validity of Madarsa Education Board Acts and state mandates regarding non-affiliated religious seminaries.",
        "source_name": "The Indian Express",
        "source_headline": "Educational Standardisation vs Minority Autonomy: The Constitutional Balancing Act Under Articles 29 and 30",
        "source_url": "https://indianexpress.com/article/explained/explained-law/supreme-court-madarsa-act-verdict-constitutional-minority-rights-article-30-9287341/",
        "micro_dimensions": [
            "Constitutional Protection: Article 30(1) right to establish and administer educational institutions; Article 29 cultural preservation",
            "State's Regulatory Competence: Securing academic standards, preventing student exploitation, teacher qualification mandates, and national curriculum integration",
            "Judicial Doctrine: T.M.A. Pai Foundation (2002), Inamdar (2005), and recent Madarsa judgment establishing that regulation cannot destroy minority character"
        ],
        "topper_benchmarks": "Cite T.M.A. Pai Foundation, P.A. Inamdar, and Article 21A right to quality education alongside Article 30 protections.",
        "directive_guidance": "1. Provide a balanced, dialectical evaluation weighing the state's obligation to ensure quality education against constitutional minority autonomy. 2. Frame the delicate interplay between Article 21A (Right to Education) and Article 30(1) in your introduction. 3. Substantiate legitimate regulatory interests: modernizing curriculum, securing child rights, and enforcing teacher competence. 4. Interrogate the constitutional threshold where state standardization risks extinguishing institutional autonomy or cultural ethos. 5. Cite pivotal landmark jurisprudence: T.M.A. Pai Foundation (2002), P.A. Inamdar (2005), and recent Supreme Court verdicts on state education boards. 6. Conclude with a synthesized Way Forward advocating constructive dual-track models that blend modern science-math education with cultural heritage preservation."
    },
    {
        "id": "daw-gs2-04",
        "paper": "GS2",
        "paper_name": "GS Paper 2 (Digital Rights & Data Protection)",
        "marks": 10,
        "word_limit": 150,
        "time_target": "7.0 Minutes",
        "directive": "Evaluate",
        "syllabus_topic": "Government policies and interventions for development in various sectors and issues arising out of their design and implementation.",
        "question": "The Digital Personal Data Protection (DPDP) Act, 2023 seeks to establish a consent-based privacy regime. Evaluate whether the wide-ranging government exemptions provided under the Act satisfy the proportionality test established in the Puttaswamy judgment.",
        "context": "Notification of the DPDP Act 2023 and ongoing deliberations regarding exemptions granted to state security agencies under Section 17.",
        "source_name": "NITI Aayog Reports & Official Documents",
        "source_headline": "Responsible AI and Data Governance: Reconciling Citizen Privacy with State Security Imperatives",
        "source_url": "https://www.niti.gov.in/sites/default/files/2023-08/National-Data-Governance-DPDP-Report.pdf",
        "micro_dimensions": [
            "Legislative Architecture: Data Fiduciary obligations, consent managers, and rights of Data Principals under DPDP Act",
            "Exemption Contours: Section 17 government exemptions for sovereignty, state security, and maintenance of public order",
            "Puttaswamy 4-Prong Test: Legality, Legitimate State Aim, Proportionality/Necessity, and Procedural Safeguards"
        ],
        "topper_benchmarks": "Apply the 4-fold Puttaswamy test (Legality, Need, Proportionality, Procedural Safeguards) and reference BN Srikrishna Committee recommendations.",
        "directive_guidance": "1. Apply an analytical evaluation methodology measuring statutory provisions directly against constitutional benchmark standards. 2. Recall Justice K.S. Puttaswamy (2017), which established privacy as an intrinsic fundamental right under Article 21. 3. Detail the statutory progress achieved: clear recognition of Data Principals, stringent penal provisions for data breaches, and consent architecture. 4. Critically evaluate Section 17 government exemptions against the four-fold proportionality test: Legality, Legitimate State Aim, Proportionality, and Safeguards. 5. Highlight institutional independence concerns regarding executive appointment of the Data Protection Board of India. 6. Conclude with actionable suggestions to introduce independent judicial oversight for state surveillance and narrow categorical exemptions."
    },
    {
        "id": "daw-gs2-05",
        "paper": "GS2",
        "paper_name": "GS Paper 2 (India's Foreign Policy & Geopolitics)",
        "marks": 15,
        "word_limit": 250,
        "time_target": "9.0 Minutes",
        "directive": "Discuss",
        "syllabus_topic": "Bilateral, regional and global groupings and agreements involving India and/or affecting India's interests.",
        "question": "India's foreign policy has evolved from traditional non-alignment to pragmatic multi-alignment. Discuss how India balances its strategic partnership with the Quad while concurrently actively engaging within BRICS and the SCO.",
        "context": "Analysis by defence scholars on India's dual role in maritime Indo-Pacific security architectures and continental Eurasian multilateral forums.",
        "source_name": "IDSA (Institute for Defence Studies and Analyses)",
        "source_headline": "Strategic Autonomy in Multipolarity: Balancing Maritime Deterrence with Continental Eurasian Engagements",
        "source_url": "https://www.idsa.in/policybrief/strategic-autonomy-multipolarity-quad-brics-sco",
        "micro_dimensions": [
            "Conceptual Evolution: Non-alignment (defensive distance) to Strategic Autonomy to Issue-Based Multi-Alignment",
            "Quad Balancing: Maritime domain awareness, Indo-Pacific deterrence, critical technologies, and supply chain resilience",
            "BRICS/SCO Engagement: Continental Eurasian stability, dedollarization dialogues, voice of the Global South, and counter-terrorism coordination"
        ],
        "topper_benchmarks": "Quote S. Jaishankar's 'The India Way', cite the Voice of Global South Summit, and draw an Indo-Pacific vs Eurasian geostrategic matrix.",
        "directive_guidance": "1. Structure your answer around the transition from reactive neutrality to proactive issue-based multi-alignment. 2. Reference External Affairs Minister S. Jaishankar's doctrine in 'The India Way' on managing multiple diplomatic partnerships. 3. Analyze the maritime pillar: deepening defense interoperability and technology transfer with the Quad in the Indo-Pacific. 4. Analyze the continental-Eurasian pillar: safeguarding Eurasian energy corridors and championing Global South concerns within BRICS and SCO. 5. Include a clean 2x2 matrix contrasting maritime security imperatives (Quad) with multipolar economic restructuring (BRICS). 6. Conclude by affirming that multi-alignment maximizes national strategic autonomy while establishing India as a bridging power (Vishwa Mitra)."
    },
    {
        "id": "daw-gs2-06",
        "paper": "GS2",
        "paper_name": "GS Paper 2 (Panchayati Raj & Grassroots Governance)",
        "marks": 15,
        "word_limit": 250,
        "time_target": "9.0 Minutes",
        "directive": "Critically analyze",
        "syllabus_topic": "Devolution of powers and finances up to local levels and challenges therein; Role of civil services in a democracy.",
        "question": "Three decades after the 73rd Constitutional Amendment Act, local self-governance in India continues to be hampered by the '3Fs' deficit—Functions, Funds, and Functionaries—and informal proxy leadership like 'Sarpanch Pati'. Critically analyze.",
        "context": "Evaluation studies published in rural development journals examining financial autonomy of Gram Panchayats and ground realities of Article 243D reservations.",
        "source_name": "Yojana and Kurukshetra Magazines",
        "source_headline": "Revitalizing Grassroots Democracy: Bridging Fiscal Deficits and Dismantling Proxy Governance in Panchayats",
        "source_url": "https://kurukshetra.gov.in/panchayati-raj-devolution-women-empowerment-sarpanch-pati.pdf",
        "micro_dimensions": [
            "Structural 3Fs Deficit: Reluctance of state governments to devolve core executive subjects, heavy tied-grant dependence, and lack of trained village secretariats",
            "Socio-Cultural Hurdles: Entrenched rural patriarchy, 'Panchayat Pati' phenomenon undermining women representatives under Article 243D",
            "Fiscal Viability: Own Source Revenue (OSR) contributing under 5% of total Panchayat revenues; non-implementation of State Finance Commission recommendations"
        ],
        "topper_benchmarks": "Cite RBI's 'Finances of Panchayati Raj Institutions' Report, Article 243-I (State Finance Commissions), and 2nd ARC local governance proposals.",
        "directive_guidance": "1. Examine constitutional aspirations of democratic decentralization alongside ground-level administrative bottlenecks. 2. Open with an introduction acknowledging the 73rd Amendment as an unprecedented constitutional leap toward participatory democracy. 3. Detail the structural '3Fs' failure: limited devolution of 29 Eleventh Schedule subjects, acute staff shortages, and tied fund rigidities. 4. Interrogate the sociocultural distortion of proxy governance ('Sarpanch Pati') and examine its negation of substantive empowerment. 5. Highlight fiscal vulnerabilities using RBI empirical findings: overwhelming reliance on union/state grants and near-zero local property tax collection. 6. Conclude with a decisive reform agenda: mandatory biometric meetings, independent women-only Gram Sabhas, and incentive-linked devolution indices."
    },
    {
        "id": "daw-gs3-01",
        "paper": "GS3",
        "paper_name": "GS Paper 3 (Disaster Management & Himalayan Ecology)",
        "marks": 15,
        "word_limit": 250,
        "time_target": "9.0 Minutes",
        "directive": "Critically analyze",
        "syllabus_topic": "Disaster and disaster management; Conservation, environmental pollution and degradation, environmental impact assessment.",
        "question": "The recurring disasters during pilgrimage seasons in the ecologically fragile Himalayan region highlight the deep conflict between infrastructure-led tourism and ecological sustainability. Critically analyze.",
        "context": "Land subsidence in Joshimath, recurring cloudbursts in Himachal Pradesh and Uttarakhand, and carrying capacity violations along the Char Dham route.",
        "source_name": "Down to Earth",
        "source_headline": "Infrastructure & Disaster Resilience in Fragile Zones: Himalayan Carrying Capacity Reaches Tipping Point",
        "source_url": "https://www.downtoearth.org.in/news/environment/himalayan-infrastructure-disaster-resilience-carrying-capacity-char-dham-88231",
        "micro_dimensions": [
            "Developmental Imperatives: Religious tourism economy, border defense mobility, local employment, and road connectivity",
            "Ecological Tipping Point: Young fold mountains, slope destabilization from blast excavation, carrying capacity breaches, and GLOF hazards",
            "Way Forward: Regulated ecotourism caps, mandatory Cumulative Environmental Impact Assessments (CEIA), and tunnel-slope bio-engineering"
        ],
        "topper_benchmarks": "Cite Supreme Court High Powered Committee (Ravi Chopra) recommendations, NDMA Glacial Hazard guidelines, and Sendai Framework.",
        "directive_guidance": "1. Structure your analysis with a balanced dialectical approach addressing developmental imperatives and environmental limits. 2. Open with a 2-3 line contextual opening citing recent Joshimath subsidence and Supreme Court observations on carrying capacity. 3. Dedicate 50% of the body to substantiating economic imperatives: religious pilgrim economy, border security logistics, and hill connectivity. 4. Allocate 35% of the body space to interrogating systemic ecological risks: blast-induced slope destabilization, seismicity, and flash flood hazards. 5. Propose evidence-backed value additions: cite the Ravi Chopra High Powered Committee and NDMA guidelines on glacial lake outbursts. 6. Conclude with a 15% pragmatic synthesis advocating mandatory Cumulative Impact Assessments, seasonal visitor caps, and green bio-engineering."
    },
    {
        "id": "daw-gs3-02",
        "paper": "GS3",
        "paper_name": "GS Paper 3 (Macroeconomics & Fiscal Policy)",
        "marks": 15,
        "word_limit": 250,
        "time_target": "9.0 Minutes",
        "directive": "Discuss",
        "syllabus_topic": "Indian Economy and issues relating to planning, mobilization of resources, growth, development and employment.",
        "question": "India's post-pandemic fiscal strategy has relied heavily on central capital expenditure (Capex) to crowd in private investment. Discuss the efficacy of this strategy and analyze risks posed by state-level revenue deficits.",
        "context": "Union Budget raising central capital expenditure to historic highs alongside RBI reports on state finances highlighting rising committed expenditure.",
        "source_name": "Economic Survey & Union Budget",
        "source_headline": "Capex-Led Growth: Measuring the Multiplier Effect on Private Investment and State Fiscal Health",
        "source_url": "https://www.indiabudget.gov.in/economicsurvey/doc/capex_led_growth_fiscal_consolidation.pdf",
        "micro_dimensions": [
            "Multiplier Dynamics: High capital expenditure multiplier (2.45x vs 0.9x for revenue spending) in roads, railways, and digital public infrastructure",
            "Private Investment Lag: High corporate balance-sheet cash reserves yet sluggish greenfield private investment due to global demand uncertainty",
            "Sub-national Vulnerabilities: State government debt-to-GSDP ratios, power discom bailouts, and growing freebie expenditure squeezing capital budgets"
        ],
        "topper_benchmarks": "Quote RBI State Finances Report, cite N.K. Singh FRBM Review Committee benchmarks, and compare capex multipliers.",
        "directive_guidance": "1. Evaluate macro-level capex multipliers alongside micro-level sub-national fiscal deficits. 2. Open with a crisp introduction defining the crowding-in hypothesis and citing recent Union Budget capex allocations. 3. Examine efficacy of central infrastructure push: high output multipliers in logistics, national highways, and digital public infrastructure. 4. Analyze structural constraints: corporate caution in greenfield manufacturing despite healthy balance sheets and capacity utilization levels. 5. Interrogate state-level fiscal stress: rising revenue expenditure on non-merit subsidies, power discom liabilities, and FRBM deviations. 6. Conclude by emphasizing the necessity of second-generation factor reforms (land, labor, power) to transform public capex into sustained private animal spirits."
    },
    {
        "id": "daw-gs3-03",
        "paper": "GS3",
        "paper_name": "GS Paper 3 (Renewable Energy & Strategic Resources)",
        "marks": 15,
        "word_limit": 250,
        "time_target": "9.0 Minutes",
        "directive": "Elaborate",
        "syllabus_topic": "Infrastructure: Energy, Ports, Roads, Airports, Railways; Science and Technology- developments and their applications.",
        "question": "India's transition towards renewable energy cannot succeed without simultaneously addressing supply chain vulnerabilities in critical minerals. Elaborate on strategic policy imperatives.",
        "context": "NITI Aayog whitepaper on critical mineral supply chains, battery recycling mandates, and KABIL overseas mining ventures.",
        "source_name": "NITI Aayog Reports & Official Documents",
        "source_headline": "Securing the Clean Energy Supply Chain: Strategic Minerals, Domestic Value Addition and Global Alliances",
        "source_url": "https://www.niti.gov.in/sites/default/files/2023-11/Critical-Minerals-Energy-Transition-Report.pdf",
        "micro_dimensions": [
            "Resource Chokepoints: High import dependence on single geographies for refining Lithium, Cobalt, Nickel, and Rare Earth Elements (REE)",
            "Strategic Initiatives: Khanij Bidesh India Ltd (KABIL) offshore asset acquisitions in South America; commercial domestic block auctions",
            "Circular Economy & Technology: Battery recycling regulations (EPR norms), sodium-ion battery research, and deep-sea mining exploration"
        ],
        "topper_benchmarks": "Mention KABIL partnerships, 24 critical minerals notified under MMDR Act 2023, and the Minerals Security Partnership (MSP).",
        "directive_guidance": "1. Organize an expansive multi-dimensional roadmap covering domestic legislative, international geopolitical, and technological levers. 2. State that the geopolitics of energy transition has shifted from oil barrels to critical mineral processing in your opening. 3. Detail external supply chokepoints: geographical concentration of refining and high import dependence for Lithium and Cobalt. 4. Elaborate on domestic initiatives: commercial auction of critical mineral blocks under the MMDR Amendment Act 2023 and offshore exploration. 5. Detail global diplomatic initiatives: overseas equity acquisition through KABIL (Argentina/Australia) and joining the Minerals Security Partnership. 6. Conclude with a technology-driven synthesis: circular battery recycling mandates, alternative chemistries (Sodium-ion), and domestic processing incentives."
    },
    {
        "id": "daw-gs3-04",
        "paper": "GS3",
        "paper_name": "GS Paper 3 (Agriculture & Price Support)",
        "marks": 15,
        "word_limit": 250,
        "time_target": "9.0 Minutes",
        "directive": "Critically examine",
        "syllabus_topic": "Issues related to direct and indirect farm subsidies and minimum support prices; Public Distribution System.",
        "question": "Demands for a statutory guarantee for Minimum Support Price (MSP) reflect acute agrarian distress, but a blanket legal mandate poses serious fiscal and market distortion risks. Critically examine viable pathways for sustainable agricultural income support.",
        "context": "Agrarian protests advocating statutory backing for the Swaminathan Commission formula (C2 + 50%) across all 23 designated crops.",
        "source_name": "The Indian Express",
        "source_headline": "The MSP Conundrum: Analyzing Fiscal Realities, Crop Diversification, and Direct Income Support Pathways",
        "source_url": "https://indianexpress.com/article/explained/explained-economics/msp-legal-guarantee-farmer-protests-swaminathan-formula-cost-benefit-9178923/",
        "micro_dimensions": [
            "Agrarian Demands: Protection against volatile farm-gate price crashes, rising input inflation, and debt accumulation",
            "Fiscal & Trade Challenges: Astronomical public procurement costs, global WTO AoA aggregate measurement of support (AMS) caps, and export uncompetitiveness",
            "Ecological & Market Distortion: Over-cultivation of water-guzzling paddy/wheat, monoculture depletion of water tables, and disruption of private traders",
            "Balanced Pathways: Price Deficiency Payment Systems (Bhavantar Bhugtan), PM-KISAN unconditional cash transfer expansion, and millet procurement"
        ],
        "topper_benchmarks": "Cite Ashok Dalwai Committee on Doubling Farmers' Income, Swaminathan Commission C2+50% formula, and WTO Amber Box restrictions.",
        "directive_guidance": "1. Provide a rigorous, evidence-based critique balancing farmer livelihood vulnerability against macro-fiscal and ecological sustainability. 2. Frame MSP as a safety net introduced during the Green Revolution to ensure food security in your introduction. 3. Substantiate farmer grievances: rising cultivation costs, market price crashes below MSP, and asymmetric regional procurement. 4. Examine systemic risks: fiscal burden, WTO Amber Box breach challenges, and ecological water depletion in northwest India. 5. Detail viable alternative pathways: Price Deficiency Payment Systems (like MP's Bhavantar scheme) and universalized direct income transfers (PM-KISAN). 6. Conclude by recommending a structured transition towards climate-resilient crop diversification backed by cold-chain logistics and FPO empowerment."
    },
    {
        "id": "daw-gs3-05",
        "paper": "GS3",
        "paper_name": "GS Paper 3 (Internal Security & Cyber Warfare)",
        "marks": 10,
        "word_limit": 150,
        "time_target": "7.0 Minutes",
        "directive": "Analyze",
        "syllabus_topic": "Basics of cyber security; Security challenges and their management in border areas; Linkages of organized crime with terrorism.",
        "question": "The weaponization of artificial intelligence in hybrid warfare has transformed critical national infrastructure into vulnerable cyber frontiers. Analyze the multifaceted nature of this threat and outline defensive counter-measures.",
        "context": "Ransomware assaults targeting AIIMS Delhi and coordinated state-sponsored cyber espionage campaigns targeting power grid dispatch units.",
        "source_name": "IDSA (Institute for Defence Studies and Analyses)",
        "source_headline": "Guarding the Digital Grid: How AI-Driven Cyber Warfare Threatens India's Critical National Infrastructure",
        "source_url": "https://www.idsa.in/issuebrief/ai-cyber-warfare-critical-infrastructure-power-grid",
        "micro_dimensions": [
            "Hybrid Threat Vectors: AI-generated polymorphic malware, deepfake psychological influence operations, and SCADA control system disruptions",
            "Vulnerability of Lifeline Assets: Power grids, healthcare hospital networks, banking UPI rails, and nuclear control facilities",
            "Counter-Architecture: National Critical Information Infrastructure Protection Centre (NCIIPC), CERT-In mandates, and indigenous air-gapped systems"
        ],
        "topper_benchmarks": "Cite National Cyber Security Strategy benchmarks, NCIIPC sector mandates, and the Budapest Convention debates.",
        "directive_guidance": "1. Break the threat down analytically into distinct components: offensive vectors, target infrastructure, and defensive architecture. 2. Acknowledge cyberspace as the Fifth Domain of Warfare alongside Land, Sea, Air, and Space in your opening. 3. Analyze modern threat vectors: AI-crafted polymorphic ransomware, zero-day automated vulnerability scanning, and SCADA industrial sabotage. 4. Map cascading risks across lifeline critical assets: regional electricity load dispatch centres, financial clearing switches, and medical databanks. 5. Detail institutional defensive measures: proactive threat-hunting through NCIIPC, mandatory reporting to CERT-In, and air-gapped backups. 6. Conclude with a strategic recommendation to establish an autonomous Cyber Command and foster public-private cybersecurity resilience pacts."
    },
    {
        "id": "daw-gs3-06",
        "paper": "GS3",
        "paper_name": "GS Paper 3 (Logistics, Infrastructure & Economic Competitiveness)",
        "marks": 15,
        "word_limit": 250,
        "time_target": "9.0 Minutes",
        "directive": "Discuss",
        "syllabus_topic": "Infrastructure: Energy, Ports, Roads, Airports, Railways; Effects of liberalization on the economy, changes in industrial policy and their effects on industrial growth.",
        "question": "High logistics costs have long eroded India's manufacturing competitiveness. Discuss how the PM GatiShakti National Master Plan and the National Logistics Policy (NLP) aim to transform India's multimodal supply chain architecture.",
        "context": "Department for Promotion of Industry and Internal Trade (DPIIT) releasing logistics performance assessments highlighting integration of 1,400+ geospatial layers under PM GatiShakti.",
        "source_name": "Press Information Bureau (PIB)",
        "source_headline": "PM GatiShakti and NLP: Revolutionizing India's Multimodal Connectivity and Slashing Logistics Overhead",
        "source_url": "https://pib.gov.in/PressReleasePage.aspx?PRID=1968542",
        "micro_dimensions": [
            "Logistics Bottleneck: Historical logistics cost standing at ~13-14% of GDP compared to global benchmark of ~8% in developed economies",
            "PM GatiShakti Architecture: GIS-based spatial planning portal breaking inter-ministerial silos across railways, highways, shipping, and telecom",
            "National Logistics Policy: Unified Logistics Interface Platform (ULIP), Ease of Logistics (ELOG), and skill certification for warehouse workers"
        ],
        "topper_benchmarks": "Cite National Logistics Policy 2022 targets (reduce logistics cost to single digits by 2030, rank in top 25 of World Bank LPI) and ULIP integration.",
        "directive_guidance": "1. Approach this 'Discuss' directive by diagnosing traditional multimodal bottlenecks and demonstrating how GIS-driven integration fixes them. 2. Open with an introduction quoting the World Bank Logistics Performance Index and India's target of reducing logistics overhead to under 9% of GDP. 3. Detail the structural impediments: skewed modal mix (over-reliance on costly road freight vs energy-efficient rail/waterways) and fragmented approvals. 4. Unpack PM GatiShakti's transformative impact: synchronized multi-agency planning on a single GIS platform preventing repetitive road excavation. 5. Examine the National Logistics Policy: digital single-window tracking via ULIP and standardization of physical warehousing infrastructure. 6. Conclude by linking efficient multimodal logistics to the Make in India initiative, export competitiveness, and achieving net-zero green transport goals."
    },
    {
        "id": "daw-gs4-01",
        "paper": "GS4",
        "paper_name": "GS Paper 4 (Public Service Ethics & Administrative Values)",
        "marks": 10,
        "word_limit": 150,
        "time_target": "7.0 Minutes",
        "directive": "Differentiate",
        "syllabus_topic": "Public/Civil service values and Ethics in Public administration: Status and problems; ethical concerns and dilemmas.",
        "question": "Differentiate between 'Code of Conduct' and 'Code of Ethics'. Why does external compliance alone fail to prevent bureaucratic corruption without an internal moral compass? Elucidate with examples.",
        "context": "Recommendations of the 2nd Administrative Reforms Commission (4th Report) on Ethics in Governance and codification of Nolan Principles.",
        "source_name": "Press Information Bureau (PIB)",
        "source_headline": "Administrative Ethics in Practice: Why Rules Alone Cannot Compel Virtue in Civil Administration",
        "source_url": "https://pib.gov.in/PressReleasePage.aspx?PRID=1894567",
        "micro_dimensions": [
            "Conceptual Distinction: Code of Conduct sets minimum legal floor ('thou shalt not'); Code of Ethics establishes aspirational moral ceiling ('thou shalt')",
            "Creative Compliance: Adhering to the letter of the law while violating its ethical spirit (e.g. conflict-of-interest loan approvals)",
            "Internal Moral Rudder: Synthesizing Kant's Categorical Imperative with civil servants demonstrating courage and public compassion"
        ],
        "topper_benchmarks": "Include a comparative distinction table, quote Klitgaard's corruption equation (C = M + D - A), and reference 2nd ARC recommendations.",
        "directive_guidance": "1. Structure the response around a clear comparative matrix followed by an ethical inquiry into moral conscience. 2. Open with a sharp distinction: a Code of Conduct establishes the legal floor, while a Code of Ethics embodies the aspirational moral ceiling. 3. Present a crisp 4-point distinction table comparing Nature, Source, Enforcement, and Scope in bureaucratic administration. 4. Explain why external compliance fails: 'creative compliance' where officers exploit statutory loopholes while fulfilling technical formalities (Klitgaard equation). 5. Ground your argument in real benchmarks: juxtapose rigid rule compliance (welfare denial) against compassionate discretion. 6. Conclude with the 2nd ARC recommendation on enacting a statutory Public Service Bill that internalizes the Nolan Principles."
    },
    {
        "id": "daw-gs4-02",
        "paper": "GS4",
        "paper_name": "GS Paper 4 (Probity in Governance & Whistleblowing Case Study)",
        "marks": 20,
        "word_limit": 250,
        "time_target": "9.0 Minutes",
        "directive": "Discuss ethical dilemma and decide",
        "syllabus_topic": "Ethical concerns and dilemmas in government and private institutions; laws, rules, regulations and conscience as sources of ethical guidance.",
        "question": "You are a senior civil servant supervising the procurement of medical equipment for district primary health centres. You discover that the lowest bidder, favored by your departmental minister, has supplied sub-standard dialysis kits that pose fatal risks. When you record your dissent on the file, the Minister instructs you verbally to withdraw your adverse note or face immediate punitive transfer to an insignificant post before your daughter's board exams. Discuss the ethical dilemmas involved and outline your course of action.",
        "context": "Ethical tensions between hierarchical obedience, personal family obligations, and inviolable public duty in administrative decision-making.",
        "source_name": "The Indian Express",
        "source_headline": "Administrative Dilemmas: Balancing Hierarchical Obedience, Family Sacrifices, and Public Duty in Governance",
        "source_url": "https://indianexpress.com/article/opinion/columns/ethics-in-civil-services-dilemmas-whistleblowing-public-duty-9234512/",
        "micro_dimensions": [
            "Stakeholder Analysis: Patients facing life-threatening complications, the civil servant's family, the political executive, and public healthcare integrity",
            "Ethical Dilemmas: Devoir d'obeissance (duty of hierarchical obedience) vs Devoir de loyaute (loyalty to constitutional oath & patient lives)",
            "Course of Action: Maintain file note inviolability, apprise Chief Secretary / Vigilance Commissioner, insist on written ministerial direction (Rule 3(3) of All India Services Rules), and prioritize public safety over personal career convenience"
        ],
        "topper_benchmarks": "Cite Rule 3(3) of AIS Conduct Rules (insist on written directions), Nolan Principles of Selflessness & Integrity, and the Satyendra Dubey legacy.",
        "directive_guidance": "1. Follow the canonical UPSC case study blueprint: Stakeholder Mapping -> Ethical Dilemma Identification -> Options Evaluation -> Justified Final Course of Action. 2. Begin with an objective stakeholder matrix mapping vulnerable rural patients, the department, family stability, and the constitutional oath. 3. Articulate the primary ethical dilemma: professional duty to safeguard human life (Article 21) versus personal filial responsibility and hierarchical obedience. 4. Formulate three distinct options: complying with the minister, seeking an immediate transfer, or standing firm on the official file. 5. Outline your definitive course of action: uphold the adverse finding, mandate independent technical testing, invoke Rule 3(3) of AIS Conduct Rules, and notify the Chief Secretary. 6. Conclude by affirming Kant's Deontological maxim: the safety of citizens is an absolute moral end in itself, which no administrative or personal threat can compromise."
    },
    {
        "id": "daw-gs4-03",
        "paper": "GS4",
        "paper_name": "GS Paper 4 (Emotional Intelligence & Administrative Compassion)",
        "marks": 10,
        "word_limit": 150,
        "time_target": "7.0 Minutes",
        "directive": "Discuss with illustrations",
        "syllabus_topic": "Emotional intelligence-concepts, and their utilities and application in administration and governance; Human Values - lessons from the lives and teachings of great leaders.",
        "question": "Max Weber conceived bureaucracy as an impersonal, rule-bound machine, yet blind adherence to procedural rationality often leads to administrative heartlessness. Discuss how emotional intelligence and compassion prevent the 'iron cage of bureaucracy' from crushing citizen dignity.",
        "context": "Instances of denial of welfare entitlements due to biometric authentication failures, and innovative public grievance redressal models.",
        "source_name": "The Hindu",
        "source_headline": "Administrative Compassion: Why Bureaucracy Needs Emotional Intelligence to Deliver Social Justice",
        "source_url": "https://www.thehindu.com/opinion/op-ed/compassion-in-public-administration-emotional-intelligence/article67341298.ece",
        "micro_dimensions": [
            "Theoretical Conflict: Max Weber's rational-legal impersonal bureaucracy vs humanistic welfare state ethics",
            "Pathology of Rule-Fetishism: Biometric exclusion of elderly pensioners, procedural denial of emergency healthcare",
            "EI as Solution: Daniel Goleman's components (Self-awareness, Empathy, Social Skills) translating into compassionate administrative discretion"
        ],
        "topper_benchmarks": "Reference Max Weber's 'Iron Cage', Daniel Goleman's Emotional Intelligence framework, and Mahatma Gandhi's Talisman.",
        "directive_guidance": "1. Interrogate the tension between impersonal rule compliance and human empathy in civil service delivery. 2. Open with an introduction defining Max Weber's concept of procedural rationalization and its risk of degenerating into callous indifference. 3. Illustrate the human cost of rule-fetishism: genuine beneficiaries denied food grains or medical care due to strict procedural technicalities. 4. Demonstrate how Emotional Intelligence (EI) acts as a corrective rudder: empathetic listening, emotional self-regulation, and compassionate discretion. 5. Provide concrete civil service examples where administrators used creative legal discretion to prioritize the dignity of the marginalized. 6. Conclude by invoking Gandhi's Talisman as the definitive practical moral test for civil servants exercising administrative authority."
    },
    {
        "id": "daw-gs4-04",
        "paper": "GS4",
        "paper_name": "GS Paper 4 (Judicial Ethics & Separation of Powers)",
        "marks": 15,
        "word_limit": 250,
        "time_target": "9.0 Minutes",
        "directive": "Critically evaluate",
        "syllabus_topic": "Probity in Governance: Concept of public service; Philosophical basis of governance and probity; Information sharing and transparency in government.",
        "question": "The prospect of post-retirement executive appointments for judges of superior courts creates an insidious risk of subtle bias during judicial tenure. Critically evaluate whether a mandatory cooling-off period is essential to uphold the doctrine of separation of powers and public trust in the judiciary.",
        "context": "Debates in legal forums following nominations of retired Supreme Court and High Court judges to political offices, tribunals, and legislative bodies.",
        "source_name": "PRS Legislative Research",
        "source_headline": "The Independence of the Gavel: Evaluating Post-Retirement Appointments and the Cooling-Off Period Debate",
        "source_url": "https://prsindia.org/theprsblog/judicial-independence-and-post-retirement-appointments",
        "micro_dimensions": [
            "Ethical Vulnerability: Perception of quid pro quo compromising judicial neutrality in matters where the State is the primary litigant",
            "Counter-Perspectives: Utilizing rare judicial wisdom, specialized domain expertise for tribunals, and absence of constitutional bar",
            "Institutional Safeguards: Law Commission 14th Report recommendations, Justice Lodha proposals, and international Bangalore Principles of Judicial Conduct"
        ],
        "topper_benchmarks": "Cite Law Commission 14th Report (Justice M.C. Setalvad), Bangalore Principles of Judicial Conduct (2002), and Justice Lodha Committee recommendations.",
        "directive_guidance": "1. Adopt a balanced dialectical approach addressing institutional probity versus utilizing judicial expertise. 2. Open with a 2-3 line contextual introduction framing the cooling-off period as an indispensable institutional firewall. 3. Dedicate primary body space to analyzing the conflict of interest: subtle bias when adjudicating matters involving the executive, which is India's largest litigant. 4. Present valid counter-arguments: staffing statutory tribunals (NGT, CAT, TDSAT) requiring seasoned judicial minds. 5. Benchmark against authoritative guidance: Law Commission 14th Report, Justice Lodha proposals, and the Bangalore Principles of Judicial Conduct. 6. Conclude with a synthesized reform proposal: a mandatory statutory 2-year cooling-off period combined with dignified judicial pensions."
    },
    {
        "id": "daw-gs4-05",
        "paper": "GS4",
        "paper_name": "GS Paper 4 (Disaster Management Ethics & Environmental Justice Case Study)",
        "marks": 20,
        "word_limit": 250,
        "time_target": "9.0 Minutes",
        "directive": "Analyze ethical dilemma and suggest course of action",
        "syllabus_topic": "Ethical concerns and dilemmas in government and private institutions; Environmental ethics; Human values and conscience.",
        "question": "You are the District Magistrate of an ecologically vulnerable district. A catastrophic cloudburst triggers flash floods that threaten two locations simultaneously: (1) a downstream chemical pesticide plant whose breach could release toxic effluent into the river supplying drinking water to 500,000 city residents, and (2) an isolated tribal hamlet of 300 families trapped on an eroding river island with imminent risk of being washed away. Your disaster response resources (boats and helicopters) can only mount an immediate rescue operation at ONE location. How will you resolve this ethical dilemma? Justify your decision using ethical frameworks.",
        "context": "Disaster management prioritization challenges involving utilitarian calculations versus deontological rights of marginalized communities.",
        "source_name": "Down to Earth",
        "source_headline": "Environmental Justice in Crisis: When Disaster Ethics Pit Vulnerable Hamlets Against Metropolitan Water Security",
        "source_url": "https://www.downtoearth.org.in/governance/disaster-ethics-flash-floods-tribal-vulnerability-chemical-hazard-89312",
        "micro_dimensions": [
            "Ethical Conflict: Utilitarian calculus (safeguarding 500,000 urban citizens) vs Deontological moral duty & Environmental Justice (saving 300 defenseless tribal citizens)",
            "Vulnerability Assessment: Urban residents have alternative water options (piped tankers, bottled supply) whereas island tribals face certain drowning",
            "Holistic Resolution: Mobilize state disaster rescue assets for immediate island evacuation while enforcing emergency shutdown/bunding of chemical plant via factory safety protocols"
        ],
        "topper_benchmarks": "Contrast Jeremy Bentham's Utilitarianism against John Rawls' Difference Principle and Kant's Categorical Imperative.",
        "directive_guidance": "1. Structure your analysis rigorously following the classic ethical dilemma framework: Core Conflict -> Theoretical Evaluation -> Operational Strategy -> Value Justification. 2. Map the ethical conflict: Benthamite Utilitarianism (greatest good of 500,000) versus Rawlsian Environmental Justice and the Deontological duty to rescue people in immediate mortal peril. 3. Interrogate the asymmetric vulnerability: the urban population faces water contamination which can be mitigated through municipal tankers and emergency shutdown, whereas the island villagers face certain death within hours. 4. Formulate an actionable multi-tiered operational plan: deploy immediate motorized rescue boats and helicopters to evacuate the stranded tribal families. 5. Concurrently activate plant-level emergency containment protocols: deploy district fire units, mandate immediate chemical neutralizer release, and sound urban water-intake shutdown warnings. 6. Conclude by affirming John Rawls' principle: justice does not permit the sacrifice of the most vulnerable and voiceless on the altar of utilitarian expediency."
    },
    {
        "id": "daw-gs4-06",
        "paper": "GS4",
        "paper_name": "GS Paper 4 (Corporate Governance & Ethical Capitalism)",
        "marks": 10,
        "word_limit": 150,
        "time_target": "7.0 Minutes",
        "directive": "Examine",
        "syllabus_topic": "Corporate governance; Ethical concerns in private institutions; Probity in governance.",
        "question": "Corporate governance failures are often not failures of regulatory oversight, but failures of ethical culture and fiduciary duty among independent directors. Examine how conflict of interest and rubber-stamping undermine market integrity.",
        "context": "Economic Survey chapters on financial sector stability, related-party transactions, and strengthening independent directorship norms.",
        "source_name": "Economic Survey & Union Budget",
        "source_headline": "Economic Survey: Cultivating Ethical Capitalism, Fiduciary Accountability, and Robust Corporate Governance",
        "source_url": "https://www.indiabudget.gov.in/economicsurvey/doc/corporate_governance_fiduciary_duty.pdf",
        "micro_dimensions": [
            "Fiduciary Breakdown: Independent directors becoming subservient to promoter interests due to attractive retainers and informal ties",
            "Related-Party Transactions (RPTs): Siphoning corporate funds to shell entities without rigorous audit committee scrutiny",
            "Ethical Capitalism: Reimagining corporate boards from shareholder primacy to multi-stakeholder stewardship (ESG norms)"
        ],
        "topper_benchmarks": "Cite Uday Kotak Committee on Corporate Governance, Kumar Mangalam Birla Committee, and Section 149 of Companies Act 2013.",
        "directive_guidance": "1. Examine the root cause of governance collapses: cultural erosion rather than mere technical rule violations. 2. Open with an introduction defining corporate governance as an ethical compact of trust between corporate management, investors, and society. 3. Detail the pathology of 'rubber-stamping': independent directors failing to voice dissent on audit committees regarding related-party transactions. 4. Analyze conflicts of interest: promoter dominance, informational asymmetry, and revolving-door boardroom appointments. 5. Benchmark against authoritative frameworks: Uday Kotak Committee recommendations on independent director accountability and whistleblowing channels. 6. Conclude by advocating a transition toward Gandhian Trusteeship and ethical stewardship, where business integrity is seen as foundational to economic prosperity."
    },
    {
        "id": "daw-ess-01",
        "paper": "ESSAY",
        "paper_name": "UPSC Mains Essay Paper (Philosophical Section)",
        "marks": 125,
        "word_limit": 1100,
        "time_target": "75.0 Minutes",
        "directive": "Compose a reflective philosophical essay",
        "syllabus_topic": "Essay: Candidates will be expected to keep closely to the subject of the essay to arrange their ideas in orderly fashion, and to write concisely.",
        "question": "\"Wisdom lies not in knowing all the answers, but in understanding which questions must never be silenced.\"",
        "context": "Philosophical exploration of democratic dissent, scientific inquiry, ethical introspection, and intellectual humility.",
        "source_name": "The Hindu",
        "source_headline": "The Architecture of Doubt: Why Questioning Remains the Bedrock of Democracy and Civilization",
        "source_url": "https://www.thehindu.com/opinion/open-page/the-architecture-of-doubt-philosophy-inquiry/article67923412.ece",
        "micro_dimensions": [
            "Philosophical Genesis: Socratic method of elenchus, intellectual humility, and the dangerous illusion of absolute certainty",
            "Democratic Prerequisite: Constitutional morality, the necessity of eternal vigilance, and the protection of dissensus in plural societies",
            "Scientific & Social Progress: Scientific revolution driven by disruptive queries, challenging orthodox dogmas and social hierarchies"
        ],
        "topper_benchmarks": "Weave historical anecdotes (Socrates drinking hemlock, Galileo's astronomical defiance, Amartya Sen's 'The Argumentative Indian').",
        "directive_guidance": "1. Build an expansive multi-dimensional essay tracing the philosophical, political, scientific, and ethical contours of questioning. 2. Open with an engaging narrative hook: Socrates in the Athenian agora or the dialogue between Nachiketa and Yama in the Katha Upanishad. 3. Explore the epistemological dimension: how dogmatic certainty breeds totalitarian orthodoxy while perpetual questioning drives civilizational enlightenment. 4. Bridge to constitutional democracy: unpacking Amartya Sen's thesis that democracy is government by public reasoning and dissent. 5. Address contemporary crises: echo chambers in digital media, algorithmic polarization, and the silencing of uncomfortable scientific climate truths. 6. Conclude with a poetic, uplifting synthesis uniting Rabindranath Tagore's 'Where the mind is without fear' with enduring intellectual curiosity."
    },
    {
        "id": "daw-ess-02",
        "paper": "ESSAY",
        "paper_name": "UPSC Mains Essay Paper (Ecological & Civilization Theme)",
        "marks": 125,
        "word_limit": 1100,
        "time_target": "75.0 Minutes",
        "directive": "Compose a comprehensive analytical essay",
        "syllabus_topic": "Essay: Environmental ethics, planetary boundaries, sustainable development, and humanity's shared ecological destiny.",
        "question": "\"The Earth does not belong to man; man belongs to the Earth: Reconciling anthropocentric hubris with planetary boundaries.\"",
        "context": "Global environmental tipping points, IPCC assessments, biodiversity collapse, and the search for an ecocentric development paradigm.",
        "source_name": "Down to Earth",
        "source_headline": "Planetary Boundaries in the Anthropocene: Beyond Economic Growth to Ecological Regeneration",
        "source_url": "https://www.downtoearth.org.in/environment/planetary-boundaries-anthropocene-ecological-overshoot-89114",
        "micro_dimensions": [
            "Anthropocentric Paradox: Industrial exploitation treating nature as an infinite resource sink, breaching 6 of 9 planetary boundaries (Stockholm Resilience Centre)",
            "Indigenous & Ancient Wisdom: Chief Seattle's letter, Atharva Veda's Bhumi Sukta ('The Earth is my mother and I am her child')",
            "Ecocentric Transformation: Circular bio-economy, rights of nature jurisprudence, and Mission LiFE (Lifestyle for Environment)"
        ],
        "topper_benchmarks": "Cite Stockholm Resilience Centre planetary boundaries, Rachel Carson's 'Silent Spring', and the constitutional duty under Article 51A(g).",
        "directive_guidance": "1. Structure your essay using an overarching narrative progression: The Hubris of the Anthropocene -> The Fractured Covenant -> Indigenous Wisdom -> Pathways to Ecological Harmony. 2. Begin with a powerful allegorical opening referencing Chief Seattle's historic address or the mythological churning of the ocean (Samudra Manthan). 3. Dissect the economic orthodoxy of GDP-obsessed consumerism that treats ecological externalities as free inputs. 4. Unpack the scientific reality: Stockholm Resilience Centre findings on boundary breaches in climate, biosphere integrity, and nitrogen flows. 5. Integrate constitutional and indigenous ethics: Article 51A(g) compassion for living creatures, Gandhian trusteeship, and traditional sacred groves. 6. Conclude with a visionary manifesto for planetary stewardship, championing India's Mission LiFE as a template for civilizational survival."
    },
    {
        "id": "daw-ess-03",
        "paper": "ESSAY",
        "paper_name": "UPSC Mains Essay Paper (Democratic & Social Philosophy)",
        "marks": 125,
        "word_limit": 1100,
        "time_target": "75.0 Minutes",
        "directive": "Compose an in-depth socio-political essay",
        "syllabus_topic": "Essay: Political philosophy, constitutional democracy, social justice, and institutional vitality.",
        "question": "\"Democracy is not merely a form of government; it is primarily a mode of associated living and conjoint communicated experience.\"",
        "context": "Reflections on Dr. B.R. Ambedkar's philosophical vision of social democracy as the indispensable bedrock of political equality.",
        "source_name": "PRS Legislative Research",
        "source_headline": "Revisiting Ambedkar's Vision: Why Political Democracy Withers Without Social and Economic Fraternity",
        "source_url": "https://prsindia.org/theprsblog/ambedkar-social-democracy-constitutional-morality",
        "micro_dimensions": [
            "Doctrinal Foundation: B.R. Ambedkar's formulation in 'Annihilation of Caste' and John Dewey's educational philosophy of associated living",
            "The Great Contradiction: Political equality ('one man, one vote') contrasted against deep social inequality ('one man, one value' denied)",
            "Institutional Manifestation: Public reasoning, free press, civic fraternity, and dismantling caste and gender barriers at the grassroots"
        ],
        "topper_benchmarks": "Quote Dr. B.R. Ambedkar's final speech to the Constituent Assembly (25th November 1949) and Alexis de Tocqueville's observations on civic associations.",
        "directive_guidance": "1. Analyze democracy as an ethical way of life and social relationship rather than a mere periodic voting mechanism. 2. Open with Dr. B.R. Ambedkar's prophetic 25th November 1949 Constituent Assembly speech warning against entering 'a life of contradictions'. 3. Unpack John Dewey's and Ambedkar's insight that political institutions are hollow shells without social fraternity (maitri). 4. Examine structural barriers in contemporary India: caste endogamy, residential segregation, gender hierarchies, and rising wealth polarization. 5. Explore democratic revitalization: inclusive public spaces, community dialogue, deliberative Gram Sabhas, and empathetic public education. 6. Conclude with a resonant call for constitutional morality, affirming that democracy is an unending daily discipline of recognizing the equal moral worth of every human being."
    },
    {
        "id": "daw-ess-04",
        "paper": "ESSAY",
        "paper_name": "UPSC Mains Essay Paper (Economic Development & Equity)",
        "marks": 125,
        "word_limit": 1100,
        "time_target": "75.0 Minutes",
        "directive": "Compose a multi-dimensional developmental essay",
        "syllabus_topic": "Essay: Inclusive growth, economic development, structural inequality, and human capabilities.",
        "question": "\"Growth without equity is like a tree without roots: fragile, fleeting, and unsustainable.\"",
        "context": "Debates in economic literature on K-shaped post-crisis recovery, wealth concentration, and human capital formation.",
        "source_name": "Economic Survey & Union Budget",
        "source_headline": "Inclusive Prosperity: Balancing High Growth Multipliers with Universal Human Capital Investments",
        "source_url": "https://www.indiabudget.gov.in/economicsurvey/doc/inclusive_growth_human_capital.pdf",
        "micro_dimensions": [
            "Macroeconomic Diagnosis: High aggregate GDP expansion coexisting with stagnant real rural wages and high youth unemployment",
            "Theoretical Foundation: Amartya Sen's Capability Approach vs Arthur Lewis' dual-sector growth model",
            "Rooting the Tree: Quality primary public education, universal healthcare, gender wage parity, and progressive wealth taxation"
        ],
        "topper_benchmarks": "Cite Thomas Piketty's World Inequality Report, Amartya Sen's Capability Approach, and Mahbub ul Haq's Human Development paradigm.",
        "directive_guidance": "1. Deconstruct the organic metaphor: demonstrating how equity provides the stabilizing roots that anchor the canopy of economic growth. 2. Begin with an evocative opening contrasting glistening high-tech skylines with underfunded primary schools in rural hinterlands. 3. Detail the economic folly of exclusive growth: K-shaped trajectories, consumer demand collapses at the base of the pyramid, and social unrest. 4. Ground the analysis in economic doctrine: contrasting Simon Kuznets' inverted-U hypothesis with modern empirical realities documented by Piketty. 5. Detail concrete anchoring roots: radical investment in early childhood nutrition (POSHAN), public skilling infrastructure, and universal social security nets. 6. Conclude by asserting that true economic strength is measured not by the net worth of its top billionaires, but by the dignity, resilience, and capability of its humblest citizens."
    },
    {
        "id": "daw-ess-05",
        "paper": "ESSAY",
        "paper_name": "UPSC Mains Essay Paper (Technology, AI & Human Values)",
        "marks": 125,
        "word_limit": 1100,
        "time_target": "75.0 Minutes",
        "directive": "Compose a forward-looking philosophical essay",
        "syllabus_topic": "Essay: Science and technology, ethics of artificial intelligence, human condition, and civilizational future.",
        "question": "\"Artificial Intelligence may master the algorithms of calculation, but compassion remains the unwritten algorithm of human civilisation.\"",
        "context": "Generative AI proliferation, autonomous weapons, automation of labor, and the indispensable role of ethical human judgment.",
        "source_name": "NITI Aayog Reports & Official Documents",
        "source_headline": "AI for All: Embedding Constitutional Morality and Human Empathy into Algorithmic Governance",
        "source_url": "https://www.niti.gov.in/sites/default/files/2023-09/AI-For-All-Ethics-Human-Centric-AI.pdf",
        "micro_dimensions": [
            "Technological Prowess: Large Language Models, computational velocity, predictive precision, and pattern recognition",
            "The Human Void: Algorithmic bias, inability of machines to experience pain, remorse, empathy, or moral responsibility",
            "Ethical Governance: Human-in-the-loop mandates, preventing technological alienation, and cultivating emotional wisdom"
        ],
        "topper_benchmarks": "Quote Yuval Noah Harari's 'Homo Deus', cite NITI Aayog's '#AIforAll' framework, and reference Alan Turing's philosophical musings.",
        "directive_guidance": "1. Formulate a nuanced philosophical synthesis celebrating computational marvels while fiercely safeguarding the uniqueness of the human heart. 2. Open with an intriguing thought experiment: an AI court issuing flawless statistical verdicts versus a human judge discerning remorse and mercy. 3. Trace the explosive evolution from basic mechanical calculation to generative neural networks that mimic human creativity. 4. Interrogate the existential boundary: machines process data, but humans experience suffering, solidarity, moral duty, and love. 5. Warn against the dystopian hazard: reducing citizens to algorithmic data points in policing, welfare distribution, and military drones. 6. Conclude by affirming that the ultimate measure of our technological future will not be how intelligent our machines become, but how humane we remain."
    },
    {
        "id": "daw-ess-06",
        "paper": "ESSAY",
        "paper_name": "UPSC Mains Essay Paper (Geopolitics & Peace)",
        "marks": 125,
        "word_limit": 1100,
        "time_target": "75.0 Minutes",
        "directive": "Compose a strategic global affairs essay",
        "syllabus_topic": "Essay: International relations, geopolitics, global peace, multilateralism, and India's civilizational worldview.",
        "question": "\"In a fragmented world of competing nationalisms, strategic autonomy must be an instrument of peace, not isolation.\"",
        "context": "Global geopolitical polarization, Ukraine and West Asian conflicts, retreat of multilateralism, and India's role as a bridge-builder.",
        "source_name": "IDSA (Institute for Defence Studies and Analyses)",
        "source_headline": "Strategic Autonomy as Peace Diplomacy: Reimagining Multipolar Order Through India's Global South Leadership",
        "source_url": "https://www.idsa.in/monograph/strategic-autonomy-peace-diplomacy-india-world-order",
        "micro_dimensions": [
            "Fractured Landscape: Zero-sum bloc rivalries, weaponization of trade and financial networks, and breakdown of UN collective security",
            "True Nature of Autonomy: Moving beyond defensive non-alignment to active, constructive engagement without becoming a treaty subordinate",
            "Civilizational Blueprint: India's ethos of 'Vasudhaiva Kutumbakam' (One Earth, One Family, One Future) providing a moral compass for dialogue"
        ],
        "topper_benchmarks": "Quote Jawaharlal Nehru's non-alignment philosophy, cite S. Jaishankar's 'The India Way', and reference the New Delhi G20 Leaders' Declaration.",
        "directive_guidance": "1. Articulate a rigorous geopolitical thesis reframing strategic autonomy as active moral agency for conflict resolution rather than passive self-absorption. 2. Begin with a depiction of our fractured world: return of great-power conflict, economic nationalism, and the paralysis of the UN Security Council. 3. Clarify the conceptual essence: strategic autonomy is the refusal to surrender independent judgment to imperial hegemonies or military blocs. 4. Demonstrate how autonomy enables mediation: India serving as a trusted conduit between the West and Russia, and between developed nations and the Global South. 5. Critique the dangers of inward-looking isolationism versus proactive multilateral engagement in climate and vaccine diplomacy. 6. Conclude by invoking India's civilizational ideal of Vishwa Mitra, demonstrating that true strategic strength lies in the courage to wage peace."
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


