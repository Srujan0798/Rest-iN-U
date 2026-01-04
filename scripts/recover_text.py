import os
import sys
import re

# Configuration
TARGET_DIR = r"c:\Users\Student\Documents\Rest-iN-U"
BACKUP_SUFFIX = ".bak_corrupt"

# Common Mojibake start bytes
# \xc3\x83 = Ãƒ
# \xc3\x82 = Ã‚
# \xc3\xa2 = Ã¢
# \xc6\x92 = Æ' (appears in triple-encoded garbage)
# \xc5\xb8 = Ÿ
GARBAGE_STARTS = [b'\xc3\x83', b'\xc3\x82', b'\xc3\xa2', b'\xc6\x92', b'\xc5\xb8', b'\xc3\xb0']

def is_garbage_block(data_chunk):
    """
    Returns True if the chunk is mostly garbage.
    Heuristic: High density of non-ASCII characters.
    """
    if not data_chunk: return False
    non_ascii = sum(1 for b in data_chunk if b > 127)
    # Lower threshold to 20% to catch more garbage
    return (non_ascii / len(data_chunk)) > 0.2

def clean_line(line):
    """
    Cleans a single line of garbage bytes while preserving ASCII.
    """
    # 1. Header Fix (Existing logic)
    if line.startswith(b'## ') and any(g in line for g in GARBAGE_STARTS):
        match = re.search(b'([A-Z ]+)\r?$', line)
        if match:
            title = match.group(1).strip()
            if len(title) > 3:
                return b'## ' + title + (b'\r' if line.endswith(b'\r') else b'')

    # 2. General Body Fix
    # If the line contains garbage markers
    if any(g in line for g in GARBAGE_STARTS):
        # Strategy: Tokenize by space. Keep tokens that are mostly ASCII.
        # This preserves "Valid Text" in "* [GARBAGE] Valid Text"
        
        # Split by space
        tokens = line.split(b' ')
        clean_tokens = []
        for token in tokens:
            if is_garbage_block(token):
                continue
            clean_tokens.append(token)
            
        # Reconstruct
        new_line = b' '.join(clean_tokens)
        
        # If the line became empty but wasn't before, maybe we killed it all.
        # But if it was just garbage, that's good.
        return new_line

    return line

def repair_file(filepath):
    print(f"Checking {filepath}...")
    
    try:
        with open(filepath, 'rb') as f:
            raw_data = f.read()
    except Exception as e:
        print(f"Error reading {filepath}: {e}")
        return

    lines = raw_data.split(b'\n')
    new_lines = []
    was_modified = False
    
    for line in lines:
        cleaned = clean_line(line)
        if cleaned != line:
            was_modified = True
            new_lines.append(cleaned)
        else:
            new_lines.append(line)
            
    if was_modified:
        print(f" -> Detected and fixed corruption in {filepath}")
        
        # Backup
        if not os.path.exists(filepath + BACKUP_SUFFIX):
            with open(filepath + BACKUP_SUFFIX, 'wb') as f:
                f.write(raw_data)
                
        with open(filepath, 'wb') as f:
            f.write(b'\n'.join(new_lines))
    else:
        print(f" -> Clean.")

def main():
    print(f"Starting deep binary recovery scan in {TARGET_DIR}")
    count = 0
    for root, dirs, files in os.walk(TARGET_DIR):
        for file in files:
            if file.endswith(".md") and not file.endswith(BACKUP_SUFFIX):
                # Skip the large backup file we created
                if "FULL_BACKUP" in file: continue
                
                repair_file(os.path.join(root, file))
                count += 1
    print(f"Scanned {count} files.")

if __name__ == "__main__":
    main()
