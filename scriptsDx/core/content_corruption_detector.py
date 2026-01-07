#!/usr/bin/env python3
"""
Content Corruption & Relevance Detector
Identifies corrupted data, misplaced content, and validates content relevance
"""

import re
import sys
from pathlib import Path
from typing import List, Dict, Set
from collections import Counter

class ContentValidator:
    def __init__(self, file_path: str):
        self.file_path = Path(file_path)
        self.content = self.file_path.read_text(encoding='utf-8', errors='replace')
        self.lines = self.content.split('\n')
        
        # Extract expected domain from filename
        self.expected_domain = self._extract_domain_from_filename()
        
    def _extract_domain_from_filename(self) -> Set[str]:
        """Extract expected keywords from filename"""
        filename = self.file_path.stem.lower()
        
        # Remove numbering prefixes like "01_", "02_"
        filename = re.sub(r'^\d+_', '', filename)
        
        # Split on underscores and hyphens
        keywords = set(re.split(r'[_\-]', filename))
        
        # Common tech domains mapping
        domain_map = {
            'frontend': {'react', 'vue', 'angular', 'css', 'html', 'javascript', 'typescript', 'ui', 'ux'},
            'backend': {'api', 'server', 'node', 'django', 'flask', 'express', 'rest', 'graphql'},
            'database': {'sql', 'postgres', 'mysql', 'mongodb', 'redis', 'orm', 'query', 'index'},
            'testing': {'test', 'jest', 'vitest', 'cypress', 'playwright', 'unit', 'integration', 'e2e'},
            'security': {'auth', 'oauth', 'jwt', 'encryption', 'csrf', 'xss', 'cors'},
            'devops': {'docker', 'kubernetes', 'ci', 'cd', 'deploy', 'aws', 'gcp', 'azure'},
            'mobile': {'ios', 'android', 'react-native', 'flutter', 'swift', 'kotlin'},
            'ml': {'machine', 'learning', 'ai', 'neural', 'model', 'training', 'tensorflow'}
        }
        
        # Expand keywords based on domain
        for domain, domain_keywords in domain_map.items():
            if any(kw in filename for kw in domain_keywords):
                keywords.update(domain_keywords)
        
        return keywords
    
    def detect_encoding_issues(self) -> List[Dict]:
        """Detect encoding or character corruption"""
        issues = []
        
        # Patterns that indicate corruption
        corruption_patterns = [
            (r'[\ufffd]+', 'REPLACEMENT_CHARACTERS'),  # Unicode replacement char
            (r'\\x[0-9a-fA-F]{2}', 'HEX_ESCAPE_SEQUENCES'),
            (r'\\u[0-9a-fA-F]{4}', 'UNICODE_ESCAPE_SEQUENCES'),
            (r'[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]', 'CONTROL_CHARACTERS'),
            (r'[^\x00-\x7F]{20,}', 'LONG_NON_ASCII_SEQUENCES')
        ]
        
        for line_num, line in enumerate(self.lines, 1):
            for pattern, issue_type in corruption_patterns:
                if re.search(pattern, line):
                    issues.append({
                        'line': line_num,
                        'type': issue_type,
                        'message': f'Possible encoding corruption detected',
                        'content': line[:100],
                        'severity': 'ERROR'
                    })
        
        return issues
    
    def detect_incomplete_structures(self) -> List[Dict]:
        """Detect incomplete or broken structures"""
        issues = []
        
        # Check for incomplete code blocks
        code_fence_count = sum(1 for line in self.lines if line.strip().startswith('```'))
        if code_fence_count % 2 != 0:
            issues.append({
                'type': 'INCOMPLETE_CODE_BLOCK',
                'message': f'Odd number of code fences ({code_fence_count}) - possible unclosed block',
                'severity': 'ERROR'
            })
        
        # Check for incomplete lists
        in_list = False
        list_start = 0
        for line_num, line in enumerate(self.lines, 1):
            if re.match(r'^\s*[-*+]\s+', line):
                if not in_list:
                    in_list = True
                    list_start = line_num
            elif line.strip() and in_list:
                # Non-list content after list
                if not re.match(r'^\s*[-*+]\s+', line) and not line.strip().startswith('>'):
                    # Check if list was incomplete (no proper ending)
                    if line_num - list_start < 2:
                        issues.append({
                            'line': list_start,
                            'type': 'SINGLE_ITEM_LIST',
                            'message': 'List with only one item (may be incomplete)',
                            'severity': 'WARNING'
                        })
                    in_list = False
        
        # Check for incomplete tables
        table_pattern = re.compile(r'^\|.+\|$')
        in_table = False
        table_start = 0
        table_rows = 0
        
        for line_num, line in enumerate(self.lines, 1):
            if table_pattern.match(line):
                if not in_table:
                    in_table = True
                    table_start = line_num
                    table_rows = 1
                else:
                    table_rows += 1
            elif in_table:
                if table_rows < 2:  # Header + separator minimum
                    issues.append({
                        'line': table_start,
                        'type': 'INCOMPLETE_TABLE',
                        'message': 'Table appears incomplete (less than 2 rows)',
                        'severity': 'WARNING'
                    })
                in_table = False
        
        return issues
    
    def detect_misplaced_content(self) -> List[Dict]:
        """Detect content that doesn't match the file's domain"""
        issues = []
        
        if not self.expected_domain:
            return issues
        
        # Define tech domain keywords
        tech_domains = {
            'frontend': ['react', 'vue', 'component', 'jsx', 'css', 'tailwind', 'dom', 'browser'],
            'backend': ['api', 'endpoint', 'server', 'middleware', 'route', 'controller'],
            'database': ['sql', 'query', 'table', 'index', 'migration', 'schema', 'orm'],
            'mobile': ['ios', 'android', 'swift', 'kotlin', 'react-native', 'flutter'],
            'security': ['auth', 'token', 'hash', 'encrypt', 'csrf', 'xss', 'cors'],
            'testing': ['test', 'jest', 'expect', 'assert', 'mock', 'spec']
        }
        
        # Get file's expected domain
        file_domain = None
        for domain, keywords in tech_domains.items():
            if any(kw in self.file_path.name.lower() for kw in keywords):
                file_domain = domain
                break
        
        if not file_domain:
            return issues
        
        # Check sections for domain mismatch
        current_section = ""
        section_line = 0
        
        for line_num, line in enumerate(self.lines, 1):
            # Detect section headers
            if match := re.match(r'^#{1,3}\s+(.+)$', line):
                current_section = match.group(1).lower()
                section_line = line_num
                
                # Check if section mentions other domains
                for other_domain, keywords in tech_domains.items():
                    if other_domain == file_domain:
                        continue
                    
                    if any(kw in current_section for kw in keywords):
                        # Allow some cross-domain content (e.g., API in frontend)
                        if not self._is_acceptable_crossdomain(file_domain, other_domain):
                            issues.append({
                                'line': section_line,
                                'type': 'MISPLACED_SECTION',
                                'message': f'Section about {other_domain} found in {file_domain} file',
                                'section': current_section,
                                'severity': 'WARNING'
                            })
        
        return issues
    
    def _is_acceptable_crossdomain(self, file_domain: str, content_domain: str) -> bool:
        """Check if cross-domain content is acceptable"""
        acceptable = {
            'frontend': ['backend', 'security'],  # Frontend can mention APIs, auth
            'backend': ['database', 'security'],
            'mobile': ['frontend', 'backend'],
        }
        
        return content_domain in acceptable.get(file_domain, [])
    
    def detect_duplicate_sections(self) -> List[Dict]:
        """Detect duplicate or near-duplicate sections"""
        issues = []
        
        sections = {}
        heading_pattern = re.compile(r'^#{1,6}\s+(.+)$')
        
        for line_num, line in enumerate(self.lines, 1):
            if match := heading_pattern.match(line):
                section_title = match.group(1).strip().lower()
                
                if section_title in sections:
                    issues.append({
                        'line': line_num,
                        'type': 'DUPLICATE_SECTION',
                        'message': f'Duplicate section title: "{section_title}"',
                        'first_occurrence': sections[section_title],
                        'severity': 'ERROR'
                    })
                else:
                    sections[section_title] = line_num
        
        return issues
    
    def check_content_quality(self) -> List[Dict]:
        """Check for low-quality content patterns"""
        issues = []
        
        quality_patterns = [
            (r'(TODO|FIXME|XXX|HACK):', 'TODO_MARKER'),
            (r'\?\?\?+', 'PLACEHOLDER_QUESTIONS'),
            (r'Lorem ipsum', 'PLACEHOLDER_TEXT'),
            (r'test test test', 'REPETITIVE_PLACEHOLDER'),
            (r'\[Insert .+?\]', 'TEMPLATE_PLACEHOLDER'),
            (r'Coming soon|To be added', 'INCOMPLETE_CONTENT')
        ]
        
        for line_num, line in enumerate(self.lines, 1):
            for pattern, issue_type in quality_patterns:
                if re.search(pattern, line, re.IGNORECASE):
                    issues.append({
                        'line': line_num,
                        'type': issue_type,
                        'message': f'Placeholder or incomplete content detected',
                        'content': line.strip()[:80],
                        'severity': 'WARNING'
                    })
        
        return issues
    
    def analyze_content_density(self) -> Dict:
        """Analyze meaningful content vs noise"""
        total_lines = len(self.lines)
        
        # Count different content types
        code_lines = 0
        comment_lines = 0
        blank_lines = 0
        text_lines = 0
        
        in_code_block = False
        
        for line in self.lines:
            if line.strip().startswith('```'):
                in_code_block = not in_code_block
                continue
            
            if not line.strip():
                blank_lines += 1
            elif in_code_block:
                code_lines += 1
            elif line.strip().startswith(('<!--', '//', '#')):
                comment_lines += 1
            else:
                text_lines += 1
        
        # Calculate metrics
        content_lines = code_lines + text_lines
        content_ratio = (content_lines / total_lines * 100) if total_lines > 0 else 0
        
        return {
            'total_lines': total_lines,
            'content_lines': content_lines,
            'code_lines': code_lines,
            'text_lines': text_lines,
            'blank_lines': blank_lines,
            'comment_lines': comment_lines,
            'content_ratio': round(content_ratio, 2)
        }
    
    def run_all_validations(self) -> Dict:
        """Run all content validations"""
        return {
            'file': str(self.file_path),
            'expected_domain': list(self.expected_domain),
            'encoding_issues': self.detect_encoding_issues(),
            'incomplete_structures': self.detect_incomplete_structures(),
            'misplaced_content': self.detect_misplaced_content(),
            'duplicate_sections': self.detect_duplicate_sections(),
            'quality_issues': self.check_content_quality(),
            'content_density': self.analyze_content_density()
        }
    
    def print_report(self):
        """Print validation report"""
        results = self.run_all_validations()
        
        print(f"\n{'='*80}")
        print(f"CONTENT VALIDATION REPORT: {self.file_path.name}")
        print(f"{'='*80}\n")
        
        print(f"Expected Domain Keywords: {', '.join(results['expected_domain'])}\n")
        
        # Content density
        density = results['content_density']
        print("CONTENT METRICS:")
        print(f"  Total Lines: {density['total_lines']}")
        print(f"  Content Lines: {density['content_lines']} ({density['content_ratio']}%)")
        print(f"  Code Lines: {density['code_lines']}")
        print(f"  Text Lines: {density['text_lines']}")
        print(f"  Blank Lines: {density['blank_lines']}\n")
        
        # Issues
        total_issues = 0
        for category, issues in results.items():
            if category in ['file', 'expected_domain', 'content_density']:
                continue
            
            if issues:
                print(f"{category.upper().replace('_', ' ')}:")
                print(f"{'-'*80}")
                for issue in issues:
                    total_issues += 1
                    severity = issue.get('severity', 'INFO')
                    line_info = f"Line {issue['line']}: " if 'line' in issue else ""
                    print(f"[{severity}] {line_info}{issue['message']}")
                    if 'content' in issue:
                        print(f"  Content: {issue['content']}")
                print()
        
        if total_issues == 0:
            print("[OK] No content issues detected!\n")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python content_corruption_detector.py <markdown_file_or_directory>")
        sys.exit(1)
    
    target = Path(sys.argv[1])
    
    if target.is_dir():
        # Handle directory - process all markdown files
        md_files = sorted(target.rglob("*.md"))
        print(f"Processing {len(md_files)} markdown files...")
        for md_file in md_files:
            print(f"\n{md_file.name}:")
            try:
                validator = ContentValidator(str(md_file))
                validator.print_report()
            except Exception as e:
                print(f"  [ERROR] {e}")
    else:
        # Handle single file
        validator = ContentValidator(sys.argv[1])
        validator.print_report()

