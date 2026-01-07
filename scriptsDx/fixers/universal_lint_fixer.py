import os
import re
import sys
from collections import defaultdict

def fix_md012(content):
    """Fix MD012: Multiple consecutive blank lines."""
    # Normalize line endings to \n
    content = content.replace('\r\n', '\n')
    
    # Remove trailing whitespace on lines first
    content = re.sub(r'[ \t]+$', '', content, flags=re.MULTILINE)
    
    # Replace 3 or more newlines with 2 (Standard Markdown paragraph break)
    content = re.sub(r'\n{3,}', '\n\n', content)
    
    return content

def fix_md022(content):
    """Fix MD022: Headings should be surrounded by blank lines."""
    lines = content.split('\n')
    new_lines = []
    in_code_block = False
    
    for i, line in enumerate(lines):
        if line.strip().startswith('```'):
            in_code_block = not in_code_block
            new_lines.append(line)
            continue
            
        if in_code_block:
            new_lines.append(line)
            continue
            
        # Check if line is a header
        if re.match(r'^#{1,6}\s', line):
            # Ensure blank line before (if not first line)
            if new_lines and new_lines[-1].strip() != '':
                new_lines.append('')
            
            new_lines.append(line)
            
            # Ensure blank line after (if not last line)
            # We can't easily look ahead in this loop structure for insertion, 
            # but we can ensure the NEXT iteration adds a blank if needed.
            # Actually, let's handle "after" by checking the next line in the loop if possible,
            # or just relying on the "before" check of the next element? 
            # No, "before" check of next element handles the gap between Header and Text.
            # But we need a gap between Header and Text.
            # So if we just appended a header, we should check if we need to append a blank.
            
        else:
            # Not a header
            # If previous line was a header, ensure we have a blank line
            if new_lines and re.match(r'^#{1,6}\s', new_lines[-1]):
                if line.strip() != '':
                     new_lines.append('')
            new_lines.append(line)
            
    return '\n'.join(new_lines)

def fix_md031_md032(content):
    """Fix MD031 (blanks around fences) and MD032 (blanks around lists)."""
    lines = content.split('\n')
    new_lines = []
    in_code_block = False
    
    for i, line in enumerate(lines):
        is_fence = line.strip().startswith('```')
        is_list_item = re.match(r'^(\s*[-*+]|\s*\d+\.)\s', line)
        
        if is_fence:
            # If starting a block, ensure blank before
            if not in_code_block:
                if new_lines and new_lines[-1].strip() != '':
                    new_lines.append('')
            
            new_lines.append(line)
            
            # If ending a block, ensure blank after (handled by next iteration's "blank before" logic? No.)
            # If we just closed a block, the next line should probably be blank if it's not empty.
            if in_code_block: # We just processed the closing fence
                 pass # We rely on the next line logic or a specific check
            
            in_code_block = not in_code_block
            continue
            
        if in_code_block:
            new_lines.append(line)
            continue
            
        # List item logic
        if is_list_item:
            # If previous line was NOT a list item and NOT a blank, add blank
            if new_lines and new_lines[-1].strip() != '' and not re.match(r'^(\s*[-*+]|\s*\d+\.)\s', new_lines[-1]):
                 new_lines.append('')
            new_lines.append(line)
        else:
            # Normal line
            # If previous line was a fence (closing), ensure blank
            if new_lines and new_lines[-1].strip().startswith('```') and line.strip() != '':
                new_lines.append('')
            # If previous line was a list item, ensure blank (end of list)
            elif new_lines and re.match(r'^(\s*[-*+]|\s*\d+\.)\s', new_lines[-1]) and line.strip() != '':
                new_lines.append('')
                
            new_lines.append(line)

    return '\n'.join(new_lines)

def fix_md025(content):
    """Fix MD025: Multiple top-level headings. Demote subsequent H1s to H2."""
    lines = content.split('\n')
    new_lines = []
    h1_count = 0
    in_code_block = False
    
    for line in lines:
        if line.strip().startswith('```'):
            in_code_block = not in_code_block
        
        if not in_code_block and line.startswith('# '):
            h1_count += 1
            if h1_count > 1:
                new_lines.append('#' + line) # Demote to H2
            else:
                new_lines.append(line)
        else:
            new_lines.append(line)
            
    return '\n'.join(new_lines)

def fix_md036(content):
    """Fix MD036: Emphasis as heading. Convert **Bold** on its own line to ### Bold."""
    lines = content.split('\n')
    new_lines = []
    in_code_block = False
    
    for line in lines:
        if line.strip().startswith('```'):
            in_code_block = not in_code_block
            new_lines.append(line)
            continue
            
        if in_code_block:
            new_lines.append(line)
            continue
            
        # Check for **Bold** or *Italic* on its own line
        # Regex: Start of line, optional whitespace, ** or __, content, ** or __, optional whitespace, end of line
        match = re.match(r'^\s*(\*\*|__)(.*?)\1\s*$', line)
        if match:
            # It's a bold line. Convert to H6 (safe bet) or H3? 
            # User previously used H6 for this fix.
            content_text = match.group(2)
            new_lines.append(f'###### {content_text}')
        else:
            new_lines.append(line)
            
    return '\n'.join(new_lines)

