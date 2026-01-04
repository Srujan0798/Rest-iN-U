# 🎯 REST-iN-U MASTER COMMAND CENTER
# Run this to see all available utilities

Write-Host ""
Write-Host "╔══════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║           🚀 REST-iN-U COMMAND CENTER                        ║" -ForegroundColor Cyan
Write-Host "╠══════════════════════════════════════════════════════════════╣" -ForegroundColor Cyan
Write-Host "║                                                              ║" -ForegroundColor Cyan
Write-Host "║  DEVELOPMENT:                                                ║" -ForegroundColor Cyan
Write-Host "║    .\scripts\powershell\dev-start.ps1      → Start all services        ║" -ForegroundColor Green
Write-Host "║    .\scripts\powershell\dev-stop.ps1       → Stop all services         ║" -ForegroundColor Green
Write-Host "║                                                              ║" -ForegroundColor Cyan
Write-Host "║  DATABASE:                                                   ║" -ForegroundColor Cyan
Write-Host "║    .\scripts\powershell\db.ps1 status      → Check DB status           ║" -ForegroundColor Yellow
Write-Host "║    .\scripts\powershell\db.ps1 reset       → Reset database            ║" -ForegroundColor Yellow
Write-Host "║    .\scripts\powershell\db.ps1 seed        → Seed database             ║" -ForegroundColor Yellow
Write-Host "║    .\scripts\powershell\db.ps1 studio      → Open Prisma Studio        ║" -ForegroundColor Yellow
Write-Host "║                                                              ║" -ForegroundColor Cyan
Write-Host "║  QUALITY:                                                    ║" -ForegroundColor Cyan
Write-Host "║    .\scripts\powershell\check.ps1          → Run all quality checks    ║" -ForegroundColor Magenta
Write-Host "║    python scripts/quality_audit.py         → Run Titan Quality Audit   ║" -ForegroundColor Magenta
Write-Host "║    .\scripts\powershell\health.ps1         → Project health check      ║" -ForegroundColor Magenta
Write-Host "║                                                              ║" -ForegroundColor Cyan
Write-Host "║  GIT:                                                        ║" -ForegroundColor Cyan
Write-Host "║    .\scripts\powershell\push.ps1 ""msg""     → Smart commit & push       ║" -ForegroundColor Blue
Write-Host "║    .\scripts\powershell\push.ps1 ""msg"" -q  → Quick push (skip tests)   ║" -ForegroundColor Blue
Write-Host "║                                                              ║" -ForegroundColor Cyan
Write-Host "║  DEPLOY:                                                     ║" -ForegroundColor Cyan
Write-Host "║    .\scripts\powershell\pre-deploy.ps1     → Pre-deployment checks     ║" -ForegroundColor Red
Write-Host "║                                                              ║" -ForegroundColor Cyan
Write-Host "║  DEV VAULT:                                                  ║" -ForegroundColor Cyan
Write-Host "║    .\scripts\powershell\vault.ps1 stats    → Dev Vault statistics      ║" -ForegroundColor White
Write-Host "║    .\scripts\powershell\vault.ps1 gaps     → Show priority gaps        ║" -ForegroundColor White
Write-Host "║                                                              ║" -ForegroundColor Cyan
Write-Host "╚══════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""
