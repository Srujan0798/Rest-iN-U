import os
import sys

def check_integrity(filepath):
    issues = []
    try:
        with open(filepath, 'rb') as f:
            raw_content = f.read()
        
        # 1. Check for Null Bytes (Binary Corruption)
        if b'\x00' in raw_content:
            issues.append("INTEGRITY: Null bytes detected")
            
        # 2. Check for Replacement Characters (Mojibake)
        try:
            content = raw_content.decode('utf-8')
            if '\ufffd' in content:
                issues.append("INTEGRITY: Replacement characters (Mojibake) detected")
        except UnicodeDecodeError:
            issues.append("INTEGRITY: File is not valid UTF-8")
            
    except Exception as e:
        return [f"ERROR: Could not process file - {e}"]
        
    return issues

def scan_directory(root_dir):
    print(f"SENTINEL INTEGRITY: Scanning {root_dir}")
    total_issues = 0
    
    for root, dirs, files in os.walk(root_dir):
        for file in files:
            if file.endswith(".md"):
                filepath = os.path.join(root, file)
                issues = check_integrity(filepath)
                if issues:
                    total_issues += 1
                    print(f"[!] {file}: {', '.join(issues)}")
    
    if total_issues == 0:
        print("SENTINEL INTEGRITY: [OK] Clean")
    else:
        print(f"SENTINEL INTEGRITY: [FAIL] Found issues in {total_issues} files")

if __name__ == "__main__":
    target_dir = sys.argv[1] if len(sys.argv) > 1 and not sys.argv[1].startswith("-") else r"c:\Users\Student\Documents\Rest-iN-U\docs"
    scan_directory(target_dir)
