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
        self.assertIn("PURELY DYNAMIC EVALUATION (ZERO STATIC BOILERPLATE)", self.engine_source)

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

    def test_mentor_diagnostic_in_fallbacks(self):
        # Python fallback should have mentor framing
        self.assertIn("Mentor's Structural Diagnostic", self.engine_source)
        self.assertIn("मेंटर संरचनात्मक विश्लेषण", self.engine_source)
        # JS fallback should have mentor framing
        self.assertIn("Mentor's Structural Diagnostic", self.app_source)
        self.assertIn("मेंटर संरचनात्मक विश्लेषण", self.app_source)

if __name__ == '__main__':
    unittest.main()
