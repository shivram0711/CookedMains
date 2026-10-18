# GSD Verification Checklist (`verify-work`)

**Task / PR**: [Task Name]  
**Date**: [YYYY-MM-DD]  
**Verified By**: [Engineer / Agent]

---

### Automated Tests
- [ ] Unit tests pass: `python -m unittest test_essay_regression.py test_essay_pipeline.py`
- [ ] API tests pass: `python -m unittest test_essay_api.py`
- [ ] Health check passes: `GET /health` returns HTTP 200

### Constraint Audits
- [ ] GS evaluation process (GS1–GS4) was NOT modified.
- [ ] Hindi evaluation process was NOT modified.
- [ ] No extraneous dependencies or npm/pip packages were introduced (Ponytail YAGNI compliance).

### Manual / Visual Verification
- [ ] Desktop layout verified.
- [ ] Mobile/Tablet responsive layout verified.
- [ ] Network error / transient retry behavior tested.
