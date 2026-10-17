"""
test_essay_api.py
API integration test verifying FastAPI endpoints for the essay pipeline and GS regression.
"""

import sys
import io
import unittest
from fastapi.testclient import TestClient
from PIL import Image, ImageDraw

from main import app
import storage

class TestEssayAPI(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        storage.init_db()
        cls.client = TestClient(app)

    def test_01_essay_status_and_retry_endpoints(self):
        import uuid
        job_id = f"test_api_job_{uuid.uuid4().hex[:8]}"
        storage.create_essay_job(
            job_id=job_id,
            user_email="api_test@upsc.gov.in",
            question="Artificial Intelligence: Threat or Opportunity?",
            paper="Essay",
            max_marks=125,
            medium="english",
            total_pages=5,
            page_range="1-5",
            selected_pages=[1, 2, 3, 4, 5],
            batch_size=3
        )

        # GET /api/essay/status/{job_id}
        res = self.client.get(f"/api/essay/status/{job_id}")
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertEqual(data["job_id"], job_id)
        self.assertEqual(data["status"], "queued")
        self.assertEqual(data["total_pages"], 5)

        # Fail the job
        storage.fail_essay_job(job_id, "Simulated transient failure")
        res_fail = self.client.get(f"/api/essay/status/{job_id}")
        self.assertEqual(res_fail.json()["status"], "failed")

        # POST /api/essay/retry/{job_id}
        res_retry = self.client.post(f"/api/essay/retry/{job_id}")
        self.assertEqual(res_retry.status_code, 200)
        retry_data = res_retry.json()
        self.assertEqual(retry_data["status"], "processing")
        self.assertEqual(retry_data["job_id"], job_id)

    def test_02_evaluate_endpoint_bifurcation(self):
        # 1. Test GS1 with 10 marks: must NOT return is_async_job
        # Send a minimal dummy image
        img = Image.new("RGB", (100, 100), (255, 255, 255))
        buf = io.BytesIO()
        img.save(buf, format="JPEG")
        dummy_bytes = buf.getvalue()

        # For GS evaluation, if no API key is provided and offline mode, it handles via standard GS flow
        gs_res = self.client.post(
            "/api/evaluate",
            data={
                "question": "Discuss the impact of climate change on Indian monsoons.",
                "paper": "GS1",
                "max_marks": 10,
                "medium": "english",
                "api_key": "test_dummy_key"
            },
            files={"files": ("page1.jpg", dummy_bytes, "image/jpeg")}
        )
        # Verify GS did NOT return is_async_job: True
        if gs_res.status_code == 200:
            gs_json = gs_res.json()
            self.assertFalse(gs_json.get("is_async_job", False), "GS evaluation must NOT be async background job")

        # 2. Test Essay paper: MUST return is_async_job: True
        essay_res = self.client.post(
            "/api/evaluate",
            data={
                "question": "Courage is resistance to fear, mastery of fear, not absence of fear.",
                "paper": "ESSAY",
                "max_marks": 125,
                "medium": "english",
                "api_key": "test_dummy_key"
            },
            files={"files": ("page1.jpg", dummy_bytes, "image/jpeg")}
        )
        self.assertEqual(essay_res.status_code, 200)
        essay_json = essay_res.json()
        self.assertTrue(essay_json.get("is_async_job"), "Essay evaluation MUST return is_async_job: True")
        self.assertIn("job_id", essay_json)
        self.assertEqual(essay_json.get("status"), "processing")

if __name__ == "__main__":
    unittest.main()
