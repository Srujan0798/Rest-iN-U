import os
import re

VAULT_DIR = r"c:\Users\Student\Documents\Rest-iN-U\Doxs\Dev Vault (ETERNAL MANUAL)\KNOWLEDGE"

def fix_file(filepath):
    with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
        lines = f.readlines()
        
    new_lines = []
    modified = False
    
    for line in lines:
        # Check if line starts with * (possibly indented)
        # Regex: ^(\s*)\*(\s+)
        match = re.match(r"^(\s*)\*(\s+)(.*)", line)
        if match:
            # Reconstruct with dash
            indent = match.group(1)
            space_after = match.group(2)
            content = match.group(3)
            new_line = f"{indent}-{space_after}{content}\n"
            new_lines.append(new_line)
            modified = True
        else:
            new_lines.append(line)
            
    if modified:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.writelines(new_lines)
        return True
    return False

def main():
    print("Running MD004 Fixer (List Style)...")
    fixed_count = 0
    for f in os.listdir(VAULT_DIR):
        if f.endswith(".md"):
            if fix_file(os.path.join(VAULT_DIR, f)):
                print(f"Fixed {f}")
                fixed_count += 1
    print(f"MD004 Fix Complete. Modified {fixed_count} files.")

if __name__ == "__main__":
    main()
