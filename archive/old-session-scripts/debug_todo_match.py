import re

filepath = r"c:\Users\Student\Documents\Rest-iN-U\Doxs\Dev Vault (ETERNAL MANUAL)\KNOWLEDGE\01_Frontend.md"

with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
    lines = f.readlines()

pattern = r'\bTODO\b'

print(f"Scanning {filepath} for {pattern}...")
for i, line in enumerate(lines):
    if re.search(pattern, line, re.IGNORECASE):
        print(f"Line {i+1}: {line.strip()}")
