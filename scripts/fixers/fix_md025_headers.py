import os

VAULT_DIR = r"c:\Users\Student\Documents\Rest-iN-U\Doxs\Dev Vault (ETERNAL MANUAL)\KNOWLEDGE"

def fix_file(filepath):
    with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
        lines = f.readlines()
        
    new_lines = []
    h1_found = False
    modified = False
    
    in_code_block = False
    
    for line in lines:
        stripped = line.strip()
        
        # Track code blocks
        if stripped.startswith("```"):
            in_code_block = not in_code_block
            new_lines.append(line)
            continue
            
        if in_code_block:
            new_lines.append(line)
            continue
            
        if stripped.startswith("# "):
            # It's an H1
            if not h1_found:
                # First H1 is kept
                h1_found = True
                new_lines.append(line)
            else:
                # Subsequent H1s are demoted to H2
                new_lines.append("#" + line) # Add a hash
                modified = True
        else:
            new_lines.append(line)
            
    if modified:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.writelines(new_lines)
        return True
    return False

def main():
    print("Running MD025 Fixer (Multiple H1)...")
    fixed_count = 0
    for f in os.listdir(VAULT_DIR):
        if f.endswith(".md"):
            if fix_file(os.path.join(VAULT_DIR, f)):
                print(f"Fixed {f}")
                fixed_count += 1
    print(f"MD025 Fix Complete. Modified {fixed_count} files.")

if __name__ == "__main__":
    main()
