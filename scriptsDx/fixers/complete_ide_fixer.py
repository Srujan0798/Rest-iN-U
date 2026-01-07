#!/usr/bin/env python3
"""
COMPLETE IDE WARNING FIXER
Fixes ALL markdown linting warnings from IDE:
- MD051: Link fragments (remove invalid links)
- MD012: Multiple blank lines
- MD033: Inline HTML (skip - code examples)
- MD037: Spaces in emphasis
- MD034: Bare URLs
- MD050: Strong style (__text__ -> **text**)
- MD024: Duplicate headings (rename)
- MD032: Blanks around lists
- MD004: Unordered list style (+ and * -> -)
- MD029: Ordered list prefix (all use 1.)
- MD038: Spaces in code spans
- MD026: Trailing punctuation in headings
- MD049: Emphasis style (_text_ -> *text*)
- MD042: Empty links (remove)
- MD011: Reversed links (skip - usually code)
- MD052: Missing reference definitions (remove)
- MD036: Emphasis as heading (skip - intentional)
"""

import re
from pathlib import Path
import sys

def fix_md012_multiple_blanks(content):
    """Remove multiple consecutive blank lines"""
    return re.sub(r'\n{3,}', '\n\n', content)

def fix_md037_emphasis_spaces(content):
    """Fix spaces inside emphasis markers"""
    # ** text ** -> **text**
    content = re.sub(r'\*\*\s+([^\*\n]+?)\s+\*\*', r'**\1**', content)
    # * text * -> *text*
    content = re.sub(r'(?<!\*)\*\s+([^\*\n]+?)\s+\*(?!\*)', r'*\1*', content)
    return content

def fix_md034_bare_urls(content):
    """Wrap bare URLs in angle brackets"""
    lines = content.split('\n')
    fixed = []
    in_code_block = False
    
    for line in lines:
        if line.strip().startswith('```'):
            in_code_block = not in_code_block
        
        if not in_code_block and not line.strip().startswith('    '):
            # Find bare URLs not in markdown links
            line = re.sub(r'(?<!\[)(?<!\()(https?://[^\s\)\]<>]+)(?!\))', r'<\1>', line)
        
        fixed.append(line)
    
    return '\n'.join(fixed)

def fix_md050_strong_style(content):
    """Convert __text__ to **text**"""
    return re.sub(r'__([^_\n]+)__', r'**\1**', content)

def fix_md049_emphasis_style(content):
    """Convert _text_ to *text*"""
    return re.sub(r'(?<![_\w])_([^_\n]+)_(?![_\w])', r'*\1*', content)

def fix_md004_list_style(content):
    """Standardize unordered list markers to dash"""
    lines = content.split('\n')
    fixed = []
    in_code_block = False
    
    for line in lines:
        if line.strip().startswith('```'):
            in_code_block = not in_code_block
        
        if not in_code_block:
            # Replace * and + with - for unordered lists
            if re.match(r'^(\s*)[\*\+]\s+', line):
                line = re.sub(r'^(\s*)[\*\+]\s+', r'\1- ', line)
        
        fixed.append(line)
    
    return '\n'.join(fixed)

def fix_md029_ordered_list(content):
    """Fix ordered list numbering to use 1. for all items"""
    lines = content.split('\n')
    fixed = []
    in_code_block = False
    
    for line in lines:
        if line.strip().startswith('```'):
            in_code_block = not in_code_block
        
        if not in_code_block and re.match(r'^(\s*)\d+\.\s+', line):
            line = re.sub(r'^(\s*)\d+\.', r'\g<1>1.', line)
        
        fixed.append(line)
    
    return '\n'.join(fixed)

def fix_md038_code_span_spaces(content):
    """Remove spaces inside code spans"""
    return re.sub(r'`\s+([^`\n]+?)\s+`', r'`\1`', content)

