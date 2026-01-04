import os
import re

TARGET_DIR = r"c:\Users\Student\Documents\Rest-iN-U\Doxs\Dev Vault (ETERNAL MANUAL)\KNOWLEDGE"

def fix_hierarchy(filepath):
    with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
        lines = f.readlines()

    new_lines = []
    modified = False
    
    # Regex to find Volume headers (e.g., #### **VOLUME 1: ...**)
    # We want to change them to ## VOLUME 1: ...
    # Also handle "PART", "SECTION", "CHAPTER" if they are clearly major sections
    
    volume_pattern = re.compile(r'^(#+)\s+(?:\*\*)?(VOLUME|PART|SECTION|CHAPTER)\s+(\d+)(?::)?', re.IGNORECASE)
    
    for line in lines:
        match = volume_pattern.match(line)
        if match:
            current_hashes = match.group(1)
            keyword = match.group(2).upper()
            number = match.group(3)
            
            # If it's already H2, we might still want to standardize formatting
            # But primarily we want to promote H3/H4/H5 to H2
            
            # Extract the rest of the line (the title)
            # The regex matched up to the number. We need the rest.
            # Let's just reconstruct the line from scratch using the content.
            
            # Strip the original hashes and whitespace
            content = line.lstrip('#').strip()
            
            # Remove bolding if present in the content string (e.g. **VOLUME 1...**)
            content = content.replace('**', '')
            
            # Ensure keyword is uppercase
            # content starts with "Volume 1..." or "VOLUME 1..."
            # Let's rebuild it strictly: "VOLUME X: [Rest]"
            
            # Find where the number ends
            # We know the number is `number`
            # content looks like "Volume 1: The Scars"
            
            # Split by the number
            parts = re.split(f"{number}", content, 1)
            if len(parts) > 1:
                rest = parts[1].strip()
                # Ensure it starts with : or -
                if rest.startswith(':') or rest.startswith('-'):
                    rest = rest[1:].strip()
                
                # Reconstruct
                new_line = f"## {keyword} {number}: {rest}\n"
                
                if new_line != line:
                    new_lines.append(new_line)
                    modified = True
                else:
                    new_lines.append(line)
            else:
                # Fallback if split fails
                new_lines.append(f"## {content}\n")
                modified = True
        else:
            new_lines.append(line)

    if modified:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.writelines(new_lines)
        print(f"Promoted Hierarchy: {os.path.basename(filepath)}")
        return True
    return False

def main():
    print("Starting Titan Hierarchy Promotion (H2 Volumes)...")
    count = 0
    for root, dirs, files in os.walk(TARGET_DIR):
        if "1M S Dev" in root or "BACKUP" in root: continue
        for file in files:
            if file.endswith(".md") and "00_MASTER_INDEX" not in file:
                if fix_hierarchy(os.path.join(root, file)):
                    count += 1
    print(f"Hierarchy Promotion Complete. Updated {count} files.")

if __name__ == "__main__":
    main()
