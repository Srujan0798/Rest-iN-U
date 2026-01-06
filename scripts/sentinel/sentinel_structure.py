import os
import re
import sys

def check_structure(filepath, fix=False):
    issues = []
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original_content = content
        
        # 1. Check for Multiple H1 Headers
        h1_matches = re.findall(r'(?m)^# ', content)
        if len(h1_matches) > 1:
            issues.append(f"STRUCTURE: Multiple H1 headers found ({len(h1_matches)})")
            if fix:
                lines = content.splitlines()
                h1_count = 0
                new_lines = []
                for line in lines:
                    if line.startswith('# '):
                        h1_count += 1
                        if h1_count > 1:
                            new_lines.append('#' + line) # Downgrade to H2
                        else:
                            new_lines.append(line)
                    else:
                        new_lines.append(line)
                content = '\n'.join(new_lines) + '\n'

        # Save if fixed
        if fix and content != original_content:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            return ["FIXED: Structural issues resolved"]
            
    except Exception as e:
        return [f"ERROR: Could not process file - {e}"]
        
    return issues

def scan_directory(root_dir, fix=False):
    print(f"SENTINEL STRUCTURE: Scanning {root_dir} (Fix Mode: {fix})")
    total_issues = 0
    
    for root, dirs, files in os.walk(root_dir):
        for file in files:
            if file.endswith(".md"):
                filepath = os.path.join(root, file)
                issues = check_structure(filepath, fix)
                if issues:
                    total_issues += 1
                    print(f"[!] {file}: {', '.join(issues)}")
    
    if total_issues == 0:
        print("SENTINEL STRUCTURE: [OK] Clean")
    else:
        print(f"SENTINEL STRUCTURE: [FAIL] Found issues in {total_issues} files")

if __name__ == "__main__":
    fix_mode = "--fix" in sys.argv
    target_dir = sys.argv[1] if len(sys.argv) > 1 and not sys.argv[1].startswith("-") else r"c:\Users\Student\Documents\Rest-iN-U\docs"
    scan_directory(target_dir, fix_mode)
