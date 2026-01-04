import os

VAULT_DIR = r"c:\Users\Student\Documents\Rest-iN-U\Doxs\Dev Vault (ETERNAL MANUAL)\KNOWLEDGE"

def fix_file(filepath):
    with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
        lines = f.readlines()
        
    new_lines = []
    blank_count = 0
    
    for line in lines:
        if not line.strip():
            blank_count += 1
        else:
            blank_count = 0
            
        # Logic: Allow max 1 blank line (which means 2 newlines in a row)
        # If blank_count > 1, skip this line
        if blank_count > 1:
            continue
            
        new_lines.append(line)
        
    # Write back if changed
    if len(new_lines) != len(lines):
        with open(filepath, 'w', encoding='utf-8') as f:
            f.writelines(new_lines)
        return True
    return False

def main():
    print("Running MD012 Fixer (Multiple Blanks)...")
    fixed_count = 0
    for f in os.listdir(VAULT_DIR):
        if f.endswith(".md"):
            if fix_file(os.path.join(VAULT_DIR, f)):
                print(f"Fixed {f}")
                fixed_count += 1
    print(f"MD012 Fix Complete. Modified {fixed_count} files.")

if __name__ == "__main__":
    main()
