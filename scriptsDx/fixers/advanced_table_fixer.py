#!/usr/bin/env python3
"""
Advanced Table Fixer - Fixes ALL malformed table issues
"""
import re
import sys
from pathlib import Path

def fix_malformed_tables(file_path: Path) -> int:
    """Fix all malformed tables in a file."""
    print(f"\n[FIXING] {file_path.name}")
    
    with open(file_path, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    
    fixes = 0
    in_table = False
    table_start = 0
    
    i = 0
    while i < len(lines):
        line = lines[i]
        
        # Detect table start
        if '|' in line and not in_table:
            in_table = True
            table_start = i
        elif in_table and '|' not in line and line.strip() != '':
            in_table = False
        
        # Fix malformed table rows
        if in_table and '|' in line:
            stripped = line.strip()
            
            # Skip separator rows
            if re.match(r'^\|[\s\-:|]+\|$', stripped):
                i += 1
                continue
            
            # Count pipes
            pipe_count = stripped.count('|')
            
            # If insufficient pipes, try to fix
            if pipe_count < 2:
                # Add missing pipes
                if not stripped.startswith('|'):
                    lines[i] = '| ' + stripped + '\n'
                    fixes += 1
                elif not stripped.endswith('|'):
                    lines[i] = stripped + ' |\n'
                    fixes += 1
            else:
                # Ensure proper spacing around pipes
                # Remove extra spaces
                fixed = re.sub(r'\s*\|\s*', ' | ', stripped)
                fixed = fixed.strip()
                
                # Ensure starts and ends with pipe
                if not fixed.startswith('|'):
                    fixed = '| ' + fixed
                if not fixed.endswith('|'):
                    fixed = fixed + ' |'
                
                if fixed != stripped:
                    lines[i] = fixed + '\n'
                    fixes += 1
        
        i += 1
    
    if fixes > 0:
        with open(file_path, 'w', encoding='utf-8', newline='\n') as f:
            f.writelines(lines)
        print(f"   Fixed {fixes} table issues")
    else:
        print(f"   No table issues found")
    
    return fixes

def main():
    if len(sys.argv) < 2:
        print("Usage: python advanced_table_fixer.py <directory>")
        sys.exit(1)
    
    dir_path = Path(sys.argv[1])
    md_files = sorted(list(dir_path.rglob('*.md')))
    
    print(f"\n{'='*80}")
    print(f"ADVANCED TABLE FIXER")
    print(f"{'='*80}")
    print(f"\nTotal files: {len(md_files)}")
    
    total_fixes = 0
    for file_path in md_files:
        fixes = fix_malformed_tables(file_path)
        total_fixes += fixes
    
    print(f"\n{'='*80}")
    print(f"Total fixes: {total_fixes}")

if __name__ == '__main__':
    main()
