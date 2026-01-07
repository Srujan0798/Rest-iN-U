#!/usr/bin/env python3
"""
Jules Corruption Fixer
Fixes common encoding issues in markdown files.
(Standalone version - no external dependencies)
"""

import os
import sys
from pathlib import Path

# Accept command line argument for target directory
TARGET_DIR = sys.argv[1] if len(sys.argv) > 1 else "."

# Common encoding fixes (without ftfy)
REPLACEMENTS = {
    '\u00e2\u0080\u0099': "'",  # Right single quote
    '\u00e2\u0080\u009c': '"',  # Left double quote
    '\u00e2\u0080\u009d': '"',  # Right double quote
    '\u00e2\u0080\u0094': '—',  # Em dash
    '\u00e2\u0080\u0093': '–',  # En dash
    '\u00c2\u00a0': ' ',  # Non-breaking space
    '\u00ef\u00bb\u00bf': '',  # BOM
}

def fix_file(filepath):
    try:
        with open(filepath, 'rb') as f:
            raw_data = f.read()
        
        # Decode as utf-8
        try:
            content = raw_data.decode('utf-8')
        except UnicodeDecodeError:
            # If it fails, try to decode as latin-1
            content = raw_data.decode('latin-1')

        fixed_content = content
        
        # Apply common replacements
        for bad, good in REPLACEMENTS.items():
            fixed_content = fixed_content.replace(bad, good)
        
        # Check if it actually changed
        if content != fixed_content:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(fixed_content)
            return True, "Fixed encoding"
        
        return False, "No changes needed"

    except Exception as e:
        return False, f"Error: {e}"

def main():
    target = Path(TARGET_DIR)
    count_fixed = 0
    count_error = 0
    count_clean = 0
    
    if target.is_dir():
        files = list(target.rglob("*.md")) + list(target.rglob("*.txt"))
    else:
        files = [target] if target.suffix in ['.md', '.txt'] else []
    
    for filepath in files:
        print(f"Processing {filepath.name}...", end=" ")
        changed, msg = fix_file(str(filepath))
        print(f"[{'FIXED' if changed else 'OK'}] {msg}")
        
        if changed:
            count_fixed += 1
        elif "Error" in msg:
            count_error += 1
        else:
            count_clean += 1

    print(f"\nSummary: {count_fixed} fixed, {count_clean} clean, {count_error} errors.")

if __name__ == "__main__":
    main()
