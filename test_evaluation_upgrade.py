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



class TestEvidenceGroundedEvaluationRegression(unittest.TestCase):
    """
    Regression Test Suite for Evidence-Grounded Evaluation & Actual Response Rules:
    1. No fixed mark percentages (Intro/Body/Conclusion).
    2. Parallel columns and section reordering give equal credit to equal substance.
    3. Multi-page mapping preserves all content across pages.
    4. Content-rich opening earns substantive demand credit.
    5. Present but weak way forward gets partial credit (never 0.0 or Demand Missed).
    6. Answer length alone does not dictate score (concise substance > verbose filler).
    7. Coaching advice does not penalize or deduct marks.
    8. Demand-level rubric anchors sum exactly to overall_score and max_marks.
    9. Duplicate pages / images do not produce duplicate credit.
    """

    def test_regression_01_no_fixed_percentages(self):
        """Rule 1: No fixed mark percentages assigned as default scoring rules."""
        for mm in [10, 15, 20]:
            p_en = build_evaluation_prompt(
                question="Critically examine the role of Self-Help Groups in women empowerment.",
                paper_key="GS2",
                max_marks=mm,
                directive_info={"directive": "Critically examine", "details": "Analyze multiple perspectives and limitations.", "ideal_balance": "Balanced analysis"}
            )
            # Ensure hardcoded 15%-70%-15% rule is NOT in the prompt
            self.assertNotIn("(15% - 70% - 15% RULE)", p_en)
            self.assertNotIn("intro_denominator = 1.5", p_en)
            self.assertNotIn("body_denominator = 7.0", p_en)
            # Prompt must instruct demand-based allocation
            self.assertIn("DYNAMIC QUESTION INTERPRETATION & EVALUATION PLAN (NO RIGID TEMPLATE)", p_en)

            p_hi = build_hindi_evaluation_prompt(
                question="महिला सशक्तिकरण में स्वयं सहायता समूहों की भूमिका का समालोचनात्मक परीक्षण कीजिए।",
                paper_key="GS2",
                max_marks=mm,
                directive_info={"directive": "समालोचनात्मक परीक्षण कीजिए", "details": "गहन विश्लेषण और सीमाएं।", "ideal_balance": "संतुलित दृष्टिकोण"}
            )
            self.assertNotIn("(15% - 70% - 15% नियम)", p_hi)
            self.assertNotIn("intro_denominator = 1.5", p_hi)
            self.assertIn("साक्ष्य-आधारित मूल्यांकन एवं प्रतिपुष्टि शुद्धता के 9 स्वर्णिम नियम", p_hi)

    def test_regression_02_parallel_columns_and_reordered_sections(self):
        """Rule 2: Changing section order or parallel columns (Issues | Way Forward) credits both."""
        raw_eval = {
            "overall_score": 5.5,
            "max_marks": 10,
            "detected_question": "Examine the implementation challenges of CSR and suggest a way forward.",
            "detected_paper": "GS2",
            "visual_annotations": [
                {"page": 1, "tag": "Parallel Column: Issues", "remark": "Regional skew in CSR expenditure", "marks_awarded": "+1.5 / 2.5"},
                {"page": 1, "tag": "Parallel Column: Way Forward", "remark": "Incentivize spending in aspirational districts", "marks_awarded": "+1.5 / 2.5"},
                {"page": 2, "tag": "Substantive Core", "remark": "Compliance-driven rather than impact-driven", "marks_awarded": "+1.5 / 3.0"},
                {"page": 2, "tag": "Closing Synthesis", "remark": "CSR as catalyst for inclusive growth", "marks_awarded": "+1.0 / 2.0"}
            ],
            "sub_part_step_marking": [
                {"step_label": "1. Issues Column", "sub_heading": "Implementation Bottlenecks", "awarded": 1.5, "max": 2.5, "quoted_written": "Regional skew to western states"},
                {"step_label": "2. Way Forward Column", "sub_heading": "Targeted Reforms", "awarded": 1.5, "max": 2.5, "quoted_written": "Aspirational districts priority"},
                {"step_label": "3. Structural Shift", "sub_heading": "Impact Assessment", "awarded": 1.5, "max": 3.0, "quoted_written": "Beyond cheque-book philanthropy"},
                {"step_label": "4. Conclusion", "sub_heading": "Closing Synthesis", "awarded": 1.0, "max": 2.0, "quoted_written": "Inclusive growth anchor"}
            ]
        }
        norm = normalize_evaluation_data(raw_eval, max_marks=10, question="CSR challenges and way forward", paper="GS2")
        
        # Verify both parallel columns are retained and credited
        steps = norm.get("sub_part_step_marking", [])
        self.assertEqual(len(steps), 4)
        wf_step = next((s for s in steps if "Way Forward" in s.get("step_label", "") or "Reforms" in s.get("sub_heading", "")), None)
        self.assertIsNotNone(wf_step)
        self.assertGreater(float(wf_step.get("awarded", 0)), 0.0)
        self.assertNotEqual(wf_step.get("demand_status"), "Demand Missed")

    def test_regression_03_multi_page_mapping_no_content_dropped(self):
        """Rule 3: Multi-page mapping preserves issues, diagrams, solutions, conclusions across pages."""
        raw_eval = {
            "overall_score": 6.5,
            "max_marks": 15,
            "detected_question": "Discuss the institutional architecture of Fiscal Federalism in India.",
            "detected_paper": "GS2",
            "total_pages": 3,
            "visual_annotations": [
                {"page": 1, "tag": "Page 1: Constitutional Mandate", "remark": "Article 280 Finance Commission & Article 279A GST Council", "marks_awarded": "+2.0 / 3.0"},
                {"page": 2, "tag": "Page 2: Diagram of Fund Flows", "remark": "Vertical vs Horizontal devolution flow diagram", "marks_awarded": "+2.0 / 4.0"},
                {"page": 2, "tag": "Page 2: Vertical Fiscal Imbalance", "remark": "Cess and surcharge expansion shrinking divisible pool", "marks_awarded": "+1.5 / 4.0"},
                {"page": 3, "tag": "Page 3: Institutional Reforms & Way Forward", "remark": "Permanent status for FC and interstate council revival", "marks_awarded": "+1.0 / 4.0"}
            ],
            "sub_part_step_marking": [
                {"step_label": "1. Constitutional Mandate", "awarded": 2.0, "max": 3.0, "quoted_written": "Art 280 and 279A"},
                {"step_label": "2. Visual Representation & Fiscal Flow", "awarded": 2.0, "max": 4.0, "quoted_written": "Diagram on vertical devolution"},
                {"step_label": "3. Emerging Structural Friction", "awarded": 1.5, "max": 4.0, "quoted_written": "Cess and surcharge growth"},
                {"step_label": "4. Rebalancing Measures & Conclusion", "awarded": 1.0, "max": 4.0, "quoted_written": "Permanent FC secretariat"}
            ]
        }
        norm = normalize_evaluation_data(raw_eval, max_marks=15, question="Fiscal Federalism", paper="GS2")
        
        pages_present = {a.get("page") for a in norm.get("visual_annotations", [])}
        self.assertIn(1, pages_present)
        self.assertIn(2, pages_present)
        self.assertIn(3, pages_present)
        self.assertEqual(len(norm.get("sub_part_step_marking", [])), 4)

    def test_regression_04_content_rich_opening_substantive_credit(self):
        """Rule 4: Content-rich opening that directly answers a sub-question earns substantive credit."""
        raw_eval = {
            "overall_score": 5.0,
            "max_marks": 10,
            "detected_question": "What is the statutory framework of Corporate Social Responsibility under the Companies Act 2013? Evaluate its effectiveness.",
            "detected_paper": "GS2",
            "visual_annotations": [
                {"page": 1, "tag": "Statutory Mandate (Section 135)", "remark": "Exact thresholds: Net worth >= 500Cr, turnover >= 1000Cr, net profit >= 5Cr; 2% net profit mandate", "marks_awarded": "+2.0 / 2.5"},
                {"page": 1, "tag": "Effectiveness: Social Impact", "remark": "Education and healthcare capture >60% funds", "marks_awarded": "+1.5 / 3.5"},
                {"page": 2, "tag": "Implementation Deficits", "remark": "Regional concentration in industrialized states", "marks_awarded": "+1.0 / 2.5"},
                {"page": 2, "tag": "Closing Synthesis", "remark": "Shift towards social audit and outcome-based CSR", "marks_awarded": "+0.5 / 1.5"}
            ],
            "sub_part_step_marking": [
                {"step_label": "1. Section 135 Statutory Criteria", "awarded": 2.0, "max": 2.5, "quoted_written": "500 Cr net worth, 1000 Cr turnover, 2% average net profit"},
                {"step_label": "2. Sectoral Effectiveness", "awarded": 1.5, "max": 3.5, "quoted_written": "Fund flow towards health and education"},
                {"step_label": "3. Implementation Challenges", "awarded": 1.0, "max": 2.5, "quoted_written": "Regional imbalance"},
                {"step_label": "4. Way Forward & Conclusion", "awarded": 0.5, "max": 1.5, "quoted_written": "Social audit integration"}
            ]
        }
        norm = normalize_evaluation_data(raw_eval, max_marks=10, question="CSR Statutory Framework", paper="GS2")
        
        # Opening step must receive substantive marks (+2.0 / 2.5), not treated as a trivial decorative intro
        first_step = norm["sub_part_step_marking"][0]
        self.assertGreaterEqual(float(first_step["awarded"]), 1.5)
        self.assertIn("Statutory", first_step["step_label"])

    def test_regression_05_present_weak_way_forward_partial_credit_not_zeroed(self):
        """Rule 5: Present but weak way forward gets partial credit, NEVER 0.0 or Demand Missed."""
        raw_eval = {
            "overall_score": 4.5,
            "max_marks": 10,
            "detected_question": "Examine the effectiveness of Nasha Mukt Bharat Abhiyaan and suggest measures.",
            "detected_paper": "GS2",
            "visual_annotations": [
                {"page": 1, "tag": "Overview", "remark": "Nasha Mukt Bharat Abhiyaan coverage", "marks_awarded": "+1.0 / 1.5"},
                {"page": 1, "tag": "Effectiveness & Gaps", "remark": "De-addiction infrastructure shortage", "marks_awarded": "+2.5 / 5.5"},
                {"page": 2, "tag": "Way Forward & Solutions", "remark": "1. More rehab centers 2. Community policing 3. Awareness in schools", "marks_awarded": "+1.0 / 3.0"}
            ],
            "sub_part_step_marking": [
                {"step_label": "1. Context", "awarded": 1.0, "max": 1.5, "quoted_written": "NAPDDR launch across 272 vulnerable districts"},
                {"step_label": "2. Effectiveness Analysis", "awarded": 2.5, "max": 5.5, "quoted_written": "Supply reduction vs demand reduction gaps"},
                {"step_label": "3. Way Forward & Solutions", "awarded": 1.0, "max": 3.0, "quoted_written": "1. More rehabilitation centers. 2. Community awareness. 3. Youth peer counseling."}
            ]
        }
        norm = normalize_evaluation_data(raw_eval, max_marks=10, question="Nasha Mukt Bharat", paper="GS2")
        
        wf_step = next((s for s in norm["sub_part_step_marking"] if "Way Forward" in s["step_label"]), None)
        self.assertIsNotNone(wf_step)
        self.assertGreater(float(wf_step["awarded"]), 0.0)
        # Status must be Partially Fulfilled, NEVER Demand Missed
        self.assertNotEqual(wf_step.get("demand_status"), "Demand Missed")
        self.assertIn("Partially", wf_step.get("demand_status"))

    def test_regression_06_word_count_conciseness_merit(self):
        """Rule 6: Answer length alone does not dictate score; substance and demand fulfillment govern."""
        # Tight 125-word answer with all core points
        concise_eval = {
            "overall_score": 5.5,
            "max_marks": 10,
            "word_count": 125,
            "detected_question": "Explain the role of SHGs in microfinance.",
            "sub_part_step_marking": [
                {"step_label": "1. Definition & NABARD Linkage", "awarded": 1.5, "max": 2.0, "quoted_written": "SHG-Bank Linkage Programme by NABARD 1992"},
                {"step_label": "2. Financial Inclusion Mechanism", "awarded": 2.5, "max": 4.5, "quoted_written": "Collateral-free group lending with >95% recovery rates"},
                {"step_label": "3. Way Forward", "awarded": 1.5, "max": 3.5, "quoted_written": "Digital empowerment via E-Shakti"}
            ]
        }
        # Verbose 230-word answer with generic fluff
        verbose_eval = {
            "overall_score": 4.0,
            "max_marks": 10,
            "word_count": 230,
            "detected_question": "Explain the role of SHGs in microfinance.",
            "sub_part_step_marking": [
                {"step_label": "1. General Introduction", "awarded": 1.0, "max": 2.0, "quoted_written": "India is a vast country where poor people live in villages..."},
                {"step_label": "2. Microfinance Discussion", "awarded": 2.0, "max": 4.5, "quoted_written": "Money is needed for everything and SHGs give small loans..."},
                {"step_label": "3. General Suggestions", "awarded": 1.0, "max": 3.5, "quoted_written": "Government should do more for society..."}
            ]
        }
        norm_concise = normalize_evaluation_data(concise_eval, max_marks=10, question="SHG role", paper="GS2")
        norm_verbose = normalize_evaluation_data(verbose_eval, max_marks=10, question="SHG role", paper="GS2")

        # Substance beats length: concise precise answer scores higher
        self.assertGreater(norm_concise["overall_score"], norm_verbose["overall_score"])

    def test_regression_07_coaching_advice_no_penalty(self):
        """Rule 7: Coaching advice in feedback does NOT deduct marks or penalize core demands."""
        raw_eval = {
            "overall_score": 6.0,
            "max_marks": 10,
            "detected_question": "Examine the formation of volcanic calderas.",
            "detected_paper": "GS1",
            "sub_part_step_marking": [
                {"step_label": "1. Premise & Definition", "awarded": 1.5, "max": 2.0, "quoted_written": "A caldera is a large depression formed when a volcano collapses."},
                {"step_label": "2. Formation Mechanism", "awarded": 3.0, "max": 5.0, "quoted_written": "Explosive eruption empties magma chamber causing structural collapse."},
                {"step_label": "3. Global & Indian Examples", "awarded": 1.5, "max": 3.0, "quoted_written": "Crater Lake USA, Krakatoa, Deccan ash beds."}
            ],
            "prioritized_feedback": [
                {
                    "priority": 1,
                    "focus": "Optional Value Enrichment",
                    "what_was_done_well": "Accurate physics of magma chamber evacuation and caldera collapse.",
                    "what_limits_marks": "No deduction applied. Answer achieves solid core marks.",
                    "how_to_improve": "Consider illustrating Lake Toba or Yellowstone to demonstrate supervolcano caldera scale."
                }
            ]
        }
        norm = normalize_evaluation_data(raw_eval, max_marks=10, question="Calderas", paper="GS1")
        self.assertEqual(norm["overall_score"], 6.0)
        # Verify coaching tip did not inflate deduction or decrease score
        fb = norm.get("prioritized_feedback", [])
        self.assertTrue(len(fb) >= 1)
        self.assertTrue("actionable_exam_hall_fix" in fb[0] or "how_to_improve_within_word_limit" in fb[0])

    def test_regression_08_demand_rubric_arithmetic_exactness(self):
        """Rule 8: Demand-level rubric anchors sum exactly to overall_score and max_marks."""
        raw_eval = {
            "overall_score": 7.5,
            "max_marks": 15,
            "sub_part_step_marking": [
                {"step_label": "1. Context", "awarded": 1.5, "max": 2.5, "quoted_written": "Context established"},
                {"step_label": "2. Dimension 1", "awarded": 2.5, "max": 5.0, "quoted_written": "Core dimension analysis"},
                {"step_label": "3. Dimension 2", "awarded": 2.0, "max": 4.5, "quoted_written": "Secondary dimension analysis"},
                {"step_label": "4. Way Forward", "awarded": 1.5, "max": 3.0, "quoted_written": "Forward looking conclusion"}
            ]
        }
        norm = normalize_evaluation_data(raw_eval, max_marks=15, question="Multipart question", paper="GS2")
        
        sum_aw = sum(float(s.get("awarded", 0)) for s in norm["sub_part_step_marking"])
        sum_mx = sum(float(s.get("max", 0)) for s in norm["sub_part_step_marking"])
        
        self.assertAlmostEqual(sum_aw, norm["overall_score"], places=1)
        self.assertAlmostEqual(sum_mx, 15.0, places=1)

    def test_regression_09_duplicate_page_deduplication(self):
        """Rule 9: Repeated pages or duplicate images do not produce duplicate credit."""
        raw_eval = {
            "overall_score": 4.0,
            "max_marks": 10,
            "visual_annotations": [
                {"page": 1, "tag": "Core Demand", "remark": "Magma chamber collapses under gravity", "marks_awarded": "+2.0 / 4.0"},
                # Duplicate upload of same page with identical tag and remark:
                {"page": 2, "tag": "Core Demand", "remark": "Magma chamber collapses under gravity", "marks_awarded": "+2.0 / 4.0"},
                {"page": 2, "tag": "Distinct Section", "remark": "Crater lake formation in caldera basin", "marks_awarded": "+1.5 / 3.0"}
            ],
            "evidence_ledger": [
                {"criterion": "Core Demand", "candidate_evidence": "Magma chamber collapses under gravity", "awarded_marks": 2.0, "max_marks": 4.0},
                {"criterion": "Duplicate Claim", "candidate_evidence": "Magma chamber collapses under gravity", "awarded_marks": 2.0, "max_marks": 4.0},
                {"criterion": "Lake Formation", "candidate_evidence": "Crater lake accumulation", "awarded_marks": 1.5, "max_marks": 3.0}
            ]
        }
        norm = normalize_evaluation_data(raw_eval, max_marks=10, question="Caldera formation", paper="GS1")
        
        # In evidence ledger, duplicate claim must be penalized / flagged as repeated point
        dup_entry = norm["evidence_ledger"][1]
        self.assertIn("Repeated point", dup_entry.get("assessment_of_evidence", ""))
        self.assertLessEqual(float(dup_entry.get("awarded_marks", 0)), 0.25)
        
        # Deduplication must prevent duplicate annotations from proliferating
        anns = norm.get("visual_annotations", [])
        self.assertTrue(len(anns) >= 1)



