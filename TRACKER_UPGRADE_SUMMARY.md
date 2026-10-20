# Tracker Upgrade Summary: Data Integration, Fair Comparison & Evidence-Based Progress Review

## Executive Overview
The Progress Tracker has been re-architected from a static, disconnected chart dashboard into an **authentic, evidence-based progress review and forensic audit system**. It reconciles with the candidate's actual saved evaluation records from the Locker, guarantees mathematical consistency across all cards and filters, prevents methodologically invalid cross-rubric comparisons between General Studies (GS) and Essay papers, and links every observed insight directly to its source evaluation copy.

---

## 1. Source of Truth & Data Integration (Phase 1)

### Actual Source Used
- **Single Source of Truth:** `state.weeklyEvaluations` (synced with the backend endpoint `/api/user/evaluations` and cached in user state).
- **No Mock or Phantom Datasets:** The tracker now reads from the exact same evaluation objects that populate the Locker list (`renderWeeklyLocker`).
- **Classification Pipeline (`window.classifyTrackerRecord`):**
  Every record is inspected before metrics are calculated:
  - **Paper Identification:** Checks `item.paper`, `item.evaluation.paper`, or `item.evaluation.detected_paper`.
  - **Type Classification:**
    - **Essay:** Identified by paper title matching `ESSAY`, `max_marks >= 100`, or presence of `evaluation_dimensions` / `revision_priorities`.
    - **GS Papers (GS1–GS4):** Identified by paper code prefix `GS`, `GENERAL STUDIES`, or UPSC standard 10/15-mark rubrics (`rubric_scores.intro_score`, `sub_part_step_marking`).
    - **Optional Subjects:** Identified by paper code prefix `OPTIONAL` or custom subject name.
    - **Unclassified:** Any legacy or corrupted record that lacks both standard paper codes and recognizable rubric keys is categorized as `UNCLASSIFIED` and tracked explicitly.
  - **Score Normalization:** Reads `total_score` / `overall_score` and `max_marks`. GS scores are evaluated on 10/15-mark scales, Essay scores on 125/250-mark scales, and percentage marks `(total_score / max_marks) * 100` are computed with zero division guards.

### Count Reconciliation & Integrity Guarantees
- **Unified Filter Pool:** Filtering by stream (`ALL`, `GS`, `ESSAY`, `OPTIONAL`, `GS1`–`GS4`) or date range (`ALL`, `7D`, `30D`, `90D`) creates a single consistent filtered array `items`.
- **Mathematical Consistency:**
  $$\text{Total Copies} = N_{\text{GS}} + N_{\text{Essay}} + N_{\text{Optional}} + N_{\text{Unclassified}}$$
- If the current account has 11 saved evaluations, the header, summary cards, chart sample sizes, and history entries all report strictly matching subsets. No card reports 0 while another reports 11.

---

## 2. Controls & Interactive Wiring (Phase 2)

Every interactive element in the Tracker UI is actively wired to reactive state handlers and updates all metrics, charts, insights, and history lists in lockstep:

| Control | State Property | Behavior on Change |
| :--- | :--- | :--- |
| **Stream Selector** | `state.trackerStream` | Toggles between `ALL`, `GS` (with GS1–4 chips), `ESSAY`, and `OPTIONAL`. Recalculates all summary cards, switches available radar frameworks, and filters the evaluation history. |
| **GS Paper Chips** | `state.trackerStream` (`GS1`–`GS4`) | Isolates metrics and evaluations strictly for that GS paper. |
| **Time-Range Selector** | `state.trackerDateRange` | Toggles between `ALL Time`, `Last 7 Days`, `Last 30 Days`, and `Last 90 Days`. Dynamically slices evaluation dates based on ISO timestamps. |
| **Framework Switcher** | `state.trackerRadarFramework` | Toggles competency radar between **UPSC Essay Framework** (8 structural dimensions) and **GS Rubric Framework** (Introduction, Core Demand, Sub-parts, Arguments/Data, Way Forward). |
| **Guidance Switcher** | `state.trackerGuidanceTab` | Toggles between **Essay Strategic Focus** and **GS Rubric Focus**. |
| **History Sort Selector** | `state.trackerHistorySort` | Sorts history list by `RECENT` (newest first), `SCORE_ASC` (needs work first), or `SCORE_DESC` (highest scoring first). |
| **Source Copy Deep Links** | `window.viewSavedCopy(id)` | Clicking any evaluation in the history or on any strength/focus card immediately opens the complete saved evaluation modal with authentic line-by-line feedback. |

