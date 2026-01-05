#!/usr/bin/env python3
import sys

def analyze_structure(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        lines = f.readlines()

    print(f"Analyzing {file_path} ({len(lines)} lines)...")
    print("-" * 60)
    print(f"{'Line':<8} | {'Level':<5} | {'Content'}")
    print("-" * 60)

    for i, line in enumerate(lines):
        line = line.strip()
        if line.startswith('##'):
            # Check if it's a header (H2, H3, H4)
            # We care mostly about H2 (##) for Volumes
            if line.startswith('## ') or line.startswith('### ') or line.startswith('#### '):
                level = len(line.split()[0])
                content = line[level:].strip()
                print(f"{i+1:<8} | H{level:<4} | {content}")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python analyze_structure.py <file>")
        sys.exit(1)
    analyze_structure(sys.argv[1])
