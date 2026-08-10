# check_progress.ps1 - show v4 training progress for the CURRENT run
# Usage: .\check_progress.ps1   (or:  powershell -ExecutionPolicy Bypass -File check_progress.ps1)

$dir   = "D:\CrossLayer-RAN-Samsung-Prism--master\artifacts\models"
$farms = @("farm14","farm16","farm18","farm19","farm23")
$steps = @("scaler","isoforest","pca","lof","autoencoder")

# A file belongs to the current run if it was written within the last 90 minutes
# AND newer than the start of the current python process.
$pyProcs   = Get-Process python -ErrorAction SilentlyContinue | Where-Object { $_.WorkingSet -gt 200MB }
$runStart  = if ($pyProcs) { ($pyProcs | Sort-Object StartTime | Select-Object -First 1).StartTime } else { (Get-Date).AddMinutes(-90) }

Write-Host ""
Write-Host "=== v4 Training Progress ===" -ForegroundColor Cyan
Write-Host ("Run started:  {0:HH:mm:ss}  (elapsed {1:N1} min)" -f $runStart, ((Get-Date) - $runStart).TotalMinutes)
Write-Host ""

# Parse results JSON for officially completed farms (only farms in the file are done)
$done_farms = @()
$json = $null
$resultsPath = "$dir\multimodel_results_v4.json"
if (Test-Path $resultsPath) {
    try {
        $json       = Get-Content $resultsPath -Raw | ConvertFrom-Json
        $done_farms = $json.PSObject.Properties.Name
    } catch { }
}

$completed = 0
$running   = $null
$completion_times = @{}

foreach ($f in $farms) {
    $parts_done = @()
    foreach ($s in $steps) {
        $p = "$dir\${s}_$f.joblib"
        if (Test-Path $p) {
            $t = (Get-Item $p).LastWriteTime
            if ($t -gt $runStart) { $parts_done += $s }
        }
    }

    if ($done_farms -contains $f) {
        $r   = $json.$f
        $ae  = $r.models.Autoencoder
        $en  = $r.models.Ensemble
        $tot = [math]::Max(1, $r.test_distress_rows)
        $ae_recall  = [math]::Round($ae.caught_distress / $tot * 100, 1)
        $ens_recall = [math]::Round($en.caught_distress / $tot * 100, 1)
        Write-Host ("  {0,-8} COMPLETE   AE: {1,5}%   Ensemble: {2,5}%" -f $f, $ae_recall, $ens_recall) -ForegroundColor Green
        $completed++
        $ae_file = "$dir\autoencoder_$f.joblib"
        if (Test-Path $ae_file) { $completion_times[$f] = (Get-Item $ae_file).LastWriteTime }
    } elseif ($parts_done.Count -gt 0) {
        $next_step = $steps | Where-Object { $parts_done -notcontains $_ } | Select-Object -First 1
        $bar = ("#" * $parts_done.Count) + ("-" * (5 - $parts_done.Count))
        Write-Host ("  {0,-8} RUNNING    [{1}] {2}/5  next: {3}" -f $f, $bar, $parts_done.Count, $next_step) -ForegroundColor Yellow
        $running = $f
    } else {
        Write-Host ("  {0,-8} pending" -f $f) -ForegroundColor DarkGray
    }
}

Write-Host ""
Write-Host ("Progress: $completed / $($farms.Count) farms complete") -ForegroundColor Cyan
if ($running) { Write-Host ("Currently training: $running") -ForegroundColor Yellow }

# Per-farm timing + ETA
if ($completion_times.Count -ge 1) {
    $first   = ($completion_times.Values | Sort-Object | Select-Object -First 1)
    $elapsed = ((Get-Date) - $runStart).TotalMinutes
    $per     = [math]::Round($elapsed / $completed, 1)
    $eta     = [math]::Round($per * ($farms.Count - $completed), 1)
    Write-Host ("Avg per farm: {0} min   ETA remaining: ~{1} min" -f $per, $eta) -ForegroundColor Cyan
}

if (-not $pyProcs) {
    Write-Host ""
    Write-Host "WARNING: no large python process detected - training may have died." -ForegroundColor Red
}
Write-Host ""
