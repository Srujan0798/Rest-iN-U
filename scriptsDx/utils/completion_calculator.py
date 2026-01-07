#!/usr/bin/env python3
"""
Completion Calculator
Calculates accurate completion percentage based on multiple criteria
Prevents false "100% complete" claims
"""

import sys
from pathlib import Path
from typing import Dict, List

class CompletionCalculator:
    def __init__(self, vault_dir: str):
        self.vault_dir = Path(vault_dir)
        
        # Completion criteria weights
        self.criteria_weights = {
            'structure_valid': 15,      # Proper heading hierarchy
            'formatting_correct': 15,    # No formatting errors
            'toc_complete': 10,          # Table of contents accurate
            'no_warnings': 15,           # Zero warnings
            'quality_score': 20,         # Content quality (24k+ gold)
            'links_valid': 10,           # All links work
            'sections_complete': 15      # All sections finished
        }
    
    def get_markdown_files(self) -> List[Path]:
        """Get all markdown files"""
        return sorted(self.vault_dir.rglob("*.md"))
    
    def check_structure(self, file_path: Path) -> float:
        """Check if structure is valid (0-100)"""
        try:
            content = file_path.read_text(encoding='utf-8')
            lines = content.split('\n')
            
            # Check heading hierarchy
            prev_level = 0
            skipped_levels = 0
            total_headings = 0
            
            for line in lines:
                if line.startswith('#'):
                    total_headings += 1
                    level = len(line.split()[0])
                    
                    if level > prev_level + 1:
                        skipped_levels += 1
                    
                    prev_level = level
            
            if total_headings == 0:
                return 50.0  # No headings is concerning
            
            # Calculate score
            error_rate = skipped_levels / total_headings
            return max(0, 100 - (error_rate * 100))
            
        except:
            return 0.0
    
    def check_formatting(self, file_path: Path) -> float:
        """Check if formatting is correct (0-100)"""
        try:
            content = file_path.read_text(encoding='utf-8')
            lines = content.split('\n')
            
            errors = 0
            total_lines = len(lines)
            
            for line in lines:
                # Check for common formatting errors
                if line.endswith(' ') or line.endswith('\t'):
                    errors += 1  # Trailing whitespace
                
                if line.startswith('#') and not line.startswith('# ') and len(line) > 1:
                    if line[1] != '#':
                        errors += 1  # Malformed heading
            
            if total_lines == 0:
                return 0.0
            
            error_rate = errors / total_lines
            return max(0, 100 - (error_rate * 1000))  # Amplify error impact
            
        except:
            return 0.0
    
    def check_toc(self, file_path: Path) -> float:
        """Check if TOC is complete (0-100)"""
        try:
            content = file_path.read_text(encoding='utf-8')
            
            # Simple check: does file have a TOC section?
            has_toc = 'table of contents' in content.lower() or '## contents' in content.lower()
            
            if has_toc:
                return 100.0
            else:
                # Check if file is short enough to not need TOC
                if len(content.split('\n')) < 100:
                    return 100.0  # Short files don't need TOC
                return 0.0  # Long file missing TOC
                
        except:
            return 0.0
    
    def check_warnings(self, file_path: Path) -> float:
        """Check for warning markers (0-100)"""
        try:
            content = file_path.read_text(encoding='utf-8')
            content_upper = content.upper()
            
            warning_markers = ['TODO', 'FIXME', 'XXX', 'HACK', 'TBD', 'COMING SOON']
            
            warning_count = sum(content_upper.count(marker) for marker in warning_markers)
            
            if warning_count == 0:
                return 100.0
            elif warning_count <= 3:
                return 70.0
            elif warning_count <= 10:
                return 40.0
            else:
                return 0.0
                
        except:
            return 0.0
    
    def check_quality(self, file_path: Path) -> float:
        """Check content quality (0-100)"""
        try:
            content = file_path.read_text(encoding='utf-8')
            
            # Simple quality indicators
            has_code_blocks = '```' in content
            has_lists = any(line.strip().startswith(('-', '*', '+')) for line in content.split('\n'))
            has_links = '[' in content and '](' in content
            
            # Check for depth indicators
            depth_terms = ['implementation', 'architecture', 'production', 'debugging', 
                          'optimization', 'performance', 'best practice']
            depth_count = sum(1 for term in depth_terms if term in content.lower())
            
            score = 0
            if has_code_blocks:
                score += 25
            if has_lists:
                score += 25
            if has_links:
                score += 25
            score += min(25, depth_count * 5)
            
            return score
            
        except:
            return 0.0
    
    def check_links(self, file_path: Path) -> float:
        """Check if links are valid (0-100)"""
        try:
            content = file_path.read_text(encoding='utf-8')
            
            # Count links
            import re
            link_pattern = re.compile(r'\[([^\]]+)\]\(([^\)]+)\)')
            links = link_pattern.findall(content)
            
            if not links:
                return 100.0  # No links = no broken links
            
            # Simple check: are links properly formatted?
            broken = 0
            for text, url in links:
                if not url or url.strip() == '':
                    broken += 1
            
            if broken == 0:
                return 100.0
            else:
                return max(0, 100 - (broken / len(links) * 100))
                
        except:
            return 0.0
    
    def check_sections_complete(self, file_path: Path) -> float:
        """Check if all sections are complete (0-100)"""
        try:
            content = file_path.read_text(encoding='utf-8')
            
            # Check for incomplete markers
            incomplete_markers = ['...', 'TBD', 'COMING SOON', '[Insert', 'TODO']
            
            incomplete_count = sum(content.count(marker) for marker in incomplete_markers)
            
            if incomplete_count == 0:
                return 100.0
            elif incomplete_count <= 2:
                return 75.0
            elif incomplete_count <= 5:
                return 50.0
            else:
                return 25.0
                
        except:
            return 0.0
    
    def calculate_file_completion(self, file_path: Path) -> Dict:
        """Calculate completion percentage for a file"""
        criteria_scores = {
            'structure_valid': self.check_structure(file_path),
            'formatting_correct': self.check_formatting(file_path),
            'toc_complete': self.check_toc(file_path),
            'no_warnings': self.check_warnings(file_path),
            'quality_score': self.check_quality(file_path),
            'links_valid': self.check_links(file_path),
            'sections_complete': self.check_sections_complete(file_path)
        }
        
        # Calculate weighted average
        total_weighted_score = 0
        total_weight = 0
        
        for criterion, score in criteria_scores.items():
            weight = self.criteria_weights[criterion]
            total_weighted_score += score * weight
            total_weight += weight
        
        completion_percentage = total_weighted_score / total_weight if total_weight > 0 else 0
        
        return {
            'file': file_path.name,
            'completion_percentage': round(completion_percentage, 2),
            'criteria_scores': {k: round(v, 2) for k, v in criteria_scores.items()},
            'status': self.get_status(completion_percentage)
        }
    
    def get_status(self, percentage: float) -> str:
        """Get status based on completion percentage"""
        if percentage >= 99:
            return "COMPLETE"
        elif percentage >= 90:
            return "NEARLY COMPLETE"
        elif percentage >= 70:
            return "MOSTLY COMPLETE"
        elif percentage >= 50:
            return "HALF COMPLETE"
        elif percentage >= 25:
            return "IN PROGRESS"
        else:
            return "JUST STARTED"
    
    def run_calculation(self):
        """Calculate completion for all files"""
        files = self.get_markdown_files()
        
        print(f"\n{'='*80}")
        print(f"COMPLETION CALCULATOR - Honest Metrics")
        print(f"{'='*80}\n")
        print(f"Files to analyze: {len(files)}\n")
        
        results = []
        
        for file_path in files:
            result = self.calculate_file_completion(file_path)
            results.append(result)
            
            print(f"{result['file']}: {result['completion_percentage']}% ({result['status']})")
        
        self.print_summary(results)
        return results
    
    def print_summary(self, results: List[Dict]):
        """Print summary of completion"""
        print(f"\n{'='*80}")
        print("SUMMARY")
        print(f"{'='*80}\n")
        
        total_files = len(results)
        avg_completion = sum(r['completion_percentage'] for r in results) / total_files if total_files > 0 else 0
        
        print(f"Total Files: {total_files}")
        print(f"Average Completion: {round(avg_completion, 2)}%\n")
        
        # Status distribution
        status_dist = {}
        for result in results:
            status = result['status']
            status_dist[status] = status_dist.get(status, 0) + 1
        
        print("Status Distribution:")
        for status in ["COMPLETE", "NEARLY COMPLETE", "MOSTLY COMPLETE", "HALF COMPLETE", "IN PROGRESS", "JUST STARTED"]:
            count = status_dist.get(status, 0)
            if count > 0:
                print(f"  {status}: {count} files")
        
        # Honest assessment
        print(f"\nHONEST ASSESSMENT:")
        if avg_completion >= 99:
            print("  [OK] Project is TRULY COMPLETE")
        elif avg_completion >= 90:
            print("  [WARN]  Project is NEARLY complete - final touches needed")
        elif avg_completion >= 70:
            print("  [WARN]  Project is MOSTLY complete - some work remaining")
        elif avg_completion >= 50:
            print("  [WARN]  Project is HALF complete - significant work remaining")
        elif avg_completion >= 25:
            print("  [FAIL] Project is IN PROGRESS - much work remaining")
        else:
            print("  [FAIL] Project is JUST STARTED - extensive work needed")
        
        print()

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python completion_calculator.py <vault_directory>")
        sys.exit(1)
    
    calculator = CompletionCalculator(sys.argv[1])
    calculator.run_calculation()
