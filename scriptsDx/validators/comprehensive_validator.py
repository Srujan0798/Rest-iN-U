import os
import re
import urllib.parse

# Configuration
ROOT_DIRS = [
    r"c:\Users\Student\Documents\Rest-iN-U\Doxs\Dev Vault (ETERNAL MANUAL)\KNOWLEDGE",
    r"c:\Users\Student\Documents\Rest-iN-U\Doxs\Dev Vault (ETERNAL MANUAL)\BRAIN",
    r"c:\Users\Student\Documents\Rest-iN-U\Doxs\Dev Vault (ETERNAL MANUAL)" # For README.md
]

TITAN_INDICATORS = [
    "Titan Pattern", "Scar", "Incident", "Disaster", 
    "Real-world", "Production", "Scale", "Decision Tree",
    "Deep Dive", "Checklist", "Protocol"
]

WEAK_INDICATORS = [
    r'\bTODO\b', r'\bFIXME\b', r'\bCOMING SOON\b', r'\bTBD\b', 
    r'\bLorem ipsum\b', r'\bInsert text\b', r'\bUnder Construction\b'
]

def slugify(text):
    """
    Convert header text to a slug (anchor).
    This needs to match the logic used by VS Code or GitHub.
    Usually: lowercase, remove special chars, replace spaces with dashes.
    """
    # Match auto_toc.py logic:
    # anchor = re.sub(r'[^a-z0-9\-]', '', title.lower().replace(' ', '-'))
    text = text.lower().replace(' ', '-')
    text = re.sub(r'[^a-z0-9\-]', '', text)
    return text

def get_anchors_in_file(filepath):
    anchors = set()
    try:
        with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
            for line in f:
                if line.strip().startswith('#'):
                    # Extract header text
                    header_text = re.sub(r'^#+\s+', '', line.strip())
                    anchors.add(slugify(header_text))
    except Exception as e:
        print(f"Error reading {filepath}: {e}")
    return anchors

def validate_file(filepath, all_files_map):
    issues = []
    
    try:
        with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
            content = f.read()
            lines = content.split('\n')
            
        # 1. Content Quality
        titan_hits = [i for i in TITAN_INDICATORS if i.lower() in content.lower()]
        weak_hits = []
        for pattern in WEAK_INDICATORS:
            if re.search(pattern, content, re.IGNORECASE):
                weak_hits.append(pattern.replace(r'\b', ''))
        
        if weak_hits:
            issues.append(f"[QUALITY] Found weak indicators: {', '.join(weak_hits)}")
            
        # 2. Link Validation (Line by line to respect code blocks)
        in_code_block = False
        for i, line in enumerate(lines):
            # Check for code block toggle
            if line.strip().startswith('```'):
                if not in_code_block:
                    # Opening fence
                    lang = line.strip()[3:].strip()
                    if not lang:
                        issues.append(f"[CODE] Missing language at line {i+1}: '{line.strip()}'")
                in_code_block = not in_code_block
                continue
            
            if in_code_block:
                continue

            # Validate Links in this line
            links = re.findall(r'\[([^\]]+)\]\(([^)]+)\)', line)
            for text, link in links:
                # Ignore external links
                if link.startswith('http'):
                    continue
                
                # Parse link
                if '#' in link:
                    target_file, anchor = link.split('#', 1)
                else:
                    target_file, anchor = link, None
                    
                # Resolve target file
                if target_file:
                    target_path = os.path.abspath(os.path.join(os.path.dirname(filepath), target_file))
                    
                    if not os.path.exists(target_path):
                        basename = os.path.basename(target_file)
                        if basename in all_files_map:
                            target_path = all_files_map[basename]
                        else:
                            issues.append(f"[LINK] Broken file link: {link} at line {i+1}")
                            continue
                else:
                    target_path = filepath
                    
                # Validate anchor
                if anchor:
                    target_anchors = get_anchors_in_file(target_path)
                    if anchor not in target_anchors:
                        decoded_anchor = urllib.parse.unquote(anchor)
                        if decoded_anchor not in target_anchors:
                            issues.append(f"[LINK] Broken anchor: #{anchor} in {os.path.basename(target_path)} at line {i+1}")

            # Validate Images in this line
            images = re.findall(r'!\[([^\]]*)\]\(([^)]+)\)', line)
            for alt, src in images:
                if not alt.strip():
                    issues.append(f"[IMAGE] Missing alt text for {src} at line {i+1}")
                
    except Exception as e:
        issues.append(f"[ERROR] Failed to process file: {e}")
        
    return issues

def main():
    print("Starting Comprehensive Validation...\n")
    
    # 1. Map all MD files
    all_files_map = {}
    all_files_list = []
    
    for root_dir in ROOT_DIRS:
        if os.path.isfile(root_dir): # Handle single file case
             if root_dir.endswith(".md"):
                all_files_map[os.path.basename(root_dir)] = root_dir
                all_files_list.append(root_dir)
             continue

        for root, dirs, files in os.walk(root_dir):
            if "BACKUP" in root: continue
            for file in files:
                if file.endswith(".md"):
                    full_path = os.path.join(root, file)
                    if file not in all_files_map:
                        all_files_map[file] = full_path
                        all_files_list.append(full_path)
                    
    # 2. Validate each file
    total_issues = 0
    for filepath in all_files_list:
        # Skip excluded files
        if "6  mode 3.md" in filepath:
            continue
            
        issues = validate_file(filepath, all_files_map)
        if issues:
            print(f"\nFile: {os.path.basename(filepath)}")
            for issue in issues:
                print(f"  - {issue}")
                total_issues += 1
                
    print(f"\nValidation Complete. Found {total_issues} issues.")

if __name__ == "__main__":
    main()
