# REST-iN-U AUTOMATION & UTILITIES GUIDE

> **How to 10x your development efficiency with automation**
> Created by your AI partner - proactive suggestions for the entire project

---

## PROJECT STRUCTURE DETECTED

```
Rest-iN-U/
backend/         Node.js/Express/Prisma
frontend/        React/Next.js
mobile/          React Native
blockchain/      Smart contracts
ml-models/       Machine learning
iot-system/      IoT components
infrastructure/  Terraform/IaC
Doxs/            Documentation (Dev Vault here!)
@ Ultra DeX/     Planning documents

```
---

## RECOMMENDED UTILITIES BY AREA

### 1. DEV VAULT (Already Created

**File:** `Doxs/Dev Vault (ETERNAL MANUAL)/vault-utils.ps1`

* Stats, gap analysis, header checks, search

---

### 2. PROJECT-WIDE HEALTH CHECK (NEW)

**Purpose:** One command to check entire project health

```powershell

# Save as: scripts/project-health.ps1

# Check if all services compile/build

Write-Host "=== PROJECT HEALTH CHECK ===" -ForegroundColor Cyan

# Frontend

Write-Host Frontend..." -ForegroundColor Yellow
Set-Location frontend
npm run build 2>&1 | Select-Object -Last 5

# Backend

Write-Host Backend..." -ForegroundColor Yellow
Set-Location ../backend
npm run build 2>&1 | Select-Object -Last 5

# Check for outdated packages

Write-Host Outdated Packages..." -ForegroundColor Yellow
npm outdated

```
---

### 3. CODE QUALITY AUTOMATOR (NEW)

**Purpose:** Run all linters/formatters in one command

```powershell

# Save as: scripts/quality-check.ps1

Write-Host "=== CODE QUALITY CHECK ===" -ForegroundColor Cyan

# ESLint

Write-Host ESLint..." -ForegroundColor Yellow
npx eslint . --ext .ts,.tsx --max-warnings 0

# TypeScript

Write-Host TypeScript..." -ForegroundColor Yellow
npx tsc --noEmit

# Prettier

Write-Host Prettier..." -ForegroundColor Yellow
npx prettier --check "**/*.{ts,tsx,json,md}"

```
---

### 4. DATABASE UTILITIES (NEW)

**Purpose:** Common database operations

```powershell

# Save as: scripts/db-utils.ps1

param([string]$Action = "status")

switch ($Action) {
    "status" {
        docker-compose ps
    }
    "reset" {
        Write-Host "Resetting database..." -ForegroundColor Yellow
        Set-Location backend
        npx prisma migrate reset --force
    }
    "seed" {
        Write-Host "Seeding database..." -ForegroundColor Yellow
        Set-Location backend
        npx prisma db seed
    }
    "studio" {
        Write-Host "Opening Prisma Studio..." -ForegroundColor Yellow
        Set-Location backend
        npx prisma studio
    }
}

```
---

### 5. DEVELOPMENT STARTER (NEW)

**Purpose:** Start all services in one command

```powershell

# Save as: scripts/dev-start.ps1

Write-Host "=== STARTING DEVELOPMENT ENVIRONMENT ===" -ForegroundColor Cyan

# Start Docker services

Write-Host Docker services..." -ForegroundColor Yellow
docker-compose up -d

# Wait for services

Start-Sleep -Seconds 5

# Start backend (in new terminal)

Write-Host Backend..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend; npm run dev"

# Start frontend (in new terminal)

Write-Host Frontend..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd frontend; npm run dev"

Write-Host All services started!" -ForegroundColor Green

```
---

### 6. GIT WORKFLOW AUTOMATOR (NEW)

**Purpose:** Smart commit and push

```powershell

# Save as: scripts/git-push.ps1

param(
    [string]$Message = "Update",
    [switch]$Quick
)

Write-Host "=== GIT WORKFLOW ===" -ForegroundColor Cyan

# Show status

git status --short

if (-not $Quick) {

# Run tests first
    Write-Host Running tests..." -ForegroundColor Yellow
    npm test
    if ($LASTEXITCODE -ne 0) {
        Write-Host Tests failed! Aborting." -ForegroundColor Red
        exit 1
    }
}

# Add, commit, push

git add -A
git commit -m $Message
git push

Write-Host Pushed successfully!" -ForegroundColor Green

```
---

