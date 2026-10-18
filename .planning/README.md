# .planning — Get Shit Done (GSD) Execution Directory

This directory stores active tasks, formal specifications, phase breakdowns, and verification checklists for all engineering and development workflows on CookedMains.

## Directory Layout
- `ACTIVE_TASK.md`: Current in-flight task status, active wave, and progress.
- `specs/`: Detailed requirements documents and problem definitions.
- `templates/`: Standard reusable templates for new tasks and verification.
- `archive/`: Completed tasks and historical records.

## Quick Workflow
1. Copy `templates/SPEC_TEMPLATE.md` to `specs/SPEC-<feature-name>.md`.
2. Define problem, success criteria, and strict constraints.
3. Update `ACTIVE_TASK.md` with current wave.
4. Execute wave, verify via `templates/VERIFICATION_CHECKLIST.md`.
5. Run tests, commit changes, and seek review.
