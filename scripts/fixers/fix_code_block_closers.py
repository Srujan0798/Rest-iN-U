import os

VAULT_DIR = r"c:\Users\Student\Documents\Rest-iN-U\Doxs\Dev Vault (ETERNAL MANUAL)\KNOWLEDGE"

def fix_file(filepath):
    with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
        lines = f.readlines()
        
    new_lines = []
    in_block = False
    modified = False
    
    for line in lines:
        stripped = line.strip()
        
        if stripped.startswith("```"):
            if in_block:
                # We are closing a block
                # It SHOULD be just ```
                if stripped != "```":
                    # It has language info, e.g. ```text
                    # This is likely a typo where they copied the opener to close
                    new_lines.append("```\n")
                    modified = True
                else:
                    new_lines.append(line)
                in_block = False
            else:
                # We are opening a block
                new_lines.append(line)
                in_block = True
        else:
            new_lines.append(line)
            
    if modified:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.writelines(new_lines)
        return True
    return False

def main():
    print("Running Code Block Closer Fixer...")
    fixed_count = 0
    for f in os.listdir(VAULT_DIR):
        if f.endswith(".md"):
            if fix_file(os.path.join(VAULT_DIR, f)):
                print(f"Fixed {f}")
                fixed_count += 1
    print(f"Code Block Closer Fix Complete. Modified {fixed_count} files.")

if __name__ == "__main__":
    main()
