# Deep Implementation Plan: Doxs (Master Vault)

## Goal

Formalize `Doxs` as the **Single Source of Truth** for all project knowledge, ensuring it is complete, structured, and ready to replace the fragmented `docs` folder.

## Phase 1: Master Vault Confirmation

**Objective**: Verify that `Doxs` contains the most up-to-date and complete information.

### Review Content (VERIFIED)

- **Structure**: ✅ Contains `BRAIN`, `KNOWLEDGE`, `01_DEV_VAULT_MISSION.md`.
- **Completeness**: ✅ ~49 items vs. `docs`'s ~5.
- **Scripts**: Contains `vault-utils.ps1` for maintenance.

### Action

- **Lock It Down**: Treat `Doxs` as the "Golden Copy".
- **Backup**: Create an immediate zip backup of `Doxs` before any merge operations.
- **Recommendation**: Use `scriptsDx` to run a full integrity check on `Doxs`.

## Phase 2: Structural Integrity

**Objective**: Ensure the internal hierarchy follows the "Universal Domain" standard.

### Review Hierarchy

- `KNOWLEDGE/`: Should contain domain-specific folders (e.g., `01_Frontend`, `02_Backend`).
- `BRAIN/`: Should contain active task tracking and logs.

### Action

- Audit `KNOWLEDGE` folder for loose files.
- Ensure every markdown file has a standard header (Title, Date, Author).
- **Recommendation**: Enforce a strict naming convention (e.g., `XX_Topic.md`).

## Phase 3: Migration & Renaming

**Objective**: Replace the stale `docs` folder with `Doxs`.

### Review Strategy

- **Current State**: `docs` is being used by the user but is stale. `Doxs` is fresh but has a non-standard name.

### Action

- **Step 1**: Delete the stale `docs` folder (after verifying no unique content exists).
- **Step 2**: Rename `Doxs` to `docs`.
- **Step 3**: Update all relative links in `README.md` and scripts.
- **Recommendation**: Perform this switch during a "Code Freeze" to avoid conflicts.
