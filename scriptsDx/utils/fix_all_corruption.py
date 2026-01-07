#!/usr/bin/env python3
"""
Fix ALL Corrupted Files
Removes TOC duplication from all affected files
"""

from pathlib import Path

def fix_file(file_path):
    """Fix a single corrupted file"""
    with open(file_path, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    
    # Find the end of the proper TOC (first --- after line 50)
    proper_toc_end = 0
    for i in range(50, min(len(lines), 200)):
        if lines[i].strip() == '---':
            proper_toc_end = i
            break
    
    if proper_toc_end == 0:
        print(f"[SKIP] {file_path.name}: Could not find TOC end")
        return 0
    
    # Keep: lines 0 to proper_toc_end, then find where actual content starts
    clean_lines = lines[:proper_toc_end + 1]
    
    # Find where actual content starts (look for first real heading after duplicates)
    for i in range(proper_toc_end, len(lines)):
        line = lines[i].strip()
        # Look for actual content (not TOC links, not separators, not fragments)
        if line.startswith('# ') and not line.startswith('- [') and '[' not in line:
            # Found real content, keep from here to end
            clean_lines.extend(lines[i:])
            break
    
    # Write back
    with open(file_path, 'w', encoding='utf-8') as f:
        f.writelines(clean_lines)
    
    removed = len(lines) - len(clean_lines)
    print(f"[OK] {file_path.name}: Removed {removed} corrupted lines ({len(lines)} -> {len(clean_lines)})")
    return removed

def main():
    vault_dir = Path(r"Doxs\Dev Vault (ETERNAL MANUAL)")
    
    # Files to fix
    files_to_fix = [
        vault_dir / "KNOWLEDGE" / "UNIVERSAL_DOMAINS" / "02_Backend.md",
    ]
    
    print("\n" + "="*80)
    print("FIXING CORRUPTED FILES")
    print("="*80 + "\n")
    
    total_removed = 0
    for file_path in files_to_fix:
        if file_path.exists():
            removed = fix_file(file_path)
            total_removed += removed
        else:
            print(f"[SKIP] {file_path.name}: File not found")
    
    print(f"\n[OK] Total corrupted lines removed: {total_removed:,}")
    print()

if __name__ == "__main__":
    main()
