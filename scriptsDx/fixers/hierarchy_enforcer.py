#!/usr/bin/env python3
"""
Hierarchy Enforcer
Validates and fixes heading hierarchy in markdown files
Ensures no skipped levels (e.g., # -> ### is invalid)
"""

import sys
import re
from pathlib import Path
from typing import List, Dict, Tuple

class HierarchyEnforcer:
    def __init__(self, vault_dir: str):
        self.vault_dir = Path(vault_dir)
        self.fixes_applied = 0
        
    def get_markdown_files(self) -> List[Path]:
        """Get all markdown files"""
        return sorted(self.vault_dir.rglob("*.md"))
    
    def extract_headings(self, lines: List[str]) -> List[Tuple[int, int, str]]:
        """Extract all headings with their levels and line numbers"""
        headings = []
        heading_pattern = re.compile(r'^(#{1,6})\s+(.+)$')
        
        for i, line in enumerate(lines):
            match = heading_pattern.match(line)
            if match:
                level = len(match.group(1))
                text = match.group(2).strip()
                headings.append((i, level, text))
        
        return headings
    
    def validate_hierarchy(self, headings: List[Tuple[int, int, str]]) -> List[Dict]:
        """Validate heading hierarchy and find issues"""
        issues = []
        
        if not headings:
            return issues
        
        prev_level = 0
        
        for line_num, level, text in headings:
            # Check for skipped levels
            if level > prev_level + 1:
                issues.append({
                    'line': line_num + 1,
                    'type': 'SKIPPED_LEVEL',
                    'severity': 'ERROR',
                    'current_level': level,
                    'previous_level': prev_level,
                    'text': text,
                    'message': f'Heading level {level} follows level {prev_level} (skipped level {prev_level + 1})'
                })
            
            # Check for too deep nesting (>6 levels)
            if level > 6:
                issues.append({
                    'line': line_num + 1,
                    'type': 'TOO_DEEP',
                    'severity': 'WARNING',
                    'current_level': level,
                    'text': text,
                    'message': f'Heading level {level} exceeds maximum depth of 6'
                })
            
            prev_level = level
        
        return issues
    
    def fix_hierarchy(self, lines: List[str], headings: List[Tuple[int, int, str]]) -> Tuple[List[str], int]:
        """Fix hierarchy issues"""
        if not headings:
            return lines, 0
        
        fixed_lines = lines.copy()
        fixes = 0
        
        prev_level = 0
        level_map = {}  # Track level adjustments
        
        for line_num, level, text in headings:
            expected_max_level = prev_level + 1
            
            # If level is skipped, adjust it
            if level > expected_max_level:
                # Adjust to expected level
                new_level = expected_max_level
                level_map[level] = new_level
                
                # Update the line
                new_heading = '#' * new_level + ' ' + text
                fixed_lines[line_num] = new_heading
                fixes += 1
                
                prev_level = new_level
            else:
                # Check if this level was previously mapped
                if level in level_map:
                    new_level = level_map[level]
                    new_heading = '#' * new_level + ' ' + text
                    fixed_lines[line_num] = new_heading
                    fixes += 1
                    prev_level = new_level
                else:
                    prev_level = level
        
        return fixed_lines, fixes
    
    def analyze_file(self, file_path: Path, fix: bool = False) -> Dict:
        """Analyze and optionally fix a file's hierarchy"""
        try:
            content = file_path.read_text(encoding='utf-8')
            lines = content.split('\n')
            
            headings = self.extract_headings(lines)
            issues = self.validate_hierarchy(headings)
            
            result = {
                'file': file_path.name,
                'total_headings': len(headings),
                'issues_found': len(issues),
                'issues': issues,
                'status': 'VALID' if not issues else 'INVALID'
            }
            
            if fix and issues:
                fixed_lines, fixes = self.fix_hierarchy(lines, headings)
                
                if fixes > 0:
                    # Write back to file
                    file_path.write_text('\n'.join(fixed_lines), encoding='utf-8')
                    result['fixes_applied'] = fixes
                    result['status'] = 'FIXED'
                    self.fixes_applied += fixes
            
            return result
            
        except Exception as e:
            return {'file': file_path.name, 'error': str(e)}
    
    def run_validation(self, fix: bool = False):
        """Run validation on all files"""
        files = self.get_markdown_files()
        
        print(f"\n{'='*80}")
        print(f"HIERARCHY ENFORCER - Heading Level Validation")
        print(f"{'='*80}\n")
        print(f"Files to check: {len(files)}")
        print(f"Mode: {'FIX' if fix else 'CHECK ONLY'}\n")
        
        all_results = []
        
        for file_path in files:
            result = self.analyze_file(file_path, fix)
            all_results.append(result)
            
            if 'error' in result:
                print(f"[ERROR] {result['file']}: {result['error']}")
                continue
            
            status_symbol = {
                'VALID': '[OK]',
                'INVALID': '[!]',
                'FIXED': '[FIXED]'
            }.get(result['status'], '[?]')
            
            print(f"{status_symbol} {result['file']}: "
                  f"{result['total_headings']} headings, "
                  f"{result['issues_found']} issues", end='')
            
            if result.get('fixes_applied'):
                print(f", {result['fixes_applied']} fixes applied")
            else:
                print()
            
            # Show issues if any
            if result['issues'] and not fix:
                for issue in result['issues'][:3]:  # Show first 3
                    print(f"    Line {issue['line']}: {issue['message']}")
                if len(result['issues']) > 3:
                    print(f"    ... and {len(result['issues']) - 3} more issues")
        
        self.print_summary(all_results, fix)
        return all_results
    
    def print_summary(self, results: List[Dict], fix: bool):
        """Print summary of validation"""
        print(f"\n{'='*80}")
        print("SUMMARY")
        print(f"{'='*80}\n")
        
        valid_results = [r for r in results if 'error' not in r]
        
        total_files = len(valid_results)
        total_headings = sum(r['total_headings'] for r in valid_results)
        total_issues = sum(r['issues_found'] for r in valid_results)
        
        valid_files = [r for r in valid_results if r['status'] == 'VALID']
        invalid_files = [r for r in valid_results if r['status'] in ['INVALID', 'FIXED']]
        
        print(f"Files checked: {total_files}")
        print(f"Total headings: {total_headings}")
        print(f"Total issues: {total_issues}")
        print(f"Valid files: {len(valid_files)}")
        print(f"Files with issues: {len(invalid_files)}\n")
        
        if fix and self.fixes_applied > 0:
            print(f"[OK] Applied {self.fixes_applied} fixes\n")
        
        if invalid_files and not fix:
            print("Files needing fixes:")
            for result in invalid_files[:10]:
                print(f"  - {result['file']}: {result['issues_found']} issues")
            if len(invalid_files) > 10:
                print(f"  ... and {len(invalid_files) - 10} more files")
            print("\nRun with --fix flag to automatically fix issues")
        
        print()

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python hierarchy_enforcer.py <vault_directory> [--fix]")
        sys.exit(1)
    
    vault_dir = sys.argv[1]
    fix_mode = '--fix' in sys.argv
    
    enforcer = HierarchyEnforcer(vault_dir)
    enforcer.run_validation(fix=fix_mode)
