# 🔥 Cooked Mains AI — Strict UPSC Handwritten Answer Evaluator

An elite, high-precision AI evaluation platform engineered specifically for UPSC Civil Services Mains aspirants. Evaluates handwritten answer sheets against official UPSC scoring standards, provides 3D analytical heatmaps, model answers, and instant UPI subscription activation.

---

## ⚡ Quick Start (Local Run)

1. **Clone or navigate to the directory**:
   ```bash
   cd upsc-mains-evaluator
   ```

2. **Configure your environment**:
   Copy `.env.example` to `.env` and insert your Gemini API Key:
   ```bash
   GEMINI_API_KEY=your_actual_key_here
   ```

3. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Launch the server**:
   ```bash
   python run.py
   # Or directly:
   python -m uvicorn main:app --host 127.0.0.1 --port 8000 --reload
   ```
   Open your browser at `http://127.0.0.1:8000`.

---

## ⏪ How to Undo / Rollback Changes with Git

You now have a complete local Git repository with snapshots of your project. Here is how to inspect and undo any mistakes:

### 1. Check what has changed
See which files have been modified or added:
```bash
git status
```

### 2. See exact line-by-line changes
See what changed in a file compared to your saved version:
```bash
git diff <filename>
# Example: git diff static/app.js
```

### 3. Undo changes in a specific file (Discard uncommitted edits)
If you made changes in a file and want to revert it back to the last saved commit:
```bash
git restore <filename>
# Example: git restore static/index.html
```

### 4. Discard ALL uncommitted changes across the whole project
If you tried an experiment that broke things and you want to completely revert everything back to the last saved commit:
```bash
git restore .
git clean -fd
```

### 5. View your commit history (Saved Checkpoints)
```bash
git log --oneline
```

### 6. Save a new checkpoint whenever you make good changes
```bash
git add .
git commit -m "Describe what you updated or added"
```

### 7. Rollback to a previous commit checkpoint
If you ever want to reset your code to an exact past commit:
```bash
git reset --hard <commit-hash-or-tag>
# Example to go back to launch baseline:
git reset --hard v1.0.0-launch
```

---

## 🚀 One-Click Online Deployment (Option 1: Render)

1. **Create a private GitHub repository**:
   - Go to [github.com/new](https://github.com/new) and create a repository named `cooked-mains`.
   - Push your local code:
     ```bash
     git remote add origin https://github.com/<your-username>/cooked-mains.git
     git branch -M main
     git push -u origin main
     ```

2. **Deploy on Render.com**:
   - Sign up at [render.com](https://render.com).
   - Click **New +** -> **Web Service** (or **Blueprint**).
   - Select your `cooked-mains` repository.
   - It will automatically detect `render.yaml`.
   - Add your secret environment variable:
     - `GEMINI_API_KEY`: `AIzaSy...`
   - Click **Apply** / **Deploy**.
   - Render gives you an instant free SSL URL: `https://cooked-mains.onrender.com`.

---

## 🛡️ Security & Integrity
- `.env` and `*.db` files are strictly excluded via `.gitignore` to prevent secret leaks and database overwrite.
- SQLite runs in high-concurrency WAL mode (`PRAGMA journal_mode=WAL;`).
