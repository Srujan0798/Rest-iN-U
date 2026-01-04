"""
Fix broken code block formatting in Dev Vault files.
The issue: Code blocks end with ```text instead of ```
This breaks markdown rendering.
"""

import os
import re

TARGET_DIR = r"c:\Users\Student\Documents\Rest-iN-U\Doxs"

def fix_code_blocks(content):
    """Fix broken code block markers."""
    
    # Pattern: A code block that ends with ```text (should just be ```)
    # This happens when someone opened a code block but didn't close it properly
    
    # Replace ```text\n\n``` with just ```
    # (When there's a blank line after ```text followed by proper ```)
    content = re.sub(r'```text\n\n```', '```', content)
    
    # Replace standalone ```text that should be ``` (closing markers)
    # Look for: code content followed by ```text on its own line
    # The pattern is: something\n```text\n\n (where the text after is not code)
    
    lines = content.split('\n')
    new_lines = []
    in_code_block = False
    code_lang = None
    
    i = 0
    while i < len(lines):
        line = lines[i]
        
        # Check for code block start
        if line.strip().startswith('```') and not in_code_block:
            lang = line.strip()[3:].strip()
            if lang and lang != 'text':
                in_code_block = True
                code_lang = lang
                new_lines.append(line)
            elif lang == 'text':
                # Check if this should actually be a closing marker
                # Look at previous line - if it looks like code, this is a broken close
                if new_lines and (new_lines[-1].strip().endswith('}') or 
                                  new_lines[-1].strip().endswith(';') or
                                  new_lines[-1].strip().endswith(')') or
                                  new_lines[-1].strip() == ''):
                    new_lines.append('```')  # Fix: just close the block
                else:
                    new_lines.append(line)
            else:
                new_lines.append(line)
        # Check for code block end
        elif line.strip() == '```text' and in_code_block:
            # This should be ``` not ```text
            new_lines.append('```')
            in_code_block = False
            code_lang = None
        elif line.strip() == '```' and in_code_block:
            new_lines.append(line)
            in_code_block = False
            code_lang = None
        else:
            new_lines.append(line)
        
        i += 1
    
    return '\n'.join(new_lines)


def process_file(filepath):
    """Process a single file."""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
    except:
        return False
    
    # Count broken markers before
    broken_before = content.count('```text\n')
    
    fixed_content = fix_code_blocks(content)
    
    # Count broken markers after
    broken_after = fixed_content.count('```text\n')
    
    if broken_before != broken_after:
        print(f"Fixed {os.path.basename(filepath)}: {broken_before} -> {broken_after} ```text markers")
        with open(filepath, 'w', encoding='utf-8', newline='\n') as f:
            f.write(fixed_content)
        return True
    
    return False


def main():
    print("Fixing broken code block formatting in Dev Vault...")
    
    fixed_count = 0
    for root, dirs, files in os.walk(TARGET_DIR):
        dirs[:] = [d for d in dirs if d not in ['node_modules', '.git']]
        
        for file in files:
            if file.endswith('.md'):
                filepath = os.path.join(root, file)
                if process_file(filepath):
                    fixed_count += 1
    
    print(f"\nFixed {fixed_count} files")


if __name__ == "__main__":
    main()
