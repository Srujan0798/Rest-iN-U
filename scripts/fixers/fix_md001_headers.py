import os

VAULT_DIR = r"c:\Users\Student\Documents\Rest-iN-U\Doxs\Dev Vault (ETERNAL MANUAL)\KNOWLEDGE"

def fix_file(filepath):
    with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
        lines = f.readlines()
        
    new_lines = []
    last_level = 0
    modified = False
    
    in_code_block = False
    line_num = 0
    
    for line in lines:
        line_num += 1
        stripped = line.strip()
        
        if "09_Mobile.md" in filepath and line_num == 840:
             print(f"DEBUG: Line 840. Stripped: '{stripped}'. Level: {len(stripped.split()[0]) if stripped.startswith('#') else 'N/A'}. Last Level: {last_level}. In Code Block: {in_code_block}")
        
        # Track code blocks
        if stripped.startswith("```"):
            if len(stripped) > 3: 
                in_code_block = not in_code_block
            else:
                in_code_block = not in_code_block
            new_lines.append(line)
            continue
            
        if stripped.startswith("#") and not in_code_block:
            # Calculate current level
            parts = stripped.split()
            hashes = parts[0]
            # Ensure it's only hashes
            if not all(c == '#' for c in hashes):
                 new_lines.append(line)
                 continue
                 
            level = len(hashes)
            
            # Check for jump
            # If level > last_level + 1, we clamp it
            # Exception: H1 is always allowed (reset)
            if level == 1:
                last_level = 1
                new_lines.append(line)
                continue
                
            if level > last_level + 1:
                # Fix it!
                new_level = last_level + 1
                # Reconstruct line
                content = stripped[level:].strip()
                new_line = "#" * new_level + " " + content + "\n"
                new_lines.append(new_line)
                modified = True
                last_level = new_level
            else:
                last_level = level
                new_lines.append(line)
        else:
            new_lines.append(line)
            
    if modified:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.writelines(new_lines)
        return True
    return False

def main():
    print("Running MD001 Fixer (Header Increment)...")
    fixed_count = 0
    for f in os.listdir(VAULT_DIR):
        if f.endswith(".md"):
            if fix_file(os.path.join(VAULT_DIR, f)):
                print(f"Fixed {f}")
                fixed_count += 1
    print(f"MD001 Fix Complete. Modified {fixed_count} files.")

if __name__ == "__main__":
    main()
