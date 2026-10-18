---
name: ponytail
description: The "Lazy Senior Dev" YAGNI protocol. Prevents AI code bloat, over-engineering, and unnecessary dependencies. Enforces native platform features, standard library reuse, and minimal robust code.
---

# Ponytail — The "Lazy Senior Dev" Protocol

> "Weeks of coding can save you hours of planning."  
> "The best code is the code you never had to write."

Ponytail is an anti-overengineering mindset and decision-making protocol for AI coding assistants. It counteracts the common AI tendency to generate bloated abstractions, redundant utility functions, unnecessary npm/pip dependencies, and elaborate multi-class hierarchies when a concise, standard solution already exists.

---

## The Ponytail Decision Ladder

Before writing, proposing, or editing any code, the agent MUST evaluate the task against this strict ladder from top to bottom:

```
[ Step 1: Does this need to exist at all? ]
       ↓ No  → Skip it / Delete it.
       ↓ Yes
[ Step 2: Does it already exist in the codebase? ]
       ↓ Yes → Reuse / import the existing helper or component.
       ↓ No
[ Step 3: Can Python stdlib or vanilla JS/CSS do it? ]
       ↓ Yes → Use standard library / native syntax. Zero new packages.
       ↓ No
[ Step 4: Is there a native platform/browser API? ]
       ↓ Yes → Use built-in HTML5/Web API (e.g. <dialog>, fetch, flex/grid).
       ↓ No
[ Step 5: Write the minimum robust code required ]
       ↓ Keep it flat, direct, and readable.
```

---

## Core Rules & Constraints

### 1. The YAGNI Rule (You Aren't Gonna Need It)
- Do **not** build speculative architecture for hypothetical future features.
- Do **not** add config flags, generic wrappers, or factory patterns for code that has only one concrete caller.
- Do **not** build custom state machines or complex abstraction layers when a boolean or dictionary lookup is sufficient.

### 2. Zero-Dependency Preference
- If Python's `math`, `re`, `json`, `datetime`, `collections`, `itertools`, or `pathlib` can do it, do **not** add third-party libraries.
- In frontend JS/HTML, prefer native modern JavaScript (ES6+), native CSS Flexbox/Grid, and Web APIs over adding external JS libraries or UI frameworks.

### 3. Maintain High Standards for What Matters
Ponytail is **not** an excuse for sloppy or insecure code. The following must always be preserved:
- Strict security (input validation, SQL parameterization, secret protection).
- Comprehensive error handling and user-friendly failure modes.
- Strict isolation of sensitive or critical systems (e.g., preserving existing evaluation rubrics and language mediums).
- Clean naming and standard coding conventions.

### 4. Code Modification Checklist
When editing existing files:
- [ ] Did I reuse existing functions from `storage.py`, `evaluator_engine.py`, or `static/app.js`?
- [ ] Did I avoid touching unaffected modules or routes?
- [ ] Is my diff the smallest viable change that completely solves the issue?
- [ ] Did I avoid adding any unnecessary external package?
