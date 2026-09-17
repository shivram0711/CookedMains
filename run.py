import sys
import os
import webbrowser
import subprocess

def main():
    print("=" * 65)
    print("   MainsMentor AI — Strict UPSC Handwritten Answer Evaluator")
    print("=" * 65)
    print("\nStarting local server on http://127.0.0.1:8000 ...")

    # Launch uvicorn
    import uvicorn
    app_dir = os.path.dirname(os.path.abspath(__file__))
    sys.path.insert(0, app_dir)
    
    # Try to open default browser after a quick moment
    try:
        webbrowser.open("http://127.0.0.1:8000")
    except Exception:
        pass

    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True, app_dir=app_dir)

if __name__ == "__main__":
    main()
