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
    _build_domain_specific_conclusion,
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
        """6. Point-by-point audit cards store awarded, max, and matching badge without repetitive praise."""
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
            self.assertIn("/", card["credit_badge"])
            self.assertNotIn("BODY & CORE & DEMAND", card["title"])
            self.assertNotIn("& CORE & DEMAND", card["title"])
            # Ensure "Effective analytical coverage." is NOT repeated on every card
            self.assertNotIn("Effective analytical coverage.", card.get("examiner_verdict", ""))

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

    def test_revolt_1857_conclusion_feedback_relevance(self):
        """11. Regression test: 1857 Revolt 10-marker conclusion feedback must be question-specific."""
        q_1857 = "British response to the revolt of 1857 did more than restoring colonial control; it prolonged the longevity of British imperialism in India. Examine. (10 marks, 150 words)"
        
        # Test domain conclusion generator
        domain_conc = _build_domain_specific_conclusion(q_1857, "GS1")
        
        # Must NOT contain generic geography/society cliches
        self.assertNotIn("spatial equity", domain_conc.lower())
        self.assertNotIn("community-led resilience", domain_conc.lower())
        self.assertNotIn("constitutional fraternity", domain_conc.lower())
        
        # Must contain modern Indian history synthesis
        self.assertTrue(any(w in domain_conc.lower() for w in ["1857", "colonial", "imperial", "nationalist", "congress", "longevity"]))

        # Test evaluation normalization on 1857 candidate answer
        cand_eval = {
            "overall_score": 4.5,
            "max_marks": 10,
            "detected_question": q_1857,
            "paper": "GS1",
            "total_pages": 2,
            "transcribed_text": (
                "The revolt of 1857 was described by VD Savarkar as the first War of Indian Independence.\n"
                "Act for Better Government of India 1858, End of Company Rule, End of Mughal Nobility.\n"
                "Reorganisation of army based on martial races, strategic positions, sowing seeds of discontent.\n"
                "Thus, Revolt of 1857 led to thorough reorganization of the setup of British, and also considered the progenitor of Indian National Congress of 1885."
            ),
            "sub_part_step_marking": [
                {"step_label": "1. Introduction", "sub_heading": "Historical Context", "awarded": 1.0, "max": 1.0, "quoted_written": "The revolt of 1857 was described by VD Savarkar..."},
                {"step_label": "2. Restoring Colonial Control", "sub_heading": "Crown Rule & 1858 Act", "awarded": 1.8, "max": 4.2, "quoted_written": "Act for Better Government of India 1858..."},
                {"step_label": "3. Prolonging Longevity", "sub_heading": "Army Reorganisation & Martial Races", "awarded": 1.2, "max": 4.2, "quoted_written": "Reorganisation of army based on martial races..."},
                {"step_label": "4. Conclusion", "sub_heading": "Progenitor of INC 1885", "awarded": 0.5, "max": 0.6, "quoted_written": "Thus, Revolt of 1857 led to thorough reorganization..."}
            ],
            "conclusion_audit": {
                "score": 0.5,
                "current_critique": "Concluded with thorough reorganization and progenitor of INC 1885."
            }
        }
        
        norm = normalize_evaluation_data(cand_eval, max_marks=10)
        c_audit = norm.get("conclusion_audit", {})
        rewrite = c_audit.get("model_conclusion_rewrite", "")
        
        self.assertNotIn("spatial equity", rewrite.lower())
        self.assertNotIn("community-led resilience", rewrite.lower())
        
        # Verify conclusion max does not exceed 1.5 in a 10-marker
        rubric = norm.get("rubric_scores", {})
        self.assertLessEqual(float(rubric.get("conclusion_max", 1.0)), 1.5)
        
        # Verify point_by_point_audit cards do NOT repeat "Effective analytical coverage."
        pbp = norm.get("point_by_point_audit", [])
        for p in pbp:
            self.assertNotIn("Effective analytical coverage.", p.get("examiner_verdict", ""))

    def test_no_disproportionate_conclusion_weighting_10marker(self):
        """12. 10-markers never allocate a fixed 2.0 or 2.5 marks to conclusion."""
        eval_data = {
            "overall_score": 4.0,
            "max_marks": 10,
            "detected_question": "Explain the causes of the 1857 revolt.",
            "sub_part_step_marking": [
                {"step_label": "1. Intro", "awarded": 1.0, "max": 1.0},
                {"step_label": "2. Causes", "awarded": 2.5, "max": 8.0},
                {"step_label": "3. Conclusion", "awarded": 0.5, "max": 1.0}
            ]
        }
        norm = normalize_evaluation_data(eval_data, max_marks=10)
        rubric = norm.get("rubric_scores", {})
        c_max = float(rubric.get("conclusion_max", 1.0))
        self.assertLessEqual(c_max, 1.5)
        self.assertNotEqual(c_max, 2.5)

    def test_image1_image2_model_conclusion_at_end_and_no_feedback_in_conclusion_box(self):
        """13. Regression test: Model conclusion is at very end under ### Concluding Synthesis, and conclusion box never shows student feedback (Image 1 & 2)."""
        from evaluator_engine import _ensure_topper_model_answer_quality, extract_model_answer_conclusion
        
        sample_eval = {
            "max_marks": 15,
            "detected_question": "Assess the role of foreign travelers in reconstructing the history of medieval India. (15 marks, 250 words)",
            "paper": "GS1",
            "full_model_answer": (
                "### Role in Socio-Political Understanding\n"
                "**1. Court Politics & Administration:** Bernier detailed the Mughal state machinery, crown ownership of land, and court etiquette under Aurangzeb.\n"
                "**2. Economic Life & Urban Centers:** Tavernier documented diamond mines and inland trade networks connecting Agra with Surat.\n"
                "**3. Social Customs:** Ibn Battuta recorded judicial practices, postal systems (Uluq & Dawa), and women's position.\n\n"
                "While European travelogues provide invaluable empirical data on medieval India, historical objectivity requires triangulating these external observations with indigenous Persian, Sanskrit, epigraphic, and archaeological sources."
            ),
            "body_audit": {
                "strengths": [
                    "Multidimensional Thematic Breakdown (Pages 1-2): You categorized accounts across diverse pillars including peopled polity, royal absolutism, cultural segregation, and architectural patronage.",
                    "Specific Textual Citations (Pages 1-3): Enhance academic rigor by citing specific texts."
                ],
                "critical_gaps": [
                    "Structural Presentation Note: You authored the entire body under a single heading ('Role in shaping understanding'). While your point-wise coverage is."
                ]
            },
            "conclusion_audit": {
                "model_conclusion_rewrite": "While European travelogues provide invaluable empirical data on medieval India, historical objectivity requires triangulating these external observations with indigenous Persian, Sanskrit, epigraphic, and archaeological sources."
            }
        }
        
        _ensure_topper_model_answer_quality(sample_eval, max_marks=15)
        
        fma = sample_eval["full_model_answer"]
        
        # 1. Verify conclusion is at the very end with ### Concluding Synthesis
        self.assertIn("### Concluding Synthesis", fma)
        conc_idx = fma.find("### Concluding Synthesis")
        after_conc = fma[conc_idx:]
        self.assertIn("While European travelogues provide invaluable empirical data", after_conc)
        
        # 2. Verify no candidate feedback or critique was injected after or inside the model answer
        self.assertNotIn("You categorized accounts across diverse pillars", fma)
        self.assertNotIn("You authored the entire body", fma)
        self.assertNotIn("Multidimensional Thematic Breakdown", fma)
        self.assertNotIn("Structural Presentation Note", fma)
        
        # 3. Verify extracted conclusion is the authentic travelogues conclusion, NOT candidate feedback
        extracted = extract_model_answer_conclusion(fma)
        self.assertIn("While European travelogues provide invaluable empirical data", extracted)
        self.assertNotIn("You categorized", extracted)
        
        # 4. Verify conclusion_audit model_conclusion_rewrite is the authentic conclusion
        self.assertIn("While European travelogues provide invaluable empirical data", sample_eval["conclusion_audit"]["model_conclusion_rewrite"])
        self.assertNotIn("You categorized", sample_eval["conclusion_audit"]["model_conclusion_rewrite"])

    def test_image3_missing_dimensions_omits_catalogue_boilerplate(self):
        """14. Regression test: Missing dimensions retains genuine on-demand items and strips institutional/empirical boilerplate (Image 3)."""
        raw_eval = {
            "max_marks": 15,
            "detected_question": "Assess the role of foreign travelers in reconstructing the history of medieval India. (15 marks, 250 words)",
            "paper": "GS1",
            "overall_score": 7.0,
            "transcribed_text": "Foreign travelers like Bernier and Ibn Battuta gave detailed accounts of medieval society and polity in India.",
            "body_audit": {
                "missing_dimensions": [
                    "**Socio-Religious Synthesis**: Contribution of travelers in documenting Bhakti-Sufi syncretism and temple economies (e.g., Domingo Paes on Vijayanagara festivities).",
                    "**Methodological Triangulation**: Comparing foreign accounts with indigenous epigraphic and Persian/Sanskrit literary sources.",
                    "**Institutional & Statutory Anchor**: Ground arguments in official committee recommendations, constitutional mandates, or national statutory frameworks.",
                    "**Empirical Metric & Regional Disaggregation**: Back qualitative points with authoritative surveys, baseline percentages, and spatial vulnerability distributions."
                ]
            }
        }
        
        norm = normalize_evaluation_data(raw_eval, max_marks=15)
        clean_dims = norm.get("body_audit", {}).get("missing_dimensions", [])
        
        # Must retain question-specific dimensions
        dims_text = " ".join(clean_dims)
        self.assertIn("Socio-Religious Synthesis", dims_text)
        self.assertIn("Methodological Triangulation", dims_text)
        
        # Must strictly omit generic catalogue boilerplate
        self.assertNotIn("Institutional & Statutory Anchor", dims_text)
        self.assertNotIn("Empirical Metric & Regional Disaggregation", dims_text)
        self.assertNotIn("official committee recommendations", dims_text)
        self.assertNotIn("authoritative surveys", dims_text)
        
        # Count should reflect genuine dimensions only (<= 2 here)
        self.assertEqual(len(clean_dims), 2)

    def test_missing_dimensions_can_be_empty_without_forced_padding(self):
        """15. Candidate covering all core demands produces empty missing_dimensions list without padding."""
        raw_eval = {
            "max_marks": 10,
            "detected_question": "Examine the constitutional role of the Comptroller and Auditor General.",
            "paper": "GS2",
            "transcribed_text": "CAG under Article 148 ensures legislative accountability of the executive through financial audits.",
            "body_audit": {
                "missing_dimensions": []
            }
        }
        norm = normalize_evaluation_data(raw_eval, max_marks=10)
        self.assertEqual(norm.get("body_audit", {}).get("missing_dimensions", []), [])

    def test_transfer_point_audit_to_deep_evaluation_without_handwriting(self):
        """16. Transfer page feedback to Intro, Body Strengths, Body Gaps, and Conclusion without candidate handwriting."""
        from evaluator_engine import transfer_point_audit_to_deep_evaluation
        
        sample_data = {
            "total_pages": 3,
            "point_by_point_audit": [
                {
                    "page": 1,
                    "badge": "Page 1 • Intro & Premise",
                    "title": "Opening Premise & Statutory Context",
                    "what_you_wrote": "The Comptroller and Auditor General is appointed under Article 148 to inspect accounts.",
                    "examiner_verdict": "Clear constitutional anchor citing Article 148; integrate Article 151 audit reporting procedure for completeness.",
                    "is_positive": True
                },
                {
                    "page": 2,
                    "badge": "Page 2 • Substantive Body Analysis",
                    "title": "Financial Accountability & PAC Linkage",
                    "what_you_wrote": "CAG acts as the friend, philosopher and guide to the Public Accounts Committee.",
                    "examiner_verdict": "Substantiated relationship with the Public Accounts Committee and legislative oversight.",
                    "is_positive": True
                },
                {
                    "page": 2,
                    "badge": "Page 2 • Upgrade Scope",
                    "title": "Propriety Audit vs Regulatory Compliance",
                    "what_you_wrote": "CAG only checks rules and vouchers without discretion.",
                    "examiner_verdict": "Differentiate regularity compliance audit from performance/propriety audit to demonstrate systemic insight.",
                    "is_positive": False
                },
                {
                    "page": 3,
                    "badge": "Page 3 • Closing Synthesis",
                    "title": "Concluding Synthesis & Global Best Practices",
                    "what_you_wrote": "Thus CAG is very important for democracy and financial control in India.",
                    "examiner_verdict": "Synthesized institutional autonomy with INTOSAI auditing standards for durable fiscal governance.",
                    "is_positive": True
                }
            ],
            "intro_audit": {"current_critique": "Solid conceptual opening."},
            "body_audit": {"strengths": [], "critical_gaps": []},
            "conclusion_audit": {"current_critique": "Balanced final summary."}
        }

        transfer_point_audit_to_deep_evaluation(sample_data, is_hindi=False)

        # 1. Verify Intro received intro verdict
        self.assertIn("integrate Article 151 audit reporting procedure", sample_data["intro_audit"]["current_critique"])
        self.assertNotIn("The Comptroller and Auditor General is appointed under Article 148", sample_data["intro_audit"]["current_critique"])

        # 2. Verify Body Strengths received positive body verdict
        strengths = sample_data["body_audit"]["strengths"]
        self.assertEqual(len(strengths), 1)
        self.assertIn("Financial Accountability & PAC Linkage", strengths[0])
        self.assertIn("Substantiated relationship with the Public Accounts Committee", strengths[0])
        self.assertNotIn("CAG acts as the friend, philosopher and guide", strengths[0])

        # 3. Verify Body Critical Gaps received upgrade lever
        gaps = sample_data["body_audit"]["critical_gaps"]
        self.assertEqual(len(gaps), 1)
        self.assertIn("Propriety Audit vs Regulatory Compliance", gaps[0])
        self.assertIn("Differentiate regularity compliance audit from performance/propriety audit", gaps[0])
        self.assertNotIn("CAG only checks rules and vouchers", gaps[0])

        # 4. Verify Conclusion received conclusion verdict
        self.assertIn("Synthesized institutional autonomy with INTOSAI auditing standards", sample_data["conclusion_audit"]["current_critique"])
        self.assertNotIn("Thus CAG is very important for democracy", sample_data["conclusion_audit"]["current_critique"])

    def test_transfer_point_audit_deduplication(self):
        """17. Transfer logic strictly prevents duplicate entries in Strengths, Gaps, Intro, and Conclusion."""
        from evaluator_engine import transfer_point_audit_to_deep_evaluation

        sample_data = {
            "total_pages": 2,
            "point_by_point_audit": [
                {
                    "page": 1,
                    "title": "Core Mechanism",
                    "examiner_verdict": "Effective use of 3Cs framework (Convergence, Collaboration, Competition).",
                    "is_positive": True
                }
            ],
            "body_audit": {
                "strengths": [
                    "**3Cs Strategy (Page 1)**: Effective use of 3Cs framework (Convergence, Collaboration, Competition)."
                ],
                "critical_gaps": []
            }
        }

        transfer_point_audit_to_deep_evaluation(sample_data, is_hindi=False)
        strengths = sample_data["body_audit"]["strengths"]
        # Must not duplicate the 3Cs framework strength
        self.assertEqual(len(strengths), 1)

    def test_desktop_audit_container_removed_from_html(self):
        """18. The Which Exact Points Fetched Marks section is completely removed from index.html."""
        with open("static/index.html", "r", encoding="utf-8") as f:
            html = f.read()

        self.assertNotIn("desktopExaminerAuditContainer", html)
        self.assertNotIn("desktopAuditCardsContainer", html)
        self.assertNotIn("Which Exact Points Fetched Marks vs. Scope to Upgrade", html)

if __name__ == "__main__":
    unittest.main()

