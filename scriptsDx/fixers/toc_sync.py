#!/usr/bin/env python3
"""
TOC SYNC - Syncs all TOC links with actual headers
"""
import re
import sys
from pathlib import Path

def slugify(text):
    """Convert header to anchor slug."""
    # Remove markdown formatting
    text = re.sub(r'[*_`]', '', text)
    # Convert to lowercase
    text = text.lower()
    # Replace spaces and special chars with hyphens
    text = re.sub(r'[^\w\s-]', '', text)
    text = re.sub(r'[\s_]+', '-', text)
    text = text.strip('-')
    return text

def sync_toc(file_path: Path) -> int:
    """Sync TOC with actual headers."""
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Extract all headers
    headers = {}
    for match in re.finditer(r'^(#{1,6})\s+(.+)$', content, re.MULTILINE):
        level = len(match.group(1))
        title = match.group(2).strip()
        slug = slugify(title)
        headers[slug] = title
    
    # Fix TOC links
    fixes = 0
    
    def fix_link(match):
        nonlocal fixes
        link_text = match.group(1)
        anchor = match.group(2)
        
        # Clean anchor
        clean_anchor = anchor.lstrip('#').lower()
        
        # Check if it exists
        if clean_anchor not in headers:
            # Try to find closest match
            for slug in headers:
                if slug in clean_anchor or clean_anchor in slug:
                    fixes += 1
                    return f'[{link_text}](#{slug})'
        
        return match.group(0)
    
    new_content = re.sub(r'\[([^\]]+)\]\(#([^\)]+)\)', fix_link, content)
    
    if new_content != content:
        with open(file_path, 'w', encoding='utf-8', newline='\n') as f:
            f.write(new_content)
    
    return fixes

def main():
    if len(sys.argv) < 2:
        print("Usage: python toc_sync.py <directory>")
        sys.exit(1)
    
    dir_path = Path(sys.argv[1])
    md_files = sorted(list(dir_path.rglob('*.md')))
    
    print(f"TOC SYNC")
    print(f"{'='*80}\n")
    
    total_fixes = 0
    for file_path in md_files:
        fixes = sync_toc(file_path)
        if fixes > 0:
            print(f"[SYNCED] {file_path.name}: {fixes} links")
            total_fixes += fixes
    
    print(f"\n{'='*80}")
    print(f"Total synced: {total_fixes}")

if __name__ == '__main__':
    main()
