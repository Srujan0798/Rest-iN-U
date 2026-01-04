import os
import re

TARGET_DIR = r"c:\Users\Student\Documents\Rest-iN-U\Doxs\Dev Vault (ETERNAL MANUAL)"

# Keywords that suggest "Generic AI Fluff"
WEAK_PATTERNS = [
    r"check (the )?logs",
    r"try restarting",
    r"ensure .* is correct",
    r"make sure",
    r"contact support",
    r"look into",
    r"various reasons",
    r"basic understanding",
    r"simple example",
]

# Keywords that suggest "Titan Standard" (Real Developer Knowledge)
STRONG_PATTERNS = [
    r"race condition",
    r"deadlock",
    r"memory leak",
    r"segmentation fault",
    r"backpressure",
    r"idempotency",
    r"eventual consistency",
    r"distributed lock",
    r"connection pool",
    r"n\+1 problem",
    r"index scan",
    r"full table scan",
    r"buffer overflow",
    r"sql injection",
    r"xss",
    r"csrf",
    r"jwt",
    r"oauth flow",
    r"cap theorem",
    r"acid compliance",
]

def analyze_file(filepath):
    with open(filepath, 'r', encoding='utf-8-sig', errors='ignore') as f:
        content = f.read().lower()
        
    weak_count = 0
    strong_count = 0
    weak_matches = []
    
    for pattern in WEAK_PATTERNS:
        matches = re.findall(pattern, content)
        count = len(matches)
        weak_count += count
        if count > 0:
            weak_matches.append(f"{pattern} ({count})")
            
    for pattern in STRONG_PATTERNS:
        strong_count += len(re.findall(pattern, content))
        
    # Calculate "Gold Score"
    # Higher strong count is good. High weak count is bad.
    # Score = (Strong * 10) - (Weak * 5)
    score = (strong_count * 10) - (weak_count * 5)
    
    return {
        "weak": weak_count,
        "strong": strong_count,
        "score": score,
        "weak_details": weak_matches
    }

def main():
    output_lines = []
    output_lines.append(f"{'FILE':<40} | {'SCORE':<6} | {'STRONG':<6} | {'WEAK':<6} | {'STATUS'}")
    output_lines.append("-" * 85)
    
    total_score = 0
    files_checked = 0
    
    # Check KNOWLEDGE
    knowledge_dir = os.path.join(TARGET_DIR, "KNOWLEDGE")
    for f in sorted(os.listdir(knowledge_dir)):
        if f.endswith(".md"):
            path = os.path.join(knowledge_dir, f)
            res = analyze_file(path)
            
            status = "TITAN" if res["score"] > 100 else "PASS" if res["score"] > 0 else "WEAK"
            output_lines.append(f"{f:<40} | {res['score']:<6} | {res['strong']:<6} | {res['weak']:<6} | {status}")
            
            total_score += res["score"]
            files_checked += 1
            
    # Check BRAIN
    brain_dir = os.path.join(TARGET_DIR, "BRAIN")
    for f in sorted(os.listdir(brain_dir)):
        if f.endswith(".md"):
            path = os.path.join(brain_dir, f)
            res = analyze_file(path)
            
            status = "TITAN" if res["score"] > 100 else "PASS" if res["score"] > 0 else "WEAK"
            output_lines.append(f"{f:<40} | {res['score']:<6} | {res['strong']:<6} | {res['weak']:<6} | {status}")

    output_lines.append("-" * 85)
    output_lines.append(f"Total System Score: {total_score}")
    
    with open("AUDIT_REPORT.txt", "w", encoding="utf-8") as f:
        f.write("\n".join(output_lines))
        
    print("Audit report written to AUDIT_REPORT.txt")

if __name__ == "__main__":
    main()
