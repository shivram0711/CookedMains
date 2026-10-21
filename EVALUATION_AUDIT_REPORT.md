# Cooked Mains AI: Evaluation Mechanism Audit, Calibration & Frontend Implementation Report

**Date**: October 21, 2026  
**System**: Cooked Mains AI (UPSC Civil Services Mains Answer Evaluator)  
**Scope**: Backend Evaluation Engine Calibration & Publication-Grade Responsive Frontend Integration  

---

## Part 1: Evaluation Mechanism Audit & Calibration Report

### 1.1 Resolution of the 5 Core Failure Classes
- **Failure Class A — Blended Evaluation Categories**:
  - *Resolution*: Implemented a strict **Three-Tier Demand Architecture**:
    - **Tier 1 (Core Demands)**: Explicit non-negotiable requirements of the question. Deductions applied strictly when unmet.
    - **Tier 2 (Analytical Dimensions)**: Breadth, depth, stakeholder perspectives, trade-offs, and administrative balance.
    - **Tier 3 (Optional Enrichment)**: Case studies, committee reports, supreme court doctrines, and statistical data. **Zero-deduction policy enforced**: omission is never penalized as a gap; inclusion receives credit only if relevant, accurate, and tied to a core demand.
- **Failure Class B — Generic or Overlapping Rubrics**:
  - *Resolution*: Criteria are synthesized dynamically from the exact question statement, directive (e.g., *critically examine*, *analyze*, *discuss*), maximum marks ($10\text{M}, 15\text{M}, 20\text{M}, 250\text{M}$), and optional discipline context.
- **Failure Class C — Unsupported Scoring**:
  - *Resolution*: Evaluator requires exact candidate copy evidence for every mark awarded. Bare mentions are distinguished from explained points and supported arguments. If candidate evidence is absent, the system caps awarded marks to $\le 0.05\text{M}$ and explicitly notes `"No supporting evidence found in the readable submission."` (or Devanagari in Hindi evaluation).
- **Failure Class D — Misused Credit**:
  - *Resolution*: De-duplication filter (`_prevent_duplicate_credit`) prevents double-crediting across sections, presentation scores, and point-by-point audits. Irrelevant value additions receive zero credit.
- **Failure Class E — Poor Calibration and Teaching**:
  - *Resolution*: Evaluator separates **Layer A (Objective Scoring Assessment)** from **Layer B (Mentor Teaching & Actionable Exam-Hall Coaching)**. Produces pure, publication-grade model answers cleansed of meta-commentary and internal placeholders.

### 1.2 The 9 Evidence-Grounded Golden Rules Enforced
1. **Evaluate Only Actual Copy**: Zero inference of arguments the candidate did not write.
2. **Three-Tier Demand Separation**: Core vs. Analytical vs. Optional Enrichment.
3. **Quality Over Keywords**: Distinguishes bare mention, explained point, and supported argument.
4. **Zero Duplicate Credit**: Unique conceptual mapping per substantive point.
5. **Auditable Score Ledger**: Criterion marks reconcile with the total score 100%.
6. **Dynamic Feedback Generation**: Adapts to marks ($10\text{M}, 15\text{M}, 20\text{M}$), medium (English / Hindi), and optional subject discipline.
7. **Internal Pre-Release Reconciliation**: Automated consistency checks across steps, rubric, and ledger.
8. **Prioritized Feedback**: 2–3 highest-yield levers ranked by impact, potential mark recovery, and exam-hall fixes.
9. **Release Validation Gate**: Uncertainty flags raised for OCR ambiguities, illegibility, or unverified claims.

---

## Part 2: Summary of Inspection & Focused Frontend Implementation

### 2.1 Contract & Architecture Compliance
- Fully compatible with existing `/api/evaluate` response contract.
- Zero breaking changes to API endpoints, database schemas, or authentication.
- Full preservation and complete isolation of the Essay Evaluation Pipeline (`essay_pipeline.py`).
- Strict adherence to Tailwind CSS design system, dark/light theme tokens, and Lucide icons.

### 2.2 New UI Components in the Evaluation Results View
1. **Evaluator Uncertainty & Integrity Notice Card (`#uncertaintyNoticeCard`)**:
   - Appears dynamically when ambiguity or legibility flags exist (`evalData.uncertainty_flags`).
   - Renders specific warnings (e.g., OCR confidence, handwriting ambiguity, unverifiable statistics caution).
2. **Top 2–3 Prioritized High-Impact Improvements (`#prioritizedFeedbackContainer`)**:
   - Highlights highest-yield upgrades with `#1`, `#2`, `#3` ranking badges.
   - 3-column micro-breakdown: *What Was Done Well*, *Why Marks Were Deducted*, and *Actionable Exam-Hall Fix*.
   - Displays real-time Score Reconciliation badge (`Score Reconciled 100%`).
3. **Unified Auditable Evidence Ledger (`#threeTierDemandsContainer`)**:
   - 3-Tier Demand badges: *Tier 1: Core Demand*, *Tier 2: Analytical Dimension*, *Tier 3: Optional Enrichment*.
   - Depth Level badges: *Explained Point*, *Supported Argument*, *Bare Mention*, *Omitted*.
   - Status badges: *✓ Fulfilled*, *⚠️ Partially Met*, *✗ Missed Demand*, *⛔ Irrelevant*, *🔁 Duplicate*.
   - Verbatim Candidate Copy Evidence quote box.
   - Layer A (Examiner Scoring Assessment & Deduction Reason) vs. Layer B (Mentor Teaching Guidance).
4. **Demonstrated Strengths & Missed Demands Summary (`#strengthsAndGapsSummaryContainer`)**:
   - Grounded strengths that earned credit side-by-side with missed analytical demands.
5. **Full Hindi (Devanagari) & English Localization**:
   - Comprehensive bidirectional localization via `window.localizeEvaluationUI(evalData)`.
6. **Browser Cache Busting**:
   - Script version bumped to `?v=20261021_v6`.

---

## Part 3: Verification & Test Matrix

- **Unit & Regression Tests**: 41/41 tests passing (100% pass rate).
  - `test_evaluation_upgrade.py`: 32/32 PASS
  - `test_key_failover.py`: 3/3 PASS
  - `test_essay_regression.py`: 2/2 PASS
  - `test_essay_api.py`: 2/2 PASS
- **FastAPI Health & Smoke Tests**: PASSED (Status 200 OK).
- **Frontend Syntax Verification**: `node -c static/app.js` PASSED with 0 syntax errors.
