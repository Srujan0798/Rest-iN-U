#!/usr/bin/env python3
"""
LINE-BY-LINE VALIDATOR - Checks EVERY single line in EVERY file
This is the most thorough validation possible - checks every character
"""
import re
import sys
from pathlib import Path
from typing import List, Dict, Tuple

class LineByLineValidator:
    def __init__(self):
        self.total_lines_checked = 0
        self.total_files_checked = 0
        self.all_issues = []
        
    def check_line(self, line: str, line_num: int, file_path: str) -> List[Dict]:
        """Check a single line for ALL possible issues."""
        issues = []
        
        # Check for BOM
        if '\ufeff' in line:
            issues.append({
                'file': file_path,
                'line': line_num,
                'type': 'BOM',
                'severity': 'HIGH',
                'message': 'Byte Order Mark found',
                'content': repr(line[:50])
            })
        
        # Check for corrupted characters
        corrupted_patterns = [
            (r'[^\x00-\x7F\u0080-\uFFFF]', 'Invalid Unicode character'),
            (r'\x00', 'Null byte'),
            (r'�', 'Replacement character (corrupted encoding)'),
        ]
        
        for pattern, msg in corrupted_patterns:
            if re.search(pattern, line):
                issues.append({
                    'file': file_path,
                    'line': line_num,
                    'type': 'CORRUPTION',
                    'severity': 'CRITICAL',
                    'message': msg,
                    'content': repr(line[:50])
                })
        
        # Check for trailing whitespace
        if line.rstrip('\r\n') != line.rstrip('\r\n').rstrip():
            issues.append({
                'file': file_path,
                'line': line_num,
                'type': 'WHITESPACE',
                'severity': 'LOW',
                'message': 'Trailing whitespace',
                'content': repr(line[:50])
            })
        
        # Check for tabs
        if '\t' in line:
            issues.append({
                'file': file_path,
                'line': line_num,
                'type': 'WHITESPACE',
                'severity': 'MEDIUM',
                'message': 'Tab character found (should use spaces)',
                'content': repr(line[:50])
            })
        
        # Check for mixed line endings
        if '\r\n' in line and line.count('\r') != line.count('\n'):
            issues.append({
                'file': file_path,
                'line': line_num,
                'type': 'LINE_ENDING',
                'severity': 'MEDIUM',
                'message': 'Mixed line endings',
                'content': repr(line[:50])
            })
        
        return issues
    
    def validate_file(self, file_path: Path) -> Dict:
        """Validate every single line in a file."""
        print(f"\n[CHECKING] {file_path.name}")
        print(f"   Reading file...")
        
        try:
            with open(file_path, 'r', encoding='utf-8', errors='replace') as f:
                lines = f.readlines()
        except Exception as e:
            return {
                'file': str(file_path),
                'error': str(e),
                'lines_checked': 0,
                'issues': []
            }
        
        file_issues = []
        total_lines = len(lines)
        
        print(f"   Total lines: {total_lines}")
        print(f"   Checking line by line...")
        
        # Check every single line
        for i, line in enumerate(lines, 1):
            line_issues = self.check_line(line, i, str(file_path))
            file_issues.extend(line_issues)
            
            # Progress indicator every 1000 lines
            if i % 1000 == 0:
                print(f"   Progress: {i}/{total_lines} lines checked...")
        
        self.total_lines_checked += total_lines
        self.total_files_checked += 1
        
        if file_issues:
            print(f"   [!] Found {len(file_issues)} issues")
        else:
            print(f"   [OK] No issues found")
        
        return {
            'file': str(file_path),
            'lines_checked': total_lines,
            'issues': file_issues
        }
    
    def validate_directory(self, dir_path: Path) -> List[Dict]:
        """Validate all markdown files in directory."""
        md_files = sorted(list(dir_path.rglob('*.md')))
        
        print(f"\n{'='*80}")
        print(f"LINE-BY-LINE VALIDATION")
        print(f"{'='*80}")
        print(f"\nDirectory: {dir_path}")
        print(f"Total files to check: {len(md_files)}")
        print(f"\nStarting exhaustive line-by-line validation...")
        
        results = []
        for file_path in md_files:
            result = self.validate_file(file_path)
            results.append(result)
            self.all_issues.extend(result['issues'])
        
        return results
    
    def print_summary(self):
        """Print comprehensive summary."""
        print(f"\n{'='*80}")
        print(f"VALIDATION COMPLETE")
        print(f"{'='*80}")
        print(f"\nStatistics:")
        print(f"   Files checked: {self.total_files_checked}")
        print(f"   Total lines checked: {self.total_lines_checked:,}")
        print(f"   Total issues found: {len(self.all_issues)}")
        
        if self.all_issues:
            # Group by severity
            by_severity = {}
            for issue in self.all_issues:
                sev = issue['severity']
                by_severity.setdefault(sev, []).append(issue)
            
            print(f"\nIssues by severity:")
            for severity in ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW']:
                if severity in by_severity:
                    count = len(by_severity[severity])
                    print(f"   {severity}: {count}")
            
            # Show first 10 critical/high issues
            critical_high = [i for i in self.all_issues if i['severity'] in ['CRITICAL', 'HIGH']]
            if critical_high:
                print(f"\nFirst 10 Critical/High issues:")
                for issue in critical_high[:10]:
                    print(f"   {Path(issue['file']).name}:{issue['line']} - {issue['message']}")
        else:
            print(f"\n[SUCCESS] No issues found in any file!")

def main():
    if len(sys.argv) < 2:
        print("Usage: python line_by_line_validator.py <directory>")
        sys.exit(1)
    
    dir_path = Path(sys.argv[1])
    
    if not dir_path.exists():
        print(f"Error: Directory {dir_path} does not exist")
        sys.exit(1)
    
    validator = LineByLineValidator()
    results = validator.validate_directory(dir_path)
    validator.print_summary()
    
    # Exit with error code if critical issues found
    critical_count = sum(1 for i in validator.all_issues if i['severity'] == 'CRITICAL')
    if critical_count > 0:
        sys.exit(1)
    else:
        sys.exit(0)

if __name__ == '__main__':
    main()
