# -*- coding: utf-8 -*-
"""
Unit and Regression Test Suite for Question-Specific 'Relevant Concepts & Keywords' Feature
Cooked Mains (UPSC Mains Evaluator)

Verifies:
1. Topic Isolation: Cybersecurity concepts for cyber questions; NEVER for heatwaves, history, or agriculture.
2. Semantic Equivalence / Paraphrase Credit: Clear paraphrase receives 'used_effectively' with quoted evidence.
3. Shallow / Underexplained Detection: Mentioning without causal depth is flagged as 'underexplained'.
4. Inaccurate / Misapplied Usage: Erroneous usage is not rewarded as effective.
5. Essay Thematic Lenses: Essay questions provide philosophical/thematic lenses, not specialist technical jargon.
6. Optional Discipline Terminology: Optionals (PSIR, Sociology, Geography) provide discipline-specific terms.
7. Bilingual Recognition: Full English and Hindi conceptual recognition.
8. Anti-Duplication & Scoring Decoupling: Concepts marked 'used_effectively' never repeat in Value Addition; marks are decoupled.
"""

import unittest
import copy
from evaluator_engine import (
    normalize_evaluation_data,
    build_evaluation_prompt,
    build_hindi_evaluation_prompt
)

class TestRelevantConceptsKeywords(unittest.TestCase):

    def setUp(self):
        self.base_eval_data = {
            "overall_score": 4.5,
            "max_marks": 10,
            "detected_paper": "GS3",
            "detected_question": "Evaluate the emerging threats to Critical Information Infrastructure (CII) in India and examine the role of Zero Trust architecture in safeguarding cyber resilience.",
            "transcribed_text": (
                "[Page 1] Emerging cyber threats to critical information infrastructure include ransomware attacks and state-sponsored espionage.\n"
                "The traditional perimeter security model is vulnerable.\n"
                "[Page 2] Zero Trust Architecture is needed because systems must never trust and always verify every user and device access request."
            ),
            "sub_part_step_marking": [
                {"step_label": "1. Intro", "max": 1.5, "awarded": 1.0, "sub_heading": "CII Context", "quoted_written": "Emerging cyber threats to critical information infrastructure"},
                {"step_label": "2. Part A", "max": 4.0, "awarded": 2.0, "sub_heading": "Emerging CII Cyber Threats", "quoted_written": "Ransomware attacks and state-sponsored espionage"},
                {"step_label": "3. Part B", "max": 3.0, "awarded": 1.0, "sub_heading": "Zero Trust Safeguards", "quoted_written": "Zero Trust Architecture is needed because systems must never trust and always verify"},
                {"step_label": "4. Conclusion", "max": 1.5, "awarded": 0.5, "sub_heading": "Cyber Resilience Roadmap", "quoted_written": "Safeguarding cyber resilience through defense in depth"}
            ],
            "body_audit": {
                "strengths": ["Clear identification of ransomware risks to CII"],
                "critical_gaps": ["Lacks mention of Section 70A IT Act and micro-segmentation"],
                "missing_dimensions": ["Defense in Depth: Layered security controls across endpoint and network"]
            },
            "rubric_scores": {
                "intro_score": 1.0,
                "intro_max": 1.5,
                "core_demand_score": 2.0,
                "core_demand_max": 5.0,
                "value_add_score": 0.5,
                "value_add_max": 1.5,
                "presentation_score": 0.5,
                "presentation_max": 1.0,
                "conclusion_score": 0.5,
                "conclusion_max": 1.0
            },
            "missing_keywords_cards": [
                {
                    "number": 1,
                    "action_type": "Add",
                    "priority": "High Priority",
                    "term": "Zero Trust Architecture",
                    "definition": "Continuous verification paradigm.",
                    "where_to_use": "Page 2 • Under Zero Trust Safeguards",
                    "how_to_use_one_line": "Enforce strict identity verification and least-privilege access for all network transactions."
                },
                {
                    "number": 2,
                    "action_type": "Add",
                    "priority": "High Priority",
                    "term": "Air-Gapping & Micro-segmentation",
                    "definition": "Isolating operational technology systems from public internet.",
                    "where_to_use": "Page 2 • Critical Infrastructure Protection",
                    "how_to_use_one_line": "Physically and logically isolate SCADA grids through air-gapped zones."
                }
            ]
        }

    def test_topic_isolation_cyber_vs_heatwaves_vs_history(self):
        """Cybersecurity concepts appear for cyber questions; NEVER for heatwaves or history."""
        # Cyber question
        cyber_data = copy.deepcopy(self.base_eval_data)
        normalized_cyber = normalize_evaluation_data(cyber_data, max_marks=10, question=cyber_data["detected_question"], paper="GS3")
        concepts_cyber = [c["concept"].lower() for c in normalized_cyber.get("relevant_concepts_keywords", [])]
        self.assertTrue(any("zero trust" in c or "critical information" in c or "defense in depth" in c for c in concepts_cyber))

        # Heatwave question: MUST NOT contain cybersecurity concepts
        heatwave_data = copy.deepcopy(self.base_eval_data)
        heatwave_data["detected_question"] = "Examine the physical and atmospheric mechanisms leading to persistent heatwaves over Northwest India."
        heatwave_data["detected_paper"] = "GS1"
        heatwave_data["transcribed_text"] = "[Page 1] Heatwaves are caused by high solar radiation and hot winds from Rajasthan.\n[Page 2] Global warming increases frequency."
        heatwave_data["relevant_concepts_keywords"] = [
            {"concept": "Zero Trust Architecture", "demand_dimension": "Core", "meaning_in_context": "Invalid cyber concept", "status": "potential_addition", "how_to_use": "Invalid"},
            {"concept": "Atmospheric Blocking (Omega Block)", "demand_dimension": "Persistent Causal Mechanism", "meaning_in_context": "Persistent anticyclonic high-pressure cell trapping descending warm air.", "status": "potential_addition", "how_to_use": "Persistent anticyclones prevent convective dispersion."}
        ]
        normalized_heatwave = normalize_evaluation_data(heatwave_data, max_marks=10, question=heatwave_data["detected_question"], paper="GS1")
        concepts_heatwave = [c["concept"].lower() for c in normalized_heatwave.get("relevant_concepts_keywords", [])]
        self.assertFalse(any("zero trust" in c for c in concepts_heatwave), "Contaminant 'Zero Trust' must be purged from Heatwave question!")
        self.assertTrue(any("blocking" in c or "anticyclone" in c or "wet bulb" in c for c in concepts_heatwave))

        # History question: Battle of Plassey
        history_data = copy.deepcopy(self.base_eval_data)
        history_data["detected_question"] = "Explain how the Battle of Plassey laid the territorial foundation of British colonial rule in Bengal."
        history_data["detected_paper"] = "GS1"
        history_data["transcribed_text"] = "[Page 1] Siraj-ud-daula lost due to treachery.\n[Page 2] Robert Clive took control of 24 Parganas."
        history_data["relevant_concepts_keywords"] = [
            {"concept": "Zero Trust", "demand_dimension": "Invalid", "meaning_in_context": "Invalid", "status": "potential_addition", "how_to_use": "Invalid"},
            {"concept": "Treaty of Alinagar & Secret Conspiracy", "demand_dimension": "Diplomatic Subversion", "meaning_in_context": "Pre-battle pact with Mir Jafar and Jagat Seths.", "status": "potential_addition", "how_to_use": "The conspiracy crippled Nawab's command structure."}
        ]
        normalized_history = normalize_evaluation_data(history_data, max_marks=10, question=history_data["detected_question"], paper="GS1")
        concepts_history = [c["concept"].lower() for c in normalized_history.get("relevant_concepts_keywords", [])]
        self.assertFalse(any("zero trust" in c or "omega block" in c for c in concepts_history), "Cross-topic contamination must be purged from History question!")

    def test_semantic_equivalence_paraphrase_credit(self):
        """Candidate who accurately explains the concept via paraphrase receives 'used_effectively' and student_evidence."""
        eval_data = copy.deepcopy(self.base_eval_data)
        # Student didn't use the exact words "Zero Trust" in title, but wrote the exact definition
        eval_data["transcribed_text"] = (
            "[Page 1] The primary challenge in network security is internal perimeter penetration.\n"
            "[Page 2] Organizations must enforce continuous authentication and strict least-privilege verification for every user and access request rather than trusting internal devices."
        )
        eval_data["relevant_concepts_keywords"] = [
            {
                "concept": "Zero Trust Architecture",
                "demand_dimension": "Cyber Resilience Safeguards",
                "meaning_in_context": "A security model requiring continuous verification of all transactions regardless of network location.",
                "status": "potential_addition", # Model initially didn't recognize paraphrase
                "how_to_use": "Enforce continuous verification and least-privilege policies across all network endpoints."
            }
        ]
        normalized = normalize_evaluation_data(eval_data, max_marks=10, question=eval_data["detected_question"], paper="GS3")
        zt_concept = next((c for c in normalized["relevant_concepts_keywords"] if "zero trust" in c["concept"].lower()), None)
        self.assertIsNotNone(zt_concept)
        self.assertEqual(zt_concept["status"], "used_effectively", "Paraphrased concept must be credited as 'used_effectively'!")
        self.assertTrue(len(zt_concept.get("student_evidence", "")) > 15, "Must quote candidate's paraphrased sentence in student_evidence")

    def test_underexplained_shallow_mention(self):
        """Candidate who merely names/lists a concept without causal depth is flagged as 'underexplained'."""
        eval_data = copy.deepcopy(self.base_eval_data)
        eval_data["transcribed_text"] = (
            "[Page 1] Cyber threats are increasing across India.\n"
            "[Page 2] Solutions:\n1. Better firewalls\n2. Zero trust\n3. Antivirus software."
        )
        eval_data["relevant_concepts_keywords"] = [
            {
                "concept": "Zero Trust Architecture",
                "demand_dimension": "Cyber Resilience Safeguards",
                "meaning_in_context": "Continuous verification of every access request without implicit trust.",
                "status": "used_effectively", # Premature praise should be corrected
                "how_to_use": "Explain micro-segmentation and least-privilege verification instead of a bare list."
            }
        ]
        normalized = normalize_evaluation_data(eval_data, max_marks=10, question=eval_data["detected_question"], paper="GS3")
        zt_concept = next((c for c in normalized["relevant_concepts_keywords"] if "zero trust" in c["concept"].lower()), None)
        self.assertIsNotNone(zt_concept)
        self.assertEqual(zt_concept["status"], "underexplained", "Bare bullet list mention without mechanism must be 'underexplained'!")
        self.assertTrue(len(zt_concept.get("student_evidence", "")) > 5)

    def test_inaccurate_or_misapplied_usage_not_rewarded(self):
        """Erroneous or misapplied usage must not be credited as 'used_effectively'."""
        eval_data = copy.deepcopy(self.base_eval_data)
        eval_data["transcribed_text"] = (
            "[Page 1] Zero trust architecture means trusting citizens to not download malware from untrusted websites."
        )
        eval_data["relevant_concepts_keywords"] = [
            {
                "concept": "Zero Trust Architecture",
                "demand_dimension": "Cyber Resilience Safeguards",
                "meaning_in_context": "Continuous authentication and never trusting any transaction implicitly.",
                "status": "potential_addition",
                "how_to_use": "Correct misconception: Zero Trust applies to system authentication, not public trust."
            }
        ]
        normalized = normalize_evaluation_data(eval_data, max_marks=10, question=eval_data["detected_question"], paper="GS3")
        zt_concept = next((c for c in normalized["relevant_concepts_keywords"] if "zero trust" in c["concept"].lower()), None)
        self.assertIsNotNone(zt_concept)
        self.assertNotEqual(zt_concept["status"], "used_effectively")

    def test_essay_thematic_lenses(self):
        """Essay prompts provide philosophical and thematic argument lenses, not specialist jargon."""
        essay_data = copy.deepcopy(self.base_eval_data)
        essay_data["detected_paper"] = "Essay"
        essay_data["detected_question"] = "Wisdom finds its source in the contemplation of our passions."
        essay_data["transcribed_text"] = "[Page 1] Human emotions and reason have always existed in tension.\n[Page 2] Understanding desires leads to self-mastery."
        normalized_essay = normalize_evaluation_data(essay_data, max_marks=25, question=essay_data["detected_question"], paper="Essay")
        concepts = normalized_essay.get("relevant_concepts_keywords", [])
        self.assertTrue(len(concepts) >= 1)
        # Check that lenses are philosophical/analytical
        concepts_str = " ".join([c["concept"] for c in concepts]).lower()
        self.assertFalse(any(jargon in concepts_str for jargon in ["zero trust", "omega block", "article 356", "pli scheme"]))

    def test_optional_discipline_terminology(self):
        """Optional subjects (PSIR, Sociology) select discipline-specific terminology."""
        psir_data = copy.deepcopy(self.base_eval_data)
        psir_data["detected_paper"] = "Optional-PSIR"
        psir_data["detected_question"] = "Examine the Gramscian concept of hegemony and its relevance in contemporary international relations."
        psir_data["transcribed_text"] = "[Page 1] Gramsci argued that ruling classes rule through consent.\n[Page 2] Civil society institutions create cultural hegemony."
        normalized_psir = normalize_evaluation_data(psir_data, max_marks=15, question=psir_data["detected_question"], paper="Optional-PSIR")
        concepts_psir = [c["concept"].lower() for c in normalized_psir.get("relevant_concepts_keywords", [])]
        self.assertTrue(any("hegemony" in c or "consent" in c or "civil society" in c or "historic bloc" in c for c in concepts_psir))

    def test_bilingual_hindi_recognition(self):
        """Hindi questions produce Devanagari concept names, meanings, and status recognition."""
        hindi_data = copy.deepcopy(self.base_eval_data)
        hindi_data["detected_question"] = "भारत में क्रिटिकल इंफॉर्मेशन इंफ्रास्ट्रक्चर (CII) के समक्ष उभरते खतरों का मूल्यांकन कीजिए तथा शून्य विश्वास वास्तुकला (Zero Trust) की भूमिका का परीक्षण कीजिए।"
        hindi_data["is_hindi"] = True
        hindi_data["medium"] = "hindi"
        hindi_data["transcribed_text"] = "[पृष्ठ 1] साइबर सुरक्षा में शून्य विश्वास वास्तुकला आवश्यक है क्योंकि यह किसी भी उपयोगकर्ता पर स्वतः भरोसा नहीं करती बल्कि प्रत्येक लेनदेन को प्रमाणित करती है।"
        normalized_hindi = normalize_evaluation_data(hindi_data, max_marks=10, question=hindi_data["detected_question"], paper="GS3", medium="hindi")
        concepts_hi = normalized_hindi.get("relevant_concepts_keywords", [])
        self.assertTrue(len(concepts_hi) >= 1)
        zt_hi = next((c for c in concepts_hi if "शून्य" in c["concept"] or "zero trust" in c["concept"].lower()), None)
        self.assertIsNotNone(zt_hi)
        self.assertEqual(zt_hi["status"], "used_effectively")

    def test_anti_duplication_with_value_addition_and_score_decoupling(self):
        """Concepts marked 'used_effectively' are excluded from Value Addition (missing_keywords_cards); scores remain decoupled."""
        eval_data = copy.deepcopy(self.base_eval_data)
        initial_score = eval_data["overall_score"]
        # Candidate used Zero Trust Architecture effectively
        eval_data["transcribed_text"] = (
            "[Page 1] Emerging cyber threats to critical information infrastructure include ransomware attacks and state-sponsored espionage.\n"
            "The traditional perimeter security model is vulnerable.\n"
            "[Page 2] Zero Trust Architecture operates on continuous verification where no entity inside or outside the network is trusted by default."
        )
        eval_data["relevant_concepts_keywords"] = [
            {
                "concept": "Zero Trust Architecture",
                "demand_dimension": "Cyber Safeguards",
                "meaning_in_context": "Continuous verification without implicit trust.",
                "status": "used_effectively",
                "student_evidence": "Zero Trust Architecture operates on continuous verification where no entity inside or outside the network is trusted by default."
            }
        ]
        # Notice missing_keywords_cards has Zero Trust in setUp!
        self.assertTrue(any("zero trust" in str(c.get("term", "")).lower() for c in eval_data["missing_keywords_cards"]))

        normalized = normalize_evaluation_data(eval_data, max_marks=10, question=eval_data["detected_question"], paper="GS3")

        # 1. Zero Trust MUST BE STRIPPED from missing_keywords_cards because student already used it effectively!
        va_terms = [str(c.get("term", "")).lower() for c in normalized.get("missing_keywords_cards", [])]
        self.assertFalse(any("zero trust" in t for t in va_terms), "Concept used effectively must NOT appear in missing_keywords_cards!")

        # 2. Score must remain 100% decoupled and unaffected
        self.assertEqual(normalized["overall_score"], initial_score)

if __name__ == "__main__":
    unittest.main()
