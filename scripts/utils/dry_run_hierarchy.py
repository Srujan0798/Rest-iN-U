import os
import re
import sys

def is_major_header(line):
    stripped = line.strip().lstrip("#").strip()
    if stripped.startswith("VOLUME") or stripped.startswith("PART") or stripped.startswith("SECTION") or stripped.startswith("CHAPTER"):
        return True
    if stripped.isupper() and len(stripped) < 60:
        return True
    if "TABLE OF CONTENTS" in stripped:
        return True
    return False

def dry_run(filepath):
    print(f"Checking: {os.path.basename(filepath)}")
    with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
        lines = f.readlines()

    changes = 0
    in_code_block = False
    
    for i, line in enumerate(lines):
        stripped = line.strip()
        if stripped.startswith("```"):
            in_code_block = not in_code_block
            continue
            
        if stripped.startswith("## ") and not in_code_block:
            # Check if it should be H2
            if is_major_header(stripped):
                print(f"[KEEP H2] {stripped}")
            else:
                print(f"[DEMOTE H2->H3] {stripped}")
                changes += 1
        elif stripped.startswith("### ") and not in_code_block:
             # If we are demoting H2s, we usually need to demote H3s too to maintain hierarchy?
             # But maybe H3s are already correct relative to the "Fake H2s"?
             # If "Fake H2" becomes H3, then "Existing H3" should become H4.
             print(f"[DEMOTE H3->H4] {stripped}")
             changes += 1

    print(f"Total potential changes: {changes}")

if __name__ == "__main__":
    if len(sys.argv) > 1:
        dry_run(sys.argv[1])
    else:
        print("Usage: python dry_run_hierarchy.py <filepath>")
