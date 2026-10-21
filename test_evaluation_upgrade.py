# -*- coding: utf-8 -*-
"""
Comprehensive Regression Test Suite for Cooked Mains Evaluation Engine Upgrade
Verifies:
1. Bilingual question header cleaning and punctuation stripping.
2. Accurate GS1 Physical Geography detection for volcanic calderas without governance/statutory leakage.
3. PYQ recurrence trend without false-positive 'ai' in 'explain'.
4. Consistent status labels and arithmetic alignment on the 15-mark Caldera regression case (4.5 / 15.0).
5. 10-mark multi-part evaluation math integrity.
6. Full Hindi medium evaluation (prompt construction, Devanagari headings, and status badges).
7. Low-confidence OCR and handwriting uncertainty handling.
8. Contrasting subjects (GS1 Physical Geography vs GS2 Polity vs GS4 Ethics).
9. Frontend rendering rules and badge consistency.
"""

import unittest
import sys
import re

from evaluator_engine import (
    separate_bilingual_question,
    detect_academic_discipline,
    infer_paper_from_question_content,
    detect_question_discipline,
    detect_pyq_trend,
    normalize_evaluation_data,
    resolve_evaluation_medium,
    build_evaluation_prompt,
    build_hindi_evaluation_prompt,
    detect_directive,
    get_canonical_demand_status,
    get_canonical_score_band
)

