import os
import chardet
import re

TARGET_DIR = "DevVault"
MAX_LINE_LENGTH = 1000
NON_PRINTABLE_THRESHOLD = 0.1  # 10%

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
        # Try to detect encoding
        detection = chardet.detect(raw_data)
        report["detected_encoding"] = detection['encoding']
        # Try decoding with detected encoding or 'latin-1' for further analysis
        try:
            content = raw_data.decode(detection['encoding'] or 'latin-1', errors='replace')
        except:
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
        
        # Check for garbled text (high non-printable count)
        # printable = set(string.printable)
        # non_printable_count = sum(1 for c in line if c not in printable)
        # if len(line) > 0 and (non_printable_count / len(line)) > NON_PRINTABLE_THRESHOLD:
        #    report["suspicious_patterns"].append({"line_num": i + 1, "pattern": "Garbage Chars"})

    return report

def main():
    results = []
    for root, dirs, files in os.walk(TARGET_DIR):
        for file in files:
            if file.endswith(".md") or file.endswith(".txt"):
                filepath = os.path.join(root, file)
                print(f"Analyzing {filepath}...")
                results.append(analyze_file(filepath))

    print("\n--- REPORT ---")
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
            print(f"\nFILE: {res['filepath']}")
            for issue in issues:
                print(f"  - {issue}")
            
            # Print details for long lines (first 3)
            if res.get("long_lines"):
                print("    Long lines at:")
                for l in res['long_lines'][:3]:
                    print(f"      Line {l['line_num']}: {l['length']} chars")

if __name__ == "__main__":
    main()
