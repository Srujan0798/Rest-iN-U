#!/usr/bin/env python3
"""
Fix Encoding Issues for GitHub
Ensures all markdown files are UTF-8 without BOM and safe for GitHub
"""

import sys
from pathlib import Path

def fix_encoding(file_path):
    """Fix encoding issues in a file"""
    try:
        # Read file as binary
        with open(file_path, 'rb') as f:
            raw_content = f.read()
        
        # Remove BOM if present
        if raw_content.startswith(b'\xef\xbb\xbf'):
            raw_content = raw_content[3:]
            print(f"[FIX] {file_path.name}: Removed UTF-8 BOM")
        
        # Decode to text
        try:
            text = raw_content.decode('utf-8')
        except UnicodeDecodeError:
            # Try with errors='replace' to handle bad characters
            text = raw_content.decode('utf-8', errors='replace')
            print(f"[FIX] {file_path.name}: Fixed bad UTF-8 characters")
        
        # Replace problematic characters that GitHub doesn't like
        # Replace smart quotes
        text = text.replace('\u201c', '"')  # Left double quote
        text = text.replace('\u201d', '"')  # Right double quote
        text = text.replace('\u2018', "'")  # Left single quote
        text = text.replace('\u2019', "'")  # Right single quote
        
        # Replace em dash and en dash
        text = text.replace('\u2014', '--')  # Em dash
        text = text.replace('\u2013', '-')   # En dash
        
        # Replace ellipsis
        text = text.replace('\u2026', '...')
        
        # Normalize line endings to LF (Unix style - GitHub standard)
        text = text.replace('\r\n', '\n')
        
        # Write back as clean UTF-8 without BOM
        with open(file_path, 'w', encoding='utf-8', newline='\n') as f:
            f.write(text)
        
        return True
        
    except Exception as e:
        print(f"[ERROR] {file_path.name}: {e}")
        return False

def main():
    if len(sys.argv) < 2:
        print("Usage: python fix_encoding.py <vault_directory>")
        sys.exit(1)
    
    vault_dir = Path(sys.argv[1])
    
    print("\n" + "="*80)
    print("FIXING ENCODING FOR GITHUB")
    print("="*80 + "\n")
    
    md_files = sorted(vault_dir.rglob("*.md"))
    
    print(f"Processing {len(md_files)} files...\n")
    
    fixed = 0
    for file_path in md_files:
        if fix_encoding(file_path):
            fixed += 1
    
    print(f"\n{'='*80}")
    print(f"COMPLETE: Processed {fixed} files")
    print("All files now:")
    print("  - UTF-8 encoding (no BOM)")
    print("  - LF line endings (Unix/GitHub standard)")
    print("  - No problematic Unicode characters")
    print(f"{'='*80}\n")

if __name__ == "__main__":
    main()
