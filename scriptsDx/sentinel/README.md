# Sentinel System

The Sentinel System is our automated file verification and protection system for the Dev Vault.

## 🛡️ What is The Sentinel System?

The Sentinel System (aka "The Lock") is a comprehensive verification protocol that ensures the integrity, structure, and formatting of all markdown files in the Dev Vault.

## 📁 Scripts

### Core Verification Scripts

1. **`sentinel_format.py`**
   - Checks formatting rules (gaps, separators, whitespace)
   - Ensures single newline at end of files
   - Detects excessive blank lines
   - Verifies proper horizontal rule usage

2. **`sentinel_structure.py`**
   - Enforces header hierarchy
   - Ensures single H1 per file
   - Validates proper heading structure

3. **`sentinel_integrity.py`**
   - Detects null bytes (binary corruption)
   - Checks for mojibake patterns (encoding issues)
   - Validates UTF-8 encoding
   - **Enhanced with Jules' mojibake detection** ⭐

4. **`verify_all.py`**
   - Master script that runs all Sentinel checks
   - Provides comprehensive verification report
   - Quick one-command verification

5. **`check_dev_vault.py`**
   - Convenience script for quick Dev Vault checks
   - Runs verify_all.py on the Dev Vault directory

## 🚀 Usage

### Quick Check

```bash
python scripts/sentinel/check_dev_vault.py
```

### Full Verification

```bash
python scripts/sentinel/verify_all.py
```

### Individual Checks

```bash
python scripts/sentinel/sentinel_format.py docs
python scripts/sentinel/sentinel_structure.py docs
python scripts/sentinel/sentinel_integrity.py docs
```

## 📊 What Gets Checked

### Format

- ✅ No excessive blank lines (max 1 blank line between sections)
- ✅ Proper horizontal rule usage
- ✅ No trailing whitespace
- ✅ Single newline at end of file

### Structure

- ✅ Single H1 header per file
- ✅ Proper header hierarchy (H1 → H2 → H3, no skipping)
- ✅ Consistent header formatting

### Integrity

- ✅ Valid UTF-8 encoding
- ✅ No null bytes (binary corruption)
- ✅ No mojibake patterns (garbled text)
- ✅ No replacement characters

## 🎯 Integration with Jules

The Sentinel System was enhanced after Jules (Google AI) identified mojibake corruption in our Dev Vault. We learned from Jules and added:

- Mojibake pattern detection (`Ã`, `â€`, `ðŸ`, `Â`)
- Enhanced encoding validation
- Comprehensive corruption reporting

See `scripts/corruption_detection/` for Jules' original tools.

## 📈 Performance

Typical verification time: **0.4-0.7 seconds** for entire Dev Vault (79 markdown files)

## 🔗 Related Tools

- **Corruption Detection**: `scripts/corruption_detection/`
- **File Comparison**: `scripts/compare_brain_files.py`
- **Jules Verification**: `scripts/verify_jules_complete.py`
