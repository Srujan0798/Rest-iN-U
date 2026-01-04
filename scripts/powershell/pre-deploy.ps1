# 🚀 PRE-DEPLOYMENT CHECKS

$root = Split-Path -Parent (Split-Path -Parent $PSScriptRoot)

Write-Host "`n🚀 PRE-DEPLOYMENT CHECKLIST" -ForegroundColor Cyan
Write-Host "=" * 50 -ForegroundColor Gray

$passed = $true
$checks = @()

# 1. Quality checks
Write-Host "`n1️⃣ Quality Checks..." -ForegroundColor Yellow
& "$PSScriptRoot\check.ps1" 2>&1 | Out-Null
if ($LASTEXITCODE -eq 0) {
    $checks += @{name = "Quality"; status = "✅" }
}
else {
    $checks += @{name = "Quality"; status = "❌" }
    $passed = $false
}

# 2. Environment check
Write-Host "2️⃣ Environment..." -ForegroundColor Yellow
if (Test-Path "$root\.env") {
    $checks += @{name = "Environment"; status = "✅" }
}
else {
    $checks += @{name = "Environment"; status = "❌" }
    $passed = $false
}

# 3. Git status
Write-Host "3️⃣ Git Status..." -ForegroundColor Yellow
Set-Location $root
$uncommitted = git status --short
if (-not $uncommitted) {
    $checks += @{name = "Git Clean"; status = "✅" }
}
else {
    $checks += @{name = "Git Clean"; status = "⚠️ Uncommitted changes" }
}

# 4. Build test
Write-Host "4️⃣ Build Test..." -ForegroundColor Yellow
$frontendPath = Join-Path $root "frontend"
if (Test-Path $frontendPath) {
    Set-Location $frontendPath
    npm run build 2>&1 | Out-Null
    if ($LASTEXITCODE -eq 0) {
        $checks += @{name = "Frontend Build"; status = "✅" }
    }
    else {
        $checks += @{name = "Frontend Build"; status = "❌" }
        $passed = $false
    }
}

# Results
Write-Host "`n" + "=" * 50 -ForegroundColor Gray
Write-Host "RESULTS:" -ForegroundColor Cyan
foreach ($check in $checks) {
    Write-Host "  $($check.status) $($check.name)"
}

Write-Host "`n" + "=" * 50 -ForegroundColor Gray
if ($passed) {
    Write-Host "🎉 READY FOR DEPLOYMENT!" -ForegroundColor Green
}
else {
    Write-Host "❌ FIX ISSUES BEFORE DEPLOYING!" -ForegroundColor Red
}