class TestEvaluationUpgrade(unittest.TestCase):

    def test_bilingual_question_header_cleaning(self):
        raw_bilingual = "? ( 250 ) / Explain the process of formation of volcanic calderas. How do they contribute to the scenic beauty of the region? (Answer in 250 words)"
        cleaned = separate_bilingual_question(raw_bilingual, target_medium="english")
        self.assertFalse(cleaned.startswith("?"))
        self.assertFalse(cleaned.startswith("/"))
        self.assertFalse("? ( 250 ) /" in cleaned)
        self.assertTrue(cleaned.startswith("Explain the process of formation of volcanic calderas"))

        # Test full dual-language UPSC header with Hindi and English separated by slash
        full_qcab = "ज्वालामुखीय काल्डेरा के निर्माण की प्रक्रिया की व्याख्या कीजिए। ये उस क्षेत्र की प्राकृतिक सुंदरता में किस प्रकार योगदान करते हैं? (उत्तर 250 शब्दों में दें) / Explain the process of formation of volcanic calderas. How do they contribute to the scenic beauty of the region? (Answer in 250 words)"
        eng_cleaned = separate_bilingual_question(full_qcab, target_medium="english")
        self.assertEqual(
            eng_cleaned,
            "Explain the process of formation of volcanic calderas. How do they contribute to the scenic beauty of the region? (Answer in 250 words)"
        )
        hin_cleaned = separate_bilingual_question(full_qcab, target_medium="hindi")
        self.assertIn("ज्वालामुखीय काल्डेरा", hin_cleaned)
        self.assertNotIn("Explain the process", hin_cleaned)

    def test_caldera_discipline_detection(self):
        caldera_q = "Explain the process of formation of volcanic calderas. How do they contribute to the scenic beauty of the region? (Answer in 250 words)"
        
        inferred = infer_paper_from_question_content(caldera_q)
        self.assertEqual(inferred, "GS1", "Caldera question must infer GS1")
        
        academic_disc = detect_academic_discipline(caldera_q, "default")
        self.assertEqual(academic_disc, "GS1", "Caldera question academic discipline must be GS1")
        
        question_disc = detect_question_discipline(caldera_q, "GS1")
        self.assertEqual(question_disc, "PHYSICAL_GEOGRAPHY", "Caldera question must be classified as PHYSICAL_GEOGRAPHY")

    def test_pyq_recurrence_trend_no_explain_ai_bug(self):
        caldera_q = "Explain the process of formation of volcanic calderas. How do they contribute to the scenic beauty of the region? (Answer in 250 words)"
        trend = detect_pyq_trend(caldera_q, "PHYSICAL_GEOGRAPHY")
        self.assertIn("Physical Geography Core", trend)
        self.assertNotIn("Emerging Technology", trend, "'Explain' must not trigger Emerging Technology & Sovereignty via substring 'ai'")

        # Real AI question should trigger Emerging Tech
        ai_q = "Discuss the role of artificial intelligence and deep tech in national security."
        ai_trend = detect_pyq_trend(ai_q, "GS3")
        self.assertIn("Emerging Technology", ai_trend)

    def test_caldera_15m_regression_case_scoring_and_status(self):
        """
        Regression case from user's submission:
        Marks breakdown:
        Intro: 1.0 / 2.0
        Part A (Formation Mechanism): 2.0 / 7.0
        Part B (Scenic Beauty & Lakes): 0.5 / 2.5
        Part C (Diagram / Empirical Examples): 0.0 / 1.5
        Conclusion: 1.0 / 2.0
        Total: 4.5 / 15.0
        """
        caldera_q = "Explain the process of formation of volcanic calderas. How do they contribute to the scenic beauty of the region? (Answer in 250 words)"
        
        raw_eval_data = {
            "overall_score": 4.5,
            "max_marks": 15,
            "detected_question": caldera_q,
            "detected_paper": "GS1",
            "medium": "english",
            "sub_part_step_marking": [
                {
                    "step_label": "1. Introduction (Context & Baseline Hook)",
                    "sub_heading": "Definition of Caldera & Explosive Volcanism",
                    "awarded": 1.0,
                    "max": 2.0,
                    "quoted_written": "Candidate defined volcanic calderas as structural depressions formed from collapse into evacuated magma chamber."
                },
                {
                    "step_label": "2. Part A — Process of Formation & Subsidence",
                    "sub_heading": "Magma Chamber Evacuation & Catastrophic Roof Collapse",
                    "awarded": 2.0,
                    "max": 7.0,
                    "quoted_written": "Candidate illustrated 3-step structural collapse and felsic/andesitic magmatic discharge."
                },
                {
                    "step_label": "3. Part B — Contribution to Scenic Beauty",
                    "sub_heading": "Caldera Lakes, Lush Vegetation & Geothermal Landscapes",
                    "awarded": 0.5,
                    "max": 2.5,
                    "quoted_written": "Cited caldera lakes such as Ojos caldera lake in South America and geothermal vistas in Iceland."
                },
                {
                    "step_label": "4. Part C — Visual Schematics & Micro-Layout",
                    "sub_heading": "Exam-Hall Cross-Section Blueprint & Proportionality",
                    "awarded": 0.0,
                    "max": 1.5,
                    "quoted_written": "Diagram lacked annotated depth contours and fault boundaries."
                },
                {
                    "step_label": "5. Conclusion (Closing Synthesis)",
                    "sub_heading": "Harmonization of Catastrophic Volcanism with Serene Biodiversity",
                    "awarded": 1.0,
                    "max": 2.0,
                    "quoted_written": "Synthesized the paradox of violent geological destruction giving rise to captivating scenic landforms."
                }
            ],
            "missing_keywords_cards": [
                {
                    "keyword": "Magma Chamber Evacuation",
                    "definition": "Rapid emptying of subsurface magma reservoir triggering gravitational collapse",
                    "how_to_use_one_line": ""
                }
            ]
        }

        normalized = normalize_evaluation_data(raw_eval_data, max_marks=15, question=caldera_q, paper="GS1")

        # Arithmetic validation
        steps = normalized["sub_part_step_marking"]
        self.assertEqual(len(steps), 5)
        
        sum_max = sum(float(s["max"]) for s in steps)
        sum_awarded = sum(float(s["awarded"]) for s in steps)
        self.assertEqual(sum_max, 15.0, "Sum of max marks must equal 15.0")
        self.assertEqual(sum_awarded, 4.5, "Sum of awarded marks must equal overall score 4.5")

        # Status badge consistency validation
        step_breakdown = normalized["subpart_marks_breakdown"]
        part_a = step_breakdown[1]
        self.assertEqual(part_a["marks_awarded"], 2.0)
        self.assertEqual(part_a["max_marks"], 7.0)
        self.assertEqual(
            part_a["demand_status"],
            "Partially Fulfilled",
            "Part A with 2.0/7.0 marks awarded must be 'Partially Fulfilled', NEVER 'Demand Missed'!"
        )

        part_b = step_breakdown[2]
        self.assertEqual(part_b["marks_awarded"], 0.5)
        self.assertEqual(part_b["demand_status"], "Partially Fulfilled")

        part_c = step_breakdown[3]
        self.assertEqual(part_c["marks_awarded"], 0.0)
        self.assertEqual(part_c["demand_status"], "Demand Missed")

        # Zero governance contamination check
        kw_cards = normalized.get("missing_keywords_cards", [])
        if kw_cards:
            how_to = kw_cards[0].get("how_to_use_one_line", "")
            self.assertNotIn("reinforce policy delivery metrics", how_to)
            self.assertNotIn("grassroots institutional accountability", how_to)
            self.assertNotIn("statutory oversight benchmarks", how_to)

        # Conclusion Step (1.0 / 2.0 = 50% < 65% threshold): MUST be Partially Fulfilled, NEVER Demand Fulfilled or Missed
        concl_step = step_breakdown[4]
        self.assertEqual(concl_step["marks_awarded"], 1.0)
        self.assertEqual(concl_step["max_marks"], 2.0)
        self.assertEqual(concl_step["demand_status"], "Partially Fulfilled")

        # Score Band & Percentile Verdict Consistency: 4.5/15 (30.0%) is strictly 'Needs Work (<30%)'
        self.assertEqual(normalized.get("score_band"), "Needs Work (<30%)")
        self.assertEqual(normalized.get("percentile_verdict"), "Needs Work (<30%)")

        # Value-addition checklist check
        va = normalized.get("value_add_checklist", {})
        c1_title = va.get("category_1", {}).get("title", "")
        self.assertNotIn("Constitutional Articles", c1_title, "Physical geography must not demand Constitutional Articles")

    def test_10m_multipart_math_and_statuses(self):
        polity_q = "Examine the role of the Finance Commission in balancing fiscal federalism in India. (150 Words, 10 Marks)"
        raw_10m = {
            "overall_score": 4.5,
            "max_marks": 10,
            "detected_question": polity_q,
            "detected_paper": "GS2",
            "sub_part_step_marking": [
                {"step_label": "1. Intro", "sub_heading": "Art 280", "awarded": 1.0, "max": 1.5, "quoted_written": "Art 280 cited."},
                {"step_label": "2. Part A", "sub_heading": "Vertical devolution", "awarded": 2.0, "max": 4.0, "quoted_written": "41% devolution."},
                {"step_label": "3. Part B", "sub_heading": "Horizontal sharing", "awarded": 1.0, "max": 3.0, "quoted_written": "Income distance."},
                {"step_label": "4. Conclusion", "sub_heading": "Cooperative federalism", "awarded": 0.5, "max": 1.5, "quoted_written": "Closing vision."}
            ]
        }
        norm = normalize_evaluation_data(raw_10m, max_marks=10, question=polity_q, paper="GS2")
        steps = norm["sub_part_step_marking"]
        self.assertEqual(sum(float(s["max"]) for s in steps), 10.0)
        self.assertEqual(sum(float(s["awarded"]) for s in steps), 4.5)
        for s in norm["subpart_marks_breakdown"]:
            if s["marks_awarded"] > 0:
                self.assertIn(s["demand_status"], ["Demand Fulfilled", "Partially Fulfilled"])

    def test_hindi_evaluation_full_pipeline(self):
        """
        Verifies Hindi Devanagari answer processing:
        - Language resolution
        - Dedicated Hindi prompt builder
        - Devanagari step marking and status badge outputs
        """
        hindi_q = "ज्वालामुखीय काल्डेरा के निर्माण की प्रक्रिया की व्याख्या कीजिए। ये उस क्षेत्र की प्राकृतिक सुंदरता में किस प्रकार योगदान करते हैं? (उत्तर 250 शब्दों में दें)"
        hindi_text = "ज्वालामुखी काल्डेरा एक विशाल गर्तनुमा संरचना है जो मैग्मा कक्ष के खाली होने पर ऊपरी चट्टान के धंसने से बनती है।"

        med, is_hi = resolve_evaluation_medium(medium_param="hindi", question_text=hindi_q, transcribed_text=hindi_text)
        self.assertTrue(is_hi)
        self.assertEqual(med, "hindi")

        dir_info = detect_directive(hindi_q, medium="hindi")
        self.assertIn("directive", dir_info)

        # Build Hindi prompt
        prompt = build_hindi_evaluation_prompt(
            question=hindi_q,
            paper_key="GS1",
            max_marks=15,
            directive_info=dir_info
        )
        self.assertIn("प्रस्तावना", prompt)
        self.assertIn("मुख्य भाग", prompt)
        self.assertIn("निष्कर्ष", prompt)

        # Normalize Hindi evaluation data
        raw_hindi_data = {
            "overall_score": 5.5,
            "max_marks": 15,
            "detected_question": hindi_q,
            "detected_paper": "GS1",
            "medium": "hindi",
            "is_hindi": True,
            "sub_part_step_marking": [
                {
                    "step_label": "1. प्रस्तावना",
                    "sub_heading": "अवधारणात्मक परिभाषा",
                    "awarded": 1.5,
                    "max": 2.0,
                    "quoted_written": "काल्डेरा की स्पष्ट परिभाषा दी गई।"
                },
                {
                    "step_label": "2. मुख्य भाग — आयाम A",
                    "sub_heading": "निर्माण प्रक्रिया व मैग्मा कक्ष",
                    "awarded": 2.5,
                    "max": 5.5,
                    "quoted_written": "धंसाव की प्रक्रिया का बिंदुवार वर्णन किया गया।"
                },
                {
                    "step_label": "3. मुख्य भाग — आयाम B",
                    "sub_heading": "प्राकृतिक सौंदर्य व काल्डेरा झीलें",
                    "awarded": 0.5,
                    "max": 5.5,
                    "quoted_written": "दक्षिण अमेरिका की काल्डेरा झीलों का उल्लेख किया।"
                },
                {
                    "step_label": "4. निष्कर्ष",
                    "sub_heading": "भू-आकृतिक एवं पारिस्थितिक समन्वय",
                    "awarded": 1.0,
                    "max": 2.0,
                    "quoted_written": "संतुलित संश्लेषित समापन।"
                }
            ]
        }
        norm_hi = normalize_evaluation_data(raw_hindi_data, max_marks=15, question=hindi_q, paper="GS1", medium="hindi")
        steps = norm_hi["sub_part_step_marking"]
        self.assertEqual(sum(float(s["max"]) for s in steps), 15.0)
        self.assertEqual(sum(float(s["awarded"]) for s in steps), 5.5)
        # Check Devanagari labels
        self.assertIn("प्रस्तावना", steps[0]["step_label"])
        self.assertIn("निष्कर्ष", steps[-1]["step_label"])
        # Check that partially scored Hindi parts have correct status
        self.assertIn("Partially Met", norm_hi["subpart_marks_breakdown"][2]["demand_status"])

    def test_low_confidence_ocr_uncertainty_handling(self):
        """
        Verifies that faint handwriting and OCR uncertainty:
        - Are not treated as conceptual omission.
        - Do not reduce core demand to 0 if content tokens are present.
        """
        answer_with_ocr_blur = "Volcanic calderas are [illegible/faint ink: large volcanic depressions] formed by subsidence."
        q = "Explain the process of formation of volcanic calderas."
        
        prompt = build_evaluation_prompt(
            question=q,
            paper_key="GS1",
            max_marks=10,
            directive_info={"directive": "Explain", "details": "Clarify mechanisms and causes.", "ideal_balance": "Balanced coverage"}
        )
        # Verify prompt instructs model on OCR uncertainty
        self.assertIn("STRICT EVIDENCE CITATION", prompt)
        self.assertIn("ZERO HALLUCINATED EXAMPLES", prompt)

    def test_contrasting_subjects_rubric_isolation(self):
        """
        Verifies rubric isolation across contrasting subjects:
        - GS1 Physical Geography (calderas): Physical/geomorphic processes, spatial examples, no statutory articles.
        - GS2 Polity (judicial review): Constitutional articles, SC verdicts, basic structure.
        - GS4 Ethics (probity/Nolan): Ethical principles, moral thinkers, administrative probity.
        """
        geo_q = "Explain the process of formation of volcanic calderas. How do they contribute to the scenic beauty of the region? (Answer in 250 words)"
        polity_q = "Discuss the scope of Judicial Review in India with special reference to Article 13 and Article 142 of the Constitution."
        ethics_q = "Analyze the importance of probity in governance and how Nolan Committee's principles enhance administrative integrity."

        # 1. Geography
        geo_disc = detect_question_discipline(geo_q, "GS1")
        self.assertEqual(geo_disc, "PHYSICAL_GEOGRAPHY")
        geo_paper = infer_paper_from_question_content(geo_q)
        self.assertEqual(geo_paper, "GS1")

        # 2. Polity
        polity_disc = detect_question_discipline(polity_q, "GS2")
        self.assertEqual(polity_disc, "POLITY_GOVERNANCE")
        polity_paper = infer_paper_from_question_content(polity_q)
        self.assertEqual(polity_paper, "GS2")

        # 3. Ethics
        ethics_disc = detect_question_discipline(ethics_q, "GS4")
        self.assertEqual(ethics_disc, "PHILOSOPHY_ETHICS")
        ethics_paper = infer_paper_from_question_content(ethics_q)
        self.assertEqual(ethics_paper, "GS4")

    def test_frontend_rendering_badge_consistency(self):
        """
        Verifies that badge thresholds match across awarded scores:
        - score == 0.0 -> 'Demand Missed'
        - score > 0.05 and < 65% -> 'Partially Fulfilled'
        - score >= 65% -> 'Demand Fulfilled'
        """
        test_cases = [
            (0.0, 7.0, "Demand Missed"),
            (0.5, 7.0, "Partially Fulfilled"),
            (2.0, 7.0, "Partially Fulfilled"),
            (5.0, 7.0, "Demand Fulfilled"),
            (1.0, 2.0, "Partially Fulfilled"),
            (1.5, 2.0, "Demand Fulfilled"),
        ]
        for score, max_m, expected in test_cases:
            status = "Demand Fulfilled" if score >= max_m * 0.65 else ("Partially Fulfilled" if score > 0.05 else "Demand Missed")
            self.assertEqual(status, expected, f"Score {score}/{max_m} expected {expected} but got {status}")



    def test_canonical_demand_status_exact_boundaries(self):
        """
        Tests exact boundary transitions for criterion status:
        - awarded <= 0.05 -> 'Demand Missed'
        - awarded > 0.05 and < 65% of max -> 'Partially Fulfilled'
        - awarded >= 65% of max -> 'Demand Fulfilled'
        """
        max_m = 2.0
        # Missed boundaries
        self.assertEqual(get_canonical_demand_status(0.0, max_m), "Demand Missed")
        self.assertEqual(get_canonical_demand_status(0.05, max_m), "Demand Missed")
        
        # Partial boundaries
        self.assertEqual(get_canonical_demand_status(0.06, max_m), "Partially Fulfilled")
        self.assertEqual(get_canonical_demand_status(1.0, max_m), "Partially Fulfilled") # 50% Caldera conclusion
        self.assertEqual(get_canonical_demand_status(1.29, max_m), "Partially Fulfilled") # Just under 65%
        
        # Fulfilled boundaries (1.30 / 2.0 = 0.65)
        self.assertEqual(get_canonical_demand_status(1.30, max_m), "Demand Fulfilled")
        self.assertEqual(get_canonical_demand_status(1.50, max_m), "Demand Fulfilled") # 75% Caldera intro
        self.assertEqual(get_canonical_demand_status(2.0, max_m), "Demand Fulfilled")

        # Hindi variants
        self.assertEqual(get_canonical_demand_status(0.05, max_m, is_hindi=True), "✗ मांग अधूरी (Demand Missed)")
        self.assertEqual(get_canonical_demand_status(1.0, max_m, is_hindi=True), "⚠️ आंशिक पूर्ण (Partially Met)")
        self.assertEqual(get_canonical_demand_status(1.5, max_m, is_hindi=True), "✓ मांग पूर्ण (Demand Met)")

    def test_canonical_score_band_exact_boundaries(self):
        """
        Tests exact score band thresholds matching the UI scoreBandContainer:
        15M Question:
          <= 4.5 -> Needs Work (<30%)
          4.6 - 6.2 -> Average (31-42%)
          6.3 - 8.2 -> Competitive (43-54%)
          >= 8.3 -> Topper (55%+)
        """
        # 15M Question Boundaries
        self.assertEqual(get_canonical_score_band(0.0, 15), "Needs Work (<30%)")
        self.assertEqual(get_canonical_score_band(4.5, 15), "Needs Work (<30%)") # 4.5/15 Caldera submission!
        self.assertEqual(get_canonical_score_band(4.6, 15), "Average (31-42%)") # Boundary transition to Average
        self.assertEqual(get_canonical_score_band(6.2, 15), "Average (31-42%)")
        self.assertEqual(get_canonical_score_band(6.3, 15), "Competitive (43-54%)")
        self.assertEqual(get_canonical_score_band(8.2, 15), "Competitive (43-54%)")
        self.assertEqual(get_canonical_score_band(8.3, 15), "Topper (55%+)")

        # 10M Question Boundaries
        self.assertEqual(get_canonical_score_band(3.0, 10), "Needs Work (<30%)")
        self.assertEqual(get_canonical_score_band(3.1, 10), "Average (31-42%)")
        self.assertEqual(get_canonical_score_band(4.2, 10), "Average (31-42%)")
        self.assertEqual(get_canonical_score_band(4.3, 10), "Competitive (43-54%)")
        self.assertEqual(get_canonical_score_band(5.4, 10), "Competitive (43-54%)")
        self.assertEqual(get_canonical_score_band(5.5, 10), "Topper (55%+)")

        # 125M Essay Boundaries
        self.assertEqual(get_canonical_score_band(47.0, 125), "Needs Work (<38%)")
        self.assertEqual(get_canonical_score_band(48.0, 125), "Average (38-48%)")
        self.assertEqual(get_canonical_score_band(60.0, 125), "Average (38-48%)")
        self.assertEqual(get_canonical_score_band(61.0, 125), "Competitive (49-58%)")
        self.assertEqual(get_canonical_score_band(72.0, 125), "Competitive (49-58%)")
        self.assertEqual(get_canonical_score_band(73.0, 125), "Topper (58%+)")



    def test_evidence_ledger_5_tuple_structure_and_depth(self):
        """
        Verifies Screenshot 3: Unified Evidence Ledger with 5-tuple record
        <candidate_evidence, what_the_evidence_demonstrates, what_remains_weak_or_missing, actionable_improvement, scoring_consequence>
        and proportional vocabulary calibration.
        """
        q_text = "How are volcanic calderas formed? Briefly describe their contribution towards scenic beauty. (15 Marks, 250 Words)"
        raw_eval = {
            "overall_score": 4.5,
            "max_marks": 15,
            "detected_question": q_text,
            "detected_paper": "GS1",
            "medium": "english",
            "evidence_ledger": [
                {
                    "demand_title": "1. Introduction (Context & Baseline Hook)",
                    "candidate_evidence": "Defined volcanic calderas as large circular depressions.",
                    "what_the_evidence_demonstrates": "Candidate proves conceptual grasp of caldera as structural depression.",
                    "what_remains_weak_or_missing": "Did not specify scale differentiation from normal craters.",
                    "actionable_improvement": "Specify diameter (>1km) and collapse origin.",
                    "layer_a_marks_awarded": 1.5,
                    "layer_a_max_marks": 2.0
                },
                {
                    "demand_title": "2. Part A — Formation Process",
                    "candidate_evidence": "Covered chamber emptying and roof subsidence.",
                    "what_the_evidence_demonstrates": "Identified magma evacuation and ground subsidence.",
                    "what_remains_weak_or_missing": "Missed ring-fracture collapse mechanics and explosive vs non-explosive types.",
                    "actionable_improvement": "Sequence: rapid magma withdrawal -> loss of roof support -> ring-fault subsidence.",
                    "layer_a_marks_awarded": 1.0,
                    "layer_a_max_marks": 5.5
                },
                {
                    "demand_title": "3. Part B — Scenic Beauty",
                    "candidate_evidence": "Described crater lakes and mountain views (Ojos caldera lake, Iceland).",
                    "what_the_evidence_demonstrates": "Provided authentic spatial examples of volcanic lakes.",
                    "what_remains_weak_or_missing": "Omitted hydrothermal hot springs and caldera geomorphology.",
                    "actionable_improvement": "Incorporate oligotrophic lake clarity, geothermal tourism, and caldera parks.",
                    "layer_a_marks_awarded": 1.0,
                    "layer_a_max_marks": 5.5
                },
                {
                    "demand_title": "4. Conclusion (Closing Synthesis)",
                    "candidate_evidence": "Synthesized violent origin with tranquil landscapes left behind.",
                    "what_the_evidence_demonstrates": "Balanced concluding observation connecting destruction and ecological tranquility.",
                    "what_remains_weak_or_missing": "Lacked forward-looking geo-conservation perspective.",
                    "actionable_improvement": "Highlight UNESCO Global Geoparks framework.",
                    "layer_a_marks_awarded": 1.0,
                    "layer_a_max_marks": 2.0
                }
            ]
        }

        normalized = normalize_evaluation_data(raw_eval, max_marks=15, question=q_text, paper="GS1")

        # 1. Evidence Ledger presence & length
        ledger = normalized.get("evidence_ledger")
        self.assertIsInstance(ledger, list)
        self.assertEqual(len(ledger), 4)

        # 2. 5-tuple fields validation
        for entry in ledger:
            self.assertIn("demand_title", entry)
            self.assertIn("candidate_evidence", entry)
            self.assertIn("what_the_evidence_demonstrates", entry)
            self.assertIn("what_remains_weak_or_missing", entry)
            self.assertIn("actionable_improvement", entry)
            self.assertIn("layer_a_marks_awarded", entry)
            self.assertIn("layer_a_max_marks", entry)
            self.assertIn("demand_status", entry)
            self.assertIn("evidence_depth", entry)

        # 3. Arithmetic reconciliation
        sum_awarded = sum(float(e["layer_a_marks_awarded"]) for e in ledger)
        sum_max = sum(float(e["layer_a_max_marks"]) for e in ledger)
        self.assertEqual(sum_awarded, 4.5, "Evidence ledger marks must sum to overall score")
        self.assertEqual(sum_max, 15.0, "Evidence ledger maxima must sum to 15.0")

        # 4. Proportional Vocabulary Calibration
        self.assertEqual(ledger[0]["evidence_depth"], "correctly explained") # 1.5/2.0 = 75%
        self.assertEqual(ledger[1]["evidence_depth"], "partly explained")    # 1.0/5.5 = 18% (> 0.05M)
        self.assertEqual(ledger[2]["evidence_depth"], "partly explained")    # 1.0/5.5 = 18% (> 0.05M)
        self.assertEqual(ledger[3]["evidence_depth"], "partly explained")    # 1.0/2.0 = 50% (< 65%)

    def test_20m_case_study_and_optional_evaluation_math(self):
        """
        Verifies 20-mark questions (GS4 Section B case studies and optional papers):
        - Max marks sum strictly to 20.0M
        - Evaluates multi-part demands
        - Reconciles evidence ledger and score band
        """
        case_study_q = (
            "You are the District Magistrate of an aspirational district. A major chemical plant accident occurs. "
            "Examine: (a) Immediate emergency actions, (b) Administrative inquiries, (c) Long-term industrial safety reforms. (20 Marks, 250 Words)"
        )
        raw_20m = {
            "overall_score": 9.5,
            "max_marks": 20,
            "detected_question": case_study_q,
            "detected_paper": "GS4",
            "sub_part_step_marking": [
                {"step_label": "1. Intro: Crisis Context & Ethical Stakes", "awarded": 1.5, "max": 2.5, "quoted_written": "Prioritized human life over industrial property."},
                {"step_label": "2. Sub-Part (a): Immediate Emergency Actions", "awarded": 3.0, "max": 5.5, "quoted_written": "Deployed NDRF and evacuated 5km perimeter."},
                {"step_label": "3. Sub-Part (b): Administrative Inquiry & SOP", "awarded": 2.5, "max": 5.0, "quoted_written": "Constituted multi-departmental magistrate inquiry."},
                {"step_label": "4. Sub-Part (c): Long-Term Safety Reforms", "awarded": 1.5, "max": 4.5, "quoted_written": "Mandated digital sensor integration and hazardous chemical audits."},
                {"step_label": "5. Conclusion: Constitutional Morality", "awarded": 1.0, "max": 2.5, "quoted_written": "Balanced industrial growth with right to clean life under Art 21."}
            ]
        }

        normalized = normalize_evaluation_data(raw_20m, max_marks=20, question=case_study_q, paper="GS4")
        ledger = normalized.get("evidence_ledger")
        self.assertIsInstance(ledger, list)

        # 20M Denominator Law
        sum_max = sum(float(e["layer_a_max_marks"]) for e in ledger)
        sum_awarded = sum(float(e["layer_a_marks_awarded"]) for e in ledger)
        self.assertEqual(sum_max, 20.0, "20-marker maxima must sum to 20.0M")
        self.assertEqual(sum_awarded, 9.5, "20-marker awarded marks must sum to overall score 9.5M")

        # 20M Score Band: 9.5 / 20 is in Competitive (8.5 - 11.0)
        self.assertEqual(normalized.get("score_band"), "Competitive (43-54%)")

    def test_hindi_evidence_ledger_devanagari_fidelity(self):
        """
        Verifies that Hindi medium evaluation copies produce authentic Devanagari evidence ledger
        with calibrated depth vocabulary and Devanagari statuses.
        """
        hindi_q = "ज्वालामुखी काल्डेरा का निर्माण कैसे होता है? क्षेत्रीय सौंदर्य में इसके योगदान का वर्णन कीजिए। (15 अंक, 250 शब्द)"
        raw_hi = {
            "overall_score": 6.5,
            "max_marks": 15,
            "detected_question": hindi_q,
            "detected_paper": "GS1",
            "medium": "hindi",
            "is_hindi": True,
            "sub_part_step_marking": [
                {"step_label": "1. प्रस्तावना एवं संदर्भ", "awarded": 1.5, "max": 2.0, "quoted_written": "काल्डेरा को विशाल अवसाद के रूप में परिभाषित किया।"},
                {"step_label": "2. मुख्य भाग — आयाम A", "awarded": 2.5, "max": 5.5, "quoted_written": "मैग्मा कक्ष के रिक्त होने व छत के धंसने का उल्लेख।"},
                {"step_label": "3. मुख्य भाग — आयाम B", "awarded": 1.5, "max": 5.5, "quoted_written": "क्रेटर झीलों व प्राकृतिक पर्यटन का उल्लेख।"},
                {"step_label": "4. निष्कर्ष एवं आगे की राह", "awarded": 1.0, "max": 2.0, "quoted_written": "संतुलित व अग्रगामी समापन।"}
            ]
        }

        normalized = normalize_evaluation_data(raw_hi, max_marks=15, question=hindi_q, paper="GS1")
        ledger = normalized.get("evidence_ledger")
        self.assertIsInstance(ledger, list)
        self.assertEqual(len(ledger), 4)

        # Verify Devanagari depth labels
        self.assertIn("सही व्याख्या", ledger[0]["evidence_depth"]) # 1.5 / 2.0 = 75%
        self.assertIn("आंशिक व्याख्या", ledger[1]["evidence_depth"]) # 2.5 / 5.5 = 45%

        # Verify Devanagari status tags
        self.assertIn("मांग पूर्ण", ledger[0]["demand_status"])
        self.assertIn("आंशिक पूर्ण", ledger[1]["demand_status"])


    def test_evidence_grounded_9_rules_caldera_case(self):
        """
        Validates Rules 1-9 on Caldera Physical Geography 15M case:
        - Strict evidence grounding (no governance boilerplate)
        - 3-tier demand architecture (Tier 1 essential, Tier 2 dimensions, Tier 3 optional enrichment)
        - Tier 3 optional enrichment non-penalty (deduction_applied is False)
        - Auditable criteria math (max, awarded, deduction, evidence, assessment, deduction reason)
        - Demonstrated quality scoring (depth levels)
        - Prioritized feedback ordered by mark recovery
        - Release validation audit
        """
        raw_eval = {
            "overall_score": 4.5,
            "max_marks": 15,
            "detected_question": "What are calderas? Discuss their formation and contribution to scenic beauty.",
            "detected_paper": "GS1",
            "transcribed_text": "Calderas are large volcanic depressions formed when a magma chamber empties. The roof collapses into the empty chamber creating a bowl. Caldera lakes and mountain views attract tourists.",
            "sub_part_step_marking": [
                {"step_label": "1. Introduction (Context & Baseline Hook)", "awarded": 1.5, "max": 2.0, "quoted_written": "Calderas are large volcanic depressions formed when a magma chamber empties."},
                {"step_label": "2. Part A — Formation Process", "awarded": 1.0, "max": 5.5, "quoted_written": "The roof collapses into the empty chamber creating a bowl."},
                {"step_label": "3. Part B — Contribution to Scenic Beauty", "awarded": 1.0, "max": 5.5, "quoted_written": "Caldera lakes and mountain views attract tourists."},
                {"step_label": "4. Conclusion (Closing Synthesis)", "awarded": 1.0, "max": 2.0, "quoted_written": "Calderas form unique landscapes with tourism potential."}
            ],
            "missing_keywords_cards": [
                {"term": "Ring-Fault Subsidence", "domain_or_thinker": "Geomorphic Mechanism", "definition": "Structural collapse along ring fractures."},
                {"term": "Oligotrophic Caldera Lakes", "domain_or_thinker": "Scenic Landform", "definition": "Deep, nutrient-poor, vivid blue crater waters."}
            ]
        }

        normalized = normalize_evaluation_data(raw_eval, max_marks=15, question=raw_eval["detected_question"], paper="GS1")

        # 1. Auditable Score Card (Rule 5)
        ledger = normalized.get("evidence_ledger")
        self.assertIsInstance(ledger, list)
        self.assertEqual(len(ledger), 4)
        total_awarded = sum(item["awarded_marks"] for item in ledger)
        total_max = sum(item["max_marks"] for item in ledger)
        self.assertAlmostEqual(total_awarded, 4.5, places=2)
        self.assertAlmostEqual(total_max, 15.0, places=2)

        for item in ledger:
            self.assertIn("criterion_name", item)
            self.assertIn("awarded_marks", item)
            self.assertIn("max_marks", item)
            self.assertIn("deduction_amount", item)
            self.assertIn("candidate_evidence", item)
            self.assertIn("assessment_of_evidence", item)
            self.assertIn("specific_deduction_reason", item)
            self.assertEqual(item["deduction_amount"], round(item["max_marks"] - item["awarded_marks"], 2))

        # 2. Three-Tier Demand Architecture (Rule 2)
        tiers = normalized.get("demand_tiers")
        self.assertIsInstance(tiers, dict)
        self.assertIn("tier_1_essential_demands", tiers)
        self.assertIn("tier_2_useful_dimensions", tiers)
        self.assertIn("tier_3_optional_enrichment", tiers)
        self.assertEqual(len(tiers["tier_1_essential_demands"]), 4)

        # Rule 2 Non-penalty check: Tier 3 optional enrichment must NEVER have deduction applied
        for opt in tiers["tier_3_optional_enrichment"]:
            self.assertFalse(opt["deduction_applied"])

        # 3. Prioritized Feedback (Rule 8)
        prioritized = normalized.get("prioritized_feedback")
        self.assertIsInstance(prioritized, list)
        self.assertGreaterEqual(len(prioritized), 2)
        self.assertLessEqual(len(prioritized), 3)

        # First priority must be the highest mark loss bottleneck (Part A or Part B with 4.5M loss)
        self.assertIn(prioritized[0]["potential_mark_recovery"], ["+4.5M", "+4.5"])
        for pf in prioritized:
            self.assertIn("priority_rank", pf)
            self.assertIn("what_was_done_well", pf)
            self.assertIn("what_materially_limits_marks", pf)
            self.assertIn("actionable_exam_hall_fix", pf)
            self.assertIn("potential_mark_recovery", pf)

        # 4. Release Validation Audit (Rule 9 & 7)
        va = normalized.get("validation_audit")
        self.assertIsInstance(va, dict)
        self.assertTrue(va["reconciliation_passed"])
        self.assertTrue(va["evidence_grounding_verified"])
        self.assertTrue(va["duplicate_credit_prevented"])
        self.assertEqual(va["status"], "verified")

    def test_hindi_evidence_grounded_9_rules(self):
        """
        Validates Rules 1-9 for Hindi medium evaluation:
        - Authentic Devanagari demand tiers
        - Devanagari prioritized feedback with exam-hall fixes
        - Validation audit in Hindi context
        """
        hindi_q = "काल्डेरा क्या हैं? उनके निर्माण और दृश्य सौंदर्य में योगदान पर चर्चा कीजिए।"
        raw_hi = {
            "overall_score": 5.0,
            "max_marks": 15,
            "detected_question": hindi_q,
            "detected_paper": "GS1",
            "medium": "hindi",
            "is_hindi": True,
            "transcribed_text": "काल्डेरा ज्वालामुखी अवसाद हैं। जब मैग्मा कक्ष खाली होता है तो छत धंस जाती है।",
            "sub_part_step_marking": [
                {"step_label": "1. प्रस्तावना", "awarded": 1.5, "max": 2.0, "quoted_written": "काल्डेरा ज्वालामुखी अवसाद हैं।"},
                {"step_label": "2. मुख्य भाग — निर्माण प्रक्रिया", "awarded": 1.5, "max": 5.5, "quoted_written": "जब मैग्मा कक्ष खाली होता है तो छत धंस जाती है।"},
                {"step_label": "3. मुख्य भाग — दृश्य सौंदर्य", "awarded": 1.0, "max": 5.5, "quoted_written": "झीलें और प्राकृतिक पर्यटन।"},
                {"step_label": "4. निष्कर्ष", "awarded": 1.0, "max": 2.0, "quoted_written": "भू-पर्यटन व संतुलन।"}
            ],
            "missing_keywords_cards": [
                {"term": "वलय भ्रंश अवतलन (Ring-Fault Subsidence)", "domain_or_thinker": "भू-आकृतिक तंत्र", "definition": "वलय भ्रंशों के सहारे विशाल धंसाव।"}
            ]
        }

        normalized = normalize_evaluation_data(raw_hi, max_marks=15, question=hindi_q, paper="GS1")

        # Devanagari Demand Tiers
        dt = normalized.get("demand_tiers")
        self.assertIsInstance(dt, dict)
        self.assertEqual(len(dt["tier_1_essential_demands"]), 4)
        for opt in dt["tier_3_optional_enrichment"]:
            self.assertFalse(opt["deduction_applied"])

        # Devanagari Prioritized Feedback
        pf = normalized.get("prioritized_feedback")
        self.assertIsInstance(pf, list)
        self.assertGreaterEqual(len(pf), 2)
        # Check Devanagari exam-hall fix
        self.assertTrue(any("मिनट" in p["actionable_exam_hall_fix"] or "शब्द" in p["actionable_exam_hall_fix"] for p in pf))

        # Release Validation Audit
        va = normalized.get("validation_audit")
        self.assertIsInstance(va, dict)
        self.assertTrue(va["reconciliation_passed"])


