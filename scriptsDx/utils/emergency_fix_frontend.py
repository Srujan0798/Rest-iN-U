#!/usr/bin/env python3
"""
EMERGENCY: Fix Frontend.md TOC Corruption
Removes all duplicate TOC entries caused by MD024 script
"""

from pathlib import Path

def fix_corruption():
    file_path = Path(r"Doxs\Dev Vault (ETERNAL MANUAL)\KNOWLEDGE\UNIVERSAL_DOMAINS\01_Frontend.md")
    
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    lines = content.split('\n')
    
    # Strategy: Keep lines 1-53 (proper TOC), then find where "# 01_FRONTEND" starts
    # and keep everything from there
    
    clean_lines = lines[:54]  # Keep header + TOC + first separator
    
    # Find the actual content start (look for "# 01_FRONTEND" or similar real heading)
    for i in range(54, len(lines)):
        # Look for actual markdown heading that's not a TOC link
        if lines[i].strip().startswith('# ') and '[' not in lines[i]:
            # Found real content, keep from here to end
            clean_lines.extend(lines[i:])
            break
    
    # Write back
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write('\n'.join(clean_lines))
    
    removed = len(lines) - len(clean_lines)
    print(f"[OK] Removed {removed} corrupted lines")
    print(f"    Before: {len(lines)} lines")
    print(f"    After: {len(clean_lines)} lines")

if __name__ == "__main__":
    fix_corruption()
