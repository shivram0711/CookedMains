# Scripts & Autonomous Tools

## 🔄 Ralph Loop (`ralph_loop.ps1` & `ralph_loop.sh`)

The **Ralph Loop** is an autonomous development loop that runs continuous verification with a fresh context per iteration, eliminating AI context rot.

### How to Run:
**Windows (PowerShell):**
```powershell
.\scripts\ralph_loop.ps1
```
Or with custom iterations:
```powershell
.\scripts\ralph_loop.ps1 -MaxIterations 5 -TestCommand "python -m unittest test_essay_regression.py"
```

**Linux / macOS (Bash):**
```bash
bash scripts/ralph_loop.sh 5 "python -m unittest test_essay_regression.py"
```

Logs are recorded in `.planning/RALPH_RUN.log`.
