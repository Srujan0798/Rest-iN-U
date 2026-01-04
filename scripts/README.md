# Titan Script Arsenal

This directory contains the tools used to maintain, audit, and perfect the Dev Vault.

## Directory Structure

### 1. `scripts/audit/` (Analysis)

Tools that scan the vault for quality and structural integrity.

- `quality_audit.py`: Scans for "Titan Indicators" and "Weak Indicators".
- `structure_audit.py`: Checks for header hierarchy and TOCs.
- `smart_audit.py`: NLP-like content analysis.
- `deep_audit.py`: Intensive structural scan.

### 2. `scripts/fixers/` (Repair)

Tools that automatically repair specific issues.

- `auto_toc.py`: Generates Table of Contents.
- `fix_hierarchy.py`: Fixes collapsing structure (H2/H3).
- `fix_md*.py`: Targeted fixes for specific markdown lint errors.

### 3. `scripts/core/` (Engine)

The heavy lifters and orchestration tools.

- `titan_lint_engine.py`: Master linting engine.
- `titan_cleaner.py`: Removes backups and artifacts.
- `run_all_fixers.py`: Orchestrates all fixer scripts.
- `enhance_vault.py`: Content injection utility.

### 4. `scripts/powershell/` (Control)

Windows-native control scripts. Run these from the project root.

- `menu.ps1`: **Master Control Panel**. Run `./scripts/powershell/menu.ps1`.
- `check.ps1`: Run quality checks.
- `health.ps1`: Project health check.
- `vault.ps1`: Vault management.

### 5. `scripts/utils/` (Helpers)

Small utility scripts.

- `check_header_tree.py`: Visualizes header hierarchy.

## Usage

Run the master menu from the project root:

```powershell
./scripts/powershell/menu.ps1
```
