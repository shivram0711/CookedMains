# CookedMains AI — Universal Agent Invariants & Guidelines

> **IMPORTANT NOTICE FOR ALL AI CODING AGENTS (Antigravity, Cursor, Windsurf, Claude Code, Copilot)**  
> This file establishes the non-negotiable architectural boundaries and behavioral rules for this repository. Every agent working in this codebase MUST follow these rules strictly.

---

## 🚨 RULE 1: ABSOLUTE ISOLATION OF HINDI & GS EVALUATION
- **Do NOT modify, refactor, or touch General Studies (GS1, GS2, GS3, GS4) evaluation logic** in `main.py`, `evaluator_engine.py`, or any prompt builder.
- **Do NOT change Hindi-medium evaluation behaviors** or rubrics.
- Any feature, enhancement, or fix for UPSC Essay Evaluation must be strictly scoped to `paper.lower() == "essay"`, `essay_pipeline.py`, and the dedicated async essay routes.
- GS evaluation is synchronous (`/api/evaluate`) and must remain 100% isolated from async essay jobs.

---

## 🦹 RULE 2: PONYTAIL PROTOCOL (YAGNI & MINIMAL CODE)
- Always apply the **Ponytail Decision Ladder**:
  1. *Does this need to exist?* If no, skip it.
  2. *Is it already in the codebase?* Reuse existing helpers from `storage.py`, `evaluator_engine.py`, or `static/app.js`.
  3. *Can Python stdlib or native JS/CSS do it?* Do NOT add new `pip` or `npm` dependencies.
  4. *Is there a native HTML5/Web API?* Use built-in platform capabilities (e.g., `<dialog>`, Flexbox, Grid, ES6+).
  5. *Write the minimal robust code required.* Avoid multi-class abstractions for single-use cases.

---

## 🛡️ RULE 3: LONG-DOCUMENT ESSAY PIPELINE STABILITY
- **Batch Size Limit**: Keep batch size $\le 2$ when scanning multi-page handwritten essays. Never increase to 3+ without rate-limit verification.
- **Rate-Limit Resilience**: Maintain at least 6 retries with exponential backoff (up to 30s) on Gemini HTTP 429/503 errors.
- **Checkpoint Clearing**: Whenever updating essay job progress with `status = 'processing'`, ensure `error_message = NULL` is set to avoid displaying stale errors.
- **Credit Idempotency**: Deduct student evaluation credits only once upon 100% successful job completion (`mark_essay_job_credit_deducted`). Zero credits charged on errors or interruptions.

---

## ⚡ RULE 4: GSD (GET SHIT DONE) EXECUTION DISCIPLINE
- For complex changes, follow the `.planning/` specification pattern.
- Execute in discrete **Waves** (Backend → Frontend → Tests).
- Always run the verification test suite before declaring a task complete:
  ```bash
  python -m unittest test_essay_regression.py test_essay_pipeline.py
  ```

---

## 🔒 RULE 5: SECURITY & DATABASE INTEGRITY
- **Parameterized SQL**: All SQLite queries in `storage.py` must use parameter markers (`?`). Never use string interpolation (f-strings) in SQL queries.
- **Secret Protection**: Never commit API keys, `.env` files, or Supabase service secrets.
- **Frontend Safety**: In `static/app.js`, never throw unhandled exceptions from polling loops that break UI modal states.
