
filename = r"c:\Users\Student\Documents\Rest-iN-U\Doxs\Dev Vault (ETERNAL MANUAL)\KNOWLEDGE\02_Backend.md"
with open(filename, 'r', encoding='utf-8', errors='ignore') as f:
    lines = f.readlines()

for i, line in enumerate(lines):
    if "THIS IS THE PROBLEM" in line:
        print(f"Line {i+1}: {line.strip()}")
    if "KAFKA PRODUCER" in line:
        print(f"Line {i+1}: {line.strip()}")