def fix_md060(content):
    """Fix MD060: Table column style (missing spaces)."""
    lines = content.split('\n')
    new_lines = []
    in_code_block = False
    
    for line in lines:
        if line.strip().startswith('```'):
            in_code_block = not in_code_block
        
        if not in_code_block and '|' in line:
            # Very naive check for table row
            # Ensure space after pipe if not present
            # |Text| -> | Text |
            # But don't touch | at start/end of line necessarily if it's just structure?
            # Regex replace: \|(?=[^ \n|]) -> | 
            # Regex replace: (?<=[^ \n|])\| ->  |
            
            # Add space after pipe if missing
            l = re.sub(r'\|(?=[^ \-\|])', '| ', line)
            # Add space before pipe if missing
            l = re.sub(r'(?<=[^ \-\|])\|', ' |', l)
            new_lines.append(l)
        else:
            new_lines.append(line)
            
    return '\n'.join(new_lines)

def fix_md001(content):
    """Fix MD001: Heading increment. Ensure no jumps (e.g. H2 -> H4)."""
    lines = content.split('\n')
    new_lines = []
    in_code_block = False
    last_level = 0
    
    for line in lines:
        if line.strip().startswith('```'):
            in_code_block = not in_code_block
            new_lines.append(line)
            continue
            
        if in_code_block:
            new_lines.append(line)
            continue
            
        match = re.match(r'^(#+)\s', line)
        if match:
            level = len(match.group(1))
            # If level jumps more than 1 from last_level (e.g. 2 -> 4)
            # Exception: H1 is always allowed (reset?) No, usually document has one H1.
            # If we are at H2, next can be H2 or H3. Not H4.
            if level > last_level + 1 and last_level > 0:
                # Exception: Allow VOLUME headers to be H4 even if parent is H2
                if "VOLUME" in line and level == 4:
                    new_lines.append(line)
                    last_level = level
                    continue

                # Fix: Reduce to last_level + 1
                new_level = last_level + 1
                new_lines.append('#' * new_level + line[level:])
                last_level = new_level
            else:
                new_lines.append(line)
                last_level = level
        else:
            new_lines.append(line)
            
    return '\n'.join(new_lines)

def fix_md040(content):
    """Fix MD040: Fenced code blocks should have a language specified."""
    lines = content.split('\n')
    new_lines = []
    in_code_block = False
    
    for line in lines:
        if line.strip().startswith('```'):
            if not in_code_block:
                # Opening fence
                # Check if language is present
                lang = line.strip()[3:].strip()
                if not lang:
                    # Add default language 'text'
                    new_lines.append('```text')
                else:
                    new_lines.append(line)
            else:
                # Closing fence
                new_lines.append(line)
            in_code_block = not in_code_block
        else:
            new_lines.append(line)
            
    return '\n'.join(new_lines)

def fix_md029(content):
    """Fix MD029: Ordered list item prefix. Ensure sequential numbering (1. 2. 3.)."""
    lines = content.split('\n')
    new_lines = []
    in_code_block = False
    
    # Track numbering for each indentation level
    # Key: indentation string (e.g. "  "), Value: next expected number
    list_counters = {}
    last_indent = -1
    
    for line in lines:
        if line.strip().startswith('```'):
            in_code_block = not in_code_block
            new_lines.append(line)
            # Reset counters on code block? Maybe not, lists can be interrupted.
            # But usually a code block breaks a list unless indented.
            # For simplicity, if we hit a non-indented code block, we reset.
            if not line.startswith(' '):
                list_counters = {}
            continue
            
        if in_code_block:
            new_lines.append(line)
            continue
            
        # Match ordered list item: whitespace + digits + dot + whitespace
        match = re.match(r'^(\s*)(\d+)\.(\s+.*)', line)
        if match:
            indent = match.group(1)
            original_number = match.group(2)
            rest = match.group(3)
            
            indent_len = len(indent)
            
            # If we indented deeper, or same level
            if indent not in list_counters:
                # New level or new list
                # Check if this is a continuation or new
                # If previous line was not a list item of same/greater indent, it's new
                # But we don't track previous line type easily here.
                # Heuristic: If indent > last_indent, it's a sublist -> start at 1
                # If indent < last_indent, we returned to parent -> continue parent count
                # If indent == last_indent, continue count
                
                # However, simpler logic:
                # If we haven't seen this indent recently, start at 1.
                # We need to clear deeper indents when we go up.
                list_counters[indent] = 1
            
            # Clear any counters for deeper indents (we stepped back out)
            keys_to_remove = [k for k in list_counters if len(k) > indent_len]
            for k in keys_to_remove:
                del list_counters[k]
                
            number = list_counters[indent]
            new_lines.append(f"{indent}{number}.{rest}")
            list_counters[indent] += 1
            last_indent = indent_len
        else:
            # Not a list item
            # If it's an empty line, list might continue.
            # If it's text with same indent, list might continue.
            # If it's a header or unindented text, list ends.
            if line.strip() == '':
                new_lines.append(line)
            elif re.match(r'^#', line):
                 # Header breaks list
                 list_counters = {}
                 new_lines.append(line)
            else:
                # Text. If indented, might be part of list content.
                # If not indented, breaks list.
                if not line.startswith(' '):
                    list_counters = {}
                new_lines.append(line)
                
    return '\n'.join(new_lines)

