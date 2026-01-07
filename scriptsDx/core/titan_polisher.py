#!/usr/bin/env python3
"""
Titan Polisher
Combines Gap/Whitespace Analysis with Auto-Fixing capabilities.
Also includes Structure Validation.
"""

import re
import sys
from pathlib import Path
from typing import List, Dict

class TitanPolisher:
    def __init__(self, file_path: str):
        self.file_path = Path(file_path)
        self.content = self.file_path.read_text(encoding='utf-8')
        self.lines = self.content.split('\n')
        self.fixed_content = []
        self.changes = []

    def fix_whitespace_and_gaps(self):
        """
        Auto-fixes:
        1. Trailing whitespace
        2. Excessive blank lines (max 2)
        3. Mixed indentation (tabs to spaces)
        """
        print(f"Polishing {self.file_path.name}...")
        
        new_lines = []
        blank_count = 0
        
        for i, line in enumerate(self.lines):
            # 1. Fix Trailing Whitespace
            stripped_line = line.rstrip()
            if line != stripped_line:
                # Only record change if it's not just a blank line being emptied
                if line.strip(): 
                    self.changes.append(f"Line {i+1}: Removed trailing whitespace")
            
            # 2. Fix Mixed Indentation (Tabs to 2 Spaces - common for MD)
            if '\t' in stripped_line:
                stripped_line = stripped_line.replace('\t', '  ')
                self.changes.append(f"Line {i+1}: Converted tabs to spaces")
            
            # 3. Fix Excessive Blank Lines
            if not stripped_line:
                blank_count += 1
                if blank_count <= 2:
                    new_lines.append(stripped_line)
                else:
                    # Skip this line (it's the 3rd+ blank line)
                    pass 
            else:
                if blank_count > 2:
                    self.changes.append(f"Line {i+1}: Collapsed {blank_count} blank lines to 2")
                blank_count = 0
                
                # 4. Standardize List Markers (* to -)
                # Check if line starts with * followed by space, but NOT ** (bold)
                if re.match(r'^\s*\*\s', stripped_line):
                    # Replace first * with -
                    # We need to preserve indentation
                    match = re.match(r'^(\s*)\*\s(.*)', stripped_line)
                    if match:
                        indent = match.group(1)
                        content = match.group(2)
                        stripped_line = f"{indent}- {content}"
                        self.changes.append(f"Line {i+1}: Standardized list marker (* to -)")

                # 5. Standardize Code Fences (~~~ to ```)
                if stripped_line.strip().startswith('~~~'):
                    stripped_line = stripped_line.replace('~~~', '```', 1)
                    self.changes.append(f"Line {i+1}: Standardized code fence (~~~ to ```)")

                new_lines.append(stripped_line)
                
        self.fixed_content = new_lines
        
    def save_changes(self):
        if self.changes:
            print(f"Applying {len(self.changes)} fixes...")
            with open(self.file_path, 'w', encoding='utf-8') as f:
                f.write('\n'.join(self.fixed_content))
            print("File updated successfully.")
        else:
            print("No auto-fixable issues found.")

    def validate_structure(self):
        """
        Runs validation checks (Hierarchy, TOC, etc.)
        Based on user's MDStructureValidator
        """
        print("\nRunning Structure Validation...")
        # Re-read file in case it was changed
        content = self.file_path.read_text(encoding='utf-8')
        lines = content.split('\n')
        
        heading_pattern = re.compile(r'^(#{1,6})\s+(.+)$')
        fence_pattern = re.compile(r'^```')
        prev_level = 0
        in_code_block = False
        issues = []
        
        for line_num, line in enumerate(lines, 1):
            if fence_pattern.match(line):
                in_code_block = not in_code_block
                continue
            if in_code_block:
                continue
                
            match = heading_pattern.match(line)
            if match:
                current_level = len(match.group(1))
                
                # Check for jumps > 1 level (e.g. H2 -> H4)
                # Exception: H1 is usually top level.
                if current_level > prev_level + 1:
                     issues.append(f"Line {line_num}: Hierarchy Jump (H{prev_level} -> H{current_level})")
                
                prev_level = current_level
                
        if issues:
            print(f"Found {len(issues)} structure issues:")
            for issue in issues:
                print(f"  [WARN] {issue}")
        else:
            print("Structure is clean.")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python titan_polisher.py <markdown_file_or_directory>")
        sys.exit(1)
    
    target = Path(sys.argv[1])
    
    if target.is_dir():
        md_files = sorted(target.rglob("*.md"))
        print(f"Polishing {len(md_files)} files...")
        for md_file in md_files:
            try:
                polisher = TitanPolisher(str(md_file))
                polisher.fix_whitespace_and_gaps()
                polisher.save_changes()
                polisher.validate_structure()
            except Exception as e:
                print(f"[ERROR] {md_file.name}: {e}")
    else:
        polisher = TitanPolisher(sys.argv[1])
        polisher.fix_whitespace_and_gaps()
        polisher.save_changes()
        polisher.validate_structure()

