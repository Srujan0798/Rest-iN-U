import os
import re

TARGET_DIR = r"c:\Users\Student\Documents\Rest-iN-U\Doxs\Dev Vault (ETERNAL MANUAL)\KNOWLEDGE"

def audit_file(filepath):
    with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
        lines = f.readlines()
        
    total_lines = len(lines)
    if total_lines == 0:
        return 0, 0, 0
        
    content_lines = 0
    for line in lines:
        stripped = line.strip()
        if not stripped: continue
        if stripped.startswith('#'): continue
        if stripped.startswith('---'): continue
        if stripped.startswith('> **Status**'): continue
        if stripped.startswith('> **Target**'): continue
        if stripped.startswith('> **Type**'): continue
        if stripped.startswith('> **Coverage**'): continue
        if stripped.startswith('> **Last Updated**'): continue
        
        content_lines += 1
        
    density = (content_lines / total_lines) * 100
    return total_lines, content_lines, density

def main():
    print("Starting Quality Audit (Density Check)...\n")
    print(f"{'FILE':<30} | {'LINES':<6} | {'CONTENT':<8} | {'DENSITY':<8} | {'STATUS'}")
    print("-" * 80)
    
    low_density_count = 0
    
    for root, dirs, files in os.walk(TARGET_DIR):
        if "1M S Dev" in root or "BACKUP" in root: continue
        for file in files:
            if file.endswith(".md") and "6  mode 3.md" not in file:
                filepath = os.path.join(root, file)
                total, content, density = audit_file(filepath)
                
                status = "OK"
                if density < 30: # Arbitrary threshold for "sparse"
                    status = "LOW DENSITY"
                    low_density_count += 1
                elif total < 100:
                    status = "SHORT"
                    
                print(f"{file:<30} | {total:<6} | {content:<8} | {density:<6.1f}% | {status}")
                
    print("-" * 80)
    print(f"\nAudit Complete. Found {low_density_count} low density files.")

if __name__ == "__main__":
    main()
