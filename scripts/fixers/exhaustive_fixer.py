#!/usr/bin/env python3
"""
EXHAUSTIVE FIXER - Fixes EVERY issue found by line-by-line validator
"""
import re
import sys
from pathlib import Path

def fix_file(file_path: Path) -> int:
    """Fix all issues in a file."""
    print(f"\n[FIXING] {file_path.name}")
    
    try:
        with open(file_path, 'r', encoding='utf-8', errors='replace') as f:
            content = f.read()
    except Exception as e:
        print(f"   [ERROR] Could not read file: {e}")
        return 0
    
    original_content = content
    fixes = 0
    
    # Fix 1: Remove BOM characters
    if '\ufeff' in content:
        content = content.replace('\ufeff', '')
        bom_count = original_content.count('\ufeff')
        fixes += bom_count
        print(f"   Removed {bom_count} BOM characters")
    
    # Fix 2: Remove invalid Unicode characters
    # Replace replacement character
    if '�' in content:
        content = content.replace('�', '')
        fixes += 1
        print(f"   Removed replacement characters")
    
    # Fix 3: Remove null bytes
    if '\x00' in content:
        content = content.replace('\x00', '')
        fixes += 1
        print(f"   Removed null bytes")
    
    # Fix 4: Remove trailing whitespace from each line
    lines = content.split('\n')
    new_lines = []
    trailing_fixes = 0
    
    for line in lines:
        # Remove trailing whitespace but keep line ending
        stripped = line.rstrip()
        if stripped != line.rstrip('\r\n'):
            trailing_fixes += 1
        new_lines.append(stripped)
    
    if trailing_fixes > 0:
        content = '\n'.join(new_lines)
        fixes += trailing_fixes
        print(f"   Removed trailing whitespace from {trailing_fixes} lines")
    
    # Fix 5: Replace tabs with spaces
    if '\t' in content:
        tab_count = content.count('\t')
        content = content.replace('\t', '    ')  # 4 spaces
        fixes += tab_count
        print(f"   Replaced {tab_count} tabs with spaces")
    
    # Only write if changes were made
    if content != original_content:
        try:
            with open(file_path, 'w', encoding='utf-8', newline='\n') as f:
                f.write(content)
            print(f"   [SUCCESS] Applied {fixes} fixes")
            return fixes
        except Exception as e:
            print(f"   [ERROR] Could not write file: {e}")
            return 0
    else:
        print(f"   [OK] No fixes needed")
        return 0

def main():
    if len(sys.argv) < 2:
        print("Usage: python exhaustive_fixer.py <directory>")
        sys.exit(1)
    
    dir_path = Path(sys.argv[1])
    
    if not dir_path.exists():
        print(f"Error: Directory {dir_path} does not exist")
        sys.exit(1)
    
    md_files = sorted(list(dir_path.rglob('*.md')))
    
    print(f"\n{'='*80}")
    print(f"EXHAUSTIVE FIXER")
    print(f"{'='*80}")
    print(f"\nDirectory: {dir_path}")
    print(f"Total files: {len(md_files)}")
    
    total_fixes = 0
    files_fixed = 0
    
    for file_path in md_files:
        fixes = fix_file(file_path)
        if fixes > 0:
            files_fixed += 1
            total_fixes += fixes
    
    print(f"\n{'='*80}")
    print(f"FIXING COMPLETE")
    print(f"{'='*80}")
    print(f"\nFiles processed: {len(md_files)}")
    print(f"Files fixed: {files_fixed}")
    print(f"Total fixes applied: {total_fixes}")

if __name__ == '__main__':
    main()
