#!/usr/bin/env python3
"""
Intelligent Dev Vault Merger
Compares two versions and creates the best combined version
"""

import os
import sys
from pathlib import Path

# Paths
CURRENT_DIR = Path(r"c:\Users\Student\Documents\Rest-iN-U\Doxs\Dev Vault (ETERNAL MANUAL)\KNOWLEDGE\UNIVERSAL_DOMAINS")
JULES_DIR = Path(r"c:\Users\Student\Documents\Rest-iN-U\jules_session_1255960803632361741_fix-devvault-corruption-1255960803632361741 (2)\DevVault\KNOWLEDGE\UNIVERSAL_DOMAINS")
DOCS_DIR = Path(r"c:\Users\Student\Documents\Rest-iN-U\docs\Dev Vault (ETERNAL MANUAL)\KNOWLEDGE\UNIVERSAL_DOMAINS")

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

def merge_files(file_name):
    """Merge a single file from all sources"""
    current_file = CURRENT_DIR / file_name
    jules_file = JULES_DIR / file_name
    docs_file = DOCS_DIR / file_name
    
    # Read all versions
    versions = {}
    
    if current_file.exists():
        versions['current'] = current_file.read_text(encoding='utf-8', errors='replace')
    if jules_file.exists():
        versions['jules'] = jules_file.read_text(encoding='utf-8', errors='replace')
    if docs_file.exists():
        versions['docs'] = docs_file.read_text(encoding='utf-8', errors='replace')
    
    if not versions:
        return None, "No versions found"
    
    # Find the longest version as base
    base_name = max(versions.keys(), key=lambda k: len(versions[k]))
    base_content = versions[base_name]
    
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
    
    # Stats
    original_lines = len(base_content.split('\n'))
    merged_lines = len(merged_content.split('\n'))
    
    return merged_content, f"Base: {base_name} ({original_lines} lines) -> Merged: {merged_lines} lines"

def main():
    print("=" * 80)
    print("INTELLIGENT DEV VAULT MERGER")
    print("=" * 80)
    
    files = list(CURRENT_DIR.glob("*.md"))
    
    for file_path in sorted(files):
        file_name = file_path.name
        print(f"\nProcessing: {file_name}")
        
        merged, stats = merge_files(file_name)
        
        if merged:
            # Write merged version
            file_path.write_text(merged, encoding='utf-8')
            print(f"  {stats}")
        else:
            print(f"  SKIPPED: {stats}")
    
    print("\n" + "=" * 80)
    print("MERGE COMPLETE!")
    print("=" * 80)

if __name__ == "__main__":
    main()