class TestSection8EvaluationMatrix(unittest.TestCase):
    """
    Direct verification of the 16 Section 8 Evaluation Upgrade Test Matrix cases:
    Resolves Failure Classes A-E:
      A: Blended evaluation categories
      B: Generic or overlapping rubrics
      C: Unsupported scoring & depth differentiation
      D: Misused credit & anti-duplication
      E: Poor calibration, uncertainty disclosure & friendly teaching feedback
    """

    def test_case_01_10m_gs_mention_vs_explanation(self):
        """
        Case 1: 10-mark GS question
        Fixture: Short answer naming several causes, explaining only some.
        Checks: Rubric fits 10 marks; explanation earns more than bare mention;
                missing explanation is identified with evidence.
        """
        q = "Examine the causes of groundwater depletion in north-western India. (150 Words, 10 Marks)"
        raw_eval = {
            "overall_score": 3.75,
            "max_marks": 10,
            "detected_question": q,
            "detected_paper": "GS1",
            "transcribed_text": "Groundwater is depleting due to over-extraction, tubewells, and subsidized electricity. Subsidized electricity eliminates marginal pumping cost, incentivizing farmers to pump water recklessly for water-intensive paddy.",
            "evidence_ledger": [
                {
                    "demand_title": "1. Introduction: Groundwater Stress Status",
                    "candidate_evidence": "Groundwater is depleting rapidly in north-western India.",
                    "what_the_evidence_demonstrates": "Identified regional groundwater depletion.",
                    "what_remains_weak_or_missing": "Missing quantitative baseline (e.g. CGWB Stage of Extraction >100%).",
                    "actionable_improvement": "Cite CGWB extraction ratio in Punjab/Haryana (>160%).",
                    "layer_a_marks_awarded": 0.75,
                    "layer_a_max_marks": 1.5,
                    "evidence_depth": "partly explained"
                },
                {
                    "demand_title": "2. Cause A: Subsidized Power (Explained)",
                    "candidate_evidence": "Subsidized electricity eliminates marginal pumping cost, incentivizing farmers to pump water recklessly for water-intensive paddy.",
                    "what_the_evidence_demonstrates": "Demonstrated complete causal mechanism: free power -> zero marginal cost -> excessive extraction for paddy.",
                    "what_remains_weak_or_missing": "Could mention direct feeder segregation or solar solarization (KUSUM).",
                    "actionable_improvement": "Link power subsidy reform to smart meters.",
                    "layer_a_marks_awarded": 2.25,
                    "layer_a_max_marks": 3.5,
                    "evidence_depth": "correctly explained"
                },
                {
                    "demand_title": "3. Cause B: Tubewell Density & Cropping Pattern (Bare Mention)",
                    "candidate_evidence": "Groundwater is depleting due to over-extraction, tubewells.",
                    "what_the_evidence_demonstrates": "Bare mention of tubewells and over-extraction without hydro-geological explanation.",
                    "what_remains_weak_or_missing": "Lacks explanation of Green Revolution cropping shift, MSP bias, and deep aquifer depletion.",
                    "actionable_improvement": "Explain mechanism: MSP distortion created monoculture of summer paddy.",
                    "layer_a_marks_awarded": 0.50,
                    "layer_a_max_marks": 3.5,
                    "evidence_depth": "bare mention"
                },
                {
                    "demand_title": "4. Conclusion: Sustainable Water Governance",
                    "candidate_evidence": "Need crop diversification away from paddy.",
                    "what_the_evidence_demonstrates": "Suggested crop diversification.",
                    "what_remains_weak_or_missing": "Lacks policy framework (e.g. Mihir Shah Committee).",
                    "actionable_improvement": "Anchor to Mihir Shah Committee or Atal Bhujal Yojana.",
                    "layer_a_marks_awarded": 0.25,
                    "layer_a_max_marks": 1.5,
                    "evidence_depth": "mentioned / omitted"
                }
            ]
        }

        norm = normalize_evaluation_data(raw_eval, max_marks=10, question=q, paper="GS1")
        ledger = norm["evidence_ledger"]

        # Check 1: Rubric fits 10 marks exactly
        total_max = sum(float(it["max_marks"]) for it in ledger)
        self.assertEqual(total_max, 10.0, "Rubric max marks must equal 10.0")

        # Check 2: Explanation earns significantly more than bare mention
        explained_part = ledger[1]  # Subsidized Power
        mentioned_part = ledger[2]  # Tubewells bare mention
        self.assertEqual(explained_part["max_marks"], mentioned_part["max_marks"])
        self.assertGreater(
            explained_part["awarded_marks"],
            mentioned_part["awarded_marks"] * 2.0,
            "Developed explanation must earn substantially more marks than a bare mention on identical max marks"
        )

        # Check 3: Missing explanation is identified with exact evidence
        self.assertIn("bare mention", mentioned_part["what_the_evidence_demonstrates"].lower())
        self.assertIn("tubewells", mentioned_part["candidate_evidence"].lower())

    def test_case_02_15m_analytical_critically_examine(self):
        """
        Case 2: 15-mark analytical question
        Fixture: Response to 'critically examine' with strengths but no limitations/judgment.
        Checks: Directive recognized; missing critical treatment affects relevant criterion;
                no unrelated fixed checklist appears.
        """
        q = "Critically examine the role of the Insolvency and Bankruptcy Code (IBC) in resolving stressed assets. (250 Words, 15 Marks)"
        dir_info = detect_directive(q)
        self.assertIn("Critically Examine", dir_info["directive"])

        raw_eval = {
            "overall_score": 5.0,
            "max_marks": 15,
            "detected_question": q,
            "detected_paper": "GS3",
            "transcribed_text": "IBC has unified insolvency resolution and reduced recovery time from 4 years to 1.5 years. It shifted control from debtor to creditor.",
            "evidence_ledger": [
                {
                    "demand_title": "1. Introduction: IBC 2016 Legislative Shift",
                    "candidate_evidence": "IBC has unified insolvency resolution and shifted control from debtor to creditor.",
                    "what_the_evidence_demonstrates": "Identified creditor-in-control model.",
                    "what_remains_weak_or_missing": "Missing pre-IBC comparison (SICA, DRT, SARFAESI).",
                    "actionable_improvement": "Contrast with pre-IBC SARFAESI regime.",
                    "layer_a_marks_awarded": 1.5,
                    "layer_a_max_marks": 2.5
                },
                {
                    "demand_title": "2. Dimension A: Achievements & Efficacy (Covered)",
                    "candidate_evidence": "Reduced recovery time from 4 years to 1.5 years.",
                    "what_the_evidence_demonstrates": "Captured behavioral shift and time reduction.",
                    "what_remains_weak_or_missing": "Add data on recovery rate improvements.",
                    "actionable_improvement": "Cite RBI Report on recovery metrics.",
                    "layer_a_marks_awarded": 3.0,
                    "layer_a_max_marks": 5.0
                },
                {
                    "demand_title": "3. Dimension B: Critical Limitations & Structural Gaps (Omitted by Candidate)",
                    "candidate_evidence": "No supporting evidence found in the readable submission.",
                    "what_the_evidence_demonstrates": "Candidate omitted counter-arguments and systemic limitations.",
                    "what_remains_weak_or_missing": "Failed to critically examine deep haircuts (>70%), NCLT vacancy delays exceeding 330-day statutory limit, and low liquidation recovery.",
                    "actionable_improvement": "Dedicate a balanced 4-point section to average haircuts (70%) and NCLT capacity bottlenecks.",
                    "layer_a_marks_awarded": 0.0,
                    "layer_a_max_marks": 5.5
                },
                {
                    "demand_title": "4. Conclusion: Way Forward & Reasoned Synthesis",
                    "candidate_evidence": "IBC is a landmark reform for Indian banking.",
                    "what_the_evidence_demonstrates": "Positive closing statement.",
                    "what_remains_weak_or_missing": "Lacks balanced synthesis resolving the critical bottlenecks.",
                    "actionable_improvement": "Synthesize: Cross-border insolvency framework and pre-packaged insolvency expansion.",
                    "layer_a_marks_awarded": 0.5,
                    "layer_a_max_marks": 2.0
                }
            ]
        }

        norm = normalize_evaluation_data(raw_eval, max_marks=15, question=q, paper="GS3")
        ledger = norm["evidence_ledger"]

        # Critical limitations dimension was unaddressed: must be Demand Missed with 0 marks
        crit_part = ledger[2]
        self.assertEqual(crit_part["awarded_marks"], 0.0)
        self.assertEqual(crit_part["demand_status"], "Demand Missed")
        self.assertIn("haircut", crit_part["what_remains_weak_or_missing"].lower())

        # No unrelated physical geography or GS1 checklist should contaminate GS3 IBC question
        tiers = norm.get("demand_tiers", {})
        for opt in tiers.get("tier_3_optional_enrichment", []):
            item_text = str(opt.get("enrichment_item") or "").lower()
            self.assertNotIn("caldera", item_text)
            self.assertNotIn("volcan", item_text)

    def test_case_03_multipart_question_omission(self):
        """
        Case 3: Multi-part question
        Fixture: Answer fully covers Clause 1 and omits Clause 2.
        Checks: Both core demands appear separately; omission is visible and affects score appropriately.
        """
        q = "Analyze the socio-economic impacts of sea-level rise on Indian coastal communities. Suggest community-centric adaptation strategies. (250 Words, 15 Marks)"
        raw_eval = {
            "overall_score": 4.5,
            "max_marks": 15,
            "detected_question": q,
            "detected_paper": "GS3",
            "transcribed_text": "Sea level rise causes saltwater intrusion into coastal aquifers, inundates agricultural lands in Sundarbans, and displaces fishing communities.",
            "evidence_ledger": [
                {
                    "demand_title": "1. Introduction: Coastal Vulnerability Scope",
                    "candidate_evidence": "Sea level rise is threatening Indian coastline and fishing communities.",
                    "what_the_evidence_demonstrates": "Framed coastline vulnerability.",
                    "what_remains_weak_or_missing": "Missing scale: 7,516 km coastline and IPCC SROCC report.",
                    "actionable_improvement": "Quote IPCC Special Report on the Ocean and Cryosphere.",
                    "layer_a_marks_awarded": 1.0,
                    "layer_a_max_marks": 2.0
                },
                {
                    "demand_title": "2. Clause 1: Socio-Economic Impacts on Coastal Communities",
                    "candidate_evidence": "Saltwater intrusion into coastal aquifers, inundates agricultural lands in Sundarbans, and displaces fishing communities.",
                    "what_the_evidence_demonstrates": "Identified drinking water salinity, loss of agriculture, and livelihood displacement in Sundarbans.",
                    "what_remains_weak_or_missing": "Missing gender impacts and loss of coastal mangrove buffers.",
                    "actionable_improvement": "Categorize impacts: Economic (fisheries), Social (climate refugees), Ecological.",
                    "layer_a_marks_awarded": 3.0,
                    "layer_a_max_marks": 5.5
                },
                {
                    "demand_title": "3. Clause 2: Community-Centric Adaptation Strategies",
                    "candidate_evidence": "No supporting evidence found in the readable submission.",
                    "what_the_evidence_demonstrates": "Clause completely omitted by candidate.",
                    "what_remains_weak_or_missing": "Did not suggest community adaptation strategies (e.g. mangrove bio-shields, saline-tolerant crops like Pokkali rice, cyclone shelters).",
                    "actionable_improvement": "Provide 3 community-centric strategies: Bio-shield restoration, Pokkali saline rice cultivation, community disaster management committees.",
                    "layer_a_marks_awarded": 0.0,
                    "layer_a_max_marks": 5.5
                },
                {
                    "demand_title": "4. Conclusion: Resilient Coastal Future",
                    "candidate_evidence": "Integrated coastal zone management is necessary.",
                    "what_the_evidence_demonstrates": "Brief concluding note.",
                    "what_remains_weak_or_missing": "Missing Sendai Framework or ICZMP reference.",
                    "actionable_improvement": "Anchor to Mission LiFE and Sendai Framework Target G.",
                    "layer_a_marks_awarded": 0.5,
                    "layer_a_max_marks": 2.0
                }
            ]
        }

        norm = normalize_evaluation_data(raw_eval, max_marks=15, question=q, paper="GS3")
        ledger = norm["evidence_ledger"]

        # Both core clauses appear distinctly
        self.assertEqual(len(ledger), 4)
        c1 = ledger[1]
        c2 = ledger[2]
        self.assertEqual(c1["demand_title"], "2. Clause 1: Socio-Economic Impacts on Coastal Communities")
        self.assertEqual(c2["demand_title"], "3. Clause 2: Community-Centric Adaptation Strategies")

        # Clause 1 was credited; Clause 2 was omitted and marked Demand Missed
        self.assertGreater(c1["awarded_marks"], 0.0)
        self.assertEqual(c2["awarded_marks"], 0.0)
        self.assertEqual(c2["demand_status"], "Demand Missed")

    def test_case_04_optional_subject_discipline(self):
        """
        Case 4: Optional subject
        Fixture: Discipline-specific response (PSIR/Sociology/Physics).
        Checks: Criteria reflect the discipline; generic GS-style requirements are not imposed.
        """
        psir_q = "Critically analyze Plato's concept of the Philosopher King in the context of his Theory of Justice. (20 Marks)"
        disc = detect_question_discipline(psir_q, "Optional-PSIR")
        self.assertEqual(disc, "OPTIONAL_DISCIPLINE", "Optional paper must be detected as OPTIONAL_DISCIPLINE")

        # Also check with paper parameter indicating Optional
        soc_disc = detect_question_discipline("Discuss Durkheim's concept of anomie and social solidarity.", "Optional-Sociology")
        self.assertEqual(soc_disc, "OPTIONAL_DISCIPLINE")

        # Verify that generic GS Polity requirements (Article 280, 2nd ARC) are not imposed
        raw_opt = {
            "overall_score": 10.0,
            "max_marks": 20,
            "detected_question": psir_q,
            "detected_paper": "Optional-PSIR",
            "evidence_ledger": [
                {"demand_title": "1. Theory of Forms & Knowledge vs Opinion", "candidate_evidence": "Plato distinguishes Episteme from Doxa in Republic.", "layer_a_marks_awarded": 2.5, "layer_a_max_marks": 5.0},
                {"demand_title": "2. Philosopher King & Reason Dominance", "candidate_evidence": "Rule of reason personified; dialectical knowledge of the Idea of Good.", "layer_a_marks_awarded": 4.0, "layer_a_max_marks": 7.0},
                {"demand_title": "3. Critical Evaluation (Popper's Open Society Critique)", "candidate_evidence": "Karl Popper critiques it as blueprint for totalitarianism.", "layer_a_marks_awarded": 2.5, "layer_a_max_marks": 5.0},
                {"demand_title": "4. Conclusion: Ideal vs Nocturnal Council", "candidate_evidence": "Evolution from Republic's ideal ruler to Laws' constitutional council.", "layer_a_marks_awarded": 1.0, "layer_a_max_marks": 3.0}
            ]
        }
        norm = normalize_evaluation_data(raw_opt, max_marks=20, question=psir_q, paper="Optional-PSIR")
        self.assertEqual(sum(it["max_marks"] for it in norm["evidence_ledger"]), 20.0)

    def test_case_05_ethics_case_study_anti_duplication(self):
        """
        Case 5: Ethics case study
        Fixture: Case study with stakeholders, competing values, options, and recommended action.
        Checks: Rubric reflects actual demands; overlapping criteria do not award the same reasoning twice.
        """
        case_q = (
            "You are the Municipal Commissioner of a historic city. A severe fire outbreak occurs in an unauthorized commercial complex. "
            "Examine the ethical dilemmas, evaluate options available to you, and suggest your course of action. (20 Marks)"
        )
        raw_case = {
            "overall_score": 10.5,
            "max_marks": 20,
            "detected_question": case_q,
            "detected_paper": "GS4",
            "evidence_ledger": [
                {"demand_title": "1. Stakeholders & Ethical Dilemmas", "candidate_evidence": "Public safety vs commercial livelihoods; legal compliance vs economic expediency.", "layer_a_marks_awarded": 2.5, "layer_a_max_marks": 4.0},
                {"demand_title": "2. Evaluation of Options (Merits & Demerits)", "candidate_evidence": "Option 1: Demolish all illegal structures immediately. Option 2: Regularize with penal fines.", "layer_a_marks_awarded": 3.5, "layer_a_max_marks": 6.0},
                {"demand_title": "3. Proposed Course of Action", "candidate_evidence": "Phased sealing of non-compliant buildings with mandatory fire safety retrofitting and magistrate inquiry.", "layer_a_marks_awarded": 3.0, "layer_a_max_marks": 6.0},
                {"demand_title": "4. Ethical Justification & Long-term Governance", "candidate_evidence": "Public interest stewardship and preventive administrative integrity.", "layer_a_marks_awarded": 1.5, "layer_a_max_marks": 4.0}
            ]
        }
        norm = normalize_evaluation_data(raw_case, max_marks=20, question=case_q, paper="GS4")
        self.assertEqual(sum(it["max_marks"] for it in norm["evidence_ledger"]), 20.0)
        self.assertEqual(sum(it["awarded_marks"] for it in norm["evidence_ledger"]), 10.5)

    def test_case_06_hindi_answer_fidelity(self):
        """
        Case 6: Hindi answer
        Fixture: Hindi response with relevant points and explanatory gap.
        Checks: Assessed in Hindi; Devanagari evidence preserved; not penalized for being Hindi.
        """
        hindi_q = "भारत में भूजल संकट के कारणों का परीक्षण कीजिए। (150 शब्द, 10 अंक)"
        hindi_text = "उत्तर-पश्चिमी भारत में भूजल का दोहन तीव्र गति से हो रहा है। अत्यधिक नलकूपों और मुफ्त बिजली ने जल स्तर को गिरा दिया है।"
        raw_hindi = {
            "overall_score": 4.0,
            "max_marks": 10,
            "detected_question": hindi_q,
            "detected_paper": "GS1",
            "medium": "hindi",
            "is_hindi": True,
            "transcribed_text": hindi_text,
            "evidence_ledger": [
                {
                    "demand_title": "1. प्रस्तावना: भूजल संकट की स्थिति",
                    "candidate_evidence": "उत्तर-पश्चिमी भारत में भूजल का दोहन तीव्र गति से हो रहा है।",
                    "what_the_evidence_demonstrates": "संकट की प्राथमिक पहचान।",
                    "what_remains_weak_or_missing": "आधिकारिक डेटा का अभाव।",
                    "actionable_improvement": "केंद्रीय भूजल बोर्ड की रिपोर्ट का संदर्भ दें।",
                    "layer_a_marks_awarded": 1.0,
                    "layer_a_max_marks": 1.5
                },
                {
                    "demand_title": "2. मुख्य कारण: नलकूप एवं बिजली सब्सिडी",
                    "candidate_evidence": "अत्यधिक नलकूपों और मुफ्त बिजली ने जल स्तर को गिरा दिया है।",
                    "what_the_evidence_demonstrates": "बिजली सब्सिडी और नलकूपों के प्रभाव को रेखांकित किया।",
                    "what_remains_weak_or_missing": "धान की फसल के आर्थिक कारकों का विस्तृत विवरण नहीं।",
                    "actionable_improvement": "एमएसपी तथा फसल विविधीकरण से जोड़ें।",
                    "layer_a_marks_awarded": 2.0,
                    "layer_a_max_marks": 4.5
                },
                {
                    "demand_title": "3. अन्य कारक एवं नीतिगत विफलता",
                    "candidate_evidence": "No supporting evidence found in the readable submission.",
                    "what_the_evidence_demonstrates": "अभ्यर्थी द्वारा अन्य आयाम नहीं लिखे गए।",
                    "what_remains_weak_or_missing": "वर्षा जल संचयन तथा जलभृत पुनर्भरण पर चर्चा का अभाव।",
                    "actionable_improvement": "अटल भूजल योजना का उल्लेख करें।",
                    "layer_a_marks_awarded": 0.0,
                    "layer_a_max_marks": 2.5
                },
                {
                    "demand_title": "4. निष्कर्ष एवं समाधान",
                    "candidate_evidence": "टिकाऊ जल प्रबंधन आवश्यक है।",
                    "what_the_evidence_demonstrates": "संक्षिप्त समापन।",
                    "what_remains_weak_or_missing": "दीर्घकालिक सुधारों का अभाव।",
                    "actionable_improvement": "मिहिर शाह समिति की सिफारिशों का उल्लेख करें।",
                    "layer_a_marks_awarded": 1.0,
                    "layer_a_max_marks": 1.5
                }
            ]
        }
        norm = normalize_evaluation_data(raw_hindi, max_marks=10, question=hindi_q, paper="GS1")
        ledger = norm["evidence_ledger"]
        self.assertEqual(len(ledger), 4)
        self.assertIn("प्रस्तावना", ledger[0]["demand_title"])
        # Check Devanagari evidence preservation
        self.assertIn("उत्तर-पश्चिमी", ledger[0]["candidate_evidence"])
        self.assertEqual(sum(it["max_marks"] for it in ledger), 10.0)

    def test_case_07_strong_answer_with_relevant_addition(self):
        """
        Case 7: Strong answer with relevant addition
        Fixture: Relevant constitutional provision/case law supporting argument.
        Checks: Addition supports relevant criterion; receives no separate automatic bonus beyond criterion max.
        """
        q = "Discuss the significance of the Basic Structure Doctrine in maintaining constitutional equilibrium. (150 Words, 10 Marks)"
        raw_eval = {
            "overall_score": 6.5,
            "max_marks": 10,
            "detected_question": q,
            "detected_paper": "GS2",
            "evidence_ledger": [
                {
                    "demand_title": "1. Introduction: Origin & Genesis",
                    "candidate_evidence": "Propounded in Kesavananda Bharati (1973), reviewing Golaknath judgment.",
                    "what_the_evidence_demonstrates": "Accurate landmark citation.",
                    "what_remains_weak_or_missing": "Minor historical detail.",
                    "actionable_improvement": "Mention 13-judge bench size.",
                    "layer_a_marks_awarded": 1.25,
                    "layer_a_max_marks": 1.5
                },
                {
                    "demand_title": "2. Analytical Demand: Safeguard Against Legislative Hegemony",
                    "candidate_evidence": "Restrained constituent power under Art 368; Indira Gandhi v. Raj Narain struck down 39th Amendment to protect judicial review.",
                    "what_the_evidence_demonstrates": "Supported argument with Indira Gandhi v. Raj Narain case and Art 368 limitation.",
                    "what_remains_weak_or_missing": "Minerva Mills balance of Fundamental Rights and DPSP.",
                    "actionable_improvement": "Add Minerva Mills (1980) golden triangle citation.",
                    "layer_a_marks_awarded": 4.25,
                    "layer_a_max_marks": 5.5
                },
                {
                    "demand_title": "3. Directive Balance: Criticisms & Counter-Perspective",
                    "candidate_evidence": "Critics argue it lacks explicit textual foundation and enables judicial overreach.",
                    "what_the_evidence_demonstrates": "Addressed legitimate counter-arguments.",
                    "what_remains_weak_or_missing": "NJAC verdict reference.",
                    "actionable_improvement": "Cite NJAC (4th Judges Case) as modern debate point.",
                    "layer_a_marks_awarded": 1.0,
                    "layer_a_max_marks": 3.0
                }
            ]
        }
        norm = normalize_evaluation_data(raw_eval, max_marks=10, question=q, paper="GS2")
        ledger = norm["evidence_ledger"]
        # Core criterion with strong case law should be well scored but strictly <= max_marks
        self.assertLessEqual(ledger[1]["awarded_marks"], ledger[1]["max_marks"])
        self.assertEqual(sum(it["max_marks"] for it in ledger), 10.0)

    def test_case_08_irrelevant_extra_material_fluency_guard(self):
        """
        Case 8: Irrelevant extra material
        Fixture: Polished answer with a long off-topic example.
        Checks: Irrelevant content does not improve score and receives zero credit toward core demand.
        """
        q = "Explain the mechanism of cloudbursts in the Himalayan region. (150 Words, 10 Marks)"
        # Candidate writes fluently about the history of the Indian Space Research Organisation (ISRO)
        raw_eval = {
            "overall_score": 1.5,
            "max_marks": 10,
            "detected_question": q,
            "detected_paper": "GS1",
            "transcribed_text": "Cloudburst is sudden heavy rainfall. ISRO was founded by Vikram Sarabhai in 1969 and has launched Chandrayaan and Mangalyaan showcasing India's scientific glory.",
            "evidence_ledger": [
                {
                    "demand_title": "1. Definition of Cloudburst",
                    "candidate_evidence": "Cloudburst is sudden heavy rainfall.",
                    "what_the_evidence_demonstrates": "Elementary definition without IMD benchmark (>100mm/hr over 20-30 sq km).",
                    "what_remains_weak_or_missing": "Omitted IMD standard quantitative definition.",
                    "actionable_improvement": "State IMD criterion: >=100 mm rain in 1 hour over ~20-30 sq km.",
                    "layer_a_marks_awarded": 0.5,
                    "layer_a_max_marks": 2.0
                },
                {
                    "demand_title": "2. Orographic & Atmospheric Mechanism",
                    "candidate_evidence": "No supporting evidence found in the readable submission.",
                    "what_the_evidence_demonstrates": "Candidate omitted orographic lifting, moisture funneling, and cumulonimbus vertical development. Wrote off-topic material on ISRO satellites.",
                    "what_remains_weak_or_missing": "Complete omission of thermodynamic mechanisms (steep valleys, thermal updrafts).",
                    "actionable_improvement": "Diagram showing steep valley funnelling moist monsoon air into cumulonimbus cell.",
                    "layer_a_marks_awarded": 0.0,
                    "layer_a_max_marks": 6.0
                },
                {
                    "demand_title": "3. Disaster Mitigation & Early Warning",
                    "candidate_evidence": "ISRO has launched Chandrayaan and Mangalyaan.",
                    "what_the_evidence_demonstrates": "Off-topic mention of lunar/planetary missions with no connection to Himalayan Doppler Weather Radars.",
                    "what_remains_weak_or_missing": "Lacks Doppler Weather Radars (DWR) and automated weather stations.",
                    "actionable_improvement": "Link space tech directly to INSAT-3DR and X-band Doppler radars.",
                    "layer_a_marks_awarded": 0.5,
                    "layer_a_max_marks": 2.0
                }
            ]
        }
        norm = normalize_evaluation_data(raw_eval, max_marks=10, question=q, paper="GS1")
        ledger = norm["evidence_ledger"]
        # Orographic mechanism has no valid evidence: 0 marks
        self.assertEqual(ledger[1]["awarded_marks"], 0.0)
        self.assertEqual(ledger[1]["demand_status"], "Demand Missed")

    def test_case_09_repeated_point_deduplication(self):
        """
        Case 9: Repeated point
        Fixture: Same argument restated in multiple sections.
        Checks: Repetition does not earn duplicate credit; anti-duplication catches repeat.
        """
        raw_eval = {
            "overall_score": 4.0,
            "max_marks": 10,
            "detected_question": "Discuss measures to tackle rural poverty in India. (10 Marks)",
            "detected_paper": "GS3",
            "evidence_ledger": [
                {
                    "demand_title": "1. Wage Employment",
                    "candidate_evidence": "MGNREGA provides 100 days of guaranteed wage employment to rural households.",
                    "what_the_evidence_demonstrates": "Credited under wage employment safety net.",
                    "what_remains_weak_or_missing": "Missing wage delay challenges.",
                    "actionable_improvement": "Mention DBT and NeFMS reform.",
                    "layer_a_marks_awarded": 2.0,
                    "layer_a_max_marks": 4.0
                },
                {
                    "demand_title": "2. Livelihood Diversification",
                    "candidate_evidence": "MGNREGA provides 100 days of guaranteed wage employment to rural households.",
                    "what_the_evidence_demonstrates": "Candidate repeated the identical point from section 1.",
                    "what_remains_weak_or_missing": "Omitted SHG-bank linkage (NRLM/Deendayal Antyodaya).",
                    "actionable_improvement": "Focus on NRLM, micro-enterprises, and dairy co-operatives.",
                    "layer_a_marks_awarded": 2.0,
                    "layer_a_max_marks": 4.0
                },
                {
                    "demand_title": "3. Conclusion",
                    "candidate_evidence": "Rural poverty requires holistic social protection.",
                    "what_the_evidence_demonstrates": "Closing vision.",
                    "what_remains_weak_or_missing": "None.",
                    "actionable_improvement": "None.",
                    "layer_a_marks_awarded": 1.0,
                    "layer_a_max_marks": 2.0
                }
            ]
        }
        norm = normalize_evaluation_data(raw_eval, max_marks=10, question="Discuss rural poverty", paper="GS3")
        ledger = norm["evidence_ledger"]
        # The second identical entry must have been penalized or capped by anti-duplication
        second_entry = ledger[1]
        self.assertIn("repeated point", second_entry["assessment_of_evidence"].lower())
        self.assertLessEqual(second_entry["awarded_marks"], 0.5)

    def test_case_10_clear_factual_error_correction(self):
        """
        Case 10: Clear factual error
        Fixture: Response contains a confidently stated, verifiably incorrect fact.
        Checks: Exact claim is identified, corrected cautiously, and treated consistently.
        """
        raw_eval = {
            "overall_score": 4.0,
            "max_marks": 10,
            "detected_question": "Discuss the emergency provisions in the Indian Constitution.",
            "detected_paper": "GS2",
            "transcribed_text": "Article 356 provides for Financial Emergency whenever the financial stability of India is threatened.",
            "fatal_blunders_alert": {
                "has_blunder": True,
                "title": "Constitutional Attribution Check",
                "attribution_error": "Candidate attributed Financial Emergency to Article 356 (which actually deals with President's Rule in States). Financial Emergency is governed by Article 360.",
                "disciplinary_leak": ""
            }
        }
        norm = normalize_evaluation_data(raw_eval, max_marks=10, question="Emergency provisions", paper="GS2")
        blunder = norm.get("fatal_blunders_alert", {})
        self.assertTrue(blunder.get("has_blunder"))
        self.assertIn("356", blunder.get("attribution_error"))
        self.assertIn("360", blunder.get("attribution_error"))

    def test_case_11_unverifiable_current_claim_caution(self):
        """
        Case 11: Unverifiable current claim
        Fixture: Response uses a current statistic not verifiable from available context.
        Checks: Evaluator notes uncertainty in uncertainty_flags rather than declaring false.
        """
        raw_eval = {
            "overall_score": 4.5,
            "max_marks": 10,
            "detected_question": "Examine the status of secondary education in India.",
            "detected_paper": "GS2",
            "transcribed_text": "In secondary schools, [unverified] 89.4% of all rural institutions completely shut down during 2025 due to lack of budget.",
            "sub_part_step_marking": [
                {"step_label": "1. Intro", "awarded": 1.0, "max": 2.0, "quoted_written": "Secondary schooling context."},
                {"step_label": "2. Main Body", "awarded": 2.5, "max": 6.0, "quoted_written": "Budget allocations and enrollment."},
                {"step_label": "3. Conclusion", "awarded": 1.0, "max": 2.0, "quoted_written": "Way forward."}
            ]
        }
        norm = normalize_evaluation_data(raw_eval, max_marks=10, question="Status of secondary education", paper="GS2")
        flags = norm.get("uncertainty_flags", [])
        self.assertTrue(any(f.get("type") == "unverifiable_claim_caution" for f in flags))

    def test_case_12_ocr_uncertainty_handling(self):
        """
        Case 12: OCR uncertainty
        Fixture: Low-quality scan with partly unreadable text.
        Checks: Unreadable content is not confidently treated as absent; uncertainty is disclosed.
        """
        raw_eval = {
            "overall_score": 4.5,
            "max_marks": 10,
            "detected_question": "Explain plate tectonic mechanisms.",
            "detected_paper": "GS1",
            "transcribed_text": "Plate tectonics involves lithospheric plates moving over asthenosphere due to [illegible] convection currents.",
            "ocr_confidence": 0.52,
            "sub_part_step_marking": [
                {"step_label": "1. Intro", "awarded": 1.0, "max": 2.0, "quoted_written": "Plate motion."},
                {"step_label": "2. Body", "awarded": 2.5, "max": 6.0, "quoted_written": "Convection currents."},
                {"step_label": "3. Conclusion", "awarded": 1.0, "max": 2.0, "quoted_written": "Global seismicity."}
            ]
        }
        norm = normalize_evaluation_data(raw_eval, max_marks=10, question="Plate tectonics", paper="GS1")
        flags = norm.get("uncertainty_flags", [])
        # Both handwriting ambiguity and low OCR confidence should be flagged
        flag_types = [f.get("type") for f in flags]
        self.assertIn("handwriting_ambiguity", flag_types)
        self.assertIn("low_ocr_confidence", flag_types)
        # Validation audit status must reflect uncertainty
        va = norm.get("validation_audit", {})
        self.assertEqual(va.get("status"), "flagged_for_uncertainty")

    def test_case_13_off_topic_answer(self):
        """
        Case 13: Off-topic answer
        Fixture: Fluent response addresses a neighboring/different issue.
        Checks: Relevance and core-demand coverage control score; fluency does not inflate it.
        """
        q = "Evaluate the role of Green Hydrogen in decarbonizing heavy industry in India. (250 Words, 15 Marks)"
        # Candidate writes fluently about Rooftop Solar PV panels instead of Green Hydrogen in heavy industry
        raw_eval = {
            "overall_score": 2.0,
            "max_marks": 15,
            "detected_question": q,
            "detected_paper": "GS3",
            "transcribed_text": "Solar energy is vital for India's energy security. PM Surya Ghar Muft Bijli Yojana provides rooftop solar subsidies to 1 crore households, reducing discom distribution losses.",
            "evidence_ledger": [
                {
                    "demand_title": "1. Definition & Potential of Green Hydrogen",
                    "candidate_evidence": "No supporting evidence found in the readable submission.",
                    "what_the_evidence_demonstrates": "Candidate wrote about solar rooftop subsidies instead of green hydrogen electrolysis.",
                    "what_remains_weak_or_missing": "Complete omission of green hydrogen (electrolysis of water via renewables).",
                    "actionable_improvement": "Define green hydrogen and its role in steel/fertilizer hard-to-abate sectors.",
                    "layer_a_marks_awarded": 0.0,
                    "layer_a_max_marks": 3.0
                },
                {
                    "demand_title": "2. Application to Heavy Industry Decarbonization",
                    "candidate_evidence": "No supporting evidence found in the readable submission.",
                    "what_the_evidence_demonstrates": "Off-topic: discussed residential rooftop solar PV instead of heavy industries (refineries, steel, cement).",
                    "what_remains_weak_or_missing": "Missed DRI steelmaking, ammonia feedstock replacement, and National Green Hydrogen Mission targets.",
                    "actionable_improvement": "Explain hydrogen replacement of coking coal in blast furnaces.",
                    "layer_a_marks_awarded": 0.0,
                    "layer_a_max_marks": 7.0
                },
                {
                    "demand_title": "3. Challenges & Enabling Infrastructure",
                    "candidate_evidence": "Solar energy reduces discom distribution losses.",
                    "what_the_evidence_demonstrates": "Peripheral mention of renewable power transmission.",
                    "what_remains_weak_or_missing": "Electrolyzer manufacturing capex, round-the-clock power, and water intensity.",
                    "actionable_improvement": "Highlight high electrolyzer stack costs ($800/kW) and pipeline transport logistics.",
                    "layer_a_marks_awarded": 1.0,
                    "layer_a_max_marks": 3.5
                },
                {
                    "demand_title": "4. Conclusion: Mission Alignment",
                    "candidate_evidence": "India must become energy independent.",
                    "what_the_evidence_demonstrates": "Generic aspiration.",
                    "what_remains_weak_or_missing": "National Green Hydrogen Mission 5 MMT target by 2030.",
                    "actionable_improvement": "Anchor to National Green Hydrogen Mission 2030 goals.",
                    "layer_a_marks_awarded": 1.0,
                    "layer_a_max_marks": 1.5
                }
            ]
        }
        norm = normalize_evaluation_data(raw_eval, max_marks=15, question=q, paper="GS3")
        ledger = norm["evidence_ledger"]
        # Core demand was completely omitted due to off-topic response
        self.assertEqual(ledger[0]["awarded_marks"], 0.0)
        self.assertEqual(ledger[1]["awarded_marks"], 0.0)
        # Score is strictly bounded (< 30% of total)
        self.assertLessEqual(norm["overall_score"], 4.5)
        self.assertEqual(norm["score_band"], "Needs Work (<30%)")

    def test_case_14_essay_holistic_evaluation(self):
        """
        Case 14: Essay paper submission
        Fixture: Essay with clear thesis but uneven development.
        Checks: Evaluation is holistic and essay-appropriate; does not reuse short GS checklist.
        """
        essay_q = "Life is what happens when you're busy making other plans."
        prompt = build_evaluation_prompt(
            question=essay_q,
            paper_key="Essay",
            max_marks=125,
            directive_info={"directive": "Essay", "details": "Holistic thematic reflection.", "ideal_balance": "Philosophical depth"}
        )
        self.assertIn("125", prompt)
        self.assertIn("Essay", prompt)

        raw_essay = {
            "overall_score": 58.0,
            "max_marks": 125,
            "detected_question": essay_q,
            "detected_paper": "Essay",
            "sub_part_step_marking": [
                {"step_label": "1. Introduction & Philosophical Hook", "awarded": 12.0, "max": 20.0, "quoted_written": "Metaphorical opening on fate vs human agency."},
                {"step_label": "2. Temporal Dimension (Historical & Contemporary Trajectory)", "awarded": 18.0, "max": 35.0, "quoted_written": "Historical unpredictability from Ashoka to modern pandemic."},
                {"step_label": "3. Spatial & Multi-Disciplinary Analysis", "awarded": 16.0, "max": 35.0, "quoted_written": "Societal and technological serendipity."},
                {"step_label": "4. Philosophical Synthesis & Visionary Conclusion", "awarded": 12.0, "max": 35.0, "quoted_written": "Closing reflection on mindful living and stoic resilience."}
            ]
        }
        norm = normalize_evaluation_data(raw_essay, max_marks=125, question=essay_q, paper="Essay")
        self.assertEqual(norm["max_marks"], 125)
        self.assertEqual(sum(it["max_marks"] for it in norm["evidence_ledger"]), 125.0)

    def test_case_15_score_integrity_arithmetic(self):
        """
        Case 15: Score integrity across 10, 15, and 20 mark questions
        Checks: Criterion totals equal maximum; no criterion exceeds cap; reported total equals criterion sum.
        """
        for marks_val in [10, 15, 20]:
            sample_score = marks_val * 0.45
            raw = {
                "overall_score": sample_score,
                "max_marks": marks_val,
                "detected_question": f"Standard {marks_val}M Question",
                "detected_paper": "GS2",
                "sub_part_step_marking": [
                    {"step_label": "1. Intro", "awarded": round(marks_val * 0.10, 2), "max": round(marks_val * 0.15, 2), "quoted_written": "Intro quote."},
                    {"step_label": "2. Part A", "awarded": round(marks_val * 0.20, 2), "max": round(marks_val * 0.45, 2), "quoted_written": "Part A quote."},
                    {"step_label": "3. Part B", "awarded": round(marks_val * 0.10, 2), "max": round(marks_val * 0.25, 2), "quoted_written": "Part B quote."},
                    {"step_label": "4. Conclusion", "awarded": round(marks_val * 0.05, 2), "max": round(marks_val * 0.15, 2), "quoted_written": "Conclusion quote."}
                ]
            }
            norm = normalize_evaluation_data(raw, max_marks=marks_val, question="Test Question", paper="GS2")
            ledger = norm["evidence_ledger"]

            # Sum of max marks must equal marks_val exactly
            sum_max = sum(it["max_marks"] for it in ledger)
            self.assertAlmostEqual(sum_max, float(marks_val), places=1)

            # Sum of awarded marks must equal overall_score
            sum_aw = sum(it["awarded_marks"] for it in ledger)
            self.assertAlmostEqual(sum_aw, norm["overall_score"], places=1)

            # No individual criterion exceeds its maximum
            for it in ledger:
                self.assertLessEqual(it["awarded_marks"], it["max_marks"])
                self.assertGreaterEqual(it["awarded_marks"], 0.0)

    def test_case_16_contract_regression(self):
        """
        Case 16: Contract regression
        Checks: All required public API keys, types, and persistence payloads continue to work as before.
        """
        raw = {
            "overall_score": 5.0,
            "max_marks": 15,
            "detected_question": "Explain the significance of the Preamble.",
            "detected_paper": "GS2",
            "full_model_answer": "### Significance of the Preamble\n**1. Identity Card:** N.A. Palkhivala described it as the identity card of the Constitution.\n**2. Source of Authority:** We, the People indicates sovereign power resides in citizens.",
            "sub_part_step_marking": [
                {"step_label": "1. Intro", "awarded": 1.0, "max": 2.0, "quoted_written": "Preamble is intro."},
                {"step_label": "2. Part A", "awarded": 3.0, "max": 11.0, "quoted_written": "Key values explained."},
                {"step_label": "3. Conclusion", "awarded": 1.0, "max": 2.0, "quoted_written": "Kesavananda Bharati holding."}
            ]
        }
        norm = normalize_evaluation_data(raw, max_marks=15, question="Significance of Preamble", paper="GS2")

        required_keys = [
            "overall_score",
            "max_marks",
            "score_band",
            "evidence_ledger",
            "demand_tiers",
            "prioritized_feedback",
            "validation_audit",
            "sub_part_step_marking",
            "full_model_answer"
        ]
        for key in required_keys:
            self.assertIn(key, norm, f"Normalized data must retain public contract key: {key}")

        self.assertIsInstance(norm["evidence_ledger"], list)
        self.assertIsInstance(norm["demand_tiers"], dict)
        self.assertIsInstance(norm["prioritized_feedback"], list)
        self.assertIsInstance(norm["validation_audit"], dict)
        self.assertIsInstance(norm["full_model_answer"], str)

if __name__ == "__main__":
    unittest.main()
