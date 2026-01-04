import os
import sys

TARGET_DIR = r"c:\Users\Student\Documents\Rest-iN-U\Doxs\Dev Vault (ETERNAL MANUAL)"

def is_major_header(line):
    stripped = line.strip().lstrip("#").strip()
    if stripped.startswith("VOLUME") or stripped.startswith("PART") or stripped.startswith("SECTION") or stripped.startswith("CHAPTER"):
        return True
    if stripped.isupper() and len(stripped) < 80: # Increased len slightly
        return True
    if "TABLE OF CONTENTS" in stripped:
        return True
    # Whitelist specific major sections
    if stripped in ["FRONTEND", "BACKEND", "DATABASE", "SECURITY", "TESTING", "DEVOPS", "CLOUD", "SYSTEM DESIGN", "MOBILE", "DATA ENGINEERING", "SEARCH", "PAYMENTS", "ML/AI", "BLOCKCHAIN", "IOT", "REAL-TIME VIDEO", "VR/AR", "INVESTMENT", "CLIMATE", "LEGAL DOCS", "LOCALIZATION", "ANCIENT WISDOM"]:
        return True
    return False

def fix_file(filepath):
    with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
        lines = f.readlines()

    new_lines = []
    in_code_block = False
    current_h2_is_fake = False
    modified = False

    for line in lines:
        stripped = line.strip()
        
        # Track code blocks
        if stripped.startswith("```"):
            if len(stripped) > 3:
                in_code_block = not in_code_block
            else:
                in_code_block = not in_code_block
            new_lines.append(line)
            continue
            
        if not in_code_block:
            if stripped.startswith("## "):
                # Check if it's a major header
                if is_major_header(stripped):
                    current_h2_is_fake = False
                    new_lines.append(line) # Keep H2
                else:
                    current_h2_is_fake = True
                    # Demote to H3
                    new_lines.append("#" + line)
                    modified = True
            elif stripped.startswith("### "):
                if current_h2_is_fake:
                    # Demote to H4
                    new_lines.append("#" + line)
                    modified = True
                else:
                    new_lines.append(line) # Keep H3
            elif stripped.startswith("#### "):
                if current_h2_is_fake:
                    # Demote to H5
                    new_lines.append("#" + line)
                    modified = True
                else:
                    new_lines.append(line)
            else:
                new_lines.append(line)
        else:
            new_lines.append(line)

    if modified:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.writelines(new_lines)
        print(f"Fixed Hierarchy: {os.path.basename(filepath)}")
        return True
    return False

def main():
    print("Starting Hierarchy Fixer...")
    for root, dirs, files in os.walk(TARGET_DIR):
        if "1M S Dev" in root or "BACKUP" in root: continue
        for file in files:
            if file.endswith(".md") and "00_MASTER_INDEX" not in file and "00_BRAIN_INDEX" not in file:
                fix_file(os.path.join(root, file))
    print("Hierarchy Fix Complete.")

if __name__ == "__main__":
    main()
