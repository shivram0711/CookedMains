# -*- coding: utf-8 -*-
"""
test_evaluation_rigor.py
Unit & regression tests for evidence-led, question-specific, and reliable UPSC answer evaluation.
"""
import unittest
import json
import re
from evaluator_engine import (
    build_evaluation_prompt,
    build_hindi_evaluation_prompt,
    normalize_evaluation_data,
    _normalize_batch1_examiner_mastery,
    _ensure_at_least_one_value_addition,
    _has_meta_placeholder,
    detect_academic_discipline,
    detect_directive
)

class TestEvaluationRigor(unittest.TestCase):

    def test_gs1_physical_geography_dna_in_prompt(self):
        """1. GS1 Ocean Circulation & Physical Geography prompt contains strict Earth-science diagnosis."""
        q = "How is general pattern of ocean surface current circulation related to global atmospheric circulation patterns? Also discuss the influence of these circulations on climate and human activities. (15 marks, 250 words)"
        dir_info = detect_directive(q)
        prompt = build_evaluation_prompt(q, "GS1", 15, dir_info)
        
        # Verify physical oceanography DNA
        self.assertIn("OCEANOGRAPHY & CLIMATOLOGY STRICT BENCHMARK DIAGNOSIS", prompt)
        self.assertIn("Ekman spiral and net 90° Ekman transport", prompt)
        self.assertIn("Deep ocean circulation (Thermohaline / AMOC) is density-driven", prompt)
        self.assertIn("Humboldt / Peru Current is located in the Southern Hemisphere", prompt)
        self.assertIn("Dogger Bank in the North Sea", prompt)
        self.assertIn("Climatic impacts", prompt)
        self.assertIn("NEVER demand, invent, or penalize for statutory provisions, constitutional articles, or administrative committees", prompt)

    def test_dynamic_demand_allocations_10m_15m_20m(self):
        """2. Dynamic allocations: Intro 1.0–1.5M, Conclusion 1.0–1.5M, Body 80–85%."""
        p10 = build_evaluation_prompt("Evaluate fiscal federalism in India.", "GS2", 10, detect_directive("Evaluate fiscal federalism in India."))
        p15 = build_evaluation_prompt("Analyse the geomorphic impact of glacial retreat.", "GS1", 15, detect_directive("Analyse the geomorphic impact of glacial retreat."))
        p20 = build_evaluation_prompt("Discuss the ethical implications of artificial intelligence in governance.", "GS4", 20, detect_directive("Discuss the ethical implications of artificial intelligence in governance."))

        # Check 10-marker allocations in prompt template
        self.assertIn('"max": 1.0', p10)
        self.assertIn('"max": 4.0', p10)

        # Check 15-marker allocations in prompt template
        self.assertIn('"max": 1.5', p15)
        self.assertIn('"max": 6.0', p15)

        # Check 20-marker allocations in prompt template
        self.assertIn('"max": 2.0', p20)
        self.assertIn('"max": 8.0', p20)

    def test_no_forced_statutory_subheading_in_physical_geography(self):
        """3. Step marking prompt templates do not force statutory/constitutional anchors."""
        prompt = build_evaluation_prompt("Explain plate tectonics and volcanism.", "GS1", 15, detect_directive("Explain plate tectonics and volcanism."))
        self.assertNotIn('"sub_heading": "Conceptual Definition, Constitutional/Statutory Anchor', prompt)
        self.assertNotIn('"sub_heading": "Topic-Specific Institutional, Constitutional or Policy Synthesis', prompt)
        self.assertIn('"sub_heading": "Phenomenon / Conceptual Foundation & Question Context"', prompt)
        self.assertIn('"sub_heading": "Synthesis of Core Demand & Forward Perspective"', prompt)

    def test_meta_placeholder_detection(self):
        """4. _has_meta_placeholder detects and rejects artificial meta labels."""
        self.assertTrue(_has_meta_placeholder("BODY & CORE & DEMAND"))
        self.assertTrue(_has_meta_placeholder("& CORE & DEMAND"))
        self.assertTrue(_has_meta_placeholder("Body: Core Demand"))
        self.assertTrue(_has_meta_placeholder("Primary Sub-Part"))
        self.assertTrue(_has_meta_placeholder("Secondary Dimension"))
        self.assertTrue(_has_meta_placeholder("Covered secondary dimension, policy measures"))
        self.assertTrue(_has_meta_placeholder("Addressed substantive question dimensions with structured handwriting"))
        self.assertFalse(_has_meta_placeholder("North Atlantic Drift moderates Western European coastal climates keeping ports ice-free."))

    def test_physical_geography_value_addition_enrichment(self):
        """5. Physical geography gets Earth-science enrichment (Ekman/Sverdrup), not institutional matrix."""
        data = {
            "detected_question": "How is general pattern of ocean surface current circulation related to global atmospheric circulation patterns?",
            "body_audit": {"missing_dimensions": []},
            "missing_keywords_cards": []
        }
        _ensure_at_least_one_value_addition(data, is_hindi=False)
        cards = data.get("missing_keywords_cards", [])
        self.assertEqual(len(cards), 1)
        card = cards[0]
        self.assertEqual(card.get("term"), "Ekman Spiral & Sverdrup Transport Mass Balance")
        self.assertIn("Ekman transport", card.get("definition", ""))
        self.assertNotIn("Institutional", card.get("term", ""))
        self.assertNotIn("Statutory", card.get("term", ""))

    def test_point_by_point_audit_card_reconciliation(self):
        """6. Point-by-point audit cards store awarded, max, and matching badge."""
        mock_data = {
            "overall_score": 5.5,
            "max_marks": 15,
            "total_pages": 3,
            "sub_part_step_marking": [
                {
                    "step_label": "1. Introduction",
                    "sub_heading": "Atmospheric-Oceanic Baseline",
                    "awarded": 1.0,
                    "max": 1.5,
                    "quoted_written": "Wind friction on surface waters initiates oceanic movement.",
                    "step_up_lever": "Link Trade Winds to Equatorial Currents."
                },
                {
                    "step_label": "2. Primary Demand",
                    "sub_heading": "Wind Drag & Subtropical Gyres",
                    "awarded": 2.5,
                    "max": 6.0,
                    "quoted_written": "Hadley and Ferrel cells correspond to surface wind belts.",
                    "step_up_lever": "Clarify Ekman transport 90-degree deflection."
                },
                {
                    "step_label": "3. Secondary Demand",
                    "sub_heading": "Climatic & Economic Impacts",
                    "awarded": 1.5,
                    "max": 6.0,
                    "quoted_written": "Gulf Stream warms Europe; Peru current causes dry desert.",
                    "step_up_lever": "Disaggregate climate outcomes from navigation/fishing."
                },
                {
                    "step_label": "4. Conclusion",
                    "sub_heading": "Ocean-Atmosphere Coupled System",
                    "awarded": 0.5,
                    "max": 1.5,
                    "quoted_written": "Ocean circulation maintains global heat balance.",
                    "step_up_lever": "Reference energy redistribution from tropics to poles."
                }
            ],
            "body_audit": {
                "strengths": ["Structured mapping of Hadley and Ferrel cells.", "Cited Gulf Stream warming of Europe."],
                "critical_gaps": ["Confused atmospheric polar sinking with ocean thermohaline circulation."]
            }
        }
        _normalize_batch1_examiner_mastery(mock_data, max_marks=15)
        
        pbp = mock_data.get("point_by_point_audit", [])
        self.assertGreaterEqual(len(pbp), 3)
        
        # Verify fields on each card
        for card in pbp:
            self.assertIn("awarded", card)
            self.assertIn("max", card)
            self.assertIn("marks", card)
            self.assertIn("credit_badge", card)
            # Ensure credit_badge contains / max
            self.assertIn("/", card["credit_badge"])
            # Ensure title is never placeholder
            self.assertNotIn("BODY & CORE & DEMAND", card["title"])
            self.assertNotIn("& CORE & DEMAND", card["title"])

    def test_hindi_prompt_dynamic_allocations(self):
        """7. Dedicated Hindi evaluation prompt maintains dynamic demand allocations."""
        hindi_q = "महासागरीय धाराओं का सामान्य प्रतिरूप वैश्विक वायुमंडलीय परिसंचरण प्रतिरूपों से किस प्रकार संबंधित है? (15 अंक, 250 शब्द)"
        h_prompt = build_hindi_evaluation_prompt(hindi_q, "GS1", 15, detect_directive(hindi_q, medium="hindi"))
        self.assertIn('"max": 1.5', h_prompt)
        self.assertIn('"max": 6.0', h_prompt)
        self.assertIn('भूमिका', h_prompt)

    def test_strong_answer_non_deductive_enrichment(self):
        """8. Strong answer provides non-deductive optional enrichment without claiming 100% perfection."""
        data = {
            "detected_question": "Explain the significance of the 73rd Constitutional Amendment Act for rural local governance.",
            "body_audit": {
                "missing_dimensions": ["All substantive dimensions thoroughly analyzed."]
            },
            "missing_keywords_cards": []
        }
        _ensure_at_least_one_value_addition(data, is_hindi=False)
        cards = data.get("missing_keywords_cards", [])
        self.assertEqual(len(cards), 1)
        self.assertIn("Activity Mapping & 3Fs Devolution Matrix", cards[0]["term"])
        self.assertIn("No major omission was identified", cards[0]["definition"])

    def test_arithmetic_consistency_no_mark_fabrication(self):
        """9. Overall score is consistent with evaluated criteria without clamping zero scores."""
        raw_eval = {
            "overall_score": 0.0,
            "max_marks": 15,
            "detected_question": "Discuss the impact of climate change on small island developing states.",
            "sub_part_step_marking": [
                {"step_label": "1. Intro", "awarded": 0.0, "max": 1.5, "quoted_written": ""},
                {"step_label": "2. Body A", "awarded": 0.0, "max": 6.0, "quoted_written": ""},
                {"step_label": "3. Body B", "awarded": 0.0, "max": 6.0, "quoted_written": ""},
                {"step_label": "4. Conclusion", "awarded": 0.0, "max": 1.5, "quoted_written": ""}
            ]
        }
        norm = normalize_evaluation_data(raw_eval, max_marks=15)
        # Score must remain 0.0, never clamped to 6.5 or 0.5
        self.assertEqual(norm["overall_score"], 0.0)

    def test_discipline_detection_accuracy(self):
        """10. Discipline detection correctly routes GS1 geography vs GS2 polity vs GS4 ethics."""
        self.assertEqual(detect_academic_discipline("Ocean currents and atmospheric cells", "GS1"), "GS1")
        self.assertEqual(detect_academic_discipline("Judicial review and basic structure doctrine", "GS2"), "GS2")
        self.assertEqual(detect_academic_discipline("Emotional intelligence in civil services", "GS4"), "GS4")

if __name__ == "__main__":
    unittest.main()
