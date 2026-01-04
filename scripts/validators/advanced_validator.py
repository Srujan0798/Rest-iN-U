#!/usr/bin/env python3
"""
Advanced Markdown Validator - Detects ALL structural issues
"""
import re
import sys
from pathlib import Path
from typing import List, Dict, Tuple

class AdvancedMarkdownValidator:
    def __init__(self, file_path: str):
        self.file_path = Path(file_path)
        self.lines = []
        self.issues = []
        
    def load_file(self):
        """Load file content."""
        with open(self.file_path, 'r', encoding='utf-8') as f:
            self.lines = f.readlines()
    
    def check_header_hierarchy(self) -> List[Dict]:
        """Check for header hierarchy issues."""
        issues = []
        prev_level = 0
        
        for i, line in enumerate(self.lines, 1):
            if match := re.match(r'^(#{1,6})\s+(.+)', line):
                level = len(match.group(1))
                
                # Check for skipped levels (e.g., # -> ###)
                if level > prev_level + 1 and prev_level > 0:
                    issues.append({
                        'line': i,
                        'type': 'HIERARCHY',
                        'severity': 'HIGH',
                        'message': f'Header level jump: H{prev_level} -> H{level} (skipped H{prev_level+1})',
                        'content': line.strip()
                    })
                
                prev_level = level
        
        return issues
    
    def check_excessive_gaps(self) -> List[Dict]:
        """Check for excessive blank lines."""
        issues = []
        blank_count = 0
        blank_start = 0
        
        for i, line in enumerate(self.lines, 1):
            if line.strip() == '':
                if blank_count == 0:
                    blank_start = i
                blank_count += 1
            else:
                if blank_count > 3:  # More than 3 consecutive blank lines
                    issues.append({
                        'line': blank_start,
                        'type': 'GAP',
                        'severity': 'MEDIUM',
                        'message': f'{blank_count} consecutive blank lines',
                        'content': f'Lines {blank_start}-{i-1}'
                    })
                blank_count = 0
        
        return issues
    
    def check_malformed_tables(self) -> List[Dict]:
        """Check for malformed markdown tables."""
        issues = []
        in_table = False
        table_start = 0
        
        for i, line in enumerate(self.lines, 1):
            # Detect table start
            if '|' in line and not in_table:
                in_table = True
                table_start = i
            elif in_table and '|' not in line and line.strip() != '':
                in_table = False
            
            # Check for malformed table rows
            if in_table and '|' in line:
                # Count pipes
                pipe_count = line.count('|')
                
                # Check if it's a separator row
                if re.match(r'^\s*\|[\s\-:|]+\|\s*$', line):
                    # Valid separator
                    continue
                
                # Check for unbalanced pipes
                if pipe_count < 2:
                    issues.append({
                        'line': i,
                        'type': 'TABLE',
                        'severity': 'HIGH',
                        'message': 'Malformed table row (insufficient pipes)',
                        'content': line.strip()[:80]
                    })
        
        return issues
    
    def check_code_blocks(self) -> List[Dict]:
        """Check for unclosed or malformed code blocks."""
        issues = []
        in_code_block = False
        code_start = 0
        fence_type = None
        
        for i, line in enumerate(self.lines, 1):
            # Check for code fence
            if match := re.match(r'^```(\w*)', line):
                if not in_code_block:
                    in_code_block = True
                    code_start = i
                    fence_type = match.group(1) or 'none'
                    
                    # Check for missing language
                    if not match.group(1):
                        issues.append({
                            'line': i,
                            'type': 'CODE',
                            'severity': 'LOW',
                            'message': 'Code block missing language identifier',
                            'content': line.strip()
                        })
                else:
                    in_code_block = False
            
            # Check for invalid fence closers
            if re.match(r'^````', line):
                issues.append({
                    'line': i,
                    'type': 'CODE',
                    'severity': 'HIGH',
                    'message': 'Invalid code block fence (4 backticks)',
                    'content': line.strip()
                })
        
        # Check for unclosed code block
        if in_code_block:
            issues.append({
                'line': code_start,
                'type': 'CODE',
                'severity': 'CRITICAL',
                'message': f'Unclosed code block (started at line {code_start})',
                'content': f'Fence type: {fence_type}'
            })
        
        return issues
    
    def check_toc_structure(self) -> List[Dict]:
        """Check TOC structure and links."""
        issues = []
        in_toc = False
        toc_items = []
        headers = []
        
        # Find TOC section
        for i, line in enumerate(self.lines, 1):
            if re.match(r'^##\s+TABLE OF CONTENTS', line, re.IGNORECASE):
                in_toc = True
                continue
            
            if in_toc:
                # End of TOC (next major section)
                if re.match(r'^#{1,2}\s+[^#]', line) and 'TABLE OF CONTENTS' not in line:
                    in_toc = False
                    continue
                
                # Extract TOC links
                if match := re.search(r'\[([^\]]+)\]\(#([^\)]+)\)', line):
                    toc_items.append({
                        'line': i,
                        'text': match.group(1),
                        'anchor': match.group(2)
                    })
        
        # Extract actual headers
        for i, line in enumerate(self.lines, 1):
            if match := re.match(r'^(#{1,6})\s+(.+)', line):
                if 'TABLE OF CONTENTS' not in line:
                    headers.append({
                        'line': i,
                        'level': len(match.group(1)),
                        'text': match.group(2).strip(),
                        'anchor': self._create_anchor(match.group(2))
                    })
        
        # Check for TOC-header mismatches
        toc_anchors = {item['anchor'] for item in toc_items}
        header_anchors = {h['anchor'] for h in headers}
        
        # Find missing headers
        missing = toc_anchors - header_anchors
        if missing:
            for anchor in list(missing)[:5]:  # Show first 5
                issues.append({
                    'line': 0,
                    'type': 'TOC',
                    'severity': 'MEDIUM',
                    'message': f'TOC link to non-existent header: #{anchor}',
                    'content': anchor
                })
        
        return issues
    
    def _create_anchor(self, text: str) -> str:
        """Create GitHub-style anchor from header text."""
        # Remove markdown formatting
        text = re.sub(r'[`*_]', '', text)
        # Convert to lowercase
        text = text.lower()
        # Replace spaces with hyphens
        text = re.sub(r'\s+', '-', text)
        # Remove special characters
        text = re.sub(r'[^\w\-]', '', text)
        return text
    
    def check_list_indentation(self) -> List[Dict]:
        """Check for inconsistent list indentation."""
        issues = []
        
        for i, line in enumerate(self.lines, 1):
            # Check for list items
            if match := re.match(r'^(\s*)([-*+]|\d+\.)\s+', line):
                indent = len(match.group(1))
                
                # Check for odd indentation (not multiple of 2 or 4)
                if indent % 2 != 0:
                    issues.append({
                        'line': i,
                        'type': 'LIST',
                        'severity': 'LOW',
                        'message': f'Inconsistent list indentation ({indent} spaces)',
                        'content': line.strip()[:80]
                    })
        
        return issues
    
    def validate(self) -> Dict:
        """Run all validations."""
        self.load_file()
        
        all_issues = []
        all_issues.extend(self.check_header_hierarchy())
        all_issues.extend(self.check_excessive_gaps())
        all_issues.extend(self.check_malformed_tables())
        all_issues.extend(self.check_code_blocks())
        all_issues.extend(self.check_toc_structure())
        all_issues.extend(self.check_list_indentation())
        
        # Sort by severity and line number
        severity_order = {'CRITICAL': 0, 'HIGH': 1, 'MEDIUM': 2, 'LOW': 3}
        all_issues.sort(key=lambda x: (severity_order.get(x['severity'], 4), x['line']))
        
        return {
            'file': str(self.file_path),
            'total_issues': len(all_issues),
            'issues': all_issues
        }

