# 🚨 MASTER ISSUE LIST: Rest-iN-U

This document aggregates all **CRITICAL ISSUES** identified during the Deep Dive.
Use this checklist to fix the environment on your laptop.

## 1. Environment (CRITICAL BLOCKERS)

- [ ] **Node.js**: ❌ **MISSING**.
  - *Impact*: Frontend, Backend, Mobile, Blockchain cannot run.
  - *Action*: Install Node.js 18+ (LTS).
- [ ] **Python Dependencies**: ❌ **MISSING**.
  - *Impact*: ML Models (Vastu/Jyotish) cannot run.
  - *Action*: Install `numpy`, `opencv-python`, `Pillow`, `tensorflow`.
- [ ] **Docker**: ❌ **MISSING**.
  - *Impact*: Database, Redis, Nginx cannot run.
  - *Action*: Install Docker Desktop for Windows.

## 2. Infrastructure & Configuration

- [ ] **Broken Paths**: `docker-compose.yml` points to `./docker/` (Missing).
  - *Location*: `infrastructure_DEEP_IMPLEMENTATION_PLAN.md`
  - *Action*: Update paths to point to `infrastructure/` OR move folders.
- [ ] **Mobile Config**: `app.json` has placeholder API Key.
  - *Location*: `mobile_DEEP_IMPLEMENTATION_PLAN.md`
  - *Action*: Add valid Google Maps API Key.
- [ ] **Git Attributes**: `.gitattributes` missing EOL enforcement.
  - *Location*: `root_config_DEEP_IMPLEMENTATION_PLAN.md`
  - *Action*: Add `* text=auto eol=lf`.

## 3. Documentation Strategy

- [ ] **Personal Folder**: `Doxs/` is for USER ONLY.
  - *Action*: Ensure it is added to `.gitignore` to prevent accidental commits. (DONE)
- [ ] **Project Docs**: `docs/` is for the public project.
  - *Action*: Maintain `docs/` as the source of truth for the repo.

## 4. Detailed Plans

For specific instructions, refer to the individual plans in `xnx.com/`:

- `backend_DEEP_IMPLEMENTATION_PLAN.md`
- `frontend_DEEP_IMPLEMENTATION_PLAN.md`
- `infrastructure_DEEP_IMPLEMENTATION_PLAN.md`
- ... (and all others)
