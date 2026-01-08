---
description: Emergency protection system for markdown files to prevent corruption
---

# EMERGENCY FILE PROTECTION PROTOCOL

# ROOT CAUSE IDENTIFIED

**CRITICAL ISSUE**: The `multi_replace_file_content` and `replace_file_content` tools are causing **SEVERE UTF-8 ENCODING CORRUPTION** in markdown files.

## Evidence

- `02_Backend.md` corrupted to 81MB (from normal size)
- File filled with garbled encoding like: `ÃƒÆ'Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢...`
- This is a **MULTI-BYTE UTF-8 ENCODING CASCADE FAILURE**
- Each edit operation re-encodes already encoded characters

# PERMANENT SOLUTION

## 1. **NEVER USE THESE TOOLS ON MARKDOWN FILES**

```
❌ BANNED TOOLS FOR .md FILES:
- multi_replace_file_content
- replace_file_content
```

## 2. **SAFE ALTERNATIVE WORKFLOW**

For ANY markdown file edit:

```powershell
# Step 1: Read current content
$content = Get-Content -Path "file.md" -Raw -Encoding UTF8

# Step 2: Make changes in PowerShell
$newContent = $content -replace "old", "new"

# Step 3: Write back with explicit UTF-8 encoding
$newContent | Out-File -FilePath "file.md" -Encoding UTF8 -NoNewline
```

## 3. **MANDATORY PRE-EDIT BACKUP**

Before ANY edit to Dev Vault files:

```powershell
# Create timestamped backup
$timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$backupDir = "Doxs\Dev Vault (ETERNAL MANUAL)\KNOWLEDGE\BACKUPS\$timestamp"
New-Item -ItemType Directory -Path $backupDir -Force
Copy-Item "Doxs\Dev Vault (ETERNAL MANUAL)\KNOWLEDGE\*.md" $backupDir -Force
```

## 4. **FILE INTEGRITY CHECK**

After ANY edit:

```powershell
# Check file size (should be reasonable, not 80MB+)
$file = Get-Item "file.md"
if ($file.Length -gt 10MB) {
    Write-Error "FILE CORRUPTED - Size: $($file.Length)"
    # Restore from backup
}

# Check for encoding corruption markers
$content = Get-Content "file.md" -Raw
if ($content -match "Ãƒ|â€™|Â¢") {
    Write-Error "ENCODING CORRUPTION DETECTED"
    # Restore from backup
}
```

# CLEANUP PROCEDURES

## Preventing Duplicate Files

After recovery operations, **always clean up duplicate files**:

```powershell
# turbo
# Navigate to KNOWLEDGE directory
cd "Doxs\Dev Vault (ETERNAL MANUAL)\KNOWLEDGE"

# Remove recovery duplicates (after verifying main file is correct)
Remove-Item "*_RECOVERED.md" -Force
Remove-Item "*_FROM_GIT.md" -Force
Remove-Item "CORRUPTED_BACKUP_*" -Recurse -Force
```

## File Management Rules

**KEEP ONLY:**

- Main file: `02_Backend.md`
- Primary backup: `BACKUP_BEFORE_TITAN_CLEAN/` directory

**DELETE AFTER RECOVERY:**

- `*_RECOVERED.md` files (once verified identical to main)
- `*_FROM_GIT.md` files (Git LFS pointers only)
- `CORRUPTED_BACKUP_*` directories (old corruption backups)

## Regular Cleanup Schedule

Run monthly to prevent clutter:

```powershell
# turbo
# List all backup directories
Get-ChildItem "Doxs\Dev Vault (ETERNAL MANUAL)\KNOWLEDGE" -Directory | 
    Where-Object { $_.Name -match "BACKUP|CORRUPTED" } |
    Select-Object Name, CreationTime, @{Name="Files";Expression={(Get-ChildItem $_.FullName).Count}}
```

# IMMEDIATE RECOVERY STEPS

## Step 1: Restore from Backup

```powershell
# turbo
Copy-Item "Doxs\Dev Vault (ETERNAL MANUAL)\KNOWLEDGE\BACKUP_BEFORE_TITAN_CLEAN\*.md" `
          "Doxs\Dev Vault (ETERNAL MANUAL)\KNOWLEDGE\" -Force
```

## Step 2: Verify Restoration

```powershell
# turbo
Get-ChildItem "Doxs\Dev Vault (ETERNAL MANUAL)\KNOWLEDGE\*.md" | 
    Where-Object { $_.Length -gt 10MB } |
    Select-Object Name, Length
```

## Step 3: Clean Up Duplicates

```powershell
# turbo
# After verifying main file is correct
Remove-Item "Doxs\Dev Vault (ETERNAL MANUAL)\KNOWLEDGE\*_RECOVERED.md" -Force -ErrorAction SilentlyContinue
Remove-Item "Doxs\Dev Vault (ETERNAL MANUAL)\KNOWLEDGE\*_FROM_GIT.md" -Force -ErrorAction SilentlyContinue
```

# WHY THIS HAPPENS

1. **Tool reads file** → Interprets UTF-8 as ASCII
2. **Tool processes** → Re-encodes UTF-8 bytes as UTF-8
3. **Tool writes back** → Double/triple/quadruple encoding
4. **Each edit** → Exponentially multiplies corruption
5. **Result** → 81MB of garbage

# PREVENTION RULES

## ✅ SAFE OPERATIONS

- Read files with PowerShell `Get-Content -Encoding UTF8`
- Edit with PowerShell string operations
- Write with `Out-File -Encoding UTF8 -NoNewline`
- Use `view_file` to inspect
- Use `grep_search` to search

## ❌ DANGEROUS OPERATIONS  

- `multi_replace_file_content` on .md files
- `replace_file_content` on .md files
- Any tool that doesn't explicitly handle UTF-8

# AGENT INSTRUCTION

**CRITICAL**: Before making ANY edit to markdown files in Dev Vault:

1. ✅ Create timestamped backup
2. ✅ Use PowerShell commands only
3. ✅ Verify file size after edit
4. ✅ Check for corruption markers
5. ❌ NEVER use replace_file_content tools
6. ✅ Clean up duplicates after recovery

# MONITORING

Set up continuous monitoring:

```powershell
# Run every hour
$files = Get-ChildItem "Doxs\Dev Vault (ETERNAL MANUAL)\KNOWLEDGE\*.md"
foreach ($file in $files) {
    if ($file.Length -gt 10MB) {
        Write-Warning "ALERT: $($file.Name) is $($file.Length) bytes - POSSIBLE CORRUPTION"
    }
}
```

# GIT LFS CONSIDERATIONS

If using Git LFS for large files:

1. **Verify LFS is installed**: `git lfs install`
2. **Check tracked files**: `git lfs ls-files`
3. **Pull LFS content**: `git lfs pull`
4. **Don't commit LFS pointer files** to main directory

---

**THIS IS NOT OPTIONAL - THIS IS MANDATORY TO PREVENT DATA LOSS**

**Last Updated**: January 5, 2026
**Cleanup Status**: ✅ Duplicates removed, single source of truth maintained
