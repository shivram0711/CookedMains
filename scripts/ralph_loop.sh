#!/usr/bin/env bash
# Ralph Loop Autonomous Task Runner (Bash / Linux / macOS)
# Runs verification tests continuously with a fresh context per iteration.

set -o pipefail

MAX_ITERATIONS=${1:-10}
TEST_COMMAND=${2:-"python -m unittest test_essay_regression.py test_essay_pipeline.py"}
TASK_FILE=${3:-".planning/ACTIVE_TASK.md"}
LOG_FILE=".planning/RALPH_RUN.log"

echo "=========================================================="
echo " 🔄 RALPH LOOP — AUTONOMOUS FRESH-CONTEXT RUNNER (BASH)"
echo "=========================================================="
echo "Max Iterations : $MAX_ITERATIONS"
echo "Test Command   : $TEST_COMMAND"
echo "Task File      : $TASK_FILE"
echo ""

mkdir -p .planning
iteration=0
all_passed=0

while [ $iteration -lt $MAX_ITERATIONS ]; do
    iteration=$((iteration + 1))
    timestamp=$(date +"%Y-%m-%d %H:%M:%S")
    echo "----------------------------------------------------------"
    echo "[$timestamp] [RALPH LOOP] Iteration $iteration of $MAX_ITERATIONS..."

    if eval "$TEST_COMMAND"; then
        echo "[$timestamp] [RALPH LOOP SUCCESS] All tests PASSED cleanly on iteration $iteration!"
        echo "[$timestamp] Iteration $iteration: PASS" >> "$LOG_FILE"
        all_passed=1
        break
    else
        exit_code=$?
        echo "[$timestamp] [RALPH LOOP] Tests failed (Exit Code: $exit_code). Recording log..."
        echo "[$timestamp] Iteration $iteration: FAILED (Exit Code: $exit_code)" >> "$LOG_FILE"
        sleep 2
    fi
done

echo "=========================================================="
if [ $all_passed -eq 1 ]; then
    echo " ✅ RALPH LOOP COMPLETED: System in verified state!"
    exit 0
else
    echo " ⚠️ RALPH LOOP HALTED: Max iterations reached without 100% pass."
    exit 1
fi
