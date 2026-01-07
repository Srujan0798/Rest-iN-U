#!/usr/bin/env python3
"""
Cross-Reference Validator
Validates internal links, file references, and image links across the vault.
"""

import re
import sys
import urllib.parse
from pathlib import Path
from typing import List, Dict, Set

class CrossReferenceValidator:
    def __init__(self, file_path: str, root_dir: str = None):
        self.file_path = Path(file_path).resolve()
        # If root_dir is not provided, assume the parent of the file's directory (e.g. Doxs/Dev Vault/KNOWLEDGE -> Doxs/Dev Vault)
        # Or just use the current working directory if it contains the file
        if root_dir:
            self.root_dir = Path(root_dir).resolve()
        else:
            # Try to find the root by looking for 'task.md' or similar, or just go up 2 levels
            self.root_dir = self.file_path.parent.parent
            
        self.content = self.file_path.read_text(encoding='utf-8', errors='replace')
        self.lines = self.content.split('\n')
        self.headings = self._extract_headings()

    def _extract_headings(self) -> Set[str]:
        """Extract all headings from the file and generate slugs"""
        headings = set()
        slug_counts = {}
        
        in_code_block = False
        for line in self.lines:
            if line.strip().startswith('```'):
                in_code_block = not in_code_block
                continue
            if in_code_block:
                continue
                
            # Match headers
            match = re.match(r'^(#{1,6})\s+(.+)$', line.strip())
            if match:
                title = match.group(2).strip()
                
                # Remove links from title for slug (match toc_fixer logic)
                title_plain = re.sub(r'\[([^\]]+)\]\([^\)]+\)', r'\1', title)
                
                slug = self._slugify(title_plain)
                
                if slug in slug_counts:
                    slug_counts[slug] += 1
                    slug = f"{slug}-{slug_counts[slug]}"
                else:
                    slug_counts[slug] = 0
                    
                headings.add(slug)
        return headings

    def _slugify(self, text: str) -> str:
        """Create a slug from text (GitHub style)"""
        text = text.lower().strip()
        text = re.sub(r'[^\w\s-]', '', text)
        text = re.sub(r'\s+', '-', text)
        return text

    def validate_internal_links(self) -> List[Dict]:
        """Check [link](#anchor) references within the file"""
        issues = []
        # Pattern for markdown links: [text](#anchor)
        link_pattern = re.compile(r'\[([^\]]+)\]\(#([^)]+)\)')
        
        in_code_block = False
        for i, line in enumerate(self.lines, 1):
            if line.strip().startswith('```'):
                in_code_block = not in_code_block
                continue
            if in_code_block:
                continue
                
            matches = link_pattern.finditer(line)
            for match in matches:
                link_text = match.group(1)
                anchor = match.group(2)
                
                if anchor not in self.headings:
                    issues.append({
                        'line': i,
                        'type': 'BROKEN_INTERNAL_LINK',
                        'message': f'Link to non-existent anchor: #{anchor}',
                        'severity': 'WARNING'
                    })
        return issues

    def validate_file_links(self) -> List[Dict]:
        """Check [text](path/to/file) references"""
        issues = []
        # Pattern for file links: [text](path) where path doesn't start with # or http
        # Exclude quotes in text part to avoid matching code like [' '](1)
        link_pattern = re.compile(r'\[([^\]\'\"]+)\]\(([^)#]+)\)')
        
        in_code_block = False
        for i, line in enumerate(self.lines, 1):
            if line.strip().startswith('```'):
                in_code_block = not in_code_block
                continue
            if in_code_block:
                continue
                
            matches = link_pattern.finditer(line)
            for match in matches:
                link_text = match.group(1)
                path_str = match.group(2)
                
                if path_str.startswith(('http://', 'https://', 'mailto:', 'ftp://')):
                    continue
                
                # Resolve path relative to current file
                try:
                    # Handle URL decoding (e.g. %20 -> space)
                    decoded_path = urllib.parse.unquote(path_str)
                    target_path = (self.file_path.parent / decoded_path).resolve()
                    
                    if not target_path.exists():
                        issues.append({
                            'line': i,
                            'type': 'BROKEN_FILE_LINK',
                            'message': f'File not found: {path_str}',
                            'severity': 'ERROR'
                        })
                except Exception as e:
                    issues.append({
                        'line': i,
                        'type': 'INVALID_PATH',
                        'message': f'Invalid path format: {path_str} ({e})',
                        'severity': 'WARNING'
                    })
        return issues

    def validate_image_links(self) -> List[Dict]:
        """Check ![text](path/to/image) references"""
        issues = []
        image_pattern = re.compile(r'!\[([^\]]*)\]\(([^)]+)\)')
        
        in_code_block = False
        for i, line in enumerate(self.lines, 1):
            if line.strip().startswith('```'):
                in_code_block = not in_code_block
                continue
            if in_code_block:
                continue
                
            matches = image_pattern.finditer(line)
            for match in matches:
                alt_text = match.group(1)
                path_str = match.group(2)
                
                if path_str.startswith(('http://', 'https://')):
                    continue
                
                try:
                    decoded_path = urllib.parse.unquote(path_str)
                    target_path = (self.file_path.parent / decoded_path).resolve()
                    
                    if not target_path.exists():
                        issues.append({
                            'line': i,
                            'type': 'BROKEN_IMAGE_LINK',
                            'message': f'Image not found: {path_str}',
                            'severity': 'ERROR'
                        })
                except Exception as e:
                    issues.append({
                        'line': i,
                        'type': 'INVALID_IMAGE_PATH',
                        'message': f'Invalid image path: {path_str}',
                        'severity': 'WARNING'
                    })
        return issues

    def run_validation(self):
        print(f"Validating Cross-References in {self.file_path.name}...")
        
        internal_issues = self.validate_internal_links()
        file_issues = self.validate_file_links()
        image_issues = self.validate_image_links()
        
        all_issues = internal_issues + file_issues + image_issues
        
        if all_issues:
            print(f"Found {len(all_issues)} cross-reference issues:")
            for issue in all_issues:
                print(f"  [{issue['severity']}] Line {issue['line']}: {issue['message']}")
            
            # Exit with 1 only if there are errors
            if any(issue['severity'] == 'ERROR' for issue in all_issues):
                sys.exit(1)
            else:
                sys.exit(0)
        else:
            print("No cross-reference issues found.")
            sys.exit(0)

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python cross_reference_validator.py <markdown_file_or_directory> [root_dir]")
        sys.exit(1)
    
    target = Path(sys.argv[1])
    root_dir = sys.argv[2] if len(sys.argv) > 2 else None
    
    if target.is_dir():
        md_files = sorted(target.rglob("*.md"))
        print(f"Validating {len(md_files)} files...")
        for md_file in md_files:
            try:
                validator = CrossReferenceValidator(str(md_file), root_dir)
                validator.run_validation()
            except SystemExit:
                pass  # Continue to next file
            except Exception as e:
                print(f"[ERROR] {md_file.name}: {e}")
    else:
        validator = CrossReferenceValidator(sys.argv[1], root_dir)
        validator.run_validation()

