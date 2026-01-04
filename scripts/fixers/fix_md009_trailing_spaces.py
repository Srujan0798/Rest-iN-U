import os

VAULT_DIR = r"c:\Users\Student\Documents\Rest-iN-U\Doxs\Dev Vault (ETERNAL MANUAL)\KNOWLEDGE"

def fix_file(filepath):
    with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
        lines = f.readlines()
        
    new_lines = []
    modified = False
    
    for line in lines:
            
        stripped_right = line.rstrip()
        # If line was just newline, stripped_right is empty string
        if not stripped_right:
            if line != "\n": # It had spaces
                new_lines.append("\n")
                modified = True
            else:
                new_lines.append(line)
        else:
            # It had content
            new_line = stripped_right + "\n"
            if new_line != line:
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
    print("Running MD009 Fixer (Trailing Spaces)...")
    fixed_count = 0
    for f in os.listdir(VAULT_DIR):
        if f.endswith(".md"):
            if fix_file(os.path.join(VAULT_DIR, f)):
                print(f"Fixed {f}")
                fixed_count += 1
    print(f"MD009 Fix Complete. Modified {fixed_count} files.")

if __name__ == "__main__":
    main()
