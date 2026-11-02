import unittest
import os
import re

class TestMentorEvaluation(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        base_dir = os.path.dirname(os.path.abspath(__file__))
        with open(os.path.join(base_dir, 'evaluator_engine.py'), 'r', encoding='utf-8') as f:
            cls.engine_source = f.read()
        with open(os.path.join(base_dir, 'static', 'app.js'), 'r', encoding='utf-8') as f:
            cls.app_source = f.read()

    def test_english_prompt_mentor_section_present(self):
        self.assertIn("26. MENTOR EVALUATION RIGOR: DEMAND BALANCE, PREVENTING PREMATURE JUMPS", self.engine_source)
        self.assertIn("DEMAND PROPORTIONALITY & PREVENTING PREMATURE JUMPS", self.engine_source)
        self.assertIn("DEEP EVALUATION OF CANDIDATE'S BODY POINTS (INCOMPLETE STATEMENTS VS. COMPLETED ANSWERS)", self.engine_source)
        self.assertIn("DIAGRAMS: DATA CONDENSATION & REAL ESTATE OPTIMIZATION VS. SPACE WASTAGE", self.engine_source)
        self.assertIn("INTRODUCTION: CONNECTING DATA / FACT HOOK TO QUESTION DEMAND", self.engine_source)
        self.assertIn("CONCLUSION: QUESTION-ANCHORED SYNTHESIS VS. UNANCHORED BUZZWORDS", self.engine_source)

    def test_10_marker_mentor_checks_in_english_and_hindi(self):
        # English 10-marker specific checks
        self.assertIn("10-MARKER (150 WORDS / 2 PAGES) SPECIFIC MENTOR AUDIT", self.engine_source)
        self.assertIn("Severe Space Penalty for Unasked / Oversized Visuals on Page 1", self.engine_source)
        self.assertIn("Demand Balance Across Page 1 & Page 2", self.engine_source)
        self.assertIn("Telegraphic Point Stubs vs Compact Causal Bullets", self.engine_source)
        # Hindi 10-marker specific checks
        self.assertIn("10-अंकों (150 शब्द / 2 पृष्ठ) के प्रश्नों हेतु विशिष्ट मेंटर ऑडिट", self.engine_source)
        self.assertIn("पृष्ठ 1 पर अनावश्यक/अत्यधिक बड़े आरेख पर अंक कटौती", self.engine_source)
        self.assertIn("पृष्ठ 1 और पृष्ठ 2 के मध्य मांग का 50:50 संतुलन", self.engine_source)

    def test_zero_rigid_lines_and_subject_isolation(self):
        # Strict rule that prompt examples must not leak across subjects
        self.assertIn("ABSOLUTE BAN ON RIGID LINES, HARDCODED SENTENCES & SUBJECT LEAKAGE", self.engine_source)
        self.assertIn("ILLUSTRATIVE EXAMPLES ARE NEVER TO BE REPEATED", self.engine_source)
        self.assertIn("NO PRE-FABRICATED CANNED REMARKS", self.engine_source)
        # Hindi zero rigid lines rule
        self.assertIn("तयशुदा/स्थिर वाक्यों का पूर्ण निषेध एवं 100% गतिशील विषयगत पृथक्करण", self.engine_source)

    def test_hindi_prompt_mentor_section_present(self):
        self.assertIn("11. मेंटर-शैली सूक्ष्म मूल्यांकन: मांग में संतुलन, अचानक छलांग (Premature Jumps) से बचाव", self.engine_source)
        self.assertIn("मांग संतुलन व अचानक छलांग से बचाव", self.engine_source)
        self.assertIn("अभ्यर्थी के बिंदुओं का गहन परीक्षण (अधूरे बिंदु बनाम पूर्ण उत्तर)", self.engine_source)
        self.assertIn("आरेख: डेटा संघनन बनाम स्थान की बर्बादी", self.engine_source)
        self.assertIn("प्रस्तावना: डेटा हुक को प्रश्न की मांग से जोड़ना", self.engine_source)
        self.assertIn("निष्कर्ष: प्रश्न की मूल शब्दावली पर संश्लेषण बनाम असंबद्ध नारे", self.engine_source)

    def test_schema_examples_free_of_hardcoded_gs2_bias(self):
        # Verify that English body_audit schema doesn't have hardcoded GS2 text
        self.assertNotIn("executive discretion and judicial benchmarks", self.engine_source)
        self.assertNotIn("numerical imbalance and potential executive dominance", self.engine_source)

    def test_directives_are_universal_without_gs2_bias(self):
        from evaluator_engine import DIRECTIVES
        # Verify that generic directives don't hardcode GS-2 specific phrases like constitutional/statutory/judgment
        self.assertNotIn("constitutional/logical arguments", DIRECTIVES["give your opinion"]["meaning"])
        self.assertNotIn("constitutional/logical arguments", DIRECTIVES["in your opinion"]["meaning"])
        self.assertNotIn("statutory provisions, landmark judgments", DIRECTIVES["substantiate"]["meaning"])
        self.assertNotIn("constitutional/statutory roles", DIRECTIVES["examine the role"]["meaning"])

    def test_transfer_point_audit_deduplication(self):
        from evaluator_engine import transfer_point_audit_to_deep_evaluation
        mock_data = {
            "evaluation": {
                "body_audit": {
                    "strengths": ["**Displacement Drivers Categorization (Page 1)**: Delineated large dams (Hirakud)."],
                    "critical_gaps": []
                },
                "point_by_point_audit": [
                    {
                        "page_number": 1,
                        "point_title": "Displacement Drivers Categorization",
                        "verdict_reasoning": "Delineated large dams (Hirakud) and mining (Niyamgiri).",
                        "is_positive": True
                    },
                    {
                        "page_number": 2,
                        "point_title": "Rehabilitation Bottlenecks",
                        "verdict_reasoning": "Socio-economic hurdles and land alienation.",
                        "is_positive": True
                    }
                ]
            }
        }
        transfer_point_audit_to_deep_evaluation(mock_data)
        strengths = mock_data["evaluation"]["body_audit"]["strengths"]
        # Page 1 should not have duplicate entries
        p1_count = sum(1 for s in strengths if "Page 1" in s)
        self.assertEqual(p1_count, 1)
        # Page 2 should be added
        p2_count = sum(1 for s in strengths if "Page 2" in s)
        self.assertEqual(p2_count, 1)

    def test_ten_marker_never_triggers_case_study(self):
        from evaluator_engine import _enrich_case_study_audit, normalize_evaluation_data
        
        # Test 1: 10-marker Ethics question with candidate writing words like 'options' or 'dilemma'
        data_10m = {
            "detected_question": "What is emotional intelligence and how does it help civil servants in resolving ethical dilemmas?",
            "detected_paper": "GS4",
            "max_marks": 10,
            "transcribed_text": "2. self-regulation: by delaying decision in pressure and mindfulness... courses of action: option 1...",
            "is_case_study": True,
            "case_study_audit": {
                "protagonist_role": "Public Administrator / Decision Maker",
                "core_ethical_conflict": "Constitutional Duty vs Personal Interest"
            }
        }
        _enrich_case_study_audit(data_10m)
        self.assertFalse(data_10m.get("is_case_study"))
        self.assertNotIn("case_study_audit", data_10m)
        
        # Test 2: normalize_evaluation_data for 10-marker strips case study
        normalized = normalize_evaluation_data(data_10m, max_marks=10, question=data_10m["detected_question"], paper="GS4")
        self.assertFalse(normalized.get("is_case_study"))
        self.assertNotIn("case_study_audit", normalized)

    def test_value_add_never_suggests_what_candidate_already_wrote(self):
        from evaluator_engine import normalize_evaluation_data
        
        # Candidate explicitly wrote SVAMITVA on Page 2 and ISRO FASAL on Page 1
        raw_data = {
            "detected_question": "How can Artificial intelligence (AI) and drones be effectively used along with GIS and RS techniques in locational and aerial planning?",
            "detected_paper": "GS3",
            "max_marks": 15,
            "transcribed_text": "Page 1: Automated land-use classification using AI and ISRO's FASAL project... Page 2: SVAMITVA 3D drone survey for rural land title deeds...",
            "body_audit": {
                "strengths": [
                    "**Automated LULC & ISRO FASAL (Page 1)**: Demonstrated crop classification.",
                    "**SVAMITVA & Drone Mapping (Page 2)**: Micro-planning for land titling."
                ]
            },
            "point_by_point_audit": [
                {"page": 1, "title": "Automated LULC & ISRO FASAL", "what_you_wrote": "ISRO's FASAL project", "is_positive": True},
                {"page": 2, "title": "SVAMITVA & Drone Mapping", "what_you_wrote": "SVAMITVA 3D drone survey", "is_positive": True}
            ],
            "current_affairs_value_add": {
                "current_examples": [
                    {
                        "example_title": "SVAMITVA Scheme (Ministry of Panchayati Raj)",
                        "paragraph_target": "Page 2 • Beside your point",
                        "recommended_insertion": "Leverage drone-based geospatial mapping under SVAMITVA scheme."
                    },
                    {
                        "example_title": "ISRO FASAL Project",
                        "paragraph_target": "Page 1 • Beside your point",
                        "recommended_insertion": "Cite ISRO FASAL for acreage estimation."
                    }
                ]
            }
        }
        
        normalized = normalize_evaluation_data(raw_data, max_marks=15, question=raw_data["detected_question"], paper="GS3")
        ca_va = normalized.get("current_affairs_value_add", {})
        cur_exs = ca_va.get("current_examples", [])
        
        # Verify that SVAMITVA and ISRO FASAL are completely purged and NOT suggested to the student
        for ex in cur_exs:
            title = ex.get("example_title", "").lower()
            rec = ex.get("recommended_insertion", "").lower()
            self.assertNotIn("svamitva", title)
            self.assertNotIn("fasal", title)
            self.assertNotIn("svamitva", rec)
            self.assertNotIn("fasal", rec)
            
        # Verify that fresh unmentioned value additions were supplied instead
        all_text = " ".join(ex.get("example_title", "") + " " + ex.get("recommended_insertion", "") for ex in cur_exs).lower()
        self.assertTrue("gati shakti" in all_text or "cors" in all_text or len(cur_exs) > 0)

    def test_fifteen_marker_three_pages_all_evaluated_in_body_strengths(self):
        from evaluator_engine import normalize_evaluation_data, transfer_point_audit_to_deep_evaluation
        
        # 15-marker with 3 pages
        raw_data = {
            "detected_question": "How can Artificial intelligence (AI) and drones be effectively used along with GIS and RS techniques in locational and aerial planning?",
            "detected_paper": "GS3",
            "max_marks": 15,
            "total_pages": 3,
            "body_audit": {
                "strengths": [
                    "**Automated LULC & ISRO FASAL (Page 1)**: Demonstrated crop classification.",
                    "**Predictive Urban Modelling (Page 1)**: Traffic simulation.",
                    "**SVAMITVA & Drone Mapping (Page 2)**: Micro-planning for land titling.",
                    "**Digital Twins & Infrastructure (Page 2)**: 3D city models for Amaravati."
                ]
            },
            "point_by_point_audit": [
                {"page": 1, "title": "Automated LULC", "examiner_verdict": "Clear LULC processing.", "is_positive": True},
                {"page": 2, "title": "SVAMITVA Drone Survey", "examiner_verdict": "Centimeter-level accuracy.", "is_positive": True},
                {"page": 3, "title": "Precision Agriculture & PM KUSUM", "examiner_verdict": "Drone spraying and soil health.", "is_positive": True}
            ]
        }
        
        normalized = normalize_evaluation_data(raw_data, max_marks=15, question=raw_data["detected_question"], paper="GS3")
        transfer_point_audit_to_deep_evaluation(normalized)
        
        strengths = normalized.get("body_audit", {}).get("strengths", [])
        has_p1 = any("page 1" in s.lower() or "पृष्ठ 1" in s.lower() for s in strengths)
        has_p2 = any("page 2" in s.lower() or "पृष्ठ 2" in s.lower() for s in strengths)
        has_p3 = any("page 3" in s.lower() or "पृष्ठ 3" in s.lower() for s in strengths)
        
        self.assertTrue(has_p1, "Page 1 must be present in body_audit.strengths")
        self.assertTrue(has_p2, "Page 2 must be present in body_audit.strengths")
        self.assertTrue(has_p3, "Page 3 must be present in body_audit.strengths for 3-page 15-marker")

    def test_dynamic_capacity_no_fixed_six_or_four_cap(self):
        from evaluator_engine import normalize_evaluation_data, transfer_point_audit_to_deep_evaluation
        
        # When an aspirant writes 8 distinct effective points across pages
        raw_data = {
            "detected_question": "Explain the role of Geographical factors towards the development of Ancient India.",
            "detected_paper": "GS1",
            "max_marks": 15,
            "total_pages": 3,
            "body_audit": {
                "strengths": [
                    "**Fertile Plains & IVC (Page 1)**: Alluvial soil enabled early agriculture.",
                    "**Natural Barriers & Himalayas (Page 1)**: Protected from northern invasions.",
                    "**Indian Ocean Connectivity (Page 1)**: Facilitated monsoon-driven maritime trade.",
                    "**Monsoon Winds & Navigation (Page 2)**: Enabled Arab and Roman trade voyages.",
                    "**Mineral Resources of Chota Nagpur (Page 2)**: Iron ore fueled Magadhan expansion.",
                    "**Forest Wealth & Elephantry (Page 2)**: Military superiority in ancient armies.",
                    "**Riverine Navigation & Internal Trade (Page 3)**: Ganga-Yamuna artery connected marts.",
                    "**Mountain Passes & Khyber/Bolan (Page 3)**: Channels for Silk Road cultural exchange."
                ],
                "critical_gaps": [
                    "**Regional Divergence Gap**: Explain why Peninsular deltas developed differently.",
                    "**Sedimentation & Delta Formation**: Detail Sundarbans and Bengal delta emergence.",
                    "**Ecological Vulnerability**: Highlight aridification of Saraswati river basin.",
                    "**Textual Epigraphy**: Cite specific Sangam poems on Kaveripattinam port.",
                    "**Numismatic Corroboration**: Mention Roman gold coin hoards in Arikamedu."
                ]
            },
            "point_by_point_audit": []
        }
        
        normalized = normalize_evaluation_data(raw_data, max_marks=15, question=raw_data["detected_question"], paper="GS1")
        strengths = normalized.get("body_audit", {}).get("strengths", [])
        gaps = normalized.get("body_audit", {}).get("critical_gaps", [])
        
        # Verify that all 8 effective strengths are preserved (NO truncation to 6 or 4!)
        self.assertEqual(len(strengths), 8, f"Expected all 8 effective strengths to be retained dynamically, got {len(strengths)}")
        
        # Verify that all 5 genuine critical gaps are preserved (NO truncation to 4!)
        self.assertEqual(len(gaps), 5, f"Expected all 5 genuine gaps to be retained dynamically, got {len(gaps)}")

    def test_mentor_diagnostic_in_fallbacks(self):
        # Python fallback should have mentor framing
        self.assertIn("Mentor's Structural Diagnostic", self.engine_source)
        self.assertIn("मेंटर संरचनात्मक विश्लेषण", self.engine_source)
        # JS fallback should have mentor framing
        self.assertIn("Mentor's Structural Diagnostic", self.app_source)
        self.assertIn("मेंटर संरचनात्मक विश्लेषण", self.app_source)

    def test_body_critical_gaps_never_empty(self):
        from evaluator_engine import normalize_evaluation_data, transfer_point_audit_to_deep_evaluation
        # Test case: raw evaluation data where critical_gaps is completely empty
        raw_data = {
            "detected_question": "How can Artificial Intelligence (AI) and drones be effectively used along with GIS and RS techniques in locational and aerial planning?",
            "detected_paper": "GS3",
            "body_audit": {
                "overall_assessment": "Candidate discussed several technical applications across multiple sectors.",
                "strengths": [
                    "**Automated LULC Mapping (Page 1)**: Correctly explained satellite imagery processing for crop classification.",
                    "**Predictive Urban Growth Modeling (Page 1)**: Applied GIS datasets for smart city traffic simulation.",
                    "**High-Resolution Drone Mapping (Page 2)**: Highlighted centimeter accuracy for micro-planning."
                ],
                "critical_gaps": [],
                "missing_dimensions": [
                    "Geodetic Ground-Truthing: Lack of integration with CORS networks for real-time 3cm positioning accuracy."
                ]
            },
            "point_by_point_audit": [
                {
                    "title": "Automated LULC Mapping",
                    "page": 1,
                    "is_positive": True,
                    "examiner_verdict": "Clear linkage to land use classification."
                },
                {
                    "title": "3D City Models",
                    "page": 2,
                    "is_positive": True,
                    "examiner_verdict": "Scope for deeper integration with PM Gati Shakti NMP platform."
                }
            ]
        }

        normalized = normalize_evaluation_data(raw_data, max_marks=15, question=raw_data["detected_question"], paper="GS3")
        gaps = normalized.get("body_audit", {}).get("critical_gaps", [])

        # Critical gaps must NEVER be empty
        self.assertGreater(len(gaps), 0, "Critical gaps should never be empty when body audit is normalized")
        self.assertTrue(any("Page" in g or "पृष्ठ" in g for g in gaps), "Critical gaps should have page tags")

if __name__ == '__main__':
    unittest.main()
