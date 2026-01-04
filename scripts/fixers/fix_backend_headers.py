import os

TARGET_FILE = r"c:\Users\Student\Documents\Rest-iN-U\Doxs\Dev Vault (ETERNAL MANUAL)\KNOWLEDGE\02_Backend.md"

def fix_backend_headers():
    with open(TARGET_FILE, 'r', encoding='utf-8') as f:
        lines = f.readlines()

    new_lines = []
    for i, line in enumerate(lines):
        # Fix MD022: Insert newline between H1 and H2 at the top
        if i == 1 and line.startswith("## TABLE OF CONTENTS") and not lines[i-1].strip() == "":
             new_lines.append("\n")

        # Promote Main Section
        if line.startswith("### Production-Grade Node.js"):
            new_lines.append(line.replace("### ", "## ", 1))
            continue

        # Promote Volumes
        if line.startswith("#### VOLUME"):
            new_lines.append(line.replace("#### ", "### ", 1))
            continue

        # Promote H5 to H4 (Subsections of Volumes)
        if line.startswith("##### "):
            new_lines.append(line.replace("##### ", "#### ", 1))
            continue

        # Demote specific H3 to H4 (to be inside Volumes)
        if line.startswith("### DECISION TREE") or line.startswith("### DEEP DIVE"):
            new_lines.append(line.replace("### ", "#### ", 1))
            continue

        new_lines.append(line)

    with open(TARGET_FILE, 'w', encoding='utf-8') as f:
        f.writelines(new_lines)
    print("Fixed headers in 02_Backend.md")

if __name__ == "__main__":
    fix_backend_headers()
