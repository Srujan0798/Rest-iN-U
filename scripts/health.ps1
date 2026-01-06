# 🏥 PROJECT HEALTH CHECK

$root = Split-Path -Parent $PSScriptRoot

Write-Host "`n🏥 PROJECT HEALTH CHECK" -ForegroundColor Cyan
Write-Host "=" * 50 -ForegroundColor Gray

# Check Docker
Write-Host "`n🐳 Docker:" -ForegroundColor Yellow
docker info 2>&1 | Out-Null
if ($LASTEXITCODE -eq 0) {
    Write-Host "   ✅ Docker is running" -ForegroundColor Green
    docker-compose -f "$root\docker-compose.yml" ps --format "table {{.Name}}\t{{.Status}}" 2>&1 | ForEach-Object { Write-Host "   $_" -ForegroundColor Gray }
}
else {
    Write-Host "   ❌ Docker is not running" -ForegroundColor Red
}

# Check Node
Write-Host "`n📦 Node.js:" -ForegroundColor Yellow
$nodeVersion = node --version 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "   ✅ Node.js $nodeVersion" -ForegroundColor Green
}
else {
    Write-Host "   ❌ Node.js not found" -ForegroundColor Red
}

# Check Frontend dependencies
Write-Host "`n📱 Frontend:" -ForegroundColor Yellow
$frontendPath = Join-Path $root "frontend"
if (Test-Path "$frontendPath\node_modules") {
    Write-Host "   ✅ Dependencies installed" -ForegroundColor Green
}
else {
    Write-Host "   ⚠️ Run 'npm install' in frontend/" -ForegroundColor Yellow
}

# Check Backend dependencies
Write-Host "`n🔧 Backend:" -ForegroundColor Yellow
$backendPath = Join-Path $root "backend"
if (Test-Path "$backendPath\node_modules") {
    Write-Host "   ✅ Dependencies installed" -ForegroundColor Green
}
else {
    Write-Host "   ⚠️ Run 'npm install' in backend/" -ForegroundColor Yellow
}

# Check environment files
Write-Host "`n🔐 Environment:" -ForegroundColor Yellow
if (Test-Path "$root\.env") {
    Write-Host "   ✅ Root .env exists" -ForegroundColor Green
}
else {
    Write-Host "   ⚠️ Missing root .env (copy from .env.example)" -ForegroundColor Yellow
}

# Git status
Write-Host "`n📂 Git Status:" -ForegroundColor Yellow
Set-Location $root
$status = git status --short 2>&1
$count = ($status | Measure-Object -Line).Lines
if ($count -eq 0) {
    Write-Host "   ✅ Working directory clean" -ForegroundColor Green
}
else {
    Write-Host "   📝 $count uncommitted changes" -ForegroundColor Yellow
}

Write-Host "`n" + "=" * 50 -ForegroundColor Gray
Write-Host "Health check complete!" -ForegroundColor Cyan
