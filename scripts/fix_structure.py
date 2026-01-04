"""
Fix structural issues in markdown files
"""

import os
import re

TARGET_DIR = r"c:\Users\Student\Documents\Rest-iN-U"

def fix_unmatched_code_blocks(text):
    """Fix unmatched code block markers by adding closing markers."""
    lines = text.split('\n')
    in_code_block = False
    code_block_lang = None
    new_lines = []
    fixed = False
    
    for i, line in enumerate(lines):
        # Check for code block start/end
        if line.strip().startswith('```'):
            if not in_code_block:
                in_code_block = True
                code_block_lang = line.strip()[3:]
            else:
                in_code_block = False
                code_block_lang = None
        
        new_lines.append(line)
        
        # If we're at end of file and still in code block, close it
        if i == len(lines) - 1 and in_code_block:
            new_lines.append('```')
            fixed = True
    
    # Additional check: look for orphaned ``` at end of sections
    result = '\n'.join(new_lines)
    
    # Count code blocks again
    count = result.count('```')
    if count % 2 != 0:
        # Add closing marker at the very end
        result += '\n```'
        fixed = True
    
    return result, fixed


def fix_empty_headers(text):
    """Remove empty headers."""
    # Pattern matches headers with only whitespace after them
    fixed_text = re.sub(r'^(#{1,6})\s*$', '', text, flags=re.MULTILINE)
    return fixed_text, fixed_text != text


def fix_empty_links(text):
    """Fix empty link targets by removing the broken links."""
    # Pattern: [text]()
    fixed_text = re.sub(r'\[([^\]]+)\]\(\s*\)', r'\1', text)
    return fixed_text, fixed_text != text


def process_file(filepath):
    """Process a single file."""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
    except:
        return False
    
    original = content
    modified = False
    
    # Fix code blocks
    content, fixed = fix_unmatched_code_blocks(content)
    if fixed:
        print(f"  Fixed code blocks in {os.path.basename(filepath)}")
        modified = True
    
    # Fix empty headers
    content, fixed = fix_empty_headers(content)
    if fixed:
        print(f"  Fixed empty headers in {os.path.basename(filepath)}")
        modified = True
    
    # Fix empty links
    content, fixed = fix_empty_links(content)
    if fixed:
        print(f"  Fixed empty links in {os.path.basename(filepath)}")
        modified = True
    
    if modified:
        with open(filepath, 'w', encoding='utf-8', newline='\n') as f:
            f.write(content)
    
    return modified


def main():
    print("Fixing structural issues in markdown files...")
    
    # Specific files with known issues
    files_to_fix = [
        r"Doxs\1M S Dev\4 All-Sprints-Full.md",
        r"Doxs\1M S Dev\5 Opus All.md",
        r"Doxs\Dev Vault (ETERNAL MANUAL)\KNOWLEDGE\01_Frontend.md",
        r"Doxs\Dev Vault (ETERNAL MANUAL)\KNOWLEDGE\05_Security.md",
        r"Doxs\Dev Vault (ETERNAL MANUAL)\KNOWLEDGE\13_ML_AI.md",
        r"Doxs\Dev Vault (ETERNAL MANUAL)\KNOWLEDGE\18_Investment.md",
    ]
    
    for rel_path in files_to_fix:
        filepath = os.path.join(TARGET_DIR, rel_path)
        if os.path.exists(filepath):
            print(f"\nProcessing: {rel_path}")
            process_file(filepath)
        else:
            print(f"File not found: {rel_path}")
    
    print("\nDone!")


if __name__ == "__main__":
    main()
