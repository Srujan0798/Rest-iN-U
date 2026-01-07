#!/usr/bin/env python3
"""
Remove Code Fences from Dev Vault Files
Converts code blocks to plain text for better GitHub display
"""

import sys
import re
from pathlib import Path

def remove_code_fences(content):
    """Remove all code fence blocks and convert to plain text"""
    
    # Pattern to match code fences: ```language\n content \n```
    # Replace with just the content (indented for markdown)
    
    lines = content.split('\n')
    result = []
    in_code_block = False
    code_block_content = []
    
    for line in lines:
        # Check if this is a code fence marker
        if line.strip().startswith('```'):
            if not in_code_block:
                # Starting a code block
                in_code_block = True
                code_block_content = []
            else:
                # Ending a code block - add content as indented text
                in_code_block = False
                # Add the code content with 4-space indentation (markdown code block alternative)
                for code_line in code_block_content:
                    result.append('    ' + code_line)
                code_block_content = []
        elif in_code_block:
            # Inside code block - collect the content
            code_block_content.append(line)
        else:
            # Normal line - keep as is
            result.append(line)
    
    return '\n'.join(result)

def process_file(file_path):
    """Process a single markdown file"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original_content = content
        
        # Remove code fences
        content = remove_code_fences(content)
        
        if content != original_content:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
            
            # Count how many fences were removed
            fence_count = original_content.count('```')
            print(f"[FIXED] {file_path.name}: Removed {fence_count // 2} code blocks")
            return True
        else:
            print(f"[OK] {file_path.name}: No code fences found")
            return False
            
    except Exception as e:
        print(f"[ERROR] {file_path.name}: {e}")
        return False

def main():
    if len(sys.argv) < 2:
        print("Usage: python remove_code_fences.py <vault_directory>")
        sys.exit(1)
    
    vault_dir = Path(sys.argv[1])
    
    if not vault_dir.exists():
        print(f"Error: Directory not found: {vault_dir}")
        sys.exit(1)
    
    print("\n" + "="*80)
    print("REMOVING CODE FENCES FROM DEV VAULT FILES")
    print("="*80 + "\n")
    
    # Get all markdown files
    md_files = sorted(vault_dir.rglob("*.md"))
    
    fixed_count = 0
    for file_path in md_files:
        if process_file(file_path):
            fixed_count += 1
    
    print(f"\n{'='*80}")
    print(f"SUMMARY: Fixed {fixed_count} files")
    print(f"{'='*80}\n")

if __name__ == "__main__":
    main()
