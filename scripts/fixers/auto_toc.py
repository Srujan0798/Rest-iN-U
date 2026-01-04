import os
import re

TARGET_DIR = r"c:\Users\Student\Documents\Rest-iN-U\Doxs\Dev Vault (ETERNAL MANUAL)"

def generate_toc(lines):
    toc = ["## TABLE OF CONTENTS\n\n"]
    in_code_block = False
    fence_len = 0
    
    for line in lines:
        stripped = line.strip()
        
        # Check for code block fence
        match = re.match(r'^(`{3,})', stripped)
        if match:
            current_fence_len = len(match.group(1))
            if not in_code_block:
                in_code_block = True
                fence_len = current_fence_len
                continue
            else:
                # Closing fence must be at least as long as opening fence AND have no info string
                if current_fence_len >= fence_len and len(stripped) == current_fence_len:
                    in_code_block = False
                    fence_len = 0
                continue
        
        if in_code_block:
            continue

        if line.startswith("## ") or line.startswith("### "):
            level = 2 if line.startswith("## ") else 3
            title = line.strip().lstrip("#").strip()
            # Explicitly remove asterisks and other common chars before regex
            clean_title = title.lower().replace('*', '').replace(' ', '-')
            anchor = re.sub(r'[^a-z0-9\-]', '', clean_title)
            indent = "  " * (level - 2)
            toc.append(f"{indent}- [{title}](#{anchor})\n")
    toc.append("\n---\n\n")
    return toc

def fix_file(filepath):
    with open(filepath, 'r', encoding='utf-8-sig', errors='ignore') as f:
        lines = f.readlines()

    filename = os.path.basename(filepath)
    
    # 1. Ensure H1 Title
    h1_found = False
    for i, line in enumerate(lines[:5]):
        if line.startswith("# "):
            h1_found = True
            break
    
    new_lines = []
    if not h1_found:
        title_name = filename.replace(".md", "").replace("_", " ").upper()
        title_name = re.sub(r'^\d+\s*', '', title_name)
        new_lines.append(f"# {title_name}\n\n")

    # 2. Filter out OLD TOC (Safe Mode)
    # We only skip lines starting from "TABLE OF CONTENTS" until the NEXT Header (#) or "---"
    clean_lines = []
    skipping_toc = False
    toc_removed = False
    
    for line in lines:
        if not toc_removed and ("TABLE OF CONTENTS" in line.upper() or "## CONTENTS" in line.upper()):
            skipping_toc = True
            continue
        
        if skipping_toc:
            # Stop skipping if we hit a header or a separator
            if line.strip().startswith("#") or line.strip() == "---":
                skipping_toc = False
                toc_removed = True
                # Don't consume the stop-line, add it to clean_lines
                clean_lines.append(line)
            continue
            
        clean_lines.append(line)

    # 3. Generate NEW TOC
    toc = generate_toc(clean_lines)
    
    # 4. Assemble
    final_lines = []
    if not h1_found:
        final_lines.extend(new_lines) # The new H1
    
    # Insert TOC after H1
    inserted_toc = False
    for line in clean_lines:
        final_lines.append(line)
        if not inserted_toc and line.startswith("# "):
            final_lines.append("\n") # Add blank line for MD022
            final_lines.extend(toc)
            inserted_toc = True
            
    # If H1 was added at the start, we already added it, so we need to insert TOC after it.
    # But wait, if h1_found is False, we added H1 to new_lines, then we iterate clean_lines.
    # clean_lines won't have the H1. So we need to add TOC after new_lines[0].
    
    if not h1_found:
        # We added H1. Now we need to add TOC.
        # But we already appended new_lines (H1) to final_lines.
        # And we iterated clean_lines.
        # So TOC is missing!
        
        # Reset and do it correctly for the "No H1" case
        final_lines = []
        final_lines.extend(new_lines) # H1
        final_lines.extend(toc)       # TOC
        final_lines.extend(clean_lines) # Content
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.writelines(final_lines)
    print(f"Fixed: {filename}")

def main():
    print("Starting Auto-TOC Generation...")
    for root, dirs, files in os.walk(TARGET_DIR):
        if "1M S Dev" in root or "BACKUP" in root: continue
        for file in files:
            if file.endswith(".md") and "00_MASTER_INDEX" not in file and "00_BRAIN_INDEX" not in file:
                fix_file(os.path.join(root, file))
    print("Auto-TOC Complete.")

if __name__ == "__main__":
    main()