### 7. DOCUMENTATION GENERATOR (NEW)

**Purpose:** Auto-generate docs from code

```powershell

# Save as: scripts/gen-docs.ps1

Write-Host "=== GENERATING DOCUMENTATION ===" -ForegroundColor Cyan

# API docs from comments

Write-Host API Documentation..." -ForegroundColor Yellow
Set-Location backend
npx typedoc --out ../Doxs/api-docs src/

# Component docs

Write-Host Component Documentation..." -ForegroundColor Yellow
Set-Location ../frontend
npx storybook build -o ../Doxs/storybook-docs

```
---

### 8. DEPLOYMENT CHECKER (NEW)

**Purpose:** Pre-deployment validation

```powershell

# Save as: scripts/pre-deploy.ps1

Write-Host "=== PRE-DEPLOYMENT CHECKLIST ===" -ForegroundColor Cyan

$passed = $true

# 1. All tests pass

Write-Host Running tests..." -ForegroundColor Yellow
npm test
if ($LASTEXITCODE -ne 0) { $passed = $false }

# 2. No TypeScript errors

Write-Host TypeScript check..." -ForegroundColor Yellow
npx tsc --noEmit
if ($LASTEXITCODE -ne 0) { $passed = $false }

# 3. No lint errors

Write-Host Lint check..." -ForegroundColor Yellow
npx eslint . --max-warnings 0
if ($LASTEXITCODE -ne 0) { $passed = $false }

# 4. Build succeeds

Write-Host Build check..." -ForegroundColor Yellow
npm run build
if ($LASTEXITCODE -ne 0) { $passed = $false }

if ($passed) {
    Write-Host READY FOR DEPLOYMENT!" -ForegroundColor Green
} else {
    Write-Host FIX ISSUES BEFORE DEPLOYING!" -ForegroundColor Red
}

```
---

## RECOMMENDED FOLDER STRUCTURE

```
Rest-iN-U/
scripts/                    NEW: All automation scripts
  project-health.ps1
  quality-check.ps1
  db-utils.ps1
  dev-start.ps1
  git-push.ps1
  gen-docs.ps1
  pre-deploy.ps1
.github/
  workflows/              CI/CD automation
Doxs/
  Dev Vault (ETERNAL MANUAL)/
      vault-utils.ps1     Already exists

```
---

## USAGE EXAMPLES

```powershell

# One command to start everything

.\scripts\dev-start.ps1

# Check project health

.\scripts\project-health.ps1

# Quick push without tests

.\scripts\git-push.ps1 -Message "feat: add login" -Quick

# Reset and seed database

.\scripts\db-utils.ps1 -Action reset
.\scripts\db-utils.ps1 -Action seed

# Pre-deployment validation

.\scripts\pre-deploy.ps1

```
---

## X EFFICIENCY

```

                 YOUR NEW WORKFLOW

 1. SCRIPT handles repetitive tasks
    (build, test, lint, deploy, database)

 2. AI (me) handles creative/complex tasks
    (architecture, debugging, new features)

 3. DEV VAULT provides knowledge
    (patterns, solutions, tribal knowledge)

 RESULT: You operate at 10x speed

```
---

## PROACTIVE SUGGESTIONS I SHOULD HAVE MADE EARLIER

1. **Always use scripts** for repetitive commands
2. **Create aliases** in PowerShell profile for common tasks
3. **Use .env files** properly with validation
4. **Set up git hooks** for pre-commit checks
5. **Document everything** in the Dev Vault as we go
6. **Ask ME** when stuck - I'm here as equal partner

---

## NEXT STEPS

Would you like me to:

1. **Create ALL these scripts** in a `scripts/` folder?
2. **Set up git hooks** for automatic quality checks?
3. **Create a master command** that shows all available scripts?
4. **Add more utilities** specific to your workflow?

---

*Your AI partner - Always here to suggest better approaches*
*Last Updated: December 2024*
