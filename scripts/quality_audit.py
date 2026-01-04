import os
import re

# Configuration
TITAN_INDICATORS = [
    "Titan Pattern", "Scar", "Incident", "Disaster", 
    "Real-world", "Production", "Scale", "Decision Tree",
    "Deep Dive", "Checklist", "Protocol"
]

WEAK_INDICATORS = [
    "TODO", "FIXME", "COMING SOON", "TBD", 
    "Lorem ipsum", "Insert text", "Under Construction"
]

TARGET_DIR = r"c:\Users\Student\Documents\Rest-iN-U\Doxs\Dev Vault (ETERNAL MANUAL)\KNOWLEDGE"

def audit_file(filepath):
    with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read()
    
    score = 50
    titan_hits = []
    weak_hits = []
    
    # Check for Titan Indicators
    for indicator in TITAN_INDICATORS:
        if indicator.lower() in content.lower():
            titan_hits.append(indicator)
            score += 5
            
    # Check for Weak Indicators
    for indicator in WEAK_INDICATORS:
        if indicator.lower() in content.lower():
            weak_hits.append(indicator)
            score -= 10
            
    # Cap score
    if score > 100: score = 100
    if score < 0: score = 0
    
    return {
        "file": os.path.basename(filepath),
        "score": score,
        "titan_hits": list(set(titan_hits)),
        "weak_hits": list(set(weak_hits))
    }

def main():
    print(f"Starting Titan Quality Audit on {TARGET_DIR}...\n")
    print(f"{'FILE':<30} | {'SCORE':<5} | {'STATUS':<10} | {'NOTES'}")
    print("-" * 80)
    
    results = []
    
    for root, dirs, files in os.walk(TARGET_DIR):
        for file in files:
            if file.endswith(".md"):
                filepath = os.path.join(root, file)
                result = audit_file(filepath)
                results.append(result)
                
                status = "TITAN" if result["score"] >= 80 else "GOOD" if result["score"] >= 50 else "WEAK"
                notes = f"+{len(result['titan_hits'])} Titan, -{len(result['weak_hits'])} Weak"
                
                print(f"{result['file']:<30} | {result['score']:<5} | {status:<10} | {notes}")
                
    print("-" * 80)
    
    # Summary
    titan_count = sum(1 for r in results if r["score"] >= 80)
    weak_count = sum(1 for r in results if r["score"] < 50)
    avg_score = sum(r["score"] for r in results) / len(results) if results else 0
    
    print(f"\nSUMMARY:")
    print(f"Total Files: {len(results)}")
    print(f"Titan Standard (>=80): {titan_count}")
    print(f"Weak Content (<50): {weak_count}")
    print(f"Average Score: {avg_score:.1f}")
    
    if weak_count == 0 and avg_score > 70:
        print("\nRESULT: PASSED TITAN STANDARDS")
    else:
        print("\nRESULT: NEEDS IMPROVEMENT")

if __name__ == "__main__":
    main()
