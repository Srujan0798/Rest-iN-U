# Scripts Directory

This directory contains **project infrastructure and automation scripts** for the Rest-iN-U application.

> [!IMPORTANT]
> **For Dev Vault verification scripts**, see [`scriptsDx/`](../scriptsDx/README.md)

## 📁 Directory Structure

```
scripts/
├── powershell/              # PowerShell automation scripts
├── audit/                   # Project code auditing
│   └── analyze_duplicates.py
├── core/                    # Core project utilities
│   ├── analyze_structure.py
│   └── run_all_fixers.py
├── utils/                   # Utility scripts
├── sentinel/                # Dev Vault sentinel (legacy location)
├── cleanup_project.py       # Project cleanup for presentation
├── matrix_test.py          # Matrix testing
├── *.ps1                   # PowerShell scripts
└── *.sh                    # Shell scripts
```

---

## 🔧 Available Scripts

### Project Infrastructure

#### `cleanup_project.py`

**Purpose**: Comprehensive project cleanup for university presentation  
**Usage**: `python scripts/cleanup_project.py`  
**Output**: `CLEANUP_REPORT.md`

**What it does**:

- Finds outdated files (not modified in 6 months)
- Identifies unnecessary files (temp, cache, duplicates)
- Validates documentation completeness
- Checks code quality issues
- Generates comprehensive cleanup report

#### PowerShell Scripts

- `check.ps1` - Project health check
- `db.ps1` - Database management
- `dev-start.ps1` - Start development environment
- `dev-stop.ps1` - Stop development environment
- `health.ps1` - Health monitoring
- `menu.ps1` - Interactive menu
- `pre-deploy.ps1` - Pre-deployment checks
- `push.ps1` - Git push automation
- `vault.ps1` - Vault management
- `verify-all.ps1` - Verify all project components

### Project Auditing

#### `audit/analyze_duplicates.py`

**Purpose**: Analyze duplicate code in the project  
**Usage**: `python scripts/audit/analyze_duplicates.py`

---

## 🎯 Philosophy

**These scripts are for PROJECT INFRASTRUCTURE, not Dev Vault!**

- ✅ Deployment automation
- ✅ Development environment management
- ✅ Project health monitoring
- ✅ Code quality checks
- ❌ NOT for Dev Vault verification (use `scriptsDx/` instead)

---

## 🚀 Quick Commands

**Project health check**:

```powershell
.\scripts\check.ps1
```

**Start development environment**:

```powershell
.\scripts\dev-start.ps1
```

**Run project cleanup**:

```bash
python scripts/cleanup_project.py
```

**Verify all components**:

```powershell
.\scripts\verify-all.ps1
```

---

## 📚 Related Documentation

- **Dev Vault Scripts**: See [`scriptsDx/README.md`](../scriptsDx/README.md)
- **PowerShell Scripts**: See [`scripts/powershell/`](./powershell/)
- **Sentinel System**: See [`scriptsDx/sentinel/`](../scriptsDx/sentinel/)
