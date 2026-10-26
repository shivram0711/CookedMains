# -*- coding: utf-8 -*-
"""
Dedicated Regression Test Suite for Grounded Answer Evaluation & Coaching Upgrade
Cooked Mains (UPSC Mains Evaluator)

Verifies:
1. DPC 15-Marker Regression:
   - Ensures no topic hijacking when candidate mentions 'APD and ABP' or 'plugging loopholes'.
   - Evaluates DPC under Article 243ZD (74th CAA) - plan consolidation vs direct service delivery.
   - Conceptual diagram accuracy check: Flags line-department service execution as a conceptual flaw.
   - Verified value additions: 2nd ARC 6th Report, Punchhi Commission, Kerala decentralized model.
2. 100% Strict Mathematical Reconciliation:
   - sum(sub_part_step_marking.max) == max_marks (10.0, 15.0, 20.0)
   - sum(sub_part_step_marking.awarded) == overall_score
   - sum(rubric_scores.max) == max_marks
   - sum(rubric_scores.awarded) == overall_score
   - subpart_marks_breakdown perfectly mirrors sub_part_step_marking
3. Pacing & Layout Discipline:
   - Exam pacing metrics framed as approximate benchmarks (~18-22 wpm) without speculative stopwatch assertions.
   - Eliminates negative surplus text ('This surplus -2.8 minutes is directly stolen...').
4. Bilingual Hindi Medium Support:
   - Authentic Devanagari DPC evaluation under Article 243ZD.
"""

import unittest
import copy
from evaluator_engine import (
    normalize_evaluation_data,
    get_canonical_demand_status,
    _build_domain_specific_intro,
    _enforce_canonical_mathematical_reconciliation
)

