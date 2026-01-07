import os
import re

TARGET_DIR = r"c:\Users\Student\Documents\Rest-iN-U\Doxs\Dev Vault (ETERNAL MANUAL)\KNOWLEDGE"

def kill_gaps(filepath):
    with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read()

    original_len = len(content)
    
    # 1. Normalize line endings to \n
    content = content.replace('\r\n', '\n').replace('\r', '\n')
    
    # 2. Remove whitespace from blank lines
    content = re.sub(r'^[ \t]+$', '', content, flags=re.MULTILINE)

    # 3. Reduce 3+ newlines to 2 (Max 1 blank line)
    # \n\n\n -> \n\n
    content = re.sub(r'\n{3,}', '\n\n', content)
    
    # 3. Remove blank lines at start of file
    content = content.lstrip('\n')
    
    # 4. Remove blank lines at end of file
    content = content.rstrip() + '\n'
    
    # 5. Ensure headers have exactly 1 blank line before them (unless it's the first line)
    # (Already handled by step 2 mostly, but let's be sure)
    
    # 6. Fix list gaps?
    # Some lists have \n\n between items, making them loose.
    # If the user wants "dense", we might want to tighten lists.
    # But be careful not to break sub-lists.
    # Let's stick to the "Max 1 blank line" rule which step 2 handles.
    
    # 7. Ensure separators have correct spacing
    # \n---\n should be \n\n---\n\n
    # content = re.sub(r'\n?---\n?', '\n\n---\n\n', content)
    # Wait, step 2 might have reduced it.
    # Let's standardize separators:
    # content = re.sub(r'\n*---\n*', '\n\n---\n\n', content)
    # Then run step 2 again to clean up if we added too many.
    
    # 7. Collapse multiple separators (--- ... ---) into one
    # Regex: Match one or more occurrences of (--- followed by whitespace)
    content = re.sub(r'(---\s*)+', '---\n', content)
    
    # 8. Ensure separators have correct spacing
    content = re.sub(r'\n*---\n*', '\n\n---\n\n', content)
    content = re.sub(r'\n{3,}', '\n\n', content)

    # 9. Remove blank lines at end of file (FINAL STEP)
    content = content.rstrip() + '\n'

    if len(content) != original_len:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Killed Gaps: {os.path.basename(filepath)} (Saved {original_len - len(content)} bytes)")
        return True
    return False

def main():
    print("Starting Aggressive Gap Removal...")
    count = 0
    for root, dirs, files in os.walk(TARGET_DIR):
        if "1M S Dev" in root or "BACKUP" in root: continue
        for file in files:
            if file.endswith(".md"):
                if kill_gaps(os.path.join(root, file)):
                    count += 1
    print(f"Gap Removal Complete. Updated {count} files.")

if __name__ == "__main__":
    main()
