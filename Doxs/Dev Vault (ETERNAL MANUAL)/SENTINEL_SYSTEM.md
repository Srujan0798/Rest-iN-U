# THE SENTINEL SYSTEM (THE LOCK)

## Table of Contents

- [Table of Contents](#table-of-contents)
- [1. What is it?](#1-what-is-it)
- [2. The Scripts (Tools)](#2-the-scripts-tools)
  - [🛡️ 1. `sentinel_format.py`(The Cleaner)](#-1-sentinelformatpythe-cleaner)
  - [🏗️ 2.`sentinel_structure.py`(The Architect)](#-2sentinelstructurepythe-architect)
  - [🧬 3. `sentinel_integrity.py`(The Doctor)](#-3-sentinelintegritypythe-doctor)
  - [🔑 4. `verify_all.py`(The Master Key)](#-4-verifyallpythe-master-key)
- [3. How to Use](#3-how-to-use)
  - [Option A: One-Click Check (Recommended)](#option-a-one-click-check-recommended)
  - [Option B: Manual Check](#option-b-manual-check)
  - [Option C: Fix Issues](#option-c-fix-issues)
- [4. Why this exists](#4-why-this-exists)

## 1. What is it?

The Sentinel System is a suite of 4 Python scripts designed to **lock down**the documentation and prevent corruption (like the "nonsense" gaps) from ever returning.

## 2. The Scripts (Tools)

### 🛡️ 1. `sentinel_format.py`(The Cleaner)

-**What it does**: Checks for formatting corruption.

- **Detects**:
- "Nonsense" gaps (repeated`---`separators).
- Excessive blank lines (more than 2).
- Trailing whitespace.
- **Fix Mode**: Can automatically collapse gaps and clean files.

### 🏗️ 2.`sentinel_structure.py`(The Architect)

- **What it does**: Enforces document structure.
- **Detects**:
- Multiple H1 headers (files should only have one`# Title`).
- Incorrect nesting.
- **Fix Mode**: Downgrades extra H1s to H2s.

### 🧬 3. `sentinel_integrity.py`(The Doctor)

- **What it does**: Checks for file corruption.
- **Detects**:
- Null bytes (binary corruption).
- Mojibake (encoding errors like``).
- Non-UTF-8 encoding.

### 🔑 4. `verify_all.py`(The Master Key)

- **What it does**: Runs ALL the above scripts in sequence.
- **Speed**: Scans the entire Dev Vault in < 2 seconds.

## 3. How to Use

### Option A: One-Click Check (Recommended)

Run the convenience script in the root folder:

python check_dev_vault.py

### Option B: Manual Check

Run the master script on any folder:

python verify_all.py "path/to/folder"

### Option C: Fix Issues

If issues are found, run with`--fix` to auto-repair:

python verify_all.py "path/to/folder" --fix

## 4. Why this exists

To ensure that **ONE DEVELOPER + AI** can manage 1,000,000 lines of documentation without it falling apart. This system automates the quality control that a human team would normally do.
