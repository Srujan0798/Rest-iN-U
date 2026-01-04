# 🗄️ DATABASE UTILITIES
param(
    [Parameter(Position = 0)]
    [ValidateSet("status", "reset", "seed", "studio", "migrate", "push")]
    [string]$Action = "status"
)

$root = Split-Path -Parent (Split-Path -Parent $PSScriptRoot)
$backendPath = Join-Path $root "backend"

Write-Host "`n🗄️ DATABASE UTILITY: $Action" -ForegroundColor Cyan
Write-Host "=" * 50 -ForegroundColor Gray

Set-Location $backendPath

switch ($Action) {
    "status" {
        Write-Host "`n📊 Docker containers:" -ForegroundColor Yellow
        docker-compose -f "$root\docker-compose.yml" ps
    }
    "reset" {
        Write-Host "`n⚠️ Resetting database..." -ForegroundColor Red
        npx prisma migrate reset --force
        Write-Host "✅ Database reset complete!" -ForegroundColor Green
    }
    "seed" {
        Write-Host "`n🌱 Seeding database..." -ForegroundColor Yellow
        npx prisma db seed
        Write-Host "✅ Database seeded!" -ForegroundColor Green
    }
    "studio" {
        Write-Host "`n🎨 Opening Prisma Studio..." -ForegroundColor Yellow
        Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$backendPath'; npx prisma studio"
    }
    "migrate" {
        Write-Host "`n📦 Running migrations..." -ForegroundColor Yellow
        npx prisma migrate dev
        Write-Host "✅ Migrations complete!" -ForegroundColor Green
    }
    "push" {
        Write-Host "`n📤 Pushing schema to database..." -ForegroundColor Yellow
        npx prisma db push
        Write-Host "✅ Schema pushed!" -ForegroundColor Green
    }
}
