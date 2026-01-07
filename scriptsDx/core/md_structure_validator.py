#!/usr/bin/env python3
"""
Markdown Structure Validator
Checks heading hierarchy, collapsing structure, and TOC accuracy
"""

import re
import sys
from pathlib import Path
from typing import List, Dict, Tuple

class MDStructureValidator:
    def __init__(self, file_path: str):
        self.file_path = Path(file_path)
        self.content = self.file_path.read_text(encoding='utf-8')
        self.lines = self.content.split('\n')
        self.errors = []
        self.warnings = []
        
    def validate_heading_hierarchy(self) -> List[Dict]:
        """Check if heading levels follow proper hierarchy (no jumps)"""
        heading_pattern = re.compile(r'^(#{1,6})\s+(.+)$')
        fence_pattern = re.compile(r'^```')
        prev_level = 0
        issues = []
        in_code_block = False
        
        for line_num, line in enumerate(self.lines, 1):
            # Track code blocks
            if fence_pattern.match(line):
                in_code_block = not in_code_block
                continue
            
            if in_code_block:
                continue

            match = heading_pattern.match(line)
            if match:
                current_level = len(match.group(1))
                heading_text = match.group(2)
                
                # Check for level jumps (e.g., # to ###)
                # Allow jumping to H1 (reset) or H2 (Volume) from anywhere? 
                # Usually H2 follows H1 or H2. H3 follows H2 or H3.
                # Jump from H2 to H4 is bad.
                # Jump from H4 to H2 is fine.
                
                if current_level > prev_level + 1:
                    # Special case: H1 is allowed anywhere? No, usually only at top.
                    # Special case: H2 is allowed after H1 or H2.
                    # If prev is 0 (start), H1 is expected.
                    
                    issues.append({
                        'line': line_num,
                        'type': 'HIERARCHY_JUMP',
                        'message': f'Heading jumped from level {prev_level} to {current_level}',
                        'content': line,
                        'severity': 'ERROR'
                    })
                
                # Check for empty headings
                if not heading_text.strip():
                    issues.append({
                        'line': line_num,
                        'type': 'EMPTY_HEADING',
                        'message': 'Heading has no text',
                        'content': line,
                        'severity': 'ERROR'
                    })
                
                prev_level = current_level
        
        return issues
    
    def validate_toc_links(self) -> List[Dict]:
        """Verify TOC links match actual headings"""
        issues = []
        
        # Extract TOC section (usually near top)
        toc_pattern = re.compile(r'^[-*]\s+\[(.+?)\]\(#(.+?)\)', re.MULTILINE)
        heading_pattern = re.compile(r'^#{1,6}\s+(.+)$', re.MULTILINE)
        
        toc_links = toc_pattern.findall(self.content)
        headings = heading_pattern.findall(self.content)
        
        # Create slug from heading text (GitHub style)
        def make_slug(text):
            slug = text.lower()
            slug = re.sub(r'[^\w\s-]', '', slug)
            slug = re.sub(r'[-\s]+', '-', slug)
            return slug.strip('-')
        
        heading_slugs = {make_slug(h): h for h in headings}
        
        for toc_text, toc_link in toc_links:
            # We need to be careful with the slug generation matching exactly what the TOC generator did.
            # The user's script uses a specific make_slug. 
            # If the TOC was generated with a slightly different algorithm, this might flag false positives.
            # But let's run it and see.
            if toc_link not in heading_slugs:
                # Try to see if it matches with a slightly different slugification?
                # For now, just report it.
                issues.append({
                    'type': 'BROKEN_TOC_LINK',
                    'message': f'TOC link "#{toc_link}" does not match any heading',
                    'toc_text': toc_text,
                    'severity': 'ERROR'
                })
        
        return issues
    
    def check_collapsing_structure(self) -> List[Dict]:
        """Check if collapsible sections are properly structured"""
        issues = []
        
        # Pattern for HTML collapsible sections
        details_open = re.compile(r'<details>')
        details_close = re.compile(r'</details>')
        summary_tag = re.compile(r'<summary>(.+?)</summary>')
        
        open_count = 0
        line_stack = []
        
        for line_num, line in enumerate(self.lines, 1):
            if details_open.search(line):
                open_count += 1
                line_stack.append(line_num)
                
                # Check if next lines have <summary>
                has_summary = False
                for i in range(line_num, min(line_num + 5, len(self.lines))):
                    if summary_tag.search(self.lines[i]):
                        has_summary = True
                        break
                
                if not has_summary:
                    issues.append({
                        'line': line_num,
                        'type': 'MISSING_SUMMARY',
                        'message': '<details> without <summary> tag',
                        'severity': 'WARNING'
                    })
            
            if details_close.search(line):
                open_count -= 1
                if line_stack:
                    line_stack.pop()
                
                if open_count < 0:
                    issues.append({
                        'line': line_num,
                        'type': 'UNMATCHED_CLOSE',
                        'message': '</details> without matching <details>',
                        'severity': 'ERROR'
                    })
        
        if open_count > 0:
            issues.append({
                'type': 'UNCLOSED_DETAILS',
                'message': f'{open_count} unclosed <details> tags',
                'lines': line_stack,
                'severity': 'ERROR'
            })
        
        return issues
    
    def check_code_blocks(self) -> List[Dict]:
        """Validate code block structure"""
        issues = []
        
        in_code_block = False
        code_block_start = 0
        fence_pattern = re.compile(r'^```(\w+)?')
        
        for line_num, line in enumerate(self.lines, 1):
            match = fence_pattern.match(line)
            
            if match:
                if not in_code_block:
                    in_code_block = True
                    code_block_start = line_num
                    
                    # Check if language is specified
                    if not match.group(1):
                        issues.append({
                            'line': line_num,
                            'type': 'NO_LANGUAGE',
                            'message': 'Code block without language specification',
                            'severity': 'WARNING'
                        })
                else:
                    in_code_block = False
        
        if in_code_block:
            issues.append({
                'line': code_block_start,
                'type': 'UNCLOSED_CODE_BLOCK',
                'message': 'Code block not closed',
                'severity': 'ERROR'
            })
        
        return issues
    
    def run_all_validations(self) -> Dict:
        """Run all validation checks"""
        all_issues = {
            'file': str(self.file_path),
            'total_lines': len(self.lines),
            'heading_hierarchy': self.validate_heading_hierarchy(),
            'toc_links': self.validate_toc_links(),
            'collapsing': self.check_collapsing_structure(),
            'code_blocks': self.check_code_blocks()
        }
        
        # Count severity
        error_count = sum(
            len([i for i in issues if i.get('severity') == 'ERROR'])
            for issues in all_issues.values() if isinstance(issues, list)
        )
        
        warning_count = sum(
            len([i for i in issues if i.get('severity') == 'WARNING'])
            for issues in all_issues.values() if isinstance(issues, list)
        )
        
        all_issues['summary'] = {
            'errors': error_count,
            'warnings': warning_count
        }
        
        return all_issues
    
    def print_report(self):
        """Print validation report"""
        results = self.run_all_validations()
        
        print(f"\n{'='*80}")
        print(f"MD STRUCTURE VALIDATION REPORT: {self.file_path.name}")
        print(f"{'='*80}\n")
        
        print(f"Total Lines: {results['total_lines']}")
        print(f"Errors: {results['summary']['errors']}")
        print(f"Warnings: {results['summary']['warnings']}\n")
        
        for category, issues in results.items():
            if category in ['file', 'total_lines', 'summary']:
                continue
            
            if issues:
                print(f"\n{category.upper().replace('_', ' ')}:")
                print(f"{'-'*80}")
                for issue in issues:
                    severity = issue.get('severity', 'INFO')
                    line_info = f"Line {issue['line']}: " if 'line' in issue else ""
                    print(f"[{severity}] {line_info}{issue['message']}")
                    if 'content' in issue:
                        print(f"  Content: {issue['content'][:100]}")
                print()

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python md_structure_validator.py <markdown_file_or_directory>")
        sys.exit(1)
    
    target = Path(sys.argv[1])
    
    if target.is_dir():
        md_files = sorted(target.rglob("*.md"))
        print(f"Validating {len(md_files)} files...")
        for md_file in md_files:
            try:
                validator = MDStructureValidator(str(md_file))
                validator.print_report()
            except Exception as e:
                print(f"[ERROR] {md_file.name}: {e}")
    else:
        validator = MDStructureValidator(sys.argv[1])
        validator.print_report()

