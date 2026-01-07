#!/usr/bin/env python3
"""
ULTRA TABLE FIXER - Fixes ALL table issues aggressively
"""
import re
import sys
from pathlib import Path

def fix_table_ultra_aggressive(file_path: Path) -> int:
    """Ultra-aggressive table fixing."""
    with open(file_path, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    
    fixes = 0
    i = 0
    
    while i < len(lines):
        line = lines[i]
        
        # If line contains pipe, it's potentially a table
        if '|' in line:
            stripped = line.strip()
            
            # Skip empty lines
            if not stripped:
                i += 1
                continue
            
            # Skip separator rows (they're fine)
            if re.match(r'^\|[\s\-:|]+\|$', stripped):
                i += 1
                continue
            
            # Fix the table row
            # Split by pipe
            parts = stripped.split('|')
            
            # Remove empty first/last if they exist
            if parts and parts[0].strip() == '':
                parts = parts[1:]
            if parts and parts[-1].strip() == '':
                parts = parts[:-1]
            
            # Rebuild with proper spacing
            if parts:
                new_line = '| ' + ' | '.join(part.strip() for part in parts) + ' |\n'
                
                if new_line != line:
                    lines[i] = new_line
                    fixes += 1
        
        i += 1
    
    if fixes > 0:
        with open(file_path, 'w', encoding='utf-8', newline='\n') as f:
            f.writelines(lines)
    
    return fixes

def main():
    if len(sys.argv) < 2:
        print("Usage: python ultra_table_fixer.py <directory>")
        sys.exit(1)
    
    dir_path = Path(sys.argv[1])
    md_files = sorted(list(dir_path.rglob('*.md')))
    
    print(f"ULTRA TABLE FIXER")
    print(f"{'='*80}\n")
    
    total_fixes = 0
    for file_path in md_files:
        fixes = fix_table_ultra_aggressive(file_path)
        if fixes > 0:
            print(f"[FIXED] {file_path.name}: {fixes} issues")
            total_fixes += fixes
    
    print(f"\n{'='*80}")
    print(f"Total fixes: {total_fixes}")

if __name__ == '__main__':
    main()
