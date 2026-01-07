import os
import re

TARGET_DIR = r"c:\Users\Student\Documents\Rest-iN-U\Doxs\Dev Vault (ETERNAL MANUAL)"
REPORT_FILE = r"c:\Users\Student\Documents\Rest-iN-U\TITAN_QUALITY_REPORT.txt"

def analyze_file(filepath):
    with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read()
        lines = content.splitlines()

    score = 50
    details = []

    # 1. Weak Indicators (Penalty)
    weak_keywords = ["TODO", "FIXME", "COMING SOON", "TBD", "INSERT TEXT", "LOREM IPSUM"]
    for kw in weak_keywords:
        # Use regex for word boundary to avoid matching "todos" as "TODO"
        count = len(re.findall(r'\b' + re.escape(kw) + r'\b', content.upper()))
        if count > 0:
            score -= (10 * count)
            details.append(f"[-{10*count}] Found {count} instances of '{kw}'")

    # Check for short sections
    # Heuristic: H2 followed immediately by another Header or EOF, with little text
    # This is hard to regex perfectly, but we can check for "Empty Sections"
    # or sections with very few words.
    
    # 2. Titan Indicators (Bonus)
    titan_keywords = ["TITAN PATTERN", "SCAR", "INCIDENT", "DISASTER", "PRODUCTION", "SCALE", "REAL-WORLD", "GOLD STANDARD"]
    for kw in titan_keywords:
        count = content.upper().count(kw)
        if count > 0:
            bonus = min(20, 2 * count) # Cap bonus per keyword type
            score += bonus
            details.append(f"[+{bonus}] Found {count} instances of '{kw}'")

    # Code Blocks
    code_blocks = content.count("```") / 2
    if code_blocks > 0:
        bonus = min(30, int(code_blocks * 5))
        score += bonus
        details.append(f"[+{bonus}] Found {int(code_blocks)} code blocks")

    # Tables
    tables = content.count("|---")
    if tables > 0:
        bonus = min(20, int(tables * 5))
        score += bonus
        details.append(f"[+{bonus}] Found {int(tables)} tables")

    # Length Bonus
    word_count = len(content.split())
    if word_count > 1000:
        score += 10
        details.append("[+10] > 1000 words")
    if word_count > 5000:
        score += 20
        details.append("[+20] > 5000 words")

    return score, details, word_count

def main():
    print("Starting Titan Quality Audit...")
    results = []

    for root, dirs, files in os.walk(TARGET_DIR):
        if "1M S Dev" in root or "BACKUP" in root: continue
        for file in files:
            if file.endswith(".md") and "00_MASTER_INDEX" not in file and "00_BRAIN_INDEX" not in file:
                filepath = os.path.join(root, file)
                score, details, words = analyze_file(filepath)
                results.append({
                    "file": file,
                    "path": filepath,
                    "score": score,
                    "details": details,
                    "words": words
                })

    # Sort by Score (Ascending - show weak files first)
    results.sort(key=lambda x: x["score"])

    with open(REPORT_FILE, 'w', encoding='utf-8') as f:
        f.write("TITAN QUALITY AUDIT REPORT\n")
        f.write("==========================\n\n")
        f.write(f"Target: > 80 (Gold Standard)\n")
        f.write(f"Files Scanned: {len(results)}\n\n")

        for r in results:
            status = "FAIL" if r["score"] < 80 else "PASS"
            if r["score"] > 120: status = "TITAN"
            
            f.write(f"[{status}] {r['file']} (Score: {r['score']} | Words: {r['words']})\n")
            for d in r["details"]:
                f.write(f"  {d}\n")
            f.write("-" * 40 + "\n")

    print(f"Audit Complete. Report saved to {REPORT_FILE}")

if __name__ == "__main__":
    main()
