# 🛑 DEV STOP - Stop all development services

$root = Split-Path -Parent $PSScriptRoot

Write-Host "`n🛑 STOPPING DEVELOPMENT ENVIRONMENT" -ForegroundColor Red
Write-Host "=" * 50 -ForegroundColor Gray

Write-Host "`n🐳 Stopping Docker services..." -ForegroundColor Yellow
Set-Location $root
docker-compose down

Write-Host "`n🔧 Stopping Node processes..." -ForegroundColor Yellow
Get-Process -Name "node" -ErrorAction SilentlyContinue | Stop-Process -Force

Write-Host "`n✅ All services stopped!" -ForegroundColor Green
