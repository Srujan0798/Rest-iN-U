#!/usr/bin/env python3
"""
Random Spot Checker
Performs random quality checks throughout files to ensure consistency
Prevents surface-level checking by validating random sections
"""

import sys
import random
from pathlib import Path
from typing import List, Dict, Tuple

class RandomSpotChecker:
    def __init__(self, vault_dir: str):
        self.vault_dir = Path(vault_dir)
        self.issues = []
        self.spot_checks_per_file = 20  # Number of random spots to check
        
    def get_markdown_files(self) -> List[Path]:
        """Get all markdown files"""
        return sorted(self.vault_dir.rglob("*.md"))
    
    def check_random_spots(self, file_path: Path) -> Dict:
        """Check random spots in a file for quality"""
        try:
            content = file_path.read_text(encoding='utf-8')
            lines = content.split('\n')
            total_lines = len(lines)
            
            if total_lines < 10:
                return {'file': file_path.name, 'skipped': True, 'reason': 'Too short'}
            
            # Generate random line numbers
            random_lines = sorted(random.sample(range(total_lines), 
                                               min(self.spot_checks_per_file, total_lines)))
            
            spot_issues = []
            quality_scores = []
            
            for line_num in random_lines:
                line = lines[line_num]
                score, issues = self.analyze_line_quality(line, line_num + 1, lines)
                quality_scores.append(score)
                spot_issues.extend(issues)
            
            avg_quality = sum(quality_scores) / len(quality_scores) if quality_scores else 0
            
            return {
                'file': file_path.name,
                'total_lines': total_lines,
                'spots_checked': len(random_lines),
                'random_lines': random_lines,
                'average_quality': round(avg_quality, 2),
                'issues_found': len(spot_issues),
                'issues': spot_issues,
                'quality_rating': self.get_quality_rating(avg_quality)
            }
            
        except Exception as e:
            return {'file': file_path.name, 'error': str(e)}
    
    def analyze_line_quality(self, line: str, line_num: int, all_lines: List[str]) -> Tuple[float, List[Dict]]:
        """Analyze quality of a single line and surrounding context"""
        issues = []
        quality_score = 10.0  # Start with perfect score
        
        # Check 1: Formatting issues
        if line.strip():
            # Inconsistent heading markers
            if line.startswith('#'):
                if '##' in line and not line.startswith('##'):
                    issues.append({
                        'line': line_num,
                        'type': 'INCONSISTENT_HEADING',
                        'severity': 'WARNING',
                        'message': 'Heading markers not at start'
                    })
                    quality_score -= 1.0
            
            # Trailing whitespace
            if line.endswith(' ') or line.endswith('\t'):
                issues.append({
                    'line': line_num,
                    'type': 'TRAILING_WHITESPACE',
                    'severity': 'INFO',
                    'message': 'Line has trailing whitespace'
                })
                quality_score -= 0.5
            
            # Mixed list markers
            if line.strip().startswith(('-', '*', '+')):
                # Check context for consistency
                context_start = max(0, line_num - 5)
                context_end = min(len(all_lines), line_num + 5)
                context = all_lines[context_start:context_end]
                
                list_markers = set()
                for ctx_line in context:
                    if ctx_line.strip().startswith(('-', '*', '+')):
                        list_markers.add(ctx_line.strip()[0])
                
                if len(list_markers) > 1:
                    issues.append({
                        'line': line_num,
                        'type': 'MIXED_LIST_MARKERS',
                        'severity': 'WARNING',
                        'message': f'Mixed list markers in context: {list_markers}'
                    })
                    quality_score -= 1.5
        
        # Check 2: Content quality indicators
        # Generic phrases that indicate low-quality content
        generic_phrases = [
            'lorem ipsum',
            'todo',
            'fixme',
            'coming soon',
            'to be added',
            'placeholder',
            '???',
            'test test'
        ]
        
        line_lower = line.lower()
        for phrase in generic_phrases:
            if phrase in line_lower:
                issues.append({
                    'line': line_num,
                    'type': 'LOW_QUALITY_CONTENT',
                    'severity': 'WARNING',
                    'message': f'Generic placeholder detected: "{phrase}"'
                })
                quality_score -= 2.0
        
        # Check 3: Broken markdown
        # Unclosed code blocks in context
        if '```' in line:
            context_start = max(0, line_num - 20)
            context_end = min(len(all_lines), line_num + 20)
            context = all_lines[context_start:context_end]
            
            code_fence_count = sum(1 for l in context if '```' in l)
            if code_fence_count % 2 != 0:
                issues.append({
                    'line': line_num,
                    'type': 'UNCLOSED_CODE_BLOCK',
                    'severity': 'ERROR',
                    'message': 'Odd number of code fences in context'
                })
                quality_score -= 3.0
        
        # Ensure score doesn't go below 0
        quality_score = max(0.0, quality_score)
        
        return quality_score, issues
    
    def get_quality_rating(self, score: float) -> str:
        """Convert numeric score to quality rating"""
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
    
    def run_all_checks(self):
        """Run random spot checks on all files"""
        files = self.get_markdown_files()
        results = []
        
        print(f"\n{'='*80}")
        print(f"RANDOM SPOT CHECKER - Deep Quality Verification")
        print(f"{'='*80}\n")
        print(f"Files to check: {len(files)}")
        print(f"Spots per file: {self.spot_checks_per_file}")
        print(f"Total spot checks: {len(files) * self.spot_checks_per_file}\n")
        
        for file_path in files:
            print(f"Checking: {file_path.name}...", end=' ')
            result = self.check_random_spots(file_path)
            results.append(result)
            
            if 'error' in result:
                print(f"[ERROR]")
            elif result.get('skipped'):
                print(f"[SKIPPED]")
            else:
                quality = result['quality_rating']
                issues = result['issues_found']
                print(f"[{quality}] - {issues} issues")
        
        self.print_summary(results)
        return results
    
    def print_summary(self, results: List[Dict]):
        """Print summary of all spot checks"""
        print(f"\n{'='*80}")
        print("SUMMARY")
        print(f"{'='*80}\n")
        
        total_files = len(results)
        total_spots = sum(r.get('spots_checked', 0) for r in results)
        total_issues = sum(r.get('issues_found', 0) for r in results)
        
        # Quality distribution
        quality_dist = {}
        for result in results:
            if 'quality_rating' in result:
                rating = result['quality_rating']
                quality_dist[rating] = quality_dist.get(rating, 0) + 1
        
        print(f"Files checked: {total_files}")
        print(f"Total spot checks: {total_spots}")
        print(f"Total issues found: {total_issues}\n")
        
        print("Quality Distribution:")
        for rating in ["EXCELLENT", "GOOD", "FAIR", "POOR", "CRITICAL"]:
            count = quality_dist.get(rating, 0)
            if count > 0:
                print(f"  {rating}: {count} files")
        
        # Files needing attention
        print("\nFiles Needing Attention:")
        needs_attention = [r for r in results 
                          if r.get('quality_rating') in ['POOR', 'CRITICAL']]
        
        if needs_attention:
            for result in needs_attention:
                print(f"  - {result['file']}: {result['quality_rating']} "
                      f"({result['issues_found']} issues)")
        else:
            print("  None - All files in good condition!")
        
        print()

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python random_spot_checker.py <vault_directory>")
        sys.exit(1)
    
    checker = RandomSpotChecker(sys.argv[1])
    checker.run_all_checks()
