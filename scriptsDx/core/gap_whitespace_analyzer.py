#!/usr/bin/env python3
"""
Gap & Whitespace Analyzer
Detects unnecessary gaps, excessive whitespace, and formatting inconsistencies
"""

import re
import sys
from pathlib import Path
from typing import List, Dict

class GapAnalyzer:
    def __init__(self, file_path: str):
        self.file_path = Path(file_path)
        self.content = self.file_path.read_text(encoding='utf-8')
        self.lines = self.content.split('\n')
        
        # Configuration
        self.max_consecutive_blank = 2  # Maximum allowed consecutive blank lines
        self.max_trailing_spaces = 0    # No trailing spaces allowed
        
    def find_excessive_gaps(self) -> List[Dict]:
        """Find areas with too many consecutive blank lines"""
        issues = []
        blank_count = 0
        blank_start = 0
        
        for line_num, line in enumerate(self.lines, 1):
            if line.strip() == '':
                if blank_count == 0:
                    blank_start = line_num
                blank_count += 1
            else:
                if blank_count > self.max_consecutive_blank:
                    issues.append({
                        'line_start': blank_start,
                        'line_end': line_num - 1,
                        'type': 'EXCESSIVE_BLANK_LINES',
                        'message': f'{blank_count} consecutive blank lines (max allowed: {self.max_consecutive_blank})',
                        'blank_count': blank_count,
                        'severity': 'WARNING'
                    })
                blank_count = 0
        
        return issues
    
    def find_trailing_whitespace(self) -> List[Dict]:
        """Find lines with trailing spaces/tabs"""
        issues = []
        
        for line_num, line in enumerate(self.lines, 1):
            if line != line.rstrip():
                trailing_chars = len(line) - len(line.rstrip())
                issues.append({
                    'line': line_num,
                    'type': 'TRAILING_WHITESPACE',
                    'message': f'{trailing_chars} trailing whitespace character(s)',
                    'severity': 'WARNING'
                })
        
        return issues
    
    def find_inconsistent_indentation(self) -> List[Dict]:
        """Detect mixed tabs/spaces and inconsistent indentation"""
        issues = []
        
        indent_pattern = re.compile(r'^(\s+)')
        uses_tabs = False
        uses_spaces = False
        
        for line_num, line in enumerate(self.lines, 1):
            if line.strip():  # Skip blank lines
                match = indent_pattern.match(line)
                if match:
                    indent = match.group(1)
                    
                    if '\t' in indent:
                        uses_tabs = True
                    if ' ' in indent:
                        uses_spaces = True
                    
                    # Check for mixed indentation on same line
                    if '\t' in indent and ' ' in indent:
                        issues.append({
                            'line': line_num,
                            'type': 'MIXED_INDENTATION',
                            'message': 'Line uses both tabs and spaces for indentation',
                            'severity': 'ERROR'
                        })
        
        # Report file-level mixing
        if uses_tabs and uses_spaces:
            issues.append({
                'type': 'FILE_LEVEL_MIXED_INDENTATION',
                'message': 'File uses both tabs and spaces (should be consistent)',
                'severity': 'WARNING'
            })
        
        return issues
    
    def find_section_gaps(self) -> List[Dict]:
        """Analyze gaps between sections for consistency"""
        issues = []
        
        heading_pattern = re.compile(r'^#{1,6}\s+')
        prev_heading_line = 0
        prev_blank_before = 0
        
        for line_num, line in enumerate(self.lines, 1):
            if heading_pattern.match(line):
                # Count blank lines before this heading
                blank_before = 0
                for i in range(line_num - 2, -1, -1):
                    if self.lines[i].strip() == '':
                        blank_before += 1
                    else:
                        break
                
                # Check consistency
                if prev_heading_line > 0:
                    if blank_before != prev_blank_before:
                        issues.append({
                            'line': line_num,
                            'type': 'INCONSISTENT_SECTION_GAP',
                            'message': f'Gap before heading ({blank_before} lines) differs from previous ({prev_blank_before} lines)',
                            'severity': 'INFO'
                        })
                
                prev_heading_line = line_num
                prev_blank_before = blank_before
        
        return issues
    
    def check_list_formatting(self) -> List[Dict]:
        """Check for proper spacing in lists"""
        issues = []
        
        list_pattern = re.compile(r'^(\s*)[-*+]\s+')
        prev_was_list = False
        prev_indent = 0
        
        for line_num, line in enumerate(self.lines, 1):
            match = list_pattern.match(line)
            
            if match:
                indent = len(match.group(1))
                
                # Check for blank lines between list items
                if prev_was_list and line_num > 1:
                    if self.lines[line_num - 2].strip() == '':
                        issues.append({
                            'line': line_num,
                            'type': 'BLANK_LINE_IN_LIST',
                            'message': 'Unnecessary blank line between list items',
                            'severity': 'INFO'
                        })
                
                prev_was_list = True
                prev_indent = indent
            else:
                prev_was_list = False
        
        return issues
    
    def analyze_density(self) -> Dict:
        """Calculate documentation density metrics"""
        total_lines = len(self.lines)
        blank_lines = sum(1 for line in self.lines if line.strip() == '')
        content_lines = total_lines - blank_lines
        
        # Count code blocks
        in_code = False
        code_lines = 0
        for line in self.lines:
            if line.startswith('```'):
                in_code = not in_code
            elif in_code:
                code_lines += 1
        
        density = {
            'total_lines': total_lines,
            'blank_lines': blank_lines,
            'content_lines': content_lines,
            'code_lines': code_lines,
            'text_lines': content_lines - code_lines,
            'blank_percentage': round((blank_lines / total_lines * 100), 2) if total_lines > 0 else 0,
            'density_score': round((content_lines / total_lines * 100), 2) if total_lines > 0 else 0
        }
        
        # Warnings
        warnings = []
        if density['blank_percentage'] > 30:
            warnings.append('File has >30% blank lines - consider compacting')
        if density['density_score'] < 60:
            warnings.append('Low content density - may have excessive whitespace')
        
        density['warnings'] = warnings
        
        return density
    
    def run_all_checks(self) -> Dict:
        """Run all gap analysis checks"""
        return {
            'file': str(self.file_path),
            'excessive_gaps': self.find_excessive_gaps(),
            'trailing_whitespace': self.find_trailing_whitespace(),
            'indentation': self.find_inconsistent_indentation(),
            'section_gaps': self.find_section_gaps(),
            'list_formatting': self.check_list_formatting(),
            'density': self.analyze_density()
        }
    
    def print_report(self):
        """Print analysis report"""
        results = self.run_all_checks()
        
        print(f"\n{'='*80}")
        print(f"GAP & WHITESPACE ANALYSIS: {self.file_path.name}")
        print(f"{'='*80}\n")
        
        # Density metrics
        density = results['density']
        print("DENSITY METRICS:")
        print(f"  Total Lines: {density['total_lines']}")
        print(f"  Content Lines: {density['content_lines']} ({density['density_score']}%)")
        print(f"  Blank Lines: {density['blank_lines']} ({density['blank_percentage']}%)")
        print(f"  Code Lines: {density['code_lines']}")
        print(f"  Text Lines: {density['text_lines']}")
        
        if density['warnings']:
            print("\n  Density Warnings:")
            for warning in density['warnings']:
                print(f"    - {warning}")
        
        # Issues
        for category, issues in results.items():
            if category in ['file', 'density']:
                continue
            
            if issues:
                print(f"\n{category.upper().replace('_', ' ')}:")
                print(f"{'-'*80}")
                for issue in issues:
                    if 'line' in issue:
                        print(f"[{issue['severity']}] Line {issue['line']}: {issue['message']}")
                    else:
                        print(f"[{issue['severity']}] {issue['message']}")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python gap_whitespace_analyzer.py <markdown_file_or_directory>")
        sys.exit(1)
    
    target = Path(sys.argv[1])
    
    if target.is_dir():
        md_files = sorted(target.rglob("*.md"))
        print(f"Analyzing {len(md_files)} files...")
        for md_file in md_files:
            try:
                analyzer = GapAnalyzer(str(md_file))
                analyzer.print_report()
            except Exception as e:
                print(f"[ERROR] {md_file.name}: {e}")
    else:
        analyzer = GapAnalyzer(sys.argv[1])
        analyzer.print_report()

