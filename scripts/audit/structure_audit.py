import os
import re

TARGET_DIR = r"c:\Users\Student\Documents\Rest-iN-U\Doxs\Dev Vault (ETERNAL MANUAL)"
KNOWLEDGE_DIR = os.path.join(TARGET_DIR, "KNOWLEDGE")
BRAIN_DIR = os.path.join(TARGET_DIR, "BRAIN")

def audit_file(filepath):
    issues = []
    with open(filepath, 'r', encoding='utf-8-sig', errors='ignore') as f:
        lines = f.readlines()

    filename = os.path.basename(filepath)
    
    # 1. Check H1
    h1_found = False
    for i, line in enumerate(lines[:5]): # Check first 5 lines
        if line.startswith("# "):
            h1_found = True
            break
    if not h1_found:
        issues.append("Missing H1 title in first 5 lines")

    # 2. Check Header Hierarchy
    last_level = 1 # Assume H1 start
    in_code_block = False
    
    for i, line in enumerate(lines):
        stripped = line.strip()
        
        # Track code blocks
        if stripped.startswith("```"):
            if len(stripped) > 3: # Check for language or empty
                in_code_block = not in_code_block
            else:
                in_code_block = not in_code_block
                
        if stripped.startswith("#") and not in_code_block:
            match = re.match(r"^(#+)\s", line)
            if match:
                level = len(match.group(1))
                if level > last_level + 1:
                    issues.append(f"Line {i+1}: Skipped header level (H{last_level} -> H{level}). Content: '{stripped}'")
                last_level = level

    # 3. Check Table of Contents
    if ("KNOWLEDGE" in filepath or "BRAIN" in filepath) and "INDEX" not in filename and "21_Adaption_Protocol" not in filename and "README" not in filename:
        toc_found = False
        for line in lines[:100]:
            if "Table of Contents" in line or "TABLE OF CONTENTS" in line:
                toc_found = True
                break
        if not toc_found:
            issues.append("Missing 'Table of Contents'")

    # 4. Check Broken Code Blocks
    in_block = False
    for i, line in enumerate(lines):
        if line.strip().startswith("```"):
            if len(line.strip()) > 3 and " " in line.strip(): # e.g. ``` text
                 issues.append(f"Line {i+1}: Malformed code block fence '{line.strip()}'")
            in_block = not in_block

    return issues

def main():
    print("Starting Structural Audit...")
    print("-" * 50)
    
    all_files = []
    for root, dirs, files in os.walk(TARGET_DIR):
        if "1M S Dev" in root or "BACKUP" in root: continue
        for file in files:
            if file.endswith(".md"):
                all_files.append(os.path.join(root, file))

    total_issues = 0
    for filepath in all_files:
        issues = audit_file(filepath)
        if issues:
            print(f"\n[FAIL] {os.path.basename(filepath)}")
            for issue in issues:
                print(f"  - {issue}")
                total_issues += 1
        else:
            # print(f"[OK] {os.path.basename(filepath)}")
            pass

    print("-" * 50)
    print(f"Audit Complete. Total Issues: {total_issues}")

if __name__ == "__main__":
    main()
