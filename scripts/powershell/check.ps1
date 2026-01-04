# ✅ QUALITY CHECK - Run all code quality checks
param([switch]$Fix)

$root = Split-Path -Parent (Split-Path -Parent $PSScriptRoot)

Write-Host "`n✅ CODE QUALITY CHECK" -ForegroundColor Cyan
Write-Host "=" * 50 -ForegroundColor Gray

$passed = $true

# Frontend checks
$frontendPath = Join-Path $root "frontend"
if (Test-Path $frontendPath) {
    Set-Location $frontendPath
    
    Write-Host "`n📱 FRONTEND:" -ForegroundColor Yellow
    
    # TypeScript
    Write-Host "  → TypeScript..." -ForegroundColor Gray
    npx tsc --noEmit 2>&1 | Out-Null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "    ✅ TypeScript OK" -ForegroundColor Green
    }
    else {
        Write-Host "    ❌ TypeScript errors" -ForegroundColor Red
        $passed = $false
    }
    
    # ESLint
    Write-Host "  → ESLint..." -ForegroundColor Gray
    if ($Fix) {
        npx eslint . --ext .ts, .tsx --fix 2>&1 | Out-Null
    }
    else {
        npx eslint . --ext .ts, .tsx --max-warnings 0 2>&1 | Out-Null
    }
    if ($LASTEXITCODE -eq 0) {
        Write-Host "    ✅ ESLint OK" -ForegroundColor Green
    }
    else {
        Write-Host "    ❌ ESLint errors" -ForegroundColor Red
        $passed = $false
    }
}

# Backend checks
$backendPath = Join-Path $root "backend"
if (Test-Path $backendPath) {
    Set-Location $backendPath
    
    Write-Host "`n🔧 BACKEND:" -ForegroundColor Yellow
    
    # TypeScript
    Write-Host "  → TypeScript..." -ForegroundColor Gray
    npx tsc --noEmit 2>&1 | Out-Null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "    ✅ TypeScript OK" -ForegroundColor Green
    }
    else {
        Write-Host "    ❌ TypeScript errors" -ForegroundColor Red
        $passed = $false
    }
}

Write-Host "`n" + "=" * 50 -ForegroundColor Gray
if ($passed) {
    Write-Host "🎉 ALL CHECKS PASSED!" -ForegroundColor Green
}
else {
    Write-Host "❌ SOME CHECKS FAILED" -ForegroundColor Red
    Write-Host "   Run with -Fix to auto-fix issues" -ForegroundColor Yellow
}
