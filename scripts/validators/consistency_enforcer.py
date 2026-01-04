import os
import re

TARGET_DIR = r"c:\Users\Student\Documents\Rest-iN-U\Doxs\Dev Vault (ETERNAL MANUAL)\KNOWLEDGE"

def check_order(filepath):
    with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read()
        
    issues = []
    filename = os.path.basename(filepath)
    
    # Define expected regex patterns in order
    patterns = [
        (r'^# ', "H1 Title"),
        (r'## TABLE OF CONTENTS', "TOC"),
        (r'> \*\*\?\? Disclaimer\*\*', "Disclaimer"),
        # (r'## ', "Main H2 Title"), # Optional or variable
        (r'> \*\*Status\*\*:', "Metadata Block"),
        (r'## VOLUME 1:', "Volume 1"),
        (r'## VOLUME 2:', "Volume 2"),
        (r'## VOLUME 3:', "Volume 3"),
        (r'## VOLUME 4:', "Volume 4"),
        (r'## VOLUME 5:', "Volume 5"),
        (r'## VOLUME 6:', "Volume 6")
    ]
    
    last_pos = -1
    
    for pattern, name in patterns:
        match = re.search(pattern, content, re.MULTILINE)
        if match:
            pos = match.start()
            if pos < last_pos:
                issues.append(f"Order Error: {name} found at {pos}, expected after previous element at {last_pos}")
            last_pos = pos
        else:
            issues.append(f"Missing Element: {name}")
            
    return issues

def main():
    print("Starting Consistency Enforcement...\n")
    print(f"{'FILE':<30} | {'ISSUES'}")
    print("-" * 80)
    
    total_issues = 0
    
    for root, dirs, files in os.walk(TARGET_DIR):
        if "1M S Dev" in root or "BACKUP" in root: continue
        for file in files:
            if file.endswith(".md") and "6  mode 3.md" not in file:
                # Exclude meta-files
                if file in ["00_MASTER_INDEX.md", "ADAPTATION_GUIDE.md"]: continue
                
                filepath = os.path.join(root, file)
                issues = check_order(filepath)
                
                if issues:
                    print(f"{file:<30} | {', '.join(issues)}")
                    total_issues += len(issues)
                    
    print("-" * 80)
    print(f"\nConsistency Check Complete. Found issues in {total_issues} files.")

if __name__ == "__main__":
    main()
