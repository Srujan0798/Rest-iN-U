#!/usr/bin/env python3
"""
Emergency TOC Corruption Fixer
Removes duplicate TOC entries from corrupted Frontend.md
"""

import sys
from pathlib import Path

def fix_frontend_toc():
    file_path = Path(r"Doxs\Dev Vault (ETERNAL MANUAL)\KNOWLEDGE\UNIVERSAL_DOMAINS\01_Frontend.md")
    
    with open(file_path, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    
    # Find the end of the proper TOC (first --- after line 50)
    proper_toc_end = 0
    for i in range(50, min(len(lines), 200)):
        if lines[i].strip() == '---':
            proper_toc_end = i
            break
    
    if proper_toc_end == 0:
        print("[ERROR] Could not find TOC end")
        return
    
    # Find where actual content starts (look for first real heading after duplicates)
    content_start = 0
    for i in range(proper_toc_end, len(lines)):
        line = lines[i].strip()
        # Look for actual content (not TOC links, not separators, not fragments)
        if line.startswith('# ') and not line.startswith('- ['):
            content_start = i
            break
    
    if content_start == 0:
        print("[ERROR] Could not find content start")
        return
    
    # Keep: lines 0 to proper_toc_end, then content_start to end
    clean_lines = lines[:proper_toc_end + 1] + lines[content_start:]
    
    # Write back
    with open(file_path, 'w', encoding='utf-8') as f:
        f.writelines(clean_lines)
    
    print(f"[OK] Fixed! Removed {len(lines) - len(clean_lines)} duplicate lines")
    print(f"    Original: {len(lines)} lines")
    print(f"    Fixed: {len(clean_lines)} lines")

if __name__ == "__main__":
    fix_frontend_toc()
