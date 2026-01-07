#!/usr/bin/env python3
"""
Flow Analyzer
Checks logical content flow and progression
Ensures intro -> body -> conclusion structure
"""

import sys
import re
from pathlib import Path
from typing import List, Dict

class FlowAnalyzer:
    def __init__(self, vault_dir: str):
        self.vault_dir = Path(vault_dir)
    
    def get_markdown_files(self) -> List[Path]:
        """Get all markdown files"""
        return sorted(self.vault_dir.rglob("*.md"))
    
    def analyze_flow(self, file_path: Path) -> Dict:
        """Analyze content flow of a file"""
        try:
            content = file_path.read_text(encoding='utf-8')
            lines = content.split('\n')
            
            issues = []
            
            # Check 1: Does file have introduction?
            has_intro = self.check_introduction(content)
            if not has_intro:
                issues.append({
                    'type': 'MISSING_INTRODUCTION',
                    'severity': 'WARNING',
                    'message': 'File lacks clear introduction section'
                })
            
            # Check 2: Does file have conclusion?
            has_conclusion = self.check_conclusion(content)
            if not has_conclusion and len(lines) > 100:
                issues.append({
                    'type': 'MISSING_CONCLUSION',
                    'severity': 'INFO',
                    'message': 'File lacks conclusion or summary section'
                })
            
            # Check 3: Check heading progression
            heading_issues = self.check_heading_progression(lines)
            issues.extend(heading_issues)
            
            # Check 4: Check for abrupt topic changes
            topic_issues = self.check_topic_flow(content)
            issues.extend(topic_issues)
            
            # Calculate flow score
            flow_score = self.calculate_flow_score(has_intro, has_conclusion, issues)
            
            return {
                'file': file_path.name,
                'has_introduction': has_intro,
                'has_conclusion': has_conclusion,
                'flow_score': flow_score,
                'issues': issues,
                'rating': self.get_rating(flow_score)
            }
            
        except Exception as e:
            return {'file': file_path.name, 'error': str(e)}
    
    def check_introduction(self, content: str) -> bool:
        """Check if file has introduction"""
        intro_markers = [
            'introduction', 'overview', 'what is', 'about', 
            'getting started', 'purpose', 'objective'
        ]
        
        # Check first 500 characters
        first_part = content[:500].lower()
        
        return any(marker in first_part for marker in intro_markers)
    
    def check_conclusion(self, content: str) -> bool:
        """Check if file has conclusion"""
        conclusion_markers = [
            'conclusion', 'summary', 'recap', 'final', 
            'in summary', 'to summarize', 'wrapping up'
        ]
        
        # Check last 500 characters
        last_part = content[-500:].lower()
        
        return any(marker in last_part for marker in conclusion_markers)
    
    def check_heading_progression(self, lines: List[str]) -> List[Dict]:
        """Check if headings progress logically"""
        issues = []
        headings = []
        
        for i, line in enumerate(lines):
            if line.startswith('##'):
                heading_text = line.strip('#').strip().lower()
                headings.append((i + 1, heading_text))
        
        # Check for repeated headings
        seen_headings = set()
        for line_num, heading in headings:
            if heading in seen_headings:
                issues.append({
                    'line': line_num,
                    'type': 'REPEATED_HEADING',
                    'severity': 'WARNING',
                    'message': f'Heading "{heading}" appears multiple times'
                })
            seen_headings.add(heading)
        
        return issues
    
    def check_topic_flow(self, content: str) -> List[Dict]:
        """Check for abrupt topic changes"""
        issues = []
        
        # Split into sections
        sections = content.split('\n##')
        
        if len(sections) < 2:
            return issues
        
        # Check each transition
        for i in range(len(sections) - 1):
            current_section = sections[i]
            next_section = sections[i + 1]
            
            # Check if sections are related (simple keyword overlap)
            current_words = set(re.findall(r'\w+', current_section.lower()))
            next_words = set(re.findall(r'\w+', next_section.lower()))
            
            # Remove common words
            common_words = {'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for'}
            current_words -= common_words
            next_words -= common_words
            
            # Calculate overlap
            if current_words and next_words:
                overlap = len(current_words & next_words) / min(len(current_words), len(next_words))
                
                if overlap < 0.1:  # Less than 10% overlap
                    issues.append({
                        'type': 'ABRUPT_TOPIC_CHANGE',
                        'severity': 'INFO',
                        'message': f'Possible abrupt topic change between sections {i+1} and {i+2}'
                    })
        
        return issues
    
    def calculate_flow_score(self, has_intro: bool, has_conclusion: bool, issues: List[Dict]) -> float:
        """Calculate flow score (0-10)"""
        score = 10.0
        
        if not has_intro:
            score -= 2.0
        
        if not has_conclusion:
            score -= 1.0
        
        # Penalize for issues
        for issue in issues:
            if issue['severity'] == 'ERROR':
                score -= 2.0
            elif issue['severity'] == 'WARNING':
                score -= 1.0
            elif issue['severity'] == 'INFO':
                score -= 0.5
        
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
    
    def run_analysis(self):
        """Run analysis on all files"""
        files = self.get_markdown_files()
        
        print(f"\n{'='*80}")
        print(f"FLOW ANALYZER - Logical Progression Check")
        print(f"{'='*80}\n")
        print(f"Files to analyze: {len(files)}\n")
        
        all_results = []
        
        for file_path in files:
            result = self.analyze_flow(file_path)
            all_results.append(result)
            
            if 'error' in result:
                print(f"[ERROR] {result['file']}: {result['error']}")
                continue
            
            intro_symbol = '[OK]' if result['has_introduction'] else '[FAIL]'
            conclusion_symbol = '[OK]' if result['has_conclusion'] else '[FAIL]'
            
            print(f"{result['file']}")
            print(f"  Flow Score: {result['flow_score']}/10 ({result['rating']})")
            print(f"  Introduction: {intro_symbol}")
            print(f"  Conclusion: {conclusion_symbol}")
            print(f"  Issues: {len(result['issues'])}")
            
            if result['issues']:
                for issue in result['issues'][:2]:
                    print(f"    - {issue['message']}")
        
        self.print_summary(all_results)
        return all_results
    
    def print_summary(self, results: List[Dict]):
        """Print summary of analysis"""
        print(f"\n{'='*80}")
        print("SUMMARY")
        print(f"{'='*80}\n")
        
        valid_results = [r for r in results if 'error' not in r]
        
        if not valid_results:
            print("No valid results")
            return
        
        total_files = len(valid_results)
        avg_score = sum(r['flow_score'] for r in valid_results) / total_files
        
        files_with_intro = sum(1 for r in valid_results if r['has_introduction'])
        files_with_conclusion = sum(1 for r in valid_results if r['has_conclusion'])
        
        print(f"Files analyzed: {total_files}")
        print(f"Average flow score: {round(avg_score, 2)}/10")
        print(f"Files with introduction: {files_with_intro}/{total_files}")
        print(f"Files with conclusion: {files_with_conclusion}/{total_files}\n")
        
        # Files needing improvement
        poor_flow = [r for r in valid_results if r['flow_score'] < 7.0]
        
        if poor_flow:
            print(f"Files needing flow improvement ({len(poor_flow)}):")
            for result in sorted(poor_flow, key=lambda x: x['flow_score'])[:10]:
                print(f"  - {result['file']}: {result['flow_score']}/10")
        else:
            print("All files have good flow!")
        
        print()

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python flow_analyzer.py <vault_directory>")
        sys.exit(1)
    
    analyzer = FlowAnalyzer(sys.argv[1])
    analyzer.run_analysis()
