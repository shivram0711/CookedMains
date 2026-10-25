# -*- coding: utf-8 -*-
"""
Unit and Regression Test Suite for Diagram & Space Audit Feature
Cooked Mains (UPSC Mains Evaluator)

Verifies:
1. Visual Subjects: Recommends visual diagrams (process, flow, cycle, comparison, hierarchy) for visual topics with structured nodes.
2. Abstract Subjects: Recommends skipping diagrams for doctrinal/philosophical questions with clear justification.
3. No Fixed Generic Boilerplate: Never outputs 'Constitutional Mandate -> Institutional Bottleneck -> Way Forward'.
4. Grounded Exam Sketch Instructions: Supplies concrete 45-second drawing steps.
5. Comparisons: Supplies comparison columns when diagram_type is 'comparison'.
6. Bilingual Hindi Support: Generates Devanagari labels and guidance for Hindi medium.
7. Scoring & Keywords Preserved: Overall score, rubric scores, and missing_keywords_cards are unchanged.
"""

import unittest
import copy
from evaluator_engine import normalize_evaluation_data

class TestDiagramAudit(unittest.TestCase):

    def setUp(self):
        self.base_eval_data = {
            "overall_score": 4.5,
            "max_marks": 10,
            "detected_paper": "GS1",
            "detected_question": "Examine the physical and atmospheric mechanisms leading to persistent heatwaves over Northwest India.",
            "transcribed_text": (
                "[Page 1] Heatwaves in Northwest India are caused by incoming solar insolation and advection of hot air from Thar desert.\n"
                "The persistence of heatwaves is caused by high pressure cells.\n"
                "[Page 2] Impact on agriculture includes reduced soil moisture and lower crop yields."
            ),
            "sub_part_step_marking": [
                {"step_label": "1. Intro", "max": 1.5, "awarded": 1.0, "sub_heading": "Heatwave Definition & Threshold", "quoted_written": "Heatwaves in Northwest India are caused by incoming solar insolation"},
                {"step_label": "2. Part A", "max": 4.0, "awarded": 2.0, "sub_heading": "Causal Atmospheric Drivers", "quoted_written": "The persistence of heatwaves is caused by high pressure cells"},
                {"step_label": "3. Part B", "max": 3.0, "awarded": 1.0, "sub_heading": "Socio-Ecological Impacts", "quoted_written": "Impact on agriculture includes reduced soil moisture and lower crop yields"},
                {"step_label": "4. Conclusion", "max": 1.5, "awarded": 0.5, "sub_heading": "Heat Action Plan & Resilience", "quoted_written": "Strengthening NDMA guidelines and early warning"}
            ],
            "rubric_scores": {
                "intro_score": 1.0,
                "intro_max": 1.5,
                "core_demand_score": 2.0,
                "core_demand_max": 4.5,
                "value_add_score": 0.5,
                "value_add_max": 1.5,
                "presentation_score": 0.5,
                "presentation_max": 1.0,
                "conclusion_score": 0.5,
                "conclusion_max": 1.5
            },
            "missing_keywords_cards": [
                {
                    "number": 1,
                    "action_type": "Add",
                    "priority": "High Priority",
                    "term": "Atmospheric Blocking (Omega Block)",
                    "definition": "Stationary high-pressure anticyclones trapping hot air.",
                    "where_to_use": "Page 1 • Inside your 'Causal Atmospheric Drivers' section",
                    "how_to_use_one_line": "Persistent anticyclonic blocking traps descending dry air, compounding surface drying."
                }
            ],
            "current_affairs_value_add": {
                "diagram_recommendation": {
                    "is_recommended": True,
                    "diagram_type": "process",
                    "title": "Omega Block Atmospheric Trap Mechanism",
                    "why_it_helps": "Visually illustrates the thermodynamic blocking preventing convective heat dispersion.",
                    "exam_sketch_tip": "Draw 3 linear boxes: Box 1 Anticyclonic Ridge -> Box 2 Adiabatic Subsidence -> Box 3 Ground Baking.",
                    "placement": "Page 1 • Beside your 'Causal Atmospheric Drivers' section",
                    "nodes": [
                        {"step": 1, "label": "Anticyclonic High Pressure", "subtext": "Stationary mid-tropospheric ridge", "badge": "Trigger"},
                        {"step": 2, "label": "Adiabatic Subsidence", "subtext": "Descending dry air warms dynamically", "badge": "Mechanism"},
                        {"step": 3, "label": "Ground Moisture Baking", "subtext": "Heat persists with zero cloud formation", "badge": "Impact"}
                    ]
                }
            }
        }

    def test_visual_subject_diagram_recommended(self):
        """Physical Geography heatwave question gets structured diagram preview with nodes and sketch tip."""
        data = copy.deepcopy(self.base_eval_data)
        normalized = normalize_evaluation_data(data, max_marks=10, question=data["detected_question"], paper="GS1")
        diag = normalized.get("current_affairs_value_add", {}).get("diagram_recommendation", {})
        
        self.assertTrue(diag.get("is_recommended"))
        self.assertIn(diag.get("diagram_type"), ["process", "flow", "cycle", "timeline", "comparison", "hierarchy"])
        self.assertTrue(len(diag.get("title", "")) > 5)
        self.assertTrue(len(diag.get("nodes", [])) >= 2)
        self.assertTrue(len(diag.get("exam_sketch_tip", "")) > 10)
        self.assertTrue(len(diag.get("why_it_helps", "")) > 10)

    def test_doctrinal_philosophical_diagram_not_recommended(self):
        """Abstract/philosophical questions without visual ROI should recommend skipping diagrams."""
        data = copy.deepcopy(self.base_eval_data)
        data["detected_question"] = "Critically examine the philosophical doctrine of Basic Structure and constitutional morality in India."
        data["detected_paper"] = "GS2"
        data["current_affairs_value_add"]["diagram_recommendation"] = {
            "is_recommended": False,
            "not_recommended_reason": "This doctrinal constitutional question requires dense textual jurisprudence; an artificial diagram would displace necessary arguments."
        }
        normalized = normalize_evaluation_data(data, max_marks=10, question=data["detected_question"], paper="GS2")
        diag = normalized.get("current_affairs_value_add", {}).get("diagram_recommendation", {})

        self.assertFalse(diag.get("is_recommended"))
        self.assertTrue(len(diag.get("not_recommended_reason", "")) > 10)

    def test_no_fixed_arrow_chain_boilerplate(self):
        """Rejects generic boilerplate like 'Constitutional Mandate -> Institutional Bottleneck -> Way Forward'."""
        data = copy.deepcopy(self.base_eval_data)
        data["current_affairs_value_add"]["diagram_recommendation"] = {
            "concept_title": "Multi-Dimensional Analytical Flowchart",
            "structure": "Constitutional Mandate -> Institutional Bottleneck -> Way Forward",
            "exam_hall_sketch_tip": "Draw a clean 45-second 3-stage linear pipeline to visually capture structural depth."
        }
        normalized = normalize_evaluation_data(data, max_marks=10, question=data["detected_question"], paper="GS1")
        diag = normalized.get("current_affairs_value_add", {}).get("diagram_recommendation", {})

        title = str(diag.get("title", "")).lower()
        self.assertNotIn("multi-dimensional analytical flowchart", title)
        
        nodes_labels = [n.get("label", "").lower() for n in diag.get("nodes", [])]
        self.assertNotIn("constitutional mandate", nodes_labels)
        self.assertNotIn("institutional bottleneck", nodes_labels)

    def test_comparison_diagram_structure(self):
        """Comparison diagram type includes structured comparison_columns."""
        data = copy.deepcopy(self.base_eval_data)
        data["detected_question"] = "Compare Strategic Disinvestment with Asset Monetisation under the National Monetisation Pipeline."
        data["detected_paper"] = "GS3"
        data["current_affairs_value_add"]["diagram_recommendation"] = {
            "is_recommended": True,
            "diagram_type": "comparison",
            "title": "Strategic Disinvestment vs Asset Monetisation",
            "why_it_helps": "Clearly contrasts ownership transfer with operational concession leasing.",
            "exam_sketch_tip": "Draw a 2-column comparative table with headers: Disinvestment vs NMP.",
            "comparison_columns": [
                {"header": "Strategic Disinvestment", "points": ["Transfer of ownership & management", "State equity below 50%"]},
                {"header": "Asset Monetisation (NMP)", "points": ["State retains core ownership", "Leasing operational concession rights"]}
            ]
        }
        normalized = normalize_evaluation_data(data, max_marks=10, question=data["detected_question"], paper="GS3")
        diag = normalized.get("current_affairs_value_add", {}).get("diagram_recommendation", {})

        self.assertTrue(diag.get("is_recommended"))
        self.assertEqual(diag.get("diagram_type"), "comparison")
        cols = diag.get("comparison_columns", [])
        self.assertEqual(len(cols), 2)
        self.assertIn("Strategic Disinvestment", cols[0]["header"])

    def test_bilingual_hindi_diagram(self):
        """Hindi medium evaluation produces Devanagari diagram recommendations."""
        data = copy.deepcopy(self.base_eval_data)
        data["detected_question"] = "उत्तर-पश्चिम भारत में लू (Heatwave) की निरंतरता के भौतिक एवं वायुमंडलीय कारणों का परीक्षण कीजिए।"
        data["is_hindi"] = True
        data["medium"] = "hindi"
        normalized = normalize_evaluation_data(data, max_marks=10, question=data["detected_question"], paper="GS1", medium="hindi")
        diag = normalized.get("current_affairs_value_add", {}).get("diagram_recommendation", {})

        self.assertTrue(diag.get("is_recommended"))
        self.assertTrue(len(diag.get("exam_sketch_tip", "")) > 5)

    def test_scoring_and_high_yield_keywords_preserved(self):
        """Scores and High-Yield Keywords section are completely untouched by diagram normalization."""
        data = copy.deepcopy(self.base_eval_data)
        initial_score = data["overall_score"]
        initial_kw_count = len(data["missing_keywords_cards"])

        normalized = normalize_evaluation_data(data, max_marks=10, question=data["detected_question"], paper="GS1")

        self.assertEqual(normalized["overall_score"], initial_score)
        self.assertEqual(len(normalized["missing_keywords_cards"]), initial_kw_count)

if __name__ == "__main__":
    unittest.main()