def main():
    if len(sys.argv) < 2:
        print("Usage: python advanced_validator.py <file_or_directory>")
        sys.exit(1)
    
    path = Path(sys.argv[1])
    
    if path.is_file():
        files = [path]
    else:
        files = list(path.rglob('*.md'))
    
    print(f"[*] Advanced Markdown Validation")
    print(f"{'='*80}\n")
    
    total_issues = 0
    critical_count = 0
    high_count = 0
    
    for file in files:
        validator = AdvancedMarkdownValidator(str(file))
        result = validator.validate()
        
        if result['total_issues'] > 0:
            print(f"\n[FILE] {file.name}")
            print(f"   Issues found: {result['total_issues']}")
            
            # Group by severity
            by_severity = {}
            for issue in result['issues']:
                sev = issue['severity']
                by_severity.setdefault(sev, []).append(issue)
            
            for severity in ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW']:
                if severity in by_severity:
                    print(f"\n   {severity}:")
                    for issue in by_severity[severity][:3]:  # Show first 3 of each
                        print(f"      Line {issue['line']}: [{issue['type']}] {issue['message']}")
                    
                    if len(by_severity[severity]) > 3:
                        print(f"      ... and {len(by_severity[severity]) - 3} more")
            
            total_issues += result['total_issues']
            critical_count += len(by_severity.get('CRITICAL', []))
            high_count += len(by_severity.get('HIGH', []))
    
    print(f"\n{'='*80}")
    print(f"[SUMMARY]:")
    print(f"   Total issues: {total_issues}")
    print(f"   Critical: {critical_count}")
    print(f"   High: {high_count}")
    
    if critical_count > 0:
        print(f"\n[!] CRITICAL issues found! Immediate action required.")
        sys.exit(1)
    elif high_count > 0:
        print(f"\n[!] HIGH priority issues found. Should be addressed.")
        sys.exit(0)
    else:
        print(f"\n[OK] No critical or high priority issues found.")
        sys.exit(0)

if __name__ == '__main__':
    main()
