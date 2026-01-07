import os
import re

TARGET_DIR = r"c:\Users\Student\Documents\Rest-iN-U\Doxs\Dev Vault (ETERNAL MANUAL)"

def scan_file(filepath):
    issues = []
    headers = {}
    
    try:
        with open(filepath, 'rb') as f:
            raw_content = f.read()
            
        # 1. Check for Mojibake (Binary check)
        if b'\xc3\x82' in raw_content or b'\xc3\x83' in raw_content:
            issues.append("POSSIBLE MOJIBAKE DETECTED (0xC3 0x82/0x83 sequence)")
            
        content = raw_content.decode('utf-8', errors='replace')
        lines = content.splitlines()
        
        # 2. Check for Duplicate Headers
        for i, line in enumerate(lines):
            if line.strip().startswith('#'):
                header_text = line.strip().lstrip('#').strip()
                # Ignore very short or common headers if needed, but for now track all
                if len(header_text) > 5: 
                    if header_text in headers:
                        prev_line = headers[header_text]
                        issues.append(f"DUPLICATE HEADER: '{header_text}' at line {i+1} (previously at line {prev_line})")
                    else:
                        headers[header_text] = i + 1

        # 3. Check for Placeholder Text
        if "Lorem ipsum" in content:
            issues.append("PLACEHOLDER TEXT: 'Lorem ipsum' found")
        if "TODO" in content:
             # Count TODOs but maybe don't flag as critical error, just info
             pass 

        # 4. Structure Check
        if "TABLE OF CONTENTS" not in content and "Index" not in content and "Structure" not in content:
             # Only flag if it's a Knowledge file (01-22)
             if "KNOWLEDGE" in filepath and os.path.basename(filepath)[0].isdigit():
                 issues.append("MISSING 'TABLE OF CONTENTS' or Index")

    except Exception as e:
        issues.append(f"ERROR READING FILE: {str(e)}")
        
    return issues

def main():
    print(f"Starting Deep Audit of: {TARGET_DIR}")
    print("-" * 60)
    
    files_scanned = 0
    files_with_issues = 0
    
    for root, dirs, files in os.walk(TARGET_DIR):
        for file in files:
            if file.endswith(".md"):
                files_scanned += 1
                filepath = os.path.join(root, file)
                issues = scan_file(filepath)
                
                if issues:
                    files_with_issues += 1
                    print(f"\n[FAIL] {file}")
                    for issue in issues:
                        print(f"  - {issue}")
                else:
                    # print(f"[PASS] {file}") # Keep output clean, only show failures
                    pass

    print("-" * 60)
    print(f"Audit Complete.")
    print(f"Files Scanned: {files_scanned}")
    print(f"Files with Issues: {files_with_issues}")
    print(f"Files Clean: {files_scanned - files_with_issues}")

if __name__ == "__main__":
    main()
