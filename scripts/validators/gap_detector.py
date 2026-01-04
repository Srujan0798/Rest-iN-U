import os
import re

TARGET_DIR = r"c:\Users\Student\Documents\Rest-iN-U\Doxs\Dev Vault (ETERNAL MANUAL)"

def detect_gaps(filepath):
    with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read()
        
    issues = []
    filename = os.path.basename(filepath)
    
    # 1. Multiple Separators (--- followed by ---)
    # Matches ---, optional whitespace/newlines, then ---
    match = re.search(r'---\s*\n\s*---', content)
    if match:
        issues.append(f"Multiple consecutive separators (--- ... ---) Match: {repr(match.group())}")
        
    # 2. Excessive Blank Lines (3 or more)
    if re.search(r'\n{3,}', content):
        issues.append("Excessive blank lines (3+)")
        
    # 3. Blank line at start of file
    if content.startswith('\n'):
        issues.append("File starts with blank line")
        
    # 4. Blank line at end of file (more than 1)
    if content.endswith('\n\n'):
        issues.append(f"File ends with multiple blank lines. Tail: {repr(content[-10:])}")

    return issues

def main():
    print("Starting Gap Detection...\n")
    print(f"{'FILE':<30} | {'ISSUES'}")
    print("-" * 80)
    
    total_issues = 0
    
    for root, dirs, files in os.walk(TARGET_DIR):
        if "1M S Dev" in root or "BACKUP" in root: continue
        for file in files:
            if file.endswith(".md") and "6  mode 3.md" not in file:
                filepath = os.path.join(root, file)
                issues = detect_gaps(filepath)
                
                if issues:
                    print(f"{file:<30} | {', '.join(issues)}")
                    total_issues += len(issues)
                    
    print("-" * 80)
    print(f"\nGap Detection Complete. Found issues in {total_issues} files.")

if __name__ == "__main__":
    main()
