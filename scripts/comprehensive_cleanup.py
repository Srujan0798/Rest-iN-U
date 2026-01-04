"""
Comprehensive Markdown Cleanup and Validation Script
=====================================================
This script performs deep cleaning and validation of all markdown files.
"""

import os
import re
import sys
from datetime import datetime

# Configuration
TARGET_DIR = r"c:\Users\Student\Documents\Rest-iN-U"
BACKUP_SUFFIX = ".bak_corrupt"
REPORT_FILE = os.path.join(TARGET_DIR, "scripts", "cleanup_report.txt")

# Skip these directories
SKIP_DIRS = ['node_modules', '.git', '.next', 'dist', 'build', '__pycache__']

# Garbage byte patterns to remove
GARBAGE_BYTES = [
    b'\xc3\x83', b'\xc3\x82', b'\xc3\xa2', b'\xc6\x92', 
    b'\xc5\xb8', b'\xc3\xb0', b'\xc7\x9f', b'\xc7\xbd'
]

class CleanupReport:
    def __init__(self):
        self.files_scanned = 0
        self.files_cleaned = 0
        self.files_with_issues = []
        self.total_garbage_removed = 0
        self.total_empty_lines_fixed = 0
        self.total_trailing_spaces_fixed = 0
        self.start_time = datetime.now()
        
    def add_issue(self, filepath, issue_type, details):
        self.files_with_issues.append({
            'file': filepath,
            'type': issue_type,
            'details': details
        })
        
    def generate_report(self):
        elapsed = datetime.now() - self.start_time
        report = []
        report.append("=" * 60)
        report.append("MARKDOWN CLEANUP REPORT")
        report.append("=" * 60)
        report.append(f"Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        report.append(f"Duration: {elapsed}")
        report.append("")
        report.append(f"Files Scanned: {self.files_scanned}")
        report.append(f"Files Cleaned: {self.files_cleaned}")
        report.append(f"Garbage Bytes Removed: {self.total_garbage_removed}")
        report.append(f"Empty Lines Fixed: {self.total_empty_lines_fixed}")
        report.append(f"Trailing Spaces Fixed: {self.total_trailing_spaces_fixed}")
        report.append("")
        
        if self.files_with_issues:
            report.append("-" * 60)
            report.append("FILES WITH REMAINING ISSUES:")
            report.append("-" * 60)
            for issue in self.files_with_issues:
                report.append(f"\n{issue['file']}")
                report.append(f"  Type: {issue['type']}")
                report.append(f"  Details: {issue['details']}")
        else:
            report.append("ALL FILES ARE CLEAN!")
            
        report.append("")
        report.append("=" * 60)
        return "\n".join(report)


def is_garbage_token(token):
    """Check if a token is mostly garbage (>20% non-ASCII)."""
    if not token:
        return False
    non_ascii = sum(1 for b in token if b > 127)
    return len(token) > 0 and (non_ascii / len(token)) > 0.2


def clean_garbage(content):
    """Remove garbage byte sequences from content."""
    lines = content.split(b'\n')
    new_lines = []
    garbage_count = 0
    
    for line in lines:
        # Check if line contains garbage
        has_garbage = any(g in line for g in GARBAGE_BYTES)
        
        if has_garbage:
            # Tokenize and filter
            tokens = line.split(b' ')
            clean_tokens = []
            for token in tokens:
                if is_garbage_token(token):
                    garbage_count += 1
                else:
                    clean_tokens.append(token)
            new_lines.append(b' '.join(clean_tokens))
        else:
            new_lines.append(line)
            
    return b'\n'.join(new_lines), garbage_count


def fix_formatting(text):
    """Fix common markdown formatting issues."""
    fixes = {
        'empty_lines': 0,
        'trailing_spaces': 0,
        'header_spacing': 0
    }
    
    lines = text.split('\n')
    new_lines = []
    prev_blank = False
    
    for i, line in enumerate(lines):
        # Remove trailing whitespace
        original_len = len(line)
        line = line.rstrip()
        if len(line) < original_len:
            fixes['trailing_spaces'] += 1
        
        # Collapse multiple blank lines into one
        is_blank = len(line.strip()) == 0
        if is_blank and prev_blank:
            fixes['empty_lines'] += 1
            continue
        prev_blank = is_blank
        
        # Ensure space after header markers
        header_match = re.match(r'^(#{1,6})([^\s#])', line)
        if header_match:
            line = header_match.group(1) + ' ' + line[len(header_match.group(1)):]
            fixes['header_spacing'] += 1
        
        new_lines.append(line)
    
    return '\n'.join(new_lines), fixes


def validate_structure(text, filepath):
    """Validate markdown structure and content."""
    issues = []
    
    # Check for orphaned code blocks
    code_block_count = text.count('```')
    if code_block_count % 2 != 0:
        issues.append("Unmatched code block markers")
    
    # Check for empty headers
    empty_headers = re.findall(r'^#{1,6}\s*$', text, re.MULTILINE)
    if empty_headers:
        issues.append(f"Found {len(empty_headers)} empty headers")
    
    # Check for broken links (common patterns)
    broken_links = re.findall(r'\[([^\]]*)\]\(\s*\)', text)
    if broken_links:
        issues.append(f"Found {len(broken_links)} empty link targets")
    
    # Check for remaining garbage patterns in text
    garbage_patterns = [
        r'Ã[ƒ‚¢]',  # Mojibake
        r'ǟ',  # Specific garbage char
        r'Ƕ϶',  # Double-encoded
    ]
    for pattern in garbage_patterns:
        matches = re.findall(pattern, text)
        if matches:
            issues.append(f"Possible remaining garbage: '{pattern}' ({len(matches)} occurrences)")
    
    return issues


def process_file(filepath, report):
    """Process a single markdown file."""
    try:
        # Read as binary first
        with open(filepath, 'rb') as f:
            raw_content = f.read()
    except Exception as e:
        report.add_issue(filepath, "READ_ERROR", str(e))
        return
    
    modified = False
    
    # 1. Clean garbage bytes
    cleaned_content, garbage_count = clean_garbage(raw_content)
    if garbage_count > 0:
        report.total_garbage_removed += garbage_count
        modified = True
    
    # 2. Decode to text
    try:
        text = cleaned_content.decode('utf-8')
    except UnicodeDecodeError:
        try:
            text = cleaned_content.decode('utf-8', errors='replace')
        except:
            report.add_issue(filepath, "DECODE_ERROR", "Could not decode file")
            return
    
    # 3. Fix formatting
    fixed_text, fixes = fix_formatting(text)
    if any(fixes.values()):
        report.total_empty_lines_fixed += fixes['empty_lines']
        report.total_trailing_spaces_fixed += fixes['trailing_spaces']
        modified = True
    
    # 4. Validate structure
    issues = validate_structure(fixed_text, filepath)
    for issue in issues:
        report.add_issue(filepath, "VALIDATION", issue)
    
    # 5. Write back if modified
    if modified:
        report.files_cleaned += 1
        with open(filepath, 'w', encoding='utf-8', newline='\n') as f:
            f.write(fixed_text)


def main():
    print("=" * 60)
    print("COMPREHENSIVE MARKDOWN CLEANUP")
    print("=" * 60)
    print(f"Target: {TARGET_DIR}")
    print(f"Started: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print()
    
    report = CleanupReport()
    
    for root, dirs, files in os.walk(TARGET_DIR):
        # Skip unwanted directories
        dirs[:] = [d for d in dirs if d not in SKIP_DIRS]
        
        for file in files:
            if file.endswith('.md') and not file.endswith(BACKUP_SUFFIX):
                # Skip backup files
                if 'FULL_BACKUP' in file or 'BACKUP_DO_NOT_COMMIT' in file:
                    continue
                    
                filepath = os.path.join(root, file)
                report.files_scanned += 1
                
                # Progress indicator
                if report.files_scanned % 10 == 0:
                    print(f"  Processed {report.files_scanned} files...")
                
                process_file(filepath, report)
    
    # Generate and save report
    report_text = report.generate_report()
    print()
    print(report_text)
    
    # Save report to file
    with open(REPORT_FILE, 'w', encoding='utf-8') as f:
        f.write(report_text)
    
    print(f"\nReport saved to: {REPORT_FILE}")


if __name__ == "__main__":
    main()
