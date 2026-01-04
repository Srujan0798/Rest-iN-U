import os
import re

TARGET_DIR = r"c:\Users\Student\Documents\Rest-iN-U\Doxs\Dev Vault (ETERNAL MANUAL)\KNOWLEDGE"

DOMAIN_KEYWORDS = {
    "01_Frontend.md": ["docker", "kubernetes", "aws", "sql", "mobile", "react native", "android", "ios"],
    "02_Backend.md": ["css", "tailwind", "react", "frontend", "dom", "window", "document"],
    "09_Mobile.md": ["css grid", "flexbox", "docker", "kubernetes"],
}

def analyze_structure(filepath):
    with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
        lines = f.readlines()

    headers = []
    duplicates = []
    contamination = []
    filename = os.path.basename(filepath)
    
    # Check for duplicates
    for i, line in enumerate(lines):
        if line.startswith("#"):
            header = line.strip().lower()
            if header in headers:
                duplicates.append(f"Line {i+1}: {line.strip()}")
            headers.append(header)

    # Check for contamination
    if filename in DOMAIN_KEYWORDS:
        bad_words = DOMAIN_KEYWORDS[filename]
        current_header = ""
        for i, line in enumerate(lines):
            if line.startswith("#"):
                current_header = line.strip()
            
            for word in bad_words:
                # Simple check: if a header contains a forbidden word
                if line.startswith("#") and word in line.lower():
                     contamination.append(f"Line {i+1} (Header): {line.strip()} [Contains '{word}']")

    return duplicates, contamination

def main():
    report = []
    for f in os.listdir(TARGET_DIR):
        if f.endswith(".md"):
            path = os.path.join(TARGET_DIR, f)
            dupes, contam = analyze_structure(path)
            
            if dupes or contam:
                report.append(f"FILE: {f}")
                if dupes:
                    report.append(f"  DUPLICATE HEADERS ({len(dupes)}):")
                    for d in dupes[:10]: report.append(f"    {d}")
                    if len(dupes) > 10: report.append(f"    ... and {len(dupes)-10} more")
                
                if contam:
                    report.append(f"  CONTAMINATION ({len(contam)}):")
                    for c in contam: report.append(f"    {c}")
                report.append("-" * 40)

    with open("CLEANING_REPORT.txt", "w", encoding="utf-8") as f:
        f.write("\n".join(report))
    print("Cleaning report generated.")

if __name__ == "__main__":
    main()
