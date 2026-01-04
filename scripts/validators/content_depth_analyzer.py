import os
import re

TARGET_DIR = r"c:\Users\Student\Documents\Rest-iN-U\Doxs\Dev Vault (ETERNAL MANUAL)\KNOWLEDGE"

# Keywords that indicate "Real Developer" knowledge (Incidents, specific errors, advanced concepts)
TITAN_KEYWORDS = [
    "race condition", "memory leak", "deadlock", "segfault", "hydration mismatch",
    "z-index", "stacking context", "event loop", "garbage collection", "throughput",
    "latency", "p99", "availability", "consistency", "partition tolerance",
    "sharding", "replication", "wal", "write-ahead log", "b-tree", "lsm tree",
    "bloom filter", "hyperloglog", "backpressure", "circuit breaker", "bulkhead",
    "retry", "exponential backoff", "jitter", "thundering herd", "cache stampede",
    "hot spot", "cold start", "dependency injection", "inversion of control",
    "solid", "dry", "kiss", "yagni", "cap theorem", "acid", "base",
    "incident", "post-mortem", "root cause", "outage", "downtime", "sla", "slo", "sli"
]

def analyze_depth(filepath):
    with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read().lower()
        
    score = 0
    found_keywords = []
    
    for keyword in TITAN_KEYWORDS:
        count = content.count(keyword)
        if count > 0:
            score += count
            found_keywords.append(f"{keyword}({count})")
            
    # Normalize score by file length (per 1000 chars)
    # But absolute score matters too for "Depth"
    
    return score, found_keywords

def main():
    print("Starting Titan Content Depth Analysis...\n")
    print(f"{'FILE':<30} | {'SCORE':<6} | {'KEYWORDS FOUND'}")
    print("-" * 100)
    
    total_files = 0
    high_quality_files = 0
    
    for root, dirs, files in os.walk(TARGET_DIR):
        if "1M S Dev" in root or "BACKUP" in root: continue
        for file in files:
            if file.endswith(".md") and "00_MASTER_INDEX" not in file:
                filepath = os.path.join(root, file)
                score, keywords = analyze_depth(filepath)
                
                # Truncate keywords for display
                keywords_str = ", ".join(keywords)
                if len(keywords_str) > 60:
                    keywords_str = keywords_str[:57] + "..."
                    
                print(f"{file:<30} | {score:<6} | {keywords_str}")
                
                if score > 50: # Arbitrary threshold for "Good" depth
                    high_quality_files += 1
                total_files += 1
                    
    print("-" * 100)
    print(f"\nAnalysis Complete. {high_quality_files}/{total_files} files meet basic depth threshold.")

if __name__ == "__main__":
    main()