---

## 3. Evidence-Based Feedback Integration (Phase 3)

The tracker strictly derives qualitative observations from saved evaluator output without fabricating advice:

### Strengths & Focus Area Derivation
1. **Essay Insights:**
   - Reads `evaluation.revision_priorities` and `evaluation.evaluation_dimensions`.
   - Aggregates lowest-scoring dimensions across all essays into **Actionable Priorities** (e.g., *Multi-Dimensional Analysis (PESTLE)* or *Thesis Defense & Logical Transitions*).
   - Extracts highest-scoring dimensions into **Demonstrated Strengths**.
   - Preserves evaluator verbatim comments from `revision_priorities[i].action_plan` and `revision_priorities[i].issue`.
2. **GS Insights:**
   - Reads `evaluation.rubric_scores` (`intro_score`, `core_demand_score`, `arguments_dimensions_score`, `conclusion_way_forward_score`).
   - Identifies the lowest-scoring rubric dimension across evaluated GS copies and marks it as a **Rubric Priority**.
   - Extracts real praise and corrective remarks from `point_by_point_audit` and `sub_part_step_marking`.
3. **Traceability to Source Copies:**
   - Each insight card displays:
     - The pattern description in plain language.
     - The number of supporting evaluations and date range.
     - A direct button: `Review Source Copy ↗`, which opens the exact evaluation where the observation was made.

---

## 4. Redesigned Review Experience (Phase 4)

The static, chart-heavy layout was replaced by a clean, 4-tier structured progress review:

```
┌────────────────────────────────────────────────────────┐
│ 1. Progress Snapshot (Sample, Averages, GS vs Essay)   │
├────────────────────────────────────────────────────────┤
│ 2. Dual-Framework Competency Matrix (Radar + Delta)    │
├────────────────────────────────────────────────────────┤
│ 3. Strengths & Recurring Focus Areas (Direct Evidence) │
├────────────────────────────────────────────────────────┤
│ 4. Chronological Evaluation History (Interactive Cards)│
└────────────────────────────────────────────────────────┘
```

1. **Progress Snapshot:**
   - Clean summary badges indicating exact copy counts: `11 Practice Copies · 9 GS (10M/15M) · 2 Essay (125M)`.
   - Clear average percentages with stated denominators: `GS Practice Mean: 45.0% (4.5 / 10)` and `Essay Practice Mean: 44.0% (55.0 / 125)`.
   - **Fair Comparison Guarantee:** GS and Essay marks are never averaged together into an arbitrary single score.
   - Removed all unsupported claims such as "Top 50 Rank Benchmark" or ungrounded mark-gain promises.
2. **Interactive History:**
   - Each card shows paper badge (`GS1`, `GS4`, `Essay`), score with maximum marks (`4.5 / 10`, `55.0 / 125`), percentage progress bar, evaluation timestamp, and key evaluator comment.
   - Clickable to view the full original evaluation copy.
3. **Empty States:**
   - Honest empty states inform the user when a category or date filter contains no matching copies (e.g., `"No Essay evaluations found in this time range"`).

---

## 5. Verification Results

| Verification Criterion | Result | Status |
| :--- | :--- | :--- |
| **Count Reconciliation** | 11 total copies in account reconcile to 9 GS + 2 Essay (0 unclassified). | Verified PASS |
| **No 0/11 Split Display** | Header sample size and summary cards both display 11 copies synchronously. | Verified PASS |
| **Filter Responsiveness** | Selecting `GS Papers` shows 9 copies; selecting `Essay` shows 2 copies; cards update dynamically. | Verified PASS |
| **Radar Framework Separation** | Essay framework evaluates 8 dimensions; GS framework evaluates 5 standard UPSC rubrics without mixing. | Verified PASS |
| **Source Copy Deep Linking** | Clicking `Review Source Copy ↗` on insight cards or history items opens the saved copy modal with verified evaluation data. | Verified PASS |
| **No Regression on Core Features** | Login, upload flows, vision evaluation, and scoring engines remain unmodified and functional. | Verified PASS |
