#!/usr/bin/env python3
"""
VISUAL CORRUPTION FIXER - Fixes all visual formatting issues
"""
import re
import sys
from pathlib import Path

def fix_visual_corruption(file_path: Path) -> int:
    """Fix all visual corruption issues."""
    with open(file_path, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    
    fixes = 0
    
    for i, line in enumerate(lines):
        original = line
        
        # Fix excessive indentation (normalize to max 8 spaces for code blocks)
        if line.startswith(' ' * 10):
            # Count leading spaces
            leading_spaces = len(line) - len(line.lstrip())
            # Normalize to reasonable indentation (max 8 spaces, or 2 levels)
            if leading_spaces > 8:
                new_indent = min(8, (leading_spaces // 4) * 4)  # Round to nearest 4
                line = ' ' * new_indent + line.lstrip()
        
        # Fix unusual spacing patterns (5+ consecutive spaces in middle of line)
        # But preserve code blocks and intentional formatting
        if not line.strip().startswith('```'):
            # Replace 5+ spaces with 2 spaces (except at start of line)
            parts = line.split(None, 1)  # Split on first whitespace
            if len(parts) == 2:
                # Fix spacing in the content part
                content = parts[1]
                content = re.sub(r' {5,}', '  ', content)
                line = parts[0] + ' ' + content
        
        # Fix mixed tabs and spaces
        if '\t' in line:
            line = line.replace('\t', '    ')
        
        # Fix empty list items
        if re.match(r'^\s*[-*+]\s*$', line):
            line = ''
        
        if line != original:
            lines[i] = line
            fixes += 1
    
    if fixes > 0:
        with open(file_path, 'w', encoding='utf-8', newline='\n') as f:
            f.writelines(lines)
    
    return fixes

def main():
    if len(sys.argv) < 2:
        print("Usage: python visual_corruption_fixer.py <file_or_directory>")
        sys.exit(1)
    
    path = Path(sys.argv[1])
    
    if path.is_file():
        files = [path]
    else:
        files = list(path.rglob('*.md'))
    
    print(f"VISUAL CORRUPTION FIXER")
    print(f"{'='*80}\n")
    
    total_fixes = 0
    
    for file_path in files:
        fixes = fix_visual_corruption(file_path)
        if fixes > 0:
            print(f"[FIXED] {file_path.name}: {fixes} visual issues")
            total_fixes += fixes
    
    print(f"\n{'='*80}")
    print(f"Total visual fixes: {total_fixes}")

if __name__ == '__main__':
    main()