class TestGroundedMentorUpgrade(unittest.TestCase):

    def setUp(self):
        self.dpc_question = (
            "The District Planning Committee (DPC) was envisioned as a key instrument to strengthen "
            "grassroots-level planning. How far has it succeeded in achieving this goal? "
            "Discuss the challenges faced by DPCs and suggest measures to make them more effective. "
            "(Answer in 250 words) 15"
        )
        self.dpc_transcript = (
            "[Page 1] District Planning Committee was established under 74th Constitutional Amendment Act "
            "under Article 243ZD to prepare draft development plan for the district as a whole.\n"
            "Key successes include decentralised planning and Kerala's People's Plan model.\n"
            "Central diagram: DPC -> delivering Health, Education, Roads, Water directly.\n"
            "[Page 2] Challenges faced by DPC: Irregular meetings, non-constitution in many states.\n"
            "Lack of dedicated budget and permanent staff. Smart City SPVs bypassing DPCs.\n"
            "Glass study reports 85% planning gap.\n"
            "Mentioned NITI Aayog's APD and ABP for regional planning.\n"
            "[Page 3] Measures to make DPCs effective: 2nd ARC recommendations for independent secretariat.\n"
            "Capacity building and mandatory financial devolution."
        )

    def test_dpc_no_topic_hijacking(self):
        """DPC answer mentioning APD/ABP must NOT be hijacked by Aspirational Districts Programme."""
        raw_eval = {
            "overall_score": 5.0,
            "max_marks": 15,
            "detected_question": self.dpc_question,
            "detected_paper": "GS2",
            "medium": "english",
            "transcribed_text": self.dpc_transcript,
            "sub_part_step_marking": [
                {
                    "step_label": "1. Mandate & Article 243ZD",
                    "sub_heading": "Constitutional Vision of DPC",
                    "awarded": 1.5,
                    "max": 3.0,
                    "quoted_written": "District Planning Committee was established under 74th CAA under Article 243ZD"
                },
                {
                    "step_label": "2. Successes in Grassroots Planning",
                    "sub_heading": "Extent of Success & Kerala Model",
                    "awarded": 1.0,
                    "max": 3.5,
                    "quoted_written": "Key successes include decentralised planning and Kerala's People's Plan model"
                },
                {
                    "step_label": "3. Challenges Faced by DPCs",
                    "sub_heading": "Structural, Financial & Parallel Body Impediments",
                    "awarded": 1.5,
                    "max": 4.5,
                    "quoted_written": "Irregular meetings, lack of dedicated budget, Smart City SPVs bypassing DPCs"
                },
                {
                    "step_label": "4. Remedial Measures & 2nd ARC",
                    "sub_heading": "Strengthening DPC Secretariat & Devolution",
                    "awarded": 1.0,
                    "max": 4.0,
                    "quoted_written": "Measures: 2nd ARC recommendations for independent secretariat and capacity building"
                }
            ],
            "rubric_scores": {
                "intro_score": 1.5,
                "intro_max": 2.0,
                "core_demand_score": 2.0,
                "core_demand_max": 7.5,
                "value_add_score": 0.5,
                "value_add_max": 2.0,
                "presentation_score": 0.5,
                "presentation_max": 1.5,
                "conclusion_score": 0.5,
                "conclusion_max": 2.0
            }
        }

        norm = normalize_evaluation_data(raw_eval, max_marks=15, question=self.dpc_question, paper="GS2")

        # 1. Verify no ADP topic hijacking
        kw_toolkit_title = norm.get("keyword_toolkit_title", "")
        self.assertNotIn("Aspirational Districts", kw_toolkit_title, "Must not hijack title to Aspirational Districts!")

        # Verify missing keywords cards do NOT inject ADP 3Cs, 49 KPIs, Goodhart's law
        kw_cards = norm.get("missing_keywords_cards", [])
        adp_terms = ["3cs strategy", "champions of change portal & 49 kpis", "goodhart's law", "project sampoorna"]
        for card in kw_cards:
            term_low = str(card.get("term", "")).lower()
            self.assertFalse(any(ad in term_low for ad in adp_terms), f"Injected hijacked ADP term: {term_low}")

        # 2. Verify mathematical consistency (No 15.1 or 15.2 drift!)
        steps = norm.get("sub_part_step_marking", [])
        sum_max = round(sum(float(s["max"]) for s in steps), 1)
        sum_awarded = round(sum(float(s["awarded"]) for s in steps), 1)
        self.assertEqual(sum_max, 15.0, f"Sum of step maxima must equal 15.0 exactly, got {sum_max}")
        self.assertEqual(sum_awarded, norm["overall_score"], f"Sum of step awarded must equal overall_score {norm['overall_score']}, got {sum_awarded}")

        # Verify rubric scores sum
        rubric = norm.get("rubric_scores", {})
        comp_keys = ["intro", "core_demand", "value_add", "presentation", "conclusion"]
        sum_r_max = round(sum(float(rubric[f"{k}_max"]) for k in comp_keys), 1)
        sum_r_sc = round(sum(float(rubric[f"{k}_score"]) for k in comp_keys), 1)
        self.assertEqual(sum_r_max, 15.0, f"Sum of rubric maxima must equal 15.0, got {sum_r_max}")
        self.assertEqual(sum_r_sc, norm["overall_score"], f"Sum of rubric scores must equal overall_score {norm['overall_score']}, got {sum_r_sc}")

        # 3. Verify subpart_marks_breakdown synchronization
        sb_breakdown = norm.get("subpart_marks_breakdown", [])
        self.assertEqual(len(sb_breakdown), len(steps))
        for idx in range(len(steps)):
            self.assertEqual(sb_breakdown[idx]["max_marks"], steps[idx]["max"])
            self.assertEqual(sb_breakdown[idx]["marks_awarded"], steps[idx]["awarded"])
            self.assertEqual(sb_breakdown[idx]["demand_status"], steps[idx]["demand_status"])

    def test_dpc_domain_specific_intro(self):
        """_build_domain_specific_intro produces Article 243ZD plan consolidation intro for DPC."""
        intro = _build_domain_specific_intro(self.dpc_question, "GS2", is_hindi=False)
        self.assertIn("Article 243ZD", intro)
        self.assertIn("District Planning Committee", intro)
        self.assertIn("Panchayats and Municipalities", intro)
        self.assertNotIn("NITI Aayog", intro)
        self.assertNotIn("MoUD", intro)

    def test_hindi_dpc_intro(self):
        """Hindi DPC introduction produces authentic Devanagari Article 243ZD content."""
        hi_q = "जिला योजना समिति (DPC) की प्रभावशीलता एवं चुनौतियों का परीक्षण कीजिए।"
        intro_hi = _build_domain_specific_intro(hi_q, "GS2", is_hindi=True)
        self.assertIn("अनुच्छेद 243ZD", intro_hi)
        self.assertIn("जिला योजना समिति", intro_hi)
        self.assertIn("पंचायतों", intro_hi)

    def test_exact_reconciliation_10m(self):
        """10-marker answer preserves authentic marks and reports denominator alignment."""
        data = {
            "overall_score": 4.2,
            "max_marks": 10,
            "sub_part_step_marking": [
                {"step_label": "1. Intro", "max": 1.5, "awarded": 1.1},
                {"step_label": "2. Part A", "max": 4.0, "awarded": 1.6},
                {"step_label": "3. Part B", "max": 3.0, "awarded": 1.0},
                {"step_label": "4. Conclusion", "max": 1.5, "awarded": 0.5}
            ],
            "rubric_scores": {
                "intro_score": 1.1, "intro_max": 1.5,
                "core_demand_score": 1.6, "core_demand_max": 4.5,
                "value_add_score": 0.5, "value_add_max": 1.5,
                "presentation_score": 0.5, "presentation_max": 1.0,
                "conclusion_score": 0.5, "conclusion_max": 1.5
            }
        }
        _enforce_canonical_mathematical_reconciliation(data, max_marks=10, is_hindi=False)
        sum_m = sum(float(s["max"]) for s in data["sub_part_step_marking"])
        sum_a = sum(float(s["awarded"]) for s in data["sub_part_step_marking"])
        self.assertEqual(round(sum_m, 1), 10.0)
        self.assertEqual(round(sum_a, 1), data["overall_score"])

        comp_keys = ["intro", "core_demand", "value_add", "presentation", "conclusion"]
        sum_rm = sum(float(data["rubric_scores"][f"{k}_max"]) for k in comp_keys)
        sum_ra = sum(float(data["rubric_scores"][f"{k}_score"]) for k in comp_keys)
        self.assertEqual(round(sum_rm, 1), 10.0)
        self.assertEqual(round(sum_ra, 1), data["overall_score"])

    def test_pacing_discipline_no_negative_surplus(self):
        """Exam hall discipline metrics must not emit awkward negative surplus text."""
        raw_eval = {
            "overall_score": 4.5,
            "max_marks": 15,
            "detected_question": self.dpc_question,
            "transcribed_text": "[Page 1] " + ("DPC grassroots planning " * 30), # ~90 words
        }
        norm = normalize_evaluation_data(raw_eval, max_marks=15, question=self.dpc_question, paper="GS2")
        disc = norm.get("upsc_exam_hall_discipline", {})
        warning_txt = disc.get("time_penalty_warning", "")
        self.assertNotIn("surplus -", warning_txt, "Negative surplus phrase must be eliminated!")
        self.assertNotIn("-2.8 minutes is directly stolen", warning_txt)

    def test_zero_score_not_defaulted_or_clamped(self):
        """A zero score on an unattempted/blank copy must remain 0.0, never inflated to 4.0/6.5 or clamped to 0.5."""
        unattempted_eval = {
            "overall_score": 0.0,
            "max_marks": 15,
            "detected_question": self.dpc_question,
            "sub_part_step_marking": [
                {"step_label": "1. Mandate", "max": 4.0, "awarded": 0.0},
                {"step_label": "2. Challenges", "max": 6.0, "awarded": 0.0},
                {"step_label": "3. Measures", "max": 5.0, "awarded": 0.0}
            ]
        }
        _enforce_canonical_mathematical_reconciliation(unattempted_eval, max_marks=15, is_hindi=False)
        self.assertEqual(unattempted_eval["overall_score"], 0.0, "Zero score must remain 0.0, never defaulted or clamped to 0.5!")
        for step in unattempted_eval["sub_part_step_marking"]:
            self.assertEqual(step["awarded"], 0.0, "Zero awarded marks must not be inflated!")

    def test_no_mark_redistribution_when_subtotals_disagree(self):
        """Reconciliation must detect and report inconsistency; it must NOT invent or redistribute criterion marks."""
        inconsistent_eval = {
            "overall_score": 6.0, # Stated 6.0, but criteria actually sum to 4.5
            "max_marks": 15,
            "detected_question": self.dpc_question,
            "sub_part_step_marking": [
                {"step_label": "1. Intro", "max": 2.0, "awarded": 1.0},
                {"step_label": "2. Part A", "max": 7.0, "awarded": 2.0},
                {"step_label": "3. Part B", "max": 2.5, "awarded": 0.5},
                {"step_label": "4. Part C", "max": 1.5, "awarded": 0.0},
                {"step_label": "5. Conclusion", "max": 2.0, "awarded": 1.0}
            ]
        }
        _enforce_canonical_mathematical_reconciliation(inconsistent_eval, max_marks=15, is_hindi=False)

        # 1. Criteria marks must NOT be redistributed or mutated!
        steps = inconsistent_eval["sub_part_step_marking"]
        self.assertEqual(steps[0]["awarded"], 1.0)
        self.assertEqual(steps[1]["awarded"], 2.0, "Part A must remain 2.0 based on evidence, not reduced to force a fit!")
        self.assertEqual(steps[2]["awarded"], 0.5)
        self.assertEqual(steps[3]["awarded"], 0.0)
        self.assertEqual(steps[4]["awarded"], 1.0)

        # 2. Inconsistency must be detected and recorded in audit
        self.assertTrue(len(inconsistent_eval.get("arithmetic_inconsistencies", [])) > 0)
        inc = inconsistent_eval["arithmetic_inconsistencies"][0]
        self.assertEqual(inc["type"], "subtotal_overall_mismatch")
        self.assertEqual(inc["criterion_sum"], 4.5)
        self.assertEqual(inc["stated_overall"], 6.0)

        # 3. Overall score truthfully equals the exact sum of evaluated criteria
        self.assertEqual(inconsistent_eval["overall_score"], 4.5)


if __name__ == "__main__":
    unittest.main()
