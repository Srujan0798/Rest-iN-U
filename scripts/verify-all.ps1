Write-Host "=========================================="
Write-Host "REST-iN-U Comprehensive Verification"
Write-Host "=========================================="
Write-Host ""

# 1. Check environment files
Write-Host "1. Checking environment files..."
if (Test-Path "backend\.env") {
    Write-Host "✅ Backend .env exists" -ForegroundColor Green
}
else {
    Write-Host "❌ Backend .env missing - copy from .env.example" -ForegroundColor Red
}

if (Test-Path "frontend\.env.local") {
    Write-Host "✅ Frontend .env.local exists" -ForegroundColor Green
}
else {
    Write-Host "⚠️  Frontend .env.local missing - copy from .env.example" -ForegroundColor Yellow
}

Write-Host ""

# 2. Check Docker services
Write-Host "2. Checking Docker services..."
docker-compose ps

Write-Host ""

# 3. Check backend health
Write-Host "3. Checking backend health..."
try {
    $health = Invoke-RestMethod -Uri "http://localhost:4000/api/v1/health" -Method Get -ErrorAction Stop
    Write-Host "✅ Backend is running" -ForegroundColor Green
    $health | ConvertTo-Json -Depth 2
}
catch {
    Write-Host "❌ Backend is not responding" -ForegroundColor Red
}

Write-Host ""

# 4. Check frontend
Write-Host "4. Checking frontend..."
try {
    $frontend = Invoke-WebRequest -Uri "http://localhost:3000/api/health" -Method Get -ErrorAction Stop
    if ($frontend.StatusCode -eq 200) {
        Write-Host "✅ Frontend is running" -ForegroundColor Green
    }
}
catch {
    Write-Host "⚠️  Frontend is not responding" -ForegroundColor Yellow
}

Write-Host ""

# 5. Check database
Write-Host "5. Checking database..."
$db = docker exec restinu-postgres pg_isready
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Database is ready" -ForegroundColor Green
}
else {
    Write-Host "❌ Database is not ready" -ForegroundColor Red
}

Write-Host ""

# 6. Check Redis
Write-Host "6. Checking Redis..."
$redis = docker exec restinu-redis redis-cli ping
if ($redis -eq "PONG") {
    Write-Host "✅ Redis is running" -ForegroundColor Green
}
else {
    Write-Host "❌ Redis is not responding" -ForegroundColor Red
}

Write-Host ""

# 7. Run backend tests
Write-Host "7. Running backend tests..."
Push-Location backend
npm test -- --silent
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Backend tests passed" -ForegroundColor Green
}
else {
    Write-Host "❌ Backend tests failed" -ForegroundColor Red
}
Pop-Location

Write-Host ""

# 8. Run frontend tests
Write-Host "8. Running frontend tests..."
Push-Location frontend
npm test -- --silent
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Frontend tests passed" -ForegroundColor Green
}
else {
    Write-Host "❌ Frontend tests failed" -ForegroundColor Red
}
Pop-Location

Write-Host ""
Write-Host "=========================================="
Write-Host "Verification complete!"
Write-Host "=========================================="
