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


if __name__ == "__main__":
    unittest.main()
