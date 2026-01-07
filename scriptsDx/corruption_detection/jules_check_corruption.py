#!/usr/bin/env python3
"""
Jules Corruption Checker
Checks for encoding issues and binary content in markdown files.
(Standalone version - no external dependencies)
"""

import os
import sys
from pathlib import Path

# Accept command line argument for target directory
TARGET_DIR = sys.argv[1] if len(sys.argv) > 1 else "."
MAX_LINE_LENGTH = 1000

def analyze_file(filepath):
    report = {
        "filepath": filepath,
        "is_utf8": True,
        "long_lines": [],
        "suspicious_patterns": [],
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
        report["detected_encoding"] = "Unknown (not UTF-8)"
        # Try latin-1 for further analysis
        content = raw_data.decode('latin-1', errors='replace')

    # Check for binary content (null bytes)
    if b'\x00' in raw_data:
        report["binary_content"] = True

    lines = content.splitlines()
    for i, line in enumerate(lines):
        if len(line) > MAX_LINE_LENGTH:
            report["long_lines"].append({"line_num": i + 1, "length": len(line)})

        # Check for suspicious patterns (e.g., extensive log dumps)
        if "Exception in thread" in line or "at java.lang." in line or "Traceback (most recent call last)" in line:
            report["suspicious_patterns"].append({"line_num": i + 1, "pattern": "Stack Trace"})

    return report

def main():
    target = Path(TARGET_DIR)
    results = []
    
    if target.is_dir():
        files = list(target.rglob("*.md")) + list(target.rglob("*.txt"))
    else:
        files = [target] if target.suffix in ['.md', '.txt'] else []
    
    for filepath in files:
        print(f"Analyzing {filepath.name}...")
        results.append(analyze_file(str(filepath)))

    print("\n--- REPORT ---")
    issues_found = False
    for res in results:
        issues = []
        if not res.get("is_utf8"):
            issues.append(f"Not UTF-8 (Detected: {res.get('detected_encoding')})")
        if res.get("binary_content"):
            issues.append("Contains Binary Data (Null Bytes)")
        if res.get("long_lines"):
            issues.append(f"Has {len(res['long_lines'])} long lines (Max: {max(l['length'] for l in res['long_lines'])})") 
        if res.get("suspicious_patterns"):
            issues.append(f"Found suspicious patterns (e.g. Stack Traces): {len(res['suspicious_patterns'])}")

        if issues:
            issues_found = True
            print(f"\nFILE: {res['filepath']}")
            for issue in issues:
                print(f"  - {issue}")
            
            # Print details for long lines (first 3)
            if res.get("long_lines"):
                print("    Long lines at:")
                for l in res['long_lines'][:3]:
                    print(f"      Line {l['line_num']}: {l['length']} chars")
    
    if not issues_found:
        print("\nAll files are clean!")

if __name__ == "__main__":
    main()
