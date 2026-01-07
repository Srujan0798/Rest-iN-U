"""
Jules-inspired corruption checker for Dev Vault
Checks for encoding issues, long lines, and suspicious patterns
"""
import os
import re

TARGET_DIR = "Doxs/Dev Vault (ETERNAL MANUAL)"
MAX_LINE_LENGTH = 1000

def analyze_file(filepath):
    """Analyze a single file for corruption"""
    report = {
        "filepath": filepath,
        "is_utf8": True,
        "long_lines": [],
        "mojibake_found": False,
        "binary_content": False
    }
    
    try:
        with open(filepath, 'rb') as f:
            raw_data = f.read()
    except Exception as e:
        report["error"] = f"Could not read file: {e}"
        return report
    
    # Check encoding
    try:
        content = raw_data.decode('utf-8')
    except UnicodeDecodeError:
        report["is_utf8"] = False
        return report
    
    # Check for binary content (null bytes)
    if b'\\x00' in raw_data:
        report["binary_content"] = True
    
    # Check for mojibake patterns
    mojibake_patterns = ['', '', '', '']
    if any(pattern in content for pattern in mojibake_patterns):
        report["mojibake_found"] = True
    
    # Check for long lines
    lines = content.splitlines()
    for i, line in enumerate(lines):
        if len(line) > MAX_LINE_LENGTH:
            report["long_lines"].append({"line_num": i + 1, "length": len(line)})
    
    return report

def main():
    print("=" * 80)
    print("DEV VAULT CORRUPTION CHECK (Jules-inspired)")
    print("=" * 80)
    print(f"Scanning: {TARGET_DIR}\n")
    
    results = []
    for root, dirs, files in os.walk(TARGET_DIR):
        for file in files:
            if file.endswith(".md"):
                filepath = os.path.join(root, file)
                results.append(analyze_file(filepath))
    
    # Report
    issues_found = 0
    for res in results:
        issues = []
        
        if not res.get("is_utf8"):
            issues.append("Not UTF-8")
        if res.get("binary_content"):
            issues.append("Contains Binary Data (Null Bytes)")
        if res.get("mojibake_found"):
            issues.append("Mojibake detected")
        if res.get("long_lines"):
            issues.append(f"{len(res['long_lines'])} long lines")
        
        if issues:
            issues_found += 1
            print(f"[ISSUE] {os.path.basename(res['filepath'])}")
            for issue in issues:
                print(f"  - {issue}")
    
    print("\n" + "=" * 80)
    if issues_found == 0:
        print("[OK] No corruption found in Dev Vault!")
    else:
        print(f"[WARNING] Found issues in {issues_found} files")
    print("=" * 80)

if __name__ == "__main__":
    main()
