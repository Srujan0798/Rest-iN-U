#!/usr/bin/env python3
"""
Cross-File Consistency Checker
Ensures all MD files follow the same formatting standards
"""

import re
import sys
from pathlib import Path
from typing import List, Dict, Set
from collections import defaultdict, Counter

class ConsistencyChecker:
    def __init__(self, directory: str):
        self.directory = Path(directory)
        self.md_files = list(self.directory.glob('**/*.md'))
        self.file_patterns = {}
        
    def analyze_file_structure(self, file_path: Path) -> Dict:
        """Extract structural patterns from a file"""
        content = file_path.read_text(encoding='utf-8')
        lines = content.split('\n')
        
        structure = {
            'file': str(file_path),
            'heading_style': self._detect_heading_style(lines),
            'list_style': self._detect_list_style(lines),
            'code_fence_style': self._detect_code_fence_style(lines),
            'link_style': self._detect_link_style(content),
            'emphasis_style': self._detect_emphasis_style(content),
            'has_toc': self._has_table_of_contents(lines),
            'heading_levels': self._get_heading_levels(lines),
            'section_order': self._get_section_order(lines)
        }
        
        return structure
    
    def _detect_heading_style(self, lines: List[str]) -> Dict:
        """Detect heading formatting patterns"""
        atx_count = 0  # # Heading
        setext_count = 0  # Heading followed by === or ---
        
        for i, line in enumerate(lines):
            if re.match(r'^#{1,6}\s+', line):
                atx_count += 1
            elif i < len(lines) - 1 and re.match(r'^[=\-]{3,}$', lines[i + 1]):
                setext_count += 1
        
        return {
            'atx_style': atx_count,
            'setext_style': setext_count,
            'primary': 'atx' if atx_count > setext_count else 'setext'
        }
    
    def _detect_list_style(self, lines: List[str]) -> Dict:
        """Detect list marker preferences"""
        markers = defaultdict(int)
        
        for line in lines:
            if match := re.match(r'^(\s*)([-*+])\s+', line):
                markers[match.group(2)] += 1
        
        return {
            'markers': dict(markers),
            'primary': max(markers.items(), key=lambda x: x[1])[0] if markers else None
        }
    
    def _detect_code_fence_style(self, lines: List[str]) -> Dict:
        """Detect code fence preferences"""
        backtick_count = 0
        tilde_count = 0
        
        for line in lines:
            if line.startswith('```'):
                backtick_count += 1
            elif line.startswith('~~~'):
                tilde_count += 1
        
        return {
            'backticks': backtick_count,
            'tildes': tilde_count,
            'primary': 'backticks' if backtick_count > tilde_count else 'tildes'
        }
    
    def _detect_link_style(self, content: str) -> Dict:
        """Detect link formatting preferences"""
        inline = len(re.findall(r'\[.+?\]\(.+?\)', content))
        reference = len(re.findall(r'\[.+?\]\[.+?\]', content))
        
        return {
            'inline': inline,
            'reference': reference,
            'primary': 'inline' if inline > reference else 'reference'
        }
    
    def _detect_emphasis_style(self, content: str) -> Dict:
        """Detect emphasis marker preferences"""
        asterisk_bold = len(re.findall(r'\*\*.+?\*\*', content))
        underscore_bold = len(re.findall(r'__.+?__', content))
        asterisk_italic = len(re.findall(r'(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)', content))
        underscore_italic = len(re.findall(r'(?<!_)_(?!_)(.+?)(?<!_)_(?!_)', content))
        
        return {
            'bold': {
                'asterisk': asterisk_bold,
                'underscore': underscore_bold,
                'primary': 'asterisk' if asterisk_bold > underscore_bold else 'underscore'
            },
            'italic': {
                'asterisk': asterisk_italic,
                'underscore': underscore_italic,
                'primary': 'asterisk' if asterisk_italic > underscore_italic else 'underscore'
            }
        }
    
    def _has_table_of_contents(self, lines: List[str]) -> bool:
        """Check if file has a TOC"""
        toc_indicators = [
            'table of contents',
            'contents',
            'toc',
            '## table of contents',
            '## contents'
        ]
        
        first_100 = '\n'.join(lines[:100]).lower()
        return any(indicator in first_100 for indicator in toc_indicators)
    
    def _get_heading_levels(self, lines: List[str]) -> List[int]:
        """Extract heading level distribution"""
        levels = []
        for line in lines:
            if match := re.match(r'^(#{1,6})\s+', line):
                levels.append(len(match.group(1)))
        return levels
    
    def _get_section_order(self, lines: List[str]) -> List[str]:
        """Extract top-level section names"""
        sections = []
        for line in lines:
            if match := re.match(r'^##\s+(.+)$', line):
                sections.append(match.group(1).strip())
        return sections[:10]  # First 10 sections
    
    def compare_structures(self) -> Dict:
        """Compare structures across all files"""
        structures = []
        for file_path in self.md_files:
            try:
                structure = self.analyze_file_structure(file_path)
                structures.append(structure)
            except Exception as e:
                print(f"Error analyzing {file_path}: {e}")
        
        # Aggregate patterns
        heading_styles = Counter(s['heading_style']['primary'] for s in structures)
        list_styles = Counter(s['list_style']['primary'] for s in structures if s['list_style']['primary'])
        code_styles = Counter(s['code_fence_style']['primary'] for s in structures)
        link_styles = Counter(s['link_style']['primary'] for s in structures)
        
        # Find inconsistencies
        inconsistencies = []
        
        # Check heading style consistency
        if len(heading_styles) > 1:
            inconsistencies.append({
                'type': 'HEADING_STYLE_INCONSISTENCY',
                'message': f'Multiple heading styles used: {dict(heading_styles)}',
                'severity': 'WARNING'
            })
        
        # Check list marker consistency
        if len(list_styles) > 1:
            inconsistencies.append({
                'type': 'LIST_MARKER_INCONSISTENCY',
                'message': f'Multiple list markers used: {dict(list_styles)}',
                'severity': 'WARNING'
            })
        
        # Check code fence consistency
        if len(code_styles) > 1:
            inconsistencies.append({
                'type': 'CODE_FENCE_INCONSISTENCY',
                'message': f'Multiple code fence styles used: {dict(code_styles)}',
                'severity': 'INFO'
            })
        
        # File-specific deviations
        if heading_styles:
            dominant_heading = heading_styles.most_common(1)[0][0]
            for s in structures:
                if s['heading_style']['primary'] != dominant_heading:
                    inconsistencies.append({
                        'type': 'FILE_DEVIATION',
                        'file': Path(s['file']).name,
                        'message': f'Uses {s["heading_style"]["primary"]} headings (standard: {dominant_heading})',
                        'severity': 'WARNING'
                    })
        
        return {
            'total_files': len(structures),
            'patterns': {
                'heading_styles': dict(heading_styles),
                'list_styles': dict(list_styles),
                'code_styles': dict(code_styles),
                'link_styles': dict(link_styles)
            },
            'inconsistencies': inconsistencies,
            'files_with_toc': sum(1 for s in structures if s['has_toc']),
            'files_without_toc': sum(1 for s in structures if not s['has_toc'])
        }
    
    def check_naming_conventions(self) -> List[Dict]:
        """Check file naming consistency"""
        issues = []
        
        naming_patterns = {
            'snake_case': re.compile(r'^[a-z0-9_]+\.md$'),
            'kebab-case': re.compile(r'^[a-z0-9-]+\.md$'),
            'PascalCase': re.compile(r'^[A-Z][a-zA-Z0-9]+\.md$'),
            'camelCase': re.compile(r'^[a-z][a-zA-Z0-9]+\.md$'),
            'UPPER_CASE': re.compile(r'^[A-Z0-9_]+\.md$')
        }
        
        file_patterns = defaultdict(list)
        
        for file_path in self.md_files:
            matched = False
            for pattern_name, pattern in naming_patterns.items():
                if pattern.match(file_path.name):
                    file_patterns[pattern_name].append(file_path.name)
                    matched = True
                    break
            
            if not matched:
                issues.append({
                    'type': 'UNCONVENTIONAL_NAME',
                    'file': file_path.name,
                    'message': 'Filename does not follow common naming convention',
                    'severity': 'INFO'
                })
        
        # Check for mixed conventions
        if len(file_patterns) > 1:
            issues.append({
                'type': 'MIXED_NAMING_CONVENTIONS',
                'message': f'Multiple naming conventions used: {list(file_patterns.keys())}',
                'severity': 'WARNING',
                'details': {k: len(v) for k, v in file_patterns.items()}
            })
        
        return issues
    
    def print_report(self):
        """Print consistency report"""
        comparison = self.compare_structures()
        naming_issues = self.check_naming_conventions()
        
        print(f"\n{'='*80}")
        print(f"CROSS-FILE CONSISTENCY REPORT")
        print(f"{'='*80}\n")
        
        print(f"Total Files Analyzed: {comparison['total_files']}")
        print(f"Files with TOC: {comparison['files_with_toc']}")
        print(f"Files without TOC: {comparison['files_without_toc']}\n")
        
        print("FORMATTING PATTERNS:")
        print(f"{'-'*80}")
        for pattern_type, patterns in comparison['patterns'].items():
            print(f"  {pattern_type}: {patterns}")
        
        if comparison['inconsistencies']:
            print(f"\nINCONSISTENCIES FOUND:")
            print(f"{'-'*80}")
            for issue in comparison['inconsistencies']:
                severity = issue['severity']
                file_info = f" - {issue['file']}" if 'file' in issue else ""
                print(f"[{severity}]{file_info} {issue['message']}")
        
        if naming_issues:
            print(f"\nNAMING CONVENTION ISSUES:")
            print(f"{'-'*80}")
            for issue in naming_issues:
                severity = issue['severity']
                file_info = f" - {issue.get('file', '')}"
                print(f"[{severity}]{file_info} {issue['message']}")
                if 'details' in issue:
                    for convention, count in issue['details'].items():
                        print(f"    {convention}: {count} files")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python cross_file_consistency.py <directory>")
        sys.exit(1)
    
    checker = ConsistencyChecker(sys.argv[1])
    checker.print_report()
