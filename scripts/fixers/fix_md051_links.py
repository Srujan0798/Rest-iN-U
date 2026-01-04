import os
import re

def fix_md051(file_path):
    """
    Fixes MD051 (link fragments should be valid).
    1. Generates a map of all anchors (headers) in the file.
    2. Scans for internal links [text](#fragment).
    3. Tries to fuzzy match broken fragments to existing anchors.
    4. Updates the link if a match is found.
    """
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    lines = content.split('\n')
    
    # 1. Generate Anchor Map
    # GitHub style: lowercase, spaces to dashes, remove punctuation
    anchors = set()
    anchor_map = {} # normalized -> original header text
    
    for line in lines:
        if line.startswith('#'):
            # Remove # and strip
            header_text = line.lstrip('#').strip()
            # Normalize
            normalized = header_text.lower().replace(' ', '-').replace('?', '').replace('!', '').replace(':', '').replace('.', '').replace(',', '').replace('(', '').replace(')', '').replace("'", "").replace('"', "")
            # Handle duplicates (GitHub appends -1, -2 etc, but for now let's just store base)
            anchors.add(normalized)
            anchor_map[normalized] = header_text

    # 2. Scan and Fix Links
    new_lines = []
    fixed_count = 0
    
    link_pattern = re.compile(r'\[([^\]]+)\]\(#([^\)]+)\)')
    
    for line in lines:
        matches = link_pattern.findall(line)
        new_line = line
        
        for text, fragment in matches:
            if fragment not in anchors:
                # Broken link found!
                # Try to find a close match in anchors
                # Simple heuristic: check if fragment is a substring of an anchor or vice versa
                # Or if they share significant words
                
                best_match = None
                
                # Strategy 1: Exact match but with different punctuation handling? 
                # (Already normalized anchors, so maybe fragment is just slightly off)
                
                # Strategy 2: "Volume X" matching
                # If fragment is "volume-1-the-scars", and anchor is "volume-1-the-scars-the-why"
                
                for anchor in anchors:
                    if fragment in anchor or anchor in fragment:
                        # Potential match
                        # Prefer the one that is most similar length
                        if best_match is None:
                            best_match = anchor
                        else:
                            # If new match is closer in length to fragment
                            if abs(len(anchor) - len(fragment)) < abs(len(best_match) - len(fragment)):
                                best_match = anchor
                
                if best_match:
                    # print(f"Fixing: #{fragment} -> #{best_match}")
                    new_line = new_line.replace(f'(#{fragment})', f'(#{best_match})')
                    fixed_count += 1
        
        new_lines.append(new_line)

    if fixed_count > 0:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write('\n'.join(new_lines))
        print(f"Fixed {fixed_count} links in {os.path.basename(file_path)}")
        return True
    return False

def main():
    root_dir = r"c:\Users\Student\Documents\Rest-iN-U\Doxs\Dev Vault (ETERNAL MANUAL)\KNOWLEDGE"
    print("Starting MD051 Fixer...")
    
    for filename in os.listdir(root_dir):
        if filename.endswith(".md"):
            file_path = os.path.join(root_dir, filename)
            fix_md051(file_path)
            
    print("MD051 Fixer Complete.")

if __name__ == "__main__":
    main()
