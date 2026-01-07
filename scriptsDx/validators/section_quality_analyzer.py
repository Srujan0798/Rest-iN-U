#!/usr/bin/env python3
"""
Section Quality Analyzer
Divides files into top/middle/bottom sections and analyzes quality of each
Detects quality degradation throughout files
"""

import sys
from pathlib import Path
from typing import List, Dict, Tuple

class SectionQualityAnalyzer:
    def __init__(self, vault_dir: str):
        self.vault_dir = Path(vault_dir)
        
    def get_markdown_files(self) -> List[Path]:
        """Get all markdown files"""
        return sorted(self.vault_dir.rglob("*.md"))
    
    def divide_into_sections(self, lines: List[str]) -> Dict[str, Tuple[int, int]]:
        """Divide file into top, middle, bottom sections"""
        total = len(lines)
        
        # Define section boundaries
        top_end = min(total // 3, 100000)  # First third or 100k lines
        middle_start = top_end
        middle_end = min(2 * total // 3, total - 100000)  # Second third
        bottom_start = middle_end
        
        return {
            'top': (0, top_end),
            'middle': (middle_start, middle_end),
            'bottom': (bottom_start, total)
        }
    
    def analyze_section(self, lines: List[str], start: int, end: int, section_name: str) -> Dict:
        """Analyze quality of a specific section"""
        section_lines = lines[start:end]
        
        if not section_lines:
            return {
                'section': section_name,
                'lines': 0,
                'quality_score': 0,
                'issues': []
            }
        
        issues = []
        quality_metrics = {
            'heading_count': 0,
            'code_block_count': 0,
            'list_count': 0,
            'link_count': 0,
            'empty_lines': 0,
            'content_lines': 0,
            'warning_markers': 0,
            'quality_issues': 0
        }
        
        in_code_block = False
        
        for i, line in enumerate(section_lines):
            actual_line = start + i + 1
            
            # Count empty lines
            if not line.strip():
                quality_metrics['empty_lines'] += 1
                continue
            
            quality_metrics['content_lines'] += 1
            
            # Track code blocks
            if line.strip().startswith('```'):
                in_code_block = not in_code_block
                quality_metrics['code_block_count'] += 1
            
            if in_code_block:
                continue
            
            # Count headings
            if line.startswith('#'):
                quality_metrics['heading_count'] += 1
                
                # Check heading quality
                if not line.startswith('# ') and not line.startswith('##'):
                    issues.append({
                        'line': actual_line,
                        'type': 'MALFORMED_HEADING',
                        'severity': 'WARNING',
                        'message': 'Heading missing space after #'
                    })
                    quality_metrics['quality_issues'] += 1
            
            # Count lists
            if line.strip().startswith(('-', '*', '+')):
                quality_metrics['list_count'] += 1
            
            # Count links
            if '[' in line and '](' in line:
                quality_metrics['link_count'] += 1
            
            # Check for quality warning markers
            warning_markers = ['TODO', 'FIXME', 'XXX', 'HACK', 'COMING SOON', 'TBD']
            line_upper = line.upper()
            for marker in warning_markers:
                if marker in line_upper:
                    quality_metrics['warning_markers'] += 1
                    issues.append({
                        'line': actual_line,
                        'type': 'QUALITY_MARKER',
                        'severity': 'INFO',
                        'message': f'Quality marker found: {marker}'
                    })
            
            # Check for excessive empty lines (3+ in a row)
            if i > 2:
                prev_lines = section_lines[i-3:i]
                if all(not l.strip() for l in prev_lines) and not line.strip():
                    issues.append({
                        'line': actual_line,
                        'type': 'EXCESSIVE_WHITESPACE',
                        'severity': 'INFO',
                        'message': '4+ consecutive empty lines'
                    })
                    quality_metrics['quality_issues'] += 1
        
        # Calculate quality score (0-10)
        quality_score = self.calculate_quality_score(quality_metrics, len(section_lines))
        
        return {
            'section': section_name,
            'lines': len(section_lines),
            'range': f"{start + 1}-{end}",
            'quality_score': round(quality_score, 2),
            'metrics': quality_metrics,
            'issues': issues,
            'rating': self.get_rating(quality_score)
        }
    
    def calculate_quality_score(self, metrics: Dict, total_lines: int) -> float:
        """Calculate quality score based on metrics"""
        score = 10.0
        
        # Penalize for quality issues
        if metrics['quality_issues'] > 0:
            score -= min(3.0, metrics['quality_issues'] * 0.1)
        
        # Penalize for warning markers
        if metrics['warning_markers'] > 0:
            score -= min(2.0, metrics['warning_markers'] * 0.2)
        
        # Penalize for too many empty lines (>40% empty)
        if total_lines > 0:
            empty_ratio = metrics['empty_lines'] / total_lines
            if empty_ratio > 0.4:
                score -= (empty_ratio - 0.4) * 10
        
        # Penalize for lack of structure (very few headings)
        if total_lines > 100 and metrics['heading_count'] < 3:
            score -= 2.0
        
        # Bonus for good structure
        if metrics['heading_count'] > 5 and metrics['code_block_count'] > 0:
            score += 0.5
        
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
    
    def analyze_file(self, file_path: Path) -> Dict:
        """Analyze all sections of a file"""
        try:
            content = file_path.read_text(encoding='utf-8')
            lines = content.split('\n')
            
            sections = self.divide_into_sections(lines)
            
            results = {
                'file': file_path.name,
                'total_lines': len(lines),
                'sections': {}
            }
            
            for section_name, (start, end) in sections.items():
                section_result = self.analyze_section(lines, start, end, section_name)
                results['sections'][section_name] = section_result
            
            # Check for quality degradation
            top_score = results['sections']['top']['quality_score']
            middle_score = results['sections']['middle']['quality_score']
            bottom_score = results['sections']['bottom']['quality_score']
            
            degradation = []
            if middle_score < top_score - 1.0:
                degradation.append("Middle section quality degraded")
            if bottom_score < top_score - 1.0:
                degradation.append("Bottom section quality degraded")
            if bottom_score < middle_score - 1.0:
                degradation.append("Quality declining toward end")
            
            results['quality_degradation'] = degradation
            results['average_quality'] = round((top_score + middle_score + bottom_score) / 3, 2)
            results['overall_rating'] = self.get_rating(results['average_quality'])
            
            return results
            
        except Exception as e:
            return {'file': file_path.name, 'error': str(e)}
    
    def run_analysis(self):
        """Run analysis on all files"""
        files = self.get_markdown_files()
        
        print(f"\n{'='*80}")
        print(f"SECTION QUALITY ANALYZER - Top/Middle/Bottom Verification")
        print(f"{'='*80}\n")
        print(f"Files to analyze: {len(files)}\n")
        
        all_results = []
        
        for file_path in files:
            print(f"\n{''*80}")
            print(f"File: {file_path.name}")
            print(f"{''*80}")
            
            result = self.analyze_file(file_path)
            all_results.append(result)
            
            if 'error' in result:
                print(f"[ERROR] {result['error']}")
                continue
            
            print(f"Total lines: {result['total_lines']}")
            print(f"Overall quality: {result['average_quality']}/10 ({result['overall_rating']})\n")
            
            # Print section details
            for section_name in ['top', 'middle', 'bottom']:
                section = result['sections'][section_name]
                section_range = section.get('range', f"{section.get('lines', 0)} lines")
                print(f"{section_name.upper()} Section (lines {section_range}):")
                print(f"  Quality: {section.get('quality_score', 0)}/10 ({section.get('rating', 'N/A')})")
                print(f"  Lines: {section.get('lines', 0)}")
                print(f"  Headings: {section.get('metrics', {}).get('heading_count', 0)}")
                print(f"  Code blocks: {section.get('metrics', {}).get('code_block_count', 0)}")
                print(f"  Issues: {len(section.get('issues', []))}")
            
            # Print degradation warnings
            if result['quality_degradation']:
                print(f"\n[!] QUALITY DEGRADATION DETECTED:")
                for warning in result['quality_degradation']:
                    print(f"    - {warning}")
        
        self.print_summary(all_results)
        return all_results
    
    def print_summary(self, results: List[Dict]):
        """Print summary of all analyses"""
        print(f"\n{'='*80}")
        print("SUMMARY")
        print(f"{'='*80}\n")
        
        valid_results = [r for r in results if 'error' not in r]
        
        if not valid_results:
            print("No valid results to summarize")
            return
        
        # Overall statistics
        total_files = len(valid_results)
        avg_quality = sum(r['average_quality'] for r in valid_results) / total_files
        
        print(f"Files analyzed: {total_files}")
        print(f"Average quality: {round(avg_quality, 2)}/10\n")
        
        # Files with degradation
        degraded = [r for r in valid_results if r['quality_degradation']]
        print(f"Files with quality degradation: {len(degraded)}")
        if degraded:
            for result in degraded:
                print(f"  - {result['file']}")
                for warning in result['quality_degradation']:
                    print(f"      {warning}")
        
        # Quality distribution
        print("\nQuality Distribution:")
        ratings = {}
        for result in valid_results:
            rating = result['overall_rating']
            ratings[rating] = ratings.get(rating, 0) + 1
        
        for rating in ["EXCELLENT", "GOOD", "FAIR", "POOR", "CRITICAL"]:
            count = ratings.get(rating, 0)
            if count > 0:
                print(f"  {rating}: {count} files")
        
        print()

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python section_quality_analyzer.py <vault_directory>")
        sys.exit(1)
    
    analyzer = SectionQualityAnalyzer(sys.argv[1])
    analyzer.run_analysis()
