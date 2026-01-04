#!/usr/bin/env python3
"""
Critical Issue Fixer - Fixes unclosed code blocks and malformed tables
"""
import re
import sys
from pathlib import Path

def fix_unclosed_code_blocks(file_path: Path) -> int:
    """Fix unclosed code blocks by adding closing fences."""
    with open(file_path, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    
    fixes = 0
    in_code_block = False
    code_start = 0
    
    i = 0
    while i < len(lines):
        line = lines[i]
        
        # Check for code fence
        if re.match(r'^```', line):
            if not in_code_block:
                in_code_block = True
                code_start = i
            else:
                in_code_block = False
        
        i += 1
    
    # If still in code block at end, add closing fence
    if in_code_block:
        lines.append('\n```\n')
        fixes += 1
        print(f"   Fixed unclosed code block at line {code_start + 1}")
    
    if fixes > 0:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.writelines(lines)
    
    return fixes

def fix_malformed_tables(file_path: Path) -> int:
    """Fix malformed tables by ensuring proper pipe alignment."""
    with open(file_path, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    
    fixes = 0
    
    for i, line in enumerate(lines):
        # Skip if not a table row
        if '|' not in line:
            continue
        
        # Skip separator rows
        if re.match(r'^\s*\|[\s\-:|]+\|\s*$', line):
            continue
        
        # Count pipes
        pipe_count = line.count('|')
        
        # If only 1 pipe, it's likely a malformed row
        if pipe_count == 1:
            # Try to fix by adding pipes at start/end
            stripped = line.strip()
            if not stripped.startswith('|'):
                lines[i] = '| ' + stripped + '\n'
                fixes += 1
            elif not stripped.endswith('|'):
                lines[i] = stripped + ' |\n'
                fixes += 1
    
    if fixes > 0:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.writelines(lines)
    
    return fixes

def fix_header_hierarchy(file_path: Path) -> int:
    """Fix header hierarchy by adjusting levels."""
    with open(file_path, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    
    fixes = 0
    prev_level = 0
    
    for i, line in enumerate(lines):
        if match := re.match(r'^(#{1,6})\s+(.+)', line):
            level = len(match.group(1))
            
            # If level jump is too large, adjust
            if level > prev_level + 1 and prev_level > 0:
                # Reduce to prev_level + 1
                new_level = prev_level + 1
                new_line = '#' * new_level + ' ' + match.group(2) + '\n'
                lines[i] = new_line
                fixes += 1
                level = new_level
            
            prev_level = level
    
    if fixes > 0:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.writelines(lines)
    
    return fixes

def main():
    if len(sys.argv) < 2:
        print("Usage: python critical_fixer.py <file_or_directory>")
        sys.exit(1)
    
    path = Path(sys.argv[1])
    
    if path.is_file():
        files = [path]
    else:
        files = list(path.rglob('*.md'))
    
    print(f"[*] Critical Issue Fixer")
    print(f"{'='*80}\n")
    
    total_fixes = 0
    
    for file in files:
        print(f"\n[FILE] {file.name}")
        
        code_fixes = fix_unclosed_code_blocks(file)
        table_fixes = fix_malformed_tables(file)
        hierarchy_fixes = fix_header_hierarchy(file)
        
        file_total = code_fixes + table_fixes + hierarchy_fixes
        
        if file_total > 0:
            print(f"   Total fixes: {file_total}")
            print(f"   - Code blocks: {code_fixes}")
            print(f"   - Tables: {table_fixes}")
            print(f"   - Hierarchy: {hierarchy_fixes}")
        else:
            print(f"   No critical issues found")
        
        total_fixes += file_total
    
    print(f"\n{'='*80}")
    print(f"[SUMMARY] Total fixes applied: {total_fixes}")

if __name__ == '__main__':
    main()
