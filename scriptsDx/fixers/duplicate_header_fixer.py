import os
import re
import sys
from pathlib import Path

def fix_duplicate_headers(file_path):
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
    except UnicodeDecodeError:
        try:
            with open(file_path, 'r', encoding='latin-1') as f:
                content = f.read()
        except:
            print(f"Could not read {file_path}")
            return False

    lines = content.split('\n')
    new_lines = []
    headers = {}
    modified = False

    for line in lines:
        if line.strip().startswith('#'):
            header_match = re.match(r'^(#+)\s+(.*)', line.strip())
            if header_match:
                level = header_match.group(1)
                title = header_match.group(2)
                
                # Normalize title for tracking (match validator logic)
                normalized = re.sub(r'[`*_]', '', title)
                normalized = normalized.lower().strip()
                normalized = re.sub(r'\s+', '-', normalized)
                normalized = re.sub(r'[^\w\-]', '', normalized)
                
                if normalized in headers:
                    headers[normalized] += 1
                    # Append counter to title to make it unique
                    new_title = f"{title} {headers[normalized]}"
                    new_line = f"{level} {new_title}"
                    new_lines.append(new_line)
                    modified = True
                    print(f"  Fixed duplicate header: '{title}' -> '{new_title}'")
                else:
                    headers[normalized] = 1
                    new_lines.append(line)
            else:
                new_lines.append(line)
        else:
            new_lines.append(line)

    if modified:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write('\n'.join(new_lines))
        return True
    return False

def main():
    if len(sys.argv) > 1:
        target_dir = sys.argv[1]
    else:
        target_dir = os.getcwd()

    # Set stdout to utf-8
    sys.stdout.reconfigure(encoding='utf-8')

    print(f"Scanning for duplicate headers in: {target_dir}")
    
    count = 0
    for root, dirs, files in os.walk(target_dir):
        for file in files:
            if file.endswith('.md'):
                file_path = os.path.join(root, file)
                if fix_duplicate_headers(file_path):
                    print(f"[FIXED] {file}")
                    count += 1
    
    print(f"\nTotal files fixed: {count}")

if __name__ == "__main__":
    main()
