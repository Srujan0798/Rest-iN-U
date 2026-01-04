import os
import re

TARGET_DIR = r"c:\Users\Student\Documents\Rest-iN-U\Doxs\Dev Vault (ETERNAL MANUAL)\KNOWLEDGE"

REQUIRED_SECTIONS = [
    "VOLUME 1: THE SCARS",
    "VOLUME 2: THE FOUNDATION",
    "VOLUME 3: THE DEEP DIVE",
    "VOLUME 4: THE EXPERT",
    "VOLUME 5: THE TITAN",
    "VOLUME 6: THE INFINITE"
]

def audit_structure(filepath):
    filename = os.path.basename(filepath)
    with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read()
        
    issues = []
    
    # 1. Check for H1
    if not re.search(r'^# ', content, re.MULTILINE):
        issues.append("Missing H1 Title")
        
    # 2. Check for Metadata Block
    if "> **Status**:" not in content:
        issues.append("Missing Metadata Block (Status, Target, Coverage)")
        
    # 3. Check for Volumes
    for volume in REQUIRED_SECTIONS:
        if volume not in content:
            issues.append(f"Missing Section: {volume}")
            
    return issues

def main():
    print("Starting Structure Audit...\n")
    print(f"{'FILE':<30} | {'ISSUES'}")
    print("-" * 80)
    
    total_issues = 0
    
    for root, dirs, files in os.walk(TARGET_DIR):
        if "1M S Dev" in root or "BACKUP" in root: continue
        for file in files:
            if file.endswith(".md") and "6  mode 3.md" not in file:
                # Exclude meta-files
                if file in ["00_MASTER_INDEX.md", "ADAPTATION_GUIDE.md"]:
                    continue
                    
                filepath = os.path.join(root, file)
                issues = audit_structure(filepath)
                
                if issues:
                    print(f"{file:<30} | {', '.join(issues)}")
                    total_issues += len(issues)
                else:
                    # print(f"{file:<30} | OK")
                    pass
                    
    print("-" * 80)
    print(f"\nStructure Audit Complete. Found {total_issues} structural issues.")

if __name__ == "__main__":
    main()
