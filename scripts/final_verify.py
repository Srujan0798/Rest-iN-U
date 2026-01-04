import os
import sys

# Configuration
TARGET_DIR = r"c:\Users\Student\Documents\Rest-iN-U"
BACKUP_SUFFIX = ".bak_corrupt"

# All known corruption byte patterns
CORRUPTION_PATTERNS = [
    b'\xc3\x83',  # Ãƒ - Most common Mojibake start
    b'\xc3\x82',  # Ã‚
    b'\xc3\xa2',  # Ã¢
    b'\xc7\x9f',  # ǟ
    b'\xc6\x92',  # Æ'
    b'\xe2\x80\x99',  # '
    b'\xe2\x80\x9c',  # "
    b'\xe2\x80\x9d',  # "
]

def scan_file(filepath):
    """Scans a file for any remaining corruption patterns."""
    try:
        with open(filepath, 'rb') as f:
            content = f.read()
    except Exception as e:
        return f"ERROR: {e}"
    
    issues = []
    for pattern in CORRUPTION_PATTERNS:
        count = content.count(pattern)
        if count > 0:
            # Find first occurrence for context
            idx = content.find(pattern)
            start = max(0, idx - 20)
            end = min(len(content), idx + 40)
            context = content[start:end]
            issues.append({
                'pattern': pattern.hex(),
                'count': count,
                'context': context
            })
    
    return issues

def main():
    print(f"=== FINAL VERIFICATION SCAN ===")
    print(f"Scanning all .md files in {TARGET_DIR}...")
    print()
    
    total_files = 0
    clean_files = 0
    corrupted_files = []
    
    for root, dirs, files in os.walk(TARGET_DIR):
        # Skip backup files and node_modules
        dirs[:] = [d for d in dirs if d != 'node_modules' and d != '.git']
        
        for file in files:
            if file.endswith(".md") and not file.endswith(BACKUP_SUFFIX):
                # Skip full backup files
                if "FULL_BACKUP" in file or "BACKUP_DO_NOT_COMMIT" in file:
                    continue
                    
                filepath = os.path.join(root, file)
                total_files += 1
                issues = scan_file(filepath)
                
                if not issues:
                    clean_files += 1
                else:
                    corrupted_files.append((filepath, issues))
    
    print(f"Total files scanned: {total_files}")
    print(f"Clean files: {clean_files}")
    print(f"Files with issues: {len(corrupted_files)}")
    print()
    
    if corrupted_files:
        print("=== FILES WITH REMAINING CORRUPTION ===")
        for filepath, issues in corrupted_files:
            print(f"\n{filepath}:")
            for issue in issues:
                print(f"  Pattern: {issue['pattern']} (found {issue['count']} times)")
                # Only print context if it's manageable
                if len(issue['context']) < 100:
                    try:
                        print(f"  Context: {issue['context']}")
                    except:
                        print(f"  Context: [binary data]")
    else:
        print("=== ALL FILES ARE CLEAN! ===")
        print("No corruption patterns detected in any file.")

if __name__ == "__main__":
    main()
