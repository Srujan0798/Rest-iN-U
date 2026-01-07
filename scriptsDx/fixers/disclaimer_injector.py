import os
import re

TARGET_DIR = r"c:\Users\Student\Documents\Rest-iN-U\Doxs\Dev Vault (ETERNAL MANUAL)\KNOWLEDGE"

DISCLAIMER_TEXT = """> **?? Disclaimer**: This is educational content synthesized from industry best practices and publicly available documentation. Case studies are illustrative examples for teaching purposes. Last updated: December 2024."""

def inject_disclaimer(filepath):
    with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read()
        
    # Check if disclaimer already exists (loose check)
    if "Disclaimer" in content and "educational content" in content:
        return False
        
    lines = content.split('\n')
    new_lines = []
    injected = False
    
    # Strategy: Inject after TOC (which usually ends with a separator or list of links)
    # Or inject after H1 if no TOC
    
    # Find insertion point
    insert_idx = -1
    
    # Look for TOC end
    for i, line in enumerate(lines):
        if "TABLE OF CONTENTS" in line:
            # Look for the next separator or header
            for j in range(i + 1, len(lines)):
                if lines[j].strip() == "---":
                    insert_idx = j + 1
                    break
                if lines[j].startswith("## ") and "TABLE OF CONTENTS" not in lines[j]:
                    insert_idx = j
                    break
            break
            
    if insert_idx == -1:
        # No TOC found, inject after H1
        for i, line in enumerate(lines):
            if line.startswith("# "):
                insert_idx = i + 1
                break
                
    if insert_idx != -1:
        lines.insert(insert_idx, "\n" + DISCLAIMER_TEXT + "\n")
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write('\n'.join(lines))
        return True
        
    return False

def main():
    print("Starting Disclaimer Injection...\n")
    count = 0
    for root, dirs, files in os.walk(TARGET_DIR):
        if "1M S Dev" in root or "BACKUP" in root: continue
        for file in files:
            if file.endswith(".md") and "6  mode 3.md" not in file:
                # Exclude meta-files
                if file in ["00_MASTER_INDEX.md", "ADAPTATION_GUIDE.md"]: continue
                
                filepath = os.path.join(root, file)
                if inject_disclaimer(filepath):
                    print(f"Injected disclaimer in {file}")
                    count += 1
                    
    print(f"\nDisclaimer Injection Complete. Updated {count} files.")

if __name__ == "__main__":
    main()
