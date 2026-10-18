param (
    [int]$MaxIterations = 10,
    [string]$TestCommand = "python -m unittest test_essay_regression.py test_essay_pipeline.py",
    [string]$TaskFile = ".planning/ACTIVE_TASK.md",
    [switch]$AutoCommit
)

$ErrorActionPreference = "Continue"

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host " RALPH LOOP - AUTONOMOUS FRESH-CONTEXT RUNNER" -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "Max Iterations : $MaxIterations" -ForegroundColor Gray
Write-Host "Test Command   : $TestCommand" -ForegroundColor Gray
Write-Host "Task File      : $TaskFile" -ForegroundColor Gray
Write-Host "Auto-Commit    : $AutoCommit" -ForegroundColor Gray
Write-Host ""

$logFile = ".planning/RALPH_RUN.log"
$iteration = 0
$allPassed = $false

while ($iteration -lt $MaxIterations) {
    $iteration++
    $timestamp = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")
    Write-Host "----------------------------------------------------------" -ForegroundColor DarkGray
    Write-Host "[$timestamp] [RALPH LOOP] Iteration $iteration of $MaxIterations..." -ForegroundColor Yellow

    Write-Host "Running verification: $TestCommand" -ForegroundColor Gray
    $testOutput = Invoke-Expression $TestCommand 2>&1
    $exitCode = $LASTEXITCODE

    if ($exitCode -eq 0) {
        Write-Host "[$timestamp] [RALPH LOOP SUCCESS] All tests PASSED on iteration $iteration!" -ForegroundColor Green
        "[$timestamp] Iteration $iteration - PASS" | Out-File -FilePath $logFile -Append -Encoding utf8
        $allPassed = $true
        break
    } else {
        Write-Host "[$timestamp] [RALPH LOOP] Tests failed with exit code $exitCode." -ForegroundColor Magenta
        $failLog = "[$timestamp] Iteration $iteration - FAILED with exit code $exitCode"
        $failLog | Out-File -FilePath $logFile -Append -Encoding utf8
        $testOutput | Out-File -FilePath $logFile -Append -Encoding utf8

        if ($AutoCommit) {
            $status = git status --porcelain
            if ($status) {
                Write-Host "Saving checkpoint commit for iteration $iteration..." -ForegroundColor DarkCyan
                git add -A
                git commit -m "chore(ralph): iteration $iteration checkpoint"
            }
        }

        Write-Host "Resting 2s before next loop..." -ForegroundColor Gray
        Start-Sleep -Seconds 2
    }
}

Write-Host "==========================================================" -ForegroundColor Cyan
if ($allPassed) {
    Write-Host " RALPH LOOP COMPLETED: System in verified state!" -ForegroundColor Green
    exit 0
} else {
    Write-Host " RALPH LOOP HALTED: Max iterations reached without 100% pass." -ForegroundColor Red
    Write-Host "Check $logFile for failure logs." -ForegroundColor Red
    exit 1
}
