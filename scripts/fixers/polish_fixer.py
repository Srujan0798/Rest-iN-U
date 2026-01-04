#!/usr/bin/env python3
"""
Polish Fixer - Fixes remaining cosmetic issues
"""
import re
import sys
from pathlib import Path

def fix_list_indentation(file_path: Path) -> int:
    """Fix inconsistent list indentation to use 2 or 4 spaces."""
    with open(file_path, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    
    fixes = 0
    
    for i, line in enumerate(lines):
        # Check for list items
        if match := re.match(r'^(\s*)([-*+]|\d+\.)\s+', line):
            indent = len(match.group(1))
            
            # Fix odd indentation
            if indent % 2 != 0:
                # Round to nearest even number
                new_indent = (indent + 1) // 2 * 2
                new_line = ' ' * new_indent + line.lstrip()
                lines[i] = new_line
                fixes += 1
    
    if fixes > 0:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.writelines(lines)
    
    return fixes

def add_code_block_languages(file_path: Path) -> int:
    """Add language identifiers to code blocks."""
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
        lines = content.split('\n')
    
    fixes = 0
    
    for i, line in enumerate(lines):
        # Find code blocks without language
        if re.match(r'^```\s*$', line):
            # Look at next few lines to guess language
            language = 'text'  # Default
            
            # Check next 3 lines for hints
            for j in range(i+1, min(i+4, len(lines))):
                next_line = lines[j].strip()
                
                # JavaScript/TypeScript hints
                if any(keyword in next_line for keyword in ['const ', 'let ', 'var ', 'function ', 'import ', 'export ', '=>', 'interface ']):
                    language = 'typescript'
                    break
                # Python hints
                elif any(keyword in next_line for keyword in ['def ', 'class ', 'import ', 'from ', 'print(', '__init__']):
                    language = 'python'
                    break
                # SQL hints
                elif any(keyword in next_line.upper() for keyword in ['SELECT ', 'INSERT ', 'UPDATE ', 'DELETE ', 'CREATE TABLE']):
                    language = 'sql'
                    break
                # Bash hints
                elif any(keyword in next_line for keyword in ['#!/bin/', 'npm ', 'yarn ', 'docker ', 'kubectl ']):
                    language = 'bash'
                    break
                # YAML hints
                elif re.match(r'^[a-zA-Z_]+:', next_line):
                    language = 'yaml'
                    break
                # JSON hints
                elif next_line.startswith('{') or next_line.startswith('['):
                    language = 'json'
                    break
            
            lines[i] = f'```{language}'
            fixes += 1
    
    if fixes > 0:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write('\n'.join(lines))
    
    return fixes

def fix_remaining_tables(file_path: Path) -> int:
    """Fix remaining table alignment issues."""
    with open(file_path, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    
    fixes = 0
    in_table = False
    
    for i, line in enumerate(lines):
        # Detect table
        if '|' in line and not in_table:
            in_table = True
        elif in_table and '|' not in line and line.strip() != '':
            in_table = False
        
        if in_table and '|' in line:
            # Ensure spaces around pipes
            stripped = line.strip()
            
            # Skip separator rows
            if re.match(r'^\|[\s\-:|]+\|$', stripped):
                continue
            
            # Ensure line starts and ends with |
            if not stripped.startswith('|'):
                lines[i] = '| ' + stripped + '\n'
                fixes += 1
            elif not stripped.endswith('|'):
                lines[i] = stripped.rstrip() + ' |\n'
                fixes += 1
    
    if fixes > 0:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.writelines(lines)
    
    return fixes

def main():
    if len(sys.argv) < 2:
        print("Usage: python polish_fixer.py <file_or_directory>")
        sys.exit(1)
    
    path = Path(sys.argv[1])
    
    if path.is_file():
        files = [path]
    else:
        files = list(path.rglob('*.md'))
    
    print(f"[*] Polish Fixer - Final Touches")
    print(f"{'='*80}\n")
    
    total_fixes = 0
    
    for file in files:
        list_fixes = fix_list_indentation(file)
        code_fixes = add_code_block_languages(file)
        table_fixes = fix_remaining_tables(file)
        
        file_total = list_fixes + code_fixes + table_fixes
        
        if file_total > 0:
            print(f"[FILE] {file.name}")
            print(f"   Total fixes: {file_total}")
            print(f"   - List indentation: {list_fixes}")
            print(f"   - Code languages: {code_fixes}")
            print(f"   - Tables: {table_fixes}")
        
        total_fixes += file_total
    
    print(f"\n{'='*80}")
    print(f"[SUMMARY] Total polish fixes: {total_fixes}")

if __name__ == '__main__':
    main()
