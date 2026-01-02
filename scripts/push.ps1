# 📤 SMART GIT PUSH
param(
    [Parameter(Position = 0)]
    [string]$Message = "Update",
    
    [Alias("q")]
    [switch]$Quick
)

$root = Split-Path -Parent $PSScriptRoot
Set-Location $root

Write-Host "`n📤 SMART GIT PUSH" -ForegroundColor Cyan
Write-Host "=" * 50 -ForegroundColor Gray

# Show status
Write-Host "`n📂 Changes:" -ForegroundColor Yellow
git status --short

$changes = git status --short
if (-not $changes) {
    Write-Host "`n⚠️ No changes to commit!" -ForegroundColor Yellow
    exit 0
}

# Run checks unless Quick mode
if (-not $Quick) {
    Write-Host "`n🔍 Running quality checks..." -ForegroundColor Yellow
    & "$PSScriptRoot\check.ps1"
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "`n❌ Quality checks failed! Use -Quick to skip." -ForegroundColor Red
        exit 1
    }
}

# Commit and push
Write-Host "`n📝 Committing: $Message" -ForegroundColor Yellow
git add -A
git commit -m $Message

Write-Host "`n🚀 Pushing..." -ForegroundColor Yellow
git push

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n✅ Successfully pushed!" -ForegroundColor Green
}
else {
    Write-Host "`n❌ Push failed!" -ForegroundColor Red
}
