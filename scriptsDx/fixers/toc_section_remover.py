import os
import re
import sys

def remove_toc(file_path):
    with open(file_path, 'r', encoding='utf-8', errors='replace') as f:
        lines = f.readlines()

    new_lines = []
    in_toc = False
    toc_removed = False
    
    for line in lines:
        if re.match(r'^##\s+TABLE OF CONTENTS', line, re.IGNORECASE) or \
           re.match(r'^##\s+CONTENTS', line, re.IGNORECASE):
            in_toc = True
            toc_removed = True
            continue
        
        if in_toc:
            # End of TOC: next header
            if re.match(r'^#{1,2}\s+[^#]', line):
                in_toc = False
                new_lines.append(line)
            continue
        
        new_lines.append(line)

    if toc_removed:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.writelines(new_lines)
        return True
    return False

def main():
    if len(sys.argv) > 1:
        target_dir = sys.argv[1]
    else:
        target_dir = os.getcwd()

    print(f"Removing TOCs in: {target_dir}")
    
    count = 0
    for root, dirs, files in os.walk(target_dir):
        for file in files:
            if file.endswith('.md'):
                file_path = os.path.join(root, file)
                if remove_toc(file_path):
                    print(f"[REMOVED] {file}")
                    count += 1
    
    print(f"\nTotal TOCs removed: {count}")

if __name__ == "__main__":
    main()