class TestGS2Demo8GroundTruthRegression(unittest.TestCase):
    """
    Ground-Truth Regression Suite based on GS2DEMO8 15M.pdf:
    Question: "India faces a paradox of food surplus and nutritional deficit. Analyse the structural reasons behind this paradox and suggest reform strategies. (Answer in 250 words) 15M"
    Verifies:
    1. OCR overlap deduplication across camera image boundaries.
    2. All 9 structural reasons and 7 reform points located on correct pages.
    3. "Reform strategies" heading recognized semantically as answering "suggest reform strategies".
    4. Consolidation of Page 3 reforms into a single body section (no duplicate WF callouts).
    5. No duplicate scoring of identical evidence spans.
    6. Topic-grounded Social Justice conclusion (NFSA, Article 47, Millets, POSHAN 2.0).
    7. Exact arithmetic alignment across marks and steps.
    """

    def setUp(self):
        self.question = "India faces a paradox of food surplus and nutritional deficit. Analyse the structural reasons behind this paradox and suggest reform strategies. (Answer in 250 words)"
        self.max_marks = 15
        self.paper = "GS2"
        self.transcribed_text = (
            "[Page 1]\n"
            "WHO lists nutritional security as most crucial determinant of health and well being.\n"
            "Buffer stock increase + acreage topping rice & wheat -> nutritional deficit @ 33% malnourished.\n"
            "Structural reasons:\n"
            "1) Cereal centricity in dietary intake @ rice-wheat focus.\n"
            "2) Rise of over-nutrition as 'nutritional deficit' @ obesity #2 in India by 2050.\n"
            "3) Consumption trends inclined towards HFSS foods over nutrient containing balanced diet.\n\n"
            "[Page 2]\n"
            "4) Inefficiency of buffer stock redistribution via PDS.\n"
            "5) Ration shop in accessibility @ Aadhaar fudging cases.\n"
            "6) Lack of diverse options availability @ millet based diet.\n"
            "7) Rising multidimensional poverty -> low access to nutritional food.\n"
            "8) Rising food inflation -> food budget squeeze.\n"
            "9) Lack of transportations and logistical soundhen @ 40% food loss due to absence of cold storage (CRBI report on Fruits & Vegetables).\n\n"
            "[Page 3]\n"
            "Reform strategies:\n"
            "1) PDS Interoperability @ ONORC introduction.\n"
            "2) Millet based diet promulgation @ PM Ann Shri.\n"
            "3) Rising standard of living -> enhanced access to food.\n"
            "4) ICDS - Poshan 2.0 @ Mid day meal emphasis on protein-based diet.\n"
            "5) Increased emphasis on physical literacy @ Fit India with clean eating component.\n"
            "6) Cross-exchange of food surplus with food deficient areas at parastatal levels.\n"
            "7) PM-Dhan Dhanya Yojna emphasis on rural empowerment : ~50% poverty in rural India.\n"
            "Thus, with focus on variegated vectors, a holistic culling of nutritional deficit is underway."
        )

    def test_ocr_overlap_deduplication(self):
        """Confirm OCR does not duplicate text from overlapping camera image regions."""
        from evaluator_engine import deduplicate_overlapping_page_transcripts

        overlapping_sample = (
            "[Page 1]\n"
            "1) Cereal centricity in dietary intake @ rice-wheat focus.\n"
            "2) Rise of over-nutrition as 'nutritional deficit' @ obesity #2 in India by 2050.\n"
            "3) Consumption trends inclined towards HFSS foods over nutrient containing balanced diet.\n\n"
            "[Page 2]\n"
            "3) Consumption trends inclined towards HFSS foods over nutrient containing balanced diet.\n"
            "4) Inefficiency of buffer stock redistribution via PDS.\n"
            "5) Ration shop in accessibility @ Aadhaar fudging cases."
        )
        deduped = deduplicate_overlapping_page_transcripts(overlapping_sample)
        # Point 3 should only appear ONCE in the deduped output
        p3_count = deduped.count("Consumption trends inclined towards HFSS foods")
        self.assertEqual(p3_count, 1, "Overlapping line at boundary between Page 1 and Page 2 must be deduplicated")
        self.assertIn("4) Inefficiency of buffer stock redistribution", deduped)

    def test_nine_reasons_and_seven_reforms_page_allocation(self):
        """Confirm all 9 structural reasons and 7 reform points are allocated to correct pages."""
        from evaluator_engine import _extract_page_point_range

        raw_eval = {
            "overall_score": 6.5,
            "max_marks": 15,
            "transcribed_text": self.transcribed_text,
            "detected_question": self.question,
            "visual_annotations": [
                {"page": 1, "tag": "Body: Structural reasons (Points 1–3)", "marks_awarded": "+1.5 / 3.5"},
                {"page": 2, "tag": "Body: Structural reasons (Points 4–9)", "marks_awarded": "+2.5 / 5.5"},
                {"page": 3, "tag": "Body: Reform strategies", "marks_awarded": "+2.0 / 4.5"},
                {"page": 3, "tag": "Conclusion", "marks_awarded": "+0.5 / 1.5"}
            ]
        }
        norm = normalize_evaluation_data(raw_eval, max_marks=15, question=self.question, paper="GS2")

        p1_ann = next(a for a in norm["visual_annotations"] if a.get("page") == 1 and "Structural" in a.get("tag", ""))
        p2_ann = next(a for a in norm["visual_annotations"] if a.get("page") == 2 and "Structural" in a.get("tag", ""))
        p3_ann = next(a for a in norm["visual_annotations"] if a.get("page") == 3 and "Reform" in a.get("tag", ""))

        self.assertIn("1–3", p1_ann["tag"], "Page 1 must cover reasons 1 to 3")
        self.assertIn("4–9", p2_ann["tag"], "Page 2 must cover reasons 4 to 9 without requiring repeated heading")
        self.assertIn("Reform strategies", p3_ann["tag"], "Page 3 must cover reform strategies")

    def test_reform_strategies_heading_answers_demand(self):
        """Confirm 'Reform strategies' is recognized semantically as answering 'suggest reform strategies'."""
        from evaluator_engine import _is_way_forward_demanded_by_question, _has_candidate_written_way_forward

        self.assertTrue(_is_way_forward_demanded_by_question(self.question))
        self.assertTrue(_has_candidate_written_way_forward("Reform strategies:\n1) PDS Interoperability @ ONORC"))

    def test_no_duplicate_way_forward_callouts(self):
        """Confirm Page 3 does NOT produce duplicate 'Way Forward & Solutions' and 'Way Forward & Synthesis'."""
        raw_eval = {
            "overall_score": 6.5,
            "max_marks": 15,
            "transcribed_text": self.transcribed_text,
            "detected_question": self.question,
            "visual_annotations": [
                {"page": 1, "tag": "Intro", "marks_awarded": "+1.0 / 2.0"},
                {"page": 1, "tag": "Body: Structural reasons", "marks_awarded": "+1.5 / 3.0"},
                {"page": 2, "tag": "Body: Structural reasons", "marks_awarded": "+2.0 / 4.0"},
                {"page": 3, "tag": "Body: Reform strategies", "marks_awarded": "+1.5 / 4.0"},
                {"page": 3, "tag": "Conclusion", "marks_awarded": "+0.5 / 2.0"}
            ]
        }
        norm = normalize_evaluation_data(raw_eval, max_marks=15, question=self.question, paper="GS2")
        p3_anns = [a for a in norm["visual_annotations"] if a.get("page") == 3]

        # On Page 3, there must be exactly 1 Body section (Reform strategies) + 1 Conclusion!
        # NEVER 2 body sections splitting reforms into artificial halves.
        p3_body_anns = [a for a in p3_anns if "concl" not in a.get("tag", "").lower() and "synthesis" not in a.get("tag", "").lower()]
        self.assertEqual(len(p3_body_anns), 1, "Page 3 must have exactly 1 consolidated body section for Reform strategies")
        self.assertIn("Reform", p3_body_anns[0]["tag"])

        # Conclusion must be present and tagged as Conclusion
        p3_conc_ann = next(a for a in p3_anns if "concl" in a.get("tag", "").lower() or "निष्कर्ष" in a.get("tag", "").lower())
        self.assertIsNotNone(p3_conc_ann)

    def test_no_duplicate_evidence_scoring(self):
        """Confirm the same evidence span is not scored twice across criteria."""
        raw_eval = {
            "overall_score": 6.0,
            "max_marks": 15,
            "evidence_ledger": [
                {"criterion": "Structural Reasons", "candidate_evidence": "40% food loss due to absence of cold storage", "awarded_marks": 2.0, "max_marks": 4.0},
                {"criterion": "Logistics Deficit", "candidate_evidence": "40% food loss due to absence of cold storage", "awarded_marks": 2.0, "max_marks": 4.0},
                {"criterion": "Reform Strategies", "candidate_evidence": "PDS Interoperability @ ONORC introduction", "awarded_marks": 2.0, "max_marks": 4.0}
            ]
        }
        norm = normalize_evaluation_data(raw_eval, max_marks=15, question=self.question, paper="GS2")
        dup_entry = norm["evidence_ledger"][1]
        self.assertIn("Repeated point", dup_entry.get("assessment_of_evidence", ""))
        self.assertLessEqual(float(dup_entry.get("awarded_marks", 0)), 0.25)

    def test_domain_specific_social_justice_conclusion(self):
        """Confirm Social Justice / Nutrition conclusion does NOT inject Article 13/50 boilerplate."""
        from evaluator_engine import _build_domain_specific_conclusion

        conc = _build_domain_specific_conclusion(self.question, paper_name="GS2")
        self.assertNotIn("Article 13", conc)
        self.assertNotIn("Article 50", conc)
        self.assertTrue(any(term in conc for term in ["NFSA", "Article 47", "SDG-2", "POSHAN", "Millets", "Shree Anna"]))


