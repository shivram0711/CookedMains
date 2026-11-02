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

    def test_mentor_diagnostic_in_fallbacks(self):
        # Python fallback should have mentor framing
        self.assertIn("Mentor's Structural Diagnostic", self.engine_source)
        self.assertIn("मेंटर संरचनात्मक विश्लेषण", self.engine_source)
        # JS fallback should have mentor framing
        self.assertIn("Mentor's Structural Diagnostic", self.app_source)
        self.assertIn("मेंटर संरचनात्मक विश्लेषण", self.app_source)

if __name__ == '__main__':
    unittest.main()
