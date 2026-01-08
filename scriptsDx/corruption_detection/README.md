# Corruption Detection Scripts

This directory contains scripts for detecting and fixing file corruption in the Dev Vault.

## Scripts

### 1. `check_dev_vault_corruption.py`

**Purpose**: Quick corruption check for our Dev Vault  
**Usage**: `python scripts/corruption_detection/check_dev_vault_corruption.py`  
**Checks**:

- UTF-8 encoding validity
- Binary content (null bytes)
- Mojibake patterns
- Long lines (>1000 chars)

**Output**: Reports any issues found in markdown files

---

### 2. `jules_check_corruption.py` (Original Jules Script)

**Purpose**: Comprehensive file analysis  
**Usage**: Requires `DevVault/` directory in same location  
**Checks**:

- Encoding detection
- Binary content
- Long lines
- Suspicious patterns (stack traces, etc.)

**Note**: This is Jules' original script, preserved for reference

---

### 3. `jules_fix_corruption.py` (Original Jules Script)

**Purpose**: Automatically fix encoding issues using `ftfy`  
**Usage**: Requires `DevVault/` directory and `ftfy` library  
**Dependencies**: Install with `pip install -r requirements.txt`

**What it does**:

- Detects mojibake (garbled UTF-8)
- Fixes encoding using `ftfy` library
- Preserves original content structure

**Note**: This is Jules' original script, preserved for reference

---

### 4. `requirements.txt`

**Purpose**: Python dependencies for Jules' scripts  
**Contents**:

- `chardet` - Character encoding detection
- `ftfy` - Fixes text for you (mojibake repair)

**Installation**: `pip install -r scripts/corruption_detection/requirements.txt`

---

## Integration with Sentinel System

The lessons learned from Jules' scripts have been integrated into our Sentinel System:

- **`sentinel_integrity.py`** now includes mojibake detection
- **`verify_all.py`** runs comprehensive checks including encoding validation

---

## History

**Source**: Jules (Google AI) session `1255960803632361741_fix-devvault-corruption-1255960803632361741`  
**Date**: January 6, 2026  
**Issue Found**: Mojibake corruption in 11 Dev Vault files  
**Resolution**: Jules' fixes integrated, encoding now clean  
**Commit**: `451ab11` - "fix: resolve mojibake encoding corruption in 11 Dev Vault files"

---

## Quick Reference

**Check for corruption**:

```bash
python scripts/corruption_detection/check_dev_vault_corruption.py
```

**Run full Sentinel System**:

```bash
python verify_all.py
```

**Check specific directory with Jules' script**:

```bash
cd scripts/corruption_detection
python jules_check_corruption.py
```