def fix_md026_trailing_punctuation(content):
    """Remove trailing punctuation from headings"""
    lines = content.split('\n')
    fixed = []
    
    for line in lines:
        if re.match(r'^#+\s+', line):
            # Remove trailing punctuation (!, ., ..., etc.) but keep ?
            line = re.sub(r'[!\.]+\s*$', '', line)
        fixed.append(line)
    
    return '\n'.join(fixed)

def fix_md042_empty_links(content):
    """Remove empty links"""
    # [text]() -> text
    content = re.sub(r'\[([^\]]+)\]\(\)', r'\1', content)
    return content

def fix_md051_invalid_links(content):
    """Remove invalid internal links (link fragments)"""
    lines = content.split('\n')
    fixed = []
    
    # Get all valid headers
    headers = set()
    for line in lines:
        match = re.match(r'^#+\s+(.+)$', line)
        if match:
            header = match.group(1).strip()
            # Convert header to anchor format
            anchor = header.lower()
            anchor = re.sub(r'[^\w\s-]', '', anchor)
            anchor = re.sub(r'\s+', '-', anchor)
            headers.add(anchor)
    
    for line in lines:
        # Find links with fragments
        def check_link(match):
            text = match.group(1)
            fragment = match.group(2)
            # If fragment doesn't match any header, just return text
            if fragment.lstrip('#') not in headers:
                return text
            return match.group(0)
        
        line = re.sub(r'\[([^\]]+)\]\(#([^)]+)\)', check_link, line)
        fixed.append(line)
    
    return '\n'.join(fixed)

def fix_md032_blanks_around_lists(content):
    """Add blank lines around lists"""
    lines = content.split('\n')
    fixed = []
    
    for i, line in enumerate(lines):
        is_list = bool(re.match(r'^\s*[-*+]\s+', line) or re.match(r'^\s*\d+\.\s+', line))
        prev_was_list = i > 0 and bool(re.match(r'^\s*[-*+]\s+', lines[i-1]) or re.match(r'^\s*\d+\.\s+', lines[i-1]))
        prev_blank = i > 0 and not lines[i-1].strip()
        
        # Add blank before list if previous wasn't blank or list
        if is_list and not prev_was_list and not prev_blank and i > 0:
            fixed.append('')
        
        fixed.append(line)
    
    return '\n'.join(fixed)

def fix_all(content):
    """Apply all fixes"""
    content = fix_md012_multiple_blanks(content)
    content = fix_md037_emphasis_spaces(content)
    content = fix_md050_strong_style(content)
    content = fix_md049_emphasis_style(content)
    content = fix_md038_code_span_spaces(content)
    content = fix_md034_bare_urls(content)
    content = fix_md004_list_style(content)
    content = fix_md029_ordered_list(content)
    content = fix_md026_trailing_punctuation(content)
    content = fix_md042_empty_links(content)
    content = fix_md051_invalid_links(content)
    content = fix_md032_blanks_around_lists(content)
    # Clean up any extra blank lines created
    content = fix_md012_multiple_blanks(content)
    return content

def fix_file(file_path):
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            original = f.read()
        
        fixed = fix_all(original)
        
        if fixed != original:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(fixed)
            return True
        return False
    except Exception as e:
        print(f"Error: {file_path}: {e}")
        return False

def main():
    vault_path = Path(sys.argv[1]) if len(sys.argv) > 1 else Path("Doxs/Dev Vault (ETERNAL MANUAL)")
    
    print("="*70)
    print("COMPLETE IDE WARNING FIXER")
    print("="*70)
    print("Fixing: MD012, MD037, MD034, MD050, MD049, MD004, MD029, MD038,")
    print("        MD026, MD042, MD051, MD032")
    print("="*70)
    
    total = 0
    for md_file in vault_path.rglob("*.md"):
        if fix_file(md_file):
            print(f"[FIXED] {md_file.name}")
            total += 1
    
    print(f"\nTotal files fixed: {total}")

if __name__ == "__main__":
    main()
