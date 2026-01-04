import re
import sys

def clean_headers(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        lines = f.readlines()

    new_lines = []
    for line in lines:
        # Replace '## ?? TITLE' with '## TITLE'
        # Regex: Start of line, 1 or more #, space, 1 or more ?, space
        new_line = re.sub(r'^(#+)\s+\?+\s+', r'\1 ', line)
        new_lines.append(new_line)

    with open(file_path, 'w', encoding='utf-8') as f:
        f.writelines(new_lines)
    print(f"Cleaned headers in {file_path}")

if __name__ == "__main__":
    if len(sys.argv) > 1:
        clean_headers(sys.argv[1])
    else:
        print("Usage: python clean_headers.py <file_path>")
