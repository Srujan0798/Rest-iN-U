import os
import chardet
import json
import time

TARGET_DIR = "DevVault"
MAX_LINE_LENGTH = 1000
REPORT_FILE = "vault_health.json"

def analyze_file(filepath):
    report = {
        "filepath": filepath,
        "status": "clean",
        "issues": []
    }

    try:
        with open(filepath, 'rb') as f:
            raw_data = f.read()
    except Exception as e:
        report["status"] = "error"
        report["issues"].append(f"Read error: {str(e)}")
        return report

    # Check for binary content (null bytes)
    if b'\x00' in raw_data:
        report["status"] = "corrupted"
        report["issues"].append("Binary content detected (null bytes)")

    # Check encoding
    try:
        content = raw_data.decode('utf-8')
    except UnicodeDecodeError:
        report["status"] = "corrupted"
        detection = chardet.detect(raw_data)
        report["issues"].append(f"Invalid UTF-8 encoding. Detected: {detection['encoding']}")
        # Try decoding with latin-1 for further analysis
        try:
            content = raw_data.decode('latin-1', errors='replace')
        except:
            content = ""

    lines = content.splitlines()
    for i, line in enumerate(lines):
        if len(line) > MAX_LINE_LENGTH:
            # Only mark as warning, not corruption, unless very severe
            if report["status"] == "clean": 
                report["status"] = "warning"
            report["issues"].append(f"Line {i+1} length: {len(line)}")

        if "Exception in thread" in line or "at java.lang." in line:
             if report["status"] == "clean": 
                report["status"] = "warning"
             report["issues"].append(f"Suspicious log pattern at line {i+1}")

    return report

def main():
    health_data = {
        "timestamp": time.time(),
        "scan_target": TARGET_DIR,
        "summary": {"clean": 0, "warning": 0, "corrupted": 0, "error": 0},
        "files": []
    }

    print(f"Scanning {TARGET_DIR}...")
    
    for root, dirs, files in os.walk(TARGET_DIR):
        for file in files:
            if file.endswith(".md") or file.endswith(".txt"):
                filepath = os.path.join(root, file)
                file_report = analyze_file(filepath)
                
                health_data["files"].append(file_report)
                health_data["summary"][file_report["status"]] += 1

    # Write JSON report
    with open(REPORT_FILE, 'w', encoding='utf-8') as f:
        json.dump(health_data, f, indent=2)

    # Print summary to console
    print(f"\n--- SCAN COMPLETE ---")
    print(f"Report saved to: {REPORT_FILE}")
    print(f"Clean: {health_data['summary']['clean']}")
    print(f"Warnings: {health_data['summary']['warning']}")
    print(f"Corrupted: {health_data['summary']['corrupted']}")
    print(f"Errors: {health_data['summary']['error']}")

    if health_data['summary']['corrupted'] > 0:
        print("\n!!! CORRUPTION DETECTED !!!")
        exit(1)
    else:
        print("\nAll systems nominal.")
        exit(0)

if __name__ == "__main__":
    main()