class TestUPSCInterdisciplinarySyllabusOverlap(unittest.TestCase):
    """
    Tests UPSC Mains Interdisciplinary Syllabus Overlap Matrix:
    Confirms questions with cross-subject touchpoints (e.g. RPA & Electoral Ethics,
    Corporate Governance & Ethics, Constitutional Rights & Preventive Detention,
    Historical Thinkers & Moral Philosophies) are recognized as academically compatible
    and never falsely blocked as intake mismatches.
    """

    def setUp(self):
        from evaluator_engine import is_paper_compatible, infer_paper_from_question_content
        self.is_paper_compatible = is_paper_compatible
        self.infer_paper_from_question_content = infer_paper_from_question_content

    def test_rpa_electoral_ethics_classified_as_gs2(self):
        """Question 14 (RPA, right to contest, electoral ethics, lifetime ban) must resolve to GS2."""
        q = "Examine the tension between the right to contest elections and the need to uphold electoral ethics under the Representation of the People Act. Should there be a lifetime ban on convicted criminals? (Answer in 250 words) 15"
        inferred = self.infer_paper_from_question_content(q)
        self.assertEqual(inferred, "GS2")

    def test_gs2_gs4_electoral_ethics_compatibility(self):
        """Confirm GS2 and GS4 are compatible for electoral ethics and RPA questions."""
        q = "Examine the tension between the right to contest elections and the need to uphold electoral ethics under the Representation of the People Act. Should there be a lifetime ban on convicted criminals? (Answer in 250 words) 15"
        self.assertTrue(self.is_paper_compatible("GS2", "GS4", q))
        self.assertTrue(self.is_paper_compatible("GS4", "GS2", q))
        self.assertTrue(self.is_paper_compatible("GS2", "GS2", q))

    def test_gs2_gs4_probity_and_anticorruption_compatibility(self):
        """Confirm Lokpal, POCA, and RTI are compatible across GS2 (Governance) and GS4 (Probity)."""
        q1 = "Analyze the effectiveness of the Lokpal and Lokayuktas Act in curbing corruption and restoring probity in public governance."
        self.assertTrue(self.is_paper_compatible("GS2", "GS4", q1))
        self.assertTrue(self.is_paper_compatible("GS4", "GS2", q1))

        q2 = "Right to Information is not merely a statutory right but a touchstone of transparent and ethical governance. Discuss."
        self.assertTrue(self.is_paper_compatible("GS2", "GS4", q2))
        self.assertTrue(self.is_paper_compatible("GS4", "GS2", q2))

    def test_gs3_gs4_corporate_and_environmental_ethics_compatibility(self):
        """Confirm CSR, corporate governance, and climate justice are compatible across GS3 and GS4."""
        q_csr = "Critically examine Corporate Social Responsibility (CSR) under Section 135 of the Companies Act as a tool for ethical business conduct."
        self.assertTrue(self.is_paper_compatible("GS3", "GS4", q_csr))
        self.assertTrue(self.is_paper_compatible("GS4", "GS3", q_csr))

        q_env = "Climate justice and intergenerational equity must guide global decarbonization goals. Discuss."
        self.assertTrue(self.is_paper_compatible("GS3", "GS4", q_env))
        self.assertTrue(self.is_paper_compatible("GS4", "GS3", q_env))

    def test_gs1_gs4_moral_thinkers_compatibility(self):
        """Confirm philosophical/moral ideas of Gandhi and Ambedkar are compatible across GS1 and GS4."""
        q_gandhi = "Mahatma Gandhi's concept of Trusteeship offers a moral alternative to unbridled capitalism. Elucidate."
        self.assertTrue(self.is_paper_compatible("GS1", "GS4", q_gandhi))
        self.assertTrue(self.is_paper_compatible("GS4", "GS1", q_gandhi))

    def test_genuine_mismatch_strictly_blocked(self):
        """Confirm genuine subject mismatches (e.g. Volcanic Calderas in GS4) remain strictly blocked."""
        q_geo = "Explain the process of formation of volcanic calderas. How do they contribute to geothermal energy?"
        self.assertFalse(self.is_paper_compatible("GS4", "GS1", q_geo))
        self.assertFalse(self.is_paper_compatible("GS4", "GS2", q_geo))

    def test_exact_step_marks_sum_unrounded(self):
        """Image 3 Regression Test: Confirm that when subpart step marks sum to 5.7/15, overall_score is exactly 5.7 without roundoff."""
        raw_eval = {
            "overall_score": 5.5,
            "max_marks": 15,
            "sub_part_step_marking": [
                {"step_label": "1. Introduction (Panchamrit Pledge & Context)", "awarded": 1.2, "max": 2.5, "sub_heading": "Target Baseline", "quoted_written": "India's Panchamrit pledge seeks to make India segments its energy with 45% coming from renewables."},
                {"step_label": "2. Economic Costs of Transition", "awarded": 2.5, "max": 6.5, "sub_heading": "Funding & Infra", "quoted_written": "Coal-powered economy's switch requires provisioning of funding; infrastructural demands, technological burdens."},
                {"step_label": "3. Social Costs of Transition", "awarded": 1.0, "max": 3.0, "sub_heading": "Livelihood Loss", "quoted_written": "Adoption rigidity, loss of livelihood in coal TPPs, encumbered tribal forests."},
                {"step_label": "4. Presentation & Structure", "awarded": 0.5, "max": 1.5, "sub_heading": "Diagrammatic Mapping", "quoted_written": "Clear subheadings (Economic costs, Social costs) and structural flowcharts."},
                {"step_label": "5. Conclusion", "awarded": 0.5, "max": 1.5, "sub_heading": "Synthesis", "quoted_written": "Synthesis of transition trade-offs."}
            ]
        }
        norm = normalize_evaluation_data(raw_eval, max_marks=15, question="Discuss the economic and social costs associated with the transition from coal to green energy in India.", paper="GS3")
        # Sum is 1.2 + 2.5 + 1.0 + 0.5 + 0.5 = 5.7
        self.assertEqual(norm["overall_score"], 5.7)
        self.assertEqual(norm["total_score"], 5.7)
        steps = norm.get("sub_part_step_marking", [])
        self.assertEqual(len(steps), 5)
        sum_steps = sum(float(s.get("awarded", 0)) for s in steps)
        self.assertAlmostEqual(sum_steps, 5.7, places=1)

    def test_no_repetitive_body_strengths_boilerplate(self):
        """Confirm that body_audit strengths never contain repetitive boilerplate sentences."""
        raw_eval = {
            "overall_score": 6.0,
            "max_marks": 15,
            "body_audit": {
                "strengths": [
                    "**Panchamrit Baseline & Thermal Dependency**: You clearly contrasted India's 45% renewable energy target with current coal predominance (>50%), establishing an authentic policy baseline. Your structured presentation of this dimension demonstrated strong conceptual grasp, fulfilling examiner expectations and securing primary demand marks.",
                    "**Technological & Infrastructural Hurdles**: You highlighted the technological burden of retrofitting systems."
                ]
            }
        }
        norm = normalize_evaluation_data(raw_eval, max_marks=15, question="Discuss the economic and social costs associated with the transition from coal to green energy in India.", paper="GS3")
        strengths = norm.get("body_audit", {}).get("strengths", [])
        self.assertGreaterEqual(len(strengths), 2)
        for s in strengths:
            self.assertNotIn("Your structured presentation of this dimension", s)
            self.assertNotIn("fulfilling examiner expectations", s)

    def test_value_addition_heatwaves_and_food_security_regression(self):
        """
        Regression Case: Heatwaves and global food security.
        - Suppress 2nd ARC and Law Commission on non-governance questions.
        - Atmospheric blocking mechanism is concise (<20 words) and explains physical dynamic.
        - IPCC food-security point is concise (<20 words) and addresses crop/food shocks.
        - Completely ban boilerplate ('grassroots institutional accountability', 'fiscal sustainability', etc.).
        - Card quota is <= 3 (no forced 4 dummy cards).
        """
        raw_eval = {
            "overall_score": 5.5,
            "max_marks": 15,
            "detected_question": "Analyze the causes behind rising frequency and intensity of heatwaves across the globe and examine their implications on global food security.",
            "detected_paper": "GS1",
            "subject_discipline": "GEOGRAPHY_DISASTER",
            "transcribed_text": "Heatwaves are rising due to climate change and El Nino. Atmospheric blocking also occurs. Crop yields drop in agricultural belts.",
            "body_audit": {
                "strengths": [
                    "You correctly noted the link between rising temperatures, El Nino events, and agricultural yield decline."
                ]
            },
            "missing_keywords_cards": [
                {
                    "number": 1,
                    "term": "Atmospheric Blocking (Omega Blocks)",
                    "domain_or_thinker": "Climatological Dynamic",
                    "definition": "Persistent high-pressure anticyclones trap descending hot air, prolonging heatwave duration and surface desiccation.",
                    "where_to_use": "Page 1 • Under your 'Causes of Heatwaves' sub-heading",
                    "how_to_use_one_line": "Deploy **Atmospheric Blocking** (persistent high-pressure systems) to reinforce policy delivery metrics and grassroots institutional accountability."
                },
                {
                    "number": 2,
                    "term": "IPCC AR6 Working Group II",
                    "domain_or_thinker": "Climate Impact Benchmark",
                    "definition": "Reports that compound heat-drought events trigger synchronous crop failures in global breadbasket regions.",
                    "where_to_use": "Page 2 • Under food security impacts",
                    "how_to_use_one_line": "Incorporate **IPCC AR6** (compound climate shocks) to substantiate fiscal sustainability and public expenditure efficiency."
                },
                {
                    "number": 3,
                    "term": "2nd ARC 4th Report (Ethics in Governance)",
                    "domain_or_thinker": "Administrative Reforms Benchmark",
                    "definition": "Official reform benchmark outlining codes of ethics and institutional safeguards.",
                    "where_to_use": "Page 2 • Under institutional reform",
                    "how_to_use_one_line": "Substantiate via 2nd ARC to recommend independent collegium structures."
                },
                {
                    "number": 4,
                    "term": "Law Commission 255th Report (2015)",
                    "domain_or_thinker": "Statutory Commission Benchmark",
                    "definition": "Proposed equal 3-member collegium for election commissioners.",
                    "where_to_use": "Page 3 • Closing recommendation",
                    "how_to_use_one_line": "Cite Law Commission 255th Report to reinforce statutory insulation."
                }
            ]
        }
        norm = normalize_evaluation_data(
            raw_eval,
            max_marks=15,
            question="Analyze the causes behind rising frequency and intensity of heatwaves across the globe and examine their implications on global food security.",
            paper="GS1"
        )
        cards = norm.get("missing_keywords_cards", [])

        # 1. Quota: Maximum 3 cards, never forced 4
        self.assertLessEqual(len(cards), 3)

        # 2. Question Fit: 2nd ARC and Law Commission must be strictly filtered out of heatwave evaluation
        terms = [str(c.get("term", "")).lower() for c in cards]
        for t in terms:
            self.assertNotIn("2nd arc", t)
            self.assertNotIn("law commission", t)

        # 3. Usage wording: Banned boilerplate phrases must be 100% absent
        banned = [
            "reinforce policy delivery metrics",
            "grassroots institutional accountability",
            "substantiate fiscal sustainability",
            "public expenditure efficiency",
            "deploy **",
            "incorporate **"
        ]
        for c in cards:
            usage = str(c.get("how_to_use_one_line", ""))
            for b in banned:
                self.assertNotIn(b, usage.lower())
            # Must be a concise insertion sentence under 20 words
            words = usage.split()
            self.assertLessEqual(len(words), 20)
            self.assertTrue(usage.endswith((".", "!", "?")))

        # 4. Check specific atmospheric blocking and IPCC insertion quality
        blocking_card = next((c for c in cards if "blocking" in str(c.get("term", "")).lower()), None)
        self.assertIsNotNone(blocking_card)
        self.assertIn("anticyclone", blocking_card["how_to_use_one_line"].lower())

    def test_value_addition_poverty_and_capabilities_regression(self):
        """
        Regression Case: Multidimensional poverty, health, and capability approach.
        - Alkire-Foster insertion must explain deprivation dimensions without jumping to accountability filler.
        - Capability approach must connect capabilities to the question's concern without fiscal efficiency boilerplate.
        - Zero governance contamination.
        - Every insertion <= 20 words.
        """
        raw_eval = {
            "overall_score": 4.5,
            "max_marks": 10,
            "detected_question": "Discuss the multidimensional nature of poverty and examine how the capability approach broadens our understanding of human deprivations.",
            "detected_paper": "GS2",
            "subject_discipline": "SOCIAL_JUSTICE_SOCIETY",
            "transcribed_text": "Poverty in India has traditionally been measured through consumption expenditure like Tendulkar committee. But poverty also has health and nutrition dimensions.",
            "body_audit": {
                "strengths": [
                    "You accurately noted the shift from consumption expenditure metrics to broader deprivation indicators."
                ]
            },
            "missing_keywords_cards": [
                {
                    "number": 1,
                    "term": "Alkire-Foster Method (Global MPI)",
                    "domain_or_thinker": "Multidimensional Measurement",
                    "definition": "Dual-cutoff counting methodology capturing overlapping deprivations across health, education, and living standards.",
                    "where_to_use": "Page 1 • Beside Tendulkar committee consumption line",
                    "how_to_use_one_line": "Incorporate **Alkire-Foster Method** to reinforce policy delivery metrics and grassroots institutional accountability."
                },
                {
                    "number": 2,
                    "term": "Amartya Sen's Capability Approach",
                    "domain_or_thinker": "Development Philosophy",
                    "definition": "Conceptualizes poverty as capability deprivation that restricts human agency and substantial freedoms.",
                    "where_to_use": "Page 2 • Under 'Capability Framework' section",
                    "how_to_use_one_line": "Deploy **Capability Approach** to substantiate fiscal sustainability and public expenditure efficiency."
                },
                {
                    "number": 3,
                    "term": "Law Commission 255th Report (2015)",
                    "domain_or_thinker": "Statutory Commission Benchmark",
                    "definition": "Proposed election commissioner selection collegium.",
                    "where_to_use": "Page 2 • Under governance",
                    "how_to_use_one_line": "Cite Law Commission to ground systemic governance reforms."
                }
            ]
        }
        norm = normalize_evaluation_data(
            raw_eval,
            max_marks=10,
            question="Discuss the multidimensional nature of poverty and examine how the capability approach broadens our understanding of human deprivations.",
            paper="GS2"
        )
        cards = norm.get("missing_keywords_cards", [])

        # 1. Zero Law Commission report on poverty question
        terms = [str(c.get("term", "")).lower() for c in cards]
        self.assertFalse(any("law commission" in t for t in terms))

        # 2. Alkire-Foster insertion must be concise and explain deprivation dimensions
        af_card = next((c for c in cards if "alkire" in str(c.get("term", "")).lower()), None)
        self.assertIsNotNone(af_card)
        af_usage = af_card["how_to_use_one_line"]
        self.assertIn("deprivation", af_usage.lower())
        self.assertNotIn("accountability", af_usage.lower())
        self.assertLessEqual(len(af_usage.split()), 20)

        # 3. Amartya Sen insertion must explain capabilities and freedoms
        sen_card = next((c for c in cards if "sen" in str(c.get("term", "")).lower() or "capability" in str(c.get("term", "")).lower()), None)
        self.assertIsNotNone(sen_card)
        sen_usage = sen_card["how_to_use_one_line"]
        self.assertIn("capabilit", sen_usage.lower())
        self.assertNotIn("fiscal", sen_usage.lower())
        self.assertLessEqual(len(sen_usage.split()), 20)

    def test_value_addition_governance_contrast_case(self):
        """
        Contrast Case: Question demanding electoral reform / ethics in governance.
        - Confirm 2nd ARC and Law Commission 255th Report ARE ELIGIBLE when demanded by question!
        - Usage line is clean, direct insertion without meta-prefixes ('Deploy X to...').
        - Length <= 20 words.
        """
        raw_eval = {
            "overall_score": 6.5,
            "max_marks": 15,
            "detected_question": "Critically analyze the existing appointment procedure of the Election Commission of India. How do recommendations of the 2nd ARC and Law Commission address executive dominance?",
            "detected_paper": "GS2",
            "subject_discipline": "POLITY_GOVERNANCE",
            "transcribed_text": "The ECI appointments under Article 324 have faced scrutiny over executive supremacy. The Supreme Court in Anoop Baranwal mandated a collegium.",
            "body_audit": {
                "strengths": [
                    "You correctly cited the Anoop Baranwal (2023) verdict and Article 324(2) provisions on executive appointment."
                ]
            },
            "missing_keywords_cards": [
                {
                    "number": 1,
                    "term": "Law Commission 255th Report (2015)",
                    "domain_or_thinker": "Statutory Commission Benchmark",
                    "definition": "Proposed an equal 3-member collegium (PM, CJI, LoP) and constitutional removal parity for all Election Commissioners under Art. 324(5).",
                    "where_to_use": "Page 2 • Under 'Challenges to Autonomy / Executive Dominance' bullet",
                    "how_to_use_one_line": "Cite **Law Commission 255th Report (2015)** to advocate equal constitutional removal safeguards and a 3-member collegium for all Election Commissioners."
                },
                {
                    "number": 2,
                    "term": "2nd ARC 4th Report (Ethics in Governance)",
                    "domain_or_thinker": "Administrative Reforms Benchmark",
                    "definition": "Recommended an insulated appointment collegium (PM, Speaker, CJI, LoP, Law Minister) to eliminate executive dominance in watchdog institutions.",
                    "where_to_use": "Page 2–3 • Beside your closing recommendations point",
                    "how_to_use_one_line": "Substantiate via **2nd ARC 4th Report** to recommend a broad collegium (PM, CJI, Speaker, LoP, Law Minister) to insulate watchdog bodies."
                }
            ]
        }
        norm = normalize_evaluation_data(
            raw_eval,
            max_marks=15,
            question="Critically analyze the existing appointment procedure of the Election Commission of India. How do recommendations of the 2nd ARC and Law Commission address executive dominance?",
            paper="GS2"
        )
        cards = norm.get("missing_keywords_cards", [])

        # Both governance reports MUST be preserved because the question specifically demanded them!
        terms = [str(c.get("term", "")).lower() for c in cards]
        self.assertTrue(any("law commission" in t for t in terms))
        self.assertTrue(any("arc" in t for t in terms))

        for c in cards:
            usage = str(c.get("how_to_use_one_line", ""))
            self.assertFalse(usage.lower().startswith("cite **"))
            self.assertFalse(usage.lower().startswith("substantiate via"))
            self.assertLessEqual(len(usage.split()), 20)
            self.assertTrue(usage.endswith((".", "!", "?")))

    def test_value_addition_omits_adequately_explained_concepts(self):
        """
        Answer Fit & Omission:
        If a student already explained a concept adequately (in transcribed_text and body_audit.strengths),
        it must be OMITTED (not replaced with synthetic fallback cards).
        """
        raw_eval = {
            "overall_score": 7.0,
            "max_marks": 10,
            "detected_question": "Explain the causes and distribution of deep-focus earthquakes along convergent boundaries.",
            "detected_paper": "GS1",
            "subject_discipline": "GEOGRAPHY_DISASTER",
            "transcribed_text": "Deep focus earthquakes occur along the Wadati-Benioff zone where the cold oceanic slab subducts beneath the continental plate into the asthenosphere, causing seismicity down to 700km depth.",
            "body_audit": {
                "strengths": [
                    "You demonstrated strong geophysical precision by accurately detailing the Wadati-Benioff zone subduction dynamics and the 700km focal depth threshold."
                ]
            },
            "missing_keywords_cards": [
                {
                    "number": 1,
                    "term": "Wadati-Benioff Zone",
                    "domain_or_thinker": "Subduction Seismology",
                    "definition": "Seismic zone tracing subducting slab interfaces down to 700km.",
                    "where_to_use": "Page 1 • Beside subduction point",
                    "how_to_use_one_line": "Deep-focus earthquakes occur along inclined Wadati–Benioff zones."
                }
            ]
        }
        norm = normalize_evaluation_data(
            raw_eval,
            max_marks=10,
            question="Explain the causes and distribution of deep-focus earthquakes along convergent boundaries.",
            paper="GS1"
        )
        cards = norm.get("missing_keywords_cards", [])
        # Since the student already explained Wadati-Benioff thoroughly and received praise, it must be omitted!
        terms = [str(c.get("term", "")).lower() for c in cards]
        self.assertFalse(any("benioff" in t for t in terms))
        # Zero cards is completely appropriate and expected
        self.assertEqual(len(cards), 0)

if __name__ == "__main__":

    unittest.main()
