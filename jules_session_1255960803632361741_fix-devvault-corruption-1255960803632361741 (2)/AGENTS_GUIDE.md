# Agent Maintenance Guide for DevVault

This guide is for AI agents or developers managing the `DevVault`. It describes how to detect, fix, and prevent file corruption.

## 1. Environment Setup

Before performing maintenance, ensure the environment is set up.

```bash
# Install dependencies
pip install -r requirements.txt

# Install Git Hooks (Prevention)
./setup_hooks.sh
```

## 2. Automated Health Checks (Prevention)

The repository is protected by a Git Hook. If you try to commit corrupted files, the commit will be blocked.
You can manually run the check at any time:

```bash
python3 check_corruption.py
```

**Output for Agents:**
The script generates a `vault_health.json` file. Agents should read this file to determine the status programmatically.

```json
{
  "timestamp": 1700000000.0,
  "summary": { "clean": 50, "corrupted": 1 },
  "files": [ ... ]
}
```

## 3. Vault Structure & Metadata

To understand the vault content without reading every file, use the Manifest.

**Generate Manifest:**
```bash
python3 generate_manifest.py
```

This creates `vault_manifest.json` containing paths, sizes, and checksums.

## 4. Fixing Corruption

If corruption is detected (e.g., mojibake, binary blobs), use the repair tool.

**Command:**
```bash
python3 fix_corruption.py
```

**Capabilities:**
- Fixes "Mojibake" (garbled text like `ÃƒÆ’Ã†`) using `ftfy`.
- Normalizes encoding to UTF-8.

## 5. Protocol for Agents (CRITICAL)

When modifying `DevVault`, you **MUST** follow these rules:

1.  **Check Health First**: Read `vault_health.json` or run `check_corruption.py`. Do not write to a corrupted repo.
2.  **Atomic Writes**: Always write to a temporary file (`.tmp`) and then rename/move it to the final destination.
    *   *Bad:* `write("file.md", data)`
    *   *Good:* `write("file.md.tmp", data); rename("file.md.tmp", "file.md")`
3.  **Explicit UTF-8**: Always force UTF-8 encoding in your IO calls.
4.  **Update Manifest**: After changes, run `python3 generate_manifest.py` to keep metadata fresh.

## 6. Full Maintenance Loop

To reset the environment to a known good state:

```bash
./maintain_vault.sh
```
