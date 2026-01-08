#!/usr/bin/env python3
"""
TOC Fixer
Regenerates Table of Contents with correct GitHub-style slugification.
"""

import re
import sys
from pathlib import Path
from typing import List, Tuple

class TOCFixer:
    def __init__(self, file_path: str):
        self.file_path = Path(file_path).resolve()
        self.content = self.file_path.read_text(encoding='utf-8', errors='replace')
        self.lines = self.content.split('\n')

    def generate_slug(self, text: str) -> str:
        """Generate GitHub-style slug (matching advanced_validator logic)"""
        text = re.sub(r'[`*_]', '', text)
        text = text.lower().strip()
        text = re.sub(r'\s+', '-', text)
        text = re.sub(r'[^\w\-]', '', text)
        return text

    def extract_headings(self) -> List[Tuple[int, int, str, str]]:
        """Extract headings: (line_index, level, title, slug)"""
        headings = []
        slug_counts = {}
        in_code_block = False
        
        for i, line in enumerate(self.lines):
            # Robust fence detection: must be start of line
            if line.strip().startswith('```'):
                in_code_block = not in_code_block
                continue
            
            if in_code_block:
                continue
                
            # Match headers
            match = re.match(r'^(#{1,6})\s+(.+)$', line.strip())
            if match:
                level = len(match.group(1))
                title = match.group(2).strip()
                
                # Remove links from title for slug
                title_plain = re.sub(r'\[([^\]]+)\]\([^\)]+\)', r'\1', title)
                
                slug = self.generate_slug(title_plain)
                
                if slug in slug_counts:
                    slug_counts[slug] += 1
                    slug = f"{slug}-{slug_counts[slug]}"
                else:
                    slug_counts[slug] = 0
                    
                headings.append((i, level, title, slug))
                
        return headings

    def generate_toc(self, headings: List[Tuple[int, int, str, str]]) -> List[str]:
        """Generate TOC lines"""
        toc = []
        toc.append("## Table of Contents")
        toc.append("")
        
        for _, level, title, slug in headings:
            if level == 1:
                continue # Skip H1 (Title)
                
            indent = "  " * (level - 2) if level > 1 else ""
            toc.append(f"{indent}- [{title}](#{slug})")
            
        return toc

    def update_file(self):
        """Update the file with new TOC"""
        headings = self.extract_headings()
        new_toc = self.generate_toc(headings)
        
        # Find existing TOC
        start_idx = -1
        end_idx = -1
        
        for i, line in enumerate(self.lines):
            if "## table of contents" in line.lower() or "## contents" in line.lower():
                start_idx = i
                break
        
        if start_idx != -1:
            # Find end of TOC (first line that is not a list item or blank, or next header)
            for i in range(start_idx + 1, len(self.lines)):
                line = self.lines[i].strip()
                if line.startswith('#'):
                    end_idx = i
                    break
                # If we hit a non-list item that isn't blank, maybe end of TOC?
                # But TOC can have nested lists.
                # Heuristic: Next header ends TOC.
            
            if end_idx == -1:
                # TOC goes to end of file? Unlikely.
                end_idx = len(self.lines)
                
            # Replace TOC
            print(f"Updating TOC in {self.file_path.name}...")
            self.lines[start_idx:end_idx] = new_toc + [""] # Add newline after
            
            new_content = '\n'.join(self.lines)
            self.file_path.write_text(new_content, encoding='utf-8')
            print("TOC updated successfully.")
        else:
            print("No existing Table of Contents found. Creating new one...")
            # Find first H1
            h1_idx = -1
            for i, line in enumerate(self.lines):
                if line.strip().startswith('# '):
                    h1_idx = i
                    break
            
            if h1_idx != -1:
                # Insert after H1
                self.lines[h1_idx+1:h1_idx+1] = [""] + new_toc + [""]
                new_content = '\n'.join(self.lines)
                self.file_path.write_text(new_content, encoding='utf-8')
                print("TOC created successfully.")
            else:
                # Insert at top
                self.lines[0:0] = new_toc + [""]
                new_content = '\n'.join(self.lines)
                self.file_path.write_text(new_content, encoding='utf-8')
                print("TOC created at top successfully.")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python toc_fixer.py <markdown_file_or_directory>")
        sys.exit(1)
    
    target = Path(sys.argv[1])
    
    if target.is_dir():
        md_files = sorted(target.rglob("*.md"))
        print(f"Fixing TOC in {len(md_files)} files...")
        for md_file in md_files:
            try:
                fixer = TOCFixer(str(md_file))
                fixer.update_file()
            except Exception as e:
                print(f"[ERROR] {md_file.name}: {e}")
    else:
        fixer = TOCFixer(sys.argv[1])
        fixer.update_file()

