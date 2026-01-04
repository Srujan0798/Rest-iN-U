import os
import re

TARGET_DIR = r"c:\Users\Student\Documents\Rest-iN-U\Doxs\Dev Vault (ETERNAL MANUAL)"

def fix_headers(filepath):
    with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
        lines = f.readlines()

    filename = os.path.basename(filepath)
    modified = False
    new_lines = []
    
    # Track current header level context
    # We assume H1 is level 1.
    # If we see H4 but current context is H2, we promote H4 to H3.
    
    last_level = 1
    
    for i, line in enumerate(lines):
        if line.startswith("#"):
            match = re.match(r"^(#+)\s", line)
            if match:
                current_level = len(match.group(1))
                
                # Logic: You can only go +1 deeper than last_level.
                # You can go back up to any level <= last_level.
                
                if current_level > last_level + 1:
                    # Found a skip (e.g. H2 -> H4)
                    # Fix: Promote it to last_level + 1
                    new_level = last_level + 1
                    # But wait, what if it's H1 -> H4? Then H2.
                    # Actually, let's just force it to be last_level + 1
                    
                    # Special case: If we are at H1, and see H4, maybe it should be H2.
                    
                    fixed_line = "#" * new_level + line[current_level:]
                    new_lines.append(fixed_line)
                    modified = True
                    last_level = new_level
                else:
                    new_lines.append(line)
                    last_level = current_level
            else:
                new_lines.append(line)
        else:
            new_lines.append(line)

    if modified:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.writelines(new_lines)
        print(f"Fixed Headers: {filename}")

def main():
    print("Starting Header Hierarchy Fix...")
    for root, dirs, files in os.walk(TARGET_DIR):
        if "1M S Dev" in root: continue
        for file in files:
            if file.endswith(".md"):
                fix_headers(os.path.join(root, file))
    print("Header Fix Complete.")

if __name__ == "__main__":
    main()
