# Deep Implementation Plan: Scripts

## Goal

Maintain a robust, reliable suite of automation tools that streamline the development lifecycle and ensure project quality.

## Phase 1: Environment Verification

**Objective**: Ensure all scripts run correctly in the local environment.

### Review Environment (VERIFIED)

- **PowerShell**: Primary scripting language (`.ps1`).
- **Python**: Used for complex logic (`cleanup_project.py`).
- **Shell**: Some `.sh` files exist (`verify-all.sh`), likely for CI or Linux environments.

### Action

- **Test**: Run `.\scripts\check.ps1` to verify the health check script.
- **Test**: Run `python scripts/cleanup_project.py --dry-run` to verify the cleanup script.
- **Recommendation**: Ensure `ExecutionPolicy` allows running scripts on Windows (`Set-ExecutionPolicy RemoteSigned`).

## Phase 2: Standardization

**Objective**: Ensure consistency across all scripts.

### Review Code

- **Naming**: Kebab-case (`dev-start.ps1`) vs. snake_case (`cleanup_project.py`).
- **Logging**: Verify if all scripts use consistent logging/output formats.

### Action

- **Refactor**: Standardize on kebab-case for CLI scripts (e.g., rename `cleanup_project.py` to `cleanup-project.py` or wrap it in `cleanup.ps1`).
- **Error Handling**: Add `try-catch` blocks to all PowerShell scripts to fail gracefully.

## Phase 3: Integration Testing

**Objective**: Verify scripts interact correctly with other components.

### Review Interactions

- `db.ps1`: Interacts with Docker/Prisma.
- `push.ps1`: Interacts with Git.

### Action

- **Dry Run**: Add a `-WhatIf` or `-DryRun` flag to destructive scripts (`db.ps1 reset`).
- **CI/CD**: Ensure these scripts are called by GitHub Actions (e.g., `ci.yml` calls `check.ps1`).

## Phase 4: Documentation & Usage

**Objective**: Make scripts easy to discover and use.

### Review Docs

- `README.md`: Good overview.
- `menu.ps1`: Excellent "Command Center" concept.

### Action

- **Help**: Ensure every script supports `-Help` to print usage instructions.
- **Alias**: Create a `profile.ps1` snippet to alias `menu.ps1` to `rin` (Rest-iN-U) for quick access.
