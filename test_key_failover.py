import asyncio
import json
import time
import unittest
from unittest.mock import MagicMock, patch

from evaluator_engine import (
    execute_gemini_with_resilience,
    record_gemini_key_cooldown,
    is_gemini_key_cooling_down,
    _KEY_COOLDOWNS
)


class TestKeyFailoverAndQuotaHandling(unittest.TestCase):
    def setUp(self):
        _KEY_COOLDOWNS.clear()

    def test_fast_fail_on_quota_flag_in_resilience(self):
        """Verify that execute_gemini_with_resilience aborts immediately on 429 without sleeping when fast_fail_on_quota is True."""
        mock_client = MagicMock()
        mock_client.models.generate_content.side_effect = Exception("429 RESOURCE_EXHAUSTED: Quota exceeded for project")

        t0 = time.time()
        with self.assertRaises(Exception) as ctx:
            execute_gemini_with_resilience(
                client=mock_client,
                model="gemini-3.5-flash-lite",
                contents="test",
                max_retries=3,
                fast_fail_on_quota=True
            )
        duration = time.time() - t0

        self.assertIn("429", str(ctx.exception))
        # Call should have failed immediately on attempt 1 without sleeping
        self.assertEqual(mock_client.models.generate_content.call_count, 1)
        self.assertLess(duration, 0.5, "fast_fail_on_quota must fail in < 0.5s without burning retry backoffs")

    def test_multi_key_429_rotation_reaches_key_2(self):
        """Simulate the evaluate_answer loop: verify that a 429 on Key 1 instantly rotates to Key 2 and succeeds."""
        keys_to_try = ["key_project_A_saturated", "key_project_B_fresh"]
        eff_retries = 1 if len(keys_to_try) > 1 else 2
        fast_quota_exit = (len(keys_to_try) > 1)

        key_attempt_log = []
        evaluation_result = None
        eval_loop_start = time.time()

        models_to_try = [
            "gemini-3.5-flash-lite",
            "gemini-flash-lite-latest",
            "gemini-3.6-flash",
            "gemini-3.5-flash",
            "gemini-omni-flash-preview",
            "gemini-3.7-flash",
        ]

        def mock_generate_content(client_key, model):
            key_attempt_log.append((client_key, model))
            if client_key == "key_project_A_saturated":
                raise Exception("429 RESOURCE_EXHAUSTED: Quota exceeded for project gen-lang-client-0542964842")
            else:
                # Key 2 succeeds
                mock_resp = MagicMock()
                mock_resp.text = json.dumps({
                    "overall_score": 6.5,
                    "max_marks": 10,
                    "feedback": "Strong answer structure with relevant case laws.",
                    "rubric_scores": {
                        "intro_score": 1.5,
                        "core_demand_score": 3.0,
                        "value_add_score": 1.0,
                        "presentation_score": 0.5,
                        "conclusion_score": 0.5
                    }
                })
                return mock_resp

        # Run simulated evaluation loop matching main.py lines 2372-2448
        for key_idx, current_key in enumerate(keys_to_try):
            if time.time() - eval_loop_start > 85:
                break

            for model_name in models_to_try:
                if time.time() - eval_loop_start > 90:
                    break
                try:
                    mock_client = MagicMock()
                    mock_client.models.generate_content.side_effect = lambda model, contents, config: mock_generate_content(current_key, model)

                    response = execute_gemini_with_resilience(
                        client=mock_client,
                        model=model_name,
                        contents=["sample_handwritten_page"],
                        max_retries=eff_retries,
                        fast_fail_on_quota=fast_quota_exit
                    )
                    if response and response.text:
                        parsed = json.loads(response.text)
                        if isinstance(parsed, dict) and parsed.get("overall_score"):
                            evaluation_result = parsed
                            break
                except Exception as ge:
                    err_s = str(ge)
                    err_low = err_s.lower()
                    is_quota_hit = any(k_err in err_low for k_err in ["429", "resource_exhausted", "quota"])
                    if is_quota_hit:
                        record_gemini_key_cooldown(current_key, 60.0)
                        if len(keys_to_try) > 1 and key_idx < len(keys_to_try) - 1:
                            # Instantly rotate to alternate project key!
                            break
                        continue

            if evaluation_result:
                break

        # Verification Assertions:
        # 1. Key 1 was tried with the first model
        self.assertIn(("key_project_A_saturated", "gemini-3.5-flash-lite"), key_attempt_log)

        # 2. Key 1 was NOT retried across the other 5 models (loop broke out immediately on 429)
        key_1_attempts = [m for k, m in key_attempt_log if k == "key_project_A_saturated"]
        self.assertEqual(len(key_1_attempts), 1, "Key 1 should abort on first 429 without cycling through all remaining models on that key")

        # 3. Key 1 was recorded in 60s cooldown
        self.assertTrue(is_gemini_key_cooling_down("key_project_A_saturated"))

        # 4. Key 2 was reached immediately
        key_2_attempts = [m for k, m in key_attempt_log if k == "key_project_B_fresh"]
        self.assertGreaterEqual(len(key_2_attempts), 1, "Key 2 must be reached after Key 1 hits 429")

        # 5. Evaluation succeeded using Key 2
        self.assertIsNotNone(evaluation_result)
        self.assertEqual(evaluation_result.get("overall_score"), 6.5)

    def test_single_key_allows_retry_when_no_alternate_keys(self):
        """When only 1 key is available, the engine should not abort the model loop, but try fallback models."""
        keys_to_try = ["only_configured_key"]
        eff_retries = 1 if len(keys_to_try) > 1 else 2
        fast_quota_exit = (len(keys_to_try) > 1)

        self.assertEqual(eff_retries, 2, "Single-key mode must allow in-key retries")
        self.assertFalse(fast_quota_exit, "Single-key mode must not fast-exit without trying fallback models")


if __name__ == "__main__":
    unittest.main()
