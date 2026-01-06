import os
import re
import sys

def check_formatting(filepath, fix=False):
    issues = []
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original_content = content
        
        # 1. Check for Repeated Separators (The "Nonsense")
        if re.search(r'(?m)^---\s*\n(?:\s*\n)*---\s*$', content):
            issues.append("FORMAT: Repeated horizontal rules found")
            if fix:
                while re.search(r'(?m)^---\s*\n(?:\s*\n)*---\s*$', content):
                    content = re.sub(r'(?m)^---\s*\n(?:\s*\n)*---\s*$', '---', content)

        # 2. Check for Excessive Whitespace
        if re.search(r'\n{4,}', content):
            issues.append("FORMAT: Excessive vertical whitespace (>3 blank lines)")
            if fix:
                content = re.sub(r'\n{3,}', '\n\n', content)

        # 3. Check for Trailing Whitespace
        if re.search(r'[ \t]+$', content, flags=re.MULTILINE):
            issues.append("FORMAT: Trailing whitespace found")
            if fix:
                content = re.sub(r'[ \t]+$', '', content, flags=re.MULTILINE)

        # Save if fixed
        if fix and content != original_content:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            return ["FIXED: Formatting issues resolved"]
            
    except Exception as e:
        return [f"ERROR: Could not process file - {e}"]
        
    return issues

def scan_directory(root_dir, fix=False):
    print(f"SENTINEL FORMAT: Scanning {root_dir} (Fix Mode: {fix})")
    total_issues = 0
    
    for root, dirs, files in os.walk(root_dir):
        for file in files:
            if file.endswith(".md"):
                filepath = os.path.join(root, file)
                issues = check_formatting(filepath, fix)
                if issues:
                    total_issues += 1
                    print(f"[!] {file}: {', '.join(issues)}")
    
    if total_issues == 0:
        print("SENTINEL FORMAT: [OK] Clean")
    else:
        print(f"SENTINEL FORMAT: [FAIL] Found issues in {total_issues} files")

if __name__ == "__main__":
    fix_mode = "--fix" in sys.argv
    target_dir = sys.argv[1] if len(sys.argv) > 1 and not sys.argv[1].startswith("-") else r"c:\Users\Student\Documents\Rest-iN-U\docs"
    scan_directory(target_dir, fix_mode)
