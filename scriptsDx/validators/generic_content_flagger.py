#!/usr/bin/env python3
"""
Generic Content Flagger
Detects AI-generated generic content that "every AI can do"
Flags surface-level content that doesn't meet quality standards
"""

import sys
import re
from pathlib import Path
from typing import List, Dict

class GenericContentFlagger:
    def __init__(self, vault_dir: str):
        self.vault_dir = Path(vault_dir)
        
        # Generic patterns that indicate AI-generated content
        self.generic_patterns = {
            'tutorial_phrases': [
                'in this tutorial', 'let\'s get started', 'first, we need to',
                'next, we will', 'finally, we can', 'it\'s that simple',
                'as you can see', 'now you know how to'
            ],
            'filler_phrases': [
                'it is important to note', 'it should be noted that',
                'as mentioned earlier', 'as we discussed', 'keep in mind that',
                'remember that', 'don\'t forget to', 'make sure to'
            ],
            'vague_statements': [
                'there are many ways', 'you can also', 'another option is',
                'alternatively', 'depending on your needs', 'it depends',
                'in some cases', 'sometimes', 'usually', 'typically'
            ],
            'basic_examples': [
                'hello world', 'foo', 'bar', 'baz', 'example', 'sample',
                'test', 'demo', 'placeholder', 'lorem ipsum'
            ],
            'generic_advice': [
                'best practice', 'it is recommended', 'you should',
                'always', 'never', 'make sure', 'be careful',
                'pay attention', 'take note'
            ]
        }
        
        # Indicators of real developer knowledge
        self.quality_indicators = [
            'production', 'edge case', 'gotcha', 'pitfall', 'caveat',
            'under the hood', 'implementation detail', 'race condition',
            'memory leak', 'performance bottleneck', 'real-world',
            'in practice', 'debugging', 'troubleshooting', 'root cause'
        ]
    
    def get_markdown_files(self) -> List[Path]:
        """Get all markdown files"""
        return sorted(self.vault_dir.rglob("*.md"))
    
    def flag_generic_content(self, file_path: Path) -> Dict:
        """Flag generic content in a file"""
        try:
            content = file_path.read_text(encoding='utf-8')
            lines = content.split('\n')
            content_lower = content.lower()
            
            flags = []
            
            # Check for generic patterns
            for category, patterns in self.generic_patterns.items():
                for pattern in patterns:
                    count = content_lower.count(pattern)
                    if count > 0:
                        # Find line numbers
                        for i, line in enumerate(lines):
                            if pattern in line.lower():
                                flags.append({
                                    'line': i + 1,
                                    'category': category,
                                    'pattern': pattern,
                                    'severity': 'WARNING',
                                    'message': f'Generic {category.replace("_", " ")}: "{pattern}"'
                                })
            
            # Check for quality indicators
            quality_count = sum(content_lower.count(indicator) for indicator in self.quality_indicators)
            
            # Calculate generic content ratio
            total_flags = len(flags)
            generic_ratio = total_flags / len(lines) if lines else 0
            
            # Calculate quality score
            quality_score = self.calculate_quality_score(total_flags, quality_count, len(lines))
            
            return {
                'file': file_path.name,
                'total_flags': total_flags,
                'generic_ratio': round(generic_ratio * 100, 2),
                'quality_indicators': quality_count,
                'quality_score': quality_score,
                'flags': flags,
                'rating': self.get_rating(quality_score)
            }
            
        except Exception as e:
            return {'file': file_path.name, 'error': str(e)}
    
    def calculate_quality_score(self, flags: int, quality_indicators: int, total_lines: int) -> float:
        """Calculate quality score (0-10)"""
        score = 10.0
        
        # Penalize for generic content
        if total_lines > 0:
            generic_ratio = flags / total_lines
            score -= min(5.0, generic_ratio * 100)
        
        # Bonus for quality indicators
        if quality_indicators > 0:
            score += min(2.0, quality_indicators * 0.2)
        
        return max(0.0, min(10.0, score))
    
    def get_rating(self, score: float) -> str:
        """Convert score to rating"""
        if score >= 9.0:
            return "EXCELLENT - Real developer knowledge"
        elif score >= 7.0:
            return "GOOD - Mostly quality content"
        elif score >= 5.0:
            return "FAIR - Some generic content"
        elif score >= 3.0:
            return "POOR - Too much generic content"
        else:
            return "CRITICAL - Mostly AI-generated generic content"
    
    def run_flagging(self):
        """Run flagging on all files"""
        files = self.get_markdown_files()
        
        print(f"\n{'='*80}")
        print(f"GENERIC CONTENT FLAGGER - AI Content Detection")
        print(f"{'='*80}\n")
        print(f"Files to analyze: {len(files)}\n")
        
        all_results = []
        
        for file_path in files:
            result = self.flag_generic_content(file_path)
            all_results.append(result)
            
            if 'error' in result:
                print(f"[ERROR] {result['file']}: {result['error']}")
                continue
            
            print(f"{result['file']}")
            print(f"  Quality Score: {result['quality_score']}/10 ({result['rating']})")
            print(f"  Generic Flags: {result['total_flags']} ({result['generic_ratio']}% of lines)")
            print(f"  Quality Indicators: {result['quality_indicators']}")
            
            if result['total_flags'] > 10:
                print(f"  [!] HIGH generic content detected")
                # Show top categories
                categories = {}
                for flag in result['flags']:
                    cat = flag['category']
                    categories[cat] = categories.get(cat, 0) + 1
                
                print(f"  Top categories:")
                for cat, count in sorted(categories.items(), key=lambda x: x[1], reverse=True)[:3]:
                    print(f"    - {cat.replace('_', ' ')}: {count}")
        
        self.print_summary(all_results)
        return all_results
    
    def print_summary(self, results: List[Dict]):
        """Print summary of flagging"""
        print(f"\n{'='*80}")
        print("SUMMARY")
        print(f"{'='*80}\n")
        
        valid_results = [r for r in results if 'error' not in r]
        
        if not valid_results:
            print("No valid results")
            return
        
        total_files = len(valid_results)
        avg_quality = sum(r['quality_score'] for r in valid_results) / total_files
        total_flags = sum(r['total_flags'] for r in valid_results)
        
        print(f"Files analyzed: {total_files}")
        print(f"Average quality score: {round(avg_quality, 2)}/10")
        print(f"Total generic content flags: {total_flags}\n")
        
        # Rating distribution
        ratings = {}
        for result in valid_results:
            rating = result['rating'].split(' - ')[0]
            ratings[rating] = ratings.get(rating, 0) + 1
        
        print("Quality Distribution:")
        for rating in ["EXCELLENT", "GOOD", "FAIR", "POOR", "CRITICAL"]:
            count = ratings.get(rating, 0)
            if count > 0:
                print(f"  {rating}: {count} files")
        
        # Files needing rewrite
        poor_quality = [r for r in valid_results if r['quality_score'] < 5.0]
        
        if poor_quality:
            print(f"\nFiles needing content rewrite ({len(poor_quality)}):")
            for result in sorted(poor_quality, key=lambda x: x['quality_score'])[:10]:
                print(f"  - {result['file']}: {result['quality_score']}/10 "
                      f"({result['total_flags']} generic flags)")
        else:
            print("\nAll files have quality content!")
        
        print()

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python generic_content_flagger.py <vault_directory>")
        sys.exit(1)
    
    flagger = GenericContentFlagger(sys.argv[1])
    flagger.run_flagging()
