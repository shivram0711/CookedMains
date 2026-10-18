---
name: gsd
description: Get Shit Done (GSD) spec-driven orchestration protocol. Organizes complex tasks into discrete phases/waves with fresh context, atomic commits, explicit verification gates, and human checkpoints.
---

# GSD — Get Shit Done Protocol

GSD is an execution framework for autonomous and semi-autonomous coding agents. It prevents scope creep, lost context, and unverified code changes by structuring tasks into strict, verifiable phases.

---

## The GSD Execution Lifecycle

Every significant engineering task follows this lifecycle:

```
1. SPECIFY      → Create .planning/specs/SPEC-<name>.md
2. BREAKDOWN    → Decompose into discrete Waves (Phase 1, 2, 3...)
3. FRESH WAVE   → Execute one phase at a time with clear acceptance gates
4. VERIFY       → Run automated tests + manual verification checklist
5. COMMIT       → Atomic git commit with descriptive summary
6. CHECKPOINT   → Seek human approval before moving to next destructive phase
```

---

## Directory Structure

```
.planning/
├── README.md                  # Workflow overview & rules
├── ACTIVE_TASK.md             # Currently running spec & progress tracker
├── specs/                     # Formal feature/fix specifications
│   └── SPEC-YYYY-MM-DD-*.md
├── templates/
│   ├── SPEC_TEMPLATE.md
│   ├── TASK_WAVE_TEMPLATE.md
│   └── VERIFICATION_CHECKLIST.md
└── archive/                   # Completed task specs and logs
```

---

## GSD Operational Rules

### Rule 1: No Code Without a Target Spec
Before writing code for complex tasks, the agent or developer defines:
- The exact problem and current behavior.
- The concrete success criteria.
- What is explicitly **out of scope** (Non-Goals).
- The strict constraints (e.g. "Do not touch GS/Hindi evaluation logic").

### Rule 2: Atomic Phase Execution
- Do not attempt to fix 10 files across 4 subsystems in a single step.
- Execute in **Waves**:
  - *Wave 1*: Core logic & backend validation.
  - *Wave 2*: Frontend & UI state synchronization.
  - *Wave 3*: End-to-end integration & regression testing.

### Rule 3: Explicit Verification (`verify-work`)
Before marking any wave or task as complete:
1. Run relevant automated test suites:
   `python -m unittest test_essay_regression.py test_essay_pipeline.py`
2. Run health/smoke checks on associated APIs.
3. Verify that zero untouched subsystems (e.g. GS evaluation) were degraded.

### Rule 4: Clean Commit & Summary
- Each completed wave receives an atomic git commit:
  `feat(<scope>): <concise description>` or `fix(<scope>): <concise description>`
- Document any remaining uncertainties or next steps.
