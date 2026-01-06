# 🚀 DEV START - Start all development services
param([switch]$NoDocker)

$root = Split-Path -Parent $PSScriptRoot

Write-Host "`n🚀 STARTING DEVELOPMENT ENVIRONMENT" -ForegroundColor Cyan
Write-Host "=" * 50 -ForegroundColor Gray

if (-not $NoDocker) {
    Write-Host "`n🐳 Starting Docker services..." -ForegroundColor Yellow
    Set-Location $root
    docker-compose up -d
    Start-Sleep -Seconds 3
}

Write-Host "`n🔧 Starting Backend..." -ForegroundColor Yellow
$backendPath = Join-Path $root "backend"
if (Test-Path $backendPath) {
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$backendPath'; npm run dev"
}

Write-Host "`n📱 Starting Frontend..." -ForegroundColor Yellow
$frontendPath = Join-Path $root "frontend"
if (Test-Path $frontendPath) {
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$frontendPath'; npm run dev"
}

Write-Host "`n✅ All services started!" -ForegroundColor Green
Write-Host "   Backend:  http://localhost:3001" -ForegroundColor Gray
Write-Host "   Frontend: http://localhost:3000" -ForegroundColor Gray
