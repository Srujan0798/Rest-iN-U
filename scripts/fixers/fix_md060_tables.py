import os
import re

VAULT_DIR = r"c:\Users\Student\Documents\Rest-iN-U\Doxs\Dev Vault (ETERNAL MANUAL)\KNOWLEDGE"

def fix_file(filepath):
    with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
        lines = f.readlines()
        
    new_lines = []
    in_code_block = False
    modified = False
    
    for line in lines:
        stripped = line.strip()
        
        # Track code blocks (ignore tables inside code)
        if stripped.startswith("```"):
            in_code_block = not in_code_block
            new_lines.append(line)
            continue
            
        if in_code_block:
            new_lines.append(line)
            continue
            
        # Check if it's a table row
        # Must contain |, not be empty, and look like a table
        if "|" in line and len(stripped) > 2:
            # Heuristic: starts and ends with | (optional) or contains multiple |
            if line.count("|") > 1:
                # Split by pipe
                parts = line.split("|")
                # Strip whitespace from each cell
                clean_parts = [p.strip() for p in parts]
                
                # Reconstruct with proper spacing
                # If the original line ended with newline, preserve it
                # If the original line started with |, the first part is empty string
                
                # Special case: Separator row (e.g. |---|---|)
                is_separator = all(re.match(r"^[\s\-:]+$", p) for p in clean_parts if p)
                
                if is_separator:
                    # Don't add spaces to separator lines usually, or do?
                    # Standard markdown: | --- | --- | is fine.
                    # But |---|---| is also fine.
                    # Let's standardize to | --- | --- |
                    new_line = " | ".join(clean_parts).rstrip()
                else:
                    new_line = " | ".join(clean_parts).rstrip()
                
                # Restore leading/trailing pipe if they existed (split creates empty strings at ends)
                # Actually " | ".join(["", "a", ""]) -> " | a | " which is perfect.
                
                new_line += "\n"
                
                if new_line != line:
                    new_lines.append(new_line)
                    modified = True
                else:
                    new_lines.append(line)
            else:
                new_lines.append(line)
        else:
            new_lines.append(line)
            
    if modified:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.writelines(new_lines)
        return True
    return False

def main():
    print("Running MD060 Fixer (Table Formatting)...")
    fixed_count = 0
    for f in os.listdir(VAULT_DIR):
        if f.endswith(".md"):
            if fix_file(os.path.join(VAULT_DIR, f)):
                print(f"Fixed {f}")
                fixed_count += 1
    print(f"MD060 Fix Complete. Modified {fixed_count} files.")

if __name__ == "__main__":
    main()