def fix_multiple_separators(content):
    """Fix multiple consecutive horizontal rules (---)."""
    # Replace multiple --- with a single ---
    # Matches: --- followed by whitespace/newlines followed by ---
    # Repeat until no more matches
    while re.search(r'---\s*\n\s*---', content):
        content = re.sub(r'---\s*\n\s*---', '---', content)
    return content

def fix_file_ends(content):
    """Fix start and end of file."""
    return content.strip() + '\n'

def fix_md051(content):
    """Fix MD051: Link fragments should be valid (broken anchors)."""
    from collections import defaultdict
    
    # Extract all valid heading anchors
    valid_anchors = set()
    for line in content.split('\n'):
        if line.startswith('#'):
            heading = line.lstrip('#').strip()
            # Convert to anchor format
            anchor = heading.lower()
            anchor = re.sub(r'[^\w\s-]', '', anchor)
            anchor = re.sub(r'\s+', '-', anchor)
            valid_anchors.add(anchor)
    
    # Fix broken anchor links
    def fix_anchor(match):
        link_text = match.group(1)
        anchor = match.group(2)
        
        if anchor in valid_anchors:
            return match.group(0)  # Already valid
        
        # Try to find closest match
        best_match = None
        best_score = 0
        
        for valid_anchor in valid_anchors:
            # Simple word overlap similarity
            anchor_words = set(anchor.split('-'))
            valid_words = set(valid_anchor.split('-'))
            
            if anchor_words and valid_words:
                overlap = len(anchor_words & valid_words)
                score = overlap / max(len(anchor_words), len(valid_words))
                
                if score > best_score and score > 0.5:
                    best_score = score
                    best_match = valid_anchor
        
        if best_match:
            return f'[{link_text}](#{best_match})'
        
        return match.group(0)  # Can't fix, leave as is
    
    # Replace broken anchors
    content = re.sub(r'\[([^\]]+)\]\(#([^\)]+)\)', fix_anchor, content)
    
    return content

def fix_md024(content):
    """Fix MD024: Multiple headings with the same content (duplicate headings)."""
    lines = content.split('\n')
    heading_counts = defaultdict(int)
    
    # Skip TOC section
    in_toc = False
    toc_end = 0
    
    for i, line in enumerate(lines):
        if 'table of contents' in line.lower() or line.lower().strip() == '## contents':
            in_toc = True
        elif in_toc and line.startswith('##') and 'table of contents' not in line.lower():
            toc_end = i
            in_toc = False
            break
    
    for i, line in enumerate(lines):
        # Skip TOC section
        if i < toc_end:
            continue
            
        # Only process actual headings (not TOC links)
        if line.startswith('#') and not line.strip().startswith('-'):
            level = len(line.split()[0])
            heading_text = line.lstrip('#').strip()
            heading_key = (level, heading_text.lower())
            
            heading_counts[heading_key] += 1
            
            # If this is a duplicate (2nd+ occurrence), add number suffix
            if heading_counts[heading_key] > 1:
                prefix = '#' * level
                lines[i] = f"{prefix} {heading_text} {heading_counts[heading_key]}"
    
    return '\n'.join(lines)

def process_file(filepath):
    print(f"Processing {filepath}...")
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()

        original_content = content

        # Apply fixes in sequence
        content = fix_md012(content) # Aggressive blank line removal
        content = fix_multiple_separators(content) # Remove --- ... --- gaps
        content = fix_file_ends(content) # Trim start/end
        
        content = fix_md025(content)
        content = fix_md022(content)
        content = fix_md031_md032(content)
        content = fix_md036(content)
        content = fix_md060(content)
        content = fix_md001(content)
        content = fix_md029(content)
        content = fix_md040(content)
        content = fix_md051(content)  # Fix broken link fragments
        content = fix_md024(content)  # Fix duplicate headings

        if content != original_content:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"Fixed {filepath}")
        else:
            print(f"No changes for {filepath}")

    except Exception as e:
        print(f"Error processing {filepath}: {e}")

if __name__ == "__main__":
    TARGET_DIR = r"c:\Users\Student\Documents\Rest-iN-U\Doxs\Dev Vault (ETERNAL MANUAL)"
    
    for root, dirs, files in os.walk(TARGET_DIR):
        if "1M S Dev" in root or "BACKUP" in root: continue
        for file in files:
            if file.endswith(".md") and "6  mode 3.md" not in file:
                filepath = os.path.join(root, file)
                process_file(filepath)
