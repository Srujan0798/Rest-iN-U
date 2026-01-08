#!/usr/bin/env python3
"""
Intelligent Dev Vault Merger - Merges ALL folders
"""

import os
from pathlib import Path

# Base paths
BASE_CURRENT = Path(r"c:\Users\Student\Documents\Rest-iN-U\Doxs\Dev Vault (ETERNAL MANUAL)")
BASE_JULES = Path(r"c:\Users\Student\Documents\Rest-iN-U\jules_session_1255960803632361741_fix-devvault-corruption-1255960803632361741 (2)\DevVault")
BASE_DOCS = Path(r"c:\Users\Student\Documents\Rest-iN-U\docs\Dev Vault (ETERNAL MANUAL)")

FOLDERS = [
    "KNOWLEDGE/SPECIALIZED_DOMAINS",
    "BRAIN",
]

def get_sections(content):
    """Extract sections by ## headers"""
    sections = {}
    current_section = "HEADER"
    current_content = []
    
    for line in content.split('\n'):
        if line.startswith('## '):
            if current_content:
                sections[current_section] = '\n'.join(current_content)
            current_section = line.strip()
            current_content = [line]
        else:
            current_content.append(line)
    
    if current_content:
        sections[current_section] = '\n'.join(current_content)
    
    return sections

def merge_files(current_file, jules_file, docs_file):
    """Merge a single file from all sources"""
    versions = {}
    
    if current_file and current_file.exists():
        versions['current'] = current_file.read_text(encoding='utf-8', errors='replace')
    if jules_file and jules_file.exists():
        versions['jules'] = jules_file.read_text(encoding='utf-8', errors='replace')
    if docs_file and docs_file.exists():
        versions['docs'] = docs_file.read_text(encoding='utf-8', errors='replace')
    
    if not versions:
        return None, "No versions found"
    
    # Get sections from each version
    all_sections = {}
    for name, content in versions.items():
        sections = get_sections(content)
        for section_name, section_content in sections.items():
            if section_name not in all_sections:
                all_sections[section_name] = {}
            all_sections[section_name][name] = section_content
    
    # For each section, pick the longest version
    merged_sections = []
    for section_name in all_sections:
        section_versions = all_sections[section_name]
        best_version = max(section_versions.values(), key=len)
        merged_sections.append(best_version)
    
    merged_content = '\n\n'.join(merged_sections)
    
    original_lines = max(len(v.split('\n')) for v in versions.values())
    merged_lines = len(merged_content.split('\n'))
    
    return merged_content, f"{original_lines} -> {merged_lines} lines"

def main():
    print("=" * 80)
    print("MERGING ALL DEV VAULT FOLDERS")
    print("=" * 80)
    
    for folder in FOLDERS:
        current_folder = BASE_CURRENT / folder
        jules_folder = BASE_JULES / folder
        docs_folder = BASE_DOCS / folder
        
        if not current_folder.exists():
            print(f"\nSKIPPING: {folder} (not found)")
            continue
        
        print(f"\n{'='*40}")
        print(f"FOLDER: {folder}")
        print('='*40)
        
        for file_path in sorted(current_folder.glob("*.md")):
            file_name = file_path.name
            
            jules_file = jules_folder / file_name if jules_folder.exists() else None
            docs_file = docs_folder / file_name if docs_folder.exists() else None
            
            merged, stats = merge_files(file_path, jules_file, docs_file)
            
            if merged:
                file_path.write_text(merged, encoding='utf-8')
                print(f"  {file_name}: {stats}")
            else:
                print(f"  {file_name}: SKIPPED")
    
    print("\n" + "=" * 80)
    print("ALL FOLDERS MERGED!")
    print("=" * 80)

if __name__ == "__main__":
    main()
