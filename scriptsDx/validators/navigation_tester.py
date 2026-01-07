#!/usr/bin/env python3
"""
Navigation Tester
Tests if finding information is easy
Validates TOC accuracy and cross-references
"""

import sys
import re
from pathlib import Path
from typing import List, Dict, Set

class NavigationTester:
    def __init__(self, vault_dir: str):
        self.vault_dir = Path(vault_dir)
    
    def get_markdown_files(self) -> List[Path]:
        """Get all markdown files"""
        return sorted(self.vault_dir.rglob("*.md"))
    
    def test_navigation(self, file_path: Path) -> Dict:
        """Test navigation in a file"""
        try:
            content = file_path.read_text(encoding='utf-8')
            lines = content.split('\n')
            
            issues = []
            
            # Test 1: TOC accuracy
            toc_issues = self.test_toc_accuracy(content, lines)
            issues.extend(toc_issues)
            
            # Test 2: Internal links
            link_issues = self.test_internal_links(content, lines)
            issues.extend(link_issues)
            
            # Test 3: Anchor links
            anchor_issues = self.test_anchor_links(content)
            issues.extend(anchor_issues)
            
            # Test 4: Heading findability
            findability_score = self.test_findability(lines)
            
            # Calculate navigation score
            nav_score = self.calculate_nav_score(issues, findability_score)
            
            return {
                'file': file_path.name,
                'navigation_score': nav_score,
                'findability_score': findability_score,
                'issues': issues,
                'rating': self.get_rating(nav_score)
            }
            
        except Exception as e:
            return {'file': file_path.name, 'error': str(e)}
    
    def test_toc_accuracy(self, content: str, lines: List[str]) -> List[Dict]:
        """Test if TOC matches actual headings"""
        issues = []
        
        # Find TOC section
        toc_start = -1
        toc_end = -1
        
        for i, line in enumerate(lines):
            if 'table of contents' in line.lower() or line.lower().strip() == '## contents':
                toc_start = i
            elif toc_start != -1 and line.startswith('##') and i > toc_start + 1:
                toc_end = i
                break
        
        if toc_start == -1:
            # No TOC found
            if len(lines) > 100:
                issues.append({
                    'type': 'MISSING_TOC',
                    'severity': 'WARNING',
                    'message': 'Long file missing table of contents'
                })
            return issues
        
        # Extract TOC entries
        toc_entries = []
        for i in range(toc_start, toc_end if toc_end != -1 else len(lines)):
            line = lines[i]
            if re.match(r'^\s*[-*+]\s+\[', line):
                # Extract heading from TOC link
                match = re.search(r'\[([^\]]+)\]', line)
                if match:
                    toc_entries.append(match.group(1).lower().strip())
        
        # Extract actual headings
        actual_headings = []
        for line in lines:
            if line.startswith('##'):
                heading = line.strip('#').strip().lower()
                if 'table of contents' not in heading and 'contents' != heading:
                    actual_headings.append(heading)
        
        # Compare
        for heading in actual_headings:
            if heading not in toc_entries:
                issues.append({
                    'type': 'TOC_MISMATCH',
                    'severity': 'WARNING',
                    'message': f'Heading "{heading}" not in TOC'
                })
        
        return issues
    
    def test_internal_links(self, content: str, lines: List[str]) -> List[Dict]:
        """Test internal links"""
        issues = []
        
        # Find all internal links
        link_pattern = re.compile(r'\[([^\]]+)\]\(#([^\)]+)\)')
        
        for i, line in enumerate(lines):
            matches = link_pattern.findall(line)
            for link_text, anchor in matches:
                # Check if anchor exists
                anchor_pattern = f'#{anchor}'
                if anchor_pattern not in content and anchor.replace('-', ' ') not in content.lower():
                    issues.append({
                        'line': i + 1,
                        'type': 'BROKEN_INTERNAL_LINK',
                        'severity': 'ERROR',
                        'message': f'Broken internal link: #{anchor}'
                    })
        
        return issues
    
    def test_anchor_links(self, content: str) -> List[Dict]:
        """Test anchor links"""
        issues = []
        
        # Find all anchor references
        anchor_refs = re.findall(r'\(#([^\)]+)\)', content)
        
        # Find all possible anchors (headings)
        heading_anchors = set()
        for line in content.split('\n'):
            if line.startswith('#'):
                heading = line.strip('#').strip()
                # Convert to anchor format
                anchor = heading.lower().replace(' ', '-')
                anchor = re.sub(r'[^\w\-]', '', anchor)
                heading_anchors.add(anchor)
        
        # Check each reference
        for anchor in set(anchor_refs):
            if anchor not in heading_anchors:
                issues.append({
                    'type': 'BROKEN_ANCHOR',
                    'severity': 'ERROR',
                    'message': f'Broken anchor link: #{anchor}'
                })
        
        return issues
    
    def test_findability(self, lines: List[str]) -> float:
        """Test how easy it is to find information"""
        score = 10.0
        
        # Count headings
        heading_count = sum(1 for line in lines if line.startswith('##'))
        total_lines = len(lines)
        
        if total_lines == 0:
            return 0.0
        
        # Ideal: 1 heading per 50-100 lines
        ideal_ratio = total_lines / 75
        actual_ratio = heading_count
        
        ratio_diff = abs(ideal_ratio - actual_ratio) / ideal_ratio if ideal_ratio > 0 else 1
        
        if ratio_diff > 0.5:
            score -= 3.0  # Too many or too few headings
        
        # Check for descriptive headings
        descriptive_count = 0
        for line in lines:
            if line.startswith('##'):
                heading = line.strip('#').strip()
                if len(heading.split()) >= 3:  # At least 3 words
                    descriptive_count += 1
        
        if heading_count > 0:
            descriptive_ratio = descriptive_count / heading_count
            if descriptive_ratio < 0.5:
                score -= 2.0  # Too many short, non-descriptive headings
        
        return max(0.0, min(10.0, score))
    
    def calculate_nav_score(self, issues: List[Dict], findability: float) -> float:
        """Calculate navigation score"""
        score = findability
        
        # Penalize for issues
        for issue in issues:
            if issue['severity'] == 'ERROR':
                score -= 2.0
            elif issue['severity'] == 'WARNING':
                score -= 1.0
        
        return max(0.0, min(10.0, score))
    
    def get_rating(self, score: float) -> str:
        """Convert score to rating"""
        if score >= 9.0:
            return "EXCELLENT"
        elif score >= 7.0:
            return "GOOD"
        elif score >= 5.0:
            return "FAIR"
        elif score >= 3.0:
            return "POOR"
        else:
            return "CRITICAL"
    
    def run_tests(self):
        """Run navigation tests on all files"""
        files = self.get_markdown_files()
        
        print(f"\n{'='*80}")
        print(f"NAVIGATION TESTER - Findability & Usability Check")
        print(f"{'='*80}\n")
        print(f"Files to test: {len(files)}\n")
        
        all_results = []
        
        for file_path in files:
            result = self.test_navigation(file_path)
            all_results.append(result)
            
            if 'error' in result:
                print(f"[ERROR] {result['file']}: {result['error']}")
                continue
            
            print(f"{result['file']}")
            print(f"  Navigation Score: {result['navigation_score']}/10 ({result['rating']})")
            print(f"  Findability: {result['findability_score']}/10")
            print(f"  Issues: {len(result['issues'])}")
            
            if result['issues']:
                for issue in result['issues'][:2]:
                    print(f"    - {issue['message']}")
        
        self.print_summary(all_results)
        return all_results
    
    def print_summary(self, results: List[Dict]):
        """Print summary of tests"""
        print(f"\n{'='*80}")
        print("SUMMARY")
        print(f"{'='*80}\n")
        
        valid_results = [r for r in results if 'error' not in r]
        
        if not valid_results:
            print("No valid results")
            return
        
        total_files = len(valid_results)
        avg_nav_score = sum(r['navigation_score'] for r in valid_results) / total_files
        avg_findability = sum(r['findability_score'] for r in valid_results) / total_files
        total_issues = sum(len(r['issues']) for r in valid_results)
        
        print(f"Files tested: {total_files}")
        print(f"Average navigation score: {round(avg_nav_score, 2)}/10")
        print(f"Average findability: {round(avg_findability, 2)}/10")
        print(f"Total navigation issues: {total_issues}\n")
        
        # Files with poor navigation
        poor_nav = [r for r in valid_results if r['navigation_score'] < 7.0]
        
        if poor_nav:
            print(f"Files needing navigation improvements ({len(poor_nav)}):")
            for result in sorted(poor_nav, key=lambda x: x['navigation_score'])[:10]:
                print(f"  - {result['file']}: {result['navigation_score']}/10 ({len(result['issues'])} issues)")
        else:
            print("All files have good navigation!")
        
        print()

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python navigation_tester.py <vault_directory>")
        sys.exit(1)
    
    tester = NavigationTester(sys.argv[1])
    tester.run_tests()
