# Deep Implementation Plan: docs

## Goal

Establish a **Single Source of Truth** for project documentation, eliminating the current "Split Brain" scenario between `docs` and `Doxs`.

## Phase 1: Conflict Resolution (CRITICAL)

**Objective**: Resolve the ambiguity between `docs/` and `Doxs/`.

### Review Status (VERIFIED)

- **docs/**: Contains `Dev Vault (ETERNAL MANUAL)` with limited content (User is currently editing here).
- **Doxs/**: Contains `Dev Vault (ETERNAL MANUAL)` with ~49 items (Appears to be the Master).
- **Risk**: High risk of data loss if changes are made in `docs` while `Doxs` is the intended master.

### Action

- **IMMEDIATE**: Compare `docs` and `Doxs` content.
- Merge any recent changes from `docs` into `Doxs`.
- **Recommendation**: Designate **ONE** folder as the master (likely `Doxs` renamed to `docs` after cleanup) and delete the other.

## Phase 2: Consolidation

**Objective**: Centralize all documentation into the verified Master Vault.

### Review Content

- `API.md`, `DEPLOYMENT.md`: Currently in root of `docs/`.
- `Dev Vault`: Currently nested.

### Action

- Move standalone files (`API.md`, etc.) into the Dev Vault structure (e.g., `02_Backend.md` or `05_Deployment.md`).
- Ensure `scriptsDx` (the maintenance suite) targets the correct Master Vault path.

## Phase 3: Protection

**Objective**: Prevent future fragmentation.

### Review Safeguards

- **Gitignore**: Ensure duplicate folders are not tracked.
- **Read-Only**: Mark the Master Vault as read-only for automated tools to prevent accidental overwrites.

### Action

- Run `protect_md_files.ps1` on the Master Vault.
- **Recommendation**: Add a `README.md` in the root of the repo pointing clearly to the Master Vault.
