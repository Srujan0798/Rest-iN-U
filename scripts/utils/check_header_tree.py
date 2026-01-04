import os
import sys

def print_tree(filepath):
    if not os.path.exists(filepath):
        print(f"File not found: {filepath}")
        return

    print(f"Scanning: {os.path.basename(filepath)}")
    with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
        lines = f.readlines()

    in_code_block = False
    for i, line in enumerate(lines):
        stripped = line.strip()
        if stripped.startswith("```"):
            in_code_block = not in_code_block
            continue
        
        if stripped.startswith("#") and not in_code_block:
            parts = stripped.split()
            hashes = parts[0]
            if all(c == '#' for c in hashes):
                level = len(hashes)
                title = stripped[level:].strip()
                indent = "  " * (level - 1)
                print(f"{indent}{hashes} {title} (Line {i+1})")

if __name__ == "__main__":
    if len(sys.argv) > 1:
        print_tree(sys.argv[1])
    else:
        print("Usage: python check_header_tree.py <filepath>")
